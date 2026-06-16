import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/dashboard/StatCard";
import { MonthlyBarChart, CategoryPieChart } from "@/components/dashboard/AnalyticsCharts";
import { ORDERS, PRODUCTS, STORE } from "@/lib/mock";

const PAID = ["paid", "fulfilled"];
const MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

export default function AnalyticsPage() {
  const currency = STORE.currency;
  const paid = ORDERS.filter((o) => PAID.includes(o.status));
  const totalRevenue = paid.reduce((s, o) => s + o.total, 0);
  const unitsSold = ORDERS.reduce((s, o) => s + o.items, 0);
  const conversion = ORDERS.length ? ((paid.length / ORDERS.length) * 100).toFixed(1) : "0";

  // monthly revenue (last 6 months)
  const monthly: { label: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const next = new Date(d);
    next.setMonth(next.getMonth() + 1);
    const revenue = paid
      .filter((o) => {
        const od = new Date(o.createdAt);
        return od >= d && od < next;
      })
      .reduce((s, o) => s + o.total, 0);
    monthly.push({ label: MONTHS[d.getMonth()], revenue: Math.round(revenue) });
  }

  // sales by category (use product catalog distribution)
  const byCat = new Map<string, number>();
  PRODUCTS.forEach((p, i) => {
    byCat.set(p.category, (byCat.get(p.category) || 0) + (5 + ((i * 7) % 20)));
  });
  const categoryData = Array.from(byCat.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const topProducts = PRODUCTS.slice(0, 5).map((p, i) => ({
    title: p.title,
    qty: 30 - i * 4,
    revenue: p.price * (30 - i * 4),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">التحليلات</h1>
        <p className="text-sm text-ink-soft">رؤى مفصلة عن أداء متجرك</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="إجمالي الإيرادات" value={formatCurrency(totalRevenue, currency)} icon="💰" />
        <StatCard label="الوحدات المباعة" value={String(unitsSold)} icon="📦" />
        <StatCard label="معدل التحويل" value={`${conversion}%`} icon="🎯" />
        <StatCard label="عدد المنتجات" value={String(PRODUCTS.length)} icon="🏷️" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 font-semibold text-ink">الإيرادات الشهرية</h2>
          <MonthlyBarChart data={monthly} />
        </div>
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-ink">المبيعات حسب التصنيف</h2>
          <CategoryPieChart data={categoryData} />
          <ul className="mt-4 space-y-2 text-sm">
            {categoryData.slice(0, 5).map((c) => (
              <li key={c.name} className="flex justify-between">
                <span className="text-ink-soft">{c.name}</span>
                <span className="font-medium text-ink">{c.value}</span>
              </li>
            ))}
          </ul>
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
                  <td className="py-3 font-medium text-ink">{formatCurrency(p.revenue, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
