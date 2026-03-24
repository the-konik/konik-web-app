import type { UserRole } from "@prisma/client";
import Link from "next/link";
import {
  isPremiumOrAbove,
  isVipOrAbove,
  roleMeetsMinimum,
} from "@/lib/auth/rbac";

type Props = {
  role: UserRole;
  firstName: string;
};

export function RoleWelcomeBanner({ role, firstName }: Props) {
  if (role === "ADMIN") {
    return (
      <div className="rounded-xl border border-border bg-primary px-4 py-3 text-sm text-primary-foreground">
        <strong>Admin</strong> — full platform access. Use the admin panel for
        catalog and members.
      </div>
    );
  }

  if (isVipOrAbove(role)) {
    return (
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950">
        <strong>VIP</strong> — Thanks, {firstName}. You get the top tier role
        and every tool included in your active plans.{" "}
        <Link href="/plans" className="font-medium underline">
          Manage plans
        </Link>
      </div>
    );
  }

  if (isPremiumOrAbove(role)) {
    return (
      <div className="rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-3 text-sm text-violet-950">
        <strong>Premium</strong> — You&apos;re on a premium membership tier.{" "}
        <Link href="/dashboard/tools" className="font-medium underline">
          Open your tools
        </Link>{" "}
        or{" "}
        <Link href="/plans" className="font-medium underline">
          explore upgrades
        </Link>
        .
      </div>
    );
  }

  if (roleMeetsMinimum(role, "SUBSCRIBER")) {
    return (
      <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-3 text-sm text-sky-950">
        <strong>Subscriber</strong> — Your plan tools are listed under Tools.
        Need more?{" "}
        <Link href="/plans" className="font-medium underline">
          Compare tiers
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-muted-foreground">
      <strong className="text-primary">Free account</strong> — Shop clothing,
      buy tools once, or{" "}
      <Link href="/plans" className="font-medium text-accent underline">
        subscribe
      </Link>{" "}
      for recurring access and a higher tier role.
    </div>
  );
}
