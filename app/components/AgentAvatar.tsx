import Image from "next/image";

const AGENT_COLORS: Record<string, string> = {
  LF: "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30",
  SD: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  HM: "bg-red-500/20 text-red-400 border-red-500/30",
  KG: "bg-green-500/20 text-green-400 border-green-500/30",
  BS: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  VK: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MM: "bg-teal-500/20 text-teal-400 border-teal-500/30",
};

export default function AgentAvatar({
  initials = "LF",
  image,
}: {
  initials?: string;
  image?: string;
}) {
  const colorClass = AGENT_COLORS[initials] ?? AGENT_COLORS.LF;

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 overflow-hidden ${colorClass}`}
    >
      {image ? (
        <Image
          src={image}
          alt={initials}
          width={32}
          height={32}
          className="object-cover w-full h-full"
        />
      ) : (
        initials
      )}
    </div>
  );
}
