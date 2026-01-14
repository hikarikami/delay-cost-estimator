import { Initiative, InitiativeMetrics, ScenarioType, ScenarioResult } from "@/types/initiative";

/**
 * Calculate Cost of Delay for an initiative
 * 
 * Formula: Cost of Delay = One-Time Value / 1 week
 * This represents the value lost per week when delivery is delayed.
 * 
 * Source: Don Reinertsen's "Principles of Product Development Flow"
 * 
 * @param valueDollars - Total one-time value in dollars
 * @returns Cost of Delay in dollars per week
 */
export function calculateCostOfDelay(valueDollars: number): number {
  // Standard delay period is 1 week
  // CoD = Value / 1 week = Value (expressed as $/week)
  return valueDollars;
}

/**
 * Calculate CD3 score for an initiative
 * 
 * Formula: CD3 = Cost of Delay / Duration
 * 
 * This prioritizes initiatives with high value urgency relative to effort.
 * Higher CD3 = higher priority.
 * 
 * @param costOfDelay - Cost of Delay in $/week
 * @param durationWeeks - Duration in weeks
 * @returns CD3 score (dimensionless)
 */
export function calculateCD3(costOfDelay: number, durationWeeks: number): number {
  if (durationWeeks === 0) return 0;
  return costOfDelay / durationWeeks;
}

/**
 * Calculate metrics for a single initiative
 */
export function calculateInitiativeMetrics(initiative: Initiative): InitiativeMetrics {
  const costOfDelay = calculateCostOfDelay(initiative.valueDollars);
  const cd3 = calculateCD3(costOfDelay, initiative.effortWeeks);
  
  return {
    costOfDelay,
    cd3,
  };
}

/**
 * Calculate total Cost of Delay for a sequence of initiatives
 * 
 * For each initiative in order:
 * - Calculate cumulative weeks (when it completes)
 * - Lost value = Cost of Delay × Cumulative Weeks
 * - Sum all lost values
 * 
 * @param initiatives - Array of initiatives with their metrics
 * @param order - Array of initiative IDs in delivery order
 * @returns Total Cost of Delay in dollars
 */
export function calculateTotalCostOfDelay(
  initiatives: (Initiative & { metrics: InitiativeMetrics })[],
  order: string[]
): number {
  let cumulativeWeeks = 0;
  let total = 0;
  
  const initiativeMap = new Map(initiatives.map(i => [i.id, i]));
  
  for (const id of order) {
    const initiative = initiativeMap.get(id);
    if (!initiative) continue;
    
    cumulativeWeeks += initiative.effortWeeks;
    const lostValue = initiative.metrics.costOfDelay * cumulativeWeeks;
    total += lostValue;
  }
  
  return total;
}

/**
 * Sort initiatives by scenario type
 */
export function sortInitiativesByScenario(
  initiatives: (Initiative & { metrics: InitiativeMetrics })[],
  scenarioType: ScenarioType
): string[] {
  const sorted = [...initiatives];
  
  switch (scenarioType) {
    case "no-prioritization":
      // Keep original input order (no sorting)
      return sorted.map(i => i.id);
      
    case "shortest-duration-first":
      return sorted
        .sort((a, b) => a.effortWeeks - b.effortWeeks)
        .map(i => i.id);
      
    case "highest-value-first":
      return sorted
        .sort((a, b) => b.valueDollars - a.valueDollars)
        .map(i => i.id);
      
    case "highest-cd3-first":
      return sorted
        .sort((a, b) => b.metrics.cd3 - a.metrics.cd3)
        .map(i => i.id);
      
    default:
      return sorted.map(i => i.id);
  }
}

/**
 * Calculate scenario results for all prioritization strategies
 */
export function calculateScenarios(
  initiatives: Initiative[]
): ScenarioResult[] {
  // Calculate metrics for all initiatives
  const initiativesWithMetrics = initiatives.map(initiative => ({
    ...initiative,
    metrics: calculateInitiativeMetrics(initiative),
  }));
  
  const scenarioTypes: ScenarioType[] = [
    "no-prioritization",
    "shortest-duration-first",
    "highest-value-first",
    "highest-cd3-first",
  ];
  
  const scenarioNames: Record<ScenarioType, string> = {
    "no-prioritization": "No Prioritization",
    "shortest-duration-first": "Shortest Duration First",
    "highest-value-first": "Highest Value First",
    "highest-cd3-first": "Highest CD3 First",
  };
  
  // Calculate results for each scenario
  const results: ScenarioResult[] = scenarioTypes.map(type => {
    const order = sortInitiativesByScenario(initiativesWithMetrics, type);
    const totalCostOfDelay = calculateTotalCostOfDelay(initiativesWithMetrics, order);
    const totalDuration = order.reduce((sum, id) => {
      const initiative = initiativesWithMetrics.find(i => i.id === id);
      return sum + (initiative?.effortWeeks || 0);
    }, 0);
    
    return {
      type,
      name: scenarioNames[type],
      totalCostOfDelay,
      totalDuration,
      order,
      isBest: false, // Will be set below
    };
  });
  
  // Find the best scenario (lowest total Cost of Delay)
  const bestCost = Math.min(...results.map(r => r.totalCostOfDelay));
  results.forEach(result => {
    result.isBest = result.totalCostOfDelay === bestCost;
  });
  
  return results;
}
