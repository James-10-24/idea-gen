interface ValidationSectionProps {
  label: string;
  icon: string;
  content: string | null;
  loadingText: string;
}

export default function ValidationSection({
  label,
  icon,
  content,
  loadingText,
}: ValidationSectionProps) {
  return (
    <div className="rounded-xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100">
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <h3 className="text-[13px] font-semibold text-zinc-900">{label}</h3>
      </div>
      {content ? (
        <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">
          {content}
        </p>
      ) : (
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-500" />
            <span className="text-[12px] text-zinc-400">{loadingText}</span>
          </div>
          <div className="h-3 w-full animate-pulse rounded bg-zinc-50" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-50" />
        </div>
      )}
    </div>
  );
}
