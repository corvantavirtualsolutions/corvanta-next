import type { Metadata } from "next";
import VAApplicationWizard from "./VAApplicationWizard";
import { parseEnglishTest, parseIQTest } from "./parseTests";

export const metadata: Metadata = {
  title: "VA Application | Corvanta Virtual Solutions",
  description: "Apply to join the Corvanta Virtual Assistant network.",
};

export default function VAApplicationPage() {
  const englishQuestions = parseEnglishTest();
  const iqQuestions = parseIQTest();

  return (
    <VAApplicationWizard
      englishQuestions={englishQuestions}
      iqQuestions={iqQuestions}
    />
  );
}
