// Static demo data — powers the GitHub Pages build (no backend / database).

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAt: number | null;
  sku: string;
  stock: number;
  imageUrl: string;
  status: "active" | "draft" | "archived";
  category: string;
};

export type Order = {
  id: string;
  number: number;
  total: number;
  status: "paid" | "fulfilled" | "pending" | "cancelled" | "refunded";
  createdAt: string;
  customerName: string;
  items: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  createdAt: string;
};

export type Plan = {
  id: string;
  name: string;
  slug: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  highlighted: boolean;
};

export const STORE = {
  name: "Aura Boutique",
  slug: "aura-boutique",
  description: "أزياء وإكسسوارات عصرية مختارة بعناية.",
  currency: "USD",
  themeColor: "#1abf77",
  email: "hello@aura-boutique.com",
  phone: "+963 11 123 4567",
  address: "Damascus, Syria",
  logoUrl: "" as string | null,
};

export const USER = {
  name: "سعاد",
  email: "demo@aura.com",
  plan: "Growth",
};

const IMG = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
  "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&q=80",
];

const RAW: Omit<Product, "id" | "description" | "sku" | "imageUrl" | "status">[] = [
  { title: "جاكيت جلد كلاسيكي", price: 189, compareAt: 240, stock: 24, category: "ملابس خارجية" },
  { title: "حذاء رياضي أبيض", price: 89, compareAt: 110, stock: 60, category: "أحذية" },
  { title: "ساعة يد أنيقة", price: 320, compareAt: null, stock: 12, category: "إكسسوارات" },
  { title: "حقيبة ظهر جلدية", price: 145, compareAt: 180, stock: 33, category: "حقائب" },
  { title: "نظارة شمسية", price: 75, compareAt: null, stock: 80, category: "إكسسوارات" },
  { title: "قميص قطني فاخر", price: 55, compareAt: 70, stock: 120, category: "ملابس" },
  { title: "بنطال جينز", price: 65, compareAt: null, stock: 95, category: "ملابس" },
  { title: "عطر فاخر 100مل", price: 130, compareAt: 160, stock: 40, category: "عناية" },
];

export const PRODUCTS: Product[] = RAW.map((p, i) => ({
  ...p,
  id: `p${i + 1}`,
  description: `${p.title} — منتج عالي الجودة من تشكيلة Aura المختارة.`,
  sku: `AURA-${1000 + i}`,
  imageUrl: IMG[i % IMG.length],
  status: "active",
}));

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export const CUSTOMERS: Customer[] = [
  { id: "c1", name: "ليلى أحمد", email: "layla@example.com", orders: 6, spent: 1240, createdAt: "2026-04-02" },
  { id: "c2", name: "كريم منصور", email: "karim@example.com", orders: 3, spent: 540, createdAt: "2026-04-15" },
  { id: "c3", name: "نور حسن", email: "nour@example.com", orders: 9, spent: 2110, createdAt: "2026-03-21" },
  { id: "c4", name: "عمر خالد", email: "omar@example.com", orders: 2, spent: 320, createdAt: "2026-05-01" },
  { id: "c5", name: "رنا سمير", email: "rana@example.com", orders: 5, spent: 980, createdAt: "2026-05-11" },
];

const STATUSES: Order["status"][] = ["paid", "fulfilled", "pending", "paid", "fulfilled", "cancelled"];

export const ORDERS: Order[] = Array.from({ length: 24 }).map((_, i) => {
  const c = CUSTOMERS[i % CUSTOMERS.length];
  const total = 45 + ((i * 53) % 380);
  const day = new Date(2026, 5, 16 - (i % 28));
  return {
    id: `o${i + 1}`,
    number: 1001 + i,
    total,
    status: STATUSES[i % STATUSES.length],
    createdAt: day.toISOString(),
    customerName: c.name,
    items: 1 + (i % 3),
  };
});

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    slug: "starter",
    priceMonthly: 19,
    priceYearly: 190,
    description: "كل ما تحتاجه لبدء متجرك الأول.",
    highlighted: false,
    features: ["حتى 100 منتج", "متجر إلكتروني كامل", "تقارير مبيعات أساسية", "دعم عبر البريد الإلكتروني", "رسوم تحويل 2%"],
  },
  {
    id: "growth",
    name: "Growth",
    slug: "growth",
    priceMonthly: 49,
    priceYearly: 490,
    description: "للمتاجر النامية التي تريد المزيد.",
    highlighted: true,
    features: ["منتجات غير محدودة", "تقارير وتحليلات احترافية", "حتى 5 حسابات موظفين", "دعم على مدار الساعة", "رسوم تحويل 1%", "استرداد المتروكات في السلة"],
  },
  {
    id: "advanced",
    name: "Advanced",
    slug: "advanced",
    priceMonthly: 99,
    priceYearly: 990,
    description: "قوة كاملة للأعمال الكبيرة.",
    highlighted: false,
    features: ["كل مزايا Growth", "حتى 15 حساب موظف", "تقارير مخصصة متقدمة", "أسعار شحن محسوبة من الناقل", "رسوم تحويل 0.5%", "مدير حساب مخصص"],
  },
];

// Platform-level demo data for the admin panel
export const ADMIN_STORES = [
  { id: "s1", name: "Aura Boutique", slug: "aura-boutique", owner: "demo@aura.com", plan: "Growth", products: 8, revenue: 4820, createdAt: "2026-03-01" },
  { id: "s2", name: "Tech Haven", slug: "tech-haven", owner: "sami@example.com", plan: "Advanced", products: 42, revenue: 18230, createdAt: "2026-02-12" },
  { id: "s3", name: "Green Garden", slug: "green-garden", owner: "maya@example.com", plan: "Starter", products: 15, revenue: 2140, createdAt: "2026-04-20" },
  { id: "s4", name: "Urban Style", slug: "urban-style", owner: "rami@example.com", plan: "Growth", products: 27, revenue: 9560, createdAt: "2026-01-30" },
  { id: "s5", name: "Cozy Home", slug: "cozy-home", owner: "lina@example.com", plan: null, products: 5, revenue: 410, createdAt: "2026-05-22" },
];

export const ADMIN_USERS = [
  { id: "u0", name: "مدير المنصة", email: "admin@aura.com", role: "admin", store: "—", plan: "—", createdAt: "2026-01-01" },
  { id: "u1", name: "سعاد", email: "demo@aura.com", role: "merchant", store: "Aura Boutique", plan: "Growth", createdAt: "2026-03-01" },
  { id: "u2", name: "سامي", email: "sami@example.com", role: "merchant", store: "Tech Haven", plan: "Advanced", createdAt: "2026-02-12" },
  { id: "u3", name: "مايا", email: "maya@example.com", role: "merchant", store: "Green Garden", plan: "Starter", createdAt: "2026-04-20" },
  { id: "u4", name: "رامي", email: "rami@example.com", role: "merchant", store: "Urban Style", plan: "Growth", createdAt: "2026-01-30" },
];
