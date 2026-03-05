"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "summary", label: "Summary" },
  { id: "why", label: "Why" },
  { id: "how", label: "How" },
  { id: "what", label: "What" },
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
      <p className="font-semibold uppercase tracking-widest text-accent-cyan mb-4">
        Contents
      </p>
      <ul className="space-y-1 border-l border-glass-border">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`block pl-4 py-1.5 text-sm transition-colors border-l-2 -ml-px ${
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
