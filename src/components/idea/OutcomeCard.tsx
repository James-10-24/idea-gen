"use client";

import { useState } from "react";

export type OutcomeType =
  | "posted"
  | "learned"
  | "direction"
  | "created"
  | "lead"
  | "money";

export interface OutcomeState {
  type: OutcomeType | null;
  note: string;
  amount: string;
}

export const emptyOutcome: OutcomeState = {
  type: null,
  note: "",
  amount: "",
};

const outcomeOptions: Array<{ value: OutcomeType; label: string }> = [
  { value: "posted", label: "I posted / sent this" },
  { value: "learned", label: "Learned something useful" },
  { value: "direction", label: "Found a direction" },
  { value: "created", label: "Created something usable" },
  { value: "lead", label: "Got a lead / response" },
  { value: "money", label: "Made money" },
];

interface OutcomeCardProps {
  outcome: OutcomeState;
  onChange: (outcome: OutcomeState) => void;
}

export default function OutcomeCard({ outcome, onChange }: OutcomeCardProps) {
  const [showPostedMsg, setShowPostedMsg] = useState(false);

  const update = (patch: Partial<OutcomeState>) => {
    onChange({ ...outcome, ...patch });
  };

  const handleTypeSelect = (value: OutcomeType) => {
    const newType = outcome.type === value ? null : value;
    update({ type: newType });

    // Show success message when "posted" is selected
    if (value === "posted" && newType === "posted") {
      setShowPostedMsg(true);
      setTimeout(() => setShowPostedMsg(false), 3000);
    }
  };

  return (
    <div className="mt-5 animate-in-fast overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]">
      <div className="px-4 pt-4 pb-3">
        <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-900">
          What happened next?
        </h3>
        <p className="mt-0.5 text-[11px] text-zinc-400">
          Capture any real-world result from this session.
        </p>
      </div>

      {/* Outcome type chips */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {outcomeOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => handleTypeSelect(o.value)}
              className={`rounded-lg px-3 py-2 text-[12px] font-medium transition-all duration-150 active:scale-[0.97] ${
                outcome.type === o.value
                  ? o.value === "posted"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Posted success message */}
        {showPostedMsg && (
          <p className="mt-2 text-[12px] font-medium text-emerald-600">
            Nice — that&apos;s the goal. 🎯
          </p>
        )}
      </div>

      {/* Amount field — only when "Made money" selected */}
      {outcome.type === "money" && (
        <div className="px-4 pb-3">
          <input
            type="text"
            value={outcome.amount}
            onChange={(e) => update({ amount: e.target.value })}
            placeholder="How much? (e.g. $50, first client)"
            className="w-full rounded-lg border-0 bg-emerald-50 px-3 py-2 text-[13px] text-zinc-700 placeholder-zinc-400 outline-none ring-1 ring-emerald-100 transition-all focus:ring-emerald-300"
          />
        </div>
      )}

      {/* Note */}
      {outcome.type && (
        <div className="px-4 pb-4">
          <textarea
            value={outcome.note}
            onChange={(e) => update({ note: e.target.value })}
            placeholder={
              outcome.type === "posted"
                ? "Where did you post it? (optional)"
                : "What happened? (optional)"
            }
            rows={2}
            className="w-full resize-none rounded-lg border-0 bg-zinc-50 px-3 py-2 text-[13px] leading-[1.5] text-zinc-700 placeholder-zinc-300 outline-none ring-1 ring-zinc-100 transition-all focus:ring-zinc-300"
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers for copy / debug
// ---------------------------------------------------------------------------

const typeLabels: Record<OutcomeType, string> = {
  posted: "I posted / sent this",
  learned: "Learned something useful",
  direction: "Found a direction",
  created: "Created something usable",
  lead: "Got a lead / response",
  money: "Made money",
};

export function formatOutcomeForCopy(outcome: OutcomeState): string {
  if (!outcome.type) return "";
  let text = `REAL-WORLD OUTCOME:\n  Type: ${typeLabels[outcome.type]}`;
  if (outcome.type === "posted") text += `\n  Posted: yes`;
  if (outcome.amount) text += `\n  Amount: ${outcome.amount}`;
  if (outcome.note.trim()) text += `\n  Note: ${outcome.note.trim()}`;
  return text;
}
