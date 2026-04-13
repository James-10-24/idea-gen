import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/pro/status
 *
 * Returns the current user's Pro subscription status.
 * Source of truth: Supabase `subscriptions` table (set by Stripe webhook).
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ pro: false, reason: "not_authenticated" });
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status, plan, current_period_end")
      .eq("user_id", user.id)
      .single();

    if (!subscription) {
      return NextResponse.json({ pro: false, reason: "no_subscription" });
    }

    const isPro =
      subscription.plan === "pro" && subscription.status === "active";

    return NextResponse.json({
      pro: isPro,
      status: subscription.status,
      plan: subscription.plan,
      currentPeriodEnd: subscription.current_period_end,
    });
  } catch {
    return NextResponse.json({ pro: false, reason: "error" });
  }
}
