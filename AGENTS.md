<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Phase 1 is UI-only: all data comes from `src/data/seedCompanies.ts`; no backend/Cloud until Phase 2. Why: brief scopes the database to a later phase.
- Data access goes through `src/lib/companyQueries.ts` queryFns feeding the pure normalizers in `src/lib/companyData.ts` (raw short_json/full_json/skill_levels in). Why: Phase 2 swaps only the queryFns.
- Selected company lives in `CompanyContext` and localStorage key `selected-company`; company pages use `useRequireCompany` to redirect to `/` when missing. Why: pages must survive refresh without a URL param.
- Intelligence section/field schema lives only in `src/data/intelligenceData.tsx`. Why: single place to add or relabel fields.
- Brand-specified colors are hex tokens in `src/styles.css`; components use token classes only. Why: exact hex required by the brief.
