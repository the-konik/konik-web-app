import { db } from "@/lib/db/prisma";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { formatPrice } from "@/lib/utils/cn";
import { AddToCartTool } from "@/components/cart/add-to-cart-tool";

export const dynamic = "force-dynamic";

export default async function PublicToolsPage() {
  const tools = await db.tool.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <PublicHeader />

      <main className="mx-auto w-full max-w-[1920px] flex-1 px-6 sm:px-8 lg:px-12 py-10 pt-32 sm:pt-40 lg:pt-48 pb-24">
        <div className="max-w-3xl mb-12">
          <h1 className="font-atmospheric text-4xl sm:text-5xl text-[#121212] tracking-tight">DIGITAL TOOLS</h1>
          <p className="mt-4 text-sm sm:text-base text-[#4B5563] leading-relaxed">
            Functional assets for the modern workflow. Add tools to your cart and pay once with 
            clothing in a single secure checkout.
          </p>
        </div>

        <div className="grid gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="flex flex-col gap-6 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-8 sm:flex-row sm:items-center sm:justify-between shadow-sm hover:border-[#B8860B]/30 transition-all duration-500 group"
            >
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-1.5 h-1.5 bg-[#B8860B] rounded-full" />
                   <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212]">{tool.name}</h2>
                </div>
                <p className="line-clamp-2 text-sm text-[#4B5563] font-medium leading-relaxed mb-4">
                  {tool.description}
                </p>
                <p className="text-xl font-bold text-[#B8860B] tracking-tight">
                  {formatPrice(tool.price.toString())}
                </p>
              </div>
              <div className="shrink-0">
                <AddToCartTool toolId={tool.id} />
              </div>
            </div>
          ))}
        </div>

        {tools.length === 0 && (
          <div className="mt-12 p-16 text-center border border-dashed border-[#E5E7EB] rounded-2xl bg-[#FFFFFF]">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5563]">
              No digital tools have been published yet.
            </p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
