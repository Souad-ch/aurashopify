import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  // Users without a store are routed to their own area.
  if (!user.store) redirect(user.role === "designer" ? "/designer" : "/admin");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar storeSlug={user.store?.slug} isAdmin={user.role === "admin"} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          userName={user.name}
          storeName={user.store?.name || "متجري"}
          planName={user.subscription?.plan.name}
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
