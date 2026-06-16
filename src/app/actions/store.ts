"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const storeSchema = z.object({
  name: z.string().min(2, "اسم المتجر مطلوب"),
  description: z.string().optional(),
  currency: z.string().default("USD"),
  themeColor: z.string().default("#1abf77"),
  email: z.string().email("بريد غير صالح").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  logoUrl: z.string().optional(),
});

export type StoreState = { error?: string; success?: boolean } | undefined;

export async function updateStore(
  _prev: StoreState,
  formData: FormData
): Promise<StoreState> {
  const user = await getCurrentUser();
  if (!user || !user.store) return { error: "غير مصرح" };

  const parsed = storeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const d = parsed.data;
  await prisma.store.update({
    where: { id: user.store.id },
    data: {
      name: d.name,
      description: d.description || null,
      currency: d.currency,
      themeColor: d.themeColor,
      email: d.email || null,
      phone: d.phone || null,
      address: d.address || null,
      logoUrl: d.logoUrl || null,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath(`/store/${user.store.slug}`);
  return { success: true };
}
