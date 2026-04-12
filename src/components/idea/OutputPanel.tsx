"use client";

import { useState, useEffect } from "react";
import { StartThisOutput, StepOutcome } from "@/lib/types";
import OutcomeSelector from "./OutcomeSelector";

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
  "Adapting to your result…",
];

interface OutputPanelProps {
  data: StartThisOutput;
  stepNumber: number;
  isFirstStep: boolean;
  outcome: StepOutcome | null;
  onOutcomeSelect: (outcome: StepOutcome) => void;
  onNextStep: () => void;
  nextStepLoading: boolean;
  onTryAnother: () => void;
}

export default function OutputPanel({
  data,
  stepNumber,
  isFirstStep,
  outcome,
  onOutcomeSelect,
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
      {/* Contextual label for steps after the first */}
      {!isFirstStep && (
        <p className="mb-3 text-[12px] text-zinc-400">
          Based on your last result, here&apos;s the best next move.
        </p>
      )}

      {/* Step header */}
      <div className="mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-300">
          Step {stepNumber}
        </span>
        <h3 className="mt-0.5 text-[17px] font-semibold leading-tight tracking-[-0.01em] text-zinc-900">
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

        {/* Footer: copy all */}
        <div className="flex border-t border-zinc-100 px-4 py-3">
          <CopyButton text={fullText} label="Copy all" />
        </div>
      </div>

      {/* Outcome check-in */}
      <OutcomeSelector selected={outcome} onSelect={onOutcomeSelect} />

      {/* Generate next step — enabled once outcome is selected */}
      <button
        onClick={onNextStep}
        disabled={nextStepLoading || !outcome}
        className="mt-4 w-full rounded-2xl bg-zinc-900 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-150 hover:bg-zinc-800 active:scale-[0.97] disabled:opacity-30 disabled:active:scale-100"
      >
        {nextStepLoading ? (
          <span className="flex items-center justify-center gap-2.5">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <span>{nextStepMessages[msgIndex]}</span>
          </span>
        ) : (
          "Generate next step"
        )}
      </button>
      {!outcome && (
        <p className="mt-1.5 text-center text-[11px] text-zinc-400">
          Tell us how it went to get a tailored next step.
        </p>
      )}

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
