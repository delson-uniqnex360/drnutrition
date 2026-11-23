"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/* Types – this is the shape you pass to the component                 */
/* ------------------------------------------------------------------ */

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductVariantOption {
  id: string | number;
  label: string;
  image?: string;
  href?: string;
  disabled?: boolean;

  // Per-variant overrides
  name?: string;
  price?: number;
  originalPrice?: number;
  discountPercentage?: number;
  offerLabel?: string;
  images?: ProductImage[];

  // Variant-specific attributes
  details?: { label: string; value: string }[];

  // Variant-specific nutrition
  nutrition?: NutritionFacts;
}

export interface ProductCategory {
  name: string;
  href: string;
}

export interface ProductVariantGroup {
  name: string; // "Size", "Flavor"
  options: ProductVariantOption[];
  selectedId: string | number;
}

export interface NutritionRow {
  name: string; // "Creatine Monohydrate"
  amount: string; // "5000mg"
  dv?: string; // "**" | "12%"
  indent?: boolean;
}

export interface NutritionFacts {
  size: string; // "300 Gm"
  flavor?: string; // "Unflavored"
  servingSize: string; // "1 Scoop (~5g)"
  servingsPerContainer: string | number;
  rows: NutritionRow[];
  ingredients?: string;
}

export interface ProductReview {
  id: string | number;
  author: string;
  rating: number;
  date?: string;
  title?: string;
  comment: string;
}

export interface ProductCardData {
  id: string | number;
  name: string;
  href: string;
  image: string;
  price: number;
  originalPrice?: number;
  currency: string;
  discountPercentage?: number;
  rating?: number;
  express?: boolean;
  offerLabel?: string;
  offerHref?: string;
}

export interface ProductDetailData {
  id: string | number;
  name: string;
  brand?: { name: string; href: string; image?: string };
  breadcrumbs: { name: string; href: string }[];
  // Actual product categories
  categories?: ProductCategory[];
  tags?: string[]; // grey pills under the title
  image?: string;
  images: ProductImage[];
  express?: boolean;
  variants?: ProductVariantGroup[];
  price: number;
  originalPrice?: number;
  currency: string; // "AED"
  discountPercentage?: number;
  inStock: boolean;
  soldRecently?: string; // "82+ sold recently"
  offerLabel?: string;
  descriptionHtml?: string;
  howToUseHtml?: string;
  healthNotesHtml?: string;
  details?: { label: string; value: string }[]; // "Product Details" tab
  nutrition?: NutritionFacts;
  reviews?: {
    average: number;
    count: number;
    breakdown?: Record<1 | 2 | 3 | 4 | 5, number>; // count per star
    items: ProductReview[];
  };
  related?: ProductCardData[];
  similar?: ProductCardData[];
  guarantees?: string[];
  whatsappUrl?: string;
}

export interface ProductDetailProps {
  product: ProductDetailData;
  labels?: Partial<typeof defaultLabels>;
  onAddToCart?: (product: ProductDetailData, qty: number) => void;
  onAddRelatedToCart?: (item: ProductCardData) => void;
  onWriteReview?: () => void;
  onToggleWishlist?: (id: string | number, active: boolean) => void;
  onFulfilmentChange?: (mode: "delivery" | "pickup") => void;
}

export const defaultLabels = {
  size: "Size",
  delivery: "Delivery",
  pickup: "Store pickup",
  deliveryHint: "Ship to your address with standard or express delivery.",
  pickupHint: "Choose a branch below to add this item for store pickup.",
  addToCart: "ADD TO CART",
  addToCartShort: "Add to Cart",
  whatsapp: "Order By Whatsapp",
  description: "Description",
  howToUse: "How to Use",
  healthNotes: "Health Notes",
  productDetails: "Product Details",
  nutritionFacts: "Nutrition Facts",
  servingSize: "Serving Size",
  servingsPerContainer: "Servings Per Container",
  amountPerServing: "Amount Per Serving",
  ingredients: "Ingredients:",
  customerReviews: "Customer Reviews",
  ratings: "ratings",
  writeReview: "Write a Review",
  noReviews: "No reviews yet. Be the first to review this product!",
  relatedProducts: "Related Products",
  similarProducts: "Similar Products",
  serviceGuarantees: "Service Guarantees",
  express: "Express",
};

const DEFAULT_GUARANTEES = [
  "Easy and Hassle Free Returns",
  "Secure Payments",
  "In Stock - Fast Delivery",
];

/* ------------------------------------------------------------------ */
/* Small helpers / icons                                               */
/* ------------------------------------------------------------------ */

const cx = (...c: (string | false | undefined | null)[]) =>
  c.filter(Boolean).join(" ");

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Svg = ({
  children,
  className = "w-5 h-5",
  fill = "none",
  sw = 2,
}: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const IconStar = ({ className = "w-5 h-5", filled = false, color }: any) => (
  <Svg className={className} fill={filled ? "currentColor" : "none"}>
    <path
      style={color ? { color } : undefined}
      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
    />
  </Svg>
);

const IconHeart = ({ className = "w-5 h-5" }: any) => (
  <Svg className={className} sw={1.5}>
    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
  </Svg>
);

const IconCart = ({ className = "w-5 h-5" }: any) => (
  <Svg className={className}>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </Svg>
);

const IconTruck = ({ className = "w-4 h-4" }: any) => (
  <Svg className={className}>
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </Svg>
);

const IconStore = ({ className = "w-4 h-4" }: any) => (
  <Svg className={className}>
    <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" />
    <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" />
    <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" />
  </Svg>
);

const IconChevronRight = ({ className = "w-4 h-4" }: any) => (
  <Svg className={className}>
    <path d="m9 18 6-6-6-6" />
  </Svg>
);

const IconHome = ({ className = "w-4 h-4" }: any) => (
  <Svg className={className}>
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </Svg>
);

const IconBack = ({ className = "w-5 h-5" }: any) => (
  <Svg className={className}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </Svg>
);

const IconShare = ({ className = "w-5 h-5" }: any) => (
  <Svg className={className}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </Svg>
);

const IconFile = ({ className = "w-4 h-4" }: any) => (
  <Svg className={className}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </Svg>
);

const IconBook = ({ className = "w-4 h-4" }: any) => (
  <Svg className={className}>
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </Svg>
);

const IconInfo = ({ className = "w-4 h-4" }: any) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </Svg>
);

const IconWhatsapp = ({ className = "w-5 h-5" }: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const IconExpress = ({ className = "w-3.5 h-3" }: any) => (
  <svg viewBox="0 0 14 12" fill="none" className={className} aria-hidden="true">
    <path
      d="M1 1h6.5a1 1 0 0 1 1 1v6.2M8.5 3.2h2l2 3v2a.8.8 0 0 1-.8.8h-.9M8.4 9H5.9M3.5 4.8H1M4.7 3H1"
      stroke="#fff"
      strokeWidth="0.9"
      strokeLinecap="round"
    />
    <circle cx="4.1" cy="9.2" r="1.1" stroke="#fff" strokeWidth="0.9" />
    <circle cx="9.9" cy="9.2" r="1.1" stroke="#fff" strokeWidth="0.9" />
  </svg>
);

const ExpressBadge = ({ label, small }: { label: string; small?: boolean }) => (
  <span
    className={cx(
      "text-white font-medium flex items-center gap-1",
      small
        ? "text-xs px-2 py-1 rounded-full"
        : "text-sm px-3 py-1.5 rounded-lg shadow-sm",
    )}
    style={{
      background:
        "linear-gradient(180deg, var(--color-primary,#723881), #0D0D80)",
    }}
  >
    <IconExpress className={small ? "w-3.5 h-3" : "w-4 h-3.5"} />
    {label}
  </span>
);

/* ------------------------------------------------------------------ */
/* Stars                                                               */
/* ------------------------------------------------------------------ */

const Stars = ({
  value,
  size = "w-5 h-5",
}: {
  value: number;
  size?: string;
}) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <IconStar
        key={i}
        className={cx(size, i <= Math.round(value) ? "" : "text-gray-300")}
        filled={i <= Math.round(value)}
        color={i <= Math.round(value) ? "#FFD700" : undefined}
      />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

function Gallery({
  images,
  express,
  expressLabel,
  productId,
  onToggleWishlist,
}: {
  images: ProductImage[];
  express?: boolean;
  expressLabel: string;
  productId: string | number;
  onToggleWishlist?: (id: string | number, active: boolean) => void;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [images]);

  const [wish, setWish] = useState(false);
  const startX = useRef<number | null>(null);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const go = (i: number) =>
    setIndex(Math.max(0, Math.min(images.length - 1, i)));

  return (
    <div className="relative lg:sticky lg:top-6 lg:self-start">
      <div
        className="relative w-full h-80 sm:h-96 lg:h-[500px] rounded-lg overflow-hidden group lg:cursor-crosshair"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({
            x: ((e.clientX - r.left) / r.width) * 100,
            y: ((e.clientY - r.top) / r.height) * 100,
          });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        {express && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
              <ExpressBadge label={expressLabel} />
            </div>
          </div>
        )}

        <div
          className="h-full overflow-hidden touch-pan-y"
          onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (startX.current === null) return;
            const dx = e.changedTouches[0].clientX - startX.current;
            if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
            startX.current = null;
          }}
        >
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{ transform: `translate3d(-${index * 100}%,0,0)` }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                className="relative flex-[0_0_100%] min-w-0 h-full bg-white"
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? `Product image ${i + 1}`}
                  fill
                  priority={i === 0}
                  draggable={false}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain pointer-events-none select-none transition-transform duration-200 lg:group-hover:scale-[1.8]"
                  style={
                    zoom && i === index
                      ? { transformOrigin: `${zoom.x}% ${zoom.y}%` }
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => {
            setWish(!wish);
            onToggleWishlist?.(productId, !wish);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg flex items-center justify-center hover:bg-[color:var(--color-primary,#723881)]/10 hover:scale-110 transition-all duration-300 z-10 active:scale-95 border border-gray-100"
        >
          <IconHeart
            className={cx(
              "w-5 h-5 transition-all duration-300",
              wish
                ? "text-red-500 fill-red-500"
                : "text-gray-400 hover:text-red-500",
            )}
          />
        </button>
      </div>

      {/* mobile dots */}
      {images.length > 1 && (
        <div className="lg:hidden flex justify-center mt-3">
          <div
            className="flex justify-center items-center gap-1.5 px-3 py-2 rounded-full bg-gray-100/90"
            role="tablist"
            aria-label="Product images"
          >
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-label={`Product image ${i + 1}`}
                aria-selected={i === index}
                onClick={() => go(i)}
                className={cx(
                  "rounded-full transition-all duration-300 ease-out shrink-0 h-1.5",
                  i === index
                    ? "w-5 bg-gray-900 shadow-sm"
                    : "w-1.5 bg-gray-300 hover:bg-gray-400",
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* desktop thumbs */}
      {images.length > 1 && (
        <div className="hidden lg:flex gap-2 mt-4 py-0.5">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Product image ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className={cx(
                "relative block w-16 h-16 rounded-lg border box-border transition-all duration-200 shrink-0",
                i === index
                  ? "border-[color:var(--color-primary,#723881)] opacity-100"
                  : "border-gray-200 opacity-75 hover:opacity-100 hover:border-gray-300",
              )}
            >
              <div className="absolute inset-px overflow-hidden rounded-[7px] bg-white">
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Nutrition facts                                                     */
/* ------------------------------------------------------------------ */

function NutritionPanel({
  data,
  L,
}: {
  data: NutritionFacts;
  L: typeof defaultLabels;
}) {
  return (
    <div className="bg-white border p-1">
      <div className="bg-white border p-1">
        <div className="px-2 pt-1 pb-2">
          <div
            className="text-2xl font-bold leading-tight"
            style={{ fontSize: 26, letterSpacing: 0.5 }}
          >
            {L.nutritionFacts}
          </div>
          <div className="text-base leading-tight mt-1 flex justify-between">
            <span className="font-bold">{data.size}</span>
            {data.flavor && <span className="font-bold">{data.flavor}</span>}
          </div>
        </div>
        <div className="px-2 pb-1 border-b-[5px] border-black">
          <div className="text-xs leading-tight">
            <span>{L.servingSize}</span> {data.servingSize}
          </div>
          <div className="text-xs leading-tight">
            <span>{L.servingsPerContainer}</span> {data.servingsPerContainer}
          </div>
        </div>
        <div className="px-2 overflow-x-auto max-h-[400px]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-xs font-bold text-left py-0.5 border-b border-black" />
                <th className="text-xs font-bold text-right py-0.5 border-b border-black min-w-[60px]">
                  {L.amountPerServing}
                </th>
                <th className="text-xs font-bold text-right py-0.5 border-b border-black min-w-[60px] pl-4">
                  DV%
                </th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r, i) => (
                <tr key={i}>
                  <td
                    className={cx(
                      "text-xs leading-tight py-0.5",
                      r.indent && "pl-3",
                    )}
                  >
                    {r.name}
                  </td>
                  <td className="text-xs text-right leading-tight py-0.5 min-w-[60px]">
                    {r.amount}
                  </td>
                  <td className="text-xs text-right leading-tight py-0.5 min-w-[60px] pl-4">
                    {r.dv ?? "**"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.ingredients && (
          <div className="px-2 pt-1 pb-1 border-t-2 border-black">
            <div className="text-xs font-bold mb-0.5">{L.ingredients}</div>
            <div className="text-xs leading-tight" style={{ fontSize: 10 }}>
              {data.ingredients}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Product card + carousel                                             */
/* ------------------------------------------------------------------ */

export function ProductCard({
  p,
  L,
  onAdd,
}: {
  p: ProductCardData;
  L: typeof defaultLabels;
  onAdd?: (p: ProductCardData) => void;
}) {
  const [wish, setWish] = useState(false);
  return (
    <div className="bg-white rounded-md border-t border-l border-r border-gray-100 relative max-w-[320px] h-full flex flex-col">
      <div className="flex-1">
        <div className="relative mb-2">
          <Link href={p.href} className="block no-underline">
            <div className="relative w-full h-52 flex items-center justify-center overflow-hidden border-b border-gray-100">
              <Image
                src={p.image}
                alt={p.name}
                width={200}
                height={200}
                className="object-contain w-full h-full"
              />
            </div>
          </Link>
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={() => setWish(!wish)}
            className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full shadow-md hover:shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 z-20 active:scale-95 border border-gray-100"
          >
            <IconHeart
              className={cx(
                "w-4 h-4",
                wish ? "text-red-500 fill-red-500" : "text-gray-500",
              )}
            />
          </button>
          <div className="absolute top-1 left-1 flex flex-col gap-1">
            {!!p.discountPercentage && (
              <span
                className="text-white text-xs font-medium px-2 py-1 rounded w-fit"
                style={{ background: "var(--color-discount,#E11D48)" }}
              >
                -{p.discountPercentage}%
              </span>
            )}
          </div>
          {p.express && (
            <div className="absolute bottom-2 left-2">
              <ExpressBadge label={L.express} small />
            </div>
          )}
          {!!p.rating && (
            <div className="absolute bottom-2 right-2">
              <div className="flex items-center gap-1.5 rounded-lg text-xs px-2 py-1 bg-white shadow z-10">
                <span className="font-semibold text-gray-900">{p.rating}</span>
                <IconStar
                  className="w-3.5 h-3.5 shrink-0"
                  filled
                  color="var(--color-rating-filled,#FFB400)"
                />
              </div>
            </div>
          )}
        </div>
        <h3 className="text-gray-800 font-medium text-sm mb-1 line-clamp-2 leading-tight px-1.5">
          {p.name}
        </h3>
        <div className="mb-2 px-1.5">
          <div className="flex items-baseline flex-wrap gap-x-1 gap-y-0.5">
            <span
              className="text-[10px] font-medium"
              style={{ color: "var(--color-accent,#A9C838)" }}
            >
              {p.currency}
            </span>
            <span
              className="font-bold text-base tabular-nums leading-none"
              style={{ color: "var(--color-accent,#A9C838)" }}
            >
              {fmt(p.price)}
            </span>
            {p.originalPrice && (
              <span className="text-gray-400 text-[10px] line-through tabular-nums leading-none">
                {fmt(p.originalPrice)}
              </span>
            )}
          </div>
          {p.offerLabel && (
            <Link
              href={p.offerHref ?? "#"}
              title={p.offerLabel}
              className="mt-1 inline-block text-white text-xs font-semibold px-2 py-1 rounded w-fit max-w-full truncate hover:opacity-90"
              style={{ background: "var(--color-primary,#723881)" }}
            >
              {p.offerLabel}
            </Link>
          )}
        </div>
      </div>
      <div className="border-t border-gray-100 min-h-[40px]">
        <button
          type="button"
          onClick={() => onAdd?.(p)}
          className="w-full h-10 text-white font-medium text-sm px-4 rounded-b-md flex items-center justify-center gap-2 transition-colors hover:opacity-90"
          style={{ background: "var(--color-accent,#A9C838)" }}
        >
          <IconCart className="w-4 h-4" />
          <span>{L.addToCartShort}</span>
        </button>
      </div>
    </div>
  );
}

function Carousel({
  title,
  items,
  L,
  tint,
  onAdd,
}: {
  title: string;
  items: ProductCardData[];
  L: typeof defaultLabels;
  tint?: boolean;
  onAdd?: (p: ProductCardData) => void;
}) {
  if (!items.length) return null;
  return (
    <section className={cx("mt-6", tint ? "bg-gray-50" : "bg-white")}>
      <div className="px-4 py-1">
        <h2 className="font-bold text-lg text-gray-900">{title}</h2>
      </div>
      <div className="py-4 pl-4">
        <div
          className="flex gap-2 overflow-x-auto snap-x scrollbar-hide pr-4 pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((p) => (
            <div
              key={p.id}
              className="snap-start shrink-0 w-40 sm:w-48 lg:w-52 !h-auto"
            >
              <ProductCard p={p} L={L} onAdd={onAdd} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

function Reviews({
  data,
  L,
  onWrite,
}: {
  data?: ProductDetailData["reviews"];
  L: typeof defaultLabels;
  onWrite?: () => void;
}) {
  const avg = data?.average ?? 0;
  const count = data?.count ?? 0;
  const items = data?.items ?? [];
  const primary = "var(--color-primary,#723881)";
  return (
    <div className="bg-white border-t border-gray-200">
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {L.customerReviews}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col items-start">
            <div className="text-6xl font-bold mb-3" style={{ color: primary }}>
              {avg.toFixed(1)}
            </div>
            <div className="mb-4">
              <Stars value={avg} />
            </div>
            <div className="text-base" style={{ color: primary }}>
              {count} {L.ratings}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-3">
            {([5, 4, 3, 2, 1] as const).map((s) => {
              const n = data?.breakdown?.[s] ?? 0;
              const pct = count ? (n / count) * 100 : 0;
              return (
                <div key={s} className="w-full flex items-center gap-3">
                  <div className="flex items-center gap-2 min-w-[60px]">
                    <span
                      className="text-base font-medium"
                      style={{ color: primary }}
                    >
                      {s}
                    </span>
                    <IconStar className="w-5 h-5" filled color="#FFD700" />
                  </div>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: primary }}
                    />
                  </div>
                  <span
                    className="text-base font-medium min-w-[50px] text-right"
                    style={{ color: primary }}
                  >
                    {pct.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-6">
            <button
              type="button"
              onClick={onWrite}
              className="group relative w-full py-4 px-6 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(114,56,129,.15) 0%, rgba(114,56,129,.1) 100%)",
                border: "2px solid rgba(114,56,129,.3)",
                boxShadow: "0 2px 8px rgba(114,56,129,.15)",
              }}
            >
              <span
                className="relative z-10 text-base font-bold flex items-center justify-center gap-2.5"
                style={{ color: primary }}
              >
                <IconStar className="w-5 h-5" filled />
                {L.writeReview}
              </span>
            </button>
          </div>

          <div className="mt-8 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {L.noReviews}
              </div>
            ) : (
              items.map((r) => (
                <div
                  key={r.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
                      {r.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold text-gray-900">
                        {r.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Stars value={r.rating} size="w-4 h-4" />
                        {r.date && (
                          <span className="text-xs text-gray-500">
                            {r.date}
                          </span>
                        )}
                      </div>
                      {r.title && (
                        <div className="font-medium text-gray-800">
                          {r.title}
                        </div>
                      )}
                      <p className="text-sm text-gray-700">{r.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Price + CTA block (used in info column on mobile, sidebar on lg)    */
/* ------------------------------------------------------------------ */

function CTAButtons({
  big,
  disabled,
  L,
  onAdd,
  whatsappUrl,
}: {
  big?: boolean;
  disabled?: boolean;
  L: typeof defaultLabels;
  onAdd: () => void;
  whatsappUrl?: string;
}) {
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={onAdd}
        className={cx(
          "w-full text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 group relative overflow-hidden",
          big ? "h-16 min-h-[64px] text-lg" : "h-14 min-h-[56px] text-base",
        )}
        style={{
          background:
            "linear-gradient(90deg, var(--color-accent,#A9C838), var(--color-accent-dark,#8FAE1F))",
        }}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <IconCart
          className={cx(
            big ? "w-6 h-6" : "w-5 h-5",
            "group-hover:scale-110 transition-transform duration-300",
          )}
        />
        <span className="tracking-wide">{L.addToCart}</span>
      </button>
      <a
        href={whatsappUrl ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        title={L.whatsapp}
        className={cx(
          "mt-3 w-full text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.97] group relative overflow-hidden bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54]",
          big ? "h-16 min-h-[64px] text-lg" : "h-14 min-h-[56px] text-base",
        )}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <IconWhatsapp
          className={cx(
            big ? "w-6 h-6" : "w-5 h-5",
            "group-hover:scale-110 transition-transform duration-300",
          )}
        />
        <span className="tracking-wide">{L.whatsapp}</span>
      </a>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

type TabKey = "description" | "howToUse" | "healthNotes" | "details";

export default function ProductDetail({
  product,
  labels,
  onAddToCart,
  onAddRelatedToCart,
  onWriteReview,
  onToggleWishlist,
  onFulfilmentChange,
}: ProductDetailProps) {
  const L = { ...defaultLabels, ...labels };
  const initialSelection = () =>
    Object.fromEntries(
      (product.variants ?? []).map((g) => [g.name, g.selectedId]),
    ) as Record<string, string | number>;

  const [selected, setSelected] = useState(initialSelection);
  useEffect(() => setSelected(initialSelection()), [product.id]); // eslint-disable-line

  const p = useMemo<ProductDetailData>(() => {
    const m: ProductDetailData = { ...product };
    (product.variants ?? []).forEach((g) => {
      const o = g.options.find((x) => x.id === selected[g.name]);
      if (!o) return;
      if (o.name) m.name = o.name;
      if (o.price != null) m.price = o.price;
      if (o.originalPrice != null) m.originalPrice = o.originalPrice;
      if (o.discountPercentage != null)
        m.discountPercentage = o.discountPercentage;
      if (o.offerLabel) m.offerLabel = o.offerLabel;
      if (o.images?.length) m.images = o.images;
      if (o.details?.length) {
        m.details = o.details;
      }

      m.nutrition = o.nutrition;
    });
    if (!m.images?.length && product.image)
      m.images = [{ url: product.image, alt: product.name }];
    return m;
  }, [product, selected]);

  const pickVariant = (g: ProductVariantGroup, o: ProductVariantOption) => {
    setSelected((s) => ({ ...s, [g.name]: o.id }));
    // update the address bar only, with no navigation or refetch
    if (o.href) {
      const slug = new URL(o.href, window.location.origin).pathname
        .split("/")
        .filter(Boolean)
        .pop();

      if (slug) {
        window.history.replaceState(null, "", `/${slug}`);
      }
    }
  };
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [tab, setTab] = useState<TabKey>("description");
  const [showBar, setShowBar] = useState(false);
  const mainCtaRef = useRef<HTMLDivElement>(null);

  // floating mobile bar appears after the main CTA scrolls out of view
  useEffect(() => {
    const el = mainCtaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setShowBar(!e.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const add = () => onAddToCart?.(p, 1);

  const tabs: {
    key: TabKey;
    label: string;
    icon: React.JSX.Element;
    html?: string;
    hasContent: boolean;
  }[] = [
    {
      key: "description",
      label: L.description,
      icon: <IconFile />,
      html: p.descriptionHtml,
      hasContent: !!p.descriptionHtml,
    },
    {
      key: "howToUse",
      label: L.howToUse,
      icon: <IconBook />,
      html: p.howToUseHtml,
      hasContent: !!p.howToUseHtml,
    },
    {
      key: "healthNotes",
      label: L.healthNotes,
      icon: <IconHeart className="w-4 h-4" />,
      html: p.healthNotesHtml,
      hasContent: !!p.healthNotesHtml,
    },
    {
      key: "details",
      label: L.productDetails,
      icon: <IconInfo />,
      hasContent: !!p.details?.length,
    },
  ];
  const visibleTabs = tabs.filter((t) => t.hasContent);
  const activeTab = visibleTabs.find((t) => t.key === tab) ?? visibleTabs[0];

  const BrandRow = () =>
    p.brand ? (
      <Link
        href={p.brand.href}
        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
      >
        <div className="relative w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
          {p.brand.image && (
            <Image
              src={p.brand.image}
              alt={p.brand.name}
              width={48}
              height={48}
              className="w-full h-full object-contain rounded-full"
            />
          )}
        </div>
        <div className="flex-1 min-w-0 text-sm text-gray-600">
          By{" "}
          <span
            className="underline font-medium"
            style={{ color: "var(--color-primary,#723881)" }}
          >
            {p.brand.name}
          </span>
        </div>
        <IconChevronRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
      </Link>
    ) : null;

  const proseClasses =
    "prose prose-sm sm:prose-base max-w-none text-gray-700 [&_p]:mb-4 [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-2.5 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:space-y-2.5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-gray-900 [&_h2]:border-b [&_h2]:border-gray-100 [&_h2]:pb-1.5 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-gray-300 [&_table]:my-6 [&_th]:border [&_th]:border-gray-300 [&_th]:px-4 [&_th]:py-3 [&_th]:bg-gray-50 [&_td]:border [&_td]:border-gray-200 [&_td]:px-4 [&_td]:py-3 [&_a]:font-medium [&_a]:hover:underline [&_img]:rounded-xl [&_img]:shadow-lg [&_img]:my-6 [&_img]:max-w-full [&_img]:h-auto";

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-0">
      {/* Mobile top bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-3 flex items-center gap-2">
          <button
            type="button"
            aria-label="Back"
            onClick={() => history.back()}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 flex items-center justify-center text-gray-600 transition-all duration-200 shrink-0"
          >
            <IconBack />
          </button>
          <div className="relative flex-1 min-w-0">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-2 focus-within:bg-white focus-within:shadow-md transition-all duration-200">
              <svg
                className="w-4 h-4 text-gray-400 mr-2 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
              <input
                placeholder="Search For Supplements & Nutrition"
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm"
              />
            </div>
          </div>
          <button
            type="button"
            aria-label="Share product"
            onClick={() =>
              navigator
                .share?.({ title: p.name, url: location.href })
                .catch(() => {})
            }
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 flex items-center justify-center text-gray-600 transition-all duration-200 shrink-0"
          >
            <IconShare />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1 sm:gap-2 text-sm text-gray-600 overflow-x-auto mb-4 lg:mb-6"
          aria-label="Breadcrumb"
        >
          <Link
            href={p.breadcrumbs[0]?.href ?? "/"}
            className="flex items-center hover:text-[color:var(--color-primary,#723881)] transition-colors"
          >
            <IconHome />
          </Link>
          {p.breadcrumbs.slice(1).map((b) => (
            <div
              key={b.href}
              className="flex items-center gap-1 sm:gap-2 shrink-0"
            >
              <IconChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              <Link
                href={b.href}
                className="hover:text-[color:var(--color-primary,#723881)] transition-colors truncate max-w-[150px] sm:max-w-none"
              >
                {b.name}
              </Link>
            </div>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
          {/* ============ LEFT / MAIN COLUMN ============ */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-white">
              <div className="space-y-6">
                <div className="lg:hidden">
                  <BrandRow />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 relative">
                  <Gallery
                    images={p.images ?? []}
                    express={p.express}
                    expressLabel={L.express}
                    productId={p.id}
                    onToggleWishlist={onToggleWishlist}
                  />

                  <div className="space-y-4 lg:space-y-6">
                    <div className="hidden lg:block">
                      <BrandRow />
                    </div>

                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {p.name}
                    </h1>

                    {!!p.tags?.length && (
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Variants */}
                    {!!p.variants?.length && (
                      <div className="pt-4 border-t border-gray-200">
                        {p.variants.map((g, gi) => (
                          <div
                            key={g.name}
                            className={
                              gi < p.variants!.length - 1 ? "mb-4" : ""
                            }
                          >
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                              {g.name}
                            </h3>
                            <div className="flex lg:flex-wrap gap-2 overflow-x-auto lg:overflow-x-visible pb-2">
                              {g.options.map((o) => {
                                const active = o.id === selected[g.name];
                                const inner = (
                                  <div className="flex items-center gap-2">
                                    {o.image && (
                                      <div className="relative w-8 h-8 rounded overflow-hidden">
                                        <Image
                                          src={o.image}
                                          alt={o.label}
                                          fill
                                          sizes="32px"
                                          className="object-contain"
                                        />
                                      </div>
                                    )}
                                    <span
                                      className={cx(
                                        "text-sm font-medium",
                                        active
                                          ? "text-[color:var(--color-primary,#723881)]"
                                          : "text-gray-700",
                                      )}
                                    >
                                      {o.label}
                                    </span>
                                  </div>
                                );
                                const cls = cx(
                                  "px-4 py-2 rounded-lg border-2 transition-all shrink-0",
                                  active
                                    ? "border-[color:var(--color-primary,#723881)] bg-[color:var(--color-primary,#723881)]/10"
                                    : "border-gray-200 bg-white hover:border-[color:var(--color-primary,#723881)]/50",
                                  o.disabled &&
                                    "opacity-50 pointer-events-none",
                                );
                                return (
                                  <button
                                    key={o.id}
                                    type="button"
                                    onClick={() => pickVariant(g, o)}
                                    className={cls}
                                  >
                                    {inner}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Fulfilment */}
                    <div className="border-t border-gray-200 pt-4" dir="ltr">
                      <div
                        className="relative isolate grid grid-cols-2 rounded-2xl bg-[#F6F3F7] p-1.5"
                        role="tablist"
                        aria-label="Fulfillment method"
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]"
                          style={{
                            transform:
                              mode === "delivery"
                                ? "translateX(0)"
                                : "translateX(100%)",
                          }}
                        />
                        {(["delivery", "pickup"] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            role="tab"
                            aria-selected={mode === m}
                            onClick={() => {
                              setMode(m);
                              onFulfilmentChange?.(m);
                            }}
                            className={cx(
                              "relative z-10 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-300",
                              mode === m
                                ? "text-[#723881]"
                                : "text-[#414141] hover:text-[#101618]",
                            )}
                          >
                            {m === "delivery" ? (
                              <IconTruck
                                className={cx(
                                  "h-4 w-4 shrink-0 transition-transform duration-300",
                                  mode === m ? "scale-110" : "scale-100",
                                )}
                              />
                            ) : (
                              <IconStore
                                className={cx(
                                  "h-4 w-4 shrink-0 transition-transform duration-300",
                                  mode === m ? "scale-110" : "scale-100",
                                )}
                              />
                            )}
                            <span>
                              {m === "delivery" ? L.delivery : L.pickup}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center gap-2.5 rounded-2xl bg-[#F6F3F7] px-3 py-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#723881]">
                            {mode === "delivery" ? (
                              <IconTruck />
                            ) : (
                              <IconStore />
                            )}
                          </div>
                          <p className="text-[13px] leading-relaxed text-[#414141]">
                            {mode === "delivery"
                              ? L.deliveryHint
                              : L.pickupHint}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile price + CTA */}
                    <div className="lg:hidden">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm text-gray-500 font-medium">
                          {p.currency}
                        </span>
                        <span
                          className="text-3xl font-bold tracking-tight"
                          style={{ color: "var(--color-accent,#A9C838)" }}
                        >
                          {fmt(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            {fmt(p.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="lg:hidden" ref={mainCtaRef}>
                      <CTAButtons
                        disabled={!p.inStock}
                        L={L}
                        onAdd={add}
                        whatsappUrl={p.whatsappUrl}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ============ TABS ============ */}
            {activeTab && (
              <div className="bg-white border-t border-gray-200 shadow-lg shadow-gray-100/50">
                <div className="sticky top-0 z-40 relative px-4 sm:px-6 lg:px-8 border-b border-gray-200/60 bg-gradient-to-b from-gray-50/30 via-white to-white">
                  <div
                    className="relative flex gap-1 overflow-x-auto py-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {visibleTabs.map((t) => {
                      const on = t.key === activeTab.key;
                      return (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setTab(t.key)}
                          className={cx(
                            "relative px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out rounded-lg flex items-center gap-2.5 group",
                            on
                              ? "text-[color:var(--color-primary,#723881)] bg-white shadow-md shadow-[#723881]/10 scale-105"
                              : "text-gray-600 hover:text-[color:var(--color-primary,#723881)] hover:bg-white/70 hover:shadow-sm",
                          )}
                        >
                          <span
                            className={cx(
                              "transition-all duration-300",
                              on
                                ? "text-[color:var(--color-primary,#723881)] scale-110"
                                : "text-gray-400 group-hover:text-[color:var(--color-primary,#723881)] group-hover:scale-110",
                            )}
                          >
                            {t.icon}
                          </span>
                          <span className="relative z-10">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-gradient-to-b from-white via-gray-50/20 to-white">
                  <div
                    key={activeTab.key}
                    className="animate-[slideDown_0.4s_ease-out_forwards]"
                  >
                    {activeTab.key === "details" ? (
                      <table className="w-full border-collapse text-sm">
                        <tbody>
                          {p.details!.map((d) => (
                            <tr key={d.label}>
                              <td className="border border-gray-200 px-4 py-3 font-semibold text-gray-900 w-1/3 bg-gray-50">
                                {d.label}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-gray-700">
                                {d.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div
                        className={proseClasses}
                        dangerouslySetInnerHTML={{
                          __html: activeTab.html ?? "",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Nutrition facts (mobile; desktop shows in sidebar) */}
            {p.nutrition && (
              <div className="lg:hidden">
                <NutritionPanel data={p.nutrition} L={L} />
              </div>
            )}

            {/* Reviews */}
            <Reviews data={p.reviews} L={L} onWrite={onWriteReview} />

            {/* Carousels */}
            <Carousel
              title={L.relatedProducts}
              items={p.related ?? []}
              L={L}
              tint
              onAdd={onAddRelatedToCart}
            />
            <Carousel
              title={L.similarProducts}
              items={p.similar ?? []}
              L={L}
              onAdd={onAddRelatedToCart}
            />
          </div>

          {/* ============ RIGHT SIDEBAR (desktop) ============ */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="flex flex-col lg:sticky lg:top-6">
              <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white mb-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  {L.serviceGuarantees}
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  {(p.guarantees ?? DEFAULT_GUARANTEES).map((g) => (
                    <li key={g} className="flex items-start gap-3">
                      <span className="text-green-600 mt-0.5 font-bold text-base">
                        ✓
                      </span>
                      <span className="leading-relaxed">{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                  <span className="text-sm text-gray-500 font-medium">
                    {p.currency}
                  </span>
                  <span
                    className="text-3xl lg:text-4xl font-bold tracking-tight"
                    style={{ color: "var(--color-accent,#A9C838)" }}
                  >
                    {fmt(p.price)}
                  </span>
                  {p.originalPrice && (
                    <span className="text-gray-400 line-through">
                      {fmt(p.originalPrice)}
                    </span>
                  )}
                </div>
                {p.soldRecently && (
                  <div className="mt-4 flex w-fit h-6 items-center gap-1.5 rounded bg-[#f2f4f7] px-2 text-sm">
                    <span className="text-[14px]">🔥</span>
                    {p.soldRecently}
                  </div>
                )}
              </div>

              <div className="w-full min-h-[64px]">
                <CTAButtons
                  big
                  disabled={!p.inStock}
                  L={L}
                  onAdd={add}
                  whatsappUrl={p.whatsappUrl}
                />
              </div>

              {p.nutrition && (
                <div className="mt-6">
                  <NutritionPanel data={p.nutrition} L={L} />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Floating mobile add-to-cart bar */}
      <div
        className={cx(
          "lg:hidden fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50 bg-white/70 backdrop-blur-xl rounded-full shadow-[0_10px_40px_rgba(169,200,56,0.15),0_0_0_1px_rgba(169,200,56,0.1)] border border-[color:var(--color-accent,#A9C838)]/20 transition-all duration-500 ease-out",
          showBar
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-24 opacity-0 scale-95 pointer-events-none",
        )}
      >
        <div className="px-4 py-2.5 flex items-center gap-3">
          <div className="shrink-0 min-w-[80px] flex items-baseline gap-1.5">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              {p.currency}
            </span>
            <span
              className="text-xl font-extrabold"
              style={{ color: "var(--color-accent,#A9C838)" }}
            >
              {fmt(p.price)}
            </span>
          </div>
          <button
            type="button"
            disabled={!p.inStock}
            onClick={add}
            className="flex-1 h-10 rounded-full text-white font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2.5 shadow-[0_4px_12px_rgba(169,200,56,0.3)] transition-all duration-300 active:scale-[0.96] disabled:opacity-60"
            style={{
              background:
                "linear-gradient(90deg, var(--color-accent,#A9C838), var(--color-accent-dark,#8FAE1F))",
            }}
          >
            <IconCart className="w-5 h-5" />
            <span className="font-bold tracking-wider">{L.addToCartShort}</span>
          </button>
        </div>
      </div>

      {/* tab content keyframes */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
