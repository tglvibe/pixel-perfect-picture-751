# JSS Academy of Technical Education, Noida — Companies Research & Placement Analytics Portal

a.k.a. **JSS Academy of Technical Education, Noida Placement Intelligence Hub**

## Phase 1 — UI only

- **College used:** `COLLEGE_NAME = "JSS Academy of Technical Education, Noida"`, `COLLEGE_SHORT = "JSS"` (see `src/lib/college.ts`).
- **Hardcoded seed data.** Every page renders from `src/data/seedCompanies.ts` (Accenture) and `src/data/skillTopics.ts` (10-level ladders for 12 skills). There is no database, no backend, no Supabase client.
- **Fully public.** There is no login, no auth context and no protected routes. Every page is reachable directly.
- **No college logo.** The hero is text only. Recruiting-company logos come from Logo.dev when `VITE_LOGO_DEV_PUBLISHABLE_KEY` is set, otherwise the seed `logo_url`, otherwise an initial letter.
- CTC, stipend and selection ratio are never displayed (normalizers strip them).

## Pages

| URL | Page |
| --- | --- |
| `/` | Company grid with search and category filters |
| `/company` | Redirects to `/company/intelligence` |
| `/company/intelligence` | 22-section company intelligence |
| `/company/skills` | Skill intelligence with Bloom levels and roadmaps |

The selected company is stored in localStorage under `selected-company`, so both company pages survive a refresh. Without a selection they send you back to `/`.

## Phase 2 — Supabase

`src/lib/companyData.ts` normalizers take the raw `short_json`, `full_json` and `skill_levels` shapes. Phase 2 only swaps the `queryFn`s in `src/lib/companyQueries.ts` to read those JSONB columns from Supabase and pass them through the same normalizers.

## Stack note

The brief named React Router 6 + Tailwind v3. This project runs on TanStack Start (TanStack Router file routes) and Tailwind v4, which is what Lovable supports; the routes, redirect, layout `<Outlet />` and behaviour match the brief exactly.

## Tests

`bun run test` — routing checks plus skill/category/data rules.
