"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createProduct, updateProduct, type ProductState } from "@/app/actions/products";
import { ImageUpload } from "@/components/ImageUpload";

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compareAt: number | null;
  sku: string | null;
  stock: number;
  imageUrl: string | null;
  category: string | null;
  status: string;
};

function SaveButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "جارٍ الحفظ..." : editing ? "حفظ التغييرات" : "إنشاء المنتج"}
    </button>
  );
}

export function ProductForm({ product }: { product?: Product }) {
  const editing = !!product;
  const router = useRouter();
  const action = editing
    ? updateProduct.bind(null, product!.id)
    : createProduct;
  const [state, formAction] = useFormState<ProductState, FormData>(
    action,
    undefined
  );

  useEffect(() => {
    if (state?.success) router.push("/dashboard/products");
  }, [state, router]);

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-3">
      {state?.error && (
        <div className="lg:col-span-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </div>
      )}

      <div className="space-y-6 lg:col-span-2">
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-ink">معلومات المنتج</h2>
          <div className="space-y-4">
            <div>
              <label className="label">عنوان المنتج</label>
              <input
                name="title"
                required
                defaultValue={product?.title}
                className="input"
                placeholder="مثال: قميص قطني"
              />
            </div>
            <div>
              <label className="label">الوصف</label>
              <textarea
                name="description"
                rows={4}
                defaultValue={product?.description || ""}
                className="input"
                placeholder="وصف المنتج..."
              />
            </div>
            <ImageUpload
              name="imageUrl"
              label="صورة المنتج"
              defaultValue={product?.imageUrl}
            />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-ink">التسعير والمخزون</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">السعر</label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={product?.price}
                className="input"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="label">السعر قبل الخصم (اختياري)</label>
              <input
                name="compareAt"
                type="number"
                step="0.01"
                defaultValue={product?.compareAt || ""}
                className="input"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="label">الكمية في المخزون</label>
              <input
                name="stock"
                type="number"
                defaultValue={product?.stock ?? 0}
                className="input"
              />
            </div>
            <div>
              <label className="label">SKU</label>
              <input
                name="sku"
                defaultValue={product?.sku || ""}
                className="input"
                placeholder="AURA-1001"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-ink">التنظيم</h2>
          <div className="space-y-4">
            <div>
              <label className="label">الحالة</label>
              <select
                name="status"
                defaultValue={product?.status || "active"}
                className="input"
              >
                <option value="active">نشط</option>
                <option value="draft">مسودة</option>
                <option value="archived">مؤرشف</option>
              </select>
            </div>
            <div>
              <label className="label">التصنيف</label>
              <input
                name="category"
                defaultValue={product?.category || ""}
                className="input"
                placeholder="مثال: ملابس"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <SaveButton editing={editing} />
          <button
            type="button"
            onClick={() => router.push("/dashboard/products")}
            className="btn-outline"
          >
            إلغاء
          </button>
        </div>
      </div>
    </form>
  );
}
