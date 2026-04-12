export default function ValidationSkeleton() {
  return (
    <div className="mt-6">
      <div className="mb-3 h-3 w-28 animate-pulse rounded bg-zinc-100" />
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100"
          >
            <div className="h-3 w-24 rounded bg-zinc-100" />
            <div className="mt-3 space-y-1.5">
              <div className="h-3 w-full rounded bg-zinc-50" />
              <div className="h-3 w-2/3 rounded bg-zinc-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
