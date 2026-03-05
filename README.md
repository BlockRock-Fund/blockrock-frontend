# BlockRock Frontend

Web application for BlockRock — an ownership fund platform powered by treasury-backed tokens, futarchy governance, and AI alpha. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Getting Started

```bash
# Install dependencies
bun install

# Run dev server (port 3000)
bun dev

# Production build
bun run build

# Lint
bun run lint
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://blockrock-backend-production.up.railway.app` |

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/charter` | Charter document |
| `/charter/slides` | Charter slides |
| `/research` | Research hub |
| `/research/valuations` | Asset valuations table (AG Grid) |
| `/research/portfolio-builder` | Portfolio construction tool |
| `/research/ai-markets` | AI markets analysis |
| `/agents` | AI agent system overview |
| `/agents/chat` | Agent chat interface |
| `/agents/team` | Agent team profiles |
| `/agents/proposals` | Agent proposals feed |
| `/portfolio` | Portfolio dashboard |
| `/markets` | Markets overview |
| `/treasury` | Treasury overview |
| `/governance` | Governance overview |
| `/terms` | Terms of use |

## Tech Stack

- **Next.js 16** — App Router, React 19
- **Tailwind CSS v4** — `@theme inline` with CSS custom properties
- **AG Grid** — Data tables (valuations page)
- **Recharts** — Charts (signals, portfolio builder)
- **Lucide React** — Icons
- **Bun** — Package manager and runtime
