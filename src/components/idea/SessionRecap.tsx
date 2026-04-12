"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// Feedback types
// ---------------------------------------------------------------------------

type UsefulnessRating = "not" | "a-bit" | "useful" | "very";
type HardestPart = "understanding" | "doing" | "next" | "motivation";
type ContinueLater = "no" | "maybe" | "yes";

export interface FeedbackState {
  usefulness: UsefulnessRating | null;
  hardest: HardestPart | null;
  continueLater: ContinueLater | null;
  freeText: string;
}

// ---------------------------------------------------------------------------
// Chip button
// ---------------------------------------------------------------------------

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-[12px] font-medium transition-all duration-150 active:scale-[0.97] ${
        active
          ? "bg-zinc-900 text-white shadow-sm"
          : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
      }`}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SessionRecapProps {
  ideaTitle: string;
  goal: string;
  stepsGenerated: number;
  stepsCompleted: number;
  artifactsCount: number;
  feedback: FeedbackState;
  onFeedbackChange: (feedback: FeedbackState) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SessionRecap({
  ideaTitle,
  goal,
  stepsGenerated,
  stepsCompleted,
  artifactsCount,
  feedback,
  onFeedbackChange,
}: SessionRecapProps) {
  const [copied, setCopied] = useState(false);

  const update = (patch: Partial<FeedbackState>) => {
    onFeedbackChange({ ...feedback, ...patch });
  };

  const usefulnessLabels: Array<{ value: UsefulnessRating; label: string }> = [
    { value: "not", label: "Not useful" },
    { value: "a-bit", label: "A bit" },
    { value: "useful", label: "Useful" },
    { value: "very", label: "Very useful" },
  ];

  const hardestLabels: Array<{ value: HardestPart; label: string }> = [
    { value: "understanding", label: "Understanding the idea" },
    { value: "doing", label: "Doing the step" },
    { value: "next", label: "Knowing what's next" },
    { value: "motivation", label: "Staying motivated" },
  ];

  const continueLabels: Array<{ value: ContinueLater; label: string }> = [
    { value: "no", label: "No" },
    { value: "maybe", label: "Maybe" },
    { value: "yes", label: "Yes" },
  ];

  const buildSummary = () => {
    const lines = [
      `SESSION FEEDBACK`,
      `Idea: ${ideaTitle}`,
      `Goal: ${goal}`,
      ``,
      `Stats:`,
      `  Steps generated: ${stepsGenerated}`,
      `  Steps completed: ${stepsCompleted}`,
      `  Artifacts created: ${artifactsCount}`,
      ``,
      `Feedback:`,
      `  Usefulness: ${feedback.usefulness ?? "(not answered)"}`,
      `  Hardest part: ${feedback.hardest ?? "(not answered)"}`,
      `  Would continue later: ${feedback.continueLater ?? "(not answered)"}`,
    ];
    if (feedback.freeText.trim()) {
      lines.push(`  Note: ${feedback.freeText.trim()}`);
    }
    return lines.join("\n");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasAnyFeedback =
    feedback.usefulness || feedback.hardest || feedback.continueLater;

  return (
    <div className="mt-5 animate-in-fast overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]">
      {/* Recap stats */}
      <div className="px-4 pt-4 pb-3">
        <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-900">
          Session recap
        </h3>
        <div className="mt-2 flex gap-3">
          <div className="flex-1 rounded-lg bg-zinc-50 px-3 py-2 text-center">
            <span className="block text-[16px] font-bold tabular-nums text-zinc-900">
              {stepsGenerated}
            </span>
            <span className="text-[10px] text-zinc-400">steps</span>
          </div>
          <div className="flex-1 rounded-lg bg-zinc-50 px-3 py-2 text-center">
            <span className="block text-[16px] font-bold tabular-nums text-emerald-600">
              {stepsCompleted}
            </span>
            <span className="text-[10px] text-zinc-400">done</span>
          </div>
          <div className="flex-1 rounded-lg bg-zinc-50 px-3 py-2 text-center">
            <span className="block text-[16px] font-bold tabular-nums text-violet-600">
              {artifactsCount}
            </span>
            <span className="text-[10px] text-zinc-400">artifacts</span>
          </div>
        </div>
      </div>

      <div className="mx-4 border-t border-zinc-100" />

      {/* Q1: Usefulness */}
      <div className="px-4 py-3">
        <p className="text-[12px] font-medium text-zinc-600">
          How useful was this so far?
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {usefulnessLabels.map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              active={feedback.usefulness === o.value}
              onClick={() => update({ usefulness: o.value })}
            />
          ))}
        </div>
      </div>

      {/* Q2: Hardest part */}
      <div className="px-4 py-3">
        <p className="text-[12px] font-medium text-zinc-600">
          What felt hardest?
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {hardestLabels.map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              active={feedback.hardest === o.value}
              onClick={() => update({ hardest: o.value })}
            />
          ))}
        </div>
      </div>

      {/* Q3: Continue later */}
      <div className="px-4 py-3">
        <p className="text-[12px] font-medium text-zinc-600">
          Would you want to continue this later?
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {continueLabels.map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              active={feedback.continueLater === o.value}
              onClick={() => update({ continueLater: o.value })}
            />
          ))}
        </div>
      </div>

      {/* Free text */}
      <div className="px-4 py-3">
        <p className="text-[12px] font-medium text-zinc-600">
          Anything confusing or missing?
        </p>
        <textarea
          value={feedback.freeText}
          onChange={(e) => update({ freeText: e.target.value })}
          placeholder="Optional — anything helps"
          rows={2}
          className="mt-2 w-full resize-none rounded-lg border-0 bg-zinc-50 px-3 py-2 text-[13px] leading-[1.5] text-zinc-700 placeholder-zinc-300 outline-none ring-1 ring-zinc-100 transition-all focus:ring-zinc-300"
        />
      </div>

      {/* Copy feedback summary */}
      {hasAnyFeedback && (
        <div className="border-t border-zinc-100 px-4 py-3">
          <button
            onClick={handleCopy}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-2 text-[12px] font-medium text-zinc-500 transition-all duration-150 hover:bg-zinc-100 active:scale-[0.98]"
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
                  <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 11V3.5C3 2.67 3.67 2 4.5 2H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Copy feedback summary
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
