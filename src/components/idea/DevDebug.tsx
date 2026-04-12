"use client";

import { useState } from "react";
import { StepOutcome } from "@/lib/types";
import { PriorityResult } from "@/lib/priority";
import { resetOnboarding } from "@/lib/onboarding";
import {
  getMetricsForIdea,
  getTopIdeas,
  resetMetrics,
  IdeaMetrics,
} from "@/lib/metrics";
import { FeedbackState } from "./SessionRecap";
import { OutcomeState } from "./OutcomeCard";

interface DevDebugProps {
  ideaId: string;
  stepNumber: number;
  completedCount: number;
  artifactsCount: number;
  currentOutcome: StepOutcome | null;
  feedback: FeedbackState;
  priority: PriorityResult | null;
  realOutcome: OutcomeState;
}

export default function DevDebug({
  ideaId,
  stepNumber,
  completedCount,
  artifactsCount,
  currentOutcome,
  feedback,
  priority,
  realOutcome,
}: DevDebugProps) {
  const [open, setOpen] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [metricsResetDone, setMetricsResetDone] = useState(false);
  const [showAllMetrics, setShowAllMetrics] = useState(false);

  if (process.env.NODE_ENV !== "development") return null;

  const handleResetOnboarding = () => {
    resetOnboarding();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 1500);
  };

  const handleResetMetrics = () => {
    resetMetrics();
    setMetricsResetDone(true);
    setTimeout(() => setMetricsResetDone(false), 1500);
  };

  // Read metrics live when panel is open
  const ideaMetrics: IdeaMetrics | null = open
    ? getMetricsForIdea(ideaId)
    : null;
  const allIdeas = open && showAllMetrics ? getTopIdeas("clicks") : [];

  return (
    <div className="mt-8 mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-300 transition-colors hover:text-zinc-500"
      >
        <span>{open ? "▼" : "▶"}</span>
        dev debug
      </button>
      {open && (
        <>
          {/* Session state */}
          <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-900 p-3 font-mono text-[11px] leading-[1.6] text-zinc-400">
            {JSON.stringify(
              {
                ideaId,
                stepNumber,
                completedCount,
                artifactsCount,
                currentOutcome,
                priority: priority
                  ? { rating: priority.rating, explanation: priority.explanation }
                  : null,
                realOutcome: {
                  type: realOutcome.type,
                  amount: realOutcome.amount || null,
                  note: realOutcome.note
                    ? `"${realOutcome.note.slice(0, 40)}..."`
                    : null,
                },
                feedback: {
                  usefulness: feedback.usefulness,
                  hardest: feedback.hardest,
                  continueLater: feedback.continueLater,
                  resultSignal: feedback.resultSignal,
                  freeText: feedback.freeText
                    ? `"${feedback.freeText.slice(0, 50)}..."`
                    : null,
                },
              },
              null,
              2
            )}
          </pre>

          {/* Current idea metrics */}
          <div className="mt-2 rounded-lg bg-zinc-900 p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              Metrics: {ideaId}
            </p>
            {ideaMetrics && (
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                {(
                  Object.entries(ideaMetrics) as [keyof IdeaMetrics, number][]
                ).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <p className="font-mono text-[14px] font-semibold text-zinc-300">
                      {val}
                    </p>
                    <p className="font-mono text-[9px] text-zinc-500">
                      {key}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All ideas toggle */}
          <button
            onClick={() => setShowAllMetrics((v) => !v)}
            className="mt-2 rounded bg-zinc-800 px-2.5 py-1 font-mono text-[10px] text-zinc-400 transition-colors hover:text-zinc-200"
          >
            {showAllMetrics ? "hide all ideas" : "show all ideas"}
          </button>

          {showAllMetrics && allIdeas.length > 0 && (
            <div className="mt-2 overflow-x-auto rounded-lg bg-zinc-900 p-3">
              <table className="w-full font-mono text-[10px] text-zinc-400">
                <thead>
                  <tr className="text-zinc-500">
                    <th className="pb-1 text-left font-medium">idea</th>
                    <th className="pb-1 text-right font-medium">impr</th>
                    <th className="pb-1 text-right font-medium">click</th>
                    <th className="pb-1 text-right font-medium">start</th>
                    <th className="pb-1 text-right font-medium">s2+</th>
                  </tr>
                </thead>
                <tbody>
                  {allIdeas.map(({ id, metrics: m }) => (
                    <tr
                      key={id}
                      className={
                        id === ideaId ? "text-emerald-400" : ""
                      }
                    >
                      <td className="max-w-[140px] truncate py-0.5 pr-2">
                        {id}
                      </td>
                      <td className="py-0.5 text-right">{m.impressions}</td>
                      <td className="py-0.5 text-right">{m.clicks}</td>
                      <td className="py-0.5 text-right">{m.starts}</td>
                      <td className="py-0.5 text-right">{m.step2Plus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleResetOnboarding}
              className="rounded bg-zinc-800 px-2.5 py-1 font-mono text-[10px] text-zinc-400 transition-colors hover:text-zinc-200"
            >
              {resetDone ? "✓ onboarding reset" : "reset onboarding"}
            </button>
            <button
              onClick={handleResetMetrics}
              className="rounded bg-zinc-800 px-2.5 py-1 font-mono text-[10px] text-zinc-400 transition-colors hover:text-zinc-200"
            >
              {metricsResetDone ? "✓ metrics reset" : "reset metrics"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
