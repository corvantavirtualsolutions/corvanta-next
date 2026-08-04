import type { Metadata } from "next";
import VAApplicationWizard from "./VAApplicationWizard";

export const metadata: Metadata = {
  title: "VA Application | Corvanta Virtual Solutions",
  description:
    "Apply to join the Corvanta Virtual Assistant network.",
};

export default function VAApplicationPage() {
  return <VAApplicationWizard />;
}
