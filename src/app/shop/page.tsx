import { Suspense } from "react";
import { db } from "@/lib/db/prisma";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { buildProductWhere, productToDTO } from "@/services/admin/product.service";
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
    !["APPAREL", "FOOTWEAR", "ACCESSORIES"].includes(v)
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
    <div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <PublicHeader />

      <div className="mx-auto w-full max-w-[1920px] flex-1 px-6 sm:px-8 lg:px-12 py-10 pt-32 sm:pt-36">
        <h1 className="font-atmospheric text-4xl sm:text-5xl text-[#121212] tracking-tight">SHOP</h1>
        <p className="mt-2 text-sm text-[#4B5563]">
          Complete your uniform. Filter by category, price, and size.
        </p>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-64">
            <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-[#FFFFFF] border border-[#E5E7EB]" />}>
              <ShopFilters priceCeiling={priceCeiling} />
            </Suspense>
          </aside>

          <div className="flex-1">
            {dtos.length === 0 ? (
              <p className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-12 text-center text-sm font-medium text-[#4B5563] shadow-sm">
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
