import Image from "next/image";
import type { Template } from "@/lib/templates";

export function StoreHero({
  template,
  color,
  name,
  description,
  tagline,
  heroImage,
}: {
  template: Template;
  color: string;
  name: string;
  description?: string | null;
  tagline?: string | null;
  heroImage?: string | null;
}) {
  const sub = tagline || description;
  const titleClass = `text-4xl sm:text-5xl font-extrabold ${
    template.uppercaseTitles ? "tracking-wide" : ""
  }`;

  if (template.hero === "gradient") {
    return (
      <section
        className="px-4 py-16 text-center text-white sm:px-6"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
      >
        <div className="mx-auto max-w-2xl">
          <h1 className={titleClass}>{name}</h1>
          {sub && <p className="mt-4 text-lg opacity-90">{sub}</p>}
        </div>
      </section>
    );
  }

  if (template.hero === "centered") {
    return (
      <section className="border-b border-gray-100 bg-white px-4 py-20 text-center sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h1 className={`${titleClass} text-ink`}>{name}</h1>
          {sub && <p className="mt-4 text-lg text-ink-soft">{sub}</p>}
          <div className="mx-auto mt-6 h-1 w-16 rounded" style={{ background: color }} />
        </div>
      </section>
    );
  }

  if (template.hero === "split") {
    return (
      <section className="grid md:grid-cols-2">
        <div
          className="flex flex-col justify-center px-8 py-16 sm:px-12"
          style={{ background: "#faf7f2" }}
        >
          <h1 className={`${titleClass} font-serif text-ink`}>{name}</h1>
          {sub && <p className="mt-4 text-lg text-ink-soft">{sub}</p>}
        </div>
        <div className="relative min-h-[220px]" style={{ background: color }}>
          {heroImage && (
            <Image src={heroImage} alt={name} fill className="object-cover" sizes="50vw" />
          )}
        </div>
      </section>
    );
  }

  // image hero (bold)
  return (
    <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden px-4 text-center">
      <div className="absolute inset-0" style={{ background: "#111827" }}>
        {heroImage && (
          <Image
            src={heroImage}
            alt={name}
            fill
            className="object-cover opacity-40"
            sizes="100vw"
          />
        )}
      </div>
      <div className="relative max-w-2xl text-white">
        <h1 className="text-5xl font-extrabold uppercase tracking-wide sm:text-6xl">
          {name}
        </h1>
        {sub && <p className="mt-4 text-lg text-white/90">{sub}</p>}
      </div>
    </section>
  );
}
