/**
 * Initiative represents a single work item with effort and value estimates
 */
export interface Initiative {
  id: string;
  name: string;
  effortWeeks: number;
  valueDollars: number;
}

/**
 * Calculated metrics for an initiative
 */
export interface InitiativeMetrics {
  costOfDelay: number; // $/week
  cd3: number; // dimensionless score
}

/**
 * Scenario type for prioritization strategies
 */
export type ScenarioType = 
  | "no-prioritization"
  | "shortest-duration-first"
  | "highest-value-first"
  | "highest-cd3-first";

/**
 * Scenario result showing total cost of delay and delivery order
 */
export interface ScenarioResult {
  type: ScenarioType;
  name: string;
  totalCostOfDelay: number;
  totalDuration: number;
  order: string[]; // Initiative IDs in delivery order
  isBest: boolean;
}
