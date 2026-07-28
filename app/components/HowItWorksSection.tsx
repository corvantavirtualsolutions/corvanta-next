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
 *   Height 64 == .hiw-badge-row CSS height → zero vertical distortion.
 *   preserveAspectRatio="none" stretches only horizontally; a horizontal
 *   line at y=32 stays perfectly horizontal at every viewport width.
 *
 * Badge centres: x = 100, 300, 500, 700  (12.5 / 37.5 / 62.5 / 87.5 %)
 *   ≈ the four 1fr column centres in a repeat(4,1fr) gap:24px grid.
 *
 * 3 connectors between adjacent badges — each is IDENTICAL in geometry:
 *   line length = 140 SVG units, arrowhead width = 20, half-height = 6
 *   start 20 units after the left badge centre,
 *   tip   20 units before the right badge centre.
 *
 *   Connector A (steps 1→2, green):  x 120–280
 *   Connector B (steps 2→3, teal):   x 320–480
 *   Connector C (steps 3→4, purple): x 520–680
 *
 * Hover:  hovering step i (0-indexed) lights connector i (0,1,2).
 *         hovering step 3 (last) also lights connector 2 (arrives there).
 */

// [lineX1, lineX2, arrowBaseX, arrowTipX]
const CONNECTORS = [
  [120, 260, 260, 280],
  [320, 460, 460, 480],
  [520, 660, 660, 680],
] as const;

// Badge centre x-positions (same order as STEPS)
const DOT_CX = [100, 300, 500, 700] as const;

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
         *   ↳ SVG — position:absolute, height 64 px (= .hiw-badge-row)
         *            draws only the 3 connector arrows; nothing else
         *   ↳ .hiw-grid — 4-col grid; .hiw-col = badge-row + text
         */}
        <div className="hiw-steps">
          <svg
            className="hiw-road-svg"
            viewBox="0 0 800 64"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* ── 3 connector arrows ─────────────────────────────────── */}
            {CONNECTORS.map(([lx1, lx2, ax1, ax2], i) => {
              // connector i belongs to: lights when step i OR (for last) step 3 hovered
              const isActive =
                hovered === i || (i === 2 && hovered === 3);
              const isDimmed = hovered !== -1 && !isActive;
              const opacity = isDimmed ? 0.08 : isActive ? 1 : 0.3;
              const color = ACCENTS[i].color;
              const sw = isActive ? 2.5 : 2;

              return (
                <g key={i} style={{ transition: "opacity 0.25s ease" }}>
                  <line
                    x1={lx1} y1="32" x2={lx2} y2="32"
                    stroke={color}
                    strokeWidth={sw}
                    strokeLinecap="round"
                    opacity={opacity}
                    style={{ transition: "opacity 0.25s ease, stroke-width 0.25s ease" }}
                  />
                  {/* arrowhead: base at ax1, tip at ax2, half-height ±6 */}
                  <polygon
                    points={`${ax1},26 ${ax2},32 ${ax1},38`}
                    fill={color}
                    opacity={opacity}
                    style={{ transition: "opacity 0.25s ease" }}
                  />
                </g>
              );
            })}

            {/* ── Hover glow halos (behind badges, z-index:0) ─────────── */}
            {DOT_CX.map((cx, i) => (
              <circle
                key={i}
                cx={cx}
                cy={32}
                r={20}
                fill={ACCENTS[i].color}
                opacity={hovered === i ? 0.13 : 0}
                style={{ transition: "opacity 0.25s ease" }}
              />
            ))}
          </svg>

          {/* Step columns — hover covers badge + text */}
          <div className="hiw-grid">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="hiw-col"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(-1)}
              >
                {/* Badge row — 64 px tall, matching SVG so y=32 ≡ badge centre */}
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
