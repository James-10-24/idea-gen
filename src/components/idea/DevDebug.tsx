"use client";

import { useState } from "react";
import { StepOutcome } from "@/lib/types";
import { FeedbackState } from "./SessionRecap";

interface DevDebugProps {
  ideaId: string;
  stepNumber: number;
  completedCount: number;
  artifactsCount: number;
  currentOutcome: StepOutcome | null;
  feedback: FeedbackState;
}

export default function DevDebug({
  ideaId,
  stepNumber,
  completedCount,
  artifactsCount,
  currentOutcome,
  feedback,
}: DevDebugProps) {
  const [open, setOpen] = useState(false);

  if (process.env.NODE_ENV !== "development") return null;

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
        <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-900 p-3 font-mono text-[11px] leading-[1.6] text-zinc-400">
          {JSON.stringify(
            {
              ideaId,
              stepNumber,
              completedCount,
              artifactsCount,
              currentOutcome,
              feedback: {
                usefulness: feedback.usefulness,
                hardest: feedback.hardest,
                continueLater: feedback.continueLater,
                freeText: feedback.freeText ? `"${feedback.freeText.slice(0, 50)}..."` : null,
              },
            },
            null,
            2
          )}
        </pre>
      )}
    </div>
  );
}
