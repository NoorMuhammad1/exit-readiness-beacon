import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, ChevronLeft, Download, BookOpen, TrendingUp,
  AlertTriangle, CheckCircle2, DollarSign, Users, Lightbulb,
  Clock, PieChart, ArrowRight, Layers, Shield, Scale,
  Calculator, FileText, Lock, Unlock
} from 'lucide-react';

// ── Storage ─────────────────────────────────────────────────────

const STORAGE_KEY = 'rollover-equity-v1';

type Tab = 'overview' | 'mechanics' | 'calculator' | 'report';

interface CalcInputs {
  dealValue: number;
  ebitda: number;
  entryMultiple: number;
  rolloverPercent: number;
  holdPeriod: number;
  ebitdaGrowthRate: number;
  exitMultiple: number;
  debtPercent: number;
  interestRate: number;
  mepPoolPercent: number;
}

const defaultInputs: CalcInputs = {
  dealValue: 20,
  ebitda: 4,
  entryMultiple: 5,
  rolloverPercent: 25,
  holdPeriod: 5,
  ebitdaGrowthRate: 10,
  exitMultiple: 6,
  debtPercent: 50,
  interestRate: 7,
  mepPoolPercent: 10,
};

// ── Helpers ─────────────────────────────────────────────────────

const fmt = (n: number) => {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}B`;
  if (Math.abs(n) >= 1) return `$${n.toFixed(1)}M`;
  return `$${(n * 1000).toFixed(0)}K`;
};

const pct = (n: number) => `${n.toFixed(1)}%`;

// ── Main Component ──────────────────────────────────────────────

export function RolloverEquity() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [inputs, setInputs] = useState<CalcInputs>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return { ...defaultInputs, ...JSON.parse(saved) }; } catch { return defaultInputs; }
    }
    return defaultInputs;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const updateInput = (key: keyof CalcInputs, value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
    setInputs(prev => ({ ...prev, [key]: num }));
  };

  // ── Calculator Logic ──────────────────────────────────────

  // First bite
  const cashAtClose = inputs.dealValue * (1 - inputs.rolloverPercent / 100);
  const rolloverAmount = inputs.dealValue * (inputs.rolloverPercent / 100);

  // Entry deal structure
  const entryDebt = inputs.dealValue * (inputs.debtPercent / 100);
  const entryEquity = inputs.dealValue - entryDebt;
  const sellerEquityPercent = (rolloverAmount / entryEquity) * 100;

  // Exit calculations
  const exitEbitda = inputs.ebitda * Math.pow(1 + inputs.ebitdaGrowthRate / 100, inputs.holdPeriod);
  const exitEnterpriseValue = exitEbitda * inputs.exitMultiple;

  // Debt paydown (simplified — interest-only then paydown from cash flow)
  let remainingDebt = entryDebt;
  for (let y = 0; y < inputs.holdPeriod; y++) {
    const yearEbitda = inputs.ebitda * Math.pow(1 + inputs.ebitdaGrowthRate / 100, y);
    const interestPayment = remainingDebt * (inputs.interestRate / 100);
    const freeCashForDebt = Math.max(0, yearEbitda * 0.4 - interestPayment); // ~40% of EBITDA for debt service
    remainingDebt = Math.max(0, remainingDebt - freeCashForDebt);
  }

  const exitEquityValue = exitEnterpriseValue - remainingDebt;

  // MEP pool dilution
  const mepDilution = inputs.mepPoolPercent / 100;
  const postMepEquityValue = exitEquityValue * (1 - mepDilution);

  // Seller's second bite
  const sellerExitOwnership = sellerEquityPercent / 100;
  const secondBiteGross = postMepEquityValue * sellerExitOwnership;
  const secondBiteProfit = secondBiteGross - rolloverAmount;
  const rolloverMOIC = rolloverAmount > 0 ? secondBiteGross / rolloverAmount : 0;

  // Total proceeds
  const totalProceeds = cashAtClose + secondBiteGross;
  const noRolloverProceeds = inputs.dealValue;
  const rolloverBenefit = totalProceeds - noRolloverProceeds;

  // PE firm returns (for context)
  const peEquity = entryEquity - rolloverAmount;
  const peExitShare = (peEquity / entryEquity) * postMepEquityValue;
  const peMOIC = peEquity > 0 ? peExitShare / peEquity : 0;

  // ── CSV Export ─────────────────────────────────────────────

  const exportCSV = () => {
    const lines = [
      'Second Bite Calculator — PE Ready Plus',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      'DEAL INPUTS',
      `Deal Value (Enterprise),${fmt(inputs.dealValue)}`,
      `EBITDA,${fmt(inputs.ebitda)}`,
      `Entry Multiple,${inputs.entryMultiple}x`,
      `Rollover %,${inputs.rolloverPercent}%`,
      `Hold Period,${inputs.holdPeriod} years`,
      `EBITDA Growth Rate,${inputs.ebitdaGrowthRate}%`,
      `Exit Multiple,${inputs.exitMultiple}x`,
      `Debt %,${inputs.debtPercent}%`,
      `Interest Rate,${inputs.interestRate}%`,
      `MEP Pool,${inputs.mepPoolPercent}%`,
      '',
      'FIRST BITE',
      `Cash at Close,${fmt(cashAtClose)}`,
      `Rollover Amount,${fmt(rolloverAmount)}`,
      '',
      'SECOND BITE',
      `Exit Enterprise Value,${fmt(exitEnterpriseValue)}`,
      `Exit EBITDA,${fmt(exitEbitda)}`,
      `Remaining Debt at Exit,${fmt(remainingDebt)}`,
      `Exit Equity Value,${fmt(exitEquityValue)}`,
      `Your Ownership,${pct(sellerEquityPercent)}`,
      `Your Exit Proceeds,${fmt(secondBiteGross)}`,
      `Profit on Rollover,${fmt(secondBiteProfit)}`,
      `Rollover MOIC,${rolloverMOIC.toFixed(2)}x`,
      '',
      'TOTAL',
      `First Bite (Cash),${fmt(cashAtClose)}`,
      `Second Bite (Exit),${fmt(secondBiteGross)}`,
      `Total Proceeds,${fmt(totalProceeds)}`,
      `vs. No Rollover,${fmt(noRolloverProceeds)}`,
      `Benefit of Rolling Over,${fmt(rolloverBenefit)}`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `second-bite-calculator-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Tabs ──────────────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'The Second Bite', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'mechanics', label: 'How It Works', icon: <Layers className="w-4 h-4" /> },
    { id: 'calculator', label: 'Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'report', label: 'Your Analysis', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
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
              <h2 className="text-2xl font-bold text-white mb-4">Why PE Wants You to Keep Skin in the Game</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                In most PE deals, you don't sell 100% and walk away. The buyer will ask you to
                <strong className="text-white"> "roll over" 20-30% of your equity</strong> — reinvesting it
                into the new company alongside their money. This isn't optional for most sellers. It's expected.
              </p>
              <p className="text-white/70 leading-relaxed">
                Here's the thing nobody tells you upfront: <strong className="text-white">the second exit
                is often worth more than the first.</strong> That 20-30% you rolled over? If the PE firm
                grows the company and sells it again in 3-5 years, your smaller slice of a much bigger pie
                can pay out more than your original sale.
              </p>
            </CardContent>
          </Card>

          {/* Two Bites Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-green-500/5 border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-400 text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  First Bite — The Day You Sell
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white/70 text-sm leading-relaxed">
                  You receive <strong className="text-white">70-80% of the purchase price in cash</strong> at closing.
                  This is your guaranteed payout — it's in your bank account, taxed, and done.
                </p>
                <div className="bg-white/[0.03] rounded-lg p-3">
                  <div className="text-white/40 text-xs mb-1">Example: $20M deal, 25% rollover</div>
                  <div className="text-green-400 text-2xl font-bold">$15M cash at close</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-500/5 border-purple-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-400 text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Second Bite — When PE Exits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white/70 text-sm leading-relaxed">
                  Your rolled-over equity rides along as the company grows. When the PE firm sells
                  (typically 3-5 years later), <strong className="text-white">your slice gets paid out
                  at the new, higher valuation.</strong>
                </p>
                <div className="bg-white/[0.03] rounded-lg p-3">
                  <div className="text-white/40 text-xs mb-1">If company doubles in value...</div>
                  <div className="text-purple-400 text-2xl font-bold">$5M → $10M+</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Why PE Wants Rollover */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Why PE Firms Insist on Rollover
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    title: 'Alignment of Interests',
                    description: 'If you still own equity, you\'re motivated to help the company succeed post-close. Your incentives are aligned with the PE firm\'s — you both win when the company grows.',
                  },
                  {
                    title: 'Confidence Signal',
                    description: 'Rolling over says "I believe in this company\'s future." If you refuse to roll any equity, the PE firm wonders what you know that they don\'t.',
                  },
                  {
                    title: 'Reduces Cash Needed',
                    description: 'Every dollar you roll is a dollar the PE firm doesn\'t have to raise. On a $20M deal, a 25% rollover saves them $5M in equity they\'d otherwise need from their fund.',
                  },
                  {
                    title: 'Transition Insurance',
                    description: 'With skin in the game, you\'re more likely to stay engaged during the transition period, help with customer relationships, and ensure a smooth handoff.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-white font-medium text-sm">{item.title}:</span>
                      <span className="text-white/60 text-sm ml-1">{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tax Benefit */}
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-green-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-green-300 font-semibold mb-2">The Tax Benefit Nobody Mentions</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    When structured properly, rollover equity is <strong className="text-white">tax-deferred</strong>.
                    You don't pay tax on the portion you roll over until the second exit. If you roll $5M and it
                    becomes $10M, you only pay tax when you actually receive the cash at exit #2. That's years of
                    tax-free compounding. Your CPA and tax attorney should be involved in structuring this correctly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => setActiveTab('mechanics')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              How It Works <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 2: Mechanics ────────────────────────────────── */}
      {activeTab === 'mechanics' && (
        <div className="space-y-6">
          {/* MEPs Section */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">Management Equity Plans (MEPs)</h2>
              <p className="text-white/60 text-sm">
                Beyond your rollover, PE firms create a separate equity pool — typically 10-15% of total equity — to
                incentivize management. If you're staying on as CEO/president, you'll participate in this pool too.
              </p>
            </CardContent>
          </Card>

          {/* MEP Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/20/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  The Equity Pool
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-white/70">PE firms typically reserve <strong className="text-white">10-15% of total equity</strong> for the management team.</p>
                <p className="text-white/70">This is split among the CEO, CFO, and key leaders based on importance and retention risk.</p>
                <p className="text-white/70">The pool <strong className="text-white">dilutes all equity holders</strong> — including the PE firm and your rollover. Everyone shares the dilution proportionally.</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-500/5 border-yellow-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-yellow-400 text-base flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Vesting — When You Actually Own It
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-white/70">MEP equity doesn't vest all at once. Typical structure:</p>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400/60"></div>
                    <span className="text-white/60"><strong className="text-white">Time-based:</strong> 4-year vest with 1-year cliff (25% per year)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400/60"></div>
                    <span className="text-white/60"><strong className="text-white">Performance-based:</strong> Vest when EBITDA or revenue hits specific targets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400/60"></div>
                    <span className="text-white/60"><strong className="text-white">Hybrid:</strong> 50% time-based, 50% performance-based (most common)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Good Leaver / Bad Leaver */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-400" />
                Good Leaver vs. Bad Leaver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/60 text-sm mb-4">
                What happens to your equity if you leave before the PE firm sells? It depends on WHY you leave.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Unlock className="w-4 h-4 text-green-400" />
                    <h4 className="text-green-400 font-semibold text-sm">Good Leaver</h4>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed mb-2">
                    You leave for an acceptable reason: retirement, disability, death, termination without cause,
                    or mutual agreement.
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400/60 mt-0.5 shrink-0" />
                      <span className="text-white/50 text-xs">Keep all vested equity</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400/60 mt-0.5 shrink-0" />
                      <span className="text-white/50 text-xs">Unvested equity typically bought back at fair market value</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400/60 mt-0.5 shrink-0" />
                      <span className="text-white/50 text-xs">Rollover equity is yours regardless (you paid for it)</span>
                    </div>
                  </div>
                </div>
                <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-red-400" />
                    <h4 className="text-red-400 font-semibold text-sm">Bad Leaver</h4>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed mb-2">
                    You leave for a bad reason: termination for cause, breach of non-compete, voluntary resignation
                    without approval.
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-red-400/60 mt-0.5 shrink-0" />
                      <span className="text-white/50 text-xs">Unvested equity is forfeited entirely</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-red-400/60 mt-0.5 shrink-0" />
                      <span className="text-white/50 text-xs">Vested equity may be bought back at COST (not market value)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400/60 mt-0.5 shrink-0" />
                      <span className="text-white/50 text-xs">Rollover equity is still yours (you bought it)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Waterfall */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                The Waterfall — How Money Flows at Exit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/60 text-sm mb-4">
                When the PE firm sells the company, money doesn't get split evenly. It flows in a specific order,
                called the "waterfall." Understanding this is crucial — it determines what you actually receive.
              </p>
              <div className="space-y-2">
                {[
                  { step: '1', label: 'Debt Gets Paid First', description: 'All outstanding loans are repaid. Bank debt, mezzanine debt, seller notes — debt holders get paid before anyone with equity.', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                  { step: '2', label: 'Preferred Return (if any)', description: 'Some PE structures include a preferred return — the PE firm gets a minimum return (usually 8-10%) before anything else gets split.', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
                  { step: '3', label: 'Return of Capital', description: 'Each equity holder gets their original investment back. The PE firm gets their equity check back. You get your rollover amount back.', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
                  { step: '4', label: 'Profit Split', description: 'Everything left over is split pro-rata based on ownership percentages. This is where the real upside lives — and where MEP holders participate.', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                ].map((item) => (
                  <div key={item.step} className={`rounded-lg p-4 border ${item.bg}`}>
                    <div className="flex items-start gap-3">
                      <span className={`${item.color} font-bold text-lg`}>{item.step}</span>
                      <div>
                        <h4 className={`${item.color} font-medium text-sm`}>{item.label}</h4>
                        <p className="text-white/60 text-xs mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Drag-Along / Tag-Along */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Drag-Along & Tag-Along Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/[0.03] rounded-lg p-4">
                  <h4 className="text-white font-medium text-sm mb-2">Drag-Along (PE protects itself)</h4>
                  <p className="text-white/60 text-xs leading-relaxed">
                    When the PE firm decides to sell, they can <strong className="text-white">"drag" all minority
                    shareholders</strong> into the sale — including you. You can't block the exit. This protects
                    the PE firm from holdouts who could derail a deal.
                  </p>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-4">
                  <h4 className="text-white font-medium text-sm mb-2">Tag-Along (You protect yourself)</h4>
                  <p className="text-white/60 text-xs leading-relaxed">
                    If the PE firm sells their stake, you have the right to <strong className="text-white">"tag along"
                    </strong> and sell your equity too, at the same price and terms. This prevents a scenario where
                    the PE firm sells to someone you don't want as a partner.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Negotiation Points */}
          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardContent className="p-6">
              <h3 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                5 Things to Negotiate Before You Sign
              </h3>
              <div className="space-y-2">
                {[
                  'Rollover percentage — push for the minimum acceptable to the PE firm. More cash now, less risk later.',
                  'Vesting schedule — push for accelerated vesting on change of control (if the PE firm sells early, your MEP equity should fully vest).',
                  'Good leaver definition — make sure retirement, health issues, and family reasons qualify. The broader the definition, the safer you are.',
                  'Bad leaver buyback price — fight for fair market value, not cost basis. The difference can be millions.',
                  'Anti-dilution protections — if the PE firm brings in more equity later (for acquisitions), make sure your ownership percentage is protected.',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 py-1">
                    <span className="text-purple-400/60 text-xs mt-0.5">{i + 1}.</span>
                    <p className="text-white/60 text-sm">{item}</p>
                  </div>
                ))}
              </div>
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
              onClick={() => setActiveTab('calculator')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Try the Calculator <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 3: Calculator ──────────────────────────────── */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">Second Bite Calculator</h2>
              <p className="text-white/60 text-sm">
                Model your rollover scenario. See what your first bite and second bite could look like
                based on growth assumptions and deal structure.
              </p>
            </CardContent>
          </Card>

          {/* Deal Structure Inputs */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">Deal Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'dealValue' as const, label: 'Deal Value ($M)', min: 5, max: 200, step: 1, suffix: 'M' },
                  { key: 'ebitda' as const, label: 'Your EBITDA ($M)', min: 0.5, max: 50, step: 0.5, suffix: 'M' },
                  { key: 'rolloverPercent' as const, label: 'Rollover %', min: 5, max: 50, step: 5, suffix: '%' },
                  { key: 'debtPercent' as const, label: 'Debt % of Deal', min: 0, max: 70, step: 5, suffix: '%' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-white/50 text-xs">{field.label}</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="range" min={field.min} max={field.max} step={field.step}
                        value={inputs[field.key]}
                        onChange={e => updateInput(field.key, e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-white text-xs w-14 text-right">
                        {field.suffix === 'M' ? `$${inputs[field.key]}M` : `${inputs[field.key]}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Growth & Exit Inputs */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">Growth & Exit Assumptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'ebitdaGrowthRate' as const, label: 'Annual EBITDA Growth', min: 0, max: 30, step: 1, suffix: '%' },
                  { key: 'exitMultiple' as const, label: 'Exit Multiple', min: 3, max: 15, step: 0.5, suffix: 'x' },
                  { key: 'holdPeriod' as const, label: 'Hold Period (years)', min: 2, max: 7, step: 1, suffix: 'yr' },
                  { key: 'interestRate' as const, label: 'Debt Interest Rate', min: 3, max: 15, step: 0.5, suffix: '%' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-white/50 text-xs">{field.label}</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="range" min={field.min} max={field.max} step={field.step}
                        value={inputs[field.key]}
                        onChange={e => updateInput(field.key, e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-white text-xs w-14 text-right">
                        {field.suffix === '%' ? `${inputs[field.key]}%` :
                         field.suffix === 'x' ? `${inputs[field.key]}x` :
                         `${inputs[field.key]} yr`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-white/50 text-xs">MEP Pool %</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="range" min={0} max={20} step={1}
                    value={inputs.mepPoolPercent}
                    onChange={e => updateInput('mepPoolPercent', e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-white text-xs w-14 text-right">{inputs.mepPoolPercent}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Bite */}
            <Card className="bg-green-500/5 border-green-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 text-base">First Bite — Cash at Close</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/80 py-1 border-b border-white/10">
                    <span>Deal Value</span><span>{fmt(inputs.dealValue)}</span>
                  </div>
                  <div className="flex justify-between text-white/50 py-1 border-b border-white/10">
                    <span>Rollover ({inputs.rolloverPercent}%)</span><span>−{fmt(rolloverAmount)}</span>
                  </div>
                  <div className="flex justify-between text-green-400 font-bold py-2 border-t border-green-500/30">
                    <span>Cash to You</span><span>{fmt(cashAtClose)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Second Bite */}
            <Card className="bg-purple-500/5 border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400 text-base">Second Bite — At PE Exit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/80 py-1 border-b border-white/10">
                    <span>Exit EV</span><span>{fmt(exitEnterpriseValue)}</span>
                  </div>
                  <div className="flex justify-between text-white/50 py-1 border-b border-white/10">
                    <span>Less debt</span><span>−{fmt(remainingDebt)}</span>
                  </div>
                  <div className="flex justify-between text-white/50 py-1 border-b border-white/10">
                    <span>Your share ({pct(sellerEquityPercent)})</span><span></span>
                  </div>
                  <div className="flex justify-between text-purple-400 font-bold py-2 border-t border-purple-500/30">
                    <span>Your Exit Payout</span><span>{fmt(secondBiteGross)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Total Banner */}
          <Card className={`border ${rolloverBenefit > 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-white/50 text-xs mb-1">First Bite</div>
                  <div className="text-green-400 text-xl font-bold">{fmt(cashAtClose)}</div>
                </div>
                <div>
                  <div className="text-white/50 text-xs mb-1">Second Bite</div>
                  <div className="text-purple-400 text-xl font-bold">{fmt(secondBiteGross)}</div>
                  <div className="text-white/30 text-xs">{rolloverMOIC.toFixed(1)}x on your rollover</div>
                </div>
                <div>
                  <div className="text-white/50 text-xs mb-1">Total Proceeds</div>
                  <div className="text-white text-xl font-bold">{fmt(totalProceeds)}</div>
                  <div className={`text-xs ${rolloverBenefit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {rolloverBenefit > 0 ? '+' : ''}{fmt(rolloverBenefit)} vs. no rollover
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rollover MOIC Context */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">
                    Your rolled-over {fmt(rolloverAmount)} generated a <strong className="text-white">{rolloverMOIC.toFixed(1)}x return</strong> — that's
                    {secondBiteProfit > 0
                      ? ` ${fmt(secondBiteProfit)} of profit on money you would've already had taxed and invested elsewhere.`
                      : ` a loss. The growth and exit assumptions may be too conservative, or the debt is consuming too much value.`
                    }
                    {rolloverMOIC >= 2 && ' This is the "second bite" working exactly as designed — your smaller slice of a bigger pie pays off.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              onClick={() => setActiveTab('mechanics')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              onClick={() => setActiveTab('report')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Your Analysis <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 4: Report ──────────────────────────────────── */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {/* Deal Summary */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Rollover Equity Analysis</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-white/40 text-xs mb-1">Deal Value</div>
                  <div className="text-white text-lg font-bold">{fmt(inputs.dealValue)}</div>
                </div>
                <div className="text-center">
                  <div className="text-white/40 text-xs mb-1">Rolling Over</div>
                  <div className="text-purple-400 text-lg font-bold">{fmt(rolloverAmount)}</div>
                  <div className="text-white/30 text-xs">{inputs.rolloverPercent}% of deal</div>
                </div>
                <div className="text-center">
                  <div className="text-white/40 text-xs mb-1">Your Ownership</div>
                  <div className="text-white text-lg font-bold">{pct(sellerEquityPercent)}</div>
                  <div className="text-white/30 text-xs">of post-close equity</div>
                </div>
                <div className="text-center">
                  <div className="text-white/40 text-xs mb-1">Hold Period</div>
                  <div className="text-white text-lg font-bold">{inputs.holdPeriod} years</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Side by Side: Rollover vs No Rollover */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Rollover vs. Take All Cash</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-white/40 text-xs uppercase"></th>
                      <th className="text-center py-3 text-green-400 text-xs uppercase">100% Cash</th>
                      <th className="text-center py-3 text-purple-400 text-xs uppercase">With Rollover</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-white/5">
                      <td className="py-2 text-white/60">Cash at close</td>
                      <td className="py-2 text-center text-white/80">{fmt(inputs.dealValue)}</td>
                      <td className="py-2 text-center text-white/80">{fmt(cashAtClose)}</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 text-white/60">Second bite (after {inputs.holdPeriod} years)</td>
                      <td className="py-2 text-center text-white/40">—</td>
                      <td className="py-2 text-center text-purple-400">{fmt(secondBiteGross)}</td>
                    </tr>
                    <tr className="border-t border-white/10">
                      <td className="py-3 text-white font-semibold">Total proceeds</td>
                      <td className="py-3 text-center text-white font-bold">{fmt(noRolloverProceeds)}</td>
                      <td className="py-3 text-center text-white font-bold">{fmt(totalProceeds)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white/60">Rollover MOIC</td>
                      <td className="py-2 text-center text-white/40">N/A</td>
                      <td className={`py-2 text-center font-bold ${rolloverMOIC >= 2 ? 'text-green-400' : rolloverMOIC >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {rolloverMOIC.toFixed(2)}x
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Assessment */}
          <Card className={`border ${
            rolloverMOIC >= 2.5 ? 'bg-green-500/10 border-green-500/30' :
            rolloverMOIC >= 1.5 ? 'bg-white/5 border-white/15' :
            rolloverMOIC >= 1 ? 'bg-yellow-500/10 border-yellow-500/30' :
            'bg-red-500/10 border-red-500/30'
          }`}>
            <CardContent className="p-6">
              <h3 className={`font-bold mb-2 ${
                rolloverMOIC >= 2.5 ? 'text-green-400' :
                rolloverMOIC >= 1.5 ? 'text-white' :
                rolloverMOIC >= 1 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {rolloverMOIC >= 2.5 ? 'Strong Second Bite — The Rollover Pays Off' :
                 rolloverMOIC >= 1.5 ? 'Solid Return — Rollover Works in This Scenario' :
                 rolloverMOIC >= 1 ? 'Modest Return — Barely Beats Breaking Even' :
                 'Warning — Rollover Loses Money in This Scenario'}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {rolloverMOIC >= 2.5 &&
                  `At ${rolloverMOIC.toFixed(1)}x, your ${fmt(rolloverAmount)} rollover becomes ${fmt(secondBiteGross)} — a ${fmt(secondBiteProfit)} profit. This is the classic PE success story. The combination of EBITDA growth (${inputs.ebitdaGrowthRate}% annually), multiple expansion (${inputs.entryMultiple}x → ${inputs.exitMultiple}x), and debt paydown creates massive equity value. Your total proceeds of ${fmt(totalProceeds)} are ${fmt(rolloverBenefit)} more than taking all cash upfront.`
                }
                {rolloverMOIC >= 1.5 && rolloverMOIC < 2.5 &&
                  `At ${rolloverMOIC.toFixed(1)}x, your rollover generates a reasonable return. You'd make ${fmt(secondBiteProfit)} on your ${fmt(rolloverAmount)} investment. This works, but the returns aren't spectacular — you might want to negotiate for a smaller rollover percentage to reduce your risk.`
                }
                {rolloverMOIC >= 1 && rolloverMOIC < 1.5 &&
                  `At ${rolloverMOIC.toFixed(1)}x, you're barely breaking even on the rollover. After accounting for the time value of money and the risk, this isn't a great deal. Consider negotiating for a lower rollover percentage, or push for better growth initiatives that would improve the exit outcome.`
                }
                {rolloverMOIC < 1 &&
                  `At ${rolloverMOIC.toFixed(1)}x, you'd actually lose money on the rollover. The growth assumptions (${inputs.ebitdaGrowthRate}%) may be too low, the debt load (${inputs.debtPercent}%) too high, or the exit multiple (${inputs.exitMultiple}x) too conservative. In this scenario, you'd be better off taking 100% cash and investing it yourself.`
                }
              </p>
            </CardContent>
          </Card>

          {/* What Drives the Second Bite */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                What's Driving Your Second Bite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    label: 'EBITDA Growth',
                    value: `${fmt(inputs.ebitda)} → ${fmt(exitEbitda)} (${inputs.ebitdaGrowthRate}% annual)`,
                    impact: exitEbitda > inputs.ebitda ? 'positive' : 'neutral',
                    description: 'Higher EBITDA at exit means a higher enterprise value.'
                  },
                  {
                    label: 'Multiple Expansion',
                    value: `${inputs.entryMultiple}x → ${inputs.exitMultiple}x`,
                    impact: inputs.exitMultiple > inputs.entryMultiple ? 'positive' : inputs.exitMultiple < inputs.entryMultiple ? 'negative' : 'neutral',
                    description: inputs.exitMultiple > inputs.entryMultiple
                      ? 'Exiting at a higher multiple than entry amplifies returns.'
                      : inputs.exitMultiple < inputs.entryMultiple
                        ? 'Multiple compression hurts returns — the exit valuation is lower relative to earnings.'
                        : 'Flat multiples — returns depend entirely on EBITDA growth and debt paydown.'
                  },
                  {
                    label: 'Debt Paydown',
                    value: `${fmt(entryDebt)} → ${fmt(remainingDebt)} (${fmt(entryDebt - remainingDebt)} paid down)`,
                    impact: entryDebt - remainingDebt > 0 ? 'positive' : 'neutral',
                    description: 'Every dollar of debt paid down goes straight to equity value.'
                  },
                  {
                    label: 'MEP Dilution',
                    value: `${inputs.mepPoolPercent}% management pool`,
                    impact: inputs.mepPoolPercent > 0 ? 'negative' : 'neutral',
                    description: 'The MEP pool dilutes your ownership, but it also keeps key managers motivated.'
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                    <span className={`mt-0.5 ${
                      item.impact === 'positive' ? 'text-green-400' :
                      item.impact === 'negative' ? 'text-red-400' : 'text-white/30'
                    }`}>
                      {item.impact === 'positive' ? <TrendingUp className="w-4 h-4" /> :
                       item.impact === 'negative' ? <AlertTriangle className="w-4 h-4" /> :
                       <ArrowRight className="w-4 h-4" />}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm">{item.label}</span>
                        <span className="text-white/60 text-xs">{item.value}</span>
                      </div>
                      <p className="text-white/40 text-xs mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer + Export */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <p className="text-white/40 text-xs mb-4">
                <strong className="text-white/60">Important:</strong> This calculator uses simplified assumptions.
                Real deal structures include preferred returns, management fees, tax effects, working capital adjustments,
                and other factors that affect actual proceeds. Use this for directional understanding, not financial planning.
                Work with your M&A advisor and CPA to model your specific deal terms.
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
