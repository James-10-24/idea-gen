"use client";

import { useState, useEffect } from "react";
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
      className="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-1.5 text-[12px] font-medium text-zinc-400 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-600 active:scale-[0.97]"
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 11V3.5C3 2.67 3.67 2 4.5 2H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

const nextStepMessages = [
  "Building on your progress…",
  "Generating your next move…",
  "Planning the next step…",
];

interface OutputPanelProps {
  data: StartThisOutput;
  stepNumber: number;
  onNextStep: () => void;
  nextStepLoading: boolean;
  onTryAnother: () => void;
}

export default function OutputPanel({
  data,
  stepNumber,
  onNextStep,
  nextStepLoading,
  onTryAnother,
}: OutputPanelProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!nextStepLoading) return;
    setMsgIndex(0);
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % nextStepMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [nextStepLoading]);

  const fullText = `STEP ${stepNumber}: ${data.stepTitle}\n\n${data.instruction}\n\nTEMPLATE:\n${data.template}`;

  return (
    <div className="mt-6 animate-in">
      {/* Step header */}
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[12px] font-bold text-white">
          {stepNumber}
        </span>
        <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-zinc-900">
          {data.stepTitle}
        </h3>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]">
        {/* Instruction */}
        <div className="p-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-300">
            What to do
          </h4>
          <p className="mt-1.5 text-[14px] leading-[1.6] text-zinc-700">
            {data.instruction}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-zinc-100" />

        {/* Template */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-300">
              Fill this in
            </h4>
            <CopyButton text={data.template} label="Copy" />
          </div>
          <pre className="mt-2.5 whitespace-pre-wrap rounded-xl bg-zinc-50 p-3.5 font-sans text-[13px] leading-[1.7] text-zinc-600">
            {data.template}
          </pre>
        </div>

        {/* Full copy footer */}
        <div className="flex border-t border-zinc-100 px-4 py-3">
          <CopyButton text={fullText} label="Copy everything" />
        </div>
      </div>

      {/* Step progress indicator */}
      <div className="mt-5 flex items-center justify-center gap-1.5">
        {Array.from({ length: stepNumber }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === stepNumber - 1
                ? "w-6 bg-zinc-900"
                : "w-1.5 bg-zinc-200"
            }`}
          />
        ))}
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-100" />
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
            <span>{nextStepMessages[msgIndex]}</span>
          </span>
        ) : (
          `Generate step ${stepNumber + 1}`
        )}
      </button>
      <p className="mt-1.5 text-center text-[11px] text-zinc-400">
        Keep building momentum — each step moves you closer.
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
