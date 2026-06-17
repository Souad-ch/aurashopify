import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { ApplyThemeButton } from "@/components/dashboard/ApplyThemeButton";

export const dynamic = "force-dynamic";

export default async function ThemesMarketplacePage({
  searchParams,
}: {
  searchParams: { applied?: string };
}) {
  const user = await getCurrentUser();
  if (!user?.store) redirect("/login");

  const themes = await prisma.theme.findMany({
    where: { status: "published" },
    orderBy: { sales: "desc" },
    include: { designer: { select: { name: true } } },
  });

  const current = user.store.template;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">سوق القوالب</h1>
        <p className="text-sm text-ink-soft">
          قوالب من تصميم مبدعين — طبّقها على متجرك بضغطة
        </p>
      </div>

      {searchParams.applied && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          ✓ تم تطبيق القالب على متجرك بنجاح!
        </div>
      )}

      {themes.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl">🛍️</span>
          <h3 className="mt-4 text-lg font-semibold text-ink">لا توجد قوالب منشورة بعد</h3>
          <p className="mt-1 text-sm text-ink-soft">عُد لاحقاً، المصممون يضيفون قوالب جديدة باستمرار.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((t) => {
            const isCurrent = current === `theme:${t.id}`;
            return (
              <div key={t.id} className="card overflow-hidden">
                <div
                  className={`flex h-32 items-center justify-center ${t.font === "serif" ? "font-serif" : ""}`}
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
                    className={`text-xl font-extrabold ${t.uppercaseTitles ? "uppercase tracking-wide" : ""}`}
                    style={{ color: t.hero === "split" || t.hero === "centered" ? "#1a1a1a" : "#fff" }}
                  >
                    {t.name}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-ink">{t.name}</h3>
                    <span className="text-sm font-semibold text-brand-600">
                      {t.price > 0 ? formatCurrency(t.price) : "مجاني"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">بواسطة {t.designer.name} · {t.sales} مبيعة</p>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-soft">{t.description}</p>
                  <div className="mt-3">
                    <ApplyThemeButton themeId={t.id} current={isCurrent} color={t.accentColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
