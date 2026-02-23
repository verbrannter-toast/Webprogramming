# Copilot Instructions for Webprogramming-Module

## Scope and architecture
- Main code lives in `streaming-service/`; root `README.md` is only a short note.
- Frontend: Next.js App Router + mostly client components in `streaming-service/src/app`.
- Backend: single Express + SQLite service in `streaming-service/backend/server.ts`.
- Data model in SQLite (`database.db`): `users`, `watchlists`, `movies`; movies are seeded from `backend/movies.json`.
- User avatar files are persisted outside app source at `user-uploads/avatars` and served by backend as `/uploads/avatars/*`.
- Movie list UIs are now shared components in `src/app/components/movies/*` (`MovieGridSection`, `MovieActionCard`, `types.ts`).

## Developer workflow (authoritative commands)
- `cd streaming-service && npm install`
- Preferred dev run: `npm run dev` (runs frontend + backend concurrently).
- Frontend only: `npm run dev-frontend`
- Backend only: `npm run dev-backend`
- Lint: `npm run lint`
- Production frontend: `npm run build` then `npm run start`
- DB reset/reseed: stop backend, delete `streaming-service/database.db`, restart backend.
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
- Navbar navigation genres are generated from `GENRE_CONFIGS` in `src/app/genres/config.ts` (also consumed by `src/app/components/navbar.tsx`).
- Genre routes are thin wrappers (`src/app/genres/*/page.tsx`) around shared `GenreMoviesPage`.
- `GenreMoviesPage`, `watchlist/page.tsx`, and `search/page.tsx` reuse `MovieGridSection` + `MovieActionCard`; keep behavior changes centralized there.
- Search UX is navbar-driven: `Navbar` pushes `/search?q=...`; `src/app/search/page.tsx` reads query via `useSearchParams()` and filters movies client-side.
- Home page still has its own row-based layout and custom link-wrapped cards (`src/app/page.tsx`) separate from grid pages.
- Account page is tab-driven (`src/app/account/page.tsx`) and composes sections from `src/app/account/components/*` via `SectionLayout`.
- Delete-account tab (`DeleteAccountSection`) must keep backend delete + localStorage cleanup + redirect to `/login` aligned.
- Avatar updates propagate through both local state callback (`onAvatarUpdated`) and a global `window` event (`avatar-updated`) consumed by `Navbar`.

## Editing guardrails for this repo
- Keep frontend/backend response shapes aligned with `backend/server.ts`; avoid silent contract changes.
- Prefer minimal targeted edits near existing feature files instead of introducing new abstraction layers.
- Keep existing style: functional React components, hooks, inline interfaces, Tailwind utility classes.
- If adding genres/categories, use exact genre strings present in `backend/movies.json`.
- API host is currently standardized to `http://localhost:5000`; keep new calls consistent.
- `userEmail` is displayed in account UI and currently set during login/register; preserve this when touching auth flows.
