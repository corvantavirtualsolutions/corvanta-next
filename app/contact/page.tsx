import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Accordion from "@/components/Accordion";
import ContactSlider from "@/app/components/ContactSlider";
import ContactScrollReset from "@/app/components/ContactScrollReset";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Corvanta Virtual Solutions",
  description:
    "Get in touch with the Corvanta team or find answers to frequently asked questions.",
};

const faqItems = [
  {
    question: "How quickly can I get matched with a Virtual Assistant?",
    answer:
      "Most clients receive their first shortlist of matched candidates within 3 business days of completing an intake call.",
  },
  {
    question: "What does it cost to hire a VA through Corvanta?",
    answer:
      "Pricing depends on hours and specialty, with monthly plans starting around $800/month. There's no cost to get matched - you only pay once you select a VA.",
  },
  {
    question: "Can I change or cancel my VA engagement?",
    answer:
      "Yes. Engagements are month-to-month, so you can adjust hours, request a new match, or pause at any time.",
  },
  {
    question: "How are Virtual Assistants vetted?",
    answer:
      "Every VA completes a skills assessment, background check, and live interview with our talent team before joining the network.",
  },
];

export default function ContactPage() {
  return (
    <>
      <ContactScrollReset />

      {/* Page Hero — untouched */}
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Contact
          </div>
          <h1>We'd love to hear from you</h1>
          <p className="lead">
            Questions about hiring a VA or partnering with Corvanta? Reach out
            any time.
          </p>
        </div>
      </section>

      {/* Four equal info cards */}
      <section className="section-tight bg-surface">
        <div className="container">
          <div className="grid grid-2 contact-info-cards">

            <div
              className="card text-center accent-card"
              style={{ "--card-accent": "#2EB87C", "--card-accent-bg": "#E6F7EF" } as React.CSSProperties}
            >
              <div className="icon-circle" style={{ margin: "0 auto var(--sp-2)" }}>
                <Mail size={24} />
              </div>
              <h4>Email Us</h4>
              <p style={{ marginBottom: 0 }}>
                <a href="mailto:corvantavirtualsolutions@gmail.com">
                  corvantavirtualsolutions@gmail.com
                </a>
              </p>
            </div>

            <div
              className="card text-center accent-card"
              style={{ "--card-accent": "#0F766E", "--card-accent-bg": "rgba(15,118,110,0.12)" } as React.CSSProperties}
            >
              <div className="icon-circle teal" style={{ margin: "0 auto var(--sp-2)" }}>
                <Phone size={24} />
              </div>
              <h4>Call Us</h4>
              <p style={{ marginBottom: 0 }}>
                <a href="tel:4632239883">(463) 223-9883</a>
              </p>
            </div>

            <div
              className="card text-center accent-card"
              style={{ "--card-accent": "#7C3AED", "--card-accent-bg": "rgba(124,58,237,0.10)" } as React.CSSProperties}
            >
              <div className="icon-circle navy" style={{ margin: "0 auto var(--sp-2)" }}>
                <MapPin size={24} />
              </div>
              <h4>Visit Us</h4>
              <p style={{ marginBottom: 0 }}>
                1800 N Meridian Suite 400b<br />
                Indianapolis, IN 46202
              </p>
            </div>

            <div
              className="card text-center accent-card"
              style={{ "--card-accent": "#EA580C", "--card-accent-bg": "rgba(234,88,12,0.10)" } as React.CSSProperties}
            >
              <div className="icon-circle" style={{ margin: "0 auto var(--sp-2)", background: "rgba(15,118,110,0.1)", color: "var(--color-accent)" }}>
                <Clock size={24} />
              </div>
              <h4>Support Hours</h4>
              <p style={{ marginBottom: 4 }}>Monday - Friday, 8:00 AM - 6:00 PM ET</p>
              <p style={{ marginBottom: 0 }}>Avg. response: under 4 hours</p>
            </div>

          </div>
        </div>
      </section>

      {/* Full-bleed two-column: form left, image slider right */}
      <section className="contact-main-section">
        <div className="contact-main-grid">

          <div className="contact-form-side">
            <span className="eyebrow">Get in Touch</span>
            <h2>Send us a message</h2>
            <p className="lead">
              Fill out the form and our team will respond within one business
              day.
            </p>

            <ContactForm />
          </div>

          <div className="contact-media-side">
            <ContactSlider />
          </div>

        </div>
      </section>

      {/* FAQ — bg-surface creates a clear visual break from the section above */}
      <section id="faq" className="bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">FAQs</span>
            <h2>Frequently asked questions</h2>
            <p className="lead">Quick answers to common questions from businesses and Virtual Assistants.</p>
          </div>
          <Accordion items={faqItems} />
        </div>
      </section>
    </>
  );
}
