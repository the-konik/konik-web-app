import Link from "next/link";
import type { UserRole } from "@/generated/prisma";
import { formatPrice } from "@/lib/utils/cn";
import {
  isPremiumOrAbove,
  isVipOrAbove,
  roleMeetsMinimum,
} from "@/lib/auth/rbac";
import type { ToolAccessType } from "@/generated/prisma";

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
        className="inline-flex bg-[#121212] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#FFFFFF] hover:bg-[#B8860B] transition-all shadow-sm"
      >
        View Membership Plans
      </Link>
    );
  } else if (isOneTime) {
    cta = (
      <div className="flex flex-col gap-2">
        <Link
          href="/tools"
          className="inline-flex bg-[#B8860B] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#FFFFFF] hover:bg-[#121212] transition-all shadow-sm"
        >
          Add to Cart — {price}
        </Link>
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#4B5563]/60 px-1">One-Time Acquisition</span>
      </div>
    );
  } else if (isVipOrAbove(role)) {
    cta = (
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#4B5563]">
        Excluded from current plan.{" "}
        <Link href="/plans" className="text-[#B8860B] hover:underline">
          Reconfigure Membership
        </Link>
      </p>
    );
  } else if (isPremiumOrAbove(role)) {
    cta = (
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#4B5563]">
        VIP tiers provide expanded access.{" "}
        <Link href="/plans" className="text-[#B8860B] hover:underline">
          View VIP Plans
        </Link>
      </p>
    );
  } else if (roleMeetsMinimum(role, "SUBSCRIBER")) {
    cta = (
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#4B5563]">
        Upgrade for expanded utilities.{" "}
        <Link href="/plans" className="text-[#B8860B] hover:underline">
          Compare Tiers
        </Link>
      </p>
    );
  } else {
    cta = (
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#4B5563]">
        <Link href="/plans" className="text-[#B8860B] hover:underline">
          Subscribe
        </Link>{" "}
        for member utilities, or purchase one-time.
      </p>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-[#F8F8F8] p-4 group-hover:bg-[#FFFFFF] transition-colors duration-500">
      <div className="flex items-center gap-2 mb-3">
         <div className="w-1 h-1 bg-[#EF4444] rounded-full animate-pulse" />
         <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#EF4444]">Authorization Required</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
        {cta}
      </div>
    </div>
  );
}
