import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  RefreshCw,
  Headphones,
  UserCheck,
  ClipboardCheck,
  Unlock,
  PhoneCall,
  FileSignature,
} from "lucide-react";
import CTABand from "../components/CTABand";
import ScrollToTop from "../components/ScrollToTop";
import SubscribeButton from "./SubscribeButton";

export const metadata: Metadata = {
  title: "Pricing | Corvanta Virtual Solutions",
  description:
    "Simple, transparent pricing. Get matched with a vetted Virtual Assistant for $300 your first month, then just $29/month ongoing.",
};

const ONGOING_PERKS = [
  { icon: RefreshCw,       text: "Quick VA replacement within 24-48 hours if needed" },
  { icon: Headphones,      text: "24/7 support - reach us any time" },
  { icon: UserCheck,       text: "Dedicated success manager assigned to your account" },
  { icon: ClipboardCheck,  text: "Ongoing quality checks to keep performance high" },
  { icon: Unlock,          text: "No long-term lock-in - cancel anytime" },
  { icon: PhoneCall,       text: "Regular check-ins to keep your VA aligned with your goals" },
];

export default function PricingPage() {
  return (
    <>
      <ScrollToTop />

      {/* Hero */}
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Pricing
          </div>
          <h1>Simple, transparent pricing</h1>
          <p className="lead">
            One plan. No tiers, no hidden fees, no surprises - just a clear
            path to a great Virtual Assistant.
          </p>
        </div>
      </section>

      {/* Pricing card */}
      <section className="bg-surface">
        <div className="container">
          <div
            style={{
              maxWidth: 580,
              margin: "0 auto",
            }}
          >
            <div
              className="card"
              style={{
                padding: 0,
                overflow: "hidden",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--color-border)",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  padding: "20px 32px 16px",
                  borderBottom: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <span className="eyebrow" style={{ margin: 0 }}>
                  The Corvanta Plan
                </span>
                <span
                  className="badge badge-teal"
                  style={{ fontSize: "0.78rem" }}
                >
                  All-inclusive support
                </span>
              </div>

              {/* First month block */}
              <div
                style={{
                  background: "var(--color-secondary)",
                  padding: "32px",
                  color: "#fff",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  First Month
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 6,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(3rem, 8vw, 4rem)",
                      fontWeight: 800,
                      color: "#fff",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    $300
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    }}
                  >
                    one-time
                  </span>
                </div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.80)",
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  Get matched with one vetted Virtual Assistant. You can try
                  multiple VAs until you find a compatible fit - once matched,
                  that VA is yours and the $300 covers your first full month.
                </p>
              </div>

              {/* Arrow bridge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px 32px",
                  background: "var(--color-bg)",
                  borderTop: "1px solid var(--color-border)",
                  borderBottom: "1px solid var(--color-border)",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    height: 1,
                    flex: 1,
                    background: "var(--color-border)",
                  }}
                />
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  then every month after
                  <ArrowRight size={13} />
                </span>
                <span
                  style={{
                    height: 1,
                    flex: 1,
                    background: "var(--color-border)",
                  }}
                />
              </div>

              {/* Ongoing block */}
              <div style={{ padding: "28px 32px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 6,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(2.25rem, 6vw, 3rem)",
                      fontWeight: 800,
                      color: "var(--color-primary)",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    $29
                  </span>
                  <span
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    }}
                  >
                    / month
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--color-text-secondary)",
                    marginBottom: 22,
                  }}
                >
                  Your ongoing management fee - everything included below.
                </p>

                {/* Perks checklist */}
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginBottom: 28,
                  }}
                >
                  {ONGOING_PERKS.map(({ icon: Icon, text }) => (
                    <li
                      key={text}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        fontSize: "0.9rem",
                        color: "var(--color-text-primary)",
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: "var(--color-primary-light)",
                          color: "var(--color-primary-dark)",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        <Icon size={14} />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contract note + CTA */}
              <div
                style={{
                  margin: "0 32px 28px",
                  padding: "14px 16px",
                  background: "rgba(15,118,110,0.06)",
                  border: "1px solid rgba(15,118,110,0.18)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <FileSignature
                  size={16}
                  style={{
                    color: "var(--color-accent)",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  Once you click Subscribe, a formal contract will be sent to
                  you to review and sign before anything is finalized.
                </p>
              </div>

              <div style={{ padding: "0 32px 32px" }}>
                <SubscribeButton />
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "0.8rem",
                    color: "var(--color-text-secondary)",
                    marginTop: 12,
                    marginBottom: 0,
                  }}
                >
                  No payment charged today - contract review comes first.
                </p>
              </div>
            </div>

            {/* FAQ-style note below card */}
            <p
              style={{
                textAlign: "center",
                fontSize: "0.875rem",
                color: "var(--color-text-secondary)",
                marginTop: 24,
                lineHeight: 1.7,
              }}
            >
              Questions about pricing?{" "}
              <Link
                href="/contact"
                style={{
                  color: "var(--color-accent)",
                  fontWeight: 600,
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                Contact us
              </Link>{" "}
              and we'll walk you through everything.
            </p>
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="Ready to get started?"
        headline="Get a great VA without the guesswork"
        subtext="Tell us what you need - we'll handle the matching, vetting, and ongoing support so you can focus on your business."
      />
    </>
  );
}
