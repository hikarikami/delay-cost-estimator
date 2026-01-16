/**
 * Recurring Delay Initiative represents a work item with recurring value and risk estimates
 */
export interface RecurringDelayInitiative {
  id: string;
  name: string;
  estimatedEffort: number; // weeks
  probabilityOfSuccess: number; // 0-100%
  recurringValue: number; // $/week (value gained)
  recurringPenalty: number; // $/week (penalty avoided)
  oneTimeValue: number; // $ (optional, can be 0)
}

/**
 * Calculated metrics for a recurring delay initiative
 */
export interface RecurringDelayMetrics {
  netWeeklyImpact: number; // $/week (recurring value + recurring penalty)
  expectedWeeklyImpact: number; // $/week (adjusted for probability)
  costOfDelayPerWeek: number; // $/week
  oneTimeBenefitNPV: number; // $ (present value)
  cd3Value: number; // Cost of Delay / Duration
}

/**
 * Delay scenario result
 */
export interface DelayScenario {
  delayWeeks: number;
  lostWeeklyValue: number; // $ lost during delay period
  npvLoss: number; // $ lost from discounting one-time benefit
  totalCostOfDelay: number; // $ total economic impact
}

/**
 * Global settings for calculations
 */
export interface CalculationSettings {
  analysisHorizon: number; // weeks (default 52)
  annualDecayRate: number; // 0-20% annually (default 10%)
  weeklyDecayRate: number; // derived from annual rate
  delayScenarios: number[]; // [4, 8, 12] weeks
}
