export interface GovernanceInputs {
  totalCyberBudget: number;
  socBudget: number;
  trainingBudgetUsedPercent: number;
  socReviewedByItCommittee: boolean;
  techRecommendationsToBoard: boolean;
}

export interface GovernanceScoreResult {
  raw: number;
  normalised: number;
  components: {
    budgetScore: number;
    trainingScore: number;
    reviewScore: number;
    recommendationScore: number;
  };
}

export function computeGovernanceScore(inputs: GovernanceInputs): GovernanceScoreResult {
  const {
    totalCyberBudget,
    socBudget,
    trainingBudgetUsedPercent,
    socReviewedByItCommittee,
    techRecommendationsToBoard,
  } = inputs;

  let budgetScore = 0;
  if (totalCyberBudget > 0 && socBudget > 0) {
    budgetScore = (2 * socBudget * 45) / totalCyberBudget;
    if (budgetScore > 45) budgetScore = 45;
    if (budgetScore < 0) budgetScore = 0;
  }

  let trainingScore = 0;
  if (trainingBudgetUsedPercent > 0) {
    const pct = Math.min(trainingBudgetUsedPercent, 100);
    trainingScore = (pct / 100) * 10;
  }

  const reviewScore = (socReviewedByItCommittee ? 1 : 0) * 5;
  const recommendationScore = (techRecommendationsToBoard ? 1 : 0) * 5;

  const raw = budgetScore + trainingScore + reviewScore + recommendationScore;
  const maxRaw = 65;
  const normalised = (raw / maxRaw) * 100;

  return {
    raw,
    normalised,
    components: {
      budgetScore,
      trainingScore,
      reviewScore,
      recommendationScore,
    },
  };
}
