"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

const banners = [
  {
    name: "vichy",
    image:
      "https://media.drnutrition.com/media/gb1KXtJ8IfOmzVRyQqZsTXXsfqVtxFTM81IWm3ar.jpg",
    href: "/brands/vichy",
  },
  {
    name: "solaray",
    image:
      "https://media.drnutrition.com/media/T65zKbQi9XSINT0GlIyBlCZt3xa6duy2Tyskmuea.jpg",
    href: "/brands/solaray",
  },
];

export default function BrandBannerSlider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="mt-6 bg-white">
      <div className="py-2">
        {mounted ? (
          <Swiper
            modules={[Autoplay]}
            className="banner-carousel"
            dir="ltr"
            slidesPerView="auto"
            spaceBetween={16}
            slidesOffsetBefore={16}
            slidesOffsetAfter={16}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop
          >
            {banners.map((banner) => (
              <SwiperSlide
                key={banner.name}
                className="!h-auto"
                style={{
                  width: "50%",
                }}
              >
                <Link href={banner.href} className="block">
                  <Image
                    src={banner.image}
                    alt={banner.name}
                    width={1340}
                    height={450}
                    sizes="50vw"
                    className="block h-auto w-full rounded-lg"
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex gap-4 overflow-hidden pl-4">
            {banners.map((banner) => (
              <Link
                key={banner.name}
                href={banner.href}
                className="block w-1/2 shrink-0"
              >
                <Image
                  src={banner.image}
                  alt={banner.name}
                  width={1340}
                  height={450}
                  sizes="50vw"
                  className="block h-auto w-full rounded-lg"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
