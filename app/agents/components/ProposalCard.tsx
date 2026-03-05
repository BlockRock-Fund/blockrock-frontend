type Proposal = {
  id: number;
  title: string;
  action: string;
  confidence: number;
  reasoning: string;
  position_expression: string | null;
  specialists_consulted: string | null;
  proposal_date: string;
  asset_symbol: string | null;
  status: string;
};

const ACTION_STYLES: Record<string, string> = {
  buy: "bg-green-500/20 text-green-400 border-green-500/30",
  increase: "bg-green-500/20 text-green-400 border-green-500/30",
  sell: "bg-red-500/20 text-red-400 border-red-500/30",
  decrease: "bg-red-500/20 text-red-400 border-red-500/30",
  hold: "bg-text-muted/20 text-text-secondary border-text-muted/30",
};

export default function ProposalCard({ proposal }: { proposal: Proposal }) {
  const actionStyle = ACTION_STYLES[proposal.action] ?? ACTION_STYLES.hold;
  const confidencePct = Math.round(proposal.confidence * 100);

  return (
    <div className="glass rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-text-primary leading-tight">
          {proposal.title}
        </h4>
        <span
          className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded border uppercase ${actionStyle}`}
        >
          {proposal.action}
        </span>
      </div>

      {proposal.asset_symbol && (
        <span className="inline-block text-xs font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded">
          {proposal.asset_symbol}
        </span>
      )}

      <p className="text-sm text-text-secondary leading-relaxed">
        {proposal.reasoning}
      </p>

      {proposal.position_expression && (
        <div className="rounded border border-accent-cyan/20 bg-accent-cyan/5 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
            Suggested Position
          </p>
          <p className="text-xs font-mono text-accent-cyan leading-relaxed">
            {proposal.position_expression}
          </p>
        </div>
      )}

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Confidence</span>
          <span>{confidencePct}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-bg-primary/60">
          <div
            className="h-full rounded-full bg-accent-cyan/70 transition-all"
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      {proposal.specialists_consulted && (
        <p className="text-xs text-text-muted">
          Consulted: {proposal.specialists_consulted}
        </p>
      )}
    </div>
  );
}
