"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

type Product = {
  id: number;
  name: string;
  image: string;
  href: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  rating?: string;
  label?: string;
  labelHref?: string;
  labelBackground?: string;
  labelColor?: string;
};

type TrendingProductsProps = {
  onAddToCart?: (product: Product) => void;
  onWishlistToggle?: (product: Product) => void;
};

const products: Product[] = [
  {
    id: 1,
    name: "Laperva Keto Cola, 1 Piece, Cola",
    image:
      "https://media.drnutrition.com/media/thumbnail/EzV3kNtFa9QZhr6P5mmz6NQW3o3NGNce6yUqrsDS.jpg",
    href: "/en-ae/laperva-keto-cola-cola-1-piece",
    price: "3.00",
    oldPrice: "5.99",
    discount: "-49%",
    rating: "4.9",
    label: "GLP-1 Friendly",
    labelHref: "/en-ae/label/glp-1-friendly",
    labelBackground: "#2dc304",
    labelColor: "#ffffff",
  },
  {
    id: 2,
    name: "Laperva Hydration Electrolytes Effervescent, Samberry, 20 Effervescent Tablets",
    image:
      "https://media.drnutrition.com/media/thumbnail/owCLdhfXi7tvAEcUwrOWfHmAoHwv1WfIUjiFV92N.jpg",
    href: "/en-ae/laperva-hydration-electrolytes-effervescent-20-effervescent-tablets-samberry",
    price: "77.00",
    rating: "5",
    label: "GLP-1 Friendly",
    labelHref: "/en-ae/label/glp-1-friendly",
    labelBackground: "#2dc304",
    labelColor: "#ffffff",
  },
  {
    id: 3,
    name: "Body Builder P-up Pre Workout Athletes Drink, Apple, 330 ML",
    image:
      "https://media.drnutrition.com/media/thumbnail/Z2WIedXKRVvMYnu64cLUCk3oKihl0QGOAVPK4qcJ.jpg",
    href: "/en-ae/body-builder-p-up-330-ml-apple",
    price: "6.00",
    label: "Trending Now!",
    labelHref: "/en-ae/label/trending-now",
    labelBackground: "#4a148c",
    labelColor: "#ffd700",
  },
  {
    id: 4,
    name: "AXIS-Y Complete No-stress Physical Sunscreen, 50 ML",
    image:
      "https://media.drnutrition.com/media/thumbnail/rZ5LxBjOPrAsva7CjMHSLUMM4153E0dLgpGgxKIw.jpg",
    href: "/en-ae/axis-y-complete-no-stress-physical-sunscreen-50-ml",
    price: "68.99",
    oldPrice: "120.00",
    discount: "-42%",
  },
  {
    id: 5,
    name: "B Bronze Tanning Oil With Tan Accelerator, 250 ML",
    image:
      "https://media.drnutrition.com/media/thumbnail/ZoWt1bTRhBCA750URFCyxeY6hMDlD7MLj6JkoYV5.jpg",
    href: "/en-ae/b-bronze-tanning-oil-with-tan-accelerator-250-ml",
    price: "149.00",
  },
  {
    id: 6,
    name: "Body Builder P-up Pre Workout Athletes Drink, Apple, 330 ML",
    image:
      "https://media.drnutrition.com/media/thumbnail/Z2WIedXKRVvMYnu64cLUCk3oKihl0QGOAVPK4qcJ.jpg",
    href: "/en-ae/body-builder-p-up-330-ml-apple",
    price: "6.00",
    label: "Trending Now!",
    labelHref: "/en-ae/label/trending-now",
    labelBackground: "#4a148c",
    labelColor: "#ffd700",
  },
  {
    id: 7,
    name: "AXIS-Y Complete No-stress Physical Sunscreen, 50 ML",
    image:
      "https://media.drnutrition.com/media/thumbnail/rZ5LxBjOPrAsva7CjMHSLUMM4153E0dLgpGgxKIw.jpg",
    href: "/en-ae/axis-y-complete-no-stress-physical-sunscreen-50-ml",
    price: "68.99",
    oldPrice: "120.00",
    discount: "-42%",
  },
  {
    id: 8,
    name: "B Bronze Tanning Oil With Tan Accelerator, 250 ML",
    image:
      "https://media.drnutrition.com/media/thumbnail/ZoWt1bTRhBCA750URFCyxeY6hMDlD7MLj6JkoYV5.jpg",
    href: "/en-ae/b-bronze-tanning-oil-with-tan-accelerator-250-ml",
    price: "149.00",
  },
];

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
        {/* Product image */}
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

          {/* Wishlist */}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full shadow-md hover:shadow-lg flex items-center justify-center hover:bg-purple-50 hover:scale-110 transition-all duration-300 z-20 active:scale-95 border border-gray-100 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-colors ${
                isWishlisted ? "text-red-500" : "text-gray-500"
              }`}
            >
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
            </svg>
          </button>

          {/* Labels */}
          <div
            dir="ltr"
            className="absolute top-0 left-0 right-10 z-20 flex flex-col items-start gap-1"
          >
            {product.label && (
              <Link
                href={product.labelHref || "#"}
                className="inline-block text-xs font-semibold px-2 py-1 w-fit max-w-[150px] truncate shadow-sm rounded-r-full hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: product.labelBackground,
                  color: product.labelColor,
                }}
              >
                {product.label}
              </Link>
            )}

            {product.discount && (
              <span className="inline-block text-xs font-semibold px-2 py-1 w-fit shadow-sm rounded-r-full bg-[var(--color-discount)] text-white">
                {product.discount}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg text-xs px-2 py-1 bg-white shadow z-10">
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
          )}
        </div>

        {/* Product name */}
        <Link href={""}>
          <h3 className="text-gray-800 font-medium text-sm mb-1 line-clamp-2 leading-tight px-1.5">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-2 px-1.5">
          <div className="flex items-baseline flex-wrap gap-x-1 gap-y-0.5">
            <span className="text-[var(--color-accent)] text-xs font-medium">
              AED
            </span>

            <span className="text-[var(--color-accent)] font-bold text-base tabular-nums leading-none">
              {product.price}
            </span>

            {product.oldPrice && (
              <span className="text-gray-400 text-xs line-through tabular-nums leading-none">
                {product.oldPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add to cart */}
      <div className="border-t border-gray-100 min-h-[40px]">
        <button
          type="button"
          disabled={!onAddToCart}
          onClick={() => onAddToCart?.(product)}
          className="w-full h-10 bg-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm px-4 rounded-b-md flex items-center justify-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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

export default function TrendingProducts({
  onAddToCart,
  onWishlistToggle,
}: TrendingProductsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="bg-white mt-6">
      {/* Section heading */}
      <div className="bg-[var(--color-background-gray-50)] px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[var(--color-text)] font-bold text-lg">
            Trending Now!
          </h2>
        </div>
      </div>

      <div className="px-0 py-4">
        {!mounted ? (
          <div className="flex gap-2 overflow-hidden px-4">
            {products.map((product) => (
              <div key={product.id} className="w-[224.615px] shrink-0">
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
            freeMode={{
              enabled: true,
              sticky: false,
            }}
            slidesPerView="auto"
            spaceBetween={8}
            slidesOffsetBefore={16}
            slidesOffsetAfter={16}
            grabCursor
            className="trending-products-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="!h-auto !w-[224.615px]">
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
