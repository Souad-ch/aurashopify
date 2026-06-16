import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, statusBadge } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user?.store) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { storeId: user.store.id },
    orderBy: { createdAt: "desc" },
    include: { customer: true, items: true },
  });
  const currency = user.store.currency;

  const totalRevenue = orders
    .filter((o) => ["paid", "fulfilled"].includes(o.status))
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">الطلبات</h1>
        <p className="text-sm text-ink-soft">
          {orders.length} طلب · إجمالي {formatCurrency(totalRevenue, currency)}
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-ink-soft">
                <th className="px-5 py-3 font-medium">رقم الطلب</th>
                <th className="px-5 py-3 font-medium">العميل</th>
                <th className="px-5 py-3 font-medium">المنتجات</th>
                <th className="px-5 py-3 font-medium">التاريخ</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
                <th className="px-5 py-3 font-medium">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const badge = statusBadge(o.status);
                const itemCount = o.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <tr
                    key={o.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="px-5 py-3 font-medium text-ink">
                      #{o.number}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {o.customer?.name || "زائر"}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{itemCount} عنصر</td>
                    <td className="px-5 py-3 text-ink-soft">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-ink">
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
