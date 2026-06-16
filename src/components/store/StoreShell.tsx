"use client";

import Link from "next/link";
import { CartProvider } from "./CartContext";
import { CartButton, CartDrawer } from "./CartDrawer";

export function StoreShell({
  slug,
  name,
  logoUrl,
  color,
  currency,
  children,
}: {
  slug: string;
  name: string;
  logoUrl: string | null;
  color: string;
  currency: string;
  children: React.ReactNode;
}) {
  return (
    <CartProvider storeSlug={slug}>
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href={`/store/${slug}`} className="flex items-center gap-2">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={name} className="h-8 w-8 rounded-lg object-cover" />
              ) : (
                <span
                  className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  {name.charAt(0)}
                </span>
              )}
              <span className="text-lg font-bold text-ink">{name}</span>
            </Link>
            <CartButton color={color} />
          </div>
        </header>

        {children}

        <footer className="mt-16 border-t border-gray-100 py-10 text-center text-sm text-ink-soft">
          <p>© {new Date().getFullYear()} {name}</p>
          <p className="mt-1">
            مدعوم بواسطة{" "}
            <Link href="/" className="font-semibold text-brand-600">
              Aura
            </Link>
          </p>
        </footer>

        <CartDrawer slug={slug} color={color} currency={currency} />
      </div>
    </CartProvider>
  );
}
