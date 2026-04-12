import { IdeaFeedItem } from "./types";
import { loadMetrics, AllMetrics, IdeaMetrics } from "./metrics";
import { getFeedPriority } from "./feedPreviews";
import { loadSavedSession } from "./savedSession";
import { PriorityRating } from "./priority";

// ---------------------------------------------------------------------------
// Score inputs
// ---------------------------------------------------------------------------

export interface IdeaScore {
  id: string;
  base: number; // original index position (lower = higher in curated order)
  priorityBoost: number;
  engagementBoost: number;
  recencyBoost: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Weights
// ---------------------------------------------------------------------------

const PRIORITY_WEIGHTS: Record<PriorityRating, number> = {
  promising: 3,
  "worth-testing": 1,
  weak: -1,
};

const ENGAGEMENT_WEIGHTS = {
  clicks: 0.5,
  starts: 3,
  step2Plus: 5,
};

const RECENCY_BOOST = 2;

// Minimum total engagement across ALL ideas before ranking activates
const MIN_TOTAL_ENGAGEMENT = 3;

// ---------------------------------------------------------------------------
// Ranking
// ---------------------------------------------------------------------------

function hasEnoughData(allMetrics: AllMetrics): boolean {
  let total = 0;
  for (const m of Object.values(allMetrics)) {
    total += m.clicks + m.starts + m.step2Plus;
  }
  return total >= MIN_TOTAL_ENGAGEMENT;
}

function getRecencyId(): string | null {
  if (typeof window === "undefined") return null;
  const saved = loadSavedSession();
  return saved?.ideaId ?? null;
}

export function rankIdeas(ideas: IdeaFeedItem[]): {
  ranked: IdeaFeedItem[];
  scores: IdeaScore[];
  isRanked: boolean;
} {
  const allMetrics = loadMetrics();

  // First-run: keep curated order
  if (!hasEnoughData(allMetrics)) {
    return {
      ranked: ideas,
      scores: ideas.map((idea, i) => ({
        id: idea.id,
        base: i,
        priorityBoost: 0,
        engagementBoost: 0,
        recencyBoost: 0,
        total: 0,
      })),
      isRanked: false,
    };
  }

  const recencyId = getRecencyId();

  // Idea categories for similarity (simple tag from id)
  const getCategory = (id: string): string => {
    if (id.includes("property") || id.includes("rent") || id.includes("trade"))
      return "finance";
    if (id.includes("outreach") || id.includes("explain") || id.includes("content"))
      return "content";
    if (id.includes("niche") || id.includes("validate") || id.includes("problem") || id.includes("steal"))
      return "validation";
    if (id.includes("tool") || id.includes("product") || id.includes("build"))
      return "building";
    return "other";
  };

  const recencyCategory = recencyId ? getCategory(recencyId) : null;

  const scores: IdeaScore[] = ideas.map((idea, i) => {
    const m: IdeaMetrics = allMetrics[idea.id] ?? {
      impressions: 0,
      clicks: 0,
      starts: 0,
      step2Plus: 0,
    };

    // Priority boost (from static feed previews)
    const feedPriority = getFeedPriority(idea.id);
    const priorityBoost = feedPriority
      ? PRIORITY_WEIGHTS[feedPriority]
      : 0;

    // Engagement boost
    const engagementBoost =
      m.clicks * ENGAGEMENT_WEIGHTS.clicks +
      m.starts * ENGAGEMENT_WEIGHTS.starts +
      m.step2Plus * ENGAGEMENT_WEIGHTS.step2Plus;

    // Recency/similarity boost
    let recencyBoost = 0;
    if (recencyCategory && idea.id !== recencyId) {
      const cat = getCategory(idea.id);
      if (cat === recencyCategory) {
        recencyBoost = RECENCY_BOOST;
      }
    }

    // Base position tiebreaker (curated order matters)
    const base = ideas.length - i; // higher = earlier in curated list

    const total =
      base * 0.3 + // slight curated-order influence
      priorityBoost +
      engagementBoost +
      recencyBoost;

    return {
      id: idea.id,
      base: i,
      priorityBoost,
      engagementBoost,
      recencyBoost,
      total,
    };
  });

  // Sort by total descending
  const sorted = [...scores].sort((a, b) => b.total - a.total);
  const idOrder = sorted.map((s) => s.id);
  const ranked = idOrder.map(
    (id) => ideas.find((i) => i.id === id)!
  );

  return { ranked, scores: sorted, isRanked: true };
}

// ---------------------------------------------------------------------------
// Boost labels (top 1-2 ideas that moved up significantly)
// ---------------------------------------------------------------------------

export function getBoostLabels(
  scores: IdeaScore[],
  isRanked: boolean
): Record<string, string> {
  if (!isRanked) return {};

  const labels: Record<string, string> = {};
  let labelCount = 0;

  for (const s of scores) {
    if (labelCount >= 2) break;
    // Only label ideas that moved up from their curated position
    const currentPos = scores.indexOf(s);
    if (s.base > currentPos + 2 && s.total > 3) {
      // Moved up significantly
      if (s.engagementBoost > 2) {
        labels[s.id] = "Picked up where you left off";
        labelCount++;
      } else if (s.recencyBoost > 0) {
        labels[s.id] = "Similar to your last idea";
        labelCount++;
      } else if (s.priorityBoost >= 3) {
        labels[s.id] = "Worth exploring";
        labelCount++;
      }
    }
  }

  return labels;
}
