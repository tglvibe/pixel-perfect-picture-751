/**
 * Pure normalizers. Inputs are the raw JSON shapes (short_json / full_json /
 * skill_levels) so Phase 2 can pipe database rows in untouched.
 */

export const COMPANY_TYPES = ["Super Dream", "Dream", "Standard", "Regular"] as const;
export type CompanyType = (typeof COMPANY_TYPES)[number];

export type BloomLevel = "CU" | "AP" | "AS" | "EV" | "CR";
export type Criticality = "Critical" | "Important" | "Baseline";
export type Difficulty = "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER";

export interface CompanySummary {
  companyId: number;
  name: string;
  shortName: string;
  logoUrl: string;
  category: string;
  companyType: CompanyType;
  incorporationYear: string;
  employeeSize: string;
  headquarters: string;
  operatingCountries: string;
  officeLocations: string;
  yoyGrowthRate: string;
  websiteUrl: string;
}

/** Every profile field read from full_json (falls back to short_json). */
export const PROFILE_FIELD_KEYS = [
  "name", "short_name", "category", "incorporation_year", "nature_of_company", "overview_text",
  "headquarters_address", "operating_countries", "office_count", "office_locations", "employee_size",
  "vision_statement", "mission_statement", "core_values", "history_timeline", "recent_news",
  "website_url", "linkedin_url", "twitter_handle", "facebook_url", "instagram_url",
  "primary_contact_email", "primary_phone_number",
  "regulatory_status", "legal_issues", "esg_ratings", "supply_chain_dependencies",
  "geopolitical_risks", "macro_risks", "carbon_footprint", "ethical_sourcing",
  "marketing_video_url", "customer_testimonials", "website_quality", "website_rating",
  "website_traffic_rank", "social_media_followers", "glassdoor_rating", "indeed_rating",
  "google_rating", "awards_recognitions", "brand_sentiment_score", "event_participation",
  "pain_points_addressed", "focus_sectors", "offerings_description", "top_customers",
  "core_value_proposition", "unique_differentiators", "competitive_advantages", "weaknesses_gaps",
  "key_challenges_needs", "key_competitors", "market_share_percentage", "sales_motion",
  "customer_concentration_risk", "exit_strategy_history", "benchmark_vs_peers",
  "future_projections", "strategic_priorities", "industry_associations", "case_studies",
  "go_to_market_strategy", "innovation_roadmap", "product_pipeline", "tam", "sam", "som",
  "leave_policy", "health_support", "fixed_vs_variable_pay", "bonus_predictability",
  "esops_incentives", "family_health_insurance", "relocation_support", "lifestyle_benefits",
  "hiring_velocity", "employee_turnover", "avg_retention_tenure", "diversity_metrics",
  "work_culture_summary", "manager_quality", "psychological_safety", "feedback_culture",
  "diversity_inclusion_score", "ethical_standards", "burnout_risk", "layoff_history",
  "mission_clarity", "sustainability_csr", "crisis_behavior",
  "annual_revenue", "annual_profit", "revenue_mix", "valuation", "yoy_growth_rate",
  "profitability_status", "key_investors", "recent_funding_rounds", "total_capital_raised",
  "customer_acquisition_cost", "customer_lifetime_value", "cac_ltv_ratio", "churn_rate",
  "net_promoter_score", "burn_rate", "runway_months", "burn_multiplier",
  "remote_policy_details", "typical_hours", "overtime_expectations", "weekend_work",
  "flexibility_level", "location_centrality", "public_transport_access", "cab_policy",
  "airport_commute_time", "office_zone_type", "area_safety", "safety_policies",
  "infrastructure_safety", "emergency_preparedness",
  "ceo_name", "ceo_linkedin_url", "key_leaders", "warm_intro_pathways", "decision_maker_access",
  "contact_person_name", "contact_person_title", "contact_person_email", "contact_person_phone",
  "board_members",
  "training_spend", "onboarding_quality", "learning_culture", "exposure_quality",
  "mentorship_availability", "internal_mobility", "promotion_clarity", "tools_access",
  "role_clarity", "early_ownership", "work_impact", "execution_thinking_balance",
  "automation_level", "cross_functional_exposure", "company_maturity", "brand_value",
  "client_quality", "exit_opportunities", "skill_relevance", "external_recognition",
  "network_strength", "global_exposure",
  "technology_partners", "intellectual_property", "r_and_d_investment", "ai_ml_adoption_level",
  "tech_stack", "cybersecurity_posture", "partnership_ecosystem", "tech_adoption_rating",
  "logo_url", "company_type",
] as const;

export type ProfileFieldKey = (typeof PROFILE_FIELD_KEYS)[number];

export interface CompanyProfile {
  companyId: number;
  summary: CompanySummary;
  fields: Record<ProfileFieldKey, string>;
}

export interface DashboardSkill {
  id: number;
  name: string;
  score: number;
  proficiency: string;
  bloom: BloomLevel;
  criticality: Criticality;
  difficulty: Difficulty;
}

/** Fields that must never be surfaced anywhere in the portal. */
const FORBIDDEN_FIELD = /(ctc|stipend|selection[_\s-]?ratio)/i;
export const isForbiddenField = (key: string) => FORBIDDEN_FIELD.test(key);

// ---------- helpers ----------

export function asString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(asString).filter(Boolean).join("; ");
  return "";
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

const NULLISH = new Set(["", "na", "n/a", "none", "-", "null", "undefined", "nil"]);
export const isNullish = (value: unknown) => NULLISH.has(asString(value).toLowerCase());

/** Split on newlines, sentence periods, semicolons and bullets. Keeps decimals like 4.1 intact. */
export function splitItems(value: string): string[] {
  return value
    .split(/\r?\n|;|•|·|\u2022|\.(?=\s+[A-Z])/)
    .map((s) => s.replace(/^[\s\-*]+/, "").trim())
    .filter((s) => s.length > 0 && !isNullish(s));
}

export function titleCaseFromCode(code: string): string {
  return code
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => (w.length <= 3 && /^(tam|sam|som|ceo|csr|esg|cac|ltv|ai|ml|r|d)$/i.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export function scoreToDifficulty(score: number): Difficulty {
  if (score >= 8) return "EXPERT";
  if (score >= 6) return "ADVANCED";
  if (score >= 4) return "PRO";
  return "BEGINNER";
}

export function proficiencyToBloom(level: number): BloomLevel {
  if (level <= 2) return "CU";
  if (level <= 4) return "AP";
  if (level <= 6) return "AS";
  if (level <= 8) return "EV";
  return "CR";
}

export function scoreToCriticality(score: number): Criticality {
  if (score >= 7) return "Critical";
  if (score >= 5) return "Important";
  return "Baseline";
}

function toCompanyType(value: unknown): CompanyType {
  const v = asString(value).toLowerCase().replace(/[_-]/g, " ");
  const match = COMPANY_TYPES.find((t) => t.toLowerCase() === v);
  return match ?? "Regular";
}

// ---------- normalizers ----------

export function normalizeCompanySummary(shortJson: unknown, companyId = 0): CompanySummary {
  const s = asRecord(shortJson);
  return {
    companyId,
    name: asString(s["name"]),
    shortName: asString(s["short_name"]) || asString(s["name"]),
    logoUrl: asString(s["logo_url"]),
    category: asString(s["category"]),
    companyType: toCompanyType(s["company_type"]),
    incorporationYear: asString(s["incorporation_year"]),
    employeeSize: asString(s["employee_size"]),
    headquarters: asString(s["headquarters_address"]),
    operatingCountries: asString(s["operating_countries"]),
    officeLocations: asString(s["office_locations"]),
    yoyGrowthRate: asString(s["yoy_growth_rate"]),
    websiteUrl: asString(s["website_url"]),
  };
}

export function normalizeCompanyProfile(
  fullJson: unknown,
  shortJson: unknown,
  companyId = 0,
): CompanyProfile {
  const full = asRecord(fullJson);
  const short = asRecord(shortJson);
  const fields = {} as Record<ProfileFieldKey, string>;
  for (const key of PROFILE_FIELD_KEYS) {
    if (isForbiddenField(key)) continue;
    fields[key] = asString(full[key] ?? short[key]);
  }
  return { companyId, summary: normalizeCompanySummary(short, companyId), fields };
}

export function normalizeDashboardSkills(skillLevels: unknown): DashboardSkill[] {
  if (!Array.isArray(skillLevels)) return [];
  return skillLevels
    .map((raw) => {
      const r = asRecord(raw);
      const score = Math.max(0, Math.min(10, Number(r["required_level"]) || 0));
      return {
        id: Number(r["skill_set_id"]) || 0,
        name: asString(r["skill_set_name"]),
        score,
        proficiency: asString(r["required_proficiency"]),
        bloom: proficiencyToBloom(score),
        criticality: scoreToCriticality(score),
        difficulty: scoreToDifficulty(score),
      };
    })
    .filter((s) => s.name && !isForbiddenField(s.name))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}
