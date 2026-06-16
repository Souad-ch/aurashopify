"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency, statusBadge } from "@/lib/format";
import { PRODUCTS, STORE } from "@/lib/mock";

export default function ProductsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [hidden, setHidden] = useState<string[]>([]);

  const categories = useMemo(
    () => Array.from(new Set(PRODUCTS.map((p) => p.category))),
    []
  );

  const products = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          !hidden.includes(p.id) &&
          (!status || p.status === status) &&
          (!category || p.category === category) &&
          (!q || p.title.includes(q))
      ),
    [q, status, category, hidden]
  );

  const currency = STORE.currency;
  const isFiltering = !!(q || status || category);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">المنتجات</h1>
          <p className="text-sm text-ink-soft">{products.length} منتج في متجرك</p>
        </div>
        <Link href="/dashboard/products/new" className="btn-primary">+ إضافة منتج</Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft">🔍</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن منتج..." className="input pr-10" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-auto">
          <option value="">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="draft">مسودة</option>
          <option value="archived">مؤرشف</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-auto">
          <option value="">كل التصنيفات</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl">{isFiltering ? "🔍" : "📦"}</span>
          <h3 className="mt-4 text-lg font-semibold text-ink">
            {isFiltering ? "لا توجد نتائج مطابقة" : "لا توجد منتجات بعد"}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            {isFiltering ? "جرّب تعديل كلمات البحث أو الفلاتر." : "ابدأ بإضافة أول منتج إلى متجرك."}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-ink-soft">
                  <th className="px-5 py-3 font-medium">المنتج</th>
                  <th className="px-5 py-3 font-medium">الحالة</th>
                  <th className="px-5 py-3 font-medium">المخزون</th>
                  <th className="px-5 py-3 font-medium">السعر</th>
                  <th className="px-5 py-3 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const badge = statusBadge(p.status);
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-gray-100">
                            <Image src={p.imageUrl} alt={p.title} fill sizes="44px" className="object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-ink">{p.title}</p>
                            <p className="text-xs text-ink-soft">{p.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3"><span className={`badge ${badge.className}`}>{badge.label}</span></td>
                      <td className="px-5 py-3 text-ink-soft">{p.stock}</td>
                      <td className="px-5 py-3 font-medium text-ink">{formatCurrency(p.price, currency)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Link href={`/dashboard/products/${p.id}`} className="text-xs font-medium text-brand-600 hover:underline">تعديل</Link>
                          <button onClick={() => setHidden((h) => [...h, p.id])} className="text-xs font-medium text-rose-600 hover:underline">حذف</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
