import AgentHeadshot from "../components/AgentHeadshot";

const agents = [
  {
    initials: "LF",
    name: "Larry Funk",
    title: "Chief Executive Officer",
    image: "/agents/larryfunk.jpg",
    color: "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30",
    description:
      "Client-facing orchestrator.",
    capabilities: [
      "Birds-eye view",
      "Consults specialist agents",
      "Impeccable delivery",
    ],
  },
  {
    initials: "KG",
    name: "Kenny G",
    title: "Chief Operating Officer",
    image: "/agents/kennyg1.jpg",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    description:
      "Master optimizer.",
    capabilities: [
      "Portfolio construction",
      "Execution strategy",
      "Liquidity management"
    ],
  },
  {
    initials: "SD",
    name: "Truckenmiller",
    title: "Chief Investment Officer",
    image: "/agents/truckenmiller1.png",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    description:
      "Head of alpha.",
    capabilities: [
      "Macro analysis",
      "Asset valuation",
      "Position sizing",
    ],
  },
  {
    initials: "HM",
    name: "Howie Darks",
    title: "Chief Risk Officer",
    image: "/agents/howiedarks.png",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    description:
      "Asks the hard questions.",
    capabilities: [
      "Risk analysis",
      "Downside scenario modeling",
      "Market cycle timing"
    ],
  },
  {
    initials: "BS",
    name: "Balla G",
    title: "Crypto Analyst",
    image: "/agents/ballag.png",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    description:
      "Crypto expert.",
    capabilities: [
      "Crypto use cases",
      "Crypto value accrual",
      "Crypto moat analysis"
    ],
  },
  {
    initials: "VK",
    name: "Cat Would",
    title: "AI Analyst",
    image: "/agents/catwould.png",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    description:
      "AI expert.",
    capabilities: [
      "AI use cases",
      "AI value accrual",
      "AI moat analysis"
    ],
  },
  {
    initials: "MM",
    name: "Morty",
    title: "Solana Analyst",
    image: "/agents/morty.png",
    color: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    description:
      "Solana expert.",
    capabilities: [
      "Position expression",
      "Ecosystem analysis",
      "Onchain data",
    ],
  },
];

export default function TeamPage() {
  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Meet the Team
          </h1>
        </div>

        {/* CEO card - full width */}
        <div className="mb-6">
          <AgentCard agent={agents[0]} featured />
        </div>

        {/* Specialist grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.slice(1).map((agent) => (
            <AgentCard key={agent.initials} agent={agent} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentCard({
  agent,
  featured = false,
}: {
  agent: (typeof agents)[number];
  featured?: boolean;
}) {
  return (
    <div className="gradient-border rounded-2xl p-6 flex flex-col items-center">
      <div className={`flex flex-col items-center w-full ${featured ? "max-w-lg mx-auto" : ""}`}>
        <AgentHeadshot
          initials={agent.initials}
          image={agent.image}
          size={featured ? "lg" : "md"}
        />

        <h3 className="mt-4 text-2xl font-semibold text-text-primary text-center">
          {agent.name}
        </h3>
        <p className="text-lg text-accent-cyan text-center">{agent.title}</p>

        {/* <p className="mt-4 text-lg text-text-primary leading-relaxed text-center">
          {agent.description}
        </p> */}

        <ul className="mt-4 space-y-1.5">
          {agent.capabilities.map((cap) => (
            <li
              key={cap}
              className="text-text-secondary flex items-center justify-center gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-accent-cyan/60 shrink-0" />
              {cap}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
