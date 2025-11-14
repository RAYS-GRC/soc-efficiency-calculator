export type SystemTypeId = "S1" | "S2" | "S3" | "S4" | "S5" | "S6";

export interface AssetDistribution {
  S1: number;
  S2: number;
  S3: number;
  S4: number;
  S5: number;
  S6: number;
}

export interface SocTechnologyConfig {
  id: string;
  name: string;
  weight: number;
  applicableSystems: SystemTypeId[];
}

export interface TechIntegrationInput {
  [techId: string]: number;
}

export const SOC_TECH_CONFIG: SocTechnologyConfig[] = [
  {
    id: "pam",
    name: "PAM",
    weight: 10,
    applicableSystems: ["S1", "S2", "S4", "S5", "S6"],
  },
  {
    id: "av_epp",
    name: "Anti-virus / EPP",
    weight: 10,
    applicableSystems: ["S3", "S6"],
  },
  {
    id: "edr",
    name: "EDR",
    weight: 10,
    applicableSystems: ["S3", "S6"],
  },
  {
    id: "dlp",
    name: "DLP",
    weight: 10,
    applicableSystems: [],
  },
  {
    id: "dam",
    name: "DAM",
    weight: 10,
    applicableSystems: ["S5"],
  },
  {
    id: "waf",
    name: "WAF",
    weight: 10,
    applicableSystems: ["S4"],
  },
  {
    id: "email_gw",
    name: "Email Gateway",
    weight: 10,
    applicableSystems: [],
  },
  {
    id: "web_gw",
    name: "Web Gateway / Proxy",
    weight: 10,
    applicableSystems: [],
  },
  {
    id: "ddos",
    name: "DDoS Protection",
    weight: 10,
    applicableSystems: [],
  },
  {
    id: "siem",
    name: "SIEM",
    weight: 10,
    applicableSystems: ["S1", "S2", "S4", "S5", "S6"],
  },
];

export interface CoverageInputs {
  assets: AssetDistribution;
  integrations: TechIntegrationInput;
}

export function computeCoverageScore(inputs: CoverageInputs): number {
  const { assets, integrations } = inputs;
  let totalWeighted = 0;

  for (const tech of SOC_TECH_CONFIG) {
    const x = tech.applicableSystems.reduce(
      (sum, sid) => sum + (assets[sid] || 0),
      0
    );
    if (x === 0) continue;
    const y = integrations[tech.id] ?? 0;
    const Z = Math.min(y / x, 1);
    const weightedScore = Z * tech.weight;
    totalWeighted += weightedScore;
  }

  return totalWeighted;
}
