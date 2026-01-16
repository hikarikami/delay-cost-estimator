"use client";

import { useState, useMemo } from "react";
import { RecurringDelayInitiative, CalculationSettings } from "@/types/recurring-delay";
import { RecurringDelayInput } from "@/components/RecurringDelayInput";
import { DelayScenarioComparison } from "@/components/DelayScenarioComparison";
import { RecurringDelaySummaryTable } from "@/components/RecurringDelaySummaryTable";
import { CalculationSettingsPanel } from "@/components/CalculationSettings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  calculateRecurringDelayMetrics,
  calculateDelayScenarios,
  calculateWeeklyDecayRate,
} from "@/lib/recurring-delay-calculations";
import { Plus } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/utils";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

const DEFAULT_INITIATIVES: RecurringDelayInitiative[] = [
  {
    id: generateId(),
    name: "A",
    estimatedEffort: 4,
    probabilityOfSuccess: 80,
    recurringValue: 1000,
    recurringPenalty: 500,
    oneTimeValue: 10000,
  },
  {
    id: generateId(),
    name: "B",
    estimatedEffort: 2,
    probabilityOfSuccess: 90,
    recurringValue: 5000,
    recurringPenalty: 0,
    oneTimeValue: 2000,
  },
  {
    id: generateId(),
    name: "C",
    estimatedEffort: 10,
    probabilityOfSuccess: 50,
    recurringValue: 4500,
    recurringPenalty: 0,
    oneTimeValue: 25000,
  },
  {
    id: generateId(),
    name: "D",
    estimatedEffort: 8,
    probabilityOfSuccess: 70,
    recurringValue: 0,
    recurringPenalty: 10000,
    oneTimeValue: 0,
  },
];

const DEFAULT_SETTINGS: CalculationSettings = {
  analysisHorizon: 52,
  annualDecayRate: 10,
  weeklyDecayRate: calculateWeeklyDecayRate(10),
  delayScenarios: [4, 8, 12],
};

export default function RecurringDelayEstimatorPage() {
  const [initiatives, setInitiatives] = useState<RecurringDelayInitiative[]>(DEFAULT_INITIATIVES);
  const [settings, setSettings] = useState<CalculationSettings>(DEFAULT_SETTINGS);

  // Calculate metrics and scenarios for all initiatives
  const initiativesWithMetrics = useMemo(() => {
    return initiatives.map((initiative) => {
      const metrics = calculateRecurringDelayMetrics(initiative, settings);
      const scenarios = calculateDelayScenarios(initiative, metrics, settings);
      return {
        ...initiative,
        metrics,
        scenarios,
      };
    });
  }, [initiatives, settings]);

  const handleAddInitiative = () => {
    const newInitiative: RecurringDelayInitiative = {
      id: generateId(),
      name: `Initiative ${initiatives.length + 1}`,
      estimatedEffort: 4,
      probabilityOfSuccess: 80,
      recurringValue: 0,
      recurringPenalty: 0,
      oneTimeValue: 0,
    };
    setInitiatives([...initiatives, newInitiative]);
  };

  const handleUpdateInitiative = (
    id: string,
    updates: Partial<RecurringDelayInitiative>
  ) => {
    setInitiatives(
      initiatives.map((initiative) =>
        initiative.id === id ? { ...initiative, ...updates } : initiative
      )
    );
  };

  const handleRemoveInitiative = (id: string) => {
    if (initiatives.length > 1) {
      setInitiatives(initiatives.filter((initiative) => initiative.id !== id));
    }
  };

  const handleUpdateSettings = (updates: Partial<CalculationSettings>) => {
    setSettings({ ...settings, ...updates });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">True Cost of Delay Calculator</h1>
            <p className="text-muted-foreground">
              Calculate the economic cost of delaying initiatives using explicit assumptions about value, risk, and time
            </p>
          </header>

          <Tabs defaultValue="initiatives" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="initiatives">Set Initiatives</TabsTrigger>
              <TabsTrigger value="scenarios">View Delay Scenarios</TabsTrigger>
            </TabsList>

            <TabsContent value="initiatives" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Initiatives</h2>
                <Button onClick={handleAddInitiative} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Initiative
                </Button>
              </div>

              <CalculationSettingsPanel
                settings={settings}
                onUpdate={handleUpdateSettings}
              />

              <div className="space-y-4">
                {initiatives.map((initiative) => (
                  <RecurringDelayInput
                    key={initiative.id}
                    initiative={initiative}
                    settings={settings}
                    onUpdate={handleUpdateInitiative}
                    onRemove={handleRemoveInitiative}
                    canRemove={initiatives.length > 1}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <div className="space-y-6">
                <RecurringDelaySummaryTable
                  initiatives={initiativesWithMetrics.map(({ scenarios, ...rest }) => rest)}
                />
                {initiativesWithMetrics.map((initiative) => (
                  <div key={initiative.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">
                        {initiative.name || "Untitled Initiative"}
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        Cost of Delay: {formatCurrency(initiative.metrics.costOfDelayPerWeek)}/week
                      </div>
                    </div>
                    <DelayScenarioComparison
                      scenarios={initiative.scenarios}
                      discountRate={settings.annualDecayRate}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}
