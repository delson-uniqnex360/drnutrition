
import asyncio
import json
import re
from pathlib import Path
from datetime import datetime, timezone
from urllib.parse import urljoin

from playwright.async_api import async_playwright

URL = "https://drnutrition.com/en-ae/laperva-keto-cola-cola-box-of-24-pieces"

OUTPUT_FILE = Path("product-extracted.json")


async def extract_product(url):

    async with async_playwright() as p:

        browser = await p.chromium.launch(headless=False)

        page = await browser.new_page(
            viewport={"width": 1440, "height": 1100},
            locale="en-AE"
        )

        try:
            response = await page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=90000
            )

            await page.wait_for_timeout(4000)

            status = response.status if response else None

            # Detect Cloudflare block
            title = await page.title()
            body_text = await page.locator("body").inner_text()

            if (
                status in (403, 429)
                or "Attention Required! | Cloudflare" in title
                or "Sorry, you have been blocked" in body_text
            ):
                print("Cloudflare blocked the request.")
                print("No product data was extracted.")
                return

            # Scroll to load lazy content
            await page.evaluate("""
                async () => {
                    const sleep = ms =>
                        new Promise(resolve => setTimeout(resolve, ms));

                    const height = document.body.scrollHeight;

                    for (let y = 0; y < height; y += 500) {
                        window.scrollTo(0, y);
                        await sleep(200);
                    }

                    window.scrollTo(0, 0);
                }
            """)

            await page.wait_for_timeout(1500)

            # ------------------------------------------------
            # Extract product-related content
            # ------------------------------------------------

            product = await page.evaluate("""
                () => {

                    const clean = (value) =>
                        (value || "")
                            .replace(/\\\\s+/g, " ")
                            .trim();

                    const text = (selector) =>
                        clean(
                            document.querySelector(selector)?.innerText
                        );

                    const unique = (items) =>
                        [...new Set(items.filter(Boolean))];

                    // ------------------------------------------------
                    // JSON-LD extraction
                    // ------------------------------------------------

                    const jsonLd = [
                        ...document.querySelectorAll(
                            'script[type="application/ld+json"]'
                        )
                    ].flatMap(script => {
                        try {
                            const data = JSON.parse(script.textContent);
                            return Array.isArray(data) ? data : [data];
                        } catch {
                            return [];
                        }
                    });

                    const flatten = (items) => {
                        let result = [];

                        for (const item of items) {

                            if (!item || typeof item !== "object") {
                                continue;
                            }

                            const types = Array.isArray(item["@type"])
                                ? item["@type"]
                                : [item["@type"]];

                            if (types.includes("Product")) {
                                result.push(item);
                            }

                            if (Array.isArray(item)) {
                                result.push(...flatten(item));
                            }

                            if (item["@graph"]) {
                                result.push(...flatten(item["@graph"]));
                            }

                        }

                        return result;
                    };

                    const schemaProducts = flatten(jsonLd);

                    const schema = schemaProducts[0] || {};

                    // ------------------------------------------------
                    // Product name
                    // ------------------------------------------------

                    const name =
                        schema.name ||
                        text("h1") ||
                        null;

                    // ------------------------------------------------
                    // Brand
                    // ------------------------------------------------

                    const brand =
                        typeof schema.brand === "string"
                            ? schema.brand
                            : schema.brand?.name ||
                              clean(
                                  document.querySelector(
                                      '[class*="brand"]'
                                  )?.innerText
                              ) || null;

                    // ------------------------------------------------
                    // Price
                    // ------------------------------------------------

                    const offer = Array.isArray(schema.offers)
                        ? schema.offers[0]
                        : schema.offers || {};

                    const price =
                        offer.price ||
                        document.querySelector(
                            '[itemprop="price"]'
                        )?.content ||
                        null;

                    const currency =
                        offer.priceCurrency ||
                        document.querySelector(
                            '[itemprop="priceCurrency"]'
                        )?.content ||
                        null;

                    // ------------------------------------------------
                    // Breadcrumbs
                    // ------------------------------------------------

                    const breadcrumbs = unique(
                        [...document.querySelectorAll(
                            '[class*="breadcrumb"] a, ' +
                            'nav[aria-label*="breadcrumb"] a'
                        )].map(el => clean(el.innerText))
                    );

                    // ------------------------------------------------
                    // PRODUCT IMAGES
                    // ------------------------------------------------

                    const imageElements = [
                        ...document.querySelectorAll(
                            '[class*="product-gallery"] img, ' +
                            '[class*="product-image"] img, ' +
                            '[class*="product__media"] img, ' +
                            '[class*="gallery"] img, ' +
                            '[data-testid*="gallery"] img, ' +
                            '[data-testid*="product-image"] img'
                        )
                    ];

                    // Extract the best available image URL
                    const getImageUrl = (img) => {

                        const candidates = [
                            img.currentSrc,
                            img.getAttribute("data-src"),
                            img.getAttribute("data-lazy-src"),
                            img.getAttribute("data-original"),
                            img.getAttribute("src")
                        ];

                        for (const candidate of candidates) {

                            if (!candidate) continue;

                            try {
                                const url = new URL(
                                    candidate,
                                    location.href
                                );

                                if (
                                    url.protocol === "http:" ||
                                    url.protocol === "https:"
                                ) {
                                    return url.href;
                                }

                            } catch {
                                continue;
                            }
                        }

                        // Fallback: srcset
                        const srcset =
                            img.getAttribute("data-srcset") ||
                            img.getAttribute("srcset");

                        if (srcset) {

                            const candidates = srcset
                                .split(",")
                                .map(item => item.trim())
                                .filter(Boolean);

                            if (candidates.length) {

                                const largest = candidates[
                                    candidates.length - 1
                                ];

                                const src = largest
                                    .split(/\\\\s+/)[0];

                                try {
                                    return new URL(
                                        src,
                                        location.href
                                    ).href;
                                } catch {}
                            }
                        }

                        return null;
                    };

                    // Collect actual gallery images
                    const images = [];

                    imageElements.forEach(img => {

                        const imageUrl = getImageUrl(img);

                        if (!imageUrl) return;

                        // Avoid obvious non-product assets
                        if (
                            /logo|icon|flag|payment|banner/i.test(
                                imageUrl
                            )
                        ) {
                            return;
                        }

                        images.push({
                            url: imageUrl,
                            alt: clean(
                                img.getAttribute("alt")
                            ) || name || ""
                        });
                    });

                    // Remove duplicate image URLs
                    const uniqueImages = [
                        ...new Map(
                            images.map(img => [img.url, img])
                        ).values()
                    ];

                    // ------------------------------------------------
                    // JSON-LD image fallback
                    // ------------------------------------------------

                    if (uniqueImages.length === 0 && schema.image) {

                        const schemaImages = Array.isArray(schema.image)
                            ? schema.image
                            : [schema.image];

                        schemaImages.forEach(image => {

                            const imageUrl =
                                typeof image === "string"
                                    ? image
                                    : image?.url;

                            if (!imageUrl) return;

                            try {

                                const absoluteUrl = new URL(
                                    imageUrl,
                                    location.href
                                ).href;

                                uniqueImages.push({
                                    url: absoluteUrl,
                                    alt: name || ""
                                });

                            } catch {}

                        });
                    }

                    // ------------------------------------------------
                    // Product-focused sections
                    // ------------------------------------------------

                    const sections = {};

                    const sectionKeywords = [
                        "description",
                        "features",
                        "ingredients",
                        "nutrition",
                        "how to use",
                        "directions",
                        "health notes",
                        "warnings",
                        "benefits",
                        "specifications",
                        "product details",
                        "reviews"
                    ];

                    const headings = [
                        ...document.querySelectorAll("h2, h3, h4")
                    ];

                    headings.forEach(heading => {

                        const headingText = clean(
                            heading.innerText
                        );

                        if (!headingText) return;

                        const normalized =
                            headingText.toLowerCase();

                        if (!sectionKeywords.some(keyword =>
                            normalized.includes(keyword)
                        )) {
                            return;
                        }

                        let content = [];
                        let current = heading.nextElementSibling;

                        while (
                            current &&
                            !/^H[1-4]$/.test(current.tagName)
                        ) {

                            const value = clean(current.innerText);

                            if (value) {
                                content.push(value);
                            }

                            current = current.nextElementSibling;
                        }

                        if (content.length) {
                            sections[headingText] =
                                content.join("\\n");
                        }

                    });

                    // ------------------------------------------------
                    // Variant selectors
                    // ------------------------------------------------

                    const variants = [];

                    const variantElements = [
                        ...document.querySelectorAll(
                            'select, [class*="variant"], ' +
                            '[class*="option"], [class*="swatch"]'
                        )
                    ];

                    variantElements.forEach(el => {

                        const options = [];

                        if (el.tagName === "SELECT") {

                            [...el.options].forEach(option => {

                                if (option.value) {

                                    options.push({
                                        id: option.value,
                                        label: clean(option.innerText),
                                        selected: option.selected
                                    });

                                }

                            });

                        } else {

                            const children = [
                                ...el.querySelectorAll(
                                    'button, [role="option"], ' +
                                    '[role="radio"], a'
                                )
                            ];

                            children.forEach(child => {

                                const label = clean(
                                    child.innerText ||
                                    child.getAttribute("aria-label")
                                );

                                if (label) {

                                    options.push({
                                        label,
                                        selected:
                                            child.getAttribute(
                                                "aria-selected"
                                            ) === "true" ||
                                            child.getAttribute(
                                                "aria-checked"
                                            ) === "true"
                                    });

                                }

                            });

                        }

                        if (options.length) {

                            variants.push({
                                name:
                                    el.getAttribute("aria-label") ||
                                    clean(
                                        el.previousElementSibling?.innerText
                                    ) ||
                                    "Product options",
                                options
                            });

                        }

                    });

                    // ------------------------------------------------
                    // Availability
                    // ------------------------------------------------

                    const availability =
                        offer.availability ||
                        null;

                    // ------------------------------------------------
                    // Ratings
                    // ------------------------------------------------

                    const rating = schema.aggregateRating || {};

                    // ------------------------------------------------
                    // Reviews
                    // ------------------------------------------------

                    const reviews = [
                        ...document.querySelectorAll(
                            '[class*="review"], [itemprop="review"]'
                        )
                    ]
                    .map(el => clean(el.innerText))
                    .filter(value => value.length > 15)
                    .slice(0, 20);

                    // ------------------------------------------------
                    // Description
                    // ------------------------------------------------

                    const description =
                        schema.description ||
                        sections["Description"] ||
                        text('[class*="description"]') ||
                        null;

                    // ------------------------------------------------
                    // Related products
                    // ------------------------------------------------

                    const related = [
                        ...document.querySelectorAll(
                            '[class*="related"] a, ' +
                            '[class*="recommend"] a'
                        )
                    ]
                    .map(a => {

                        const image = a.querySelector("img");

                        const imageUrl = image
                            ? getImageUrl(image)
                            : null;

                        return {
                            name: clean(
                                a.innerText ||
                                image?.getAttribute("alt")
                            ),
                            href: a.href,
                            ...(imageUrl ? { image: imageUrl } : {})
                        };

                    })
                    .filter(item => item.name);

                    // ------------------------------------------------
                    // Final product object
                    // ------------------------------------------------

                    return {

                        pageUrl: location.href,

                        name,

                        brand,

                        breadcrumbs,

                        price,

                        currency,

                        availability,

                        description,

                        // Always an array of actual image objects
                        images: uniqueImages,

                        variants,

                        sections,

                        rating: {
                            average: rating.ratingValue || null,
                            count:
                                rating.reviewCount ||
                                rating.ratingCount ||
                                null
                        },

                        reviews,

                        related

                    };

                }
            """)

            # ------------------------------------------------
            # Save output
            # ------------------------------------------------

            result = {
                "extractedAt": datetime.now(
                    timezone.utc
                ).isoformat(),
                **product
            }

            OUTPUT_FILE.write_text(
                json.dumps(
                    result,
                    ensure_ascii=False,
                    indent=2
                ),
                encoding="utf-8"
            )

            print("\\nProduct extraction completed!")

            print("Product:", product["name"])

            print("Images:", len(product["images"]))

            for index, image in enumerate(
                product["images"],
                start=1
            ):
                print(f"Image {index}: {image['url']}")

            print("Variants:", len(product["variants"]))

            print("Reviews:", len(product["reviews"]))

            print("Related:", len(product["related"]))

            print("Output:", OUTPUT_FILE.resolve())

        finally:
            await browser.close()


if __name__ == "__main__":
    asyncio.run(extract_product(URL))
