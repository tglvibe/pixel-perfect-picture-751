import { describe, expect, it } from "vitest";

import { buildIntelligenceSections } from "@/data/intelligenceData";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { SKILL_TOPICS } from "@/data/skillTopics";
import {
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
  proficiencyToBloom,
  scoreToCriticality,
  scoreToDifficulty,
} from "@/lib/companyData";

describe("skill rules", () => {
  it("maps proficiency to Bloom: 1-2 CU, 3-4 AP, 5-6 AS, 7-8 EV, 9-10 CR", () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(proficiencyToBloom)).toEqual([
      "CU", "CU", "AP", "AP", "AS", "AS", "EV", "EV", "CR", "CR",
    ]);
  });

  it("criticality: >=7 Critical, >=5 Important, else Baseline", () => {
    expect(scoreToCriticality(7)).toBe("Critical");
    expect(scoreToCriticality(6)).toBe("Important");
    expect(scoreToCriticality(5)).toBe("Important");
    expect(scoreToCriticality(4)).toBe("Baseline");
  });

  it("difficulty: >=8 EXPERT, >=6 ADVANCED, >=4 PRO, else BEGINNER", () => {
    expect(scoreToDifficulty(8)).toBe("EXPERT");
    expect(scoreToDifficulty(7)).toBe("ADVANCED");
    expect(scoreToDifficulty(6)).toBe("ADVANCED");
    expect(scoreToDifficulty(4)).toBe("PRO");
    expect(scoreToDifficulty(3)).toBe("BEGINNER");
  });
});

describe("seed data", () => {
  const seed = SEED_COMPANIES[0];

  it("Accenture is a Dream company", () => {
    expect(normalizeCompanySummary(seed.short_json, seed.company_id).companyType).toBe("Dream");
  });

  it("has 12 skills sorted by score, each with a 10-level roadmap", () => {
    const skills = normalizeDashboardSkills(seed.skill_levels);
    expect(skills).toHaveLength(12);
    expect(skills[0].name).toBe("Data Structures & Algorithms");
    for (const s of skills) expect(SKILL_TOPICS[s.id]).toHaveLength(10);
  });

  it("builds exactly 22 intelligence sections", () => {
    const profile = normalizeCompanyProfile(seed.full_json, seed.short_json, seed.company_id);
    const sections = buildIntelligenceSections(profile);
    expect(sections).toHaveLength(22);
    expect(sections[0].title).toBe("Company Identity");
    expect(sections[21].title).toBe("Contact Information");
  });

  it("never exposes CTC, stipend or selection ratio", () => {
    const profile = normalizeCompanyProfile(
      { ...seed.full_json, ctc: "12 LPA", stipend: "50k", selection_ratio: "1:20" },
      seed.short_json,
    );
    const keys = buildIntelligenceSections(profile).flatMap((s) => s.fields.map((f) => f.key));
    expect(Object.keys(profile.fields).some((k) => /ctc|stipend|selection/i.test(k))).toBe(false);
    expect(keys.some((k) => /ctc|stipend|selection/i.test(k))).toBe(false);
  });
});
