import React, { useEffect, useState } from "react";
import {
  SocOperationsInputs,
  computeOperationsScore,
} from "../scoring/operations";

interface OperationsPageProps {
  onScoreChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const defaultInputs: SocOperationsInputs = {
  logSourcesReporting: 0,
  totalLogSources: 0,
  maxLogLatencyMinutes: 0,
  technologiesOnNOrN1: 0,
  totalTechnologies: 0,
  openAdvisories: 0,
  totalAdvisories: 0,
  techsWithUseCases: 0,
  totalTechsForUseCases: 0,
  useCasesNotTriggered: 0,
  totalUseCases: 0,
  playbooksDefined: 0,
  totalUseCasesForPlaybooks: 0,
  falsePositives: 0,
  totalAlertsForFp: 0,
  falseNegatives: 0,
  totalAlertsForFn: 0,
  meanThreatIntelProcessingMins: 0,
  criticalLogsVerifiedDaily: false,
  criticalEdrDamVerifiedDaily: false,
  criticalUseCasesConfigured: false,
  privilegedAccessVerifiedWeekly: false,
  backupsTakenPeriodically: false,
};

const OperationsPage: React.FC<OperationsPageProps> = ({
  onScoreChange,
  onNext,
  onBack,
}) => {
  const [inputs, setInputs] = useState<SocOperationsInputs>(defaultInputs);
  const [errors, setErrors] = useState<string[]>([]);

  const result = computeOperationsScore(inputs);

  useEffect(() => {
    onScoreChange(result.normalised);
  }, [result.normalised, onScoreChange]);

  const updateNumber = (field: keyof SocOperationsInputs, value: string) => {
    const num = Number(value);
    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(num) || num < 0 ? 0 : num,
    }));
  };

  const updateBoolean = (field: keyof SocOperationsInputs, value: boolean) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateAndNext = () => {
    const errs: string[] = [];

    if (inputs.totalLogSources === 0) {
      errs.push("Please specify the total number of log sources configured for SOC.");
    }
    if (inputs.totalTechnologies === 0) {
      errs.push("Please specify total number of security technologies in scope for operations.");
    }
    if (inputs.totalUseCases === 0) {
      errs.push("Please specify total number of SIEM / detection use-cases.");
    }

    setErrors(errs);
    if (errs.length === 0) onNext();
  };

  const band =
    result.normalised < 40 ? "low" : result.normalised < 70 ? "mid" : "high";

  const bandText =
    band === "low"
      ? "Operational maturity is low: ingestion, latency, use-case execution or incident handling may be inconsistent."
      : band === "mid"
      ? "Operations are moderate: the SOC can detect and respond, but delays, false positives/negatives or gaps still exist."
      : "Operations are strong: SOC appears to have well-tuned log flows, playbooks and alert handling.";

  return (
    <div>
      <div className="section-card">
        <div className="section-title">SOC Operations (Y)</div>
        <div className="section-help">
          Answer the questions below about log ingestion, latency, use-cases, playbooks and
          critical checks. This corresponds to SOC operational efficacy tables.
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q1.</span> How many <strong>log sources are actively reporting</strong> to the SOC?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.logSourcesReporting}
            onChange={(e) => updateNumber("logSourcesReporting", e.target.value)}
          />
        </div>
        <div className="field-group">
          <div className="field-label">
            <span>Q2.</span> How many <strong>log sources are configured in total</strong>?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.totalLogSources}
            onChange={(e) => updateNumber("totalLogSources", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q3.</span> What is the <strong>maximum log latency</strong> observed (in minutes)?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.maxLogLatencyMinutes}
            onChange={(e) => updateNumber("maxLogLatencyMinutes", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q4.</span> Out of all security technologies, how many are on{" "}
            <strong>current or n-1 versions</strong>?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.technologiesOnNOrN1}
            onChange={(e) => updateNumber("technologiesOnNOrN1", e.target.value)}
          />
        </div>
        <div className="field-group">
          <div className="field-label">
            <span>Q5.</span> How many <strong>security technologies</strong> are in scope overall?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.totalTechnologies}
            onChange={(e) => updateNumber("totalTechnologies", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q6.</span> How many <strong>security advisories / vulnerabilities remain open</strong>?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.openAdvisories}
            onChange={(e) => updateNumber("openAdvisories", e.target.value)}
          />
        </div>
        <div className="field-group">
          <div className="field-label">
            <span>Q7.</span> How many <strong>advisories were raised in total</strong> in the period?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.totalAdvisories}
            onChange={(e) => updateNumber("totalAdvisories", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q8.</span> For how many technologies have <strong>use-cases been implemented</strong> in SIEM?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.techsWithUseCases}
            onChange={(e) => updateNumber("techsWithUseCases", e.target.value)}
          />
        </div>
        <div className="field-group">
          <div className="field-label">
            <span>Q9.</span> How many <strong>technologies in total</strong> should ideally have SIEM use-cases?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.totalTechsForUseCases}
            onChange={(e) => updateNumber("totalTechsForUseCases", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q10.</span> How many <strong>use-cases have not triggered at all</strong> in the period?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.useCasesNotTriggered}
            onChange={(e) => updateNumber("useCasesNotTriggered", e.target.value)}
          />
        </div>
        <div className="field-group">
          <div className="field-label">
            <span>Q11.</span> What is the <strong>total number of use-cases</strong> configured?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.totalUseCases}
            onChange={(e) => updateNumber("totalUseCases", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q12.</span> For how many use-cases do you have <strong>documented playbooks</strong>?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.playbooksDefined}
            onChange={(e) => updateNumber("playbooksDefined", e.target.value)}
          />
        </div>
        <div className="field-group">
          <div className="field-label">
            <span>Q13.</span> For how many use-cases in total <strong>should playbooks exist</strong>?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.totalUseCasesForPlaybooks}
            onChange={(e) =>
              updateNumber("totalUseCasesForPlaybooks", e.target.value)
            }
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q14.</span> In the period, how many alerts were identified as{" "}
            <strong>false positives</strong>?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.falsePositives}
            onChange={(e) => updateNumber("falsePositives", e.target.value)}
          />
        </div>
        <div className="field-group">
          <div className="field-label">
            <span>Q15.</span> Total number of alerts reviewed for{" "}
            <strong>false-positive analysis</strong>?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.totalAlertsForFp}
            onChange={(e) => updateNumber("totalAlertsForFp", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q16.</span> In the period, how many alerts were identified as{" "}
            <strong>false negatives</strong> (missed by SOC)?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.falseNegatives}
            onChange={(e) => updateNumber("falseNegatives", e.target.value)}
          />
        </div>
        <div className="field-group">
          <div className="field-label">
            <span>Q17.</span> Total number of alerts reviewed for{" "}
            <strong>false-negative analysis</strong>?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.totalAlertsForFn}
            onChange={(e) => updateNumber("totalAlertsForFn", e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q18.</span> On average, how many minutes does it take to{" "}
            <strong>process incoming threat intelligence</strong> (TLPs, feeds) into
            actionable detections?
          </div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={inputs.meanThreatIntelProcessingMins}
            onChange={(e) =>
              updateNumber("meanThreatIntelProcessingMins", e.target.value)
            }
          />
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q19.</span> Are <strong>critical systems' logs verified daily</strong>?
          </div>
          <div className="toggle-row">
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.criticalLogsVerifiedDaily ? "active" : "")
              }
              onClick={() =>
                updateBoolean("criticalLogsVerifiedDaily", true)
              }
            >
              Yes
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (!inputs.criticalLogsVerifiedDaily ? "active" : "")
              }
              onClick={() =>
                updateBoolean("criticalLogsVerifiedDaily", false)
              }
            >
              No
            </button>
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q20.</span> Are <strong>EDR / DAM / critical controls verified daily</strong>?
          </div>
          <div className="toggle-row">
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.criticalEdrDamVerifiedDaily ? "active" : "")
              }
              onClick={() =>
                updateBoolean("criticalEdrDamVerifiedDaily", true)
              }
            >
              Yes
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (!inputs.criticalEdrDamVerifiedDaily ? "active" : "")
              }
              onClick={() =>
                updateBoolean("criticalEdrDamVerifiedDaily", false)
              }
            >
              No
            </button>
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q21.</span> Are <strong>critical use-cases configured</strong> for key attack
            scenarios (e.g. privilege escalation, data exfiltration)?
          </div>
          <div className="toggle-row">
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.criticalUseCasesConfigured ? "active" : "")
              }
              onClick={() =>
                updateBoolean("criticalUseCasesConfigured", true)
              }
            >
              Yes
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (!inputs.criticalUseCasesConfigured ? "active" : "")
              }
              onClick={() =>
                updateBoolean("criticalUseCasesConfigured", false)
              }
            >
              No
            </button>
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q22.</span> Are <strong>privileged accesses verified weekly</strong> (admin accounts, service accounts)?
          </div>
          <div className="toggle-row">
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.privilegedAccessVerifiedWeekly ? "active" : "")
              }
              onClick={() =>
                updateBoolean("privilegedAccessVerifiedWeekly", true)
              }
            >
              Yes
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (!inputs.privilegedAccessVerifiedWeekly ? "active" : "")
              }
              onClick={() =>
                updateBoolean("privilegedAccessVerifiedWeekly", false)
              }
            >
              No
            </button>
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q23.</span> Are <strong>backups for critical systems taken and tested periodically</strong>?
          </div>
          <div className="toggle-row">
            <button
              type="button"
              className={
                "toggle-pill " +
                (inputs.backupsTakenPeriodically ? "active" : "")
              }
              onClick={() =>
                updateBoolean("backupsTakenPeriodically", true)
              }
            >
              Yes
            </button>
            <button
              type="button"
              className={
                "toggle-pill " +
                (!inputs.backupsTakenPeriodically ? "active" : "")
              }
              onClick={() =>
                updateBoolean("backupsTakenPeriodically", false)
              }
            >
              No
            </button>
          </div>
        </div>
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
        <div className="section-title">Operations score (Y)</div>
        <div className="score-badge">
          <div className={`score-dot ${band}`} />
          <span>Y = {result.normalised.toFixed(2)} / 100</span>
        </div>
        <div className="insight-text" style={{ marginTop: 6 }}>
          {bandText}
        </div>
      </div>

      <div className="app-footer no-print">
        <button className="button" onClick={onBack}>
          ← Back to coverage
        </button>
        <button className="button primary" onClick={validateAndNext}>
          Next: Manpower (P)
        </button>
      </div>
    </div>
  );
};

export default OperationsPage;
