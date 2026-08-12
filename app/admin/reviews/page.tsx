import { Star } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { DeleteReviewButton } from "./DeleteReviewButton";
import MarkAllReviewsRead from "./MarkAllReviewsRead";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type Review = {
  id: string;
  rating: number;
  feedback: string;
  user_name: string;
  company: string | null;
  created_at: string;
};

export default async function AdminReviewsPage() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("reviews")
    .select("id, rating, feedback, user_name, company, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="admin-page-title">Reviews</h1>
        <p style={{ color: "var(--color-error)" }}>
          Failed to load reviews: {error.message}
        </p>
      </div>
    );
  }

  const reviews: Review[] = data ?? [];
  const total = reviews.length;
  const avg =
    total > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
      : null;

  return (
    <div>
      <MarkAllReviewsRead />
      <h1 className="admin-page-title">Reviews</h1>

      {/* Summary stats */}
      <div className="admin-reviews-summary">
        {avg === null ? (
          <p className="admin-reviews-summary-empty">No reviews yet.</p>
        ) : (
          <>
            <div className="admin-reviews-stat">
              <span className="admin-reviews-avg">{avg.toFixed(1)}</span>
              <span className="admin-reviews-avg-label">out of 5</span>
              <div className="admin-reviews-stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={18}
                    className={n <= Math.round(avg) ? "star-filled" : "star-empty"}
                  />
                ))}
              </div>
            </div>
            <div className="admin-reviews-divider" />
            <div className="admin-reviews-stat">
              <span className="admin-reviews-avg">{total}</span>
              <span className="admin-reviews-avg-label">
                {total === 1 ? "review" : "reviews"}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Reviews table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Rating</th>
              <th>Feedback</th>
              <th>Name</th>
              <th>Company</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-secondary)",
                    padding: "var(--sp-6)",
                  }}
                >
                  No reviews yet.
                </td>
              </tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={14}
                          className={n <= r.rating ? "star-filled" : "star-empty"}
                        />
                      ))}
                    </div>
                  </td>
                  <td style={{ maxWidth: 300 }}>{r.feedback}</td>
                  <td>{r.user_name}</td>
                  <td>{r.company ?? "-"}</td>
                  <td>{formatDate(r.created_at)}</td>
                  <td>
                    <DeleteReviewButton reviewId={r.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
