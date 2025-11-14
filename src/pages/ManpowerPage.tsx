import React, { useEffect, useState } from "react";
import {
  ManpowerInputs,
  ManpowerScoreResult,
  computeManpowerScore,
} from "../scoring/manpower";

interface ManpowerPageProps {
  onScoreChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const defaultInputs: ManpowerInputs = {
  l1Bands: [0, 0, 0, 0],
  l2Bands: [0, 0, 0],
  l3Bands: [0, 0, 0, 0],
};

const ManpowerPage: React.FC<ManpowerPageProps> = ({
  onScoreChange,
  onNext,
  onBack,
}) => {
  const [inputs, setInputs] = useState<ManpowerInputs>(defaultInputs);
  const [result, setResult] = useState<ManpowerScoreResult>(
    computeManpowerScore(defaultInputs)
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const r = computeManpowerScore(inputs);
    setResult(r);
    onScoreChange(r.total);
  }, [inputs, onScoreChange]);

  const updateBand = (
    level: "l1Bands" | "l2Bands" | "l3Bands",
    index: number,
    value: string
  ) => {
    const num = Number(value);
    setInputs((prev) => {
      const arr = [...prev[level]];
      arr[index] = isNaN(num) || num < 0 ? 0 : num;
      return { ...prev, [level]: arr } as ManpowerInputs;
    });
  };

  const validateAndNext = () => {
    const totalL1 = inputs.l1Bands.reduce((a, b) => a + b, 0);
    const totalL2 = inputs.l2Bands.reduce((a, b) => a + b, 0);
    const totalL3 = inputs.l3Bands.reduce((a, b) => a + b, 0);
    if (totalL1 + totalL2 + totalL3 === 0) {
      setError("Please enter at least one SOC personnel count across L1, L2 or L3.");
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div>
      <div className="section-card">
        <div className="section-title">Competency of SOC Personnel (P)</div>
        <div className="section-help">
          Provide the count of SOC staff in each experience band and level. This approximates
          the weighted competency score based on experience and certification.
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q1.</span> L1 analysts with relevant certification (e.g. CEH) by{" "}
            <strong>years of SOC experience</strong>:
          </div>
          <div className="section-help">
            Enter how many L1 staff fall into each band.
          </div>
          <div className="field-group">
            &bull; 2–3 years:{" "}
            <input
              className="field-input"
              type="number"
              min={0}
              value={inputs.l1Bands[0]}
              onChange={(e) => updateBand("l1Bands", 0, e.target.value)}
            />
          </div>
          <div className="field-group">
            &bull; 3–4 years:{" "}
            <input
              className="field-input"
              type="number"
              min={0}
              value={inputs.l1Bands[1]}
              onChange={(e) => updateBand("l1Bands", 1, e.target.value)}
            />
          </div>
          <div className="field-group">
            &bull; 4–5 years:{" "}
            <input
              className="field-input"
              type="number"
              min={0}
              value={inputs.l1Bands[2]}
              onChange={(e) => updateBand("l1Bands", 2, e.target.value)}
            />
          </div>
          <div className="field-group">
            &bull; 5+ years:{" "}
            <input
              className="field-input"
              type="number"
              min={0}
              value={inputs.l1Bands[3]}
              onChange={(e) => updateBand("l1Bands", 3, e.target.value)}
            />
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q2.</span> L2 engineers with relevant certification (CEH + OEM) by{" "}
            <strong>years of SOC experience</strong>:
          </div>
          <div className="field-group">
            &bull; 6–7 years:{" "}
            <input
              className="field-input"
              type="number"
              min={0}
              value={inputs.l2Bands[0]}
              onChange={(e) => updateBand("l2Bands", 0, e.target.value)}
            />
          </div>
          <div className="field-group">
            &bull; 7–8 years:{" "}
            <input
              className="field-input"
              type="number"
              min={0}
              value={inputs.l2Bands[1]}
              onChange={(e) => updateBand("l2Bands", 1, e.target.value)}
            />
          </div>
          <div className="field-group">
            &bull; 8+ years:{" "}
            <input
              className="field-input"
              type="number"
              min={0}
              value={inputs.l2Bands[2]}
              onChange={(e) => updateBand("l2Bands", 2, e.target.value)}
            />
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q3.</span> L3 / SOC leads with certification (e.g. CEH + CISM) by{" "}
            <strong>years of SOC / cyber experience</strong>:
          </div>
          <div className="field-group">
            &bull; 9–10 years:{" "}
            <input
              className="field-input"
              type="number"
              min={0}
              value={inputs.l3Bands[0]}
              onChange={(e) => updateBand("l3Bands", 0, e.target.value)}
            />
          </div>
          <div className="field-group">
            &bull; 10–11 years:{" "}
            <input
              className="field-input"
              type="number"
              min={0}
              value={inputs.l3Bands[1]}
              onChange={(e) => updateBand("l3Bands", 1, e.target.value)}
            />
          </div>
          <div className="field-group">
            &bull; 11–12 years:{" "}
            <input
              className="field-input"
              type="number"
              min={0}
              value={inputs.l3Bands[2]}
              onChange={(e) => updateBand("l3Bands", 2, e.target.value)}
            />
          </div>
          <div className="field-group">
            &bull; 12+ years:{" "}
            <input
              className="field-input"
              type="number"
              min={0}
              value={inputs.l3Bands[3]}
              onChange={(e) => updateBand("l3Bands", 3, e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="section-card">
          <div className="section-title">Please check your inputs</div>
          <div className="field-error">{error}</div>
        </div>
      )}

      <div className="section-card">
        <div className="section-title">Manpower score (P)</div>
        <div className="score-badge">
          <div className="score-dot mid" />
          <span>P = {result.total.toFixed(2)} / 100</span>
        </div>
        <div className="insight-text" style={{ marginTop: 6 }}>
          Higher scores reflect a higher proportion of experienced and certified
          SOC staff across L1, L2 and L3. Low values suggest junior or thinly
          staffed teams.
        </div>
      </div>

      <div className="app-footer no-print">
        <button className="button" onClick={onBack}>
          ← Back to operations
        </button>
        <button className="button primary" onClick={validateAndNext}>
          Next: Governance (H)
        </button>
      </div>
    </div>
  );
};

export default ManpowerPage;
