import Stripe from "stripe";

/**
 * Server-side Stripe client.
 * Only used in API routes — never import this in client components.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

/** The single Pro plan price ID from Stripe Dashboard. */
export const PRICE_ID = process.env.STRIPE_PRICE_ID ?? "";
