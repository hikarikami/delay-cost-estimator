# Product Requirements Document: True Cost of Delay Calculator

## 1. Purpose & Positioning

### Core Question
**"If we delay starting this initiative by 4, 8, or 12 weeks, what does that cost us in today's dollars?"**

### Purpose
This tool makes the **economic cost of waiting** visible in plain dollars, using explicit assumptions around risk, time, and value. It transforms abstract prioritization debates into tangible economic trade-offs.

### Positioning
- **Decision-support tool**, not a precise financial forecast
- **Complementary** to the CD3 Estimator (different model, same goal)
- Designed for **non-expert stakeholders** who need clarity, not complexity

### One-Sentence Summary
**"A calculator that shows executives and stakeholders exactly how much money is lost—in today's dollars—when initiatives are delayed, using clear assumptions about value, risk, and time."**

---

## 2. Target Users

### Primary Users
1. **Executives**
   - Making resource allocation decisions
   - Need clear economic justification
   - Value simplicity over precision

2. **External Clients**
   - Reviewing prioritization recommendations
   - Require transparent, understandable calculations
   - May not trust unexplained numbers

3. **Non-Technical Stakeholders**
   - Finance teams validating investment decisions
   - Business leaders comparing initiatives
   - Board members reviewing portfolio priorities

### Secondary Users
1. **Product Managers**
   - Building business cases
   - Communicating value to stakeholders

2. **Delivery Leads**
   - Justifying sequencing decisions
   - Explaining trade-offs to teams

3. **Consultants**
   - Facilitating prioritization discussions
   - Demonstrating economic impact of delays

### User Assumptions
- Users do **not** know Cost of Delay theory
- Users do **not** trust unexplained numbers
- Users need assumptions stated clearly and visibly
- Users value clarity over mathematical precision

---

## 3. Conceptual Model

Each initiative is evaluated using **four explicit inputs** that together calculate the true economic cost of delay.

### 3.1 Weekly Impact
**Definition**: The recurring value gained (or loss avoided) per week once the initiative is delivered.

**Characteristics**:
- Represents **ongoing benefit**, not a one-off
- Examples:
  - Revenue increase per week
  - Cost savings per week
  - Risk reduction value per week
- Measured in dollars per week

**Input Requirements**:
- Editable number input
- Currency formatting
- Range: $0 to $10,000,000 per week
- Tooltip: "The ongoing value delivered each week after this initiative goes live"

### 3.2 Probability of Success
**Definition**: The likelihood that the initiative will deliver its expected value.

**Purpose**: 
- Avoids best-case optimism bias
- Calculates expected value (value × probability)
- Makes risk explicit

**Input Requirements**:
- Slider or percentage input: 0% to 100%
- Default: 80% (adjustable)
- Tooltip: "The chance this initiative will deliver its expected value. Lower for higher-risk initiatives."

**Calculation Impact**:
- Expected Weekly Impact = Weekly Impact × (Probability of Success / 100)

### 3.3 One-Off Benefit
**Definition**: A single material benefit that occurs once at delivery (go-live).

**Examples**:
- Contract renewal secured ($500k)
- License fee avoided ($200k)
- Regulatory fine prevented ($1M)
- One-time cost savings ($150k)

**Characteristics**:
- Occurs **once**, not weekly
- Material (significant enough to matter)
- Happens at delivery, not during delay

**Input Requirements**:
- Editable number input
- Currency formatting
- Range: $0 to $50,000,000
- Optional field (can be $0)
- Tooltip: "A one-time benefit that occurs when this initiative goes live (e.g., contract renewal, avoided fine)"

### 3.4 Time Value of Money (Discount Rate)
**Definition**: The rate at which future value is discounted to present value.

**Purpose**:
- Future dollars are worth less than today's dollars
- Benefits delivered later are discounted back to today
- Makes delay costs comparable in present value terms

**Input Requirements**:
- Percentage input: 0% to 20% annually
- Default: 5% (industry standard)
- Tooltip: "Annual discount rate. Higher rates mean future value is worth less today. Typical range: 3-10%."

**Calculation Impact**:
- Weekly discount rate = Annual rate / 52
- Present value = Future value / (1 + weekly rate)^weeks

---

## 4. Key Outputs & Definitions

### 4.1 Cost of Delay per Week
**Definition**: The expected weekly value lost by waiting to start the initiative.

**Formula**:
```
Cost of Delay per Week = Expected Weekly Impact
Expected Weekly Impact = Weekly Impact × (Probability of Success / 100)
```

**Display**:
- Currency format: "$X,XXX/week"
- Clear label: "Value Lost Per Week of Delay"
- Tooltip: "This is the ongoing value you're missing each week you wait to start"

### 4.2 One-Time Delivery Benefit (NPV)
**Definition**: The net present value of the one-off benefit, discounted to today.

**Formula**:
```
NPV = One-Off Benefit / (1 + weekly_discount_rate)^weeks_until_delivery
```

**Display**:
- Currency format: "$X,XXX"
- Label: "One-Time Benefit (Present Value)"
- Tooltip: "The value of the one-off benefit in today's dollars, accounting for when it will be received"

### 4.3 Delay Scenarios

Calculate total economic impact for three standard delay periods:
- **4 weeks delay**
- **8 weeks delay**
- **12 weeks delay**

**For Each Delay Scenario, Calculate**:

1. **Lost Weekly Value During Delay**:
   ```
   Lost Value = Cost of Delay per Week × Delay Weeks
   ```

2. **Reduced Present Value of One-Off Benefit**:
   ```
   Original NPV = One-Off Benefit / (1 + rate)^original_weeks
   Delayed NPV = One-Off Benefit / (1 + rate)^(original_weeks + delay_weeks)
   NPV Loss = Original NPV - Delayed NPV
   ```

3. **Total Economic Impact**:
   ```
   Total Cost of Delay = Lost Weekly Value + NPV Loss
   ```

**Display Requirements**:
- Table showing all three scenarios side-by-side
- Clear indication that longer delays cost more
- Visual emphasis on compounding effect
- Formula breakdown visible (expandable or inline)

---

## 5. How to Read the Model (UX Requirements)

### 5.1 Inline Explanations

The UI must explain **within the interface**:

1. **How to Read a Single Row**:
   - What each input means
   - What each output represents
   - How inputs connect to outputs

2. **Why Numbers Increase with Longer Delay**:
   - Visual demonstration of compounding
   - Example walkthrough
   - Clear statement: "Each additional week of delay costs more than the previous week"

3. **Why Probability and Discounting Matter**:
   - Show calculation with and without adjustments
   - Explain impact of changing assumptions
   - Sensitivity indicators

### 5.2 Plain-Language Guidance

**Required Elements**:
- **Tooltips** on every input and output
- **Inline help text** explaining concepts
- **Example walkthrough** showing a complete calculation
- **Assumptions panel** clearly visible
- **Formula documentation** accessible but not intrusive

**Language Rules**:
- Avoid financial jargon unless defined
- Use "value lost" not "opportunity cost"
- Use "chance of success" not "probability distribution"
- Use "today's dollars" not "net present value" (unless explaining the concept)

---

## 6. Calculations & Assumptions

### 6.1 Core Formulas

#### Expected Weekly Impact
```
Expected Weekly Impact = Weekly Impact × (Probability of Success / 100)
```

#### Cost of Delay per Week
```
Cost of Delay per Week = Expected Weekly Impact
```

#### Weekly Discount Rate
```
Weekly Discount Rate = Annual Discount Rate / 52
```

#### Present Value of One-Off Benefit (at delivery)
```
NPV = One-Off Benefit / (1 + Weekly Discount Rate)^Weeks Until Delivery
```

**Assumption**: Weeks until delivery = 0 (benefit occurs immediately at go-live)

#### Lost Weekly Value During Delay
```
Lost Value = Cost of Delay per Week × Delay Weeks
```

#### NPV Loss from Delay
```
Original NPV = One-Off Benefit / (1 + Weekly Discount Rate)^0
             = One-Off Benefit

Delayed NPV = One-Off Benefit / (1 + Weekly Discount Rate)^Delay Weeks

NPV Loss = Original NPV - Delayed NPV
         = One-Off Benefit × (1 - 1/(1 + Weekly Discount Rate)^Delay Weeks)
```

#### Total Cost of Delay
```
Total Cost of Delay = Lost Weekly Value + NPV Loss
```

### 6.2 Calculation Validation

**Requirements**:
- All formulas must be documented in code comments
- Formulas must be validated against economic reasoning
- If Excel formulas differ, document the rationale
- Provide example calculations in documentation

**Validation Checklist**:
- [ ] Formulas match standard financial calculations
- [ ] Units are consistent (weeks, dollars)
- [ ] Rounding only at display time
- [ ] Edge cases handled (0% probability, 0% discount rate, etc.)

### 6.3 Assumptions Visibility

**Must Display**:
- Current discount rate
- Current probability assumption
- Time period assumptions (weeks)
- Calculation method (expected value, NPV)

**Must Allow Editing**:
- Discount rate (with guardrails)
- Probability of success
- Delay scenarios (4, 8, 12 weeks - or custom)

---

## 7. UI & Interaction Requirements

### 7.1 Layout

**Primary Layout**: Table-based
- Each row = one initiative
- Columns for inputs and outputs
- Responsive: stack on mobile, table on desktop

**Alternative Layout**: Card-based
- Each initiative in its own card
- Inputs at top, outputs below
- Better for mobile, more visual separation

**Recommendation**: Start with table, support both

### 7.2 Input Controls

**Weekly Impact**:
- Number input with currency formatting
- Stepper buttons for quick adjustments
- Range: $0 to $10,000,000/week

**Probability of Success**:
- Slider: 0% to 100%
- Number input for precise entry
- Visual indicator (color-coded: green/yellow/red)

**One-Off Benefit**:
- Number input with currency formatting
- Optional (can be $0)
- Clear label indicating it's optional

**Discount Rate**:
- Number input: 0% to 20% annually
- Default: 5%
- Tooltip explaining typical ranges

**Delay Scenarios**:
- Pre-set buttons: 4, 8, 12 weeks
- Optional: Custom delay input
- Visual comparison of all scenarios

### 7.3 Real-Time Updates

**Requirements**:
- All calculations update immediately as inputs change
- No "Calculate" button required
- Visual feedback when values change
- Highlight which outputs are affected by each input

### 7.4 Visual Design

**Tone**:
- Calm and professional
- Financial tool aesthetic (clean, trustworthy)
- Avoid playful or casual elements

**Color Usage**:
- Green: Positive value, benefits
- Red: Costs, losses
- Neutral: Inputs, assumptions
- Muted palette overall

**Typography**:
- Clear hierarchy
- Currency values prominent
- Explanatory text smaller but readable

---

## 8. Technical Requirements

### 8.1 Technology Stack
- **Framework**: Next.js (App Router) - matches existing tool
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (for consistency)

### 8.2 Architecture Principles

**Calculation Logic**:
- Pure functions, no side effects
- Deterministic calculations
- Isolated in `/lib/calculations.ts` (or similar)
- Fully testable

**State Management**:
- React hooks (useState, useMemo)
- Calculations derived from inputs
- No stored calculation results

**Code Organization**:
```
/app/recurring-delay-estimator/
  /page.tsx (main page)
/components/
  /RecurringDelayInput.tsx
  /RecurringDelayTable.tsx
  /DelayScenarioComparison.tsx
/lib/
  /recurring-delay-calculations.ts
/types/
  /recurring-delay.ts
```

### 8.3 Testing Requirements

**Unit Tests**:
- All calculation functions
- Edge cases (0% probability, 0% discount, etc.)
- Formula validation

**Integration Tests**:
- End-to-end calculation flow
- Real-time update behavior
- Input validation

---

## 9. Non-Goals

This tool is **NOT**:
- ❌ A precise financial forecasting engine
- ❌ A budgeting or accounting tool
- ❌ A guarantee of outcomes
- ❌ A replacement for financial analysis
- ❌ A risk assessment tool (beyond probability input)
- ❌ A dependency management system
- ❌ A scheduling or resource planning tool

**Scope Boundary**: Focus on making delay costs visible and understandable. Intentionally simplified to support better decisions, not replace expert judgment.

---

## 10. Risks & Caveats

### 10.1 False Precision Risk

**Risk**: Tool may imply more accuracy than estimates warrant.

**Mitigation**:
- Use appropriate rounding in displays
- Include confidence indicators
- Add disclaimers about estimate uncertainty
- Show ranges or sensitivity analysis
- Clear statement: "These are estimates, not guarantees"

### 10.2 Sensitivity to Assumptions

**Risk**: Small changes in assumptions (especially probability, discount rate) can cause large changes in outputs.

**Mitigation**:
- Make assumptions highly visible
- Provide sensitivity analysis (show impact of ±10% changes)
- Warn users when outputs are highly sensitive
- Encourage scenario planning (try multiple assumptions)

### 10.3 When Not to Use This Model

**Limitations**:
- **Strategic Value**: Some initiatives have non-financial value not captured
- **Dependencies**: Model assumes initiatives are independent
- **Market Dynamics**: Doesn't account for competitive responses
- **Learning Value**: Doesn't capture knowledge gained from early delivery
- **Resource Constraints**: Assumes unlimited capacity to deliver

**Mitigation**:
- Document limitations clearly
- Provide warnings when model may be misleading
- Encourage users to consider context beyond the numbers
- Suggest when to consult financial experts

### 10.4 Misinterpretation Risk

**Risk**: Users may treat outputs as guarantees or make decisions based solely on numbers.

**Mitigation**:
- Clear disclaimers in UI
- "This is a decision-support tool, not a forecast"
- Encourage discussion, not just number comparison
- Provide guidance on how to use outputs

---

## 11. Success Criteria

### 11.1 User Understanding
- Users can explain what each input means
- Users understand why delay costs increase over time
- Users can interpret outputs without training

### 11.2 Decision Support
- Tool is used in prioritization discussions
- Outputs influence resource allocation decisions
- Stakeholders trust and understand the calculations

### 11.3 Technical Quality
- Calculations are accurate and reproducible
- Formulas are documented and validated
- Performance is acceptable (real-time updates)

---

## 12. Example Calculation Walkthrough

### Input Data
- **Weekly Impact**: $10,000/week
- **Probability of Success**: 80%
- **One-Off Benefit**: $50,000
- **Discount Rate**: 5% annually
- **Delay Scenarios**: 4, 8, 12 weeks

### Step 1: Calculate Expected Weekly Impact
```
Expected Weekly Impact = $10,000 × (80% / 100) = $8,000/week
```

### Step 2: Calculate Cost of Delay per Week
```
Cost of Delay per Week = $8,000/week
```

### Step 3: Calculate Weekly Discount Rate
```
Weekly Discount Rate = 5% / 52 = 0.0962% per week
```

### Step 4: Calculate Delay Scenarios

**4-Week Delay**:
- Lost Weekly Value = $8,000 × 4 = $32,000
- NPV Loss = $50,000 × (1 - 1/(1.000962)^4) = $1,920
- **Total Cost of Delay = $33,920**

**8-Week Delay**:
- Lost Weekly Value = $8,000 × 8 = $64,000
- NPV Loss = $50,000 × (1 - 1/(1.000962)^8) = $3,840
- **Total Cost of Delay = $67,840**

**12-Week Delay**:
- Lost Weekly Value = $8,000 × 12 = $96,000
- NPV Loss = $50,000 × (1 - 1/(1.000962)^12) = $5,760
- **Total Cost of Delay = $101,760**

### Key Insight
Notice that 12 weeks doesn't cost exactly 3× the 4-week cost ($33,920 × 3 = $101,760, but we get $101,760). The discounting creates a slight compounding effect, though the weekly value loss is linear.

---

## 13. Future Enhancements (Out of Scope for MVP)

- Custom delay periods (beyond 4, 8, 12 weeks)
- Multiple probability scenarios (optimistic, realistic, pessimistic)
- Sensitivity analysis visualization
- Export to PDF/Excel
- Save/load scenarios
- Comparison with CD3 Estimator results
- Historical tracking
- Team collaboration features

---

## Appendix A: Formula Reference

### A.1 Expected Value Calculation
```
Expected Value = Base Value × Probability
```

### A.2 Present Value Calculation
```
PV = FV / (1 + r)^n

Where:
  PV = Present Value
  FV = Future Value
  r = Discount rate per period
  n = Number of periods
```

### A.3 Weekly Discount Rate
```
Weekly Rate = Annual Rate / 52
```

### A.4 Total Cost of Delay
```
Total CoD = (Expected Weekly Impact × Delay Weeks) + NPV Loss

Where:
  NPV Loss = One-Off Benefit × (1 - 1/(1 + Weekly Rate)^Delay Weeks)
```

---

## Document Version
- **Version**: 1.0
- **Last Updated**: [Date]
- **Author**: Product Team
- **Status**: Ready for Design & Development
