"use client";

import { useState } from "react";
import { StepOutcome } from "@/lib/types";
import { extractKeyOutputs, formatOutputsForCopy, ExtractedOutput } from "@/lib/extractOutputs";

export interface Artifact {
  stepNumber: number;
  stepTitle: string;
  template: string;
  outcome: StepOutcome | null;
}

interface BuildBoardProps {
  ideaTitle: string;
  goal: string;
  completedSteps: Array<{ stepTitle: string; done: boolean }>;
  artifacts: Artifact[];
  onShare?: () => void;
  onSave?: () => void;
}

function outcomeLabel(o: StepOutcome | null): string {
  switch (o) {
    case "done":
      return "Completed";
    case "useful":
      return "Got results";
    case "partly":
      return "Partial";
    case "stuck":
      return "Needs revisit";
    default:
      return "";
  }
}

function outcomeColor(o: StepOutcome | null): string {
  switch (o) {
    case "done":
    case "useful":
      return "text-emerald-500";
    case "partly":
      return "text-amber-500";
    case "stuck":
      return "text-rose-400";
    default:
      return "text-zinc-300";
  }
}

export default function BuildBoard({
  ideaTitle,
  goal,
  completedSteps,
  artifacts,
  onShare,
  onSave,
}: BuildBoardProps) {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [saveDone, setSaveDone] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const recentArtifacts = artifacts.slice(-4);
  const hasContent = completedSteps.length > 0 || artifacts.length > 0;
  const keyOutputs: ExtractedOutput[] = extractKeyOutputs(artifacts);

  if (!hasContent) return null;

  const buildSummary = () => {
    let text = `PROJECT: ${ideaTitle}\n`;
    text += `GOAL: ${goal}\n\n`;

    // Key outputs at the top
    const outputsText = formatOutputsForCopy(keyOutputs);
    if (outputsText) {
      text += outputsText + "\n\n";
    }

    if (completedSteps.length > 0) {
      text += `PROGRESS (${completedSteps.filter((s) => s.done).length}/${completedSteps.length} completed):\n`;
      completedSteps.forEach((s, i) => {
        text += `${s.done ? "✓" : "○"} Step ${i + 1}: ${s.stepTitle}\n`;
      });
      text += "\n";
    }

    if (artifacts.length > 0) {
      text += `ARTIFACTS:\n`;
      artifacts.forEach((a) => {
        text += `\n--- Step ${a.stepNumber}: ${a.stepTitle} ---\n`;
        text += a.template + "\n";
      });
    }

    return text;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 animate-in-fast">
      {/* Header — tappable to expand/collapse */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between rounded-t-xl bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)] transition-colors active:bg-zinc-50"
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px]">📋</span>
          <span className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-900">
            Build Board
          </span>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] tabular-nums text-zinc-400">
            {artifacts.length} {artifacts.length === 1 ? "artifact" : "artifacts"}
          </span>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          className={`text-zinc-300 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="overflow-hidden rounded-b-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)]">
          {/* What you've created — key outputs */}
          {keyOutputs.length > 0 && (
            <div className="border-t border-zinc-100 px-4 py-3">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-300">
                What you&apos;ve created
              </h4>
              <div className="mt-2 rounded-lg bg-emerald-50/50 px-3 py-2.5 ring-1 ring-inset ring-emerald-100">
                <ul className="space-y-1.5">
                  {keyOutputs.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px]">
                      <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                      <span>
                        <span className="font-medium text-zinc-600">
                          {o.label}:
                        </span>{" "}
                        <span className="text-zinc-800">{o.value}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* What you're building */}
          <div className="border-t border-zinc-100 px-4 py-3">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-300">
              What you&apos;re building
            </h4>
            <p className="mt-1 text-[13px] font-medium leading-snug text-zinc-800">
              {ideaTitle}
            </p>
            <p className="mt-0.5 text-[12px] text-zinc-400">{goal}</p>
          </div>

          {/* Progress so far */}
          {completedSteps.length > 0 && (
            <div className="border-t border-zinc-100 px-4 py-3">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-300">
                Progress so far
              </h4>
              <div className="mt-1.5 space-y-1">
                {completedSteps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className={`text-[11px] ${
                        s.done ? "text-emerald-500" : "text-zinc-300"
                      }`}
                    >
                      {s.done ? "✓" : "○"}
                    </span>
                    <span
                      className={`text-[12px] ${
                        s.done ? "text-zinc-600" : "text-zinc-400"
                      }`}
                    >
                      {s.stepTitle}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Artifacts created */}
          {recentArtifacts.length > 0 && (
            <div className="border-t border-zinc-100 px-4 py-3">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-300">
                Artifacts created
              </h4>
              <div className="mt-1.5 space-y-2">
                {recentArtifacts.map((a, i) => (
                  <div key={i} className="rounded-lg bg-zinc-50 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-zinc-600">
                        Step {a.stepNumber}: {a.stepTitle}
                      </span>
                      {a.outcome && (
                        <span
                          className={`text-[10px] font-medium ${outcomeColor(a.outcome)}`}
                        >
                          {outcomeLabel(a.outcome)}
                        </span>
                      )}
                    </div>
                    <pre className="mt-1 max-h-16 overflow-hidden whitespace-pre-wrap font-sans text-[11px] leading-[1.5] text-zinc-400">
                      {a.template.slice(0, 200)}
                      {a.template.length > 200 ? "…" : ""}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 border-t border-zinc-100 px-4 py-3">
            <button
              onClick={handleCopy}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-2 text-[12px] font-medium text-zinc-500 transition-all duration-150 hover:bg-zinc-100 active:scale-[0.98]"
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
                  Copy summary
                </>
              )}
            </button>
            {onSave && (
              <button
                onClick={() => {
                  onSave();
                  setSaveDone(true);
                  setTimeout(() => setSaveDone(false), 2000);
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-[12px] font-medium text-white transition-all duration-150 hover:bg-zinc-800 active:scale-[0.98]"
              >
                {saveDone ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Saved
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M2 5V3C2 2.45 2.45 2 3 2H10L14 6V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 14V9H11V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Save progress
                  </>
                )}
              </button>
            )}
            {onShare && (
              <button
                onClick={() => {
                  onShare();
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 2000);
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-[12px] font-medium text-white transition-all duration-150 hover:bg-zinc-800 active:scale-[0.98]"
              >
                {shareCopied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Link copied
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M6 10L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M8.5 3.5L10.5 1.5C11.3 0.7 12.7 0.7 13.5 1.5V1.5C14.3 2.3 14.3 3.7 13.5 4.5L11.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M7.5 12.5L5.5 14.5C4.7 15.3 3.3 15.3 2.5 14.5V14.5C1.7 13.7 1.7 12.3 2.5 11.5L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Share project
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Collapsed preview */}
      {!expanded && (
        <div className="rounded-b-xl bg-white px-4 pb-3 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)]">
          {/* Key output preview (1 line max) */}
          {keyOutputs.length > 0 && (
            <p className="mb-2 truncate text-[11px] text-zinc-400">
              <span className="font-medium text-zinc-500">{keyOutputs[0].label}:</span>{" "}
              {keyOutputs[0].value}
            </p>
          )}
          <div className="flex gap-1">
            {completedSteps.map((s, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  s.done ? "bg-emerald-400" : "bg-zinc-200"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
