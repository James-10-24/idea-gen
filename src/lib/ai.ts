import OpenAI from "openai";
import { IdeaFeedItem, IdeaValidation, StartThisOutput } from "./types";
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

const START_THIS_SYSTEM = `You are a highly practical execution coach. You give guided, fill-in-the-blank playbooks — never abstract advice. Every output must be something the user can DO immediately, not THINK about. Write like you're handing someone a worksheet at a workshop. No markdown formatting, no bullet points with dashes or asterisks. Plain text only. Use numbered lists where needed.`;

function startThisPrompt(idea: IdeaFeedItem): string {
  return `Given this idea:

Title: "${idea.title}"
Description: "${idea.subtext}"

Generate a guided execution playbook with exactly 3 sections. The user should be able to act on this in under 10 minutes without thinking.

Return in EXACTLY this format (no other text, no markdown, no bullet dashes):

FIRST_STEP: <1-2 sentences. A specific setup instruction — tell them exactly what to open, go to, or pull up right now. Must be a DOING task, not a thinking task.>

DO_THIS_NOW: <2-3 sentences. The core action. Tell them exactly what to fill in, write down, calculate, or create. Be direct and commanding. Reference the template below.>

TEMPLATE: <A fill-in-the-blank template using ________ for blanks. Include clear labels for each blank. Make it structured so the user just fills in their specifics. Use newlines to separate sections. This should feel like a worksheet they complete, not text they read.>

Rules:
- FIRST_STEP must be a physical action (open an app, go to a website, pull up a document) — never "think about" or "consider"
- DO_THIS_NOW must reference the template and tell them to fill it in
- TEMPLATE must use ________ (8 underscores) for every blank
- TEMPLATE must have at least 4 blanks to fill in
- TEMPLATE must feel like a real worksheet, not a paragraph with gaps
- No vague advice anywhere — every sentence must tell them to DO something
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
  const firstStepMatch = raw.match(/FIRST_STEP:\s*([\s\S]+?)(?=\n\s*DO_THIS_NOW:|$)/);
  const doThisMatch = raw.match(/DO_THIS_NOW:\s*([\s\S]+?)(?=\n\s*TEMPLATE:|$)/);
  const templateMatch = raw.match(/TEMPLATE:\s*([\s\S]+?)$/);

  if (!firstStepMatch || !doThisMatch || !templateMatch) return null;

  const firstStep = sanitise(firstStepMatch[1], 300);
  const doThisNow = sanitise(doThisMatch[1], 400);
  // Templates keep newlines — only strip markdown, don't collapse lines
  const template = stripMarkdown(templateMatch[1]).slice(0, 1200);

  if (firstStep.length < 15 || doThisNow.length < 15 || template.length < 30) {
    return null;
  }

  return { firstStep, doThisNow, template };
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
  idea: IdeaFeedItem
): Promise<StartThisOutput> {
  if (!isAIEnabled()) {
    return getStartThis(idea.id);
  }

  try {
    const raw = await callLLM(START_THIS_SYSTEM, startThisPrompt(idea));
    const parsed = parseStartThis(raw);

    if (!parsed) {
      console.warn(`[ai] StartThis parse failed for ${idea.id}, using mock`);
      return getStartThis(idea.id);
    }

    return parsed;
  } catch (err) {
    console.error(`[ai] StartThis error for ${idea.id}:`, err);
    return getStartThis(idea.id);
  }
}
