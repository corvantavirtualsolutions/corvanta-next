import type { Metadata } from "next";
import ServicePageLayout from "../../components/ServicePageLayout";

export const metadata: Metadata = {
  title: "Technical & Help Desk Support | Corvanta Virtual Solutions",
  description:
    "Your technical VAs handle Tier-1 issues, triage tickets, and onboard customers - keeping your internal team free for complex work.",
};

export default function TechnicalSupportPage() {
  return (
    <ServicePageLayout
      title="Technical & Help Desk Support"
      headline="Expert first-line support for your users"
      lead="Your technical VAs handle Tier-1 issues, triage tickets, and onboard customers - keeping your internal team free for complex work."
      color="#2EB87C"
      bg="#E6F7EF"
      includes={[
        {
          title: "Ticket Triage & Routing",
          body: "Classify, prioritise, and route support tickets to the right team instantly.",
        },
        {
          title: "Password & Account Support",
          body: "Handle password resets, account access, and basic configuration requests.",
        },
        {
          title: "Customer Onboarding",
          body: "Walk new users through setup, activate accounts, and answer first-day questions.",
        },
        {
          title: "Knowledge Base Updates",
          body: "Keep your help docs accurate, comprehensive, and written in plain language.",
        },
        {
          title: "Bug Reporting & Logging",
          body: "Reproduce, document, and log bugs with clear steps so your dev team can fix fast.",
        },
        {
          title: "Live Chat Support",
          body: "Real-time first-line support on your site or app, triaging and resolving where possible.",
        },
      ]}
      whoFor={[
        "SaaS Companies",
        "IT Service Providers",
        "Digital Agencies",
        "App & Software Businesses",
      ]}
      ctaEyebrow="SUPPORT YOUR USERS BETTER"
      ctaHeadline="First-line support that actually solves problems."
      ctaSubtext="Give your users fast, knowledgeable help - and give your team the space to do their best work."
    />
  );
}
