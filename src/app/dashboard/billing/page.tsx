import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";
import { PLANS, USER } from "@/lib/mock";

export default function BillingPage() {
  const plan = PLANS.find((p) => p.name === USER.plan) || PLANS[1];
  const startedAt = "2026-03-01";
  const renewsAt = "2026-07-01";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">الفوترة والاشتراك</h1>
        <p className="text-sm text-ink-soft">أدر خطتك ومدفوعاتك</p>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-ink">خطة {plan.name}</h2>
              <span className="badge bg-green-100 text-green-700">نشط</span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">{plan.description}</p>
            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-ink-soft">السعر</p>
                <p className="font-semibold text-ink">{formatCurrency(plan.priceMonthly)}/شهر</p>
              </div>
              <div>
                <p className="text-ink-soft">التجديد القادم</p>
                <p className="font-semibold text-ink">{formatDate(renewsAt)}</p>
              </div>
              <div>
                <p className="text-ink-soft">بدأ في</p>
                <p className="font-semibold text-ink">{formatDate(startedAt)}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/pricing" className="btn-primary">تغيير الخطة</Link>
            <button className="btn-outline w-full text-rose-600">إلغاء الاشتراك</button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink">الخطط المتاحة</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {PLANS.map((p) => {
            const isCurrent = p.name === plan.name;
            return (
              <div key={p.id} className={`card p-5 ${isCurrent ? "ring-2 ring-brand-500" : ""}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-ink">{p.name}</h3>
                  {isCurrent && <span className="badge bg-brand-100 text-brand-700">الحالية</span>}
                </div>
                <p className="mt-2 text-2xl font-extrabold text-ink">
                  {formatCurrency(p.priceMonthly)}<span className="text-sm font-normal text-ink-soft">/شهر</span>
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-ink-soft">
                  {p.features.slice(0, 4).map((f) => <li key={f}>✓ {f}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-semibold text-ink">سجل الفواتير</h2>
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-ink-soft">
              <th className="pb-3 font-medium">التاريخ</th>
              <th className="pb-3 font-medium">الوصف</th>
              <th className="pb-3 font-medium">المبلغ</th>
              <th className="pb-3 font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50">
              <td className="py-3 text-ink-soft">{formatDate(startedAt)}</td>
              <td className="py-3 text-ink">اشتراك خطة {plan.name}</td>
              <td className="py-3 font-medium text-ink">{formatCurrency(plan.priceMonthly)}</td>
              <td className="py-3"><span className="badge bg-green-100 text-green-700">مدفوع</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
