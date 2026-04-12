import { mockIdeas } from "@/lib/mockIdeas";
import FeedList from "@/components/feed/FeedList";
import OnboardingCard from "@/components/feed/OnboardingCard";
import ContinueCard from "@/components/feed/ContinueCard";

export default function HomePage() {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-[20px] font-bold tracking-[-0.02em] text-zinc-900">
          Idea → Income
        </h1>
        <p className="mt-0.5 text-[13px] text-zinc-400">
          Turn free time into ideas you can act on.
        </p>
      </div>
      <ContinueCard />
      <OnboardingCard />
      <FeedList ideas={mockIdeas} />
    </>
  );
}
