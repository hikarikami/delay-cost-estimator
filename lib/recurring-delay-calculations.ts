import {
  RecurringDelayInitiative,
  RecurringDelayMetrics,
  DelayScenario,
  CalculationSettings,
} from "@/types/recurring-delay";

/**
 * Calculate Expected Weekly Impact
 * 
 * Formula: Expected Weekly Impact = Weekly Impact × (Probability of Success / 100)
 * 
 * This adjusts the weekly impact by the probability of success to get expected value.
 * 
 * @param weeklyImpact - Base weekly impact in $/week
 * @param probabilityOfSuccess - Probability as percentage (0-100)
 * @returns Expected weekly impact in $/week
 */
export function calculateExpectedWeeklyImpact(
  weeklyImpact: number,
  probabilityOfSuccess: number
): number {
  return weeklyImpact * (probabilityOfSuccess / 100);
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
 * Calculate Weekly Discount Rate
 * 
 * Formula: Weekly Discount Rate = Annual Discount Rate / 52
 * 
 * Converts annual discount rate to weekly rate for compounding calculations.
 * 
 * @param annualRate - Annual discount rate as percentage (e.g., 5 for 5%)
 * @returns Weekly discount rate as decimal (e.g., 0.000962 for 5% annual)
 */
export function calculateWeeklyDiscountRate(annualRate: number): number {
  return annualRate / 100 / 52;
}

/**
 * Calculate Present Value of One-Off Benefit
 * 
 * Formula: NPV = One-Off Benefit / (1 + Weekly Discount Rate)^Weeks Until Delivery
 * 
 * Assumption: Benefit occurs immediately at go-live (weeks until delivery = 0)
 * So: NPV = One-Off Benefit / (1 + rate)^0 = One-Off Benefit
 * 
 * However, if we delay, the benefit is received later, so its present value decreases.
 * 
 * @param oneOffBenefit - One-off benefit amount in $
 * @param weeklyDiscountRate - Weekly discount rate as decimal
 * @param weeksUntilDelivery - Weeks until delivery (default 0 for immediate)
 * @returns Net present value in $
 */
export function calculateOneOffBenefitNPV(
  oneOffBenefit: number,
  weeklyDiscountRate: number,
  weeksUntilDelivery: number = 0
): number {
  if (weeksUntilDelivery === 0) {
    return oneOffBenefit;
  }
  return oneOffBenefit / Math.pow(1 + weeklyDiscountRate, weeksUntilDelivery);
}

/**
 * Calculate NPV Loss from Delay
 * 
 * Formula: NPV Loss = One-Off Benefit × (1 - 1/(1 + Weekly Rate)^Delay Weeks)
 * 
 * This calculates how much the present value of the one-off benefit decreases
 * when delivery is delayed.
 * 
 * @param oneOffBenefit - One-off benefit amount in $
 * @param weeklyDiscountRate - Weekly discount rate as decimal
 * @param delayWeeks - Number of weeks delayed
 * @returns NPV loss in $
 */
export function calculateNPVLoss(
  oneOffBenefit: number,
  weeklyDiscountRate: number,
  delayWeeks: number
): number {
  if (oneOffBenefit === 0 || delayWeeks === 0) {
    return 0;
  }
  
  const originalNPV = oneOffBenefit; // Assumes immediate delivery
  const delayedNPV = oneOffBenefit / Math.pow(1 + weeklyDiscountRate, delayWeeks);
  
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
 * of the one-off benefit.
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
  const expectedWeeklyImpact = calculateExpectedWeeklyImpact(
    initiative.weeklyImpact,
    initiative.probabilityOfSuccess
  );
  
  const costOfDelayPerWeek = calculateCostOfDelayPerWeek(expectedWeeklyImpact);
  
  const weeklyDiscountRate = calculateWeeklyDiscountRate(settings.discountRateAnnual);
  const oneOffBenefitNPV = calculateOneOffBenefitNPV(
    initiative.oneOffBenefit,
    weeklyDiscountRate,
    0 // Assumes immediate delivery
  );
  
  return {
    expectedWeeklyImpact,
    costOfDelayPerWeek,
    oneOffBenefitNPV,
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
  const weeklyDiscountRate = calculateWeeklyDiscountRate(settings.discountRateAnnual);
  
  return settings.delayScenarios.map((delayWeeks) => {
    const lostWeeklyValue = calculateLostWeeklyValue(
      metrics.costOfDelayPerWeek,
      delayWeeks
    );
    
    const npvLoss = calculateNPVLoss(
      initiative.oneOffBenefit,
      weeklyDiscountRate,
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
