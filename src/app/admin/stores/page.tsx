"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";
import { ADMIN_STORES, STORE } from "@/lib/mock";

export default function AdminStoresPage() {
  const [hidden, setHidden] = useState<string[]>([]);
  const stores = ADMIN_STORES.filter((s) => !hidden.includes(s.id));

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
              {stores.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-ink">{s.name}</p>
                    <p className="text-xs text-ink-soft">/{s.slug}</p>
                  </td>
                  <td className="px-5 py-3 text-ink-soft">{s.owner}</td>
                  <td className="px-5 py-3">
                    {s.plan ? <span className="badge bg-brand-50 text-brand-700">{s.plan}</span> : <span className="text-xs text-ink-soft">مجاني</span>}
                  </td>
                  <td className="px-5 py-3 text-ink-soft">{s.products}</td>
                  <td className="px-5 py-3 font-medium text-ink">{formatCurrency(s.revenue)}</td>
                  <td className="px-5 py-3 text-ink-soft">{formatDate(s.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {s.slug === STORE.slug ? (
                        <Link href={`/store/${s.slug}`} className="text-xs font-medium text-brand-600 hover:underline">عرض</Link>
                      ) : (
                        <span className="text-xs text-gray-300">عرض</span>
                      )}
                      <button onClick={() => setHidden((h) => [...h, s.id])} className="text-xs font-medium text-rose-600 hover:underline">حذف المتجر</button>
                    </div>
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
