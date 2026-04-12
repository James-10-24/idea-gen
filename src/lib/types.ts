export type MoneyTag = "$" | "$$" | "$$$";
export type EffortTag = "Low" | "Medium" | "High";

export interface IdeaFeedItem {
  id: string;
  title: string;
  subtext: string;
  moneyTag: MoneyTag;
  effortTag: EffortTag;
}

export interface IdeaValidation {
  demand: string;
  competition: string;
  monetisation: string;
}

export interface StartThisOutput {
  stepTitle: string;
  instruction: string;
  template: string;
}

/** Passed to the API so the AI can build on previous work. */
export interface StepContext {
  stepNumber: number;
  previousSteps: Array<{ stepTitle: string; instruction: string }>;
}
