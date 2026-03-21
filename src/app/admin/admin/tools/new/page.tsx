import { redirect } from "next/navigation";
import { requireStaffSection } from "@/lib/require-auth";
import { canWriteSection } from "@/lib/staff-rbac";
import { AdminToolForm } from "@/components/admin/admin-tool-form";

export default async function AdminNewToolPage() {
  const { staff } = await requireStaffSection("tools");
  if (!canWriteSection(staff, "tools")) {
    redirect("/admin/admin/tools");
  }
  return (
    <div className="space-y-8">
      <AdminToolForm mode="create" />
    </div>
  );
}
