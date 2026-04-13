"use client";

import { useState, useEffect } from "react";
import { outputsRemaining, FREE_LIMIT_COUNT } from "@/lib/sessionStats";

/**
 * Soft upgrade nudge shown after finalization when user has
 * used 2+ of their free sessions (but isn't fully gated yet).
 * Celebrates progress, teases unlimited access, and adds social proof.
 */
export default function UpgradeNudge() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    setRemaining(outputsRemaining());
  }, []);

  // Only show when user has used at least 2 sessions but isn't at limit
  if (remaining === null || remaining >= FREE_LIMIT_COUNT - 1 || remaining <= 0 || dismissed) {
    return null;
  }

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // Stripe not configured — go to home for fallback
    }
    setCheckoutLoading(false);
    window.location.href = "/";
  };

  return (
    <div className="mt-6 animate-in-fast overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]">
      <div className="px-4 py-3.5">
        <p className="text-[13px] font-medium text-zinc-700">
          {remaining === 1
            ? "You have 1 free session left"
            : `You have ${remaining} free sessions left`}
        </p>
        <p className="mt-0.5 text-[12px] text-zinc-400">
          Unlock unlimited for RM29/mo to keep shipping.
        </p>
        <p className="mt-2 text-[11px] italic text-zinc-300">
          Used by creators, founders, and operators to ship real outputs weekly.
        </p>
      </div>
      <div className="flex gap-3 border-t border-zinc-100 px-4 py-2.5">
        <button
          onClick={handleCheckout}
          disabled={checkoutLoading}
          className="text-[12px] font-semibold text-zinc-900 transition-colors hover:text-zinc-700 disabled:opacity-50"
        >
          {checkoutLoading ? "Loading…" : "Unlock now →"}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-[12px] font-medium text-zinc-300 transition-colors hover:text-zinc-500"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
