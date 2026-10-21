import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Globe, Linkedin } from "lucide-react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { CompanyTypeBadge } from "@/components/CompanyTypeBadge";
import { renderValue } from "@/components/FieldValue";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { buildIntelligenceSections, type IntelligenceSection } from "@/data/intelligenceData";
import { useRequireCompany } from "@/hooks/use-require-company";
import { PORTAL_TITLE } from "@/lib/college";
import { isNullish } from "@/lib/companyData";
import { companyProfileQuery } from "@/lib/companyQueries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/intelligence")({
  head: () => ({
    meta: [
      { title: `Company Intelligence | ${PORTAL_TITLE}` },
      {
        name: "description",
        content: "22-section intelligence profile: leadership, financials, culture, tech stack, risk and more.",
      },
      { property: "og:title", content: "Company Intelligence — Placement Intelligence Hub" },
      { property: "og:description", content: "Deep research on a recruiting company across 22 sections." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompanyIntelligence,
});

const SectionCard = memo(function SectionCard({
  section,
  index,
  registerRef,
}: {
  section: IntelligenceSection;
  index: number;
  registerRef: (idx: number, el: HTMLElement | null) => void;
}) {
  const Icon = section.icon;
  const available = section.fields.filter((f) => !isNullish(f.value)).length;
  const isNews = section.id === "news";

  return (
    <section
      id={section.id}
      ref={(el) => registerRef(index, el)}
      className="scroll-mt-40 rounded-xl border bg-card shadow-card"
    >
      <header className="flex items-center gap-3 border-b px-4 py-3 sm:px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <Icon className="h-4.5 w-4.5" aria-hidden />
        </span>
        <h2 className="min-w-0 flex-1 truncate text-base font-semibold sm:text-lg">{section.title}</h2>
        {isNews && (
          <span className="animate-glow rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground">
            NEW
          </span>
        )}
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {available}/{section.fields.length}
        </span>
      </header>
      <dl className="divide-y">
        {section.fields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5 px-4 py-3 sm:flex-row sm:gap-4 sm:px-5">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:w-1/3 sm:pt-0.5 sm:text-[13px] sm:normal-case sm:tracking-normal">
              {field.label}
            </dt>
            <dd className="min-w-0 sm:w-2/3">{renderValue(field.value, field.type)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
});

function PageSkeleton() {
  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-10 w-full rounded-lg" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-64 w-full rounded-xl" />
      ))}
    </div>
  );
}

function CompanyIntelligence() {
  const { selected, ready } = useRequireCompany();
  const { data: profile, isLoading } = useQuery({
    ...companyProfileQuery(selected?.companyId ?? 0),
    enabled: ready,
  });

  const sections = useMemo(() => buildIntelligenceSections(profile), [profile]);

  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const registerRef = useCallback((idx: number, el: HTMLElement | null) => {
    sectionRefs.current[idx] = el;
  }, []);

  const stickyOffset = () => 56 + (stickyRef.current?.offsetHeight ?? 0) + 12;

  // Scroll-spy
  useEffect(() => {
    if (!profile) return;
    const onScroll = () => {
      if (isScrollingRef.current) return;
      const offset = stickyOffset();
      let current = 0;
      sectionRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top - offset <= 1) current = i;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sectionRefs.current.length - 1;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [profile]);

  // Keep active tab centered in the tab bar
  useEffect(() => {
    const bar = tabBarRef.current;
    const tab = tabRefs.current[active];
    if (!bar || !tab) return;
    bar.scrollTo({ left: tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const scrollToSection = useCallback((idx: number) => {
    const el = sectionRefs.current[idx];
    if (!el) return;
    isScrollingRef.current = true;
    setActive(idx);
    const top = el.getBoundingClientRect().top + window.scrollY - stickyOffset();
    window.scrollTo({ top, behavior: "smooth" });
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 900);
  }, []);

  if (!ready || isLoading || !profile) return <PageSkeleton />;

  const { summary, fields } = profile;

  return (
    <div className="pb-16">
      <div ref={stickyRef} className="sticky top-14 z-20 border-b bg-background">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
          <CompanyLogo name={summary.shortName} logoUrl={summary.logoUrl} websiteUrl={summary.websiteUrl} />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold sm:text-xl">{summary.name}</h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              {!isNullish(summary.category) && (
                <span className="rounded-full border bg-surface px-2 py-0.5 text-[11px] font-medium text-foreground/80">
                  {summary.category}
                </span>
              )}
              <CompanyTypeBadge type={summary.companyType} />
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            {!isNullish(fields.website_url) && (
              <Button asChild variant="outline" size="sm">
                <a href={fields.website_url} target="_blank" rel="noopener noreferrer" aria-label="Website">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Website</span>
                  <ExternalLink className="hidden h-3 w-3 opacity-60 sm:inline" />
                </a>
              </Button>
            )}
            {!isNullish(fields.linkedin_url) && (
              <Button asChild variant="outline" size="sm">
                <a href={fields.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
              </Button>
            )}
          </div>
        </div>

        <div ref={tabBarRef} className="no-scrollbar flex gap-1 overflow-x-auto px-3 sm:px-5" role="tablist">
          {sections.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => scrollToSection(i)}
              className={cn(
                "relative shrink-0 whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors",
                active === i ? "text-brand" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s.title}
              <span
                className={cn(
                  "absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-colors",
                  active === i ? "bg-brand" : "bg-transparent",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-4 px-4 pt-5 sm:px-6">
        {sections.map((section, i) => (
          <SectionCard key={section.id} section={section} index={i} registerRef={registerRef} />
        ))}
      </div>
    </div>
  );
}
