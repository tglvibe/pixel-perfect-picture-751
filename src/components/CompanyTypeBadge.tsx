import { cva } from "class-variance-authority";

import type { CompanyType } from "@/lib/companyData";
import { cn } from "@/lib/utils";

export const companyTypeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
  {
    variants: {
      type: {
        "Super Dream": "border-super-dream/25 bg-super-dream/10 text-super-dream",
        Dream: "border-dream/25 bg-dream/10 text-dream",
        Standard: "border-standard/25 bg-standard/10 text-standard",
        Regular: "border-regular/25 bg-regular/10 text-regular",
      },
    },
  },
);

export function CompanyTypeBadge({ type, className }: { type: CompanyType; className?: string }) {
  return <span className={cn(companyTypeVariants({ type }), className)}>{type}</span>;
}
