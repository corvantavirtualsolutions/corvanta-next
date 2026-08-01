"use server";

import { createAdminClient } from "@/lib/supabase/admin";

// Keywords for each niche category
const NICHE_KEYWORDS: Record<string, string[]> = {
  "Admin Support": [
    "admin", "administrative", "office", "support", "virtual assistant", "general",
    "clerical", "organization", "scheduling",
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

export type MatchedVA = {
  id: string;
  niche: string;
  bio: string | null;
  years_experience: number | null;
  past_clients: number | null;
  iq: number | null;
  english_score: string | null;
  profile_image_url: string | null;
};

function scoreNiche(vaNiche: string, helpWith: string, helpOtherText: string): number {
  const nicheLower = vaNiche.toLowerCase();
  if (helpWith === "Other") {
    const keywords = extractKeywords(helpOtherText);
    return keywords.some((kw) => nicheLower.includes(kw)) ? 100 : 0;
  }
  const keywords = NICHE_KEYWORDS[helpWith] ?? [];
  return keywords.some((kw) => nicheLower.includes(kw)) ? 100 : 0;
}

function scoreBio(bio: string | null, projectDetails: string): number {
  if (!bio || !projectDetails.trim()) return 0;
  const keywords = extractKeywords(projectDetails);
  if (keywords.length === 0) return 0;
  const bioLower = bio.toLowerCase();
  const matches = keywords.filter((kw) => bioLower.includes(kw)).length;
  return Math.min(60, matches * 10);
}

function scoreQuality(va: MatchedVA): number {
  let s = 0;
  if (va.years_experience !== null) s += Math.min(va.years_experience * 2, 20);
  if (va.past_clients !== null) s += Math.min(Math.floor(va.past_clients / 5), 15);
  if (va.english_score !== null) {
    const n = parseFloat(va.english_score);
    if (!isNaN(n)) s += Math.min(n, 10);
  }
  return s;
}

export async function matchVAs(
  helpWith: string,
  helpOtherText: string,
  projectDetails: string
): Promise<{ results: MatchedVA[]; error?: string }> {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("vas")
    .select(
      "id, niche, bio, years_experience, past_clients, iq, english_score, profile_image_url"
    );

  if (error) return { results: [], error: error.message };
  if (!data || data.length === 0) return { results: [] };

  const scored = (data as MatchedVA[]).map((va) => ({
    va,
    total:
      scoreNiche(va.niche, helpWith, helpOtherText) +
      scoreBio(va.bio, projectDetails) +
      scoreQuality(va),
  }));

  const matched = scored
    .filter((s) => s.total > 0)
    .sort((a, b) => b.total - a.total)
    .map((s) => s.va);

  return { results: matched };
}
