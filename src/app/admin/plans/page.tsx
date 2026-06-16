import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/dashboard/StatCard";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { order: "asc" },
    include: {
      subscriptions: { where: { status: "active" } },
    },
  });

  // Monthly recurring revenue (normalize yearly to monthly)
  let mrr = 0;
  for (const plan of plans) {
    for (const sub of plan.subscriptions) {
      mrr +=
        sub.interval === "yearly" ? plan.priceYearly / 12 : plan.priceMonthly;
    }
  }
  const totalActive = plans.reduce((s, p) => s + p.subscriptions.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">الخطط والإيرادات</h1>
        <p className="text-sm text-ink-soft">توزيع الاشتراكات والإيرادات المتكررة</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="الإيراد الشهري المتكرر (MRR)"
          value={formatCurrency(mrr)}
          icon="💵"
        />
        <StatCard
          label="الإيراد السنوي المتوقع (ARR)"
          value={formatCurrency(mrr * 12)}
          icon="📅"
        />
        <StatCard label="اشتراكات نشطة" value={String(totalActive)} icon="💎" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((p) => {
          const share = totalActive
            ? Math.round((p.subscriptions.length / totalActive) * 100)
            : 0;
          return (
            <div
              key={p.id}
              className={`card p-6 ${p.highlighted ? "ring-1 ring-brand-500" : ""}`}
            >
              <h3 className="text-lg font-bold text-ink">{p.name}</h3>
              <p className="mt-1 text-2xl font-extrabold text-ink">
                {formatCurrency(p.priceMonthly)}
                <span className="text-sm font-normal text-ink-soft">/شهر</span>
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-ink-soft">المشتركون النشطون</span>
                <span className="font-semibold text-ink">
                  {p.subscriptions.length}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-brand-500"
                  style={{ width: `${share}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-ink-soft">{share}% من المشتركين</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
