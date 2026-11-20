import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";
import { getProductBySlug } from "@/lib/products";

export const instant = false;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const selectedProduct = getProductBySlug(slug);

  if (!selectedProduct) {
    notFound();
  }

  return <ProductDetail product={selectedProduct.product} />;
}
