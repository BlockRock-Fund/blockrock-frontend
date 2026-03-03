"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  content: string;
  width?: number;
}

export function InfoTooltip({ content, width = 256 }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const padding = 8;
    const estimatedHeight = 100;

    let top = rect.bottom + padding;
    let left = rect.left + rect.width / 2;

    if (top + estimatedHeight > window.innerHeight) {
      top = rect.top - estimatedHeight - padding;
    }
    if (left - width / 2 < padding) {
      left = width / 2 + padding;
    }
    if (left + width / 2 > window.innerWidth - padding) {
      left = window.innerWidth - width / 2 - padding;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    calculatePosition();
    const update = () => calculatePosition();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!open) calculatePosition();
    setOpen((v) => !v);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggle}
        className="inline-flex items-center justify-center w-4 h-4 text-text-secondary hover:text-text-primary transition-colors flex-shrink-0"
        aria-label="Show info"
        type="button"
      >
        <Info className="w-3.5 h-3.5 pointer-events-none" />
      </button>
      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-[9999] px-3 py-2 text-xs text-text-primary border rounded-md shadow-lg whitespace-pre-line text-left"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: "translateX(-50%)",
              width: `${width}px`,
              maxHeight: 220,
              overflowY: "auto",
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--accent-blue)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrow */}
            <div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-l border-t"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--accent-blue)",
              }}
            />
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
