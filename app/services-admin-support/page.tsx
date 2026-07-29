import type { Metadata } from "next";
import ServicePageLayout from "../components/ServicePageLayout";

export const metadata: Metadata = {
  title: "Admin Support | Corvanta Virtual Solutions",
  description:
    "Admin VAs handle the day-to-day tasks that eat up your time, so you can focus on decisions that move the needle.",
};

export default function AdminSupportPage() {
  return (
    <ServicePageLayout
      title="Admin Support"
      headline="Admin support that keeps your business running"
      lead="Our admin VAs handle the day-to-day tasks that eat up your time, so you can focus on decisions that move the needle."
      color="#2EB87C"
      bg="#E6F7EF"
      includes={[
        {
          title: "Inbox & Email Management",
          body: "Triage, respond, and organise your inbox so nothing important slips through.",
        },
        {
          title: "Calendar & Scheduling",
          body: "Manage appointments, block focus time, and coordinate across time zones.",
        },
        {
          title: "Travel Coordination",
          body: "Book flights, hotels, and transfers - itineraries handled start to finish.",
        },
        {
          title: "Document Preparation",
          body: "Drafts, slide decks, reports, and templates formatted to your standard.",
        },
        {
          title: "Meeting Notes & Follow-ups",
          body: "Capture action items and send follow-ups so every meeting produces results.",
        },
        {
          title: "CRM Data Entry",
          body: "Keep your contacts and pipeline records accurate and up to date.",
        },
      ]}
      whoFor={[
        "Founders & Solopreneurs",
        "Small Business Owners",
        "Busy Executives",
        "Growing Teams",
      ]}
      ctaEyebrow="GET YOUR TIME BACK"
      ctaHeadline="Ready to clear your plate?"
      ctaSubtext="An admin VA can take 10+ hours of busywork off your week. Let's find yours."
    />
  );
}
