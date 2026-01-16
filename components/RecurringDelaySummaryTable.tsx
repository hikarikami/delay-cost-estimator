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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Initiative Summary</CardTitle>
        <CardDescription>
          Overview of all initiatives and their Cost of Delay per week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Initiative</TableHead>
              <TableHead className="text-right">Weekly Impact</TableHead>
              <TableHead className="text-right">Probability</TableHead>
              <TableHead className="text-right">One-Off Benefit</TableHead>
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
                          Expected weekly value lost when delivery is delayed. Calculated as Weekly Impact × Probability of Success.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initiatives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Add initiatives to see summary
                </TableCell>
              </TableRow>
            ) : (
              initiatives.map((initiative) => (
                <TableRow key={initiative.id}>
                  <TableCell className="font-medium">{initiative.name}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(initiative.weeklyImpact)}/week
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(initiative.probabilityOfSuccess, 0)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {initiative.oneOffBenefit > 0
                      ? formatCurrency(initiative.oneOffBenefit)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(initiative.metrics.costOfDelayPerWeek)}/week
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
