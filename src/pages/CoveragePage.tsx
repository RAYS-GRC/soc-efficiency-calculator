import React, { useEffect, useState } from "react";
import {
  AssetDistribution,
  CoverageInputs,
  SOC_TECH_CONFIG,
  TechIntegrationInput,
  computeCoverageScore,
} from "../scoring/coverage";

interface CoveragePageProps {
  onScoreChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const defaultAssets: AssetDistribution = {
  S1: 0,
  S2: 0,
  S3: 0,
  S4: 0,
  S5: 0,
  S6: 0,
};

const CoveragePage: React.FC<CoveragePageProps> = ({
  onScoreChange,
  onNext,
  onBack,
}) => {
  const [assets, setAssets] = useState<AssetDistribution>(defaultAssets);
  const [integrations, setIntegrations] = useState<TechIntegrationInput>({});
  const [errors, setErrors] = useState<string[]>([]);

  const coverageScore = computeCoverageScore({
    assets,
    integrations,
  } as CoverageInputs);

  useEffect(() => {
    onScoreChange(coverageScore);
  }, [coverageScore, onScoreChange]);

  const updateAsset = (key: keyof AssetDistribution, value: string) => {
    const num = Number(value);
    setAssets((prev) => ({
      ...prev,
      [key]: isNaN(num) || num < 0 ? 0 : num,
    }));
  };

  const updateIntegration = (techId: string, value: string) => {
    const num = Number(value);
    setIntegrations((prev) => ({
      ...prev,
      [techId]: isNaN(num) || num < 0 ? 0 : num,
    }));
  };

  const validateAndNext = () => {
    const newErrors: string[] = [];

    const totalAssets =
      assets.S1 + assets.S2 + assets.S3 + assets.S4 + assets.S5 + assets.S6;
    if (totalAssets === 0) {
      newErrors.push(
        "Please provide at least one asset count (S1–S6). Coverage cannot be computed with 0 assets."
      );
    }

    SOC_TECH_CONFIG.forEach((tech) => {
      const x = tech.applicableSystems.reduce(
        (sum, sid) => sum + (assets[sid] || 0),
        0
      );
      const y = integrations[tech.id] ?? 0;
      if (x > 0 && y > x) {
        newErrors.push(
          `For ${tech.name}, integrated systems (y=${y}) should not exceed applicable systems (x=${x}).`
        );
      }
    });

    setErrors(newErrors);
    if (newErrors.length === 0) {
      onNext();
    }
  };

  const scoreBand =
    coverageScore < 40 ? "low" : coverageScore < 70 ? "mid" : "high";

  const bandText =
    scoreBand === "low"
      ? "Low coverage: a large portion of your asset types are either not protected by SOC technologies or not integrated."
      : scoreBand === "mid"
      ? "Moderate coverage: core assets are partly protected, but there is still meaningful surface area outside SOC visibility."
      : "High coverage: most of your critical asset types are protected and integrated into the SOC telemetry fabric.";

  return (
    <div>
      <div className="section-card">
        <div className="section-title">
          Coverage of assets with SOC technologies (C)
        </div>
        <div className="section-help">
          First, tell us about your asset landscape. This corresponds to the asset table in Annexure-N.
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q1.</span> How many <strong>network devices (S1)</strong> are in scope
            for SOC (firewalls, routers, switches, etc.)?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={assets.S1}
            onChange={(e) => updateAsset("S1", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q2.</span> How many <strong>security solutions (S2)</strong> are deployed
            (IDS/IPS, WAF, DLP appliances, etc.)?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={assets.S2}
            onChange={(e) => updateAsset("S2", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q3.</span> How many <strong>endpoints (S3)</strong> are in scope
            (desktops, laptops, VDI, etc.)?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={assets.S3}
            onChange={(e) => updateAsset("S3", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q4.</span> How many <strong>applications (S4)</strong> are in scope
            (internet-facing + critical internal)?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={assets.S4}
            onChange={(e) => updateAsset("S4", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q5.</span> How many <strong>databases (S5)</strong> contain critical /
            regulated data?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={assets.S5}
            onChange={(e) => updateAsset("S5", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q6.</span> How many <strong>servers (S6)</strong> are in scope
            (on-prem + cloud, production + critical infra)?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={assets.S6}
            onChange={(e) => updateAsset("S6", e.target.value)}
          />
        </div>
      </div>

      <div className="section-card">
        <div className="section-title">
          Integration of SOC technologies with your assets
        </div>
        <div className="section-help">
          For each SOC technology, tell us how many applicable systems are actually integrated
          (sending logs / telemetry, monitored by SOC).
        </div>

        {SOC_TECH_CONFIG.map((tech, idx) => {
          const x = tech.applicableSystems.reduce(
            (sum, sid) => sum + (assets[sid] || 0),
            0
          );
          const y = integrations[tech.id] ?? 0;
          const ratio = x > 0 ? Math.min(1, y / x) : 0;
          return (
            <div key={tech.id} className="field-group">
              <div className="field-label">
                <span>{`Q${7 + idx}.`}</span> For{" "}
                <strong>{tech.name}</strong>, how many of the{" "}
                <strong>{x}</strong> applicable systems are{" "}
                <strong>integrated with this technology</strong> and visible to SOC?
              </div>
              <input
                className="field-input"
                type="number"
                min={0}
                value={y}
                onChange={(e) => updateIntegration(tech.id, e.target.value)}
              />
              <div className="insight-text">
                Applicable systems (x): {x} · Integrated (y): {y} · Coverage:{" "}
                {(ratio * 100).toFixed(1)}% · Weight: {tech.weight}%
              </div>
            </div>
          );
        })}
      </div>

      {errors.length > 0 && (
        <div className="section-card">
          <div className="section-title">Please fix these before continuing</div>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: 11, color: "#f97373" }}>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="section-card">
        <div className="section-title">Coverage score (C)</div>
        <div className="score-badge">
          <div className={`score-dot ${scoreBand}`} />
          <span>C = {coverageScore.toFixed(2)} / 100</span>
        </div>
        <div className="insight-text" style={{ marginTop: 6 }}>
          {bandText}
        </div>
      </div>

      <div className="app-footer no-print">
        <button className="button" onClick={onBack}>
          ← Back to organisation
        </button>
        <button className="button primary" onClick={validateAndNext}>
          Next: Operations (Y)
        </button>
      </div>
    </div>
  );
};

export default CoveragePage;
