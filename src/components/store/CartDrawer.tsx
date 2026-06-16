"use client";

import Image from "next/image";
import { useCart } from "./CartContext";
import { formatCurrency } from "@/lib/format";
import { checkoutAction } from "@/app/actions/checkout";
import { checkDiscount } from "@/app/actions/discounts";
import { useState } from "react";

export function CartButton({ color }: { color: string }) {
  const { count, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      className="relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
    >
      🛒 السلة
      {count > 0 && (
        <span
          className="absolute -left-1 -top-1 grid h-5 w-5 place-items-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function CartDrawer({
  slug,
  color,
  currency,
}: {
  slug: string;
  color: string;
  currency: string;
}) {
  const { items, open, setOpen, setQty, remove, total, clear } = useCart();
  const [done, setDone] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState<{ code: string; amount: number } | null>(null);
  const [codeMsg, setCodeMsg] = useState("");

  if (!open) return null;

  const grandTotal = Math.max(0, total - (discount?.amount || 0));

  async function applyCode() {
    setCodeMsg("");
    if (!code.trim()) return;
    const res = await checkDiscount(slug, code, total);
    if (res.ok) {
      setDiscount({ code: res.code, amount: res.amount });
      setCodeMsg("");
    } else {
      setDiscount(null);
      setCodeMsg(res.error);
    }
  }

  async function handleCheckout(formData: FormData) {
    setLoading(true);
    const payload = items.map((i) => ({
      id: i.id,
      title: i.title,
      price: i.price,
      quantity: i.quantity,
    }));
    formData.set("items", JSON.stringify(payload));
    formData.set("slug", slug);
    if (discount) formData.set("discountCode", discount.code);
    const res = await checkoutAction(formData);
    setLoading(false);
    if (res?.orderNumber) {
      setDone(res.orderNumber);
      clear();
      setDiscount(null);
      setCode("");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
      />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-pop">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-ink">سلة التسوق</h2>
          <button onClick={() => setOpen(false)} className="text-2xl text-ink-soft">
            ×
          </button>
        </div>

        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="text-5xl">✅</span>
            <h3 className="text-lg font-bold text-ink">تم تأكيد طلبك!</h3>
            <p className="text-sm text-ink-soft">
              رقم الطلب <b>#{done}</b>. شكراً لتسوقك معنا.
            </p>
            <button
              onClick={() => {
                setDone(null);
                setOpen(false);
              }}
              className="btn-primary mt-2"
              style={{ backgroundColor: color }}
            >
              متابعة التسوق
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-ink-soft">
            <span className="text-5xl">🛒</span>
            <p>سلتك فارغة</p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.map((i) => (
                <div key={i.id} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {i.imageUrl && (
                      <Image
                        src={i.imageUrl}
                        alt={i.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{i.title}</p>
                    <p className="text-sm text-ink-soft">
                      {formatCurrency(i.price, currency)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => setQty(i.id, i.quantity - 1)}
                        className="h-6 w-6 rounded border border-gray-300 text-ink-soft"
                      >
                        −
                      </button>
                      <span className="text-sm">{i.quantity}</span>
                      <button
                        onClick={() => setQty(i.id, i.quantity + 1)}
                        className="h-6 w-6 rounded border border-gray-300 text-ink-soft"
                      >
                        +
                      </button>
                      <button
                        onClick={() => remove(i.id)}
                        className="mr-auto text-xs text-rose-600"
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 p-5">
              {/* discount code */}
              <div className="mb-3">
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="كود الخصم"
                    className="input flex-1 uppercase"
                  />
                  <button
                    type="button"
                    onClick={applyCode}
                    className="btn-outline whitespace-nowrap"
                  >
                    تطبيق
                  </button>
                </div>
                {codeMsg && <p className="mt-1 text-xs text-rose-600">{codeMsg}</p>}
                {discount && (
                  <p className="mt-1 text-xs text-brand-600">
                    ✓ تم تطبيق الكود {discount.code}
                  </p>
                )}
              </div>

              <div className="mb-1 flex items-center justify-between text-sm text-ink-soft">
                <span>المجموع الفرعي</span>
                <span>{formatCurrency(total, currency)}</span>
              </div>
              {discount && (
                <div className="mb-1 flex items-center justify-between text-sm text-brand-600">
                  <span>الخصم ({discount.code})</span>
                  <span>−{formatCurrency(discount.amount, currency)}</span>
                </div>
              )}
              <div className="mb-4 flex items-center justify-between border-t border-gray-100 pt-2 text-sm">
                <span className="font-medium text-ink">الإجمالي</span>
                <span className="text-lg font-bold text-ink">
                  {formatCurrency(grandTotal, currency)}
                </span>
              </div>
              <form action={handleCheckout} className="space-y-3">
                <input
                  name="name"
                  required
                  placeholder="الاسم الكامل"
                  className="input"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="البريد الإلكتروني"
                  className="input"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3"
                  style={{ backgroundColor: color }}
                >
                  {loading ? "جارٍ المعالجة..." : "إتمام الشراء"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
