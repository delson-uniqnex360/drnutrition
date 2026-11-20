import { getProducts } from "@/lib/products";
import { ProductRow } from "@/components/ProductCard";

export default function Home() {
  const products = getProducts();

  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>

      <ProductRow products={products} />
    </main>
  );
}
