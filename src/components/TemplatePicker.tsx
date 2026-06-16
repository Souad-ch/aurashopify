"use client";

import { useState } from "react";
import { TEMPLATES, type TemplateId } from "@/lib/templates";

/** A mini visual preview of how each template's storefront looks. */
function TemplatePreview({
  id,
  selected,
}: {
  id: TemplateId;
  selected: boolean;
}) {
  const t = TEMPLATES.find((x) => x.id === id)!;
  const { bg, accent, text } = t.preview;
  return (
    <div
      className={`overflow-hidden rounded-xl border-2 transition ${
        selected ? "border-brand-600 ring-2 ring-brand-200" : "border-gray-200"
      }`}
    >
      {/* fake header */}
      <div className="flex items-center justify-between px-3 py-2" style={{ background: bg }}>
        <span className="h-2 w-10 rounded" style={{ background: accent }} />
        <span className="h-2 w-6 rounded" style={{ background: text, opacity: 0.4 }} />
      </div>
      {/* fake hero */}
      <div
        className="flex h-16 items-center justify-center"
        style={{
          background:
            t.hero === "gradient"
              ? `linear-gradient(135deg, ${accent}, ${accent}aa)`
              : t.hero === "image"
                ? text
                : bg,
        }}
      >
        <span
          className="h-2 w-20 rounded"
          style={{
            background: t.hero === "image" || t.hero === "gradient" ? "#ffffff" : text,
            opacity: 0.85,
          }}
        />
      </div>
      {/* fake product grid */}
      <div
        className="grid gap-1.5 p-3"
        style={{ gridTemplateColumns: `repeat(${t.productColumns}, 1fr)`, background: "#fff" }}
      >
        {Array.from({ length: t.productColumns }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div
              className={`aspect-square ${t.rounded === "rounded-none" ? "" : "rounded-md"}`}
              style={{ background: `${accent}22` }}
            />
            <div className="h-1.5 w-3/4 rounded" style={{ background: text, opacity: 0.25 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TemplatePicker({
  name = "template",
  defaultValue = "modern",
}: {
  name?: string;
  defaultValue?: string;
}) {
  const [selected, setSelected] = useState<TemplateId>(
    (TEMPLATES.find((t) => t.id === defaultValue)?.id as TemplateId) || "modern"
  );

  return (
    <div>
      <input type="hidden" name={name} value={selected} />
      <div className="grid gap-5 sm:grid-cols-2">
        {TEMPLATES.map((t) => {
          const isSel = selected === t.id;
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`group text-right transition ${isSel ? "" : "opacity-90 hover:opacity-100"}`}
            >
              <TemplatePreview id={t.id} selected={isSel} />
              <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-ink">{t.name}</h3>
                    {isSel && (
                      <span className="badge bg-brand-600 text-white">مُختار ✓</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                    {t.description}
                  </p>
                </div>
                <span
                  className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                    isSel ? "border-brand-600 bg-brand-600 text-white" : "border-gray-300"
                  }`}
                >
                  {isSel ? "✓" : ""}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
