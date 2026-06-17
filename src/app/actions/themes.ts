"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, getCurrentUser } from "@/lib/auth";

const themeSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  description: z.string().min(2, "الوصف مطلوب"),
  hero: z.enum(["gradient", "image", "split", "centered"]),
  font: z.enum(["sans", "serif"]),
  productColumns: z.coerce.number().int().min(3).max(4),
  cardStyle: z.enum(["shadow", "border", "flat"]),
  rounded: z.enum(["rounded-none", "rounded-lg", "rounded-2xl", "rounded-3xl"]),
  uppercaseTitles: z.coerce.boolean(),
  accentColor: z.string().default("#2563eb"),
  price: z.coerce.number().min(0).default(0),
});

function slugify(input: string) {
  return (
    input.toLowerCase().trim().replace(/[^a-z0-9؀-ۿ]+/g, "-").replace(/^-+|-+$/g, "") ||
    "theme"
  );
}

async function requireDesigner() {
  const session = await getSession();
  if (!session || session.role !== "designer") throw new Error("غير مصرح");
  return session;
}

export type ThemeState = { error?: string } | undefined;

export async function saveTheme(
  id: string | null,
  _prev: ThemeState,
  formData: FormData
): Promise<ThemeState> {
  const session = await requireDesigner();
  const raw = {
    ...Object.fromEntries(formData),
    uppercaseTitles: formData.get("uppercaseTitles") === "on",
  };
  const parsed = themeSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };
  const d = parsed.data;

  if (id) {
    await prisma.theme.updateMany({
      where: { id, designerId: session.userId },
      data: { ...d },
    });
  } else {
    let slug = slugify(d.name);
    let i = 1;
    while (await prisma.theme.findUnique({ where: { slug } })) {
      slug = `${slugify(d.name)}-${i++}`;
    }
    await prisma.theme.create({
      data: { ...d, slug, designerId: session.userId },
    });
  }

  revalidatePath("/designer/themes");
  redirect("/designer/themes");
}

export async function setThemeStatus(id: string, status: "draft" | "published") {
  const session = await requireDesigner();
  await prisma.theme.updateMany({
    where: { id, designerId: session.userId },
    data: { status },
  });
  revalidatePath("/designer/themes");
}

export async function deleteTheme(id: string) {
  const session = await requireDesigner();
  await prisma.theme.deleteMany({ where: { id, designerId: session.userId } });
  revalidatePath("/designer/themes");
}

/** Merchant applies a marketplace theme to their store (records a purchase). */
export async function applyTheme(themeId: string) {
  const user = await getCurrentUser();
  if (!user?.store) redirect("/login");

  const theme = await prisma.theme.findFirst({
    where: { id: themeId, status: "published" },
  });
  if (!theme) return;

  // Record the purchase once (and count a sale).
  const existing = await prisma.themePurchase.findFirst({
    where: { themeId: theme.id, storeId: user.store.id },
  });
  if (!existing) {
    await prisma.themePurchase.create({
      data: { themeId: theme.id, storeId: user.store.id, price: theme.price },
    });
    await prisma.theme.update({
      where: { id: theme.id },
      data: { sales: { increment: 1 } },
    });
  }

  await prisma.store.update({
    where: { id: user.store.id },
    data: { template: `theme:${theme.id}` },
  });

  revalidatePath(`/store/${user.store.slug}`);
  revalidatePath("/dashboard/themes");
  redirect("/dashboard/themes?applied=1");
}
