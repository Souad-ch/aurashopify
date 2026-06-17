import { redirect } from "next/navigation";
import { getDesignerSession } from "@/lib/auth";
import { DesignerSidebar } from "@/components/designer/DesignerSidebar";
import { logoutAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export default async function DesignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const designer = await getDesignerSession();
  if (!designer) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DesignerSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div>
            <h1 className="text-sm font-semibold text-ink">استوديو القوالب</h1>
            <p className="text-xs text-ink-soft">{designer.name}</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="btn-ghost text-sm">خروج</button>
          </form>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
