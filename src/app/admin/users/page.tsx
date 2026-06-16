import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { getAdminSession } from "@/lib/auth";
import { ToggleRoleButton } from "@/components/admin/AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [users, admin] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { store: true, subscription: { include: { plan: true } } },
    }),
    getAdminSession(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">المستخدمون</h1>
        <p className="text-sm text-ink-soft">{users.length} مستخدم مسجّل</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-ink-soft">
                <th className="px-5 py-3 font-medium">الاسم</th>
                <th className="px-5 py-3 font-medium">البريد</th>
                <th className="px-5 py-3 font-medium">الدور</th>
                <th className="px-5 py-3 font-medium">المتجر</th>
                <th className="px-5 py-3 font-medium">الاشتراك</th>
                <th className="px-5 py-3 font-medium">انضم في</th>
                <th className="px-5 py-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-ink">{u.name}</td>
                  <td className="px-5 py-3 text-ink-soft">{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`badge ${
                        u.role === "admin"
                          ? "bg-ink text-white"
                          : "bg-gray-100 text-ink-soft"
                      }`}
                    >
                      {u.role === "admin" ? "أدمن" : "تاجر"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-soft">
                    {u.store?.name || "—"}
                  </td>
                  <td className="px-5 py-3 text-ink-soft">
                    {u.subscription?.plan.name || "—"}
                  </td>
                  <td className="px-5 py-3 text-ink-soft">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <ToggleRoleButton
                      userId={u.id}
                      role={u.role}
                      disabled={u.id === admin?.userId}
                    />
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
