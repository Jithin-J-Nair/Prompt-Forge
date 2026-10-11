export interface PromptTemplate {
  label: string;
  prompt: string;
  industryId: string;
}

export const EXAMPLE_PROMPTS: PromptTemplate[] = [
  { label: "a gym", prompt: "make a website for a gym", industryId: "fitness" },
  { label: "a specialty coffee roastery", prompt: "website for a small-batch specialty coffee roastery with subscriptions", industryId: "coffee" },
  { label: "a fine-dining restaurant", prompt: "make a website for an intimate 16-table fine-dining restaurant with reservations", industryId: "restaurant" },
  { label: "a SaaS analytics tool", prompt: "landing page for a B2B SaaS that turns warehouse data into live dashboards", industryId: "saas" },
  { label: "a streetwear brand", prompt: "ecommerce site for a limited-drop streetwear brand", industryId: "ecommerce" },
  { label: "a creative agency", prompt: "portfolio site for an award-winning creative agency", industryId: "agency" },
  { label: "a photographer", prompt: "minimal portfolio for a documentary photographer", industryId: "portfolio" },
  { label: "a real estate brokerage", prompt: "real estate site with verified listings, map search and tour booking", industryId: "realestate" },
  { label: "a dental clinic", prompt: "website for a calm, modern dental clinic with online booking", industryId: "health" },
  { label: "a coding bootcamp", prompt: "site for a 20-week project-based coding bootcamp with cohorts", industryId: "education" },
  { label: "a budgeting app", prompt: "fintech app for honest, fee-free personal banking", industryId: "fintech" },
  { label: "a cabin retreat", prompt: "booking site for nine off-grid cabins in the pines", industryId: "travel" },
  { label: "a barbershop", prompt: "website for a high-end barbershop where you book your artist", industryId: "beauty" },
  { label: "a music festival", prompt: "site for a two-day, four-stage music festival with tiered tickets", industryId: "events" },
  { label: "an AI writing copilot", prompt: "landing + playground for an AI copilot that drafts support replies", industryId: "ai" },
  { label: "an indie band", prompt: "official site for an indie band — new single, tour dates, vinyl preorders", industryId: "music" },
  { label: "an animal rescue", prompt: "nonprofit site for an animal rescue with donations and volunteer signups", industryId: "nonprofit" },
  { label: "a law firm", prompt: "website for a plain-English law firm with fixed-fee pricing", industryId: "legal" },
];

export const HERO_ROTATIONS = [
  "make a website for a gym",
  "something for my coffee shop",
  "a SaaS landing page, idk",
  "streetwear brand, limited drops",
  "my band needs a site",
  "off-grid cabin bookings",
  "dentist but make it calm",
  "an ai copilot for support teams",
];
