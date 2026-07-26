"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: string;
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="accordion" style={{ maxWidth: 760, margin: "0 auto" }}>
      {items.map((item, i) => (
        <div
          key={i}
          className={`accordion-item${openIndex === i ? " open" : ""}`}
        >
          <button
            className="accordion-trigger"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            {item.question}
            <ChevronDown size={20} />
          </button>
          <div className="accordion-panel">
            <div className="accordion-panel-inner">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
