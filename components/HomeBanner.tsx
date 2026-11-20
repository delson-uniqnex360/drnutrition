"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const banners = [
  {
    title: "Black Friday Sale",
    image:
      "https://media.drnutrition.com/media/oEAnbeETcDcNfdDT5APd9AXb5amMlYfTakZQdqiV.jpg",
    link: "/event/black-friday",
  },
  {
    title: "AN Free Gift",
    image:
      "https://media.drnutrition.com/media/BBaAB3d3oWGTdxdKd97JbEfI1nbyAz6x0Lb32JtL.jpg",
    link: "/offers/get-1-box-keto-cola-free",
  },
  {
    title: "AN Sparkling Protein Water FREE CANS",
    image:
      "https://media.drnutrition.com/media/d92hYjX0WOJo1hEFjd5v8DTm80aWTY1SvgU4GSJY.jpg",
    link: "/offers/get-5-an-sparkling-protein-water-free",
  },
  {
    title: "ARI & CO BRAND",
    image:
      "https://media.drnutrition.com/media/icfVTZOtdUdB3MeWgMsyYn6yQHzJXKBsKISif7NH.jpg",
    link: "/brands/ari-co",
  },
  {
    title: "Stacks",
    image:
      "https://media.drnutrition.com/media/Jrg2bQIkIoBRBoHW4lJf72skIAND7lq8IVvu5gHL.jpg",
    link: "/stacks",
    target: "_blank",
  },
  {
    title: "Laperva",
    image:
      "https://media.drnutrition.com/media/MFiC9OkAdMAs2pysxfQMEIdtjgagjeD9odXYuxE7.jpg",
    link: "/label/bundle-offers",
  },
  {
    title: "MuscleTech",
    image:
      "https://media.drnutrition.com/media/67wvXDICWk3uqWc6rpNhqP5dGJqgost3LRGhAv5s.jpg",
    link: "/brands/muscletech",
  },
];

const mobileBanners = [banners[6], ...banners.slice(0, 6)];

function BannerImage({
  banner,
  priority = false,
}: {
  banner: (typeof banners)[number];
  priority?: boolean;
}) {
  return (
    <Link
      href={""}
      target={banner.target || "_self"}
      rel={banner.target === "_blank" ? "noopener noreferrer" : undefined}
      className="block w-full"
    >
      <div className="relative w-full aspect-[8/5] overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
        <Image
          src={banner.image}
          alt={banner.title}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
      </div>
    </Link>
  );
}

export default function HomeBanner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="mt-6">
      <div className="mx-auto w-full">
        {!mounted ? (
          /* Static fallback during prerender */
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
            <div className="lg:col-span-2">
              <BannerImage banner={banners[0]} priority />
            </div>

            <div className="hidden lg:grid grid-cols-1 gap-3 lg:gap-4">
              <BannerImage banner={banners[5]} />
              <BannerImage banner={banners[6]} />
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Slider */}
            <div className="lg:hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                spaceBetween={16}
                loop
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                className="main-banner-mobile-swiper"
              >
                {mobileBanners.map((banner, index) => (
                  <SwiperSlide key={banner.title} className="!h-auto">
                    <BannerImage banner={banner} priority={index === 0} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-3 lg:gap-4 items-start">
              {/* Main Slider */}
              <div className="w-full lg:col-span-2 rounded-lg">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  slidesPerView={1}
                  spaceBetween={0}
                  loop
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  className="main-banner-swiper rounded-lg"
                >
                  {banners.slice(0, 5).map((banner, index) => (
                    <SwiperSlide key={banner.title} className="!h-auto">
                      <BannerImage banner={banner} priority={index === 0} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Right Side Banners */}
              <div className="w-full lg:col-span-1">
                <div className="grid grid-cols-1 gap-3 lg:gap-4">
                  <BannerImage banner={banners[5]} />
                  <BannerImage banner={banners[6]} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .main-banner-mobile-swiper .swiper-pagination,
        .main-banner-swiper .swiper-pagination {
          position: relative;
          margin-top: 12px;
        }

        .main-banner-mobile-swiper .swiper-pagination-bullet,
        .main-banner-swiper .swiper-pagination-bullet {
          background: #999;
          opacity: 0.5;
        }

        .main-banner-mobile-swiper .swiper-pagination-bullet-active,
        .main-banner-swiper .swiper-pagination-bullet-active {
          background: #222;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
