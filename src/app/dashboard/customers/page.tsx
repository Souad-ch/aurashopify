import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const user = await getCurrentUser();
  if (!user?.store) redirect("/login");

  const customers = await prisma.customer.findMany({
    where: { storeId: user.store.id },
    orderBy: { createdAt: "desc" },
    include: { orders: true },
  });
  const currency = user.store.currency;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">العملاء</h1>
        <p className="text-sm text-ink-soft">{customers.length} عميل</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-ink-soft">
                <th className="px-5 py-3 font-medium">العميل</th>
                <th className="px-5 py-3 font-medium">البريد</th>
                <th className="px-5 py-3 font-medium">عدد الطلبات</th>
                <th className="px-5 py-3 font-medium">إجمالي الإنفاق</th>
                <th className="px-5 py-3 font-medium">منذ</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const spent = c.orders.reduce((s, o) => s + o.total, 0);
                return (
                  <tr
                    key={c.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                          {c.name.charAt(0)}
                        </span>
                        <span className="font-medium text-ink">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{c.email}</td>
                    <td className="px-5 py-3 text-ink-soft">
                      {c.orders.length}
                    </td>
                    <td className="px-5 py-3 font-medium text-ink">
                      {formatCurrency(spent, currency)}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {formatDate(c.createdAt)}
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
