"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertTriangle, ChevronDown, Clock } from "lucide-react";
import type { AgentReport } from "../types";
import MarkdownLite from "./MarkdownLite";

export type Analyst = {
  name: string;
  role: string;
  image: string;
  accentText: string;
  accentBorder: string;
  accentBg: string;
};

export const ANALYSTS: Record<string, Analyst> = {
  crypto: {
    name: "Balla G",
    role: "Chief Crypto Officer",
    image: "/agents/ballag.png",
    accentText: "text-purple-400",
    accentBorder: "border-purple-500/30",
    accentBg: "bg-purple-500/10",
  },
  ai: {
    name: "Cat Would",
    role: "Chief AI Officer",
    image: "/agents/catwould.png",
    accentText: "text-orange-400",
    accentBorder: "border-orange-500/30",
    accentBg: "bg-orange-500/10",
  },
  theses: {
    name: "Truckenmiller",
    role: "Chief Investment Officer",
    image: "/agents/truckenmiller1.png",
    accentText: "text-blue-400",
    accentBorder: "border-blue-500/30",
    accentBg: "bg-blue-500/10",
  },
  risk: {
    name: "Howie Darks",
    role: "Chief Risk Officer",
    image: "/agents/howiedarks.png",
    accentText: "text-red-400",
    accentBorder: "border-red-500/30",
    accentBg: "bg-red-500/10",
  },
  solana: {
    name: "Morty",
    role: "Solana Analyst",
    image: "/agents/morty.png",
    accentText: "text-teal-400",
    accentBorder: "border-teal-500/30",
    accentBg: "bg-teal-500/10",
  },
  converge: {
    name: "Larry Funk",
    role: "Chief Executive Officer",
    image: "/agents/larryfunk.jpg",
    accentText: "text-accent-cyan",
    accentBorder: "border-accent-cyan/30",
    accentBg: "bg-accent-cyan/10",
  },
};

const FALLBACK_ANALYST: Analyst = {
  name: "Analyst",
  role: "Specialist",
  image: "",
  accentText: "text-accent-cyan",
  accentBorder: "border-accent-cyan/30",
  accentBg: "bg-accent-cyan/10",
};

export function AnalystBadge({
  agentKey,
  subtitle,
}: {
  agentKey: string;
  subtitle?: string;
}) {
  const analyst = ANALYSTS[agentKey] ?? FALLBACK_ANALYST;
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full border ${analyst.accentBorder} overflow-hidden shrink-0 ${analyst.accentBg} flex items-center justify-center`}
      >
        {analyst.image ? (
          <Image
            src={analyst.image}
            alt={analyst.name}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className={`text-sm font-bold ${analyst.accentText}`}>
            {analyst.name[0]}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-primary leading-tight">
          {analyst.name}
        </p>
        <p className={`text-xs ${analyst.accentText}`}>
          {subtitle ?? analyst.role}
        </p>
      </div>
    </div>
  );
}

export default function AnalystReportCard({ report }: { report: AgentReport }) {
  const [expanded, setExpanded] = useState(false);
  const analyst = ANALYSTS[report.agent_key] ?? FALLBACK_ANALYST;
  const long = report.content.length > 700;

  if (!report.success) {
    return (
      <div className="glass rounded-xl p-4 border border-red-500/30">
        <div className="flex items-center justify-between gap-2">
          <AnalystBadge agentKey={report.agent_key} />
          <span className="flex items-center gap-1.5 text-xs text-red-400 shrink-0">
            <AlertTriangle size={13} />
            failed
          </span>
        </div>
        {report.error && (
          <p className="mt-3 text-xs text-text-muted font-mono">{report.error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-1">
        <AnalystBadge agentKey={report.agent_key} />
        <span className="flex items-center gap-1.5 text-xs text-text-muted shrink-0">
          <Clock size={12} />
          {report.elapsed_s.toFixed(1)}s
        </span>
      </div>

      <p className={`mt-2 mb-3 text-xs uppercase tracking-wider ${analyst.accentText} opacity-80`}>
        {report.agent_name}
      </p>

      <div className="relative">
        <div className={expanded || !long ? "" : "max-h-56 overflow-hidden"}>
          <MarkdownLite content={report.content} />
        </div>
        {long && !expanded && (
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a1740] to-transparent pointer-events-none rounded-b-xl" />
        )}
      </div>

      {long && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 self-start flex items-center gap-1.5 text-xs font-medium text-accent-cyan hover:text-text-primary transition-colors cursor-pointer"
        >
          <ChevronDown
            size={14}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
          {expanded ? "Collapse report" : "Read full report"}
        </button>
      )}
    </div>
  );
}
