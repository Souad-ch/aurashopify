import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatCard } from "@/components/dashboard/StatCard";

export const dynamic = "force-dynamic";

const PAID = ["paid", "fulfilled"];

export default async function AdminOverview() {
  const [storeCount, userCount, productCount, orders, activeSubs, recentStores] =
    await Promise.all([
      prisma.store.count(),
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.findMany({ select: { total: true, status: true } }),
      prisma.subscription.count({ where: { status: "active" } }),
      prisma.store.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { owner: true, _count: { select: { products: true, orders: true } } },
      }),
    ]);

  const gmv = orders
    .filter((o) => PAID.includes(o.status))
    .reduce((s, o) => s + o.total, 0);

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
        <StatCard
          label="إجمالي المبيعات (GMV)"
          value={formatCurrency(gmv)}
          icon="💰"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="إجمالي المنتجات" value={String(productCount)} icon="📦" />
        <StatCard label="إجمالي الطلبات" value={String(orders.length)} icon="🧾" />
        <StatCard
          label="متوسط المبيعات/متجر"
          value={formatCurrency(storeCount ? gmv / storeCount : 0)}
          icon="📈"
        />
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">أحدث المتاجر</h2>
          <Link href="/admin/stores" className="text-sm font-medium text-brand-600">
            عرض الكل
          </Link>
        </div>
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-ink-soft">
              <th className="pb-3 font-medium">المتجر</th>
              <th className="pb-3 font-medium">المالك</th>
              <th className="pb-3 font-medium">المنتجات</th>
              <th className="pb-3 font-medium">الطلبات</th>
              <th className="pb-3 font-medium">أنشئ في</th>
            </tr>
          </thead>
          <tbody>
            {recentStores.map((s) => (
              <tr key={s.id} className="border-b border-gray-50">
                <td className="py-3 font-medium text-ink">{s.name}</td>
                <td className="py-3 text-ink-soft">{s.owner.email}</td>
                <td className="py-3 text-ink-soft">{s._count.products}</td>
                <td className="py-3 text-ink-soft">{s._count.orders}</td>
                <td className="py-3 text-ink-soft">{formatDate(s.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
