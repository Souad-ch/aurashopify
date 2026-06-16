"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction, registerAction } from "@/app/actions/auth";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full py-3">
      {pending ? "جارٍ المعالجة..." : label}
    </button>
  );
}

function ErrorBox({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {error}
    </div>
  );
}

export function LoginForm() {
  const [state, action] = useFormState(loginAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <ErrorBox error={state?.error} />
      <div>
        <label className="label" htmlFor="email">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue="demo@aura.com"
          className="input"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          كلمة المرور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          defaultValue="password123"
          className="input"
          placeholder="••••••••"
        />
      </div>
      <SubmitButton label="تسجيل الدخول" />
      <p className="text-center text-sm text-ink-soft">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="font-semibold text-brand-600">
          أنشئ حساباً
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [state, action] = useFormState(registerAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <ErrorBox error={state?.error} />
      <div>
        <label className="label" htmlFor="name">
          الاسم الكامل
        </label>
        <input id="name" name="name" required className="input" placeholder="اسمك" />
      </div>
      <div>
        <label className="label" htmlFor="storeName">
          اسم المتجر
        </label>
        <input
          id="storeName"
          name="storeName"
          required
          className="input"
          placeholder="متجري الرائع"
        />
      </div>
      <div>
        <label className="label" htmlFor="email">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          كلمة المرور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="input"
          placeholder="6 أحرف على الأقل"
        />
      </div>
      <SubmitButton label="إنشاء الحساب" />
      <p className="text-center text-sm text-ink-soft">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="font-semibold text-brand-600">
          سجّل الدخول
        </Link>
      </p>
    </form>
  );
}
