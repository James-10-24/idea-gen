"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PrimaryActionPanelProps {
  onStart: () => void;
  loading: boolean;
  disabled: boolean;
  atLimit?: boolean;
}

const loadingMessages = [
  "Building your first draft…",
  "Turning idea into action…",
  "Making it concrete…",
];

export default function PrimaryActionPanel({
  onStart,
  loading,
  disabled,
  atLimit,
}: PrimaryActionPanelProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % loadingMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

  if (atLimit) {
    return (
      <div className="mt-6">
        <div className="overflow-hidden rounded-2xl bg-zinc-900">
          <div className="px-4 py-4 text-center">
            <p className="text-[14px] font-semibold text-white">
              You&apos;ve used your free sessions
            </p>
            <p className="mt-0.5 text-[12px] text-white/50">
              Unlock unlimited to keep shipping.
            </p>
          </div>
          <div className="flex gap-2 border-t border-white/[0.06] px-4 py-3">
            <Link
              href="/"
              className="flex-1 rounded-xl bg-white px-4 py-2.5 text-center text-[13px] font-semibold text-zinc-900 transition-all active:scale-[0.97]"
            >
              Unlock unlimited
            </Link>
            <Link
              href="/"
              className="flex-1 rounded-xl px-4 py-2.5 text-center text-[13px] font-medium text-white/30 transition-colors hover:text-white/50 active:scale-[0.97]"
            >
              Browse ideas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={onStart}
        disabled={disabled || loading}
        className="w-full rounded-2xl bg-zinc-900 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-150 hover:bg-zinc-800 hover:shadow-[0_2px_8px_rgba(0,0,0,0.2)] active:scale-[0.97] active:shadow-sm disabled:opacity-30 disabled:active:scale-100"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2.5">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <span className="transition-opacity duration-200">
              {loadingMessages[msgIndex]}
            </span>
          </span>
        ) : (
          "Start this"
        )}
      </button>
      {!loading && !disabled && (
        <p className="mt-1.5 text-center text-[11px] text-zinc-400">
          Walk away with something usable in under 10 minutes.
        </p>
      )}
    </div>
  );
}
