# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install          # Install dependencies
bun dev              # Dev server on port 3000
bun run build        # Production build
bun run lint         # ESLint
```

## Tech Stack

Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Bun.

## Architecture

### Backend API Integration

The frontend fetches live data from a FastAPI backend. The base URL comes from `NEXT_PUBLIC_API_URL` env var, falling back to the production Railway deployment.

Two endpoints are consumed:
- `GET /main-table` — All assets with snapshots and valuations (used in valuations page)
- `GET /allocation/signals` — CAPE ratio, yield curve, HY spread with interpreted levels (used in portfolio page)

Data fetching uses `useEffect` + `fetch` in client components. There are no API route handlers (`app/api/` does not exist) and no server-side data fetching.

### Page Structure

Live pages with backend data: `/research/valuations` (AG-Grid table), `/research/portfolio-builder` (Recharts visualizations), `/research/ai-markets` (long-form analysis with TOC).

Long-form content pages: `/charter` (with sidebar TOC).

Placeholder pages (center text only): `/markets`, `/treasury`, `/governance`, `/ecosystem`, `/agents`.

Research subpages co-locate their data and components alongside `page.tsx` (e.g., `research/portfolio-builder/data.ts`, `research/portfolio-builder/charts.tsx`).

### Component Organization

- `components/layout/` — MainNav (sticky nav + mobile hamburger), Footer, TopBar
- `components/landing/` — HeroSection, FeaturesSection, CTASection, StatsSection
- `components/ui/` — GlowButton (primary/secondary variants, renders as Link or button), NavLink (active state via `usePathname`), Logo, GridBackground

### Client vs Server Components

Interactive pages (`"use client"`): MainNav, NavLink, portfolio page, valuations page. Static/content-heavy pages are Server Components by default.

## Design System

Defined in `app/globals.css` using CSS custom properties mapped to Tailwind via `@theme inline`.

**Colors**: Dark navy background (`--bg-primary: #050C22`), gold accent (`--accent-cyan: #DDB110` — named "cyan" but visually gold). Glass surfaces use `rgba(9, 22, 62, 0.6)` with gold-tinted borders.

**Custom utility classes** (defined in globals.css, not Tailwind config):
- `.glass` / `.glass-strong` — Glassmorphism with backdrop-blur
- `.gradient-border` — Animated gold-to-blue gradient border using CSS mask
- `.glow-cyan` / `.glow-cyan-hover` — Gold glow box-shadow effects
- `.glow-text` — Text shadow glow
- `.grid-pattern` — Subtle repeating grid background
- `.spotlight` — Radial gradient light effects for page backgrounds

**Typography**: Geist Sans (body) and Geist Mono (code), loaded via `next/font/google` in root layout.

**AG-Grid theming**: Custom dark theme styles for headers, tooltips, and scrollbars are in globals.css under `.ag-theme-alpine` overrides.

## Path Alias

`@/*` maps to the project root (e.g., `import { Logo } from "@/components/ui/Logo"`).
