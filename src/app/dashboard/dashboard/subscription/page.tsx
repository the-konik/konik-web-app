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
    <div className="space-y-12">
      <div>
        <h1 className="font-atmospheric text-3xl text-[#121212] tracking-tight mb-2">SUBSCRIPTION</h1>
        <p className="text-sm text-[#4B5563] font-medium leading-relaxed max-w-xl">
          Your current account tier is <span className="text-[#B8860B] font-bold uppercase tracking-wider">{session.user.role}</span>. 
          This defines your access levels across the entire ecosystem.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-8 shadow-sm">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] mb-6">ACTIVE ACCESS</h2>
        {payingSubs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8F8F8] p-10 text-center">
            <p className="text-sm text-[#4B5563] font-medium mb-4">
              No active subscription found. Upgrade your experience to unlock premium legacy tools.
            </p>
            <Link 
              href="/plans" 
              className="inline-block bg-[#121212] text-[#FFFFFF] px-8 py-3 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#B8860B] transition-all"
            >
              View Membership Plans
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {payingSubs.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-[#E5E7EB] bg-[#F8F8F8] p-6 transition-all hover:border-[#B8860B]/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <span className="font-atmospheric text-xl text-[#121212]">
                    {s.plan.name.toUpperCase()}
                  </span>
                  <span className="bg-[#B8860B] text-[#FFFFFF] px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full">
                    {s.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-xs font-medium">
                  <div>
                    <p className="text-[#4B5563] uppercase tracking-widest text-[9px] mb-1">Plan Details</p>
                    <p className="text-[#121212]">
                      Tier: {s.plan.tier} · {formatPrice(s.plan.price.toString())}/{s.plan.interval}
                    </p>
                  </div>
                  {s.currentPeriodEnd && (
                    <div>
                      <p className="text-[#4B5563] uppercase tracking-widest text-[9px] mb-1">Billing Cycle</p>
                      <p className="text-[#121212]">
                        Ends {new Date(s.currentPeriodEnd).toLocaleDateString()}
                        {s.cancelAtPeriodEnd ? " · Cancels at period end" : ""}
                      </p>
                    </div>
                  )}
                </div>
                {s.stripeSubscriptionId ? (
                  <p className="mt-4 pt-4 border-t border-[#E5E7EB] font-mono text-[9px] text-[#4B5563]/40 tracking-tight">
                    STRIPE_REF: {s.stripeSubscriptionId}
                  </p>
                ) : (
                  <p className="mt-4 pt-4 border-t border-[#E5E7EB] text-[9px] font-bold text-[#B8860B] uppercase tracking-widest">
                    Authorized Manual Override
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {primarySub && (
          <div className="mt-10 pt-10 border-t border-[#E5E7EB]">
             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#121212] mb-4">
               CORE UTILITIES INCLUDED
             </h3>
             <ul className="grid sm:grid-cols-2 gap-3">
               {primarySub.plan.tools.length === 0 ? (
                 <li className="text-xs text-[#4B5563] italic">No digital assets linked to this tier.</li>
               ) : (
                 primarySub.plan.tools.map((pt) => (
                   <li key={pt.toolId} className="flex items-center gap-3 text-xs text-[#4B5563] font-medium bg-[#F8F8F8] px-4 py-3 rounded-lg border border-transparent hover:border-[#E5E7EB] transition-all">
                     <div className="w-1.5 h-1.5 bg-[#B8860B] rounded-full" />
                     {pt.tool.name}
                   </li>
                 ))
               )}
             </ul>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-8 shadow-sm">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] mb-4">
            ENTITLED ASSETS
          </h2>
          <p className="text-xs text-[#4B5563] leading-relaxed mb-6">
            Digital tools authorized via your active membership. No individual purchase required.
          </p>
          {subscriptionTools.length === 0 ? (
            <div className="p-6 bg-[#F8F8F8] rounded-xl text-center">
               <p className="text-[10px] font-bold uppercase tracking-widest text-[#4B5563]/50">No entitled tools found</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {subscriptionTools.map(({ tool }) => (
                <li key={tool.id}>
                  <Link
                    href={`/dashboard/dashboard/tools/${tool.slug}`}
                    className="flex items-center justify-between p-4 bg-[#F8F8F8] border border-transparent rounded-xl hover:border-[#B8860B]/20 hover:bg-[#FFFFFF] transition-all group"
                  >
                    <span className="text-sm font-bold text-[#121212] group-hover:text-[#B8860B] transition-colors">{tool.name}</span>
                    <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Launch →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-8 shadow-sm flex flex-col">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] mb-4">BILLING & FINANCE</h2>
          <p className="text-xs text-[#4B5563] leading-relaxed mb-8 flex-1">
            Securely manage your financial integration. Update payment methods, retrieve 
            tax invoices, or modify your subscription status via our Stripe secure portal.
          </p>
          <div className="space-y-4">
            <BillingPortalButton />
            <Link 
              href="/plans" 
              className="block text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#4B5563] hover:text-[#B8860B] transition-colors pt-2"
            >
              Compare Membership Levels
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
