"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { saveTheme, type ThemeState } from "@/app/actions/themes";

type Theme = {
  id: string;
  name: string;
  description: string;
  hero: string;
  font: string;
  productColumns: number;
  cardStyle: string;
  rounded: string;
  uppercaseTitles: boolean;
  accentColor: string;
  price: number;
};

export function ThemeForm({ theme }: { theme?: Theme }) {
  const action = saveTheme.bind(null, theme?.id ?? null);
  const [state, formAction] = useFormState<ThemeState, FormData>(action, undefined);

  const [hero, setHero] = useState(theme?.hero || "gradient");
  const [font, setFont] = useState(theme?.font || "sans");
  const [cols, setCols] = useState(theme?.productColumns || 4);
  const [rounded, setRounded] = useState(theme?.rounded || "rounded-2xl");
  const [accent, setAccent] = useState(theme?.accentColor || "#2563eb");
  const [upper, setUpper] = useState(theme?.uppercaseTitles ?? false);
  const [name, setName] = useState(theme?.name || "قالبي الجديد");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={formAction} className="space-y-5">
        {state?.error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.error}
          </div>
        )}
        <div className="card space-y-4 p-6">
          <h2 className="font-semibold text-ink">معلومات القالب</h2>
          <div>
            <label className="label">اسم القالب</label>
            <input name="name" required value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">الوصف</label>
            <textarea name="description" rows={2} required defaultValue={theme?.description || ""} className="input" placeholder="وصف مختصر للقالب" />
          </div>
          <div>
            <label className="label">السعر (0 = مجاني)</label>
            <input name="price" type="number" step="0.01" min="0" defaultValue={theme?.price ?? 0} className="input" />
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <h2 className="font-semibold text-ink">التصميم</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">شكل الهيدر</label>
              <select name="hero" value={hero} onChange={(e) => setHero(e.target.value)} className="input">
                <option value="gradient">متدرّج</option>
                <option value="image">صورة كبيرة</option>
                <option value="split">مقسوم</option>
                <option value="centered">متمركز</option>
              </select>
            </div>
            <div>
              <label className="label">الخط</label>
              <select name="font" value={font} onChange={(e) => setFont(e.target.value)} className="input">
                <option value="sans">عصري (Sans)</option>
                <option value="serif">كلاسيكي (Serif)</option>
              </select>
            </div>
            <div>
              <label className="label">عدد الأعمدة</label>
              <select name="productColumns" value={cols} onChange={(e) => setCols(Number(e.target.value))} className="input">
                <option value={3}>3 أعمدة</option>
                <option value={4}>4 أعمدة</option>
              </select>
            </div>
            <div>
              <label className="label">شكل البطاقة</label>
              <select name="cardStyle" defaultValue={theme?.cardStyle || "shadow"} className="input">
                <option value="shadow">ظل</option>
                <option value="border">إطار</option>
                <option value="flat">مسطّح</option>
              </select>
            </div>
            <div>
              <label className="label">الحواف</label>
              <select name="rounded" value={rounded} onChange={(e) => setRounded(e.target.value)} className="input">
                <option value="rounded-none">حادة</option>
                <option value="rounded-lg">ناعمة</option>
                <option value="rounded-2xl">دائرية</option>
                <option value="rounded-3xl">دائرية جداً</option>
              </select>
            </div>
            <div>
              <label className="label">اللون الأساسي</label>
              <input name="accentColor" type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="input h-11 cursor-pointer p-1" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="uppercaseTitles" checked={upper} onChange={(e) => setUpper(e.target.checked)} />
            عناوين بأحرف كبيرة / تباعد واسع
          </label>
        </div>

        <button type="submit" className="btn-primary">
          {theme ? "حفظ التغييرات" : "إنشاء القالب"}
        </button>
      </form>

      {/* Live preview */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <p className="mb-2 text-sm font-medium text-ink-soft">معاينة حيّة</p>
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-card">
          <div
            className={`flex h-32 items-center justify-center ${font === "serif" ? "font-serif" : ""}`}
            style={{
              background:
                hero === "gradient"
                  ? `linear-gradient(135deg, ${accent}, ${accent}aa)`
                  : hero === "image"
                    ? "#111827"
                    : "#f8fafc",
            }}
          >
            <span
              className={`text-2xl font-extrabold ${upper ? "uppercase tracking-wide" : ""}`}
              style={{ color: hero === "split" || hero === "centered" ? "#1a1a1a" : "#fff" }}
            >
              {name}
            </span>
          </div>
          <div className="grid gap-3 bg-white p-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className={`aspect-square ${rounded === "rounded-none" ? "" : "rounded-lg"}`} style={{ background: `${accent}22` }} />
                <div className={`h-2 w-3/4 rounded ${upper ? "uppercase" : ""}`} style={{ background: "#1a1a1a", opacity: 0.2 }} />
                <div className="h-2 w-1/3 rounded" style={{ background: accent }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
