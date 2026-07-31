import { Star } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

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

  return (
    <div>
      <h1 className="admin-page-title">Reviews</h1>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Rating</th>
              <th>Feedback</th>
              <th>Name</th>
              <th>Company</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
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
                  <td style={{ maxWidth: 340 }}>{r.feedback}</td>
                  <td>{r.user_name}</td>
                  <td>{r.company ?? "-"}</td>
                  <td>{formatDate(r.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
