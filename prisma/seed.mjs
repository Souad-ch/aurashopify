import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
  "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&q=80",
];

async function main() {
  // Idempotent: if the database already has users, don't reseed
  // (safe to run on every deploy without wiping real data).
  const existingUsers = await prisma.user.count().catch(() => 0);
  if (existingUsers > 0) {
    console.log("ℹ️  Database already seeded — skipping.");
    return;
  }

  console.log("🌱 Seeding Aura database...");

  // Clean
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.store.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.user.deleteMany();

  // Plans
  const plans = await Promise.all([
    prisma.plan.create({
      data: {
        name: "Starter",
        slug: "starter",
        priceMonthly: 19,
        priceYearly: 190,
        description: "كل ما تحتاجه لبدء متجرك الأول.",
        order: 1,
        features: JSON.stringify([
          "حتى 100 منتج",
          "متجر إلكتروني كامل",
          "تقارير مبيعات أساسية",
          "دعم عبر البريد الإلكتروني",
          "رسوم تحويل 2%",
        ]),
      },
    }),
    prisma.plan.create({
      data: {
        name: "Growth",
        slug: "growth",
        priceMonthly: 49,
        priceYearly: 490,
        description: "للمتاجر النامية التي تريد المزيد.",
        order: 2,
        highlighted: true,
        features: JSON.stringify([
          "منتجات غير محدودة",
          "تقارير وتحليلات احترافية",
          "حتى 5 حسابات موظفين",
          "دعم على مدار الساعة",
          "رسوم تحويل 1%",
          "استرداد المتروكات في السلة",
        ]),
      },
    }),
    prisma.plan.create({
      data: {
        name: "Advanced",
        slug: "advanced",
        priceMonthly: 99,
        priceYearly: 990,
        description: "قوة كاملة للأعمال الكبيرة.",
        order: 3,
        features: JSON.stringify([
          "كل مزايا Growth",
          "حتى 15 حساب موظف",
          "تقارير مخصصة متقدمة",
          "أسعار شحن محسوبة من الناقل",
          "رسوم تحويل 0.5%",
          "مدير حساب مخصص",
        ]),
      },
    }),
  ]);

  const growth = plans.find((p) => p.slug === "growth");

  // Platform super-admin
  const adminHash = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@aura.com",
      name: "مدير المنصة",
      passwordHash: adminHash,
      role: "admin",
    },
  });

  // Demo merchant user
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      email: "demo@aura.com",
      name: "سعاد",
      passwordHash,
      role: "merchant",
    },
  });

  // Store
  const store = await prisma.store.create({
    data: {
      name: "Aura Boutique",
      slug: "aura-boutique",
      description: "أزياء وإكسسوارات عصرية مختارة بعناية.",
      currency: "USD",
      themeColor: "#2563eb",
      template: "modern",
      tagline: "أناقة لا تنتهي — تشكيلة Aura المختارة",
      onboarded: true,
      email: "hello@aura-boutique.com",
      phone: "+963 11 123 4567",
      address: "Damascus, Syria",
      ownerId: user.id,
    },
  });

  // Subscription
  await prisma.subscription.create({
    data: {
      userId: user.id,
      planId: growth.id,
      status: "active",
      interval: "monthly",
      renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Products
  const productData = [
    { title: "جاكيت جلد كلاسيكي", price: 189, compareAt: 240, stock: 24, category: "ملابس خارجية" },
    { title: "حذاء رياضي أبيض", price: 89, compareAt: 110, stock: 60, category: "أحذية" },
    { title: "ساعة يد أنيقة", price: 320, stock: 12, category: "إكسسوارات" },
    { title: "حقيبة ظهر جلدية", price: 145, compareAt: 180, stock: 33, category: "حقائب" },
    { title: "نظارة شمسية", price: 75, stock: 80, category: "إكسسوارات" },
    { title: "قميص قطني فاخر", price: 55, compareAt: 70, stock: 120, category: "ملابس" },
    { title: "بنطال جينز", price: 65, stock: 95, category: "ملابس" },
    { title: "عطر فاخر 100مل", price: 130, compareAt: 160, stock: 40, category: "عناية" },
  ];

  const products = [];
  for (let i = 0; i < productData.length; i++) {
    const p = productData[i];
    const product = await prisma.product.create({
      data: {
        ...p,
        description: `${p.title} — منتج عالي الجودة من تشكيلة Aura المختارة.`,
        sku: `AURA-${1000 + i}`,
        imageUrl: PRODUCT_IMAGES[i % PRODUCT_IMAGES.length],
        status: "active",
        storeId: store.id,
      },
    });
    products.push(product);
  }

  // Customers
  const customerNames = [
    ["ليلى أحمد", "layla@example.com"],
    ["كريم منصور", "karim@example.com"],
    ["نور حسن", "nour@example.com"],
    ["عمر خالد", "omar@example.com"],
    ["رنا سمير", "rana@example.com"],
  ];
  const customers = [];
  for (const [name, email] of customerNames) {
    const c = await prisma.customer.create({
      data: { name, email, storeId: store.id },
    });
    customers.push(c);
  }

  // Orders across the last 30 days
  const statuses = ["paid", "fulfilled", "pending", "paid", "fulfilled", "cancelled"];
  let orderNumber = 1001;
  for (let i = 0; i < 40; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const itemCount = 1 + Math.floor(Math.random() * 3);
    const items = [];
    let total = 0;
    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = 1 + Math.floor(Math.random() * 2);
      total += product.price * quantity;
      items.push({
        title: product.title,
        price: product.price,
        quantity,
        productId: product.id,
      });
    }
    await prisma.order.create({
      data: {
        number: orderNumber++,
        total: Math.round(total * 100) / 100,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt,
        storeId: store.id,
        customerId: customer.id,
        items: { create: items },
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log("   Merchant: demo@aura.com / password123");
  console.log("   Admin:    admin@aura.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
