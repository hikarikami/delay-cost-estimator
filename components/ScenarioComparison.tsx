"use client";

import { ScenarioResult } from "@/types/initiative";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface ScenarioComparisonProps {
  scenarios: ScenarioResult[];
}

export function ScenarioComparison({ scenarios }: ScenarioComparisonProps) {
  // Sort by total Cost of Delay ascending
  const sorted = [...scenarios].sort((a, b) => a.totalCostOfDelay - b.totalCostOfDelay);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Comparison</CardTitle>
        <CardDescription>
          Compare different prioritization strategies and their total Cost of Delay
        </CardDescription>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <div>
            <strong>Total Cost of Delay Calculation:</strong>
            <div className="mt-1 ml-4 space-y-1">
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs block">
                For each initiative: Lost Value = Cost of Delay × Cumulative Weeks
              </code>
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs block">
                Total = Sum of all Lost Values
              </code>
            </div>
            <p className="mt-1 ml-4 text-xs">
              Cumulative weeks = time from start until initiative completes. Lower total Cost of Delay is better.
            </p>
          </div>
          <div>
            <strong>Strategy Explanations:</strong>
            <ul className="mt-1 ml-4 space-y-1 text-xs list-disc list-inside">
              <li><strong>No Prioritization:</strong> Initiatives delivered in the order they were added</li>
              <li><strong>Shortest Duration First:</strong> Prioritize by lowest effort (weeks)</li>
              <li><strong>Highest Value First:</strong> Prioritize by highest one-time value</li>
              <li><strong>Highest CD3 First:</strong> Prioritize by highest CD3 score (recommended - balances value and effort)</li>
            </ul>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Strategy</TableHead>
              <TableHead className="text-right">Total Duration</TableHead>
              <TableHead className="text-right">Total Cost of Delay</TableHead>
              <TableHead className="text-right">Difference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Add initiatives to see scenario comparisons
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((scenario, index) => {
                const bestCost = sorted[0].totalCostOfDelay;
                const difference = scenario.totalCostOfDelay - bestCost;
                const percentageDiff = bestCost > 0 
                  ? ((difference / bestCost) * 100).toFixed(1)
                  : "0.0";

                return (
                  <TableRow
                    key={scenario.type}
                    className={scenario.isBest ? "bg-muted/50" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {scenario.isBest && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        <span className={scenario.isBest ? "font-semibold" : ""}>
                          {scenario.name}
                        </span>
                        {scenario.isBest && (
                          <span className="text-xs text-muted-foreground">(Best)</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(scenario.totalDuration, 1)} weeks
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(scenario.totalCostOfDelay)}
                    </TableCell>
                    <TableCell className="text-right">
                      {scenario.isBest ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-destructive">
                          +{formatCurrency(difference)} ({percentageDiff}%)
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
