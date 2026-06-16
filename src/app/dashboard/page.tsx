import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { formatCurrency, formatDate, statusBadge } from "@/lib/format";
import { ORDERS, PRODUCTS, CUSTOMERS, USER, STORE } from "@/lib/mock";

const PAID = ["paid", "fulfilled"];

export default function DashboardOverview() {
  const currency = STORE.currency;
  const paid = ORDERS.filter((o) => PAID.includes(o.status));
  const totalRevenue = paid.reduce((s, o) => s + o.total, 0);
  const avgOrder = paid.length ? totalRevenue / paid.length : 0;

  // last 7 days chart
  const days: { label: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    const revenue = paid
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d >= day && d < next;
      })
      .reduce((s, o) => s + o.total, 0);
    days.push({
      label: new Intl.DateTimeFormat("ar-EG", { weekday: "short" }).format(day),
      revenue: Math.round(revenue),
    });
  }

  const recent = [...ORDERS].slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">نظرة عامة</h1>
          <p className="text-sm text-ink-soft">أهلاً {USER.name}، إليك ملخص أداء متجرك.</p>
        </div>
        <Link href="/dashboard/products/new" className="btn-primary">+ منتج جديد</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="إجمالي الإيرادات" value={formatCurrency(totalRevenue, currency)} delta="+12.5%" icon="💰" />
        <StatCard label="الطلبات" value={String(ORDERS.length)} delta="+8.2%" icon="🧾" />
        <StatCard label="متوسط قيمة الطلب" value={formatCurrency(avgOrder, currency)} delta="+3.1%" icon="📈" />
        <StatCard label="العملاء" value={String(CUSTOMERS.length)} delta="+5.1%" icon="👥" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">الإيرادات — آخر 7 أيام</h2>
            <span className="text-sm font-medium text-brand-600">
              {formatCurrency(days.reduce((s, d) => s + d.revenue, 0), currency)}
            </span>
          </div>
          <RevenueChart data={days} />
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-ink">ملخص سريع</h2>
          <ul className="space-y-4 text-sm">
            <SummaryRow label="عدد المنتجات" value={String(PRODUCTS.length)} />
            <SummaryRow label="طلبات قيد الانتظار" value={String(ORDERS.filter((o) => o.status === "pending").length)} />
            <SummaryRow label="طلبات مكتملة" value={String(ORDERS.filter((o) => o.status === "fulfilled").length)} />
            <SummaryRow label="الخطة الحالية" value={USER.plan} />
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">أحدث الطلبات</h2>
          <Link href="/dashboard/orders" className="text-sm font-medium text-brand-600">عرض الكل</Link>
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
              {recent.map((o) => {
                const badge = statusBadge(o.status);
                return (
                  <tr key={o.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-ink">#{o.number}</td>
                    <td className="py-3 text-ink-soft">{o.customerName}</td>
                    <td className="py-3 text-ink-soft">{formatDate(o.createdAt)}</td>
                    <td className="py-3"><span className={`badge ${badge.className}`}>{badge.label}</span></td>
                    <td className="py-3 font-medium text-ink">{formatCurrency(o.total, currency)}</td>
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
