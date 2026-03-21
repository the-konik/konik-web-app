import Link from "next/link";
import type { UserRole } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import {
  isPremiumOrAbove,
  isVipOrAbove,
  roleMeetsMinimum,
} from "@/lib/rbac";
import type { ToolAccessType } from "@prisma/client";

type ToolBrief = {
  id: string;
  name: string;
  description: string;
  accessType: ToolAccessType;
  price: { toString(): string };
};

type Props = {
  tool: ToolBrief;
  role: UserRole;
};

export function LockedToolUpsell({ tool, role }: Props) {
  const price = formatPrice(tool.price.toString());
  const isOneTime = tool.accessType === "ONE_TIME";
  const isSubOnly = tool.accessType === "SUBSCRIPTION";

  let cta: React.ReactNode;
  if (isSubOnly) {
    cta = (
      <Link
        href="/plans"
        className="inline-flex rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
      >
        View membership plans
      </Link>
    );
  } else if (isOneTime) {
    cta = (
      <>
        <Link
          href="/tools"
          className="inline-flex rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/90"
        >
          Add to cart — {price}
        </Link>
        <span className="text-xs text-muted-foreground"> One-time</span>
      </>
    );
  } else if (isVipOrAbove(role)) {
    cta = (
      <p className="text-xs text-muted-foreground">
        Not in your current plans.{" "}
        <Link href="/plans" className="text-accent underline">
          Switch plan
        </Link>
      </p>
    );
  } else if (isPremiumOrAbove(role)) {
    cta = (
      <p className="text-xs text-muted-foreground">
        VIP plans may include more tools.{" "}
        <Link href="/plans" className="text-accent underline">
          View plans
        </Link>
      </p>
    );
  } else if (roleMeetsMinimum(role, "SUBSCRIBER")) {
    cta = (
      <p className="text-xs text-muted-foreground">
        Upgrade for more included tools.{" "}
        <Link href="/plans" className="text-accent underline">
          Compare tiers
        </Link>
      </p>
    );
  } else {
    cta = (
      <p className="text-xs text-muted-foreground">
        <Link href="/plans" className="font-medium text-accent underline">
          Subscribe
        </Link>{" "}
        for member tools, or buy one-time where available.
      </p>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/40 p-3">
      <p className="text-xs font-medium text-primary">Locked</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
        {cta}
      </div>
    </div>
  );
}
