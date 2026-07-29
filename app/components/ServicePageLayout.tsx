import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import ScrollToTop from "./ScrollToTop";
import CTABand from "./CTABand";

interface ServicePageProps {
  title: string;
  headline: string;
  lead: string;
  color: string;
  bg: string;
  includes: { title: string; body: string }[];
  whoFor: string[];
  ctaEyebrow: string;
  ctaHeadline: string;
  ctaSubtext: string;
}

export default function ServicePageLayout({
  title,
  headline,
  lead,
  color,
  bg,
  includes,
  whoFor,
  ctaEyebrow,
  ctaHeadline,
  ctaSubtext,
}: ServicePageProps) {
  return (
    <>
      <ScrollToTop />

      {/* Page Hero */}
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/services">Services</Link> / {title}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-heading)",
              fontSize: "0.8125rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color,
              background: bg,
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              marginBottom: "var(--sp-2)",
            }}
          >
            {title}
          </div>
          <h1>{headline}</h1>
          <p className="lead">{lead}</p>
        </div>
      </section>

      {/* What We Handle */}
      <section>
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">What We Handle</span>
            <h2>Everything included with your {title} VA</h2>
          </div>
          <div className="grid grid-3">
            {includes.map((item) => (
              <div
                key={item.title}
                className="card feature-card"
                style={{ borderTop: `3px solid ${color}`, textAlign: "center" }}
              >
                <CheckCircle2
                  size={24}
                  style={{ color, margin: "0 auto var(--sp-2)" }}
                />
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Who It's For</span>
            <h2>Built for businesses like yours</h2>
          </div>
          <div className="svc-who-grid">
            {whoFor.map((item) => (
              <div key={item} className="svc-who-item">
                <CheckCircle2 size={18} style={{ color, flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/find-a-talent" className="btn btn-primary btn-lg">
              Find a {title} VA <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <CTABand
        eyebrow={ctaEyebrow}
        headline={ctaHeadline}
        subtext={ctaSubtext}
      />
    </>
  );
}
