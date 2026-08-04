"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ArrowLeft, Upload, CheckCircle, Loader2, Video, Camera, Clock, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import VideoRecorder from "./VideoRecorder";
import { saveApplication } from "./actions";

// ─── Constants ─────────────────────────────────────────────────────────────

const TOTAL_STEPS = 7;

const STEP_LABELS: Record<number, string> = {
  0: "Introduction",
  1: "Personal Information",
  2: "Professional Background",
  3: "Profile & Links",
  4: "Video - Introduce Yourself",
  5: "Video - Your Skills",
  6: "Video - Answer Question",
};

const ANSWER_QUESTION =
  "Which do you prefer: on time but wrong, or late but right? Why?";

// ─── Helpers ───────────────────────────────────────────────────────────────

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

async function uploadFile(file: File, label: string): Promise<string> {
  const sb = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${label}.${ext}`;
  const { error } = await sb.storage
    .from("va-videos")
    .upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: false });
  if (error) throw new Error(`Failed to upload ${label}: ${error.message}`);
  const { data: { publicUrl } } = sb.storage.from("va-videos").getPublicUrl(path);
  return publicUrl;
}

async function uploadBlob(blob: Blob, label: string): Promise<string> {
  const sb = createClient();
  const ext = blob.type.includes("mp4") ? "mp4" : "webm";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${label}.${ext}`;
  const { error } = await sb.storage
    .from("va-videos")
    .upload(path, blob, { contentType: blob.type || "video/webm", cacheControl: "3600", upsert: false });
  if (error) throw new Error(`Failed to upload ${label}: ${error.message}`);
  const { data: { publicUrl } } = sb.storage.from("va-videos").getPublicUrl(path);
  return publicUrl;
}

// ─── BlobPreview ───────────────────────────────────────────────────────────

function BlobPreview({ blob, onClear }: { blob: Blob; onClear: () => void }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);

  if (!url) return null;

  return (
    <div>
      <video
        src={url}
        controls
        playsInline
        style={{
          width: "100%",
          borderRadius: 10,
          background: "#000",
          display: "block",
          maxHeight: 280,
        }}
      />
      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          background: "#E6F7EF",
          borderRadius: 8,
        }}
      >
        <CheckCircle size={16} color="#166534" />
        <span style={{ fontSize: "0.85rem", color: "#166534", fontWeight: 600, flex: 1 }}>
          Recording saved
        </span>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onClear}
        >
          Re-record
        </button>
      </div>
    </div>
  );
}

// ─── Main Wizard ───────────────────────────────────────────────────────────

export default function VAApplicationWizard() {
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState("");

  // Personal
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Professional
  const [specialization, setSpecialization] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [pastClients, setPastClients] = useState("");
  const [englishProf, setEnglishProf] = useState("");
  const [skills, setSkills] = useState("");

  // Profile & Links
  const [bio, setBio] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");

  // Video blobs + re-record keys
  const [introBlob, setIntroBlob] = useState<Blob | null>(null);
  const [skillsBlob, setSkillsBlob] = useState<Blob | null>(null);
  const [answerBlob, setAnswerBlob] = useState<Blob | null>(null);
  const [introKey, setIntroKey] = useState(0);
  const [skillsKey, setSkillsKey] = useState(0);
  const [answerKey, setAnswerKey] = useState(0);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState("");
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ── Photo handler
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhoto(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }

  // ── Validation
  function validate(): string | null {
    switch (step) {
      case 0:
        return null;
      case 1:
        if (!fullName.trim()) return "Full name is required.";
        if (!email.trim()) return "Email address is required.";
        if (!isValidEmail(email.trim())) return "Please enter a valid email address.";
        if (!phone.trim()) return "Phone/WhatsApp number is required.";
        if (!location.trim()) return "Country/Location is required.";
        if (!profilePhoto) return "Profile photo is required.";
        return null;
      case 2:
        if (!specialization.trim()) return "Niche/Specialization is required.";
        if (!yearsExp) return "Years of experience is required.";
        if (!pastClients.trim()) return "Number of past clients is required.";
        if (!englishProf) return "English proficiency is required.";
        if (!skills.trim()) return "Skills/tools are required.";
        return null;
      case 3:
        if (!bio.trim()) return "Bio/About is required.";
        if (!portfolioLink.trim()) return "Portfolio link is required.";
        if (!linkedinLink.trim()) return "LinkedIn link is required.";
        if (!facebookLink.trim()) return "Facebook link is required.";
        return null;
      case 4:
        if (!introBlob) return "Please record your intro video before continuing.";
        return null;
      case 5:
        if (!skillsBlob) return "Please record your skills video before continuing.";
        return null;
      case 6:
        if (!answerBlob) return "Please record your answer video before continuing.";
        return null;
    }
    return null;
  }

  // ── Navigation
  function handleNext() {
    const err = validate();
    if (err) {
      setStepError(err);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setStepError("");
    if (step === 6) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    setStepError("");
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Submit
  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    try {
      setSubmitProgress("Uploading profile photo (1 of 4)...");
      const photoUrl = await uploadFile(profilePhoto!, "photo");

      setSubmitProgress("Uploading intro video (2 of 4)...");
      const introUrl = await uploadBlob(introBlob!, "intro");

      setSubmitProgress("Uploading skills video (3 of 4)...");
      const skillsUrl = await uploadBlob(skillsBlob!, "skills");

      setSubmitProgress("Uploading answer video (4 of 4)...");
      const answerUrl = await uploadBlob(answerBlob!, "answer");

      setSubmitProgress("Saving your application...");
      const result = await saveApplication({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
        profile_photo_url: photoUrl,
        specialization: specialization.trim(),
        years_experience: yearsExp,
        past_clients: pastClients.trim(),
        english_proficiency: englishProf,
        skills: skills.trim(),
        bio: bio.trim(),
        portfolio_link: portfolioLink.trim(),
        linkedin_link: linkedinLink.trim(),
        facebook_link: facebookLink.trim(),
        intro_video_url: introUrl,
        skills_video_url: skillsUrl,
        answer_video_url: answerUrl,
      });

      if (result.error) throw new Error(result.error);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        (err as Error).message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
      setSubmitProgress("");
    }
  }

  // ── Thank you screen
  if (done) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#FAFAFA",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
        }}
      >
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(15,118,110,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--color-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle size={22} color="#fff" strokeWidth={2.5} />
            </div>
          </div>
          <Image
            src="/logo.png"
            alt="Corvanta"
            width={32}
            height={32}
            style={{ margin: "0 auto 16px" }}
          />
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--color-text-primary)",
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
            }}
          >
            Application submitted!
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "1rem",
              lineHeight: 1.7,
              margin: "0 auto",
              maxWidth: 420,
            }}
          >
            Thank you for applying to join the Corvanta Virtual Assistant
            network. Our team reviews every application carefully and will email
            you your score and application status within 3 business days.
          </p>
        </div>
      </div>
    );
  }

  // ── Progress bar values
  const displayStep = step + 1; // 1-based
  const progressPct = Math.round((displayStep / TOTAL_STEPS) * 100);

  // ── Field style helpers
  const fieldStyle = {
    marginBottom: 20,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAFAFA",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @keyframes wizardFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Top bar ── */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--color-border)",
          padding: "14px 24px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: step > 0 ? 14 : 0,
            }}
          >
            <Image src="/logo.png" alt="Corvanta" width={28} height={28} />
            <span
              style={{
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "var(--color-text-primary)",
              }}
            >
              Corvanta Virtual Solutions
            </span>
          </div>

          {/* Progress */}
          {step > 0 && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "var(--color-accent)",
                  }}
                >
                  Step {displayStep} of {TOTAL_STEPS}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  background: "var(--color-border)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: "var(--color-accent)",
                    borderRadius: 3,
                    transition: "width 0.35s ease",
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div
        style={{
          flex: 1,
          padding: "32px 16px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 620,
            animation: "wizardFadeIn 0.3s ease both",
          }}
          key={step}
        >
          {/* Step error */}
          {stepError && (
            <div
              style={{
                marginBottom: 20,
                padding: "12px 16px",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 10,
                color: "var(--color-error)",
                fontSize: "0.875rem",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              {stepError}
            </div>
          )}

          {/* ── STEP 0: Introduction ── */}
          {step === 0 && (
            <div>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 32,
                  paddingTop: 8,
                }}
              >
                <h1
                  style={{
                    fontSize: "clamp(1.5rem, 5vw, 2rem)",
                    fontWeight: 800,
                    color: "var(--color-text-primary)",
                    margin: "0 0 12px",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  Apply to Join the Corvanta VA Network
                </h1>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "1rem",
                    lineHeight: 1.65,
                    maxWidth: 500,
                    margin: "0 auto",
                  }}
                >
                  Corvanta Virtual Solutions connects skilled Virtual Assistants
                  with growing businesses across the US. We vet every applicant
                  so our clients get the best - and our VAs get quality
                  long-term placements.
                </p>
              </div>

              <div className="card" style={{ marginBottom: 20 }}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    margin: "0 0 16px",
                    color: "var(--color-text-primary)",
                  }}
                >
                  What to expect
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {[
                    {
                      icon: <Upload size={18} />,
                      title: "Personal & professional details",
                      desc: "A short form covering your background, skills, and links.",
                    },
                    {
                      icon: <Video size={18} />,
                      title: "3 live-recorded video questions",
                      desc:
                        "Each video is recorded directly in your browser - 30 seconds max, 2 attempts per question.",
                    },
                    {
                      icon: <Clock size={18} />,
                      title: "Response within 3 business days",
                      desc:
                        "Our team reviews every application and emails you your score and status.",
                    },
                  ].map(({ icon, title, desc }) => (
                    <div
                      key={title}
                      style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "rgba(15,118,110,0.08)",
                          color: "var(--color-accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {icon}
                      </div>
                      <div>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            margin: "0 0 3px",
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {title}
                        </p>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--color-text-secondary)",
                            margin: 0,
                            lineHeight: 1.55,
                          }}
                        >
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="card"
                style={{
                  background: "rgba(15,118,110,0.05)",
                  border: "1px solid rgba(15,118,110,0.2)",
                  marginBottom: 28,
                }}
              >
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    margin: "0 0 10px",
                    color: "var(--color-accent)",
                  }}
                >
                  Before you start - make sure you have:
                </h4>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    fontSize: "0.875rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.8,
                  }}
                >
                  <li>A working camera and microphone</li>
                  <li>Good lighting (face a window or a lamp)</li>
                  <li>A quiet space with minimal background noise</li>
                  <li>10-15 minutes of uninterrupted time</li>
                </ul>
              </div>
            </div>
          )}

          {/* ── STEP 1: Personal Information ── */}
          {step === 1 && (
            <div className="card">
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  margin: "0 0 4px",
                }}
              >
                Personal Information
              </h2>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                  margin: "0 0 24px",
                }}
              >
                All fields are required.
              </p>

              <div className="form-row">
                <div style={fieldStyle}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Jane Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div style={fieldStyle}>
                  <label className="form-label">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label className="form-label">Country / Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Philippines"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div style={fieldStyle}>
                <label className="form-label">Profile Photo</label>
                <div
                  onClick={() => photoInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && photoInputRef.current?.click()
                  }
                  style={{
                    border: "2px dashed var(--color-border)",
                    borderRadius: 12,
                    padding: "24px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--color-accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--color-border)")
                  }
                >
                  {photoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoPreview}
                      alt="Preview"
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "var(--color-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Camera size={24} color="var(--color-text-secondary)" />
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {photoPreview
                      ? "Click to change photo"
                      : "Click to upload a profile photo"}
                  </span>
                  {profilePhoto && (
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--color-accent)",
                        fontWeight: 600,
                      }}
                    >
                      {profilePhoto.name}
                    </span>
                  )}
                </div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
          )}

          {/* ── STEP 2: Professional Background ── */}
          {step === 2 && (
            <div className="card">
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  margin: "0 0 4px",
                }}
              >
                Professional Background
              </h2>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                  margin: "0 0 24px",
                }}
              >
                All fields are required.
              </p>

              <div style={fieldStyle}>
                <label className="form-label">Niche / Specialization</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Executive Assistance, Social Media Management"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div style={fieldStyle}>
                  <label className="form-label">Years of VA Experience</label>
                  <select
                    className="form-select"
                    value={yearsExp}
                    onChange={(e) => setYearsExp(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label className="form-label">Number of Past Clients</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 12"
                    value={pastClients}
                    onChange={(e) => setPastClients(e.target.value)}
                  />
                </div>
              </div>

              <div style={fieldStyle}>
                <label className="form-label">English Proficiency</label>
                <select
                  className="form-select"
                  value={englishProf}
                  onChange={(e) => setEnglishProf(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Native / Fluent">Native / Fluent</option>
                </select>
              </div>

              <div style={{ marginBottom: 0 }}>
                <label className="form-label">Skills &amp; Tools</label>
                <textarea
                  className="form-textarea"
                  placeholder="e.g. Google Workspace, Asana, Canva, QuickBooks, customer support..."
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Profile & Links ── */}
          {step === 3 && (
            <div className="card">
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  margin: "0 0 4px",
                }}
              >
                Profile &amp; Links
              </h2>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                  margin: "0 0 24px",
                }}
              >
                All fields are required.
              </p>

              <div style={fieldStyle}>
                <label className="form-label">Short Bio / About You</label>
                <textarea
                  className="form-textarea"
                  placeholder="Tell us about yourself, your work style, and what makes you a great VA..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                />
              </div>

              <div style={fieldStyle}>
                <label className="form-label">Portfolio Link</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://yourportfolio.com"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div style={fieldStyle}>
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://linkedin.com/in/..."
                    value={linkedinLink}
                    onChange={(e) => setLinkedinLink(e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label className="form-label">Facebook</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://facebook.com/..."
                    value={facebookLink}
                    onChange={(e) => setFacebookLink(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Video 1 ── */}
          {step === 4 && (
            <div className="card">
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  margin: "0 0 4px",
                }}
              >
                Video Question 1 of 3
              </h2>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                  margin: "0 0 20px",
                }}
              >
                30 seconds max - 2 attempts. Record directly in your browser.
              </p>
              {introBlob ? (
                <BlobPreview
                  blob={introBlob}
                  onClear={() => {
                    setIntroBlob(null);
                    setIntroKey((k) => k + 1);
                  }}
                />
              ) : (
                <VideoRecorder
                  key={`intro-${introKey}`}
                  questionLabel="Introduce yourself"
                  onRecorded={(blob) => {
                    if (blob) setIntroBlob(blob);
                  }}
                />
              )}
            </div>
          )}

          {/* ── STEP 5: Video 2 ── */}
          {step === 5 && (
            <div className="card">
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  margin: "0 0 4px",
                }}
              >
                Video Question 2 of 3
              </h2>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                  margin: "0 0 20px",
                }}
              >
                30 seconds max - 2 attempts. Record directly in your browser.
              </p>
              {skillsBlob ? (
                <BlobPreview
                  blob={skillsBlob}
                  onClear={() => {
                    setSkillsBlob(null);
                    setSkillsKey((k) => k + 1);
                  }}
                />
              ) : (
                <VideoRecorder
                  key={`skills-${skillsKey}`}
                  questionLabel="Describe your skills and experience"
                  onRecorded={(blob) => {
                    if (blob) setSkillsBlob(blob);
                  }}
                />
              )}
            </div>
          )}

          {/* ── STEP 6: Video 3 ── */}
          {step === 6 && (
            <div className="card">
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  margin: "0 0 4px",
                }}
              >
                Video Question 3 of 3
              </h2>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                  margin: "0 0 20px",
                }}
              >
                30 seconds max - 2 attempts. Record directly in your browser.
              </p>
              {answerBlob ? (
                <BlobPreview
                  blob={answerBlob}
                  onClear={() => {
                    setAnswerBlob(null);
                    setAnswerKey((k) => k + 1);
                  }}
                />
              ) : (
                <VideoRecorder
                  key={`answer-${answerKey}`}
                  questionLabel="Answer the following question"
                  questionText={ANSWER_QUESTION}
                  onRecorded={(blob) => {
                    if (blob) setAnswerBlob(blob);
                  }}
                />
              )}
            </div>
          )}

          {/* ── Submit error / progress ── */}
          {submitError && (
            <div
              style={{
                marginTop: 16,
                padding: "12px 16px",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 10,
                color: "var(--color-error)",
                fontSize: "0.875rem",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              {submitError}
            </div>
          )}

          {submitting && (
            <div
              style={{
                marginTop: 16,
                padding: "12px 16px",
                background: "rgba(15,118,110,0.06)",
                border: "1px solid rgba(15,118,110,0.2)",
                borderRadius: 10,
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
              {submitProgress}
            </div>
          )}

          {/* ── Navigation ── */}
          <div
            style={{
              display: "flex",
              justifyContent: step === 0 ? "flex-end" : "space-between",
              alignItems: "center",
              marginTop: 24,
              gap: 12,
            }}
          >
            {step > 0 && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleBack}
                disabled={submitting}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
              disabled={submitting}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  Submitting...
                </>
              ) : step === 0 ? (
                <>Start Application <ArrowRight size={16} /></>
              ) : step === 6 ? (
                <>Submit Application <ArrowRight size={16} /></>
              ) : (
                <>Next <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
