import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { requireStaffSection } from "@/lib/require-auth";
import { canWriteSection } from "@/lib/staff-rbac";

export default async function AdminToolsPage() {
  const { staff } = await requireStaffSection("tools");
  const canWrite = canWriteSection(staff, "tools");

  const tools = await db.tool.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tools</h1>
          <p className="text-sm text-muted-foreground">
            Digital products, access type, and launch visibility. Grant access
            from Users.
          </p>
        </div>
        {canWrite && (
          <Link
            href="/admin/admin/tools/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Add tool
          </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted">
            <tr>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Access Type
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Price
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Status
              </th>
              {canWrite && (
                <th className="px-6 py-3 font-medium text-muted-foreground">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tools.map((tool) => (
              <tr key={tool.id}>
                <td className="px-6 py-4 font-medium text-primary">
                  {tool.name}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {tool.accessType === "ONE_TIME" ? "One-time" : "Subscription"}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {formatPrice(tool.price.toString())}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      tool.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {tool.published ? "Published" : "Draft"}
                  </span>
                </td>
                {canWrite && (
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/admin/tools/${tool.id}/edit`}
                      className="text-sm font-medium text-primary underline"
                    >
                      Edit
                    </Link>
                  </td>
                )}
              </tr>
            ))}
            {tools.length === 0 && (
              <tr>
                <td
                  colSpan={canWrite ? 5 : 4}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No tools yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
