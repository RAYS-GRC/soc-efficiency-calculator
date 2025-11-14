import React, { useState } from "react";
import { OrgInfo } from "../types";

interface OrgInfoPageProps {
  orgInfo: OrgInfo;
  setOrgInfo: (info: OrgInfo) => void;
  onNext: () => void;
}

const OrgInfoPage: React.FC<OrgInfoPageProps> = ({
  orgInfo,
  setOrgInfo,
  onNext,
}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof OrgInfo, string>>>(
    {}
  );

  const updateField = (field: keyof OrgInfo, value: string) => {
    setOrgInfo({ ...orgInfo, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateAndNext = () => {
    const newErrors: Partial<Record<keyof OrgInfo, string>> = {};

    if (!orgInfo.name.trim()) newErrors.name = "Please enter organisation name.";
    if (!orgInfo.entityType.trim())
      newErrors.entityType = "Please specify the entity type.";
    if (!orgInfo.entityCategory.trim())
      newErrors.entityCategory = "Please specify the entity category.";
    if (!orgInfo.period.trim())
      newErrors.period = "Please mention the period of assessment.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div>
      <div className="section-card">
        <div className="section-title">Let’s start with your organisation</div>
        <div className="section-help">
          These details will appear on the printable SOC Efficacy report.
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q1.</span> What is the <strong>name of the organisation</strong>?
          </div>
          <input
            className="field-input"
            placeholder="e.g. RAYS GRC Solutions Pvt Ltd"
            value={orgInfo.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q2.</span> What is the <strong>entity type</strong>?
          </div>
          <input
            className="field-input"
            placeholder="e.g. Stock Broker, AMC, Registrar, etc."
            value={orgInfo.entityType}
            onChange={(e) => updateField("entityType", e.target.value)}
          />
          {errors.entityType && (
            <div className="field-error">{errors.entityType}</div>
          )}
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q3.</span> What is the <strong>entity category</strong>?
          </div>
          <input
            className="field-input"
            placeholder="e.g. Category I, II, III etc."
            value={orgInfo.entityCategory}
            onChange={(e) => updateField("entityCategory", e.target.value)}
          />
          {errors.entityCategory && (
            <div className="field-error">{errors.entityCategory}</div>
          )}
        </div>

        <div className="field-group">
          <div className="field-label">
            <span>Q4.</span> For which <strong>period</strong> are you assessing SOC efficacy?
          </div>
          <input
            className="field-input"
            placeholder="e.g. FY 2024–25 or 01-Apr-2024 to 31-Mar-2025"
            value={orgInfo.period}
            onChange={(e) => updateField("period", e.target.value)}
          />
          {errors.period && (
            <div className="field-error">{errors.period}</div>
          )}
        </div>
      </div>

      <div className="app-footer no-print">
        <div className="insight-text">Step 1 of 7 · Organisation details</div>
        <button className="button primary" onClick={validateAndNext}>
          Next: Coverage (C)
        </button>
      </div>
    </div>
  );
};

export default OrgInfoPage;
