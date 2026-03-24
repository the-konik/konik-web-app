import { z } from "zod";
import type { ProductCategory } from "@/generated/prisma";

const categories = [
  "T_SHIRT",
  "HOODIE",
  "JACKET",
  "PANTS",
  "ACCESSORIES",
] as const satisfies readonly ProductCategory[];

export const productCategorySchema = z.enum(categories);

const priceInput = z.union([
  z.number().nonnegative(),
  z.string().transform((s) => {
    const n = parseFloat(s);
    if (Number.isNaN(n) || n < 0) throw new Error("Invalid price");
    return n;
  }),
]);

export const productCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().min(1, "Description is required"),
  price: priceInput,
  category: productCategorySchema,
  images: z.array(z.string().url()).default([]),
  sizes: z.array(z.string().min(1)).default([]),
  colors: z.array(z.string().min(1)).default([]),
  stock: z.coerce.number().int().min(0).default(0),
  featured: z.coerce.boolean().default(false),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  sku: z.string().max(100).optional().nullable(),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
