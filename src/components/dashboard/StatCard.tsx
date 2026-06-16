export function StatCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: string;
}) {
  const positive = delta?.startsWith("+");
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-soft">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-lg">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
      {delta && (
        <p
          className={`mt-1 text-xs font-medium ${
            positive ? "text-brand-600" : "text-rose-600"
          }`}
        >
          {delta} عن الفترة السابقة
        </p>
      )}
    </div>
  );
}
