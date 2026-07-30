import type { Metadata } from "next";
import ServicePageLayout from "../../components/ServicePageLayout";

export const metadata: Metadata = {
  title: "Data Entry & Research | Corvanta Virtual Solutions",
  description:
    "Your research VA builds lead lists, cleans databases, and delivers insights so your team can act on data, not wrestle with it.",
};

export default function DataEntryResearchPage() {
  return (
    <ServicePageLayout
      title="Data Entry & Research"
      headline="Accurate data, faster - without the manual grind"
      lead="Your research VA builds lead lists, cleans databases, and delivers insights so your team can act on data, not wrestle with it."
      color="#0F766E"
      bg="rgba(15,118,110,0.12)"
      includes={[
        {
          title: "Lead List Building",
          body: "Targeted, verified prospect lists built to your exact criteria and ideal customer profile.",
        },
        {
          title: "CRM Data Entry & Cleanup",
          body: "Import, de-duplicate, and enrich your CRM so sales teams work with clean data.",
        },
        {
          title: "Market Research",
          body: "Competitor analysis, pricing research, and industry reports compiled to brief.",
        },
        {
          title: "Spreadsheet Management",
          body: "Build, maintain, and automate spreadsheets that track the metrics you care about.",
        },
        {
          title: "Data Verification",
          body: "Cross-check contact details, company info, and records against reliable sources.",
        },
        {
          title: "Report Generation",
          body: "Formatted, clear reports that turn raw data into actionable business insights.",
        },
      ]}
      whoFor={[
        "Sales Teams",
        "Marketing Departments",
        "Startups",
        "Consulting Firms",
      ]}
      ctaEyebrow="WORK FROM BETTER DATA"
      ctaHeadline="Clean data. Sharper decisions."
      ctaSubtext="Stop wasting time on spreadsheets and research rabbit holes. Your data VA handles it."
    />
  );
}
