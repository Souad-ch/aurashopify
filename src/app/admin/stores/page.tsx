import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";
import { DeleteStoreButton } from "@/components/admin/AdminActions";

export const dynamic = "force-dynamic";

const PAID = ["paid", "fulfilled"];

export default async function AdminStoresPage() {
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { include: { subscription: { include: { plan: true } } } },
      orders: { select: { total: true, status: true } },
      _count: { select: { products: true, orders: true, customers: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">المتاجر</h1>
        <p className="text-sm text-ink-soft">{stores.length} متجر على المنصة</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-ink-soft">
                <th className="px-5 py-3 font-medium">المتجر</th>
                <th className="px-5 py-3 font-medium">المالك</th>
                <th className="px-5 py-3 font-medium">الخطة</th>
                <th className="px-5 py-3 font-medium">المنتجات</th>
                <th className="px-5 py-3 font-medium">الإيرادات</th>
                <th className="px-5 py-3 font-medium">أنشئ في</th>
                <th className="px-5 py-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => {
                const revenue = s.orders
                  .filter((o) => PAID.includes(o.status))
                  .reduce((sum, o) => sum + o.total, 0);
                return (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink">{s.name}</p>
                      <p className="text-xs text-ink-soft">/{s.slug}</p>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{s.owner.email}</td>
                    <td className="px-5 py-3">
                      {s.owner.subscription ? (
                        <span className="badge bg-brand-50 text-brand-700">
                          {s.owner.subscription.plan.name}
                        </span>
                      ) : (
                        <span className="text-xs text-ink-soft">مجاني</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{s._count.products}</td>
                    <td className="px-5 py-3 font-medium text-ink">
                      {formatCurrency(revenue, s.currency)}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {formatDate(s.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/store/${s.slug}`}
                          target="_blank"
                          className="text-xs font-medium text-brand-600 hover:underline"
                        >
                          عرض
                        </Link>
                        <DeleteStoreButton storeId={s.id} />
                      </div>
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
