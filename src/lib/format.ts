export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  paid: { label: "مدفوع", className: "bg-blue-100 text-blue-700" },
  fulfilled: { label: "تم التنفيذ", className: "bg-green-100 text-green-700" },
  pending: { label: "قيد الانتظار", className: "bg-amber-100 text-amber-700" },
  cancelled: { label: "ملغى", className: "bg-gray-100 text-gray-600" },
  refunded: { label: "مسترد", className: "bg-rose-100 text-rose-700" },
  active: { label: "نشط", className: "bg-green-100 text-green-700" },
  draft: { label: "مسودة", className: "bg-gray-100 text-gray-600" },
  archived: { label: "مؤرشف", className: "bg-gray-100 text-gray-600" },
  trialing: { label: "تجريبي", className: "bg-blue-100 text-blue-700" },
  past_due: { label: "متأخر", className: "bg-rose-100 text-rose-700" },
};

export function statusBadge(status: string) {
  return (
    STATUS_LABELS[status] || {
      label: status,
      className: "bg-gray-100 text-gray-600",
    }
  );
}
