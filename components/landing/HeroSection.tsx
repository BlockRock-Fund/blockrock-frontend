import Image from "next/image";
import GridBackground from "../ui/GridBackground";
import GlowButton from "../ui/GlowButton";

export default function HeroSection() {
  return (
    <GridBackground>
      <section className="relative min-h-[90vh] flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: copy */}
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 mb-6 animate-fade-in-up">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse-glow" />
                <span className="font-normal text-accent-cyan tracking-wide">
                  Black<span className="font-extrabold">Rock</span> on the <span className="font-extrabold">Block</span>chain
                </span>
              </div>

              {/* Headline */}
              <h1
                className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-5 animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                Onchain Asset Management
              </h1>

              {/* Sub-headline */}
              <p
                className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-8 max-w-lg animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                Fundamental analysis, AI-driven allocation, and governance — all onchain.
              </p>

              {/* CTAs */}
              <div
                className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                <GlowButton href="#research" size="lg">
                  Research ↓
                </GlowButton>
              </div>
            </div>

            {/* Right: Larry Funk */}
            <div className="hidden lg:flex justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
              <div className="relative">
                {/* Outer glow halo */}
                <div className="absolute inset-0 rounded-2xl bg-accent-cyan/10 blur-2xl scale-110 pointer-events-none" />
                {/* Gradient border wrapper */}
                <div className="gradient-border rounded-2xl p-[3px] rotate-1 relative">
                  <Image
                    src="/larry_funk_cover.png"
                    alt="Larry Funk, CIO — BlockRock"
                    width={520}
                    height={420}
                    className="rounded-xl object-cover block"
                    priority
                  />
                </div>
                {/* Caption badge */}
                <div className="absolute -bottom-4 -right-4 glass rounded-xl px-4 py-2 text-sm font-medium text-text-primary border border-accent-cyan/20">
                  <span className="text-accent-cyan font-semibold">Larry Funk</span>
                  <span className="text-text-muted ml-1.5">— CIO, BlockRock</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </GridBackground>
  );
}
