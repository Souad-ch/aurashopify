import "server-only";
import Stripe from "stripe";

/**
 * Stripe is optional: if STRIPE_SECRET_KEY is not set, the app falls back to
 * instant (demo) subscription activation. Add the key in Vercel to enable
 * real Stripe Checkout for subscriptions.
 */
export const stripeEnabled = !!process.env.STRIPE_SECRET_KEY;

export const stripe = stripeEnabled
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string)
  : null;
