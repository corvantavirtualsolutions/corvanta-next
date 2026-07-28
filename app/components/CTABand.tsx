"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, TrendingUp } from "lucide-react";

const PERKS = [
  { icon: ShieldCheck, text: "Vetted & background-checked" },
  { icon: Clock, text: "Matched in as little as 3 days" },
  { icon: TrendingUp, text: "No long-term contracts" },
];

export default function CTABand() {
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
              Ready when you are
            </span>

            <h2>
              Start delegating the work that&rsquo;s holding you back
            </h2>

            <p className="lead">
              Tell us what you need and get matched with qualified Virtual
              Assistants this week.
            </p>

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
