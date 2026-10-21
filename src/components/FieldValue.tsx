import { ExternalLink, Mail, PlayCircle, Star } from "lucide-react";

import type { FieldType } from "@/data/intelligenceData";
import { isNullish, splitItems } from "@/lib/companyData";

export function NotAvailablePill() {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
      Not Available
    </span>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="inline-flex items-center rounded-md border bg-surface px-2 py-0.5 text-xs font-medium text-foreground/85"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex gap-2 text-sm leading-relaxed">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function prettyUrl(url: string) {
  try {
    const u = new URL(url);
    return (u.hostname.replace(/^www\./, "") + u.pathname).replace(/\/$/, "");
  } catch {
    return url;
  }
}

function Rating({ value }: { value: string }) {
  const match = value.match(/([\d.]+)\s*\/\s*([\d.]+)/);
  if (!match) return <span className="text-sm">{value}</span>;
  const score = Number(match[1]);
  const max = Number(match[2]) || 5;
  const filled = Math.round((score / max) * 5);
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={i < filled ? "h-4 w-4 fill-regular text-regular" : "h-4 w-4 text-border"}
          />
        ))}
      </span>
      <span className="text-sm font-semibold">{value}</span>
    </span>
  );
}

function autoItems(value: string): string[] | null {
  if (value.includes(";")) return splitItems(value);
  const parts = value.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 3 && parts.every((p) => p.length <= 32)) return parts;
  return null;
}

export function renderValue(value: string, type: FieldType) {
  if (isNullish(value)) return <NotAvailablePill />;

  switch (type) {
    case "url":
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-full items-center gap-1.5 break-all text-sm font-medium text-brand hover:underline"
        >
          {prettyUrl(value)}
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
        </a>
      );
    case "email":
      return (
        <a href={`mailto:${value}`} className="inline-flex items-center gap-1.5 break-all text-sm font-medium text-brand hover:underline">
          <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {value}
        </a>
      );
    case "video":
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:border-brand/40 hover:text-brand"
        >
          <PlayCircle className="h-4 w-4 text-expert" aria-hidden />
          Watch videos
        </a>
      );
    case "rating":
      return <Rating value={value} />;
    case "number": {
      const n = Number(value.replace(/,/g, ""));
      return <span className="text-sm font-semibold">{Number.isFinite(n) ? n.toLocaleString("en-IN") : value}</span>;
    }
    case "paragraph":
      return <p className="text-sm leading-relaxed text-foreground/90">{value}</p>;
    case "list": {
      const items = splitItems(value);
      if (items.length <= 1) return <p className="text-sm leading-relaxed">{value}</p>;
      return items.every((i) => i.length <= 40) ? <Pills items={items} /> : <Bullets items={items} />;
    }
    default: {
      const items = autoItems(value);
      if (items && items.length > 1) return <Pills items={items} />;
      return <span className="text-sm text-foreground/90">{value}</span>;
    }
  }
}
