"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

type BannerItem = {
  id: number;
  name: string;
  image: string;
};

const mainBanner = {
  name: "Stacks",
  image:
    "https://media.drnutrition.com/media/Bu7cf6Olt4LhTnJ0PmfSSRVlFmR2nsCVp80ter2f.jpg",
};

const carouselItems: BannerItem[] = [
  {
    id: 1,
    name: "Team One EAA Pro With Electrolytes",
    image:
      "https://media.drnutrition.com/media/LnfOX3UwRXeYqoGhJQVfDgdqSORJOgdhLhTHsB51.jpg",
  },
  {
    id: 2,
    name: "La Roche Posay Effaclar Gel Face And Body",
    image:
      "https://media.drnutrition.com/media/v1NAerYDOyCcMRP1qXbkRAycxfZH1ET2GxpTPJ2X.jpg",
  },
  {
    id: 3,
    name: "Body Builder Marine Collagen",
    image:
      "https://media.drnutrition.com/media/IjD4CDo7AJKWxAK0yXCKn3aGPFkueNz3PZsyfU37.jpg",
  },
  {
    id: 4,
    name: "Optitect Zinc",
    image:
      "https://media.drnutrition.com/media/JwiGD5umGOqAI4C0q8fuk33xQBreY7mnl89q6iRw.jpg",
  },
  {
    id: 5,
    name: "Optitect Vitamin D3",
    image:
      "https://media.drnutrition.com/media/Xt6sBu2aQadAmqjQfbtBUMq3IzS3jYD8NpwiSWSk.jpg",
  },
  {
    id: 6,
    name: "QV Gentle Wash",
    image:
      "https://media.drnutrition.com/media/pcojxyTfZsi7Z7JwzUgD8gOjfeDjoEBun1Eot9OG.jpg",
  },
  {
    id: 7,
    name: "Laperva CLA Coffee 3 in 1",
    image:
      "https://media.drnutrition.com/media/6h0ZDXYZwqudKH1RHirvD5k5icmbbYRCJEgbGJkL.jpg",
  },
];

// Repeat the items to create a longer carousel for preview.
const products = [...carouselItems, ...carouselItems, ...carouselItems];

function BannerImage({
  image,
  name,
  aspectRatio,
}: {
  image: string;
  name: string;
  aspectRatio: string;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      style={{ aspectRatio }}
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}

export default function PromoBannerCarousel() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="mt-6 bg-white">
      <div className="w-full mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 items-stretch">
          {/* Main banner */}
          <div className="w-full lg:h-full">
            <BannerImage
              image={mainBanner.image}
              name={mainBanner.name}
              aspectRatio="2.66667 / 1"
            />
          </div>

          {/* Right-side carousel */}
          <div className="w-full lg:pl-0 lg:h-full">
            <div className="w-full h-auto lg:h-full">
              {!mounted ? (
                <div className="flex gap-3 overflow-hidden">
                  {products.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(25%-9px)]"
                    >
                      <BannerImage
                        image={item.image}
                        name={item.name}
                        aspectRatio="0.772227 / 1"
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
                  spaceBetween={12}
                  grabCursor
                  className="banner-and-carousel-swiper h-auto lg:!h-full"
                >
                  {products.map((item, index) => (
                    <SwiperSlide
                      key={`${item.id}-${index}`}
                      className="!h-auto !w-[calc(50%-6px)] sm:!w-[calc(33.333%-8px)] lg:!w-[calc(25%-9px)]"
                    >
                      <BannerImage
                        image={item.image}
                        name={item.name}
                        aspectRatio="0.772227 / 1"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
