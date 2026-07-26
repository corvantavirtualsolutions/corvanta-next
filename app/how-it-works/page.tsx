import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Users, Headphones, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | Corvanta",
  description:
    "See how Corvanta matches businesses with Virtual Assistants, and how VAs join our network.",
};

export default function HowItWorksPage() {
  return (
    <>
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

      {/* For Businesses */}
      <section>
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">For Businesses</span>
            <h2>Hiring a Virtual Assistant</h2>
            <p className="lead">
              From first call to fully onboarded &mdash; here&rsquo;s the
              journey for businesses.
            </p>
          </div>
          <div className="steps">
            {[
              {
                num: "01",
                title: "Share your needs",
                body: "Book a short intake call or fill out our online form describing the role.",
              },
              {
                num: "02",
                title: "Get a shortlist",
                body: "We match you with 2–3 pre-vetted VAs suited to your requirements.",
              },
              {
                num: "03",
                title: "Interview & select",
                body: "Meet your top candidates and choose who joins your team.",
              },
              {
                num: "04",
                title: "Onboard & scale",
                body: "Launch with onboarding support, then scale hours as your needs grow.",
              },
            ].map((step) => (
              <div key={step.num} className="step-card">
                <div className="step-number">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: "var(--sp-4)" }}>
            <Link href="/find-a-talent" className="btn btn-primary">
              Find a Talent <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* For VAs */}
      <section className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">For Virtual Assistants</span>
            <h2>Joining the Corvanta network</h2>
            <p className="lead">
              Here&rsquo;s what it looks like to apply and get placed as a VA.
            </p>
          </div>
          <div className="steps">
            {[
              {
                num: "01",
                title: "Apply online",
                body: "Submit your experience, specialty, and availability in about 10 minutes.",
              },
              {
                num: "02",
                title: "Complete assessment",
                body: "Show us your skills with a short, specialty-specific assessment.",
              },
              {
                num: "03",
                title: "Interview",
                body: "Meet with our talent team to discuss fit and expectations.",
              },
              {
                num: "04",
                title: "Get matched",
                body: "Join our active roster and get matched with businesses that fit your skills.",
              },
            ].map((step) => (
              <div key={step.num} className="step-card">
                <div className="step-number">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: "var(--sp-4)" }}>
            <Link href="/apply-as-a-va" className="btn btn-secondary">
              Apply as a VA <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why It Works */}
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
                modifier: "",
                title: "Rigorous Vetting",
                body: "Every VA is screened for skills, reliability, and communication before joining our roster.",
              },
              {
                icon: <Users size={26} />,
                modifier: "teal",
                title: "Human Matchmaking",
                body: "Real people review every match — not just automated keyword filters.",
              },
              {
                icon: <Headphones size={26} />,
                modifier: "navy",
                title: "Ongoing Support",
                body: "A dedicated success manager checks in throughout the engagement.",
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

      {/* CTA Band */}
      <section>
        <div className="container">
          <div className="cta-band">
            <h2>Ready to get started?</h2>
            <p className="lead">
              Whether you&rsquo;re hiring or looking for work, your next step
              takes just a few minutes.
            </p>
            <div className="hero-actions">
              <Link href="/find-a-talent" className="btn btn-primary btn-lg">
                Find a Talent <ArrowRight size={18} />
              </Link>
              <Link href="/apply-as-a-va" className="btn btn-outline-white btn-lg">
                Apply as a VA
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
