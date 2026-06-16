"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/dashboard", label: "نظرة عامة", icon: "🏠", exact: true },
  { href: "/dashboard/products", label: "المنتجات", icon: "📦" },
  { href: "/dashboard/orders", label: "الطلبات", icon: "🧾" },
  { href: "/dashboard/customers", label: "العملاء", icon: "👥" },
  { href: "/dashboard/discounts", label: "الخصومات والعروض", icon: "🏷️" },
  { href: "/dashboard/analytics", label: "التحليلات", icon: "📊" },
  { href: "/dashboard/billing", label: "الفوترة والاشتراك", icon: "💳" },
  { href: "/dashboard/settings", label: "الإعدادات", icon: "⚙️" },
];

export function Sidebar({
  storeSlug,
  isAdmin,
}: {
  storeSlug?: string;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-l border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-100 px-6">
        <Logo href="/dashboard" />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-soft hover:bg-gray-50 hover:text-ink"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      {isAdmin && (
        <div className="px-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg bg-ink px-3 py-2.5 text-sm font-medium text-white transition hover:bg-black"
          >
            <span>🛰️</span>
            لوحة إدارة المنصة
          </Link>
        </div>
      )}
      {storeSlug && (
        <div className="border-t border-gray-100 p-4">
          <Link
            href={`/store/${storeSlug}`}
            target="_blank"
            className="btn-outline w-full text-sm"
          >
            🔗 عرض المتجر
          </Link>
        </div>
      )}
    </aside>
  );
}
