import { db } from "@/lib/db";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { formatPrice } from "@/lib/utils";
import { AddToCartTool } from "@/components/cart/add-to-cart-tool";

export const dynamic = "force-dynamic";

export default async function PublicToolsPage() {
  const tools = await db.tool.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <PublicHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold text-primary">Digital tools</h1>
        <p className="mt-2 text-muted-foreground">
          Add tools to your cart and pay once with clothing in a single Stripe
          checkout (subscription plans use a separate checkout).
        </p>

        <ul className="mt-8 space-y-4">
          {tools.map((tool) => (
            <li
              key={tool.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="font-semibold text-primary">{tool.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {tool.description}
                </p>
                <p className="mt-2 text-lg font-medium text-accent">
                  {formatPrice(tool.price.toString())}
                </p>
              </div>
              <AddToCartTool toolId={tool.id} />
            </li>
          ))}
        </ul>

        {tools.length === 0 && (
          <p className="mt-8 text-muted-foreground">No tools published yet.</p>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
