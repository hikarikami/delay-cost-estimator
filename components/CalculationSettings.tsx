"use client";

import { CalculationSettings } from "@/types/recurring-delay";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { calculateWeeklyDecayRate } from "@/lib/recurring-delay-calculations";

interface CalculationSettingsProps {
  settings: CalculationSettings;
  onUpdate: (updates: Partial<CalculationSettings>) => void;
}

export function CalculationSettingsPanel({
  settings,
  onUpdate,
}: CalculationSettingsProps) {
  const handleAnalysisHorizonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 52;
    onUpdate({ analysisHorizon: Math.max(1, Math.min(520, value)) });
  };

  const handleAnnualDecayRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const newAnnualRate = Math.max(0, Math.min(20, value));
    const weeklyRate = calculateWeeklyDecayRate(newAnnualRate);
    onUpdate({ 
      annualDecayRate: newAnnualRate,
      weeklyDecayRate: weeklyRate,
    });
  };

  const weeklyRate = calculateWeeklyDecayRate(settings.annualDecayRate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculation Settings</CardTitle>
        <CardDescription>
          Global assumptions used for all calculations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Analysis Horizon</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      How far out to count recurring benefits (in weeks). Default: 52 weeks (1 year).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={settings.analysisHorizon}
                onChange={handleAnalysisHorizonChange}
                min={1}
                max={520}
                step={1}
                className="text-sm w-32"
              />
              <span className="text-sm text-muted-foreground">weeks</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Annual Decay Rate</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Used to calculate present value of benefits/costs from delay. Higher rates mean future value is worth less today. Typical range: 3-10% annually.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={settings.annualDecayRate}
                onChange={handleAnnualDecayRateChange}
                min={0}
                max={20}
                step={0.1}
                className="text-sm w-32"
              />
              <span className="text-sm text-muted-foreground">% annually</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Weekly rate: {formatNumber(weeklyRate * 100, 3)}% per week
            </p>
            <p className="text-xs text-muted-foreground">
              Derived: (1 + {formatNumber(settings.annualDecayRate, 1)}%)^(1/52) - 1
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
