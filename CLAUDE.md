# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install (uses bun)
bun install

# Dev server (port 3000)
bun dev

# Build
bun run build

# Lint
bun run lint
```

## Architecture

Next.js 16 App Router with TypeScript, Tailwind CSS v4, and React 19. Dark theme with gold accent.

### Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`).

### Pages (App Router)

- `/` — Landing page (HeroSection, FeaturesSection, StatsSection, CTASection)
- `/charter`, `/charter/slides` — Charter/pitch deck content
- `/research` — Research hub with sub-pages:
  - `/research/valuations` — AG Grid table fetching `/main-table` endpoint
  - `/research/signals` — Market signals fetching `/allocation/signals` endpoint
  - `/research/portfolio-builder` — Portfolio construction tool
  - `/research/ai-markets` — AI markets analysis
- `/agents` — AI agent system with sub-pages: `/agents/chat`, `/agents/team`, `/agents/proposals`
- `/portfolio`, `/markets`, `/treasury`, `/governance`, `/ecosystem` — Additional pages
- `/terms` — Terms page

### Component Organization

- `components/landing/` — Landing page sections (HeroSection, FeaturesSection, StatsSection, CTASection)
- `components/layout/` — MainNav, Footer, TopBar
- `components/ui/` — Reusable primitives (GlowButton, GridBackground, Logo, NavLink, InfoTooltip)
- `app/agents/components/` — Agent-specific components (ChatContainer, ChatMessage, ProposalsPanel, etc.)
- Research sub-pages co-locate their chart/data modules (e.g., `app/research/signals/charts.tsx`, `data.ts`)

### Backend API Connection

Pages fetch from the backend using a consistent pattern:

```typescript
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://blockrock-backend-production.up.railway.app";
```

Key endpoints consumed: `/main-table`, `/allocation/signals`, `/agents/proposals`, `/agents/chat`.

All data-fetching pages are `"use client"` components using `useEffect` + `useState`.

### Design System

Defined in `app/globals.css` with CSS custom properties mapped to Tailwind via `@theme inline`:

- **Colors**: `bg-primary` (#050C22), `bg-secondary`, `bg-tertiary`, `accent-cyan` (#DDB110 — gold, despite the name), `text-primary`, `text-secondary`, `text-muted`
- **Fonts**: Rubik (sans, `--font-rubik`) + Geist Mono (`--font-geist-mono`)
- **Utility classes**: `.glass`, `.glass-strong` (glassmorphism), `.gradient-border`, `.glow-cyan`, `.glow-text`, `.spotlight`, `.grid-pattern`
- **Animations**: `.animate-fade-in-up`, `.animate-pulse-glow`

### Key Dependencies

- **ag-grid-react** — Data tables (used in valuations page with custom headers/tooltips)
- **recharts** — Charts (used in signals, portfolio-builder)
- **lucide-react** — Icons
