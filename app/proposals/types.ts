export type Proposal = {
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

export type AgentReport = {
  id: number;
  phase: string;
  agent_key: string;
  agent_name: string;
  content: string;
  success: boolean;
  error: string | null;
  elapsed_s: number;
  sort_order: number;
  created_at: string;
};

export type ProposalRunSummary = {
  id: number;
  run_date: string;
  status: string;
  error: string | null;
  duration_s: number | null;
  proposal_count: number;
  created_at: string;
};

export type ProposalRun = ProposalRunSummary & {
  reports: AgentReport[];
  proposals: Proposal[];
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://blockrock-backend-production.up.railway.app";
