export type Product = {
  productName: string;
  brandName: string;
  SKU: string;
  MPN: string;
  ProductURL: string;
  Title: string;
  Description: string;
  Features: string;
  ProductSpecifications: string;

  ImageURL?: string | null;
  Price?: string | number | null;
  OriginalPrice?: string | number | null;

  BrandLogo?: string | null;
  Category?: string | null;
  Currency?: string | null;
  SoldRecently?: string | null;
  Variants?:
    | {
        name?: string | null;
        options?: { label?: string | null; image?: string | null }[] | null;
      }[]
    | null;
};
