import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/PricingCards";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const FAQ = [
  ["هل يمكنني تغيير خطتي لاحقاً؟", "نعم، يمكنك الترقية أو التخفيض في أي وقت من لوحة التحكم."],
  ["هل هناك فترة تجريبية؟", "نعم، تحصل على 14 يوماً تجريبياً مجانياً بدون بطاقة ائتمان."],
  ["ما طرق الدفع المتاحة؟", "نقبل جميع البطاقات الرئيسية والمحافظ الإلكترونية الشائعة."],
  ["هل يمكنني الإلغاء في أي وقت؟", "بالتأكيد، لا توجد عقود طويلة الأمد. ألغِ متى شئت."],
];

export default async function PricingPage() {
  const [plans, user] = await Promise.all([
    prisma.plan.findMany({ orderBy: { order: "asc" } }),
    getCurrentUser(),
  ]);

  const parsed = plans.map((p) => ({
    ...p,
    features: JSON.parse(p.features) as string[],
  }));

  return (
    <>
      <MarketingNav />
      <section className="bg-gradient-to-b from-brand-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">
            أسعار بسيطة وشفافة
          </h1>
          <p className="mt-4 text-lg text-ink-soft">
            اختر الخطة التي تناسب حجم أعمالك. بدون رسوم خفية.
          </p>
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <PricingCards
            plans={parsed}
            loggedIn={!!user}
            currentPlanSlug={user?.subscription?.plan.slug}
          />
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-extrabold text-ink">
            أسئلة شائعة
          </h2>
          <div className="mt-10 space-y-4">
            {FAQ.map(([q, a]) => (
              <div key={q} className="card p-6">
                <h3 className="font-semibold text-ink">{q}</h3>
                <p className="mt-2 text-sm text-ink-soft">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
