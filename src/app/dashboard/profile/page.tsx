import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { BillingPortalButton } from "@/components/billing/billing-portal-button";
import {
  isPremiumOrAbove,
  isVipOrAbove,
  roleMeetsMinimum,
} from "@/lib/auth/rbac";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) return null;

  const { role } = session.user;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-atmospheric text-3xl sm:text-4xl text-[#121212] tracking-tight">PROFILE</h1>
        <p className="text-sm text-[#4B5563] mt-2">
          Account details and billing shortcuts.
        </p>
      </div>

      <section className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 shadow-sm">
        <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212]">Your info</h2>
        <p className="mt-2 text-sm text-[#4B5563]">
          From your sign-in provider or registration (read-only here).
        </p>
        <dl className="mt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
            <dt className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">Name</dt>
            <dd className="sm:col-span-2 text-sm font-medium text-[#121212]">{session.user.name || "—"}</dd>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 border-t border-[#E5E7EB] pt-6">
            <dt className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">Email</dt>
            <dd className="sm:col-span-2 text-sm font-medium text-[#121212]">{session.user.email}</dd>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 border-t border-[#E5E7EB] pt-6">
            <dt className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">
              Membership role
            </dt>
            <dd className="sm:col-span-2 flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-[#121212]">{role}</span>
              {isVipOrAbove(role) && (
                <span className="rounded bg-amber-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-900 border border-amber-500/20">
                  VIP tier
                </span>
              )}
              {!isVipOrAbove(role) && isPremiumOrAbove(role) && (
                <span className="rounded bg-violet-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-900 border border-violet-500/20">
                  Premium tier
                </span>
              )}
              {roleMeetsMinimum(role, "SUBSCRIBER") &&
                !isPremiumOrAbove(role) && (
                  <span className="rounded bg-sky-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-900 border border-sky-500/20">
                    Subscriber
                  </span>
                )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 shadow-sm flex flex-col items-start gap-4">
        <div>
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212]">Billing</h2>
          <p className="mt-2 text-sm text-[#4B5563]">
            Manage payment methods and invoices in Stripe (requires an active
            Stripe customer).
          </p>
        </div>
        <div>
          <BillingPortalButton />
        </div>
        <Link
          href="/dashboard/subscription"
          className="mt-2 text-xs font-bold text-[#B8860B] tracking-wide uppercase hover:underline"
        >
          Subscription details →
        </Link>
      </section>

      <section className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8F8F8] p-6">
        <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212]">Account settings</h2>
        <p className="mt-3 text-sm text-[#4B5563]">
          Password changes for email login can be added here (e.g. credential
          reset flow). OAuth users manage identity with Google/GitHub.
        </p>
        <p className="mt-4 text-[11px] font-medium text-[#4B5563]/80">
          Need help? Contact support from your order confirmation or billing
          portal.
        </p>
      </section>
    </div>
  );
}
