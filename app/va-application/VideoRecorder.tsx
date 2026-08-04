"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Video, Square, RotateCcw } from "lucide-react";

const MAX_ATTEMPTS = 2;
const COUNTDOWN_SECS = 5;
const MAX_RECORD_SECS = 30;

type RecState =
  | "idle"
  | "requesting"
  | "denied"
  | "unsupported"
  | "ready"
  | "countdown"
  | "recording"
  | "preview"
  | "locked";

interface VideoRecorderProps {
  questionLabel: string;
  questionText?: string;
  onRecorded: (blob: Blob | null) => void;
}

export default function VideoRecorder({
  questionLabel,
  questionText,
  onRecorded,
}: VideoRecorderProps) {
  const [recState, setRecState] = useState<RecState>("idle");
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);
  const [timeLeft, setTimeLeft] = useState(MAX_RECORD_SECS);
  const [attempts, setAttempts] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const streamRef = useRef<MediaStream | null>(null);
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptsRef = useRef(0);

  // Re-attach stream to live video element when returning to ready/recording states
  useEffect(() => {
    if (
      (recState === "ready" || recState === "countdown" || recState === "recording") &&
      streamRef.current &&
      liveVideoRef.current
    ) {
      liveVideoRef.current.srcObject = streamRef.current;
    }
  }, [recState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTick();
      stopStream();
      // Revoke any object URL
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function clearTick() {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (liveVideoRef.current) liveVideoRef.current.srcObject = null;
  }

  async function handleStartCamera() {
    // Check browser support first
    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setRecState("unsupported");
      setErrorMsg(
        "Your browser does not support in-browser video recording. Please use Chrome, Firefox, or Safari 14.1+."
      );
      return;
    }

    setRecState("requesting");
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
      setRecState("ready");
    } catch (err: unknown) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setErrorMsg(
          "Camera and microphone access was denied. Please allow access in your browser settings and try again."
        );
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setErrorMsg(
          "No camera or microphone found. Please connect a device and try again."
        );
      } else {
        setErrorMsg(
          "Could not start your camera. Please check your device and browser settings, then try again."
        );
      }
      setRecState("denied");
    }
  }

  function handleRecord() {
    setRecState("countdown");
    setCountdown(COUNTDOWN_SECS);
    let c = COUNTDOWN_SECS;
    tickRef.current = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) {
        clearTick();
        beginRecording();
      }
    }, 1000);
  }

  function beginRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];

    const mimeType =
      [
        "video/webm;codecs=vp8,opus",
        "video/webm;codecs=vp9,opus",
        "video/webm",
        "video/mp4;codecs=avc1",
        "video/mp4",
      ].find((t) => MediaRecorder.isTypeSupported(t)) ?? "";

    let mr: MediaRecorder;
    try {
      mr = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : {});
    } catch {
      setErrorMsg("Your browser could not start the recorder. Please try a different browser.");
      setRecState("ready");
      return;
    }

    mrRef.current = mr;

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: mimeType || "video/webm",
      });
      const url = URL.createObjectURL(blob);

      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });

      attemptsRef.current += 1;
      const next = attemptsRef.current;
      setAttempts(next);
      onRecorded(blob);

      if (next >= MAX_ATTEMPTS) {
        stopStream();
        setRecState("locked");
      } else {
        setRecState("preview");
      }
    };

    mr.start(250);
    setRecState("recording");

    let secs = MAX_RECORD_SECS;
    setTimeLeft(secs);
    tickRef.current = setInterval(() => {
      secs -= 1;
      setTimeLeft(secs);
      if (secs <= 0) {
        clearTick();
        doStopRecording();
      }
    }, 1000);
  }

  function doStopRecording() {
    clearTick();
    if (mrRef.current && mrRef.current.state !== "inactive") {
      mrRef.current.stop();
    }
  }

  function handleReRecord() {
    onRecorded(null);
    setRecState("ready");
    // Stream still running - re-attach via useEffect
  }

  function handleRetry() {
    setErrorMsg("");
    setRecState("idle");
  }

  const attemptsLeft = MAX_ATTEMPTS - attemptsRef.current;
  const showLive =
    recState === "ready" || recState === "countdown" || recState === "recording";
  const showPlayback =
    (recState === "preview" || recState === "locked") && !!previewUrl;

  return (
    <div>
      <style>{`
        @keyframes recBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
      `}</style>

      {/* Question */}
      <div style={{ marginBottom: 10 }}>
        <p style={{ fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 4px", fontSize: "0.95rem" }}>
          {questionLabel}
        </p>
        {questionText && (
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: 0, fontStyle: "italic" }}>
            "{questionText}"
          </p>
        )}
      </div>

      {/* Video area */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          background: "#0d0d0d",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 10,
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Live stream video */}
        <video
          ref={liveVideoRef}
          autoPlay
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: showLive ? "block" : "none",
            transform: "scaleX(-1)",
          }}
        />

        {/* Playback video */}
        {showPlayback && (
          <video
            key={previewUrl!}
            src={previewUrl!}
            controls
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "#000",
            }}
          />
        )}

        {/* Idle / denied / unsupported / requesting placeholder */}
        {!showLive && !showPlayback && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: "#666",
            }}
          >
            <Camera size={36} strokeWidth={1.5} />
            <span style={{ fontSize: "0.8rem", textAlign: "center", padding: "0 16px" }}>
              {recState === "requesting"
                ? "Requesting camera access..."
                : "Camera not started"}
            </span>
          </div>
        )}

        {/* Countdown overlay */}
        {recState === "countdown" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.55)",
            }}
          >
            <span
              style={{
                fontSize: 96,
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1,
                textShadow: "0 4px 24px rgba(0,0,0,0.5)",
              }}
            >
              {countdown}
            </span>
          </div>
        )}

        {/* Recording indicator */}
        {recState === "recording" && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(0,0,0,0.65)",
              borderRadius: 20,
              padding: "5px 12px",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#EF4444",
                display: "inline-block",
                animation: "recBlink 1s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {timeLeft}s remaining
            </span>
          </div>
        )}

        {/* Locked badge */}
        {recState === "locked" && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "rgba(0,0,0,0.65)",
              borderRadius: 6,
              padding: "3px 10px",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Final take
          </div>
        )}
      </div>

      {/* Error */}
      {errorMsg && (
        <div
          style={{
            marginBottom: 10,
            padding: "10px 14px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 8,
            color: "var(--color-error)",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <span style={{ flex: 1 }}>{errorMsg}</span>
          {(recState === "denied" || recState === "unsupported") && (
            <button
              type="button"
              onClick={handleRetry}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-error)",
                cursor: "pointer",
                fontSize: "0.82rem",
                textDecoration: "underline",
                flexShrink: 0,
                padding: 0,
              }}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {recState === "idle" && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleStartCamera}
          >
            <Camera size={15} /> Start Camera
          </button>
        )}

        {recState === "requesting" && (
          <button type="button" className="btn btn-outline btn-sm" disabled>
            Requesting access...
          </button>
        )}

        {recState === "denied" && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleRetry}
          >
            <RotateCcw size={14} /> Try again
          </button>
        )}

        {recState === "ready" && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleRecord}
          >
            <Video size={15} /> Record
          </button>
        )}

        {recState === "countdown" && (
          <button type="button" className="btn btn-primary btn-sm" disabled>
            Starting in {countdown}...
          </button>
        )}

        {recState === "recording" && (
          <button
            type="button"
            className="btn btn-sm"
            onClick={doStopRecording}
            style={{ background: "#EF4444", color: "#fff", border: "none" }}
          >
            <Square size={13} fill="#fff" /> Stop recording
          </button>
        )}

        {recState === "preview" && (
          <>
            <span
              style={{
                fontSize: "0.82rem",
                color: "#166534",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#16a34a",
                }}
              />
              Take {attemptsRef.current} saved
            </span>
            {attemptsLeft > 0 && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleReRecord}
              >
                <RotateCcw size={14} /> Re-record ({attemptsLeft}{" "}
                {attemptsLeft === 1 ? "attempt" : "attempts"} left)
              </button>
            )}
          </>
        )}

        {recState === "locked" && (
          <span style={{ fontSize: "0.82rem", color: "#92400E", fontWeight: 600 }}>
            No more attempts remaining - this take will be submitted.
          </span>
        )}
      </div>

      {/* Attempt indicator while active */}
      {(recState === "ready" ||
        recState === "countdown" ||
        recState === "recording") && (
        <p
          style={{
            margin: "6px 0 0",
            fontSize: "0.77rem",
            color: "var(--color-text-secondary)",
          }}
        >
          Attempt {attemptsRef.current + 1} of {MAX_ATTEMPTS} - max 30 seconds
        </p>
      )}
    </div>
  );
}
