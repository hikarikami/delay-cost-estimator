"use client";

import { Initiative } from "@/types/initiative";
import { InitiativeMetrics } from "@/types/initiative";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

interface InitiativeTableProps {
  initiatives: (Initiative & { metrics: InitiativeMetrics })[];
}

export function InitiativeTable({ initiatives }: InitiativeTableProps) {
  // Sort by CD3 descending for display
  const sorted = [...initiatives].sort((a, b) => b.metrics.cd3 - a.metrics.cd3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initiative Metrics</CardTitle>
        <CardDescription>
          Calculated Cost of Delay and CD3 scores for each initiative
        </CardDescription>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div>
            <strong>Cost of Delay Formula:</strong>{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              CoD = Value ÷ 1 week
            </code>
            <span className="ml-2">
              The value lost per week when delivery is delayed.
            </span>
          </div>
          <div>
            <strong>CD3 Formula:</strong>{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              CD3 = Cost of Delay ÷ Duration
            </code>
            <span className="ml-2">
              Prioritizes initiatives with high value urgency relative to effort.
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Initiative</TableHead>
              <TableHead className="text-right">Effort</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  Cost of Delay
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Value lost per week when delivery is delayed. Higher value initiatives have higher Cost of Delay.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  CD3 Score
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Cost of Delay divided by Duration. Higher scores indicate higher priority initiatives that deliver value faster relative to effort.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Add initiatives to see metrics
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((initiative) => {
                // Calculate formula breakdown for display
                const codFormula = `${formatCurrency(initiative.valueDollars)} ÷ 1 week`;
                const cd3Formula = `${formatCurrency(initiative.metrics.costOfDelay)} ÷ ${formatNumber(initiative.effortWeeks, 1)} weeks`;
                
                return (
                  <TableRow key={initiative.id}>
                    <TableCell className="font-medium">{initiative.name}</TableCell>
                    <TableCell className="text-right">
                      {formatNumber(initiative.effortWeeks, 1)} weeks
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(initiative.valueDollars)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-semibold">
                          {formatCurrency(initiative.metrics.costOfDelay)}/week
                        </span>
                        <span className="text-xs text-muted-foreground">
                          <code className="bg-muted px-1 py-0.5 rounded">
                            {codFormula}
                          </code>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-semibold">
                          {formatNumber(initiative.metrics.cd3, 0)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          <code className="bg-muted px-1 py-0.5 rounded">
                            {cd3Formula}
                          </code>
                        </span>
                      </div>
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
