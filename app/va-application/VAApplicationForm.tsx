"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import VideoRecorder from "./VideoRecorder";
import { saveApplication } from "./actions";

const ANSWER_QUESTION =
  "Which do you prefer: on time but wrong, or late but right? Why?";

type UploadState = "idle" | "uploading" | "success" | "error";

async function uploadVideoBlob(blob: Blob, label: string): Promise<string> {
  const supabase = createClient();
  const ext = blob.type.includes("mp4") ? "mp4" : "webm";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${label}.${ext}`;
  const { error } = await supabase.storage
    .from("va-videos")
    .upload(path, blob, {
      contentType: blob.type || "video/webm",
      cacheControl: "3600",
      upsert: false,
    });
  if (error) throw new Error(`Failed to upload ${label} video: ${error.message}`);
  const {
    data: { publicUrl },
  } = supabase.storage.from("va-videos").getPublicUrl(path);
  return publicUrl;
}

export default function VAApplicationForm() {
  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [specialization, setSpecialization] = useState("");

  // Video blobs
  const [introBlob, setIntroBlob] = useState<Blob | null>(null);
  const [skillsBlob, setSkillsBlob] = useState<Blob | null>(null);
  const [answerBlob, setAnswerBlob] = useState<Blob | null>(null);

  // Submission state
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadStep, setUploadStep] = useState("");
  const [formError, setFormError] = useState("");

  function validateEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    // Validate required fields
    if (!fullName.trim()) return setFormError("Full name is required.");
    if (!email.trim()) return setFormError("Email address is required.");
    if (!validateEmail(email.trim()))
      return setFormError("Please enter a valid email address.");
    if (!introBlob)
      return setFormError("Please record your intro video before submitting.");
    if (!skillsBlob)
      return setFormError("Please record your skills video before submitting.");
    if (!answerBlob)
      return setFormError(
        "Please record your answer video before submitting."
      );

    setUploadState("uploading");

    try {
      setUploadStep("Uploading intro video (1 of 3)...");
      const introUrl = await uploadVideoBlob(introBlob, "intro");

      setUploadStep("Uploading skills video (2 of 3)...");
      const skillsUrl = await uploadVideoBlob(skillsBlob, "skills");

      setUploadStep("Uploading answer video (3 of 3)...");
      const answerUrl = await uploadVideoBlob(answerBlob, "answer");

      setUploadStep("Saving your application...");
      const result = await saveApplication({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
        years_experience: yearsExp || undefined,
        specialization: specialization.trim() || undefined,
        intro_video_url: introUrl,
        skills_video_url: skillsUrl,
        answer_video_url: answerUrl,
      });

      if (result.error) throw new Error(result.error);
      setUploadState("success");
    } catch (err) {
      setFormError(
        (err as Error).message ||
          "Something went wrong. Please try again or contact us."
      );
      setUploadState("error");
    }
  }

  if (uploadState === "success") {
    return (
      <div
        className="card"
        style={{
          textAlign: "center",
          padding: "56px var(--sp-4)",
          marginTop: "var(--sp-3)",
        }}
      >
        <CheckCircle
          size={56}
          color="var(--color-accent)"
          style={{ margin: "0 auto 20px" }}
        />
        <h2 style={{ margin: "0 0 var(--sp-2)", fontSize: "1.6rem" }}>
          Application submitted!
        </h2>
        <p
          style={{
            color: "var(--color-text-secondary)",
            maxWidth: 380,
            margin: "0 auto",
            lineHeight: 1.65,
          }}
        >
          Thank you for applying to the Corvanta VA network. We review every
          application and will be in touch via email within a few business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Personal info */}
      <div className="card" style={{ marginBottom: "var(--sp-3)" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            margin: "0 0 var(--sp-3)",
          }}
        >
          Your Information
        </h2>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Full Name <span style={{ color: "var(--color-error)" }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={uploadState === "uploading"}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Email Address <span style={{ color: "var(--color-error)" }}>*</span>
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={uploadState === "uploading"}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Phone (optional)</label>
            <input
              type="tel"
              className="form-input"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={uploadState === "uploading"}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Country / Location (optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Philippines"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={uploadState === "uploading"}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Years of VA Experience (optional)
            </label>
            <select
              className="form-select"
              value={yearsExp}
              onChange={(e) => setYearsExp(e.target.value)}
              disabled={uploadState === "uploading"}
            >
              <option value="">Select...</option>
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1-2 years">1-2 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Primary Specialization (optional)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Executive Assistance, Social Media"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              disabled={uploadState === "uploading"}
            />
          </div>
        </div>
      </div>

      {/* Video questions */}
      <div className="card" style={{ marginBottom: "var(--sp-3)" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            margin: "0 0 6px",
          }}
        >
          Video Questions
        </h2>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "0.9rem",
            margin: "0 0 var(--sp-4)",
          }}
        >
          Record each answer directly in your browser using your camera and
          microphone. You have up to 30 seconds per question and 2 attempts per
          question.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          {/* Divider helper */}
          <div>
            <div
              style={{
                height: 1,
                background: "var(--color-border)",
                marginBottom: "var(--sp-3)",
              }}
            />
            <VideoRecorder
              questionLabel="Video 1 - Introduce yourself"
              questionText={undefined}
              onRecorded={(blob) => setIntroBlob(blob)}
            />
          </div>

          <div>
            <div
              style={{
                height: 1,
                background: "var(--color-border)",
                marginBottom: "var(--sp-3)",
              }}
            />
            <VideoRecorder
              questionLabel="Video 2 - Describe your skills and experience"
              questionText={undefined}
              onRecorded={(blob) => setSkillsBlob(blob)}
            />
          </div>

          <div>
            <div
              style={{
                height: 1,
                background: "var(--color-border)",
                marginBottom: "var(--sp-3)",
              }}
            />
            <VideoRecorder
              questionLabel="Video 3 - Answer the following question"
              questionText={ANSWER_QUESTION}
              onRecorded={(blob) => setAnswerBlob(blob)}
            />
          </div>
        </div>
      </div>

      {/* Errors */}
      {formError && (
        <div
          style={{
            marginBottom: "var(--sp-2)",
            padding: "10px 14px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 8,
            color: "var(--color-error)",
            fontSize: "0.875rem",
          }}
        >
          {formError}
        </div>
      )}

      {/* Upload progress */}
      {uploadState === "uploading" && (
        <div
          style={{
            marginBottom: "var(--sp-2)",
            padding: "12px 16px",
            background: "rgba(15,118,110,0.06)",
            border: "1px solid rgba(15,118,110,0.2)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: "0.875rem",
            color: "var(--color-accent)",
            fontWeight: 600,
          }}
        >
          <Loader2
            size={16}
            style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}
          />
          {uploadStep}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={uploadState === "uploading"}
        style={{ marginBottom: "var(--sp-4)" }}
      >
        {uploadState === "uploading" ? (
          <>
            <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} />
            Submitting...
          </>
        ) : (
          <>
            Submit Application <ArrowRight size={18} />
          </>
        )}
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
