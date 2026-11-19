"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Product } from "@/types/product";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type VariantOption = {
  label?: string | null;
  image?: string | null;
};

type VariantGroup = {
  name?: string | null;
  options?: VariantOption[] | null;
};

type DetailProduct = Product & {
  BrandLogo?: string | null;
  Category?: string | null;
  Currency?: string | null;
  SoldRecently?: string | null;
  Variants?: VariantGroup[] | null;
};

type Props = {
  product: DetailProduct;
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function getText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const n =
    typeof value === "number"
      ? value
      : parseFloat(String(value).replace(/[^0-9.]/g, ""));

  return Number.isFinite(n) ? n : null;
}

function formatPrice(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatList(value: string): string[] {
  if (!value) return [];

  return value
    .split(/\r?\n/)
    .map((item) => item.replace(/^[\s•\-*]+/, "").trim())
    .filter(Boolean);
}

function formatParagraphs(value: string): string[] {
  if (!value) return [];

  return value
    .split(/\r?\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

function CartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6" />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.5 3.5A11.8 11.8 0 0 0 12 0 12 12 0 0 0 1.6 17.9L0 24l6.3-1.6A12 12 0 1 0 20.5 3.5zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm5.4-7.3c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1-.8.9-.9 1.1-.3.2-.6.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6a.6.6 0 0 0 0-.5l-.9-2.1c-.2-.5-.4-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.4 6.4 0 0 0 1.4 3.4 14.6 14.6 0 0 0 5.6 4.9c2.1.9 2.9.9 3.9.8a3.3 3.3 0 0 0 2.2-1.6 2.7 2.7 0 0 0 .2-1.6c-.1-.1-.3-.2-.6-.4z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Variant component                                                    */
/* ------------------------------------------------------------------ */

function VariantTile({
  option,
  selected,
  onSelect,
}: {
  option: VariantOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const label = getText(option.label);
  const image = getText(option.image);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex h-[90px] w-[76px] flex-col items-center justify-start gap-2 rounded-md border p-2 text-center transition ${
        selected
          ? "border-[#783781] bg-purple-50 text-[#783781]"
          : "border-gray-200 bg-white text-gray-600 hover:border-purple-300"
      }`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={label} className="h-10 w-10 object-contain" />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
          ▢
        </span>
      )}

      <span className="line-clamp-2 text-xs leading-4">
        {label || "Option"}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Main Product Detail                                                 */
/* ------------------------------------------------------------------ */

export default function ProductDetail({ product }: Props) {
  const title = getText(product.Title) || getText(product.productName) || "";

  const brand = getText(product.brandName);
  const brandLogo = getText(product.BrandLogo);
  const category = getText(product.Category);

  const description = getText(product.Description);
  const features = formatList(getText(product.Features));
  const specifications = getText(product.ProductSpecifications);

  const image = getText(product.ImageURL);
  const productUrl = getText(product.ProductURL);

  const soldRecently = getText(product.SoldRecently);
  const currency = getText(product.Currency) || "AED";

  const price = toNumber(product.Price);
  const original = toNumber(product.OriginalPrice);

  const hasDiscount = price !== null && original !== null && original > price;

  const discount = hasDiscount
    ? Math.round(((original - price) / original) * 100)
    : 0;

  /* Variants */

  const groups = useMemo(
    () =>
      (Array.isArray(product.Variants) ? product.Variants : []).filter(
        (g): g is VariantGroup =>
          !!g && Array.isArray(g.options) && g.options.length > 0,
      ),
    [product.Variants],
  );

  const [selected, setSelected] = useState<Record<number, number>>(() =>
    Object.fromEntries(groups.map((_, i) => [i, 0])),
  );

  const [tab, setTab] = useState<"description" | "details">("description");

  const doneCount = groups.filter((_, i) => selected[i] !== undefined).length;

  const progress = groups.length ? (doneCount / groups.length) * 100 : 0;

  /* WhatsApp */

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi, I want to order: ${title}`,
  )}`;

  const descriptionParagraphs = formatParagraphs(description);

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <main className="mx-auto max-w-[1450px] px-4 py-5 text-gray-800 md:px-6">
      {/* Breadcrumb */}

      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-xs text-gray-500"
      >
        <Link href="/" aria-label="Home" className="hover:text-[#783781]">
          ⌂
        </Link>

        <span>›</span>

        <span>{category || "Products"}</span>
      </nav>

      {/* Main Product Layout */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.35fr_0.8fr]">
        {/* ---------------------------------------------------------- */}
        {/* Product Image                                               */}
        {/* ---------------------------------------------------------- */}

        <section className="relative flex min-h-[320px] items-start justify-center lg:min-h-[480px]">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              className="max-h-[480px] w-full object-contain"
            />
          ) : (
            <div className="flex min-h-[300px] w-full items-center justify-center rounded-lg bg-gray-50 text-base text-gray-400">
              Product image not available
            </div>
          )}

          <button
            type="button"
            aria-label="Add to wishlist"
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white text-xl text-gray-400 shadow-sm hover:text-[#783781]"
          >
            ♡
          </button>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Product Information                                         */}
        {/* ---------------------------------------------------------- */}

        <section className="min-w-0">
          {/* Brand */}

          <div className="mb-5 flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-3">
            {brandLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandLogo}
                alt={brand}
                className="h-10 w-10 rounded-full object-contain"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-[10px] font-bold uppercase text-white">
                {brand ? brand.slice(0, 8) : "BRAND"}
              </span>
            )}

            <span className="text-sm text-gray-500">
              By{" "}
              <span className="font-medium text-gray-800 underline">
                {brand || "Unknown Brand"}
              </span>
            </span>

            <span className="ml-auto text-lg text-gray-400">›</span>
          </div>

          {/* Title */}

          <h1 className="text-2xl font-bold leading-snug text-gray-900">
            {title}
          </h1>

          {/* Category */}

          {category && (
            <span className="mt-4 inline-block rounded bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
              {category}
            </span>
          )}

          <div className="my-6 border-t border-gray-200" />

          {/* Variants */}

          {groups.length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Select Variants
                </h2>

                <div className="flex flex-1 items-center justify-end gap-3">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-[#783781] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <span className="text-xs text-gray-500">
                    {doneCount}/{groups.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {groups.map((group, gi) => {
                  const done = selected[gi] !== undefined;
                  const options = group.options ?? [];

                  return (
                    <div
                      key={gi}
                      className="relative overflow-hidden rounded-lg border border-[#783781] bg-white"
                    >
                      {/* Variant header */}

                      <div className="flex items-center gap-3 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-white px-3 py-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#783781] text-xs font-bold text-white">
                          {gi + 1}
                        </span>

                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#783781]">
                          {getText(group.name) || `Option ${gi + 1}`}
                        </span>

                        {done && (
                          <span className="flex shrink-0 items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs text-[#783781]">
                            <CheckIcon className="h-3 w-3" />
                            Done
                          </span>
                        )}
                      </div>

                      {/* Variant options */}

                      <div className="flex flex-wrap gap-3 p-3">
                        {options.map((option, oi) => (
                          <VariantTile
                            key={oi}
                            option={option}
                            selected={selected[gi] === oi}
                            onSelect={() =>
                              setSelected((prev) => ({
                                ...prev,
                                [gi]: oi,
                              }))
                            }
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fallback identifiers */}

          {groups.length === 0 &&
            (getText(product.SKU) || getText(product.MPN)) && (
              <dl className="grid grid-cols-2 gap-5 rounded-lg border border-gray-100 p-5">
                {getText(product.SKU) && (
                  <div>
                    <dt className="text-sm text-gray-500">SKU</dt>
                    <dd className="mt-1 break-words text-sm font-semibold text-gray-800">
                      {getText(product.SKU)}
                    </dd>
                  </div>
                )}

                {getText(product.MPN) && (
                  <div>
                    <dt className="text-sm text-gray-500">MPN</dt>
                    <dd className="mt-1 break-words text-sm font-semibold text-gray-800">
                      {getText(product.MPN)}
                    </dd>
                  </div>
                )}
              </dl>
            )}
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Right Side / Purchase Information                           */}
        {/* ---------------------------------------------------------- */}

        <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start">
          {/* Service Guarantees */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold uppercase text-gray-900">
              Service Guarantees
            </h2>

            <ul className="space-y-4 text-sm text-gray-600">
              {[
                "Easy and Hassle Free Returns",
                "Secure Payments",
                "In Stock - Fast Delivery",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-green-600">
                    <CheckIcon className="h-4 w-4" />
                  </span>

                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}

          {price !== null && (
            <div>
              <p className="text-3xl font-extrabold text-[#783781]">
                {currency} {formatPrice(price)}
              </p>

              {hasDiscount && (
                <p className="mt-2 flex items-center gap-3">
                  <span className="text-sm text-gray-400 line-through">
                    {currency} {formatPrice(original)}
                  </span>

                  <span className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-500">
                    {discount}% OFF
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Recently sold */}

          {soldRecently && (
            <p className="inline-flex items-center gap-2 rounded bg-gray-100 px-3 py-2 text-sm text-gray-600">
              <span className="text-green-600">
                <CartIcon className="h-4 w-4" />
              </span>

              {soldRecently}
            </p>
          )}

          <div className="border-t border-gray-200" />

          {/* Purchase buttons */}

          <div className="space-y-3">
            <button
              type="button"
              className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#783781] to-[#5b2a63] text-sm font-bold uppercase text-white shadow-md transition hover:opacity-90"
            >
              <CartIcon />
              Add to Cart
            </button>

            {whatsappNumber ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#25d366] to-[#128c7e] text-sm font-bold text-white shadow-md transition hover:opacity-90"
              >
                <WhatsAppIcon />
                Order By Whatsapp
              </a>
            ) : productUrl ? (
              <a
                href={productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-[#783781] text-sm font-bold text-[#783781] transition hover:bg-purple-50"
              >
                View Original Product ↗
              </a>
            ) : null}
          </div>
        </aside>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Description and Product Details Tabs                            */}
      {/* -------------------------------------------------------------- */}

      <section className="mt-12 border-t border-gray-200">
        {/* Tabs */}

        <div
          role="tablist"
          aria-label="Product information"
          className="flex flex-wrap items-center gap-3 border-b border-gray-200 py-4"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "description"}
            onClick={() => setTab("description")}
            className={`flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${
              tab === "description"
                ? "bg-purple-50 text-[#783781]"
                : "text-gray-600 hover:text-[#783781]"
            }`}
          >
            ▤ Description
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === "details"}
            onClick={() => setTab("details")}
            className={`flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${
              tab === "details"
                ? "bg-purple-50 text-[#783781]"
                : "text-gray-600 hover:text-[#783781]"
            }`}
          >
            ⓘ Product Details
          </button>
        </div>

        {/* Description tab */}

        {tab === "description" ? (
          <div className="max-w-[1100px] space-y-10 py-8 text-base leading-7 text-gray-700">
            {/* Product description */}

            <div>
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                What's in the product?
              </h3>

              {descriptionParagraphs.length > 0 ? (
                <div className="space-y-4">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p key={index} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No description available.</p>
              )}
            </div>

            {/* Features */}

            <div>
              <h3 className="mb-4 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                Features of {title}
              </h3>

              {features.length > 0 ? (
                <ul className="list-disc space-y-3 pl-6 text-base leading-7">
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No features available.</p>
              )}

              {productUrl && (
                <p className="mt-5 text-sm">
                  For Supplement facts and direction of use please click{" "}
                  <a
                    href={productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#783781] underline"
                  >
                    Here
                  </a>
                </p>
              )}
            </div>

            {/* Specifications */}

            <div>
              <h3 className="mb-4 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                Product Specifications
              </h3>

              {specifications ? (
                <p className="whitespace-pre-line">{specifications}</p>
              ) : (
                <p className="text-gray-400">No specifications available.</p>
              )}
            </div>
          </div>
        ) : (
          /* Product Details tab */

          <div className="max-w-[1100px] space-y-6 py-8 text-base leading-7 text-gray-700">
            <h3 className="border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
              Product Specifications
            </h3>

            {specifications ? (
              <p className="whitespace-pre-line">{specifications}</p>
            ) : (
              <p className="text-gray-400">No specifications available.</p>
            )}

            {(getText(product.SKU) || getText(product.MPN) || brand) && (
              <dl className="grid grid-cols-1 gap-5 rounded-lg border border-gray-100 p-5 sm:grid-cols-3">
                {[
                  ["Brand", brand],
                  ["SKU", getText(product.SKU)],
                  ["MPN", getText(product.MPN)],
                ]
                  .filter(([, value]) => Boolean(value))
                  .map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-sm text-gray-500">{label}</dt>

                      <dd className="mt-1 break-words text-base font-semibold text-gray-800">
                        {value}
                      </dd>
                    </div>
                  ))}
              </dl>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
