"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteSeekerButton } from "./DeleteSeekerButton";
import SeekerDetailModal from "./SeekerDetailModal";
import type { VaSeeker } from "./types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function SeekersTable({ seekers }: { seekers: VaSeeker[] }) {
  const [detailSeeker, setDetailSeeker] = useState<VaSeeker | null>(null);
  const router = useRouter();

  function handleDeleted() {
    setDetailSeeker(null);
    router.refresh();
  }

  return (
    <>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>VA Approached</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {seekers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-secondary)",
                    padding: 48,
                  }}
                >
                  No submissions yet.
                </td>
              </tr>
            ) : (
              seekers.map((s) => (
                <tr
                  key={s.id}
                  className="seekers-table-row"
                  onClick={() => setDetailSeeker(s)}
                >
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.company}</td>
                  <td style={{ color: "var(--color-text-secondary)" }}>
                    {s.email ?? "-"}
                  </td>
                  <td>
                    {s.va_name ? (
                      <>
                        <span style={{ fontWeight: 600 }}>{s.va_name}</span>
                        {s.va_niche && (
                          <span
                            style={{
                              display: "block",
                              fontSize: "0.78rem",
                              color: "var(--color-text-secondary)",
                            }}
                          >
                            {s.va_niche}
                          </span>
                        )}
                      </>
                    ) : (
                      s.va_niche ?? "-"
                    )}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{formatDate(s.created_at)}</td>
                  {/* Stop click propagation on actions so Delete doesn't also open the modal */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <DeleteSeekerButton
                      seekerId={s.id}
                      onDeleted={() => router.refresh()}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {detailSeeker && (
        <SeekerDetailModal
          seeker={detailSeeker}
          onClose={() => setDetailSeeker(null)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}
