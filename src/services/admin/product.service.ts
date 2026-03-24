import { db } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/cn";
import type { Prisma, Product, ProductCategory } from "@prisma/client";
import { fromListingStatus, toListingStatus } from "@/lib/products/status";
import type { ProductListingStatus } from "@/lib/products/status";

export type ProductListFilters = {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  /** When true, include drafts and archived (admin catalog). */
  adminCatalog?: boolean;
};

export function buildProductWhere(
  filters: ProductListFilters
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (!filters.adminCatalog) {
    where.published = true;
    where.archived = false;
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.minPrice != null || filters.maxPrice != null) {
    const priceFilter: Prisma.DecimalFilter = {};
    if (filters.minPrice != null) priceFilter.gte = filters.minPrice;
    if (filters.maxPrice != null) priceFilter.lte = filters.maxPrice;
    where.price = priceFilter;
  }

  if (filters.size) {
    where.sizes = { has: filters.size };
  }

  return where;
}

/** Unique slug from name (appends -2, -3, … if needed). */
export async function uniqueProductSlug(
  name: string,
  excludeProductId?: string
): Promise<string> {
  const base = slugify(name) || "product";
  let candidate = base;
  let i = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await db.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeProductId) {
      return candidate;
    }
    i += 1;
    candidate = `${base}-${i}`;
  }
}

export function productToDTO(p: Product) {
  const status: ProductListingStatus = toListingStatus({
    published: p.published,
    archived: p.archived,
  });
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    category: p.category,
    images: p.images,
    sizes: p.sizes,
    colors: p.colors,
    stock: p.stock,
    featured: p.featured,
    published: p.published,
    archived: p.archived,
    status,
    sku: p.sku,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export type ProductDTO = ReturnType<typeof productToDTO>;

export function parseStatusToDb(status: ProductListingStatus) {
  return fromListingStatus(status);
}
