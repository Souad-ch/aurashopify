"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { TEMPLATES } from "@/lib/templates";

const TEMPLATE_IDS = TEMPLATES.map((t) => t.id) as [string, ...string[]];

const storeSchema = z.object({
  name: z.string().min(2, "اسم المتجر مطلوب"),
  description: z.string().optional(),
  currency: z.string().default("USD"),
  themeColor: z.string().default("#2563eb"),
  template: z.enum(TEMPLATE_IDS).optional(),
  tagline: z.string().optional(),
  email: z.string().email("بريد غير صالح").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  logoUrl: z.string().optional(),
});

/** Onboarding: pick a template (and optional tagline), then go to the dashboard. */
export async function completeOnboarding(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.store) redirect("/login");

  const template = String(formData.get("template") || "modern");
  const tagline = String(formData.get("tagline") || "").trim();
  const valid = TEMPLATES.some((t) => t.id === template) ? template : "modern";

  await prisma.store.update({
    where: { id: user.store.id },
    data: {
      template: valid,
      tagline: tagline || null,
      onboarded: true,
    },
  });

  revalidatePath(`/store/${user.store.slug}`);
  redirect("/dashboard");
}

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
      ...(d.template ? { template: d.template } : {}),
      tagline: d.tagline || null,
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
