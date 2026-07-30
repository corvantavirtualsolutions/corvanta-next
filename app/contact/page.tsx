import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import Accordion from "@/components/Accordion";
import ContactSlider from "@/app/components/ContactSlider";
import ContactScrollReset from "@/app/components/ContactScrollReset";

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

      {/* Channel strip — email, phone, address as horizontal inline items.
          No card height-matching issues; dividers create clean visual rhythm. */}
      <section className="section-tight bg-surface">
        <div className="container">
          <div className="contact-channels">
            <div className="contact-channel">
              <div className="icon-circle icon-sm">
                <Mail size={20} />
              </div>
              <div className="contact-channel-text">
                <span className="contact-channel-label">Email</span>
                <span className="contact-channel-value">
                  <a href="mailto:corvantavirtualsolutions@gmail.com">
                    corvantavirtualsolutions@gmail.com
                  </a>
                </span>
              </div>
            </div>

            <div className="contact-channel-divider" aria-hidden="true" />

            <div className="contact-channel">
              <div className="icon-circle icon-sm teal">
                <Phone size={20} />
              </div>
              <div className="contact-channel-text">
                <span className="contact-channel-label">Phone</span>
                <span className="contact-channel-value">
                  <a href="tel:4632239883">(463) 223-9883</a>
                </span>
              </div>
            </div>

            <div className="contact-channel-divider" aria-hidden="true" />

            <div className="contact-channel">
              <div className="icon-circle icon-sm navy">
                <MapPin size={20} />
              </div>
              <div className="contact-channel-text">
                <span className="contact-channel-label">Address</span>
                <span className="contact-channel-value">
                  1800 N Meridian Suite 400b<br />
                  Indianapolis, IN 46202
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-bleed two-column: form+hours left, slider+map right */}
      <section className="contact-main-section">
        <div className="contact-main-grid">

          {/* LEFT: eyebrow, heading, form, support hours */}
          <div className="contact-form-side">
            <span className="eyebrow">Get in Touch</span>
            <h2>Send us a message</h2>
            <p className="lead">
              Fill out the form and our team will respond within one business
              day.
            </p>

            <form className="card" style={{ marginTop: "var(--sp-3)" }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Jane Cooper"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="jane@company.com"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">I am a...</label>
                <select className="form-select">
                  <option>Business looking to hire</option>
                  <option>Partner / Press</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-textarea"
                  placeholder="How can we help?"
                />
              </div>
              <button type="button" className="btn btn-primary btn-block">
                Send Message <ArrowRight size={18} />
              </button>
            </form>

            {/* Support hours - tinted bar directly below form */}
            <div className="contact-hours-bar">
              <div className="icon-circle icon-sm" style={{ flexShrink: 0 }}>
                <Clock size={18} />
              </div>
              <div>
                <div className="hours-label">Support Hours</div>
                <p>
                  Monday - Friday, 8:00 AM - 6:00 PM ET<br />
                  Average response time: under 4 hours
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: slider fills top, map pinned at bottom — both flush to edge */}
          <div className="contact-media-side">
            <ContactSlider />
            <div className="contact-map">
              <iframe
                src="https://maps.google.com/maps?q=1800+N+Meridian+St,+Indianapolis,+IN+46202&t=&z=15&ie=UTF8&iwloc=&output=embed"
                title="Corvanta office location"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">FAQs</span>
            <h2>Frequently asked questions</h2>
            <p className="lead">
              Quick answers to common questions from businesses and Virtual
              Assistants.
            </p>
          </div>
          <Accordion items={faqItems} />
        </div>
      </section>
    </>
  );
}
