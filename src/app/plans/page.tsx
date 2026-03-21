import { db } from "@/lib/db";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { formatPrice } from "@/lib/utils";
import { SubscribePlanButton } from "@/components/subscriptions/subscribe-plan-button";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const plans = await db.subscriptionPlan.findMany({
    where: { active: true },
    include: {
      tools: { include: { tool: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
  });

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <PublicHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <h1 className="text-center text-3xl font-bold text-primary">
          Membership plans
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Subscribe for recurring access. Your role becomes SUBSCRIBER, PREMIUM,
          or VIP to match the plan tier, and tools attached to the plan unlock
          automatically.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col rounded-xl border border-border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-primary">
                  {plan.name}
                </h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                  {plan.tier}
                </span>
              </div>
              <p className="mt-3 text-3xl font-bold text-accent">
                {formatPrice(plan.price.toString())}
                <span className="text-sm font-normal text-muted-foreground">
                  /{plan.interval}
                </span>
              </p>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Included tools
                </p>
                <ul className="mt-2 space-y-1 text-sm text-primary">
                  {plan.tools.map((pt) => (
                    <li key={pt.toolId}>{pt.tool.name}</li>
                  ))}
                  {plan.tools.length === 0 && (
                    <li className="text-muted-foreground">—</li>
                  )}
                </ul>
              </div>
              <div className="mt-6">
                {plan.stripePriceId ? (
                  <SubscribePlanButton planId={plan.id} />
                ) : (
                  <p className="text-center text-xs text-muted-foreground">
                    Checkout not configured (add{" "}
                    <code className="rounded bg-muted px-1">stripePriceId</code>{" "}
                    in admin/DB).
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {plans.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            No plans available yet.
          </p>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
