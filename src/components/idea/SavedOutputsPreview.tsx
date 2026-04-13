"use client";

import { Artifact } from "./BuildBoard";

interface SavedOutputsPreviewProps {
  artifacts: Artifact[];
}

/**
 * Shows a locked preview of the user's past outputs.
 * Teases persistence as a Pro feature.
 */
export default function SavedOutputsPreview({ artifacts }: SavedOutputsPreviewProps) {
  if (artifacts.length === 0) return null;

  return (
    <div className="mt-4 animate-in-fast overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-0">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-300">
          Your outputs ({artifacts.length})
        </h4>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
          Saved locally
        </span>
      </div>

      {/* Output list with fade overlay */}
      <div className="relative px-4 pt-2.5 pb-3">
        <ul className="space-y-1.5">
          {artifacts.slice(0, 3).map((a, i) => (
            <li
              key={i}
              className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white text-[10px] shadow-sm">
                {a.outcome === "done" || a.outcome === "useful"
                  ? "✓"
                  : "·"}
              </span>
              <span className="truncate text-[12px] text-zinc-500">
                Step {a.stepNumber}: {a.stepTitle}
              </span>
            </li>
          ))}
        </ul>

        {/* Locked overlay for Pro tease */}
        <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-200 px-3 py-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            className="text-zinc-300"
          >
            <rect
              x="3"
              y="7"
              width="10"
              height="7"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M5 7V5a3 3 0 016 0v2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[11px] text-zinc-400">
            Unlock Pro to access your outputs anytime
          </span>
        </div>
      </div>
    </div>
  );
}
