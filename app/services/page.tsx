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

export const metadata: Metadata = {
  title: "Services | Corvanta",
  description:
    "Explore the full range of Virtual Assistant services Corvanta offers.",
};

const services = [
  {
    icon: <Inbox size={26} />,
    title: "Admin Support",
    body: "Inbox and calendar management, scheduling, travel coordination, and day-to-day operations.",
  },
  {
    icon: <MessageCircle size={26} />,
    title: "Customer Service",
    body: "Responsive, on-brand support across email, live chat, and social channels.",
  },
  {
    icon: <Share2 size={26} />,
    title: "Social Media Management",
    body: "Content calendars, post scheduling, and community engagement across platforms.",
  },
  {
    icon: <Calculator size={26} />,
    title: "Bookkeeping & Accounting",
    body: "Invoicing, expense tracking, reconciliation, and monthly financial reporting.",
  },
  {
    icon: <PenTool size={26} />,
    title: "Content & Copywriting",
    body: "Blog posts, email campaigns, product descriptions, and website copy.",
  },
  {
    icon: <Database size={26} />,
    title: "Data Entry & Research",
    body: "Data cleanup, lead list building, market research, and reporting.",
  },
  {
    icon: <Briefcase size={26} />,
    title: "Executive Assistance",
    body: "High-level calendar management, meeting prep, and executive coordination.",
  },
  {
    icon: <ShoppingCart size={26} />,
    title: "E-commerce Support",
    body: "Order processing, inventory updates, listings, and marketplace management.",
  },
  {
    icon: <Headphones size={26} />,
    title: "Technical & Help Desk Support",
    body: "Tier-1 troubleshooting, ticket triage, and customer onboarding help.",
  },
];

export default function ServicesPage() {
  return (
    <>
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
            {services.map((s) => (
              <div key={s.title} className="card service-card">
                <div className="icon-circle">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <Link href="/services" className="card-link">
                  Learn more <ArrowRight size={16} />
                </Link>
              </div>
            ))}
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

      {/* CTA Band */}
      <section>
        <div className="container">
          <div className="cta-band">
            <h2>Ready to delegate the busywork?</h2>
            <p className="lead">
              Get matched with a specialized Virtual Assistant in as little as 3
              days.
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
