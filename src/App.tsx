import React, { useState } from "react";
import { DomainKey, OrgInfo, DomainScoreState } from "./types";
import OrgInfoPage from "./pages/OrgInfoPage";
import CoveragePage from "./pages/CoveragePage";
import OperationsPage from "./pages/OperationsPage";
import ManpowerPage from "./pages/ManpowerPage";
import GovernancePage from "./pages/GovernancePage";
import EnrichmentPage from "./pages/EnrichmentPage";
import SummaryPage from "./pages/SummaryPage";

const domainWeights: Record<DomainKey, number> = {
  coverage: 25,
  operations: 25,
  manpower: 20,
  governance: 15,
  enrichment: 15,
};

function computeFinalScore(scores: DomainScoreState): number {
  return (
    (scores.coverage * domainWeights.coverage) / 100 +
    (scores.operations * domainWeights.operations) / 100 +
    (scores.manpower * domainWeights.manpower) / 100 +
    (scores.governance * domainWeights.governance) / 100 +
    (scores.enrichment * domainWeights.enrichment) / 100
  );
}

const App: React.FC = () => {
  const [step, setStep] = useState<number>(0);

  const [orgInfo, setOrgInfo] = useState<OrgInfo>({
    name: "",
    entityType: "",
    entityCategory: "",
    period: "",
  });

  const [scores, setScores] = useState<DomainScoreState>({
    coverage: 0,
    operations: 0,
    manpower: 0,
    governance: 0,
    enrichment: 0,
  });

  const updateScore = (key: DomainKey, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const finalScore = computeFinalScore(scores);

  const steps = [
    { id: 0, label: "Organisation", short: "ORG" },
    { id: 1, label: "Coverage (C)", short: "C" },
    { id: 2, label: "Operations (Y)", short: "Y" },
    { id: 3, label: "Manpower (P)", short: "P" },
    { id: 4, label: "Governance (H)", short: "H" },
    { id: 5, label: "Enrichment (E)", short: "E" },
    { id: 6, label: "Summary & Report", short: "\u03a3" },
  ];

  const maxStep = steps.length - 1;

  const goNext = () => setStep((s) => Math.min(maxStep, s + 1));
  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="app-root">
      <div className="app-shell">
        <div className="app-header">
          <div>
            <div className="app-title">SOC Efficacy Calculator</div>
            <div className="app-subtitle">
              Built on SEBI CSCRF Annexure-N, this open-source tool by Rajesh supports the GRC community. All calculations run locally, with no data sent or stored.
            </div>
          </div>
          <div className="score-badge no-print">
            <div
              className={`score-dot ${
                finalScore < 40 ? "low" : finalScore < 70 ? "mid" : "high"
              }`}
            />
            <span>Final score: {finalScore.toFixed(1)}/100</span>
          </div>
        </div>

        <div className="step-indicator no-print">
          <div className="step-badges">
            {steps.map((st) => (
              <button
                key={st.id}
                className={
                  "step-badge " +
                  (st.id === step
                    ? "active"
                    : st.id < step
                    ? "done"
                    : "")
                }
                onClick={() => setStep(st.id)}
                type="button"
              >
                {st.short}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>
            Step {step + 1} of {steps.length}: {steps[step].label}
          </div>
        </div>

        <div className="step-content">
          {step === 0 && (
            <OrgInfoPage
              orgInfo={orgInfo}
              setOrgInfo={setOrgInfo}
              onNext={goNext}
            />
          )}
          {step === 1 && (
            <CoveragePage
              onScoreChange={(value) => updateScore("coverage", value)}
              onNext={goNext}
              onBack={goPrev}
            />
          )}
          {step === 2 && (
            <OperationsPage
              onScoreChange={(value) => updateScore("operations", value)}
              onNext={goNext}
              onBack={goPrev}
            />
          )}
          {step === 3 && (
            <ManpowerPage
              onScoreChange={(value) => updateScore("manpower", value)}
              onNext={goNext}
              onBack={goPrev}
            />
          )}
          {step === 4 && (
            <GovernancePage
              onScoreChange={(value) => updateScore("governance", value)}
              onNext={goNext}
              onBack={goPrev}
            />
          )}
          {step === 5 && (
            <EnrichmentPage
              onScoreChange={(value) => updateScore("enrichment", value)}
              onNext={goNext}
              onBack={goPrev}
            />
          )}
          {step === 6 && (
            <SummaryPage
              orgInfo={orgInfo}
              scores={scores}
              finalScore={finalScore}
              weights={domainWeights}
              onBack={goPrev}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
