"use client";

import { useState, useTransition } from "react";
import { deleteProduct } from "@/app/actions/products";

export function DeleteProductButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <button
          onClick={() => startTransition(() => deleteProduct(id))}
          disabled={isPending}
          className="text-xs font-medium text-rose-600 hover:underline"
        >
          {isPending ? "..." : "تأكيد"}
        </button>
        <span className="text-gray-300">/</span>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-ink-soft hover:underline"
        >
          إلغاء
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs font-medium text-rose-600 hover:underline"
    >
      حذف
    </button>
  );
}
