# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 App Router frontend. Route entry points live in `app/`, with each route owning its page-level components and data helpers where practical, such as `app/strategy/components/` and `app/portfolio-builder/`. Shared application components live in `app/components/`; broader reusable UI and layout primitives live in `components/ui/`, `components/layout/`, and `components/landing/`. Static assets are in `public/`, including agent headshots under `public/agents/`. Global styles and Tailwind CSS v4 theme variables are in `app/globals.css`.

## Build, Test, and Development Commands

- `bun install`: install dependencies from `bun.lock`.
- `bun dev`: start the local Next development server, typically at `http://localhost:3000`.
- `bun run build`: create a production build and catch TypeScript/Next compilation issues.
- `bun run start`: serve the production build after `bun run build`.
- `bun run lint`: run ESLint with Next core-web-vitals and TypeScript rules.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Keep route-specific code close to its route, and promote components to shared folders only when reused. Use PascalCase for React components (`ProposalCard.tsx`), camelCase for functions and variables, and descriptive route folder names in kebab case. Follow the existing 2-space indentation, double quotes, and semicolon style. Prefer Tailwind utility classes and existing CSS custom properties over ad hoc inline styles. Use `lucide-react` icons when an icon already exists.

## Testing Guidelines

No dedicated test framework is configured yet. Before submitting changes, run `bun run lint` and `bun run build`. For UI-heavy changes, manually verify the affected route in `bun dev` at desktop and mobile widths. If adding tests later, colocate them near the feature or create a clear `tests/` directory, and use names like `ComponentName.test.tsx`.

## Commit & Pull Request Guidelines

Recent commits use concise, imperative messages, for example `Fix React lint warnings in terminal charts and tooltip` or `Rename EW Benchmark labels to Equal Weight on strategy page`. Keep commits focused on one behavioral or visual change. Pull requests should include a short summary, affected routes, validation steps (`bun run lint`, `bun run build`), linked issues when applicable, and screenshots for visible UI changes.

## Security & Configuration Tips

Public runtime configuration belongs in `NEXT_PUBLIC_*` variables. `NEXT_PUBLIC_API_URL` defaults to the production backend; override it locally when testing against another API. Do not commit secrets, local `.env*` files, build output, or generated cache artifacts.
