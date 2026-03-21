import { requireSession } from "@/lib/require-auth";
import { DashboardChrome } from "@/components/dashboard/dashboard-chrome";
import { dashboardRoleHints } from "@/components/dashboard/dashboard-role-context";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const hints = dashboardRoleHints(session.user.role);

  return (
    <DashboardChrome session={session} hints={hints}>
      {children}
    </DashboardChrome>
  );
}
