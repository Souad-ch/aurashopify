import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { TemplatePicker } from "@/components/TemplatePicker";
import { completeOnboarding } from "@/app/actions/store";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.store) redirect("/admin");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex h-16 items-center border-b border-gray-100 bg-white px-6">
        <Logo />
        <span className="mr-3 text-sm text-ink-soft">إعداد متجرك</span>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="text-center">
          <span className="badge bg-brand-100 text-brand-700">الخطوة الأخيرة</span>
          <h1 className="mt-4 text-3xl font-extrabold text-ink">
            اختر قالب متجر «{user.store.name}»
          </h1>
          <p className="mt-2 text-ink-soft">
            اختر الشكل الذي يناسب علامتك التجارية — تقدر تغيّره لاحقاً في أي وقت.
          </p>
        </div>

        <form action={completeOnboarding} className="mt-10">
          <TemplatePicker defaultValue={user.store.template} />

          <div className="mx-auto mt-8 max-w-md">
            <label className="label">شعار/جملة ترويجية للمتجر (اختياري)</label>
            <input
              name="tagline"
              defaultValue={user.store.tagline || ""}
              className="input"
              placeholder="مثال: أفضل المنتجات بأفضل الأسعار"
            />
          </div>

          <div className="mt-8 flex justify-center">
            <button type="submit" className="btn-primary px-10 py-3 text-base">
              إنشاء متجري 🚀
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
