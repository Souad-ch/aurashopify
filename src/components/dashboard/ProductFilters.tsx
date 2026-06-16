"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export function ProductFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft">
          🔍
        </span>
        <input
          defaultValue={searchParams.get("q") || ""}
          onChange={(e) => setParam("q", e.target.value)}
          placeholder="ابحث عن منتج..."
          className="input pr-10"
        />
      </div>
      <select
        defaultValue={searchParams.get("status") || ""}
        onChange={(e) => setParam("status", e.target.value)}
        className="input w-auto"
      >
        <option value="">كل الحالات</option>
        <option value="active">نشط</option>
        <option value="draft">مسودة</option>
        <option value="archived">مؤرشف</option>
      </select>
      {categories.length > 0 && (
        <select
          defaultValue={searchParams.get("category") || ""}
          onChange={(e) => setParam("category", e.target.value)}
          className="input w-auto"
        >
          <option value="">كل التصنيفات</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
