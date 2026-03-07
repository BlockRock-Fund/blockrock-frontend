import GridBackground from "../ui/GridBackground";
import GlowButton from "../ui/GlowButton";

// const stats = [
//   { label: "Assets Under Management", value: "$0" },
//   { label: "Clients (Holders)", value: "0" },
//   { label: "Proposals Executed", value: "0" },
// ];

export default function HeroSection() {
  return (
    <GridBackground>
      <section className="relative min-h-[85vh] flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full py-20 sm:py-28">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 mb-6 animate-fade-in-up">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse-glow" />
              <span className="font-normal text-accent-cyan tracking-wide">
                Black<span className="font-extrabold">Rock</span> on the <span className="font-extrabold">Block</span>chain
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Ownership Fund
            </h1>

            {/* Description */}
            <p
              className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Asset management powered by treasury-backed tokens, futarchy governance,
              and AI alpha. Grow wealth with confidence.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 mb-14 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              {/* <GlowButton href="https://www.futard.io/launch/J7CmLqfMLVq67swRQa6xCWn7VcyfpyhFSiQdJYNwkP8k" size="lg" target="_blank">
                ICO
              </GlowButton>
              <GlowButton href="/charter" size="lg" variant="secondary">
                Read Charter
              </GlowButton> */}
              <GlowButton href="/charter" size="lg">
                Read Charter
              </GlowButton>
            </div>

            {/* Stats row */}
            {/* <div
              className="grid grid-cols-3 gap-6 sm:gap-10 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-bold text-text-primary glow-text">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-text-secondary mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div> */}
          </div>

          {/* Glassmorphism card (desktop) */}
          <div className="hidden xl:block absolute top-1/2 -translate-y-1/2 right-[10%] w-[340px]">
            <div className="gradient-border rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Portfolio</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan font-medium">
                    Simulation
                  </span>
                </div>
                <div className="h-px bg-white/5" />
                {[
                  { asset: "BTC", alloc: "24%", color: "bg-orange-500" },
                  { asset: "Gold", alloc: "15%", color: "bg-yellow-500" },
                  { asset: "ETH (Short)", alloc: "11%", color: "bg-blue-400" },
                  { asset: "NVDA", alloc: "10%", color: "bg-accent-green" },
                  { asset: "AAPL", alloc: "10%", color: "bg-gray-400" },
                  { asset: "USD Yield", alloc: "9%", color: "bg-emerald-400" },
                  { asset: "SOL", alloc: "8%", color: "bg-accent-purple" },
                  { asset: "GOOG", alloc: "8%", color: "bg-red-500" },
                  { asset: "Silver", alloc: "5%", color: "bg-slate-300" },
                ].map((item) => (
                  <div key={item.asset} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-sm text-text-primary">{item.asset}</span>
                    </div>
                    <span className="text-sm text-text-secondary font-mono">
                      {item.alloc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-text-secondary mt-2 leading-tight text-center">
              Actual portfolio is governed by decision markets to maximize risk-adjusted returns.
            </p>
          </div>
        </div>
      </section>
    </GridBackground>
  );
}
