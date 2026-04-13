/**
 * Pre-filled example values for Step 1 templates.
 *
 * Each entry is an array of strings matching the blank index order
 * in the corresponding template from mockIdeaDetails.ts.
 * These give first-time users immediate value — they see a
 * complete, realistic draft they can use as-is or edit.
 */

const prefillMap: Record<string, string[]> = {
  "rent-affordability-reality-check": [
    "4,200",
    "Rent", "1,400",
    "Car payment", "380",
    "Student loan", "290",
    "Groceries", "450",
    "Insurance", "180",
    "2,700",
    "4,200", "2,700", "560",
    "560",
  ],
  "property-deal-roi-quick-analyzer": [
    "42 Maple St, Austin TX",
    "320,000",
    "2,400",
    "4,800",
    "1,600",
    "2,400", "28,800",
    "4,800", "1,600", "6,400",
    "28,800", "6,400", "22,400",
    "22,400", "320,000", "7.0",
    "worth exploring",
  ],
  "cold-outreach-message-generator": [
    "Sarah Chen",
    "VP Product at Stripe",
    "API backwards compatibility challenges",
    "Sarah",
    "API design patterns",
    "backwards compatibility being underestimated",
    "how do you handle that with third-party integrations?",
  ],
  "subscription-leak-finder": [
    "Netflix", "15.49", "2 weeks ago",
    "Headspace", "12.99", "3 months ago",
    "Adobe CC", "54.99", "last week",
    "Dropbox Plus", "11.99", "6 months ago",
    "NYT Digital", "4.25", "last month",
    "Headspace", "12.99",
    "Dropbox Plus", "11.99",
    "24.98",
  ],
  "explain-anything-simply": [
    "How compound interest works",
    "Your money earns interest, and then that interest earns interest too.",
    "It's like a snowball rolling downhill — small at first, but it grows faster the longer it rolls.",
    "Starting 5 years earlier can mean tens of thousands more, even with the same monthly amount.",
    "compound interest",
    "compound interest",
    "LinkedIn",
  ],
  "underserved-niche-finder": [
    "Personal finance",
    "personal finance",
    "Budget tracking apps are too complex for beginners",
    "Mint, YNAB",
    "Too many features, steep learning curve, assumes financial literacy",
    "Freelancers can't easily separate business and personal expenses",
    "Spreadsheets, manual tracking",
    "Time-consuming, error-prone, no automation",
    "No simple tool to split shared household expenses fairly",
    "Splitwise (only for friends), spreadsheets",
    "Splitwise doesn't handle recurring bills or income differences",
    "1",
  ],
  "problem-to-business-idea-converter": [
    "Finding good meeting times across time zones",
    "Going back and forth in Slack for 10 minutes",
    "it takes too long",
    "every round trip wastes 5 min for everyone",
    "the final time is always a compromise nobody likes",
    "Show each person's ideal windows instantly",
    "Auto-suggest the option that costs the least total disruption",
    "Remote teams, freelancers with international clients",
    "tool", "distributed teams", "find the best meeting time", "endless back-and-forth",
  ],
  "would-you-take-this-trade": [
    "AAPL",
    "Jan 2024", "Mar 2024",
    "up",
    "182",
    "higher lows forming",
    "long",
    "185",
    "179",
    "Trend continuation with support holding",
    "Rallied to 195 before pulling back",
    "Should have noted the resistance at 190",
    "Set partial take-profit at obvious resistance levels",
  ],
  "validate-before-you-waste-time": [
    "Meal prep delivery for remote workers",
    "Busy remote workers who skip lunch",
    "meal prep delivery",
    "growing",
    "meal prep remote workers",
    "3 posts with 200+ upvotes about skipping lunch",
    "Factor, HelloFresh, Thistle",
    "30-80/week",
  ],
  "build-a-simple-tool": [
    "Tracking freelance invoices and payment status",
    "Weekly",
    "Google Sheets",
    "20",
    "invoice tracker freelancer",
    "Bonsai", "19", "Too many features, slow, aimed at agencies",
    "Wave", "0", "No recurring invoice reminders, clunky mobile",
    "One-screen dashboard: who owes me, how much, how late",
    "12",
  ],
  "steal-proven-business-ideas-smarter": [
    "Carrd",
    "35,000",
    "Simple one-page website builder",
    "No multi-page support", "Reddit r/webdev",
    "Limited form customisation", "Product Hunt reviews",
    "Templates look dated", "Twitter feedback",
    "Add 2-3 page support for simple sites",
    "Drag-and-drop form builder",
    "Fresh, modern templates updated quarterly",
    "Freelancers and solopreneurs who outgrow Carrd",
    "9",
  ],
  "turn-skills-into-digital-product": [
    "Setting up email automations",
    "Writing better job application emails",
    "Organising Notion workspaces",
    "1",
    "set up your first email automation in 30 minutes",
    "PDF guide + template pack",
    "Solopreneurs and small business owners",
    "Why email automation matters",
    "Choosing the right tool (free options)",
    "Setting up your first welcome sequence",
    "Writing emails that get opened",
    "Automating follow-ups and tags",
    "19",
    "Gumroad",
  ],
  "hidden-money-in-your-industry": [
    "Marketing agencies",
    "Manual reporting — spending 5+ hours/week on client reports",
    "15,000",
    "Automated reporting dashboard that pulls from existing tools",
    "1,500",
    "Over-hiring for tasks that could be templated",
    "40,000",
    "SOPs + template library for common deliverables",
    "4,000",
    "Not renegotiating tool subscriptions annually",
    "5,000",
    "Annual vendor audit + renegotiation service",
    "500",
    "1",
    "The agency I freelanced for last month",
  ],
  // New content ideas
  "turn-one-lesson-linkedin": [
    "Clients don't want more words — they want fewer, better ones",
    "Brevity is a skill, not laziness",
    "I cut my client reports in half and got better feedback",
    "Try cutting your next piece of writing by 50%. The parts that survive are the parts that matter.",
    "Write less, say more",
    "Every junior writer thinks more = better.",
    "I used to send 3-page reports.",
    "Then a client said: 'Just tell me what to do.'",
    "So I started writing one page. Better feedback. Faster approvals. Happier clients.",
    "Brevity isn't about cutting corners. It's about respecting your reader's time.",
    "Take your last email or post. Cut it in half. See what survives.",
    "LinkedIn",
  ],
  "turn-one-opinion-thread": [
    "Most productivity advice is procrastination in disguise",
    "Buying a new planner is not being productive",
    "I stopped optimising my system and just started doing the work",
    "Done > perfect. Ship > plan.",
  ],
};

/**
 * Returns a pre-filled values map for an idea's Step 1 template.
 * Returns an empty object for ideas without prefills (AI-generated steps).
 */
export function getStep1Prefills(ideaId: string): Record<number, string> {
  const values = prefillMap[ideaId];
  if (!values) return {};

  const result: Record<number, string> = {};
  values.forEach((val, i) => {
    result[i] = val;
  });
  return result;
}
