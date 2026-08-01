export type VaSeeker = {
  id: string;
  name: string;
  company: string;
  email: string | null;
  agreed_payment_terms: boolean;
  agreed_accurate_info: boolean;
  agreed_contact: boolean;
  agreed_email_contract: boolean;
  notes: string | null;
  va_id: string | null;
  va_niche: string | null;
  match_score: number | null;
  created_at: string;
};
