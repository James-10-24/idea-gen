"use client";

import { useState, useEffect } from "react";
import { IdeaFeedItem } from "@/lib/types";
import { RECOMMENDED_IDEA_ID } from "@/lib/onboarding";
import { getFeedPreview, getFeedPriority } from "@/lib/feedPreviews";
import { rankIdeas, getBoostLabels, IdeaScore } from "@/lib/feedRanking";
import IdeaCard from "./IdeaCard";

export default function FeedList({ ideas }: { ideas: IdeaFeedItem[] }) {
  const [rankedIdeas, setRankedIdeas] = useState(ideas);
  const [boostLabels, setBoostLabels] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<IdeaScore[]>([]);
  const [isRanked, setIsRanked] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const { ranked, scores: s, isRanked: r } = rankIdeas(ideas);
    setRankedIdeas(ranked);
    setScores(s);
    setIsRanked(r);
    setBoostLabels(getBoostLabels(s, r));
  }, [ideas]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <>
      <div className="animate-stagger flex flex-col gap-2.5">
        {rankedIdeas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            recommended={idea.id === RECOMMENDED_IDEA_ID}
            preview={getFeedPreview(idea.id)}
            priority={getFeedPriority(idea.id)}
            boostLabel={boostLabels[idea.id]}
          />
        ))}
      </div>

      {/* Feed ranking debug (dev only) */}
      {isDev && (
        <div className="mt-6">
          <button
            onClick={() => setShowDebug((v) => !v)}
            className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-300 transition-colors hover:text-zinc-500"
          >
            <span>{showDebug ? "▼" : "▶"}</span>
            feed ranking {isRanked ? "(active)" : "(curated)"}
          </button>
          {showDebug && (
            <div className="mt-2 overflow-x-auto rounded-lg bg-zinc-900 p-3">
              <table className="w-full font-mono text-[10px] text-zinc-400">
                <thead>
                  <tr className="text-zinc-500">
                    <th className="pb-1 text-left font-medium">#</th>
                    <th className="pb-1 text-left font-medium">idea</th>
                    <th className="pb-1 text-right font-medium">pri</th>
                    <th className="pb-1 text-right font-medium">eng</th>
                    <th className="pb-1 text-right font-medium">rec</th>
                    <th className="pb-1 text-right font-medium">total</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((s, i) => (
                    <tr key={s.id}>
                      <td className="py-0.5 pr-2 text-zinc-500">{i + 1}</td>
                      <td className="max-w-[120px] truncate py-0.5 pr-2">
                        {s.id.substring(0, 20)}
                      </td>
                      <td className="py-0.5 text-right">
                        {s.priorityBoost > 0 ? `+${s.priorityBoost}` : s.priorityBoost}
                      </td>
                      <td className="py-0.5 text-right">
                        {s.engagementBoost.toFixed(1)}
                      </td>
                      <td className="py-0.5 text-right">
                        {s.recencyBoost > 0 ? `+${s.recencyBoost}` : "0"}
                      </td>
                      <td className="py-0.5 text-right font-semibold text-zinc-300">
                        {s.total.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
