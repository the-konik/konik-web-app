import { db } from "@/lib/db/prisma";
import { APP_SETTING_KEYS } from "@/lib/validators/admin-core";
import { requireStaffSection } from "@/lib/auth/require-auth";
import { canWriteSection } from "@/lib/auth/staff-rbac";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";

export default async function AdminSettingsPage() {
  const { staff } = await requireStaffSection("settings");
  const canWrite = canWriteSection(staff, "settings");

  const rows = await db.appSetting.findMany({
    where: { key: { in: [...APP_SETTING_KEYS] } },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<
    string,
    unknown
  >;

  const initialJson: Record<string, string> = {};
  for (const key of APP_SETTING_KEYS) {
    const v = map[key];
    initialJson[key] = JSON.stringify(
      v !== undefined ? v : {},
      null,
      2
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-muted-foreground">
          General storefront config, payment-related metadata, and tool access
          rules (consumed by your services).
        </p>
      </div>
      <AdminSettingsForm initialJson={initialJson} canWrite={canWrite} />
    </div>
  );
}
