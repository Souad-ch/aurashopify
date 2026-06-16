// Store templates ("themes") a merchant can choose for their storefront.
// Each template changes the storefront's layout, typography and styling.

export type TemplateId = "modern" | "elegant" | "bold" | "minimal";

export type Template = {
  id: TemplateId;
  name: string;
  description: string;
  // preview swatch colors for the gallery
  preview: { bg: string; accent: string; text: string };
  // storefront styling tokens
  hero: "gradient" | "image" | "split" | "centered";
  font: "sans" | "serif";
  productColumns: 3 | 4;
  cardStyle: "shadow" | "border" | "flat";
  rounded: "rounded-none" | "rounded-lg" | "rounded-2xl" | "rounded-3xl";
  uppercaseTitles: boolean;
};

export const TEMPLATES: Template[] = [
  {
    id: "modern",
    name: "عصري",
    description: "تصميم نظيف وعصري بهيدر متدرّج اللون وبطاقات بظلال ناعمة. مناسب لمعظم المتاجر.",
    preview: { bg: "#eff6ff", accent: "#2563eb", text: "#1a1a1a" },
    hero: "gradient",
    font: "sans",
    productColumns: 4,
    cardStyle: "shadow",
    rounded: "rounded-2xl",
    uppercaseTitles: false,
  },
  {
    id: "elegant",
    name: "أنيق",
    description: "طابع فاخر بخطوط Serif ومساحات واسعة وهيدر مقسوم. مثالي للأزياء والمجوهرات.",
    preview: { bg: "#faf7f2", accent: "#9a7b4f", text: "#2b2117" },
    hero: "split",
    font: "serif",
    productColumns: 3,
    cardStyle: "flat",
    rounded: "rounded-none",
    uppercaseTitles: true,
  },
  {
    id: "bold",
    name: "جريء",
    description: "ألوان قوية وهيدر كبير بصورة وعناوين ضخمة. يلفت الانتباه للعروض والإلكترونيات.",
    preview: { bg: "#111827", accent: "#f43f5e", text: "#ffffff" },
    hero: "image",
    font: "sans",
    productColumns: 3,
    cardStyle: "border",
    rounded: "rounded-3xl",
    uppercaseTitles: true,
  },
  {
    id: "minimal",
    name: "بسيط",
    description: "أبيض وبساطة قصوى، هيدر مُتمركز ونصوص هادئة. يركّز كل الانتباه على المنتجات.",
    preview: { bg: "#ffffff", accent: "#111827", text: "#111827" },
    hero: "centered",
    font: "sans",
    productColumns: 4,
    cardStyle: "flat",
    rounded: "rounded-lg",
    uppercaseTitles: false,
  },
];

export function getTemplate(id: string | null | undefined): Template {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}
