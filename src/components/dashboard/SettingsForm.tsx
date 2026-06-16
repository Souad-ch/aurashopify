"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateStore, type StoreState } from "@/app/actions/store";
import { ImageUpload } from "@/components/ImageUpload";
import { TemplatePicker } from "@/components/TemplatePicker";

type Store = {
  name: string;
  description: string | null;
  currency: string;
  themeColor: string;
  template: string;
  tagline: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  logoUrl: string | null;
  slug: string;
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "جارٍ الحفظ..." : "حفظ التغييرات"}
    </button>
  );
}

export function SettingsForm({ store }: { store: Store }) {
  const [state, action] = useFormState<StoreState, FormData>(
    updateStore,
    undefined
  );

  return (
    <form action={action} className="space-y-6">
      {state?.error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          ✓ تم حفظ الإعدادات بنجاح
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
            <textarea
              name="description"
              rows={3}
              defaultValue={store.description || ""}
              className="input"
            />
          </div>
          <div>
            <label className="label">الجملة الترويجية (Tagline)</label>
            <input
              name="tagline"
              defaultValue={store.tagline || ""}
              className="input"
              placeholder="مثال: أفضل المنتجات بأفضل الأسعار"
            />
          </div>
          <ImageUpload
            name="logoUrl"
            label="شعار المتجر"
            defaultValue={store.logoUrl}
          />
          <p className="text-xs text-ink-soft">
            رابط متجرك:{" "}
            <span className="font-mono text-ink">/store/{store.slug}</span>
          </p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-1 font-semibold text-ink">قالب المتجر</h2>
        <p className="mb-4 text-sm text-ink-soft">
          اختر شكل واجهة متجرك. التغيير يُطبّق فوراً على متجرك العام.
        </p>
        <TemplatePicker defaultValue={store.template} />
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-semibold text-ink">معلومات التواصل</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">البريد الإلكتروني</label>
            <input
              name="email"
              type="email"
              defaultValue={store.email || ""}
              className="input"
            />
          </div>
          <div>
            <label className="label">رقم الهاتف</label>
            <input name="phone" defaultValue={store.phone || ""} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">العنوان</label>
            <input
              name="address"
              defaultValue={store.address || ""}
              className="input"
            />
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
            <input
              name="themeColor"
              type="color"
              defaultValue={store.themeColor}
              className="input h-11 cursor-pointer p-1"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton />
      </div>
    </form>
  );
}
