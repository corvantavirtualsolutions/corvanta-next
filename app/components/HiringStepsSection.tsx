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

// Same geometry as HowItWorksSection — 4 badges at x=100,300,500,700
const CONNECTORS = [
  [120, 260, 260, 280],
  [320, 460, 460, 480],
  [520, 660, 660, 680],
] as const;

const DOT_CX = [100, 300, 500, 700] as const;

export default function HiringStepsSection() {
  const [hovered, setHovered] = useState<number>(-1);

  return (
    <div className="hiw-steps">
      <svg
        className="hiw-road-svg"
        viewBox="0 0 800 64"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {CONNECTORS.map(([lx1, lx2, ax1, ax2], i) => {
          const isActive = hovered === i || (i === 2 && hovered === 3);
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
              <polygon
                points={`${ax1},26 ${ax2},32 ${ax1},38`}
                fill={color}
                opacity={opacity}
                style={{ transition: "opacity 0.25s ease" }}
              />
            </g>
          );
        })}

        {DOT_CX.map((cx, i) => (
          <circle
            key={i}
            cx={cx} cy={32} r={20}
            fill={ACCENTS[i].color}
            opacity={hovered === i ? 0.13 : 0}
            style={{ transition: "opacity 0.25s ease" }}
          />
        ))}
      </svg>

      <div className="hiw-grid">
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className="hiw-col"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(-1)}
          >
            <div className="hiw-badge-row">
              <div
                className="step-number"
                style={{
                  background: hovered === i ? ACCENTS[i].color : ACCENTS[i].bg,
                  color: hovered === i ? "#fff" : ACCENTS[i].color,
                  boxShadow: hovered === i ? `0 4px 18px ${ACCENTS[i].color}55` : "none",
                  transition: "background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                {step.num}
              </div>
            </div>
            <div
              className="hiw-text"
              style={{
                transform: hovered === i ? "translateY(-4px)" : "translateY(0)",
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
  );
}
