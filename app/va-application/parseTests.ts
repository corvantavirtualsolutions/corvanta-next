import fs from "fs";
import path from "path";
import type { TestQuestion, MCQuestion, WritingQuestion } from "./testTypes";

function parseMCOptions(optionsPart: string): { options: string[]; correctIndex: number } {
  // Options are separated by two spaces + letter (B/C/D) + ". "
  const parts = optionsPart.split(/  [B-D]\. /);
  const correctIndex = parts.findIndex((p) => p.includes("✅"));
  const options = parts.map((p) =>
    p.replace(/✅/g, "").replace(/\s+/g, " ").trim()
  );
  return { options, correctIndex: Math.max(correctIndex, 0) };
}

export function parseEnglishTest(): TestQuestion[] {
  const filePath = path.join(process.cwd(), "data", "english-test.md");
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

  const questions: TestQuestion[] = [];
  let passage = "";

  for (const line of lines) {
    if (line.startsWith("Passage:")) {
      passage = line.replace("Passage:", "").trim();
      continue;
    }

    const qMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (!qMatch) continue;

    const num = parseInt(qMatch[1]);
    const rest = qMatch[2];
    const aIdx = rest.indexOf(" A. ");

    if (aIdx !== -1) {
      const questionText = rest.substring(0, aIdx).trim();
      const optionsPart = rest.substring(aIdx + 4);
      const { options, correctIndex } = parseMCOptions(optionsPart);

      // Per-section timers
      let timeSeconds = 30; // grammar (1-18) + business English (24-27)
      if (num >= 19 && num <= 23) timeSeconds = 45; // reading comprehension

      const q: MCQuestion = {
        type: "mc",
        number: num,
        text: questionText,
        options,
        correctIndex,
        timeSeconds,
      };
      if (num >= 19 && num <= 23 && passage) q.passage = passage;
      questions.push(q);
    } else {
      // Writing question (Q28-30)
      const q: WritingQuestion = {
        type: "writing",
        number: num,
        text: rest.trim(),
        timeSeconds: 180,
      };
      questions.push(q);
    }
  }

  return questions;
}

export function parseIQTest(): TestQuestion[] {
  const filePath = path.join(process.cwd(), "data", "iq-test.md");
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

  const questions: TestQuestion[] = [];

  for (const line of lines) {
    const qMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (!qMatch) continue;

    const num = parseInt(qMatch[1]);
    const rest = qMatch[2];
    const aIdx = rest.indexOf(" A. ");

    if (aIdx !== -1) {
      const questionText = rest.substring(0, aIdx).trim();
      const optionsPart = rest.substring(aIdx + 4);
      const { options, correctIndex } = parseMCOptions(optionsPart);

      questions.push({
        type: "mc",
        number: num,
        text: questionText,
        options,
        correctIndex,
        timeSeconds: 45,
      });
    }
  }

  return questions;
}
