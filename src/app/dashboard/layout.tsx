"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { demoRole } from "@/lib/demoAuth";
import { STORE, USER } from "@/lib/mock";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = demoRole();
    if (!role) {
      router.replace("/login");
      return;
    }
    setIsAdmin(role === "admin");
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="grid h-screen place-items-center bg-gray-50 text-ink-soft">
        جارٍ التحميل...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar storeSlug={STORE.slug} isAdmin={isAdmin} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar userName={USER.name} storeName={STORE.name} planName={USER.plan} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
