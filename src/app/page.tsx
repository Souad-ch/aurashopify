import Link from "next/link";
import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";
import { AmbientCanvas } from "@/components/fx/AmbientCanvas";
import { Reveal } from "@/components/fx/Reveal";

const FEATURES = [
  {
    icon: "🛍️",
    title: "متجر إلكتروني كامل",
    desc: "واجهة متجر جاهزة وسريعة وقابلة للتخصيص بالكامل لتعرض منتجاتك بأفضل شكل.",
  },
  {
    icon: "📊",
    title: "تحليلات ولوحة تحكم",
    desc: "تابع مبيعاتك وطلباتك وعملاءك من لوحة تحكم واحدة قوية وسهلة الاستخدام.",
  },
  {
    icon: "📦",
    title: "إدارة المنتجات والمخزون",
    desc: "أضف وعدّل منتجاتك، تتبّع المخزون، ونظّم تشكيلاتك بكل سهولة.",
  },
  {
    icon: "💳",
    title: "مدفوعات واشتراكات",
    desc: "خطط اشتراك مرنة ونظام فوترة متكامل ينمو مع حجم أعمالك.",
  },
  {
    icon: "👥",
    title: "إدارة العملاء",
    desc: "اعرف عملاءك، تابع طلباتهم، وابنِ علاقات تدوم طويلاً.",
  },
  {
    icon: "🎨",
    title: "تخصيص كامل",
    desc: "ألوان وشعار وهوية متجرك — كل شيء تحت سيطرتك بدون كتابة كود.",
  },
];

const STATS = [
  ["+50K", "متجر نشط"],
  ["$2B+", "مبيعات سنوية"],
  ["99.9%", "وقت تشغيل"],
  ["175", "دولة"],
];

export default function HomePage() {
  return (
    <>
      <Reveal />
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <AmbientCanvas />
        <div className="orb orb-2 -left-20 -top-10 h-72 w-72 bg-brand-300" />
        <div className="orb orb-3 right-0 top-24 h-80 w-80 bg-brand-400" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <span className="reveal badge bg-brand-100 text-brand-700">
            🚀 منصة التجارة الإلكترونية رقم 1
          </span>
          <h1 className="reveal reveal-d1 mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-6xl">
            ابنِ متجرك الإلكتروني وابدأ البيع{" "}
            <span className="shimmer-text">خلال دقائق</span>
          </h1>
          <p className="reveal reveal-d2 mx-auto mt-6 max-w-2xl text-lg text-ink-soft">
            Aura تمنحك كل ما تحتاجه لإنشاء متجر احترافي وإدارة المنتجات والطلبات
            والعملاء، وتنمية أعمالك — كل ذلك من مكان واحد.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className="btn-primary px-6 py-3 text-base">
              ابدأ تجربتك المجانية
            </Link>
            <Link
              href="/store/aura-boutique"
              className="btn-outline px-6 py-3 text-base"
            >
              شاهد متجراً تجريبياً
            </Link>
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            بدون بطاقة ائتمان · إلغاء في أي وقت
          </p>

          {/* Dashboard preview */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-pop">
              <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="mr-3 text-xs text-ink-soft">
                  app.aura.com/dashboard
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 p-6 text-right">
                {[
                  ["إجمالي المبيعات", "$48,290", "+12.5%"],
                  ["الطلبات", "1,284", "+8.2%"],
                  ["العملاء", "642", "+5.1%"],
                ].map(([l, v, d]) => (
                  <div key={l} className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-ink-soft">{l}</p>
                    <p className="mt-1 text-2xl font-bold text-ink">{v}</p>
                    <p className="text-xs font-medium text-brand-600">{d}</p>
                  </div>
                ))}
                <div className="col-span-3 flex h-40 items-end gap-2 rounded-xl bg-gray-50 p-4">
                  {[40, 65, 50, 80, 60, 90, 75, 95, 70, 100, 85, 92].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-brand-300 to-brand-500"
                        style={{ height: `${h}%` }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {STATS.map(([v, l], i) => (
            <div key={l} className={`reveal reveal-d${(i % 3) + 1} text-center`}>
              <p className="text-3xl font-extrabold text-brand-600">{v}</p>
              <p className="mt-1 text-sm text-ink-soft">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="reveal text-3xl font-extrabold text-ink sm:text-4xl">
              كل ما تحتاجه لتنجح
            </h2>
            <p className="reveal reveal-d1 mt-4 text-lg text-ink-soft">
              أدوات قوية مصممة لتساعدك على البيع أكثر وإدارة أقل.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`reveal reveal-d${(i % 3) + 1} card p-6 transition hover:-translate-y-1 hover:shadow-pop`}
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            جاهز لتبدأ البيع؟
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            انضم إلى آلاف التجار الذين يثقون بـ Aura لتنمية أعمالهم.
          </p>
          <Link
            href="/register"
            className="btn-primary mt-8 px-8 py-3 text-base"
          >
            أنشئ متجرك الآن
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
