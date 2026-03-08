
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ChevronRight,
  ChevronLeft,
  DollarSign,
  TrendingUp,
  BarChart3,
  Calculator,
  Sparkles,
  Target,
  AlertTriangle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────

interface DealInputs {
  ebitda: string;
  entryMultiple: string;
  debtMultiple: string;
  holdPeriod: string;
}

interface GrowthInputs {
  baseGrowthRate: string;
  baseExitMultiple: string;
  bullGrowthRate: string;
  bullExitMultiple: string;
  bearGrowthRate: string;
  bearExitMultiple: string;
}

interface ReturnsResult {
  entryEV: number;
  debt: number;
  equity: number;
  exitEbitda: number;
  exitEV: number;
  exitDebt: number;
  exitEquity: number;
  moic: number;
  irr: number;
  growthContrib: number;
  multipleContrib: number;
  leverageContrib: number;
}

// ─── Calculations ─────────────────────────────────────────────

function calculateReturns(
  ebitda: number,
  entryMultiple: number,
  debtMultiple: number,
  holdYears: number,
  growthRate: number,
  exitMultiple: number
): ReturnsResult {
  const entryEV = ebitda * entryMultiple;
  const debt = ebitda * debtMultiple;
  const equity = entryEV - debt;

  // Exit calculations
  const exitEbitda = ebitda * Math.pow(1 + growthRate / 100, holdYears);
  const exitEV = exitEbitda * exitMultiple;
  // Assume ~30% of debt paid down over hold period
  const debtPaydown = debt * 0.3;
  const exitDebt = debt - debtPaydown;
  const exitEquity = exitEV - exitDebt;

  const moic = equity > 0 ? exitEquity / equity : 0;
  const irr = equity > 0 && holdYears > 0 ? (Math.pow(moic, 1 / holdYears) - 1) * 100 : 0;

  // Returns attribution (how much of the gain came from each source)
  const totalGain = exitEquity - equity;
  const growthGain = (exitEbitda - ebitda) * exitMultiple;
  const multipleGain = (exitMultiple - entryMultiple) * ebitda;
  const leverageGain = debtPaydown;

  const totalAttrib = growthGain + multipleGain + leverageGain;
  const growthContrib = totalAttrib > 0 ? (growthGain / totalAttrib) * 100 : 0;
  const multipleContrib = totalAttrib > 0 ? (multipleGain / totalAttrib) * 100 : 0;
  const leverageContrib = totalAttrib > 0 ? (leverageGain / totalAttrib) * 100 : 0;

  return {
    entryEV, debt, equity, exitEbitda, exitEV, exitDebt, exitEquity,
    moic, irr, growthContrib, multipleContrib, leverageContrib,
  };
}

function calcIrrMoic(
  ebitda: number, entryMult: number, debtMult: number, holdYears: number,
  growthRate: number, exitMult: number
): { irr: number; moic: number } {
  const r = calculateReturns(ebitda, entryMult, debtMult, holdYears, growthRate, exitMult);
  return { irr: r.irr, moic: r.moic };
}

// ─── Intro Page ───────────────────────────────────────────────

const IntroPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-foreground">
      How PE Firms Calculate Their Returns
    </h2>

    <Alert className="border-primary/30 bg-primary/5">
      <Calculator className="h-4 w-4" />
      <AlertDescription>
        <span className="font-semibold">The bottom line:</span> Before a PE firm writes a check, they model
        exactly how much money they'll make. If the returns don't hit their targets (typically 20%+ IRR and 2.5x+ MOIC),
        they pass — no matter how good your company looks.
      </AlertDescription>
    </Alert>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-5 bg-card border-border">
        <DollarSign className="w-8 h-8 text-emerald-500 mb-3" />
        <h3 className="font-semibold text-lg mb-2">MOIC — Multiple on Invested Capital</h3>
        <p className="text-sm text-muted-foreground mb-3">
          How many times does the PE firm get their money back?
        </p>
        <div className="space-y-1 text-sm">
          <p>&#x2022; <strong>3.0x+ MOIC</strong> = Excellent. They tripled their money.</p>
          <p>&#x2022; <strong>2.0x-3.0x</strong> = Good. Meets most fund targets.</p>
          <p>&#x2022; <strong>1.5x-2.0x</strong> = Mediocre. Below most hurdle rates.</p>
          <p>&#x2022; <strong>&lt;1.5x</strong> = Bad deal. Capital was better deployed elsewhere.</p>
        </div>
      </Card>

      <Card className="p-5 bg-card border-border">
        <TrendingUp className="w-8 h-8 text-blue-500 mb-3" />
        <h3 className="font-semibold text-lg mb-2">IRR — Internal Rate of Return</h3>
        <p className="text-sm text-muted-foreground mb-3">
          What annualized percentage return does the investment generate?
        </p>
        <div className="space-y-1 text-sm">
          <p>&#x2022; <strong>25%+ IRR</strong> = Excellent. Top-quartile performance.</p>
          <p>&#x2022; <strong>20%-25%</strong> = Good. Meets typical PE fund targets.</p>
          <p>&#x2022; <strong>15%-20%</strong> = Acceptable for lower-risk deals.</p>
          <p>&#x2022; <strong>&lt;15%</strong> = Below most PE hurdle rates.</p>
        </div>
      </Card>
    </div>

    <Card className="p-5 bg-card border-border">
      <h3 className="font-semibold text-lg mb-3">Where PE Returns Come From</h3>
      <p className="text-sm text-muted-foreground mb-3">PE firms make money from three levers. Understanding this helps you negotiate:</p>
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mt-0.5 shrink-0">1</Badge>
          <div>
            <strong>EBITDA Growth</strong> — Growing your earnings during the hold period. This is why PE invests in growth.
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-0.5 shrink-0">2</Badge>
          <div>
            <strong>Multiple Expansion</strong> — Selling the company at a higher multiple than they paid. Happens through scale, quality, or market timing.
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mt-0.5 shrink-0">3</Badge>
          <div>
            <strong>Debt Paydown</strong> — Using company cash flow to pay off the acquisition debt. Free equity creation for PE.
          </div>
        </div>
      </div>
    </Card>

    <p className="text-muted-foreground text-sm">
      On the next pages, enter your deal numbers. You'll see sensitivity tables showing how small changes in growth or valuation multiples dramatically change PE returns.
    </p>
  </div>
);

// ─── Deal Setup Page ──────────────────────────────────────────

const DealSetupPage: React.FC<{
  inputs: DealInputs;
  setInputs: React.Dispatch<React.SetStateAction<DealInputs>>;
  markAnswered: () => void;
}> = ({ inputs, setInputs, markAnswered }) => {
  const ebitda = parseFloat(inputs.ebitda) || 0;
  const entryMult = parseFloat(inputs.entryMultiple) || 0;
  const debtMult = parseFloat(inputs.debtMultiple) || 0;

  const entryEV = ebitda * entryMult;
  const debt = ebitda * debtMult;
  const equity = entryEV - debt;

  React.useEffect(() => {
    if (inputs.ebitda && inputs.entryMultiple && inputs.holdPeriod) markAnswered();
  }, [inputs, markAnswered]);

  const handleChange = (field: keyof DealInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Deal Setup</h2>
      <p className="text-muted-foreground">
        These are the entry terms. How much is the company worth, how much debt is used, and how long does PE plan to hold it?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Current EBITDA ($M)</Label>
          <Input
            type="number"
            placeholder="e.g. 5"
            value={inputs.ebitda}
            onChange={(e) => handleChange('ebitda', e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">Your adjusted EBITDA today</p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Entry Multiple (x EBITDA)</Label>
          <Input
            type="number"
            step="0.5"
            placeholder="e.g. 6"
            value={inputs.entryMultiple}
            onChange={(e) => handleChange('entryMultiple', e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">What PE pays per dollar of EBITDA</p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Debt Multiple (x EBITDA)</Label>
          <Input
            type="number"
            step="0.5"
            placeholder="e.g. 3"
            value={inputs.debtMultiple}
            onChange={(e) => handleChange('debtMultiple', e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">How much debt is used (typically 2x-4x EBITDA)</p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Hold Period (years)</Label>
          <Input
            type="number"
            placeholder="e.g. 5"
            value={inputs.holdPeriod}
            onChange={(e) => handleChange('holdPeriod', e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">How long PE plans to own it (typically 3-7 years)</p>
        </div>
      </div>

      {/* Live deal summary */}
      {ebitda > 0 && entryMult > 0 && (
        <Card className="p-5 bg-card border-border">
          <h3 className="font-semibold mb-3">Deal Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">${entryEV.toFixed(1)}M</p>
              <p className="text-xs text-muted-foreground">Enterprise Value</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">${debt.toFixed(1)}M</p>
              <p className="text-xs text-muted-foreground">Debt</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">${equity.toFixed(1)}M</p>
              <p className="text-xs text-muted-foreground">Equity Check</p>
            </div>
          </div>
          {equity < 0 && (
            <Alert className="mt-3 border-red-500/30">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Debt exceeds enterprise value. Reduce the debt multiple.
              </AlertDescription>
            </Alert>
          )}
        </Card>
      )}

      <Alert className="border-blue-500/30 bg-blue-500/5">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <span className="font-semibold">Tip:</span> If you completed the EBITDA Calculator module,
          use your adjusted EBITDA number from there. For Industry Multipliers, use the range from that module as your entry multiple.
        </AlertDescription>
      </Alert>
    </div>
  );
};

// ─── Growth & Scenarios Page ──────────────────────────────────

const GrowthPage: React.FC<{
  growth: GrowthInputs;
  setGrowth: React.Dispatch<React.SetStateAction<GrowthInputs>>;
  markAnswered: () => void;
}> = ({ growth, setGrowth, markAnswered }) => {
  React.useEffect(() => {
    if (growth.baseGrowthRate && growth.baseExitMultiple) markAnswered();
  }, [growth, markAnswered]);

  const handleChange = (field: keyof GrowthInputs, value: string) => {
    setGrowth(prev => ({ ...prev, [field]: value }));
  };

  // Auto-fill bull/bear from base
  React.useEffect(() => {
    const baseGrowth = parseFloat(growth.baseGrowthRate);
    const baseExit = parseFloat(growth.baseExitMultiple);
    if (baseGrowth > 0 && !growth.bullGrowthRate) {
      setGrowth(prev => ({
        ...prev,
        bullGrowthRate: (baseGrowth * 1.5).toFixed(0),
        bearGrowthRate: Math.max(0, baseGrowth * 0.5).toFixed(0),
      }));
    }
    if (baseExit > 0 && !growth.bullExitMultiple) {
      setGrowth(prev => ({
        ...prev,
        bullExitMultiple: (baseExit + 1).toFixed(1),
        bearExitMultiple: Math.max(2, baseExit - 1.5).toFixed(1),
      }));
    }
  }, [growth.baseGrowthRate, growth.baseExitMultiple]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Growth & Exit Assumptions</h2>
      <p className="text-muted-foreground">
        How fast will the company grow under PE ownership, and what multiple will it sell for at exit?
        PE always models three scenarios.
      </p>

      {/* Base Case */}
      <Card className="p-5 bg-card border-blue-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Base Case</Badge>
          <span className="text-sm text-muted-foreground">Most likely scenario</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-sm">Annual Revenue Growth (%)</Label>
            <Input
              type="number"
              placeholder="e.g. 8"
              value={growth.baseGrowthRate}
              onChange={(e) => handleChange('baseGrowthRate', e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Exit Multiple (x EBITDA)</Label>
            <Input
              type="number"
              step="0.5"
              placeholder="e.g. 7"
              value={growth.baseExitMultiple}
              onChange={(e) => handleChange('baseExitMultiple', e.target.value)}
              className="bg-background"
            />
          </div>
        </div>
      </Card>

      {/* Bull Case */}
      <Card className="p-5 bg-card border-emerald-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Bull Case</Badge>
          <span className="text-sm text-muted-foreground">Everything goes right</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-sm">Annual Revenue Growth (%)</Label>
            <Input
              type="number"
              placeholder="e.g. 12"
              value={growth.bullGrowthRate}
              onChange={(e) => handleChange('bullGrowthRate', e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Exit Multiple (x EBITDA)</Label>
            <Input
              type="number"
              step="0.5"
              placeholder="e.g. 8"
              value={growth.bullExitMultiple}
              onChange={(e) => handleChange('bullExitMultiple', e.target.value)}
              className="bg-background"
            />
          </div>
        </div>
      </Card>

      {/* Bear Case */}
      <Card className="p-5 bg-card border-red-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Bear Case</Badge>
          <span className="text-sm text-muted-foreground">Things go wrong</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-sm">Annual Revenue Growth (%)</Label>
            <Input
              type="number"
              placeholder="e.g. 3"
              value={growth.bearGrowthRate}
              onChange={(e) => handleChange('bearGrowthRate', e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Exit Multiple (x EBITDA)</Label>
            <Input
              type="number"
              step="0.5"
              placeholder="e.g. 5"
              value={growth.bearExitMultiple}
              onChange={(e) => handleChange('bearExitMultiple', e.target.value)}
              className="bg-background"
            />
          </div>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        Bull/bear fields auto-fill from your base case. Adjust them to match your view.
      </p>
    </div>
  );
};

// ─── Sensitivity & Results Page ───────────────────────────────

const SensitivityPage: React.FC<{
  deal: DealInputs;
  growth: GrowthInputs;
}> = ({ deal, growth }) => {
  const ebitda = parseFloat(deal.ebitda) || 0;
  const entryMult = parseFloat(deal.entryMultiple) || 0;
  const debtMult = parseFloat(deal.debtMultiple) || 0;
  const holdYears = parseFloat(deal.holdPeriod) || 5;
  const baseGrowth = parseFloat(growth.baseGrowthRate) || 0;
  const baseExit = parseFloat(growth.baseExitMultiple) || 0;

  // Scenario results
  const baseResult = useMemo(() =>
    calculateReturns(ebitda, entryMult, debtMult, holdYears, baseGrowth, baseExit),
    [ebitda, entryMult, debtMult, holdYears, baseGrowth, baseExit]
  );

  const bullResult = useMemo(() =>
    calculateReturns(ebitda, entryMult, debtMult, holdYears,
      parseFloat(growth.bullGrowthRate) || baseGrowth,
      parseFloat(growth.bullExitMultiple) || baseExit),
    [ebitda, entryMult, debtMult, holdYears, growth, baseGrowth, baseExit]
  );

  const bearResult = useMemo(() =>
    calculateReturns(ebitda, entryMult, debtMult, holdYears,
      parseFloat(growth.bearGrowthRate) || baseGrowth,
      parseFloat(growth.bearExitMultiple) || baseExit),
    [ebitda, entryMult, debtMult, holdYears, growth, baseGrowth, baseExit]
  );

  // Entry multiple vs Exit multiple sensitivity
  const entryMultiples = [entryMult - 1, entryMult - 0.5, entryMult, entryMult + 0.5, entryMult + 1].filter(m => m > 0);
  const exitMultiples = [baseExit - 1, baseExit - 0.5, baseExit, baseExit + 0.5, baseExit + 1].filter(m => m > 0);

  // Growth vs Exit multiple sensitivity
  const growthRates = [0, Math.max(0, baseGrowth - 3), baseGrowth, baseGrowth + 3, baseGrowth + 6];

  const irrColor = (irr: number) => {
    if (irr >= 25) return 'text-emerald-400 bg-emerald-500/10';
    if (irr >= 20) return 'text-emerald-300 bg-emerald-500/5';
    if (irr >= 15) return 'text-yellow-400 bg-yellow-500/10';
    if (irr >= 10) return 'text-amber-400 bg-amber-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  return (
    <div className="space-y-6">
      {/* Scenario Comparison */}
      <h2 className="text-2xl font-bold text-foreground">Returns Analysis</h2>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Bull', result: bullResult, color: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-400' },
          { label: 'Base', result: baseResult, color: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-400' },
          { label: 'Bear', result: bearResult, color: 'border-red-500/30', badge: 'bg-red-500/20 text-red-400' },
        ].map(({ label, result, color, badge }) => (
          <Card key={label} className={`p-4 bg-card ${color}`}>
            <Badge className={`${badge} border-0 mb-3`}>{label} Case</Badge>
            <div className="space-y-2 text-center">
              <div>
                <p className="text-2xl font-bold">{result.moic.toFixed(1)}x</p>
                <p className="text-xs text-muted-foreground">MOIC</p>
              </div>
              <div>
                <p className={`text-xl font-bold ${result.irr >= 20 ? 'text-emerald-400' : result.irr >= 15 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {result.irr.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">IRR</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  ${result.equity.toFixed(1)}M → ${result.exitEquity.toFixed(1)}M
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Returns Attribution */}
      <Card className="p-5 bg-card border-border">
        <h3 className="font-semibold mb-3">Where Do the Returns Come From? (Base Case)</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500" /> EBITDA Growth
              </span>
              <span>{baseResult.growthContrib.toFixed(0)}%</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.max(0, Math.min(100, baseResult.growthContrib))}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" /> Multiple Expansion
              </span>
              <span>{baseResult.multipleContrib.toFixed(0)}%</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.max(0, Math.min(100, baseResult.multipleContrib))}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500" /> Debt Paydown
              </span>
              <span>{baseResult.leverageContrib.toFixed(0)}%</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.max(0, Math.min(100, baseResult.leverageContrib))}%` }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Sensitivity Table 1: Entry Multiple vs Exit Multiple */}
      <Card className="p-5 bg-card border-border">
        <h3 className="font-semibold mb-1">Sensitivity: Entry Multiple vs. Exit Multiple</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Shows IRR at {baseGrowth}% growth, {holdYears}-year hold. Green = PE target zone (20%+).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left text-xs text-muted-foreground">Entry ↓ / Exit →</th>
                {exitMultiples.map(ex => (
                  <th key={ex} className="p-2 text-center text-xs">{ex.toFixed(1)}x</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entryMultiples.map(en => (
                <tr key={en}>
                  <td className="p-2 text-xs font-medium">{en.toFixed(1)}x</td>
                  {exitMultiples.map(ex => {
                    const { irr } = calcIrrMoic(ebitda, en, debtMult, holdYears, baseGrowth, ex);
                    const isBase = Math.abs(en - entryMult) < 0.01 && Math.abs(ex - baseExit) < 0.01;
                    return (
                      <td key={ex} className={`p-2 text-center text-xs font-mono rounded ${irrColor(irr)} ${isBase ? 'ring-2 ring-primary' : ''}`}>
                        {irr.toFixed(0)}%
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sensitivity Table 2: Growth Rate vs Exit Multiple */}
      <Card className="p-5 bg-card border-border">
        <h3 className="font-semibold mb-1">Sensitivity: Growth Rate vs. Exit Multiple</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Shows IRR at {entryMult}x entry, {holdYears}-year hold.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left text-xs text-muted-foreground">Growth ↓ / Exit →</th>
                {exitMultiples.map(ex => (
                  <th key={ex} className="p-2 text-center text-xs">{ex.toFixed(1)}x</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {growthRates.map(gr => (
                <tr key={gr}>
                  <td className="p-2 text-xs font-medium">{gr.toFixed(0)}%</td>
                  {exitMultiples.map(ex => {
                    const { irr } = calcIrrMoic(ebitda, entryMult, debtMult, holdYears, gr, ex);
                    const isBase = Math.abs(gr - baseGrowth) < 0.01 && Math.abs(ex - baseExit) < 0.01;
                    return (
                      <td key={ex} className={`p-2 text-center text-xs font-mono rounded ${irrColor(irr)} ${isBase ? 'ring-2 ring-primary' : ''}`}>
                        {irr.toFixed(0)}%
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* What It Means */}
      <Alert className="border-primary/30 bg-primary/5">
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <span className="font-semibold">What this tells you:</span>{' '}
          {baseResult.irr >= 20
            ? `At your base case (${baseGrowth}% growth, ${baseExit}x exit), PE earns a ${baseResult.irr.toFixed(0)}% IRR and ${baseResult.moic.toFixed(1)}x MOIC. This deal works for PE, which means you're in a strong negotiating position.`
            : baseResult.irr >= 15
            ? `At your base case, PE earns a ${baseResult.irr.toFixed(0)}% IRR — below their typical 20% target. They'll either negotiate a lower entry price or need a strong growth story to justify the deal.`
            : `At your base case, the returns are ${baseResult.irr.toFixed(0)}% IRR — well below PE targets. The deal likely doesn't work at this price. PE would need a significantly lower entry multiple or much higher growth expectations.`
          }
          {baseResult.multipleContrib > 50 && ' Note: returns are heavily dependent on multiple expansion, which is risky. PE prefers growth-driven returns.'}
        </AlertDescription>
      </Alert>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────

export const ReturnsSensitivity: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageAnswered, setPageAnswered] = useState<Record<number, boolean>>({});

  const [deal, setDeal] = useState<DealInputs>(() => {
    // Pre-fill from Company Profile
    try {
      const raw = localStorage.getItem('company-profile-v1');
      if (raw) {
        const cp = JSON.parse(raw);
        return {
          ebitda: cp.ebitda ? String(cp.ebitda) : '',
          entryMultiple: '',
          debtMultiple: '3',
          holdPeriod: '5',
        };
      }
    } catch (e) { /* ignore */ }
    return { ebitda: '', entryMultiple: '', debtMultiple: '3', holdPeriod: '5' };
  });

  const [growth, setGrowth] = useState<GrowthInputs>(() => {
    // Pre-fill growth rate from Company Profile
    try {
      const raw = localStorage.getItem('company-profile-v1');
      if (raw) {
        const cp = JSON.parse(raw);
        return {
          baseGrowthRate: cp.revenueGrowthRate ? String(cp.revenueGrowthRate) : '',
          baseExitMultiple: '',
          bullGrowthRate: '',
          bullExitMultiple: '',
          bearGrowthRate: '',
          bearExitMultiple: '',
        };
      }
    } catch (e) { /* ignore */ }
    return {
      baseGrowthRate: '', baseExitMultiple: '',
      bullGrowthRate: '', bullExitMultiple: '',
      bearGrowthRate: '', bearExitMultiple: '',
    };
  });

  const pages = useMemo(() => [
    { title: 'How PE Calculates Returns', content: <IntroPage /> },
    {
      title: 'Deal Setup',
      content: (
        <DealSetupPage
          inputs={deal}
          setInputs={setDeal}
          markAnswered={() => setPageAnswered(p => ({ ...p, 1: true }))}
        />
      ),
    },
    {
      title: 'Growth & Scenarios',
      content: (
        <GrowthPage
          growth={growth}
          setGrowth={setGrowth}
          markAnswered={() => setPageAnswered(p => ({ ...p, 2: true }))}
        />
      ),
    },
    {
      title: 'Returns & Sensitivity',
      content: <SensitivityPage deal={deal} growth={growth} />,
    },
  ], [deal, growth]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Progress value={((currentPage + 1) / pages.length) * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Step {currentPage + 1} of {pages.length}</span>
          <span>{pages[currentPage].title}</span>
        </div>
      </div>

      <Card className="p-8 min-h-[600px] bg-card border-border">
        {pages[currentPage].content}
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </Button>

        <Button
          onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
          disabled={
            currentPage === pages.length - 1 ||
            (currentPage > 0 && currentPage < pages.length - 1 && !pageAnswered[currentPage])
          }
        >
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
