import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

function getStripeInstance() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}

// -----------------------------------------------------------------------
// Disable body parsing — Stripe needs the raw body for signature verification
// -----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // 1. Verify signature
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  const stripe = getStripeInstance();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // 2. Handle events
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      default:
        // Unhandled event type — ignore silently
        break;
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

// -----------------------------------------------------------------------
// Event handlers
// -----------------------------------------------------------------------

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();

  // Extract info from the checkout session
  const email =
    session.customer_email || session.customer_details?.email || null;
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ?? null;

  // Also check metadata for user_id (passed from our checkout route)
  const userId = session.metadata?.supabase_user_id ?? null;

  if (!email && !userId) {
    console.error("checkout.session.completed: no email or user_id found");
    return;
  }

  // Find the Supabase user
  const resolvedUserId = userId ?? (await findUserByEmail(supabase, email!));

  if (!resolvedUserId) {
    console.error(
      `checkout.session.completed: no Supabase user found for ${email}`
    );
    return;
  }

  // Fetch full subscription details if we have a subscription ID
  let periodEnd: string | null = null;
  if (subscriptionId) {
    try {
      const stripeClient = getStripeInstance();
      const sub = await stripeClient.subscriptions.retrieve(subscriptionId);
      const endTs = (sub as unknown as { current_period_end: number }).current_period_end;
      if (endTs) {
        periodEnd = new Date(endTs * 1000).toISOString();
      }
    } catch {
      // Non-critical
    }
  }

  // Upsert subscription row
  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: resolvedUserId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      status: "active",
      plan: "pro",
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Failed to upsert subscription:", error);
  } else {
    console.log(`Pro activated for user ${resolvedUserId}`);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawCustomer = (subscription as any).customer;
  const customerId =
    typeof rawCustomer === "string" ? rawCustomer : rawCustomer?.id ?? null;

  // Find subscription row by stripe_customer_id
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!existing) {
    console.error(
      `subscription.updated: no row found for customer ${customerId}`
    );
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = subscription as any;
  const status = mapStripeStatus(sub.status);
  const periodEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status,
      plan: status === "active" ? "pro" : "free",
      stripe_subscription_id: subscription.id,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", existing.user_id);

  if (error) {
    console.error("Failed to update subscription:", error);
  } else {
    console.log(
      `Subscription updated for user ${existing.user_id}: ${status}`
    );
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawCustomer = (subscription as any).customer;
  const customerId =
    typeof rawCustomer === "string" ? rawCustomer : rawCustomer?.id ?? null;

  const { data: existing } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!existing) {
    console.error(
      `subscription.deleted: no row found for customer ${customerId}`
    );
    return;
  }

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      plan: "free",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", existing.user_id);

  if (error) {
    console.error("Failed to cancel subscription:", error);
  } else {
    console.log(`Subscription canceled for user ${existing.user_id}`);
  }
}

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------

async function findUserByEmail(
  supabase: ReturnType<typeof createAdminClient>,
  email: string
): Promise<string | null> {
  // Search profiles table (synced from auth.users)
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  return data?.id ?? null;
}

function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status
): string {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
      return "canceled";
    case "incomplete":
    case "incomplete_expired":
      return "inactive";
    default:
      return "inactive";
  }
}
