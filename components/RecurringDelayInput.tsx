"use client";

import { RecurringDelayInitiative } from "@/types/recurring-delay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Trash2, HelpCircle } from "lucide-react";
import { calculateRecurringDelayMetrics } from "@/lib/recurring-delay-calculations";
import { CalculationSettings } from "@/types/recurring-delay";

interface RecurringDelayInputProps {
  initiative: RecurringDelayInitiative;
  settings: CalculationSettings;
  onUpdate: (id: string, updates: Partial<RecurringDelayInitiative>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function RecurringDelayInput({
  initiative,
  settings,
  onUpdate,
  onRemove,
  canRemove,
}: RecurringDelayInputProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(initiative.id, { name: e.target.value });
  };

  const handleEffortChange = (value: number[]) => {
    onUpdate(initiative.id, { estimatedEffort: value[0] });
  };

  const handleRecurringValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate(initiative.id, { recurringValue: Math.max(0, value) });
  };

  const handleRecurringPenaltyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate(initiative.id, { recurringPenalty: Math.max(0, value) });
  };

  const handleProbabilityChange = (value: number[]) => {
    onUpdate(initiative.id, { probabilityOfSuccess: value[0] });
  };

  const handleOneTimeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate(initiative.id, { oneTimeValue: Math.max(0, value) });
  };

  // Calculate metrics for display
  const metrics = calculateRecurringDelayMetrics(initiative, settings);
  const netImpactFormula = `${formatCurrency(initiative.recurringValue)} + ${formatCurrency(initiative.recurringPenalty)}`;
  const expectedImpactFormula = `${formatCurrency(metrics.netWeeklyImpact)} × ${formatNumber(initiative.probabilityOfSuccess, 0)}%`;

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
            {/* Initiative Name */}
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

            {/* Estimated Effort */}
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
                <Slider
                  value={[initiative.estimatedEffort]}
                  onValueChange={handleEffortChange}
                  min={0.5}
                  max={52}
                  step={0.5}
                  className="flex-1"
                />
                <div className="flex items-center rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <Input
                    type="number"
                    value={initiative.estimatedEffort}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0.5;
                      onUpdate(initiative.id, { 
                        estimatedEffort: Math.max(0.5, Math.min(52, value)) 
                      });
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

            {/* Probability of Success */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Probability of Success</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        The chance this initiative will deliver its expected value. Lower for higher-risk initiatives.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  value={[initiative.probabilityOfSuccess]}
                  onValueChange={handleProbabilityChange}
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <div className="flex items-center rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <Input
                    type="number"
                    value={initiative.probabilityOfSuccess}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      onUpdate(initiative.id, { 
                        probabilityOfSuccess: Math.max(0, Math.min(100, value)) 
                      });
                    }}
                    min={0}
                    max={100}
                    step={1}
                    className="text-sm w-20 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <div className="px-3 py-2.5 bg-muted text-sm text-muted-foreground border-l border-input">
                    %
                  </div>
                </div>
              </div>
            </div>

            {/* Recurring Value */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Recurring Value</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        The value gained each week after this initiative goes live (e.g., revenue increase, cost savings).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                value={initiative.recurringValue}
                onChange={handleRecurringValueChange}
                min={0}
                step={100}
                className="text-sm"
                placeholder="0"
              />
            </div>

            {/* Recurring Penalty */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Recurring Penalty</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        The penalty or cost avoided each week after this initiative goes live (e.g., risk reduction value, avoided fines).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                value={initiative.recurringPenalty}
                onChange={handleRecurringPenaltyChange}
                min={0}
                step={100}
                className="text-sm"
                placeholder="0"
              />
            </div>

            {/* One-Time Value */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">One-Time Value (Optional)</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        A one-time benefit that occurs when this initiative goes live (e.g., contract renewal, avoided fine). Leave as $0 if not applicable.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                value={initiative.oneTimeValue}
                onChange={handleOneTimeValueChange}
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
            
            {/* Net Weekly Impact */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Net Weekly Impact:</span>
                <span className="font-semibold">
                  {formatCurrency(metrics.netWeeklyImpact)}/week
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Formula:</strong>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  {netImpactFormula}
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                Sum of recurring value and recurring penalty.
              </p>
            </div>

            {/* Cost of Delay per Week */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cost of Delay per Week:</span>
                <span className="font-semibold">
                  {formatCurrency(metrics.costOfDelayPerWeek)}/week
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Formula:</strong>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  {expectedImpactFormula}
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                This is the ongoing value you're missing each week you wait to start.
              </p>
            </div>

            {/* One-Time Benefit NPV */}
            {initiative.oneTimeValue > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">One-Time Benefit (NPV):</span>
                  <span className="font-semibold">
                    {formatCurrency(metrics.oneTimeBenefitNPV)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Formula:</strong>{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    {formatCurrency(initiative.oneTimeValue)} discounted
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  The value of the one-off benefit in today's dollars, accounting for time value of money.
                </p>
              </div>
            )}

            {/* CD3 Value */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">CD3 Value:</span>
                <span className="font-semibold">
                  {formatNumber(metrics.cd3Value, 1)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Formula:</strong>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  {formatCurrency(metrics.costOfDelayPerWeek)} ÷ {formatNumber(initiative.estimatedEffort, 1)} weeks
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                Cost of Delay divided by Duration. Higher scores indicate higher priority.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
