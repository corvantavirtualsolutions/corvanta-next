"use client";

import { useState } from "react";

const ACCENTS = [
  { color: "#2EB87C", bg: "#E6F7EF" },
  { color: "#0F766E", bg: "rgba(15,118,110,0.12)" },
  { color: "#7C3AED", bg: "rgba(124,58,237,0.10)" },
  { color: "#EA580C", bg: "rgba(234,88,12,0.10)" },
];

const STEPS = [
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
];

/*
 * Layout geometry (desktop):
 *   Container: position:relative, height = 4 × ROW_H = 640px
 *   SVG: position:absolute, fills container, viewBox="0 0 100 640"
 *        preserveAspectRatio="none" → SVG x=10 ≡ 10% of container width
 *
 * Badge positions (alternating left / right):
 *   Step 01 → x=10  (badge col = left 20%)
 *   Step 02 → x=90  (badge col = right 20%)
 *   Step 03 → x=10
 *   Step 04 → x=90
 *
 * Badge y-centres (row centres at 80, 240, 400, 560 in a 640-unit tall viewBox):
 *   Each row is 160 SVG units tall; badge sits at mid-row (row_start + 80).
 *
 * Winding path (S-curves between adjacent badge positions):
 *   M 10,0
 *   L 10,80    — arrive at badge 1
 *   C 10,160 90,160 90,240   — S-curve to badge 2
 *   C 90,320 10,320 10,400   — S-curve to badge 3
 *   C 10,480 90,480 90,560   — S-curve to badge 4
 *   L 90,640   — exit below
 */

const ROW_H = 160; // px — must match CSS .hiw-v-row height
const TOTAL_H = ROW_H * STEPS.length; // 640

const BADGE_X = [10, 90, 10, 90] as const;
const BADGE_Y = STEPS.map((_, i) => ROW_H * i + ROW_H / 2); // [80,240,400,560]

const ROAD =
  `M 10,0 L 10,${BADGE_Y[0]}` +
  ` C 10,${ROW_H} 90,${ROW_H} 90,${BADGE_Y[1]}` +
  ` C 90,${ROW_H * 2} 10,${ROW_H * 2} 10,${BADGE_Y[2]}` +
  ` C 10,${ROW_H * 3} 90,${ROW_H * 3} 90,${BADGE_Y[3]}` +
  ` L 90,${TOTAL_H}`;

export default function HiringStepsSection() {
  const [hovered, setHovered] = useState(-1);

  return (
    <div className="hiw-vertical">
      {/* ── Winding road SVG (desktop only; hidden on mobile) ─────────── */}
      <svg
        className="hiw-winding-svg"
        viewBox={`0 0 100 ${TOTAL_H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Gradient flows top-to-bottom: green → teal → purple → orange */}
          <linearGradient
            id="hiw-road-grad"
            x1="0" y1="0"
            x2="0" y2={TOTAL_H}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#2EB87C" />
            <stop offset="33%"  stopColor="#0F766E" />
            <stop offset="66%"  stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>

        {/* Road shoulder — wide, faint glow */}
        <path
          d={ROAD}
          stroke="url(#hiw-road-grad)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          opacity="0.13"
        />
        {/* Main road stripe */}
        <path
          d={ROAD}
          stroke="url(#hiw-road-grad)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Dashed centre line — road feel */}
        <path
          d={ROAD}
          stroke="white"
          strokeWidth="0.9"
          fill="none"
          strokeDasharray="3 8"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Hover halos behind each badge */}
        {BADGE_Y.map((cy, i) => (
          <circle
            key={i}
            cx={BADGE_X[i]}
            cy={cy}
            r={hovered === i ? 7.5 : 5}
            fill={ACCENTS[i].color}
            opacity={hovered === i ? 0.22 : 0.1}
            style={{ transition: "r 0.25s ease, opacity 0.25s ease" }}
          />
        ))}
      </svg>

      {/* ── Step rows ─────────────────────────────────────────────────── */}
      {STEPS.map((step, i) => {
        const isLeft = i % 2 === 0; // badge on left side for even steps
        const acc = ACCENTS[i];
        const active = hovered === i;

        const badge = (
          <div
            className="hiw-v-num"
            style={{
              background: active ? acc.color : acc.bg,
              color: active ? "#fff" : acc.color,
              boxShadow: active ? `0 6px 22px ${acc.color}50` : "none",
            }}
          >
            {step.num}
          </div>
        );

        const text = (
          <div className={`hiw-v-text${isLeft ? " hiw-v-text--r" : " hiw-v-text--l"}`}>
            <h4 style={{ color: acc.color, marginBottom: "var(--sp-1)" }}>
              {step.title}
            </h4>
            <p style={{ marginBottom: 0, color: "var(--color-text-muted)" }}>
              {step.body}
            </p>
          </div>
        );

        return (
          <div
            key={step.num}
            className={`hiw-v-row${isLeft ? " hiw-v-row--l" : " hiw-v-row--r"}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(-1)}
          >
            {isLeft ? (
              <>
                <div className="hiw-v-badgecol">{badge}</div>
                {text}
              </>
            ) : (
              <>
                {text}
                <div className="hiw-v-badgecol">{badge}</div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
