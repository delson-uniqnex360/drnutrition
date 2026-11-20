"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

export type Product = {
  id: number;
  name: string;
  image: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  rating?: string;
};

type Props = {
  onAddToCart?: (product: Product) => void;
  onWishlistToggle?: (product: Product) => void;
};

const baseProducts: Product[] = [
  {
    id: 1,
    name: "MuscleTech Creatine Cell Tech Creactor, Unflavored, 120",
    image:
      "https://media.drnutrition.com/media/thumbnail/92irD65zctOQDfOB7oBIYzQTHMlWhdGRrcMtezUt.jpg",
    price: "73.82",
    oldPrice: "138.00",
    discount: "-46%",
    rating: "4",
  },
  {
    id: 2,
    name: "Optimum Nutrition Micronized Creatine Capsules, 100 Capsules",
    image:
      "https://media.drnutrition.com/media/thumbnail/q4YOeTesOQuxQ0kNtY0ML0CEUggexRSuB41PitD4.jpg",
    price: "74.01",
    oldPrice: "118.80",
    discount: "-37%",
    rating: "4.8",
  },
  {
    id: 3,
    name: "Muscletech Creatine Chews, Citrus, 90 Chewable Tablets",
    image:
      "https://media.drnutrition.com/media/thumbnail/hJMOBKo8mQPntdCU9SfWMfOqFKYIWcdeathmOZB7.jpg",
    price: "74.88",
    oldPrice: "144.00",
    rating: "3",
  },
  {
    id: 4,
    name: "Laperva Vegan Triple Creatine, 90 Veggie Capsules, 1700 mg",
    image:
      "https://media.drnutrition.com/media/thumbnail/YxOEjc6B3rxwDmGTKNDycS68Gufikq3nKfkXH5a6.jpg",
    price: "55.02",
    oldPrice: "79.00",
    discount: "-30%",
    rating: "5",
  },
  {
    id: 5,
    name: "Universal Nutrition Animal Pure Creatine, Unflavored, 300 Gm",
    image:
      "https://media.drnutrition.com/media/thumbnail/mGWv0wznItZ8xWPH7bfyiOOQaycJF3MALXq6lrDo.jpg",
    price: "85.00",
  },
  {
    id: 6,
    name: "Laperva Triple Creatine Tablets, 30",
    image:
      "https://media.drnutrition.com/media/thumbnail/yxfURuzrSjfAGREEBwbAj0kXJLQ72bOHCyKaMYUu.jpg",
    price: "79.00",
  },
];

// Repeat products for carousel preview.
// Replace this with API data when available.
const products = [...baseProducts, ...baseProducts, ...baseProducts];

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
    <div className="bg-white rounded-md border-t border-l border-r border-gray-100 relative h-full flex flex-col">
      <div className="flex-1">
        <div className="relative mb-2">
          {/* Product image - no redirect */}
          <div className="w-full h-52 flex items-center justify-center overflow-hidden border-b border-gray-100 relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="225px"
              className="object-contain"
            />
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full shadow-md hover:shadow-lg flex items-center justify-center hover:bg-primary/10 hover:scale-110 transition-all duration-300 z-20 active:scale-95 border border-gray-100 hover:border-primary/30 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-4 h-4 transition-all duration-300 ${
                isWishlisted ? "text-red-500" : "text-gray-500"
              }`}
            >
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
            </svg>
          </button>

          {/* Discount */}
          {product.discount && (
            <div className="absolute top-1 left-1 flex flex-col gap-1">
              <span className="bg-[var(--color-discount)] text-white text-xs font-medium px-2 py-1 rounded w-fit">
                {product.discount}
              </span>
            </div>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="absolute bottom-2 right-2">
              <div className="flex items-center gap-1.5 rounded-lg text-xs px-2 py-1 bg-white shadow z-10">
                <span className="font-semibold text-[var(--color-text)]">
                  {product.rating}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-[var(--color-rating-filled)]"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Product name */}
        <h3 className="text-gray-800 font-medium text-sm mb-1 line-clamp-2 leading-tight px-1.5">
          {product.name}
        </h3>

        {/* Price */}
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
        </div>

        <div className="text-[var(--color-text-light)] text-xs flex items-center gap-1 px-1.5" />
      </div>

      {/* Add to Cart */}
      <div className="border-t border-gray-100 min-h-[40px]">
        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          disabled={!onAddToCart}
          className="w-full h-10 bg-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm px-4 rounded-b-md flex items-center justify-center gap-2 transition-colors"
        >
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
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

export default function SportsNutritionCreatine({
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
            Sports Nutrition Top Sellers!! - Creatine
          </h2>
        </div>
      </div>

      <div className="px-0 py-4">
        {!mounted ? (
          <div className="flex gap-2 overflow-hidden px-4">
            {products.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="!h-auto !w-[224.615px] shrink-0"
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
