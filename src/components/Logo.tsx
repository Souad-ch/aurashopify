import Link from "next/link";

/** Aura brandmark: an "A" peak orbited by a node inside a ring — evokes a radiant aura/signal. */
export function AuraMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span className={`relative inline-grid place-items-center ${className}`}>
      <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="auraGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60a5fa" />
            <stop offset="0.55" stopColor="#2563eb" />
            <stop offset="1" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
        {/* rounded tile */}
        <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#auraGrad)" />
        {/* orbit ring */}
        <circle cx="20" cy="20" r="12.5" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
        {/* A-peak */}
        <path
          d="M20 9 L28 30 H23.7 L20 19.5 L16.3 30 H12 Z"
          fill="#ffffff"
        />
        {/* orbiting node */}
        <circle cx="30.5" cy="11.5" r="2.6" fill="#ffffff" />
        <circle cx="30.5" cy="11.5" r="4.4" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.2" />
      </svg>
    </span>
  );
}

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
    <Link href={href} className={`inline-flex items-center gap-2.5 font-bold ${className}`}>
      <AuraMark className="h-9 w-9 drop-shadow-sm" />
      <span className={`text-xl tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Aura
      </span>
    </Link>
  );
}
