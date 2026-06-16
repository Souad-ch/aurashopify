"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import type { STORE as StoreType } from "@/lib/mock";

type Store = typeof StoreType;

export function SettingsForm({ store }: { store: Store }) {
  const [saved, setSaved] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {saved && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          ✓ تم حفظ الإعدادات (نسخة تجريبية — لا تُحفظ بشكل دائم)
        </div>
      )}

      <div className="card p-6">
        <h2 className="mb-4 font-semibold text-ink">معلومات المتجر</h2>
        <div className="space-y-4">
          <div>
            <label className="label">اسم المتجر</label>
            <input name="name" required defaultValue={store.name} className="input" />
          </div>
          <div>
            <label className="label">وصف المتجر</label>
            <textarea name="description" rows={3} defaultValue={store.description || ""} className="input" />
          </div>
          <ImageUpload name="logoUrl" label="شعار المتجر" defaultValue={store.logoUrl} />
          <p className="text-xs text-ink-soft">رابط متجرك: <span className="font-mono text-ink">/store/{store.slug}</span></p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-semibold text-ink">معلومات التواصل</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">البريد الإلكتروني</label>
            <input name="email" type="email" defaultValue={store.email || ""} className="input" />
          </div>
          <div>
            <label className="label">رقم الهاتف</label>
            <input name="phone" defaultValue={store.phone || ""} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">العنوان</label>
            <input name="address" defaultValue={store.address || ""} className="input" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-semibold text-ink">المظهر والعملة</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">العملة</label>
            <select name="currency" defaultValue={store.currency} className="input">
              <option value="USD">USD — دولار أمريكي</option>
              <option value="EUR">EUR — يورو</option>
              <option value="SAR">SAR — ريال سعودي</option>
              <option value="AED">AED — درهم إماراتي</option>
              <option value="EGP">EGP — جنيه مصري</option>
            </select>
          </div>
          <div>
            <label className="label">لون المتجر الأساسي</label>
            <input name="themeColor" type="color" defaultValue={store.themeColor} className="input h-11 cursor-pointer p-1" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">حفظ التغييرات</button>
      </div>
    </form>
  );
}
