/**
 * Recurring Delay Initiative represents a work item with recurring value and risk estimates
 */
export interface RecurringDelayInitiative {
  id: string;
  name: string;
  weeklyImpact: number; // $/week
  probabilityOfSuccess: number; // 0-100%
  oneOffBenefit: number; // $ (optional, can be 0)
}

/**
 * Calculated metrics for a recurring delay initiative
 */
export interface RecurringDelayMetrics {
  expectedWeeklyImpact: number; // $/week
  costOfDelayPerWeek: number; // $/week
  oneOffBenefitNPV: number; // $ (present value)
}

/**
 * Delay scenario result
 */
export interface DelayScenario {
  delayWeeks: number;
  lostWeeklyValue: number; // $ lost during delay period
  npvLoss: number; // $ lost from discounting one-off benefit
  totalCostOfDelay: number; // $ total economic impact
}

/**
 * Global settings for calculations
 */
export interface CalculationSettings {
  discountRateAnnual: number; // 0-20% annually
  delayScenarios: number[]; // [4, 8, 12] weeks
}
