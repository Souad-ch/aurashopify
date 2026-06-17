"use client";

import { useTransition } from "react";
import { applyTheme } from "@/app/actions/themes";

export function ApplyThemeButton({
  themeId,
  current,
  color,
}: {
  themeId: string;
  current: boolean;
  color: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(() => applyTheme(themeId))}
      disabled={pending || current}
      className="btn-primary w-full"
      style={current ? {} : { backgroundColor: color }}
    >
      {current ? "مُطبّق حالياً ✓" : pending ? "جارٍ التطبيق..." : "تطبيق على متجري"}
    </button>
  );
}
