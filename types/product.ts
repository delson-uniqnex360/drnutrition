export type Product = {
  productName: string | null;
  brandName: string | null;
  SKU: string | null;
  MPN: string | null;
  ProductURL: string | null;
  Title: string | null;
  Description: string | null;
  Features: string | null;
  ProductSpecifications: string | null;
  ImageURL: string | null;

  Price?: string | number | null;
  OriginalPrice?: string | number | null;

  BrandLogo?: string | null;
  Category?: string | null;
  Currency?: string | null;
  SoldRecently?: string | null;

  Variants?:
    | {
        name?: string | null;
        options?:
          | {
              label?: string | null;
              image?: string | null;
            }[]
          | null;
      }[]
    | null;
};
