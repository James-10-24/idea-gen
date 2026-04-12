interface GoalBannerProps {
  goal: string;
  completedCount: number;
  totalSteps: number;
}

export default function GoalBanner({
  goal,
  completedCount,
  totalSteps,
}: GoalBannerProps) {
  const hasSteps = totalSteps > 0;
  const allDone = hasSteps && completedCount === totalSteps;

  return (
    <div className="mt-5 animate-in-fast rounded-xl bg-zinc-900 px-4 py-3">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 text-[14px]">{allDone ? "🎉" : "🎯"}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium leading-[1.4] text-white">
            {goal}
          </p>
          {hasSteps && (
            <div className="mt-2 flex items-center gap-2.5">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.round((completedCount / totalSteps) * 100)}%`,
                  }}
                />
              </div>
              <span className="shrink-0 text-[11px] tabular-nums text-white/50">
                {completedCount}/{totalSteps}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
