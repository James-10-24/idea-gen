import { mockIdeas } from "@/lib/mockIdeas";
import FeedList from "@/components/feed/FeedList";
import OnboardingCard from "@/components/feed/OnboardingCard";
import ContinueCard from "@/components/feed/ContinueCard";
import ReturnCard from "@/components/feed/ReturnCard";
import LimitCard from "@/components/feed/LimitCard";

export default function HomePage() {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-[20px] font-bold tracking-[-0.02em] text-zinc-900">
          Idea → Income
        </h1>
        <p className="mt-0.5 text-[13px] text-zinc-400">
          Ship something useful in 10 minutes.
        </p>
      </div>
      <LimitCard />
      <ReturnCard />
      <ContinueCard />
      <OnboardingCard />
      <FeedList ideas={mockIdeas} />
    </>
  );
}
