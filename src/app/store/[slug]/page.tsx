import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/format";
import { StoreShell } from "@/components/store/StoreShell";
import { AddToCartButton } from "@/components/store/AddToCart";
import { STORE, PRODUCTS } from "@/lib/mock";

export function generateStaticParams() {
  return [{ slug: STORE.slug }];
}

export default function StorePage({ params }: { params: { slug: string } }) {
  if (params.slug !== STORE.slug) notFound();
  const store = STORE;
  const color = store.themeColor;
  const products = PRODUCTS.filter((p) => p.status === "active");

  return (
    <StoreShell slug={store.slug} name={store.name} logoUrl={store.logoUrl} color={color} currency={store.currency}>
      <section className="px-4 py-16 text-center text-white sm:px-6" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">{store.name}</h1>
          {store.description && <p className="mt-4 text-lg opacity-90">{store.description}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-ink">منتجاتنا</h2>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="group">
              <Link href={`/store/${store.slug}/product/${p.id}`}>
                <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                  <Image src={p.imageUrl} alt={p.title} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition group-hover:scale-105" />
                  {p.compareAt && p.compareAt > p.price && (
                    <span className="absolute right-2 top-2 badge bg-rose-500 text-white">خصم</span>
                  )}
                </div>
              </Link>
              <div className="mt-3">
                <Link href={`/store/${store.slug}/product/${p.id}`}>
                  <h3 className="text-sm font-medium text-ink hover:underline">{p.title}</h3>
                </Link>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-bold text-ink">{formatCurrency(p.price, store.currency)}</span>
                  {p.compareAt && p.compareAt > p.price && (
                    <span className="text-xs text-ink-soft line-through">{formatCurrency(p.compareAt, store.currency)}</span>
                  )}
                </div>
                <div className="mt-3">
                  <AddToCartButton product={{ id: p.id, title: p.title, price: p.price, imageUrl: p.imageUrl }} color={color} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </StoreShell>
  );
}
