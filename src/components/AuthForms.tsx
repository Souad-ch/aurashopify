"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { demoLogin } from "@/lib/demoAuth";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    demoLogin(email.trim().toLowerCase() === "admin@aura.com" ? "admin" : "merchant");
    router.push(email.trim().toLowerCase() === "admin@aura.com" ? "/admin" : "/dashboard");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">البريد الإلكتروني</label>
        <input id="email" name="email" type="email" required defaultValue="demo@aura.com" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">كلمة المرور</label>
        <input id="password" name="password" type="password" required defaultValue="password123" className="input" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="font-semibold text-brand-600">أنشئ حساباً</Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    demoLogin("merchant");
    router.push("/dashboard");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label" htmlFor="name">الاسم الكامل</label>
        <input id="name" name="name" required className="input" placeholder="اسمك" />
      </div>
      <div>
        <label className="label" htmlFor="storeName">اسم المتجر</label>
        <input id="storeName" name="storeName" required className="input" placeholder="متجري الرائع" />
      </div>
      <div>
        <label className="label" htmlFor="email">البريد الإلكتروني</label>
        <input id="email" name="email" type="email" required className="input" placeholder="you@example.com" />
      </div>
      <div>
        <label className="label" htmlFor="password">كلمة المرور</label>
        <input id="password" name="password" type="password" required className="input" placeholder="6 أحرف على الأقل" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="font-semibold text-brand-600">سجّل الدخول</Link>
      </p>
    </form>
  );
}
