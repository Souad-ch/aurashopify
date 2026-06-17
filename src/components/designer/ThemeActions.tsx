"use client";

import { useTransition } from "react";
import { setThemeStatus, deleteTheme } from "@/app/actions/themes";

export function ThemeActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [pending, start] = useTransition();
  const published = status === "published";
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => start(() => setThemeStatus(id, published ? "draft" : "published"))}
        disabled={pending}
        className="text-xs font-medium text-brand-600 hover:underline"
      >
        {published ? "إلغاء النشر" : "نشر"}
      </button>
      <button
        onClick={() => start(() => deleteTheme(id))}
        disabled={pending}
        className="text-xs font-medium text-rose-600 hover:underline"
      >
        حذف
      </button>
    </div>
  );
}
