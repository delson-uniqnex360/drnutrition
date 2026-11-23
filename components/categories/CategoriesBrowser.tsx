"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryItem } from "@/lib/categories";

interface Props {
  categories: CategoryItem[];
}

const categoryImages: Record<string, string> = {
  "sports-nutrition":
    "https://media.drnutrition.com/media/WxSJ1uPGtbwDizF6M3dHChvwDbyZJb0WtIzPkUSr.png",
  "health-wellness":
    "https://media.drnutrition.com/media/wpGvdIVkKD1TaFDs2utgiOPDlwBIjFODGNqCutfZ.png",
  "beauty-care":
    "https://media.drnutrition.com/media/IHo18ZzIdr9mF3PiFqBxReQjOCvCyjSeXsXh1ZHs.png",
  "weight-management":
    "https://media.drnutrition.com/media/MalKdP0ybMTeJE5nlnO1dzquXLJqrbMnvbfFkDht.png",
  "healthy-foods":
    "https://media.drnutrition.com/media/OyEPMHwHVREQ0ZNcnMTk0Vc35pnjGTpb7Q3kGlpW.png",
  "gym-essentials":
    "https://media.drnutrition.com/media/v7aRRkXkKKFAfJH6XwWhcwRvc4FsnlLKHVGHMXRU.jpg",
  "fitness-machines":
    "https://media.drnutrition.com/media/P9eeZpafpSM5B6rkCGvj5sgUhySOWe3uCD50QrMW.png",
  healthcare:
    "https://media.drnutrition.com/media/KKlrWTfwUnD7fEqJq2ThWNgsNN2f9ChxtuFHhdHg.png",
};

export default function CategoriesBrowser({ categories }: Props) {
  const [selectedId, setSelectedId] = useState(
    categories.find((item) => item.available)?.id ?? categories[0]?.id,
  );

  const selectedCategory = categories.find((item) => item.id === selectedId);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page heading */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1450px] px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            All Categories
          </h1>
        </div>
      </div>

      {/* Category layout */}
      <div className="mx-auto flex h-[calc(100vh-65px)] max-w-[1450px] overflow-hidden bg-white">
        {/* Left: Main categories */}
        <aside className="w-[40%] shrink-0 overflow-y-auto border-e border-gray-200 bg-white sm:w-[35%] md:w-[32%]">
          <div className="divide-y divide-gray-200">
            {categories.map((category) => {
              const active = selectedId === category.id;
              const image = categoryImages[category.slug];

              return (
                <button
                  key={category.id}
                  type="button"
                  disabled={!category.available}
                  onClick={() => setSelectedId(category.id)}
                  className={`w-full px-2 py-3 text-start transition-colors sm:px-4 sm:py-4 ${
                    active
                      ? "bg-[#783781] text-white"
                      : category.available
                        ? "text-gray-700 hover:bg-gray-50"
                        : "cursor-not-allowed text-gray-400 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:h-12 sm:w-12 ${
                        active ? "bg-white/20" : "bg-gray-100"
                      }`}
                    >
                      {image && (
                        <Image
                          src={image}
                          alt={category.label}
                          fill
                          sizes="48px"
                          className="object-contain p-1 sm:p-2"
                        />
                      )}
                    </div>

                    <span className="min-w-0 flex-1 truncate text-xs font-medium sm:text-sm md:text-base">
                      {category.label}
                    </span>

                    {category.count > 0 && (
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] sm:text-xs ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {category.count}
                      </span>
                    )}

                    {active && (
                      <svg
                        className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right: Subcategories */}
        <section className="w-[60%] flex-1 overflow-y-auto bg-white p-3 sm:p-5 md:p-6">
          {selectedCategory && (
            <>
              <div className="mb-5 border-b border-gray-200 pb-4">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  {selectedCategory.label}
                </h2>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Explore our selection
                </p>
              </div>

              {
                //@ts-ignore
                selectedCategory.children.length > 0 ? (
                  <div className="space-y-2">
                    {
                      //@ts-ignore
                      selectedCategory.children.map((child) => {
                        const content = (
                          <div className="flex items-center justify-between gap-3">
                            <span className="min-w-0 flex-1 truncate text-xs font-medium text-gray-900 sm:text-sm md:text-base">
                              {child.label}
                            </span>

                            <span className="shrink-0 rounded bg-gray-200 px-2 py-1 text-[10px] text-gray-500 sm:text-xs">
                              {child.count}
                            </span>
                          </div>
                        );

                        return child.href && child.count > 0 ? (
                          <Link
                            key={child.id}
                            href={child.href}
                            className="block rounded-lg bg-gray-50 px-3 py-3 transition-colors hover:bg-gray-100 sm:px-4"
                          >
                            {content}
                          </Link>
                        ) : (
                          <div
                            key={child.id}
                            className="cursor-not-allowed rounded-lg bg-gray-50 px-3 py-3 opacity-50 sm:px-4"
                          >
                            {content}
                          </div>
                        );
                      })
                    }
                  </div>
                ) : (
                  <p className="py-12 text-center text-sm text-gray-400">
                    No subcategories available yet.
                  </p>
                )
              }
            </>
          )}
        </section>
      </div>
    </main>
  );
}
