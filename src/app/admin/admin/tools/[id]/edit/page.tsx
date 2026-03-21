import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireStaffSection } from "@/lib/require-auth";
import { canWriteSection } from "@/lib/staff-rbac";
import { AdminToolForm } from "@/components/admin/admin-tool-form";

type Ctx = { params: Promise<{ id: string }> };

export default async function AdminEditToolPage({ params }: Ctx) {
  const { staff } = await requireStaffSection("tools");
  if (!canWriteSection(staff, "tools")) {
    redirect("/admin/admin/tools");
  }

  const { id } = await params;
  const tool = await db.tool.findUnique({ where: { id } });
  if (!tool) notFound();

  const initial = {
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    description: tool.description,
    price: tool.price.toString(),
    accessType: tool.accessType,
    icon: tool.icon,
    published: tool.published,
    featured: tool.featured,
    appPath: tool.appPath,
  };

  return (
    <div className="space-y-8">
      <AdminToolForm mode="edit" initial={initial} />
    </div>
  );
}
