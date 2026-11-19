import fs from "fs";
import path from "path";
import { Product } from "@/types/product";

export function getProducts(): Product[] {
  const filePath = path.join(process.cwd(), "public", "data", "product.json");

  if (!fs.existsSync(filePath)) {
    throw new Error(`Product JSON file not found: ${filePath}`);
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");

  if (!fileContents.trim()) {
    return [];
  }

  try {
    const data: unknown = JSON.parse(fileContents);

    if (!Array.isArray(data)) {
      console.error("Invalid product JSON: Expected an array");
      return [];
    }

    return data
      .filter(
        (item): item is Record<string, unknown> =>
          item !== null && typeof item === "object" && !Array.isArray(item),
      )
      .map((item) => ({
        productName:
          typeof item.productName === "string" ? item.productName : null,

        brandName: typeof item.brandName === "string" ? item.brandName : null,

        SKU: typeof item.SKU === "string" ? item.SKU : null,

        MPN: typeof item.MPN === "string" ? item.MPN : null,

        ProductURL:
          typeof item.ProductURL === "string" ? item.ProductURL : null,

        Title: typeof item.Title === "string" ? item.Title : null,

        Description:
          typeof item.Description === "string" ? item.Description : null,

        Features: typeof item.Features === "string" ? item.Features : null,

        ProductSpecifications:
          typeof item.ProductSpecifications === "string"
            ? item.ProductSpecifications
            : null,

        ImageURL: typeof item.ImageURL === "string" ? item.ImageURL : null,

        Price: item.Price ?? null,
        OriginalPrice: item.OriginalPrice ?? null,
      }));
  } catch (error) {
    console.error("Failed to parse product.json:", error);
    throw new Error("Invalid product JSON file");
  }
}
