import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Corvanta Virtual Solutions",
  description: "Corvanta's Terms of Service.",
};

const sections = [
  {
    heading: "1. Acceptance of Terms",
    body: "By accessing or using the Corvanta website and services, you agree to be bound by these Terms of Service.",
  },
  {
    heading: "2. Description of Services",
    body: "Corvanta connects businesses seeking administrative and operational support — including admin support, customer service, social media management, bookkeeping, content writing, data entry, executive assistance, e-commerce support, and technical support — with independent Virtual Assistants. Corvanta facilitates introductions and matching and does not employ Virtual Assistants directly.",
  },
  {
    heading: "3. Eligibility",
    body: "You must be at least 18 years old and able to form a binding contract to use our services.",
  },
  {
    heading: "4. Client Responsibilities",
    body: "Businesses are responsible for providing accurate information about their needs and for any agreements made directly with a matched Virtual Assistant. Clients must review and sign the formal service contract provided by Corvanta before any engagement is finalized.",
  },
  {
    heading: "5. Virtual Assistant Responsibilities",
    body: "Applicants agree to provide accurate information and to conduct themselves professionally when engaging with Corvanta and its clients. VAs must complete Corvanta's vetting process, including skills assessments and background checks, before being matched.",
  },
  {
    heading: "6. Fees",
    body: "Corvanta charges a one-time matching fee of $500 for your first Virtual Assistant (which includes your first month of VA work) and $129 per additional VA. An ongoing platform and support fee of $29/month applies after your VA is placed. A formal contract is sent to you for review and signature before any payment is required. The monthly support fee may be cancelled at any time with no long-term lock-in. Fees are otherwise non-refundable except as required by law.",
  },
  {
    heading: "7. Limitation of Liability",
    body: "Corvanta is not liable for indirect, incidental, or consequential damages arising from use of our platform or services.",
  },
  {
    heading: "8. Termination",
    body: "Corvanta may suspend or terminate access to our services for violation of these terms.",
  },
  {
    heading: "9. Governing Law",
    body: "These Terms are governed by the laws of the State of Indiana, without regard to conflict of law principles.",
  },
  {
    heading: "10. Contact Us",
    body: "Questions about these Terms can be sent to admin@corvantavirtualsolutions.net.",
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Terms of Service
          </div>
          <h1>Terms of Service</h1>
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
