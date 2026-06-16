import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/dashboard/StatCard";
import { PLANS, ADMIN_STORES } from "@/lib/mock";

export default function AdminPlansPage() {
  // Count active subscribers per plan from the demo stores.
  const counts: Record<string, number> = {};
  for (const s of ADMIN_STORES) {
    if (s.plan) counts[s.plan] = (counts[s.plan] || 0) + 1;
  }
  const totalActive = Object.values(counts).reduce((a, b) => a + b, 0);
  const mrr = PLANS.reduce((sum, p) => sum + (counts[p.name] || 0) * p.priceMonthly, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">الخطط والإيرادات</h1>
        <p className="text-sm text-ink-soft">توزيع الاشتراكات والإيرادات المتكررة</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="الإيراد الشهري المتكرر (MRR)" value={formatCurrency(mrr)} icon="💵" />
        <StatCard label="الإيراد السنوي المتوقع (ARR)" value={formatCurrency(mrr * 12)} icon="📅" />
        <StatCard label="اشتراكات نشطة" value={String(totalActive)} icon="💎" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => {
          const n = counts[p.name] || 0;
          const share = totalActive ? Math.round((n / totalActive) * 100) : 0;
          return (
            <div key={p.id} className={`card p-6 ${p.highlighted ? "ring-1 ring-brand-500" : ""}`}>
              <h3 className="text-lg font-bold text-ink">{p.name}</h3>
              <p className="mt-1 text-2xl font-extrabold text-ink">
                {formatCurrency(p.priceMonthly)}<span className="text-sm font-normal text-ink-soft">/شهر</span>
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-ink-soft">المشتركون النشطون</span>
                <span className="font-semibold text-ink">{n}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full bg-brand-500" style={{ width: `${share}%` }} />
              </div>
              <p className="mt-1 text-xs text-ink-soft">{share}% من المشتركين</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
