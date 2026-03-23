import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BillingPortalButton } from "@/components/billing/billing-portal-button";
import { CreditCard, Shield } from "lucide-react";

export default async function PaymentSettingsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-atmospheric text-3xl text-[#121212] tracking-tight mb-2">PAYMENT SETTINGS</h1>
        <p className="text-sm text-[#4B5563] font-medium leading-relaxed max-w-xl">
          Manage your high-security financial authorizations. Securely update your payment methods 
          and billing history through our integrated Stripe infrastructure.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Stripe managed */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-8 shadow-sm flex flex-col group hover:border-[#B8860B]/30 transition-all duration-500">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#F8F8F8] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 group-hover:bg-[#B8860B]/5 group-hover:border-[#B8860B]/20 transition-all">
              <CreditCard className="w-6 h-6 text-[#121212] group-hover:text-[#B8860B]" />
            </div>
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] mb-2">
                PAYMENT METHODS
              </h2>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Your payment data is decentralized and securely managed through Stripe. Add, update, 
                or remove methods with zero friction.
              </p>
            </div>
          </div>
          <div className="mt-auto">
            <BillingPortalButton />
          </div>
        </div>

        {/* Security note */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-8 shadow-sm group hover:border-[#B8860B]/30 transition-all duration-500">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#F8F8F8] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 group-hover:bg-[#B8860B]/5 group-hover:border-[#B8860B]/20 transition-all">
              <Shield className="w-6 h-6 text-[#121212] group-hover:text-[#B8860B]" />
            </div>
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] mb-2">
                SECURITY STANDARDS
              </h2>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                KONIK utilizes cryptographic protocols to ensure your financial integrity. 
                Full card data is never stored on our nodes.
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            {[
               "256-bit SSL Cryptographic Layer",
               "PCI DSS Level 1 Compliance",
               "3D Secure Protocol Support"
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#4B5563]/60 group-hover:text-[#121212] transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B8860B]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stripe customer info */}
      <div className="rounded-2xl border border border-[#E5E7EB] bg-[#FFFFFF] p-8 flex items-center justify-between group">
         <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] mb-2">
              STRIPE INFRASTRUCTURE
            </h2>
            <p className="text-xs text-[#4B5563] font-medium truncate max-w-sm sm:max-w-md">
              {user?.stripeCustomerId
                ? `ACTIVE — ${user.stripeCustomerId.slice(0, 12)}…`
                : "PENDING — Not yet initialized (created on first transaction)"}
            </p>
         </div>
         <div className="w-2 h-2 rounded-full bg-[#B8860B]/20 animate-pulse" />
      </div>
    </div>
  );
}
