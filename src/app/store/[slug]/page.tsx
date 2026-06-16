import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { StoreShell } from "@/components/store/StoreShell";
import { AddToCartButton } from "@/components/store/AddToCart";
import { StoreHero } from "@/components/store/StoreHero";
import { StoreFilters } from "@/components/store/StoreFilters";
import { getTemplate } from "@/lib/templates";

export const dynamic = "force-dynamic";

const COLS: Record<number, string> = {
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

const CARD: Record<string, string> = {
  shadow: "bg-white shadow-card hover:shadow-pop p-2",
  border: "border border-gray-200 p-2",
  flat: "",
};

export default async function StorePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { q?: string; category?: string };
}) {
  const store = await prisma.store.findUnique({
    where: { slug: params.slug },
    include: {
      products: { where: { status: "active" }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!store) notFound();
  const color = store.themeColor;
  const template = getTemplate(store.template);
  const heroImage = store.products[0]?.imageUrl || null;
  const fontClass = template.font === "serif" ? "font-serif" : "";

  // categories + search/filter
  const categories = Array.from(
    new Set(store.products.map((p) => p.category).filter(Boolean) as string[])
  );
  const q = (searchParams.q || "").trim();
  const activeCat = searchParams.category || "";
  const products = store.products.filter(
    (p) =>
      (!activeCat || p.category === activeCat) &&
      (!q || p.title.includes(q) || (p.description || "").includes(q))
  );

  return (
    <StoreShell
      slug={store.slug}
      name={store.name}
      logoUrl={store.logoUrl}
      color={color}
      currency={store.currency}
    >
      <div className={fontClass}>
        <StoreHero
          template={template}
          color={color}
          name={store.name}
          description={store.description}
          tagline={store.tagline}
          heroImage={heroImage}
        />

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2
            className={`mb-6 text-2xl font-bold text-ink ${
              template.uppercaseTitles ? "uppercase tracking-wide" : ""
            }`}
          >
            {activeCat || "منتجاتنا"}
          </h2>

          <StoreFilters categories={categories} color={color} />

          {products.length === 0 ? (
            <p className="py-16 text-center text-ink-soft">
              {q || activeCat
                ? "لا توجد منتجات مطابقة لبحثك."
                : "لا توجد منتجات متاحة حالياً."}
            </p>
          ) : (
            <div className={`grid gap-5 ${COLS[template.productColumns]}`}>
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`group ${template.rounded} ${CARD[template.cardStyle]} transition`}
                >
                  <Link href={`/store/${store.slug}/product/${p.id}`}>
                    <div className={`relative aspect-square overflow-hidden bg-gray-100 ${template.rounded}`}>
                      {p.imageUrl && (
                        <Image
                          src={p.imageUrl}
                          alt={p.title}
                          fill
                          sizes="(max-width:768px) 50vw, 25vw"
                          className="object-cover transition group-hover:scale-105"
                        />
                      )}
                      {p.compareAt && p.compareAt > p.price && (
                        <span className="absolute right-2 top-2 badge bg-rose-500 text-white">
                          خصم
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="mt-3 px-1">
                    <Link href={`/store/${store.slug}/product/${p.id}`}>
                      <h3
                        className={`text-sm font-medium text-ink hover:underline ${
                          template.uppercaseTitles ? "uppercase tracking-wide" : ""
                        }`}
                      >
                        {p.title}
                      </h3>
                    </Link>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-bold text-ink">
                        {formatCurrency(p.price, store.currency)}
                      </span>
                      {p.compareAt && p.compareAt > p.price && (
                        <span className="text-xs text-ink-soft line-through">
                          {formatCurrency(p.compareAt, store.currency)}
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <AddToCartButton
                        product={{
                          id: p.id,
                          title: p.title,
                          price: p.price,
                          imageUrl: p.imageUrl,
                        }}
                        color={color}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </StoreShell>
  );
}
