import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BillingPortalButton } from "@/components/billing/billing-portal-button";
import { formatPrice } from "@/lib/utils";
import {
  getActiveSubscription,
  getUserTools,
} from "@/services/tool-access";
import { SUBSCRIPTION_ACCESS_STATUSES } from "@/services/subscription-role";

export default async function DashboardSubscriptionPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [primarySub, payingSubs, tools] = await Promise.all([
    getActiveSubscription(session.user.id),
    db.subscription.findMany({
      where: {
        userId: session.user.id,
        status: { in: [...SUBSCRIPTION_ACCESS_STATUSES] },
      },
      include: {
        plan: {
          include: {
            tools: { include: { tool: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    getUserTools(session.user.id),
  ]);

  const subscriptionTools = tools.filter((t) => t.source === "subscription");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Subscription</h1>
        <p className="text-muted-foreground">
          Your membership tier is{" "}
          <span className="font-semibold text-primary">
            {session.user.role}
          </span>
          . Premium/VIP roles come from your active plan (or admin override).
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-primary">Current access</h2>
        {payingSubs.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No active subscription.{" "}
            <Link href="/plans" className="text-accent underline">
              View plans
            </Link>{" "}
            or buy tools individually from the shop.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {payingSubs.map((s) => (
              <li
                key={s.id}
                className="rounded-lg border border-border bg-muted/30 p-4 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-primary">
                    {s.plan.name}
                  </span>
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                    {s.status}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground">
                  Tier: {s.plan.tier} ·{" "}
                  {formatPrice(s.plan.price.toString())}/{s.plan.interval}
                </p>
                {s.currentPeriodEnd && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Current period ends{" "}
                    {new Date(s.currentPeriodEnd).toLocaleDateString()}
                    {s.cancelAtPeriodEnd ? " · Cancels at period end" : ""}
                  </p>
                )}
                {s.stripeSubscriptionId ? (
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    Stripe: {s.stripeSubscriptionId}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-amber-700">
                    Manual / comp subscription (no Stripe billing)
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {primarySub && (
          <div className="mt-6 border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-primary">
              Tools included with your primary plan
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Primary = highest tier if you have multiple memberships.
            </p>
            <ul className="mt-3 list-inside list-disc text-sm text-muted-foreground">
              {primarySub.plan.tools.length === 0 ? (
                <li>No tools linked to this plan yet.</li>
              ) : (
                primarySub.plan.tools.map((pt) => (
                  <li key={pt.toolId}>{pt.tool.name}</li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-primary">
          Tools from subscription
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          These unlock automatically while your subscription is active (no
          separate purchase).
        </p>
        {subscriptionTools.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">None right now.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {subscriptionTools.map(({ tool }) => (
              <li key={tool.id}>
                <Link
                  href={`/dashboard/dashboard/tools/${tool.slug}`}
                  className="text-accent hover:underline"
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-primary">Billing</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Use Stripe Customer Portal to update payment method, download
          invoices, or cancel at period end.
        </p>
        <div className="mt-4">
          <BillingPortalButton />
        </div>
        <p className="mt-4 text-sm">
          <Link href="/plans" className="text-accent hover:underline">
            Compare plans / upgrade via checkout
          </Link>
        </p>
      </div>
    </div>
  );
}
