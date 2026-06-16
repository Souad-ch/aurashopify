import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            منصة التجارة الإلكترونية لبناء متجرك وإدارته وتنميته في مكان واحد.
          </p>
        </div>
        <FooterCol
          title="المنتج"
          links={[
            ["المميزات", "/#features"],
            ["الأسعار", "/pricing"],
            ["متجر تجريبي", "/store/aura-boutique"],
          ]}
        />
        <FooterCol
          title="الحساب"
          links={[
            ["تسجيل الدخول", "/login"],
            ["إنشاء حساب", "/register"],
            ["لوحة التحكم", "/dashboard"],
          ]}
        />
        <FooterCol
          title="الشركة"
          links={[
            ["من نحن", "/#features"],
            ["تواصل معنا", "/#features"],
            ["الخصوصية", "/#features"],
          ]}
        />
      </div>
      <div className="border-t border-gray-100 py-6 text-center text-sm text-ink-soft">
        © {new Date().getFullYear()} Aura. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-ink">{title}</h4>
      <ul className="space-y-2 text-sm text-ink-soft">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="hover:text-ink">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
