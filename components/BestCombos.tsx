"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

const combos = [
  {
    name: "Laperva Triple Omega 3 DualCaps + Laperva Cookie Dough",
    slug: "/en-ae/laperva-triple-omega-3-dualcaps-laperva-cookie-dough",
    image:
      "https://media.drnutrition.com/media/thumbnail/LDyiNxyAuQFcqPwxxTVlQ5Adhj78YtAgReihYKPV.jpg",
    discount: "28%",
    price: "444.00",
    originalPrice: "619.00",
  },
  {
    name: "Laperva Zero Sugar Cheese + LAPERVA ZERO SUGAR KETCHUP 290ML + Laperva Zero Sugar Mayonnaise Sauce",
    slug: "/en-ae/laperva-zero-sugar-cheese-laperva-zero-sugar-ketchup-290ml-laperva-zero-sugar-mayonnaise-sauce",
    image:
      "https://media.drnutrition.com/media/thumbnail/wBJfxMAZlcs90WAAM2UHOV0DMEhqGZcYu9QrUznB.jpg",
    discount: "54%",
    price: "47.00",
    originalPrice: "101.80",
  },
  {
    name: "Body Builder Premium Whey Protein New Gen + Body Builder Creatine Monohydrate",
    slug: "/en-ae/body-builder-premium-whey-protein-new-gen-body-builder-creatine-monohydrate",
    image:
      "https://media.drnutrition.com/media/thumbnail/YGCxsiuyPHq2Em4TYhAxnUV5MzX6b8lwljQu3fud.jpg",
    discount: "28%",
    price: "165.00",
    originalPrice: "230.00",
  },
  {
    name: "Laperva Iso Triple Zero Next Generation Whey Protein + Laperva Triple Gold Whey + Laperva Triple Power Ultimate OXYICE",
    slug: "/en-ae/laperva-iso-triple-zero-next-generation-whey-protein-laperva-triple-gold-whey-laperva-triple-power-ultimate-oxyice",
    image:
      "https://media.drnutrition.com/media/thumbnail/fcM1VjNUnrFwQJl7VJsaG70rjT9a1PzgH3lI6W9X.jpg",
    discount: "38%",
    price: "498.75",
    originalPrice: "810.60",
  },
  {
    name: "Olimp Gain Bolic 6000 + Olimp Sport Nutrition Bcaa Xplode",
    slug: "/en-ae/olimp-gain-bolic-6000-olimp-sport-nutrition-bcaa-xplod",
    image:
      "https://media.drnutrition.com/media/thumbnail/4YDMpgcAIf0uKI4BtTLfaSqgYpE8pASdxwzzAJmP.jpg",
    discount: "42%",
    price: "215.00",
    originalPrice: "370.43",
  },
  {
    name: "Farah Secrets Whey Secret Protein + Farah Secrets Creatine",
    slug: "/en-ae/farah-secrets-whey-secret-protein-farah-secrets-creatine",
    image:
      "https://media.drnutrition.com/media/thumbnail/caHMkvZaD0AQZ7BqmaGEIAhInJCUlZ3g18eETTSw.jpg",
    discount: "25%",
    price: "249.00",
    originalPrice: "330.75",
  },
  {
    name: "Farah Secrets Hydro Secret Protein + Farah Secrets Creatine",
    slug: "/en-ae/farah-secrets-hydro-secret-protein-farah-secrets-creatine",
    image:
      "https://media.drnutrition.com/media/thumbnail/9DJSY7IYUpe1MDmFFa4eDyH5u9GnDVkahYaHUAwd.jpg",
    discount: "28%",
    price: "269.00",
    originalPrice: "374.85",
  },
  {
    name: "Olimp Sport Nutrition Iso Plus Powder + Olimp Creatine 1250 Monohydrate Mega",
    slug: "/en-ae/olimp-sport-nutrition-iso-plus-powder-olimp-creatine-1250-monohydrate-mega",
    image:
      "https://media.drnutrition.com/media/thumbnail/uSNvu1Lnp4oMn1GPn3Fr3XoJik88bcdAAyvwoSSD.jpg",
    discount: "57%",
    price: "115.00",
    originalPrice: "269.63",
  },
];

export default function BestCombos() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="mt-6 w-full bg-gray-50">
      {/* Heading */}
      <div className="bg-gray-50 px-4 py-1">
        <h2 className="text-lg font-bold text-gray-900">Best Combos! (Demo)</h2>
      </div>

      {/* Products Slider */}
      <div className="w-full px-0 py-4">
        {mounted ? (
          <Swiper
            modules={[FreeMode]}
            dir="ltr"
            freeMode={{
              enabled: true,
              sticky: false,
            }}
            slidesPerView={1.6}
            spaceBetween={8}
            slidesOffsetBefore={16}
            slidesOffsetAfter={16}
            breakpoints={{
              480: {
                slidesPerView: 2,
                spaceBetween: 8,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 8,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 8,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 8,
              },
            }}
            grabCursor
            className="w-full"
          >
            {combos.map((combo) => (
              <SwiperSlide key={combo.slug} className="!h-auto">
                <div className="relative flex h-full max-w-[320px] flex-col rounded-md border border-gray-100 border-t bg-white">
                  {/* Product Details */}
                  <div className="flex-1">
                    {/* Image */}
                    <div className="relative mb-2">
                      <Link href={""} className="block no-underline">
                        <div className="relative flex h-52 w-full items-center justify-center overflow-hidden border-b border-gray-100">
                          <Image
                            src={combo.image}
                            alt={combo.name}
                            fill
                            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 33vw, 25vw"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </Link>

                      {/* Discount */}
                      <div className="absolute left-2 top-2 z-20 flex flex-col gap-1.5">
                        <span className="w-fit rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">
                          -{combo.discount}
                        </span>
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="mb-1 line-clamp-2 px-1.5 text-sm font-medium leading-tight text-gray-800">
                      {combo.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-2 flex flex-wrap items-baseline gap-x-1 gap-y-0.5 px-1.5">
                      <span className="text-xs font-medium text-purple-700">
                        AED
                      </span>

                      <span className="text-base font-bold leading-none tabular-nums text-purple-700">
                        {combo.price}
                      </span>

                      <span className="text-xs leading-none text-gray-400 line-through tabular-nums">
                        {combo.originalPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 px-1.5 text-xs text-gray-400" />
                  </div>

                  {/* Add to Cart */}
                  <div className="min-h-10 border-t border-gray-100">
                    <button
                      type="button"
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-b-md bg-purple-700 px-4 text-sm font-medium text-white transition-colors hover:opacity-90"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
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
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex gap-2 overflow-hidden px-4">
            {combos.slice(0, 2).map((combo) => (
              <div
                key={combo.slug}
                className="w-[62%] shrink-0 rounded-md border border-gray-100 bg-white p-2"
              >
                <div className="relative h-52 w-full">
                  <Image
                    src={combo.image}
                    alt={combo.name}
                    fill
                    sizes="60vw"
                    className="object-contain"
                  />
                </div>
                <h3 className="line-clamp-2 text-sm font-medium text-gray-800">
                  {combo.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
