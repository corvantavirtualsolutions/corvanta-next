import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & News | Corvanta",
  description:
    "Insights on remote work, delegation, and growing your business with Corvanta.",
};

const posts = [
  {
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=70",
    alt: "How to Write a Job Brief Your VA Will Actually Understand",
    badge: "Hiring",
    date: "July 10, 2026",
    title: "How to Write a Job Brief Your VA Will Actually Understand",
    excerpt:
      "A clear brief is the difference between a great match and a frustrating one. Here's our template.",
  },
  {
    img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=700&q=70",
    alt: "The Real ROI of Hiring a Virtual Assistant",
    badge: "Productivity",
    date: "June 28, 2026",
    title: "The Real ROI of Hiring a Virtual Assistant",
    excerpt:
      "We break down the time and cost savings businesses see in their first 90 days.",
  },
  {
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=70",
    alt: "Building Trust with a Remote Team Member",
    badge: "Remote Work",
    date: "June 14, 2026",
    title: "Building Trust with a Remote Team Member",
    excerpt:
      "Simple habits that help new VAs ramp up fast and feel like part of the team.",
  },
  {
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=700&q=70",
    alt: "5 Skills in High Demand for Virtual Assistants Right Now",
    badge: "VA Careers",
    date: "June 2, 2026",
    title: "5 Skills in High Demand for Virtual Assistants Right Now",
    excerpt:
      "What businesses are hiring for today — and how to position yourself for it.",
  },
  {
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=70",
    alt: "How Loop Commerce Scaled Support 3x Without New Hires",
    badge: "Case Study",
    date: "May 20, 2026",
    title: "How Loop Commerce Scaled Support 3x Without New Hires",
    excerpt:
      "A look at how one e-commerce team used Corvanta to handle seasonal spikes.",
  },
  {
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=70",
    alt: "Corvanta Surpasses 1,200 Vetted Virtual Assistants",
    badge: "Company News",
    date: "May 5, 2026",
    title: "Corvanta Surpasses 1,200 Vetted Virtual Assistants",
    excerpt:
      "A milestone update on our growing network and what it means for clients.",
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Blog &amp; News
          </div>
          <h1>Blog &amp; News</h1>
          <p className="lead">
            Insights on remote work, delegation, and growing your business with
            the right support.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="section-tight">
        <div className="container">
          <Link
            href="/blog"
            className="card"
            style={{
              padding: 0,
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=70"
              alt="Featured article"
              style={{
                borderRadius: 0,
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                padding: "var(--sp-4)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="meta">
                <span className="badge">Featured</span> &nbsp; July 18, 2026
              </div>
              <h2>5 Tasks Every Founder Should Delegate First</h2>
              <p>
                If you&rsquo;re doing everything yourself, growth stalls.
                Here&rsquo;s where to start when handing off work to a Virtual
                Assistant.
              </p>
              <span className="card-link">
                Read article <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Post Grid */}
      <section className="bg-surface">
        <div className="container">
          <div className="grid grid-3">
            {posts.map((post) => (
              <Link key={post.title} href="/blog" className="card blog-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.img} alt={post.alt} />
                <div className="blog-card-body">
                  <div className="meta">
                    <span className="badge">{post.badge}</span> &nbsp;{" "}
                    {post.date}
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="card-link">
                    Read article <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section>
        <div className="container">
          <div className="cta-band">
            <span
              className="eyebrow"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
            >
              Stay Updated
            </span>
            <h2>Get delegation tips in your inbox</h2>
            <p className="lead">
              One email a month. No spam, just useful insights on growing your
              business.
            </p>
            <form
              className="flex gap-2 flex-wrap flex-center"
              style={{ maxWidth: 480, margin: "var(--sp-3) auto 0" }}
            >
              <input
                type="email"
                className="form-input"
                placeholder="you@company.com"
                style={{ flex: 1, minWidth: 220 }}
              />
              <button type="button" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
