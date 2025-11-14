import React, { useEffect, useState } from "react";
import {
  EnrichmentInputs,
  EnrichmentScoreResult,
  computeEnrichmentScore,
} from "../scoring/enrichment";

interface EnrichmentPageProps {
  onScoreChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const defaultInputs: EnrichmentInputs = {
  usingNativeDashboard: false,
  usingCustomDashboard: false,
  threatHuntingBySpecializedProvider: false,
  threatHuntingByInternalTeam: false,
  threatHuntingQuarterly: false,
  threatHuntingHalfYearly: false,
  totalHypotheses: 0,
  hypothesesFromVulns: 0,
  hypothesesFromIoCs: 0,
  hypothesesFromIoAs: 0,
  threatIntelIntegratedWithSiem: false,
  soarActionsTriggered: 0,
  totalSoarActionsDefined: 0,
  hasDecoy: false,
  hasSandbox: false,
  hasUeba: false,
  hasVulnMgmt: false,
  hasEncryptedTrafficMgmt: false,
  hasDnsSecurity: false,
  hasIps: false,
  hasDataClassification: false,
};

const EnrichmentPage: React.FC<EnrichmentPageProps> = ({
  onScoreChange,
  onNext,
  onBack,
}) => {
  const [inputs, setInputs] = useState<EnrichmentInputs>(defaultInputs);
  const [result, setResult] = useState<EnrichmentScoreResult>(
    computeEnrichmentScore(defaultInputs)
  );

  useEffect(() => {
    const r = computeEnrichmentScore(inputs);
    setResult(r);
    onScoreChange(r.normalised);
  }, [inputs, onScoreChange]);

  const updateNumber = (field: keyof EnrichmentInputs, value: string) => {
    const num = Number(value);
    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(num) || num < 0 ? 0 : num,
    }));
  };

  const updateBoolean = (field: keyof EnrichmentInputs, value: boolean) => {
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
      ? "Enrichment & enhancements are minimal: dashboards, threat hunting, automation or advanced technologies are likely at a basic level."
      : band === "mid"
      ? "Enrichment is emerging: some hunting, automation or advanced analytics exist, but they are not yet systematic or comprehensive."
      : "Enrichment is strong: you use threat hunting, automation and advanced technologies to go beyond compliance and catch sophisticated attacks.";

  return (
    <div>
      <div className="section-card">
        <div className="section-title">
          SOC Enrichments & Enhancements (E)
        </div>
        <div className="section-help">
          Capture information about dashboards, threat hunting, automation and advanced
          technologies supporting the SOC.
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q1.</span> Do you use <strong>native dashboards</strong> from SOC technologies?
          </div>
          <div className="toggle-row">
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.usingNativeDashboard ? "active" : "")
              }
              onClick={() =>
                updateBoolean("usingNativeDashboard", true)
              }
            >
              Yes
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (!inputs.usingNativeDashboard ? "active" : "")
              }
              onClick={() =>
                updateBoolean("usingNativeDashboard", false)
              }
            >
              No
            </button>
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q2.</span> Have you built any <strong>custom dashboards</strong> for SOC KPIs /
            KRI?
          </div>
          <div className="toggle-row">
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.usingCustomDashboard ? "active" : "")
              }
              onClick={() =>
                updateBoolean("usingCustomDashboard", true)
              }
            >
              Yes
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (!inputs.usingCustomDashboard ? "active" : "")
              }
              onClick={() =>
                updateBoolean("usingCustomDashboard", false)
              }
            >
              No
            </button>
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q3.</span> Who performs <strong>threat hunting</strong>?
          </div>
          <div className="toggle-row">
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.threatHuntingBySpecializedProvider ? "active" : "")
              }
              onClick={() =>
                updateBoolean("threatHuntingBySpecializedProvider", true)
              }
            >
              Specialised provider
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.threatHuntingByInternalTeam ? "active" : "")
              }
              onClick={() =>
                updateBoolean("threatHuntingByInternalTeam", true)
              }
            >
              Internal team
            </button>
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q4.</span> How often is <strong>threat hunting</strong> performed?
          </div>
          <div className="toggle-row">
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.threatHuntingQuarterly ? "active" : "")
              }
              onClick={() =>
                updateBoolean("threatHuntingQuarterly", true)
              }
            >
              Quarterly
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.threatHuntingHalfYearly ? "active" : "")
              }
              onClick={() =>
                updateBoolean("threatHuntingHalfYearly", true)
              }
            >
              Half-yearly
            </button>
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q5.</span> In the last period, how many <strong>total hunting hypotheses</strong>{" "}
            (T) were defined?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.totalHypotheses}
            onChange={(e) => updateNumber("totalHypotheses", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            Of these, how many were based on{" "}
            <strong>open vulnerabilities / misconfigurations</strong>?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.hypothesesFromVulns}
            onChange={(e) =>
              updateNumber("hypothesesFromVulns", e.target.value)
            }
          />
        </div>
        <div className="field-group">
          <div className="field-label">
            How many were based on <strong>Indicators of Compromise (IoCs)</strong>?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.hypothesesFromIoCs}
            onChange={(e) =>
              updateNumber("hypothesesFromIoCs", e.target.value)
            }
          />
        </div>
        <div className="field-group">
          <div className="field-label">
            How many were based on <strong>Indicators of Attack (IoAs)</strong>?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.hypothesesFromIoAs}
            onChange={(e) =>
              updateNumber("hypothesesFromIoAs", e.target.value)
            }
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q6.</span> Is <strong>threat intelligence integrated</strong> with your SIEM?
          </div>
          <div className="toggle-row">
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.threatIntelIntegratedWithSiem ? "active" : "")
              }
              onClick={() =>
                updateBoolean("threatIntelIntegratedWithSiem", true)
              }
            >
              Yes
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (!inputs.threatIntelIntegratedWithSiem ? "active" : "")
              }
              onClick={() =>
                updateBoolean("threatIntelIntegratedWithSiem", false)
              }
            >
              No
            </button>
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q7.</span> How many <strong>SOAR actions</strong> are{" "}
            <strong>configured</strong> (S)?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.totalSoarActionsDefined}
            onChange={(e) =>
              updateNumber("totalSoarActionsDefined", e.target.value)
            }
          />
        </div>
        <div className="field-group">
          <div className="field-label">
            How many SOAR actions were actually <strong>triggered</strong> (T) in the period?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.soarActionsTriggered}
            onChange={(e) =>
              updateNumber("soarActionsTriggered", e.target.value)
            }
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q8.</span> Which <strong>advanced technologies</strong> are implemented?
          </div>
          <div className="section-help">
            Tick all that apply. Each adds to the enrichment score.
          </div>
          <div className="toggle-row">
            <button
              type="button"
              className={"toggle-pill " + (inputs.hasDecoy ? "active" : "")}
              onClick={() => updateBoolean("hasDecoy", !inputs.hasDecoy)}
            >
              Decoy / Deception
            </button>
            <button
              type="button"
              className={"toggle-pill " + (inputs.hasSandbox ? "active" : "")}
              onClick={() => updateBoolean("hasSandbox", !inputs.hasSandbox)}
            >
              Sandboxing
            </button>
            <button
              type="button"
              className={"toggle-pill " + (inputs.hasUeba ? "active" : "")}
              onClick={() => updateBoolean("hasUeba", !inputs.hasUeba)}
            >
              UEBA
            </button>
            <button
              type="button"
              className={"toggle-pill " + (inputs.hasVulnMgmt ? "active" : "")}
              onClick={() => updateBoolean("hasVulnMgmt", !inputs.hasVulnMgmt)}
            >
              Vulnerability Mgmt
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.hasEncryptedTrafficMgmt ? "active" : "")
              }
              onClick={() =>
                updateBoolean(
                  "hasEncryptedTrafficMgmt",
                  !inputs.hasEncryptedTrafficMgmt
                )
              }
            >
              Encrypted Traffic Mgmt
            </button>
            <button
              type="button"
              className={
                "toggle-pill " + (inputs.hasDnsSecurity ? "active" : "")
              }
              onClick={() =>
                updateBoolean("hasDnsSecurity", !inputs.hasDnsSecurity)
              }
            >
              DNS Security
            </button>
            <button
              type="button"
              className={"toggle-pill " + (inputs.hasIps ? "active" : "")}
              onClick={() => updateBoolean("hasIps", !inputs.hasIps)}
            >
              IPS
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.hasDataClassification ? "active" : "")
              }
              onClick={() =>
                updateBoolean(
                  "hasDataClassification",
                  !inputs.hasDataClassification
                )
              }
            >
              Data classification
            </button>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-title">Enrichment score (E)</div>
        <div className="score-badge">
          <div className={`score-dot ${band}`} />
          <span>E = {result.normalised.toFixed(2)} / 100</span>
        </div>
        <div className="insight-text" style={{ marginTop: 6 }}>
          {bandText}
        </div>
      </div>

      <div className="app-footer no-print">
        <button className="button" onClick={onBack}>
          ← Back to governance
        </button>
        <button className="button primary" onClick={validateAndNext}>
          Next: Summary & report
        </button>
      </div>
    </div>
  );
};

export default EnrichmentPage;
