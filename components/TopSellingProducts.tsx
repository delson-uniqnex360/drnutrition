"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swiper from "swiper";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

type Product = {
  id: number;
  name: string;
  image: string;
  slug: string;
  price: string;
  oldPrice?: string;
  rating: string;
  discount?: string;
  badge?: string;
  offer?: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Dymatize ISO 100 Hydrolyzed Whey Protein Isolate, Dunkin Mocha Latte, 1.45 LB",
    image:
      "https://media.drnutrition.com/media/thumbnail/d8p3yFADDY6CJe5WcYKqNvrpxPmVoYJaoc2UgoKK.jpg",
    slug: "dymatize-iso-100",
    price: "158.12",
    oldPrice: "178.81",
    rating: "4.4",
    discount: "-12% OFF",
  },
  {
    id: 2,
    name: "Body Builder Creatine Monohydrate, 60, Unflavored",
    image:
      "https://media.drnutrition.com/media/thumbnail/H07oypDbwi6xK6ba4PDPDf6CCZOSh32KwCWOoKuT.jpg",
    slug: "body-builder-creatine",
    price: "33.00",
    oldPrice: "62.00",
    rating: "4.4",
    discount: "-47% OFF",
    badge: "Black Friday 2026",
  },
  {
    id: 3,
    name: "Optimum Nutrition Gold Standard 100% Whey Protein, Double Rich Chocolate, 1LB",
    image:
      "https://media.drnutrition.com/media/thumbnail/HFW9UZUzn13x7jK0o3k6xqXz3clg8Lp2QABxT10B.jpg",
    slug: "optimum-nutrition-whey",
    price: "125.49",
    oldPrice: "139.00",
    rating: "4.4",
    discount: "-10% OFF",
  },
  {
    id: 4,
    name: "Applied Nutrition ABE Powder Pre Workout, Bubblegum, 375 gm",
    image:
      "https://media.drnutrition.com/media/thumbnail/RY4ui4ltFppXS64NLD43cP8aiZEVo8ackm0XeZDN.jpg",
    slug: "applied-nutrition-abe",
    price: "79.38",
    oldPrice: "119.00",
    rating: "4.9",
    discount: "-33% OFF",
    offer: "Get 5 AN Sparkling Protein Water Free",
  },
  {
    id: 5,
    name: "Body Builder Whey Protein, Milk Chocolate, 2 LB",
    image:
      "https://media.drnutrition.com/media/thumbnail/oNBc3IsZEcQBXr7O5qZWGawMcEKnNrHWaeJY4OSp.jpg",
    slug: "body-builder-whey",
    price: "135.00",
    rating: "4.7",
    badge: "Trending Now!",
  },
];

// Repeat products to provide enough content for horizontal scrolling.
const duplicatedProducts = Array.from({ length: 3 }, () => products).flat();

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-md border border-gray-100 relative h-full flex flex-col overflow-hidden">
      <div className="flex-1">
        {/* Product image */}
        <div className="relative mb-2">
          <div className="w-full h-52 flex items-center justify-center overflow-hidden border-b border-gray-100 relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="225px"
              className="object-contain p-2"
            />
          </div>

          {/* Product badge */}
          {product.badge && (
            <div className="absolute top-0 left-0 z-10">
              <span
                className={`inline-block text-xs font-semibold px-2 py-1 max-w-[150px] truncate shadow-sm rounded-r-full ${
                  product.badge === "Trending Now!"
                    ? "bg-purple-900 text-yellow-300"
                    : "bg-black text-white"
                }`}
              >
                {product.badge}
              </span>
            </div>
          )}

          {/* Rating */}
          <div className="absolute bottom-2 right-2">
            <div className="flex items-center gap-1.5 rounded-lg text-xs px-2 py-1 bg-white shadow">
              <span className="font-semibold text-gray-800">
                ★ {product.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Product name */}
        <h3 className="text-gray-800 font-medium text-sm mb-2 line-clamp-2 leading-tight px-1.5 min-h-[36px]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-2 px-1.5">
          <div className="flex items-baseline flex-wrap gap-x-1 gap-y-0.5">
            <span className="text-purple-700 text-xs font-medium">AED</span>

            <span className="text-purple-700 font-bold text-base tabular-nums leading-none">
              {product.price}
            </span>

            {product.oldPrice && (
              <span className="text-gray-400 text-xs line-through tabular-nums leading-none">
                {product.oldPrice}
              </span>
            )}
          </div>

          {/* Flash sale badge - non-clickable */}
          {product.discount && (
            <div className="mt-2 flex items-center justify-between gap-1.5 rounded-[10px] border border-[#E7B15D] bg-gradient-to-r from-[#1A0B14] via-[#3D0C18] to-[#5E0E1B] px-2 py-1 shadow">
              <span className="text-[10px] font-extrabold text-white uppercase tracking-wide truncate">
                Flash Sale
              </span>

              <span className="shrink-0 rounded-full bg-[#FFD25F] text-[#2D1A05] px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
                {product.discount}
              </span>
            </div>
          )}

          {/* Offer badge - non-clickable */}
          {product.offer && (
            <div className="mt-1 inline-block bg-purple-700 text-white text-xs font-semibold px-2 py-1 rounded max-w-full truncate">
              {product.offer}
            </div>
          )}
        </div>
      </div>

      {/* Non-clickable button-style footer */}
      <div className="border-t border-gray-100 min-h-[40px]">
        <div className="w-full h-10 bg-purple-700 text-white font-medium text-sm px-4 rounded-b-md flex items-center justify-center">
          Add to Cart
        </div>
      </div>
    </div>
  );
}

export default function TopSellingProducts() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="bg-gray-50 mt-6">
      {/* Section heading */}
      <div className="px-4 py-1">
        <div className="flex items-center justify-start">
          <h2 className="text-gray-900 font-bold text-lg">
            Top Selling Product!
          </h2>
        </div>
      </div>

      <div className="px-0 py-4">
        {mounted ? (
          <SwiperComponent
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
            grabCursor={true}
            className="top-selling-swiper"
          >
            {duplicatedProducts.map((product, index) => (
              <SwiperSlide
                key={`${product.id}-${index}`}
                className="!h-auto !w-[224.615px]"
              >
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </SwiperComponent>
        ) : (
          <div className="flex gap-2 overflow-x-auto px-4 pb-1">
            {duplicatedProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="w-[224.615px] shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
