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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الرفع");
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل الرفع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-start gap-4">
        <div
          className={`relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden border border-dashed border-gray-300 bg-gray-50 ${rounded}`}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="معاينة" className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl text-gray-300">🖼️</span>
          )}
          {loading && (
            <div className="absolute inset-0 grid place-items-center bg-white/70 text-xs text-ink-soft">
              رفع...
            </div>
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
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="btn-outline text-sm"
            >
              {url ? "تغيير الصورة" : "رفع صورة"}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="btn-ghost text-sm text-rose-600"
              >
                إزالة
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            JPG, PNG, WEBP حتى 5 ميجابايت
          </p>
          {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
