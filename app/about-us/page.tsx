import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Star, Handshake, Lightbulb, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Corvanta Virtual Solutions",
  description: "Learn about Corvanta's mission, values, and leadership team.",
};

export default function AboutUsPage() {
  return (
    <>
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
          <Image
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=70"
            alt="Corvanta team collaborating"
            width={900}
            height={600}
            unoptimized
          />
        </div>
      </section>

      {/* Values */}
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
            {[
              {
                icon: <ShieldCheck size={26} />,
                modifier: "",
                title: "Trust",
                body: "We earn trust through transparency, rigorous vetting, and consistent follow-through.",
              },
              {
                icon: <Star size={26} />,
                modifier: "teal",
                title: "Excellence",
                body: "We hold ourselves and our VAs to a high standard of quality and professionalism.",
              },
              {
                icon: <Handshake size={26} />,
                modifier: "navy",
                title: "Partnership",
                body: "We succeed when our clients and VAs succeed — it's a long-term relationship, not a transaction.",
              },
              {
                icon: <Lightbulb size={26} />,
                modifier: "",
                title: "Innovation",
                body: "We continuously improve how we match talent using better tools and processes.",
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

      {/* Stats */}
      <section>
        <div className="container">
          <div className="grid grid-4">
            {[
              { value: "2021", label: "Founded" },
              { value: "200+", label: "Businesses Served" },
              { value: "1,200+", label: "Vetted VAs" },
              { value: "15+", label: "Countries Represented" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=${member.bg}&color=fff&size=300&bold=true&font-size=0.38`}
                  alt={member.name}
                />
                <h4>{member.name}</h4>
                <div className="role">{member.role}</div>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section>
        <div className="container">
          <div className="cta-band">
            <h2>Ready to grow your business?</h2>
            <p className="lead">
              Tell us what you need and we&rsquo;ll match you with the right
              talent.
            </p>
            <div className="hero-actions">
              <Link href="/find-a-talent" className="btn btn-primary btn-lg">
                Find a Talent <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
