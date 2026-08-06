export type MCQuestion = {
  type: "mc";
  number: number;
  text: string;
  options: string[];
  correctIndex: number;
  timeSeconds: number;
  passage?: string;
};

export type WritingQuestion = {
  type: "writing";
  number: number;
  text: string;
  timeSeconds: number;
};

export type TestQuestion = MCQuestion | WritingQuestion;

export interface EnglishTestResult {
  mcScore: number;
  writing1: string;
  writing2: string;
  writing3: string;
}

export interface IQTestResult {
  iqScore: number;
}
