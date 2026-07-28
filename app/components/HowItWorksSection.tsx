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
 *   • height 64 == .hiw-badge-row height (64px CSS) → no vertical stretch
 *   • dots at y = 32 (centre) → land exactly on badge centres
 *   • dots at x = 100, 300, 500, 700 → 12.5%, 37.5%, 62.5%, 87.5%
 *     ≈ the four 1fr column centres in a repeat(4,1fr) grid with gap:24px
 *
 * 4 segments (one per step) — segment N leads INTO step N's dot:
 *   Seg 0: x   0 → 100  (lead-in to step 1)
 *   Seg 1: x 100 → 300  (step 1 → step 2)
 *   Seg 2: x 300 → 500  (step 2 → step 3)
 *   Seg 3: x 500 → 700  (step 3 → step 4)
 */
const DOT_CX = [100, 300, 500, 700] as const;
const SEGMENTS = [
  "M 0,32 C 15,10 85,54 100,32",
  "M 100,32 C 160,10 240,54 300,32",
  "M 300,32 C 360,10 440,54 500,32",
  "M 500,32 C 560,10 640,54 700,32",
] as const;
const FULL_GHOST =
  "M 0,32 C 15,10 85,54 100,32 C 160,10 240,54 300,32 C 360,10 440,54 500,32 C 560,10 640,54 700,32";

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
         * .hiw-steps — position:relative container
         *   ↳ SVG road — position:absolute, covers the badge row (top 64 px)
         *   ↳ .hiw-grid — 4-col grid; each .hiw-col stacks badge + text
         */}
        <div className="hiw-steps">
          <svg
            className="hiw-road-svg"
            viewBox="0 0 800 64"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              {ACCENTS.map((_, i) => (
                <filter
                  key={i}
                  id={`hiw-glow-${i}`}
                  x="-12%"
                  y="-80%"
                  width="124%"
                  height="260%"
                >
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="3"
                    result="blur"
                  />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>

            {/* Ghost base track */}
            <path
              d={FULL_GHOST}
              fill="none"
              stroke="rgba(17,24,39,0.07)"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Coloured segments */}
            {SEGMENTS.map((d, i) => {
              const isActive = hovered === i;
              const isDimmed = hovered !== -1 && !isActive;
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={ACCENTS[i].color}
                  strokeWidth={isActive ? 5.5 : 3}
                  strokeLinecap="round"
                  opacity={isDimmed ? 0.1 : isActive ? 1 : 0.25}
                  filter={isActive ? `url(#hiw-glow-${i})` : undefined}
                  style={{
                    transition: "opacity 0.25s ease, stroke-width 0.25s ease",
                  }}
                />
              );
            })}

            {/* Dot halos (appear behind the badge circles) */}
            {DOT_CX.map((cx, i) => {
              const isActive = hovered === i;
              const isDimmed = hovered !== -1 && !isActive;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={32}
                  r={22}
                  fill={ACCENTS[i].color}
                  opacity={isActive ? 0.15 : 0}
                  style={{ transition: "opacity 0.25s ease" }}
                />
              );
            })}
          </svg>

          {/* Step columns — hover target covers badge + text */}
          <div className="hiw-grid">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="hiw-col"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(-1)}
              >
                {/* Badge row — same height as SVG so dot ↔ badge centres align */}
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

                {/* Text content */}
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
