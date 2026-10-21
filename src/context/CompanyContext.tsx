import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { SEED_COMPANIES } from "@/data/seedCompanies";
import { asString } from "@/lib/companyData";

export const SELECTED_COMPANY_KEY = "selected-company";

export interface SelectedCompany {
  companyId: number;
  companyName: string;
  logoUrl: string;
}

interface CompanyContextValue {
  selected: SelectedCompany | null;
  /** True once localStorage has been read on the client. */
  hydrated: boolean;
  selectCompany: (company: SelectedCompany) => void;
  clearCompany: () => void;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

/** Read selection from storage and confirm it still exists in the seed. */
export function readStoredCompany(): SelectedCompany | null {
  try {
    const raw = window.localStorage.getItem(SELECTED_COMPANY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SelectedCompany>;
    const seed = SEED_COMPANIES.find((c) => c.company_id === Number(parsed.companyId));
    if (!seed) return null;
    return {
      companyId: seed.company_id,
      companyName: asString(seed.short_json.short_name) || asString(seed.short_json.name),
      logoUrl: asString(seed.short_json.logo_url),
    };
  } catch {
    return null;
  }
}

export function persistCompany(company: SelectedCompany) {
  try {
    window.localStorage.setItem(SELECTED_COMPANY_KEY, JSON.stringify(company));
  } catch {
    /* storage unavailable — context still updates */
  }
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedCompany | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSelected(readStoredCompany());
    setHydrated(true);
  }, []);

  const selectCompany = useCallback((company: SelectedCompany) => {
    persistCompany(company);
    setSelected(company);
  }, []);

  const clearCompany = useCallback(() => {
    try {
      window.localStorage.removeItem(SELECTED_COMPANY_KEY);
    } catch {
      /* ignore */
    }
    setSelected(null);
  }, []);

  const value = useMemo(
    () => ({ selected, hydrated, selectCompany, clearCompany }),
    [selected, hydrated, selectCompany, clearCompany],
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used inside CompanyProvider");
  return ctx;
}
