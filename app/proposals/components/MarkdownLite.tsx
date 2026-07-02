import { Fragment, ReactNode } from "react";

/**
 * Minimal markdown renderer for analyst reports.
 * Supports headings, bullet/numbered lists, tables, rules, **bold** and `code`.
 * Builds React nodes directly — no HTML injection.
 */

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Split on **bold** and `code` spans while keeping the delimiters' content
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  parts.forEach((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(
        <strong key={i} className="font-semibold text-text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code key={i} className="font-mono text-xs text-accent-cyan bg-accent-cyan/10 px-1 py-0.5 rounded">
          {part.slice(1, -1)}
        </code>
      );
    } else if (part) {
      nodes.push(<Fragment key={i}>{part}</Fragment>);
    }
  });
  return nodes;
}

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "numbered"; items: string[] }
  | { type: "table"; rows: string[][] }
  | { type: "rule" }
  | { type: "paragraph"; text: string };

function parseBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: "rule" });
      continue;
    }

    if (/^[-•*]\s+/.test(trimmed)) {
      flushParagraph();
      const last = blocks[blocks.length - 1];
      const item = trimmed.replace(/^[-•*]\s+/, "");
      if (last?.type === "bullets") last.items.push(item);
      else blocks.push({ type: "bullets", items: [item] });
      continue;
    }

    const numbered = trimmed.match(/^\d+[.)]\s+(.*)$/);
    if (numbered) {
      flushParagraph();
      const last = blocks[blocks.length - 1];
      if (last?.type === "numbered") last.items.push(numbered[1]);
      else blocks.push({ type: "numbered", items: [numbered[1]] });
      continue;
    }

    if (trimmed.startsWith("|")) {
      flushParagraph();
      const cells = trimmed
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((c) => c.trim());
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue; // separator row
      const last = blocks[blocks.length - 1];
      if (last?.type === "table") last.rows.push(cells);
      else blocks.push({ type: "table", rows: [cells] });
      continue;
    }

    paragraph.push(trimmed);
  }
  flushParagraph();
  return blocks;
}

export default function MarkdownLite({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h4
                key={i}
                className={`font-semibold text-text-primary ${
                  block.level <= 3 ? "text-sm mt-4 first:mt-0" : "text-xs uppercase tracking-wider mt-3"
                }`}
              >
                {renderInline(block.text)}
              </h4>
            );
          case "rule":
            return <hr key={i} className="border-glass-border" />;
          case "bullets":
            return (
              <ul key={i} className="space-y-1.5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-accent-cyan/60 shrink-0" />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "numbered":
            return (
              <ol key={i} className="space-y-1.5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="text-accent-cyan/80 font-mono text-xs mt-0.5 shrink-0">
                      {j + 1}.
                    </span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded border border-glass-border">
                <table className="w-full text-xs">
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r} className={r === 0 ? "bg-bg-tertiary/40" : "border-t border-glass-border"}>
                        {row.map((cell, c) => (
                          <td key={c} className={`px-2 py-1.5 ${r === 0 ? "font-semibold text-text-primary" : ""}`}>
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return <p key={i}>{renderInline(block.text)}</p>;
        }
      })}
    </div>
  );
}
