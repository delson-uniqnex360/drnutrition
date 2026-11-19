import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProducts } from "@/api/product";
import { Product } from "@/types/product";
import { generateSlug } from "@/utils/helpers";
import ProductDetail from "./ProductDetail";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ProductPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="p-6">Loading product...</div>}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: Props) {
  const { slug } = await params;

  const products: Product[] = getProducts();

  const product = products.find(
    (item) => generateSlug(item.Title || item.productName) === slug,
  );

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
