import type { Metadata } from "next";
import Link from "next/link";
import {
  RefreshCw,
  Headphones,
  UserCheck,
  ClipboardCheck,
  Unlock,
  PhoneCall,
  FileSignature,
  Check,
  Users,
  Zap,
} from "lucide-react";
import CTABand from "../components/CTABand";
import ScrollToTop from "../components/ScrollToTop";
import SubscribeButton from "./SubscribeButton";

export const metadata: Metadata = {
  title: "Pricing | Corvanta Virtual Solutions",
  description:
    "Simple, transparent pricing. $500 to get matched with your first VA, $29/month ongoing, $129 per additional VA.",
};

const ONGOING_PERKS = [
  { icon: RefreshCw,      text: "Quick VA replacement within 24-48 hours" },
  { icon: Headphones,     text: "24/7 support - reach us any time" },
  { icon: UserCheck,      text: "Dedicated success manager" },
  { icon: ClipboardCheck, text: "Ongoing quality checks" },
  { icon: Unlock,         text: "No long-term lock-in" },
  { icon: PhoneCall,      text: "Regular check-ins to keep your VA aligned" },
];

const TRUST_PILLS = [
  "No long-term contract",
  "Cancel anytime",
  "Contract sent before payment",
  "Vetted VAs only",
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
            One plan. Three clear numbers. No surprises.
          </p>
        </div>
      </section>

      {/* Pricing section */}
      <section className="bg-surface">
        <div className="container">

          {/* Section intro */}
          <div className="section-header text-center">
            <span className="eyebrow">The Corvanta Plan</span>
            <h2 style={{ marginBottom: 8 }}>Everything you need, priced honestly</h2>
            <p className="lead" style={{ maxWidth: 540, margin: "0 auto" }}>
              Get matched with a vetted VA, keep full support every month, and
              add more VAs whenever you're ready to grow.
            </p>
          </div>

          {/* Three cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              maxWidth: 900,
              margin: "0 auto 40px",
            }}
            className="pricing-grid"
          >

            {/* Card 1 — First VA */}
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--color-border)",
                borderRadius: 16,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  padding: "22px 24px 18px",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(31,41,55,0.07)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-secondary)",
                    }}
                  >
                    <Zap size={15} />
                  </span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    First VA
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "2.75rem",
                      fontWeight: 800,
                      color: "var(--color-secondary)",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    $500
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-text-secondary)",
                      fontWeight: 500,
                    }}
                  >
                    one-time
                  </span>
                </div>
              </div>
              <div style={{ padding: "18px 24px 24px", flex: 1 }}>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.65,
                    marginBottom: 16,
                  }}
                >
                  Get matched with your first vetted Virtual Assistant. Try
                  multiple VAs until you find the right fit - your first month
                  is included.
                </p>
                <ul style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {[
                    "Full matching process handled for you",
                    "Try multiple VAs until it's right",
                    "First month of your VA's work included",
                  ].map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        fontSize: "0.85rem",
                        color: "var(--color-text-primary)",
                        lineHeight: 1.45,
                      }}
                    >
                      <Check
                        size={14}
                        style={{
                          color: "var(--color-primary)",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card 2 — Ongoing (featured) */}
            <div
              style={{
                background: "var(--color-secondary)",
                border: "2px solid var(--color-primary)",
                borderRadius: 16,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "var(--shadow-lg)",
                position: "relative",
              }}
            >
              {/* "Included in your plan" badge */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "var(--color-primary)",
                  color: "#fff",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  padding: "3px 10px",
                  borderRadius: 99,
                }}
              >
                Ongoing
              </div>
              <div
                style={{
                  padding: "22px 24px 18px",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(46,184,124,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-primary)",
                    }}
                  >
                    <Headphones size={15} />
                  </span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    Monthly Support
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "2.75rem",
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
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.55)",
                      fontWeight: 500,
                    }}
                  >
                    / month
                  </span>
                </div>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  Starts after your VA is hired
                </p>
              </div>
              <div style={{ padding: "18px 24px 24px", flex: 1 }}>
                <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {ONGOING_PERKS.map(({ icon: Icon, text }) => (
                    <li
                      key={text}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 9,
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.85)",
                        lineHeight: 1.45,
                      }}
                    >
                      <Icon
                        size={13}
                        style={{
                          color: "var(--color-primary)",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card 3 — Additional VA */}
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--color-border)",
                borderRadius: 16,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  padding: "22px 24px 18px",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(15,118,110,0.09)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-accent)",
                    }}
                  >
                    <Users size={15} />
                  </span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    Additional VA
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "2.75rem",
                      fontWeight: 800,
                      color: "var(--color-accent)",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    $129
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-text-secondary)",
                      fontWeight: 500,
                    }}
                  >
                    per VA
                  </span>
                </div>
              </div>
              <div style={{ padding: "18px 24px 24px", flex: 1 }}>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.65,
                    marginBottom: 16,
                  }}
                >
                  Ready to grow your team? Add another VA whenever you want.
                  One-time matching fee per additional hire.
                </p>
                <ul style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {[
                    "Same vetting and matching process",
                    "Covered by your existing $29/mo plan",
                    "Add as many VAs as your team needs",
                  ].map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        fontSize: "0.85rem",
                        color: "var(--color-text-primary)",
                        lineHeight: 1.45,
                      }}
                    >
                      <Check
                        size={14}
                        style={{
                          color: "var(--color-accent)",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile responsive override */}
          <style>{`
            @media (max-width: 700px) {
              .pricing-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          {/* Trust pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 10,
              maxWidth: 900,
              margin: "0 auto 36px",
            }}
          >
            {TRUST_PILLS.map((pill) => (
              <span
                key={pill}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 99,
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--color-text-secondary)",
                }}
              >
                <Check size={12} style={{ color: "var(--color-primary)" }} />
                {pill}
              </span>
            ))}
          </div>

          {/* CTA block */}
          <div
            style={{
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            {/* Contract note */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "14px 18px",
                background: "rgba(15,118,110,0.06)",
                border: "1px solid rgba(15,118,110,0.18)",
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <FileSignature
                size={15}
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
                Once you click Subscribe, a formal contract will be sent to you
                to review and sign before anything is finalized.
              </p>
            </div>

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

            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "var(--color-text-secondary)",
                marginTop: 24,
                lineHeight: 1.7,
              }}
            >
              Questions?{" "}
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
