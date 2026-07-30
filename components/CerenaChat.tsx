"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, X, Send } from "lucide-react";

/* ---------- Scripted responses ---------- */
interface Reply {
  pattern: RegExp;
  response: string;
}

const REPLIES: Reply[] = [
  {
    pattern: /what.*(corvanta|you do|company|about|service)|who are you|tell me about/i,
    response:
      "Corvanta Virtual Solutions connects growing businesses with pre-vetted, skilled Virtual Assistants. We handle the sourcing, screening, and matching so you can focus on running your business - not hiring.",
  },
  {
    pattern: /service|offer|help with|support|what do you (do|provide)/i,
    response:
      "We offer a wide range of VA services: Admin Support, Customer Service, Social Media Management, Bookkeeping & Accounting, Content & Copywriting, Executive Assistance, Data Entry & Research, E-commerce Support, and more. What does your business need help with?",
  },
  {
    pattern: /how.*(work|process|match|get start)|get matched|matching|steps/i,
    response:
      "It's simple! You fill out our matching form on the Find a Talent page, tell us what you need, and our team hand-picks vetted VAs that fit your requirements - often within 3 days. No long contracts, no guesswork.",
  },
  {
    pattern: /hire|find a va|get a va|start|onboard/i,
    response:
      "Head over to our Find a Talent page and fill out the quick matching form. Tell us about your needs, hours, and budget, and we'll do the rest. Our team will follow up within one business day!",
  },
  {
    pattern: /apply|become a va|join|work for|work with corvanta|va application/i,
    response:
      "Interested in joining our VA network? We look for skilled, reliable professionals with experience in their field. Reach out to us at corvantavirtualsolutions@gmail.com and mention you'd like to apply as a VA.",
  },
  {
    pattern: /price|pricing|cost|rate|how much|fee|budget|charge/i,
    response:
      "Our pricing depends on the role, hours, and skill set you need. We keep it flexible - no one-size-fits-all packages. Fill out the matching form on our Find a Talent page and we'll give you a clear picture of what to expect.",
  },
  {
    pattern: /industr|sector|niche|type of business|who do you help/i,
    response:
      "We work with businesses across many industries - e-commerce, healthcare, real estate, tech, professional services, and more. If your business needs operational support, we can help.",
  },
  {
    pattern: /contact|email|phone|address|reach|location|where are you/i,
    response:
      "You can reach us at corvantavirtualsolutions@gmail.com or call (463) 223-9883. We're also located at 1800 N Meridian Suite 400b, Indianapolis, IN 46202. We'd love to hear from you!",
  },
  {
    pattern: /vet|screen|qualif|background|trust|reliable|quality/i,
    response:
      "Every VA in our network goes through a thorough vetting process - skills assessment, background checks, and interview rounds. We only match you with candidates we'd trust ourselves.",
  },
  {
    pattern: /time|turnaround|how long|how fast|when|days/i,
    response:
      "Most clients receive their first matched VA candidates within 3 business days of submitting their request. Our team moves fast so your business doesn't have to wait.",
  },
];

const FALLBACK = "I'm not sure about that one - please visit our Contact page and our team will be happy to help!";

const SUGGESTIONS = [
  "What services do you offer?",
  "How does it work?",
  "How do I hire a VA?",
  "What does it cost?",
];

function getReply(text: string): { response: string; hasContactLink?: boolean } {
  for (const r of REPLIES) {
    if (r.pattern.test(text)) return { response: r.response };
  }
  return { response: FALLBACK, hasContactLink: true };
}

/* ---------- Types ---------- */
interface Message {
  from: "user" | "cerena";
  text: string;
  hasContactLink?: boolean;
}

/* ---------- Component ---------- */
export default function CerenaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "cerena", text: "Hi, I'm Cerena - how can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const { response, hasContactLink } = getReply(trimmed);
      setMessages((prev) => [
        ...prev,
        { from: "cerena", text: response, hasContactLink },
      ]);
    }, 900);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send(input);
  }

  return (
    <>
      {/* Chat window */}
      <div
        className={`cerena-window${open ? " cerena-window--open" : ""}`}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="cerena-header">
          <div className="cerena-avatar" aria-hidden="true">C</div>
          <div className="cerena-header-info">
            <span className="cerena-name">Cerena</span>
            <span className="cerena-status">Corvanta Assistant</span>
          </div>
          <button
            className="cerena-close"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="cerena-messages" role="log" aria-live="polite">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`cerena-bubble cerena-bubble--${msg.from}`}
            >
              {msg.hasContactLink ? (
                <>
                  I'm not sure about that one - please visit our{" "}
                  <Link href="/contact" className="cerena-link">
                    Contact page
                  </Link>{" "}
                  and our team will be happy to help!
                </>
              ) : (
                msg.text
              )}
            </div>
          ))}
          {typing && (
            <div className="cerena-bubble cerena-bubble--cerena cerena-typing">
              <span /><span /><span />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestion chips */}
        {messages.length <= 1 && (
          <div className="cerena-chips">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="cerena-chip"
                onClick={() => send(s)}
                tabIndex={open ? 0 : -1}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="cerena-input-row">
          <input
            ref={inputRef}
            type="text"
            className="cerena-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            tabIndex={open ? 0 : -1}
            aria-label="Chat message"
          />
          <button
            className="cerena-send"
            onClick={() => send(input)}
            aria-label="Send message"
            tabIndex={open ? 0 : -1}
          >
            <Send size={17} />
          </button>
        </div>
      </div>

      {/* FAB toggle button */}
      <button
        className={`cerena-fab${open ? " cerena-fab--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with Cerena"}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}
