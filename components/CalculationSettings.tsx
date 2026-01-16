"use client";

import { CalculationSettings } from "@/types/recurring-delay";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface CalculationSettingsProps {
  settings: CalculationSettings;
  onUpdate: (updates: Partial<CalculationSettings>) => void;
}

export function CalculationSettingsPanel({
  settings,
  onUpdate,
}: CalculationSettingsProps) {
  const handleDiscountRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate({ discountRateAnnual: Math.max(0, Math.min(20, value)) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculation Settings</CardTitle>
        <CardDescription>
          Global assumptions used for all calculations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Annual Discount Rate</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      The rate at which future value is discounted to present value. Higher rates mean future dollars are worth less today. Typical range: 3-10% annually.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={settings.discountRateAnnual}
                onChange={handleDiscountRateChange}
                min={0}
                max={20}
                step={0.1}
                className="text-sm w-32"
              />
              <span className="text-sm text-muted-foreground">% annually</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Weekly rate: {formatNumber((settings.discountRateAnnual / 52), 4)}% per week
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
