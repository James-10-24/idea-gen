"use client";

interface CompletedStep {
  stepTitle: string;
  done: boolean;
}

interface ProgressLogProps {
  steps: CompletedStep[];
  onToggleDone: (index: number) => void;
}

export default function ProgressLog({ steps, onToggleDone }: ProgressLogProps) {
  if (steps.length === 0) return null;

  return (
    <div className="mt-5">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-300">
        Progress
      </h3>
      <div className="space-y-1">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => onToggleDone(i)}
            className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-zinc-100/60 active:scale-[0.99]"
          >
            {/* Checkbox */}
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all duration-200 ${
                step.done
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-zinc-200 bg-white group-hover:border-zinc-300"
              }`}
            >
              {step.done && (
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3.5 8.5L6.5 11.5L12.5 4.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>

            {/* Step info */}
            <div className="min-w-0 flex-1">
              <span
                className={`text-[13px] font-medium leading-tight transition-colors ${
                  step.done ? "text-zinc-400 line-through" : "text-zinc-700"
                }`}
              >
                {step.stepTitle}
              </span>
            </div>

            {/* Step number */}
            <span className="shrink-0 text-[11px] tabular-nums text-zinc-300">
              {i + 1}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
