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

  const handleWeeklyImpactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate(initiative.id, { weeklyImpact: Math.max(0, value) });
  };

  const handleProbabilityChange = (value: number[]) => {
    onUpdate(initiative.id, { probabilityOfSuccess: value[0] });
  };

  const handleOneOffBenefitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate(initiative.id, { oneOffBenefit: Math.max(0, value) });
  };

  // Calculate metrics for display
  const metrics = calculateRecurringDelayMetrics(initiative, settings);

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

            {/* Weekly Impact */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Weekly Impact</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        The ongoing value delivered each week after this initiative goes live (e.g., revenue increase, cost savings).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                value={initiative.weeklyImpact}
                onChange={handleWeeklyImpactChange}
                min={0}
                step={1000}
                className="text-sm"
                placeholder="0"
              />
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

            {/* One-Off Benefit */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">One-Off Benefit (Optional)</label>
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
                value={initiative.oneOffBenefit}
                onChange={handleOneOffBenefitChange}
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
                  {formatCurrency(initiative.weeklyImpact)} × {formatNumber(initiative.probabilityOfSuccess, 0)}%
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                This is the ongoing value you're missing each week you wait to start.
              </p>
            </div>

            {/* One-Off Benefit NPV */}
            {initiative.oneOffBenefit > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">One-Time Benefit (Present Value):</span>
                  <span className="font-semibold">
                    {formatCurrency(metrics.oneOffBenefitNPV)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Formula:</strong>{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    {formatCurrency(initiative.oneOffBenefit)} (at delivery)
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  The value of the one-off benefit in today's dollars, assuming immediate delivery.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
