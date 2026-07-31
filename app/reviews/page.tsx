import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = {
  title: "Client Reviews | Corvanta Virtual Solutions",
  description:
    "Read what clients say about working with Corvanta Virtual Solutions, and share your own experience.",
};

type Review = {
  id: string;
  rating: number;
  feedback: string;
  user_name: string;
  company: string | null;
  created_at: string;
};

export default async function ReviewsPage() {
  // Get current user for form pre-fill
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const defaultName =
    typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "";
  const defaultCompany =
    typeof user?.user_metadata?.company === "string"
      ? user.user_metadata.company
      : "";

  // Fetch all reviews server-side via admin client (bypasses RLS)
  const adminClient = createAdminClient();
  const { data: reviews } = await adminClient
    .from("reviews")
    .select("id, rating, feedback, user_name, company, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  const list: Review[] = reviews ?? [];

  return (
    <>
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Client Reviews
          </div>
          <h1>What our clients are saying</h1>
          <p className="lead">
            Real feedback from business owners who found their perfect match through Corvanta.
          </p>
        </div>
      </section>

      <section className="bg-surface reviews-section">
        <div className="container">
          <div className="reviews-layout">
            {/* Left: published reviews */}
            <div className="sample-reviews">
              {list.length === 0 ? (
                <div className="reviews-empty">
                  <p>No reviews yet - be the first to share your experience!</p>
                </div>
              ) : (
                list.map((r) => (
                  <div key={r.id} className="card sample-review-card">
                    <div className="sample-stars">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={16}
                          className={n <= r.rating ? "star-filled" : "star-empty"}
                        />
                      ))}
                    </div>
                    <p className="sample-review-text">&ldquo;{r.feedback}&rdquo;</p>
                    <div className="sample-review-author">
                      <strong>{r.user_name}</strong>
                      {r.company && <span>{r.company}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right: submission form */}
            <ReviewForm defaultName={defaultName} defaultCompany={defaultCompany} />
          </div>
        </div>
      </section>
    </>
  );
}
