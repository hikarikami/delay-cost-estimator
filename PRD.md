# Product Requirements Document: Cost of Delay / CD3 Estimator

## 1. Problem Statement

### Current State
Product and project teams frequently estimate effort and value, but struggle to understand:
- **How delay impacts value**: The relationship between time and value degradation is not intuitive
- **Why sequencing matters**: Teams don't see how prioritization order changes total outcomes
- **Practical application**: Cost of Delay and CD3 concepts are abstract and difficult to apply

### Pain Points
Existing solutions (primarily spreadsheets) suffer from:
- **Poor usability**: Complex formulas hidden in cells, difficult to modify
- **Low trust**: Black-box calculations without clear explanations
- **Limited accessibility**: Not suitable for client presentations or non-technical stakeholders
- **Error-prone**: Easy to misuse or misinterpret formulas

### Solution Vision
Transform Cost of Delay and CD3 concepts into a **clear, interactive, real-time web tool** that:
- Makes calculations transparent and understandable
- Provides immediate visual feedback as inputs change
- Educates users on the underlying concepts
- Builds confidence through clear explanations and guardrails

---

## 2. Target Users

### Primary Users
1. **External Clients**
   - Need to understand prioritization trade-offs
   - Require clear, professional presentation
   - May have limited technical or financial expertise

2. **Non-Technical Stakeholders**
   - Business leaders making resource allocation decisions
   - Executives reviewing portfolio priorities
   - Finance teams validating investment decisions

3. **Product Owners / Delivery Leads**
   - Responsible for sequencing work
   - Need to justify prioritization decisions
   - Must communicate trade-offs to stakeholders

### Secondary Users
1. **Product Managers**
   - Building roadmaps and backlogs
   - Comparing initiative value

2. **Consultants**
   - Explaining prioritization frameworks to clients
   - Demonstrating Cost of Delay concepts

### User Assumptions
- Users may not know what Cost of Delay or CD3 means
- Users may not trust raw numbers without explanation
- Users need guardrails and sensible defaults
- Users value clarity over complexity

---

## 3. Core Concepts

### 3.1 Cost of Delay (CoD)
**Definition**: The value lost per unit of time when delivery is delayed.

**Formula**: `Cost of Delay = One-Time Value / Delay Period`

Where:
- **One-Time Value**: Total value delivered when initiative completes
- **Delay Period**: Standard period of 1 week (value lost per week of delay)

**Standard Implementation**: `Cost of Delay = One-Time Value / 1 week = One-Time Value` (expressed as $/week)

**Example**: An initiative worth $100,000 that is delayed by 1 week has a Cost of Delay of $100,000/week. This means each week of delay results in $100,000 of value being delayed.

**Interpretation**: Higher Cost of Delay means the initiative loses more value per week when delivery is delayed. Initiatives with higher value have higher Cost of Delay.

### 3.2 CD3 (Cost of Delay Divided by Duration)
**Definition**: A prioritization metric that balances value urgency (Cost of Delay) with delivery effort (Duration).

**Formula**: `CD3 = Cost of Delay / Duration`

Where:
- **Cost of Delay**: Value lost per week of delay ($/week)
- **Duration**: Time required to complete the initiative (weeks)

**Purpose**: Higher CD3 scores indicate initiatives that should be prioritized because they deliver high value urgency relative to their effort. This optimizes for delivering maximum value in minimum time.

**Example**: 
- Initiative A: Value = $20,000, Duration = 2 weeks → CoD = $20,000/week, CD3 = 10,000
- Initiative B: Value = $40,000, Duration = 8 weeks → CoD = $40,000/week, CD3 = 5,000
- **Priority**: Initiative A (higher CD3, delivers value faster relative to effort)

### 3.3 Sequencing Scenarios
The tool should compare different prioritization approaches:

1. **No Prioritization**: All initiatives delivered sequentially in input order
2. **Shortest Duration First**: Prioritize by lowest effort (weeks)
3. **Highest Value First**: Prioritize by highest one-time value
4. **Highest CD3 First**: Prioritize by highest CD3 score (recommended)

### 3.4 Total Cost of Delay
**Definition**: Cumulative value lost across all initiatives based on delivery sequence.

**Calculation**: Sum of (Cost of Delay × Weeks Delayed) for each initiative, where "Weeks Delayed" is the time from project start until that initiative is completed.

---

## 4. Core Features

### 4.1 Initiative Input

#### 4.1.1 Add/Remove Initiatives
- Users can add multiple initiatives (minimum 2, maximum 10 recommended)
- Each initiative requires:
  - **Name** (text input, required)
  - **Estimated Effort** (weeks, required)
  - **One-Time Value** ($, required)

#### 4.1.2 Input Controls
- **Effort Input**:
  - Slider: 0.5 to 52 weeks (with step of 0.5)
  - Number input: Direct entry with validation
  - Visual feedback: Clear indication of duration

- **Value Input**:
  - Number input with currency formatting
  - Stepper buttons for quick adjustments
  - Range: $0 to $10,000,000 (with validation)

#### 4.1.3 Real-Time Updates
- All calculations update immediately as inputs change
- No "Calculate" button required
- Visual indicators show which initiatives are affected by changes

#### 4.1.4 Optional Features (Nice-to-Have)
- **Confidence Range**: Low/Medium/High confidence selector
- **Risk Multiplier**: Adjustable factor (0.5x to 2.0x) to account for uncertainty
- **Notes Field**: Free-text area for context

### 4.2 Calculations & Logic

#### 4.2.1 Per-Initiative Calculations
For each initiative, calculate:
- **Cost of Delay**: `One-Time Value / 1 week` = `One-Time Value` (expressed as $/week)
- **CD3 Score**: `Cost of Delay / Duration (weeks)`

**Formula Details**:
- Cost of Delay uses a standard 1-week delay period, representing value lost per week when delivery is delayed
- CD3 prioritizes initiatives with high value urgency relative to effort required
- These formulas align with industry standards (Don Reinertsen's Principles of Product Development Flow)

**Formula Validation**: 
- Formulas match industry-standard Cost of Delay and CD3 definitions
- All calculations are mathematically sound and reproducible
- See FORMULA_REVIEW.md for detailed analysis and alternatives

#### 4.2.2 Scenario Calculations
For each sequencing scenario, calculate:
- **Total Duration**: Sum of effort for all initiatives
- **Total Cost of Delay**: Cumulative value lost based on delivery order
- **Time to Value**: When each initiative delivers value (cumulative weeks)

**Calculation Method**:
1. Sort initiatives by scenario rule
2. Calculate cumulative weeks for each initiative
3. For each initiative: `Cost of Delay × (Cumulative Weeks - 0)` = value lost
4. Sum all initiative costs to get Total Cost of Delay

**Example Walkthrough**:
- Initiative A: 2 weeks, $20,000 value → CoD = $20,000/week, CD3 = 10,000
- Initiative B: 4 weeks, $40,000 value → CoD = $40,000/week, CD3 = 10,000

**Scenario: CD3 First (A then B, or B then A - tie on CD3)**:
- A completes at week 2: Lost value = $20,000/week × 2 weeks = $40,000
- B completes at week 6: Lost value = $40,000/week × 6 weeks = $240,000
- **Total Cost of Delay**: $280,000

**Scenario: Value First (B then A)**:
- B completes at week 4: Lost value = $40,000/week × 4 weeks = $160,000
- A completes at week 6: Lost value = $20,000/week × 6 weeks = $120,000
- **Total Cost of Delay**: $280,000

**Note**: When initiatives tie on CD3, either order produces the same total Cost of Delay.

#### 4.2.3 Formula Documentation
Include a dedicated section showing:
- Exact formulas used
- Step-by-step example calculations
- Assumptions made (e.g., linear value loss, no dependencies)

### 4.3 Visual Output

#### 4.3.1 Initiative Summary Table
Display for each initiative:
- Name
- Effort (weeks)
- One-Time Value ($)
- Cost of Delay ($/week)
- CD3 Score
- Recommended Priority Rank

**Formatting**:
- Currency: $X,XXX.XX format
- Time: X.X weeks
- CD3: X,XXX (no currency symbol)

#### 4.3.2 Scenario Comparison
Visual comparison of all four scenarios showing:
- **Bar Chart**: Total Cost of Delay for each scenario
- **Table**: Detailed breakdown with:
  - Scenario name
  - Total Cost of Delay
  - Total Duration
  - Difference from best scenario

#### 4.3.3 Cumulative Cost of Delay Chart
**Line Chart** showing:
- X-axis: Time (weeks)
- Y-axis: Cumulative Cost of Delay ($)
- Multiple lines: One per scenario
- Clear legend and labels

#### 4.3.4 Timeline Visualization
**Gantt-style view** (optional):
- Show when each initiative completes in each scenario
- Color-code by initiative
- Highlight recommended scenario

### 4.4 Education & UX

#### 4.4.1 Inline Explanations
- **Tooltips**: Hover explanations for:
  - Cost of Delay
  - CD3
  - Each scenario name
  - Calculation assumptions

- **Contextual Help**: 
  - "What is Cost of Delay?" expandable section
  - "Why does CD3 matter?" explanation
  - "How to interpret results" guide

#### 4.4.2 Plain Language
- Avoid jargon unless defined
- Use examples and analogies
- Explain "why" not just "what"

**Example Labels**:
- ❌ "CoD/Week"
- ✅ "Value Lost Per Week"

#### 4.4.3 Guardrails & Warnings
- **Validation**:
  - Prevent negative values
  - Warn on unrealistic durations (e.g., > 52 weeks)
  - Flag when values seem too high/low

- **Sensitivity Indicators**:
  - Show which inputs have the biggest impact
  - Highlight when small changes cause large result shifts

#### 4.4.4 Progressive Disclosure
- Start with simple view (2-3 initiatives)
- Advanced options (confidence, risk) hidden by default
- Formula details in collapsible section

---

## 5. Accuracy & Formatting Requirements

### 5.1 Number Precision
- **Currency**: Round to nearest $0.01 for display, maintain precision in calculations
- **Time**: Display to 0.1 weeks, calculate with full precision
- **CD3**: Round to nearest integer for display

### 5.2 Consistency
- Use same rounding rules throughout
- Maintain calculation precision internally
- Display formatted values consistently

### 5.3 Assumptions Visibility
Clearly display:
- **Calculation Method**: Linear value loss assumption
- **Time Unit**: All calculations in weeks
- **Sequencing**: No dependencies or parallel work
- **Value Model**: One-time value delivered at completion

### 5.4 Formula Documentation
Include a "How It Works" section with:
- Exact formulas (mathematical notation)
- Step-by-step example
- Link to external resources (if applicable)
- Reference to FORMULA_REVIEW.md for detailed formula analysis and alternatives

---

## 6. Technical Requirements

### 6.1 Technology Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Charts**: Recharts or similar lightweight library
- **State Management**: React hooks (useState, useMemo)

### 6.2 Architecture Principles
- **Deterministic Calculations**: Pure functions, no side effects
- **Stateless Computation**: Calculations derived from inputs, not stored state
- **Testability**: All calculation logic in isolated, testable functions
- **Performance**: Memoize expensive calculations

### 6.3 Code Organization
```
/src
  /components
    /ui (shadcn components)
    /InitiativeInput.tsx
    /InitiativeTable.tsx
    /ScenarioComparison.tsx
    /CostOfDelayChart.tsx
  /lib
    /calculations.ts (pure calculation functions)
    /formatters.ts (number/currency formatting)
  /app
    /page.tsx (main application)
```

### 6.4 Validation & Testing
- Unit tests for all calculation functions
- Edge case handling (zero values, very large numbers)
- Input validation with clear error messages

---

## 7. Non-Goals

This tool is **NOT**:
- ❌ A full project management system
- ❌ A forecasting or scheduling engine
- ❌ A financial accounting tool
- ❌ A dependency management system
- ❌ A resource allocation planner
- ❌ A risk assessment tool (beyond basic confidence indicators)

**Scope Boundary**: Focus on Cost of Delay and CD3 calculations only. Do not attempt to solve broader project management challenges.

---

## 8. Open Questions / Risks

### 8.1 Ambiguities in Cost of Delay Interpretation

**Question**: How should Cost of Delay be calculated when value is not linear?
- **Current Assumption**: Linear value loss (value/time)
- **Alternative**: Exponential decay, step functions, or custom curves
- **Risk**: Linear assumption may not match real-world scenarios

**Mitigation**: 
- Clearly document the linear assumption
- Consider future enhancement for custom value curves
- Provide examples where linear model is appropriate

### 8.2 CD3 Formula Variations

**Status**: ✅ **Resolved** - Formula validated against industry standards

**Standard Formula**: `CD3 = Cost of Delay / Duration`
- This is the correct industry-standard formula (Don Reinertsen)
- Cost of Delay = Value / 1 week (standard delay period)
- CD3 = (Value / 1 week) / Duration = Value / Duration (when CoD is per week)

**Previous Issue**: The PRD initially used `Value / Duration` for CoD, which conflated "value per week of work" with "value lost per week of delay." This has been corrected.

**See**: FORMULA_REVIEW.md for detailed analysis of formula alternatives and trade-offs.

### 8.3 False Precision Risk

**Risk**: Tool may imply more accuracy than estimates warrant.

**Mitigation**:
- Use appropriate rounding in displays
- Include confidence indicators (if implemented)
- Add disclaimers about estimate uncertainty
- Show ranges or sensitivity analysis

### 8.4 Scenarios Where CD3 Is Misleading

**Known Limitations**:
- **Dependencies**: CD3 doesn't account for technical dependencies
- **Risk**: High-value, high-risk initiatives may need different treatment
- **Strategic Value**: Some initiatives have non-financial value not captured
- **Resource Constraints**: Assumes unlimited capacity

**Mitigation**:
- Document limitations clearly
- Provide warnings when results seem counterintuitive
- Encourage users to consider context beyond CD3

### 8.5 Parallel Work Assumption

**Question**: Should the tool support parallel work streams?
- **Current Assumption**: Sequential delivery only
- **Risk**: Real projects often have parallel work, reducing total duration

**Mitigation**:
- Clearly state sequential assumption
- Consider future enhancement for parallel work
- Document that results show "best case" sequential scenarios

---

## 9. Success Criteria

### 9.1 User Experience
- Users can add 3+ initiatives and see results in < 30 seconds
- Non-technical users understand results without training
- Tool is suitable for client presentations

### 9.2 Accuracy
- Calculations match manual spreadsheet verification
- Results are reproducible and consistent
- Formulas are documented and validated

### 9.3 Adoption
- Tool replaces spreadsheet usage for Cost of Delay calculations
- Users trust and understand the results
- Tool is referenced in prioritization discussions

---

## 10. Future Enhancements (Out of Scope for MVP)

- Custom value decay curves (non-linear)
- Dependency modeling
- Parallel work streams
- Risk-adjusted calculations
- Export to PDF/Excel
- Save/load scenarios
- Historical comparison
- Team collaboration features

---

## Appendix A: Example Calculation Walkthrough

### Input Data
- **Initiative A**: 2 weeks, $20,000 value
- **Initiative B**: 4 weeks, $40,000 value
- **Initiative C**: 3 weeks, $15,000 value

### Step 1: Calculate Cost of Delay
Using standard formula: CoD = Value / 1 week
- A: $20,000 value → **$20,000/week**
- B: $40,000 value → **$40,000/week**
- C: $15,000 value → **$15,000/week**

### Step 2: Calculate CD3
CD3 = Cost of Delay / Duration
- A: $20,000/week ÷ 2 weeks = **10,000**
- B: $40,000/week ÷ 4 weeks = **10,000**
- C: $15,000/week ÷ 3 weeks = **5,000**

### Step 3: Scenario Comparison (CD3 First: A or B first, then C)
**Option: A → B → C** (A and B tie on CD3, A chosen first)
- A completes at week 2: $20,000/week × 2 weeks = $40,000 lost
- B completes at week 6: $40,000/week × 6 weeks = $240,000 lost
- C completes at week 9: $15,000/week × 9 weeks = $135,000 lost
- **Total Cost of Delay**: $415,000

**Alternative: B → A → C** (same total when A and B tie)
- B completes at week 4: $40,000/week × 4 weeks = $160,000 lost
- A completes at week 6: $20,000/week × 6 weeks = $120,000 lost
- C completes at week 9: $15,000/week × 9 weeks = $135,000 lost
- **Total Cost of Delay**: $415,000

### Step 4: Compare to Other Scenarios
- **CD3 First (A → B → C or B → A → C)**: $415,000
- **Value First (B → A → C)**: $415,000 (same as CD3 when A and B tie)
- **Duration First (A → C → B)**: $475,000
- **No Prioritization (A → B → C)**: $415,000

**Conclusion**: CD3 prioritization correctly identifies that A and B should come before C. When initiatives tie on CD3, order doesn't affect total Cost of Delay.

---

## Document Version
- **Version**: 1.0
- **Last Updated**: [Date]
- **Author**: Product Team
- **Status**: Draft for Review
