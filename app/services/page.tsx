import type { Metadata } from "next";
import Link from "next/link";
import {
  Inbox,
  MessageCircle,
  Share2,
  Calculator,
  PenTool,
  Database,
  Briefcase,
  ShoppingCart,
  Headphones,
  ArrowRight,
} from "lucide-react";
import CTABand from "../components/CTABand";
import ScrollToTop from "../components/ScrollToTop";

export const metadata: Metadata = {
  title: "Services | Corvanta Virtual Solutions",
  description:
    "Explore the full range of Virtual Assistant services Corvanta offers.",
};

const ACCENT_COLORS = [
  { color: "#2EB87C", bg: "#E6F7EF" },
  { color: "#0F766E", bg: "rgba(15,118,110,0.12)" },
  { color: "#7C3AED", bg: "rgba(124,58,237,0.10)" },
  { color: "#EA580C", bg: "rgba(234,88,12,0.10)" },
];

const services = [
  {
    icon: <Inbox size={26} />,
    title: "Admin Support",
    slug: "admin-support",
    body: "Inbox and calendar management, scheduling, travel coordination, and day-to-day operations.",
  },
  {
    icon: <MessageCircle size={26} />,
    title: "Customer Service",
    slug: "customer-service",
    body: "Responsive, on-brand support across email, live chat, and social channels.",
  },
  {
    icon: <Share2 size={26} />,
    title: "Social Media Management",
    slug: "social-media-management",
    body: "Content calendars, post scheduling, and community engagement across platforms.",
  },
  {
    icon: <Calculator size={26} />,
    title: "Bookkeeping & Accounting",
    slug: "bookkeeping-accounting",
    body: "Invoicing, expense tracking, reconciliation, and monthly financial reporting.",
  },
  {
    icon: <PenTool size={26} />,
    title: "Content & Copywriting",
    slug: "content-copywriting",
    body: "Blog posts, email campaigns, product descriptions, and website copy.",
  },
  {
    icon: <Database size={26} />,
    title: "Data Entry & Research",
    slug: "data-entry-research",
    body: "Data cleanup, lead list building, market research, and reporting.",
  },
  {
    icon: <Briefcase size={26} />,
    title: "Executive Assistance",
    slug: "executive-assistance",
    body: "High-level calendar management, meeting prep, and executive coordination.",
  },
  {
    icon: <ShoppingCart size={26} />,
    title: "E-commerce Support",
    slug: "ecommerce-support",
    body: "Order processing, inventory updates, listings, and marketplace management.",
  },
  {
    icon: <Headphones size={26} />,
    title: "Technical & Help Desk Support",
    slug: "technical-support",
    body: "Tier-1 troubleshooting, ticket triage, and customer onboarding help.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <ScrollToTop />

      {/* Page Hero */}
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Services
          </div>
          <h1>Services we offer</h1>
          <p className="lead">
            Specialized Virtual Assistants across every function your business
            needs to run smoothly.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section>
        <div className="container">
          <div className="grid grid-3">
            {services.map((s, i) => {
              const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
              return (
                <div
                  key={s.title}
                  className="card feature-card accent-card"
                  style={{
                    textAlign: "center",
                    ["--card-accent" as string]: accent.color,
                    ["--card-accent-bg" as string]: accent.bg,
                  }}
                >
                  <div
                    className="accent-icon icon-circle"
                    style={{
                      background: accent.bg,
                      color: accent.color,
                    }}
                  >
                    {s.icon}
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <Link href={`/services/${s.slug}`} className="card-link">
                    Learn more <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Needs */}
      <section className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Custom Needs</span>
            <h2>Don&rsquo;t see exactly what you need?</h2>
            <p className="lead">
              Every business is different &mdash; tell us your specific
              requirements and we&rsquo;ll find the right fit.
            </p>
          </div>
          <div className="text-center">
            <Link href="/find-a-talent" className="btn btn-primary btn-lg">
              Tell Us What You Need <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="WHAT WE DO BEST"
        headline="Find the specialist your business needs."
        subtext="Tell us what's on your plate - we'll match you with a VA who's done it before."
      />
    </>
  );
}
