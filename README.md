# Cost of Delay / CD3 Estimator

A web-based tool for calculating Cost of Delay and CD3 scores to help product and project teams optimize prioritization decisions.

## Features

- **Initiative Input**: Add multiple initiatives with effort (weeks) and value ($) estimates
- **Real-Time Calculations**: See Cost of Delay and CD3 scores update instantly as you adjust inputs
- **Scenario Comparison**: Compare different prioritization strategies:
  - No Prioritization
  - Shortest Duration First
  - Highest Value First
  - Highest CD3 First (recommended)
- **Clear Visualizations**: Tables showing metrics and scenario comparisons with best option highlighted

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Formulas

### Cost of Delay
```
Cost of Delay = One-Time Value / 1 week
```
Represents the value lost per week when delivery is delayed.

### CD3
```
CD3 = Cost of Delay / Duration
```
Prioritizes initiatives with high value urgency relative to effort.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Radix UI primitives

## Project Structure

```
/app
  /page.tsx          # Main application page
  /layout.tsx        # Root layout
  /globals.css       # Global styles
/components
  /ui                # shadcn/ui base components
  InitiativeInput.tsx
  InitiativeTable.tsx
  ScenarioComparison.tsx
/lib
  /calculations.ts   # All business logic
  /utils.ts          # Utility functions
/types
  /initiative.ts     # TypeScript types
```

## License

MIT
