import GlowButton from "../ui/GlowButton";

export default function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-bg-secondary relative overflow-hidden">
      {/* Subtle gradient backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(221,177,16,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
          Ready to{" "}
          <span className="text-accent-cyan">
            Own Your Fund
          </span>
          ?
        </h2>
        <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10">
          Join a decentralized fund where every token holder is an owner.
          No gatekeepers. No fees. Just transparent, AI-powered asset management.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <GlowButton href="#" variant="secondary" size="lg">
            Join Community
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
