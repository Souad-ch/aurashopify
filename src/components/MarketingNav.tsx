import Link from "next/link";
import { Logo } from "./Logo";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-ink-soft md:flex">
            <Link href="/#features" className="hover:text-ink">
              المميزات
            </Link>
            <Link href="/pricing" className="hover:text-ink">
              الأسعار
            </Link>
            <Link href="/store/aura-boutique" className="hover:text-ink">
              متجر تجريبي
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost hidden sm:inline-flex">
            تسجيل الدخول
          </Link>
          <Link href="/register" className="btn-primary">
            ابدأ مجاناً
          </Link>
        </div>
      </div>
    </header>
  );
}
