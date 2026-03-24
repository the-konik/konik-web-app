import { db } from "@/lib/db/prisma";
import { requireStaffSection } from "@/lib/auth/require-auth";
import { canWriteSection } from "@/lib/auth/staff-rbac";
import { AdminMarketingPanel } from "@/components/admin/admin-marketing-panel";

export default async function AdminMarketingPage() {
  const { staff } = await requireStaffSection("marketing");
  const canWrite = canWriteSection(staff, "marketing");

  const [codes, campaigns] = await Promise.all([
    db.discountCode.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.marketingCampaign.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const discountCodes = codes.map((c) => ({
    id: c.id,
    code: c.code,
    description: c.description,
    percentOff: c.percentOff,
    amountOff: c.amountOff != null ? c.amountOff.toString() : null,
    currency: c.currency,
    active: c.active,
    maxRedemptions: c.maxRedemptions,
    redeemCount: c.redeemCount,
    startsAt: c.startsAt?.toISOString() ?? null,
    endsAt: c.endsAt?.toISOString() ?? null,
  }));

  const campaignRows = campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    active: c.active,
    startsAt: c.startsAt?.toISOString() ?? null,
    endsAt: c.endsAt?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Marketing</h1>
        <p className="text-sm text-muted-foreground">
          Discount codes and named campaigns. Checkout integration can read
          these records via your app logic.
        </p>
      </div>
      <AdminMarketingPanel
        discountCodes={discountCodes}
        campaigns={campaignRows}
        canWrite={canWrite}
      />
    </div>
  );
}
