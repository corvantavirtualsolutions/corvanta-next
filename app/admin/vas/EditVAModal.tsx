"use client";

import { useState, useRef, useTransition } from "react";
import { X, Upload } from "lucide-react";
import { updateVA } from "./actions";
import type { VA } from "./types";

interface Props {
  va: VA;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditVAModal({ va, onClose, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(
    va.profile_image_url ?? null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(va.name);
  const [email, setEmail] = useState(va.email);
  const [niche, setNiche] = useState(va.niche);
  const [bio, setBio] = useState(va.bio ?? "");
  const [yearsExp, setYearsExp] = useState(
    va.years_experience !== null ? String(va.years_experience) : ""
  );
  const [pastClients, setPastClients] = useState(
    va.past_clients !== null ? String(va.past_clients) : ""
  );
  const [iq, setIq] = useState(va.iq !== null ? String(va.iq) : "");
  const [englishScore, setEnglishScore] = useState(va.english_score ?? "");
  const [portfolioLink, setPortfolioLink] = useState(va.portfolio_link ?? "");
  const [facebookLink, setFacebookLink] = useState(va.facebook_link ?? "");
  const [linkedinLink, setLinkedinLink] = useState(va.linkedin_link ?? "");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleSubmit() {
    setError("");
    startTransition(async () => {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      fd.append("niche", niche);
      fd.append("bio", bio);
      fd.append("years_experience", yearsExp);
      fd.append("past_clients", pastClients);
      fd.append("iq", iq);
      fd.append("english_score", englishScore);
      fd.append("portfolio_link", portfolioLink);
      fd.append("facebook_link", facebookLink);
      fd.append("linkedin_link", linkedinLink);
      fd.append("existing_image_url", va.profile_image_url ?? "");
      if (imageFile) fd.append("profile_image", imageFile);

      const result = await updateVA(va.id, fd);
      if (result.error) {
        setError(result.error);
      } else {
        onSuccess();
      }
    });
  }

  return (
    <div className="va-modal-overlay" onClick={handleOverlayClick}>
      <div className="va-modal">
        <div className="va-modal-header">
          <h2 className="va-modal-title">Edit VA</h2>
          <button className="va-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="va-modal-body">
          {error && (
            <div className="auth-error" role="alert" style={{ marginBottom: "var(--sp-3)" }}>
              {error}
            </div>
          )}

          {/* Profile picture */}
          <div className="form-group">
            <label className="form-label">Profile Picture</label>
            <div
              className="va-img-upload"
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Preview" className="va-img-preview" />
              ) : (
                <>
                  <Upload size={24} className="va-img-upload-icon" />
                  <p className="va-img-upload-hint">Click to upload a photo</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          <div className="va-form-grid">
            <div className="form-group">
              <label className="form-label">
                Name <span className="req-star">*</span>
              </label>
              <input
                className="form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Email <span className="req-star">*</span>
              </label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
              />
            </div>

            <div className="form-group va-form-full">
              <label className="form-label">
                Niche <span className="req-star">*</span>
              </label>
              <input
                className="form-input"
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Executive Assistance, Social Media"
              />
            </div>

            <div className="form-group va-form-full">
              <label className="form-label">Bio</label>
              <textarea
                className="form-textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us all about this VA - background, strengths, work style..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input
                className="form-input"
                type="number"
                min={0}
                value={yearsExp}
                onChange={(e) => setYearsExp(e.target.value)}
                placeholder="e.g. 5"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Past Clients</label>
              <input
                className="form-input"
                type="number"
                min={0}
                value={pastClients}
                onChange={(e) => setPastClients(e.target.value)}
                placeholder="e.g. 12"
              />
            </div>

            <div className="form-group">
              <label className="form-label">IQ</label>
              <input
                className="form-input"
                type="number"
                min={0}
                value={iq}
                onChange={(e) => setIq(e.target.value)}
                placeholder="e.g. 120"
              />
            </div>

            <div className="form-group">
              <label className="form-label">English Score</label>
              <input
                className="form-input"
                type="text"
                value={englishScore}
                onChange={(e) => setEnglishScore(e.target.value)}
                placeholder="e.g. C2, 8.5, 95%"
              />
            </div>

            <div className="form-group va-form-full">
              <label className="form-label">Portfolio Link</label>
              <input
                className="form-input"
                type="url"
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facebook Link</label>
              <input
                className="form-input"
                type="url"
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn Link</label>
              <input
                className="form-input"
                type="url"
                value={linkedinLink}
                onChange={(e) => setLinkedinLink(e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </div>

        <div className="va-modal-footer">
          <button
            className="btn btn-outline btn-sm"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
