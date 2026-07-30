import type { Metadata } from "next";
import ServicePageLayout from "../../components/ServicePageLayout";

export const metadata: Metadata = {
  title: "Content & Copywriting | Corvanta Virtual Solutions",
  description:
    "Blog posts, email sequences, product descriptions - your content VA keeps your pipeline full and your voice consistent.",
};

export default function ContentCopywritingPage() {
  return (
    <ServicePageLayout
      title="Content & Copywriting"
      headline="Words that work for your brand around the clock"
      lead="Blog posts, email sequences, product descriptions - your content VA keeps your pipeline full and your voice consistent."
      color="#2EB87C"
      bg="#E6F7EF"
      includes={[
        {
          title: "Blog & Article Writing",
          body: "Well-researched, SEO-friendly posts that build authority and drive organic traffic.",
        },
        {
          title: "Email Campaigns",
          body: "Sequences, newsletters, and one-off sends written to open, click, and convert.",
        },
        {
          title: "Product Descriptions",
          body: "Compelling copy that highlights benefits and drives purchase decisions.",
        },
        {
          title: "Website Copy",
          body: "Landing pages, about sections, and service pages that clearly communicate your value.",
        },
        {
          title: "SEO Optimisation",
          body: "Keyword research and on-page optimisation baked into every piece of content.",
        },
        {
          title: "Newsletter Management",
          body: "Plan, write, and schedule your newsletter so your list never goes cold.",
        },
      ]}
      whoFor={[
        "E-commerce Brands",
        "B2B Companies",
        "SaaS Platforms",
        "Marketing Agencies",
      ]}
      ctaEyebrow="FILL YOUR CONTENT PIPELINE"
      ctaHeadline="Great content, every week. Without writing it yourself."
      ctaSubtext="A content VA keeps your brand visible, your audience engaged, and your content calendar full."
    />
  );
}
