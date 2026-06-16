import Link from "next/link";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, statusBadge } from "@/lib/format";

export const dynamic = "force-dynamic";

const PAID_STATUSES = ["paid", "fulfilled"];

export default async function DashboardOverview() {
  const user = await getCurrentUser();
  if (!user?.store) redirect("/login");
  const storeId = user.store.id;
  const currency = user.store.currency;

  const [orders, productCount, customerCount, recentOrders] = await Promise.all([
    prisma.order.findMany({ where: { storeId }, select: { total: true, status: true, createdAt: true } }),
    prisma.product.count({ where: { storeId } }),
    prisma.customer.count({ where: { storeId } }),
    prisma.order.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { customer: true },
    }),
  ]);

  const paidOrders = orders.filter((o) => PAID_STATUSES.includes(o.status));
  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const avgOrder = paidOrders.length ? totalRevenue / paidOrders.length : 0;

  // Build last-7-days revenue chart
  const days: { label: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    const revenue = paidOrders
      .filter((o) => o.createdAt >= day && o.createdAt < next)
      .reduce((s, o) => s + o.total, 0);
    days.push({
      label: new Intl.DateTimeFormat("ar-EG", { weekday: "short" }).format(day),
      revenue: Math.round(revenue),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">نظرة عامة</h1>
          <p className="text-sm text-ink-soft">
            أهلاً {user.name}، إليك ملخص أداء متجرك.
          </p>
        </div>
        <Link href="/dashboard/products/new" className="btn-primary">
          + منتج جديد
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="إجمالي الإيرادات"
          value={formatCurrency(totalRevenue, currency)}
          delta="+12.5%"
          icon="💰"
        />
        <StatCard
          label="الطلبات"
          value={String(orders.length)}
          delta="+8.2%"
          icon="🧾"
        />
        <StatCard
          label="متوسط قيمة الطلب"
          value={formatCurrency(avgOrder, currency)}
          delta="+3.1%"
          icon="📈"
        />
        <StatCard
          label="العملاء"
          value={String(customerCount)}
          delta="+5.1%"
          icon="👥"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">الإيرادات — آخر 7 أيام</h2>
            <span className="text-sm font-medium text-brand-600">
              {formatCurrency(
                days.reduce((s, d) => s + d.revenue, 0),
                currency
              )}
            </span>
          </div>
          <RevenueChart data={days} />
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-ink">ملخص سريع</h2>
          <ul className="space-y-4 text-sm">
            <SummaryRow label="عدد المنتجات" value={String(productCount)} />
            <SummaryRow
              label="طلبات قيد الانتظار"
              value={String(orders.filter((o) => o.status === "pending").length)}
            />
            <SummaryRow
              label="طلبات مكتملة"
              value={String(orders.filter((o) => o.status === "fulfilled").length)}
            />
            <SummaryRow
              label="الخطة الحالية"
              value={user.subscription?.plan.name || "—"}
            />
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">أحدث الطلبات</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm font-medium text-brand-600"
          >
            عرض الكل
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-ink-soft">
                <th className="pb-3 font-medium">رقم الطلب</th>
                <th className="pb-3 font-medium">العميل</th>
                <th className="pb-3 font-medium">التاريخ</th>
                <th className="pb-3 font-medium">الحالة</th>
                <th className="pb-3 font-medium">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => {
                const badge = statusBadge(o.status);
                return (
                  <tr key={o.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-ink">#{o.number}</td>
                    <td className="py-3 text-ink-soft">
                      {o.customer?.name || "زائر"}
                    </td>
                    <td className="py-3 text-ink-soft">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="py-3">
                      <span className={`badge ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-ink">
                      {formatCurrency(o.total, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-ink-soft">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </li>
  );
}
