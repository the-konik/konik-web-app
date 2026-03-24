import { redirect } from "next/navigation";
import { requireStaffSection } from "@/lib/auth/require-auth";
import { canWriteSection } from "@/lib/auth/staff-rbac";
import { AdminToolForm } from "@/components/admin/admin-tool-form";

export default async function AdminNewToolPage() {
  const { staff } = await requireStaffSection("tools");
  if (!canWriteSection(staff, "tools")) {
    redirect("/admin/tools");
  }
  return (
    <div className="space-y-8">
      <AdminToolForm mode="create" />
    </div>
  );
}
