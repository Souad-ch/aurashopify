import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { STORE } from "@/lib/mock";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">الإعدادات</h1>
        <p className="text-sm text-ink-soft">أدر معلومات متجرك وتفضيلاته</p>
      </div>
      <SettingsForm store={STORE} />
    </div>
  );
}
