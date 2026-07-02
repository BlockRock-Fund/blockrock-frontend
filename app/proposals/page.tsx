"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, CircleDashed, Loader2, XCircle } from "lucide-react";
import ProposalCard from "../components/ProposalCard";
import AnalystReportCard, { AnalystBadge } from "./components/AnalystReportCard";
import type { AgentReport, Proposal, ProposalRun, ProposalRunSummary } from "./types";
import { API_BASE_URL } from "./types";

const PHASES: {
  key: string;
  step: string;
  title: string;
  blurb: string;
  agents: string[];
}[] = [
  {
    key: "SOURCE",
    step: "01",
    title: "Source",
    blurb:
      "Balla G and Cat Would sweep crypto and AI markets in real time for domain intelligence.",
    agents: ["crypto", "ai"],
  },
  {
    key: "SYNTHESIZE",
    step: "02",
    title: "Synthesize",
    blurb:
      "Truckenmiller merges the domain intel with live macro signals and asset valuations into high-conviction theses.",
    agents: ["theses"],
  },
  {
    key: "SHAPE",
    step: "03",
    title: "Shape",
    blurb:
      "Howie Darks stress-tests every thesis while Morty maps each one to a Solana-native position.",
    agents: ["risk", "solana"],
  },
  {
    key: "CONVERGE",
    step: "04",
    title: "Converge",
    blurb:
      "Larry Funk converges the team's analysis into final, actionable investment proposals.",
    agents: ["converge"],
  },
];

function StatusChip({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/30 px-2.5 py-1 rounded-full">
        <CheckCircle2 size={13} /> Completed
      </span>
    );
  }
  if (status === "running") {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30 px-2.5 py-1 rounded-full">
        <Loader2 size={13} className="animate-spin" /> Running
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-full">
      <XCircle size={13} /> Failed
    </span>
  );
}

function formatRunDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function ProposalsPage() {
  const [runs, setRuns] = useState<ProposalRunSummary[]>([]);
  const [run, setRun] = useState<ProposalRun | null>(null);
  const [legacyProposals, setLegacyProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchRun = useCallback(async (runId?: number): Promise<ProposalRun | null> => {
    const url = runId
      ? `${API_BASE_URL}/agents/proposals/runs/${runId}`
      : `${API_BASE_URL}/agents/proposals/runs/latest`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [latest, runsRes] = await Promise.all([
          fetchRun(),
          fetch(`${API_BASE_URL}/agents/proposals/runs?limit=10`),
        ]);
        if (runsRes.ok) setRuns(await runsRes.json());
        if (latest) {
          setRun(latest);
        } else {
          // No pipeline runs recorded yet — fall back to the flat proposals feed
          const res = await fetch(`${API_BASE_URL}/agents/proposals?limit=50`);
          if (res.ok) setLegacyProposals(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch proposals:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchRun]);

  // Live-poll while a run is in progress so the pipeline can be watched.
  useEffect(() => {
    if (run?.status === "running" && !pollRef.current) {
      pollRef.current = setInterval(async () => {
        const updated = await fetchRun(run.id);
        if (updated) setRun(updated);
        if (updated?.status !== "running" && pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
          // Refresh run summaries so the picker reflects the final status
          const res = await fetch(`${API_BASE_URL}/agents/proposals/runs?limit=10`);
          if (res.ok) setRuns(await res.json());
        }
      }, 8000);
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [run?.status, run?.id, fetchRun]);

  const selectRun = async (runId: number) => {
    setLoading(true);
    const selected = await fetchRun(runId);
    if (selected) setRun(selected);
    setLoading(false);
  };

  const reportsByKey = new Map<string, AgentReport>();
  run?.reports.forEach((r) => reportsByKey.set(r.agent_key, r));

  const sortedProposals = run
    ? [...run.proposals].sort((a, b) => b.confidence - a.confidence)
    : [];

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Proposals
          </h1>
          <p className="text-text-secondary text-lg">
            Every day BlockRock&apos;s agent team researches the market, debates
            the risks, and converges on investment proposals. Follow the full
            pipeline below — every analyst&apos;s report is published.
          </p>
        </div>

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-xl h-40 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && !run && legacyProposals.length === 0 && (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-text-secondary">
              No proposals yet. They&apos;re generated daily after the data
              pipeline refreshes.
            </p>
          </div>
        )}

        {/* Legacy fallback: proposals that predate pipeline run tracking */}
        {!loading && !run && legacyProposals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...legacyProposals]
              .sort((a, b) => b.confidence - a.confidence)
              .map((p) => (
                <ProposalCard key={p.id} proposal={p} />
              ))}
          </div>
        )}

        {!loading && run && (
          <>
            {/* Run header */}
            <div className="glass rounded-xl px-4 sm:px-5 py-4 mb-10 flex flex-wrap items-center gap-x-4 gap-y-3">
              <StatusChip status={run.status} />
              <p className="text-sm text-text-secondary">
                {formatRunDate(run.run_date)}
              </p>
              {run.duration_s != null && (
                <p className="text-xs text-text-muted">
                  {Math.round(run.duration_s)}s pipeline
                </p>
              )}
              {run.status === "failed" && run.error && (
                <p className="text-xs text-red-400 font-mono w-full">{run.error}</p>
              )}
              {runs.length > 1 && (
                <select
                  value={run.id}
                  onChange={(e) => selectRun(Number(e.target.value))}
                  className="ml-auto bg-bg-tertiary/60 border border-glass-border rounded-lg px-3 py-1.5 text-xs text-text-secondary cursor-pointer focus:outline-none"
                >
                  {runs.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.run_date} — {r.status}
                      {r.proposal_count ? ` (${r.proposal_count})` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Pipeline timeline */}
            <div className="space-y-0">
              {PHASES.map((phase, idx) => {
                const phaseReports = phase.agents
                  .map((key) => reportsByKey.get(key))
                  .filter((r): r is AgentReport => Boolean(r));
                const pending = phaseReports.length === 0;
                const isConverge = phase.key === "CONVERGE";
                const isLast = idx === PHASES.length - 1;

                return (
                  <div key={phase.key} className="relative flex gap-4 sm:gap-6">
                    {/* Timeline rail */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 shrink-0 rounded-full border flex items-center justify-center text-xs font-mono font-semibold ${
                          pending
                            ? "border-glass-border text-text-muted"
                            : "border-accent-cyan/40 text-accent-cyan bg-accent-cyan/10"
                        }`}
                      >
                        {phase.step}
                      </div>
                      {!isLast && (
                        <div className="w-px flex-1 bg-gradient-to-b from-accent-cyan/30 to-glass-border" />
                      )}
                    </div>

                    {/* Phase content */}
                    <div className={`flex-1 min-w-0 ${isLast ? "" : "pb-10"}`}>
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold text-text-primary">
                          {phase.title}
                        </h2>
                        <p className="text-sm text-text-muted mt-1">{phase.blurb}</p>
                      </div>

                      {pending && (
                        <div className="glass rounded-xl p-5 flex items-center gap-3 text-sm text-text-muted">
                          {run.status === "running" ? (
                            <>
                              <Loader2 size={16} className="animate-spin text-accent-cyan" />
                              Working…
                            </>
                          ) : (
                            <>
                              <CircleDashed size={16} />
                              No report produced.
                            </>
                          )}
                        </div>
                      )}

                      {!pending && !isConverge && (
                        <div
                          className={`grid grid-cols-1 gap-4 ${
                            phaseReports.length > 1 ? "lg:grid-cols-2" : ""
                          }`}
                        >
                          {phaseReports.map((report) => (
                            <AnalystReportCard key={report.id} report={report} />
                          ))}
                        </div>
                      )}

                      {!pending && isConverge && (
                        <div className="gradient-border rounded-2xl p-4 sm:p-6">
                          <div className="flex items-center justify-between gap-2 mb-5">
                            <AnalystBadge agentKey="converge" />
                            {sortedProposals.length > 0 && (
                              <span className="text-xs text-text-muted">
                                {sortedProposals.length} proposal
                                {sortedProposals.length === 1 ? "" : "s"}
                              </span>
                            )}
                          </div>
                          {sortedProposals.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {sortedProposals.map((p) => (
                                <ProposalCard key={p.id} proposal={p} />
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-text-muted">
                              {run.status === "running"
                                ? "Finalizing proposals…"
                                : "No proposals were stored for this run."}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
