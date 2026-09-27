# Kviz Crvenog križa

Next.js app for browsing categories and taking RedCross quizzes. Quiz authoring and administration live in the RedCross management app.

## Run locally

Use Node.js 24 and pnpm. Start the RedCross API, then:

```bash
pnpm install
cp .env.local.example .env.local
pnpm dev
```

The example points to `https://localhost:5011`. `QUIZ_API_URL` also accepts the full `/api/Quiz/Public` URL; the app adds that path when needed. The root layout passes the URL to browser components, which call the public backend API directly. The default `RC.API` launch profile uses HTTP on port 5010 and HTTPS on port 5011; use the address your backend is actually serving. Your browser must trust its local HTTPS certificate.

Open `http://localhost:3000` to browse categories, choose a prepared quiz, or create a personal quiz from available questions. Published instance links also work directly at `/quiz/take/{instanceId}/{publicCode}`.

The site selects an association from the request hostname in `proxy.ts`, using `config/cityAssociations/buje.json` and `bnm.json`. `localhost` selects Buje and `127.0.0.1` selects BNM in local development. `ConfigProvider` makes its `cityAssociationId` available to the browser's public category, catalog, and personal quiz calls. Update the host map and JSON config when adding an association.

The RedCross management app currently copies this path on its own signed-in host. For a direct public link, use the quiz app's host with the same path.

## Participant flow

1. Select a category and a prepared quiz, or request a personal quiz with a name and question count. A direct published link can open a prepared quiz as well.
2. Start or resume the attempt and answer single choice, multiple choice, text, and matching questions.
3. Save each answer when moving between questions or completing the quiz.
4. Show the score, correct answers, and explanations only after completion.

The attempt ID and access token are kept in browser local storage so a participant can resume on the same browser. The token is sent in `X-Quiz-Attempt-Token` and never placed in the URL. Personal quiz links resume only on the browser where the quiz was started.

The client calls only `/api/Quiz/Public` backend endpoints. Public API types are in `types/quiz-public.ts`, calls are in `lib/quiz-api.ts`, and the city and API configuration are provided by `components/quiz/config-provider.tsx`. The in-progress payload contains no answer key. Result data is handled after the attempt is complete.

The logo source is `public/brand/quiz-logo.svg`. PNG and WebP exports are alongside it; browser and app icons are in `public/` and `public/icons/`.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

`pnpm start` serves a production build. The app needs a running backend to start or resume real attempts.

See `AGENTS.md` for repository guidance.
