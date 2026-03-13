"use client";

import { useState } from "react";
import {
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  TargetWeight,
  VaultStatus,
  AllocationRecord,
  pct,
  usd,
  regimeColor,
} from "./types";

interface LiveVaultTabProps {
  status: VaultStatus | null;
  allocations: AllocationRecord[];
  longs: TargetWeight[];
  shorts: TargetWeight[];
  loading: boolean;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="text-text-muted hover:text-text-primary transition-colors p-1"
      title="Copy"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function AllocationCard({ record }: { record: AllocationRecord }) {
  const [expanded, setExpanded] = useState(false);
  const longCount = record.allocations.filter(
    (a) => a.side !== "short"
  ).length;
  const shortCount = record.allocations.filter(
    (a) => a.side === "short"
  ).length;

  return (
    <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium">
              {new Date(record.computed_at).toLocaleString()}
            </p>
            {record.regime_score !== null && (
              <span className="flex items-center gap-1 text-xs">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: regimeColor(
                      parseFloat(record.regime_score)
                    ),
                  }}
                />
                <span className="text-text-muted font-mono">
                  {parseFloat(record.regime_score).toFixed(2)}
                </span>
                {record.short_allocation_pct &&
                  parseFloat(record.short_allocation_pct) > 0 && (
                    <span className="text-red-400 ml-1">
                      {(parseFloat(record.short_allocation_pct) * 100).toFixed(
                        0
                      )}
                      % short
                    </span>
                  )}
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            {shortCount > 0
              ? `${longCount} longs, ${shortCount} shorts`
              : `${record.allocations.length} tokens`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              record.status === "executed"
                ? "bg-green-500/10 text-green-400"
                : record.status === "dry_run"
                ? "bg-blue-500/10 text-blue-400"
                : record.status === "failed"
                ? "bg-red-500/10 text-red-400"
                : "bg-yellow-500/10 text-yellow-400"
            }`}
          >
            {record.status}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-muted" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/5 px-4 py-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-text-muted">
                  <th className="text-left py-1.5 pr-3 font-medium">Symbol</th>
                  <th className="text-center py-1.5 px-3 font-medium">Side</th>
                  <th className="text-right py-1.5 px-3 font-medium">
                    Weight
                  </th>
                  <th className="text-right py-1.5 pl-3 font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {record.allocations.map((a, i) => {
                  const isShort = a.side === "short";
                  return (
                    <tr
                      key={i}
                      className="border-t border-white/5"
                    >
                      <td className="py-1.5 pr-3 font-medium">{a.symbol}</td>
                      <td className="py-1.5 px-3 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                            isShort
                              ? "bg-red-500/10 text-red-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {isShort ? "SHORT" : "LONG"}
                        </span>
                      </td>
                      <td
                        className="py-1.5 px-3 text-right font-mono"
                        style={{ color: isShort ? "#F87171" : "#DDB110" }}
                      >
                        {pct(a.target_weight)}
                      </td>
                      <td className="py-1.5 pl-3 text-right font-mono text-text-muted">
                        {parseFloat(a.composite_score).toFixed(4)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiveVaultTab({
  status,
  allocations,
  longs,
  shorts,
  loading,
}: LiveVaultTabProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass rounded-2xl p-6 h-48 animate-pulse bg-white/[0.02]"
          />
        ))}
      </div>
    );
  }

  const allWeights = [...longs, ...shorts];

  return (
    <div className="space-y-10">
      {/* Vault Identity */}
      {status && (
        <div className="gradient-border rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Vault Identity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
                Vault Address
              </p>
              {status.vault_address ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm truncate max-w-[200px]">
                    {status.vault_address}
                  </span>
                  <CopyButton text={status.vault_address} />
                  <a
                    href={`https://solscan.io/account/${status.vault_address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-accent-cyan transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <span className="text-text-muted text-sm">&mdash;</span>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
                Status
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-sm font-medium">Dry Run</span>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
                Total Value
              </p>
              <span className="text-lg font-bold">
                {usd(status.total_value_usd)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Current Holdings Table */}
      {status && status.holdings.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Current Holdings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-text-secondary">
                  <th className="text-left py-3 px-3 font-medium">Token</th>
                  <th className="text-center py-3 px-3 font-medium">Side</th>
                  <th className="text-right py-3 px-3 font-medium">Balance</th>
                  <th className="text-right py-3 px-3 font-medium">
                    Value USD
                  </th>
                  <th className="text-right py-3 px-3 font-medium">Weight</th>
                  <th className="text-right py-3 px-3 font-medium">Target</th>
                  <th className="text-right py-3 px-3 font-medium">Drift</th>
                </tr>
              </thead>
              <tbody>
                {status.holdings.map((h) => {
                  const tw = allWeights.find(
                    (w) => w.mint_address === h.mint_address
                  );
                  const currentW = h.weight ? parseFloat(h.weight) * 100 : 0;
                  const targetW = tw
                    ? parseFloat(tw.target_weight) * 100
                    : 0;
                  const drift = currentW - targetW;
                  const isShort = tw?.side === "short";

                  return (
                    <tr
                      key={h.mint_address}
                      className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                        isShort ? "bg-red-500/[0.03]" : ""
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {h.symbol || "Unknown"}
                          </span>
                          <a
                            href={`https://solscan.io/token/${h.mint_address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-muted hover:text-accent-cyan transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isShort
                              ? "bg-red-500/10 text-red-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {isShort ? "SHORT" : "LONG"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs">
                        {h.token_balance
                          ? parseFloat(h.token_balance).toLocaleString(
                              undefined,
                              { maximumFractionDigits: 4 }
                            )
                          : "\u2014"}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {usd(h.value_usd)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        {pct(h.weight)}
                      </td>
                      <td
                        className="py-3 px-3 text-right font-mono"
                        style={{ color: isShort ? "#F87171" : "#DDB110" }}
                      >
                        {tw ? pct(tw.target_weight) : "\u2014"}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className="font-mono text-xs"
                          style={{
                            color:
                              Math.abs(drift) < 1
                                ? "var(--text-muted)"
                                : drift > 0
                                ? "#10B981"
                                : "#EF4444",
                          }}
                        >
                          {drift >= 0 ? "+" : ""}
                          {drift.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Allocation History */}
      {allocations.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Allocation History</h3>
          <div className="space-y-3">
            {allocations.map((a) => (
              <AllocationCard key={a.id} record={a} />
            ))}
          </div>
        </div>
      )}

      {/* Rebalance Config */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Rebalance Configuration</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Cadence", value: "24h" },
            { label: "Mode", value: "Dry Run" },
            { label: "Threshold", value: "5%" },
            { label: "Max Longs", value: "10 / 25%" },
            { label: "Max Shorts", value: "5 / 25%" },
            { label: "Max Short Total", value: "50%" },
          ].map((c) => (
            <div
              key={c.label}
              className="bg-white/[0.03] rounded-xl p-3 border border-white/5 text-center"
            >
              <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">
                {c.label}
              </p>
              <p className="text-sm font-bold font-mono">{c.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
