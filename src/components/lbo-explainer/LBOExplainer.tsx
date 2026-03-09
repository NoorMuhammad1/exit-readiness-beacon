import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, ChevronLeft, Download, DollarSign, TrendingUp,
  BookOpen, ArrowRight, Lightbulb, PieChart, BarChart3,
  FileText, Building2, Banknote, Calculator, Percent
} from 'lucide-react';

// ── Storage ─────────────────────────────────────────────────────

const STORAGE_KEY = 'lbo-explainer-v1';

type Tab = 'overview' | 'your-deal' | 'returns' | 'sensitivity';

interface DealInputs {
  ebitda: number;
  entryMultiple: number;
  debtPercent: number;
  interestRate: number;
  growthRate: number;
  holdPeriod: number;
  exitMultiple: number;
}

const defaultInputs: DealInputs = {
  ebitda: 5,
  entryMultiple: 6,
  debtPercent: 60,
  interestRate: 8,
  growthRate: 8,
  holdPeriod: 5,
  exitMultiple: 7,
};

// ── Helpers ─────────────────────────────────────────────────────

const fmt = (n: number, decimals = 1) => {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}B`;
  return `$${n.toFixed(decimals)}M`;
};

const fmtPct = (n: number) => `${n.toFixed(1)}%`;

// Simple MOIC & IRR calculations
const calcMOIC = (exitEquity: number, entryEquity: number) => {
  if (entryEquity <= 0) return 0;
  return exitEquity / entryEquity;
};

const calcIRR = (moic: number, years: number) => {
  if (moic <= 0 || years <= 0) return 0;
  return (Math.pow(moic, 1 / years) - 1) * 100;
};

// ── Main Component ──────────────────────────────────────────────

export function LBOExplainer() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [inputs, setInputs] = useState<DealInputs>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return { ...defaultInputs, ...JSON.parse(saved) }; } catch { return defaultInputs; }
    }
    return defaultInputs;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const updateInput = (key: keyof DealInputs, value: string) => {
    const num = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [key]: num }));
  };

  // ── Core Calculations ─────────────────────────────────────

  const enterpriseValue = inputs.ebitda * inputs.entryMultiple;
  const totalDebt = enterpriseValue * (inputs.debtPercent / 100);
  const equityInvested = enterpriseValue - totalDebt;
  const annualInterest = totalDebt * (inputs.interestRate / 100);

  // Year-by-year projections
  const years: {
    year: number;
    ebitda: number;
    cashFlow: number;
    debtPaydown: number;
    remainingDebt: number;
  }[] = [];

  let remainingDebt = totalDebt;
  for (let y = 1; y <= inputs.holdPeriod; y++) {
    const yearEbitda = inputs.ebitda * Math.pow(1 + inputs.growthRate / 100, y);
    const yearInterest = remainingDebt * (inputs.interestRate / 100);
    // Assume ~40% of EBITDA goes to debt service after interest, taxes, capex
    const freeCashFlow = yearEbitda * 0.4;
    const debtPaydown = Math.min(freeCashFlow, remainingDebt);
    remainingDebt = Math.max(0, remainingDebt - debtPaydown);

    years.push({
      year: y,
      ebitda: yearEbitda,
      cashFlow: freeCashFlow,
      debtPaydown,
      remainingDebt
    });
  }

  const exitEbitda = inputs.ebitda * Math.pow(1 + inputs.growthRate / 100, inputs.holdPeriod);
  const exitEV = exitEbitda * inputs.exitMultiple;
  const finalDebt = years.length > 0 ? years[years.length - 1].remainingDebt : totalDebt;
  const exitEquity = exitEV - finalDebt;
  const moic = calcMOIC(exitEquity, equityInvested);
  const irr = calcIRR(moic, inputs.holdPeriod);

  // Returns attribution
  const ebitdaGrowthValue = (exitEbitda - inputs.ebitda) * inputs.entryMultiple;
  const multipleExpansionValue = (inputs.exitMultiple - inputs.entryMultiple) * exitEbitda;
  const debtPaydownValue = totalDebt - finalDebt;
  const totalValueCreated = exitEquity - equityInvested;

  // Sensitivity tables
  const entryMultiples = [4, 5, 6, 7, 8];
  const exitMultiples = [5, 6, 7, 8, 9];
  const growthRates = [0, 5, 8, 10, 15];

  const calcScenarioMOIC = (entry: number, exit: number, growth: number) => {
    const ev = inputs.ebitda * entry;
    const debt = ev * (inputs.debtPercent / 100);
    const equity = ev - debt;
    let remDebt = debt;

    for (let y = 1; y <= inputs.holdPeriod; y++) {
      const yEbitda = inputs.ebitda * Math.pow(1 + growth / 100, y);
      const fcf = yEbitda * 0.4;
      const paydown = Math.min(fcf, remDebt);
      remDebt = Math.max(0, remDebt - paydown);
    }

    const exEbitda = inputs.ebitda * Math.pow(1 + growth / 100, inputs.holdPeriod);
    const exEV = exEbitda * exit;
    const exEquity = exEV - remDebt;
    return calcMOIC(exEquity, equity);
  };

  // ── CSV Export ─────────────────────────────────────────────

  const exportCSV = () => {
    const lines = [
      'LBO Analysis — PE Ready Plus',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      'INPUTS',
      `EBITDA,${fmt(inputs.ebitda)}`,
      `Entry Multiple,${inputs.entryMultiple}x`,
      `Debt %,${inputs.debtPercent}%`,
      `Interest Rate,${inputs.interestRate}%`,
      `Growth Rate,${inputs.growthRate}%`,
      `Hold Period,${inputs.holdPeriod} years`,
      `Exit Multiple,${inputs.exitMultiple}x`,
      '',
      'SOURCES & USES',
      `Enterprise Value,${fmt(enterpriseValue)}`,
      `Total Debt,${fmt(totalDebt)}`,
      `Equity Invested,${fmt(equityInvested)}`,
      '',
      'YEAR-BY-YEAR',
      'Year,EBITDA,Free Cash Flow,Debt Paydown,Remaining Debt',
      ...years.map(y => `${y.year},${y.ebitda.toFixed(1)},${y.cashFlow.toFixed(1)},${y.debtPaydown.toFixed(1)},${y.remainingDebt.toFixed(1)}`),
      '',
      'EXIT',
      `Exit EBITDA,${fmt(exitEbitda)}`,
      `Exit Enterprise Value,${fmt(exitEV)}`,
      `Remaining Debt at Exit,${fmt(finalDebt)}`,
      `Exit Equity Value,${fmt(exitEquity)}`,
      '',
      'RETURNS',
      `MOIC,${moic.toFixed(2)}x`,
      `IRR,${fmtPct(irr)}`,
      `Total Value Created,${fmt(totalValueCreated)}`,
      `From EBITDA Growth,${fmt(ebitdaGrowthValue)}`,
      `From Multiple Expansion,${fmt(multipleExpansionValue)}`,
      `From Debt Paydown,${fmt(debtPaydownValue)}`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lbo-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Tab Navigation ────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'How PE Makes Money', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'your-deal', label: 'Your Deal Model', icon: <Calculator className="w-4 h-4" /> },
    { id: 'returns', label: 'Returns Breakdown', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'sensitivity', label: 'What-If Tables', icon: <PieChart className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Tab Bar */}
      <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-white/10 text-white border-b-2 border-purple-400'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab 1: Overview ─────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">How PE Firms Actually Make Money</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                A leveraged buyout (LBO) is how PE firms buy companies. The word "leveraged" means they use
                <strong className="text-white"> borrowed money</strong> — a lot of it. A typical deal is 50-70% debt
                and 30-50% equity. The PE firm puts up the equity. The banks put up the debt.
                <strong className="text-white"> Your company's cash flow pays off the loan.</strong>
              </p>
              <p className="text-white/70 leading-relaxed">
                That's the core insight: PE firms use your business to pay back the money they borrowed to buy it.
                If things go well, they sell the company in 3-7 years for more than they paid — and the combination
                of growth, debt paydown, and a higher sale price creates massive returns on their equity.
              </p>
            </CardContent>
          </Card>

          {/* The Three Levers */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">The Three Ways PE Firms Make Money</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-5">
                  <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-green-400 font-bold mb-2">1. Grow the EBITDA</h3>
                  <p className="text-white/60 text-sm">
                    Increase revenue, improve margins, cut costs, make acquisitions. If EBITDA grows from $5M to $8M,
                    the company is worth more when they sell — even at the same multiple.
                  </p>
                  <div className="mt-3 text-green-300/60 text-xs">
                    This is why PE firms push hard on "value creation plans" and operational improvements.
                  </div>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-5">
                  <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-blue-400 font-bold mb-2">2. Expand the Multiple</h3>
                  <p className="text-white/60 text-sm">
                    Buy at 6x EBITDA, sell at 8x. This can happen through: growing into a larger size bracket,
                    improving the business mix, building recurring revenue, or simply riding market conditions.
                  </p>
                  <div className="mt-3 text-blue-300/60 text-xs">
                    Larger companies trade at higher multiples. Growing from $5M to $10M EBITDA can itself push the multiple up.
                  </div>
                </div>
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-5">
                  <Banknote className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-purple-400 font-bold mb-2">3. Pay Down Debt</h3>
                  <p className="text-white/60 text-sm">
                    Every dollar of debt paid down is a dollar that goes to equity holders at exit. If they borrowed
                    $18M and paid it down to $5M, that's $13M of value created from the company's own cash flow.
                  </p>
                  <div className="mt-3 text-purple-300/60 text-xs">
                    This is the "free" return — the business pays off the loan while the PE firm owns it.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simple Example */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">A Simple Example — From Your Perspective</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-mono">
                <div className="text-white/40 text-xs uppercase tracking-wider pb-2">Day 1: The Purchase</div>
                <div className="flex justify-between text-white/80 py-2 border-b border-white/10">
                  <span>Your EBITDA</span><span>$5M</span>
                </div>
                <div className="flex justify-between text-white/80 py-2 border-b border-white/10">
                  <span>PE firm pays 6x EBITDA</span><span>$30M (Enterprise Value)</span>
                </div>
                <div className="flex justify-between text-blue-300/80 py-2 border-b border-white/10">
                  <span>Banks lend 60%</span><span>$18M (Debt)</span>
                </div>
                <div className="flex justify-between text-green-300/80 py-2 border-b border-white/10">
                  <span>PE firm puts up 40%</span><span>$12M (Equity)</span>
                </div>

                <div className="text-white/40 text-xs uppercase tracking-wider pb-2 pt-4">Year 5: The Exit</div>
                <div className="flex justify-between text-white/80 py-2 border-b border-white/10">
                  <span>EBITDA grew 8%/year to</span><span>$7.3M</span>
                </div>
                <div className="flex justify-between text-white/80 py-2 border-b border-white/10">
                  <span>New buyer pays 7x</span><span>$51.4M (Exit EV)</span>
                </div>
                <div className="flex justify-between text-purple-300/80 py-2 border-b border-white/10">
                  <span>Remaining debt (paid down over 5 years)</span><span>−$3.4M</span>
                </div>
                <div className="flex justify-between text-white py-3 border-t-2 border-green-500/40 mt-2">
                  <span className="font-bold">PE firm's equity at exit</span><span className="font-bold text-green-400">$48.0M</span>
                </div>
                <div className="flex justify-between text-white/60 py-2">
                  <span>Return on $12M invested</span><span className="text-green-400 font-bold">4.0x MOIC / ~32% IRR</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                  <p className="text-white/70 text-sm">
                    <strong className="text-yellow-300">The "aha moment":</strong> The PE firm invested $12M of their own money
                    and got back $48M — a 4x return. But your company's cash flow paid off $14.6M of debt, and EBITDA
                    growth added most of the rest. The PE firm made 4x <em>because your business did the heavy lifting.</em>
                    This is why they care so much about EBITDA and cash flow — it literally pays their bills.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What This Means for You */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-3">What This Means for You as the Seller</h3>
              <div className="space-y-3">
                {[
                  { title: 'Your EBITDA determines the price.', desc: 'EBITDA × multiple = enterprise value. Higher EBITDA = higher check. This is why the QoE report matters so much.' },
                  { title: 'Your cash flow determines if the deal works.', desc: 'If your cash flow can\'t service the debt, the PE firm can\'t get their financing. Deals fall apart here.' },
                  { title: 'Growth makes the PE firm\'s math work.', desc: 'PE firms need to believe your business will grow. No growth story = lower offer or no offer at all.' },
                  { title: 'Understanding the LBO gives you negotiating power.', desc: 'If you know the PE firm will make 3-4x their money, you can push for a higher price and still leave them a good deal.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <span className="text-white font-medium text-sm">{item.title}</span>
                      <span className="text-white/60 text-sm"> {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => setActiveTab('your-deal')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Model Your Deal <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 2: Your Deal Model ─────────────────────────── */}
      {activeTab === 'your-deal' && (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">Model a Deal with Your Numbers</h2>
              <p className="text-white/60 text-sm">
                Enter your EBITDA and assumptions below. See how a PE firm would structure the deal
                and what their returns look like. This helps you understand why they offer what they offer.
              </p>
            </CardContent>
          </Card>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'ebitda' as const, label: 'Your EBITDA ($M)', min: 0.5, max: 100, step: 0.5, suffix: 'M' },
              { key: 'entryMultiple' as const, label: 'Entry Multiple', min: 3, max: 15, step: 0.5, suffix: 'x' },
              { key: 'debtPercent' as const, label: 'Debt % of Purchase', min: 30, max: 80, step: 5, suffix: '%' },
              { key: 'interestRate' as const, label: 'Interest Rate', min: 4, max: 15, step: 0.5, suffix: '%' },
              { key: 'growthRate' as const, label: 'Annual EBITDA Growth', min: 0, max: 30, step: 1, suffix: '%' },
              { key: 'holdPeriod' as const, label: 'Hold Period (Years)', min: 3, max: 7, step: 1, suffix: ' yrs' },
              { key: 'exitMultiple' as const, label: 'Exit Multiple', min: 3, max: 15, step: 0.5, suffix: 'x' },
            ].map(field => (
              <Card key={field.key} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <label className="text-white/60 text-xs uppercase tracking-wider">{field.label}</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={inputs[field.key]}
                      onChange={e => updateInput(field.key, e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-white font-mono text-sm w-16 text-right">
                      {field.key === 'ebitda' ? `$${inputs[field.key]}M` : `${inputs[field.key]}${field.suffix}`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sources & Uses */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base">Sources & Uses — How the Deal Is Funded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Sources (Where the money comes from)</div>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between text-blue-300 py-2 border-b border-white/10">
                      <span>Bank Debt ({inputs.debtPercent}%)</span><span>{fmt(totalDebt)}</span>
                    </div>
                    <div className="flex justify-between text-green-300 py-2 border-b border-white/10">
                      <span>PE Equity ({100 - inputs.debtPercent}%)</span><span>{fmt(equityInvested)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold py-2">
                      <span>Total</span><span>{fmt(enterpriseValue)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Uses (Where it goes)</div>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between text-white/80 py-2 border-b border-white/10">
                      <span>Purchase Price (to you)</span><span>{fmt(enterpriseValue)}</span>
                    </div>
                    <div className="flex justify-between text-white/50 py-2 border-b border-white/10">
                      <span>Transaction fees (~2-3%)</span><span className="text-white/40">not modeled</span>
                    </div>
                    <div className="flex justify-between text-white font-bold py-2">
                      <span>Total</span><span>{fmt(enterpriseValue)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual bar */}
              <div className="mt-4">
                <div className="flex h-8 rounded-lg overflow-hidden">
                  <div
                    className="bg-blue-500/60 flex items-center justify-center text-xs text-white font-medium"
                    style={{ width: `${inputs.debtPercent}%` }}
                  >
                    Debt {fmt(totalDebt)}
                  </div>
                  <div
                    className="bg-green-500/60 flex items-center justify-center text-xs text-white font-medium"
                    style={{ width: `${100 - inputs.debtPercent}%` }}
                  >
                    Equity {fmt(equityInvested)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Year-by-Year Table */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base">Year-by-Year: How Your Cash Flow Pays the Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="text-white/40 text-xs border-b border-white/10">
                      <th className="text-left py-2">Year</th>
                      <th className="text-right py-2">EBITDA</th>
                      <th className="text-right py-2">Free Cash Flow</th>
                      <th className="text-right py-2">Debt Paydown</th>
                      <th className="text-right py-2">Remaining Debt</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-white/50 border-b border-white/5">
                      <td className="py-2">Entry</td>
                      <td className="text-right">{fmt(inputs.ebitda)}</td>
                      <td className="text-right">—</td>
                      <td className="text-right">—</td>
                      <td className="text-right text-blue-300">{fmt(totalDebt)}</td>
                    </tr>
                    {years.map(y => (
                      <tr key={y.year} className="text-white/70 border-b border-white/5">
                        <td className="py-2">{y.year}</td>
                        <td className="text-right">{fmt(y.ebitda)}</td>
                        <td className="text-right text-green-300/70">{fmt(y.cashFlow)}</td>
                        <td className="text-right text-purple-300/70">{fmt(y.debtPaydown)}</td>
                        <td className="text-right text-blue-300">{fmt(y.remainingDebt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-white/30 text-xs mt-2">
                Free cash flow estimated at ~40% of EBITDA (after interest, taxes, and capex). Simplified for educational purposes.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              onClick={() => setActiveTab('overview')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              onClick={() => setActiveTab('returns')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              See the Returns <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 3: Returns Breakdown ───────────────────────── */}
      {activeTab === 'returns' && (
        <div className="space-y-6">
          {/* Returns Summary */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">The PE Firm's Returns</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">{moic.toFixed(2)}x</div>
                  <div className="text-white/50 text-xs mt-1">MOIC</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">{fmtPct(irr)}</div>
                  <div className="text-white/50 text-xs mt-1">IRR</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{fmt(equityInvested)}</div>
                  <div className="text-white/50 text-xs mt-1">Equity In</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{fmt(exitEquity)}</div>
                  <div className="text-white/50 text-xs mt-1">Equity Out</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exit Waterfall */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base">Exit Waterfall — Where the Money Goes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between text-white/80 py-2 border-b border-white/10">
                  <span>Exit EBITDA ({fmtPct(inputs.growthRate)} growth × {inputs.holdPeriod} years)</span>
                  <span>{fmt(exitEbitda)}</span>
                </div>
                <div className="flex justify-between text-white/80 py-2 border-b border-white/10">
                  <span>Exit Multiple</span><span>{inputs.exitMultiple}x</span>
                </div>
                <div className="flex justify-between text-white py-2 border-b border-white/10 font-bold">
                  <span>Exit Enterprise Value</span><span>{fmt(exitEV)}</span>
                </div>
                <div className="flex justify-between text-red-300/80 py-2 border-b border-white/10">
                  <span>− Remaining Debt</span><span>−{fmt(finalDebt)}</span>
                </div>
                <div className="flex justify-between text-green-400 py-3 border-t-2 border-green-500/40 mt-2 font-bold text-lg">
                  <span>PE Firm's Equity at Exit</span><span>{fmt(exitEquity)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Returns Attribution */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base">Where Did the Returns Come From?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'EBITDA Growth', value: ebitdaGrowthValue, color: 'bg-green-500', pct: totalValueCreated > 0 ? (ebitdaGrowthValue / totalValueCreated * 100) : 0 },
                  { label: 'Multiple Expansion', value: multipleExpansionValue, color: 'bg-blue-500', pct: totalValueCreated > 0 ? (multipleExpansionValue / totalValueCreated * 100) : 0 },
                  { label: 'Debt Paydown', value: debtPaydownValue, color: 'bg-purple-500', pct: totalValueCreated > 0 ? (debtPaydownValue / totalValueCreated * 100) : 0 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">{item.label}</span>
                      <span className="text-white font-mono">{fmt(item.value)} ({item.pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color}/60 rounded-full transition-all`}
                        style={{ width: `${Math.max(0, Math.min(100, item.pct))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <p className="text-white/70 text-sm">
                  <strong className="text-purple-300">Total value created:</strong> {fmt(totalValueCreated)} on {fmt(equityInvested)} invested.
                  {ebitdaGrowthValue > multipleExpansionValue && ebitdaGrowthValue > debtPaydownValue
                    ? ' EBITDA growth is the biggest driver — this is why PE firms focus so hard on operational improvement.'
                    : multipleExpansionValue > ebitdaGrowthValue
                    ? ' Multiple expansion is doing the heavy lifting here — buying low and selling high.'
                    : ' Debt paydown is a major contributor — your cash flow is literally building the PE firm\'s equity.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What This Means */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">What This Means for Your Negotiation</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {moic >= 3
                      ? `At ${moic.toFixed(1)}x MOIC, this is a very attractive deal for the PE firm. That means there's room to negotiate a higher entry price. Even at ${inputs.entryMultiple + 0.5}x, the deal still works for them. Don't leave money on the table.`
                      : moic >= 2
                      ? `At ${moic.toFixed(1)}x MOIC, this is a solid deal for the PE firm. The returns are in the typical target range (2.5-3.5x). You're in a fair negotiating position.`
                      : `At ${moic.toFixed(1)}x MOIC, this deal is on the edge for most PE firms. They typically target 2.5-3.5x. If your growth story isn't strong or if they need a higher return, they may push for a lower price.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              onClick={() => setActiveTab('your-deal')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              onClick={() => setActiveTab('sensitivity')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              What-If Analysis <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 4: Sensitivity Tables ──────────────────────── */}
      {activeTab === 'sensitivity' && (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">What-If Analysis</h2>
              <p className="text-white/60 text-sm">
                These tables show how the PE firm's returns change with different assumptions.
                The highlighted cell is your current scenario. Green = attractive deal for PE (3x+).
                Yellow = decent (2-3x). Red = tough sell (&lt;2x).
              </p>
            </CardContent>
          </Card>

          {/* Table 1: Entry Multiple vs Exit Multiple */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base">Entry Multiple vs. Exit Multiple (MOIC)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr>
                      <th className="text-left py-2 text-white/40 text-xs">Entry ↓ / Exit →</th>
                      {exitMultiples.map(em => (
                        <th key={em} className={`text-center py-2 px-3 text-xs ${em === inputs.exitMultiple ? 'text-purple-300 font-bold' : 'text-white/40'}`}>
                          {em}x
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entryMultiples.map(entry => (
                      <tr key={entry} className="border-t border-white/5">
                        <td className={`py-2 text-xs ${entry === inputs.entryMultiple ? 'text-purple-300 font-bold' : 'text-white/40'}`}>
                          {entry}x
                        </td>
                        {exitMultiples.map(exit => {
                          const m = calcScenarioMOIC(entry, exit, inputs.growthRate);
                          const isCurrent = entry === inputs.entryMultiple && exit === inputs.exitMultiple;
                          return (
                            <td
                              key={exit}
                              className={`text-center py-2 px-3 text-xs rounded ${
                                isCurrent ? 'ring-2 ring-purple-400 font-bold ' : ''
                              }${
                                m >= 3 ? 'text-green-400 bg-green-500/10' :
                                m >= 2 ? 'text-yellow-400 bg-yellow-500/10' :
                                'text-red-400 bg-red-500/10'
                              }`}
                            >
                              {m.toFixed(1)}x
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Table 2: Growth Rate vs Exit Multiple */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base">Growth Rate vs. Exit Multiple (MOIC)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr>
                      <th className="text-left py-2 text-white/40 text-xs">Growth ↓ / Exit →</th>
                      {exitMultiples.map(em => (
                        <th key={em} className={`text-center py-2 px-3 text-xs ${em === inputs.exitMultiple ? 'text-purple-300 font-bold' : 'text-white/40'}`}>
                          {em}x
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {growthRates.map(growth => (
                      <tr key={growth} className="border-t border-white/5">
                        <td className={`py-2 text-xs ${growth === inputs.growthRate ? 'text-purple-300 font-bold' : 'text-white/40'}`}>
                          {growth}%
                        </td>
                        {exitMultiples.map(exit => {
                          const m = calcScenarioMOIC(inputs.entryMultiple, exit, growth);
                          const isCurrent = growth === inputs.growthRate && exit === inputs.exitMultiple;
                          return (
                            <td
                              key={exit}
                              className={`text-center py-2 px-3 text-xs rounded ${
                                isCurrent ? 'ring-2 ring-purple-400 font-bold ' : ''
                              }${
                                m >= 3 ? 'text-green-400 bg-green-500/10' :
                                m >= 2 ? 'text-yellow-400 bg-yellow-500/10' :
                                'text-red-400 bg-red-500/10'
                              }`}
                            >
                              {m.toFixed(1)}x
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Key Takeaway */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Reading the Tables</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Notice how the returns get much better moving right (higher exit multiple) and down (more growth).
                    A PE firm buying at 6x and selling at 8x with solid growth makes excellent returns. But buying at 8x
                    and selling at 6x — even with growth — is a disaster. <strong className="text-white">This is why PE firms
                    are so disciplined on entry price.</strong> They'd rather walk away than overpay.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer + Export */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <p className="text-white/40 text-xs mb-4">
                <strong className="text-white/60">Important:</strong> This is a simplified educational model. Real LBO models
                include detailed debt schedules, tax effects, management fees, transaction costs, and more complex cash flow
                projections. Use this to understand the concepts — your M&A advisor will build the real model.
              </p>
              <div className="flex gap-3">
                <Button onClick={exportCSV} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Download className="w-4 h-4 mr-2" /> Export Analysis (CSV)
                </Button>
                <Button onClick={() => setInputs(defaultInputs)} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
