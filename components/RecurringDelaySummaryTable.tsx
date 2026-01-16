"use client";

import { RecurringDelayInitiative } from "@/types/recurring-delay";
import { RecurringDelayMetrics } from "@/types/recurring-delay";
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

interface RecurringDelaySummaryTableProps {
  initiatives: (RecurringDelayInitiative & { metrics: RecurringDelayMetrics })[];
}

export function RecurringDelaySummaryTable({
  initiatives,
}: RecurringDelaySummaryTableProps) {
  // Sort by CD3 descending
  const sorted = [...initiatives].sort((a, b) => b.metrics.cd3Value - a.metrics.cd3Value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initiative Summary</CardTitle>
        <CardDescription>
          Overview of all initiatives with their calculated metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Initiative</TableHead>
              <TableHead className="text-right">Effort</TableHead>
              <TableHead className="text-right">Probability</TableHead>
              <TableHead className="text-right">Recurring Value</TableHead>
              <TableHead className="text-right">Recurring Penalty</TableHead>
              <TableHead className="text-right">One-Time Value</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  Cost of Delay per Week
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Expected weekly value lost when delivery is delayed. Calculated as (Recurring Value + Recurring Penalty) × Probability of Success.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  One-Time Benefit (NPV)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Present value of the one-time benefit, discounted for time value of money.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead className="text-right">CD3 Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  Add initiatives to see summary
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((initiative) => (
                <TableRow key={initiative.id}>
                  <TableCell className="font-medium">{initiative.name}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(initiative.estimatedEffort, 1)} weeks
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(initiative.probabilityOfSuccess, 0)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {initiative.recurringValue > 0
                      ? formatCurrency(initiative.recurringValue)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {initiative.recurringPenalty > 0
                      ? formatCurrency(initiative.recurringPenalty)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {initiative.oneTimeValue > 0
                      ? formatCurrency(initiative.oneTimeValue)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(initiative.metrics.costOfDelayPerWeek)}/week
                  </TableCell>
                  <TableCell className="text-right">
                    {initiative.metrics.oneTimeBenefitNPV > 0
                      ? formatCurrency(initiative.metrics.oneTimeBenefitNPV)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatNumber(initiative.metrics.cd3Value, 1)}
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
