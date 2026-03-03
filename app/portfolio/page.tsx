export default function PortfolioPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center relative">
      <div className="absolute inset-0 spotlight opacity-30" />
      <div className="relative text-center max-w-lg px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan text-sm font-medium mb-6">
          Coming Soon
        </div>
        <p className="text-lg text-text-primary mb-6">
          Launching soon on MetaDAO.
        </p>
        <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent" />
      </div>
    </div>
  );
}
