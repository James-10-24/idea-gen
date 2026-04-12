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

const startThisMap: Record<string, StartThisOutput> = {
  "rent-affordability-reality-check": {
    action:
      "Open your bank app, screenshot last month's transactions, and list your 5 biggest recurring expenses. Then calculate: (Monthly income × 0.30) − total recurring expenses = your real rent budget.",
    output:
      "Your real affordable rent number, adjusted for actual spending — not the inflated number landlords want you to believe.",
  },
  "property-deal-roi-quick-analyzer": {
    action:
      "Pick one property listing you've been eyeing. Note the price, estimated monthly rent, and annual property tax. Calculate: ((Annual rent − expenses) ÷ purchase price) × 100 = cap rate. If it's above 6%, it's worth a deeper look.",
    output:
      "A quick cap rate calculation for one real property — your first data point for making an informed investment decision.",
  },
  "cold-outreach-message-generator": {
    action:
      "Find one person you want to reach on LinkedIn. Read their last 3 posts. Write a 2-sentence message that references something specific they said and asks one clear question. No pitch, no ask — just genuine curiosity.",
    output:
      "One personalized outreach message ready to send — built on relevance, not templates.",
  },
  "subscription-leak-finder": {
    action:
      "Open your email, search for 'subscription confirmation' and 'recurring payment'. List every active subscription you find. Star any you haven't used in 30+ days. Cancel at least one right now.",
    output:
      "A clear list of your active subscriptions with at least one cancelled — immediate monthly savings.",
  },
  "explain-anything-simply": {
    action:
      "Pick one concept from your field that confuses most people. Write a 3-sentence explanation using only words a 12-year-old would understand. Post it on LinkedIn or Twitter with the hook: 'Most people overcomplicate [topic]. Here's the simple version.'",
    output:
      "One piece of educational content ready to post — your first step toward building authority through clarity.",
  },
  "underserved-niche-finder": {
    action:
      "Go to Reddit and search for '[your industry] + frustrated'. Read the top 10 posts. Write down the 3 most common complaints that don't have good existing solutions. That's your niche shortlist.",
    output:
      "Three underserved problem areas with real demand signals — sourced directly from frustrated potential customers.",
  },
  "problem-to-business-idea-converter": {
    action:
      "Think about the last thing that genuinely annoyed you this week. Write down: (1) the problem, (2) how you currently solve it, (3) why that solution is bad, (4) what a 10x better solution would look like. You now have a business idea.",
    output:
      "One structured business idea derived from a real pain point you personally experience.",
  },
  "would-you-take-this-trade": {
    action:
      "Open a stock chart for any ticker. Cover the right half of the screen. Based on the visible pattern, write down whether you'd go long, short, or stay out — and your reasoning. Then reveal the result and note what you missed.",
    output:
      "One documented trade analysis with a self-review — building your pattern recognition muscle without risking capital.",
  },
  "validate-before-you-waste-time": {
    action:
      "Take your idea and search for it on Google Trends, Reddit, and Twitter. Write down: (1) Is search volume growing or shrinking? (2) Are real people complaining about this problem? (3) Are they already paying for solutions? If you get 3 yeses, it's worth pursuing.",
    output:
      "A quick validation scorecard for your idea — based on real demand signals, not gut feeling.",
  },
  "build-a-simple-tool": {
    action:
      "Think about a task you do repeatedly that involves a spreadsheet, calculator, or manual process. Describe it in one sentence. Search Product Hunt for similar tools. If nothing good exists under $20/month, you've found your micro-tool idea.",
    output:
      "One validated micro-tool concept based on a real workflow gap you personally experience.",
  },
  "steal-proven-business-ideas-smarter": {
    action:
      "Go to Indie Hackers or Product Hunt. Find one product making $5K+/month. List 3 things their users complain about in reviews. Build your version that fixes those 3 things. That's your improved business idea.",
    output:
      "One proven concept with a clear improvement angle — de-risked because the market is already validated.",
  },
  "turn-skills-into-digital-product": {
    action:
      "List 3 things people regularly ask you for help with. Pick the one that's easiest to explain in writing. Create a one-page outline of a guide that solves that problem. That's your first digital product.",
    output:
      "A product outline based on skills people already value you for — ready to flesh out and sell.",
  },
  "hidden-money-in-your-industry": {
    action:
      "Ask yourself: 'What do companies in my industry waste money on because they don't know better?' Write down 3 inefficiencies. For each, describe how you'd fix it as a service. Price it at 10% of the money you'd save them.",
    output:
      "Three service ideas based on industry inefficiencies — each with a clear value proposition and pricing model.",
  },
};

const defaultValidation: IdeaValidation = {
  demand: "Moderate demand detected based on search trends and community interest. Worth exploring further with targeted research.",
  competition: "Some existing solutions, but clear room for differentiation with a focused, mobile-first approach.",
  monetisation: "Multiple viable paths including freemium, affiliate, and premium tiers. Start with the simplest model and iterate.",
};

const defaultStartThis: StartThisOutput = {
  action: "Spend 10 minutes researching this idea on Reddit and Twitter. Write down 3 real complaints from potential customers. If you find them, you've got demand.",
  output: "A quick demand validation with 3 real customer pain points — your first step toward building something people want.",
};

export function getValidation(id: string): IdeaValidation {
  return validationMap[id] ?? defaultValidation;
}

export function getStartThis(id: string): StartThisOutput {
  return startThisMap[id] ?? defaultStartThis;
}
