"use client";

import { StepOutcome } from "@/lib/types";

const outcomes: Array<{ value: StepOutcome; label: string; icon: string }> = [
  { value: "done", label: "Done", icon: "✓" },
  { value: "partly", label: "Partly done", icon: "◐" },
  { value: "stuck", label: "Stuck", icon: "✕" },
  { value: "useful", label: "Useful result", icon: "★" },
];

interface OutcomeSelectorProps {
  selected: StepOutcome | null;
  onSelect: (outcome: StepOutcome) => void;
}

export default function OutcomeSelector({
  selected,
  onSelect,
}: OutcomeSelectorProps) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-300">
        How did it go?
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {outcomes.map((o) => {
          const isActive = selected === o.value;
          return (
            <button
              key={o.value}
              onClick={() => onSelect(o.value)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 active:scale-[0.97] ${
                isActive
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              <span className={`text-[12px] ${isActive ? "opacity-100" : "opacity-50"}`}>
                {o.icon}
              </span>
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
