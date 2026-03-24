import Link from "next/link";
import { requireStaffSection } from "@/lib/auth/require-auth";
import { formatPrice } from "@/lib/utils/cn";
import { getAdminDashboardStats } from "@/services/admin/dashboard-stats";

export default async function AdminDashboard() {
  await requireStaffSection("dashboard");

  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of users, revenue, orders, and subscriptions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total users</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {stats.userCount}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Orders (all)</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {stats.orderCount}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Paid orders</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {stats.paidOrderCount}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Active subscriptions</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {stats.subscriptionCount}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-muted-foreground">Revenue (paid)</p>
          <p className="mt-1 text-2xl font-bold text-accent">
            {formatPrice(String(stats.revenue))}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">Recent orders</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {stats.recentOrders.map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap justify-between gap-2 border-b border-border pb-3 last:border-0"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  …{o.id.slice(-8)}
                </span>
                <span className="text-primary">
                  {formatPrice(o.totalAmount.toString())}
                </span>
                <span className="text-muted-foreground">
                  {o.paymentStatus} · {o.status}
                </span>
                <span className="w-full text-xs text-muted-foreground">
                  {o.userEmail ?? "Guest"} ·{" "}
                  {new Date(o.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
            {stats.recentOrders.length === 0 && (
              <li className="text-muted-foreground">No orders yet.</li>
            )}
          </ul>
          <Link
            href="/admin/orders"
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            All orders →
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">New users</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {stats.recentUsers.map((u) => (
              <li
                key={u.id}
                className="flex flex-wrap justify-between gap-1 border-b border-border pb-2 last:border-0"
              >
                <span className="text-primary">{u.email || u.name || u.id}</span>
                <span className="text-xs text-muted-foreground">
                  {u.staffRole ? `Staff: ${u.staffRole}` : "Customer"}
                </span>
                <span className="w-full text-xs text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/users"
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            All users →
          </Link>
        </div>
      </div>
    </div>
  );
}
