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
  action: string;
  output: string;
}
