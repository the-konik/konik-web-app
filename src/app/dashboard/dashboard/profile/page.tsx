import Link from "next/link";
import { auth } from "@/lib/auth";
import { BillingPortalButton } from "@/components/billing/billing-portal-button";
import {
  isPremiumOrAbove,
  isVipOrAbove,
  roleMeetsMinimum,
} from "@/lib/rbac";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) return null;

  const { role } = session.user;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Profile</h1>
        <p className="text-muted-foreground">
          Account details and billing shortcuts.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-primary">Your info</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          From your sign-in provider or registration (read-only here).
        </p>
        <dl className="mt-6 space-y-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Name</dt>
            <dd className="text-primary">{session.user.name || "—"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
            <dd className="text-primary">{session.user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Membership role
            </dt>
            <dd className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-primary">{role}</span>
              {isVipOrAbove(role) && (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-900">
                  VIP tier
                </span>
              )}
              {!isVipOrAbove(role) && isPremiumOrAbove(role) && (
                <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-xs text-violet-900">
                  Premium tier
                </span>
              )}
              {roleMeetsMinimum(role, "SUBSCRIBER") &&
                !isPremiumOrAbove(role) && (
                  <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-xs text-sky-900">
                    Subscriber
                  </span>
                )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-primary">Billing</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage payment methods and invoices in Stripe (requires an active
          Stripe customer).
        </p>
        <div className="mt-4">
          <BillingPortalButton />
        </div>
        <Link
          href="/dashboard/dashboard/subscription"
          className="mt-4 inline-block text-sm text-accent hover:underline"
        >
          Subscription details →
        </Link>
      </section>

      <section className="rounded-xl border border-dashed border-border bg-muted/30 p-6">
        <h2 className="text-lg font-semibold text-primary">Account settings</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Password changes for email login can be added here (e.g. credential
          reset flow). OAuth users manage identity with Google/GitHub.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Need help? Contact support from your order confirmation or billing
          portal.
        </p>
      </section>
    </div>
  );
}
