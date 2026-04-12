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
    firstStep:
      "Open your bank app and screenshot last month's transactions. You need your actual numbers, not guesses.",
    doThisNow:
      "List your 5 biggest recurring monthly expenses below, then plug them into the formula. Your real rent budget is what's left — not the 30% rule landlords quote.",
    template:
      "Monthly income (after tax): $________\n\nTop 5 recurring expenses:\n1. ________ → $________\n2. ________ → $________\n3. ________ → $________\n4. ________ → $________\n5. ________ → $________\n\nTotal expenses: $________\n\nReal rent budget:\n($________ × 0.30) − $________ = $________\n\nVerdict: I can actually afford $________ /month in rent.",
  },
  "property-deal-roi-quick-analyzer": {
    firstStep:
      "Open Zillow or Redfin right now and find one property listing you've been considering (or pick any that catches your eye).",
    doThisNow:
      "Pull the three numbers below from the listing page. Plug them into the formula. If the cap rate is above 6%, this deal deserves a deeper look. Below 4%? Walk away.",
    template:
      "Property address: ________\nListing price: $________\nEstimated monthly rent: $________\nAnnual property tax: $________\nEstimated annual insurance: $________\n\nCalculation:\nAnnual rent: $________ × 12 = $________\nAnnual expenses: $________ + $________ = $________\nNet operating income: $________ − $________ = $________\nCap rate: ($________ ÷ $________) × 100 = ________%\n\nVerdict: ________ (worth exploring / pass / needs more data)",
  },
  "cold-outreach-message-generator": {
    firstStep:
      "Open LinkedIn right now. Find one person you want to connect with — a potential client, collaborator, or mentor. Read their 3 most recent posts.",
    doThisNow:
      "Fill in the template below using something specific from their posts. Do not pitch. Do not sell. Ask one genuine question that shows you actually read their content.",
    template:
      "To: ________\nTheir role: ________\n\nSpecific thing they posted about: ________\n\nMessage:\nHi ________, I saw your post about ________. I especially liked the point about ________. Quick question — ________?\n\nWhy this works: references their actual content, asks one clear question, zero pitch.",
  },
  "subscription-leak-finder": {
    firstStep:
      "Open your email inbox right now. Search for \"subscription confirmation\" and \"recurring payment\". Start scrolling.",
    doThisNow:
      "List every active subscription below. Be honest — include the ones you forgot about. Star anything you haven't used in the last 30 days. Cancel at least one before you close this page.",
    template:
      "Active subscriptions:\n1. ________ → $________/mo → Last used: ________\n2. ________ → $________/mo → Last used: ________\n3. ________ → $________/mo → Last used: ________\n4. ________ → $________/mo → Last used: ________\n5. ________ → $________/mo → Last used: ________\n6. ________ → $________/mo → Last used: ________\n\nTotal monthly spend: $________\n\nCancel immediately:\n→ ________ (saves $________/mo)\n→ ________ (saves $________/mo)\n\nMonthly savings: $________\nAnnual savings: $________",
  },
  "explain-anything-simply": {
    firstStep:
      "Pick one concept from your field that people always overcomplicate. Something you could explain at a dinner party in 30 seconds.",
    doThisNow:
      "Write a 3-sentence explanation using only words a 12-year-old would know. Then drop it into the post template below. This is your first piece of authority content.",
    template:
      "Topic: ________\n\nSimple explanation (3 sentences, no jargon):\n________\n________\n________\n\nReady-to-post version:\n\"Most people overcomplicate ________.\n\nHere's the simple version:\n\n________\n\nThat's it. No jargon needed.\"\n\nPost on: ________ (LinkedIn / Twitter / both)",
  },
  "underserved-niche-finder": {
    firstStep:
      "Go to reddit.com right now. You're going to search for real frustration signals — these are better than any market research report.",
    doThisNow:
      "Search Reddit for your industry + \"frustrated\" or \"annoying\" or \"wish there was\". Read the top 10 results. Fill in the template below with the 3 most common unresolved complaints.",
    template:
      "Industry / area: ________\n\nReddit search used: \"________ frustrated\"\n\nTop 3 unresolved complaints:\n1. Problem: ________\n   Existing solution: ________\n   Why it's bad: ________\n\n2. Problem: ________\n   Existing solution: ________\n   Why it's bad: ________\n\n3. Problem: ________\n   Existing solution: ________\n   Why it's bad: ________\n\nStrongest niche opportunity: #________\nBecause: ________",
  },
  "problem-to-business-idea-converter": {
    firstStep:
      "Think about the last thing that genuinely annoyed you this week. Something you had to deal with that felt harder than it should be.",
    doThisNow:
      "Fill in the template below. By the time you finish, you'll have a structured business idea based on a real pain point you personally experience — which means you already understand the customer.",
    template:
      "The problem: ________\n\nHow I currently solve it: ________\n\nWhy that solution is bad:\n→ It takes too long because ________\n→ It costs too much because ________\n→ It's frustrating because ________\n\nA 10x better solution would:\n→ ________\n→ ________\n\nWho else has this problem: ________\n\nOne-sentence business idea:\nA ________ that helps ________ to ________ without ________.",
  },
  "would-you-take-this-trade": {
    firstStep:
      "Open TradingView (tradingview.com) — it's free, no account needed. Search for any stock or crypto ticker you're curious about.",
    doThisNow:
      "Set the chart to daily candles. Cover the right third of your screen with your hand or a window. Look at the visible price action and fill in your analysis below. Then reveal the rest and see how you did.",
    template:
      "Ticker: ________\nTimeframe: Daily\nDate range visible: ________ to ________\n\nWhat I see:\nTrend direction: ________ (up / down / sideways)\nKey level: $________\nPattern: ________\n\nMy call: ________ (long / short / stay out)\nEntry price: $________\nStop loss: $________\nReasoning: ________\n\nAfter reveal:\nActual result: ________\nWhat I missed: ________\nLesson: ________",
  },
  "validate-before-you-waste-time": {
    firstStep:
      "Write down the idea you want to validate in one sentence. No buzzwords — just what it does and who it's for.",
    doThisNow:
      "Run the 3-question validation check below. Search Google Trends, Reddit, and Twitter/X for each answer. If you get 3 yeses, the idea has legs. If not, pivot before you waste time building.",
    template:
      "Idea in one sentence: ________\nWho it's for: ________\n\nValidation check:\n\n1. Is search volume growing?\n   Google Trends keyword: \"________\"\n   Trend: ________ (growing / flat / declining)\n   → YES / NO\n\n2. Are real people complaining about this?\n   Reddit search: \"________\"\n   Found complaints: ________\n   → YES / NO\n\n3. Are people already paying for solutions?\n   Existing paid tools: ________\n   Price range: $________\n   → YES / NO\n\nScore: ________/3\nVerdict: ________ (pursue / pivot / kill)",
  },
  "build-a-simple-tool": {
    firstStep:
      "Think about a task you do at least once a week that involves a spreadsheet, calculator, or some repetitive manual process.",
    doThisNow:
      "Describe that task below. Then search Product Hunt for similar tools. If nothing good exists under $20/month, you've found your micro-tool idea — and your first paying customer is you.",
    template:
      "The repetitive task: ________\nHow often I do it: ________\nCurrent tool: ________ (spreadsheet / manual / nothing)\nTime it takes: ________ minutes each time\n\nProduct Hunt search: \"________\"\nSimilar tools found:\n1. ________ → $________/mo → Missing: ________\n2. ________ → $________/mo → Missing: ________\n\nMy tool would:\n→ ________\n→ ________\n\nI'd pay $________/mo for this.\nOther people who'd want this: ________",
  },
  "steal-proven-business-ideas-smarter": {
    firstStep:
      "Go to IndieHackers.com/products or Product Hunt right now. Sort by revenue. Find one product making $5K+/month that you find interesting.",
    doThisNow:
      "Read their user reviews and feedback. Find 3 things people complain about. Your improved version fixes exactly those 3 things — that's your de-risked business idea.",
    template:
      "Product found: ________\nRevenue: $________/month\nWhat it does: ________\n\nUser complaints:\n1. ________ (source: ________)\n2. ________ (source: ________)\n3. ________ (source: ________)\n\nMy improved version:\nName idea: ________\nFixes complaint #1 by: ________\nFixes complaint #2 by: ________\nFixes complaint #3 by: ________\n\nTarget customer: ________\nPrice point: $________/mo",
  },
  "turn-skills-into-digital-product": {
    firstStep:
      "Think about the last 3 times someone asked you for help or advice. What topics keep coming up? Those are your monetisable skills.",
    doThisNow:
      "Fill in the template below. By the end, you'll have a product outline for a digital guide based on skills people already value you for.",
    template:
      "3 things people ask me about:\n1. ________\n2. ________\n3. ________\n\nEasiest to explain in writing: #________\n\nProduct outline:\nTitle: \"How to ________\"\nFormat: ________ (PDF guide / video course / template pack)\nTarget buyer: ________\n\nChapter/section breakdown:\n1. ________\n2. ________\n3. ________\n4. ________\n5. ________\n\nPrice: $________\nSell on: ________ (Gumroad / Lemonsqueezy / own site)",
  },
  "hidden-money-in-your-industry": {
    firstStep:
      "Think about your current or most recent industry. Focus on the inefficiencies — things companies waste money on because they don't know better.",
    doThisNow:
      "List 3 specific inefficiencies below. For each one, describe how you'd fix it as a service. Price it at 10% of the money you'd save them — that's your fee.",
    template:
      "My industry: ________\n\nInefficiency #1:\nWhat they waste money on: ________\nHow much it costs them: ~$________/year\nHow I'd fix it: ________\nMy fee (10% of savings): $________\n\nInefficiency #2:\nWhat they waste money on: ________\nHow much it costs them: ~$________/year\nHow I'd fix it: ________\nMy fee (10% of savings): $________\n\nInefficiency #3:\nWhat they waste money on: ________\nHow much it costs them: ~$________/year\nHow I'd fix it: ________\nMy fee (10% of savings): $________\n\nStrongest opportunity: #________\nFirst client to pitch: ________",
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

const defaultStartThis: StartThisOutput = {
  firstStep:
    "Open a new document or note. You're going to capture real demand signals for this idea in under 10 minutes.",
  doThisNow:
    "Search Reddit and Twitter for people complaining about this exact problem. Write down the 3 most common complaints that don't have good existing solutions.",
  template:
    "Idea: ________\n\nComplaint #1: ________\nSource: ________\n\nComplaint #2: ________\nSource: ________\n\nComplaint #3: ________\nSource: ________\n\nVerdict: ________ (real demand / weak signal / no demand)",
};

export function getValidation(id: string): IdeaValidation {
  return validationMap[id] ?? defaultValidation;
}

export function getStartThis(id: string): StartThisOutput {
  return startThisMap[id] ?? defaultStartThis;
}
