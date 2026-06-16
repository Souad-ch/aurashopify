import { Logo } from "@/components/Logo";
import { RegisterForm } from "@/components/AuthForms";

export default function RegisterPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-gradient-to-br from-ink to-gray-800 lg:block">
        <div className="flex h-full flex-col justify-center px-16 text-white">
          <h2 className="text-4xl font-extrabold leading-tight">ابدأ رحلتك في التجارة الإلكترونية.</h2>
          <p className="mt-4 max-w-md text-lg text-gray-300">
            أنشئ متجرك خلال دقائق وابدأ البيع للعالم كله. بدون بطاقة ائتمان.
          </p>
          <ul className="mt-8 space-y-3 text-gray-200">
            {["متجر إلكتروني جاهز", "لوحة تحكم وتحليلات", "دعم على مدار الساعة"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-xs">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Logo />
          <h1 className="mt-8 text-2xl font-bold text-ink">أنشئ حسابك</h1>
          <p className="mt-1 text-sm text-ink-soft">ابدأ تجربتك المجانية الآن.</p>
          <div className="mt-6">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
