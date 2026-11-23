"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import CategoryGrid from "./CategoryGrid";

interface CategoryItem {
  id: string;
  label: string;
  slug: string;
  count: number;
  available: boolean;
  href: string | null;
}

let cache: CategoryItem[] | null = null;

export default function CategoriesMenu({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CategoryItem[]>(cache ?? []);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = useCallback(async () => {
    clearTimeout(timer.current);
    setOpen(true);

    if (cache) return;

    try {
      const res = await fetch("/api/categories");

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await res.json();

      cache = data.categories ?? [];
      //@ts-ignore
      setItems(cache);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  }, []);

  const hide = useCallback(() => {
    timer.current = setTimeout(() => setOpen(false), 150);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          hide();
        }
      }}
    >
      <Link
        href="/categories"
        aria-expanded={open}
        aria-haspopup="true"
        className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 transition-colors ${
          open ? "bg-purple-100 text-purple-800" : "hover:text-purple-800"
        }`}
      >
        {label}
      </Link>

      {open && (
        <div className="fixed left-0 top-[var(--menu-top,180px)] z-50 w-screen pt-2">
          {" "}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-5 border-b border-gray-200 pb-4">
              <h2 className="border-l-4 border-[#783781] pl-3 text-xl font-bold">
                All Categories
              </h2>

              <p className="pl-4 text-sm text-gray-500">
                Explore our selection
              </p>
            </div>

            {items.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-400">
                Loading…
              </p>
            ) : (
              <CategoryGrid
                //@ts-ignore
                items={items}
                viewAllHref="/categories"
                onNavigate={() => setOpen(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
