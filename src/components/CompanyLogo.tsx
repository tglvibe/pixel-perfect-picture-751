import { memo, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

const LOGO_DEV_KEY = import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY as string | undefined;

function domainOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

interface CompanyLogoProps {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-8 w-8 text-sm",
  md: "h-11 w-11 text-base",
  lg: "h-14 w-14 text-xl",
};

/** Logo.dev (if key set) → seed logo_url → initial letter. Recruiting-company logos only. */
export const CompanyLogo = memo(function CompanyLogo({
  name,
  logoUrl,
  websiteUrl,
  size = "md",
  className,
}: CompanyLogoProps) {
  const sources = useMemo(() => {
    const list: string[] = [];
    const domain = websiteUrl ? domainOf(websiteUrl) : null;
    if (LOGO_DEV_KEY && domain) list.push(`https://img.logo.dev/${domain}?token=${LOGO_DEV_KEY}&size=128`);
    if (logoUrl) list.push(logoUrl);
    return list;
  }, [logoUrl, websiteUrl]);

  const [index, setIndex] = useState(0);
  const src = sources[index];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-card",
        SIZES[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={`${name} logo`}
          loading="lazy"
          className="h-full w-full object-contain p-1.5"
          onError={() => setIndex((i) => i + 1)}
        />
      ) : (
        <span className="font-heading font-semibold text-brand">
          {name.trim().charAt(0).toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
});
