/** Static goal map — one motivating goal per idea. */
const goalMap: Record<string, string> = {
  "rent-affordability-reality-check":
    "Know your real rent budget — based on facts, not guesses.",
  "property-deal-roi-quick-analyzer":
    "Evaluate your first property deal with confidence.",
  "cold-outreach-message-generator":
    "Send outreach that actually gets replies.",
  "subscription-leak-finder":
    "Cut at least $50/month in wasted subscriptions.",
  "explain-anything-simply":
    "Publish your first piece of authority content.",
  "underserved-niche-finder":
    "Find one underserved niche with real demand.",
  "problem-to-business-idea-converter":
    "Turn a real frustration into a structured business idea.",
  "would-you-take-this-trade":
    "Build your trade analysis muscle without risking capital.",
  "validate-before-you-waste-time":
    "Get a clear go/no-go signal before building anything.",
  "build-a-simple-tool":
    "Identify one micro-tool idea you can launch this month.",
  "steal-proven-business-ideas-smarter":
    "Find a proven model and design your improved version.",
  "turn-skills-into-digital-product":
    "Outline a digital product you can sell this week.",
  "hidden-money-in-your-industry":
    "Uncover 3 monetisable inefficiencies in your industry.",
};

const defaultGoal = "Complete the steps below to move this idea forward.";

export function getGoal(id: string): string {
  return goalMap[id] ?? defaultGoal;
}
