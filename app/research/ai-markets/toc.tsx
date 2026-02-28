"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "what-the-data-shows", label: "What the Data Shows" },
  { id: "scenario-framework", label: "Scenario Framework" },
  { id: "sector-implications", label: "Sector Implications" },
  { id: "tail-risk-hedging", label: "Tail Risk Hedging" },
  { id: "monitoring-framework", label: "Monitoring Framework" },
  { id: "portfolio-construction", label: "Portfolio Construction" },
  { id: "key-risks", label: "Key Risks" },
  { id: "conclusion", label: "Conclusion" },
  { id: "sources", label: "Sources" },
];

export default function TableOfContents() {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="hidden lg:block sticky top-28 self-start w-56 shrink-0">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan mb-4">
        Contents
      </p>
      <ul className="space-y-1 border-l border-glass-border">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`block pl-4 py-1.5 text-[13px] transition-colors border-l-2 -ml-px ${
                activeId === s.id
                  ? "border-accent-cyan text-accent-cyan font-medium"
                  : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
