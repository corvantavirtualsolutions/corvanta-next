import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  TrendingUp,
  UserCheck,
  Zap,
  Headphones,
  Layers,
  Inbox,
  MessageCircle,
  Share2,
  Calculator,
  ShoppingBag,
  Home,
  Stethoscope,
  Scale,
} from "lucide-react";
import HeroSlider from "./components/HeroSlider";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTABand from "./components/CTABand";

export const metadata = {
  title: "Corvanta Virtual Solutions | Grow Your Business with Skilled VAs",
  description:
    "Corvanta Virtual Solutions matches you with vetted, experienced Virtual Assistants who handle the busywork — so your team can focus on growth.",
};

// Accent palette shared across Why Corvanta, Services, Industries, and the road
const ACCENTS = [
  { color: "#2EB87C", bg: "#E6F7EF" },
  { color: "#0F766E", bg: "rgba(15,118,110,0.12)" },
  { color: "#7C3AED", bg: "rgba(124,58,237,0.10)" },
  { color: "#EA580C", bg: "rgba(234,88,12,0.10)" },
  { color: "#DB2777", bg: "rgba(219,39,119,0.10)" },
  { color: "#2563EB", bg: "rgba(37,99,235,0.10)" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-split">
          <div>
            <span className="eyebrow">
              <Sparkles size={14} /> Trusted by 100+ growing businesses
            </span>
            <h1>Grow your business with skilled Virtual Assistants</h1>
            <p className="lead">
              Corvanta matches you with vetted, experienced Virtual Assistants
              who handle the busywork &mdash; so your team can focus on growth.
              No agencies, no guesswork, just great talent.
            </p>
            <div className="hero-actions">
              <Link href="/find-a-talent" className="btn btn-primary btn-lg">
                Find a Talent <ArrowRight size={18} />
              </Link>
              <Link href="/how-it-works" className="btn btn-outline btn-lg">
                How It Works
              </Link>
            </div>
            <div className="hero-trust">
              <span className="flex gap-1" style={{ alignItems: "center" }}>
                <ShieldCheck size={16} /> Vetted &amp; background-checked
              </span>
              <span className="flex gap-1" style={{ alignItems: "center" }}>
                <Clock size={16} /> Matched in as little as 3 days
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <HeroSlider />
            <div className="floating-card fc-1">
              <div className="icon-circle icon-sm">
                <TrendingUp size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                  +38% output
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                  avg. team capacity
                </div>
              </div>
            </div>
            <div className="floating-card fc-2">
              <div className="icon-circle icon-sm navy">
                <UserCheck size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                  200+ VAs
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                  ready to match
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-tight">
        <div className="container">
          <div className="grid grid-4 stats-grid">
            {[
              { value: "200+", label: "Vetted Virtual Assistants" },
              { value: "100+", label: "Businesses Served" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "3 Days", label: "Average Time to Match" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Corvanta */}
      <section className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Why Corvanta</span>
            <h2>Built for modern, growing teams</h2>
            <p className="lead">
              We take the risk and guesswork out of hiring remote support &mdash;
              so you get reliable talent, fast.
            </p>
          </div>
          <div className="grid grid-3">
            {[
              {
                icon: <ShieldCheck size={26} />,
                title: "Rigorously Vetted",
                body: "Every VA passes a multi-step screening process including skills assessments, background checks, and interviews.",
              },
              {
                icon: <Zap size={26} />,
                title: "Fast Matching",
                body: "Tell us what you need and get matched with qualified candidates in as little as 3 business days.",
              },
              {
                icon: <Headphones size={26} />,
                title: "Dedicated Support",
                body: "A dedicated success manager stays with you to ensure the partnership keeps delivering results.",
              },
              {
                icon: <ShieldCheck size={26} />,
                title: "Flexible Engagements",
                body: "Scale hours up or down monthly based on your workload — no long-term lock-in required.",
              },
              {
                icon: <Layers size={26} />,
                title: "Wide Skill Coverage",
                body: "From admin support to bookkeeping to social media, find specialized talent across every function.",
              },
              {
                icon: <TrendingUp size={26} />,
                title: "Transparent Pricing",
                body: "Simple monthly plans with no hidden agency markups or surprise fees.",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className="card feature-card accent-card"
                style={
                  {
                    "--card-accent": ACCENTS[i].color,
                    "--card-accent-bg": ACCENTS[i].bg,
                  } as React.CSSProperties
                }
              >
                <div
                  className="icon-circle accent-icon"
                  style={
                    {
                      background: ACCENTS[i].bg,
                      color: ACCENTS[i].color,
                    } as React.CSSProperties
                  }
                >
                  {card.icon}
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorksSection />

      {/* Services */}
      <section className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Services</span>
            <h2>Support across every function</h2>
            <p className="lead">
              Delegate the tasks slowing your business down to a specialist
              who&rsquo;s already great at them.
            </p>
          </div>
          <div className="grid grid-4">
            {[
              {
                icon: <Inbox size={26} />,
                title: "Admin Support",
                body: "Inbox & calendar management, scheduling, and day-to-day operations.",
              },
              {
                icon: <MessageCircle size={26} />,
                title: "Customer Service",
                body: "Responsive support across email, chat, and social channels.",
              },
              {
                icon: <Share2 size={26} />,
                title: "Social Media Management",
                body: "Content planning, scheduling, and community engagement.",
              },
              {
                icon: <Calculator size={26} />,
                title: "Bookkeeping & Accounting",
                body: "Invoicing, reconciliation, and monthly financial reporting.",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className="card service-card accent-card"
                style={
                  {
                    "--card-accent": ACCENTS[i].color,
                    "--card-accent-bg": ACCENTS[i].bg,
                  } as React.CSSProperties
                }
              >
                <div
                  className="icon-circle accent-icon"
                  style={
                    {
                      background: ACCENTS[i].bg,
                      color: ACCENTS[i].color,
                    } as React.CSSProperties
                  }
                >
                  {card.icon}
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <Link href="/services" className="card-link">
                  Learn more <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: "var(--sp-4)" }}>
            <Link href="/services" className="btn btn-outline">
              View all services
            </Link>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section>
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Industries</span>
            <h2>Trusted across growing industries</h2>
            <p className="lead">
              From e-commerce to real estate, our VAs bring industry-specific
              experience to your team.
            </p>
          </div>
          <div className="grid grid-4">
            {[
              {
                icon: <ShoppingBag size={26} />,
                title: "E-commerce & Retail",
                body: "Order management, catalog updates, and customer support.",
              },
              {
                icon: <Home size={26} />,
                title: "Real Estate",
                body: "Listing coordination, lead follow-up, and transaction support.",
              },
              {
                icon: <Stethoscope size={26} />,
                title: "Healthcare",
                body: "Scheduling, patient intake, and administrative support.",
              },
              {
                icon: <Scale size={26} />,
                title: "Legal",
                body: "Document prep, calendaring, and client communications.",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className="card industry-card accent-card"
                style={
                  {
                    "--card-accent": ACCENTS[i + 2].color,
                    "--card-accent-bg": ACCENTS[i + 2].bg,
                  } as React.CSSProperties
                }
              >
                <div
                  className="icon-circle accent-icon"
                  style={
                    {
                      background: ACCENTS[i + 2].bg,
                      color: ACCENTS[i + 2].color,
                    } as React.CSSProperties
                  }
                >
                  {card.icon}
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: "var(--sp-4)" }}>
            <Link href="/industries" className="btn btn-outline">
              Explore all industries
            </Link>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <CTABand />
    </>
  );
}
