import { Suspense } from "react";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/prisma";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductCard } from "@/components/shop/product-card";
import { redirect } from "next/navigation";
import { productToDTO } from "@/services/admin/product.service";
import type { Metadata } from "next";
import { type ProductCategory, type Wishlist } from "@/generated/prisma";

export const metadata: Metadata = {
  title: "My Wishlist | KONIK",
  description: "Your saved products and tools at KONIK.",
};

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/wishlist");
  }

  const wishlistEntries = await db.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        where: { published: true, archived: false },
      },
      tool: {
        where: { published: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const validProducts = wishlistEntries
    .filter((e: any) => !!e.product)
    .map((e: any) => e.product!)
    .map(productToDTO);

  const validTools = wishlistEntries
    .filter((e: any) => !!e.tool)
    .map((e: any) => e.tool!);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <PublicHeader />

      <main className="flex-1 pt-28 sm:pt-32 pb-20">
        <div className="mx-auto max-w-[1920px] px-6 sm:px-8 lg:px-12">
          {/* Page Title */}
          <div className="mb-12">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#F1B811] mb-3 block">
              Saved for Later
            </span>
            <h1 className="font-atmospheric text-4xl sm:text-5xl text-[#121212] tracking-tight">
              My Wishlist
            </h1>
            <p className="text-[#4B5563] text-sm mt-3 font-poppins">
              Keep track of elite performance gear and legacy-building systems.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-20 font-poppins text-muted-foreground uppercase text-[10px] tracking-widest">Loading Wishlist...</div>}>
            <div className="space-y-16">
              {/* Products Section */}
              <section>
                <div className="flex items-center justify-between mb-8 border-b border-[#E5E7EB] pb-4">
                  <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#121212] font-poppins">
                    Apparel & Footwear ({validProducts.length})
                  </h2>
                </div>
                
                {validProducts.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {validProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border rounded-2xl py-20 text-center">
                    <p className="text-sm font-poppins text-[#4B5563] mb-6">No products saved yet.</p>
                    <a href="/shop" className="bg-[#121212] text-white px-8 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#121212]/90 transition-all font-poppins">Continue Shopping</a>
                  </div>
                )}
              </section>

              {/* Tools Section */}
              <section>
                <div className="flex items-center justify-between mb-8 border-b border-[#E5E7EB] pb-4">
                  <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#121212] font-poppins">
                    Digital Systems ({validTools.length})
                  </h2>
                </div>
                
                {validTools.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {validTools.map((tool) => (
                      <a
                        key={tool.id}
                        href={`/tools`}
                        className="rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-8 hover:border-[#F1B811] transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <h3 className="text-lg font-bold text-[#121212] group-hover:text-[#F1B811] transition-colors font-poppins">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-[#4B5563] mt-3 line-clamp-3 font-poppins leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#B8860B] uppercase tracking-widest font-poppins">
                             {tool.accessType === "ONE_TIME" ? "One-time" : "Subscription"}
                          </span>
                          <span className="text-xs font-bold text-[#121212] font-poppins">View Details</span>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border rounded-2xl py-20 text-center">
                    <p className="text-sm font-poppins text-[#4B5563] mb-6">No systems saved yet.</p>
                    <a href="/tools" className="bg-[#121212] text-white px-8 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#121212]/90 transition-all font-poppins">Explore Systems</a>
                  </div>
                )}
              </section>
            </div>
          </Suspense>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
