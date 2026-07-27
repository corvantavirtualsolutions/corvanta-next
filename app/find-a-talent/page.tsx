import type { Metadata } from "next";
import Link from "next/link";
import {
  Inbox,
  MessageCircle,
  Share2,
  Calculator,
  PenTool,
  Database,
  Briefcase,
  ShoppingCart,
  Search,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Find a Talent | Corvanta Virtual Solutions",
  description:
    "Get matched with a vetted Virtual Assistant for your business in as little as 3 days.",
};

const categories = [
  {
    icon: <Inbox size={26} />,
    title: "Admin Support",
    body: "Calendar, inbox, and daily operations management.",
  },
  {
    icon: <MessageCircle size={26} />,
    title: "Customer Service",
    body: "Email, chat, and social support coverage.",
  },
  {
    icon: <Share2 size={26} />,
    title: "Social Media Management",
    body: "Content calendars, scheduling, and engagement.",
  },
  {
    icon: <Calculator size={26} />,
    title: "Bookkeeping & Accounting",
    body: "Invoicing, reconciliation, and reporting.",
  },
  {
    icon: <PenTool size={26} />,
    title: "Content & Copywriting",
    body: "Blog posts, email copy, and product descriptions.",
  },
  {
    icon: <Database size={26} />,
    title: "Data Entry & Research",
    body: "Data cleanup, lead research, and reporting.",
  },
  {
    icon: <Briefcase size={26} />,
    title: "Executive Assistance",
    body: "High-level scheduling, travel, and coordination.",
  },
  {
    icon: <ShoppingCart size={26} />,
    title: "E-commerce Support",
    body: "Order processing, listings, and catalog upkeep.",
  },
];

export default function FindATalentPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Find a Talent
          </div>
          <h1>Find the right Virtual Assistant for your business</h1>
          <p className="lead">
            Tell us what you need, and we&rsquo;ll match you with pre-vetted
            VAs ready to start &mdash; often within days.
          </p>
        </div>
      </section>

      {/* Quick Filter */}
      <section className="section-tight">
        <div className="container">
          <div className="card" style={{ padding: "var(--sp-3)" }}>
            <div
              className="flex flex-wrap gap-2"
              style={{ alignItems: "flex-end" }}
            >
              <div
                className="form-group mb-0"
                style={{ flex: 2, minWidth: 200 }}
              >
                <label className="form-label">
                  What do you need help with?
                </label>
                <select className="form-select">
                  <option>Admin Support</option>
                  <option>Customer Service</option>
                  <option>Social Media Management</option>
                  <option>Bookkeeping &amp; Accounting</option>
                  <option>Content &amp; Copywriting</option>
                  <option>Executive Assistance</option>
                </select>
              </div>
              <div
                className="form-group mb-0"
                style={{ flex: 1, minWidth: 160 }}
              >
                <label className="form-label">Hours per week</label>
                <select className="form-select">
                  <option>Part-time (10–20 hrs)</option>
                  <option>Full-time (30–40 hrs)</option>
                  <option>Project-based</option>
                </select>
              </div>
              <div
                className="form-group mb-0"
                style={{ flex: 1, minWidth: 160 }}
              >
                <label className="form-label">Budget range</label>
                <select className="form-select">
                  <option>$800 – $1,200/mo</option>
                  <option>$1,200 – $2,000/mo</option>
                  <option>$2,000+/mo</option>
                </select>
              </div>
              <button className="btn btn-primary" style={{ height: 52 }}>
                <Search size={18} /> Get Matched
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Browse by category</span>
            <h2>Popular Virtual Assistant categories</h2>
            <p className="lead">
              Explore the most requested skill areas &mdash; or tell us
              something more specific.
            </p>
          </div>
          <div className="grid grid-4">
            {categories.map((c) => (
              <div key={c.title} className="card service-card">
                <div className="icon-circle">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
                <Link href="/services" className="card-link">
                  Learn more <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Your Match Works */}
      <section>
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Matching Process</span>
            <h2>How your match works</h2>
            <p className="lead">
              A simple, transparent process designed to get you the right fit
              fast.
            </p>
          </div>
          <div className="steps">
            {[
              {
                num: "01",
                title: "Share your needs",
                body: "Complete a short intake form or book a call with our team.",
              },
              {
                num: "02",
                title: "Review shortlist",
                body: "We hand-pick 2–3 vetted VAs matched to your requirements.",
              },
              {
                num: "03",
                title: "Interview candidates",
                body: "Meet your matches live and ask any questions you'd like.",
              },
              {
                num: "04",
                title: "Onboard & launch",
                body: "Start working together with onboarding support from Corvanta.",
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

      {/* Get Started Form */}
      <section className="bg-surface">
        <div className="container">
          <div
            className="grid grid-2"
            style={{ alignItems: "center", gap: "var(--sp-6)" }}
          >
            <div>
              <span className="eyebrow">Get Started</span>
              <h2>Tell us about your business</h2>
              <p className="lead">
                Fill out the form and a member of our team will follow up within
                one business day with your first matches.
              </p>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginTop: "var(--sp-3)",
                }}
              >
                {[
                  "No cost to get matched",
                  "Cancel or swap your VA anytime",
                  "Dedicated success manager included",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-2"
                    style={{
                      alignItems: "center",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    <CheckCircle size={18} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <form className="card">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Jane Cooper"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Work Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="jane@company.com"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Company Inc."
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  What do you need help with?
                </label>
                <select className="form-select">
                  <option>Admin Support</option>
                  <option>Customer Service</option>
                  <option>Social Media Management</option>
                  <option>Bookkeeping &amp; Accounting</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Additional details</label>
                <textarea
                  className="form-textarea"
                  placeholder="Tell us more about your business and what you're looking for..."
                />
              </div>
              <button type="button" className="btn btn-primary btn-block">
                Submit Request <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
