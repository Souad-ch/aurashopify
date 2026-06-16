"use client";

import { useState } from "react";
import { useCart } from "./CartContext";

type Item = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
};

export function AddToCartButton({
  product,
  color,
  withQuantity = false,
}: {
  product: Item;
  color: string;
  withQuantity?: boolean;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className={withQuantity ? "flex items-center gap-3" : ""}>
      {withQuantity && (
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-2 py-1">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-7 w-7 text-lg text-ink-soft"
          >
            −
          </button>
          <span className="w-6 text-center text-sm">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="h-7 w-7 text-lg text-ink-soft"
          >
            +
          </button>
        </div>
      )}
      <button
        onClick={() => add(product, qty)}
        className="btn-primary flex-1 py-3"
        style={{ backgroundColor: color }}
      >
        أضف إلى السلة
      </button>
    </div>
  );
}
