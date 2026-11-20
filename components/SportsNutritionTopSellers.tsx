"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

export type Product = {
  id: number;
  name: string;
  image: string;
  href: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  rating?: string;
  offer?: string;
  offerHref?: string;
  flashSale?: string;
  flashSaleHref?: string;
};

type Props = {
  onAddToCart?: (product: Product) => void;
  onWishlistToggle?: (product: Product) => void;
};

const baseProducts: Product[] = [
  {
    id: 1,
    name: "Sunwarrior Protein Warrior Blend, Unflavored, 15",
    image:
      "https://media.drnutrition.com/media/thumbnail/2effVlTPaKPx78qY5GGnQK9vzoojSIgprWFDKuzN.jpg",
    href: "/en-ae/sunwarrior-protein-warrior-blend-15-unflavored",
    price: "144.00",
  },
  {
    id: 2,
    name: "Applied Nutrition Complete Breakfast Smoothie, Coconut Mango",
    image:
      "https://media.drnutrition.com/media/thumbnail/Enz1TjPLF9Y4kdvtmm5GZtvHeWse4DZAezsw1xYH.jpg",
    href: "/en-ae/applied-nutrition-complete-breakfast-smoothie-coconut-mango",
    price: "95.00",
    oldPrice: "120.00",
    discount: "-20%",
    offer: "AN Free Gift",
    offerHref: "/en-ae/offers/an-free-gift",
  },
  {
    id: 3,
    name: "Dymatize ISO 100 Hydrolyzed Whey Protein Isolate, Dunkin Mocha Latte, 1.45 LB",
    image:
      "https://media.drnutrition.com/media/thumbnail/d8p3yFADDY6CJe5WcYKqNvrpxPmVoYJaoc2UgoKK.jpg",
    href: "/en-ae/dymatize-iso-100-1.45-lb-dunkin-mocha-latte",
    price: "158.12",
    oldPrice: "178.81",
    rating: "4.4",
    flashSale: "-12% OFF",
    flashSaleHref: "/en-ae/flash-sale",
  },
  {
    id: 4,
    name: "Optimum Nutrition Gold Standard 100% Whey Protein, Double Rich Chocolate, 1LB",
    image:
      "https://media.drnutrition.com/media/thumbnail/HFW9UZUzn13x7jK0o3k6xqXz3clg8Lp2QABxT10B.jpg",
    href: "/en-ae/optimum-nutrition-gold-standard-100-whey-protein-1lb-double-rich-chocolate",
    price: "125.49",
    oldPrice: "139.00",
    rating: "4.4",
    flashSale: "-10% OFF",
    flashSaleHref: "/en-ae/flash-sale",
  },
  {
    id: 5,
    name: "Olimp Sport Nutrition Profi Mass, Chocolate, 2.2 LB",
    image:
      "https://media.drnutrition.com/media/thumbnail/bobsm6NK9PP4UnUF7EYwv62cm9fGc2pHehuX2qBk.jpg",
    href: "/en-ae/olimp-sport-nutrition-profi-mass-2.2-lb-chocolate",
    price: "89.40",
    oldPrice: "178.79",
    discount: "-50%",
  },
];

// Repeat the sample products to create a longer carousel for UI testing.
// Replace this with your actual product list when connecting the API.
const products = [...baseProducts, ...baseProducts, ...baseProducts];

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-4 h-4 transition-all ${
        active ? "text-red-500" : "text-gray-500"
      }`}
    >
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-[var(--color-rating-filled)]"
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
}

function ProductCard({
  product,
  onAddToCart,
  onWishlistToggle,
}: {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onWishlistToggle?: (product: Product) => void;
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = () => {
    setIsWishlisted((previous) => !previous);
    onWishlistToggle?.(product);
  };

  return (
    <div className="bg-white rounded-md border-t border-l border-r border-gray-100 relative max-w-[320px] h-full flex flex-col">
      <div className="flex-1">
        <div className="relative mb-2">
          <Link href={""} className="block no-underline">
            <div className="w-full h-52 flex items-center justify-center overflow-hidden border-b border-gray-100 relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="225px"
                className="object-contain"
              />
            </div>
          </Link>

          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full shadow-md hover:shadow-lg flex items-center justify-center hover:bg-primary/10 hover:scale-110 transition-all duration-300 z-20 active:scale-95 border border-gray-100 hover:border-primary/30 cursor-pointer"
          >
            <HeartIcon active={isWishlisted} />
          </button>

          <div className="absolute top-1 left-1 flex flex-col gap-1">
            {product.discount && (
              <span className="bg-[var(--color-discount)] text-white text-xs font-medium px-2 py-1 rounded w-fit">
                {product.discount}
              </span>
            )}
          </div>

          {product.rating && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg text-xs px-2 py-1 bg-white shadow z-10">
              <span className="font-semibold text-[var(--color-text)]">
                {product.rating}
              </span>
              <StarIcon />
            </div>
          )}
        </div>

        <h3 className="text-gray-800 font-medium text-sm mb-1 line-clamp-2 leading-tight px-1.5">
          {product.name}
        </h3>

        <div className="mb-2 px-1.5">
          <div className="flex items-baseline flex-wrap gap-x-1 gap-y-0.5">
            <span className="text-[var(--color-accent)] text-xxs font-medium">
              AED
            </span>
            <span className="text-[var(--color-accent)] font-bold text-base tabular-nums leading-none">
              {product.price}
            </span>

            {product.oldPrice && (
              <span className="text-gray-400 text-xxs line-through tabular-nums leading-none">
                {product.oldPrice}
              </span>
            )}
          </div>

          {product.offer && (
            <Link
              href={product.offerHref || "#"}
              title={product.offer}
              className="mt-1 inline-block bg-primary text-white text-xs font-semibold px-2 py-1 rounded w-fit max-w-full truncate hover:opacity-90"
            >
              {product.offer}
            </Link>
          )}

          {product.flashSale && (
            <Link
              href={product.flashSaleHref || "/en-ae/flash-sale"}
              dir="ltr"
              className="flex w-full max-w-full relative items-center justify-between overflow-hidden rounded-[10px] border border-[#E7B15D] bg-[linear-gradient(90deg,#1A0B14_0%,#3D0C18_45%,#5E0E1B_100%)] shadow-[0_2px_10px_-2px_rgba(30,5,12,0.45)] gap-1.5 px-2 py-1 cursor-pointer transition-opacity hover:opacity-95 mt-1.5 no-underline"
            >
              <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)] animate-flash-sale-shine" />
              </span>

              <span className="relative z-[1] flex min-w-0 items-center gap-1.5 font-extrabold text-white uppercase tracking-[0.04em] text-[0.625rem]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3 w-3 shrink-0 text-[#E7B15D] animate-flash-sale-bolt"
                >
                  <path d="M13.5 2L4 14h7l-1 8 9.5-12H13l.5-8z" />
                </svg>
                <span className="min-w-0 truncate">Flash Sale</span>
              </span>

              <span className="relative z-[1] shrink-0 rounded-full bg-[#FFD25F] text-[#2D1A05] shadow-[0_1px_2px_rgba(0,0,0,0.2)] tabular-nums px-1.5 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-wide">
                {product.flashSale}
              </span>
            </Link>
          )}
        </div>

        <div className="text-[var(--color-text-light)] text-xs flex items-center gap-1 px-1.5" />
      </div>

      <div className="border-t border-gray-100 min-h-[40px]">
        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          disabled={!onAddToCart}
          className="w-full h-10 bg-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm px-4 rounded-b-md flex items-center justify-center gap-2 transition-colors"
        >
          <CartIcon />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

export default function SportsNutritionTopSellers({
  onAddToCart,
  onWishlistToggle,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="bg-[var(--color-background-gray-50)] mt-6">
      <div className="px-4 py-1 bg-[var(--color-background-gray-50)]">
        <div className="flex items-center justify-start">
          <h2 className="text-[var(--color-text)] font-bold text-lg">
            Sports Nutrition Top Sellers!! - Proteins
          </h2>
        </div>
      </div>

      <div className="px-0 py-4">
        {!mounted ? (
          <div className="flex gap-2 overflow-hidden px-4">
            {products.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="w-[224.615px] shrink-0"
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onWishlistToggle={onWishlistToggle}
                />
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            modules={[FreeMode]}
            dir="ltr"
            freeMode
            slidesPerView="auto"
            spaceBetween={8}
            slidesOffsetBefore={16}
            slidesOffsetAfter={16}
            grabCursor
          >
            {products.map((product, index) => (
              <SwiperSlide
                key={`${product.id}-${index}`}
                className="!h-auto !w-[224.615px]"
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onWishlistToggle={onWishlistToggle}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
