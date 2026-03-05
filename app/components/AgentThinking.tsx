const TOOL_LABELS: Record<string, string> = {
  consult_investment_officer: "Consulting Truckenmiller (CIO)...",
  consult_risk_officer: "Consulting Howie Darks (CRO)...",
  consult_operations_officer: "Consulting Kenny G (COO)...",
  consult_crypto_officer: "Consulting Balla G (Crypto)...",
  consult_ai_officer: "Consulting Cat Would (AI)...",
  consult_solana_officer: "Consulting Morty (Solana)...",
  query_asset_summary: "Querying asset data...",
  query_all_assets: "Querying portfolio...",
  query_macro_signals: "Checking macro signals...",
  query_price_history: "Fetching price history...",
};

export default function AgentThinking({ tool }: { tool: string | null }) {
  if (!tool) return null;

  const label = TOOL_LABELS[tool] ?? `Running ${tool}...`;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg glass text-sm text-text-secondary animate-pulse">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-cyan" />
      </div>
      {label}
    </div>
  );
}
