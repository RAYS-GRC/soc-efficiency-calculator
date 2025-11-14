export interface SocOperationsInputs {
  logSourcesReporting: number;
  totalLogSources: number;

  maxLogLatencyMinutes: number;

  technologiesOnNOrN1: number;
  totalTechnologies: number;

  openAdvisories: number;
  totalAdvisories: number;

  techsWithUseCases: number;
  totalTechsForUseCases: number;

  useCasesNotTriggered: number;
  totalUseCases: number;

  playbooksDefined: number;
  totalUseCasesForPlaybooks: number;

  falsePositives: number;
  totalAlertsForFp: number;

  falseNegatives: number;
  totalAlertsForFn: number;

  meanThreatIntelProcessingMins: number;

  criticalLogsVerifiedDaily: boolean;
  criticalEdrDamVerifiedDaily: boolean;
  criticalUseCasesConfigured: boolean;
  privilegedAccessVerifiedWeekly: boolean;
  backupsTakenPeriodically: boolean;
}

function ratio(n: number, d: number): number {
  if (d <= 0 || n <= 0) return 0;
  return Math.max(0, n / d);
}

export function computeOperationsScore(inputs: SocOperationsInputs): {
  raw: number;
  normalised: number;
} {
  const {
    logSourcesReporting,
    totalLogSources,
    maxLogLatencyMinutes,
    technologiesOnNOrN1,
    totalTechnologies,
    openAdvisories,
    totalAdvisories,
    techsWithUseCases,
    totalTechsForUseCases,
    useCasesNotTriggered,
    totalUseCases,
    playbooksDefined,
    totalUseCasesForPlaybooks,
    falsePositives,
    totalAlertsForFp,
    falseNegatives,
    totalAlertsForFn,
    meanThreatIntelProcessingMins,
    criticalLogsVerifiedDaily,
    criticalEdrDamVerifiedDaily,
    criticalUseCasesConfigured,
    privilegedAccessVerifiedWeekly,
    backupsTakenPeriodically,
  } = inputs;

  let score = 0;

  score += ratio(logSourcesReporting, totalLogSources) * 5;

  if (maxLogLatencyMinutes > 0 && maxLogLatencyMinutes < 5) {
    score += ((5 - maxLogLatencyMinutes) / 5) * 5;
  }

  score += ratio(technologiesOnNOrN1, totalTechnologies) * 5;

  score += ratio(totalAdvisories - openAdvisories, totalAdvisories) * 5;

  score += ratio(techsWithUseCases, totalTechsForUseCases) * 5;

  score += ratio(totalUseCases - useCasesNotTriggered, totalUseCases) * 5;

  score += ratio(playbooksDefined, totalUseCasesForPlaybooks) * 10;

  score += ratio(totalAlertsForFp - falsePositives, totalAlertsForFp) * 10;

  score += ratio(totalAlertsForFn - falseNegatives, totalAlertsForFn) * 10;

  if (meanThreatIntelProcessingMins > 0 && meanThreatIntelProcessingMins < 60) {
    score += ((60 - meanThreatIntelProcessingMins) / 60) * 5;
  }

  const yesCount =
    (criticalLogsVerifiedDaily ? 1 : 0) +
    (criticalEdrDamVerifiedDaily ? 1 : 0) +
    (criticalUseCasesConfigured ? 1 : 0) +
    (privilegedAccessVerifiedWeekly ? 1 : 0) +
    (backupsTakenPeriodically ? 1 : 0);
  score += yesCount * 2;

  const maxRaw = 75;
  const normalised = (score / maxRaw) * 100;

  return { raw: score, normalised };
}
