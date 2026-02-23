# Copilot Instructions for Webprogramming-Module

## Scope and structure
- Main app code is in `streaming-service/` (root `README.md` is only a short project note).
- Frontend: Next.js App Router in `streaming-service/src/app`.
- Backend: Express + SQLite in `streaming-service/backend/server.ts`.
- Seed movie catalog lives in `streaming-service/backend/movies.json` and is imported into SQLite on first run.

## Developer workflow (use these commands)
- Install deps: `cd streaming-service && npm install`
- Run full stack in dev (preferred): `npm run dev`
  - Starts frontend (`next dev`) and backend (`node --watch --import=tsx backend/server.ts`) concurrently.
- Frontend only: `npm run dev-frontend`
- Backend only: `npm run dev-backend`
- Lint: `npm run lint`
- Production frontend build/start: `npm run build` then `npm run start`

## Runtime architecture and data flow
- Backend starts on `http://localhost:5000` and initializes `database.db` with `users`, `watchlists`, `movies`.
- Backend auto-seeds:
  - test user: `test@test.com` / `password123`
  - movies from `backend/movies.json` when `movies` table is empty.
- Frontend pages fetch REST endpoints directly from client components:
  - Auth: `POST /login`, `POST /register`
  - Account: `POST /account/update-password`
  - Movies: `GET /movies`
  - Watchlist: `GET /watchlist/:userId`, `POST /watchlist/toggle`

## Project-specific coding patterns
- Most pages are `'use client'` and read auth from `localStorage` (`userId`, sometimes `userEmail`).
- Navbar is mounted in `src/app/layout.tsx` and hidden for `/watch/[id]` routes via `usePathname()`.
- Genre pages are route-per-genre (`src/app/genres/*/page.tsx`) and filter from `/movies` using a local `CURRENT_GENRE` constant.
- Home/watchlist/genre pages share the same watchlist toggle API pattern (`/watchlist/toggle`) and optimistic local state updates.
- Account page is tab-driven and composes sections from `src/app/account/components/*` via `SectionLayout`.

## Conventions to preserve when editing
- Keep frontend-backend contract aligned with `backend/server.ts` (response shapes like `{ success }`, `{ status: 'added'|'removed' }`).
- Prefer minimal, targeted changes; this codebase currently keeps logic close to page components instead of central API clients.
- Maintain existing TypeScript/React style (functional components, hooks, inline interfaces, Tailwind utility classes).
- When adding new authenticated UI behavior, continue current storage approach (`localStorage.userId`) unless a broader auth refactor is requested.
- If introducing new movie categories, ensure values match `movies.json` genre strings used by filtering pages.

## Known implementation quirks (important context)
- API host is inconsistent in existing code (`localhost` vs `127.0.0.1`); avoid expanding this inconsistency in new changes.
- `userEmail` is read in account UI but not reliably written during login/register flows.
- No test suite is configured in scripts; validate changes through `npm run lint` and manual dev run.
