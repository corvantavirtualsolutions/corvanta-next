import type { Metadata } from "next";
import ServicePageLayout from "../../components/ServicePageLayout";

export const metadata: Metadata = {
  title: "Social Media Management | Corvanta Virtual Solutions",
  description:
    "Content calendars, scheduled posts, and community replies - your VA handles the execution while you focus on the vision.",
};

export default function SocialMediaManagementPage() {
  return (
    <ServicePageLayout
      title="Social Media Management"
      headline="A consistent social presence without the constant hustle"
      lead="Content calendars, scheduled posts, and community replies - your VA handles the execution while you focus on the vision."
      color="#7C3AED"
      bg="rgba(124,58,237,0.10)"
      includes={[
        {
          title: "Content Calendar Creation",
          body: "Plan a month of posts in advance - consistent, strategic, and on-brand.",
        },
        {
          title: "Post Scheduling",
          body: "Schedule content across Instagram, Facebook, LinkedIn, and TikTok.",
        },
        {
          title: "Caption & Hashtag Writing",
          body: "Engaging copy and optimised hashtags that drive reach and engagement.",
        },
        {
          title: "Community Management",
          body: "Respond to comments and DMs to build a loyal, active following.",
        },
        {
          title: "Graphic Coordination",
          body: "Brief designers or use templates to produce scroll-stopping visuals.",
        },
        {
          title: "Performance Reporting",
          body: "Monthly reports on reach, engagement, and follower growth with clear insights.",
        },
      ]}
      whoFor={[
        "Personal Brands",
        "E-commerce Stores",
        "Local Businesses",
        "Marketing Agencies",
      ]}
      ctaEyebrow="GROW YOUR PRESENCE"
      ctaHeadline="Post consistently. Engage genuinely. Grow steadily."
      ctaSubtext="Your social media VA will keep your channels active and your audience engaged - every single week."
    />
  );
}
