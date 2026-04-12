import OpenAI from "openai";
import { IdeaFeedItem, IdeaValidation, StartThisOutput, StepContext } from "./types";
import { getValidation, getStartThis } from "./mockIdeaDetails";

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = "gpt-4o-mini";
const MAX_TOKENS = 600;
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
  const cleaned = text.replace(/\n+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  const truncated = cleaned.slice(0, max);
  const lastPeriod = truncated.lastIndexOf(".");
  if (lastPeriod > max * 0.6) return truncated.slice(0, lastPeriod + 1);
  return truncated + "…";
}

/** Strip markdown formatting that would clutter the UI. */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // bold
    .replace(/\*(.*?)\*/g, "$1") // italic
    .replace(/^#+\s*/gm, "") // headings
    .replace(/^[-*]\s+/gm, "") // bullet prefixes
    .replace(/`(.*?)`/g, "$1") // inline code
    .trim();
}

/** Clean and constrain AI output for display. */
function sanitise(text: string, maxLen = 300): string {
  return trimToLength(stripMarkdown(text), maxLen);
}

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

const VALIDATION_SYSTEM = `You are a pragmatic startup advisor who has built and sold companies. Be concise, realistic, and slightly critical. Avoid hype. Write like a sharp operator texting a friend, not a blog post. No bullet points, no markdown. Plain sentences only.`;

function validationPrompt(idea: IdeaFeedItem): string {
  return `Analyze this idea for someone considering it as a side hustle or small product:

Title: "${idea.title}"
Description: "${idea.subtext}"

Return your analysis in EXACTLY this format (no other text, no labels repeated, no markdown):

DEMAND: <1-2 sentences on whether real demand exists. Cite specific signals like search trends, community activity, or market behaviour. Be honest if demand is uncertain.>

COMPETITION: <1-2 sentences on existing players and where the gap is. Name real competitors or categories if relevant. Be specific about what's saturated vs. what's open.>

MONETISATION: <1-2 sentences on realistic revenue paths. Include rough numbers or ranges. Be practical, not optimistic.>

Rules:
- No fluff, no filler phrases like "this could be great" or "there's potential"
- Sound like a real operator who has done this before
- If the idea is weak, say so honestly
- Each section MUST be 1-2 sentences only`;
}

const START_THIS_SYSTEM = `You are a highly practical execution coach guiding someone step-by-step through turning an idea into reality. Each step you generate must build logically on the previous steps. You give fill-in-the-blank worksheets — never abstract advice. Every output must be something the user can DO immediately. No markdown formatting, no bullet dashes or asterisks. Plain text only.`;

function startThisPrompt(idea: IdeaFeedItem, context?: StepContext): string {
  const stepNum = context?.stepNumber ?? 1;

  let previousContext = "";
  if (context?.previousSteps && context.previousSteps.length > 0) {
    const stepsSummary = context.previousSteps
      .map((s, i) => `Step ${i + 1} — "${s.stepTitle}": ${s.instruction}`)
      .join("\n");
    previousContext = `\nThe user has already completed these steps:\n${stepsSummary}\n\nYou MUST generate Step ${stepNum} — the NEXT logical action that builds on what they've already done. Do NOT repeat any previous step. Move the idea forward toward a concrete outcome (a product, a sale, a launched asset, etc.).\n`;
  }

  return `Given this idea:

Title: "${idea.title}"
Description: "${idea.subtext}"
${previousContext}
Generate Step ${stepNum} of a guided execution journey. This step must be completable in under 10 minutes.

Return in EXACTLY this format (no other text, no markdown):

STEP_TITLE: <A short action-oriented title for this step, 3-8 words, like "Write your landing page copy" or "Send 3 cold DMs">

INSTRUCTION: <2-4 sentences. Tell the user exactly what to do right now. Be specific — name websites, apps, or tools. Reference the template below. Every sentence must be a command, not advice.>

TEMPLATE: <A fill-in-the-blank worksheet using ________ for blanks. Include clear labels. At least 4 blanks. Use newlines to separate sections. Must feel like a real worksheet.>

Rules:
- STEP_TITLE must be a concrete action, not a vague concept
- INSTRUCTION must tell them exactly where to go and what to do — no "think about" or "consider"
- TEMPLATE must use ________ (8 underscores) for every blank
- Every step must produce a tangible artifact (a message, a list, a document, a post, a calculation)
- Do NOT repeat anything from previous steps
- Each step should move closer to a real outcome: revenue, a launched product, a real conversation with a customer
- Write for someone who has never done this before`;
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

function parseValidation(raw: string): IdeaValidation | null {
  const demandMatch = raw.match(/DEMAND:\s*([\s\S]+?)(?=\n\s*COMPETITION:|$)/);
  const compMatch = raw.match(/COMPETITION:\s*([\s\S]+?)(?=\n\s*MONETISATION:|$)/);
  const monMatch = raw.match(/MONETISATION:\s*([\s\S]+?)$/);

  if (!demandMatch || !compMatch || !monMatch) return null;

  const demand = sanitise(demandMatch[1]);
  const competition = sanitise(compMatch[1]);
  const monetisation = sanitise(monMatch[1]);

  // Basic quality check: each field should have substance
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

  const stepTitle = sanitise(titleMatch[1], 80);
  const instruction = sanitise(instrMatch[1], 500);
  // Templates keep newlines — only strip markdown, don't collapse lines
  const template = stripMarkdown(templateMatch[1]).slice(0, 1200);

  if (stepTitle.length < 5 || instruction.length < 15 || template.length < 30) {
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
  // Fallback to mock if AI is not configured
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
