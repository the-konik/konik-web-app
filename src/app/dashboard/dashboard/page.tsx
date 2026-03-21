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
        <h1 className="text-2xl font-bold text-primary">
          Welcome back, {firstName}
        </h1>
        <p className="text-muted-foreground">
          Your KONIK hub — orders, clothing, tools, and membership.
        </p>
      </div>

      <RoleWelcomeBanner role={session.user.role} firstName={firstName} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/dashboard/dashboard/products"
          className="rounded-xl border border-border bg-white p-5 transition hover:border-accent"
        >
          <p className="text-sm text-muted-foreground">My Products</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {products.length}
          </p>
          <span className="mt-2 inline-block text-xs text-accent">
            Clothing →
          </span>
        </Link>
        <Link
          href="/dashboard/dashboard/tools"
          className="rounded-xl border border-border bg-white p-5 transition hover:border-accent"
        >
          <p className="text-sm text-muted-foreground">Tools unlocked</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {tools.length}
          </p>
          <span className="mt-2 inline-block text-xs text-accent">
            Open tools →
          </span>
        </Link>
        <Link
          href="/dashboard/dashboard/orders"
          className="rounded-xl border border-border bg-white p-5 transition hover:border-accent"
        >
          <p className="text-sm text-muted-foreground">Orders</p>
          <p className="mt-1 text-2xl font-bold text-primary">{orderCount}</p>
          <span className="mt-2 inline-block text-xs text-accent">
            History →
          </span>
        </Link>
        <Link
          href="/dashboard/dashboard/subscription"
          className="rounded-xl border border-border bg-white p-5 transition hover:border-accent"
        >
          <p className="text-sm text-muted-foreground">Subscription</p>
          <p className="mt-1 text-lg font-bold leading-tight text-primary">
            {subscription ? subscription.plan.name : "None"}
          </p>
          {subscription && (
            <p className="mt-1 text-xs text-muted-foreground">
              {subscription.status} · {subscription.plan.tier}
            </p>
          )}
          {!subscription && payingSubCount > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {payingSubCount} record(s)
            </p>
          )}
          <span className="mt-2 inline-block text-xs text-accent">
            {subscription || payingSubCount
              ? "Manage →"
              : "Browse plans →"}
          </span>
        </Link>
      </div>

      {subscription && (
        <div className="rounded-xl border border-border bg-white p-5">
          <h2 className="text-sm font-semibold text-primary">
            Subscription snapshot
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {subscription.plan.name} —{" "}
            {formatPrice(subscription.plan.price.toString())}/
            {subscription.plan.interval} · {subscription.status}
          </p>
          <Link
            href="/dashboard/dashboard/subscription"
            className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
          >
            Full details & billing
          </Link>
        </div>
      )}
    </div>
  );
}
