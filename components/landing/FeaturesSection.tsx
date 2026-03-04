import { ShieldCheck, TrendingUp, Bot } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={28} strokeWidth={1.5} className="text-accent-cyan" />,
    title: "Ownership",
    description:
      "Ironclad investor protections",
    accent: "from-accent-cyan to-accent-blue",
  },
  {
    icon: <TrendingUp size={28} strokeWidth={1.5} className="text-accent-cyan" />,
    title: "Futarchy",
    description:
      "Performance-optimized decisions",
    accent: "from-accent-purple to-accent-blue",
  },
  {
    icon: <Bot size={28} strokeWidth={1.5} className="text-accent-cyan" />,
    title: "AI",
    description:
      "Agentic alpha generation",
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
          {/* <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            BlockRock outperforms traditional asset management with aligned incentives
          </p> */}
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
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
