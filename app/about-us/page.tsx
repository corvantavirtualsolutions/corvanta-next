import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Star, Handshake, Lightbulb, ArrowRight } from "lucide-react";
import ScrollToTop from "../components/ScrollToTop";
import StorySlider from "../components/StorySlider";
import CTABand from "../components/CTABand";

export const metadata: Metadata = {
  title: "About Us | Corvanta Virtual Solutions",
  description: "Learn about Corvanta's mission, values, and leadership team.",
};

const VALUE_CARDS = [
  {
    icon: <ShieldCheck size={26} />,
    title: "Trust",
    body: "We earn trust through transparency, rigorous vetting, and consistent follow-through.",
    color: "#2EB87C",
    bg: "#E6F7EF",
  },
  {
    icon: <Star size={26} />,
    title: "Excellence",
    body: "We hold ourselves and our VAs to a high standard of quality and professionalism.",
    color: "#0F766E",
    bg: "rgba(15,118,110,0.12)",
  },
  {
    icon: <Handshake size={26} />,
    title: "Partnership",
    body: "We succeed when our clients and VAs succeed - it's a long-term relationship, not a transaction.",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.10)",
  },
  {
    icon: <Lightbulb size={26} />,
    title: "Innovation",
    body: "We continuously improve how we match talent using better tools and processes.",
    color: "#EA580C",
    bg: "rgba(234,88,12,0.10)",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <ScrollToTop />

      {/* Page Hero */}
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / About Us
          </div>
          <h1>Human connection, powered by great technology</h1>
          <p className="lead">
            Corvanta exists to help businesses grow and skilled professionals
            thrive &mdash; no matter where they&rsquo;re located.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section>
        <div
          className="container grid grid-2"
          style={{ alignItems: "center", gap: "var(--sp-6)" }}
        >
          <div>
            <span className="eyebrow">Our Story</span>
            <h2>Built to make hiring support simple again</h2>
            <p>
              Corvanta was founded on a simple belief: growing a business
              shouldn&rsquo;t mean drowning in admin work, and finding
              meaningful remote work shouldn&rsquo;t be a gamble. We built a
              platform that carefully vets Virtual Assistants and matches them
              with businesses that need their exact skills.
            </p>
            <p>
              Today, Corvanta supports hundreds of businesses across e-commerce,
              real estate, healthcare, legal, and more &mdash; while giving
              skilled professionals around the world flexible, well-paid remote
              careers.
            </p>
            <Link
              href="/contact"
              className="btn btn-primary"
              style={{ marginTop: "var(--sp-2)" }}
            >
              Get in Touch <ArrowRight size={18} />
            </Link>
          </div>
          <StorySlider />
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Our Values</span>
            <h2>What drives everything we do</h2>
            <p className="lead">
              These principles guide how we vet talent, support clients, and
              build our platform.
            </p>
          </div>
          <div className="grid grid-4">
            {VALUE_CARDS.map((card) => (
              <div
                key={card.title}
                className="card feature-card accent-card"
                style={
                  {
                    "--card-accent": card.color,
                    "--card-accent-bg": card.bg,
                    textAlign: "center",
                  } as React.CSSProperties
                }
              >
                <div
                  className="icon-circle accent-icon"
                  style={{ background: card.bg, color: card.color }}
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

      {/* Stats */}
      <section className="section-tight">
        <div className="container">
          <div className="grid grid-4 stats-grid">
            {[
              { value: "2026", label: "Founded" },
              { value: "100+", label: "Businesses Served" },
              { value: "200+", label: "Vetted Virtual Assistants" },
              { value: "10+", label: "Countries Represented" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership — hidden until team section is ready; restore by uncommenting */}
      {/*
      <section id="leadership" className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Leadership</span>
            <h2>Meet the team</h2>
            <p className="lead">
              The people building Corvanta and supporting our community of
              businesses and VAs.
            </p>
          </div>
          <div className="grid grid-4">
            {[
              {
                name: "Daniela Ortiz",
                role: "Chief Executive Officer",
                bio: "15 years in workforce solutions and operations leadership.",
                bg: "2EB87C",
              },
              {
                name: "Marcus Bell",
                role: "Chief Operating Officer",
                bio: "Focused on scaling matching quality and client success.",
                bg: "1F2937",
              },
              {
                name: "Sofia Ramirez",
                role: "Head of Talent",
                bio: "Leads VA vetting, onboarding, and community programs.",
                bg: "0F766E",
              },
              {
                name: "Ethan Wu",
                role: "Head of Partnerships",
                bio: "Builds relationships with businesses across every industry we serve.",
                bg: "2EB87C",
              },
            ].map((member) => (
              <div key={member.name} className="card team-card">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=${member.bg}&color=fff&size=300&bold=true&font-size=0.38`}
                  alt={member.name}
                />
                <h4>{member.name}</h4>
                <div className="role">{member.role}</div>
                <p>{member.bio}</p>
                <div className="team-social">
                  <a href="#" aria-label={`${member.name} on LinkedIn`} className="team-social-link">
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label={`Email ${member.name}`} className="team-social-link">
                    Mail icon
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* CTA Band — About Us specific text, same design as homepage */}
      <CTABand
        eyebrow="TAKE THE NEXT STEP"
        headline="Sounds like a good fit? Let's talk."
        subtext="We're selective about who we work with - on both sides. If our values align with yours, we're ready when you are."
      />
    </>
  );
}
