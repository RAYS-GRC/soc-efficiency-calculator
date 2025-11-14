import React from "react";
import { DomainKey, DomainScoreState, OrgInfo } from "../types";

interface SummaryProps {
  orgInfo: OrgInfo;
  scores: DomainScoreState;
  finalScore: number;
  weights: Record<DomainKey, number>;
  onBack: () => void;
}

function band(score: number): "low" | "mid" | "high" {
  if (score < 40) return "low";
  if (score < 70) return "mid";
  return "high";
}

function bandLabel(score: number): string {
  const b = band(score);
  if (b === "low") return "Low";
  if (b === "mid") return "Moderate";
  return "Strong";
}

function domainInsight(key: DomainKey, score: number): string {
  const b = band(score);

  if (key === "coverage") {
    if (b === "low")
      return "Coverage is low: SOC has significant blind spots across asset categories. Consider prioritising SIEM onboarding and security control integration for critical servers, databases and perimeter devices.";
    if (b === "mid")
      return "Coverage is moderate: key assets are connected, but important classes (like endpoints or applications) may still be under-monitored.";
    return "Coverage is strong: most critical assets are onboarded. Focus now on depth of detections and quality of alerts, rather than raw telemetry.";
  }

  if (key === "operations") {
    if (b === "low")
      return "Operational maturity is low: ingestion, latency, use-case execution or incident handling is likely inconsistent. There is a high risk of missing or late detections.";
    if (b === "mid")
      return "Operations are in a working but improvable state: the SOC can detect and respond, but delays, false positives/negatives or gaps in use-cases still exist.";
    return "Operational maturity is strong: SOC appears to have well-tuned log flows, playbooks and alert handling. Next focus can be proactive hunting and automation.";
  }

  if (key === "manpower") {
    if (b === "low")
      return "Manpower competency is low: there may be too few certified or experienced engineers at L1/L2/L3, impacting 24x7 coverage and complex investigations.";
    if (b === "mid")
      return "Manpower capability is moderate: basic operations can be handled, but deeper investigations and specialised skills may bottleneck during major incidents.";
    return "Manpower competency is strong: experience and certifications across levels look healthy. You can invest in specialisation (forensics, threat hunting) and retention.";
  }

  if (key === "governance") {
    if (b === "low")
      return "Governance is weak: budget allocation, training utilisation or Board-level visibility of SOC may be insufficient. This can slow any improvement program.";
    if (b === "mid")
      return "Governance is partially effective: key committees are involved but may not consistently track SOC outcomes and investments.";
    return "Governance is strong: SOC seems well-funded, reviewed by IT/Board forums, and supported with training. This helps sustain SOC maturity over time.";
  }

  if (b === "low")
    return "Enrichment & enhancements are minimal: dashboards, threat hunting, automation or advanced technologies are likely at a basic level, limiting depth of detection.";
  if (b === "mid")
    return "Enrichment is emerging: some hunting, automation or advanced analytics exist, but they are not yet systematic or comprehensive.";
  return "Enrichment is strong: you use threat hunting, automation and advanced technologies to go beyond compliance and catch sophisticated attacks.";
}

const SummaryPage: React.FC<SummaryProps> = ({
  orgInfo,
  scores,
  finalScore,
  weights,
  onBack,
}) => {
  const domains: { key: DomainKey; label: string; short: string }[] = [
    { key: "coverage", label: "Coverage of assets vs SOC technologies", short: "C" },
    { key: "operations", label: "SOC Operations", short: "Y" },
    { key: "manpower", label: "Competency of SOC Personnel", short: "P" },
    { key: "governance", label: "SOC Governance", short: "H" },
    { key: "enrichment", label: "SOC Enrichments & Enhancements", short: "E" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="section-card">
        <div className="section-title">Summary & insights</div>
        <div className="section-help">
          Domain-wise scores, weighted contribution and maturity insights. Use this as an
          executive view of SOC efficacy.
        </div>

        <div style={{ marginTop: 8, fontSize: 13 }}>
          <div style={{ marginBottom: 4 }}>
            <strong>Final SOC efficacy score:</strong>{" "}
            <span>{finalScore.toFixed(2)} / 100</span>
          </div>
          <div className="insight-text">
            Below 40: basic / fragile · 40–70: developing · Above 70: mature / robust.
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-title">Domain-wise maturity insights</div>
        {domains.map((d) => {
          const raw = scores[d.key];
          const weight = weights[d.key];
          const contrib = (raw * weight) / 100;
          const b = band(raw);
          return (
            <div
              key={d.key}
              style={{
                padding: "6px 0",
                borderTop: "1px solid rgba(45,27,74,0.7)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>
                  {d.label} ({d.short})
                </div>
                <div className="score-badge">
                  <div className={`score-dot ${b}`} />
                  <span>
                    {bandLabel(raw)} · {raw.toFixed(1)}/100 · Weighted:{" "}
                    {contrib.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="insight-text" style={{ marginTop: 3 }}>
                {domainInsight(d.key, raw)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-card">
        <div className="section-title">
          Printable SOC Efficacy Report (Annexure-style)
        </div>
        <div className="section-help">
          Use your browser’s Print → “Save as PDF” to export this section as a report for
          internal records or submission.
        </div>

        <div style={{ fontSize: 12, marginTop: 6 }}>
          <p>
            <strong>NAME OF THE ORGANISATION:</strong>{" "}
            {orgInfo.name || "____________________________"}
          </p>
          <p>
            <strong>ENTITY TYPE:</strong>{" "}
            {orgInfo.entityType || "____________________________"}
          </p>
          <p>
            <strong>ENTITY CATEGORY:</strong>{" "}
            {orgInfo.entityCategory || "____________________________"}
          </p>
          <p>
            <strong>PERIOD:</strong>{" "}
            {orgInfo.period || "____________________________"}
          </p>
        </div>

        <div style={{ fontSize: 11, marginTop: 6 }}>
          <p>
            I / We hereby confirm that the report of functional efficacy of SOC has been
            verified by me / us and I / We take the responsibility and ownership of this
            report.
          </p>
          <p>Signature: ____________________________</p>
          <p>Name of signatory: ____________________________</p>
          <p>
            Designation (MD / CEO / Board member / Partner / Proprietor):{" "}
            ____________________________
          </p>
          <p>Company stamp:</p>
        </div>

        <table className="report-table">
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Domain</th>
              <th>Weight % [A]</th>
              <th>Domain score [B]</th>
              <th>Normalised [S = (B×A)/100]</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d, idx) => {
              const B = scores[d.key];
              const A = weights[d.key];
              const S = (B * A) / 100;
              return (
                <tr key={d.key}>
                  <td>{idx + 1}</td>
                  <td>
                    {d.label} ({d.short})
                  </td>
                  <td style={{ textAlign: "center" }}>{A}</td>
                  <td style={{ textAlign: "center" }}>{B.toFixed(1)}</td>
                  <td style={{ textAlign: "center" }}>{S.toFixed(1)}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={4} style={{ textAlign: "right", fontWeight: 600 }}>
                FINAL SCORE (ΣS)
              </td>
              <td style={{ textAlign: "center", fontWeight: 600 }}>
                {finalScore.toFixed(1)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="app-footer no-print">
        <button className="button" onClick={onBack}>
          ← Back to enrichment
        </button>
        <button className="button primary" onClick={handlePrint}>
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default SummaryPage;
