"use server";

import { createAdminClient } from "@/lib/supabase/admin";

// ─── Niche keyword map ────────────────────────────────────────────────
const NICHE_KEYWORDS: Record<string, string[]> = {
  "Admin Support": [
    "admin", "administrative", "office", "support", "virtual assistant",
    "general", "clerical", "organization", "scheduling",
  ],
  "Customer Service": [
    "customer", "service", "support", "client", "helpdesk", "help desk",
    "chat", "ticket", "retention", "satisfaction",
  ],
  "Social Media Management": [
    "social media", "social", "instagram", "facebook", "twitter", "tiktok",
    "content creator", "community", "engagement", "influencer", "reels",
  ],
  "Bookkeeping & Accounting": [
    "bookkeeping", "accounting", "finance", "financial", "quickbooks", "xero",
    "payroll", "tax", "reconciliation", "invoicing",
  ],
  "Content & Copywriting": [
    "content", "copywriting", "copy", "writing", "writer", "blog", "seo",
    "creative", "editorial", "script",
  ],
  "Executive Assistance": [
    "executive", "assistant", "c-suite", "calendar", "scheduling",
    "project management", "operations", "chief of staff", "strategic",
  ],
  "Data Entry & Research": [
    "data entry", "data", "research", "spreadsheet", "excel",
    "analysis", "reporting", "database", "sourcing",
  ],
  "E-commerce Support": [
    "ecommerce", "e-commerce", "shopify", "amazon", "ebay",
    "product listing", "online store", "inventory", "fulfillment",
  ],
};

// ─── Scoring weights — adjust these constants to tune ranking ─────────
//
// The five maxima sum to 100, so the raw score IS the 0-100 percentage.
//
const WEIGHTS = {
  /** Points for a matching niche (binary: match or nothing) */
  NICHE: 50,

  /** Max points from bio/project-details keyword overlap */
  BIO_MAX: 30,
  /** Points per keyword found in the VA's bio */
  BIO_PER_KW: 5,

  /** Max points from years_experience */
  YEARS_EXP_MAX: 8,
  /** Experience saturates at this many years */
  YEARS_EXP_CAP: 10,

  /** Max points from english_score */
  ENGLISH_MAX: 7,

  /** Max points from IQ */
  IQ_MAX: 5,
  /** IQ at or below this baseline contributes 0 points */
  IQ_BASELINE: 90,
  /** IQ at or above this ceiling scores the full IQ_MAX */
  IQ_CEILING: 145,
} as const;

// Sanity-check: NICHE + BIO_MAX + YEARS_EXP_MAX + ENGLISH_MAX + IQ_MAX = 100
// 50 + 30 + 8 + 7 + 5 = 100

/** VAs scoring below this threshold are excluded from results */
const MIN_SCORE = 5;

// ─── Stop-word list for keyword extraction ───────────────────────────
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "can", "that", "this", "these", "those",
  "i", "we", "you", "he", "she", "they", "it", "my", "our", "your",
  "his", "her", "their", "its", "what", "who", "which", "when", "where",
  "how", "why", "not", "also", "just", "very", "more", "most", "some",
  "any", "all", "each", "need", "want", "like", "looking", "help",
  "work", "experience", "good", "great", "well", "new", "about", "please",
]);

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(w));
}

// ─── Individual scoring functions ────────────────────────────────────

function scoreNiche(
  vaNiche: string,
  helpWith: string,
  helpOtherText: string
): number {
  const nicheLower = vaNiche.toLowerCase();
  const keywords =
    helpWith === "Other"
      ? extractKeywords(helpOtherText)
      : (NICHE_KEYWORDS[helpWith] ?? []);
  return keywords.some((kw) => nicheLower.includes(kw)) ? WEIGHTS.NICHE : 0;
}

function scoreBio(bio: string | null, projectDetails: string): number {
  if (!bio || !projectDetails.trim()) return 0;
  const keywords = extractKeywords(projectDetails);
  if (keywords.length === 0) return 0;
  const bioLower = bio.toLowerCase();
  const hits = keywords.filter((kw) => bioLower.includes(kw)).length;
  return Math.min(WEIGHTS.BIO_MAX, hits * WEIGHTS.BIO_PER_KW);
}

function scoreYearsExp(years: number | null): number {
  if (years === null) return 0;
  const fraction = Math.min(years, WEIGHTS.YEARS_EXP_CAP) / WEIGHTS.YEARS_EXP_CAP;
  return Math.round(fraction * WEIGHTS.YEARS_EXP_MAX);
}

function scoreEnglish(englishScore: string | null): number {
  if (!englishScore) return 0;
  const raw = parseFloat(englishScore.replace("%", "").trim());
  if (isNaN(raw)) return 0;
  // >10 = percentage / large-number scale (0-100); <=10 = IELTS-style (0-10)
  const normalized = raw > 10 ? Math.min(raw, 100) / 100 : Math.min(raw, 10) / 10;
  return Math.round(normalized * WEIGHTS.ENGLISH_MAX);
}

function scoreIQ(iq: number | null): number {
  if (iq === null || iq <= WEIGHTS.IQ_BASELINE) return 0;
  const range = WEIGHTS.IQ_CEILING - WEIGHTS.IQ_BASELINE;
  const fraction = Math.min(iq - WEIGHTS.IQ_BASELINE, range) / range;
  return Math.round(fraction * WEIGHTS.IQ_MAX);
}

// ─── Public types ─────────────────────────────────────────────────────

export type MatchedVA = {
  id: string;
  /** Not displayed on public cards — stored in admin seeker records only */
  name: string;
  niche: string;
  bio: string | null;
  years_experience: number | null;
  past_clients: number | null;
  iq: number | null;
  english_score: string | null;
  profile_image_url: string | null;
  /** Normalized match score 0-100 */
  score: number;
};

// ─── Approach submission ─────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitApproach(
  formData: FormData
): Promise<{ error?: string }> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const company = (formData.get("company") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const agreedPayment = formData.get("agreed_payment_terms") === "true";
  const agreedInfo = formData.get("agreed_accurate_info") === "true";
  const agreedContact = formData.get("agreed_contact") === "true";
  const agreedEmailContract = formData.get("agreed_email_contract") === "true";
  const notes = (formData.get("notes") as string | null)?.trim() || null;
  const vaId = (formData.get("va_id") as string | null)?.trim() || null;
  const vaName = (formData.get("va_name") as string | null)?.trim() || null;
  const vaNiche = (formData.get("va_niche") as string | null)?.trim() || null;
  const matchScoreRaw = formData.get("match_score") as string | null;
  const matchScore = matchScoreRaw ? parseInt(matchScoreRaw, 10) : null;
  const category = (formData.get("category") as string | null)?.trim() || null;
  const hours = (formData.get("hours") as string | null)?.trim() || null;
  const budget = (formData.get("budget") as string | null)?.trim() || null;
  const projectDetails = (formData.get("project_details") as string | null)?.trim() || null;

  if (!name) return { error: "Name is required." };
  if (!company) return { error: "Company name is required." };
  if (!email || !EMAIL_RE.test(email))
    return { error: "A valid email address is required." };
  if (!agreedPayment || !agreedInfo || !agreedContact || !agreedEmailContract)
    return { error: "Please agree to all required terms to continue." };

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("va_seekers").insert({
    name,
    company,
    email,
    agreed_payment_terms: agreedPayment,
    agreed_accurate_info: agreedInfo,
    agreed_contact: agreedContact,
    agreed_email_contract: agreedEmailContract,
    notes,
    va_id: vaId,
    va_name: vaName,
    va_niche: vaNiche,
    match_score: matchScore,
    category,
    hours,
    budget,
    project_details: projectDetails,
  });

  if (error) return { error: error.message };
  return {};
}

// ─── Main export ──────────────────────────────────────────────────────

export async function matchVAs(
  helpWith: string,
  helpOtherText: string,
  projectDetails: string
): Promise<{ results: MatchedVA[]; error?: string }> {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("vas")
    .select(
      "id, name, niche, bio, years_experience, past_clients, iq, english_score, profile_image_url"
    );

  if (error) return { results: [], error: error.message };
  if (!data || data.length === 0) return { results: [] };

  const scored = (data as Omit<MatchedVA, "score">[]).map((va) => {
    const raw =
      scoreNiche(va.niche, helpWith, helpOtherText) +
      scoreBio(va.bio, projectDetails) +
      scoreYearsExp(va.years_experience) +
      scoreEnglish(va.english_score) +
      scoreIQ(va.iq);
    // raw already maxes at 100 (weights sum to 100)
    const score = Math.min(100, raw);
    return { va: { ...va, score }, score };
  });

  const results = scored
    .filter((s) => s.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.va);

  return { results };
}
