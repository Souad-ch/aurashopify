import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/dashboard/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user?.store) redirect("/login");

  const product = await prisma.product.findFirst({
    where: { id: params.id, storeId: user.store.id },
  });
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/products"
          className="text-sm text-ink-soft hover:text-ink"
        >
          ← العودة إلى المنتجات
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-ink">تعديل المنتج</h1>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
