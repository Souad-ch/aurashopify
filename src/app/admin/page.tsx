import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatCard } from "@/components/dashboard/StatCard";
import { ADMIN_STORES, ADMIN_USERS } from "@/lib/mock";

export default function AdminOverview() {
  const storeCount = ADMIN_STORES.length;
  const userCount = ADMIN_USERS.length;
  const productCount = ADMIN_STORES.reduce((s, x) => s + x.products, 0);
  const gmv = ADMIN_STORES.reduce((s, x) => s + x.revenue, 0);
  const activeSubs = ADMIN_STORES.filter((s) => s.plan).length;
  const recent = [...ADMIN_STORES].slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">نظرة عامة على المنصة</h1>
        <p className="text-sm text-ink-soft">إحصائيات Aura عبر جميع المتاجر</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="إجمالي المتاجر" value={String(storeCount)} icon="🏪" />
        <StatCard label="المستخدمون" value={String(userCount)} icon="👤" />
        <StatCard label="اشتراكات نشطة" value={String(activeSubs)} icon="💎" />
        <StatCard label="إجمالي المبيعات (GMV)" value={formatCurrency(gmv)} icon="💰" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="إجمالي المنتجات" value={String(productCount)} icon="📦" />
        <StatCard label="إجمالي المتاجر" value={String(storeCount)} icon="🧾" />
        <StatCard label="متوسط المبيعات/متجر" value={formatCurrency(storeCount ? gmv / storeCount : 0)} icon="📈" />
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">أحدث المتاجر</h2>
          <Link href="/admin/stores" className="text-sm font-medium text-brand-600">عرض الكل</Link>
        </div>
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-ink-soft">
              <th className="pb-3 font-medium">المتجر</th>
              <th className="pb-3 font-medium">المالك</th>
              <th className="pb-3 font-medium">المنتجات</th>
              <th className="pb-3 font-medium">الإيرادات</th>
              <th className="pb-3 font-medium">أنشئ في</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((s) => (
              <tr key={s.id} className="border-b border-gray-50">
                <td className="py-3 font-medium text-ink">{s.name}</td>
                <td className="py-3 text-ink-soft">{s.owner}</td>
                <td className="py-3 text-ink-soft">{s.products}</td>
                <td className="py-3 font-medium text-ink">{formatCurrency(s.revenue)}</td>
                <td className="py-3 text-ink-soft">{formatDate(s.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
