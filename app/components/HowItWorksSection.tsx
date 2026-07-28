"use client";

import { useState } from "react";
import Link from "next/link";

const ACCENTS = [
  { color: "#2EB87C", bg: "#E6F7EF" },
  { color: "#0F766E", bg: "rgba(15,118,110,0.12)" },
  { color: "#7C3AED", bg: "rgba(124,58,237,0.10)" },
  { color: "#EA580C", bg: "rgba(234,88,12,0.10)" },
];

const STEPS = [
  {
    num: "01",
    title: "Tell us your needs",
    body: "Share the skills, hours, and outcomes you're looking for in a short intake call.",
  },
  {
    num: "02",
    title: "Get matched",
    body: "We shortlist pre-vetted VAs suited to your business within days.",
  },
  {
    num: "03",
    title: "Meet & select",
    body: "Interview your top matches and choose the one that fits best.",
  },
  {
    num: "04",
    title: "Start delegating",
    body: "Onboard your new VA with support from your Corvanta success manager.",
  },
];

/*
 * viewBox: 0 0 800 64
 *   height 64 == .hiw-badge-row CSS height → no vertical distortion
 *   preserveAspectRatio="none" → only horizontal stretch; a straight
 *   horizontal line at y=32 stays perfectly horizontal at any viewport width.
 *
 * Dots at x = 100, 300, 500, 700  →  12.5 / 37.5 / 62.5 / 87.5 %
 *   ≈ the four 1fr grid column centres with gap:24px.
 *
 * 4 straight segments (one per step, each at y = 32):
 *   Seg 0: x   0 → 100   lead-in  to step 1
 *   Seg 1: x 100 → 300   step 1 → step 2
 *   Seg 2: x 300 → 500   step 2 → step 3
 *   Seg 3: x 500 → 784   step 3 → step 4 (+ arrowhead 784 → 800)
 *
 * Hovering step N lights its segment and dims the others.
 */
const DOT_CX = [100, 300, 500, 700] as const;

// [x1, x2] for each segment line
const SEG_X: [number, number][] = [
  [0, 100],
  [100, 300],
  [300, 500],
  [500, 784], // seg 3 stops before the arrowhead base
];

// Arrowhead tip at x=800, base at x=784, half-height ±8
const ARROW = "784,24 800,32 784,40";

export default function HowItWorksSection() {
  const [hovered, setHovered] = useState<number>(-1);

  return (
    <section>
      <div className="container">
        <div className="section-header text-center">
          <span className="eyebrow">How It Works</span>
          <h2>Get matched in four simple steps</h2>
          <p className="lead">
            Whether you&rsquo;re hiring or applying, Corvanta makes the process
            fast and painless.
          </p>
        </div>

        {/*
         * .hiw-steps — position:relative wrapper
         *   ↳ SVG arrow — position:absolute, top 64 px (badge row height)
         *   ↳ .hiw-grid — 4-col grid; each .hiw-col = badge + text
         */}
        <div className="hiw-steps">
          <svg
            className="hiw-road-svg"
            viewBox="0 0 800 64"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* ── Ghost layer (always dim) ───────────────────────────── */}
            <line
              x1="0" y1="32" x2="784" y2="32"
              stroke="rgba(17,24,39,0.09)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polygon points={ARROW} fill="rgba(17,24,39,0.09)" />

            {/* ── Coloured segments ─────────────────────────────────── */}
            {SEG_X.map(([x1, x2], i) => {
              const isActive = hovered === i;
              const isDimmed = hovered !== -1 && !isActive;
              const opacity = isDimmed ? 0.1 : isActive ? 1 : 0.3;
              return (
                <line
                  key={i}
                  x1={x1} y1="32" x2={x2} y2="32"
                  stroke={ACCENTS[i].color}
                  strokeWidth={isActive ? 4 : 2.5}
                  strokeLinecap="round"
                  opacity={opacity}
                  style={{ transition: "opacity 0.25s ease, stroke-width 0.25s ease" }}
                />
              );
            })}

            {/* Arrowhead — belongs to segment 3 */}
            <polygon
              points={ARROW}
              fill={ACCENTS[3].color}
              opacity={
                hovered === -1 ? 0.3 : hovered === 3 ? 1 : 0.1
              }
              style={{ transition: "opacity 0.25s ease" }}
            />

            {/* ── Glow halos behind badges (visible on hover only) ──── */}
            {DOT_CX.map((cx, i) => (
              <circle
                key={i}
                cx={cx}
                cy={32}
                r={22}
                fill={ACCENTS[i].color}
                opacity={hovered === i ? 0.14 : 0}
                style={{ transition: "opacity 0.25s ease" }}
              />
            ))}
          </svg>

          {/* Step columns ─ hover target covers badge + text */}
          <div className="hiw-grid">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="hiw-col"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(-1)}
              >
                {/* Badge row — 64 px tall, matching SVG height */}
                <div className="hiw-badge-row">
                  <div
                    className="step-number"
                    style={{
                      background:
                        hovered === i ? ACCENTS[i].color : ACCENTS[i].bg,
                      color: hovered === i ? "#fff" : ACCENTS[i].color,
                      boxShadow:
                        hovered === i
                          ? `0 4px 18px ${ACCENTS[i].color}55`
                          : "none",
                      transition:
                        "background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease",
                    }}
                  >
                    {step.num}
                  </div>
                </div>

                {/* Title + body */}
                <div
                  className="hiw-text"
                  style={{
                    transform:
                      hovered === i ? "translateY(-4px)" : "translateY(0)",
                    transition: "transform 0.25s ease",
                  }}
                >
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center" style={{ marginTop: "var(--sp-4)" }}>
          <Link href="/how-it-works" className="btn btn-outline">
            See the full process
          </Link>
        </div>
      </div>
    </section>
  );
}
