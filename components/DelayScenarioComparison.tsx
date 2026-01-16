"use client";

import { DelayScenario } from "@/types/recurring-delay";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface DelayScenarioComparisonProps {
  scenarios: DelayScenario[];
  discountRate: number;
}

export function DelayScenarioComparison({
  scenarios,
  discountRate,
}: DelayScenarioComparisonProps) {
  // Sort by delay weeks ascending
  const sorted = [...scenarios].sort((a, b) => a.delayWeeks - b.delayWeeks);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delay Scenario Impact</CardTitle>
        <CardDescription>
          Total economic cost of delaying this initiative by different time periods
        </CardDescription>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div>
            <strong>Total Cost of Delay Calculation:</strong>
            <div className="mt-1 ml-4 space-y-1">
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs block">
                Lost Weekly Value = Cost of Delay per Week × Delay Weeks
              </code>
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs block">
                NPV Loss = One-Time Value × (1 - 1/(1 + Weekly Rate)^Delay Weeks)
              </code>
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs block">
                Total = Lost Weekly Value + NPV Loss
              </code>
            </div>
            <p className="mt-1 ml-4 text-xs">
              Longer delays cost more because you lose ongoing value and the one-time benefit is worth less in today's dollars.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Delay Period</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  Lost Weekly Value
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Value lost from missing weekly benefits during the delay period.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  NPV Loss
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Reduction in present value of the one-time benefit due to delay (decay rate: {formatNumber(discountRate, 1)}% annually).
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">Total Cost of Delay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Add initiatives to see delay scenarios
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((scenario) => (
                <TableRow key={scenario.delayWeeks}>
                  <TableCell className="font-medium">
                    {formatNumber(scenario.delayWeeks, 0)} weeks
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(scenario.lostWeeklyValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(scenario.npvLoss)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-destructive">
                    {formatCurrency(scenario.totalCostOfDelay)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
