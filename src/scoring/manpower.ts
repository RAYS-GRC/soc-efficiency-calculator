export interface ManpowerInputs {
  l1Bands: [number, number, number, number];
  l2Bands: [number, number, number];
  l3Bands: [number, number, number, number];
}

export interface LevelScore {
  level: "L1" | "L2" | "L3";
  averageWeight: number;
  weightedScore: number;
}

export interface ManpowerScoreResult {
  total: number;
  levels: LevelScore[];
}

function computeLevelScore(
  counts: number[],
  bandWeights: number[],
  categoryWeight: number
): { avg: number; weighted: number } {
  let sumX = 0;
  let sumZW = 0;

  counts.forEach((x, idx) => {
    const safeX = x > 0 ? x : 0;
    sumX += safeX;
    sumZW += safeX * (bandWeights[idx] || 0);
  });

  const avg = sumX > 0 ? sumZW / sumX : 0;
  const weighted = avg * categoryWeight;
  return { avg, weighted };
}

export function computeManpowerScore(inputs: ManpowerInputs): ManpowerScoreResult {
  const L1_WEIGHTS = [0.25, 0.5, 0.75, 1.0];
  const L2_WEIGHTS = [0.33, 0.66, 1.0];
  const L3_WEIGHTS = [0.25, 0.5, 0.75, 1.0];

  const l1calc = computeLevelScore(inputs.l1Bands, L1_WEIGHTS, 35);
  const l2calc = computeLevelScore(inputs.l2Bands, L2_WEIGHTS, 25);
  const l3calc = computeLevelScore(inputs.l3Bands, L3_WEIGHTS, 40);

  const l1: LevelScore = {
    level: "L1",
    averageWeight: l1calc.avg,
    weightedScore: l1calc.weighted,
  };
  const l2: LevelScore = {
    level: "L2",
    averageWeight: l2calc.avg,
    weightedScore: l2calc.weighted,
  };
  const l3: LevelScore = {
    level: "L3",
    averageWeight: l3calc.avg,
    weightedScore: l3calc.weighted,
  };

  const total = l1.weightedScore + l2.weightedScore + l3.weightedScore;

  return {
    total,
    levels: [l1, l2, l3],
  };
}
