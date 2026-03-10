import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, ChevronLeft, Download, DollarSign, BookOpen,
  ArrowRight, Lightbulb, Scale, Calculator, FileText,
  AlertTriangle, CheckCircle2, XCircle, Building2, Users,
  ArrowLeftRight, Percent
} from 'lucide-react';

// ── Storage ─────────────────────────────────────────────────────

const STORAGE_KEY = 'tax-structuring-v1';

type Tab = 'overview' | 'comparison' | 'calculator' | 'strategies';

interface TaxInputs {
  dealValue: number;
  entityType: 'c-corp' | 's-corp' | 'llc' | 'partnership';
  federalCapGainsRate: number;
  federalOrdinaryRate: number;
  stateRate: number;
  goodwillPercent: number;
  depreciablePercent: number;
  ordinaryIncomePercent: number;
}

const defaultInputs: TaxInputs = {
  dealValue: 20,
  entityType: 's-corp',
  federalCapGainsRate: 20,
  federalOrdinaryRate: 37,
  stateRate: 5,
  goodwillPercent: 60,
  depreciablePercent: 25,
  ordinaryIncomePercent: 15,
};

// ── Helpers ─────────────────────────────────────────────────────

const fmt = (n: number) => {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}B`;
  if (Math.abs(n) >= 1) return `$${n.toFixed(1)}M`;
  return `$${(n * 1000).toFixed(0)}K`;
};

// ── Main Component ──────────────────────────────────────────────

export function TaxStructuring() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [inputs, setInputs] = useState<TaxInputs>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return { ...defaultInputs, ...JSON.parse(saved) }; } catch { return defaultInputs; }
    }
    return defaultInputs;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const updateInput = (key: keyof TaxInputs, value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
    setInputs(prev => ({ ...prev, [key]: num }));
  };

  // ── Tax Calculations ──────────────────────────────────────

  const dealValueDollars = inputs.dealValue;

  // Stock Deal — all capital gains (for pass-through entities)
  const stockCapGainsRate = inputs.federalCapGainsRate + inputs.stateRate;
  const stockTax = dealValueDollars * (stockCapGainsRate / 100);
  const stockNetProceeds = dealValueDollars - stockTax;

  // Asset Deal — blended rate based on allocation
  const goodwillAmount = dealValueDollars * (inputs.goodwillPercent / 100);
  const depreciableAmount = dealValueDollars * (inputs.depreciablePercent / 100);
  const ordinaryAmount = dealValueDollars * (inputs.ordinaryIncomePercent / 100);

  const goodwillTax = goodwillAmount * (stockCapGainsRate / 100);
  const depreciableTax = depreciableAmount * ((inputs.federalOrdinaryRate + inputs.stateRate) / 100); // depreciation recapture
  const ordinaryTax = ordinaryAmount * ((inputs.federalOrdinaryRate + inputs.stateRate) / 100);

  const assetTotalTax = goodwillTax + depreciableTax + ordinaryTax;
  const assetNetProceeds = dealValueDollars - assetTotalTax;
  const assetBlendedRate = (assetTotalTax / dealValueDollars) * 100;

  // C-Corp double tax
  const cCorpCorpRate = 21;
  const cCorpCorpTax = dealValueDollars * (cCorpCorpRate / 100);
  const cCorpAfterCorpTax = dealValueDollars - cCorpCorpTax;
  const cCorpShareholderTax = cCorpAfterCorpTax * (inputs.federalCapGainsRate / 100);
  const cCorpStateTax = dealValueDollars * (inputs.stateRate / 100);
  const cCorpTotalTax = cCorpCorpTax + cCorpShareholderTax + cCorpStateTax;
  const cCorpNetProceeds = dealValueDollars - cCorpTotalTax;
  const cCorpEffectiveRate = (cCorpTotalTax / dealValueDollars) * 100;

  const difference = stockNetProceeds - assetNetProceeds;
  const cCorpPenalty = stockNetProceeds - cCorpNetProceeds;

  // ── CSV Export ─────────────────────────────────────────────

  const exportCSV = () => {
    const lines = [
      'Tax Structure Comparison — PE Ready Plus',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      'INPUTS',
      `Deal Value,${fmt(dealValueDollars)}`,
      `Entity Type,${inputs.entityType.toUpperCase()}`,
      `Federal Cap Gains Rate,${inputs.federalCapGainsRate}%`,
      `Federal Ordinary Rate,${inputs.federalOrdinaryRate}%`,
      `State Tax Rate,${inputs.stateRate}%`,
      '',
      'STOCK DEAL (Pass-Through)',
      `Total Tax,${fmt(stockTax)}`,
      `Effective Rate,${stockCapGainsRate.toFixed(1)}%`,
      `Net Proceeds,${fmt(stockNetProceeds)}`,
      '',
      'ASSET DEAL (Pass-Through)',
      `Goodwill (${inputs.goodwillPercent}%),${fmt(goodwillAmount)},Tax: ${fmt(goodwillTax)}`,
      `Depreciable Assets (${inputs.depreciablePercent}%),${fmt(depreciableAmount)},Tax: ${fmt(depreciableTax)}`,
      `Ordinary Income (${inputs.ordinaryIncomePercent}%),${fmt(ordinaryAmount)},Tax: ${fmt(ordinaryTax)}`,
      `Total Tax,${fmt(assetTotalTax)}`,
      `Blended Rate,${assetBlendedRate.toFixed(1)}%`,
      `Net Proceeds,${fmt(assetNetProceeds)}`,
      '',
      `Difference (Stock - Asset),${fmt(difference)}`,
      '',
      'C-CORP DOUBLE TAX',
      `Corporate Tax (21%),${fmt(cCorpCorpTax)}`,
      `Shareholder Tax,${fmt(cCorpShareholderTax)}`,
      `State Tax,${fmt(cCorpStateTax)}`,
      `Total Tax,${fmt(cCorpTotalTax)}`,
      `Effective Rate,${cCorpEffectiveRate.toFixed(1)}%`,
      `Net Proceeds,${fmt(cCorpNetProceeds)}`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-structure-comparison-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Tabs ──────────────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Asset vs. Stock', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'comparison', label: 'Side-by-Side', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'calculator', label: 'Tax Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'strategies', label: 'Strategies', icon: <Lightbulb className="w-4 h-4" /> },
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
              <h2 className="text-2xl font-bold text-white mb-4">The Most Important Tax Question in Your Deal</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Every M&A deal comes down to one fundamental tax question:
                <strong className="text-white"> Is this an asset sale or a stock sale?</strong> The answer can change
                your after-tax proceeds by <strong className="text-white">15-25%</strong> — millions of dollars on a
                typical deal.
              </p>
              <p className="text-white/70 leading-relaxed">
                The buyer and seller almost always want opposite structures. Understanding why — and knowing the
                compromises that exist — is the difference between leaving money on the table and walking away
                with the best possible outcome.
              </p>
            </CardContent>
          </Card>

          {/* Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-green-500/5 border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-400 text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Stock Sale — Seller's Preference
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white/70 text-sm">
                  You sell your <strong className="text-white">ownership shares</strong> (stock or membership units).
                  The buyer gets the entire entity — assets, liabilities, contracts, everything.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    <span className="text-white/60 text-sm">All proceeds taxed at capital gains rates (lower)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    <span className="text-white/60 text-sm">Clean break — all assets and liabilities transfer</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    <span className="text-white/60 text-sm">Contracts and licenses transfer automatically (usually)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400/60 mt-0.5 shrink-0" />
                    <span className="text-white/40 text-sm">Buyer inherits all liabilities (known and unknown)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-400 text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Asset Sale — Buyer's Preference
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white/70 text-sm">
                  The buyer purchases <strong className="text-white">individual assets</strong> — equipment, inventory,
                  customer lists, goodwill, IP. They pick what they want and leave behind what they don't.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <span className="text-white/60 text-sm">Buyer gets a "stepped-up" tax basis — can depreciate the purchase price</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <span className="text-white/60 text-sm">Buyer cherry-picks assets, avoids unknown liabilities</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400/60 mt-0.5 shrink-0" />
                    <span className="text-white/40 text-sm">Seller pays higher taxes — some proceeds taxed as ordinary income</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400/60 mt-0.5 shrink-0" />
                    <span className="text-white/40 text-sm">Contracts may need to be re-assigned individually</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Why the Conflict */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Scale className="w-6 h-6 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Why Buyer and Seller Want Opposite Things</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">
                    The buyer's tax savings from an asset deal come directly from the seller's pocket. In an asset sale,
                    the buyer can <strong className="text-white">depreciate the purchase price</strong> over 5-15 years,
                    creating a massive tax shield. That depreciation reduces the buyer's future tax bill by millions.
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    But for the seller, an asset sale means some of the proceeds are taxed at
                    <strong className="text-white"> ordinary income rates (up to 37%)</strong> instead of capital gains
                    rates (20%). The portion allocated to inventory, depreciation recapture, and certain other assets
                    gets the higher rate. That's why sellers push for stock deals and buyers push for asset deals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* C-Corp Warning */}
          <Card className="bg-red-500/5 border-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-red-300 font-semibold mb-2">The C-Corp Double Tax Trap</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">
                    If your business is a C-Corporation and you do an asset sale, you get taxed <strong className="text-white">twice</strong>.
                    First, the corporation pays corporate tax (21%) on the gain from selling assets. Then, when the remaining
                    cash is distributed to you, you pay capital gains tax (20%) on what's left. The combined effective rate
                    can exceed <strong className="text-white">40%</strong>.
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    This is why C-Corp sellers almost always insist on stock deals. And it's why smart business owners
                    consider converting to an S-Corp or LLC years before a sale — talk to your CPA well in advance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => setActiveTab('comparison')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              See Side-by-Side <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 2: Side-by-Side Comparison ─────────────────── */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Asset Sale vs. Stock Sale — Feature Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-white/40 text-xs uppercase w-1/3">Feature</th>
                      <th className="text-center py-3 text-green-400 text-xs uppercase w-1/3">Stock Sale</th>
                      <th className="text-center py-3 text-blue-400 text-xs uppercase w-1/3">Asset Sale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'What transfers', stock: 'Entire entity (shares/units)', asset: 'Individual assets chosen by buyer' },
                      { feature: 'Tax rate for seller', stock: 'Capital gains (lower)', asset: 'Blended — some ordinary income (higher)' },
                      { feature: 'Buyer\'s tax benefit', stock: 'No step-up in basis', asset: 'Full step-up — can depreciate purchase price' },
                      { feature: 'Liabilities', stock: 'Buyer inherits all (known & unknown)', asset: 'Buyer only takes what they agree to' },
                      { feature: 'Contracts & licenses', stock: 'Transfer with the entity', asset: 'May need individual re-assignment' },
                      { feature: 'C-Corp impact', stock: 'Single tax layer', asset: 'DOUBLE TAX — corporate + shareholder' },
                      { feature: 'S-Corp / LLC impact', stock: 'Capital gains on all proceeds', asset: 'Blended rate based on asset allocation' },
                      { feature: 'Who prefers this', stock: 'SELLER (lower tax bill)', asset: 'BUYER (depreciation tax shield)' },
                      { feature: 'Complexity', stock: 'Simpler — one transaction', asset: 'More complex — requires asset allocation' },
                      { feature: 'Employee impact', stock: 'Employment continues', asset: 'New employer — rehiring may be needed' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-3 text-white/70 font-medium">{row.feature}</td>
                        <td className="py-3 text-center text-white/60 text-xs">{row.stock}</td>
                        <td className="py-3 text-center text-white/60 text-xs">{row.asset}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* The 338(h)(10) Compromise */}
          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-300 text-lg flex items-center gap-2">
                <Scale className="w-5 h-5" />
                The Compromise: Section 338(h)(10) Election
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-white/70 text-sm leading-relaxed">
                There's a middle ground that makes both sides less unhappy. A <strong className="text-white">338(h)(10) election</strong>
                structures the deal as a <em>stock sale for legal purposes</em> but treats it as an
                <em> asset sale for tax purposes</em>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="bg-white/[0.03] rounded-lg p-4">
                  <h4 className="text-green-400 font-medium text-sm mb-1">What the buyer gets</h4>
                  <p className="text-white/50 text-xs">The depreciation step-up they want — the full purchase price can be written off over time.</p>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium text-sm mb-1">What the seller gets</h4>
                  <p className="text-white/50 text-xs">A cleaner legal transfer. But the tax treatment is the same as an asset sale — so the seller still pays the blended rate.</p>
                </div>
              </div>
              <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20 mt-2">
                <p className="text-white/60 text-xs">
                  <strong className="text-yellow-300">Key point:</strong> The 338(h)(10) is only available for S-Corps.
                  It doesn't solve the C-Corp double tax problem. If you're a C-Corp, talk to your CPA about converting
                  to an S-Corp at least 5 years before a potential sale (there's a built-in gains tax period).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Installment Sale */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Installment Sales — Spreading the Tax Bill</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    If part of the purchase price is paid over time (seller note, earnout), you may be able to use
                    <strong className="text-white"> installment sale treatment</strong> — recognizing the gain as
                    you receive payments rather than all at once. This can keep you in lower tax brackets and defer
                    the bill. But it only works for capital gains portions, not ordinary income. Your CPA structures this.
                  </p>
                </div>
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
              <h2 className="text-xl font-bold text-white mb-2">Tax Structure Comparison Calculator</h2>
              <p className="text-white/60 text-sm">
                Enter your deal details below. See the after-tax difference between a stock sale and an asset sale.
                This is education — not tax advice. Your CPA does the real math.
              </p>
            </CardContent>
          </Card>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <label className="text-white/60 text-xs uppercase tracking-wider">Deal Value ($M)</label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="range" min={1} max={100} step={1}
                    value={inputs.dealValue}
                    onChange={e => updateInput('dealValue', e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-white font-mono text-sm w-14 text-right">${inputs.dealValue}M</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <label className="text-white/60 text-xs uppercase tracking-wider">Entity Type</label>
                <select
                  value={inputs.entityType}
                  onChange={e => setInputs(prev => ({ ...prev, entityType: e.target.value as TaxInputs['entityType'] }))}
                  className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="s-corp">S-Corporation</option>
                  <option value="llc">LLC (Pass-Through)</option>
                  <option value="partnership">Partnership</option>
                  <option value="c-corp">C-Corporation</option>
                </select>
              </CardContent>
            </Card>
          </div>

          {/* Tax Rates */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">Tax Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'federalCapGainsRate' as const, label: 'Federal Cap Gains', min: 10, max: 30 },
                  { key: 'federalOrdinaryRate' as const, label: 'Federal Ordinary', min: 20, max: 45 },
                  { key: 'stateRate' as const, label: 'State Tax Rate', min: 0, max: 13 },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-white/50 text-xs">{field.label}</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="range" min={field.min} max={field.max} step={0.5}
                        value={inputs[field.key]}
                        onChange={e => updateInput(field.key, e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-white font-mono text-xs w-10 text-right">{inputs[field.key]}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Asset Allocation (for asset sale) */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">Asset Sale — Purchase Price Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/40 text-xs mb-3">How the purchase price gets allocated across asset categories. This determines the seller's blended tax rate.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'goodwillPercent' as const, label: 'Goodwill (Cap Gains)', color: 'text-green-400' },
                  { key: 'depreciablePercent' as const, label: 'Depreciable Assets (Recapture)', color: 'text-yellow-400' },
                  { key: 'ordinaryIncomePercent' as const, label: 'Ordinary Income Items', color: 'text-red-400' },
                ].map(field => (
                  <div key={field.key}>
                    <label className={`${field.color} text-xs`}>{field.label}</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="range" min={0} max={100} step={5}
                        value={inputs[field.key]}
                        onChange={e => updateInput(field.key, e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-white font-mono text-xs w-10 text-right">{inputs[field.key]}%</span>
                    </div>
                  </div>
                ))}
              </div>
              {inputs.goodwillPercent + inputs.depreciablePercent + inputs.ordinaryIncomePercent !== 100 && (
                <div className="mt-2 text-yellow-400 text-xs">
                  Allocation totals {inputs.goodwillPercent + inputs.depreciablePercent + inputs.ordinaryIncomePercent}% — should equal 100%.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results — Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stock Sale */}
            <Card className="bg-green-500/5 border-green-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 text-base">Stock Sale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between text-white/80 py-1 border-b border-white/10">
                    <span>Deal Value</span><span>{fmt(dealValueDollars)}</span>
                  </div>
                  <div className="flex justify-between text-red-300/70 py-1 border-b border-white/10">
                    <span>Tax ({stockCapGainsRate}%)</span><span>−{fmt(stockTax)}</span>
                  </div>
                  <div className="flex justify-between text-green-400 font-bold py-2 border-t border-green-500/30">
                    <span>Net Proceeds</span><span>{fmt(stockNetProceeds)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Sale */}
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 text-base">Asset Sale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between text-white/80 py-1 border-b border-white/10">
                    <span>Deal Value</span><span>{fmt(dealValueDollars)}</span>
                  </div>
                  <div className="flex justify-between text-white/50 py-1 border-b border-white/10">
                    <span>Goodwill tax ({stockCapGainsRate}%)</span><span>−{fmt(goodwillTax)}</span>
                  </div>
                  <div className="flex justify-between text-white/50 py-1 border-b border-white/10">
                    <span>Depreciation recapture</span><span>−{fmt(depreciableTax)}</span>
                  </div>
                  <div className="flex justify-between text-white/50 py-1 border-b border-white/10">
                    <span>Ordinary income</span><span>−{fmt(ordinaryTax)}</span>
                  </div>
                  <div className="flex justify-between text-blue-400 font-bold py-2 border-t border-blue-500/30">
                    <span>Net Proceeds</span><span>{fmt(assetNetProceeds)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Difference Banner */}
          <Card className={`border ${difference > 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
            <CardContent className="p-6 text-center">
              <div className="text-white/50 text-sm mb-1">Stock sale puts this much more in your pocket:</div>
              <div className="text-3xl font-bold text-green-400">{fmt(Math.abs(difference))}</div>
              <div className="text-white/40 text-xs mt-1">
                ({(Math.abs(difference) / dealValueDollars * 100).toFixed(1)}% of deal value)
              </div>
            </CardContent>
          </Card>

          {/* C-Corp Warning */}
          {inputs.entityType === 'c-corp' && (
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
                  <div>
                    <h3 className="text-red-300 font-bold mb-2">C-Corp Double Tax Warning</h3>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex justify-between text-white/70 py-1">
                        <span>Corporate tax (21%)</span><span>−{fmt(cCorpCorpTax)}</span>
                      </div>
                      <div className="flex justify-between text-white/70 py-1">
                        <span>Shareholder tax ({inputs.federalCapGainsRate}%)</span><span>−{fmt(cCorpShareholderTax)}</span>
                      </div>
                      <div className="flex justify-between text-white/70 py-1">
                        <span>State tax</span><span>−{fmt(cCorpStateTax)}</span>
                      </div>
                      <div className="flex justify-between text-red-400 font-bold py-2 border-t border-red-500/30">
                        <span>Total Tax ({cCorpEffectiveRate.toFixed(1)}%)</span><span>−{fmt(cCorpTotalTax)}</span>
                      </div>
                      <div className="flex justify-between text-white font-bold py-2">
                        <span>Net to You</span><span>{fmt(cCorpNetProceeds)}</span>
                      </div>
                    </div>
                    <p className="text-white/50 text-xs mt-3">
                      You'd lose {fmt(cCorpPenalty)} more than a pass-through stock sale. This is why C-Corp conversion should happen years before a sale.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button
              onClick={() => setActiveTab('comparison')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              onClick={() => setActiveTab('strategies')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Tax Strategies <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 4: Strategies ──────────────────────────────── */}
      {activeTab === 'strategies' && (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">Tax Strategies to Discuss with Your CPA</h2>
              <p className="text-white/60 text-sm">
                These are real strategies that sellers use. None of them are DIY — every one requires professional
                tax advice. But knowing they exist means you can ask the right questions.
              </p>
            </CardContent>
          </Card>

          {[
            {
              title: 'Negotiate Asset Allocation Aggressively',
              description: 'In an asset sale, the purchase price must be allocated across asset categories. More allocated to goodwill (capital gains rate) and less to inventory/receivables (ordinary income rate) saves you money.',
              action: 'Have your CPA negotiate the allocation with the buyer\'s CPA. It\'s one of the most overlooked negotiation points in a deal.',
              impact: 'high'
            },
            {
              title: 'Consider the 338(h)(10) Election',
              description: 'For S-Corps, this gives the buyer the depreciation step-up they want while you keep a cleaner stock sale structure. You still pay blended rates, but the legal structure is simpler.',
              action: 'Ask your CPA if a 338(h)(10) makes sense. Sometimes the buyer will pay a higher price in exchange for this election.',
              impact: 'high'
            },
            {
              title: 'Use Installment Sale Treatment',
              description: 'If part of the price is a seller note or earnout, you may be able to recognize the gain as payments are received — spreading the tax over multiple years.',
              action: 'Structure seller financing or earnouts to qualify for installment treatment. Only works on capital gains portions.',
              impact: 'medium'
            },
            {
              title: 'Rollover Equity for Tax Deferral',
              description: 'Rolling 20-30% of your equity into the new entity is tax-deferred — you don\'t pay tax on the rollover portion until the second exit. And the second exit is often bigger.',
              action: 'Negotiate rollover structure and amount. Make sure it qualifies for tax-deferred treatment under your CPA\'s guidance.',
              impact: 'high'
            },
            {
              title: 'Qualified Small Business Stock (QSBS)',
              description: 'If your C-Corp stock qualifies under Section 1202, you may exclude up to $10M or 10x your basis (whichever is greater) from federal capital gains tax. That\'s potentially a 0% rate.',
              action: 'Check QSBS eligibility NOW — the requirements are strict (C-Corp, held 5+ years, under $50M in assets when issued). If you qualify, this is enormous.',
              impact: 'high'
            },
            {
              title: 'Charitable Remainder Trust (CRT)',
              description: 'Transfer stock to a CRT before the sale. The trust sells tax-free and pays you an income stream for life. You get a charitable deduction and avoid the capital gains hit.',
              action: 'Must be set up BEFORE the sale is agreed to. Requires estate planning attorney. Not right for everyone, but the tax savings can be massive.',
              impact: 'medium'
            },
            {
              title: 'Opportunity Zone Reinvestment',
              description: 'Reinvest capital gains into a Qualified Opportunity Zone Fund within 180 days of the sale. Can defer and potentially reduce the tax on the gain.',
              action: 'Identify QOZ investment options before closing. The 180-day clock starts on the day of sale.',
              impact: 'medium'
            },
            {
              title: 'State Tax Planning',
              description: 'Some states have no income tax. Some sellers establish residency in a low-tax state before the sale. This is legal but must be done properly — sham moves are aggressively audited.',
              action: 'If you\'re in a high-tax state and the deal is large enough, discuss timing and residency with your CPA at least 1-2 years before the sale.',
              impact: 'medium'
            },
          ].map((strategy, i) => (
            <Card key={i} className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-semibold text-sm">{strategy.title}</h3>
                  <Badge className={`text-xs ${
                    strategy.impact === 'high' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {strategy.impact} impact
                  </Badge>
                </div>
                <p className="text-white/60 text-sm">{strategy.description}</p>
                <div className="mt-2 flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                  <p className="text-purple-300/80 text-xs">{strategy.action}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Disclaimer + Export */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <p className="text-white/40 text-xs mb-4">
                <strong className="text-white/60">Important:</strong> This is educational content, not tax advice.
                Tax law is complex and changes frequently. Every deal has unique circumstances.
                Work with a qualified CPA and M&A tax attorney who specialize in business sales.
                The strategies above are starting points for conversations with your advisors, not DIY instructions.
              </p>
              <div className="flex gap-3">
                <Button onClick={exportCSV} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Download className="w-4 h-4 mr-2" /> Export Comparison (CSV)
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
