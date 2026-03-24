import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils/cn";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, CreditCard, Truck, CheckCircle } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) return null;

  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true, tool: true } },
    },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const statusSteps = [
    { key: "PENDING", label: "Pending", icon: CreditCard },
    { key: "PROCESSING", label: "Processing", icon: Package },
    { key: "SHIPPED", label: "Shipped", icon: Truck },
    { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
  ];
  const statusIndex = statusSteps.findIndex((s) => s.key === order.status);

  const shipping = order.shippingAddress as Record<string, string> | null;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 text-sm text-[#B8860B] hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <h1 className="text-2xl font-bold text-[#121212]">
          Order #{order.id.slice(-8).toUpperCase()}
        </h1>
        <p className="text-sm text-[#4B5563] mt-1">
          Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Progress tracker */}
      {order.status !== "CANCELLED" && (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6">
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212] mb-6">
            Order Status
          </h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#E5E7EB]" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-[#B8860B] transition-all duration-500"
              style={{ width: `${Math.max(0, (statusIndex / (statusSteps.length - 1)) * 100)}%` }}
            />
            {statusSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i <= statusIndex;
              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-[#B8860B] text-[#FFFFFF]"
                        : "bg-[#F8F8F8] text-[#4B5563] border border-[#E5E7EB]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      isActive ? "text-[#121212]" : "text-[#4B5563]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {order.status === "CANCELLED" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">
            This order has been cancelled.
          </p>
        </div>
      )}

      {/* Items */}
      <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6">
        <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212] mb-5">
          Items
        </h2>
        <div className="divide-y divide-[#E5E7EB]">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#121212]">
                  {item.product?.name || item.tool?.name || "Item"}
                </p>
                <p className="text-xs text-[#4B5563] mt-1">
                  {item.type === "PRODUCT" ? "Clothing" : "Digital Tool"}
                  {item.size && ` · Size: ${item.size}`}
                  {item.color && ` · Color: ${item.color}`}
                  {item.quantity > 1 && ` · Qty: ${item.quantity}`}
                </p>
              </div>
              <p className="text-sm font-semibold text-[#121212]">
                {formatPrice(item.price.toString())}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex justify-between">
          <span className="text-sm font-medium text-[#4B5563]">Total</span>
          <span className="text-lg font-bold text-[#121212]">
            {formatPrice(order.totalAmount.toString())}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Payment */}
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6">
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212] mb-4">
            Payment
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#4B5563]">Status</span>
              <span
                className={`font-medium ${
                  order.paymentStatus === "PAID"
                    ? "text-green-600"
                    : order.paymentStatus === "FAILED"
                      ? "text-red-600"
                      : "text-[#B8860B]"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#4B5563]">Amount</span>
              <span className="font-medium text-[#121212]">
                {formatPrice(order.totalAmount.toString())}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6">
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212] mb-4">
            Shipping Address
          </h2>
          {shipping ? (
            <div className="text-sm text-[#4B5563] space-y-1">
              {shipping.name && <p className="font-medium text-[#121212]">{shipping.name}</p>}
              {shipping.line1 && <p>{shipping.line1}</p>}
              {shipping.line2 && <p>{shipping.line2}</p>}
              {(shipping.city || shipping.state || shipping.postal_code) && (
                <p>
                  {[shipping.city, shipping.state, shipping.postal_code].filter(Boolean).join(", ")}
                </p>
              )}
              {shipping.country && <p>{shipping.country}</p>}
            </div>
          ) : (
            <p className="text-sm text-[#4B5563]">
              Digital order — no shipping required.
            </p>
          )}
        </div>
      </div>

      {/* Help */}
      <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8F8F8] p-6 text-center">
        <p className="text-sm text-[#4B5563]">
          Need help with this order?{" "}
          <Link href="/help" className="text-[#B8860B] font-medium hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
