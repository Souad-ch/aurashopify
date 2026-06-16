"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef, useTransition } from "react";
import {
  createDiscount,
  deleteDiscount,
  toggleDiscount,
  type DiscountState,
} from "@/app/actions/discounts";
import { formatCurrency } from "@/lib/format";

type Discount = {
  id: string;
  code: string;
  type: string;
  value: number;
  active: boolean;
};

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "جارٍ الإضافة..." : "إضافة كود"}
    </button>
  );
}

export function DiscountsManager({ discounts }: { discounts: Discount[] }) {
  const [state, action] = useFormState<DiscountState, FormData>(createDiscount, undefined);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="mb-4 font-semibold text-ink">إنشاء كود خصم</h2>
        {state?.error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.error}
          </div>
        )}
        <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="label">الكود</label>
            <input name="code" required placeholder="SUMMER20" className="input uppercase" />
          </div>
          <div>
            <label className="label">النوع</label>
            <select name="type" className="input" defaultValue="percent">
              <option value="percent">نسبة %</option>
              <option value="fixed">مبلغ ثابت</option>
            </select>
          </div>
          <div>
            <label className="label">القيمة</label>
            <input name="value" type="number" step="0.01" required placeholder="20" className="input" />
          </div>
          <div className="sm:col-span-4">
            <AddButton />
          </div>
        </form>
      </div>

      <div className="card overflow-hidden">
        {discounts.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink-soft">لا توجد أكواد خصم بعد.</p>
        ) : (
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-ink-soft">
                <th className="px-5 py-3 font-medium">الكود</th>
                <th className="px-5 py-3 font-medium">الخصم</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
                <th className="px-5 py-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d.id} className="border-b border-gray-50">
                  <td className="px-5 py-3 font-mono font-bold text-ink">{d.code}</td>
                  <td className="px-5 py-3 text-ink-soft">
                    {d.type === "percent" ? `${d.value}%` : formatCurrency(d.value)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge ${d.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-ink-soft"}`}>
                      {d.active ? "نشط" : "معطّل"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startTransition(() => toggleDiscount(d.id))}
                        className="text-xs font-medium text-brand-600 hover:underline"
                      >
                        {d.active ? "تعطيل" : "تفعيل"}
                      </button>
                      <button
                        onClick={() => startTransition(() => deleteDiscount(d.id))}
                        className="text-xs font-medium text-rose-600 hover:underline"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
