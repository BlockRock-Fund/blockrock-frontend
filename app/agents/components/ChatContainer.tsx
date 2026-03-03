"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import AgentThinking from "./AgentThinking";
import AgentHeadshot from "./AgentHeadshot";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatContainerProps = {
  messages: Message[];
  activeTool: string | null;
  isStreaming: boolean;
  streamingText: string;
};

export default function ChatContainer({
  messages,
  activeTool,
  isStreaming,
  streamingText,
}: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, activeTool]);

  return (
    <div className={`flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-4${messages.length === 0 && !isStreaming ? " flex flex-col items-center justify-center" : ""}`}>
      {messages.length === 0 && !isStreaming && (
        <div className="flex flex-col items-center text-center">
          <AgentHeadshot initials="LF" image="/agents/larryfunk.jpg" size="lg" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Larry Funk, CEO
          </h3>
          <p className="text-sm text-text-secondary max-w-md">
            Ask me about portfolios, market conditions, asset valuations, or
            investment strategy. I&apos;ll consult my team of specialists to give
            you a comprehensive answer.
          </p>
          <span className="mt-4 inline-block px-4 py-1.5 rounded-full border border-accent-cyan/40 bg-bg-secondary/60 text-accent-cyan text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(221,177,16,0.15)]">
            Coming Soon
          </span>
        </div>
      )}

      {messages.map((msg, i) => (
        <ChatMessage key={i} role={msg.role} content={msg.content} />
      ))}

      {isStreaming && streamingText && (
        <ChatMessage role="assistant" content={streamingText} />
      )}

      {isStreaming && activeTool && <AgentThinking tool={activeTool} />}

      <div ref={bottomRef} />
    </div>
  );
}
