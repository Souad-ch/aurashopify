import Link from "next/link";
import { redirect } from "next/navigation";
import { getDesignerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/dashboard/StatCard";

export const dynamic = "force-dynamic";

export default async function DesignerOverview() {
  const designer = await getDesignerSession();
  if (!designer) redirect("/login");

  const themes = await prisma.theme.findMany({
    where: { designerId: designer.userId },
    orderBy: { createdAt: "desc" },
  });

  const published = themes.filter((t) => t.status === "published").length;
  const totalSales = themes.reduce((s, t) => s + t.sales, 0);
  const earnings = themes.reduce((s, t) => s + t.sales * t.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">استوديو القوالب</h1>
          <p className="text-sm text-ink-soft">أهلاً {designer.name}، صمّم قوالبك وبِعها للتجّار.</p>
        </div>
        <Link href="/designer/themes/new" className="btn-primary">+ قالب جديد</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="إجمالي القوالب" value={String(themes.length)} icon="🧩" />
        <StatCard label="منشورة" value={String(published)} icon="✅" />
        <StatCard label="إجمالي المبيعات" value={String(totalSales)} icon="🛒" />
        <StatCard label="الأرباح" value={formatCurrency(earnings)} icon="💰" />
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">قوالبي</h2>
          <Link href="/designer/themes" className="text-sm font-medium text-brand-600">عرض الكل</Link>
        </div>
        {themes.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-ink-soft">لا توجد قوالب بعد.</p>
            <Link href="/designer/themes/new" className="btn-primary mt-4">صمّم أول قالب</Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {themes.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg" style={{ background: t.accentColor }} />
                  <div>
                    <p className="font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-ink-soft">
                      {t.price > 0 ? formatCurrency(t.price) : "مجاني"} · {t.sales} مبيعة
                    </p>
                  </div>
                </div>
                <span className={`badge ${t.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-ink-soft"}`}>
                  {t.status === "published" ? "منشور" : "مسودة"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
