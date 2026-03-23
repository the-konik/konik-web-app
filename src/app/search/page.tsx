import { Suspense } from "react";
import { db } from "@/lib/db";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductCard } from "@/components/shop/product-card";
import { productToDTO } from "@/services/product.service";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | KONIK",
  description: "Search KONIK products and tools.",
};

type SearchParams = { q?: string };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const query = sp.q?.trim() ?? "";

  const products = query
    ? await db.product.findMany({
        where: {
          published: true,
          archived: false,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 30,
      })
    : [];

  const tools = query
    ? await db.tool.findMany({
        where: {
          published: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 10,
      })
    : [];

  const dtos = products.map(productToDTO);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <PublicHeader />

      <main className="flex-1 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12 py-10">
          {/* Search header */}
          <div className="mb-10">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#B8860B] mb-3 block">
              Search Results
            </span>
            <h1 className="font-atmospheric text-3xl sm:text-4xl text-[#121212] tracking-tight">
              {query ? (
                <>
                  Results for &ldquo;<span className="text-[#B8860B]">{query}</span>&rdquo;
                </>
              ) : (
                "Search the collection"
              )}
            </h1>
            <p className="text-[#4B5563] text-sm mt-2">
              {query
                ? `${dtos.length} product${dtos.length !== 1 ? "s" : ""} and ${tools.length} tool${tools.length !== 1 ? "s" : ""} found`
                : "Use the search bar above to find products and tools."}
            </p>
          </div>

          {/* Search form */}
          <form action="/search" method="GET" className="mb-10">
            <div className="flex gap-3">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search products, tools, categories…"
                className="flex-1 h-12 px-5 rounded-none border border-[#E5E7EB] bg-[#FFFFFF] text-sm font-medium text-[#121212] placeholder:text-[#4B5563]/60 focus:outline-none focus:ring-2 focus:ring-[#121212] transition-all"
              />
              <button
                type="submit"
                className="bg-[#121212] text-[#FFFFFF] px-8 h-12 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#121212]/90 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Products */}
          {dtos.length > 0 && (
            <section className="mb-12">
              <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212] mb-6">
                Products ({dtos.length})
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            </section>
          )}

          {/* Tools */}
          {tools.length > 0 && (
            <section className="mb-12">
              <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212] mb-6">
                Digital Tools ({tools.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <a
                    key={tool.id}
                    href={`/tools`}
                    className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 hover:border-[#B8860B] transition-colors group"
                  >
                    <h3 className="text-base font-semibold text-[#121212] group-hover:text-[#B8860B] transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-[#4B5563] mt-2 line-clamp-2">
                      {tool.description}
                    </p>
                    <p className="text-xs font-bold text-[#B8860B] mt-3 uppercase tracking-wide">
                      {tool.accessType === "ONE_TIME" ? "One-time purchase" : "Subscription"}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {query && dtos.length === 0 && tools.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#4B5563] text-base mb-4">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-sm text-[#4B5563]/70 mb-8">
                Try adjusting your search or browse our categories.
              </p>
              <a
                href="/shop/categories"
                className="inline-flex items-center bg-[#121212] text-[#FFFFFF] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#121212]/90 transition-colors"
              >
                Browse Categories
              </a>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
