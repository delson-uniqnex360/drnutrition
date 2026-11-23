"use client"

import Link from "next/link";
import type { CategoryItem } from "@/lib/categories";

const CARD =
  "group flex h-[125px] flex-col justify-between rounded-2xl border p-5 transition";

function CategoryCard({
  item,
  onNavigate,
}: {
  item: CategoryItem;
  onNavigate?: () => void;
}) {
  const badge = (active: boolean) =>
    `flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${
      active ? "bg-purple-100 text-[#783781]" : "bg-gray-100 text-gray-400"
    }`;

  if (!item.href) {
    return (
      <div
        aria-disabled="true"
        title="Coming soon"
        className={`${CARD} cursor-not-allowed border-gray-100 bg-gray-50/60 opacity-60`}
      >
        <span className={badge(false)}>{item.id}</span>
        <span className="text-sm font-semibold text-gray-400">
          {item.label}
        </span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`${CARD} border-gray-200 bg-white hover:border-[#783781]/40 hover:shadow-md`}
    >
      <span className={badge(true)}>{item.id}</span>
      <span className="text-sm font-semibold text-gray-900 group-hover:text-[#783781]">
        {item.label}
      </span>
    </Link>
  );
}

export default function CategoryGrid({
  items,
  viewAllHref,
  onNavigate,
}: {
  items: CategoryItem[];
  viewAllHref?: string; // omit to hide the "View all" card
  onNavigate?: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {items.map((item) => (
        <CategoryCard key={item.slug} item={item} onNavigate={onNavigate} />
      ))}

      {viewAllHref && (
        <Link
          href={viewAllHref}
          onClick={onNavigate}
          className={`${CARD} border-dashed border-gray-300 bg-gray-50 hover:border-[#783781] hover:bg-purple-50`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-[#783781]">
            ›
          </span>
          <span className="text-sm font-semibold text-gray-900">View all</span>
        </Link>
      )}
    </div>
  );
}
