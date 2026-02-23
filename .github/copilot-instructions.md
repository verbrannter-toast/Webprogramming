# Copilot Instructions for Webprogramming-Module

## Scope and architecture
- Main code lives in `streaming-service/`; root `README.md` is only a short note.
- Frontend: Next.js App Router + client components in `streaming-service/src/app`.
- Backend: single Express + SQLite service in `streaming-service/backend/server.ts`.
- Data model in SQLite (`database.db`): `users`, `watchlists`, `movies`; movies are seeded from `backend/movies.json`.
- User avatar files are persisted outside app source at `user-uploads/avatars` and served by backend as `/uploads/avatars/*`.

## Developer workflow (authoritative commands)
- `cd streaming-service && npm install`
- Preferred dev run: `npm run dev` (runs frontend + backend concurrently).
- Frontend only: `npm run dev-frontend`
- Backend only: `npm run dev-backend`
- Lint: `npm run lint`
- Production frontend: `npm run build` then `npm run start`
- No automated test script exists; validate via lint + manual flows.

## Runtime/data-flow conventions
- Backend starts on `http://localhost:5000`, initializes tables, auto-creates test user `test@test.com` / `password123`, then seeds movies if empty.
- Frontend calls REST directly from page/components (no central API client).
- Core contracts from `backend/server.ts`:
  - `POST /login` -> `{ success, user }`
  - `POST /register` -> `{ success, userId }`
  - `GET /movies` -> movie array
  - `GET /watchlist/:userId` -> `number[]`
  - `POST /watchlist/toggle` -> `{ status: 'added' | 'removed' }`
  - `POST /account/update-password` -> `{ success, message }`
  - `GET /account/avatar/:userId`, `POST /account/avatar` -> `{ success, avatarUrl }`
  - `DELETE /account/:userId` -> `{ success, message }` and removes watchlist + avatar file

## Project patterns to preserve
- Auth state is localStorage-first (`userId`, `userEmail`), e.g. login/account/navbar flows.
- `Navbar` is rendered in `src/app/layout.tsx` and hidden for `/watch/[id]` via `usePathname()`.
- Home/genre/watchlist pages all use the same watchlist toggle pattern with optimistic UI updates.
- Genre pages are route-per-genre and filter with a local `CURRENT_GENRE` constant (see `src/app/genres/*/page.tsx`).
- Account page is tab-driven (`src/app/account/page.tsx`) and composes sections from `src/app/account/components/*` via `SectionLayout`.
- Avatar updates propagate through both local state callback (`onAvatarUpdated`) and a global `window` event (`avatar-updated`) consumed by `Navbar`.

## Editing guardrails for this repo
- Keep frontend/backend response shapes aligned with `backend/server.ts`; avoid silent contract changes.
- Prefer minimal targeted edits near existing feature files instead of introducing new abstraction layers.
- Keep existing style: functional React components, hooks, inline interfaces, Tailwind utility classes.
- If adding genres/categories, use exact genre strings present in `backend/movies.json`.
- API host usage is currently mixed (`localhost` and `127.0.0.1` in frontend); avoid spreading this inconsistency in new changes.
- `userEmail` is displayed in account UI and currently set during login/register; preserve this when touching auth flows.
