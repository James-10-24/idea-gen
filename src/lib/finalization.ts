import { StartThisOutput } from "./types";
import { ResultSignal } from "../components/idea/SessionRecap";

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

interface FinalizationContext {
  completedCount: number;
  artifactsCount: number;
  hasSelectedChoice: boolean;
  resultSignal: ResultSignal | null;
  alreadyFinalized: boolean;
}

/**
 * Determines if the user has reached a state where a finalization step
 * should be offered to turn their work into something immediately usable.
 */
export function shouldFinalize(ctx: FinalizationContext): boolean {
  if (ctx.alreadyFinalized) return false;

  // 3+ steps completed
  if (ctx.completedCount >= 3) return true;

  // Selected a direction AND created at least 1 artifact
  if (ctx.hasSelectedChoice && ctx.artifactsCount >= 1) return true;

  // User reported "useful" or higher result signal
  if (ctx.resultSignal === "useful" || ctx.resultSignal === "money") return true;

  return false;
}

// ---------------------------------------------------------------------------
// Idea type detection (for tailored finalization)
// ---------------------------------------------------------------------------

type IdeaCategory = "content" | "business" | "tool" | "validation" | "finance" | "general";

export function detectIdeaCategory(ideaId: string): IdeaCategory {
  if (/explain|content|simple|viral/.test(ideaId)) return "content";
  if (/tool|build|product/.test(ideaId)) return "tool";
  if (/niche|validate|problem|steal/.test(ideaId)) return "validation";
  if (/outreach|message/.test(ideaId)) return "business";
  if (/rent|property|trade|subscription|money|hidden/.test(ideaId)) return "finance";
  return "general";
}

// ---------------------------------------------------------------------------
// Finalization step builder
// ---------------------------------------------------------------------------

const templates: Record<IdeaCategory, { instruction: string; template: string }> = {
  content: {
    instruction:
      "Turn your research into a ready-to-post piece. Fill in the template below — you should be able to copy and post this within 2 minutes.",
    template:
      "Platform: ________ (LinkedIn / Twitter / both)\n\nHook (first line that stops the scroll):\n________\n\nMain point (1-2 sentences):\n________\n\nExample or proof:\n________\n\nCTA (what you want readers to do):\n________",
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
