import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { requireStaffSection } from "@/lib/require-auth";
import { canWriteSection } from "@/lib/staff-rbac";
import { AdminOrderActions } from "@/components/admin/admin-order-actions";

export default async function AdminOrdersPage() {
  const { staff } = await requireStaffSection("orders");
  const canWrite = canWriteSection(staff, "orders");

  const orders = await db.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-primary">Orders</h1>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted">
            <tr>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Order
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Customer
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Total
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Payment
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Date
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Cart
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 font-mono text-xs text-primary">
                  #{order.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {order.user
                    ? order.user.name || order.user.email
                    : order.guestEmail ||
                      order.guestName ||
                      "Guest checkout"}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {formatPrice(order.totalAmount.toString())}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground">
                  {[
                    order.items.some((i) => i.type === "PRODUCT") && "Clothing",
                    order.items.some((i) => i.type === "TOOL") && "Tools",
                  ]
                    .filter(Boolean)
                    .join(" + ") || "—"}
                </td>
                <td className="px-6 py-4 align-top">
                  <AdminOrderActions
                    orderId={order.id}
                    orderStatus={order.status}
                    paymentStatus={order.paymentStatus}
                    canWrite={canWrite}
                  />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
