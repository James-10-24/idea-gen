"use client";

import { useState, useEffect } from "react";
import { outputsRemaining, FREE_LIMIT_COUNT } from "@/lib/sessionStats";

/**
 * Soft upgrade nudge shown after finalization when user has
 * used 2+ of their free sessions (but isn't fully gated yet).
 * Celebrates progress and teases unlimited access.
 */
export default function UpgradeNudge() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setRemaining(outputsRemaining());
  }, []);

  // Only show when user has used at least 2 sessions but isn't at limit
  if (remaining === null || remaining >= FREE_LIMIT_COUNT - 1 || remaining <= 0 || dismissed) {
    return null;
  }

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
      </div>
      <div className="flex border-t border-zinc-100 px-4 py-2.5">
        <button
          onClick={() => setDismissed(true)}
          className="text-[12px] font-medium text-zinc-400 transition-colors hover:text-zinc-600"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
