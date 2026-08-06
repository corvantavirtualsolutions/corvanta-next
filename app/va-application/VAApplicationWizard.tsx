"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ArrowLeft, CheckCircle, Loader2, Video, Clock, AlertCircle, Camera, Upload, Square } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import VideoRecorder from "./VideoRecorder";
import { saveApplication } from "./actions";

// ─── Constants ──────────────────────────────────────────────────────────────

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

const NICHE_OPTIONS = [
  "Executive Assistance",
  "Administrative Support",
  "Social Media Management",
  "Bookkeeping / Accounting",
  "Customer Support",
  "Content / Copywriting",
  "Data Entry & Research",
  "E-commerce Support",
  "Technical Support",
  "Project Management",
  "Scheduling & Calendar Management",
  "Other",
];

const SKILL_OPTIONS = [
  "Email & Calendar Management",
  "Data Entry",
  "Canva",
  "Microsoft Office",
  "Google Workspace",
  "Social Media Management",
  "Bookkeeping / QuickBooks",
  "Customer Support",
  "CRM Tools (HubSpot, Salesforce, etc.)",
  "Copywriting / Content Writing",
  "Scheduling & Calendar Management",
  "Project Management (Asana / Trello)",
  "Research",
  "Email Marketing",
  "Video Editing",
  "WordPress / Website Management",
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function isValidUrl(s: string) {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
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

// ─── BlobPreview ─────────────────────────────────────────────────────────────

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
        style={{ width: "100%", borderRadius: 10, background: "#000", display: "block", maxHeight: 280 }}
      />
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#E6F7EF", borderRadius: 8 }}>
        <CheckCircle size={16} color="#166534" />
        <span style={{ fontSize: "0.85rem", color: "#166534", fontWeight: 600, flex: 1 }}>Recording saved</span>
        <button type="button" className="btn btn-outline btn-sm" onClick={onClear}>Re-record</button>
      </div>
    </div>
  );
}

// ─── TestModal (blank placeholder) ───────────────────────────────────────────

function TestModal({ title, onClose }: { title: string; onClose: () => void }) {
  function handleOverlay(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }
  return (
    <div
      onClick={handleOverlay}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(2px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 520,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--color-text-primary)" }}>
            {title}
          </h2>
        </div>
        <div
          style={{
            flex: 1,
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "var(--color-text-secondary)",
            minHeight: 220,
          }}
        >
          <Clock size={40} strokeWidth={1.5} color="var(--color-border)" />
          <p style={{ margin: 0, fontSize: "0.95rem", textAlign: "center" }}>
            Test content coming soon.
          </p>
        </div>
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Wizard ─────────────────────────────────────────────────────────────

export default function VAApplicationWizard() {
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState("");

  // Personal
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Professional
  const [nichePick, setNichePick] = useState("");
  const [nicheOther, setNicheOther] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [pastClients, setPastClients] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [otherSkillChecked, setOtherSkillChecked] = useState(false);
  const [otherSkillText, setOtherSkillText] = useState("");
  const [englishDone, setEnglishDone] = useState(false);
  const [iqDone, setIqDone] = useState(false);
  const [showEnglishModal, setShowEnglishModal] = useState(false);
  const [showIqModal, setShowIqModal] = useState(false);

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

  // ── Skills toggle
  function toggleSkill(skill: string) {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
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
        if (!city.trim()) return "City is required.";
        if (!country.trim()) return "Country is required.";
        if (!profilePhoto) return "Profile photo is required.";
        return null;
      case 2: {
        const niche = nichePick === "Other" ? nicheOther.trim() : nichePick;
        if (!niche) return "Niche/Specialization is required.";
        if (!yearsExp) return "Years of experience is required.";
        if (!pastClients.trim()) return "Number of past clients is required.";
        if (!englishDone) return "Please complete the English Proficiency Test before continuing.";
        if (!iqDone) return "Please complete the IQ Check before continuing.";
        const skillCount = selectedSkills.size + (otherSkillChecked && otherSkillText.trim() ? 1 : 0);
        if (skillCount === 0) return "Please select at least one skill or tool.";
        return null;
      }
      case 3:
        if (!bio.trim()) return "Bio/About is required.";
        if (!portfolioLink.trim()) return "Portfolio link is required.";
        if (!isValidUrl(portfolioLink.trim())) return "Portfolio link must be a valid URL (e.g. https://yourportfolio.com).";
        if (!linkedinLink.trim()) return "LinkedIn link is required.";
        if (!isValidUrl(linkedinLink.trim())) return "LinkedIn link must be a valid URL (e.g. https://linkedin.com/in/...).";
        if (!facebookLink.trim()) return "Facebook link is required.";
        if (!isValidUrl(facebookLink.trim())) return "Facebook link must be a valid URL (e.g. https://facebook.com/...).";
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

      const skillsList = [
        ...Array.from(selectedSkills),
        ...(otherSkillChecked && otherSkillText.trim() ? [otherSkillText.trim()] : []),
      ];

      const result = await saveApplication({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: `${city.trim()}, ${country.trim()}`,
        profile_photo_url: photoUrl,
        specialization: nichePick === "Other" ? nicheOther.trim() : nichePick,
        years_experience: yearsExp,
        past_clients: pastClients.trim(),
        english_proficiency: "Completed",
        skills: skillsList.join(", "),
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
      setSubmitError((err as Error).message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setSubmitProgress("");
    }
  }

  // ── Thank-you screen
  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(15,118,110,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={22} color="#fff" strokeWidth={2.5} />
            </div>
          </div>
          <Image src="/logo.png" alt="Corvanta" width={32} height={32} style={{ margin: "0 auto 16px" }} />
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-text-primary)", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            Application submitted!
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "1rem", lineHeight: 1.7, margin: "0 auto", maxWidth: 420 }}>
            Thank you for applying to join the Corvanta Virtual Assistant network. Our team reviews every application carefully and will email you your score and application status within 3 business days.
          </p>
        </div>
      </div>
    );
  }

  const displayStep = step + 1;
  const progressPct = Math.round((displayStep / TOTAL_STEPS) * 100);

  const fieldStyle = { marginBottom: 20 };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "var(--color-text-primary)",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes wizardFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--color-border)", padding: "12px 20px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: step > 0 ? 12 : 0 }}>
            <Image src="/logo.png" alt="Corvanta" width={26} height={26} />
            <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--color-text-primary)" }}>
              Corvanta Virtual Solutions
            </span>
          </div>
          {step > 0 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--color-accent)" }}>
                  Step {displayStep} of {TOTAL_STEPS}
                </span>
                <span style={{ fontSize: "0.74rem", color: "var(--color-text-secondary)", fontWeight: 500 }}>
                  {STEP_LABELS[step]}
                </span>
              </div>
              <div style={{ height: 4, background: "var(--color-border)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progressPct}%`, background: "var(--color-accent)", borderRadius: 3, transition: "width 0.35s ease" }} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, padding: "24px 16px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 620, animation: "wizardFadeIn 0.3s ease both" }} key={step}>

          {/* Step error */}
          {stepError && (
            <div style={{ marginBottom: 16, padding: "11px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, color: "var(--color-error)", fontSize: "0.875rem", display: "flex", gap: 9, alignItems: "flex-start" }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {stepError}
            </div>
          )}

          {/* ── STEP 0: Introduction ── */}
          {step === 0 && (
            <div>
              {/* Logo + name + title - centered */}
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
                  <Image src="/logo.png" alt="Corvanta" width={34} height={34} />
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
                    Corvanta Virtual Solutions
                  </span>
                </div>
                <h1 style={{ fontSize: "clamp(1.3rem, 5vw, 1.7rem)", fontWeight: 800, color: "var(--color-text-primary)", margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  Apply to Join the Corvanta VA Network
                </h1>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: 1.55, maxWidth: 480, margin: "0 auto" }}>
                  We vet every applicant so our clients get the best - and our VAs get quality long-term placements with US businesses.
                </p>
              </div>

              {/* What to expect - compact */}
              <div className="card" style={{ padding: "16px 18px", marginBottom: 14 }}>
                <p style={{ fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-accent)", margin: "0 0 10px" }}>
                  What to expect
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { icon: <Upload size={14} />, text: "Personal & professional details - a short background form" },
                    { icon: <Video size={14} />, text: "3 recorded video questions - 30 sec max, 2 attempts each" },
                    { icon: <Clock size={14} />, text: "Response within 3 business days via email" },
                  ].map(({ icon, text }) => (
                    <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                      <span style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: 2 }}>{icon}</span>
                      <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.45 }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before you start - compact */}
              <div style={{ background: "rgba(15,118,110,0.05)", border: "1px solid rgba(15,118,110,0.18)", borderRadius: 10, padding: "12px 16px", marginBottom: 22 }}>
                <p style={{ fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-accent)", margin: "0 0 7px" }}>
                  Before you start - have ready:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
                  {[
                    "Working camera & microphone",
                    "Good lighting (face a window)",
                    "Quiet space with no background noise",
                    "10-15 minutes uninterrupted",
                  ].map((item) => (
                    <span key={item} style={{ fontSize: "0.83rem", color: "var(--color-text-secondary)", display: "flex", alignItems: "flex-start", gap: 5 }}>
                      <span style={{ color: "var(--color-accent)", fontWeight: 700, flexShrink: 0 }}>-</span>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1: Personal Information ── */}
          {step === 1 && (
            <div className="card">
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 4px" }}>Personal Information</h2>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: "0 0 24px" }}>All fields are required.</p>

              <div className="form-row">
                <div style={fieldStyle}>
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="Jane Smith" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div style={fieldStyle}>
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div style={fieldStyle}>
                <label className="form-label">Phone / WhatsApp</label>
                <input type="tel" className="form-input" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="form-row">
                <div style={fieldStyle}>
                  <label className="form-label">City</label>
                  <input type="text" className="form-input" placeholder="e.g. Manila" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div style={fieldStyle}>
                  <label className="form-label">Country</label>
                  <input type="text" className="form-input" placeholder="e.g. Philippines" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
              </div>

              <div style={fieldStyle}>
                <label className="form-label">Profile Photo</label>
                <div
                  onClick={() => photoInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && photoInputRef.current?.click()}
                  style={{ border: "2px dashed var(--color-border)", borderRadius: 12, padding: "20px 16px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                >
                  {photoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoPreview} alt="Preview" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Camera size={22} color="var(--color-text-secondary)" />
                    </div>
                  )}
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    {photoPreview ? "Click to change photo" : "Click to upload a profile photo"}
                  </span>
                  {profilePhoto && (
                    <span style={{ fontSize: "0.78rem", color: "var(--color-accent)", fontWeight: 600 }}>{profilePhoto.name}</span>
                  )}
                </div>
                <input ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
              </div>
            </div>
          )}

          {/* ── STEP 2: Professional Background ── */}
          {step === 2 && (
            <div className="card">
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 4px" }}>Professional Background</h2>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: "0 0 24px" }}>All fields are required.</p>

              {/* Niche dropdown */}
              <div style={fieldStyle}>
                <label className="form-label">Niche / Specialization</label>
                <select
                  className="form-select"
                  value={nichePick}
                  onChange={(e) => setNichePick(e.target.value)}
                >
                  <option value="">Select a specialization...</option>
                  {NICHE_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                {nichePick === "Other" && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Describe your specialization"
                    value={nicheOther}
                    onChange={(e) => setNicheOther(e.target.value)}
                    style={{ marginTop: 10 }}
                  />
                )}
              </div>

              <div className="form-row">
                <div style={fieldStyle}>
                  <label className="form-label">Years of VA Experience</label>
                  <select className="form-select" value={yearsExp} onChange={(e) => setYearsExp(e.target.value)}>
                    <option value="">Select...</option>
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label className="form-label">Number of Past Clients</label>
                  <input type="text" className="form-input" placeholder="e.g. 12" value={pastClients} onChange={(e) => setPastClients(e.target.value)} />
                </div>
              </div>

              {/* English Proficiency Test */}
              <div style={fieldStyle}>
                <label className="form-label">English Proficiency</label>
                {englishDone ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#E6F7EF", borderRadius: 8, fontSize: "0.875rem", color: "#166534", fontWeight: 600 }}>
                    <CheckCircle size={16} color="#166534" />
                    English Proficiency score is added
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowEnglishModal(true)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
                  >
                    Take English Proficiency Test
                  </button>
                )}
              </div>

              {/* IQ Check */}
              <div style={fieldStyle}>
                <label className="form-label">Check IQ</label>
                {iqDone ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#E6F7EF", borderRadius: 8, fontSize: "0.875rem", color: "#166534", fontWeight: 600 }}>
                    <CheckCircle size={16} color="#166534" />
                    IQ score is added
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowIqModal(true)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
                  >
                    Check IQ
                  </button>
                )}
              </div>

              {/* Skills checkboxes */}
              <div style={{ marginBottom: 0 }}>
                <label className="form-label">Skills &amp; Tools</label>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", margin: "0 0 12px" }}>Select all that apply.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
                  {SKILL_OPTIONS.map((skill) => (
                    <label
                      key={skill}
                      style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", fontSize: "0.875rem", color: "var(--color-text-primary)", lineHeight: 1.4 }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.has(skill)}
                        onChange={() => toggleSkill(skill)}
                        style={{ marginTop: 2, flexShrink: 0, accentColor: "var(--color-accent)", width: 15, height: 15 }}
                      />
                      {skill}
                    </label>
                  ))}
                  {/* Other */}
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", fontSize: "0.875rem", color: "var(--color-text-primary)", lineHeight: 1.4 }}>
                    <input
                      type="checkbox"
                      checked={otherSkillChecked}
                      onChange={(e) => setOtherSkillChecked(e.target.checked)}
                      style={{ marginTop: 2, flexShrink: 0, accentColor: "var(--color-accent)", width: 15, height: 15 }}
                    />
                    Other
                  </label>
                </div>
                {otherSkillChecked && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Describe your other skill or tool"
                    value={otherSkillText}
                    onChange={(e) => setOtherSkillText(e.target.value)}
                    style={{ marginTop: 10 }}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: Profile & Links ── */}
          {step === 3 && (
            <div className="card">
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 4px" }}>Profile &amp; Links</h2>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: "0 0 24px" }}>All fields are required. Links must be valid URLs.</p>

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
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 4px" }}>Video Question 1 of 3</h2>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: "0 0 20px" }}>30 seconds max - 2 attempts. Record directly in your browser.</p>
              {introBlob ? (
                <BlobPreview blob={introBlob} onClear={() => { setIntroBlob(null); setIntroKey((k) => k + 1); }} />
              ) : (
                <VideoRecorder key={`intro-${introKey}`} questionLabel="Introduce yourself" onRecorded={(blob) => { if (blob) setIntroBlob(blob); }} />
              )}
            </div>
          )}

          {/* ── STEP 5: Video 2 ── */}
          {step === 5 && (
            <div className="card">
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 4px" }}>Video Question 2 of 3</h2>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: "0 0 20px" }}>30 seconds max - 2 attempts. Record directly in your browser.</p>
              {skillsBlob ? (
                <BlobPreview blob={skillsBlob} onClear={() => { setSkillsBlob(null); setSkillsKey((k) => k + 1); }} />
              ) : (
                <VideoRecorder key={`skills-${skillsKey}`} questionLabel="Describe your skills and experience" onRecorded={(blob) => { if (blob) setSkillsBlob(blob); }} />
              )}
            </div>
          )}

          {/* ── STEP 6: Video 3 ── */}
          {step === 6 && (
            <div className="card">
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 4px" }}>Video Question 3 of 3</h2>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: "0 0 20px" }}>30 seconds max - 2 attempts. Record directly in your browser.</p>
              {answerBlob ? (
                <BlobPreview blob={answerBlob} onClear={() => { setAnswerBlob(null); setAnswerKey((k) => k + 1); }} />
              ) : (
                <VideoRecorder key={`answer-${answerKey}`} questionLabel="Answer the following question" questionText={ANSWER_QUESTION} onRecorded={(blob) => { if (blob) setAnswerBlob(blob); }} />
              )}
            </div>
          )}

          {/* Submit error / progress */}
          {submitError && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, color: "var(--color-error)", fontSize: "0.875rem", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              {submitError}
            </div>
          )}

          {submitting && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(15,118,110,0.06)", border: "1px solid rgba(15,118,110,0.2)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "var(--color-accent)", fontWeight: 600 }}>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite", flexShrink: 0 }} />
              {submitProgress}
            </div>
          )}

          {/* ── Navigation ── */}
          <div style={{ display: "flex", justifyContent: step === 0 ? "flex-end" : "space-between", alignItems: "center", marginTop: 22, gap: 12 }}>
            {step > 0 && (
              <button type="button" className="btn btn-outline" onClick={handleBack} disabled={submitting} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button type="button" className="btn btn-primary" onClick={handleNext} disabled={submitting} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {submitting ? (
                <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Submitting...</>
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

      {/* ── Modals ── */}
      {showEnglishModal && (
        <TestModal
          title="English Proficiency Test"
          onClose={() => {
            setShowEnglishModal(false);
            setEnglishDone(true);
          }}
        />
      )}
      {showIqModal && (
        <TestModal
          title="IQ Check"
          onClose={() => {
            setShowIqModal(false);
            setIqDone(true);
          }}
        />
      )}
    </div>
  );
}
