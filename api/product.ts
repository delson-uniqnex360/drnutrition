// import fs from "fs";
// import path from "path";
// import { Product } from "@/types/product";

// function toNullableString(value: unknown): string | null {
//   if (value === null || value === undefined || value === "") {
//     return null;
//   }

//   return String(value);
// }

// function toNullablePrice(value: unknown): string | number | null {
//   if (value === null || value === undefined || value === "") {
//     return null;
//   }

//   if (typeof value === "number" || typeof value === "string") {
//     return value;
//   }

//   return null;
// }

// export function getProducts(): Product[] {
//   const filePath = path.join(process.cwd(), "public", "data", "product.json");

//   if (!fs.existsSync(filePath)) {
//     return [];
//   }

//   const fileContents = fs.readFileSync(filePath, "utf-8");

//   const data: unknown = JSON.parse(fileContents);

//   if (!Array.isArray(data)) {
//     return [];
//   }

//   return data.map(
//     (item: Record<string, unknown>): Product => ({
//       productName: toNullableString(item.productName),
//       brandName: toNullableString(item.brandName),
//       SKU: toNullableString(item.SKU),
//       MPN: toNullableString(item.MPN),
//       ProductURL: toNullableString(item.ProductURL),
//       Title: toNullableString(item.Title),
//       Description: toNullableString(item.Description),
//       Features: toNullableString(item.Features),
//       ProductSpecifications: toNullableString(item.ProductSpecifications),
//       ImageURL: toNullableString(item.ImageURL),

//       Price: toNullablePrice(item.Price),
//       OriginalPrice: toNullablePrice(item.OriginalPrice),

//       BrandLogo: toNullableString(item.BrandLogo),
//       Category: toNullableString(item.Category),
//       Currency: toNullableString(item.Currency),
//       SoldRecently: toNullableString(item.SoldRecently),

//       Variants: Array.isArray(item.Variants)
//         ? (item.Variants as Product["Variants"])
//         : null,
//     }),
//   );
// }

import fs from "fs";
import path from "path";
import { ProductDetailData } from "@/app/[slug]/ProductDetail";

export interface ProductCatalogItem {
  ProductURL: string;
  product: ProductDetailData;
}

const PRODUCT_FILE = path.join(
  process.cwd(),
  "public",
  "data",
  "product_v2.json",
);

export function getProducts(): ProductCatalogItem[] {
  try {
    if (!fs.existsSync(PRODUCT_FILE)) {
      return [];
    }

    const fileContents = fs.readFileSync(PRODUCT_FILE, "utf-8");
    const data = JSON.parse(fileContents);

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to read product_v2.json:", error);
    return [];
  }
}

export function getProductByUrl(url: string): ProductCatalogItem | undefined {
  return getProducts().find((item) => item.ProductURL === url);
}
