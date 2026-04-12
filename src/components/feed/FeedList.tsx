import { IdeaFeedItem } from "@/lib/types";
import IdeaCard from "./IdeaCard";

export default function FeedList({ ideas }: { ideas: IdeaFeedItem[] }) {
  return (
    <div className="animate-stagger flex flex-col gap-2.5">
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}
