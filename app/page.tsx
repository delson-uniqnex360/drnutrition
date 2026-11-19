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
        <ProductRow products={products} />
      </div>
    </main>
  );
}
