"use client";

import { useState } from "react";
import { StartThisOutput } from "@/lib/types";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-1.5 text-[12px] font-medium text-zinc-400 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-600 active:scale-[0.97]"
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
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
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
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
          {label}
        </>
      )}
    </button>
  );
}

interface OutputPanelProps {
  data: StartThisOutput;
  onNextStep: () => void;
  nextStepLoading: boolean;
  onTryAnother: () => void;
}

export default function OutputPanel({
  data,
  onNextStep,
  nextStepLoading,
  onTryAnother,
}: OutputPanelProps) {
  const fullText = `YOUR FIRST STEP:\n${data.firstStep}\n\nDO THIS NOW:\n${data.doThisNow}\n\nTEMPLATE:\n${data.template}`;

  return (
    <div className="mt-6 animate-in">
      {/* Section 1: Your First Step */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-50 text-[12px]">
              1
            </span>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
              Your First Step
            </h3>
          </div>
          <p className="mt-2 text-[14px] leading-[1.6] text-zinc-700">
            {data.firstStep}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-zinc-100" />

        {/* Section 2: Do This Now */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-50 text-[12px]">
              2
            </span>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
              Do This Now
            </h3>
          </div>
          <p className="mt-2 text-[14px] leading-[1.6] text-zinc-700">
            {data.doThisNow}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-zinc-100" />

        {/* Section 3: Copy This Template */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-50 text-[12px]">
              3
            </span>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
              Copy This Template
            </h3>
          </div>
          <pre className="mt-2.5 whitespace-pre-wrap rounded-xl bg-zinc-50 p-3.5 font-sans text-[13px] leading-[1.7] text-zinc-600">
            {data.template}
          </pre>
          <CopyButton text={data.template} label="Copy template" />
        </div>

        {/* Full copy */}
        <div className="border-t border-zinc-100 px-4 py-3">
          <CopyButton text={fullText} label="Copy everything" />
        </div>
      </div>

      {/* Generate next step */}
      <button
        onClick={onNextStep}
        disabled={nextStepLoading}
        className="mt-4 w-full rounded-2xl bg-zinc-900 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-150 hover:bg-zinc-800 active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100"
      >
        {nextStepLoading ? (
          <span className="flex items-center justify-center gap-2.5">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            Generating next step…
          </span>
        ) : (
          "Generate next step"
        )}
      </button>
      <p className="mt-1.5 text-center text-[11px] text-zinc-400">
        Get another concrete action to keep momentum.
      </p>

      {/* Try another idea */}
      <button
        onClick={onTryAnother}
        className="mt-3 flex w-full items-center justify-center rounded-xl px-5 py-3 text-[13px] font-medium text-zinc-400 transition-all duration-150 hover:text-zinc-600 active:scale-[0.98]"
      >
        ← Try another idea
      </button>
    </div>
  );
}
