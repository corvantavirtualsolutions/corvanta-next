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

// viewBox: 0 0 900 80 — each step has its own bezier segment ending at its dot
const DOT_CX = [150, 350, 550, 750] as const;
const SEGMENTS = [
  "M 0,40 C 50,10 100,70 150,40",
  "M 150,40 C 210,10 290,70 350,40",
  "M 350,40 C 410,10 490,70 550,40",
  "M 550,40 C 610,10 690,70 750,40",
] as const;
const FULL_PATH =
  "M 0,40 C 50,10 100,70 150,40 C 210,10 290,70 350,40 C 410,10 490,70 550,40 C 610,10 690,70 750,40";

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

        {/* Interactive road */}
        <div className="road-wrap" aria-hidden="true">
          <svg
            viewBox="0 0 900 80"
            preserveAspectRatio="none"
            className="road-svg"
          >
            <defs>
              {ACCENTS.map((_, i) => (
                <filter
                  key={i}
                  id={`seg-glow-${i}`}
                  x="-10%"
                  y="-60%"
                  width="120%"
                  height="220%"
                >
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>

            {/* Ghost base track */}
            <path
              d={FULL_PATH}
              fill="none"
              stroke="rgba(17,24,39,0.08)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* 4 individually coloured segments */}
            {SEGMENTS.map((d, i) => {
              const isActive = hovered === i;
              const isDimmed = hovered !== -1 && !isActive;
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={ACCENTS[i].color}
                  strokeWidth={isActive ? 6 : 3.5}
                  strokeLinecap="round"
                  opacity={isDimmed ? 0.12 : isActive ? 1 : 0.28}
                  filter={isActive ? `url(#seg-glow-${i})` : undefined}
                  style={{
                    transition: "opacity 0.28s ease, stroke-width 0.28s ease",
                  }}
                />
              );
            })}

            {/* Step dots */}
            {DOT_CX.map((cx, i) => {
              const isActive = hovered === i;
              const isDimmed = hovered !== -1 && !isActive;
              return (
                <g key={i}>
                  {/* Glow halo — only visible on active */}
                  <circle
                    cx={cx}
                    cy={40}
                    r={16}
                    fill={ACCENTS[i].color}
                    opacity={isActive ? 0.18 : 0}
                    style={{ transition: "opacity 0.28s ease" }}
                  />
                  <circle
                    cx={cx}
                    cy={40}
                    r={7}
                    fill={ACCENTS[i].color}
                    opacity={isDimmed ? 0.2 : 1}
                    style={{
                      transform: isActive ? "scale(1.35)" : "scale(1)",
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      transition:
                        "transform 0.28s ease, opacity 0.28s ease",
                    }}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="steps">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="step-card"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(-1)}
              style={{
                transform: hovered === i ? "translateY(-4px)" : "translateY(0)",
                transition: "transform 0.25s ease",
              }}
            >
              <div
                className="step-number"
                style={{
                  background:
                    hovered === i ? ACCENTS[i].color : ACCENTS[i].bg,
                  color: hovered === i ? "#fff" : ACCENTS[i].color,
                  boxShadow:
                    hovered === i
                      ? `0 6px 22px ${ACCENTS[i].color}50`
                      : "none",
                  transition:
                    "background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                {step.num}
              </div>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </div>
          ))}
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
