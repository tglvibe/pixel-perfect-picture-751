import {
  Award,
  BarChart3,
  Building2,
  Contact,
  Cpu,
  Crown,
  Eye,
  Gift,
  Globe2,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Landmark,
  Leaf,
  MapPinned,
  Newspaper,
  Package,
  ShieldAlert,
  ShieldCheck,
  Star,
  Swords,
  Target,
  type LucideIcon,
} from "lucide-react";

import { isForbiddenField, titleCaseFromCode, type CompanyProfile, type ProfileFieldKey } from "@/lib/companyData";

export type FieldType = "auto" | "url" | "email" | "video" | "rating" | "list" | "paragraph" | "number";

export interface IntelligenceField {
  key: ProfileFieldKey;
  label: string;
  type: FieldType;
  value: string;
}

export interface IntelligenceSection {
  id: string;
  title: string;
  icon: LucideIcon;
  fields: IntelligenceField[];
}

type FieldSpec = [ProfileFieldKey, FieldType?, string?];

const SCHEMA: { id: string; title: string; icon: LucideIcon; fields: FieldSpec[] }[] = [
  {
    id: "identity",
    title: "Company Identity",
    icon: Building2,
    fields: [
      ["name", "auto", "Legal Name"], ["short_name", "auto", "Short Name"], ["category"],
      ["nature_of_company"], ["incorporation_year"], ["employee_size"],
      ["headquarters_address", "auto", "Headquarters"],
    ],
  },
  {
    id: "overview",
    title: "Overview & Vision",
    icon: Eye,
    fields: [
      ["overview_text", "paragraph", "Overview"], ["vision_statement", "paragraph", "Vision"],
      ["mission_statement", "paragraph", "Mission"], ["core_values", "list"],
      ["history_timeline", "list", "History & Highlights"],
    ],
  },
  {
    id: "leadership",
    title: "Leadership",
    icon: Crown,
    fields: [
      ["ceo_name", "auto", "CEO"], ["ceo_linkedin_url", "url", "CEO LinkedIn"], ["key_leaders", "list"],
      ["board_members", "list"], ["warm_intro_pathways", "list"], ["decision_maker_access", "paragraph"],
    ],
  },
  {
    id: "funding",
    title: "Funding & Financials",
    icon: Landmark,
    fields: [
      ["annual_revenue"], ["annual_profit"], ["revenue_mix", "list"], ["valuation"],
      ["yoy_growth_rate", "auto", "YoY Growth Rate"], ["profitability_status"], ["key_investors", "list"],
      ["recent_funding_rounds"], ["total_capital_raised"],
      ["customer_acquisition_cost", "auto", "Customer Acquisition Cost (CAC)"],
      ["customer_lifetime_value", "auto", "Customer Lifetime Value (LTV)"],
      ["cac_ltv_ratio", "auto", "CAC : LTV Ratio"], ["burn_rate"], ["runway_months"], ["burn_multiplier"],
    ],
  },
  {
    id: "global",
    title: "Global Presence",
    icon: Globe2,
    fields: [
      ["headquarters_address", "auto", "Headquarters"], ["operating_countries", "list"],
      ["office_count"], ["office_locations", "list"],
    ],
  },
  {
    id: "products",
    title: "Products & Services",
    icon: Package,
    fields: [
      ["offerings_description", "list", "Offerings"], ["focus_sectors", "list"],
      ["pain_points_addressed", "list"], ["top_customers", "list"], ["product_pipeline", "list"],
      ["case_studies", "list"],
    ],
  },
  {
    id: "tech",
    title: "Technology Stack",
    icon: Cpu,
    fields: [
      ["tech_stack", "list"], ["technology_partners", "list"],
      ["ai_ml_adoption_level", "paragraph", "AI / ML Adoption"],
      ["r_and_d_investment", "auto", "R&D Investment"], ["intellectual_property", "list"],
      ["cybersecurity_posture", "list"], ["tech_adoption_rating"], ["automation_level"],
    ],
  },
  {
    id: "partnerships",
    title: "Partnerships & Ecosystem",
    icon: Handshake,
    fields: [
      ["partnership_ecosystem", "list"], ["industry_associations", "list"], ["event_participation", "list"],
    ],
  },
  {
    id: "competition",
    title: "Competitive Landscape",
    icon: Swords,
    fields: [
      ["key_competitors", "list"], ["competitive_advantages", "list"], ["unique_differentiators", "list"],
      ["weaknesses_gaps", "list", "Weaknesses & Gaps"], ["market_share_percentage", "auto", "Market Share"],
      ["benchmark_vs_peers", "list", "Benchmark vs Peers"],
    ],
  },
  {
    id: "market",
    title: "Market Opportunity",
    icon: Target,
    fields: [
      ["tam", "auto", "TAM"], ["sam", "auto", "SAM"], ["som", "auto", "SOM"], ["future_projections"],
      ["strategic_priorities", "list"], ["innovation_roadmap", "list"],
      ["go_to_market_strategy", "list", "Go-to-Market Strategy"], ["sales_motion"],
      ["exit_strategy_history", "list"],
    ],
  },
  {
    id: "value-esg",
    title: "Core Value Proposition & ESG",
    icon: Leaf,
    fields: [
      ["core_value_proposition", "list"], ["esg_ratings", "list", "ESG Ratings"],
      ["sustainability_csr", "list", "Sustainability & CSR"], ["carbon_footprint"], ["ethical_sourcing", "list"],
    ],
  },
  {
    id: "culture",
    title: "Culture & Work Life",
    icon: HeartHandshake,
    fields: [
      ["work_culture_summary", "list", "Work Culture"], ["manager_quality"], ["psychological_safety"],
      ["feedback_culture", "list"], ["diversity_metrics", "list"],
      ["diversity_inclusion_score", "list", "Diversity & Inclusion"], ["ethical_standards", "list"],
      ["burnout_risk"], ["mission_clarity"], ["crisis_behavior"], ["layoff_history"],
      ["employee_turnover"], ["avg_retention_tenure", "auto", "Average Retention Tenure"],
      ["hiring_velocity", "list"],
    ],
  },
  {
    id: "news",
    title: "Recent News & Milestones",
    icon: Newspaper,
    fields: [["recent_news", "list"], ["awards_recognitions", "list", "Awards & Recognitions"]],
  },
  {
    id: "sales",
    title: "Sales & Customer Metrics",
    icon: BarChart3,
    fields: [
      ["churn_rate"], ["net_promoter_score", "auto", "Net Promoter Score (NPS)"],
      ["customer_concentration_risk"], ["customer_testimonials", "list"], ["key_challenges_needs", "list", "Key Challenges & Needs"],
    ],
  },
  {
    id: "risk",
    title: "Risk & Compliance",
    icon: ShieldAlert,
    fields: [
      ["regulatory_status", "list"], ["legal_issues", "list"], ["supply_chain_dependencies", "list"],
      ["geopolitical_risks", "list"], ["macro_risks", "list"],
    ],
  },
  {
    id: "location",
    title: "Work Location & Commute",
    icon: MapPinned,
    fields: [
      ["remote_policy_details", "auto", "Remote Policy"], ["flexibility_level", "list"], ["typical_hours"],
      ["overtime_expectations"], ["weekend_work"], ["location_centrality"], ["office_zone_type"],
      ["public_transport_access", "list"], ["cab_policy", "list"], ["airport_commute_time"],
    ],
  },
  {
    id: "safety",
    title: "Safety & Wellbeing",
    icon: ShieldCheck,
    fields: [
      ["area_safety", "list"], ["safety_policies", "list"], ["infrastructure_safety", "list"],
      ["emergency_preparedness", "list"], ["health_support", "list"], ["leave_policy", "list"],
    ],
  },
  {
    id: "career",
    title: "Career Growth & Learning",
    icon: GraduationCap,
    fields: [
      ["training_spend"], ["onboarding_quality"], ["learning_culture", "list"], ["mentorship_availability", "list"],
      ["internal_mobility"], ["promotion_clarity", "list"], ["role_clarity"], ["early_ownership"],
      ["work_impact", "list"], ["exposure_quality"], ["cross_functional_exposure", "list"],
      ["execution_thinking_balance", "auto", "Execution vs Thinking Balance"], ["tools_access", "list"],
      ["skill_relevance"], ["exit_opportunities", "list"], ["global_exposure", "list"],
      ["network_strength", "list"], ["company_maturity"],
    ],
  },
  {
    id: "brand",
    title: "Brand & Reputation",
    icon: Award,
    fields: [
      ["brand_value"], ["brand_sentiment_score", "paragraph", "Brand Sentiment"], ["external_recognition"],
      ["client_quality", "list"], ["website_quality", "paragraph"],
    ],
  },
  {
    id: "benefits",
    title: "Compensation & Benefits",
    icon: Gift,
    fields: [
      ["fixed_vs_variable_pay", "auto", "Fixed vs Variable Pay"], ["bonus_predictability"],
      ["esops_incentives", "list", "ESOPs & Incentives"], ["family_health_insurance", "list"],
      ["relocation_support", "list"], ["lifestyle_benefits", "list"],
    ],
  },
  {
    id: "digital",
    title: "Digital Presence & Ratings",
    icon: Star,
    fields: [
      ["website_url", "url", "Website"], ["linkedin_url", "url", "LinkedIn"], ["twitter_handle", "auto", "X / Twitter"],
      ["facebook_url", "url", "Facebook"], ["instagram_url", "url", "Instagram"],
      ["marketing_video_url", "video", "Marketing Video"], ["website_rating", "rating"],
      ["website_traffic_rank", "list"], ["social_media_followers", "number"],
      ["glassdoor_rating", "rating"], ["indeed_rating", "rating"], ["google_rating", "rating"],
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: Contact,
    fields: [
      ["primary_contact_email", "email", "Primary Email"], ["primary_phone_number", "auto", "Primary Phone"],
      ["contact_person_name"], ["contact_person_title"], ["contact_person_email", "email"],
      ["contact_person_phone"],
    ],
  },
];

/** Section/field schema for the 22 intelligence sections; values merged from profile when passed. */
export function buildIntelligenceSections(profile?: CompanyProfile | null): IntelligenceSection[] {
  return SCHEMA.map((section) => ({
    id: section.id,
    title: section.title,
    icon: section.icon,
    fields: section.fields
      .filter(([key]) => !isForbiddenField(key))
      .map(([key, type = "auto", label]) => ({
        key,
        type,
        label: label ?? titleCaseFromCode(key),
        value: profile?.fields[key] ?? "",
      })),
  }));
}
