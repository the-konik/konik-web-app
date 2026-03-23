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
    <div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <PublicHeader />

      <main className="mx-auto w-full max-w-[1920px] flex-1 px-6 sm:px-8 lg:px-12 py-12 pt-32 sm:pt-40 lg:pt-48 pb-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="font-atmospheric text-4xl sm:text-5xl lg:text-6xl text-[#121212] tracking-tight">
            MEMBERSHIP PLANS
          </h1>
          <p className="mt-6 text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-2xl mx-auto">
            Choose your tier of commitment. Your account automatically unlocks tools and content 
            exclusive to your membership level—instantly synced to your dashboard.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-8 shadow-sm hover:border-[#B8860B]/30 transition-all duration-500 group relative overflow-hidden"
            >
              {plan.tier === "VIP" && (
                <div className="absolute top-0 right-0 py-1.5 px-6 bg-[#B8860B] text-[#FFFFFF] text-[9px] font-bold uppercase tracking-[0.2em] transform rotate-45 translate-x-[25px] translate-y-[10px] shadow-sm">
                  MOST POPULAR
                </div>
              )}
              
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-atmospheric text-2xl text-[#121212]">
                    {plan.name.toUpperCase()}
                  </h2>
                  <span className="bg-[#F8F8F8] border border-[#E5E7EB] px-2 py-1 text-[9px] font-bold text-[#4B5563] tracking-widest uppercase">
                    {plan.tier}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#B8860B] tracking-tight">
                    {formatPrice(plan.price.toString())}
                  </span>
                  <span className="text-xs font-bold text-[#4B5563] uppercase tracking-widest">
                    /{plan.interval}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm text-[#4B5563] font-medium leading-relaxed mb-8">
                  {plan.description}
                </p>
                
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#121212]">
                    Included in {plan.name}
                  </p>
                  <ul className="space-y-3">
                    {plan.tools.map((pt) => (
                      <li key={pt.toolId} className="flex items-center gap-3 text-sm text-[#4B5563] font-medium">
                        <div className="w-1.5 h-1.5 bg-[#B8860B] rounded-full" />
                        {pt.tool.name}
                      </li>
                    ))}
                    {plan.tools.length === 0 && (
                      <li className="text-[#4B5563]/50 italic text-sm">No specific tools included</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-10">
                {plan.stripePriceId ? (
                  <div className="group/btn">
                    <SubscribePlanButton planId={plan.id} />
                  </div>
                ) : (
                  <div className="rounded-lg bg-[#F8F8F8] p-4 border border-[#E5E7EB] text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#4B5563]">
                      Coming Soon
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="mt-12 p-16 text-center border border-dashed border-[#E5E7EB] rounded-2xl bg-[#FFFFFF]">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5563]">
              No membership plans are currently available.
            </p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
