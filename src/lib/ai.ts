import OpenAI from "openai";
import { IdeaFeedItem, IdeaValidation, StartThisOutput, StepContext, StepOutcome } from "./types";
import { getValidation, getStartThis } from "./mockIdeaDetails";

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = "gpt-4o-mini";
const MAX_TOKENS = 500;
const TIMEOUT_MS = 15_000;

function getClient(): OpenAI | null {
  if (!API_KEY) return null;
  return new OpenAI({ apiKey: API_KEY });
}

function isAIEnabled(): boolean {
  return !!API_KEY;
}

// ---------------------------------------------------------------------------
// Guardrails
// ---------------------------------------------------------------------------

/** Trim a string to max length, breaking at sentence boundary when possible. */
function trimToLength(text: string, max: number): string {
  const cleaned = text.replace(/\n{3,}/g, "\n\n").trim();
  if (cleaned.length <= max) return cleaned;
  const truncated = cleaned.slice(0, max);
  const lastPeriod = truncated.lastIndexOf(".");
  if (lastPeriod > max * 0.5) return truncated.slice(0, lastPeriod + 1);
  return truncated + "…";
}

/** Strip markdown formatting that would clutter the UI. */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/`(.*?)`/g, "$1")
    .trim();
}

/** Clean and constrain AI output for display. */
function sanitise(text: string, maxLen = 180): string {
  return trimToLength(stripMarkdown(text), maxLen);
}

/** Trim template to max N lines. */
function trimTemplate(text: string, maxLines = 8): string {
  const cleaned = stripMarkdown(text);
  const lines = cleaned.split("\n").filter((l) => l.trim() !== "");
  if (lines.length <= maxLines) return lines.join("\n");
  return lines.slice(0, maxLines).join("\n");
}

// ---------------------------------------------------------------------------
// Prompts — Validation
// ---------------------------------------------------------------------------

const VALIDATION_SYSTEM = `You are a pragmatic startup advisor who has built and sold companies. Be brutally concise. No hype. No filler. Write like a sharp operator texting a friend. Plain sentences only — no markdown, no bullets, no bold.

CRITICAL: Each section must be exactly 1-2 short sentences. Max 140 characters per section. If you go longer, the UI breaks.`;

function validationPrompt(idea: IdeaFeedItem): string {
  return `Analyze this idea:

Title: "${idea.title}"
Description: "${idea.subtext}"

Return in EXACTLY this format:

DEMAND: <1-2 short sentences, max 140 chars>
COMPETITION: <1-2 short sentences, max 140 chars>
MONETISATION: <1-2 short sentences, max 140 chars>

Here are examples of GOOD output at the right length and tone:

Example 1 (cold outreach tool):
DEMAND: Very high — freelancers and founders search "cold email template" constantly. The need is real and recurring.
COMPETITION: Crowded in email tools, but thin for instant mobile generators that give you one message you can copy and send.
MONETISATION: Freemium with daily limits, premium templates. $3–10/month subscription potential from regular users.

Example 2 (subscription audit):
DEMAND: Massive — average person wastes $200+/month on forgotten subscriptions. Personal finance content around this crushes.
COMPETITION: Truebill/Rocket Money exist but require bank linking. A quick self-audit with no login is a different play.
MONETISATION: Affiliate to cancellation services and budgeting apps. $1–5 per referral, strong conversion.

Example 3 (property ROI):
DEMAND: Strong — new investors constantly search for quick ROI checks. "Property ROI calculator" trends upward yearly.
COMPETITION: Most tools are spreadsheet-based or desktop-heavy. A fast, opinionated mobile tool has clear whitespace.
MONETISATION: Premium tiers, affiliate to mortgage brokers. $5–15 per conversion is realistic.

Rules:
- Match the tone and length of the examples above
- Be specific — name real competitors, cite real behaviours
- If the idea is weak, say so honestly
- No fluff phrases like "there's potential" or "this could work"
- Each section MUST be 1-2 sentences, max 140 characters`;
}

// ---------------------------------------------------------------------------
// Prompts — Start This
// ---------------------------------------------------------------------------

const START_THIS_SYSTEM = `You are a practical execution coach. You give fill-in-the-blank worksheets — never advice. Every output must be a specific ACTION the user does right now, not a thing to think about. No markdown. Plain text only.

CRITICAL CONSTRAINTS:
- TEMPLATE must be max 6-8 lines
- Each line must be short (under 60 chars)
- Use ________ (8 underscores) for blanks
- The step must feel like a smart shortcut, not busywork`;

function outcomeDirective(outcome?: StepOutcome): string {
  switch (outcome) {
    case "done":
      return "The user completed the previous step. Generate the next logical step that pushes forward.";
    case "partly":
      return "The user only partly finished. Help them complete it in a simpler way. Break it down further.";
    case "stuck":
      return "The user got stuck. Generate a smaller, easier unblock step — something doable in 5 minutes.";
    case "useful":
      return "The user got a useful result. Capitalise on momentum — push them further and faster.";
    default:
      return "Generate the next logical step.";
  }
}

function startThisPrompt(idea: IdeaFeedItem, context?: StepContext): string {
  const stepNum = context?.stepNumber ?? 1;

  let previousContext = "";
  if (context?.previousSteps && context.previousSteps.length > 0) {
    const stepsSummary = context.previousSteps
      .map((s, i) => `Step ${i + 1}: "${s.stepTitle}"`)
      .join("\n");
    const directive = outcomeDirective(context.lastOutcome);
    previousContext = `\nPrevious steps completed:\n${stepsSummary}\n\n${directive}\n\nGenerate Step ${stepNum}. Do NOT repeat previous steps.\n`;

    // If user committed to a specific choice, force the AI to build on it
    if (context.selectedChoice) {
      previousContext += `\nIMPORTANT: The user has committed to this specific direction: "${context.selectedChoice}"\nYour next step MUST build specifically on this selection. Do not generate generic advice — make it about "${context.selectedChoice}" specifically.\n`;
    }
  }

  return `Idea: "${idea.title}" — ${idea.subtext}
${previousContext}
Generate Step ${stepNum}. Must be completable in under 10 minutes.

Return in EXACTLY this format:

STEP_TITLE: <3-7 word action title>
INSTRUCTION: <2-3 sentences. Specific commands — name tools, sites, actions. No "consider" or "think about".>
TEMPLATE: <Fill-in-the-blank worksheet. MAX 6-8 lines. Short lines. Use ________ for blanks.>

GOOD examples at the right quality:

Example 1 (validate idea):
STEP_TITLE: Run a 3-question validation check
INSTRUCTION: Write your idea in one sentence. Search Google Trends, Reddit, and Twitter for each answer below. 3 yeses = pursue. Fewer = pivot.
TEMPLATE:
Idea: ________
1. Search volume growing? → YES / NO
2. Real complaints on Reddit? → YES / NO
3. People paying for solutions? → YES / NO
Score: ________/3
Verdict: ________ (pursue / pivot / kill)

Example 2 (cold outreach):
STEP_TITLE: Write one personalised outreach message
INSTRUCTION: Open LinkedIn. Find one person you want to reach. Read their last 3 posts. Fill in the template using something specific they said. No pitch — ask one genuine question.
TEMPLATE:
To: ________
Their recent post about: ________
Message: Hi ________, I saw your post about ________. Quick question — ________?
Why this works: references their content, zero pitch.

Example 3 (subscription audit):
STEP_TITLE: Audit your subscriptions
INSTRUCTION: Open your email. Search "subscription confirmation" and "recurring payment". List every active subscription. Cancel at least one before closing this page.
TEMPLATE:
1. ________ → $________/mo → Last used: ________
2. ________ → $________/mo → Last used: ________
3. ________ → $________/mo → Last used: ________
Cancel now: ________ (saves $________/mo)

Rules:
- Step must be SPECIFIC to this idea — not generic
- Must feel like a smart shortcut, not busywork
- Must produce a tangible artifact (a message, list, document, calculation)
- Template MUST be max 6-8 lines, short and scannable
- No "create a survey" or "do some research" — be sharper than that`;
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

function parseValidation(raw: string): IdeaValidation | null {
  const demandMatch = raw.match(/DEMAND:\s*([\s\S]+?)(?=\n\s*COMPETITION:|$)/);
  const compMatch = raw.match(/COMPETITION:\s*([\s\S]+?)(?=\n\s*MONETISATION:|$)/);
  const monMatch = raw.match(/MONETISATION:\s*([\s\S]+?)$/);

  if (!demandMatch || !compMatch || !monMatch) return null;

  const demand = sanitise(demandMatch[1], 180);
  const competition = sanitise(compMatch[1], 180);
  const monetisation = sanitise(monMatch[1], 180);

  if (demand.length < 20 || competition.length < 20 || monetisation.length < 20) {
    return null;
  }

  return { demand, competition, monetisation };
}

function parseStartThis(raw: string): StartThisOutput | null {
  const titleMatch = raw.match(/STEP_TITLE:\s*([\s\S]+?)(?=\n\s*INSTRUCTION:|$)/);
  const instrMatch = raw.match(/INSTRUCTION:\s*([\s\S]+?)(?=\n\s*TEMPLATE:|$)/);
  const templateMatch = raw.match(/TEMPLATE:\s*([\s\S]+?)$/);

  if (!titleMatch || !instrMatch || !templateMatch) return null;

  const stepTitle = sanitise(titleMatch[1], 60);
  const instruction = sanitise(instrMatch[1], 300);
  const template = trimTemplate(templateMatch[1], 8);

  if (stepTitle.length < 5 || instruction.length < 15 || template.length < 20) {
    return null;
  }

  return { stepTitle, instruction, template };
}

// ---------------------------------------------------------------------------
// API call with timeout
// ---------------------------------------------------------------------------

async function callLLM(
  system: string,
  userPrompt: string
): Promise<string> {
  const client = getClient();
  if (!client) throw new Error("AI not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await client.chat.completions.create(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPrompt },
        ],
      },
      { signal: controller.signal }
    );

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("Empty response from AI");
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function generateValidation(
  idea: IdeaFeedItem
): Promise<IdeaValidation> {
  if (!isAIEnabled()) {
    return getValidation(idea.id);
  }

  try {
    const raw = await callLLM(VALIDATION_SYSTEM, validationPrompt(idea));
    const parsed = parseValidation(raw);

    if (!parsed) {
      console.warn(`[ai] Validation parse failed for ${idea.id}, using mock`);
      return getValidation(idea.id);
    }

    return parsed;
  } catch (err) {
    console.error(`[ai] Validation error for ${idea.id}:`, err);
    return getValidation(idea.id);
  }
}

export async function generateStartThis(
  idea: IdeaFeedItem,
  context?: StepContext
): Promise<StartThisOutput> {
  const stepNum = context?.stepNumber ?? 1;

  if (!isAIEnabled()) {
    return getStartThis(idea.id, stepNum);
  }

  try {
    const raw = await callLLM(START_THIS_SYSTEM, startThisPrompt(idea, context));
    const parsed = parseStartThis(raw);

    if (!parsed) {
      console.warn(`[ai] StartThis parse failed for ${idea.id} step ${stepNum}, using mock`);
      return getStartThis(idea.id, stepNum);
    }

    return parsed;
  } catch (err) {
    console.error(`[ai] StartThis error for ${idea.id} step ${stepNum}:`, err);
    return getStartThis(idea.id, stepNum);
  }
}
