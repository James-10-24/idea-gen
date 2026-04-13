import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICE_ID } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout session and returns the URL.
 * If user is signed in, passes their Supabase user_id as metadata
 * so the webhook can link the subscription to their account.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();

  if (!stripe || !PRICE_ID) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    let email = body.email || undefined;

    // Try to get the signed-in user's info
    let supabaseUserId: string | undefined;
    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        supabaseUserId = user.id;
        email = email || user.email;
      }
    } catch {
      // Auth not configured or user not signed in — continue without
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      ...(email ? { customer_email: email } : {}),
      success_url: `${origin}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?cancelled=true`,
      metadata: {
        source: "idea-income-upgrade",
        ...(supabaseUserId ? { supabase_user_id: supabaseUserId } : {}),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
