"use client";

import { useEffect, useState } from "react";
import { loadStats, isAtLimit } from "@/lib/sessionStats";

export default function LimitCard() {
  const [atLimit, setAtLimit] = useState(false);
  const [outputCount, setOutputCount] = useState(0);
  const [showEmail, setShowEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const stats = loadStats();
    setAtLimit(isAtLimit(stats));
    setOutputCount(stats.totalOutputs);
  }, []);

  if (!atLimit) return null;

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
      // Stripe not configured — fall back to email capture
      setShowEmail(true);
    } catch {
      setShowEmail(true);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="mb-3 animate-in-fast overflow-hidden rounded-2xl bg-zinc-900 shadow-lg">
      {/* Hero section */}
      <div className="px-5 pt-5 pb-4">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg">
          🚀
        </div>
        <h2 className="text-[17px] font-bold leading-tight tracking-[-0.01em] text-white">
          You&apos;ve shipped {outputCount} usable outputs
        </h2>
        <p className="mt-1 text-[13px] leading-[1.5] text-white/60">
          Keep creating posts, messages, and actions without limits.
        </p>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-[24px] font-bold tracking-tight text-white">
            RM29
          </span>
          <span className="text-[13px] text-white/40">/ month</span>
        </div>
        <p className="mt-0.5 text-[11px] text-white/30">
          Cancel anytime. No commitment.
        </p>
      </div>

      {/* Value bullets */}
      <div className="mx-5 rounded-xl bg-white/[0.06] px-4 py-3">
        <ul className="space-y-2.5">
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-[9px] text-emerald-400">
              ✓
            </span>
            <div>
              <p className="text-[13px] font-medium text-white/90">
                Unlimited 10-minute sessions
              </p>
              <p className="text-[11px] text-white/40">
                Ship as many outputs as you want
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-[9px] text-emerald-400">
              ✓
            </span>
            <div>
              <p className="text-[13px] font-medium text-white/90">
                More post-ready outputs
              </p>
              <p className="text-[11px] text-white/40">
                Smarter steps, better templates
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-[9px] text-emerald-400">
              ✓
            </span>
            <div>
              <p className="text-[13px] font-medium text-white/90">
                Save and continue your work
              </p>
              <p className="text-[11px] text-white/40">
                Pick up where you left off
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* CTA area */}
      <div className="px-5 pt-4 pb-5">
        {!showEmail ? (
          <div className="flex gap-2">
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="flex-1 rounded-xl bg-white px-4 py-3 text-[14px] font-semibold text-zinc-900 transition-all duration-150 hover:bg-zinc-100 active:scale-[0.97] disabled:opacity-60"
            >
              {checkoutLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />
                  Loading…
                </span>
              ) : (
                "Unlock unlimited — RM29/mo"
              )}
            </button>
            <button
              onClick={() => setAtLimit(false)}
              className="rounded-xl px-4 py-3 text-[13px] font-medium text-white/30 transition-colors hover:text-white/50 active:scale-[0.97]"
            >
              Later
            </button>
          </div>
        ) : !emailSent ? (
          <div className="animate-in-fast">
            <p className="text-[13px] font-medium text-white/90">
              Unlimited access is opening soon
            </p>
            <p className="mt-0.5 text-[12px] leading-[1.5] text-white/40">
              Early users get first access at RM29/mo. Drop your email
              and we&apos;ll let you know when it&apos;s ready.
            </p>
            <p className="mt-1 text-[10px] text-white/20">
              One email when we launch. No spam.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="min-w-0 flex-1 rounded-lg bg-white/10 px-3 py-2.5 text-[13px] text-white placeholder-white/30 outline-none ring-1 ring-white/10 transition-colors focus:ring-white/30"
              />
              <button
                onClick={() => setEmailSent(true)}
                className="shrink-0 rounded-lg bg-white px-4 py-2.5 text-[13px] font-semibold text-zinc-900 transition-all active:scale-[0.97]"
              >
                Notify me
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in-fast text-center">
            <p className="text-[14px] font-medium text-emerald-400">
              You&apos;re on the list
            </p>
            <p className="mt-0.5 text-[12px] text-white/40">
              We&apos;ll email you when unlimited access is ready at RM29/mo.
            </p>
          </div>
        )}
      </div>

      {/* Browse note */}
      <div className="border-t border-white/[0.06] px-5 py-3">
        <p className="text-center text-[11px] text-white/25">
          You can still browse ideas and review your past work.
        </p>
      </div>
    </div>
  );
}
