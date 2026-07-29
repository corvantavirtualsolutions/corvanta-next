import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingBag,
  Home,
  Stethoscope,
  Scale,
  Megaphone,
  Cpu,
  TrendingUp,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Industries | Corvanta Virtual Solutions",
  description:
    "See the industries Corvanta's Virtual Assistants specialize in supporting.",
};

const ACCENTS = [
  { color: "#2EB87C", bg: "#E6F7EF" },
  { color: "#0F766E", bg: "rgba(15,118,110,0.12)" },
  { color: "#7C3AED", bg: "rgba(124,58,237,0.10)" },
  { color: "#EA580C", bg: "rgba(234,88,12,0.10)" },
  { color: "#2EB87C", bg: "#E6F7EF" },
  { color: "#0F766E", bg: "rgba(15,118,110,0.12)" },
  { color: "#7C3AED", bg: "rgba(124,58,237,0.10)" },
  { color: "#EA580C", bg: "rgba(234,88,12,0.10)" },
];

const industries = [
  {
    icon: <ShoppingBag size={26} />,
    title: "E-commerce & Retail",
    body: "Order management, catalog updates, customer support, and returns handling.",
  },
  {
    icon: <Home size={26} />,
    title: "Real Estate",
    body: "Listing coordination, lead follow-up, transaction paperwork, and client communication.",
  },
  {
    icon: <Stethoscope size={26} />,
    title: "Healthcare",
    body: "Appointment scheduling, patient intake, insurance verification, and admin support.",
  },
  {
    icon: <Scale size={26} />,
    title: "Legal",
    body: "Document preparation, case file organization, calendaring, and client intake.",
  },
  {
    icon: <Megaphone size={26} />,
    title: "Marketing Agencies",
    body: "Campaign coordination, reporting, content scheduling, and client communications.",
  },
  {
    icon: <Cpu size={26} />,
    title: "SaaS & Technology",
    body: "Customer onboarding, support tickets, data management, and QA coordination.",
  },
  {
    icon: <TrendingUp size={26} />,
    title: "Finance & Insurance",
    body: "Data entry, client file management, reporting, and compliance documentation.",
  },
  {
    icon: <GraduationCap size={26} />,
    title: "Coaching & Consulting",
    body: "Client scheduling, content creation, community management, and billing.",
  },
];

export default function IndustriesPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Industries
          </div>
          <h1>Industries we serve</h1>
          <p className="lead">
            Our Virtual Assistants bring industry-specific experience to
            businesses across a wide range of sectors.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section>
        <div className="container">
          <div className="grid grid-3">
            {industries.map((ind, i) => (
              <div
                key={ind.title}
                className="card industry-card"
                style={
                  {
                    "--ind-color": ACCENTS[i].color,
                    "--ind-bg": ACCENTS[i].bg,
                  } as React.CSSProperties
                }
              >
                <div
                  className="icon-circle"
                  style={{ background: ACCENTS[i].bg, color: ACCENTS[i].color }}
                >
                  {ind.icon}
                </div>
                <h3>{ind.title}</h3>
                <p>{ind.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not Listed */}
      <section className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Not Listed?</span>
            <h2>We support businesses of every kind</h2>
            <p className="lead">
              If your industry isn&rsquo;t listed, chances are we&rsquo;ve
              still got the right skill set for you.
            </p>
          </div>
          <div className="text-center">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Talk to Our Team <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section>
        <div className="container">
          <div className="cta-band">
            <h2>Find talent that knows your industry</h2>
            <p className="lead">
              Get matched with a Virtual Assistant who already understands how
              your business works.
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
