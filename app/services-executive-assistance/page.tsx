import type { Metadata } from "next";
import ServicePageLayout from "../components/ServicePageLayout";

export const metadata: Metadata = {
  title: "Executive Assistance | Corvanta Virtual Solutions",
  description:
    "Executive VAs coordinate complex schedules, prepare for high-stakes meetings, and keep everything moving so nothing falls through the cracks.",
};

export default function ExecutiveAssistancePage() {
  return (
    <ServicePageLayout
      title="Executive Assistance"
      headline="A right-hand VA for your highest-priority work"
      lead="Executive VAs coordinate complex schedules, prepare for high-stakes meetings, and keep everything moving so nothing falls through the cracks."
      color="#7C3AED"
      bg="rgba(124,58,237,0.10)"
      includes={[
        {
          title: "Complex Calendar Management",
          body: "Multi-timezone scheduling, priority-first booking, and proactive conflict resolution.",
        },
        {
          title: "Meeting Prep & Agendas",
          body: "Pre-reads, agendas, and follow-up notes so every meeting is productive and purposeful.",
        },
        {
          title: "Board & Investor Materials",
          body: "Compile decks, reports, and data packs that arrive polished and on time.",
        },
        {
          title: "Internal Communications",
          body: "Draft announcements, memos, and updates in your voice and at the right level.",
        },
        {
          title: "Vendor & Partner Coordination",
          body: "Manage relationships, chase deliverables, and keep third parties accountable.",
        },
        {
          title: "Expense Reports",
          body: "Reconcile receipts, code expenses, and submit reports on deadline, every time.",
        },
      ]}
      whoFor={[
        "C-Suite Executives",
        "Founders Scaling Fast",
        "Board Members",
        "Senior Managers",
      ]}
      ctaEyebrow="PROTECT YOUR FOCUS"
      ctaHeadline="Your time is your most valuable asset."
      ctaSubtext="An executive VA shields your calendar, handles the details, and makes sure nothing is missed."
    />
  );
}
