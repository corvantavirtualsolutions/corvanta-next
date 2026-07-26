import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Users,
  Star,
  ArrowRight,
  Calendar,
  DollarSign,
  Home,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Apply as a VA | Corvanta",
  description:
    "Apply to join Corvanta's network of Virtual Assistants and start a flexible remote career.",
};

export default function ApplyAsVAPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-split">
          <div>
            <span className="eyebrow">
              <BadgeCheck size={14} /> Now accepting applications
            </span>
            <h1>Turn your skills into a thriving remote career</h1>
            <p className="lead">
              Join a network of skilled Virtual Assistants working with growing
              businesses across the US and beyond &mdash; on your schedule, from
              anywhere.
            </p>
            <div className="hero-actions">
              <a href="#apply-form" className="btn btn-primary btn-lg">
                Start Your Application <ArrowRight size={18} />
              </a>
              <Link href="/how-it-works" className="btn btn-outline btn-lg">
                How It Works
              </Link>
            </div>
            <div className="hero-trust">
              <span className="flex gap-1" style={{ alignItems: "center" }}>
                <Users size={16} /> 1,200+ VAs placed
              </span>
              <span className="flex gap-1" style={{ alignItems: "center" }}>
                <Star size={16} /> 4.9/5 VA satisfaction
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <Image
              src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=900&q=70"
              alt="Virtual assistant working remotely from home"
              width={900}
              height={600}
              unoptimized
            />
            <div className="floating-card fc-1">
              <div className="icon-circle icon-sm teal">
                <DollarSign size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                  Competitive pay
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                  weekly payouts
                </div>
              </div>
            </div>
            <div className="floating-card fc-2">
              <div className="icon-circle icon-sm">
                <Home size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                  100% remote
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                  work from anywhere
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Why Corvanta</span>
            <h2>Benefits built around you</h2>
            <p className="lead">
              We handle the client search so you can focus on doing great work.
            </p>
          </div>
          <div className="grid grid-4">
            {[
              {
                icon: <Calendar size={26} />,
                modifier: "",
                title: "Flexible Schedule",
                body: "Choose part-time, full-time, or project-based work that fits your life.",
              },
              {
                icon: <DollarSign size={26} />,
                modifier: "teal",
                title: "Competitive Pay",
                body: "Transparent rates with consistent, on-time weekly payouts.",
              },
              {
                icon: <Home size={26} />,
                modifier: "navy",
                title: "Work From Anywhere",
                body: "100% remote roles — all you need is a laptop and reliable internet.",
              },
              {
                icon: <TrendingUp size={26} />,
                modifier: "",
                title: "Room to Grow",
                body: "Build long-term client relationships and grow your rate over time.",
              },
            ].map((card) => (
              <div key={card.title} className="card feature-card">
                <div className={`icon-circle${card.modifier ? ` ${card.modifier}` : ""}`}>
                  {card.icon}
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section>
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Requirements</span>
            <h2>What we look for</h2>
            <p className="lead">
              We&rsquo;re looking for reliable, detail-oriented professionals
              ready to deliver great work.
            </p>
          </div>
          <div className="grid grid-2">
            <div className="card">
              <h3 style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle size={22} /> You should have
              </h3>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginTop: "var(--sp-2)",
                  color: "var(--color-text-secondary)",
                }}
              >
                <li>2+ years of relevant professional experience</li>
                <li>Reliable high-speed internet and a quiet workspace</li>
                <li>Strong written and verbal English communication</li>
                <li>Availability of at least 20 hours per week</li>
              </ul>
            </div>
            <div className="card">
              <h3 style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Star size={22} /> Specialties we&rsquo;re hiring for
              </h3>
              <div
                className="flex flex-wrap gap-1"
                style={{ marginTop: "var(--sp-2)" }}
              >
                {[
                  { label: "Admin Support", mod: "" },
                  { label: "Customer Service", mod: "badge-teal" },
                  { label: "Social Media", mod: "badge-navy" },
                  { label: "Bookkeeping", mod: "" },
                  { label: "Copywriting", mod: "badge-teal" },
                  { label: "Data Entry", mod: "badge-navy" },
                  { label: "Executive Assistance", mod: "" },
                  { label: "E-commerce", mod: "badge-teal" },
                ].map((b) => (
                  <span key={b.label} className={`badge${b.mod ? ` ${b.mod}` : ""}`}>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Our Process</span>
            <h2>From application to placement</h2>
            <p className="lead">Here&rsquo;s what to expect once you apply.</p>
          </div>
          <div className="steps">
            {[
              {
                num: "01",
                title: "Submit application",
                body: "Tell us about your experience, skills, and availability.",
              },
              {
                num: "02",
                title: "Skills assessment",
                body: "Complete a short assessment relevant to your specialty.",
              },
              {
                num: "03",
                title: "Interview",
                body: "Meet with our talent team for a live conversation.",
              },
              {
                num: "04",
                title: "Get matched",
                body: "Join our network and get matched with businesses that fit.",
              },
            ].map((step) => (
              <div key={step.num} className="step-card">
                <div className="step-number">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply-form">
        <div className="container">
          <div className="grid grid-2" style={{ gap: "var(--sp-6)" }}>
            <div>
              <span className="eyebrow">Application</span>
              <h2>Start your application</h2>
              <p className="lead">
                It only takes about 10 minutes. Our talent team reviews every
                application within 2 business days.
              </p>
            </div>
            <form className="card">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Alex Rivera"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="alex@email.com"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Specialty</label>
                  <select className="form-select">
                    <option>Admin Support</option>
                    <option>Customer Service</option>
                    <option>Social Media Management</option>
                    <option>Bookkeeping &amp; Accounting</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <select className="form-select">
                  <option>Less than 1 year</option>
                  <option>1–2 years</option>
                  <option>3–5 years</option>
                  <option>5+ years</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Resume / Portfolio Link</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://your-portfolio-link.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tell us about yourself</label>
                <textarea
                  className="form-textarea"
                  placeholder="Share your experience and what kind of work you're looking for..."
                />
              </div>
              <label className="form-check">
                <input type="checkbox" />
                I agree to the{" "}
                <Link
                  href="/terms-of-service"
                  style={{ textDecoration: "underline" }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  style={{ textDecoration: "underline" }}
                >
                  Privacy Policy
                </Link>
                .
              </label>
              <button
                type="button"
                className="btn btn-primary btn-block"
                style={{ marginTop: "var(--sp-2)" }}
              >
                Submit Application <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
