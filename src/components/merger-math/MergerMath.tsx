import React, { useState, useEffect, useMemo } from 'react';
import { getCompanyProfile } from '@/lib/companyProfile';

// ─── Types ──────────────────────────────────────────────────────────────

interface SynergyItem {
  id: string;
  category: string;
  type: 'cost' | 'revenue';
  description: string;
  annualValue: number; // $K
  confidence: 'high' | 'medium' | 'low';
  timeToRealize: number; // months
}

interface MergerInputs {
  // Your company
  ebitda: number;        // $M
  revenue: number;       // $M
  growthRate: number;     // %
  // Baseline valuation
  standaloneMultiple: number;  // what a financial buyer would pay for you alone
  // Synergies
  synergies: SynergyItem[];
  // Buyer assumptions
  buyerMultiple: number;  // multiple buyer applies to synergies
  realizationPct: number; // % of identified synergies actually achieved
  yearsToFull: number;    // years to full realization
  // Roll-up / Multiple Arbitrage
  acquirerEbitda: number; // The platform buyer's EBITDA ($M)
  synergyCasePct: number; // % EBITDA lift from operational synergies in roll-up model
}

const STORAGE_KEY = 'merger-math-v1';

const defaultSynergies: SynergyItem[] = [
  { id: '1', category: 'Headcount Overlap', type: 'cost', description: 'Duplicate roles (finance, HR, admin, exec)', annualValue: 0, confidence: 'medium', timeToRealize: 6 },
  { id: '2', category: 'Facility Consolidation', type: 'cost', description: 'Office/warehouse lease savings', annualValue: 0, confidence: 'high', timeToRealize: 12 },
  { id: '3', category: 'Procurement Savings', type: 'cost', description: 'Vendor consolidation, volume discounts', annualValue: 0, confidence: 'medium', timeToRealize: 12 },
  { id: '4', category: 'Technology & Systems', type: 'cost', description: 'Eliminate duplicate software, IT infrastructure', annualValue: 0, confidence: 'medium', timeToRealize: 18 },
  { id: '5', category: 'G&A / Back Office', type: 'cost', description: 'Insurance, legal, accounting, compliance overlap', annualValue: 0, confidence: 'high', timeToRealize: 6 },
  { id: '6', category: 'Cross-Selling', type: 'revenue', description: 'Sell your products to their customers (or vice versa)', annualValue: 0, confidence: 'low', timeToRealize: 24 },
  { id: '7', category: 'Market Expansion', type: 'revenue', description: 'Enter new geographies or channels using their platform', annualValue: 0, confidence: 'low', timeToRealize: 24 },
];

const defaultInputs: MergerInputs = {
  ebitda: 0,
  revenue: 0,
  growthRate: 0,
  standaloneMultiple: 7,
  synergies: defaultSynergies,
  buyerMultiple: 7,
  realizationPct: 75,
  yearsToFull: 2,
  acquirerEbitda: 15,
  synergyCasePct: 10,
};

// ─── Multiple Arbitrage Tiers ───────────────────────────────────────

const EBITDA_TIERS = [
  { label: 'Fragmented / Small', max: 1, multiple: 3.5 },
  { label: 'Lower Middle Market', max: 5, multiple: 4.5 },
  { label: 'Middle Market', max: 15, multiple: 6.5 },
  { label: 'Upper Middle Market', max: 50, multiple: 8.5 },
  { label: 'Large Platform', max: Infinity, multiple: 11.0 },
];

function getMarketMultiple(ebitdaM: number): { tier: string; multiple: number } {
  for (const t of EBITDA_TIERS) {
    if (ebitdaM < t.max) return { tier: t.label, multiple: t.multiple };
  }
  return { tier: EBITDA_TIERS[EBITDA_TIERS.length - 1].label, multiple: EBITDA_TIERS[EBITDA_TIERS.length - 1].multiple };
}

// ─── Helpers ────────────────────────────────────────────────────────

function fmtDollar(n: number): string {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}B`;
  if (Math.abs(n) >= 1) return `$${n.toFixed(1)}M`;
  if (Math.abs(n) >= 0.1) return `$${(n * 1000).toFixed(0)}K`;
  return `$${(n * 1000).toFixed(0)}K`;
}

function fmtK(n: number): string {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}M`;
  return `$${n.toFixed(0)}K`;
}

function pct(n: number): string { return `${n.toFixed(1)}%`; }

// ─── Tab config ─────────────────────────────────────────────────────

const tabs = [
  { id: 'learn', label: 'Why Buyers Pay More', icon: '1' },
  { id: 'model', label: 'Model Your Deal', icon: '2' },
  { id: 'numbers', label: 'The Numbers', icon: '3' },
  { id: 'report', label: 'Your Report', icon: '4' },
];

// ─── Component ──────────────────────────────────────────────────────

export function MergerMath() {
  const [activeTab, setActiveTab] = useState('learn');
  const [inputs, setInputs] = useState<MergerInputs>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Ensure synergies array exists (migration from old data)
        if (!parsed.synergies) parsed.synergies = defaultSynergies;
        return { ...defaultInputs, ...parsed };
      }
    } catch { /* ignore */ }
    return { ...defaultInputs };
  });

  // Auto-fill from Company Profile on first load
  useEffect(() => {
    const profile = getCompanyProfile();
    const updates: Partial<MergerInputs> = {};
    if (!inputs.ebitda && profile.ebitda > 0) updates.ebitda = profile.ebitda;
    if (!inputs.revenue && profile.annualRevenue > 0) updates.revenue = profile.annualRevenue;
    if (!inputs.growthRate && profile.revenueGrowthRate > 0) updates.growthRate = profile.revenueGrowthRate;
    if (Object.keys(updates).length > 0) {
      setInputs(prev => ({ ...prev, ...updates }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  // ─── Synergy Calculations ─────────────────────────────────────────

  const synergyCalc = useMemo(() => {
    const standaloneEV = inputs.ebitda * inputs.standaloneMultiple;
    const costK = inputs.synergies.filter(s => s.type === 'cost').reduce((sum, s) => sum + s.annualValue, 0);
    const revK = inputs.synergies.filter(s => s.type === 'revenue').reduce((sum, s) => sum + s.annualValue, 0);
    const totalK = costK + revK;
    const totalM = totalK / 1000;
    const realizedK = totalK * (inputs.realizationPct / 100);
    const realizedM = realizedK / 1000;
    const synergyValue = realizedM * inputs.buyerMultiple;
    const adjustedEV = standaloneEV + synergyValue;
    const premiumPct = standaloneEV > 0 ? (synergyValue / standaloneEV) * 100 : 0;
    const impliedMultiple = inputs.ebitda > 0 ? adjustedEV / inputs.ebitda : 0;
    const highK = inputs.synergies.filter(s => s.confidence === 'high').reduce((sum, s) => sum + s.annualValue, 0);
    const medK = inputs.synergies.filter(s => s.confidence === 'medium').reduce((sum, s) => sum + s.annualValue, 0);
    const lowK = inputs.synergies.filter(s => s.confidence === 'low').reduce((sum, s) => sum + s.annualValue, 0);

    return { standaloneEV, costK, revK, totalK, totalM, realizedK, realizedM, synergyValue, adjustedEV, premiumPct, impliedMultiple, highK, medK, lowK };
  }, [inputs]);

  // ─── Roll-Up / Multiple Arbitrage Calculations ─────────────────────

  const rollupCalc = useMemo(() => {
    const yourEbitda = inputs.ebitda;
    const acqEbitda = inputs.acquirerEbitda;
    const yourTier = getMarketMultiple(yourEbitda);
    const acqTier = getMarketMultiple(acqEbitda);
    const yourStandalone = yourEbitda * yourTier.multiple;
    const acqStandalone = acqEbitda * acqTier.multiple;
    const naiveSum = yourStandalone + acqStandalone;

    const combinedEbitdaBase = yourEbitda + acqEbitda;
    const synergyLift = combinedEbitdaBase * (inputs.synergyCasePct / 100);
    const combinedEbitda = combinedEbitdaBase + synergyLift;
    const combinedTier = getMarketMultiple(combinedEbitda);
    const combinedValue = combinedEbitda * combinedTier.multiple;

    const valueCreated = combinedValue - naiveSum;
    const valueCreatedPct = naiveSum > 0 ? (valueCreated / naiveSum) * 100 : 0;

    // Attribution
    const valueSynergiesOnly = (combinedEbitdaBase + synergyLift) * acqTier.multiple - naiveSum; // synergies at old multiple
    const valueMultipleOnly = combinedEbitdaBase * combinedTier.multiple - naiveSum; // no synergies, just multiple expansion
    const multipleExpansionValue = combinedValue - (combinedEbitda * acqTier.multiple); // value from multiple jump

    return {
      yourEbitda, acqEbitda, yourTier, acqTier, yourStandalone, acqStandalone, naiveSum,
      combinedEbitdaBase, synergyLift, combinedEbitda, combinedTier, combinedValue,
      valueCreated, valueCreatedPct, multipleExpansionValue,
    };
  }, [inputs]);

  // ─── Sensitivity: synergy amount vs buyer multiple ─────────────────

  const sensitivitySynVsMult = useMemo(() => {
    const baseK = synergyCalc.realizedK;
    const synAmounts = baseK > 0
      ? [0.5, 0.75, 1.0, 1.25, 1.5].map(f => Math.round(baseK * f))
      : [100, 250, 500, 750, 1000];
    const multiples = [5, 6, 7, 8, 9, 10];
    return { synAmounts, multiples, getEV: (synK: number, mult: number) => {
      return synergyCalc.standaloneEV + (synK / 1000) * mult;
    }};
  }, [synergyCalc]);

  // ─── Sensitivity: realization % vs premium % ───────────────────────

  const sensitivityRealVsPrem = useMemo(() => {
    const realPcts = [50, 60, 70, 75, 80, 90, 100];
    const mults = [5, 6, 7, 8, 9, 10];
    return { realPcts, mults, getPremium: (realPct: number, mult: number) => {
      const realized = (synergyCalc.totalK / 1000) * (realPct / 100);
      const synValue = realized * mult;
      return synergyCalc.standaloneEV > 0 ? (synValue / synergyCalc.standaloneEV) * 100 : 0;
    }};
  }, [synergyCalc]);

  // ─── Updaters ──────────────────────────────────────────────────────

  function updateField(field: keyof MergerInputs, value: number) {
    setInputs(prev => ({ ...prev, [field]: value }));
  }

  function updateSynergy(id: string, field: keyof SynergyItem, value: string | number) {
    setInputs(prev => ({
      ...prev,
      synergies: prev.synergies.map(s => s.id === id ? { ...s, [field]: value } : s),
    }));
  }

  // ─── CSV Export ────────────────────────────────────────────────────

  function exportCSV() {
    const rows: string[] = [];
    rows.push('Merger Math Report — Why Strategic Buyers Pay More');
    rows.push('');
    rows.push('YOUR COMPANY');
    rows.push(`Revenue,$${inputs.revenue}M`);
    rows.push(`EBITDA,$${inputs.ebitda}M`);
    rows.push(`Growth Rate,${inputs.growthRate}%`);
    rows.push(`Market Tier,${rollupCalc.yourTier.tier}`);
    rows.push(`Market Multiple,${rollupCalc.yourTier.multiple}x`);
    rows.push('');
    rows.push('STANDALONE VALUATION');
    rows.push(`Your Standalone Multiple,${inputs.standaloneMultiple}x`);
    rows.push(`Standalone Enterprise Value,${fmtDollar(synergyCalc.standaloneEV)}`);
    rows.push('');
    rows.push('SYNERGY ANALYSIS');
    rows.push('Category,Type,Annual Value ($K),Confidence,Months to Realize');
    inputs.synergies.filter(s => s.annualValue > 0).forEach(s => {
      rows.push(`${s.category},${s.type},${s.annualValue},${s.confidence},${s.timeToRealize}`);
    });
    rows.push('');
    rows.push(`Total Identified Synergies,${fmtK(synergyCalc.totalK)}/year`);
    rows.push(`Realization Assumption,${inputs.realizationPct}%`);
    rows.push(`Realized Synergies,${fmtK(synergyCalc.realizedK)}/year`);
    rows.push(`Buyer Multiple on Synergies,${inputs.buyerMultiple}x`);
    rows.push(`Synergy Value,${fmtDollar(synergyCalc.synergyValue)}`);
    rows.push('');
    rows.push('STRATEGIC PREMIUM');
    rows.push(`Standalone Value,${fmtDollar(synergyCalc.standaloneEV)}`);
    rows.push(`+ Synergy Value,${fmtDollar(synergyCalc.synergyValue)}`);
    rows.push(`= Strategic Value,${fmtDollar(synergyCalc.adjustedEV)}`);
    rows.push(`Premium,${pct(synergyCalc.premiumPct)}`);
    rows.push(`Implied Multiple,${synergyCalc.impliedMultiple.toFixed(1)}x EBITDA`);
    rows.push('');
    rows.push('MULTIPLE ARBITRAGE (ROLL-UP MODEL)');
    rows.push(`Your EBITDA,$${inputs.ebitda}M at ${rollupCalc.yourTier.multiple}x = ${fmtDollar(rollupCalc.yourStandalone)}`);
    rows.push(`Acquirer EBITDA,$${inputs.acquirerEbitda}M at ${rollupCalc.acqTier.multiple}x = ${fmtDollar(rollupCalc.acqStandalone)}`);
    rows.push(`Naive Sum (separate),${fmtDollar(rollupCalc.naiveSum)}`);
    rows.push(`Combined EBITDA (with ${inputs.synergyCasePct}% synergies),${fmtDollar(rollupCalc.combinedEbitda)}`);
    rows.push(`Combined Multiple,${rollupCalc.combinedTier.multiple}x (${rollupCalc.combinedTier.tier})`);
    rows.push(`Combined Value,${fmtDollar(rollupCalc.combinedValue)}`);
    rows.push(`Value Created,${fmtDollar(rollupCalc.valueCreated)} (+${pct(rollupCalc.valueCreatedPct)})`);

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merger-math-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ─── Render ────────────────────────────────────────────────────────

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border/40 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              activeTab === tab.id ? 'bg-primary-foreground/20' : 'bg-muted'
            }`}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'learn' && <TabLearn />}
      {activeTab === 'model' && (
        <TabModel inputs={inputs} updateField={updateField} updateSynergy={updateSynergy} />
      )}
      {activeTab === 'numbers' && (
        <TabNumbers
          inputs={inputs}
          sc={synergyCalc}
          rc={rollupCalc}
          sensSynVsMult={sensitivitySynVsMult}
          sensRealVsPrem={sensitivityRealVsPrem}
        />
      )}
      {activeTab === 'report' && (
        <TabReport inputs={inputs} sc={synergyCalc} rc={rollupCalc} exportCSV={exportCSV} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB 1: Why Buyers Pay More
// ═══════════════════════════════════════════════════════════════════════

function TabLearn() {
  return (
    <div className="space-y-8">
      {/* Hero concept */}
      <div className="bg-card border border-border/40 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">1 + 1 = 3: The Math Behind Strategic Premiums</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          When a company buys your business, they don't just see your revenue and EBITDA. They see what your business
          looks like <span className="text-foreground font-semibold">combined with theirs</span>. Two forces drive the
          price up beyond your standalone value: <span className="text-foreground font-semibold">synergies</span> (cost savings and revenue
          growth) and <span className="text-foreground font-semibold">multiple arbitrage</span> (bigger companies trade at higher multiples).
          Together, they're why strategic buyers routinely pay 20-50% more than financial buyers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-1">$8M</div>
            <div className="text-sm text-muted-foreground">Your company: $2M EBITDA x 4x</div>
          </div>
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-1">$16M</div>
            <div className="text-sm text-muted-foreground">Buyer's company: $4M EBITDA x 4x</div>
          </div>
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">$42M+</div>
            <div className="text-sm text-muted-foreground">Combined: $6M+ EBITDA x 7x</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            $8M + $16M = $24M on paper. But the combined entity could be worth <span className="text-green-400 font-semibold">$42M+</span>.
            That's not magic — it's synergies + multiple expansion.
          </p>
        </div>
      </div>

      {/* The Three Engines */}
      <div className="bg-card border border-border/40 rounded-xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">The Three Engines of Value Creation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-5">
            <div className="text-2xl mb-2">&#9879;</div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">Cost Synergies</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Eliminate duplicate costs that exist in both companies. These are the most reliable value drivers.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>&#10003; Duplicate exec roles (two CFOs become one)</li>
              <li>&#10003; Redundant office space & warehouses</li>
              <li>&#10003; Combined vendor contracts at volume discounts</li>
              <li>&#10003; Shared software & IT infrastructure</li>
            </ul>
            <div className="mt-3 text-xs text-emerald-400 font-medium">60-80% realization rate</div>
          </div>

          <div className="bg-white/20/5 border border-white/10 rounded-lg p-5">
            <div className="text-2xl mb-2">&#9889;</div>
            <h3 className="text-lg font-semibold text-white mb-2">Revenue Synergies</h3>
            <p className="text-sm text-muted-foreground mb-3">
              New revenue the combined company can generate that neither could alone.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>&#10003; Cross-sell products to each other's customers</li>
              <li>&#10003; Enter new markets using their distribution</li>
              <li>&#10003; Bundle services for a stronger offering</li>
              <li>&#10003; Pricing power from combined market share</li>
            </ul>
            <div className="mt-3 text-xs text-white font-medium">30-50% realization rate (takes 2-3 years)</div>
          </div>

          <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-5">
            <div className="text-2xl mb-2">&#9650;</div>
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Multiple Arbitrage</h3>
            <p className="text-sm text-muted-foreground mb-3">
              The <span className="text-foreground font-semibold">big one</span>. Larger companies trade at higher multiples.
              Combine two small businesses and the market re-rates the whole thing.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>&#10003; $2M EBITDA company trades at 4-5x</li>
              <li>&#10003; $10M EBITDA company trades at 6-8x</li>
              <li>&#10003; $50M EBITDA company trades at 9-11x</li>
              <li>&#10003; Same business, higher multiple = more $$$</li>
            </ul>
            <div className="mt-3 text-xs text-purple-400 font-medium">The entire PE roll-up playbook</div>
          </div>
        </div>
      </div>

      {/* Multiple Arbitrage Deep Dive */}
      <div className="bg-card border border-border/40 rounded-xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Multiple Arbitrage: Why Size = Higher Price Per Dollar of Earnings</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The market pays more per dollar of EBITDA for larger companies because they're more stable, more diversified,
          and attractive to a broader universe of buyers. When a PE firm buys companies at 4-5x and combines them into a
          platform worth 7-9x, the value gap is pure profit. This is called <span className="text-foreground font-semibold">multiple
          arbitrage</span>, and it's the engine behind every PE roll-up strategy.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-3 text-muted-foreground font-medium">EBITDA Range</th>
                <th className="text-left py-3 text-muted-foreground font-medium">Market Tier</th>
                <th className="text-center py-3 text-muted-foreground font-medium">Typical Multiple</th>
                <th className="text-left py-3 text-muted-foreground font-medium">Why</th>
              </tr>
            </thead>
            <tbody>
              {[
                { range: '< $1M', tier: 'Fragmented / Small', mult: '3-4x', why: 'Owner-dependent, key-person risk, limited buyer pool', color: 'text-red-400' },
                { range: '$1M - $5M', tier: 'Lower Middle Market', mult: '4-5x', why: 'Growing beyond owner, but still small team & customer base', color: 'text-amber-400' },
                { range: '$5M - $15M', tier: 'Middle Market', mult: '6-7x', why: 'Real management team, diversified revenue, bank-financeable', color: 'text-yellow-400' },
                { range: '$15M - $50M', tier: 'Upper Middle Market', mult: '8-9x', why: 'Institutional quality, multiple growth levers, broad buyer interest', color: 'text-green-400' },
                { range: '$50M+', tier: 'Large Platform', mult: '10-12x+', why: 'Market leader, deep moat, public company comparables', color: 'text-emerald-400' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/20">
                  <td className="py-3 text-foreground font-medium">{row.range}</td>
                  <td className="py-3 text-muted-foreground">{row.tier}</td>
                  <td className={`py-3 text-center font-bold ${row.color}`}>{row.mult}</td>
                  <td className="py-3 text-muted-foreground text-xs">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <p className="text-sm text-purple-400 font-medium mb-1">The Roll-Up Playbook</p>
          <p className="text-sm text-muted-foreground">
            A PE firm buys your $3M EBITDA business at 5x ($15M). They buy two similar companies at similar prices.
            Combined EBITDA: $9M+. The market now values this at 7x ($63M+). They spent ~$45M and created a platform
            worth $63M+ — <span className="text-foreground font-semibold">before any synergies</span>. That's multiple arbitrage in action.
          </p>
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-card border border-border/40 rounded-xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Your Negotiation Leverage</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Here's what most sellers miss: <span className="text-foreground font-semibold">buyers calculate synergies and multiple expansion
          but rarely share the numbers with you</span>. If a buyer sees $1.5M in annual cost savings (worth $10M+ at 7x) and
          knows the combined entity will trade at a higher multiple, they'll try to pay you the standalone price and keep
          that value for themselves.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          <span className="text-foreground font-semibold">Your job: quantify the synergies yourself</span> — or have your
          investment banker do it — and negotiate for a share. In competitive auctions, sellers typically capture
          <strong className="text-foreground"> 25-50% of identified synergy value</strong> as a premium.
        </p>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-sm text-amber-400 font-medium mb-1">The Formula</p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Your ask</strong> = Standalone value + (identified synergies x multiple x your share %).
            If standalone is $35M and synergies are worth $10M, negotiating 40% of synergy value puts <strong className="text-foreground">$4M
            more in your pocket</strong>.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <p className="text-sm text-muted-foreground italic">Ready to model your deal? Head to Tab 2.</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB 2: Model Your Deal
// ═══════════════════════════════════════════════════════════════════════

function TabModel({
  inputs,
  updateField,
  updateSynergy,
}: {
  inputs: MergerInputs;
  updateField: (field: keyof MergerInputs, value: number) => void;
  updateSynergy: (id: string, field: keyof SynergyItem, value: string | number) => void;
}) {
  const yourTier = getMarketMultiple(inputs.ebitda);
  const acqTier = getMarketMultiple(inputs.acquirerEbitda);
  const combinedBase = inputs.ebitda + inputs.acquirerEbitda;
  const synLift = combinedBase * (inputs.synergyCasePct / 100);
  const combinedTier = getMarketMultiple(combinedBase + synLift);

  return (
    <div className="space-y-8">
      {/* Your Company */}
      <div className="bg-card border border-border/40 rounded-xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-2">Your Company</h2>
        <p className="text-sm text-muted-foreground mb-6">Auto-fills from Company Profile. Adjust if needed.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Annual Revenue ($M)</label>
            <input
              type="number"
              value={inputs.revenue || ''}
              onChange={e => updateField('revenue', parseFloat(e.target.value) || 0)}
              placeholder="e.g. 25"
              className="w-full bg-background border border-border/60 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">EBITDA ($M)</label>
            <input
              type="number"
              value={inputs.ebitda || ''}
              onChange={e => updateField('ebitda', parseFloat(e.target.value) || 0)}
              placeholder="e.g. 5"
              className="w-full bg-background border border-border/60 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Revenue Growth (%)</label>
            <input
              type="number"
              value={inputs.growthRate || ''}
              onChange={e => updateField('growthRate', parseFloat(e.target.value) || 0)}
              placeholder="e.g. 15"
              className="w-full bg-background border border-border/60 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        {inputs.ebitda > 0 && (
          <div className="mt-4 bg-background/50 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Market tier: <span className="text-foreground font-medium">{yourTier.tier}</span>
            </span>
            <span className="text-sm text-foreground font-semibold">
              {yourTier.multiple}x = {fmtDollar(inputs.ebitda * yourTier.multiple)}
            </span>
          </div>
        )}
      </div>

      {/* Synergy Valuation Section */}
      <div className="bg-card border border-border/40 rounded-xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-2">Synergy Analysis</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Think about a specific buyer. What costs could they eliminate? What new revenue could the combined company generate?
        </p>

        {/* Standalone multiple */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Financial Buyer Multiple (your standalone baseline)
          </label>
          <input
            type="range" min={3} max={15} step={0.5}
            value={inputs.standaloneMultiple}
            onChange={e => updateField('standaloneMultiple', parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>3x</span>
            <span className="text-foreground font-semibold text-sm">{inputs.standaloneMultiple.toFixed(1)}x = {inputs.ebitda > 0 ? fmtDollar(inputs.ebitda * inputs.standaloneMultiple) : '--'}</span>
            <span>15x</span>
          </div>
        </div>

        {/* Cost Synergies */}
        <h3 className="text-lg font-semibold text-emerald-400 mb-3">Cost Synergies</h3>
        <div className="space-y-3 mb-6">
          {inputs.synergies.filter(s => s.type === 'cost').map(s => (
            <SynergyRow key={s.id} synergy={s} updateSynergy={updateSynergy} />
          ))}
        </div>

        {/* Revenue Synergies */}
        <h3 className="text-lg font-semibold text-white mb-3">Revenue Synergies</h3>
        <div className="space-y-3 mb-6">
          {inputs.synergies.filter(s => s.type === 'revenue').map(s => (
            <SynergyRow key={s.id} synergy={s} updateSynergy={updateSynergy} />
          ))}
        </div>

        {/* Buyer assumptions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-border/30">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Realization Rate (%)</label>
            <input
              type="range" min={25} max={100} step={5}
              value={inputs.realizationPct}
              onChange={e => updateField('realizationPct', parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>25%</span>
              <span className="text-foreground font-semibold text-sm">{inputs.realizationPct}%</span>
              <span>100%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Buyer's Synergy Multiple</label>
            <input
              type="range" min={3} max={15} step={0.5}
              value={inputs.buyerMultiple}
              onChange={e => updateField('buyerMultiple', parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>3x</span>
              <span className="text-foreground font-semibold text-sm">{inputs.buyerMultiple.toFixed(1)}x</span>
              <span>15x</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Years to Full Realization</label>
            <input
              type="range" min={1} max={5} step={1}
              value={inputs.yearsToFull}
              onChange={e => updateField('yearsToFull', parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1yr</span>
              <span className="text-foreground font-semibold text-sm">{inputs.yearsToFull} years</span>
              <span>5yr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Roll-Up Model */}
      <div className="bg-card border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold text-foreground">Roll-Up Model: Multiple Arbitrage</h2>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">ADVANCED</span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          What happens when your company gets combined with a platform buyer? Enter the acquirer's EBITDA to see
          how size-based multiple expansion creates value.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Acquirer / Platform EBITDA ($M)</label>
            <input
              type="range" min={1} max={100} step={1}
              value={inputs.acquirerEbitda}
              onChange={e => updateField('acquirerEbitda', parseFloat(e.target.value))}
              className="w-full accent-purple-400"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>$1M</span>
              <span className="text-foreground font-semibold text-sm">${inputs.acquirerEbitda}M</span>
              <span>$100M</span>
            </div>
            {inputs.acquirerEbitda > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                Tier: <span className="text-purple-400">{acqTier.tier}</span> at {acqTier.multiple}x = {fmtDollar(inputs.acquirerEbitda * acqTier.multiple)}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Operational Synergy Lift (%)</label>
            <input
              type="range" min={0} max={25} step={1}
              value={inputs.synergyCasePct}
              onChange={e => updateField('synergyCasePct', parseFloat(e.target.value))}
              className="w-full accent-purple-400"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span className="text-foreground font-semibold text-sm">{inputs.synergyCasePct}% EBITDA lift</span>
              <span>25%</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Conservative 5% | Moderate 10-12% | Aggressive 15-20%
            </div>
          </div>
        </div>

        {/* Quick preview */}
        {inputs.ebitda > 0 && inputs.acquirerEbitda > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-background/50 rounded-lg p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Naive Sum (Separate)</div>
              <div className="text-lg font-bold text-muted-foreground">
                {fmtDollar(inputs.ebitda * yourTier.multiple + inputs.acquirerEbitda * acqTier.multiple)}
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Combined EBITDA</div>
              <div className="text-lg font-bold text-foreground">
                ${(combinedBase + synLift).toFixed(1)}M
              </div>
              <div className="text-xs text-green-400">+{synLift.toFixed(1)}M synergy</div>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-3 text-center border border-purple-500/20">
              <div className="text-xs text-purple-400 mb-1">Combined at {combinedTier.multiple}x</div>
              <div className="text-lg font-bold text-purple-400">
                {fmtDollar((combinedBase + synLift) * combinedTier.multiple)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Synergy Row ────────────────────────────────────────────────────

function SynergyRow({
  synergy,
  updateSynergy,
}: {
  synergy: SynergyItem;
  updateSynergy: (id: string, field: keyof SynergyItem, value: string | number) => void;
}) {
  const borderColor = synergy.type === 'cost' ? 'border-emerald-500/20' : 'border-white/10';
  const bgColor = synergy.annualValue > 0
    ? (synergy.type === 'cost' ? 'bg-emerald-500/5' : 'bg-white/20/5')
    : 'bg-background/30';

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="text-sm font-semibold text-foreground">{synergy.category}</div>
          <div className="text-xs text-muted-foreground">{synergy.description}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32">
            <label className="block text-xs text-muted-foreground mb-1">Annual ($K)</label>
            <input
              type="number"
              value={synergy.annualValue || ''}
              onChange={e => updateSynergy(synergy.id, 'annualValue', parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full bg-background border border-border/60 rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="w-28">
            <label className="block text-xs text-muted-foreground mb-1">Confidence</label>
            <select
              value={synergy.confidence}
              onChange={e => updateSynergy(synergy.id, 'confidence', e.target.value)}
              className="w-full bg-background border border-border/60 rounded px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="w-24">
            <label className="block text-xs text-muted-foreground mb-1">Months</label>
            <input
              type="number"
              value={synergy.timeToRealize || ''}
              onChange={e => updateSynergy(synergy.id, 'timeToRealize', parseInt(e.target.value) || 0)}
              placeholder="12"
              className="w-full bg-background border border-border/60 rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB 3: The Numbers
// ═══════════════════════════════════════════════════════════════════════

function TabNumbers({
  inputs,
  sc,
  rc,
  sensSynVsMult,
  sensRealVsPrem,
}: {
  inputs: MergerInputs;
  sc: any;
  rc: any;
  sensSynVsMult: any;
  sensRealVsPrem: any;
}) {
  if (inputs.ebitda <= 0) {
    return (
      <div className="bg-card border border-border/40 rounded-xl p-8 text-center">
        <p className="text-lg text-muted-foreground">Enter your EBITDA in Tab 2 to see the numbers.</p>
      </div>
    );
  }

  const hasSynergies = sc.totalK > 0;
  const maxEV = Math.max(sc.standaloneEV, sc.adjustedEV, 1);
  const standalonePct = (sc.standaloneEV / maxEV) * 100;
  const adjustedPct = (sc.adjustedEV / maxEV) * 100;
  const synergyBarPct = adjustedPct - standalonePct;

  return (
    <div className="space-y-8">
      {/* Synergy Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border/40 rounded-xl p-5 text-center">
          <div className="text-sm text-muted-foreground mb-1">Standalone Value</div>
          <div className="text-2xl font-bold text-foreground">{fmtDollar(sc.standaloneEV)}</div>
          <div className="text-xs text-muted-foreground">{inputs.standaloneMultiple.toFixed(1)}x EBITDA</div>
        </div>
        <div className="bg-card border border-border/40 rounded-xl p-5 text-center">
          <div className="text-sm text-muted-foreground mb-1">Synergy Value</div>
          <div className="text-2xl font-bold text-green-400">{hasSynergies ? `+${fmtDollar(sc.synergyValue)}` : '--'}</div>
          <div className="text-xs text-muted-foreground">{hasSynergies ? `${fmtK(sc.realizedK)}/yr x ${inputs.buyerMultiple.toFixed(1)}x` : 'Enter synergies'}</div>
        </div>
        <div className="bg-card border border-border/40 rounded-xl p-5 text-center">
          <div className="text-sm text-muted-foreground mb-1">Strategic Value</div>
          <div className="text-2xl font-bold text-foreground">{hasSynergies ? fmtDollar(sc.adjustedEV) : fmtDollar(sc.standaloneEV)}</div>
          <div className="text-xs text-muted-foreground">{hasSynergies ? `${sc.impliedMultiple.toFixed(1)}x implied` : 'No synergies yet'}</div>
        </div>
        <div className="bg-card border border-border/40 rounded-xl p-5 text-center">
          <div className="text-sm text-muted-foreground mb-1">Premium</div>
          <div className={`text-2xl font-bold ${sc.premiumPct >= 20 ? 'text-green-400' : sc.premiumPct >= 10 ? 'text-amber-400' : 'text-muted-foreground'}`}>
            {hasSynergies ? pct(sc.premiumPct) : '--'}
          </div>
          <div className="text-xs text-muted-foreground">{hasSynergies ? `+${fmtDollar(sc.synergyValue)}` : 'Over standalone'}</div>
        </div>
      </div>

      {/* Bar: Standalone vs Strategic */}
      {hasSynergies && (
        <div className="bg-card border border-border/40 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Standalone vs. Strategic Value</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Financial Buyer (Standalone)</span>
                <span className="text-foreground font-semibold">{fmtDollar(sc.standaloneEV)}</span>
              </div>
              <div className="w-full bg-background/50 rounded-full h-8 overflow-hidden">
                <div className="h-full bg-amber-500/60 rounded-full flex items-center justify-end pr-3 transition-all duration-700"
                  style={{ width: `${Math.max(standalonePct, 5)}%` }}>
                  <span className="text-xs font-medium text-foreground">{inputs.standaloneMultiple.toFixed(1)}x</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Strategic Buyer (With Synergies)</span>
                <span className="text-foreground font-semibold">{fmtDollar(sc.adjustedEV)}</span>
              </div>
              <div className="w-full bg-background/50 rounded-full h-8 overflow-hidden">
                <div className="h-full flex rounded-full transition-all duration-700" style={{ width: `${Math.max(adjustedPct, 5)}%` }}>
                  <div className="bg-amber-500/60 h-full" style={{ width: `${standalonePct > 0 ? (standalonePct / adjustedPct) * 100 : 0}%` }} />
                  <div className="bg-green-500/60 h-full flex items-center justify-end pr-3" style={{ width: `${synergyBarPct > 0 ? (synergyBarPct / adjustedPct) * 100 : 0}%` }}>
                    <span className="text-xs font-medium text-foreground whitespace-nowrap">+{pct(sc.premiumPct)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500/60" /> Standalone</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500/60" /> Synergy Premium</div>
            </div>
          </div>
        </div>
      )}

      {/* Synergy Breakdown Table */}
      {hasSynergies && (
        <div className="bg-card border border-border/40 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Synergy Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-2 text-muted-foreground font-medium">Category</th>
                  <th className="text-center py-2 text-muted-foreground font-medium">Type</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Annual</th>
                  <th className="text-center py-2 text-muted-foreground font-medium">Confidence</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Value at {inputs.buyerMultiple.toFixed(1)}x</th>
                </tr>
              </thead>
              <tbody>
                {inputs.synergies.filter(s => s.annualValue > 0).map(s => (
                  <tr key={s.id} className="border-b border-border/20">
                    <td className="py-2 text-foreground">{s.category}</td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.type === 'cost' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white'}`}>
                        {s.type === 'cost' ? 'Cost' : 'Revenue'}
                      </span>
                    </td>
                    <td className="py-2 text-right text-foreground font-medium">{fmtK(s.annualValue)}</td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        s.confidence === 'high' ? 'bg-green-500/20 text-green-400'
                        : s.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                      }`}>{s.confidence}</span>
                    </td>
                    <td className="py-2 text-right text-foreground font-medium">{fmtK(s.annualValue * inputs.buyerMultiple)}</td>
                  </tr>
                ))}
                <tr className="font-semibold border-t border-border/40">
                  <td className="py-3 text-foreground">Total</td>
                  <td></td>
                  <td className="py-3 text-right text-foreground">{fmtK(sc.totalK)}/yr</td>
                  <td></td>
                  <td className="py-3 text-right text-foreground">{fmtDollar(sc.totalM * inputs.buyerMultiple)}</td>
                </tr>
                <tr className="font-semibold text-green-400">
                  <td className="py-2">Realized ({inputs.realizationPct}%)</td>
                  <td></td>
                  <td className="py-2 text-right">{fmtK(sc.realizedK)}/yr</td>
                  <td></td>
                  <td className="py-2 text-right">{fmtDollar(sc.synergyValue)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-green-500/10 rounded-lg p-3 text-center">
              <div className="text-xs text-green-400 mb-1">High Confidence</div>
              <div className="text-lg font-bold text-foreground">{fmtK(sc.highK)}/yr</div>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-3 text-center">
              <div className="text-xs text-amber-400 mb-1">Medium Confidence</div>
              <div className="text-lg font-bold text-foreground">{fmtK(sc.medK)}/yr</div>
            </div>
            <div className="bg-red-500/10 rounded-lg p-3 text-center">
              <div className="text-xs text-red-400 mb-1">Low Confidence</div>
              <div className="text-lg font-bold text-foreground">{fmtK(sc.lowK)}/yr</div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ ROLL-UP / MULTIPLE ARBITRAGE SECTION ══════════ */}
      <div className="bg-card border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-foreground">Multiple Arbitrage: The Roll-Up Effect</h3>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">ADVANCED</span>
        </div>

        {inputs.acquirerEbitda > 0 ? (
          <div className="space-y-6">
            {/* Three-column: You, Acquirer, Combined */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Your Company</div>
                <div className="text-2xl font-bold text-foreground">${inputs.ebitda.toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">EBITDA</div>
                <div className="mt-2 text-sm">
                  <span className="text-amber-400 font-semibold">{rc.yourTier.multiple}x</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-foreground font-semibold">{fmtDollar(rc.yourStandalone)}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{rc.yourTier.tier}</div>
              </div>

              <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Acquirer / Platform</div>
                <div className="text-2xl font-bold text-foreground">${inputs.acquirerEbitda.toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">EBITDA</div>
                <div className="mt-2 text-sm">
                  <span className="text-amber-400 font-semibold">{rc.acqTier.multiple}x</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-foreground font-semibold">{fmtDollar(rc.acqStandalone)}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{rc.acqTier.tier}</div>
              </div>

              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <div className="text-xs text-purple-400 uppercase tracking-wider mb-3">Combined Platform</div>
                <div className="text-2xl font-bold text-purple-400">${rc.combinedEbitda.toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">
                  EBITDA {inputs.synergyCasePct > 0 && <span className="text-green-400">(+{rc.synergyLift.toFixed(1)}M synergy)</span>}
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-purple-400 font-semibold">{rc.combinedTier.multiple}x</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-purple-400 font-bold">{fmtDollar(rc.combinedValue)}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{rc.combinedTier.tier}</div>
              </div>
            </div>

            {/* Value creation waterfall */}
            <div className="bg-background/50 rounded-lg p-4 border border-border/30">
              <div className="text-sm font-medium text-foreground mb-3">Value Creation Waterfall</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Naive sum (both at standalone multiples)</span>
                  <span className="text-muted-foreground font-medium">{fmtDollar(rc.naiveSum)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-purple-400">+ Multiple expansion (bigger = higher multiple)</span>
                  <span className="text-purple-400 font-medium">+{fmtDollar(rc.multipleExpansionValue)}</span>
                </div>
                {inputs.synergyCasePct > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-400">+ Synergy lift ({inputs.synergyCasePct}% EBITDA boost)</span>
                    <span className="text-green-400 font-medium">+{fmtDollar(rc.combinedValue - rc.naiveSum - rc.multipleExpansionValue)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm pt-2 border-t border-border/30 font-bold">
                  <span className="text-foreground">Combined platform value</span>
                  <span className="text-purple-400">{fmtDollar(rc.combinedValue)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className={`font-semibold ${rc.valueCreated >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    Total value created
                  </span>
                  <span className={`font-bold ${rc.valueCreated >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {rc.valueCreated >= 0 ? '+' : ''}{fmtDollar(rc.valueCreated)} ({pct(rc.valueCreatedPct)})
                  </span>
                </div>
              </div>
            </div>

            {/* Bar visualization */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Naive Sum (Separate)</span>
                <span className="text-muted-foreground">{fmtDollar(rc.naiveSum)}</span>
              </div>
              <div className="w-full bg-background/50 rounded-full h-6 overflow-hidden mb-3">
                <div className="h-full bg-muted-foreground/30 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max((rc.naiveSum / Math.max(rc.combinedValue, rc.naiveSum)) * 100, 5)}%` }} />
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-400 font-medium">Combined Platform</span>
                <span className="text-purple-400 font-medium">{fmtDollar(rc.combinedValue)}</span>
              </div>
              <div className="w-full bg-background/50 rounded-full h-6 overflow-hidden">
                <div className="h-full bg-purple-500/60 rounded-full transition-all duration-700" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Key insight */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <p className="text-sm text-purple-400 font-medium mb-1">Key Insight</p>
              <p className="text-sm text-muted-foreground">
                The value gap between {fmtDollar(rc.naiveSum)} and {fmtDollar(rc.combinedValue)} isn't magic — it's the market re-rating
                the exit multiple from an average of ~{((rc.yourTier.multiple + rc.acqTier.multiple) / 2).toFixed(1)}x
                to {rc.combinedTier.multiple}x because the combined entity is larger, more stable, and attractive to a broader
                buyer universe. This is the entire engine behind PE roll-up strategies.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Enter an acquirer EBITDA in Tab 2 to see the roll-up model.</p>
        )}
      </div>

      {/* Sensitivity Tables */}
      {hasSynergies && (
        <>
          <div className="bg-card border border-border/40 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Sensitivity: Total Value by Synergy Level & Multiple</h3>
            <p className="text-sm text-muted-foreground mb-4">How total enterprise value changes as synergies and the buyer's multiple vary.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-2 text-muted-foreground font-medium">Realized Synergies</th>
                    {sensSynVsMult.multiples.map((m: number) => (
                      <th key={m} className={`text-center py-2 font-medium ${m === inputs.buyerMultiple ? 'text-primary' : 'text-muted-foreground'}`}>{m}x</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sensSynVsMult.synAmounts.map((synK: number) => {
                    const isBase = Math.abs(synK - sc.realizedK) < 1;
                    return (
                      <tr key={synK} className={`border-b border-border/20 ${isBase ? 'bg-primary/5' : ''}`}>
                        <td className={`py-2 ${isBase ? 'text-primary font-semibold' : 'text-foreground'}`}>{fmtK(synK)}/yr</td>
                        {sensSynVsMult.multiples.map((m: number) => {
                          const ev = sensSynVsMult.getEV(synK, m);
                          const isBaseCell = isBase && m === inputs.buyerMultiple;
                          return (
                            <td key={m} className={`text-center py-2 ${isBaseCell ? 'text-primary font-bold bg-primary/10 rounded' : 'text-foreground'}`}>
                              {fmtDollar(ev)}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Sensitivity: Premium by Realization Rate & Multiple</h3>
            <p className="text-sm text-muted-foreground mb-4">What premium can you negotiate at different realization levels?</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-2 text-muted-foreground font-medium">Realization %</th>
                    {sensRealVsPrem.mults.map((m: number) => (
                      <th key={m} className={`text-center py-2 font-medium ${m === inputs.buyerMultiple ? 'text-primary' : 'text-muted-foreground'}`}>{m}x</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sensRealVsPrem.realPcts.map((rp: number) => {
                    const isBase = rp === inputs.realizationPct;
                    return (
                      <tr key={rp} className={`border-b border-border/20 ${isBase ? 'bg-primary/5' : ''}`}>
                        <td className={`py-2 ${isBase ? 'text-primary font-semibold' : 'text-foreground'}`}>{rp}%</td>
                        {sensRealVsPrem.mults.map((m: number) => {
                          const prem = sensRealVsPrem.getPremium(rp, m);
                          const isBaseCell = isBase && m === inputs.buyerMultiple;
                          return (
                            <td key={m} className={`text-center py-2 ${
                              isBaseCell ? 'text-primary font-bold bg-primary/10 rounded'
                              : prem >= 20 ? 'text-green-400'
                              : prem >= 10 ? 'text-amber-400'
                              : 'text-foreground'
                            }`}>{pct(prem)}</td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!hasSynergies && inputs.acquirerEbitda <= 0 && (
        <div className="bg-card border border-border/40 rounded-xl p-8 text-center">
          <p className="text-lg text-muted-foreground mb-2">Enter synergies or an acquirer EBITDA in Tab 2.</p>
          <p className="text-sm text-muted-foreground">The full analysis appears once you model at least one value creation lever.</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB 4: Your Report
// ═══════════════════════════════════════════════════════════════════════

function TabReport({
  inputs,
  sc,
  rc,
  exportCSV,
}: {
  inputs: MergerInputs;
  sc: any;
  rc: any;
  exportCSV: () => void;
}) {
  if (inputs.ebitda <= 0) {
    return (
      <div className="bg-card border border-border/40 rounded-xl p-8 text-center">
        <p className="text-lg text-muted-foreground">Enter your EBITDA in Tab 2 to generate your report.</p>
      </div>
    );
  }

  const hasSynergies = sc.totalK > 0;
  const hasRollup = inputs.acquirerEbitda > 0;

  // Assessment
  let label: string;
  let color: string;
  let text: string;
  const totalPremium = hasSynergies ? sc.premiumPct : 0;
  const rollupGain = hasRollup ? rc.valueCreatedPct : 0;

  if (totalPremium >= 30 || rollupGain >= 40) {
    label = 'Strong Value Creation Case';
    color = 'text-green-400';
    text = `The combination of synergies${hasRollup ? ' and multiple expansion' : ''} creates a compelling case for strategic buyers. Your company is worth significantly more as part of a platform than on its own.`;
  } else if (totalPremium >= 15 || rollupGain >= 20) {
    label = 'Meaningful Upside';
    color = 'text-white';
    text = `There's real value creation potential here. Make sure your investment banker quantifies these synergies and highlights the roll-up thesis to attract premium bids.`;
  } else if (totalPremium >= 5 || rollupGain >= 10) {
    label = 'Modest Synergy Potential';
    color = 'text-amber-400';
    text = `The identified synergies provide some premium, but won't dramatically change outcomes. Consider whether there are synergies you haven't identified — cross-selling and market expansion often get underestimated.`;
  } else if (!hasSynergies && !hasRollup) {
    label = 'No Analysis Yet';
    color = 'text-muted-foreground';
    text = 'Enter synergies or roll-up data in Tab 2 to see your full analysis.';
  } else {
    label = 'Limited Premium';
    color = 'text-red-400';
    text = 'The identified value creation is minimal. Focus on maximizing your standalone valuation through operational improvements before going to market.';
  }

  return (
    <div className="space-y-8">
      {/* Assessment */}
      <div className="bg-card border border-border/40 rounded-xl p-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-foreground">Merger Math Report</h2>
          <span className={`text-lg font-semibold ${color}`}>{label}</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">{text}</p>
      </div>

      {/* Deal Summary Table */}
      <div className="bg-card border border-border/40 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Deal Summary</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/20">
              <td className="py-2 text-muted-foreground">Your EBITDA</td>
              <td className="py-2 text-right text-foreground font-medium">${inputs.ebitda.toFixed(1)}M</td>
            </tr>
            <tr className="border-b border-border/20">
              <td className="py-2 text-muted-foreground">Your Revenue</td>
              <td className="py-2 text-right text-foreground font-medium">${inputs.revenue.toFixed(1)}M</td>
            </tr>
            <tr className="border-b border-border/20">
              <td className="py-2 text-muted-foreground">Market Tier</td>
              <td className="py-2 text-right text-foreground font-medium">{rc.yourTier.tier} ({rc.yourTier.multiple}x)</td>
            </tr>
            <tr className="border-b border-border/20 font-semibold">
              <td className="py-2 text-foreground">Standalone Value</td>
              <td className="py-2 text-right text-foreground">{fmtDollar(sc.standaloneEV)}</td>
            </tr>
            {hasSynergies && (
              <>
                <tr className="border-b border-border/20">
                  <td className="py-2 text-green-400">+ Synergy Value</td>
                  <td className="py-2 text-right text-green-400 font-medium">{fmtDollar(sc.synergyValue)}</td>
                </tr>
                <tr className="border-b border-border/20 font-bold bg-primary/5">
                  <td className="py-2 text-foreground">Strategic Value</td>
                  <td className="py-2 text-right text-foreground text-lg">{fmtDollar(sc.adjustedEV)}</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-2 text-muted-foreground">Premium / Implied Multiple</td>
                  <td className="py-2 text-right text-foreground font-medium">+{pct(sc.premiumPct)} / {sc.impliedMultiple.toFixed(1)}x</td>
                </tr>
              </>
            )}
            {hasRollup && (
              <>
                <tr className="border-b border-border/20 border-t-2 border-t-purple-500/30">
                  <td className="py-2 text-purple-400 font-medium">Roll-Up Model</td>
                  <td className="py-2 text-right text-muted-foreground text-xs">Multiple Arbitrage</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-2 text-muted-foreground">Acquirer EBITDA</td>
                  <td className="py-2 text-right text-foreground font-medium">${inputs.acquirerEbitda}M ({rc.acqTier.tier})</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-2 text-muted-foreground">Combined EBITDA</td>
                  <td className="py-2 text-right text-foreground font-medium">${rc.combinedEbitda.toFixed(1)}M at {rc.combinedTier.multiple}x</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-2 text-muted-foreground">Naive Sum vs. Combined</td>
                  <td className="py-2 text-right text-foreground font-medium">{fmtDollar(rc.naiveSum)} vs. {fmtDollar(rc.combinedValue)}</td>
                </tr>
                <tr className="font-bold">
                  <td className="py-2 text-purple-400">Value Created</td>
                  <td className="py-2 text-right text-purple-400">{fmtDollar(rc.valueCreated)} (+{pct(rc.valueCreatedPct)})</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Negotiation Leverage */}
      {(hasSynergies || hasRollup) && (
        <div className="bg-card border border-border/40 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Negotiation Leverage Points</h3>
          <div className="space-y-4">
            {hasSynergies && sc.highK > 0 && (
              <div className="bg-background/50 rounded-lg p-4 border-l-4 border-green-500">
                <p className="text-sm font-semibold text-foreground mb-1">Lead with High-Confidence Synergies</p>
                <p className="text-sm text-muted-foreground">
                  You have {fmtK(sc.highK)}/year in high-confidence synergies. Present these with specific dollar amounts and timelines — they're the most defensible.
                </p>
              </div>
            )}
            <div className="bg-background/50 rounded-lg p-4 border-l-4 border-white/30">
              <p className="text-sm font-semibold text-foreground mb-1">Don't Show All Your Cards</p>
              <p className="text-sm text-muted-foreground">
                Present high-confidence synergies to justify a premium, but hold back revenue synergies. When the buyer discovers them during diligence, it reinforces why they should pay more.
              </p>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border-l-4 border-amber-500">
              <p className="text-sm font-semibold text-foreground mb-1">Run a Competitive Process</p>
              <p className="text-sm text-muted-foreground">
                Multiple bidders create competition for your synergies. If Buyer A saves $500K and Buyer B saves $1M, Buyer B can outbid — but only if they know they're competing.
              </p>
            </div>
            {hasRollup && (
              <div className="bg-background/50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-sm font-semibold text-foreground mb-1">The Roll-Up Premium</p>
                <p className="text-sm text-muted-foreground">
                  If a PE firm is building a platform in your space, your company is worth more to them than the standalone multiple suggests.
                  Combined at {rc.combinedTier.multiple}x vs. your standalone {rc.yourTier.multiple}x, that's a {pct(((rc.combinedTier.multiple - rc.yourTier.multiple) / rc.yourTier.multiple) * 100)} multiple
                  expansion. Don't let them buy you at standalone pricing when they'll re-rate at the platform level.
                </p>
              </div>
            )}
            <div className="bg-background/50 rounded-lg p-4 border-l-4 border-foreground/30">
              <p className="text-sm font-semibold text-foreground mb-1">The Sharing Formula</p>
              <p className="text-sm text-muted-foreground">
                In competitive auctions, sellers capture 25-50% of synergy value.
                {hasSynergies && sc.synergyValue > 0 && (
                  <span className="text-foreground font-medium">
                    {' '}At 40% sharing, that's {fmtDollar(sc.synergyValue * 0.4)} in additional purchase price.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* What PE Firms Will Think */}
      <div className="bg-card border border-border/40 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">What PE Firms Will Think</h3>
        <div className="space-y-4 text-sm text-muted-foreground">
          {inputs.growthRate >= 15 && (
            <p>
              <span className="text-green-400 font-semibold">Growth story is strong.</span>{' '}
              At {inputs.growthRate}% growth, you'll attract platform investors and strategics looking for organic growth engines.
            </p>
          )}
          {inputs.growthRate > 0 && inputs.growthRate < 15 && (
            <p>
              <span className="text-amber-400 font-semibold">Moderate growth.</span>{' '}
              At {inputs.growthRate}% growth, buyers will focus on cost efficiencies. Strategic buyers may see revenue synergies that make you more attractive than standalone growth suggests.
            </p>
          )}
          {hasSynergies && sc.costK > sc.revK && (
            <p>
              <span className="text-emerald-400 font-semibold">Cost synergy-heavy deal.</span>{' '}
              Your synergies are mostly cost-based ({fmtK(sc.costK)}/yr cost vs. {fmtK(sc.revK)}/yr revenue). This is the most credible type — present specific line items to maximize credibility.
            </p>
          )}
          {hasSynergies && sc.revK >= sc.costK && (
            <p>
              <span className="text-white font-semibold">Revenue synergy potential.</span>{' '}
              More revenue synergies ({fmtK(sc.revK)}/yr) than cost ({fmtK(sc.costK)}/yr). Buyers will discount these heavily unless you show specific customer overlap or pilots.
            </p>
          )}
          {hasRollup && rc.valueCreatedPct > 30 && (
            <p>
              <span className="text-purple-400 font-semibold">Strong roll-up candidate.</span>{' '}
              The {pct(rc.valueCreatedPct)} value creation from combining with a ${inputs.acquirerEbitda}M EBITDA platform makes you an attractive
              add-on acquisition. PE firms running roll-ups in your space should be at the top of your buyer list.
            </p>
          )}
          <p>
            <span className="text-foreground font-semibold">Bottom line:</span>{' '}
            {hasSynergies
              ? `Understanding that your company could be worth ${fmtDollar(sc.adjustedEV)} to a strategic buyer (vs. ${fmtDollar(sc.standaloneEV)} standalone) gives you real negotiation power.`
              : `At ${fmtDollar(sc.standaloneEV)} standalone value, you have a solid baseline.`}
            {hasRollup && ` The roll-up model shows ${fmtDollar(rc.valueCreated)} in value creation — don't let buyers capture all of that.`}
            {' '}Don't accept standalone pricing when the synergy and platform math says otherwise.
          </p>
        </div>
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <span>&#8681;</span> Export Report (CSV)
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-background/50 border border-border/30 rounded-lg p-4 text-center">
        <p className="text-xs text-muted-foreground">
          This analysis is for educational purposes only. Actual synergy values and multiple expansion depend on the specific buyer,
          deal structure, and integration execution. Work with your investment banker and M&A advisor to develop buyer-specific models.
        </p>
      </div>
    </div>
  );
}
