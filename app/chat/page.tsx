"use client";

import { useState, useCallback } from "react";
import ChatContainer, { type Message } from "../components/ChatContainer";
import ChatInput from "../components/ChatInput";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://blockrock-backend-production.up.railway.app";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const handleSend = useCallback(
    async (message: string) => {
      const userMsg: Message = { role: "user", content: message };
      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);
      setStreamingText("");
      setActiveTool(null);

      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let fullText = "";

      try {
        const response = await fetch(`${API_BASE_URL}/agents/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, history }),
        });

        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6);
            if (!jsonStr.trim()) continue;

            try {
              const event = JSON.parse(jsonStr);

              if (event.event === "text_delta") {
                fullText += event.data.text;
                setStreamingText(fullText);
                setActiveTool(null);
              } else if (event.event === "tool_call") {
                setActiveTool(event.data.tool);
              } else if (event.event === "tool_result") {
                setActiveTool(null);
              } else if (event.event === "error") {
                fullText += `\n\n[Error: ${event.data.message}]`;
                setStreamingText(fullText);
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      } catch (err) {
        fullText =
          fullText ||
          `Sorry, I encountered an error: ${err instanceof Error ? err.message : "Unknown error"}`;
      }

      if (fullText) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fullText },
        ]);
      }
      setStreamingText("");
      setActiveTool(null);
      setIsStreaming(false);
    },
    [messages],
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 border-b border-glass-border bg-bg-secondary/50 flex items-center justify-center">
        <h1 className="text-lg font-semibold text-text-primary">
          Chat with BlockRock&apos;s agents
        </h1>
      </div>

      {/* Messages */}
      <ChatContainer
        messages={messages}
        activeTool={activeTool}
        isStreaming={isStreaming}
        streamingText={streamingText}
      />

      {/* Input */}
      <ChatInput onSend={handleSend} disabled />
    </div>
  );
}
