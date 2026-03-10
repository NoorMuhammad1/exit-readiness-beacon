
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, TrendingUp, Clock, DollarSign, Target, Zap, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  timeframe: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  capitalRequired: number;
  projectedMultiple: number;
  color: string;
}

const scenarios: Scenario[] = [
  {
    id: 'quick-exit',
    title: 'Quick Exit',
    description: 'Sell as-is within 6-12 months to strategic or financial buyer',
    icon: Zap,
    timeframe: '6-12 months',
    riskLevel: 'Low',
    capitalRequired: 0,
    projectedMultiple: 3.5,
    color: 'bg-green-500'
  },
  {
    id: 'value-building',
    title: 'Value Building',
    description: 'Invest 18-24 months optimizing operations before exit',
    icon: TrendingUp,
    timeframe: '18-24 months',
    riskLevel: 'Medium',
    capitalRequired: 250000,
    projectedMultiple: 5.2,
    color: 'bg-white/20'
  },
  {
    id: 'market-maker',
    title: 'Market Maker',
    description: 'Strategic acquisitions and market consolidation over 3+ years',
    icon: Building2,
    timeframe: '3+ years',
    riskLevel: 'High',
    capitalRequired: 1000000,
    projectedMultiple: 8.5,
    color: 'bg-purple-500'
  }
];

export function ScenarioPlanningPage() {
  const [preferences, setPreferences] = useState({
    timeline: 18, // months
    riskTolerance: 50, // 0-100
    capitalAvailable: 500000 // dollars
  });

  // Mock current valuation - in real app, this would come from user's data
  const currentEBITDA = 2000000;
  const currentMultiple = 4.2;
  const currentValuation = currentEBITDA * currentMultiple;

  const calculateScenarioValue = (scenario: Scenario) => {
    const baseValue = currentEBITDA * scenario.projectedMultiple;
    
    // Adjust for timeline preference
    const timelineBonus = preferences.timeline >= 24 ? 1.1 : 1.0;
    
    // Adjust for risk tolerance
    const riskMultiplier = scenario.riskLevel === 'High' ? 
      (preferences.riskTolerance / 100) * 1.2 + 0.8 : 1.0;
    
    // Adjust for capital availability
    const capitalFit = preferences.capitalAvailable >= scenario.capitalRequired ? 1.0 : 0.85;
    
    return Math.round(baseValue * timelineBonus * riskMultiplier * capitalFit);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'High': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getBestScenario = () => {
    return scenarios.reduce((best, scenario) => {
      const currentValue = calculateScenarioValue(scenario);
      const bestValue = calculateScenarioValue(best);
      return currentValue > bestValue ? scenario : best;
    });
  };

  const bestScenario = getBestScenario();

  const getTimelineLabel = (months: number) => {
    if (months <= 12) return 'Quick Exit (Green)';
    if (months <= 24) return 'Moderate Timeline (Yellow)';
    return 'Long-term Strategy (Red)';
  };

  const getRiskToleranceLabel = (risk: number) => {
    if (risk <= 33) return 'Conservative (Green)';
    if (risk <= 66) return 'Moderate (Yellow)';
    return 'Aggressive (Red)';
  };

  const getCapitalLabel = (capital: number) => {
    if (capital <= 250000) return 'Limited Capital (Green)';
    if (capital <= 750000) return 'Moderate Capital (Yellow)';
    return 'High Capital (Red)';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Scenario Planning</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Compare three exit strategies tailored to your preferences and see projected valuations
        </p>
      </div>

      {/* Current Valuation */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Current Valuation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">EBITDA</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(currentEBITDA)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Multiple</p>
              <p className="text-2xl font-bold text-primary">{currentMultiple}x</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Enterprise Value</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(currentValuation)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preference Sliders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            Your Preferences
          </CardTitle>
          <CardDescription>
            Adjust these sliders to see how different scenarios fit your goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Timeline Preference */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">Timeline Preference</label>
              <div className="relative">
                <input
                  type="range"
                  min="6"
                  max="60"
                  step="6"
                  value={preferences.timeline}
                  onChange={(e) => setPreferences(prev => ({ ...prev, timeline: Number(e.target.value) }))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-700 
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-5
                           [&::-webkit-slider-thumb]:h-5
                           [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-white/20
                           [&::-webkit-slider-thumb]:ring-2
                           [&::-webkit-slider-thumb]:ring-white
                           [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-moz-range-thumb]:w-5
                           [&::-moz-range-thumb]:h-5
                           [&::-moz-range-thumb]:rounded-full
                           [&::-moz-range-thumb]:bg-white/20
                           [&::-moz-range-thumb]:border-2
                           [&::-moz-range-thumb]:border-white
                           [&::-moz-range-thumb]:cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      #10b981 0%, 
                      #eab308 33%, 
                      #f97316 66%, 
                      #ef4444 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                  <span>Quick (6m)</span>
                  <span>Moderate (24m)</span>
                  <span>Long (60m)</span>
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-sm text-white font-medium">{preferences.timeline} months</div>
                <div className="text-xs text-zinc-400">{getTimelineLabel(preferences.timeline)}</div>
              </div>
            </div>
            
            {/* Risk Tolerance */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">Risk Tolerance</label>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={preferences.riskTolerance}
                  onChange={(e) => setPreferences(prev => ({ ...prev, riskTolerance: Number(e.target.value) }))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-700 
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-5
                           [&::-webkit-slider-thumb]:h-5
                           [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-white/20
                           [&::-webkit-slider-thumb]:ring-2
                           [&::-webkit-slider-thumb]:ring-white
                           [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-moz-range-thumb]:w-5
                           [&::-moz-range-thumb]:h-5
                           [&::-moz-range-thumb]:rounded-full
                           [&::-moz-range-thumb]:bg-white/20
                           [&::-moz-range-thumb]:border-2
                           [&::-moz-range-thumb]:border-white
                           [&::-moz-range-thumb]:cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      #10b981 0%, 
                      #eab308 50%, 
                      #f97316 75%, 
                      #ef4444 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                  <span>Safe (0%)</span>
                  <span>Moderate (50%)</span>
                  <span>Risky (100%)</span>
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-sm text-white font-medium">{preferences.riskTolerance}% risk tolerance</div>
                <div className="text-xs text-zinc-400">{getRiskToleranceLabel(preferences.riskTolerance)}</div>
              </div>
            </div>
            
            {/* Capital Available */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">Capital Available</label>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="50000"
                  value={preferences.capitalAvailable}
                  onChange={(e) => setPreferences(prev => ({ ...prev, capitalAvailable: Number(e.target.value) }))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-700 
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-5
                           [&::-webkit-slider-thumb]:h-5
                           [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-white/20
                           [&::-webkit-slider-thumb]:ring-2
                           [&::-webkit-slider-thumb]:ring-white
                           [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-moz-range-thumb]:w-5
                           [&::-moz-range-thumb]:h-5
                           [&::-moz-range-thumb]:rounded-full
                           [&::-moz-range-thumb]:bg-white/20
                           [&::-moz-range-thumb]:border-2
                           [&::-moz-range-thumb]:border-white
                           [&::-moz-range-thumb]:cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      #10b981 0%, 
                      #eab308 25%, 
                      #f97316 50%, 
                      #ef4444 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                  <span>$0</span>
                  <span>$1M</span>
                  <span>$2M</span>
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-sm text-white font-medium">{formatCurrency(preferences.capitalAvailable)}</div>
                <div className="text-xs text-zinc-400">{getCapitalLabel(preferences.capitalAvailable)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Scenario */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 ring-1 ring-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Target className="h-6 w-6" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-green-400">{bestScenario.title}</h3>
              <p className="text-green-300">{bestScenario.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-300">Projected Value</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(calculateScenarioValue(bestScenario))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => {
          const projectedValue = calculateScenarioValue(scenario);
          const valueIncrease = projectedValue - currentValuation;
          const percentIncrease = ((valueIncrease / currentValuation) * 100);
          
          return (
            <Card key={scenario.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 ${scenario.color}`} />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <scenario.icon className="h-6 w-6" />
                  {scenario.title}
                </CardTitle>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Timeframe:</span>
                    <span className="text-sm font-medium">{scenario.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Risk Level:</span>
                    <Badge className={getRiskColor(scenario.riskLevel)}>{scenario.riskLevel}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Capital Required:</span>
                    <span className="text-sm font-medium">{formatCurrency(scenario.capitalRequired)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Target Multiple:</span>
                    <span className="text-sm font-medium">{scenario.projectedMultiple}x</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Projected Value</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(projectedValue)}</p>
                    <p className="text-sm text-green-600">
                      +{formatCurrency(valueIncrease)} ({percentIncrease.toFixed(1)}% increase)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-6 w-6" />
            Ready to Execute Your Strategy?
          </CardTitle>
          <CardDescription>
            Let's discuss how to implement your optimal exit scenario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="flex-1">
              <Link to="/portal/schedule-consultation">
                Schedule Strategy Session
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="flex-1">
              <Link to="/portal/week-1/path-discovery">
                Review Path Discovery Quiz
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
