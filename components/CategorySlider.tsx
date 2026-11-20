"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

const categories = [
  {
    title: "Sports Nutrition",
    image:
      "https://media.drnutrition.com/media/U7JAKVReSq21P4aPxXjybED03Eqw96oAdBKRWRPN.jpg",
    link: "/en-ae/search?categories=Sports+Nutrition",
  },
  {
    title: "Health & Wellness",
    image:
      "https://media.drnutrition.com/media/1wv91DnLts9HwKOr8wIDIyddgOyCtefdyr2wE2RG.jpg",
    link: "/en-ae/search?categories=Health+%26+Wellness",
  },
  {
    title: "Weight Management",
    image:
      "https://media.drnutrition.com/media/FNajjqY2VFOxLP7KUaNbVFMN26kBM2AZS1nhQ1nW.jpg",
    link: "/en-ae/search?categories=Weight+Management",
  },
  {
    title: "Healthy Foods",
    image:
      "https://media.drnutrition.com/media/ibV2GadybutaVFykREITzZXOSe2lNFlDIQzYL90u.jpg",
    link: "/en-ae/search?categories=Healthy+Foods",
  },
  {
    title: "Beauty & Care",
    image:
      "https://media.drnutrition.com/media/c6ozz17c1OPgCqVPpLbrMKfQNYvf6sdJdqIik0FM.jpg",
    link: "/en-ae/search?categories=Beauty+%26+Care",
  },
  {
    title: "Fitness Equipment",
    image:
      "https://media.drnutrition.com/media/gM6B3kAu53SwcuGZMWyjmecDbzBjuizq410QrdMA.jpg",
    link: "/en-ae/search?categories=Fitness+Equipment",
  },
  {
    title: "Gym Essentials",
    image:
      "https://media.drnutrition.com/media/cYwdNQW4JRowjHH0ntyiYw0xO1rXfMJpBL53aBEz.jpg",
    link: "/en-ae/search?categories=Gym+Essentials",
  },
];

function CategoryItem({ category }: { category: (typeof categories)[number] }) {
  return (
    <Link href={""} className="block group">
      <div className="flex flex-col items-center space-y-2 ">
        {/* Category Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg overflow-hidden bg-gray-50 group-hover:shadow-md transition-shadow duration-300">
          <Image
            src={category.image}
            alt={category.title}
            fill
            sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Category Title */}
        <h3 className="text-sm font-medium text-[#2D2D2D] text-center line-clamp-2 group-hover:text-[#723881] transition-colors duration-300">
          {category.title}
        </h3>
      </div>
    </Link>
  );
}

export default function CategorySlider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="bg-white mt-6">
      <div className="py-2">
        {!mounted ? (
          /* Static fallback during prerender */
          <div className="flex  overflow-hidden px-4 ">
            {categories.slice(0, 4).map((category) => (
              <div
                key={category.title}
                className="w-20 sm:w-24 md:w-28 shrink-0"
              >
                <CategoryItem category={category} />
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
            slidesPerView={2.5}
            spaceBetween={16}
            breakpoints={{
              480: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 6,
                spaceBetween: 24,
              },
            }}
            grabCursor
            className="category-swiper w-full"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.title} className="h-auto">
                <CategoryItem category={category} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
