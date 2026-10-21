import { useCallback, useEffect, useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SearchX, Search, X } from "lucide-react";

import { CompanyCard } from "@/components/CompanyCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompany } from "@/context/CompanyContext";
import { COLLEGE_SHORT, PORTAL_TITLE } from "@/lib/college";
import { COMPANY_TYPES, type CompanySummary, type CompanyType } from "@/lib/companyData";
import { companiesQuery } from "@/lib/companyQueries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `Companies | ${PORTAL_TITLE}` },
      {
        name: "description",
        content: "Browse recruiting companies by placement category and open detailed company and skill intelligence.",
      },
      { property: "og:title", content: PORTAL_TITLE },
      { property: "og:description", content: "Your strategic edge for campus placements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(companiesQuery()),
  component: Index,
  pendingComponent: IndexPending,
});

type Filter = "All" | CompanyType;

const FILTER_STYLES: Record<Filter, { active: string; dot: string }> = {
  All: { active: "border-navy bg-navy text-primary-foreground", dot: "bg-navy" },
  "Super Dream": { active: "border-super-dream bg-super-dream text-primary-foreground", dot: "bg-super-dream" },
  Dream: { active: "border-dream bg-dream text-primary-foreground", dot: "bg-dream" },
  Standard: { active: "border-standard bg-standard text-primary-foreground", dot: "bg-standard" },
  Regular: { active: "border-regular bg-regular text-primary-foreground", dot: "bg-regular" },
};

function Hero({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  return (
    <section className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <span className="inline-flex items-center rounded-full border bg-surface px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground">
          {COLLEGE_SHORT} · INTELLIGENCE PLATFORM
        </span>
        <h1 className="mt-4 max-w-4xl text-2xl font-semibold leading-tight text-foreground sm:text-4xl">
          {PORTAL_TITLE}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Your strategic edge for campus placements
        </p>

        <div className="relative mt-6 max-w-2xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies, headquarters, category…"
            aria-label="Search companies"
            className="h-12 w-full rounded-xl border bg-background pl-10 pr-10 text-sm shadow-card outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/20 [&::-webkit-search-cancel-button]:hidden"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function CardSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4">
          <div className="flex justify-between">
            <Skeleton className="h-11 w-11 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-4 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/2" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function IndexPending() {
  return (
    <main className="min-h-screen bg-surface">
      <Hero search="" setSearch={() => {}} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CardSkeletonGrid />
      </div>
    </main>
  );
}

function Index() {
  const { data: companies } = useSuspenseQuery(companiesQuery());
  const { selectCompany } = useCompany();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [search]);

  const searched = useMemo(() => {
    if (!debounced) return companies;
    return companies.filter((c) =>
      [c.name, c.shortName, c.headquarters, c.category, c.companyType]
        .join(" ")
        .toLowerCase()
        .includes(debounced),
    );
  }, [companies, debounced]);

  const counts = useMemo(() => {
    const base: Record<Filter, number> = { All: searched.length, "Super Dream": 0, Dream: 0, Standard: 0, Regular: 0 };
    for (const c of searched) base[c.companyType] += 1;
    return base;
  }, [searched]);

  const visible = useMemo(
    () => (filter === "All" ? searched : searched.filter((c) => c.companyType === filter)),
    [searched, filter],
  );

  const handleSelect = useCallback(
    (company: CompanySummary) => {
      selectCompany({ companyId: company.companyId, companyName: company.shortName, logoUrl: company.logoUrl });
      navigate({ to: "/company/intelligence" });
    },
    [selectCompany, navigate],
  );

  const reset = () => {
    setSearch("");
    setDebounced("");
    setFilter("All");
  };

  return (
    <main className="min-h-screen bg-surface">
      <Hero search={search} setSearch={setSearch} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {(["All", ...COMPANY_TYPES] as Filter[]).map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active ? FILTER_STYLES[f].active : "bg-card text-foreground/80 hover:bg-muted",
                )}
              >
                {!active && <span className={cn("h-2 w-2 rounded-full", FILTER_STYLES[f].dot)} aria-hidden />}
                {f}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs tabular-nums",
                    active ? "bg-background/20" : "bg-muted text-muted-foreground",
                  )}
                >
                  {counts[f]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-16 text-center">
              <SearchX className="h-10 w-10 text-muted-foreground" aria-hidden />
              <h2 className="mt-4 text-lg font-semibold">No companies match</h2>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search or category.</p>
              <Button className="mt-5" variant="outline" onClick={reset}>
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {visible.map((company, i) => (
                <motion.div
                  key={company.companyId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i, 8) * 0.03 }}
                >
                  <CompanyCard company={company} onSelect={handleSelect} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
