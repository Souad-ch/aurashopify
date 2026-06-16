"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const checkoutSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  slug: z.string().min(1),
  items: z.string().min(1),
});

const itemSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
    quantity: z.number().int().min(1),
  })
);

export async function checkoutAction(formData: FormData) {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "بيانات غير صالحة" };

  const items = itemSchema.parse(JSON.parse(parsed.data.items));
  if (items.length === 0) return { error: "السلة فارغة" };

  const store = await prisma.store.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (!store) return { error: "المتجر غير موجود" };

  // Find or create customer
  let customer = await prisma.customer.findFirst({
    where: { storeId: store.id, email: parsed.data.email },
  });
  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        storeId: store.id,
      },
    });
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const last = await prisma.order.findFirst({
    where: { storeId: store.id },
    orderBy: { number: "desc" },
    select: { number: true },
  });
  const nextNumber = (last?.number || 1000) + 1;

  const order = await prisma.order.create({
    data: {
      number: nextNumber,
      total: Math.round(total * 100) / 100,
      status: "paid",
      storeId: store.id,
      customerId: customer.id,
      items: {
        create: items.map((i) => ({
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          productId: i.id,
        })),
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  return { orderNumber: order.number };
}
