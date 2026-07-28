"use client";

import { useState, useCallback } from "react";
import { Star } from "lucide-react";

const CONFETTI_COLORS = [
  "#2EB87C", "#0F766E", "#7C3AED", "#EA580C", "#DB2777", "#F59E0B", "#2563EB",
];

interface Piece {
  id: number;
  color: string;
  left: number;
  tx: string;
  ty: string;
  size: number;
  delay: string;
  duration: string;
  borderRadius: string;
}

function makeConfetti(count = 32): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: 5 + Math.random() * 90,
    tx: `${-80 + Math.random() * 160}px`,
    ty: `${-(60 + Math.random() * 90)}px`,
    size: Math.floor(5 + Math.random() * 7),
    delay: `${(Math.random() * 0.22).toFixed(2)}s`,
    duration: `${(0.65 + Math.random() * 0.55).toFixed(2)}s`,
    borderRadius: Math.random() > 0.45 ? "50%" : "2px",
  }));
}

const TESTIMONIALS = [
  {
    quote:
      "Corvanta matched us with a VA who felt like part of our team within a week. Our response times have never been better.",
    name: "Maria Chen",
    role: "Founder, Northstar Retail",
    avatarBg: "2EB87C",
  },
  {
    quote:
      "The vetting process is no joke. Every candidate we met was genuinely qualified — it made hiring easy.",
    name: "James Whitfield",
    role: "Operations Lead, Bright Legal Group",
    avatarBg: "1F2937",
  },
  {
    quote:
      "We scaled our support team 3x without adding office overhead. Corvanta made it seamless.",
    name: "Priya Natarajan",
    role: "COO, Loop Commerce",
    avatarBg: "0F766E",
  },
];

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[0] }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  const handleMouseEnter = useCallback(() => {
    const confetti = makeConfetti(32);
    setPieces(confetti);
    setTimeout(() => setPieces([]), 1600);
  }, []);

  return (
    <div className="card testimonial-card" onMouseEnter={handleMouseEnter}>
      {/* Confetti burst */}
      {pieces.length > 0 && (
        <span className="confetti-stage" aria-hidden="true">
          {pieces.map((p) => (
            <span
              key={p.id}
              className="confetti-bit"
              style={
                {
                  left: `${p.left}%`,
                  background: p.color,
                  width: p.size,
                  height: p.size,
                  borderRadius: p.borderRadius,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                  "--tx": p.tx,
                  "--ty": p.ty,
                } as React.CSSProperties
              }
            />
          ))}
        </span>
      )}

      <div
        className="flex gap-1"
        style={{ color: "var(--color-warning)", marginBottom: 12 }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={18} fill="currentColor" />
        ))}
      </div>
      <p
        style={{
          color: "var(--color-text-primary)",
          fontSize: "1.0625rem",
        }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>
      <div
        className="flex gap-2"
        style={{ alignItems: "center", marginTop: 16 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=${t.avatarBg}&color=fff&size=300&bold=true&font-size=0.38`}
          alt={t.name}
          style={{
            width: 48,
            height: 48,
            borderRadius: "999px",
            objectFit: "cover",
          }}
        />
        <div>
          <div
            style={{
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-secondary)",
            }}
          >
            {t.role}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="bg-surface">
      <div className="container">
        <div className="section-header text-center">
          <span className="eyebrow">Testimonials</span>
          <h2>Loved by businesses like yours</h2>
          <p className="lead">
            Here&rsquo;s what our clients say about working with Corvanta.
          </p>
        </div>
        <div className="grid grid-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
