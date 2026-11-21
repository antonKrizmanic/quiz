<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Quiz app guidance

- Work in the current checkout and branch. Leave changes uncommitted unless the maintainer asks for a commit.
- This project is the public quiz solving app. Use only the backend endpoints under `/api/Quiz/Public`; authoring, category management, and admin APIs belong in the RedCross management app.
- The home page lists active categories and published quizzes from the public API. A participant can open a prepared quiz at `/quiz/take/{instanceId}/{publicCode}` or create a personal quiz from a category and continue at `/quiz/attempt/{attemptId}`.
- `proxy.ts` maps the request host to a city in `config/cityAssociations/*.json`. The root layout passes the selected config through `ConfigProvider`. Browser API calls use its `cityAssociationId` for category, catalog, and personal quiz requests and call the backend public API directly. Do not add a Next.js API proxy for these public requests.
- Start an attempt with `PersonName`. Send `X-Quiz-Attempt-Token` for every attempt read, answer save, and completion request. Keep the token out of URLs, logs, and analytics. Store it only for local resume and clear it when starting a new attempt.
- In-progress DTOs contain no answer key. Show correctness, accepted answers, and explanations only after the completion endpoint returns a result.
- Keep the four question types aligned with the backend DTOs: single choice, multiple choice, text answer, and matching. Save an answer before moving between questions or completing.
- Read the relevant local Next.js 16 guide in `node_modules/next/dist/docs/` before changing routing, data fetching, or server/client boundaries.
- Use Croatian text, accessible labels and controls, and layouts that work on narrow screens.
- UI is built on headless `@ui-sdk/react` components styled with Tailwind. Before using ui-sdk, read `node_modules/@ui-sdk/react/docs/llms.txt` and the pages of the components you use. Shared styled wrappers live in `components/ui/` and design tokens in `styles/global.css`. The app has one light look: white cards on the brand-red canvas, and quiz screens use the full-screen story shell in `components/quiz/story-shell.tsx` with per-question-type colours from `lib/story.ts`. Design for phones first: 44px touch targets, 16px form text, and safe-area insets.
- Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` for a complete app change.
