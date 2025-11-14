export interface EnrichmentInputs {
  usingNativeDashboard: boolean;
  usingCustomDashboard: boolean;

  threatHuntingBySpecializedProvider: boolean;
  threatHuntingByInternalTeam: boolean;
  threatHuntingQuarterly: boolean;
  threatHuntingHalfYearly: boolean;
  totalHypotheses: number;
  hypothesesFromVulns: number;
  hypothesesFromIoCs: number;
  hypothesesFromIoAs: number;

  threatIntelIntegratedWithSiem: boolean;
  soarActionsTriggered: number;
  totalSoarActionsDefined: number;

  hasDecoy: boolean;
  hasSandbox: boolean;
  hasUeba: boolean;
  hasVulnMgmt: boolean;
  hasEncryptedTrafficMgmt: boolean;
  hasDnsSecurity: boolean;
  hasIps: boolean;
  hasDataClassification: boolean;
}

export interface EnrichmentScoreResult {
  raw: number;
  normalised: number;
  components: {
    dashboardScore: number;
    threatHuntingScore: number;
    automationScore: number;
    technologiesScore: number;
  };
}

function safeRatio(n: number, d: number): number {
  if (d <= 0 || n <= 0) return 0;
  return Math.max(0, n / d);
}

export function computeEnrichmentScore(
  inputs: EnrichmentInputs
): EnrichmentScoreResult {
  const {
    usingNativeDashboard,
    usingCustomDashboard,
    threatHuntingBySpecializedProvider,
    threatHuntingByInternalTeam,
    threatHuntingQuarterly,
    threatHuntingHalfYearly,
    totalHypotheses,
    hypothesesFromVulns,
    hypothesesFromIoCs,
    hypothesesFromIoAs,
    threatIntelIntegratedWithSiem,
    soarActionsTriggered,
    totalSoarActionsDefined,
    hasDecoy,
    hasSandbox,
    hasUeba,
    hasVulnMgmt,
    hasEncryptedTrafficMgmt,
    hasDnsSecurity,
    hasIps,
    hasDataClassification,
  } = inputs;

  let dashboardScore = 0;
  if (usingNativeDashboard) dashboardScore += 5;
  if (usingCustomDashboard) dashboardScore += 5;

  let threatHuntingScore = 0;
  if (threatHuntingBySpecializedProvider) threatHuntingScore += 5;
  if (threatHuntingByInternalTeam) threatHuntingScore += 3;
  if (threatHuntingQuarterly) threatHuntingScore += 5;
  if (threatHuntingHalfYearly) threatHuntingScore += 3;

  if (totalHypotheses > 0) {
    const T = totalHypotheses;
    threatHuntingScore += safeRatio(hypothesesFromVulns, T) * 5;
    threatHuntingScore += safeRatio(hypothesesFromIoCs, T) * 5;
    threatHuntingScore += safeRatio(hypothesesFromIoAs, T) * 5;
  }

  let automationScore = 0;
  if (threatIntelIntegratedWithSiem) automationScore += 5;
  automationScore += safeRatio(
    soarActionsTriggered,
    totalSoarActionsDefined
  ) * 5;

  const techFlags = [
    hasDecoy,
    hasSandbox,
    hasUeba,
    hasVulnMgmt,
    hasEncryptedTrafficMgmt,
    hasDnsSecurity,
    hasIps,
    hasDataClassification,
  ];
  const technologiesScore = techFlags.reduce(
    (sum, flag) => sum + (flag ? 3 : 0),
    0
  );

  const raw =
    dashboardScore + threatHuntingScore + automationScore + technologiesScore;
  const maxRaw = 75;
  const normalised = (raw / maxRaw) * 100;

  return {
    raw,
    normalised,
    components: {
      dashboardScore,
      threatHuntingScore,
      automationScore,
      technologiesScore,
    },
  };
}
