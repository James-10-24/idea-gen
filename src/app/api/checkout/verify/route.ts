import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

/**
 * POST /api/checkout/verify
 *
 * Verifies a Stripe Checkout session after successful payment.
 * Returns the customer email so we can store it client-side.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Missing session ID" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 402 }
      );
    }

    return NextResponse.json({
      email: session.customer_email || session.customer_details?.email || "",
      status: "active",
    });
  } catch (err) {
    console.error("Checkout verify error:", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
