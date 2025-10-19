# GDCK Quiz

Crveni kriz quiz application built with the Next.js App Router for GDCK Buje and partner associations. The frontend consumes an existing public quiz API, provides a polished ShadCN/Tailwind UI, and supports multi-city branding and configuration out of the box.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment & Configuration](#environment--configuration)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Quality & Testing](#quality--testing)
- [Build & Deployment](#build--deployment)
- [API Integration](#api-integration)
- [Release Automation](#release-automation)
- [Contributing](#contributing)
- [License](#license)

## Overview

The app guides players through four stages:
1. **Theme selection** (`app/(routes)/page.tsx` & `views/ThemeView/ThemeView.tsx`) - choose between quiz themes such as Red Cross history or first aid.
2. **Category selection** (`app/category/[theme]/page.tsx`) - fetches themed categories via `QuizCategoryRepository`.
3. **Quiz run** (`app/quiz/page.tsx`) - presents a mix of single-choice, multiple-choice, free-text, and match-the-term questions, validating input client-side.
4. **Result review** (`app/result/page.tsx`) - displays the take summary retrieved from the public API.

City specific copy, colouring, and metadata are resolved at runtime via cookies (`app/layout.tsx`, `middleware.ts`) and configuration files in `config/cityAssociations`.

## Features

- Multi-tenancy: load per-city titles, hero content, and association IDs with `ConfigProvider` (`components/providers/ConfigProvider.tsx`).
- Dynamic routing with Suspense boundaries for each quiz stage and a dedicated error/not-found experience.
- Four quiz question types (`types/quiz.ts`) with reusable UI components under `components/TakeQuiz`.
- Result dashboard that reconstructs the submitted attempt, including correctness indicators per sub-question.
- Tailwind CSS v4 + ShadCN component primitives + Lucide icons with first-class light/dark theme switching (`components/providers/ThemeRegistry/ThemeRegistry.tsx`).
- API abstraction layer (`services/HttpService.ts`) with repository mappers keeping the UI decoupled from backend DTOs.
- Automated release flow (GitHub Actions) that bumps versions, updates CHANGELOG entries, tags releases, and syncs `main` -> `stage`.

## Tech Stack

- [Next.js 15 App Router](https://nextjs.org/) with React 19 (`app/` directory).
- TypeScript with path aliases (`tsconfig.json`).
- Tailwind CSS 4 + `tailwindcss-animate` + ShadCN UI kit (`styles/global.css`, `components/ui/*`).
- Axios for HTTP (`services/HttpService.ts`) and pnpm for package management.
- Node.js 22.x runtime (see `.github/workflows/build.yml` and `release.yml`).
- GitHub Actions for CI/CD and Enterwell's Changelog Manager for versioning.

## Project Structure

```
├─ app/                       # Next.js routes (themes, categories, quiz, results)
├─ components/
│  ├─ TakeQuiz/               # Question renderers & user info capture
│  ├─ TakeAnswer/             # Result-view components
│  ├─ providers/              # Theme + city configuration providers
│  └─ ui/                     # ShadCN UI primitives
├─ config/                    # API constants & per-city JSON configuration
├─ lib/                       # Helpers (e.g. cityConfig loader)
├─ mappers/                   # DTO -> domain converters
├─ repositories/              # API accessors wrapping HttpService
├─ scripts/                   # Release automation helpers
├─ styles/                    # Global Tailwind definitions
├─ tests/                     # Node test runner setup & type stubs
└─ types/                     # Shared domain contracts
```

## Environment & Configuration

Create a `.env.local` from the template and set the backend endpoint:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_API_URL=https://your-api.example.com/api/
```

`API_ENDPOINT` falls back to `https://localhost:5011/api/` for local development (`config/constants.ts`).  

City level branding lives in `config/cityAssociations/*.json`. Add or adjust fields (`name`, `title`, `heroSection` copy, `cityAssociationId`) and map the host -> city in `middleware.ts` (`HOST_TO_CITY`). `loadCityConfig` (`lib/cityConfig.ts`) loads the JSON based on the `city` cookie or `?city=` override.

## Getting Started

Prerequisites:
- Node.js 22.20.0 (match the CI runner)  
- pnpm >= 10.18.1 (`npm install -g pnpm`)

Install dependencies:

```bash
pnpm install
```

Launch the development server (http://localhost:3000):

```bash
pnpm dev
```

Useful variants:

- `pnpm dev-open` - open the browser and start the dev server.
- `pnpm dev:https` - run local HTTPS for testing secure-only APIs.

## Development Workflow

- Respect the path aliases (`@/*`) defined in `tsconfig.json`.
- Tailwind utilities and colour tokens are centralised in `styles/global.css` and `tailwind.config.ts`.
- The codebase is predominantly Croatian-facing copy; keep translations consistent when changing UI text.
- Use the `components/ui` collection for UI primitives to stay consistent with the theme.

## Quality & Testing

- `pnpm lint` - Next.js ESLint rules with custom relaxations (`eslint.config.mjs`).
- `pnpm test` - TypeScript compile via `tsconfig.test.json`, then Node's built-in test runner (`repositories/__tests__/QuizRepository.test.ts`).

Tests rely on the module path registration in `tests/register-paths.cjs` and the custom Node type declarations under `tests/types`.

## Build & Deployment

- `pnpm build` - production build (used in CI).  
- `pnpm start` - run the compiled app locally.  
- `pnpm export` - generate a static export (`out/`).  
- `pnpm build-analyze` - build with `ANALYZE=true` to inspect bundle size via `@next/bundle-analyzer`.

Artifacts produced during CI are uploaded from the `.next/` directory (`.github/workflows/release.yml`).

## API Integration

All HTTP traffic flows through `services/HttpService.ts`, which prefixes requests with `NEXT_PUBLIC_API_URL`. Repositories (e.g. `repositories/QuizRepository.ts`, `repositories/QuizCategoryRepository.ts`) map backend DTOs into UI-friendly types (`types/quiz.ts`), keeping components agnostic of transport concerns.

Quiz submission (`submitQuizTake`) builds a payload of per-question answers, handles nested “match term” questions, and posts to `quizzes/PublicQuizTake`. Result views subsequently call `quizzes/PublicQuizTake/Get/{takeId}` to render the review screen.

## Release Automation

- **Build workflow** (`.github/workflows/build.yml`): runs on pull requests, installs dependencies, and validates the production build with Node 22 + pnpm 10.
- **Release workflow** (`.github/workflows/release.yml`): triggered on `main` pushes. It builds the app, bumps the version via Enterwell’s `ChangelogManager`, updates tags, publishes a GitHub release, and opens/merges a sync PR from `main` to `stage`.
- Release notes are sourced from the `changes/` folder; keep entries up to date so automation can generate meaningful changelog content.

`scripts/release/update-package-version.mjs` provides a local helper for version alignment if you need to reproduce the automation manually.

## Contributing

1. Fork or branch from `main`.
2. Add a changelog entry under `changes/` matching the naming convention.
3. Run `pnpm lint` and `pnpm test` before opening a pull request.
4. Submit a PR targeting `main`; CI will validate the build.

## License

This project inherits the MIT License from the Enterwell starter template. See `LICENSE` for details.
