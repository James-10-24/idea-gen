import { PriorityResult, priorityColor, priorityDot } from "@/lib/priority";

interface PriorityBadgeProps {
  priority: PriorityResult;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)]">
      <span
        className={`mt-0.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${priorityColor(priority.rating)}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${priorityDot(priority.rating)}`} />
        {priority.label}
      </span>
      <p className="flex-1 text-[12px] leading-[1.5] text-zinc-400">
        {priority.explanation}
      </p>
    </div>
  );
}
