export default function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)]"
        >
          <div className="h-[18px] w-4/5 rounded bg-zinc-100" />
          <div className="mt-1.5 h-[14px] w-3/5 rounded bg-zinc-50" />
          <div className="mt-2.5 flex gap-1.5">
            <div className="h-5 w-9 rounded-full bg-zinc-50" />
            <div className="h-5 w-12 rounded-full bg-zinc-50" />
          </div>
        </div>
      ))}
    </div>
  );
}
