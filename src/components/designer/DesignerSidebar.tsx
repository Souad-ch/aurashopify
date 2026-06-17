"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/designer", label: "نظرة عامة", icon: "🎨", exact: true },
  { href: "/designer/themes", label: "قوالبي", icon: "🧩" },
  { href: "/designer/themes/new", label: "قالب جديد", icon: "➕" },
];

export function DesignerSidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-64 flex-col border-l border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6">
        <Logo href="/designer" />
        <span className="badge bg-brand-100 text-brand-700">مصمّم</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-brand-50 text-brand-700" : "text-ink-soft hover:bg-gray-50 hover:text-ink"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
