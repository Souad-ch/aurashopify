"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { demoRole, demoLogout } from "@/lib/demoAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (demoRole() !== "admin") {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  function logout() {
    demoLogout();
    router.push("/login");
  }

  if (!ready) {
    return <div className="grid h-screen place-items-center bg-gray-50 text-ink-soft">جارٍ التحميل...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div>
            <h1 className="text-sm font-semibold text-ink">لوحة إدارة المنصة</h1>
            <p className="text-xs text-ink-soft">مدير المنصة</p>
          </div>
          <button onClick={logout} className="btn-ghost text-sm">خروج</button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
