import { getProducts } from "@/lib/products";

export interface CategoryConfig {
  label: string;
  slug: string;
  aliases?: string[];
  href?: string;
}

export interface CategoryChild {
  id: string;
  label: string;
  slug: string;
  count: number;
  href: string | null;
}

export interface CategoryItem {
  id: string;
  label: string;
  slug: string;
  count: number;
  available: boolean;
  href: string | null;
  children: CategoryChild[];
}

export const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    label: "Sports Nutrition",
    slug: "sports-nutrition",
    aliases: ["sport nutrition"],
  },
  {
    label: "Health & Wellness",
    slug: "health-wellness",
    aliases: ["wellness", "health"],
  },
  {
    label: "Beauty & Care",
    slug: "beauty-care",
    aliases: ["beauty", "personal care"],
  },
  {
    label: "Fitness Machines",
    slug: "fitness-machines",
    aliases: ["fitness equipment"],
  },
  {
    label: "Weight Management",
    slug: "weight-management",
    aliases: ["weight loss"],
  },
  {
    label: "Healthy Foods",
    slug: "healthy-foods",
    aliases: ["healthy food", "food"],
  },
  {
    label: "Gym Essentials",
    slug: "gym-essentials",
    aliases: ["gym accessories"],
  },
  { label: "Healthcare", slug: "healthcare", aliases: ["health care"] },
];

export const CATEGORIES_BASE_PATH = "/categories";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");

function getBreadcrumbs(product: any): { name: string; href: string }[] {
  if (!Array.isArray(product?.breadcrumbs)) return [];

  return product.breadcrumbs
    .map((item: any) => ({
      name: typeof item === "string" ? item : (item?.name ?? ""),
      href: typeof item === "object" ? (item?.href ?? "") : "",
    }))
    .filter((item: any) => item.name);
}

function getProductCategoryNames(product: any): string[] {
  const raw = [
    product?.category,
    product?.categories,
    product?.Category,
    product?.categoryName,
  ].flat(Infinity);

  return raw
    .map((item: any) =>
      typeof item === "string" ? item : (item?.name ?? item?.label ?? ""),
    )
    .filter(Boolean);
}

export function getCategories(): CategoryItem[] {
  const products = getProducts();

  return CATEGORY_CONFIG.map((config, index) => {
    const keys = [config.label, config.slug, ...(config.aliases ?? [])].map(
      normalize,
    );

    const matchingProducts = products.filter(({ product }) => {
      const names = [
        ...getProductCategoryNames(product),
        ...getBreadcrumbs(product).map((item) => item.name),
      ].map(normalize);

      return keys.some((key) => names.includes(key));
    });

    const childrenMap = new Map<string, CategoryChild>();

    matchingProducts.forEach(({ product }) => {
      const breadcrumbs = getBreadcrumbs(product);

      const parentIndex = breadcrumbs.findIndex((item) =>
        keys.includes(normalize(item.name)),
      );

      if (parentIndex === -1) return;

      const child = breadcrumbs[parentIndex + 1];

      if (!child || normalize(child.name) === normalize(product.name)) return;

      const slug =
        child.href.split("/").filter(Boolean).pop() || normalize(child.name);

      const existing = childrenMap.get(slug);

      if (existing) {
        existing.count += 1;
      } else {
        childrenMap.set(slug, {
          id: slug,
          label: child.name,
          slug,
          count: 1,
          href: `${CATEGORIES_BASE_PATH}/${slug}`,
        });
      }
    });

    const children = Array.from(childrenMap.values());

    return {
      id: String(index + 1).padStart(2, "0"),
      label: config.label,
      slug: config.slug,
      count: matchingProducts.length,
      available: matchingProducts.length > 0,
      href:
        config.href ??
        (matchingProducts.length > 0
          ? `${CATEGORIES_BASE_PATH}/${config.slug}`
          : null),
      children,
    };
  });
}
