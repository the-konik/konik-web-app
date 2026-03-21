import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/products/constants";
import { toListingStatus } from "@/lib/products/status";
import { requireStaffSection } from "@/lib/require-auth";
import { canWriteSection } from "@/lib/staff-rbac";
import { ProductRowActions } from "./product-row-actions";

export default async function AdminProductsPage() {
  const { staff } = await requireStaffSection("products");
  const canWrite = canWriteSection(staff, "products");

  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary">Products</h1>
        {canWrite && (
          <Link
            href="/admin/admin/products/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
          >
            Add product
          </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted">
            <tr>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Category
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Price
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Stock
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => {
              const status = toListingStatus({
                published: product.published,
                archived: product.archived,
              });
              return (
                <tr key={product.id}>
                  <td className="px-6 py-4 font-medium text-primary">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {PRODUCT_CATEGORY_LABELS[product.category]}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {formatPrice(product.price.toString())}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        status === "active"
                          ? "bg-green-100 text-green-700"
                          : status === "archived"
                            ? "bg-slate-200 text-slate-700"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <ProductRowActions productId={product.id} canWrite={canWrite} />
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No products yet.{" "}
                  <Link href="/admin/admin/products/new" className="text-accent">
                    Create one
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
