"use client";

import { useEffect, useState } from "react";
import { loadStats, isAtLimit } from "@/lib/sessionStats";

export default function LimitCard() {
  const [atLimit, setAtLimit] = useState(false);
  const [outputCount, setOutputCount] = useState(0);
  const [showUnlock, setShowUnlock] = useState(false);

  useEffect(() => {
    const stats = loadStats();
    setAtLimit(isAtLimit(stats));
    setOutputCount(stats.totalOutputs);
  }, []);

  if (!atLimit) return null;

  return (
    <div className="mb-3 animate-in-fast overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]">
      <div className="px-4 pt-4 pb-3">
        <p className="text-[14px] font-semibold text-zinc-900">
          You&apos;ve already shipped {outputCount} usable outputs
        </p>
        <p className="mt-0.5 text-[12px] text-zinc-400">
          Your free sessions are used up. You can still browse ideas
          and review your work.
        </p>
      </div>

      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={() => setShowUnlock(true)}
          className="flex-1 rounded-xl bg-zinc-900 px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-150 hover:bg-zinc-800 active:scale-[0.97]"
        >
          Unlock unlimited
        </button>
        <button
          onClick={() => setAtLimit(false)}
          className="flex-1 rounded-xl bg-zinc-50 px-4 py-2.5 text-[13px] font-medium text-zinc-500 transition-all duration-150 hover:bg-zinc-100 active:scale-[0.97]"
        >
          Maybe later
        </button>
      </div>

      {showUnlock && (
        <div className="border-t border-zinc-100 px-4 py-3">
          <p className="text-[13px] font-medium text-zinc-700">
            Coming soon
          </p>
          <p className="mt-1 text-[12px] leading-[1.5] text-zinc-400">
            Early users will get first access. Here&apos;s what you&apos;ll get:
          </p>
          <ul className="mt-2 space-y-1.5">
            <li className="flex items-center gap-2 text-[12px] text-zinc-500">
              <span className="h-1 w-1 flex-shrink-0 rounded-full bg-emerald-400" />
              Unlimited 10-minute sessions
            </li>
            <li className="flex items-center gap-2 text-[12px] text-zinc-500">
              <span className="h-1 w-1 flex-shrink-0 rounded-full bg-emerald-400" />
              More post-ready outputs
            </li>
            <li className="flex items-center gap-2 text-[12px] text-zinc-500">
              <span className="h-1 w-1 flex-shrink-0 rounded-full bg-emerald-400" />
              Save and continue your work
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
