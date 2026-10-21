import { memo } from "react";
import { ArrowRight, MapPin, TrendingDown, TrendingUp, Users } from "lucide-react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { CompanyTypeBadge } from "@/components/CompanyTypeBadge";
import { isNullish, type CompanySummary } from "@/lib/companyData";
import { cn } from "@/lib/utils";

function MetaValue({ value }: { value: string }) {
  if (isNullish(value)) {
    return <span className="italic text-muted-foreground">not publicly available</span>;
  }
  return <span className="truncate">{value}</span>;
}

interface CompanyCardProps {
  company: CompanySummary;
  onSelect: (company: CompanySummary) => void;
}

export const CompanyCard = memo(function CompanyCard({ company, onSelect }: CompanyCardProps) {
  const growthNegative = company.yoyGrowthRate.trim().startsWith("-");
  const GrowthIcon = growthNegative ? TrendingDown : TrendingUp;

  return (
    <button
      type="button"
      onClick={() => onSelect(company)}
      className="group flex h-full w-full flex-col rounded-xl border bg-card p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <CompanyLogo name={company.shortName} logoUrl={company.logoUrl} websiteUrl={company.websiteUrl} />
        <CompanyTypeBadge type={company.companyType} />
      </div>

      <div className="mt-4 min-w-0">
        <h3 className="truncate text-base font-semibold text-foreground">{company.name}</h3>
        <p className="truncate text-sm text-muted-foreground">{company.shortName}</p>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-foreground/80">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <MetaValue value={company.headquarters} />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <Users className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <MetaValue value={company.employeeSize} />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <GrowthIcon
            className={cn("h-4 w-4 shrink-0", growthNegative ? "text-destructive" : "text-standard")}
            aria-hidden
          />
          {isNullish(company.yoyGrowthRate) ? (
            <MetaValue value={company.yoyGrowthRate} />
          ) : (
            <span className={cn("truncate", growthNegative && "text-destructive")}>
              {company.yoyGrowthRate} YoY growth
            </span>
          )}
        </div>
      </dl>

      <div className="mt-auto flex justify-end pt-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand transition-transform group-hover:translate-x-0.5">
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </button>
  );
});
