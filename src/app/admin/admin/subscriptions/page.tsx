import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { requireStaffSection } from "@/lib/require-auth";
import { canWriteSection } from "@/lib/staff-rbac";
import { AdminSubscriptionManager } from "@/components/admin/admin-subscription-manager";

export default async function AdminSubscriptionsPage() {
  const { staff } = await requireStaffSection("subscriptions");
  const canWrite = canWriteSection(staff, "subscriptions");

  const [plans, subscriptions, users] = await Promise.all([
    db.subscriptionPlan.findMany({
      include: {
        _count: { select: { subscriptions: true } },
        tools: { include: { tool: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
    }),
    db.subscription.findMany({
      include: {
        user: { select: { id: true, email: true, name: true, role: true } },
        plan: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 200,
    }),
    db.user.findMany({
      select: { id: true, email: true, name: true },
      orderBy: { createdAt: "desc" },
      take: 150,
    }),
  ]);

  const planOptions = plans.map((p) => ({
    id: p.id,
    name: p.name,
    tier: p.tier,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-primary">Subscriptions</h1>

      <AdminSubscriptionManager
        subscriptions={subscriptions}
        plans={planOptions}
        users={users}
        canWrite={canWrite}
      />

      <h2 className="text-xl font-bold text-primary">Plans catalog</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-xl border border-border bg-white p-6"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-primary">{plan.name}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {plan.tier}
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold text-accent">
              {formatPrice(plan.price.toString())}
              <span className="text-sm font-normal text-muted-foreground">
                /{plan.interval}
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {plan.description}
            </p>
            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Included Tools
              </p>
              <ul className="mt-2 space-y-1">
                {plan.tools.map((pt) => (
                  <li key={pt.toolId} className="text-sm text-primary">
                    {pt.tool.name}
                  </li>
                ))}
                {plan.tools.length === 0 && (
                  <li className="text-sm text-muted-foreground">
                    No tools assigned
                  </li>
                )}
              </ul>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {plan._count.subscriptions} active subscriber
              {plan._count.subscriptions !== 1 ? "s" : ""}
            </p>
          </div>
        ))}
        {plans.length === 0 && (
          <div className="col-span-full rounded-xl border border-border bg-white p-12 text-center">
            <p className="text-muted-foreground">No subscription plans yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
