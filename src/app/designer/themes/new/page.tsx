import Link from "next/link";
import { ThemeForm } from "@/components/designer/ThemeForm";

export default function NewThemePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/designer/themes" className="text-sm text-ink-soft hover:text-ink">← العودة إلى قوالبي</Link>
        <h1 className="mt-2 text-2xl font-bold text-ink">تصميم قالب جديد</h1>
      </div>
      <ThemeForm />
    </div>
  );
}
