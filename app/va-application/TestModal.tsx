"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type {
  TestQuestion,
  MCQuestion,
  EnglishTestResult,
  IQTestResult,
} from "./testTypes";

interface Props {
  title: string;
  questions: TestQuestion[];
  testType: "english" | "iq";
  onComplete: (result: EnglishTestResult | IQTestResult) => void;
}

function formatTime(secs: number): string {
  if (secs >= 60) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
  return `${secs}s`;
}

function computeResult(
  finalAnswers: (number | string | null)[],
  questions: TestQuestion[],
  testType: "english" | "iq"
): EnglishTestResult | IQTestResult {
  if (testType === "english") {
    let mcScore = 0;
    for (let i = 0; i < 27 && i < questions.length; i++) {
      const q = questions[i];
      if (q.type === "mc" && finalAnswers[i] === q.correctIndex) mcScore++;
    }
    return {
      mcScore,
      writing1: (finalAnswers[27] as string) ?? "",
      writing2: (finalAnswers[28] as string) ?? "",
      writing3: (finalAnswers[29] as string) ?? "",
    };
  } else {
    let iqScore = 0;
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.type === "mc" && finalAnswers[i] === q.correctIndex) iqScore++;
    }
    return { iqScore };
  }
}

export default function TestModal({ title, questions, testType, onComplete }: Props) {
  const [phase, setPhase] = useState<"intro" | "quiz">("intro");
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [writingText, setWritingText] = useState("");

  // Refs to avoid stale closures in timer callback
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answersRef = useRef<(number | string | null)[]>([]);
  const qIndexRef = useRef(0);
  const advancingRef = useRef(false);

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  const advanceQuestion = useCallback(
    (answer: number | string | null) => {
      if (advancingRef.current) return;
      advancingRef.current = true;
      clearTimer();

      const newAnswers = [...answersRef.current, answer];
      answersRef.current = newAnswers;
      const nextIndex = qIndexRef.current + 1;

      if (nextIndex >= questions.length) {
        const result = computeResult(newAnswers, questions, testType);
        onComplete(result);
      } else {
        qIndexRef.current = nextIndex;
        setQIndex(nextIndex);
        setWritingText("");
        // release lock after state is committed
        setTimeout(() => {
          advancingRef.current = false;
        }, 0);
      }
    },
    [questions, testType, onComplete]
  );

  // Per-question timer
  useEffect(() => {
    if (phase !== "quiz") return;

    const q = questions[qIndex];
    setTimeLeft(q.timeSeconds);
    advancingRef.current = false;

    let secs = q.timeSeconds;
    timerRef.current = setInterval(() => {
      secs -= 1;
      setTimeLeft(secs);
      if (secs <= 0) {
        clearTimer();
        advanceQuestion(null);
      }
    }, 1000);

    return clearTimer;
  }, [phase, qIndex, advanceQuestion, questions]);

  function startQuiz() {
    answersRef.current = [];
    qIndexRef.current = 0;
    advancingRef.current = false;
    setQIndex(0);
    setWritingText("");
    setPhase("quiz");
  }

  const q = questions[qIndex] ?? null;
  const timeFraction = q ? Math.max(0, timeLeft / q.timeSeconds) : 0;
  const timerColor =
    timeLeft <= 10 ? "#EF4444" : timeLeft <= 20 ? "#F59E0B" : "var(--color-accent)";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(3px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <style>{`
        @keyframes timerPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 560,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "var(--color-text-primary)" }}>
            {title}
          </h2>
          {phase === "quiz" && (
            <span style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)", fontWeight: 600 }}>
              {qIndex + 1} / {questions.length}
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* ── Intro phase ── */}
          {phase === "intro" && (
            <div
              style={{
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  background: "rgba(15,118,110,0.06)",
                  border: "1px solid rgba(15,118,110,0.18)",
                  borderRadius: 10,
                  fontSize: "0.9rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.65,
                  maxWidth: 420,
                }}
              >
                This is not a professional or certified test. It is only used to gauge your English and reasoning ability.
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--color-text-primary)" }}>{questions.length} questions</strong> - one at a time.
                Each question has its own timer. Answer before the timer runs out.
                {testType === "english" && " Writing questions give you 3 minutes each."}
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={startQuiz}
                style={{ minWidth: 120 }}
              >
                Start
              </button>
            </div>
          )}

          {/* ── Quiz phase ── */}
          {phase === "quiz" && q && (
            <div style={{ padding: "20px 20px 24px" }}>
              {/* Timer bar */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Time remaining
                  </span>
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: timerColor,
                      fontVariantNumeric: "tabular-nums",
                      animation: timeLeft <= 10 ? "timerPulse 0.8s ease-in-out infinite" : "none",
                    }}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "#E5E7EB",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${timeFraction * 100}%`,
                      background: timerColor,
                      borderRadius: 3,
                      transition: "width 0.9s linear, background 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Passage (reading comprehension) */}
              {q.type === "mc" && q.passage && (
                <div
                  style={{
                    marginBottom: 16,
                    padding: "12px 14px",
                    background: "#F8FAFC",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: "0.85rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.65,
                  }}
                >
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-accent)" }}>
                    Passage
                  </p>
                  {q.passage}
                </div>
              )}

              {/* Question text */}
              <p
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  lineHeight: 1.55,
                  margin: "0 0 18px",
                }}
              >
                {q.text}
              </p>

              {/* MC options */}
              {q.type === "mc" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => advanceQuestion(i)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "11px 14px",
                        background: "#F8FAFC",
                        border: "1.5px solid var(--color-border)",
                        borderRadius: 8,
                        cursor: "pointer",
                        textAlign: "left",
                        width: "100%",
                        transition: "border-color 0.15s, background 0.15s",
                        fontSize: "0.875rem",
                        color: "var(--color-text-primary)",
                        lineHeight: 1.45,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-accent)";
                        e.currentTarget.style.background = "rgba(15,118,110,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-border)";
                        e.currentTarget.style.background = "#F8FAFC";
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: 22,
                          height: 22,
                          borderRadius: 4,
                          background: "var(--color-accent)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          marginTop: 1,
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span style={{ flex: 1 }}>{opt}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Writing question */}
              {q.type === "writing" && (
                <div>
                  <textarea
                    value={writingText}
                    onChange={(e) => setWritingText(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={6}
                    className="form-textarea"
                    style={{ marginBottom: 12 }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => advanceQuestion(writingText)}
                  >
                    Submit Answer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
