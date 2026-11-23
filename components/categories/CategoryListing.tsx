"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type {
  ProductDetailData,
  ProductCardData,
} from "@/app/[slug]/ProductDetail";
import ProductCard from "@/components/ProductCard";
import { defaultLabels } from "@/app/[slug]/ProductDetail";

type CatalogItem = {
  ProductURL: string;
  product: ProductDetailData;
};

type Category = {
  name: string;
  slug: string;
};

type FilterOption = {
  value: string;
  count: number;
};

type FilterGroup = {
  key: string;
  label: string;
  options: FilterOption[];
};

type Props = {
  category: Category;
  products: CatalogItem[];
};

type Filters = Record<string, string[]>;

function getSlugFromHref(href?: string) {
  if (!href) return "";
  return (
    href.split("?")[0].replace(/\/+$/, "").split("/").pop()?.toLowerCase() ?? ""
  );
}

function getDetailValues(
  product: ProductDetailData,
  labels: string[],
): string[] {
  return (product.details ?? [])
    .filter((detail) =>
      labels.some((label) =>
        detail.label.toLowerCase().includes(label.toLowerCase()),
      ),
    )
    .map((detail) => detail.value.trim())
    .filter(Boolean);
}

function getProductType(product: ProductDetailData) {
  return getDetailValues(product, ["product type"]);
}

function getDietaryValues(product: ProductDetailData) {
  return [
    ...getDetailValues(product, ["dietary preference", "dietary", "diet"]),
    ...(product.tags ?? []).filter((tag) =>
      /vegan|vegetarian|gluten.free|keto|organic|halal|sugar.free|lactose.free/i.test(
        tag,
      ),
    ),
  ];
}

function getGenderValues(product: ProductDetailData) {
  return [
    ...getDetailValues(product, ["gender"]),
    ...(product.tags ?? []).filter((tag) =>
      /men|women|unisex|male|female/i.test(tag),
    ),
  ];
}

function getGoalValues(product: ProductDetailData) {
  return [
    ...getDetailValues(product, ["goal", "fitness goal", "health goal"]),
    ...(product.tags ?? []).filter((tag) =>
      /muscle gain|weight loss|weight gain|recovery|energy|performance|endurance/i.test(
        tag,
      ),
    ),
  ];
}

function getCategoryValues(product: ProductDetailData, currentSlug: string) {
  return (product.breadcrumbs ?? [])
    .filter((item) => {
      const slug = getSlugFromHref(item.href);
      return slug && slug !== currentSlug && slug !== "en-in";
    })
    .map((item) => item.name)
    .filter((name) => name && name.toLowerCase() !== "home");
}

function getDiscount(product: ProductDetailData) {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return 0;
  }

  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
}

function buildOptions(
  products: ProductDetailData[],
  getter: (product: ProductDetailData) => string[],
): FilterOption[] {
  const counts = new Map<string, number>();

  products.forEach((product) => {
    const values = new Set(
      getter(product)
        .map((value) => value.trim())
        .filter(Boolean),
    );

    values.forEach((value) => {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
}

function createFilterGroups(
  products: ProductDetailData[],
  currentSlug: string,
): FilterGroup[] {
  const groups: FilterGroup[] = [
    {
      key: "brands",
      label: "Brands",
      options: buildOptions(products, (product) =>
        product.brand?.name ? [product.brand.name] : [],
      ),
    },
    {
      key: "categories",
      label: "Categories",
      options: buildOptions(products, (product) =>
        getCategoryValues(product, currentSlug),
      ),
    },
    {
      key: "productType",
      label: "Product Type",
      options: buildOptions(products, getProductType),
    },
    {
      key: "dietary",
      label: "Dietary Preferences",
      options: buildOptions(products, getDietaryValues),
    },
    {
      key: "gender",
      label: "Gender",
      options: buildOptions(products, getGenderValues),
    },
    {
      key: "goals",
      label: "Goals",
      options: buildOptions(products, getGoalValues),
    },
    {
      key: "promotions",
      label: "Promotions",
      options: buildOptions(products, (product) =>
        product.offerLabel ? [product.offerLabel] : [],
      ),
    },
    {
      key: "discount",
      label: "Discount",
      options: buildOptions(products, (product) => {
        const discount = getDiscount(product);
        if (!discount) return [];
        if (discount >= 50) return ["50% and above"];
        if (discount >= 30) return ["30% - 49%"];
        if (discount >= 10) return ["10% - 29%"];
        return ["Below 10%"];
      }),
    },
  ];

  return groups.filter((group) => group.options.length > 0);
}

function matchesDiscount(product: ProductDetailData, value: string) {
  const discount = getDiscount(product);

  switch (value) {
    case "50% and above":
      return discount >= 50;
    case "30% - 49%":
      return discount >= 30 && discount < 50;
    case "10% - 29%":
      return discount >= 10 && discount < 30;
    case "Below 10%":
      return discount > 0 && discount < 10;
    default:
      return false;
  }
}

function matchesFilter(
  product: ProductDetailData,
  key: string,
  selected: string[],
  currentSlug: string,
) {
  if (selected.length === 0) return true;

  let values: string[] = [];

  switch (key) {
    case "brands":
      values = product.brand?.name ? [product.brand.name] : [];
      break;
    case "categories":
      values = getCategoryValues(product, currentSlug);
      break;
    case "productType":
      values = getProductType(product);
      break;
    case "dietary":
      values = getDietaryValues(product);
      break;
    case "gender":
      values = getGenderValues(product);
      break;
    case "goals":
      values = getGoalValues(product);
      break;
    case "promotions":
      values = product.offerLabel ? [product.offerLabel] : [];
      break;
    case "discount":
      return selected.some((value) => matchesDiscount(product, value));
    default:
      return true;
  }

  return selected.some((value) => values.includes(value));
}

function toProductCard(item: CatalogItem): ProductCardData {
  const product = item.product;

  return {
    id: product.id,
    name: product.name,
    href: item.ProductURL || product.variants?.[0]?.options?.[0]?.href || "#",
    image: product.image || product.images?.[0]?.url || "",
    price: product.price,
    originalPrice: product.originalPrice,
    currency: product.currency,
    discountPercentage: product.discountPercentage,
    rating: product.reviews?.average,
    express: product.express,
    offerLabel: product.offerLabel,
  };
}

export default function CategoryListing({ category, products }: Props) {
  const [filters, setFilters] = useState<Filters>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    promotions: true,
    categories: true,
  });
  const [filterSearch, setFilterSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [sort, setSort] = useState("recommended");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const productDetails = useMemo(
    () => products.map((item) => item.product),
    [products],
  );

  const filterGroups = useMemo(
    () => createFilterGroups(productDetails, category.slug),
    [productDetails, category.slug],
  );

  const prices = productDetails
    .map((product) => product.price)
    .filter((price) => Number.isFinite(price));

  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const highestPrice = prices.length ? Math.max(...prices) : 0;

  const activeFilterCount =
    Object.values(filters).reduce((total, values) => total + values.length, 0) +
    (minPrice !== "" ? 1 : 0) +
    (maxPrice !== "" ? 1 : 0);

  const filteredProducts = useMemo(() => {
    let result = products.filter(({ product }) => {
      const matchesSearch =
        !productSearch.trim() ||
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.brand?.name
          ?.toLowerCase()
          .includes(productSearch.toLowerCase());

      if (!matchesSearch) return false;

      // AND between filter groups, OR within each group.
      const matchesGroups = Object.entries(filters).every(([key, selected]) =>
        matchesFilter(product, key, selected, category.slug),
      );

      if (!matchesGroups) return false;

      if (filters.availability?.includes("In Stock") && !product.inStock) {
        return false;
      }

      if (filters.availability?.includes("Out of Stock") && product.inStock) {
        return false;
      }

      if (minPrice !== "" && product.price < Number(minPrice)) return false;
      if (maxPrice !== "" && product.price > Number(maxPrice)) return false;

      return true;
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.product.price - b.product.price);
    } else if (sort === "price-high") {
      result = [...result].sort((a, b) => b.product.price - a.product.price);
    } else if (sort === "name") {
      result = [...result].sort((a, b) =>
        a.product.name.localeCompare(b.product.name),
      );
    }

    return result;
  }, [
    products,
    filters,
    category.slug,
    productSearch,
    minPrice,
    maxPrice,
    sort,
  ]);

  function toggleFilter(key: string, value: string) {
    setFilters((previous) => {
      const selected = previous[key] ?? [];
      const next = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];

      return { ...previous, [key]: next };
    });
  }

  function clearAll() {
    setFilters({});
    setMinPrice("");
    setMaxPrice("");
    setProductSearch("");
    setFilterSearch("");
  }

  const visibleFilterGroups = filterGroups.map((group) => ({
    ...group,
    options: group.options.filter((option) =>
      option.value.toLowerCase().includes(filterSearch.toLowerCase()),
    ),
  }));

  return (
    <main className="mx-auto w-full max-w-[1450px] px-4 py-5 sm:px-6 lg:px-4">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex min-w-0 items-center gap-2 overflow-x-auto text-sm text-gray-600"
      >
        <Link href="/" className="shrink-0 hover:text-primary">
          Home
        </Link>
        <span className="shrink-0 text-gray-400">›</span>
        <Link href="/categories" className="shrink-0 hover:text-primary">
          Categories
        </Link>
        <span className="shrink-0 text-gray-400">›</span>
        <span className="truncate font-medium text-gray-900">
          {category.name}
        </span>
      </nav>

      {/* Category heading */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
          {category.name}
        </h1>
      </div>

      {/* Search and sorting */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={productSearch}
          onChange={(event) => setProductSearch(event.target.value)}
          placeholder={`Search ${category.name}...`}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary sm:max-w-sm"
        />

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-gray-500">
            {filteredProducts.length} products
          </span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
            aria-label="Sort products"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Filters */}
        <aside className="h-fit rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-800">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={clearAll}
              className="text-sm font-medium text-primary hover:opacity-80"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-[calc(100dvh-12rem)] overflow-y-auto px-4">
            {/* Availability */}
            <FilterSection
              title="Availability"
              open={expanded.availability ?? false}
              onToggle={() =>
                setExpanded((previous) => ({
                  ...previous,
                  availability: !previous.availability,
                }))
              }
            >
              {["In Stock", "Out of Stock"].map((value) => (
                <FilterCheckbox
                  key={value}
                  label={value}
                  checked={(filters.availability ?? []).includes(value)}
                  onChange={() => toggleFilter("availability", value)}
                />
              ))}
            </FilterSection>

            {visibleFilterGroups.map((group) => (
              <FilterSection
                key={group.key}
                title={group.label}
                open={expanded[group.key] ?? false}
                onToggle={() =>
                  setExpanded((previous) => ({
                    ...previous,
                    [group.key]: !previous[group.key],
                  }))
                }
              >
                {group.options.length > 5 && (
                  <input
                    value={filterSearch}
                    onChange={(event) => setFilterSearch(event.target.value)}
                    placeholder={`Search ${group.label.toLowerCase()}...`}
                    className="mb-2 w-full rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                )}

                {group.options.map((option) => (
                  <FilterCheckbox
                    key={option.value}
                    label={option.value}
                    count={option.count}
                    checked={(filters[group.key] ?? []).includes(option.value)}
                    onChange={() => toggleFilter(group.key, option.value)}
                  />
                ))}

                {group.options.length === 0 && (
                  <p className="py-2 text-sm text-gray-400">
                    No matching options
                  </p>
                )}
              </FilterSection>
            ))}

            {/* Price range */}
            <FilterSection
              title="Price Range"
              open={expanded.price ?? true}
              onToggle={() =>
                setExpanded((previous) => ({
                  ...previous,
                  price: !previous.price,
                }))
              }
            >
              <div className="grid grid-cols-2 gap-2 pb-3">
                <label className="text-xs text-gray-500">
                  Min ({productDetails[0]?.currency ?? ""})
                  <input
                    type="number"
                    min={lowestPrice}
                    max={highestPrice}
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder={String(lowestPrice)}
                    className="mt-1 w-full rounded-md border border-gray-200 px-2 py-2 text-sm"
                  />
                </label>
                <label className="text-xs text-gray-500">
                  Max ({productDetails[0]?.currency ?? ""})
                  <input
                    type="number"
                    min={lowestPrice}
                    max={highestPrice}
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder={String(highestPrice)}
                    className="mt-1 w-full rounded-md border border-gray-200 px-2 py-2 text-sm"
                  />
                </label>
              </div>
            </FilterSection>
          </div>
        </aside>

        {/* Product grid */}
        <section className="min-w-0">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((item) => {
                const product = item.product;

                const image = product.image || product.images?.[0]?.url;

                if (!image) return null;

                return <ProductCard key={product.id} item={item} />;
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white px-5 py-16 text-center">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                No products found
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Try changing your filters or search.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="font-bold text-gray-800">{title}</span>
        <span className="text-gray-400">{open ? "⌃" : "⌄"}</span>
      </button>

      {open && <div className="space-y-2 pb-3">{children}</div>}
    </div>
  );
}

function FilterCheckbox({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <span className="min-w-0 flex-1 text-sm text-gray-700">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-gray-500">({count})</span>
      )}
    </label>
  );
}
