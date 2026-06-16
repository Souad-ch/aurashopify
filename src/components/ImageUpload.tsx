"use client";

import { useState, useRef } from "react";

export function ImageUpload({
  name,
  defaultValue,
  label = "الصورة",
  rounded = "rounded-lg",
}: {
  name: string;
  defaultValue?: string | null;
  label?: string;
  rounded?: string;
}) {
  const [url, setUrl] = useState(defaultValue || "");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    // Demo: preview locally via a data URL (no server upload).
    const reader = new FileReader();
    reader.onload = () => setUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label className="label">{label}</label>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-start gap-4">
        <div className={`relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden border border-dashed border-gray-300 bg-gray-50 ${rounded}`}>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="معاينة" className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl text-gray-300">🖼️</span>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className="btn-outline text-sm">
              {url ? "تغيير الصورة" : "رفع صورة"}
            </button>
            {url && (
              <button type="button" onClick={() => setUrl("")} className="btn-ghost text-sm text-rose-600">
                إزالة
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-ink-soft">JPG, PNG, WEBP — معاينة فورية</p>
        </div>
      </div>
    </div>
  );
}
