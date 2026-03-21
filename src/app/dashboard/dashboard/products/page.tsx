import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserPurchasedProducts } from "@/services/user-purchases";

export default async function MyProductsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const products = await getUserPurchasedProducts(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">My Products</h1>
        <p className="text-muted-foreground">
          Clothing you&apos;ve bought (paid orders only). Open the shop page for
          details or to buy again.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center">
          <p className="text-muted-foreground">No purchased clothing yet.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block text-sm font-medium text-accent underline"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.productId}
              className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
            >
              <Link
                href={`/shop/${p.slug}`}
                className="relative block aspect-[4/3] bg-muted"
              >
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No image
                  </div>
                )}
              </Link>
              <div className="p-4">
                <h2 className="font-semibold text-primary">{p.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Last purchase{" "}
                  {new Date(p.lastPurchasedAt).toLocaleDateString()}
                  {p.size || p.color
                    ? ` · ${[p.size, p.color].filter(Boolean).join(" · ")}`
                    : ""}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/shop/${p.slug}`}
                    className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/90"
                  >
                    View product
                  </Link>
                  <Link
                    href={`/dashboard/dashboard/orders`}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-primary hover:bg-muted"
                  >
                    Order history
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
