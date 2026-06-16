import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { PRODUCTS, getProduct } from "@/lib/mock";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/products" className="text-sm text-ink-soft hover:text-ink">← العودة إلى المنتجات</Link>
        <h1 className="mt-2 text-2xl font-bold text-ink">تعديل المنتج</h1>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
