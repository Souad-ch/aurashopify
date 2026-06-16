import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  CategoryPieChart,
  MonthlyBarChart,
} from "@/components/dashboard/AnalyticsCharts";

export const dynamic = "force-dynamic";

const PAID = ["paid", "fulfilled"];
const MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user?.store) redirect("/login");
  const storeId = user.store.id;
  const currency = user.store.currency;

  const [orders, items, products] = await Promise.all([
    prisma.order.findMany({
      where: { storeId },
      select: { total: true, status: true, createdAt: true },
    }),
    prisma.orderItem.findMany({
      where: { order: { storeId } },
      include: { product: true },
    }),
    prisma.product.findMany({ where: { storeId } }),
  ]);

  const paidOrders = orders.filter((o) => PAID.includes(o.status));
  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const unitsSold = items.reduce((s, i) => s + i.quantity, 0);
  const conversion =
    orders.length > 0
      ? ((paidOrders.length / orders.length) * 100).toFixed(1)
      : "0";

  // Revenue by month (last 6 months)
  const monthly: { label: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const next = new Date(d);
    next.setMonth(next.getMonth() + 1);
    const revenue = paidOrders
      .filter((o) => o.createdAt >= d && o.createdAt < next)
      .reduce((s, o) => s + o.total, 0);
    monthly.push({ label: MONTHS[d.getMonth()], revenue: Math.round(revenue) });
  }

  // Sales by category
  const byCategory = new Map<string, number>();
  for (const item of items) {
    const cat = item.product?.category || "أخرى";
    byCategory.set(cat, (byCategory.get(cat) || 0) + item.quantity);
  }
  const categoryData = Array.from(byCategory.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Top products by units sold
  const byProduct = new Map<string, { title: string; qty: number; revenue: number }>();
  for (const item of items) {
    const key = item.title;
    const cur = byProduct.get(key) || { title: key, qty: 0, revenue: 0 };
    cur.qty += item.quantity;
    cur.revenue += item.quantity * item.price;
    byProduct.set(key, cur);
  }
  const topProducts = Array.from(byProduct.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">التحليلات</h1>
        <p className="text-sm text-ink-soft">رؤى مفصلة عن أداء متجرك</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="إجمالي الإيرادات"
          value={formatCurrency(totalRevenue, currency)}
          icon="💰"
        />
        <StatCard label="الوحدات المباعة" value={String(unitsSold)} icon="📦" />
        <StatCard label="معدل التحويل" value={`${conversion}%`} icon="🎯" />
        <StatCard label="عدد المنتجات" value={String(products.length)} icon="🏷️" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 font-semibold text-ink">الإيرادات الشهرية</h2>
          <MonthlyBarChart data={monthly} />
        </div>
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-ink">المبيعات حسب التصنيف</h2>
          {categoryData.length ? (
            <>
              <CategoryPieChart data={categoryData} />
              <ul className="mt-4 space-y-2 text-sm">
                {categoryData.slice(0, 5).map((c) => (
                  <li key={c.name} className="flex justify-between">
                    <span className="text-ink-soft">{c.name}</span>
                    <span className="font-medium text-ink">{c.value}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="py-12 text-center text-sm text-ink-soft">لا توجد بيانات</p>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-semibold text-ink">أفضل المنتجات مبيعاً</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-ink-soft">
                <th className="pb-3 font-medium">المنتج</th>
                <th className="pb-3 font-medium">الوحدات المباعة</th>
                <th className="pb-3 font-medium">الإيرادات</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.title} className="border-b border-gray-50">
                  <td className="py-3 font-medium text-ink">{p.title}</td>
                  <td className="py-3 text-ink-soft">{p.qty}</td>
                  <td className="py-3 font-medium text-ink">
                    {formatCurrency(p.revenue, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
