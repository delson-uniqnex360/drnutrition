import CategoriesBrowser from "@/components/categories/CategoriesBrowser";
import { getCategories } from "@/lib/categories";

export default function CategoriesPage() {
  const categories = getCategories();

  return <CategoriesBrowser categories={categories} />;
}
