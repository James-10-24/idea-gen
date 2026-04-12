import { MoneyTag, EffortTag } from "./types";

export function moneyTagColor(tag: MoneyTag): string {
  switch (tag) {
    case "$":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/10";
    case "$$":
      return "bg-amber-50 text-amber-700 ring-amber-600/10";
    case "$$$":
      return "bg-violet-50 text-violet-700 ring-violet-600/10";
  }
}

export function effortTagColor(tag: EffortTag): string {
  switch (tag) {
    case "Low":
      return "bg-sky-50 text-sky-700 ring-sky-600/10";
    case "Medium":
      return "bg-orange-50 text-orange-700 ring-orange-600/10";
    case "High":
      return "bg-rose-50 text-rose-700 ring-rose-600/10";
  }
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
