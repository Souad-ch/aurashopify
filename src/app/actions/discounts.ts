"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  code: z.string().min(2, "الكود قصير جداً").transform((s) => s.trim().toUpperCase()),
  type: z.enum(["percent", "fixed"]),
  value: z.coerce.number().positive("القيمة غير صالحة"),
});

export type DiscountState = { error?: string; success?: boolean } | undefined;

export async function createDiscount(
  _prev: DiscountState,
  formData: FormData
): Promise<DiscountState> {
  const user = await getCurrentUser();
  if (!user?.store) return { error: "غير مصرح" };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { code, type, value } = parsed.data;
  if (type === "percent" && value > 100) {
    return { error: "النسبة لا يمكن أن تتجاوز 100%" };
  }

  const exists = await prisma.discount.findFirst({
    where: { storeId: user.store.id, code },
  });
  if (exists) return { error: "هذا الكود موجود بالفعل" };

  await prisma.discount.create({
    data: { code, type, value, storeId: user.store.id },
  });

  revalidatePath("/dashboard/discounts");
  return { success: true };
}

export async function toggleDiscount(id: string) {
  const user = await getCurrentUser();
  if (!user?.store) return;
  const d = await prisma.discount.findFirst({
    where: { id, storeId: user.store.id },
  });
  if (!d) return;
  await prisma.discount.update({
    where: { id },
    data: { active: !d.active },
  });
  revalidatePath("/dashboard/discounts");
}

export async function deleteDiscount(id: string) {
  const user = await getCurrentUser();
  if (!user?.store) return;
  await prisma.discount.deleteMany({ where: { id, storeId: user.store.id } });
  revalidatePath("/dashboard/discounts");
}

/** Public: validate a code for a given store + subtotal. Used at checkout. */
export async function checkDiscount(slug: string, code: string, subtotal: number) {
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return { ok: false as const, error: "المتجر غير موجود" };

  const discount = await prisma.discount.findFirst({
    where: { storeId: store.id, code: code.trim().toUpperCase(), active: true },
  });
  if (!discount) return { ok: false as const, error: "كود غير صالح" };

  const amount =
    discount.type === "percent"
      ? Math.round(((subtotal * discount.value) / 100) * 100) / 100
      : Math.min(discount.value, subtotal);

  return {
    ok: true as const,
    code: discount.code,
    type: discount.type,
    value: discount.value,
    amount,
  };
}
