import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { RoleWelcomeBanner } from "@/components/dashboard/role-welcome-banner";
import { getActiveSubscription, getUserTools } from "@/services/tool-access";
import { getUserPurchasedProducts } from "@/services/user-purchases";
import { formatPrice } from "@/lib/utils";
import { SUBSCRIPTION_ACCESS_STATUSES } from "@/services/subscription-role";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const firstName = session.user.name?.split(" ")[0] || "there";

  const [orderCount, tools, subscription, payingSubCount, products] =
    await Promise.all([
      db.order.count({ where: { userId: session.user.id } }),
      getUserTools(session.user.id),
      getActiveSubscription(session.user.id),
      db.subscription.count({
        where: {
          userId: session.user.id,
          status: { in: [...SUBSCRIPTION_ACCESS_STATUSES] },
        },
      }),
      getUserPurchasedProducts(session.user.id),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-atmospheric text-3xl sm:text-4xl text-[#121212] tracking-tight">
          WELCOME BACK, {firstName.toUpperCase()}
        </h1>
        <p className="text-sm text-[#4B5563] mt-2">
          Your KONIK hub — orders, clothing, tools, and membership.
        </p>
      </div>

      <RoleWelcomeBanner role={session.user.role} firstName={firstName} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/dashboard/dashboard/products"
          className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 transition-colors hover:border-[#B8860B] group"
        >
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#4B5563]">My Products</p>
          <p className="mt-2 text-3xl font-bold text-[#121212]">
            {products.length}
          </p>
          <span className="mt-3 inline-block text-xs font-bold text-[#B8860B] tracking-wide uppercase group-hover:underline">
            Clothing →
          </span>
        </Link>
        <Link
          href="/dashboard/dashboard/tools"
          className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 transition-colors hover:border-[#B8860B] group"
        >
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#4B5563]">Tools unlocked</p>
          <p className="mt-2 text-3xl font-bold text-[#121212]">
            {tools.length}
          </p>
          <span className="mt-3 inline-block text-xs font-bold text-[#B8860B] tracking-wide uppercase group-hover:underline">
            Open tools →
          </span>
        </Link>
        <Link
          href="/dashboard/dashboard/orders"
          className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 transition-colors hover:border-[#B8860B] group"
        >
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#4B5563]">Orders</p>
          <p className="mt-2 text-3xl font-bold text-[#121212]">{orderCount}</p>
          <span className="mt-3 inline-block text-xs font-bold text-[#B8860B] tracking-wide uppercase group-hover:underline">
            History →
          </span>
        </Link>
        <Link
          href="/dashboard/dashboard/subscription"
          className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 transition-colors hover:border-[#B8860B] group"
        >
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#4B5563]">Subscription</p>
          <p className="mt-2 text-lg font-bold leading-tight text-[#121212]">
            {subscription ? subscription.plan.name : "None"}
          </p>
          {subscription && (
            <p className="mt-1 text-xs text-[#4B5563]">
              {subscription.status} · {subscription.plan.tier}
            </p>
          )}
          {!subscription && payingSubCount > 0 && (
            <p className="mt-1 text-xs text-[#4B5563]">
              {payingSubCount} record(s)
            </p>
          )}
          <span className="mt-3 inline-block text-xs font-bold text-[#B8860B] tracking-wide uppercase group-hover:underline">
            {subscription || payingSubCount
              ? "Manage →"
              : "Browse plans →"}
          </span>
        </Link>
      </div>

      {subscription && (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#F8F8F8] p-6">
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212]">
            Subscription snapshot
          </h2>
          <p className="mt-2 text-sm text-[#4B5563]">
            <strong className="text-[#121212]">{subscription.plan.name}</strong> —{" "}
            {formatPrice(subscription.plan.price.toString())}/
            {subscription.plan.interval} · {subscription.status}
          </p>
          <Link
            href="/dashboard/dashboard/subscription"
            className="mt-4 inline-block text-xs font-bold text-[#B8860B] tracking-wide uppercase hover:underline"
          >
            Full details & billing
          </Link>
        </div>
      )}
    </div>
  );
}
