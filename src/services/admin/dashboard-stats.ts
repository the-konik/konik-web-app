import { db } from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma";

export type AdminRecentOrder = {
  id: string;
  totalAmount: Prisma.Decimal;
  paymentStatus: string;
  status: string;
  createdAt: Date;
  userEmail: string | null;
};

export async function getAdminDashboardStats() {
  const [
    userCount,
    orderCount,
    paidOrderCount,
    subscriptionCount,
    revenueAgg,
    recentOrders,
    recentUsers,
  ] = await Promise.all([
    db.user.count(),
    db.order.count(),
    db.order.count({ where: { paymentStatus: "PAID" } }),
    db.subscription.count({
      where: { status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] } },
    }),
    db.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
    }),
    db.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true } },
      },
    }),
    db.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, createdAt: true, staffRole: true },
    }),
  ]);

  const revenue = Number(revenueAgg._sum.totalAmount ?? 0);

  const activityOrders: AdminRecentOrder[] = recentOrders.map((o) => ({
    id: o.id,
    totalAmount: o.totalAmount,
    paymentStatus: o.paymentStatus,
    status: o.status,
    createdAt: o.createdAt,
    userEmail: o.user?.email ?? null,
  }));

  return {
    userCount,
    orderCount,
    paidOrderCount,
    subscriptionCount,
    revenue,
    recentOrders: activityOrders,
    recentUsers,
  };
}
