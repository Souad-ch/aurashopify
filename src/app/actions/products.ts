"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const productSchema = z.object({
  title: z.string().min(1, "عنوان المنتج مطلوب"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "السعر غير صالح"),
  compareAt: z.coerce.number().optional(),
  sku: z.string().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["active", "draft", "archived"]).default("active"),
});

async function requireStore() {
  const user = await getCurrentUser();
  if (!user || !user.store) throw new Error("غير مصرح");
  return user.store;
}

export type ProductState = { error?: string; success?: boolean } | undefined;

export async function createProduct(
  _prev: ProductState,
  formData: FormData
): Promise<ProductState> {
  const store = await requireStore();
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const data = parsed.data;
  await prisma.product.create({
    data: {
      title: data.title,
      description: data.description || null,
      price: data.price,
      compareAt: data.compareAt || null,
      sku: data.sku || null,
      stock: data.stock,
      imageUrl: data.imageUrl || null,
      category: data.category || null,
      status: data.status,
      storeId: store.id,
    },
  });

  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function updateProduct(
  id: string,
  _prev: ProductState,
  formData: FormData
): Promise<ProductState> {
  const store = await requireStore();
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const data = parsed.data;
  await prisma.product.updateMany({
    where: { id, storeId: store.id },
    data: {
      title: data.title,
      description: data.description || null,
      price: data.price,
      compareAt: data.compareAt || null,
      sku: data.sku || null,
      stock: data.stock,
      imageUrl: data.imageUrl || null,
      category: data.category || null,
      status: data.status,
    },
  });

  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const store = await requireStore();
  await prisma.product.deleteMany({ where: { id, storeId: store.id } });
  revalidatePath("/dashboard/products");
}
