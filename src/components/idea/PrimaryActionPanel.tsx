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
  "Turning idea into action…",
  "Drafting your first move…",
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
        <div className="rounded-2xl bg-zinc-50 px-4 py-4 text-center">
          <p className="text-[13px] font-medium text-zinc-600">
            You&apos;ve used your free sessions
          </p>
          <p className="mt-0.5 text-[12px] text-zinc-400">
            You can still browse and review your past work.
          </p>
          <Link
            href="/"
            className="mt-3 inline-block rounded-xl bg-zinc-900 px-5 py-2.5 text-[13px] font-medium text-white transition-all active:scale-[0.97]"
          >
            Browse ideas
          </Link>
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
          Get one concrete action you can do in under 10 minutes.
        </p>
      )}
    </div>
  );
}
