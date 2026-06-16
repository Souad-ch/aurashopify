"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format";
import { ADMIN_USERS } from "@/lib/mock";

export default function AdminUsersPage() {
  const [roles, setRoles] = useState<Record<string, string>>(
    Object.fromEntries(ADMIN_USERS.map((u) => [u.id, u.role]))
  );

  function toggle(id: string) {
    setRoles((r) => ({ ...r, [id]: r[id] === "admin" ? "merchant" : "admin" }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">المستخدمون</h1>
        <p className="text-sm text-ink-soft">{ADMIN_USERS.length} مستخدم مسجّل</p>
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
              {ADMIN_USERS.map((u) => {
                const role = roles[u.id];
                return (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-medium text-ink">{u.name}</td>
                    <td className="px-5 py-3 text-ink-soft">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${role === "admin" ? "bg-ink text-white" : "bg-gray-100 text-ink-soft"}`}>
                        {role === "admin" ? "أدمن" : "تاجر"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{u.store}</td>
                    <td className="px-5 py-3 text-ink-soft">{u.plan}</td>
                    <td className="px-5 py-3 text-ink-soft">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggle(u.id)} className="text-xs font-medium text-brand-600 hover:underline">
                        {role === "admin" ? "إلغاء صلاحية الأدمن" : "ترقية إلى أدمن"}
                      </button>
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
