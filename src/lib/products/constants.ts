import type { ProductCategory } from "@/generated/prisma";

/** Human-readable labels for `ProductCategory` (UI + filters). */
export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  APPAREL: "Apparel",
  FOOTWEAR: "Footwear",
  ACCESSORIES: "Accessories",
  T_SHIRT: "T-Shirt",
  HOODIE: "Hoodie",
  JACKET: "Jacket",
  PANTS: "Pants",
};

/** Only show top-level categories in primary filters. */
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "APPAREL",
  "FOOTWEAR",
  "ACCESSORIES",
];

/** Default size chips for admin / filters (products store their own `sizes` array). */
export const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
