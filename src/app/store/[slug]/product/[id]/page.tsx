import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/format";
import { StoreShell } from "@/components/store/StoreShell";
import { AddToCartButton } from "@/components/store/AddToCart";
import { STORE, PRODUCTS, getProduct } from "@/lib/mock";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: STORE.slug, id: p.id }));
}

export default function ProductPage({ params }: { params: { slug: string; id: string } }) {
  if (params.slug !== STORE.slug) notFound();
  const store = STORE;
  const product = getProduct(params.id);
  if (!product) notFound();

  const related = PRODUCTS.filter((p) => p.status === "active" && p.id !== product.id).slice(0, 4);
  const color = store.themeColor;

  return (
    <StoreShell slug={store.slug} name={store.name} logoUrl={store.logoUrl} color={color} currency={store.currency}>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link href={`/store/${store.slug}`} className="text-sm text-ink-soft hover:text-ink">← العودة إلى المتجر</Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
            <Image src={product.imageUrl} alt={product.title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
          </div>

          <div>
            <span className="badge bg-gray-100 text-ink-soft">{product.category}</span>
            <h1 className="mt-3 text-3xl font-bold text-ink">{product.title}</h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-2xl font-extrabold text-ink">{formatCurrency(product.price, store.currency)}</span>
              {product.compareAt && product.compareAt > product.price && (
                <span className="text-lg text-ink-soft line-through">{formatCurrency(product.compareAt, store.currency)}</span>
              )}
            </div>
            <p className="mt-2 text-sm">
              {product.stock > 0 ? <span className="text-brand-600">✓ متوفر في المخزون</span> : <span className="text-rose-600">نفد من المخزون</span>}
            </p>
            <p className="mt-6 leading-relaxed text-ink-soft">{product.description}</p>
            <div className="mt-8">
              <AddToCartButton product={{ id: product.id, title: product.title, price: product.price, imageUrl: product.imageUrl }} color={color} withQuantity />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-xl font-bold text-ink">منتجات ذات صلة</h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {related.map((p) => (
                <Link key={p.id} href={`/store/${store.slug}/product/${p.id}`} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                    <Image src={p.imageUrl} alt={p.title} fill sizes="25vw" className="object-cover transition group-hover:scale-105" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-ink">{p.title}</h3>
                  <p className="text-sm font-bold text-ink">{formatCurrency(p.price, store.currency)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </StoreShell>
  );
}
