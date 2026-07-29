"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, TrendingUp } from "lucide-react";

const PERKS = [
  { icon: ShieldCheck, text: "Vetted & background-checked" },
  { icon: Clock, text: "Matched in as little as 3 days" },
  { icon: TrendingUp, text: "No long-term contracts" },
];

interface CTABandProps {
  eyebrow?: string;
  headline?: string;
  subtext?: string;
}

export default function CTABand({
  eyebrow = "Ready when you are",
  headline = "Start delegating the work that\u2019s holding you back",
  subtext = "Tell us what you need and get matched with qualified Virtual Assistants this week.",
}: CTABandProps = {}) {
  return (
    <section>
      <div className="container">
        <div className="cta-band cta-band-enhanced">
          {/* Animated background blobs */}
          <span className="cta-blob cta-blob-1" aria-hidden="true" />
          <span className="cta-blob cta-blob-2" aria-hidden="true" />
          <span className="cta-blob cta-blob-3" aria-hidden="true" />

          <div className="cta-content">
            <span
              className="eyebrow"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
            >
              {eyebrow}
            </span>

            <h2>{headline}</h2>

            <p className="lead">{subtext}</p>

            <div
              className="hero-actions"
              style={{ justifyContent: "center", marginTop: "var(--sp-4)", marginBottom: "var(--sp-4)" }}
            >
              <Link
                href="/find-a-talent"
                className="btn btn-primary btn-lg cta-btn-glow"
              >
                Find a Talent <ArrowRight size={18} />
              </Link>
            </div>

            <div className="cta-perks">
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="cta-perk">
                  <Icon size={15} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
