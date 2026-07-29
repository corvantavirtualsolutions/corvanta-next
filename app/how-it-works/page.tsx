import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Users, Headphones, ArrowRight } from "lucide-react";
import HiringStepsSection from "../components/HiringStepsSection";
import CTABand from "../components/CTABand";
import ScrollToTop from "../components/ScrollToTop";

export const metadata: Metadata = {
  title: "How It Works | Corvanta Virtual Solutions",
  description:
    "See how Corvanta matches businesses with Virtual Assistants, and how VAs join our network.",
};

const ACCENTS = [
  { color: "#2EB87C", bg: "#E6F7EF" },
  { color: "#0F766E", bg: "rgba(15,118,110,0.12)" },
  { color: "#7C3AED", bg: "rgba(124,58,237,0.10)" },
];

export default function HowItWorksPage() {
  return (
    <>
      <ScrollToTop />

      {/* Page Hero */}
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / How It Works
          </div>
          <h1>A simple process, built for both sides</h1>
          <p className="lead">
            Whether you&rsquo;re hiring support or looking for remote work,
            here&rsquo;s exactly how Corvanta works.
          </p>
        </div>
      </section>

      {/* For Businesses — road/path steps */}
      <section className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">For Businesses</span>
            <h2>Hiring a Virtual Assistant</h2>
            <p className="lead">
              From first call to fully onboarded &mdash; here&rsquo;s the
              journey for businesses.
            </p>
          </div>
          <HiringStepsSection />
          <div className="text-center" style={{ marginTop: "var(--sp-4)" }}>
            <Link href="/find-a-talent" className="btn btn-primary">
              Find a Talent <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why It Works — accent feature cards */}
      <section>
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Why It Works</span>
            <h2>Built on trust, transparency, and support</h2>
            <p className="lead">
              A process designed to remove risk for businesses and provide real
              opportunity for VAs.
            </p>
          </div>
          <div className="grid grid-3">
            {[
              {
                icon: <ShieldCheck size={26} />,
                title: "Rigorous Vetting",
                body: "Every VA is screened for skills, reliability, and communication before joining our roster.",
              },
              {
                icon: <Users size={26} />,
                title: "Human Matchmaking",
                body: "Real people review every match — not just automated keyword filters.",
              },
              {
                icon: <Headphones size={26} />,
                title: "Ongoing Support",
                body: "A dedicated success manager checks in throughout the engagement.",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className="card feature-card accent-card"
                style={
                  {
                    "--card-accent": ACCENTS[i].color,
                    "--card-accent-bg": ACCENTS[i].bg,
                  } as React.CSSProperties
                }
              >
                <div
                  className="icon-circle accent-icon"
                  style={{ background: ACCENTS[i].bg, color: ACCENTS[i].color }}
                >
                  {card.icon}
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — same design as homepage, page-specific text */}
      <CTABand
        eyebrow="NOW YOU KNOW THE PROCESS"
        headline="Ready to build your team?"
        subtext="Now that you\u2019ve seen how it works, tell us what you need \u2014 and we\u2019ll match you with the right Virtual Assistant."
      />
    </>
  );
}
