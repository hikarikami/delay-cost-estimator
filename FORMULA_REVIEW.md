# Cost of Delay & CD3 Formula Review

## Executive Summary

After reviewing industry standards and the current PRD formulas, **critical issues** have been identified in the Cost of Delay calculation. The current formula conflates "value per week of work" with "value lost per week of delay," which leads to incorrect prioritization.

**Recommendation**: Adopt a corrected formula that aligns with industry standards (Don Reinertsen's Principles of Product Development Flow) and provides clearer value modeling.

---

## 1. Current PRD Formulas (Issues Identified)

### Current Formulas
- **Cost of Delay**: `One-Time Value / Effort (weeks)`
- **CD3**: `Cost of Delay / Effort (weeks)` = `One-Time Value / Effort²`

### Problems with Current Approach

#### Problem 1: Conceptual Confusion
The formula `Value / Duration` calculates **"value per week of work"**, not **"value lost per week of delay"**. These are fundamentally different concepts:

- **Value per week of work**: How much value is delivered per unit of effort
- **Cost of Delay**: How much value is lost per unit of time when delivery is delayed

**Example**:
- Initiative: $100,000 value, 10 weeks duration
- Current formula: CoD = $10,000/week
- **Issue**: This suggests delaying by 1 week costs $10,000, but that's not how one-time value works

#### Problem 2: Mathematical Inconsistency
If Cost of Delay = Value / Duration, then:
- A $100,000 initiative taking 10 weeks has CoD = $10,000/week
- A $100,000 initiative taking 1 week has CoD = $100,000/week

This implies shorter initiatives have higher Cost of Delay, which contradicts the purpose of the metric.

#### Problem 3: CD3 Simplification Issue
CD3 = (Value / Duration) / Duration = Value / Duration²

This creates a **quadratic penalty** for duration, which may not reflect actual value loss patterns.

---

## 2. Industry Standard Formulas

### 2.1 Cost of Delay (Standard Definition)

**Source**: Don Reinertsen, "Principles of Product Development Flow"

**Standard Formula**: 
```
Cost of Delay = Total Expected Value / Time Period
```

Where:
- **Total Expected Value**: The economic value of the initiative
- **Time Period**: The period over which value is lost or the delay period

**Key Insight**: Cost of Delay represents the **economic impact per unit of time** when delivery is delayed.

### 2.2 CD3 (Standard Definition)

**Standard Formula**:
```
CD3 = Cost of Delay / Duration
```

Where:
- **Cost of Delay**: Value lost per unit time (from above)
- **Duration**: Time required to complete the work

**Purpose**: Prioritize work that delivers high value urgency relative to effort required.

---

## 3. Proposed Formula Models

### Model A: Standard Cost of Delay (Recommended)

**Assumption**: Value is lost linearly over a specified time period when delivery is delayed.

**Formulas**:
```
Cost of Delay = One-Time Value / Delay Period
CD3 = Cost of Delay / Duration
```

**Where**:
- **One-Time Value**: Total value delivered when initiative completes
- **Delay Period**: Time period over which value loss is measured (typically 1 week, 1 month, or project duration)
- **Duration**: Effort required to complete the initiative

**Example**:
- Initiative: $100,000 value, 10 weeks duration
- Delay Period: 1 week (standard)
- Cost of Delay = $100,000 / 1 week = **$100,000/week**
- CD3 = $100,000/week / 10 weeks = **$10,000**

**Interpretation**: 
- If delivery is delayed by 1 week, $100,000 of value is delayed
- CD3 of $10,000 means this initiative should be prioritized based on value urgency vs. effort

**Trade-offs**:
- ✅ Aligns with industry standards
- ✅ Conceptually clear: "value lost per week of delay"
- ⚠️ Assumes all initiatives have same delay period (1 week)
- ⚠️ May not reflect actual value decay patterns

---

### Model B: Value Decay Model

**Assumption**: Value decays over time, and Cost of Delay represents the rate of value loss.

**Formulas**:
```
Cost of Delay = One-Time Value / Value Decay Period
CD3 = Cost of Delay / Duration
```

**Where**:
- **Value Decay Period**: Time over which value fully decays (e.g., 6 months, 1 year)
- If value decays linearly over 6 months: CoD = Value / 26 weeks

**Example**:
- Initiative: $100,000 value, 10 weeks duration
- Value Decay Period: 26 weeks (6 months)
- Cost of Delay = $100,000 / 26 weeks = **$3,846/week**
- CD3 = $3,846/week / 10 weeks = **$384.6**

**Trade-offs**:
- ✅ More realistic for value that degrades over time
- ✅ Accounts for market conditions and competitive dynamics
- ⚠️ Requires additional input (decay period)
- ⚠️ More complex for users to understand

---

### Model C: Opportunity Cost Model (Current PRD Interpretation)

**Assumption**: Cost of Delay represents the opportunity cost of not delivering value sooner.

**Formulas**:
```
Cost of Delay = One-Time Value / Duration
CD3 = Cost of Delay / Duration = One-Time Value / Duration²
```

**Where**:
- This treats "value per week of work" as the urgency metric

**Example**:
- Initiative: $100,000 value, 10 weeks duration
- Cost of Delay = $100,000 / 10 weeks = **$10,000/week**
- CD3 = $10,000/week / 10 weeks = **$1,000**

**Trade-offs**:
- ⚠️ **Conceptually problematic**: Confuses value density with delay cost
- ⚠️ **Not industry standard**: Doesn't match Reinertsen's definition
- ⚠️ **Counterintuitive**: Shorter initiatives get higher CoD
- ✅ Simple: Only requires value and duration
- ⚠️ **May still work for prioritization**: If goal is to maximize value/duration ratio

**Note**: While this model may produce reasonable prioritization results in some cases, it uses non-standard terminology that could confuse users familiar with Cost of Delay literature.

---

### Model D: WSJF-Inspired Model (Weighted Shortest Job First)

**Assumption**: Similar to SAFe's WSJF, but simplified for this tool.

**Formulas**:
```
Cost of Delay = User Business Value + Time Criticality + Risk Reduction + Opportunity Enablement
CD3 = Cost of Delay / Duration
```

**Where**:
- Cost of Delay is a composite score (not just monetary value)
- Each component scored 1-10 or in dollars

**Trade-offs**:
- ✅ More comprehensive value model
- ✅ Accounts for non-financial value
- ⚠️ Much more complex
- ⚠️ Requires multiple inputs per initiative
- ⚠️ Out of scope for MVP

---

## 4. Recommended Approach

### Primary Recommendation: **Model A (Standard Cost of Delay)**

**Rationale**:
1. **Industry Alignment**: Matches Don Reinertsen's standard definition
2. **Conceptual Clarity**: Clear interpretation of "value lost per week of delay"
3. **Simplicity**: Only requires value and duration (with standard delay period)
4. **User Trust**: Users familiar with Cost of Delay will recognize the formula

**Implementation**:
- Use **1 week** as the standard delay period
- Cost of Delay = One-Time Value / 1 week = One-Time Value (per week)
- CD3 = Cost of Delay / Duration

**Formula Update**:
```
Cost of Delay ($/week) = One-Time Value ($)
CD3 = Cost of Delay ($/week) / Duration (weeks)
```

**Example**:
- Initiative A: $20,000 value, 2 weeks duration
  - CoD = $20,000/week
  - CD3 = $20,000/week ÷ 2 weeks = **10,000**
  
- Initiative B: $40,000 value, 4 weeks duration
  - CoD = $40,000/week
  - CD3 = $40,000/week ÷ 4 weeks = **10,000**

**Note**: In this model, initiatives with the same value have the same Cost of Delay, and CD3 differentiates based on duration.

---

### Alternative: **Hybrid Model with User Choice**

Allow users to choose the delay period:

**Options**:
1. **Standard (1 week)**: CoD = Value / 1 week
2. **Custom delay period**: User specifies delay period (e.g., 4 weeks, 12 weeks)
3. **Value decay period**: User specifies how long value takes to decay

**Trade-offs**:
- ✅ More flexible
- ✅ Accommodates different value models
- ⚠️ More complex UI
- ⚠️ May confuse users

**Recommendation**: Start with Model A, add hybrid as future enhancement.

---

## 5. Total Cost of Delay Calculation Review

### Current PRD Calculation

**Current Method**:
```
For each initiative: Cost of Delay × Cumulative Weeks = value lost
Total = Sum of all initiative costs
```

**Example from PRD**:
- Initiative A: CoD = $10,000/week, completes at week 2
  - Lost value = $10,000/week × 2 weeks = $20,000
- Initiative B: CoD = $10,000/week, completes at week 6
  - Lost value = $10,000/week × 6 weeks = $60,000
- Total = $80,000

### Issue with Current Calculation

The calculation `CoD × Cumulative Weeks` assumes:
- Value is lost continuously from time 0 until delivery
- The loss rate is constant (CoD per week)
- Total loss = CoD × weeks delayed

**This is correct IF**:
- Cost of Delay represents value lost per week
- Value loss starts immediately and continues until delivery

**However**, with the corrected CoD formula (Model A):
- CoD = $20,000/week means: "If delayed by 1 week, lose $20,000"
- If initiative completes at week 2, it was "delayed" by 2 weeks from an ideal start
- Total loss = $20,000/week × 2 weeks = $40,000 ✓

**The calculation method is correct**, but needs to use the corrected CoD formula.

---

## 6. Corrected Example Walkthrough

### Input Data
- **Initiative A**: 2 weeks, $20,000 value
- **Initiative B**: 4 weeks, $40,000 value
- **Initiative C**: 3 weeks, $15,000 value

### Step 1: Calculate Cost of Delay (Model A - Standard)
- A: $20,000 value → CoD = **$20,000/week**
- B: $40,000 value → CoD = **$40,000/week**
- C: $15,000 value → CoD = **$15,000/week**

### Step 2: Calculate CD3
- A: $20,000/week ÷ 2 weeks = **10,000**
- B: $40,000/week ÷ 4 weeks = **10,000**
- C: $15,000/week ÷ 3 weeks = **5,000**

### Step 3: Scenario Comparison (CD3 First: A or B first, then C)

**Option 1: A → B → C** (A and B tie on CD3, use A first)
- A completes at week 2: Lost = $20,000/week × 2 weeks = $40,000
- B completes at week 6: Lost = $40,000/week × 6 weeks = $240,000
- C completes at week 9: Lost = $15,000/week × 9 weeks = $135,000
- **Total Cost of Delay**: $415,000

**Option 2: B → A → C** (B and A tie on CD3, use B first)
- B completes at week 4: Lost = $40,000/week × 4 weeks = $160,000
- A completes at week 6: Lost = $20,000/week × 6 weeks = $120,000
- C completes at week 9: Lost = $15,000/week × 9 weeks = $135,000
- **Total Cost of Delay**: $415,000

**Option 3: A → C → B**
- A completes at week 2: Lost = $20,000/week × 2 weeks = $40,000
- C completes at week 5: Lost = $15,000/week × 5 weeks = $75,000
- B completes at week 9: Lost = $40,000/week × 9 weeks = $360,000
- **Total Cost of Delay**: $475,000

**Conclusion**: When A and B tie on CD3, either order gives same total. C should come last (lowest CD3).

---

## 7. Comparison Table

| Model | CoD Formula | CD3 Formula | Pros | Cons |
|-------|-------------|-------------|------|------|
| **Model A (Standard)** | Value / 1 week | CoD / Duration | Industry standard, clear concept | Assumes 1-week delay period |
| **Model B (Decay)** | Value / Decay Period | CoD / Duration | Realistic value model | Requires decay period input |
| **Model C (Current PRD)** | Value / Duration | Value / Duration² | Simple inputs | Non-standard, conceptually confused |
| **Model D (WSJF)** | Composite score | CoD / Duration | Comprehensive | Complex, out of scope |

---

## 8. Recommendations Summary

### Immediate Actions

1. **Update Cost of Delay Formula**:
   - ❌ Remove: `CoD = Value / Duration`
   - ✅ Use: `CoD = Value / 1 week` (or `CoD = Value` with units $/week)

2. **Update CD3 Formula**:
   - ✅ Keep: `CD3 = CoD / Duration`
   - ✅ This now correctly prioritizes high-value, short-duration work

3. **Update Documentation**:
   - Clearly explain that CoD = "value lost per week of delay"
   - Document the 1-week delay period assumption
   - Provide examples using corrected formulas

4. **Update Example Calculations**:
   - Revise Appendix A with corrected formulas
   - Ensure examples demonstrate correct prioritization

### Future Enhancements

1. **Custom Delay Period**: Allow users to specify delay period (4 weeks, 12 weeks, etc.)
2. **Value Decay Model**: Support for value that decays over time
3. **Multiple Value Types**: Support recurring value, risk reduction, opportunity enablement

---

## 9. Implementation Notes

### Formula Implementation (Model A)

```typescript
// Cost of Delay calculation
function calculateCostOfDelay(oneTimeValue: number): number {
  // Standard: 1 week delay period
  // CoD = Value / 1 week = Value (per week)
  return oneTimeValue;
}

// CD3 calculation
function calculateCD3(costOfDelay: number, durationWeeks: number): number {
  return costOfDelay / durationWeeks;
}

// Total Cost of Delay for scenario
function calculateTotalCostOfDelay(
  initiatives: Initiative[],
  sequence: number[]
): number {
  let cumulativeWeeks = 0;
  let total = 0;
  
  for (const index of sequence) {
    const initiative = initiatives[index];
    cumulativeWeeks += initiative.durationWeeks;
    const costOfDelay = calculateCostOfDelay(initiative.value);
    total += costOfDelay * cumulativeWeeks;
  }
  
  return total;
}
```

### Display Formatting

- **Cost of Delay**: Display as "$X,XXX/week" or "$X,XXX per week"
- **CD3**: Display as integer or one decimal place (e.g., "10,000" or "10,000.0")
- **Tooltip**: "Cost of Delay represents the value lost per week when delivery is delayed"

---

## 10. Validation Checklist

Before implementation, verify:

- [ ] Cost of Delay formula matches industry standard (Value / 1 week)
- [ ] CD3 formula is CoD / Duration (not Value / Duration²)
- [ ] Total Cost of Delay calculation uses corrected CoD
- [ ] Examples in documentation use corrected formulas
- [ ] UI labels clearly explain "value lost per week of delay"
- [ ] Tooltips and help text reflect corrected understanding
- [ ] Edge cases handled (zero value, zero duration, very large numbers)

---

## References

1. Reinertsen, Donald G. "The Principles of Product Development Flow: Second Generation Lean Product Development"
2. Wikipedia: Cost of Delay - https://en.wikipedia.org/wiki/Cost_of_delay
3. SAFe: Weighted Shortest Job First (WSJF) - https://scaledagileframework.com/wsjf/

---

## Document Version
- **Version**: 1.0
- **Date**: [Current Date]
- **Status**: Review & Approval Required
