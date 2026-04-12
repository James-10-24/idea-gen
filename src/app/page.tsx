import { mockIdeas } from "@/lib/mockIdeas";
import FeedList from "@/components/feed/FeedList";

export default function HomePage() {
  return (
    <>
      <div className="mb-5">
        <h1 className="text-[22px] font-bold tracking-tight text-zinc-900">
          Idea → Income
        </h1>
        <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-400">
          Turn free time into ideas you can act on.
        </p>
      </div>
      <FeedList ideas={mockIdeas} />
    </>
  );
}
