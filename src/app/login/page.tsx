import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/AuthForms";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Logo />
          <h1 className="mt-8 text-2xl font-bold text-ink">مرحباً بعودتك 👋</h1>
          <p className="mt-1 text-sm text-ink-soft">سجّل الدخول لإدارة متجرك على Aura.</p>
          <div className="mt-4 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-xs text-brand-800">
            نسخة تجريبية: استخدم <b>demo@aura.com</b> للتاجر أو <b>admin@aura.com</b> للأدمن (أي كلمة مرور).
          </div>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="hidden bg-gradient-to-br from-brand-500 to-brand-700 lg:block">
        <div className="flex h-full flex-col justify-center px-16 text-white">
          <h2 className="text-4xl font-extrabold leading-tight">أدر متجرك من أي مكان.</h2>
          <p className="mt-4 max-w-md text-lg text-brand-50">
            لوحة تحكم قوية، تحليلات لحظية، وكل أدوات النمو في متناول يدك.
          </p>
        </div>
      </div>
    </div>
  );
}
