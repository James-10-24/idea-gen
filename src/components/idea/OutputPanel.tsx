"use client";

import { useState } from "react";
import Link from "next/link";
import { StartThisOutput } from "@/lib/types";

export default function OutputPanel({ data }: { data: StartThisOutput }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${data.action}\n\n${data.output}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-zinc-100">
        <h3 className="text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
          Your action
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-zinc-800">
          {data.action}
        </p>

        <div className="mt-4 border-t border-zinc-50 pt-4">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
            Expected output
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-zinc-800">
            {data.output}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-50 px-4 py-2.5 text-[13px] font-medium text-zinc-600 ring-1 ring-zinc-100 transition-all active:scale-[0.98]"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8.5L6.5 12L13 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect
                  x="5"
                  y="5"
                  width="8"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M3 11V3.5C3 2.67 3.67 2 4.5 2H11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Copy to clipboard
            </>
          )}
        </button>
      </div>

      <Link
        href="/"
        className="mt-4 flex w-full items-center justify-center rounded-xl px-5 py-3 text-[14px] font-medium text-zinc-500 transition-colors active:text-zinc-700"
      >
        Try another idea
      </Link>
    </div>
  );
}
