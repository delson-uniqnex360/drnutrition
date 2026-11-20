import Link from "next/link";
import Image from "next/image";
import type { ProductCatalogItem } from "@/types/product";

function formatPrice(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getProductSlug(url: string) {
  try {
    return new URL(url).pathname.split("/").filter(Boolean).pop() || "";
  } catch {
    return "";
  }
}

export default function ProductCard({ item }: { item: ProductCatalogItem }) {
  const product = item.product;
  const title = product.name;
  const href = `/${getProductSlug(item.ProductURL)}`;

  const price = product.price;
  const original = product.originalPrice;
  const hasDiscount = original !== undefined && original > price;

  const discount =
    hasDiscount && original
      ? Math.round(((original - price) / original) * 100)
      : 0;

  const currency = product.currency || "AED";
  const rating = product.reviews?.average;
  const image = product.image;

  return (
    <article className="group relative flex h-full w-[220px] shrink-0 flex-col overflow-hidden rounded-md border border-gray-200 bg-white">
      {/* Badges */}
      <div className="absolute left-0 top-0 z-10 flex flex-col items-start gap-1">
        {product.offerLabel && (
          <span className="rounded-br-md bg-[#4b1a82] px-2 py-1 text-[11px] font-bold text-yellow-300">
            {product.offerLabel}
          </span>
        )}

        {hasDiscount && (
          <span className="rounded-br-md bg-[#7a9a1f] px-2 py-1 text-[11px] font-bold text-white">
            -{discount}%
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        type="button"
        aria-label="Add to wishlist"
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-white text-lg text-gray-500 shadow-sm transition hover:text-[#783781]"
      >
        ♡
      </button>

      {/* Image */}
      <Link href={href} className="relative block aspect-square bg-white p-3">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <Image
            src={image}
            alt={product.images?.[0]?.alt || title}
            fill
            sizes="220px"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded bg-gray-50 text-xs text-gray-400">
            No image
          </div>
        )}

        {rating !== undefined && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md border border-gray-100 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-700 shadow-sm">
            {rating}
            <span className="text-amber-400">★</span>
          </span>
        )}
      </Link>

      {/* Product information */}
      <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-2">
        <Link href={href}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-medium leading-5 text-gray-800 group-hover:text-[#783781]">
            {title}
          </h3>
        </Link>

        <p className="flex items-baseline gap-1.5">
          <span className="text-[10px] font-medium text-[#783781]">
            {currency}
          </span>

          <span className="text-base font-bold text-[#783781]">
            {formatPrice(price)}
          </span>

          {hasDiscount && original !== undefined && (
            <span className="text-[10px] text-gray-400 line-through">
              {formatPrice(original)}
            </span>
          )}
        </p>

        {/* Promotional section */}
        <div className="mt-auto flex min-h-[68px] flex-col gap-1.5">
          {hasDiscount && (
            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-[#2b0a12] to-[#5a1520] px-2.5 py-1.5 ring-1 ring-amber-400/70">
              <span className="flex items-center gap-1 text-[10px] font-bold text-white">
                <span className="text-amber-400">⚡</span>
                FLASH SALE
              </span>

              <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-bold text-gray-900">
                -{discount}% OFF
              </span>
            </div>
          )}

          {product.soldRecently && (
            <div className="text-center text-[10px] text-gray-500">
              {product.soldRecently}
            </div>
          )}
        </div>
      </div>

      {/* Add to cart */}
      <button
        type="button"
        disabled={!product.inStock}
        className="flex h-10 w-full items-center justify-center gap-2 bg-[#783781] text-sm font-semibold text-white transition hover:bg-purple-900 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
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

        {product.inStock ? "Add to Cart" : "Out of Stock"}
      </button>
    </article>
  );
}

/* Horizontal product list */
export function ProductRow({ products }: { products: ProductCatalogItem[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 [scrollbar-width:thin]">
      {products.map((item, index) => {
        if (!item?.product) {
          console.warn("Invalid product catalog item:", item);
          return null;
        }

        return (
          <ProductCard
            key={`${item.product.id ?? item.ProductURL ?? "product"}-${index}`}
            item={item}
          />
        );
      })}
    </div>
  );
}
