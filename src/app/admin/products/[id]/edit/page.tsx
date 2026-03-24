import { notFound, redirect } from "next/navigation";
import { requireStaffSection } from "@/lib/auth/require-auth";
import { canWriteSection } from "@/lib/auth/staff-rbac";
import { db } from "@/lib/db/prisma";
import { productToDTO } from "@/services/admin/product.service";
import { ProductForm } from "@/components/admin/product-form";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditProductPage({ params }: Props) {
  const { staff } = await requireStaffSection("products");
  if (!canWriteSection(staff, "products")) {
    redirect("/admin/products");
  }
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="space-y-8">
      <ProductForm mode="edit" initial={productToDTO(product)} />
    </div>
  );
}
