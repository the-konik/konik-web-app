import { redirect } from "next/navigation";
import { requireStaffSection } from "@/lib/auth/require-auth";
import { canWriteSection } from "@/lib/auth/staff-rbac";
import { ProductForm } from "@/components/admin/product-form";

export default async function AdminNewProductPage() {
  const { staff } = await requireStaffSection("products");
  if (!canWriteSection(staff, "products")) {
    redirect("/admin/products");
  }
  return (
    <div className="space-y-8">
      <ProductForm mode="create" />
    </div>
  );
}
