"use client";

import { useState, useMemo } from "react";
import { Initiative } from "@/types/initiative";
import { InitiativeInput } from "@/components/InitiativeInput";
import { InitiativeTable } from "@/components/InitiativeTable";
import { ScenarioComparison } from "@/components/ScenarioComparison";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateInitiativeMetrics, calculateScenarios } from "@/lib/calculations";
import { Plus } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

const DEFAULT_INITIATIVES: Initiative[] = [
  {
    id: generateId(),
    name: "A",
    effortWeeks: 4,
    valueDollars: 1500,
  },
  {
    id: generateId(),
    name: "B",
    effortWeeks: 2,
    valueDollars: 2000,
  },
  {
    id: generateId(),
    name: "C",
    effortWeeks: 10,
    valueDollars: 8500,
  },
  {
    id: generateId(),
    name: "D",
    effortWeeks: 8,
    valueDollars: 6000,
  },
];

export default function DelayEstimatePage() {
  const [initiatives, setInitiatives] = useState<Initiative[]>(DEFAULT_INITIATIVES);

  // Calculate metrics for all initiatives
  const initiativesWithMetrics = useMemo(() => {
    return initiatives.map(initiative => ({
      ...initiative,
      metrics: calculateInitiativeMetrics(initiative),
    }));
  }, [initiatives]);

  // Calculate scenarios
  const scenarios = useMemo(() => {
    return calculateScenarios(initiatives);
  }, [initiatives]);

  const handleAddInitiative = () => {
    const newInitiative: Initiative = {
      id: generateId(),
      name: `Initiative ${initiatives.length + 1}`,
      effortWeeks: 4,
      valueDollars: 10000,
    };
    setInitiatives([...initiatives, newInitiative]);
  };

  const handleUpdateInitiative = (id: string, updates: Partial<Initiative>) => {
    setInitiatives(
      initiatives.map(initiative =>
        initiative.id === id ? { ...initiative, ...updates } : initiative
      )
    );
  };

  const handleRemoveInitiative = (id: string) => {
    if (initiatives.length > 1) {
      setInitiatives(initiatives.filter(initiative => initiative.id !== id));
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Cost of Delay / CD3 Estimator</h1>
            <p className="text-muted-foreground">
              Calculate Cost of Delay and CD3 scores to optimize prioritization decisions
            </p>
          </header>

          <Tabs defaultValue="initiatives" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="initiatives">Set Initiatives</TabsTrigger>
              <TabsTrigger value="comparison">View Scenario Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="initiatives" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Initiatives</h2>
                <Button onClick={handleAddInitiative} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Initiative
                </Button>
              </div>

              <div className="space-y-4">
                {initiatives.map((initiative) => (
                  <InitiativeInput
                    key={initiative.id}
                    initiative={initiative}
                    onUpdate={handleUpdateInitiative}
                    onRemove={handleRemoveInitiative}
                    canRemove={initiatives.length > 1}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <div className="space-y-6">
                <InitiativeTable initiatives={initiativesWithMetrics} />
                <ScenarioComparison scenarios={scenarios} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}
