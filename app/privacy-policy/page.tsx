import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Corvanta Virtual Solutions",
  description: "Corvanta's Privacy Policy.",
};

const sections = [
  {
    heading: "1. Overview",
    body: 'This Privacy Policy explains how Corvanta Virtual Solutions ("Corvanta," "we," "us") collects, uses, and protects information when you use our website and services, including matching businesses with Virtual Assistants. Corvanta is based in Indianapolis, Indiana.',
  },
  {
    heading: "2. Information We Collect",
    body: "We collect information you provide directly. For businesses, this includes your name, email, phone number, company details, and a description of your support needs. For Virtual Assistant applicants, this includes your name, email, phone number, work history, skills, and other application materials. We also collect usage data automatically through cookies and similar technologies.",
  },
  {
    heading: "3. How We Use Information",
    body: "We use collected information to operate our matching platform, communicate with you, process VA applications and client inquiries, conduct background checks and skills assessments, improve our services, and comply with legal obligations.",
  },
  {
    heading: "4. Sharing of Information",
    body: "We share information with matched businesses or Virtual Assistants as needed to facilitate a placement, and with trusted service providers who help us operate our platform (such as background check providers and communication tools). We do not sell personal information.",
  },
  {
    heading: "5. Data Security",
    body: "We use industry-standard safeguards to protect your information, though no method of transmission or storage is completely secure.",
  },
  {
    heading: "6. Your Choices",
    body: "You may request access to, correction of, or deletion of your personal information by contacting us at admin@corvantavirtualsolutions.net.",
  },
  {
    heading: "7. Changes to This Policy",
    body: "We may update this policy from time to time. Material changes will be posted on this page with an updated effective date.",
  },
  {
    heading: "8. Contact Us",
    body: "Questions about this policy can be sent to admin@corvantavirtualsolutions.net or 1800 N Meridian Suite 400b, Indianapolis, IN 46202.",
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
          <p className="lead">Last updated: August 14, 2026</p>
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
