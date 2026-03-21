import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) return null;

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true, tool: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">My Orders</h1>
        <p className="text-muted-foreground">Track your purchase history.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center">
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-border bg-white p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium text-primary">Payment: </span>
                    {order.paymentStatus === "PAID"
                      ? "Paid — digital items unlock automatically; physical items ship next."
                      : order.paymentStatus === "PENDING"
                        ? "Pending — complete checkout or wait for Stripe confirmation."
                        : order.paymentStatus}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="font-medium text-primary">Shipment: </span>
                    {order.status === "DELIVERED"
                      ? "Delivered (or digital-only complete)."
                      : order.status === "SHIPPED"
                        ? "On the way."
                        : order.status === "PROCESSING"
                          ? "We’re preparing your order."
                          : order.status === "PENDING"
                            ? "Waiting on payment or processing."
                            : order.status}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-primary">
                    {formatPrice(order.totalAmount.toString())}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 sm:justify-end">
                    <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      Pay: {order.paymentStatus}
                    </span>
                    <span className="inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      Ship: {order.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-muted-foreground"
                  >
                    <span>
                      {item.product?.name || item.tool?.name || "Item"}{" "}
                      {item.quantity > 1 && `x${item.quantity}`}
                    </span>
                    <span>{formatPrice(item.price.toString())}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
