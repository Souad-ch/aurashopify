import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user?.store) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">الإعدادات</h1>
        <p className="text-sm text-ink-soft">أدر معلومات متجرك وتفضيلاته</p>
      </div>
      <SettingsForm store={user.store} />
    </div>
  );
}
