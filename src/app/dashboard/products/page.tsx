import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, statusBadge } from "@/lib/format";
import { DeleteProductButton } from "@/components/dashboard/DeleteProductButton";
import { ProductFilters } from "@/components/dashboard/ProductFilters";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; category?: string };
}) {
  const user = await getCurrentUser();
  if (!user?.store) redirect("/login");

  const { q, status, category } = searchParams;

  const products = await prisma.product.findMany({
    where: {
      storeId: user.store.id,
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
      ...(q ? { title: { contains: q } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  // distinct categories for the filter dropdown
  const allProducts = await prisma.product.findMany({
    where: { storeId: user.store.id },
    select: { category: true },
  });
  const categories = Array.from(
    new Set(allProducts.map((p) => p.category).filter(Boolean) as string[])
  );

  const currency = user.store.currency;
  const isFiltering = !!(q || status || category);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">المنتجات</h1>
          <p className="text-sm text-ink-soft">
            {products.length} منتج في متجرك
          </p>
        </div>
        <Link href="/dashboard/products/new" className="btn-primary">
          + إضافة منتج
        </Link>
      </div>

      <ProductFilters categories={categories} />

      {products.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl">{isFiltering ? "🔍" : "📦"}</span>
          <h3 className="mt-4 text-lg font-semibold text-ink">
            {isFiltering ? "لا توجد نتائج مطابقة" : "لا توجد منتجات بعد"}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            {isFiltering
              ? "جرّب تعديل كلمات البحث أو الفلاتر."
              : "ابدأ بإضافة أول منتج إلى متجرك."}
          </p>
          {!isFiltering && (
            <Link href="/dashboard/products/new" className="btn-primary mt-6">
              + إضافة منتج
            </Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-ink-soft">
                  <th className="px-5 py-3 font-medium">المنتج</th>
                  <th className="px-5 py-3 font-medium">الحالة</th>
                  <th className="px-5 py-3 font-medium">المخزون</th>
                  <th className="px-5 py-3 font-medium">السعر</th>
                  <th className="px-5 py-3 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const badge = statusBadge(p.status);
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-gray-100">
                            {p.imageUrl && (
                              <Image
                                src={p.imageUrl}
                                alt={p.title}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-ink">{p.title}</p>
                            <p className="text-xs text-ink-soft">
                              {p.category || "بدون تصنيف"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`badge ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-ink-soft">{p.stock}</td>
                      <td className="px-5 py-3 font-medium text-ink">
                        {formatCurrency(p.price, currency)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/dashboard/products/${p.id}`}
                            className="text-xs font-medium text-brand-600 hover:underline"
                          >
                            تعديل
                          </Link>
                          <DeleteProductButton id={p.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
