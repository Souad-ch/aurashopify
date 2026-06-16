import Link from "next/link";

export function Logo({
  className = "",
  href = "/",
  light = false,
}: {
  className?: string;
  href?: string;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 font-bold ${className}`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C7 2 3 6 3 11c0 4 3 7 7 8 0-3 1-5 3-6-2 3-1 6 1 7 4-1 7-4 7-9 0-5-4-9-9-9z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className={`text-xl ${light ? "text-white" : "text-ink"}`}>
        Aura
      </span>
    </Link>
  );
}
