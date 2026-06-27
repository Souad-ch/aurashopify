import Link from "next/link";
import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";
import { AmbientCanvas } from "@/components/fx/AmbientCanvas";
import { FadeIn, Stagger } from "@/components/fx/Motion";

const FEATURES = [
  { icon: "🛍️", title: "متجر إلكتروني كامل", desc: "واجهة متجر جاهزة وسريعة وقابلة للتخصيص بالكامل لتعرض منتجاتك بأفضل شكل." },
  { icon: "📊", title: "تحليلات ولوحة تحكم", desc: "تابع مبيعاتك وطلباتك وعملاءك من لوحة تحكم واحدة قوية وسهلة الاستخدام." },
  { icon: "📦", title: "إدارة المنتجات والمخزون", desc: "أضف وعدّل منتجاتك، تتبّع المخزون، ونظّم تشكيلاتك بكل سهولة." },
  { icon: "💳", title: "مدفوعات واشتراكات", desc: "خطط اشتراك مرنة ونظام فوترة Stripe متكامل ينمو مع حجم أعمالك." },
  { icon: "👥", title: "إدارة العملاء", desc: "اعرف عملاءك، تابع طلباتهم، وابنِ علاقات تدوم طويلاً." },
  { icon: "🎨", title: "قوالب وتخصيص كامل", desc: "اختر قالب متجرك من سوق القوالب، وخصّص الألوان والهوية بدون كود." },
];

const STATS: [string, string][] = [
  ["+50K", "متجر نشط"],
  ["$2B+", "مبيعات سنوية"],
  ["99.9%", "وقت تشغيل"],
  ["175", "دولة"],
];

export default function HomePage() {
  return (
    <>
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="grid-fade absolute inset-0" />
        <AmbientCanvas />
        <div className="orb orb-2 -left-24 -top-10 h-72 w-72 bg-brand-300" />
        <div className="orb orb-3 right-0 top-24 h-80 w-80 bg-brand-400" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <FadeIn>
            <span className="badge border border-brand-200 bg-white/70 text-brand-700 backdrop-blur">
              🚀 منصة التجارة الإلكترونية رقم 1
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-6xl">
              ابنِ متجرك الإلكتروني وابدأ البيع{" "}
              <span className="shimmer-text">خلال دقائق</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-soft">
              Aura تمنحك كل ما تحتاجه لإنشاء متجر احترافي وإدارة المنتجات والطلبات
              والعملاء، وتنمية أعمالك — كل ذلك من مكان واحد.
            </p>
          </FadeIn>
          <FadeIn delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register" className="btn-primary px-6 py-3 text-base shadow-lg shadow-brand-600/20">
                ابدأ تجربتك المجانية
              </Link>
              <Link href="/store/aura-boutique" className="btn-outline px-6 py-3 text-base">
                شاهد متجراً تجريبياً
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-soft">بدون بطاقة ائتمان · إلغاء في أي وقت</p>
          </FadeIn>

          {/* Dashboard preview */}
          <FadeIn delay={0.32} y={40}>
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-pop ring-1 ring-brand-100">
                <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="mr-3 text-xs text-ink-soft">app.aura.com/dashboard</span>
                </div>
                <div className="grid grid-cols-3 gap-4 p-6 text-right">
                  {[["إجمالي المبيعات", "$48,290", "+12.5%"], ["الطلبات", "1,284", "+8.2%"], ["العملاء", "642", "+5.1%"]].map(([l, v, d]) => (
                    <div key={l} className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-ink-soft">{l}</p>
                      <p className="mt-1 text-2xl font-bold text-ink">{v}</p>
                      <p className="text-xs font-medium text-brand-600">{d}</p>
                    </div>
                  ))}
                  <div className="col-span-3 flex h-40 items-end gap-2 rounded-xl bg-gray-50 p-4">
                    {[40, 65, 50, 80, 60, 90, 75, 95, 70, 100, 85, 92].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand-300 to-brand-500" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-white">
        <Stagger className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {STATS.map(([v, l]) => (
            <Stagger.Item key={l} lift={false} className="text-center">
              <p className="text-3xl font-extrabold text-brand-600">{v}</p>
              <p className="mt-1 text-sm text-ink-soft">{l}</p>
            </Stagger.Item>
          ))}
        </Stagger>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">كل ما تحتاجه لتنجح</h2>
            <p className="mt-4 text-lg text-ink-soft">أدوات قوية مصممة لتساعدك على البيع أكثر وإدارة أقل.</p>
          </FadeIn>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Stagger.Item key={f.title} className="card h-full p-6 transition-shadow hover:shadow-pop">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl">{f.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
              </Stagger.Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink py-20">
        <div className="orb orb-2 left-1/4 top-0 h-64 w-64 bg-brand-600" />
        <FadeIn className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">جاهز لتبدأ البيع؟</h2>
          <p className="mt-4 text-lg text-gray-300">انضم إلى آلاف التجار الذين يثقون بـ Aura لتنمية أعمالهم.</p>
          <Link href="/register" className="btn-primary mt-8 px-8 py-3 text-base">أنشئ متجرك الآن</Link>
        </FadeIn>
      </section>

      <Footer />
    </>
  );
}
