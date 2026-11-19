import Link from "next/link";

import { getProducts } from "@/api/product";
import { Product } from "@/types/product";
import { generateSlug } from "@/utils/helpers";

import { ProductRow } from "@/components/ProductCard";

export default function Home() {
  const products: Product[] = getProducts();

  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>

      <div className="">
        {/* {products.map((product, index) => (
          <Link
            key={`${product.SKU}-${index}`}
            href={`/${generateSlug(product.Title || product.productName)}`}
            className="rounded-lg border p-5 transition hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold">
              {product.Title || product.productName}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Brand: {product.brandName}
            </p>

            <p className="mt-1 text-sm text-gray-500">SKU: {product.SKU}</p>
          </Link>
        ))} */}
        <ProductRow products={products} />
      </div>
    </main>
  );
}
