const stats = [
  { value: "$0", label: "Total Value Locked" },
  { value: "0", label: "Token Holders" },
  { value: "0", label: "Proposals Executed" },
  { value: "0%", label: "Management Fees" },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-bg-primary border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-text-primary glow-text">
                {stat.value}
              </p>
              <p className="text-sm text-text-muted mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
