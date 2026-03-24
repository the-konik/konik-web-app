import { db } from "@/lib/db/prisma";
import { requireStaffSection } from "@/lib/auth/require-auth";
import {
  canWriteSection,
  isSuperAdminStaff,
} from "@/lib/auth/staff-rbac";
import { AdminUserRow } from "@/components/admin/admin-user-row";

export default async function AdminUsersPage() {
  const { staff } = await requireStaffSection("users");
  const canEditUser = canWriteSection(staff, "users");
  const canAssignStaff = isSuperAdminStaff(staff);

  const [users, tools] = await Promise.all([
    db.user.findMany({
      include: {
        subscriptions: {
          where: { status: { in: ["ACTIVE", "TRIALING"] } },
          orderBy: [{ currentPeriodEnd: "desc" }, { createdAt: "desc" }],
          take: 1,
          include: { plan: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.tool.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Users</h1>
        <p className="text-sm text-muted-foreground">
          Customer role + optional staff panel role (Super Admin only for staff
          assignment). Grant tool access for support.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted">
            <tr>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Role
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Staff
              </th>
              <th className="px-6 py-3 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <AdminUserRow
                key={user.id}
                userId={user.id}
                name={user.name}
                email={user.email}
                role={user.role}
                staffRole={user.staffRole}
                canEditUser={canEditUser}
                canAssignStaff={canAssignStaff}
                tools={tools}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
