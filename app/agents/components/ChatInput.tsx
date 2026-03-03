"use client";

import { useState, useRef, useCallback } from "react";
import { Send } from "lucide-react";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled: boolean;
};

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  };

  return (
    <div className="border-t border-glass-border bg-bg-secondary/50 px-4 py-3">
      <div className="flex items-end gap-2 max-w-2xl mx-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          placeholder="How can we help?"
          rows={1}
          className="flex-1 resize-none bg-bg-primary border border-text-secondary rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-cyan/50 transition-colors disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="shrink-0 w-10 h-10 rounded-lg bg-accent-cyan text-bg-primary flex items-center justify-center hover:bg-yellow-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
