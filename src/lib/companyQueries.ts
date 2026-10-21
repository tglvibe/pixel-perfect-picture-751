import { queryOptions } from "@tanstack/react-query";

import { SEED_COMPANIES } from "@/data/seedCompanies";
import {
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
} from "@/lib/companyData";

/**
 * Data access layer. Phase 1 reads the hardcoded seed; Phase 2 only swaps
 * these queryFns to read rows from the database and feeds the same JSON
 * shapes through the normalizers.
 */

const findSeed = (companyId: number) => SEED_COMPANIES.find((c) => c.company_id === companyId);

export const companiesQuery = () =>
  queryOptions({
    queryKey: ["companies"],
    queryFn: async () =>
      SEED_COMPANIES.map((c) => normalizeCompanySummary(c.short_json, c.company_id)),
  });

export const companyProfileQuery = (companyId: number) =>
  queryOptions({
    queryKey: ["company-profile", companyId],
    queryFn: async () => {
      const seed = findSeed(companyId);
      if (!seed) return null;
      return normalizeCompanyProfile(seed.full_json, seed.short_json, seed.company_id);
    },
  });

export const companySkillsQuery = (companyId: number) =>
  queryOptions({
    queryKey: ["company-skills", companyId],
    queryFn: async () => normalizeDashboardSkills(findSeed(companyId)?.skill_levels ?? []),
  });
