import Link from "next/link";
import { redirect } from "next/navigation";
import { getDesignerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { ThemeActions } from "@/components/designer/ThemeActions";

export const dynamic = "force-dynamic";

export default async function DesignerThemesPage() {
  const designer = await getDesignerSession();
  if (!designer) redirect("/login");

  const themes = await prisma.theme.findMany({
    where: { designerId: designer.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">قوالبي</h1>
          <p className="text-sm text-ink-soft">{themes.length} قالب</p>
        </div>
        <Link href="/designer/themes/new" className="btn-primary">+ قالب جديد</Link>
      </div>

      {themes.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl">🧩</span>
          <h3 className="mt-4 text-lg font-semibold text-ink">لا توجد قوالب بعد</h3>
          <Link href="/designer/themes/new" className="btn-primary mt-6">صمّم أول قالب</Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((t) => (
            <div key={t.id} className="card overflow-hidden">
              <div
                className="flex h-28 items-center justify-center text-white"
                style={{
                  background:
                    t.hero === "gradient"
                      ? `linear-gradient(135deg, ${t.accentColor}, ${t.accentColor}aa)`
                      : t.hero === "image"
                        ? "#111827"
                        : "#f8fafc",
                }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: t.hero === "split" || t.hero === "centered" ? "#1a1a1a" : "#fff" }}
                >
                  {t.name}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-ink">{t.name}</h3>
                  <span className={`badge ${t.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-ink-soft"}`}>
                    {t.status === "published" ? "منشور" : "مسودة"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-ink-soft">{t.description}</p>
                <p className="mt-2 text-sm font-semibold text-ink">
                  {t.price > 0 ? formatCurrency(t.price) : "مجاني"} · {t.sales} مبيعة
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <Link href={`/designer/themes/${t.id}`} className="text-xs font-medium text-brand-600 hover:underline">
                    تعديل
                  </Link>
                  <ThemeActions id={t.id} status={t.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
