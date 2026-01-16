import {
  RecurringDelayInitiative,
  RecurringDelayMetrics,
  DelayScenario,
  CalculationSettings,
} from "@/types/recurring-delay";

/**
 * Calculate Weekly Decay Rate from Annual Rate
 * 
 * Formula: Weekly Rate = (1 + Annual Rate)^(1/52) - 1
 * 
 * This converts an annual decay/discount rate to a weekly rate for compounding.
 * 
 * @param annualRate - Annual decay rate as percentage (e.g., 10 for 10%)
 * @returns Weekly decay rate as decimal (e.g., 0.00184 for 10% annual)
 */
export function calculateWeeklyDecayRate(annualRate: number): number {
  return Math.pow(1 + annualRate / 100, 1 / 52) - 1;
}

/**
 * Calculate Net Weekly Impact
 * 
 * Formula: Net Weekly Impact = Recurring Value + Recurring Penalty
 * 
 * This combines both the value gained and the penalty avoided each week.
 * 
 * @param recurringValue - Value gained per week in $
 * @param recurringPenalty - Penalty avoided per week in $
 * @returns Net weekly impact in $/week
 */
export function calculateNetWeeklyImpact(
  recurringValue: number,
  recurringPenalty: number
): number {
  return recurringValue + recurringPenalty;
}

/**
 * Calculate Expected Weekly Impact
 * 
 * Formula: Expected Weekly Impact = Net Weekly Impact × (Probability of Success / 100)
 * 
 * This adjusts the net weekly impact by the probability of success to get expected value.
 * 
 * @param netWeeklyImpact - Net weekly impact in $/week
 * @param probabilityOfSuccess - Probability as percentage (0-100)
 * @returns Expected weekly impact in $/week
 */
export function calculateExpectedWeeklyImpact(
  netWeeklyImpact: number,
  probabilityOfSuccess: number
): number {
  return netWeeklyImpact * (probabilityOfSuccess / 100);
}

/**
 * Calculate Cost of Delay per Week
 * 
 * Formula: Cost of Delay per Week = Expected Weekly Impact
 * 
 * This represents the value lost per week when delivery is delayed.
 * 
 * @param expectedWeeklyImpact - Expected weekly impact in $/week
 * @returns Cost of delay per week in $/week
 */
export function calculateCostOfDelayPerWeek(
  expectedWeeklyImpact: number
): number {
  return expectedWeeklyImpact;
}

/**
 * Calculate CD3 Value
 * 
 * Formula: CD3 = Cost of Delay per Week / Estimated Effort
 * 
 * This prioritizes initiatives with high value urgency relative to effort.
 * 
 * @param costOfDelayPerWeek - Cost of delay per week in $/week
 * @param estimatedEffort - Estimated effort in weeks
 * @returns CD3 value
 */
export function calculateCD3Value(
  costOfDelayPerWeek: number,
  estimatedEffort: number
): number {
  if (estimatedEffort === 0) return 0;
  return costOfDelayPerWeek / estimatedEffort;
}

/**
 * Calculate Present Value of One-Time Benefit
 * 
 * Formula: NPV = One-Time Value / (1 + Weekly Decay Rate)^(Analysis Horizon / 2)
 * 
 * The one-time benefit is discounted based on the analysis horizon midpoint
 * to account for the time value of money over the analysis period.
 * 
 * @param oneTimeValue - One-time benefit amount in $
 * @param weeklyDecayRate - Weekly decay rate as decimal
 * @param analysisHorizon - Analysis horizon in weeks (default 52)
 * @returns Net present value in $
 */
export function calculateOneTimeBenefitNPV(
  oneTimeValue: number,
  weeklyDecayRate: number,
  analysisHorizon: number = 52
): number {
  if (oneTimeValue === 0) return 0;
  // Discount the one-time benefit to present value
  // Using midpoint of analysis horizon for discounting
  const discountPeriods = analysisHorizon / 2;
  return oneTimeValue / Math.pow(1 + weeklyDecayRate, discountPeriods);
}

/**
 * Calculate NPV Loss from Delay
 * 
 * Formula: NPV Loss = One-Time Value × (1 - 1/(1 + Weekly Rate)^Delay Weeks)
 * 
 * This calculates how much the present value of the one-time benefit decreases
 * when delivery is delayed.
 * 
 * @param oneTimeValue - One-time benefit amount in $
 * @param weeklyDecayRate - Weekly decay rate as decimal
 * @param delayWeeks - Number of weeks delayed
 * @returns NPV loss in $
 */
export function calculateNPVLoss(
  oneTimeValue: number,
  weeklyDecayRate: number,
  delayWeeks: number
): number {
  if (oneTimeValue === 0 || delayWeeks === 0) {
    return 0;
  }
  
  const originalNPV = oneTimeValue; // Assumes immediate delivery
  const delayedNPV = oneTimeValue / Math.pow(1 + weeklyDecayRate, delayWeeks);
  
  return originalNPV - delayedNPV;
}

/**
 * Calculate Lost Weekly Value During Delay
 * 
 * Formula: Lost Value = Cost of Delay per Week × Delay Weeks
 * 
 * This is the linear loss of weekly value during the delay period.
 * 
 * @param costOfDelayPerWeek - Cost of delay per week in $/week
 * @param delayWeeks - Number of weeks delayed
 * @returns Lost value in $
 */
export function calculateLostWeeklyValue(
  costOfDelayPerWeek: number,
  delayWeeks: number
): number {
  return costOfDelayPerWeek * delayWeeks;
}

/**
 * Calculate Total Cost of Delay for a Scenario
 * 
 * Formula: Total Cost of Delay = Lost Weekly Value + NPV Loss
 * 
 * This combines both the ongoing weekly value loss and the reduced present value
 * of the one-time benefit.
 * 
 * @param lostWeeklyValue - Lost weekly value during delay in $
 * @param npvLoss - NPV loss from delay in $
 * @returns Total cost of delay in $
 */
export function calculateTotalCostOfDelay(
  lostWeeklyValue: number,
  npvLoss: number
): number {
  return lostWeeklyValue + npvLoss;
}

/**
 * Calculate metrics for a single recurring delay initiative
 */
export function calculateRecurringDelayMetrics(
  initiative: RecurringDelayInitiative,
  settings: CalculationSettings
): RecurringDelayMetrics {
  const netWeeklyImpact = calculateNetWeeklyImpact(
    initiative.recurringValue,
    initiative.recurringPenalty
  );
  
  const expectedWeeklyImpact = calculateExpectedWeeklyImpact(
    netWeeklyImpact,
    initiative.probabilityOfSuccess
  );
  
  const costOfDelayPerWeek = calculateCostOfDelayPerWeek(expectedWeeklyImpact);
  
  const cd3Value = calculateCD3Value(
    costOfDelayPerWeek,
    initiative.estimatedEffort
  );
  
  const oneTimeBenefitNPV = calculateOneTimeBenefitNPV(
    initiative.oneTimeValue,
    settings.weeklyDecayRate,
    settings.analysisHorizon
  );
  
  return {
    netWeeklyImpact,
    expectedWeeklyImpact,
    costOfDelayPerWeek,
    oneTimeBenefitNPV,
    cd3Value,
  };
}

/**
 * Calculate delay scenarios for an initiative
 */
export function calculateDelayScenarios(
  initiative: RecurringDelayInitiative,
  metrics: RecurringDelayMetrics,
  settings: CalculationSettings
): DelayScenario[] {
  return settings.delayScenarios.map((delayWeeks) => {
    const lostWeeklyValue = calculateLostWeeklyValue(
      metrics.costOfDelayPerWeek,
      delayWeeks
    );
    
    const npvLoss = calculateNPVLoss(
      initiative.oneTimeValue,
      settings.weeklyDecayRate,
      delayWeeks
    );
    
    const totalCostOfDelay = calculateTotalCostOfDelay(lostWeeklyValue, npvLoss);
    
    return {
      delayWeeks,
      lostWeeklyValue,
      npvLoss,
      totalCostOfDelay,
    };
  });
}
