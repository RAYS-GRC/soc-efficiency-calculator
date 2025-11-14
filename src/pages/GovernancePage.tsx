import React, { useEffect, useState } from "react";
import {
  GovernanceInputs,
  GovernanceScoreResult,
  computeGovernanceScore,
} from "../scoring/governance";

interface GovernancePageProps {
  onScoreChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const defaultInputs: GovernanceInputs = {
  totalCyberBudget: 0,
  socBudget: 0,
  trainingBudgetUsedPercent: 0,
  socReviewedByItCommittee: false,
  techRecommendationsToBoard: false,
};

const GovernancePage: React.FC<GovernancePageProps> = ({
  onScoreChange,
  onNext,
  onBack,
}) => {
  const [inputs, setInputs] = useState<GovernanceInputs>(defaultInputs);
  const [result, setResult] = useState<GovernanceScoreResult>(
    computeGovernanceScore(defaultInputs)
  );

  useEffect(() => {
    const r = computeGovernanceScore(inputs);
    setResult(r);
    onScoreChange(r.normalised);
  }, [inputs, onScoreChange]);

  const updateNumber = (field: keyof GovernanceInputs, value: string) => {
    const num = Number(value);
    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(num) || num < 0 ? 0 : num,
    }));
  };

  const updateBoolean = (field: keyof GovernanceInputs, value: boolean) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateAndNext = () => {
    onNext();
  };

  const band =
    result.normalised < 40 ? "low" : result.normalised < 70 ? "mid" : "high";

  const bandText =
    band === "low"
      ? "Governance is weak: budget allocation, training utilisation or Board-level visibility of SOC may be insufficient."
      : band === "mid"
      ? "Governance is partially effective: key committees are involved but may not consistently track SOC outcomes and investments."
      : "Governance is strong: SOC seems well-funded, reviewed by IT/Board forums, and supported with training.";

  return (
    <div>
      <div className="section-card">
        <div className="section-title">SOC Governance (H)</div>
        <div className="section-help">
          Answer a few questions on budget allocation, training utilisation and
          Board / IT committee oversight of the SOC.
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q1.</span> What is the <strong>total cyber security budget</strong> for the
            period? (₹ or any single currency)
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.totalCyberBudget}
            onChange={(e) => updateNumber("totalCyberBudget", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q2.</span> Out of this, what portion is the{" "}
            <strong>dedicated SOC budget</strong>?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.socBudget}
            onChange={(e) => updateNumber("socBudget", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q3.</span> What percentage of the{" "}
            <strong>allocated SOC training budget</strong> was actually used?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            max={100}
            value={inputs.trainingBudgetUsedPercent}
            onChange={(e) =>
              updateNumber("trainingBudgetUsedPercent", e.target.value)
            }
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q4.</span> Is the <strong>SOC periodically reviewed</strong> by an{" "}
            <strong>IT / Information Security committee</strong>?
          </div>
          <div className="toggle-row">
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.socReviewedByItCommittee ? "active" : "")
              }
              onClick={() =>
                updateBoolean("socReviewedByItCommittee", true)
              }
            >
              Yes
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (!inputs.socReviewedByItCommittee ? "active" : "")
              }
              onClick={() =>
                updateBoolean("socReviewedByItCommittee", false)
              }
            >
              No
            </button>
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q5.</span> Are <strong>technology-related SOC recommendations</strong> (e.g.
            key investments, major changes) formally{" "}
            <strong>placed before the Board</strong>?
          </div>
          <div className="toggle-row">
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.techRecommendationsToBoard ? "active" : "")
              }
              onClick={() =>
                updateBoolean("techRecommendationsToBoard", true)
              }
            >
              Yes
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (!inputs.techRecommendationsToBoard ? "active" : "")
              }
              onClick={() =>
                updateBoolean("techRecommendationsToBoard", false)
              }
            >
              No
            </button>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-title">Governance score (H)</div>
        <div className="score-badge">
          <div className={`score-dot ${band}`} />
          <span>H = {result.normalised.toFixed(2)} / 100</span>
        </div>
        <div className="insight-text" style={{ marginTop: 6 }}>
          {bandText}
        </div>
      </div>

      <div className="app-footer no-print">
        <button className="button" onClick={onBack}>
          ← Back to manpower
        </button>
        <button className="button primary" onClick={validateAndNext}>
          Next: Enrichment (E)
        </button>
      </div>
    </div>
  );
};

export default GovernancePage;
