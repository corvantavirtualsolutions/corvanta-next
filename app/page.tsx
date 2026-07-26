import Link from "next/link";
import Image from "next/image";
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
  Star,
} from "lucide-react";

export const metadata = {
  title: "Home | Corvanta",
  description:
    "Corvanta matches you with vetted, experienced Virtual Assistants who handle the busywork — so your team can focus on growth.",
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-split">
          <div>
            <span className="eyebrow">
              <Sparkles size={14} /> Trusted by 200+ growing businesses
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
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=70"
              alt="Virtual assistant working with a business team"
              width={900}
              height={600}
              unoptimized
            />
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
                  1,200+ VAs
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
          <div className="grid grid-4">
            {[
              { value: "1,200+", label: "Vetted Virtual Assistants" },
              { value: "200+", label: "Businesses Served" },
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
                modifier: "",
                title: "Rigorously Vetted",
                body: "Every VA passes a multi-step screening process including skills assessments, background checks, and interviews.",
              },
              {
                icon: <Zap size={26} />,
                modifier: "teal",
                title: "Fast Matching",
                body: "Tell us what you need and get matched with qualified candidates in as little as 3 business days.",
              },
              {
                icon: <Headphones size={26} />,
                modifier: "navy",
                title: "Dedicated Support",
                body: "A dedicated success manager stays with you to ensure the partnership keeps delivering results.",
              },
              {
                icon: <ShieldCheck size={26} />,
                modifier: "",
                title: "Flexible Engagements",
                body: "Scale hours up or down monthly based on your workload — no long-term lock-in required.",
              },
              {
                icon: <Layers size={26} />,
                modifier: "teal",
                title: "Wide Skill Coverage",
                body: "From admin support to bookkeeping to social media, find specialized talent across every function.",
              },
              {
                icon: <TrendingUp size={26} />,
                modifier: "navy",
                title: "Transparent Pricing",
                body: "Simple monthly plans with no hidden agency markups or surprise fees.",
              },
            ].map((card) => (
              <div key={card.title} className="card feature-card">
                <div className={`icon-circle${card.modifier ? ` ${card.modifier}` : ""}`}>
                  {card.icon}
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">How It Works</span>
            <h2>Get matched in four simple steps</h2>
            <p className="lead">
              Whether you&rsquo;re hiring or applying, Corvanta makes the
              process fast and painless.
            </p>
          </div>
          <div className="steps">
            {[
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
            ].map((step) => (
              <div key={step.num} className="step-card">
                <div className="step-number">{step.num}</div>
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
            ].map((card) => (
              <div key={card.title} className="card service-card">
                <div className="icon-circle">{card.icon}</div>
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
            ].map((card) => (
              <div key={card.title} className="card industry-card">
                <div className="icon-circle teal">{card.icon}</div>
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

      {/* Testimonials */}
      <section className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Testimonials</span>
            <h2>Loved by businesses like yours</h2>
            <p className="lead">
              Here&rsquo;s what our clients say about working with Corvanta.
            </p>
          </div>
          <div className="grid grid-3">
            {[
              {
                quote:
                  "Corvanta matched us with a VA who felt like part of our team within a week. Our response times have never been better.",
                name: "Maria Chen",
                role: "Founder, Northstar Retail",
                avatarBg: "2EB87C",
              },
              {
                quote:
                  "The vetting process is no joke. Every candidate we met was genuinely qualified — it made hiring easy.",
                name: "James Whitfield",
                role: "Operations Lead, Bright Legal Group",
                avatarBg: "1F2937",
              },
              {
                quote:
                  "We scaled our support team 3x without adding office overhead. Corvanta made it seamless.",
                name: "Priya Natarajan",
                role: "COO, Loop Commerce",
                avatarBg: "0F766E",
              },
            ].map((t) => (
              <div key={t.name} className="card">
                <div
                  className="flex gap-1"
                  style={{ color: "var(--color-warning)", marginBottom: 12 }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <p
                  style={{
                    color: "var(--color-text-primary)",
                    fontSize: "1.0625rem",
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div
                  className="flex gap-2"
                  style={{ alignItems: "center", marginTop: 16 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=${t.avatarBg}&color=fff&size=300&bold=true&font-size=0.38`}
                    alt={t.name}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "999px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section>
        <div className="container">
          <div className="cta-band">
            <span
              className="eyebrow"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
            >
              Ready when you are
            </span>
            <h2>Start delegating the work that&rsquo;s holding you back</h2>
            <p className="lead">
              Tell us what you need and get matched with qualified Virtual
              Assistants this week.
            </p>
            <div className="hero-actions">
              <Link href="/find-a-talent" className="btn btn-primary btn-lg">
                Find a Talent <ArrowRight size={18} />
              </Link>
              <Link
                href="/apply-as-a-va"
                className="btn btn-outline-white btn-lg"
              >
                Apply as a VA
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
