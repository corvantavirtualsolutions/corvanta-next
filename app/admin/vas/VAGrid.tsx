"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import AddVAModal from "./AddVAModal";
import EditVAModal from "./EditVAModal";
import VADetailModal from "./VADetailModal";
import type { VA } from "./types";

export default function VAGrid({ initialVAs }: { initialVAs: VA[] }) {
  const [addOpen, setAddOpen] = useState(false);
  const [detailVA, setDetailVA] = useState<VA | null>(null);
  const [editVA, setEditVA] = useState<VA | null>(null);
  const router = useRouter();

  function handleAdded() {
    setAddOpen(false);
    router.refresh();
  }

  function handleDeleted() {
    setDetailVA(null);
    router.refresh();
  }

  function handleEditOpen() {
    setEditVA(detailVA);
    setDetailVA(null);
  }

  function handleEdited() {
    setEditVA(null);
    router.refresh();
  }

  return (
    <>
      <div style={{ marginBottom: "var(--sp-3)" }}>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setAddOpen(true)}
        >
          <Plus size={16} />
          Add New VA
        </button>
      </div>

      {initialVAs.length === 0 ? (
        <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--sp-2)" }}>
          No VAs added yet. Click &ldquo;Add New VA&rdquo; to get started.
        </p>
      ) : (
        <div className="va-grid">
          {initialVAs.map((va) => (
            <button
              key={va.id}
              className="va-card"
              onClick={() => setDetailVA(va)}
            >
              {va.profile_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={va.profile_image_url}
                  alt={va.name}
                  className="va-card-img"
                />
              ) : (
                <div className="va-card-placeholder" aria-hidden>
                  {va.name[0].toUpperCase()}
                </div>
              )}
              <p className="va-card-name">{va.name}</p>
              <p className="va-card-niche">{va.niche}</p>
            </button>
          ))}
        </div>
      )}

      {addOpen && (
        <AddVAModal onClose={() => setAddOpen(false)} onSuccess={handleAdded} />
      )}

      {detailVA && (
        <VADetailModal
          va={detailVA}
          onClose={() => setDetailVA(null)}
          onDeleted={handleDeleted}
          onEdit={handleEditOpen}
        />
      )}

      {editVA && (
        <EditVAModal
          va={editVA}
          onClose={() => setEditVA(null)}
          onSuccess={handleEdited}
        />
      )}
    </>
  );
}
