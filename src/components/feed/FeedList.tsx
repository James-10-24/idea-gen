import { IdeaFeedItem } from "@/lib/types";
import IdeaCard from "./IdeaCard";

export default function FeedList({ ideas }: { ideas: IdeaFeedItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}
