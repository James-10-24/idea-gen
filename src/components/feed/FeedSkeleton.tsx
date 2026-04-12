export default function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100"
        >
          <div className="h-4 w-3/4 rounded-md bg-zinc-100" />
          <div className="mt-2 h-3 w-1/2 rounded-md bg-zinc-100" />
          <div className="mt-3 flex gap-1.5">
            <div className="h-5 w-10 rounded-full bg-zinc-100" />
            <div className="h-5 w-14 rounded-full bg-zinc-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
