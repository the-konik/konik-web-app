import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils/cn";

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
        <h1 className="font-atmospheric text-3xl sm:text-4xl text-[#121212] tracking-tight">MY ORDERS</h1>
        <p className="text-sm text-[#4B5563] mt-2">Track your purchase history.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-12 text-center shadow-sm">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#4B5563]">No orders yet.</p>
          <a
            href="/shop"
            className="mt-6 inline-block bg-[#121212] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF] hover:bg-[#121212]/90 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 shadow-sm flex flex-col sm:flex-row gap-6 relative group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-sm font-bold text-[#121212]">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <span className="text-[10px] bg-[#F8F8F8] px-2 py-0.5 rounded text-[#4B5563] font-medium border border-[#E5E7EB]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mt-4 space-y-1">
                  <p className="text-[11px] text-[#4B5563]">
                    <span className="font-bold tracking-wider uppercase text-[#121212]">Payment: </span>
                    {order.paymentStatus === "PAID"
                      ? "Paid — digital items unlock automatically; physical items ship next."
                      : order.paymentStatus === "PENDING"
                        ? "Pending — complete checkout or wait for Stripe confirmation."
                        : order.paymentStatus}
                  </p>
                  <p className="text-[11px] text-[#4B5563]">
                    <span className="font-bold tracking-wider uppercase text-[#121212]">Shipment: </span>
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

                <div className="mt-5 space-y-2 border-t border-[#E5E7EB] pt-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-[#4B5563] font-medium">
                        {item.product?.name || item.tool?.name || "Item"}{" "}
                        {item.quantity > 1 && <span className="text-[#121212] font-bold">x{item.quantity}</span>}
                      </span>
                      <span className="text-[#121212] font-semibold">{formatPrice(item.price.toString())}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:text-right flex flex-col justify-between sm:w-48 shrink-0 border-t sm:border-t-0 border-[#E5E7EB] pt-4 sm:pt-0">
                <p className="text-xl font-bold text-[#B8860B] mb-2 sm:mb-0">
                  {formatPrice(order.totalAmount.toString())}
                </p>
                
                <div className="flex sm:flex-col gap-2 justify-end items-end sm:mt-auto">
                  <a
                    href={`/dashboard/orders/${order.id}`}
                    className="flex-1 sm:flex-none text-center bg-[#F8F8F8] whitespace-nowrap text-[#121212] border border-[#E5E7EB] px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:border-[#B8860B] transition-colors"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
