import { notFound } from "next/navigation";
//@ts-ignore
import CategoryListing from "@/components/categories/CategoryListing";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { getProducts } from "@/lib/products";
import type { ProductDetailData } from "@/app/[slug]/ProductDetail";

export const instant = false;

type CatalogItem = {
  ProductURL: string;
  product: ProductDetailData;
};

export function generateStaticParams() {
  const allProducts = getProducts() as CatalogItem[];

  const slugs = new Set(CATEGORY_CONFIG.map((category) => category.slug));

  allProducts.forEach(({ product }) => {
    product.categories?.forEach((item) => {
      const slug = getSlugFromHref(item.href);
      if (slug) slugs.add(slug);
    });

    product.breadcrumbs?.forEach((item) => {
      const slug = getSlugFromHref(item.href);
      if (slug && slug !== "en-in") slugs.add(slug);
    });
  });

  return [...slugs].map((slug) => ({ slug }));
}

function getSlugFromHref(href?: string) {
  if (!href) return "";

  const cleanPath = href.split("?")[0].replace(/\/+$/, "");

  return cleanPath.split("/").pop()?.toLowerCase() ?? "";
}

// Check both categories and breadcrumbs.
function belongsToCategory(product: ProductDetailData, slug: string) {
  const categorySlugs = [
    ...(product.categories ?? []).map((item) => getSlugFromHref(item.href)),
    ...(product.breadcrumbs ?? []).map((item) => getSlugFromHref(item.href)),
  ];

  return categorySlugs.includes(slug.toLowerCase());
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const allProducts = getProducts() as CatalogItem[];

  // Find products using both categories and breadcrumbs.
  const products = allProducts.filter(({ product }) =>
    belongsToCategory(product, slug),
  );

  // First check the existing hardcoded category configuration.
  const configuredCategory = CATEGORY_CONFIG.find(
    (item) => item.slug.toLowerCase() === slug.toLowerCase(),
  );

  // If not configured, find the category name from product data.
  const productCategory = allProducts
    .flatMap(({ product }) => [
      ...(product.categories ?? []),
      ...(product.breadcrumbs ?? []),
    ])
    .find((item) => getSlugFromHref(item.href) === slug.toLowerCase());

  const categoryName = configuredCategory?.label || productCategory?.name;

  if (!categoryName || products.length === 0) {
    notFound();
  }

  return (
    <CategoryListing
      category={{
        name: categoryName,
        slug,
      }}
      products={products}
    />
  );
}
