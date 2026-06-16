"use client";

import { useState, useTransition } from "react";
import { deleteStoreAsAdmin, toggleUserRole } from "@/app/actions/admin";

export function DeleteStoreButton({ storeId }: { storeId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1 text-xs">
        <button
          onClick={() => startTransition(() => deleteStoreAsAdmin(storeId))}
          disabled={isPending}
          className="font-medium text-rose-600 hover:underline"
        >
          {isPending ? "..." : "تأكيد الحذف"}
        </button>
        <span className="text-gray-300">/</span>
        <button
          onClick={() => setConfirming(false)}
          className="text-ink-soft hover:underline"
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
      حذف المتجر
    </button>
  );
}

export function ToggleRoleButton({
  userId,
  role,
  disabled,
}: {
  userId: string;
  role: string;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  if (disabled) {
    return <span className="text-xs text-ink-soft">— أنت —</span>;
  }
  return (
    <button
      onClick={() => startTransition(() => toggleUserRole(userId))}
      disabled={isPending}
      className="text-xs font-medium text-brand-600 hover:underline"
    >
      {isPending
        ? "..."
        : role === "admin"
          ? "إلغاء صلاحية الأدمن"
          : "ترقية إلى أدمن"}
    </button>
  );
}
