import type { Metadata } from "next";
import ServicePageLayout from "../../components/ServicePageLayout";

export const metadata: Metadata = {
  title: "Customer Service | Corvanta Virtual Solutions",
  description:
    "Fast, empathetic, on-brand responses across every channel - handled by VAs trained to represent your business.",
};

export default function CustomerServicePage() {
  return (
    <ServicePageLayout
      title="Customer Service"
      headline="Customer support your clients will actually rave about"
      lead="Fast, empathetic, on-brand responses across every channel - handled by VAs trained to represent your business."
      color="#0F766E"
      bg="rgba(15,118,110,0.12)"
      includes={[
        {
          title: "Email Support",
          body: "Timely, professional responses that resolve issues and build loyalty.",
        },
        {
          title: "Live Chat Management",
          body: "Real-time support on your site or app - fast responses, zero backlog.",
        },
        {
          title: "Social Media DMs",
          body: "Handle Instagram, Facebook, and Twitter messages in your brand voice.",
        },
        {
          title: "Order Issue Resolution",
          body: "Manage returns, refunds, and shipping issues from start to finish.",
        },
        {
          title: "FAQ & Knowledge Base",
          body: "Keep your self-service resources accurate, comprehensive, and easy to navigate.",
        },
        {
          title: "Customer Feedback Tracking",
          body: "Collect, categorise, and report on customer sentiment to inform your roadmap.",
        },
      ]}
      whoFor={[
        "E-commerce Brands",
        "SaaS Companies",
        "Service Businesses",
        "Online Retailers",
      ]}
      ctaEyebrow="ELEVATE YOUR SUPPORT"
      ctaHeadline="Happy customers start here."
      ctaSubtext="Give your customers the response times they deserve - without hiring a full in-house team."
    />
  );
}
