"use client";

interface ResumeBannerProps {
  completedCount: number;
  currentStepTitle: string | null;
  savedAgo: string;
  onStartFresh: () => void;
}

export default function ResumeBanner({
  completedCount,
  currentStepTitle,
  savedAgo,
  onStartFresh,
}: ResumeBannerProps) {
  return (
    <div className="mt-4 animate-in-fast overflow-hidden rounded-2xl bg-zinc-900 px-4 py-3.5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[14px] font-semibold text-white">Welcome back</p>
          <p className="mt-0.5 text-[12px] leading-[1.5] text-zinc-400">
            You completed {completedCount} {completedCount === 1 ? "step" : "steps"} and saved your progress
            <span className="text-zinc-500"> · {savedAgo}</span>
          </p>
        </div>
      </div>
      {currentStepTitle && (
        <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
          <span className="text-[12px] text-zinc-500">Next up:</span>
          <span className="text-[12px] font-medium text-white">
            {currentStepTitle}
          </span>
        </div>
      )}
      <button
        onClick={onStartFresh}
        className="mt-2.5 text-[11px] text-zinc-500 transition-colors hover:text-zinc-300"
      >
        Start fresh instead
      </button>
    </div>
  );
}
