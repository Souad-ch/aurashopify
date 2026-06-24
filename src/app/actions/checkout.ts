"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getShipping } from "@/lib/shipping";

const checkoutSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  slug: z.string().min(1),
  items: z.string().min(1),
  discountCode: z.string().optional(),
  shippingMethod: z.string().optional(),
  address: z.string().optional(),
  cardNumber: z.string().optional(),
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

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  // Discount
  let discountAmount = 0;
  let discountCode: string | null = null;
  const codeInput = (parsed.data.discountCode || "").trim().toUpperCase();
  if (codeInput) {
    const discount = await prisma.discount.findFirst({
      where: { storeId: store.id, code: codeInput, active: true },
    });
    if (discount) {
      discountAmount =
        discount.type === "percent"
          ? (subtotal * discount.value) / 100
          : Math.min(discount.value, subtotal);
      discountCode = discount.code;
    }
  }

  // Shipping
  const shippingOpt = getShipping(parsed.data.shippingMethod);
  const shipping = shippingOpt.cost;

  const total = Math.max(0, Math.round((subtotal - discountAmount + shipping) * 100) / 100);

  // Simulated payment: capture last 4 digits of the card (no real charge).
  const digits = (parsed.data.cardNumber || "").replace(/\D/g, "");
  const last4 = digits.length >= 4 ? digits.slice(-4) : null;

  const last = await prisma.order.findFirst({
    where: { storeId: store.id },
    orderBy: { number: "desc" },
    select: { number: true },
  });
  const nextNumber = (last?.number || 1000) + 1;

  const order = await prisma.order.create({
    data: {
      number: nextNumber,
      subtotal: Math.round(subtotal * 100) / 100,
      shipping,
      discountCode,
      discountAmount: Math.round(discountAmount * 100) / 100,
      total,
      status: "paid",
      shippingMethod: shippingOpt.id,
      paymentLast4: last4,
      address: parsed.data.address || null,
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
