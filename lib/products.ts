import fs from "node:fs";
import path from "node:path";
import type { ProductCatalogItem } from "@/types/product";

const PRODUCT_FILE = path.join(
  process.cwd(),
  "public",
  "data",
  "productv2.json",
);

export function getProducts(): ProductCatalogItem[] {
  try {
    const file = fs.readFileSync(PRODUCT_FILE, "utf-8");
    return JSON.parse(file) as ProductCatalogItem[];
  } catch (error) {
    console.error("Failed to load products:", error);
    return [];
  }
}

export function getProductBySlug(slug: string): ProductCatalogItem | undefined {
  const products = getProducts();

  // 1. Check the main product URL
  const mainProduct = products.find((item) => {
    try {
      return (
        new URL(item.ProductURL).pathname.split("/").filter(Boolean).pop() ===
        slug
      );
    } catch {
      return false;
    }
  });

  if (mainProduct) {
    return mainProduct;
  }

  // 2. Search variant URLs
  for (const item of products) {
    const matchedVariant = item.product.variants
      ?.flatMap((group) => group.options)
      .find((option) => {
        if (!option.href) return false;

        try {
          return (
            new URL(option.href, item.ProductURL).pathname
              .split("/")
              .filter(Boolean)
              .pop() === slug
          );
        } catch {
          return false;
        }
      });

    if (matchedVariant) {
      const updatedProduct = {
        ...item.product,
        variants: item.product.variants?.map((group) => ({
          ...group,
          selectedId: group.options.some(
            (option) => option.id === matchedVariant.id,
          )
            ? matchedVariant.id
            : group.selectedId,
        })),
      };

      return {
        ...item,
        product: updatedProduct,
      };
    }
  }

  return undefined;
}
