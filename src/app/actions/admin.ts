"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) throw new Error("غير مصرح");
  return admin;
}

export async function deleteStoreAsAdmin(storeId: string) {
  await requireAdmin();
  // Deleting the owner cascades to the store and its data.
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { ownerId: true },
  });
  if (store) {
    await prisma.user.delete({ where: { id: store.ownerId } });
  }
  revalidatePath("/admin/stores");
  revalidatePath("/admin");
}

export async function toggleUserRole(userId: string) {
  const admin = await requireAdmin();
  if (admin.userId === userId) return; // can't demote yourself
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  await prisma.user.update({
    where: { id: userId },
    data: { role: user.role === "admin" ? "merchant" : "admin" },
  });
  revalidatePath("/admin/users");
}
