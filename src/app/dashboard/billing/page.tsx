import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, statusBadge } from "@/lib/format";
import {
  cancelSubscription,
  finalizeStripeSubscription,
} from "@/app/actions/subscription";

export const dynamic = "force-dynamic";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { subscribed?: string; session_id?: string };
}) {
  let user = await getCurrentUser();
  if (!user) redirect("/login");

  // Returning from Stripe Checkout: confirm payment and activate the plan.
  if (searchParams.session_id) {
    await finalizeStripeSubscription(searchParams.session_id);
    user = await getCurrentUser();
  }

  const sub = user!.subscription;
  const plans = await prisma.plan.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">الفوترة والاشتراك</h1>
        <p className="text-sm text-ink-soft">أدر خطتك ومدفوعاتك</p>
      </div>

      {(searchParams.subscribed || searchParams.session_id) && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          🎉 تم تفعيل اشتراكك بنجاح!
        </div>
      )}

      {sub ? (
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-ink">
                  خطة {sub.plan.name}
                </h2>
                <span className={`badge ${statusBadge(sub.status).className}`}>
                  {statusBadge(sub.status).label}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                {sub.plan.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="text-ink-soft">السعر</p>
                  <p className="font-semibold text-ink">
                    {formatCurrency(
                      sub.interval === "yearly"
                        ? sub.plan.priceYearly
                        : sub.plan.priceMonthly
                    )}
                    /{sub.interval === "yearly" ? "سنة" : "شهر"}
                  </p>
                </div>
                <div>
                  <p className="text-ink-soft">التجديد القادم</p>
                  <p className="font-semibold text-ink">
                    {formatDate(sub.renewsAt)}
                  </p>
                </div>
                <div>
                  <p className="text-ink-soft">بدأ في</p>
                  <p className="font-semibold text-ink">
                    {formatDate(sub.startedAt)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/pricing" className="btn-primary">
                تغيير الخطة
              </Link>
              {sub.status === "active" && (
                <form action={cancelSubscription}>
                  <button type="submit" className="btn-outline w-full text-rose-600">
                    إلغاء الاشتراك
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl">💳</span>
          <h3 className="mt-4 text-lg font-semibold text-ink">
            لا يوجد اشتراك نشط
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            اختر خطة لإطلاق العنان لكامل إمكانات Aura.
          </p>
          <Link href="/pricing" className="btn-primary mt-6">
            عرض الخطط
          </Link>
        </div>
      )}

      {/* Plans comparison */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink">الخطط المتاحة</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((p) => {
            const features = JSON.parse(p.features) as string[];
            const isCurrent = sub?.plan.slug === p.slug;
            return (
              <div
                key={p.id}
                className={`card p-5 ${isCurrent ? "ring-2 ring-brand-500" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-ink">{p.name}</h3>
                  {isCurrent && (
                    <span className="badge bg-brand-100 text-brand-700">
                      الحالية
                    </span>
                  )}
                </div>
                <p className="mt-2 text-2xl font-extrabold text-ink">
                  {formatCurrency(p.priceMonthly)}
                  <span className="text-sm font-normal text-ink-soft">/شهر</span>
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-ink-soft">
                  {features.slice(0, 4).map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice history (illustrative) */}
      <div className="card p-6">
        <h2 className="mb-4 font-semibold text-ink">سجل الفواتير</h2>
        {sub ? (
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
                <td className="py-3 text-ink-soft">{formatDate(sub.startedAt)}</td>
                <td className="py-3 text-ink">اشتراك خطة {sub.plan.name}</td>
                <td className="py-3 font-medium text-ink">
                  {formatCurrency(
                    sub.interval === "yearly"
                      ? sub.plan.priceYearly
                      : sub.plan.priceMonthly
                  )}
                </td>
                <td className="py-3">
                  <span className="badge bg-green-100 text-green-700">مدفوع</span>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-ink-soft">لا توجد فواتير بعد.</p>
        )}
      </div>
    </div>
  );
}
