import { IdeaFeedItem } from "@/lib/types";
import { RECOMMENDED_IDEA_ID } from "@/lib/onboarding";
import { getFeedPreview } from "@/lib/feedPreviews";
import IdeaCard from "./IdeaCard";

export default function FeedList({ ideas }: { ideas: IdeaFeedItem[] }) {
  return (
    <div className="animate-stagger flex flex-col gap-2.5">
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          recommended={idea.id === RECOMMENDED_IDEA_ID}
          preview={getFeedPreview(idea.id)}
        />
      ))}
    </div>
  );
}
