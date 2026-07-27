import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Corvanta Virtual Solutions",
  description: "Corvanta's Privacy Policy.",
};

const sections = [
  {
    heading: "1. Overview",
    body: 'This Privacy Policy explains how Corvanta Virtual Solutions ("Corvanta," "we," "us") collects, uses, and protects information when you use our website and services, including matching businesses with Virtual Assistants.',
  },
  {
    heading: "2. Information We Collect",
    body: "We collect information you provide directly, such as your name, email, phone number, company details, and application materials, as well as usage data collected automatically through cookies and similar technologies.",
  },
  {
    heading: "3. How We Use Information",
    body: "We use collected information to operate our matching platform, communicate with you, process applications, improve our services, and comply with legal obligations.",
  },
  {
    heading: "4. Sharing of Information",
    body: "We share information with matched businesses or Virtual Assistants as needed to facilitate a placement, and with service providers who help us operate our platform. We do not sell personal information.",
  },
  {
    heading: "5. Data Security",
    body: "We use industry-standard safeguards to protect your information, though no method of transmission or storage is completely secure.",
  },
  {
    heading: "6. Your Choices",
    body: "You may request access to, correction of, or deletion of your personal information by contacting us at hello@corvanta.com.",
  },
  {
    heading: "7. Changes to This Policy",
    body: "We may update this policy from time to time. Material changes will be posted on this page with an updated effective date.",
  },
  {
    heading: "8. Contact Us",
    body: "Questions about this policy can be sent to hello@corvanta.com or 500 Market Street, Suite 300, San Francisco, CA.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Privacy Policy
          </div>
          <h1>Privacy Policy</h1>
          <p className="lead">Last updated: July 1, 2026</p>
        </div>
      </section>

      <section>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="card">
            {sections.map((s) => (
              <div key={s.heading} style={{ marginBottom: "var(--sp-4)" }}>
                <h3>{s.heading}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
