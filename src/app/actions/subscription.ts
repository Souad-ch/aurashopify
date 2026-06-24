"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { stripe, stripeEnabled } from "@/lib/stripe";

function activate(userId: string, planId: string, interval: string) {
  const days = interval === "yearly" ? 365 : 30;
  const renewsAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return prisma.subscription.upsert({
    where: { userId },
    create: { userId, planId, interval, status: "active", renewsAt },
    update: { planId, interval, status: "active", renewsAt },
  });
}

export async function subscribeToPlan(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/pricing");

  const planSlug = String(formData.get("planSlug"));
  const interval = String(formData.get("interval") || "monthly");

  const plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
  if (!plan) throw new Error("الخطة غير موجودة");

  // Real payment via Stripe Checkout when configured.
  if (stripeEnabled && stripe) {
    const h = headers();
    const proto = h.get("x-forwarded-proto") || "https";
    const origin = `${proto}://${h.get("host")}`;
    const amount = interval === "yearly" ? plan.priceYearly : plan.priceMonthly;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Aura — ${plan.name}` },
            recurring: { interval: interval === "yearly" ? "year" : "month" },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: { userId: user.id, planId: plan.id, interval },
      subscription_data: {
        metadata: { userId: user.id, planId: plan.id, interval },
      },
      success_url: `${origin}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    redirect(session.url as string);
  }

  // Fallback (no Stripe keys yet): instant demo activation.
  await activate(user.id, plan.id, interval);
  revalidatePath("/dashboard/billing");
  redirect("/dashboard/billing?subscribed=1");
}

/** Called from the billing page after returning from Stripe Checkout. */
export async function finalizeStripeSubscription(sessionId: string) {
  const user = await getCurrentUser();
  if (!user || !stripeEnabled || !stripe) return;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid" && session.status !== "complete") return;

  const planId = session.metadata?.planId;
  const interval = session.metadata?.interval || "monthly";
  if (!planId) return;

  // Only activate for the logged-in owner of the session.
  if (session.metadata?.userId && session.metadata.userId !== user.id) return;

  await activate(user.id, planId, interval);
  revalidatePath("/dashboard/billing");
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
