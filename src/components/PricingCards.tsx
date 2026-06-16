"use client";

import { useState } from "react";
import { subscribeToPlan } from "@/app/actions/subscription";
import { formatCurrency } from "@/lib/format";

type Plan = {
  id: string;
  name: string;
  slug: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  highlighted: boolean;
};

export function PricingCards({
  plans,
  loggedIn,
  currentPlanSlug,
}: {
  plans: Plan[];
  loggedIn: boolean;
  currentPlanSlug?: string | null;
}) {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");

  return (
    <div>
      {/* Toggle */}
      <div className="mb-10 flex items-center justify-center gap-3">
        <span
          className={interval === "monthly" ? "font-semibold text-ink" : "text-ink-soft"}
        >
          شهري
        </span>
        <button
          type="button"
          onClick={() =>
            setInterval((i) => (i === "monthly" ? "yearly" : "monthly"))
          }
          className="relative h-7 w-14 rounded-full bg-brand-600 transition"
          aria-label="تبديل دورة الفوترة"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
              interval === "yearly" ? "right-1" : "right-8"
            }`}
          />
        </button>
        <span
          className={interval === "yearly" ? "font-semibold text-ink" : "text-ink-soft"}
        >
          سنوي{" "}
          <span className="badge bg-brand-100 text-brand-700">وفّر شهرين</span>
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = interval === "monthly" ? plan.priceMonthly : plan.priceYearly;
          const isCurrent = currentPlanSlug === plan.slug;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-brand-500 shadow-pop ring-1 ring-brand-500"
                  : "border-gray-200 shadow-card"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 right-8 badge bg-brand-600 text-white">
                  الأكثر شيوعاً
                </span>
              )}
              <h3 className="text-xl font-bold text-ink">{plan.name}</h3>
              <p className="mt-2 text-sm text-ink-soft">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-ink">
                  {formatCurrency(price)}
                </span>
                <span className="text-ink-soft">
                  /{interval === "monthly" ? "شهر" : "سنة"}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-xs text-brand-600">
                      ✓
                    </span>
                    <span className="text-ink-soft">{f}</span>
                  </li>
                ))}
              </ul>

              <form action={subscribeToPlan} className="mt-8">
                <input type="hidden" name="planSlug" value={plan.slug} />
                <input type="hidden" name="interval" value={interval} />
                <button
                  type="submit"
                  disabled={isCurrent}
                  className={`w-full ${
                    plan.highlighted ? "btn-primary" : "btn-outline"
                  } py-3`}
                >
                  {isCurrent
                    ? "خطتك الحالية"
                    : loggedIn
                      ? "الاشتراك الآن"
                      : "ابدأ الآن"}
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
