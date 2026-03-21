import type { ProductCategory } from "@prisma/client";

/** Human-readable labels for `ProductCategory` (UI + filters). */
export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  T_SHIRT: "T-Shirt",
  HOODIE: "Hoodie",
  JACKET: "Jacket",
  PANTS: "Pants",
  ACCESSORIES: "Accessories",
};

export const PRODUCT_CATEGORIES = Object.keys(
  PRODUCT_CATEGORY_LABELS
) as ProductCategory[];

/** Default size chips for admin / filters (products store their own `sizes` array). */
export const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
