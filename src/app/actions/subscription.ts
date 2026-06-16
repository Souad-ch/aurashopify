"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function subscribeToPlan(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/pricing");

  const planSlug = String(formData.get("planSlug"));
  const interval = String(formData.get("interval") || "monthly");

  const plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
  if (!plan) throw new Error("الخطة غير موجودة");

  const days = interval === "yearly" ? 365 : 30;
  const renewsAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      planId: plan.id,
      interval,
      status: "active",
      renewsAt,
    },
    update: {
      planId: plan.id,
      interval,
      status: "active",
      renewsAt,
    },
  });

  revalidatePath("/dashboard/billing");
  redirect("/dashboard/billing?subscribed=1");
}

export async function cancelSubscription() {
  const user = await getCurrentUser();
  if (!user || !user.subscription) redirect("/dashboard/billing");

  await prisma.subscription.update({
    where: { userId: user.id },
    data: { status: "cancelled" },
  });

  revalidatePath("/dashboard/billing");
}
