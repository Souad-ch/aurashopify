"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/admin", label: "نظرة عامة", icon: "🛰️", exact: true },
  { href: "/admin/stores", label: "المتاجر", icon: "🏪" },
  { href: "/admin/users", label: "المستخدمون", icon: "👤" },
  { href: "/admin/plans", label: "الخطط والإيرادات", icon: "💎" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-64 flex-col border-l border-gray-800 bg-ink text-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
        <Logo href="/admin" light />
        <span className="badge bg-brand-600 text-white">Admin</span>
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
                  ? "bg-brand-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <Link href="/dashboard" className="block text-sm text-gray-400 hover:text-white">
          ← لوحة التاجر
        </Link>
      </div>
    </aside>
  );
}
