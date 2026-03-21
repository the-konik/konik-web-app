import { redirect } from "next/navigation";
import { requireStaffSection } from "@/lib/require-auth";
import { canWriteSection } from "@/lib/staff-rbac";
import { ProductForm } from "@/components/admin/product-form";

export default async function AdminNewProductPage() {
  const { staff } = await requireStaffSection("products");
  if (!canWriteSection(staff, "products")) {
    redirect("/admin/admin/products");
  }
  return (
    <div className="space-y-8">
      <ProductForm mode="create" />
    </div>
  );
}
