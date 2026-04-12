import { IdeaValidation, StartThisOutput } from "./types";

const validationMap: Record<string, IdeaValidation> = {
  "rent-affordability-reality-check": {
    demand:
      "High — millions of renters regularly search for affordability calculators. Reddit threads and TikTok videos on rent budgeting consistently go viral.",
    competition:
      "Moderate — generic calculators exist (NerdWallet, Zillow), but none combine post-expense reality checks with local rent data in a mobile-first flow.",
    monetisation:
      "Affiliate leads to budgeting apps, premium city-specific reports, or white-label for property platforms. Estimated $2–8 per qualified lead.",
  },
  "property-deal-roi-quick-analyzer": {
    demand:
      "Strong — new investors constantly search for quick ROI checks before committing capital. Keyword volume for 'property ROI calculator' trends upward year over year.",
    competition:
      "Low for mobile-first — most tools are spreadsheet-based or desktop-heavy. A fast, opinionated mobile tool has clear whitespace.",
    monetisation:
      "Premium tiers with advanced metrics, affiliate partnerships with property platforms, or lead gen for mortgage brokers. $5–15 per conversion.",
  },
  "cold-outreach-message-generator": {
    demand:
      "Very high — freelancers, recruiters, and founders all need better outreach. 'Cold email template' has massive search volume.",
    competition:
      "Crowded in email tools, but thin for instant mobile generators that give you one message you can copy and send immediately.",
    monetisation:
      "Freemium with limited daily generations, premium templates, or bundle with CRM affiliate offers. $3–10/month subscription potential.",
  },
  "subscription-leak-finder": {
    demand:
      "Massive — the average person wastes $200+/month on forgotten subscriptions. Personal finance content around this topic consistently performs well.",
    competition:
      "Apps like Truebill/Rocket Money exist but require bank linking. A quick self-audit tool with no login has a different value prop.",
    monetisation:
      "Affiliate to cancellation services, budgeting apps, or premium detailed audit reports. Strong conversion potential at $1–5 per referral.",
  },
  "explain-anything-simply": {
    demand:
      "High — content creators and educators constantly need to simplify complex topics. 'Explain like I'm 5' is a cultural meme with real utility.",
    competition:
      "ChatGPT can do this generically, but a focused tool with formatting for specific platforms (Twitter, LinkedIn, TikTok scripts) adds value.",
    monetisation:
      "Freemium content tool, premium platform-specific formatting, or bundle with scheduling tools. $5–12/month for regular creators.",
  },
  "underserved-niche-finder": {
    demand:
      "Strong among aspiring entrepreneurs — 'how to find a niche' is one of the most searched business queries. Consistent demand year-round.",
    competition:
      "Courses and blog posts dominate, but interactive tools that surface real data are rare. Clear opportunity for a focused product.",
    monetisation:
      "Premium niche reports, affiliate to domain/hosting providers, or paid deep-dive analysis. $10–30 per premium report.",
  },
  "problem-to-business-idea-converter": {
    demand:
      "Consistent — aspiring founders regularly search for structured frameworks to turn observations into ideas. Startup communities love this format.",
    competition:
      "Blog posts and frameworks exist, but interactive tools that walk you through the process step-by-step are uncommon.",
    monetisation:
      "Freemium idea generation, premium validation add-ons, or affiliate to business formation services. $5–15/month for serious users.",
  },
  "would-you-take-this-trade": {
    demand:
      "High — trading education and simulation content is booming. Paper trading apps see millions of downloads. Gamified learning converts well.",
    competition:
      "Trading simulators exist but are complex. A quick, swipe-based 'would you take this trade' format is novel and engaging.",
    monetisation:
      "Premium historical scenarios, affiliate to brokerages, or subscription for daily challenges. $8–20/month for engaged traders.",
  },
  "validate-before-you-waste-time": {
    demand:
      "Very high — the #1 mistake new entrepreneurs make is building before validating. Huge content ecosystem around lean validation.",
    competition:
      "Frameworks and courses exist, but quick automated validation reports are rare. Most require manual research.",
    monetisation:
      "Freemium quick checks, premium detailed reports, or affiliate to market research tools. $10–25 per detailed validation report.",
  },
  "build-a-simple-tool": {
    demand:
      "Strong — micro-SaaS and indie hacking communities are growing fast. 'Simple tool ideas' is a frequently searched term.",
    competition:
      "Idea lists exist everywhere, but personalized suggestions based on skills and market gaps are uncommon.",
    monetisation:
      "Premium idea packs with technical specs, affiliate to no-code platforms, or community membership. $15–30 per premium pack.",
  },
  "steal-proven-business-ideas-smarter": {
    demand:
      "High — 'business ideas that work' and 'proven business models' have massive search volume. People want de-risked starting points.",
    competition:
      "Listicles everywhere, but curated with improvement angles and market gap analysis is a step above. Opportunity to differentiate.",
    monetisation:
      "Premium case study breakdowns, affiliate to business tools, or cohort-based implementation programs. $20–50 per deep-dive.",
  },
  "turn-skills-into-digital-product": {
    demand:
      "Very strong — the creator economy is booming. 'How to sell digital products' trends consistently across all platforms.",
    competition:
      "Courses dominate (Gumroad, Teachable content), but a quick diagnostic that matches skills to product types is novel.",
    monetisation:
      "Affiliate to platform tools (Gumroad, Lemonsqueezy), premium product blueprints, or coaching upsell. $5–20 per conversion.",
  },
  "hidden-money-in-your-industry": {
    demand:
      "Strong — professionals in every industry want to earn more. Industry-specific money-making content consistently performs well.",
    competition:
      "Generic advice is everywhere, but personalized industry-specific opportunity maps are rare and valuable.",
    monetisation:
      "Premium industry reports, consulting lead gen, or affiliate to specialized tools. $15–40 per industry-specific report.",
  },
};

/** Step 1 mocks — keyed by idea id */
const step1Map: Record<string, StartThisOutput> = {
  "rent-affordability-reality-check": {
    stepTitle: "Calculate your real rent budget",
    instruction:
      "Open your bank app and screenshot last month's transactions. List your 5 biggest recurring monthly expenses below, then plug them into the formula. Your real rent budget is what's left — not the 30% rule landlords quote.",
    template:
      "Monthly income (after tax): $________\n\nTop 5 recurring expenses:\n1. ________ → $________\n2. ________ → $________\n3. ________ → $________\n4. ________ → $________\n5. ________ → $________\n\nTotal expenses: $________\n\nReal rent budget:\n($________ × 0.30) − $________ = $________\n\nVerdict: I can actually afford $________ /month in rent.",
  },
  "property-deal-roi-quick-analyzer": {
    stepTitle: "Run a quick cap rate check",
    instruction:
      "Open Zillow or Redfin right now. Find one property listing you've been eyeing. Pull the numbers below from the listing page and plug them into the formula. Above 6% cap rate? Worth a deeper look.",
    template:
      "Property address: ________\nListing price: $________\nEstimated monthly rent: $________\nAnnual property tax: $________\nEstimated annual insurance: $________\n\nCalculation:\nAnnual rent: $________ × 12 = $________\nAnnual expenses: $________ + $________ = $________\nNet operating income: $________ − $________ = $________\nCap rate: ($________ ÷ $________) × 100 = ________%\n\nVerdict: ________ (worth exploring / pass / needs more data)",
  },
  "cold-outreach-message-generator": {
    stepTitle: "Write one personalised outreach message",
    instruction:
      "Open LinkedIn right now. Find one person you want to connect with. Read their 3 most recent posts. Fill in the template below using something specific from their content. Do not pitch. Ask one genuine question.",
    template:
      "To: ________\nTheir role: ________\n\nSpecific thing they posted about: ________\n\nMessage:\nHi ________, I saw your post about ________. I especially liked the point about ________. Quick question — ________?\n\nWhy this works: references their actual content, asks one clear question, zero pitch.",
  },
  "subscription-leak-finder": {
    stepTitle: "Audit your subscriptions",
    instruction:
      "Open your email inbox. Search for \"subscription confirmation\" and \"recurring payment\". List every active subscription below. Star anything unused in 30+ days. Cancel at least one before you close this page.",
    template:
      "Active subscriptions:\n1. ________ → $________/mo → Last used: ________\n2. ________ → $________/mo → Last used: ________\n3. ________ → $________/mo → Last used: ________\n4. ________ → $________/mo → Last used: ________\n5. ________ → $________/mo → Last used: ________\n\nCancel immediately:\n→ ________ (saves $________/mo)\n→ ________ (saves $________/mo)\n\nMonthly savings: $________",
  },
  "explain-anything-simply": {
    stepTitle: "Write your first clarity post",
    instruction:
      "Pick one concept from your field that people always overcomplicate. Write a 3-sentence explanation using only words a 12-year-old would know. Drop it into the post template below.",
    template:
      "Topic: ________\n\nSimple explanation (3 sentences, no jargon):\n________\n________\n________\n\nReady-to-post version:\n\"Most people overcomplicate ________.\n\nHere's the simple version:\n________\n\nThat's it. No jargon needed.\"\n\nPost on: ________ (LinkedIn / Twitter / both)",
  },
  "underserved-niche-finder": {
    stepTitle: "Find 3 unresolved complaints",
    instruction:
      "Go to reddit.com. Search for your industry + \"frustrated\" or \"wish there was\". Read the top 10 results. Fill in the 3 most common unresolved complaints below.",
    template:
      "Industry: ________\nReddit search: \"________ frustrated\"\n\n1. Problem: ________\n   Existing solution: ________\n   Why it's bad: ________\n\n2. Problem: ________\n   Existing solution: ________\n   Why it's bad: ________\n\n3. Problem: ________\n   Existing solution: ________\n   Why it's bad: ________\n\nStrongest niche: #________",
  },
  "problem-to-business-idea-converter": {
    stepTitle: "Structure one pain point into an idea",
    instruction:
      "Think about the last thing that genuinely annoyed you this week. Fill in the template below. By the time you finish, you'll have a structured business idea based on a real pain point.",
    template:
      "The problem: ________\nHow I currently solve it: ________\n\nWhy that solution is bad:\n→ Too slow because ________\n→ Too expensive because ________\n→ Frustrating because ________\n\nA better solution would:\n→ ________\n→ ________\n\nWho else has this problem: ________\n\nOne-sentence idea:\nA ________ that helps ________ to ________ without ________.",
  },
  "would-you-take-this-trade": {
    stepTitle: "Analyse one chart blind",
    instruction:
      "Open TradingView (free, no account needed). Pick any ticker. Set to daily candles. Cover the right third of your screen. Fill in your analysis below, then reveal and review.",
    template:
      "Ticker: ________\nDate range visible: ________ to ________\n\nTrend: ________ (up / down / sideways)\nKey level: $________\nPattern: ________\n\nMy call: ________ (long / short / stay out)\nEntry: $________\nStop loss: $________\nReasoning: ________\n\nAfter reveal:\nActual result: ________\nWhat I missed: ________\nLesson: ________",
  },
  "validate-before-you-waste-time": {
    stepTitle: "Run a 3-question validation check",
    instruction:
      "Write your idea in one sentence. Then search Google Trends, Reddit, and Twitter/X for each answer below. 3 yeses = pursue. Fewer = pivot or kill.",
    template:
      "Idea: ________\nWho it's for: ________\n\n1. Is search volume growing?\n   Google Trends keyword: \"________\"\n   Trend: ________ (growing / flat / declining)\n   → YES / NO\n\n2. Are real people complaining about this?\n   Reddit search: \"________\"\n   Complaints found: ________\n   → YES / NO\n\n3. Are people already paying for solutions?\n   Existing tools: ________\n   Price range: $________\n   → YES / NO\n\nScore: ________/3\nVerdict: ________ (pursue / pivot / kill)",
  },
  "build-a-simple-tool": {
    stepTitle: "Identify your micro-tool gap",
    instruction:
      "Think about a task you do weekly that involves a spreadsheet or manual process. Describe it below. Then search Product Hunt for similar tools. If nothing good exists under $20/month, that's your idea.",
    template:
      "The repetitive task: ________\nHow often: ________\nCurrent tool: ________ (spreadsheet / manual / nothing)\nTime per session: ________ min\n\nProduct Hunt search: \"________\"\nSimilar tools:\n1. ________ → $________/mo → Missing: ________\n2. ________ → $________/mo → Missing: ________\n\nMy tool would: ________\nI'd pay $________/mo for this.",
  },
  "steal-proven-business-ideas-smarter": {
    stepTitle: "Find a proven product to improve",
    instruction:
      "Go to Indie Hackers or Product Hunt. Find one product making $5K+/month. Read their user reviews. List 3 complaints below — your improved version fixes exactly those.",
    template:
      "Product: ________\nRevenue: $________/month\nWhat it does: ________\n\nComplaints:\n1. ________ (source: ________)\n2. ________ (source: ________)\n3. ________ (source: ________)\n\nMy improved version:\nFixes #1 by: ________\nFixes #2 by: ________\nFixes #3 by: ________\n\nTarget customer: ________\nPrice: $________/mo",
  },
  "turn-skills-into-digital-product": {
    stepTitle: "Outline your first digital product",
    instruction:
      "Think about the last 3 times someone asked you for help. Those are your monetisable skills. Pick the easiest to explain in writing and fill in the product outline below.",
    template:
      "3 things people ask me about:\n1. ________\n2. ________\n3. ________\n\nEasiest to explain: #________\n\nTitle: \"How to ________\"\nFormat: ________ (PDF / video / template pack)\nTarget buyer: ________\n\nSections:\n1. ________\n2. ________\n3. ________\n4. ________\n5. ________\n\nPrice: $________\nSell on: ________",
  },
  "hidden-money-in-your-industry": {
    stepTitle: "Map 3 industry inefficiencies",
    instruction:
      "Think about your industry. What do companies waste money on because they don't know better? List 3 inefficiencies below. For each, describe how you'd fix it as a service. Price at 10% of savings.",
    template:
      "Industry: ________\n\n1. Waste: ________\n   Cost: ~$________/year\n   Fix: ________\n   My fee: $________\n\n2. Waste: ________\n   Cost: ~$________/year\n   Fix: ________\n   My fee: $________\n\n3. Waste: ________\n   Cost: ~$________/year\n   Fix: ________\n   My fee: $________\n\nBest opportunity: #________\nFirst client to pitch: ________",
  },
};

/** Step 2 mocks — used as fallback for "generate next step" without AI */
const step2Map: Record<string, StartThisOutput> = {
  "cold-outreach-message-generator": {
    stepTitle: "Send the message and track the response",
    instruction:
      "Copy the message you wrote in Step 1. Open LinkedIn and send it right now. Then set a reminder for 3 days from today to follow up if they don't reply. Fill in the tracker below.",
    template:
      "Message sent to: ________\nDate sent: ________\nPlatform: ________\n\nFollow-up reminder set for: ________\n\nFollow-up message (if no reply):\nHi ________, just bumping this in case it got buried. I was genuinely curious about ________. No worries if you're swamped.\n\nResult after 1 week:\n→ Reply received: YES / NO\n→ Outcome: ________\n→ Lesson: ________",
  },
  "validate-before-you-waste-time": {
    stepTitle: "Talk to 3 potential customers",
    instruction:
      "Based on your validation results from Step 1, find 3 real people who have the problem your idea solves. DM them on Reddit, Twitter, or LinkedIn. Ask them the questions below — don't pitch, just listen.",
    template:
      "Person 1: ________\nWhere I found them: ________\nQuestion asked: \"How do you currently handle ________?\"\nTheir answer: ________\nWould they pay for a solution: YES / NO\n\nPerson 2: ________\nWhere I found them: ________\nTheir answer: ________\nWould they pay: YES / NO\n\nPerson 3: ________\nTheir answer: ________\nWould they pay: YES / NO\n\nConclusion: ________/3 would pay\nNext action: ________",
  },
};

const defaultValidation: IdeaValidation = {
  demand:
    "Moderate demand detected based on search trends and community interest. Worth exploring further with targeted research.",
  competition:
    "Some existing solutions, but clear room for differentiation with a focused, mobile-first approach.",
  monetisation:
    "Multiple viable paths including freemium, affiliate, and premium tiers. Start with the simplest model and iterate.",
};

const defaultStep1: StartThisOutput = {
  stepTitle: "Capture demand signals",
  instruction:
    "Open a new document. Search Reddit and Twitter for people complaining about this exact problem. Write down the 3 most common complaints that don't have good existing solutions.",
  template:
    "Idea: ________\n\nComplaint #1: ________\nSource: ________\n\nComplaint #2: ________\nSource: ________\n\nComplaint #3: ________\nSource: ________\n\nVerdict: ________ (real demand / weak signal / no demand)",
};

const defaultStep2: StartThisOutput = {
  stepTitle: "Reach out to 3 potential users",
  instruction:
    "Based on the complaints you found in Step 1, find 3 real people who have this problem. Send each a short message asking how they currently solve it. Don't pitch — just listen and take notes.",
  template:
    "Person 1: ________\nPlatform: ________\nMessage sent: \"How do you currently handle ________?\"\nTheir response: ________\n\nPerson 2: ________\nTheir response: ________\n\nPerson 3: ________\nTheir response: ________\n\nPattern I noticed: ________\nNext action: ________",
};

export function getValidation(id: string): IdeaValidation {
  return validationMap[id] ?? defaultValidation;
}

export function getStartThis(id: string, stepNumber: number = 1): StartThisOutput {
  if (stepNumber === 1) {
    return step1Map[id] ?? defaultStep1;
  }
  // For step 2+, return step2 mock if available, otherwise generic
  return step2Map[id] ?? defaultStep2;
}
