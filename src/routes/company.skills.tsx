import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronDown, Lock } from "lucide-react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { SKILL_TOPICS } from "@/data/skillTopics";
import { useRequireCompany } from "@/hooks/use-require-company";
import { PORTAL_TITLE } from "@/lib/college";
import type { BloomLevel, Criticality, DashboardSkill, Difficulty } from "@/lib/companyData";
import { companyProfileQuery, companySkillsQuery } from "@/lib/companyQueries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/skills")({
  head: () => ({
    meta: [
      { title: `Skill Intelligence | ${PORTAL_TITLE}` },
      {
        name: "description",
        content: "Skills a recruiter expects, mapped to Bloom levels with a 10-level preparation roadmap.",
      },
      { property: "og:title", content: "Skill Intelligence — Placement Intelligence Hub" },
      { property: "og:description", content: "Know exactly which skills to prepare and how deep to go." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillIntelligence,
});

const BLOOM: Record<BloomLevel, { label: string; range: string; text: string; tint: string; bar: string }> = {
  CU: { label: "Understand", range: "Levels 1–2", text: "text-bloom-cu", tint: "bg-bloom-cu/10 border-bloom-cu/25", bar: "bg-bloom-cu" },
  AP: { label: "Apply", range: "Levels 3–4", text: "text-bloom-ap", tint: "bg-bloom-ap/10 border-bloom-ap/25", bar: "bg-bloom-ap" },
  AS: { label: "Analyze", range: "Levels 5–6", text: "text-bloom-as", tint: "bg-bloom-as/10 border-bloom-as/30", bar: "bg-bloom-as" },
  EV: { label: "Evaluate", range: "Levels 7–8", text: "text-bloom-ev", tint: "bg-bloom-ev/10 border-bloom-ev/25", bar: "bg-bloom-ev" },
  CR: { label: "Create", range: "Levels 9–10", text: "text-bloom-cr", tint: "bg-bloom-cr/10 border-bloom-cr/25", bar: "bg-bloom-cr" },
};

const CRITICALITY: Record<Criticality, { desc: string; text: string; dot: string }> = {
  Critical: { desc: "Score 7+ · must be interview-ready", text: "text-expert", dot: "bg-expert" },
  Important: { desc: "Score 5–6 · strong working knowledge", text: "text-advanced", dot: "bg-advanced" },
  Baseline: { desc: "Score below 5 · solid fundamentals", text: "text-beginner", dot: "bg-beginner" },
};

const DIFFICULTY: Record<Difficulty, string> = {
  EXPERT: "text-expert bg-expert/10",
  ADVANCED: "text-advanced bg-advanced/10",
  PRO: "text-pro bg-pro/10",
  BEGINNER: "text-beginner bg-beginner/10",
};

const SkillCard = memo(function SkillCard({ skill }: { skill: DashboardSkill }) {
  const [open, setOpen] = useState(false);
  const bloom = BLOOM[skill.bloom];
  const crit = CRITICALITY[skill.criticality];
  const topics = SKILL_TOPICS[skill.id] ?? [];

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-xl border bg-card shadow-card">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-snug">{skill.name}</h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className={cn("rounded-md border px-1.5 py-0.5 text-[11px] font-bold", bloom.tint, bloom.text)}>
                {skill.bloom} · {bloom.label}
              </span>
              <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wider", DIFFICULTY[skill.difficulty])}>
                {skill.difficulty}
              </span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-heading text-2xl font-semibold tabular-nums leading-none">
              {skill.score}
              <span className="text-sm font-medium text-muted-foreground">/10</span>
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={skill.score} aria-valuemin={0} aria-valuemax={10}>
          <div className={cn("h-full rounded-full", bloom.bar)} style={{ width: `${skill.score * 10}%` }} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", crit.text)}>
            <span className={cn("h-2 w-2 rounded-full", crit.dot)} aria-hidden />
            {skill.criticality}
          </span>
          <CollapsibleTrigger className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand hover:bg-brand-soft">
            {open ? "Hide roadmap" : "View 10-level roadmap"}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent>
        <ol className="divide-y border-t">
          {topics.map((t) => {
            const locked = t.level_number > skill.score;
            return (
              <li
                key={t.level_number}
                className={cn("flex items-center gap-3 px-4 py-2.5 sm:px-5", locked && "bg-surface")}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums",
                    locked ? "bg-muted text-muted-foreground" : cn(BLOOM[skill.bloom].tint, "border", bloom.text),
                  )}
                >
                  {t.level_number}
                </span>
                <span className={cn("min-w-0 flex-1 text-sm", locked && "text-muted-foreground")}>{t.topic}</span>
                {locked ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    <Lock className="h-3 w-3" aria-hidden />
                    Beyond scope
                  </span>
                ) : (
                  <Check className="h-4 w-4 shrink-0 text-standard" aria-label="In scope" />
                )}
              </li>
            );
          })}
        </ol>
      </CollapsibleContent>
    </Collapsible>
  );
});

function SkillIntelligence() {
  const { selected, ready } = useRequireCompany();
  const id = selected?.companyId ?? 0;
  const { data: skills } = useQuery({ ...companySkillsQuery(id), enabled: ready });
  const { data: profile } = useQuery({ ...companyProfileQuery(id), enabled: ready });

  if (!ready || !skills) {
    return (
      <div className="space-y-4 p-4 sm:p-6">
        <Skeleton className="h-14 w-2/3 rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const name = profile?.summary.shortName ?? selected?.companyName ?? "";

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-5 sm:px-6">
      <div className="flex items-center gap-3 border-b pb-5">
        <CompanyLogo
          name={name}
          logoUrl={profile?.summary.logoUrl ?? selected?.logoUrl}
          websiteUrl={profile?.summary.websiteUrl}
          size="lg"
        />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold sm:text-2xl">{name} Skill Intelligence</h1>
          <p className="text-sm text-muted-foreground">
            {skills.length} skills · sorted by required proficiency
          </p>
        </div>
      </div>

      <section className="mt-5" aria-label="Bloom levels">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bloom levels</h2>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {(Object.keys(BLOOM) as BloomLevel[]).map((k) => (
            <div key={k} className={cn("rounded-lg border px-3 py-2", BLOOM[k].tint)}>
              <p className={cn("font-heading text-sm font-bold", BLOOM[k].text)}>
                {k} · {BLOOM[k].label}
              </p>
              <p className="text-[11px] text-muted-foreground">{BLOOM[k].range}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4" aria-label="Criticality">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Criticality</h2>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(Object.keys(CRITICALITY) as Criticality[]).map((k) => (
            <div key={k} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5">
              <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", CRITICALITY[k].dot)} aria-hidden />
              <div>
                <p className={cn("text-sm font-semibold", CRITICALITY[k].text)}>{k}</p>
                <p className="text-xs text-muted-foreground">{CRITICALITY[k].desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid items-start gap-4 md:grid-cols-2">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
}
