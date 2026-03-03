import Image from "next/image";

const AGENT_BORDER_COLORS: Record<string, string> = {
  LF: "border-accent-cyan",
  SD: "border-accent-cyan",
  HM: "border-accent-cyan",
  KG: "border-accent-cyan",
  BS: "border-accent-cyan",
  VK: "border-accent-cyan",
  MM: "border-accent-cyan",
};

const AGENT_FALLBACK_COLORS: Record<string, string> = {
  LF: "bg-accent-cyan/20 text-accent-cyan",
  SD: "bg-blue-500/20 text-blue-400",
  HM: "bg-red-500/20 text-red-400",
  KG: "bg-green-500/20 text-green-400",
  BS: "bg-purple-500/20 text-purple-400",
  VK: "bg-orange-500/20 text-orange-400",
  MM: "bg-teal-500/20 text-teal-400",
};

const sizes = {
  md: { container: "w-40 h-40", text: "text-4xl", px: 160 },
  lg: { container: "w-48 h-48", text: "text-5xl", px: 192 },
} as const;

export default function AgentHeadshot({
  initials,
  image,
  size = "md",
}: {
  initials: string;
  image?: string;
  size?: "md" | "lg";
}) {
  const borderColor = AGENT_BORDER_COLORS[initials] ?? AGENT_BORDER_COLORS.LF;
  const fallbackColor =
    AGENT_FALLBACK_COLORS[initials] ?? AGENT_FALLBACK_COLORS.LF;
  const s = sizes[size];

  return (
    <div
      className={`agent-headshot ${s.container} rounded-full border-2 ${borderColor} overflow-hidden shrink-0 flex items-center justify-center ${!image ? fallbackColor : ""}`}
    >
      {image ? (
        <Image
          src={image}
          alt={initials}
          width={s.px}
          height={s.px}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className={`${s.text} font-bold`}>{initials}</span>
      )}
    </div>
  );
}
