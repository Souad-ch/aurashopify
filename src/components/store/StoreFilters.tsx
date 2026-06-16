"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

export function StoreFilters({
  categories,
  color,
}: {
  categories: string[];
  color: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const activeCat = params.get("category") || "";

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    router.replace(`${pathname}?${p.toString()}`);
  }

  return (
    <div className="mb-8 space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setParam("q", q);
        }}
        className="relative max-w-md"
      >
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft">
          🔍
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="input pr-10"
        />
      </form>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setParam("category", "")}
            className="rounded-full border px-4 py-1.5 text-sm font-medium transition"
            style={
              !activeCat
                ? { background: color, color: "#fff", borderColor: color }
                : { borderColor: "#e5e7eb", color: "#616161" }
            }
          >
            الكل
          </button>
          {categories.map((c) => {
            const on = activeCat === c;
            return (
              <button
                key={c}
                onClick={() => setParam("category", c)}
                className="rounded-full border px-4 py-1.5 text-sm font-medium transition"
                style={
                  on
                    ? { background: color, color: "#fff", borderColor: color }
                    : { borderColor: "#e5e7eb", color: "#616161" }
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
