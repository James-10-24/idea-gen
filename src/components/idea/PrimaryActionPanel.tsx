"use client";

interface PrimaryActionPanelProps {
  onStart: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function PrimaryActionPanel({
  onStart,
  loading,
  disabled,
}: PrimaryActionPanelProps) {
  return (
    <div className="mt-6">
      <button
        onClick={onStart}
        disabled={disabled || loading}
        className="w-full rounded-xl bg-zinc-900 px-5 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Generating…
          </span>
        ) : (
          "Start this"
        )}
      </button>
      {!loading && (
        <p className="mt-2 text-center text-[12px] text-zinc-400">
          Get one concrete action you can do in under 10 minutes.
        </p>
      )}
    </div>
  );
}
