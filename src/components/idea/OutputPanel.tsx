"use client";

import { useState } from "react";
import Link from "next/link";
import { StartThisOutput } from "@/lib/types";

export default function OutputPanel({ data }: { data: StartThisOutput }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `ACTION:\n${data.action}\n\nEXPECTED OUTPUT:\n${data.output}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 animate-in">
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]">
        {/* Action section */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-50 text-[11px]">
              ⚡
            </span>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
              Your action
            </h3>
          </div>
          <p className="mt-2 text-[14px] leading-[1.6] text-zinc-700">
            {data.action}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-zinc-100" />

        {/* Output section */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-violet-50 text-[11px]">
              🎯
            </span>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
              Expected output
            </h3>
          </div>
          <p className="mt-2 text-[14px] leading-[1.6] text-zinc-700">
            {data.output}
          </p>
        </div>

        {/* Copy button */}
        <div className="border-t border-zinc-100 px-4 py-3">
          <button
            onClick={handleCopy}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-zinc-50 px-4 py-2.5 text-[13px] font-medium text-zinc-500 transition-all duration-150 hover:bg-zinc-100 active:scale-[0.98]"
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
      </div>

      <Link
        href="/"
        className="mt-4 flex w-full items-center justify-center rounded-xl px-5 py-3 text-[13px] font-medium text-zinc-400 transition-all duration-150 hover:text-zinc-600 active:scale-[0.98]"
      >
        ← Try another idea
      </Link>
    </div>
  );
}
