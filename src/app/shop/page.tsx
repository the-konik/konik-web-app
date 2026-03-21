import { Suspense } from "react";
import { db } from "@/lib/db";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { buildProductWhere, productToDTO } from "@/services/product.service";
import { ProductCard } from "@/components/shop/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import type { ProductCategory } from "@prisma/client";

type SearchParams = {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  size?: string;
};

function parseCategory(v: string | undefined): ProductCategory | undefined {
  if (
    !v ||
    v === "all" ||
    !["T_SHIRT", "HOODIE", "JACKET", "PANTS", "ACCESSORIES"].includes(v)
  ) {
    return undefined;
  }
  return v as ProductCategory;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const category = parseCategory(sp.category);
  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined;
  const size = sp.size && sp.size !== "all" ? sp.size : undefined;

  const where = buildProductWhere({
    adminCatalog: false,
    category,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    size,
  });

  const products = await db.product.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const maxRow = await db.product.aggregate({
    where: buildProductWhere({ adminCatalog: false }),
    _max: { price: true },
  });
  const priceCeiling = Math.max(
    500,
    Number(maxRow._max.price ?? 500)
  );

  const dtos = products.map(productToDTO);

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <PublicHeader />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        <h1 className="text-3xl font-bold text-primary">Shop</h1>
        <p className="mt-1 text-muted-foreground">
          Clothing — filter by category, price, and size.
        </p>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-64">
            <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-white" />}>
              <ShopFilters priceCeiling={priceCeiling} />
            </Suspense>
          </aside>

          <div className="flex-1">
            {dtos.length === 0 ? (
              <p className="rounded-xl border border-border bg-white p-12 text-center text-muted-foreground">
                No products match your filters.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {dtos.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={{
                      id: p.id,
                      name: p.name,
                      slug: p.slug,
                      price: p.price,
                      category: p.category,
                      images: p.images,
                      sizes: p.sizes,
                      stock: p.stock,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
