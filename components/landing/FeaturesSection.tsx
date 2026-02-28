const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8" />
        <path d="M12 6v2m0 8v2" />
      </svg>
    ),
    title: "Aligned Incentives",
    description:
      "Governance token holders earn protocol revenue proportional to their stake. No middlemen, no management fees — ownership is the incentive.",
    accent: "from-accent-cyan to-accent-blue",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan">
        <path d="M12 3v18" />
        <rect x="4" y="8" width="4" height="7" rx="1" />
        <rect x="10" y="5" width="4" height="10" rx="1" />
        <rect x="16" y="10" width="4" height="5" rx="1" />
      </svg>
    ),
    title: "Futarchy Governance",
    description:
      "Decisions are made through prediction markets. Proposals that the market believes will increase fund value are automatically executed.",
    accent: "from-accent-purple to-accent-blue",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4V11h2a4 4 0 0 1 4 4v1" />
        <path d="M6 22v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" />
        <circle cx="12" cy="6" r="2.5" />
        <path d="M4 15v-1a4 4 0 0 1 4-4" />
        <circle cx="6" cy="6" r="2" />
      </svg>
    ),
    title: "AI Operations",
    description:
      "Autonomous AI agents handle rebalancing, yield optimization, and execution. Humans set strategy; agents execute 24/7.",
    accent: "from-accent-green to-accent-cyan",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            <span className="text-accent-cyan">Internet Capital Management</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            BlockRock replaces traditional asset management with transparent,
            autonomous, and community-driven infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="gradient-border rounded-2xl p-6 sm:p-8 hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
