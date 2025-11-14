export type DomainKey =
  | "coverage"
  | "operations"
  | "manpower"
  | "governance"
  | "enrichment";

export interface OrgInfo {
  name: string;
  entityType: string;
  entityCategory: string;
  period: string;
}

export interface DomainScoreState {
  coverage: number;
  operations: number;
  manpower: number;
  governance: number;
  enrichment: number;
}
