import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, ChevronRight, ChevronLeft, Download,
  DollarSign, Clock, BookOpen, ArrowRight, Lightbulb,
  TrendingUp, TrendingDown, Scale, Calendar, Calculator,
  FileText, AlertCircle, CheckCircle2, MinusCircle
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────

interface WCLineItem {
  id: string;
  name: string;
  category: 'current-asset' | 'current-liability';
  included: boolean;
  tooltip: string;
  monthly: number[];
}

// ── Default Line Items ──────────────────────────────────────────

const defaultLineItems: Omit<WCLineItem, 'monthly'>[] = [
  // Current Assets (included)
  { id: 'ar', name: 'Accounts Receivable', category: 'current-asset', included: true, tooltip: 'Money customers owe you. Always included.' },
  { id: 'inventory', name: 'Inventory', category: 'current-asset', included: true, tooltip: 'Product you have on hand. Included for product businesses.' },
  { id: 'prepaids', name: 'Prepaid Expenses', category: 'current-asset', included: true, tooltip: 'Insurance, rent, etc. paid in advance. Usually included.' },
  { id: 'other-ca', name: 'Other Current Assets', category: 'current-asset', included: true, tooltip: 'Deposits, short-term receivables, etc.' },
  // Current Assets (excluded)
  { id: 'cash', name: 'Cash & Equivalents', category: 'current-asset', included: false, tooltip: 'EXCLUDED. Cash goes to the seller at closing — it\'s not part of working capital.' },
  // Current Liabilities (included)
  { id: 'ap', name: 'Accounts Payable', category: 'current-liability', included: true, tooltip: 'Money you owe suppliers. Always included.' },
  { id: 'accrued', name: 'Accrued Expenses', category: 'current-liability', included: true, tooltip: 'Wages, taxes, benefits owed but not yet paid. Usually included.' },
  { id: 'deferred-rev', name: 'Deferred Revenue', category: 'current-liability', included: true, tooltip: 'Money collected for services not yet delivered. Often a negotiation point.' },
  { id: 'other-cl', name: 'Other Current Liabilities', category: 'current-liability', included: true, tooltip: 'Short-term obligations, customer deposits, etc.' },
  // Current Liabilities (excluded)
  { id: 'current-debt', name: 'Current Portion of Debt', category: 'current-liability', included: false, tooltip: 'EXCLUDED. Debt is handled separately in the purchase price — buyer pays it off or assumes it.' },
];

// ── Storage Key ─────────────────────────────────────────────────

const STORAGE_KEY = 'working-capital-v1';

type Tab = 'overview' | 'mechanics' | 'calculator' | 'report';

// ── Helper: Format Currency ─────────────────────────────────────

const fmt = (n: number) => {
  if (n === 0) return '$0';
  const abs = Math.abs(n);
  if (abs >= 1000000) return `${n < 0 ? '-' : ''}$${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${n < 0 ? '-' : ''}$${(abs / 1000).toFixed(0)}K`;
  return `${n < 0 ? '-' : ''}$${abs.toLocaleString()}`;
};

// ── Main Component ──────────────────────────────────────────────

export function WorkingCapital() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [lineItems, setLineItems] = useState<WCLineItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).lineItems || []; } catch { return []; }
    }
    return [];
  });
  const [collarPercent, setCollarPercent] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).collarPercent ?? 5; } catch { return 5; }
    }
    return 5;
  });
  const [closingMonth, setClosingMonth] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).closingMonth ?? 11; } catch { return 11; }
    }
    return 11;
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Initialize line items if empty
  useEffect(() => {
    if (lineItems.length === 0) {
      setLineItems(defaultLineItems.map(item => ({
        ...item,
        monthly: new Array(12).fill(0)
      })));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (lineItems.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lineItems, collarPercent, closingMonth }));
    }
  }, [lineItems, collarPercent, closingMonth]);

  // ── Calculations ──────────────────────────────────────────

  const includedAssets = lineItems.filter(i => i.category === 'current-asset' && i.included);
  const includedLiabilities = lineItems.filter(i => i.category === 'current-liability' && i.included);

  const getMonthlyWC = (month: number) => {
    const assets = includedAssets.reduce((sum, i) => sum + (i.monthly[month] || 0), 0);
    const liabilities = includedLiabilities.reduce((sum, i) => sum + (i.monthly[month] || 0), 0);
    return assets - liabilities;
  };

  const monthlyWC = months.map((_, i) => getMonthlyWC(i));
  const avgWC = monthlyWC.reduce((a, b) => a + b, 0) / 12;
  const closingWC = monthlyWC[closingMonth];
  const deviation = closingWC - avgWC;
  const collarAmount = avgWC * (collarPercent / 100);
  const withinCollar = Math.abs(deviation) <= collarAmount;
  const adjustment = withinCollar ? 0 : deviation > 0 ? deviation - collarAmount : deviation + collarAmount;

  const hasData = lineItems.some(i => i.monthly.some(v => v > 0));

  const updateMonthly = (itemId: string, month: number, value: string) => {
    const num = parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
    setLineItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, monthly: item.monthly.map((v, i) => i === month ? num : v) }
        : item
    ));
  };

  // ── CSV Export ─────────────────────────────────────────────

  const exportCSV = () => {
    const lines = [
      'Working Capital Analysis — PE Ready Plus',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      `12-Month Average (Peg): ${fmt(avgWC)}`,
      `Closing Month: ${months[closingMonth]}`,
      `Closing Working Capital: ${fmt(closingWC)}`,
      `Deviation from Peg: ${fmt(deviation)}`,
      `Collar: +/- ${collarPercent}% (${fmt(collarAmount)})`,
      `Within Collar: ${withinCollar ? 'Yes' : 'No'}`,
      `Estimated Adjustment: ${fmt(adjustment)}`,
      '',
      `Line Item,Included,${months.join(',')},Average`,
      ...lineItems.map(item => {
        const avg = item.monthly.reduce((a, b) => a + b, 0) / 12;
        return `"${item.name}",${item.included ? 'Yes' : 'No (excluded)'},${item.monthly.join(',')},${avg.toFixed(0)}`;
      }),
      '',
      `Monthly Working Capital,${monthlyWC.map(v => v.toFixed(0)).join(',')}`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `working-capital-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetCalculator = () => {
    setLineItems(defaultLineItems.map(item => ({ ...item, monthly: new Array(12).fill(0) })));
    setCollarPercent(5);
    setClosingMonth(11);
  };

  // ── Tab Navigation ────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'What Is Working Capital?', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'mechanics', label: 'How the Peg Works', icon: <Scale className="w-4 h-4" /> },
    { id: 'calculator', label: 'WC Estimator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'report', label: 'Your Analysis', icon: <FileText className="w-4 h-4" /> }
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
              <h2 className="text-2xl font-bold text-white mb-4">Why Working Capital Is "The Surprise at Closing"</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                You agreed on a purchase price. The deal is closing. Then your lawyer calls and says the buyer wants
                a <strong className="text-white">$500,000 adjustment</strong> to the purchase price because of something called the
                "working capital peg." You've never heard of it. You just lost half a million dollars.
              </p>
              <p className="text-white/70 leading-relaxed mb-4">
                This happens more than you'd think. Working capital adjustments are the #1 source of post-closing disputes
                in M&A deals. The concept is simple, but the math gets complicated — and that's where sellers get hurt.
              </p>
              <div className="bg-white/5 rounded-lg p-4 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                  <p className="text-yellow-200/80 text-sm">
                    <strong className="text-yellow-300">This module teaches you:</strong> What working capital is, how the
                    peg is calculated, what's included (and what's not), and how to protect yourself from losing money
                    at the closing table. This is education — not accounting advice.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Is Working Capital */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-400" />
                Working Capital in 30 Seconds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70 text-sm leading-relaxed">
                Working capital is the money your business needs to operate day-to-day. It's the difference between
                what you're owed (current assets) and what you owe (current liabilities).
              </p>
              <div className="bg-white/[0.03] rounded-lg p-5 font-mono text-center">
                <div className="text-white/60 text-sm mb-2">The Formula</div>
                <div className="text-xl text-white">
                  <span className="text-green-400">Current Assets</span>
                  {' '}<span className="text-white/40">−</span>{' '}
                  <span className="text-red-400">Current Liabilities</span>
                  {' '}<span className="text-white/40">=</span>{' '}
                  <span className="text-purple-300">Working Capital</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold text-sm mb-2">Current Assets (Included)</h4>
                  <ul className="space-y-1.5 text-white/60 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-400/60" /> Accounts Receivable</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-400/60" /> Inventory</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-400/60" /> Prepaid Expenses</li>
                  </ul>
                  <div className="mt-3 pt-2 border-t border-green-500/10">
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <MinusCircle className="w-3 h-3" /> Cash & equivalents — EXCLUDED (goes to seller)
                    </div>
                  </div>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold text-sm mb-2">Current Liabilities (Included)</h4>
                  <ul className="space-y-1.5 text-white/60 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-red-400/60" /> Accounts Payable</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-red-400/60" /> Accrued Expenses</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-red-400/60" /> Deferred Revenue</li>
                  </ul>
                  <div className="mt-3 pt-2 border-t border-red-500/10">
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <MinusCircle className="w-3 h-3" /> Debt — EXCLUDED (handled in purchase price)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why PE Cares */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Why PE Firms Care About Working Capital</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    When a PE firm buys your company, they're buying a business that needs a certain amount of cash
                    tied up in operations to keep running. If you drain the receivables, run down inventory, or
                    delay paying suppliers before closing, the buyer inherits a business that needs an immediate
                    cash injection. The working capital peg prevents that — it ensures the business is delivered
                    in "normal" operating condition.
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
              How the Peg Works <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 2: How the Peg Works ───────────────────────── */}
      {activeTab === 'mechanics' && (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-400" />
                The Working Capital Peg — How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70 text-sm leading-relaxed">
                The "peg" (or target) is the amount of working capital the buyer expects to be in the business at closing.
                It's typically set as the <strong className="text-white">trailing 12-month average</strong> of net working capital.
              </p>

              {/* Step by step */}
              <div className="space-y-3">
                {[
                  { step: 1, title: 'Calculate the Peg', desc: 'Average the monthly working capital over the trailing 12 months. This becomes the "normal" level the buyer expects.' },
                  { step: 2, title: 'Measure at Closing', desc: 'On the day of closing, calculate actual working capital. This is compared against the peg.' },
                  { step: 3, title: 'Check the Collar', desc: 'Most deals have a "collar" — a +/- range (often 5-10%) where no adjustment happens. Small deviations are ignored.' },
                  { step: 4, title: 'Calculate the Adjustment', desc: 'If closing WC is above or below the collar, the purchase price adjusts dollar-for-dollar. Above peg = seller gets more. Below peg = seller pays back.' },
                  { step: 5, title: 'True-Up (30-90 Days Post-Close)', desc: 'After closing, accountants reconcile the actual numbers. A final adjustment is calculated and money changes hands.' }
                ].map(s => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 text-sm font-bold shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">{s.title}</h4>
                      <p className="text-white/60 text-xs">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Visual Example */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Real-World Example: How a $500K Adjustment Happens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between text-white/80 py-2 border-b border-white/10">
                  <span>12-Month Average Working Capital (Peg)</span><span className="text-purple-300 font-bold">$2,000,000</span>
                </div>
                <div className="flex justify-between text-white/80 py-2 border-b border-white/10">
                  <span>Collar (+/- 5%)</span><span className="text-white/60">$1,900,000 — $2,100,000</span>
                </div>
                <div className="flex justify-between text-white/80 py-2 border-b border-white/10">
                  <span>Actual Working Capital at Closing</span><span className="text-red-400 font-bold">$1,500,000</span>
                </div>
                <div className="flex justify-between text-white/80 py-2 border-b border-white/10">
                  <span>Below peg by</span><span className="text-red-400">−$500,000</span>
                </div>
                <div className="flex justify-between text-white/80 py-2 border-b border-white/10">
                  <span>Below collar by</span><span className="text-red-400">−$400,000</span>
                </div>
                <div className="flex justify-between text-white py-3 border-t-2 border-red-500/40 mt-2">
                  <span className="font-bold">Purchase price adjustment</span><span className="font-bold text-red-400">−$400,000 to seller</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                  <p className="text-white/70 text-xs">
                    <strong className="text-yellow-300">What happened?</strong> The seller collected receivables aggressively and delayed
                    restocking inventory before closing. Working capital dropped $500K below normal. After the collar, the seller
                    owed $400K back to the buyer. This came directly off the purchase price.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seasonal Warning */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-orange-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Seasonal Businesses: The Closing Date Trap</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">
                    If your business is seasonal, the closing date matters enormously. A landscaping company closing
                    in January will have very low working capital (no receivables, no inventory). But the 12-month
                    average includes the busy summer months. Result: massive shortfall, massive adjustment.
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    <strong className="text-white">Negotiate the measurement method.</strong> Options: use a seasonal
                    average, use the same month from the prior year, or set a fixed peg that accounts for seasonality.
                    Your M&A attorney should catch this — but many don't.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PE Negotiation Tactics */}
          <Card className="bg-red-500/5 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-300 text-base flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                How PE Firms Negotiate the Peg in Their Favor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { tactic: 'Shorter averaging period', desc: 'Using 3 or 6 months instead of 12 to cherry-pick a higher average = lower closing WC vs. peg.', defense: 'Insist on 12 months. Or better, the longer of 12 or 24 months.' },
                { tactic: 'Excluding favorable items', desc: 'Removing certain assets from the calculation (like prepaids) while keeping all liabilities.', defense: 'Review the WC definition line by line. Both sides should use the same items.' },
                { tactic: 'Including unfavorable items', desc: 'Adding gift card liabilities, loyalty point obligations, or warranty reserves that inflate liabilities.', defense: 'Push back on anything not in the normal course of business or that you can\'t control.' },
                { tactic: 'Tight collar or no collar', desc: 'A small collar (1-2%) or no collar means every dollar of deviation triggers an adjustment.', defense: 'Negotiate for 5-10% collar. Industry standard is 5%.' },
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.03] rounded-lg p-4">
                  <h4 className="text-white font-medium text-sm">{item.tactic}</h4>
                  <p className="text-white/50 text-xs mt-1">{item.desc}</p>
                  <p className="text-green-300/80 text-xs mt-2"><strong className="text-green-400">Your defense:</strong> {item.defense}</p>
                </div>
              ))}
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
              Try the Estimator <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 3: Calculator ──────────────────────────────── */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">Working Capital Estimator</h2>
              <p className="text-white/60 text-sm">
                Enter your monthly balances for each line item. Use round numbers (in thousands is fine).
                The estimator calculates your trailing 12-month average (peg) and shows what an adjustment
                would look like based on your closing month.
              </p>
            </CardContent>
          </Card>

          {/* Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <label className="text-white/60 text-xs uppercase tracking-wider">Expected Closing Month</label>
                <select
                  value={closingMonth}
                  onChange={e => setClosingMonth(parseInt(e.target.value))}
                  className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  {months.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <label className="text-white/60 text-xs uppercase tracking-wider">Collar Percentage</label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={collarPercent}
                    onChange={e => setCollarPercent(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-white font-mono text-sm w-12 text-right">+/- {collarPercent}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Entry Tables */}
          {['current-asset', 'current-liability'].map(category => (
            <Card key={category} className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className={`text-base ${category === 'current-asset' ? 'text-green-400' : 'text-red-400'}`}>
                  {category === 'current-asset' ? 'Current Assets' : 'Current Liabilities'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/40 text-xs">
                        <th className="text-left py-2 pr-2 sticky left-0 bg-card min-w-[140px]">Line Item</th>
                        {months.map(m => (
                          <th key={m} className="text-right px-1 py-2 min-w-[70px]">{m}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.filter(i => i.category === category).map(item => (
                        <tr key={item.id} className={`border-t border-white/5 ${!item.included ? 'opacity-40' : ''}`}>
                          <td className="py-2 pr-2 sticky left-0 bg-card">
                            <div className="flex items-center gap-1">
                              <span className="text-white text-xs">{item.name}</span>
                              {!item.included && (
                                <Badge className="bg-white/10 text-white/40 border-white/10 text-[10px] px-1">EXCL</Badge>
                              )}
                            </div>
                          </td>
                          {months.map((_, mi) => (
                            <td key={mi} className="px-1 py-1">
                              <input
                                type="text"
                                disabled={!item.included}
                                value={item.monthly[mi] || ''}
                                onChange={e => updateMonthly(item.id, mi, e.target.value)}
                                placeholder="0"
                                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs text-right focus:outline-none focus:border-purple-500 disabled:opacity-30"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Quick Summary */}
          {hasData && (
            <Card className="bg-purple-500/10 border-purple-500/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-white/50 text-xs uppercase">12-Month Average (Peg)</div>
                    <div className="text-xl font-bold text-purple-300 mt-1">{fmt(avgWC)}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs uppercase">Closing WC ({months[closingMonth]})</div>
                    <div className="text-xl font-bold text-white mt-1">{fmt(closingWC)}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs uppercase">Deviation</div>
                    <div className={`text-xl font-bold mt-1 ${deviation >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {deviation >= 0 ? '+' : ''}{fmt(deviation)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs uppercase">Est. Adjustment</div>
                    <div className={`text-xl font-bold mt-1 ${
                      adjustment === 0 ? 'text-green-400' : adjustment > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {withinCollar ? 'None (in collar)' : `${adjustment > 0 ? '+' : ''}${fmt(adjustment)}`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
              View Analysis <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 4: Report ──────────────────────────────────── */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {!hasData ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <Calculator className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Enter Your Numbers First</h3>
                <p className="text-white/50 mb-4">Use the WC Estimator to enter your monthly balances, then come back for your analysis.</p>
                <Button
                  onClick={() => setActiveTab('calculator')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Go to Estimator <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary Card */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Your Working Capital Analysis</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-300">{fmt(avgWC)}</div>
                      <div className="text-white/50 text-xs mt-1">12-Mo Avg (Peg)</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">{fmt(closingWC)}</div>
                      <div className="text-white/50 text-xs mt-1">Closing WC ({months[closingMonth]})</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className={`text-2xl font-bold ${deviation >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {deviation >= 0 ? '+' : ''}{fmt(deviation)}
                      </div>
                      <div className="text-white/50 text-xs mt-1">Deviation from Peg</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className={`text-2xl font-bold ${
                        adjustment === 0 ? 'text-green-400' : adjustment > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {adjustment === 0 ? 'None' : `${adjustment > 0 ? '+' : ''}${fmt(adjustment)}`}
                      </div>
                      <div className="text-white/50 text-xs mt-1">Est. Price Adjustment</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly WC Chart (text-based bar chart) */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-base">Monthly Working Capital vs. Peg</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {months.map((m, i) => {
                      const wc = monthlyWC[i];
                      const maxWC = Math.max(...monthlyWC.map(Math.abs), Math.abs(avgWC)) || 1;
                      const barWidth = Math.abs(wc) / maxWC * 100;
                      const pegWidth = Math.abs(avgWC) / maxWC * 100;
                      const isClosing = i === closingMonth;

                      return (
                        <div key={i} className={`flex items-center gap-2 py-1 px-2 rounded ${isClosing ? 'bg-purple-500/10' : ''}`}>
                          <span className={`text-xs w-8 shrink-0 ${isClosing ? 'text-purple-300 font-bold' : 'text-white/50'}`}>
                            {m}
                          </span>
                          <div className="flex-1 relative h-5">
                            {/* Peg line */}
                            <div
                              className="absolute top-0 h-full border-r-2 border-dashed border-purple-400/40 z-10"
                              style={{ left: `${pegWidth}%` }}
                            />
                            {/* Bar */}
                            <div
                              className={`h-full rounded-sm ${
                                wc >= avgWC ? 'bg-green-500/40' : 'bg-red-500/40'
                              }`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                          <span className={`text-xs font-mono w-20 text-right ${
                            isClosing ? 'text-white font-bold' : 'text-white/50'
                          }`}>
                            {fmt(wc)}
                          </span>
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-4 pt-2 text-xs text-white/40">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-0.5 border-t-2 border-dashed border-purple-400/40" /> Peg ({fmt(avgWC)})
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-sm bg-green-500/40" /> Above peg
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-sm bg-red-500/40" /> Below peg
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assessment */}
              <Card className={`border ${
                adjustment === 0 ? 'bg-green-500/5 border-green-500/20' :
                Math.abs(adjustment) > avgWC * 0.1 ? 'bg-red-500/5 border-red-500/20' :
                'bg-yellow-500/5 border-yellow-500/20'
              }`}>
                <CardContent className="p-6">
                  <h3 className={`font-bold mb-2 ${
                    adjustment === 0 ? 'text-green-300' :
                    Math.abs(adjustment) > avgWC * 0.1 ? 'text-red-300' :
                    'text-yellow-300'
                  }`}>
                    {adjustment === 0 ? 'You\'re Within the Collar — No Adjustment Expected' :
                     adjustment > 0 ? 'Closing WC Is Above the Peg — You Could Receive Extra' :
                     Math.abs(adjustment) > avgWC * 0.1 ? 'Significant Shortfall — Prepare for a Purchase Price Reduction' :
                     'Moderate Shortfall — Some Adjustment Likely'}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {adjustment === 0
                      ? `Based on your numbers, your ${months[closingMonth]} working capital is within the ${collarPercent}% collar of the 12-month average. In a real deal, this means no price adjustment — the business is being delivered in normal operating condition.`
                      : adjustment > 0
                      ? `Your ${months[closingMonth]} working capital exceeds the peg plus collar by ${fmt(adjustment)}. In a real deal, this would increase your purchase price — you're leaving the business with more working capital than required.`
                      : `Your ${months[closingMonth]} working capital is ${fmt(Math.abs(deviation))} below the 12-month average. After the ${collarPercent}% collar, the estimated adjustment is ${fmt(Math.abs(adjustment))} off the purchase price. Consider whether your closing date, or your working capital management in the months before closing, could improve this.`
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    What You Can Do About It
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'Negotiate the peg early in the LOI stage — not at closing when it\'s too late.',
                    'Understand what\'s included and excluded. Review the working capital definition line by line with your attorney.',
                    'If seasonal, negotiate a seasonal adjustment or use same-month comparison instead of trailing average.',
                    'Don\'t manipulate working capital before closing — buyers and QoE firms will catch it, and it erodes trust.',
                    'Build a monthly WC tracking spreadsheet now so you can see trends and avoid surprises.',
                    'Ask your M&A advisor about the true-up process — know what happens 60-90 days after close.'
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                      <p className="text-white/70 text-sm">{tip}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Disclaimer + Actions */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <p className="text-white/40 text-xs mb-4">
                    <strong className="text-white/60">Important:</strong> This is an educational estimator, not financial advice.
                    Real working capital calculations involve detailed balance sheet analysis, accounting adjustments,
                    and legal definitions negotiated in the purchase agreement. Use this to understand the concepts and have
                    informed conversations with your M&A attorney and CPA.
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={exportCSV} className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Download className="w-4 h-4 mr-2" /> Export Analysis (CSV)
                    </Button>
                    <Button onClick={resetCalculator} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}
