import Link from "next/link";
import { ProductForm } from "@/components/dashboard/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/products" className="text-sm text-ink-soft hover:text-ink">← العودة إلى المنتجات</Link>
        <h1 className="mt-2 text-2xl font-bold text-ink">إضافة منتج جديد</h1>
      </div>
      <ProductForm />
    </div>
  );
}
