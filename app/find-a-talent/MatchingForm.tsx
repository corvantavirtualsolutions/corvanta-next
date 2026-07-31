"use client";

import { useState, useRef } from "react";
import { Search, Upload, Users } from "lucide-react";

const HELP_OPTIONS = [
  "Admin Support",
  "Customer Service",
  "Social Media Management",
  "Bookkeeping & Accounting",
  "Content & Copywriting",
  "Executive Assistance",
  "Data Entry & Research",
  "E-commerce Support",
  "Other",
];

const HOURS_OPTIONS = [
  "Part-time (10-20 hrs)",
  "Full-time (30-40 hrs)",
  "Project-based",
  "Other",
];

const BUDGET_OPTIONS = [
  "$800 - $1,200/mo",
  "$1,200 - $2,000/mo",
  "$2,000+/mo",
  "Other",
];

type Phase = "form" | "loading" | "results";

export default function MatchingForm() {
  // Form fields
  const [helpWith, setHelpWith] = useState("");
  const [helpOther, setHelpOther] = useState("");
  const [hours, setHours] = useState("");
  const [hoursCustom, setHoursCustom] = useState("");
  const [budget, setBudget] = useState("");
  const [budgetCustom, setBudgetCustom] = useState("");
  const [details, setDetails] = useState("");
  const [fileName, setFileName] = useState("");

  // Form phase
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<Phase>("form");

  const fileRef = useRef<HTMLInputElement>(null);

  function validate() {
    const errs: Record<string, string> = {};
    if (!helpWith) errs.helpWith = "Please select what you need help with.";
    if (helpWith === "Other" && !helpOther.trim())
      errs.helpOther = "Please describe what you need.";
    if (!hours) errs.hours = "Please select hours per week.";
    if (
      hours === "Other" &&
      (!hoursCustom ||
        isNaN(Number(hoursCustom)) ||
        Number(hoursCustom) <= 0)
    )
      errs.hoursCustom = "Please enter a valid number of hours.";
    if (!budget) errs.budget = "Please select a budget range.";
    if (budget === "Other" && !budgetCustom.trim())
      errs.budgetCustom = "Please enter your budget.";
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setPhase("loading");
    setTimeout(() => setPhase("results"), 3200);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  }

  return (
    <>
      {/* ── Matching Section ── */}
      <section className="fat-matching-section">
        <div className="container">

          {/* Header stays visible across all phases */}
          <div className="fat-matching-header text-center">
            <span className="eyebrow">Get Matched</span>
            <h2 className="fat-matching-title">Find your perfect Virtual Assistant</h2>
            {phase === "form" && (
              <p className="lead fat-matching-sub">
                Answer a few quick questions and we'll hand-pick vetted VAs that fit your needs - often within days.
              </p>
            )}
          </div>

          {/* Phase: form */}
          {phase === "form" && (
            <div className="matching-card">
              {/* Fields row */}
              <div className="matching-fields-row">
                {/* What do you need help with */}
                <div className="matching-field">
                  <label className="form-label">
                    What do you need help with?
                    <span className="req-star"> *</span>
                  </label>
                  <select
                    className={`form-select${errors.helpWith ? " input-error" : ""}`}
                    value={helpWith}
                    onChange={(e) => {
                      setHelpWith(e.target.value);
                      setErrors((prev) => ({ ...prev, helpWith: "" }));
                    }}
                  >
                    <option value="">Select a category...</option>
                    {HELP_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  {errors.helpWith && (
                    <span className="field-error">{errors.helpWith}</span>
                  )}
                  {helpWith === "Other" && (
                    <>
                      <input
                        type="text"
                        className={`form-input field-reveal${
                          errors.helpOther ? " input-error" : ""
                        }`}
                        placeholder="Describe what you need..."
                        value={helpOther}
                        onChange={(e) => {
                          setHelpOther(e.target.value);
                          setErrors((prev) => ({ ...prev, helpOther: "" }));
                        }}
                      />
                      {errors.helpOther && (
                        <span className="field-error">{errors.helpOther}</span>
                      )}
                    </>
                  )}
                </div>

                {/* Hours per week */}
                <div className="matching-field">
                  <label className="form-label">
                    Hours per week
                    <span className="req-star"> *</span>
                  </label>
                  <select
                    className={`form-select${errors.hours ? " input-error" : ""}`}
                    value={hours}
                    onChange={(e) => {
                      setHours(e.target.value);
                      setErrors((prev) => ({ ...prev, hours: "" }));
                    }}
                  >
                    <option value="">Select hours...</option>
                    {HOURS_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  {errors.hours && (
                    <span className="field-error">{errors.hours}</span>
                  )}
                  {hours === "Other" && (
                    <>
                      <input
                        type="number"
                        className={`form-input field-reveal${
                          errors.hoursCustom ? " input-error" : ""
                        }`}
                        placeholder="e.g. 25"
                        min={1}
                        value={hoursCustom}
                        onChange={(e) => {
                          setHoursCustom(e.target.value);
                          setErrors((prev) => ({ ...prev, hoursCustom: "" }));
                        }}
                      />
                      {errors.hoursCustom && (
                        <span className="field-error">{errors.hoursCustom}</span>
                      )}
                    </>
                  )}
                </div>

                {/* Budget range */}
                <div className="matching-field">
                  <label className="form-label">
                    Budget range
                    <span className="req-star"> *</span>
                  </label>
                  <select
                    className={`form-select${
                      errors.budget ? " input-error" : ""
                    }`}
                    value={budget}
                    onChange={(e) => {
                      setBudget(e.target.value);
                      setErrors((prev) => ({ ...prev, budget: "" }));
                    }}
                  >
                    <option value="">Select budget...</option>
                    {BUDGET_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  {errors.budget && (
                    <span className="field-error">{errors.budget}</span>
                  )}
                  {budget === "Other" && (
                    <>
                      <input
                        type="text"
                        className={`form-input field-reveal${
                          errors.budgetCustom ? " input-error" : ""
                        }`}
                        placeholder="e.g. $3,500/mo"
                        value={budgetCustom}
                        onChange={(e) => {
                          setBudgetCustom(e.target.value);
                          setErrors((prev) => ({ ...prev, budgetCustom: "" }));
                        }}
                      />
                      {errors.budgetCustom && (
                        <span className="field-error">
                          {errors.budgetCustom}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Divider */}
              <hr className="matching-divider" />

              {/* Project details + file upload */}
              <div className="matching-details-row">
                <div className="matching-details-left">
                  <label className="form-label">
                    Project details / What you're looking for{" "}
                    <span className="optional-tag">(optional)</span>
                  </label>
                  <textarea
                    className="form-textarea matching-textarea"
                    placeholder="Describe the job, skills, or experience level you're looking for..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>

                <div className="matching-details-right">
                  <label className="form-label">
                    Attach sample projects{" "}
                    <span className="optional-tag">(optional)</span>
                  </label>
                  <button
                    type="button"
                    className="file-upload-btn"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload size={20} />
                    <span>
                      {fileName ? fileName : "Click to upload a file"}
                    </span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <p className="upload-hint">PDF, DOC, or image - up to 10 MB</p>
                </div>
              </div>

              {/* Submit */}
              <div className="matching-submit-row">
                <button
                  type="button"
                  className="btn btn-primary btn-lg matching-cta"
                  onClick={handleSubmit}
                >
                  <Search size={20} />
                  Get Matched
                </button>
                <p className="matching-footnote">
                  No cost to get matched - our team will follow up within one business day.
                </p>
              </div>
            </div>
          )}

          {/* Phase: loading */}
          {phase === "loading" && (
            <div className="matching-loader-wrap">
              <div className="matching-loader-face">&#128522;</div>
              <p className="matching-loader-text">
                We're looking for vetted VAs that match your needs...
              </p>
              <div className="matching-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {/* Phase: results */}
          {phase === "results" && (
            <div className="matching-results-wrap">
              <h3 className="matching-results-title">
                Here are the VAs aligned to your needs
              </h3>
              <div className="matching-empty-state">
                <div className="matching-empty-icon">
                  <Users size={52} strokeWidth={1.25} />
                </div>
                <p className="matching-empty-msg">
                  Sorry, no matches available right now - we're growing our talent pool and will be in touch soon.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

    </>
  );
}
