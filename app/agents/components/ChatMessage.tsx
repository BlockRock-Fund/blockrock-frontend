import AgentAvatar from "./AgentAvatar";

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && <AgentAvatar initials="LF" />}
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-accent-cyan/10 border border-accent-cyan/30 text-text-primary"
            : "glass text-text-primary"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
