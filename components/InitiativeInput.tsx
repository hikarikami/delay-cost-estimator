"use client";

import { Initiative } from "@/types/initiative";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Trash2, HelpCircle } from "lucide-react";
import { calculateInitiativeMetrics } from "@/lib/calculations";

interface InitiativeInputProps {
  initiative: Initiative;
  onUpdate: (id: string, updates: Partial<Initiative>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function InitiativeInput({
  initiative,
  onUpdate,
  onRemove,
  canRemove,
}: InitiativeInputProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(initiative.id, { name: e.target.value });
  };

  const handleEffortChange = (value: number[]) => {
    onUpdate(initiative.id, { effortWeeks: value[0] });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate(initiative.id, { valueDollars: value });
  };

  // Calculate metrics for inline display
  const metrics = calculateInitiativeMetrics(initiative);
  const codFormula = `${formatCurrency(initiative.valueDollars)} ÷ 1 week`;
  const cd3Formula = `${formatCurrency(metrics.costOfDelay)} ÷ ${formatNumber(initiative.effortWeeks, 1)} weeks`;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Initiative {initiative.name || "Untitled"}
          </CardTitle>
          {canRemove && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRemove(initiative.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Inputs */}
          <div className="space-y-6">
            {/* Initiative Name Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Initiative Name</label>
              </div>
              <Input
                type="text"
                value={initiative.name}
                onChange={handleNameChange}
                placeholder="Enter initiative name"
                className="text-base font-semibold"
              />
            </div>

            {/* Effort Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Estimated Effort</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Time required to complete this initiative in weeks
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center">
                  <Slider
                    value={[initiative.effortWeeks]}
                    onValueChange={handleEffortChange}
                    min={0.5}
                    max={52}
                    step={0.5}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <Input
                    type="number"
                    value={initiative.effortWeeks}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0.5;
                      onUpdate(initiative.id, { effortWeeks: Math.max(0.5, Math.min(52, value)) });
                    }}
                    min={0.5}
                    max={52}
                    step={0.5}
                    className="text-sm w-20 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <div className="px-3 py-2.5 bg-muted text-sm text-muted-foreground border-l border-input">
                    Weeks
                  </div>
                </div>
              </div>
            </div>

            {/* Value Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">One-Time Value</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Total value delivered when this initiative completes
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                value={initiative.valueDollars}
                onChange={handleValueChange}
                min={0}
                step={1000}
                className="text-sm"
                placeholder="0"
              />
            </div>
          </div>

          {/* Right Column: Calculated Metrics */}
          <div className="lg:border-l lg:pl-6 space-y-4">
            <div className="text-base font-semibold">Calculated Metrics</div>
            
            {/* Cost of Delay */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cost of Delay:</span>
                <span className="font-semibold">
                  {formatCurrency(metrics.costOfDelay)}/week
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Formula:</strong>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  {codFormula}
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                This represents the value lost per week when delivery is delayed.
              </p>
            </div>

            {/* CD3 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">CD3 Score:</span>
                <span className="font-semibold">
                  {formatNumber(metrics.cd3, 0)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Formula:</strong>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  {cd3Formula}
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                Higher scores indicate higher priority. This balances value urgency with effort required.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
