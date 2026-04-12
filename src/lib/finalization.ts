import { StartThisOutput } from "./types";
import { ResultSignal } from "../components/idea/SessionRecap";

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

interface FinalizationContext {
  completedCount: number;
  nonCommitmentSteps: number;
  artifactsCount: number;
  hasSelectedChoice: boolean;
  resultSignal: ResultSignal | null;
  alreadyFinalized: boolean;
}

/**
 * Determines if the user has reached a state where a finalization step
 * should be offered to turn their work into something immediately usable.
 *
 * Requires at least 2 non-commitment steps to prevent premature finalization
 * when commitment steps inflate the completed count.
 */
export function shouldFinalize(ctx: FinalizationContext): boolean {
  if (ctx.alreadyFinalized) return false;

  // Must have at least 2 non-commitment steps before finalizing
  if (ctx.nonCommitmentSteps < 2) return false;

  // 3+ total steps completed (including commitment)
  if (ctx.completedCount >= 3) return true;

  // Selected a direction AND created at least 2 artifacts
  if (ctx.hasSelectedChoice && ctx.artifactsCount >= 2) return true;

  // User reported "useful" or higher result signal AND enough steps
  if (
    (ctx.resultSignal === "useful" || ctx.resultSignal === "money") &&
    ctx.nonCommitmentSteps >= 2
  )
    return true;

  return false;
}

// ---------------------------------------------------------------------------
// Idea type detection (for tailored finalization)
// ---------------------------------------------------------------------------

type IdeaCategory = "content" | "business" | "tool" | "validation" | "finance" | "general";

/**
 * Detect the idea category from its ID.
 *
 * IMPORTANT: Order matters — more specific patterns must come first.
 * "build-a-simple-tool" must match "tool" before "content" can match "simple".
 */
export function detectIdeaCategory(ideaId: string): IdeaCategory {
  // 1. Tool / build / product — check FIRST (contains "simple" which would false-match content)
  if (/tool|build|product/.test(ideaId)) return "tool";

  // 2. Business / outreach
  if (/outreach|message/.test(ideaId)) return "business";

  // 3. Finance / money
  if (/rent|property|trade|subscription|hidden-money/.test(ideaId)) return "finance";

  // 4. Validation / research
  if (/niche|validate|problem|steal/.test(ideaId)) return "validation";

  // 5. Content — last, uses broad terms that could match other categories
  if (/explain|content|viral|post|thread|lesson|opinion|insight/.test(ideaId)) return "content";

  // 6. Remaining finance catch (broader "money" keyword only after tool/build checked)
  if (/money/.test(ideaId)) return "finance";

  return "general";
}

// ---------------------------------------------------------------------------
// Finalization step builder
// ---------------------------------------------------------------------------

const templates: Record<IdeaCategory, { instruction: string; template: string }> = {
  content: {
    instruction:
      "Turn your work into a ready-to-post piece. Fill in below — you should be able to copy and post this within 2 minutes.",
    template:
      "Hook:\n________\n\nPost:\n________\n\nExample:\n________\n\nCTA:\n________\n\nClear in 5 seconds? ________ (yes / needs editing)",
  },
  business: {
    instruction:
      "Turn your work into a ready-to-send message or offer. Fill in below — this should be something you can send to a real person today.",
    template:
      "To: ________\nSubject: ________\n\nOpening (why you're reaching out):\n________\n\nValue prop (what's in it for them):\n________\n\nAsk (one clear next step):\n________",
  },
  tool: {
    instruction:
      "Turn your idea into a one-page spec you could hand to a developer or build yourself. Fill in below — this is your MVP blueprint.",
    template:
      "Tool name: ________\nOne-line pitch: ________\n\nCore feature (the ONE thing it does):\n________\n\nUser flow:\n1. User opens → ________\n2. User inputs → ________\n3. User gets → ________\n\nPrice: $________/month",
  },
  validation: {
    instruction:
      "Turn your findings into a clear go/no-go decision and one next action. Fill in below — this is your validation summary.",
    template:
      "Idea: ________\nTarget customer: ________\n\nDemand evidence: ________\nBiggest risk: ________\n\nVerdict: ________ (go / pivot / kill)\nNext action if go: ________",
  },
  finance: {
    instruction:
      "Turn your analysis into a clear decision with numbers. Fill in below — this should give you a definitive answer.",
    template:
      "Scenario: ________\nKey number: $________\n\nBest case: ________\nWorst case: ________\n\nDecision: ________\nFirst action: ________",
  },
  general: {
    instruction:
      "Turn everything you've built into one usable output. Fill in below — this should be something you can act on immediately.",
    template:
      "What I built: ________\nWho it's for: ________\n\nKey insight: ________\nReady-to-use output:\n________\n\nNext action: ________",
  },
};

export function buildFinalizationStep(
  ideaId: string,
  selectedChoice: string | null
): StartThisOutput {
  const category = detectIdeaCategory(ideaId);
  const t = templates[category];

  let instruction = t.instruction;
  if (selectedChoice) {
    instruction = `You chose "${selectedChoice}" as your focus. Now ${instruction.charAt(0).toLowerCase()}${instruction.slice(1)}`;
  }

  return {
    stepTitle: "Make it usable",
    instruction,
    template: t.template,
  };
}
