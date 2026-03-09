import React, { useState, useEffect, useMemo } from 'react';
import { getCompanyProfile } from '@/lib/companyProfile';

// ─── Types ──────────────────────────────────────────────────────────────

interface DCFInputs {
  // Core financials
  revenue: number;       // $M current
  ebitda: number;        // $M current
  ebitdaMargin: number;  // % — auto-calc if revenue + ebitda both set
  // Projection assumptions
  baseGrowth: number;    // % — base case revenue growth
  bearGrowth: number;    // %
  bullGrowth: number;    // %
  baseMargin: number;    // % — base case year-5 EBITDA margin target
  bearMargin: number;    // %
  bullMargin: number;    // %
  // FCF levers
  capexPct: number;      // % of revenue
  daPct: number;         // D&A % of revenue
  nwcPct: number;        // NWC change as % of revenue change
  taxRate: number;       // %
  // Discount & terminal
  wacc: number;          // %
  terminalGrowth: number;// %
  holdYears: number;     // 5 typical
}

interface YearProjection {
  year: number;
  revenue: number;
  growth: number;
  ebitdaMargin: number;
  ebitda: number;
  da: number;
  ebit: number;
  taxes: number;
  nopat: number;
  capex: number;
  nwcChange: number;
  fcf: number;
  discountFactor: number;
  pvFcf: number;
}

interface ScenarioResult {
  label: string;
  growth: number;
  margin: number;
  projections: YearProjection[];
  sumPvFcf: number;
  terminalFcf: number;
  terminalValue: number;
  pvTerminalValue: number;
  enterpriseValue: number;
  tvPctOfEv: number;
  impliedMultiple: number;
}

const STORAGE_KEY = 'dcf-valuation-v1';

// ─── Helpers ────────────────────────────────────────────────────────────

function fmt(n: number, d = 1): string { return n.toFixed(d); }
function fmtDollar(n: number): string {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}B`;
  return `$${n.toFixed(1)}M`;
}
function pct(n: number): string { return `${n.toFixed(1)}%`; }

function buildProjections(
  revenue: number,
  startMargin: number,
  growth: number,
  targetMargin: number,
  capexPct: number,
  daPct: number,
  nwcPct: number,
  taxRate: number,
  wacc: number,
  years: number
): YearProjection[] {
  const results: YearProjection[] = [];
  let prevRevenue = revenue;
  const currentYear = new Date().getFullYear();

  for (let i = 1; i <= years; i++) {
    const rev = prevRevenue * (1 + growth / 100);
    // Margin linearly interpolates from current to target over the hold period
    const margin = startMargin + (targetMargin - startMargin) * (i / years);
    const ebitda = rev * margin / 100;
    const da = rev * daPct / 100;
    const ebit = ebitda - da;
    const taxes = Math.max(0, ebit * taxRate / 100);
    const nopat = ebit - taxes;
    const capex = rev * capexPct / 100;
    const nwcChange = (rev - prevRevenue) * nwcPct / 100;
    const fcf = nopat + da - capex - nwcChange;
    // Mid-year convention
    const period = i - 0.5;
    const discountFactor = 1 / Math.pow(1 + wacc / 100, period);
    const pvFcf = fcf * discountFactor;

    results.push({
      year: currentYear + i,
      revenue: rev,
      growth,
      ebitdaMargin: margin,
      ebitda,
      da,
      ebit,
      taxes,
      nopat,
      capex,
      nwcChange,
      fcf,
      discountFactor,
      pvFcf,
    });
    prevRevenue = rev;
  }
  return results;
}

function buildScenario(
  label: string,
  inputs: DCFInputs,
  growth: number,
  targetMargin: number
): ScenarioResult {
  const startMargin = inputs.revenue > 0 ? (inputs.ebitda / inputs.revenue) * 100 : inputs.ebitdaMargin;
  const projections = buildProjections(
    inputs.revenue, startMargin, growth, targetMargin,
    inputs.capexPct, inputs.daPct, inputs.nwcPct, inputs.taxRate,
    inputs.wacc, inputs.holdYears
  );

  const sumPvFcf = projections.reduce((s, p) => s + p.pvFcf, 0);
  const lastFcf = projections[projections.length - 1]?.fcf || 0;
  const terminalFcf = lastFcf * (1 + inputs.terminalGrowth / 100);
  const terminalValue = inputs.wacc > inputs.terminalGrowth
    ? terminalFcf / ((inputs.wacc - inputs.terminalGrowth) / 100)
    : 0;
  const terminalPeriod = inputs.holdYears - 0.5;
  const pvTerminalValue = terminalValue / Math.pow(1 + inputs.wacc / 100, terminalPeriod);
  const enterpriseValue = sumPvFcf + pvTerminalValue;
  const tvPctOfEv = enterpriseValue > 0 ? (pvTerminalValue / enterpriseValue) * 100 : 0;
  const impliedMultiple = inputs.ebitda > 0 ? enterpriseValue / inputs.ebitda : 0;

  return { label, growth, margin: targetMargin, projections, sumPvFcf, terminalFcf, terminalValue, pvTerminalValue, enterpriseValue, tvPctOfEv, impliedMultiple };
}

// ─── Component ──────────────────────────────────────────────────────────

export function DCFValuation() {
  const [tab, setTab] = useState(0);
  const tabs = ['What is a DCF?', 'Your Assumptions', 'Your Valuation', 'Your Report'];

  const defaults: DCFInputs = {
    revenue: 0, ebitda: 0, ebitdaMargin: 0,
    baseGrowth: 10, bearGrowth: 5, bullGrowth: 18,
    baseMargin: 20, bearMargin: 16, bullMargin: 25,
    capexPct: 4, daPct: 3, nwcPct: 5, taxRate: 25,
    wacc: 12, terminalGrowth: 3, holdYears: 5,
  };

  const [inputs, setInputs] = useState<DCFInputs>(defaults);

  // Load from localStorage or auto-fill from profile
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) { setInputs(i => ({ ...i, ...JSON.parse(saved) })); return; }
    } catch { /* ignore */ }
    const p = getCompanyProfile();
    const prefill: Partial<DCFInputs> = {};
    if (p.annualRevenue) prefill.revenue = p.annualRevenue;
    if (p.ebitda) prefill.ebitda = p.ebitda;
    if (p.ebitdaMargin) prefill.ebitdaMargin = p.ebitdaMargin;
    if (p.revenueGrowthRate) {
      prefill.baseGrowth = p.revenueGrowthRate;
      prefill.bearGrowth = Math.max(0, p.revenueGrowthRate - 5);
      prefill.bullGrowth = p.revenueGrowthRate + 8;
    }
    if (Object.keys(prefill).length > 0) setInputs(i => ({ ...i, ...prefill }));
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs)); }, [inputs]);

  const update = (field: keyof DCFInputs, val: string) => {
    setInputs(i => ({ ...i, [field]: parseFloat(val) || 0 }));
  };

  const hasData = inputs.revenue > 0 && inputs.ebitda > 0;

  // Build 3 scenarios
  const scenarios = useMemo<ScenarioResult[]>(() => {
    if (!hasData) return [];
    return [
      buildScenario('Bear', inputs, inputs.bearGrowth, inputs.bearMargin),
      buildScenario('Base', inputs, inputs.baseGrowth, inputs.baseMargin),
      buildScenario('Bull', inputs, inputs.bullGrowth, inputs.bullMargin),
    ];
  }, [inputs, hasData]);

  const base = scenarios[1];

  // Sensitivity tables
  const sensitivityWaccGrowth = useMemo(() => {
    if (!hasData) return null;
    const waccRange = [inputs.wacc - 3, inputs.wacc - 1.5, inputs.wacc, inputs.wacc + 1.5, inputs.wacc + 3];
    const tgRange = [1.5, 2, 2.5, 3, 3.5];
    const grid: number[][] = [];
    const startMargin = (inputs.ebitda / inputs.revenue) * 100;
    for (const w of waccRange) {
      const row: number[] = [];
      for (const tg of tgRange) {
        const modInputs = { ...inputs, wacc: w, terminalGrowth: tg };
        const s = buildScenario('', modInputs, inputs.baseGrowth, inputs.baseMargin);
        row.push(s.enterpriseValue);
      }
      grid.push(row);
    }
    return { waccRange, tgRange, grid };
  }, [inputs, hasData]);

  const sensitivityGrowthMargin = useMemo(() => {
    if (!hasData) return null;
    const growthRange = [inputs.baseGrowth - 6, inputs.baseGrowth - 3, inputs.baseGrowth, inputs.baseGrowth + 3, inputs.baseGrowth + 6];
    const marginRange = [inputs.baseMargin - 6, inputs.baseMargin - 3, inputs.baseMargin, inputs.baseMargin + 3, inputs.baseMargin + 6];
    const grid: number[][] = [];
    for (const g of growthRange) {
      const row: number[] = [];
      for (const m of marginRange) {
        const s = buildScenario('', inputs, g, m);
        row.push(s.enterpriseValue);
      }
      grid.push(row);
    }
    return { growthRange, marginRange, grid };
  }, [inputs, hasData]);

  // CSV export
  const exportCSV = () => {
    if (scenarios.length === 0) return;
    const lines: string[] = [];
    lines.push('DCF Valuation Report');
    lines.push(`Revenue,$${inputs.revenue}M`);
    lines.push(`EBITDA,$${inputs.ebitda}M`);
    lines.push(`WACC,${inputs.wacc}%`);
    lines.push(`Terminal Growth,${inputs.terminalGrowth}%`);
    lines.push('');
    lines.push('Scenario,Growth,Target Margin,Enterprise Value,Implied Multiple');
    scenarios.forEach(s => {
      lines.push(`${s.label},${pct(s.growth)},${pct(s.margin)},${fmtDollar(s.enterpriseValue)},${fmt(s.impliedMultiple)}x`);
    });
    lines.push('');
    lines.push('Base Case — Year-by-Year Projections');
    lines.push('Year,Revenue ($M),EBITDA ($M),FCF ($M),PV of FCF ($M)');
    base.projections.forEach(p => {
      lines.push(`${p.year},${fmt(p.revenue)},${fmt(p.ebitda)},${fmt(p.fcf)},${fmt(p.pvFcf)}`);
    });
    lines.push('');
    lines.push('Valuation Bridge');
    lines.push(`Sum of PV FCFs,${fmtDollar(base.sumPvFcf)}`);
    lines.push(`PV Terminal Value,${fmtDollar(base.pvTerminalValue)}`);
    lines.push(`Enterprise Value,${fmtDollar(base.enterpriseValue)}`);
    lines.push(`Terminal Value % of EV,${pct(base.tvPctOfEv)}`);
    lines.push(`Implied EBITDA Multiple,${fmt(base.impliedMultiple)}x`);

    if (sensitivityWaccGrowth) {
      lines.push('');
      lines.push('Sensitivity — WACC vs Terminal Growth');
      lines.push('WACC\\Terminal Growth,' + sensitivityWaccGrowth.tgRange.map(t => pct(t)).join(','));
      sensitivityWaccGrowth.waccRange.forEach((w, i) => {
        lines.push(pct(w) + ',' + sensitivityWaccGrowth.grid[i].map(v => fmtDollar(v)).join(','));
      });
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dcf-valuation-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Render helpers ────────────────────────────────────────────────

  const inputField = (label: string, field: keyof DCFInputs, suffix: string, helpText?: string) => (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={inputs[field] || ''}
          onChange={e => update(field, e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
        />
        <span className="text-gray-500 text-sm whitespace-nowrap">{suffix}</span>
      </div>
      {helpText && <p className="text-xs text-gray-600 mt-1">{helpText}</p>}
    </div>
  );

  const scenarioColors: Record<string, string> = { Bear: 'yellow', Base: 'blue', Bull: 'emerald' };

  const sensTable = (
    title: string,
    rowLabel: string,
    colLabel: string,
    rowValues: number[],
    colValues: number[],
    grid: number[][],
    rowFmt: (n: number) => string,
    colFmt: (n: number) => string,
    baseRow: number,
    baseCol: number
  ) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 overflow-x-auto">
      <h4 className="text-sm font-semibold text-white mb-3">{title}</h4>
      <div className="text-xs text-gray-500 mb-2">{rowLabel} (rows) × {colLabel} (columns) → Enterprise Value</div>
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left py-1 px-2 text-gray-500">{rowLabel} \ {colLabel}</th>
            {colValues.map((c, i) => (
              <th key={i} className={`text-center py-1 px-2 ${i === baseCol ? 'text-blue-400 font-bold' : 'text-gray-500'}`}>{colFmt(c)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowValues.map((r, ri) => (
            <tr key={ri} className="border-t border-white/5">
              <td className={`py-1 px-2 ${ri === baseRow ? 'text-blue-400 font-bold' : 'text-gray-500'}`}>{rowFmt(r)}</td>
              {grid[ri].map((val, ci) => {
                const isBase = ri === baseRow && ci === baseCol;
                return (
                  <td key={ci} className={`text-center py-1 px-2 ${isBase ? 'text-blue-400 font-bold bg-blue-500/10 rounded' : 'text-gray-300'}`}>
                    {fmtDollar(val)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ─── Tab 0: Educational ───────────────────────────────────────────

  const renderTab0 = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-3">What's Your Business Really Worth?</h2>
        <p className="text-gray-300 leading-relaxed">
          A Discounted Cash Flow (DCF) analysis answers one question: <span className="text-white font-semibold">"How much are all your future profits worth in today's dollars?"</span> It's the gold standard of valuation — and PE firms use it alongside comparable company analysis to triangulate what they'll pay for your business.
        </p>
      </div>

      {/* The 4 building blocks */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">The 4 Building Blocks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { num: '1', title: 'Revenue & Profit Projections', desc: 'How much will your business make over the next 5 years? We project revenue growth and EBITDA margins forward.', color: 'blue' },
            { num: '2', title: 'Free Cash Flow', desc: 'Not all profit is cash. We subtract taxes, equipment purchases, and working capital to find the actual cash your business generates.', color: 'emerald' },
            { num: '3', title: 'Discount Rate (WACC)', desc: 'A dollar tomorrow is worth less than a dollar today. The discount rate adjusts for risk — riskier businesses get a higher rate, which lowers value.', color: 'yellow' },
            { num: '4', title: 'Terminal Value', desc: 'Your business doesn\'t stop at year 5. Terminal value captures everything beyond the projection period — typically 50-70% of total value.', color: 'purple' },
          ].map(block => (
            <div key={block.num} className="bg-white/5 rounded-lg p-4">
              <div className={`text-xs font-bold text-${block.color}-400 mb-1`}>STEP {block.num}</div>
              <div className="text-sm font-semibold text-white mb-1">{block.title}</div>
              <div className="text-sm text-gray-400">{block.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why two methods */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Why Use DCF + Comps Together?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <div className="text-sm font-semibold text-blue-400 mb-1">Comps (Market Approach)</div>
            <div className="text-sm text-gray-400">"What are similar companies selling for?" — quick, market-driven, but depends on finding good comparables.</div>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
            <div className="text-sm font-semibold text-emerald-400 mb-1">DCF (Intrinsic Value)</div>
            <div className="text-sm text-gray-400">"What is YOUR business worth based on its own cash flows?" — more precise, based on your actual numbers.</div>
          </div>
        </div>
        <p className="text-sm text-gray-300">
          When both methods point to a similar range, your valuation is much more credible. If they diverge, that's a signal to dig deeper.
        </p>
      </div>

      {/* Discount rate explained */}
      <div className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">The Discount Rate — Why Risk Matters</h3>
        <p className="text-sm text-gray-300 mb-3">
          Think of the discount rate as the "hurdle rate" — the minimum return an investor needs to justify the risk. Higher risk = higher discount rate = lower valuation.
        </p>
        <div className="space-y-2">
          {[
            { label: '8-10%', desc: 'Large, stable business — predictable revenue, diversified customers', color: 'emerald' },
            { label: '10-13%', desc: 'Mid-market company — solid growth, some concentration risk', color: 'blue' },
            { label: '13-16%', desc: 'Smaller or riskier business — customer concentration, owner dependency', color: 'yellow' },
            { label: '16-20%+', desc: 'High risk — early stage, turnaround, or significant issues', color: 'red' },
          ].map(tier => (
            <div key={tier.label} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
              <span className={`text-sm font-bold text-${tier.color}-400 w-16`}>{tier.label}</span>
              <span className="text-sm text-gray-400">{tier.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button onClick={() => setTab(1)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
          Enter Your Assumptions →
        </button>
      </div>
    </div>
  );

  // ─── Tab 1: Inputs ────────────────────────────────────────────────

  const renderTab1 = () => (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Core Financials */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-1">Current Financials</h3>
        <p className="text-xs text-gray-500 mb-4">Revenue and EBITDA in millions (e.g., 5.0 = $5M)</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inputField('Annual Revenue', 'revenue', '$M')}
          {inputField('EBITDA', 'ebitda', '$M')}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Current EBITDA Margin</label>
            <div className="flex items-center gap-2 h-[38px]">
              <span className="text-white text-sm font-semibold">
                {inputs.revenue > 0 && inputs.ebitda > 0
                  ? `${((inputs.ebitda / inputs.revenue) * 100).toFixed(1)}%`
                  : '—'}
              </span>
              <span className="text-gray-500 text-xs">(auto-calculated)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Assumptions */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-1">Growth Scenarios</h3>
        <p className="text-xs text-gray-500 mb-4">How fast will you grow and what margins will you achieve over {inputs.holdYears} years?</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="text-left py-2 pr-4"></th>
                <th className="text-center py-2 px-3 text-yellow-400">Bear</th>
                <th className="text-center py-2 px-3 text-blue-400">Base</th>
                <th className="text-center py-2 px-3 text-emerald-400">Bull</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 pr-4 text-gray-400">Revenue Growth</td>
                {(['bearGrowth', 'baseGrowth', 'bullGrowth'] as const).map(f => (
                  <td key={f} className="py-2 px-3">
                    <div className="flex items-center gap-1">
                      <input type="number" value={inputs[f] || ''} onChange={e => update(f, e.target.value)}
                        className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm text-center focus:border-blue-500 focus:outline-none" />
                      <span className="text-gray-500 text-xs">%</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 pr-4 text-gray-400">Year-5 EBITDA Margin</td>
                {(['bearMargin', 'baseMargin', 'bullMargin'] as const).map(f => (
                  <td key={f} className="py-2 px-3">
                    <div className="flex items-center gap-1">
                      <input type="number" value={inputs[f] || ''} onChange={e => update(f, e.target.value)}
                        className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm text-center focus:border-blue-500 focus:outline-none" />
                      <span className="text-gray-500 text-xs">%</span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FCF Assumptions */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-1">Cash Flow Assumptions</h3>
        <p className="text-xs text-gray-500 mb-4">These determine how much of your profit converts to actual cash.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {inputField('CapEx', 'capexPct', '% of rev', 'Equipment, property purchases')}
          {inputField('D&A', 'daPct', '% of rev', 'Depreciation & amortization')}
          {inputField('NWC Change', 'nwcPct', '% of Δrev', 'Working capital tied up in growth')}
          {inputField('Tax Rate', 'taxRate', '%', 'Effective tax rate')}
        </div>
      </div>

      {/* Discount & Terminal */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-1">Discount Rate & Terminal Value</h3>
        <p className="text-xs text-gray-500 mb-4">The discount rate reflects risk. Terminal growth captures value beyond the projection period.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inputField('Discount Rate (WACC)', 'wacc', '%', 'Typical PE: 10-15%')}
          {inputField('Terminal Growth', 'terminalGrowth', '%', 'Usually 2-3% (GDP growth)')}
          {inputField('Projection Period', 'holdYears', 'years', 'Standard: 5 years')}
        </div>
        {inputs.terminalGrowth >= inputs.wacc && (
          <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
            Terminal growth must be less than the discount rate. Please lower terminal growth or raise WACC.
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button onClick={() => setTab(0)} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-colors">← Back</button>
        <button onClick={() => setTab(2)} disabled={!hasData || inputs.terminalGrowth >= inputs.wacc}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-semibold transition-colors">
          See Your Valuation →
        </button>
      </div>
    </div>
  );

  // ─── Tab 2: Valuation ─────────────────────────────────────────────

  const renderTab2 = () => {
    if (scenarios.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">Enter your financials and assumptions first.</p>
          <button onClick={() => setTab(1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Enter Assumptions</button>
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Scenario Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {scenarios.map(s => {
            const c = scenarioColors[s.label];
            return (
              <div key={s.label} className={`bg-${c}-500/5 border border-${c}-500/20 rounded-xl p-4 text-center`}>
                <div className={`text-xs font-bold text-${c}-400 mb-1`}>{s.label.toUpperCase()} CASE</div>
                <div className={`text-2xl font-bold text-${c}-400`}>{fmtDollar(s.enterpriseValue)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {fmt(s.impliedMultiple)}x EBITDA | {pct(s.growth)} growth
                </div>
              </div>
            );
          })}
        </div>

        {/* Base Case Projection Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-3">Base Case — {inputs.holdYears}-Year Projection</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-white/10">
                <th className="text-left py-2 pr-3">($M)</th>
                <th className="text-center py-2 px-2">Today</th>
                {base.projections.map(p => (
                  <th key={p.year} className="text-center py-2 px-2">{p.year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-1.5 pr-3 text-gray-400">Revenue</td>
                <td className="text-center py-1.5 px-2 text-white font-medium">{fmt(inputs.revenue)}</td>
                {base.projections.map(p => <td key={p.year} className="text-center py-1.5 px-2 text-gray-300">{fmt(p.revenue)}</td>)}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-1.5 pr-3 text-gray-400">EBITDA</td>
                <td className="text-center py-1.5 px-2 text-white font-medium">{fmt(inputs.ebitda)}</td>
                {base.projections.map(p => <td key={p.year} className="text-center py-1.5 px-2 text-gray-300">{fmt(p.ebitda)}</td>)}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-1.5 pr-3 text-gray-400 italic">  Margin</td>
                <td className="text-center py-1.5 px-2 text-gray-500">{inputs.revenue > 0 ? pct((inputs.ebitda / inputs.revenue) * 100) : '—'}</td>
                {base.projections.map(p => <td key={p.year} className="text-center py-1.5 px-2 text-gray-500">{pct(p.ebitdaMargin)}</td>)}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-1.5 pr-3 text-gray-400">Free Cash Flow</td>
                <td className="text-center py-1.5 px-2 text-gray-500">—</td>
                {base.projections.map(p => <td key={p.year} className="text-center py-1.5 px-2 text-emerald-400">{fmt(p.fcf)}</td>)}
              </tr>
              <tr>
                <td className="py-1.5 pr-3 text-gray-400">PV of FCF</td>
                <td className="text-center py-1.5 px-2 text-gray-500">—</td>
                {base.projections.map(p => <td key={p.year} className="text-center py-1.5 px-2 text-blue-400">{fmt(p.pvFcf)}</td>)}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Valuation Bridge */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Valuation Bridge</h3>
          <div className="space-y-2">
            {[
              { label: 'Sum of PV of Free Cash Flows', value: base.sumPvFcf, color: 'text-blue-400' },
              { label: '+ PV of Terminal Value', value: base.pvTerminalValue, color: 'text-purple-400' },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center bg-white/5 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-400">{row.label}</span>
                <span className={`text-sm font-semibold ${row.color}`}>{fmtDollar(row.value)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3">
              <span className="text-sm font-bold text-white">= Enterprise Value</span>
              <span className="text-lg font-bold text-blue-400">{fmtDollar(base.enterpriseValue)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">Terminal Value % of EV</div>
              <div className={`text-lg font-bold ${base.tvPctOfEv > 75 ? 'text-yellow-400' : base.tvPctOfEv < 40 ? 'text-yellow-400' : 'text-emerald-400'}`}>{pct(base.tvPctOfEv)}</div>
              <div className="text-xs text-gray-600">{base.tvPctOfEv > 75 ? 'High — heavily reliant on terminal assumptions' : base.tvPctOfEv < 40 ? 'Low — check if terminal assumptions are too conservative' : 'Healthy range (50-70% typical)'}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">Implied EBITDA Multiple</div>
              <div className="text-lg font-bold text-blue-400">{fmt(base.impliedMultiple)}x</div>
              <div className="text-xs text-gray-600">Compare this with your comps analysis</div>
            </div>
          </div>
        </div>

        {/* Sensitivity Tables */}
        {sensitivityWaccGrowth && (
          sensTable(
            'Enterprise Value: WACC vs Terminal Growth',
            'WACC', 'Terminal Growth',
            sensitivityWaccGrowth.waccRange, sensitivityWaccGrowth.tgRange, sensitivityWaccGrowth.grid,
            n => pct(n), n => pct(n), 2, 2
          )
        )}
        {sensitivityGrowthMargin && (
          sensTable(
            'Enterprise Value: Revenue Growth vs EBITDA Margin',
            'Growth', 'Year-5 Margin',
            sensitivityGrowthMargin.growthRange, sensitivityGrowthMargin.marginRange, sensitivityGrowthMargin.grid,
            n => pct(n), n => pct(n), 2, 2
          )
        )}

        <div className="flex justify-between">
          <button onClick={() => setTab(1)} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-colors">← Edit Assumptions</button>
          <button onClick={() => setTab(3)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">View Full Report →</button>
        </div>
      </div>
    );
  };

  // ─── Tab 3: Report ────────────────────────────────────────────────

  const renderTab3 = () => {
    if (scenarios.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">Complete the analysis first.</p>
          <button onClick={() => setTab(1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Enter Assumptions</button>
        </div>
      );
    }

    const bear = scenarios[0];
    const bull = scenarios[2];

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-1">DCF Valuation Report</h2>
          <p className="text-gray-400 text-sm">Revenue: {fmtDollar(inputs.revenue)} | EBITDA: {fmtDollar(inputs.ebitda)} | WACC: {pct(inputs.wacc)} | Terminal Growth: {pct(inputs.terminalGrowth)}</p>
        </div>

        {/* Valuation Range */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Enterprise Value Range</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {scenarios.map(s => {
              const c = scenarioColors[s.label];
              return (
                <div key={s.label} className="text-center">
                  <div className={`text-xs font-bold text-${c}-400 mb-1`}>{s.label.toUpperCase()}</div>
                  <div className={`text-2xl font-bold text-${c}-400`}>{fmtDollar(s.enterpriseValue)}</div>
                  <div className="text-xs text-gray-500">{fmt(s.impliedMultiple)}x EBITDA</div>
                </div>
              );
            })}
          </div>
          {/* Visual range bar */}
          <div className="relative h-8 bg-white/5 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-[15%] right-[15%] bg-gradient-to-r from-yellow-500/20 via-blue-500/30 to-emerald-500/20 rounded-full" />
            <div className="absolute inset-y-0 left-[40%] right-[40%] bg-blue-500/30 rounded-full" />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1 px-4">
            <span>{fmtDollar(bear.enterpriseValue)}</span>
            <span className="text-blue-400 font-semibold">{fmtDollar(base.enterpriseValue)}</span>
            <span>{fmtDollar(bull.enterpriseValue)}</span>
          </div>
        </div>

        {/* Key Assumptions Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-3">Key Assumptions</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-white/10">
                <th className="text-left py-2">Assumption</th>
                <th className="text-center py-2 text-yellow-400">Bear</th>
                <th className="text-center py-2 text-blue-400">Base</th>
                <th className="text-center py-2 text-emerald-400">Bull</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Revenue Growth', bear: pct(inputs.bearGrowth), base: pct(inputs.baseGrowth), bull: pct(inputs.bullGrowth) },
                { label: 'Year-5 EBITDA Margin', bear: pct(inputs.bearMargin), base: pct(inputs.baseMargin), bull: pct(inputs.bullMargin) },
                { label: 'WACC', bear: pct(inputs.wacc), base: pct(inputs.wacc), bull: pct(inputs.wacc) },
                { label: 'Terminal Growth', bear: pct(inputs.terminalGrowth), base: pct(inputs.terminalGrowth), bull: pct(inputs.terminalGrowth) },
                { label: 'CapEx (% of Rev)', bear: pct(inputs.capexPct), base: pct(inputs.capexPct), bull: pct(inputs.capexPct) },
                { label: 'Tax Rate', bear: pct(inputs.taxRate), base: pct(inputs.taxRate), bull: pct(inputs.taxRate) },
              ].map(row => (
                <tr key={row.label} className="border-b border-white/5">
                  <td className="py-2 text-gray-400">{row.label}</td>
                  <td className="text-center py-2 text-gray-300">{row.bear}</td>
                  <td className="text-center py-2 text-gray-300">{row.base}</td>
                  <td className="text-center py-2 text-gray-300">{row.bull}</td>
                </tr>
              ))}
              <tr className="border-t border-white/20">
                <td className="py-2 text-white font-semibold">Enterprise Value</td>
                <td className="text-center py-2 text-yellow-400 font-semibold">{fmtDollar(bear.enterpriseValue)}</td>
                <td className="text-center py-2 text-blue-400 font-semibold">{fmtDollar(base.enterpriseValue)}</td>
                <td className="text-center py-2 text-emerald-400 font-semibold">{fmtDollar(bull.enterpriseValue)}</td>
              </tr>
              <tr>
                <td className="py-2 text-white font-semibold">Implied Multiple</td>
                <td className="text-center py-2 text-yellow-400 font-semibold">{fmt(bear.impliedMultiple)}x</td>
                <td className="text-center py-2 text-blue-400 font-semibold">{fmt(base.impliedMultiple)}x</td>
                <td className="text-center py-2 text-emerald-400 font-semibold">{fmt(bull.impliedMultiple)}x</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* What Drives Your Value */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">What Drives Your Value</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <p>
              <span className="text-emerald-400 font-semibold">Growth matters most:</span> Moving from {pct(inputs.bearGrowth)} to {pct(inputs.bullGrowth)} revenue growth swings your enterprise value by {fmtDollar(Math.abs(bull.enterpriseValue - bear.enterpriseValue))} — that's the difference between a {fmt(bear.impliedMultiple)}x and {fmt(bull.impliedMultiple)}x EBITDA multiple.
            </p>
            <p>
              <span className="text-blue-400 font-semibold">Margins compound:</span> Higher EBITDA margins don't just increase this year's profit — they compound across every year in the projection, amplifying the effect on terminal value.
            </p>
            <p>
              <span className="text-yellow-400 font-semibold">Risk cuts both ways:</span> Your {pct(inputs.wacc)} discount rate means every dollar of future cash flow is worth {fmt(1 / Math.pow(1 + inputs.wacc / 100, 5) * 100)}¢ in year 5. Reducing perceived risk (customer diversification, recurring revenue, strong management) lowers the discount rate and directly increases value.
            </p>
            {base.tvPctOfEv > 65 && (
              <p>
                <span className="text-purple-400 font-semibold">Terminal value warning:</span> Terminal value is {pct(base.tvPctOfEv)} of your enterprise value — that's above the typical 50-65% range. This means your near-term cash flows are relatively small. A buyer will scrutinize whether your terminal growth rate of {pct(inputs.terminalGrowth)} is achievable long-term.
              </p>
            )}
          </div>
        </div>

        {/* What PE Firms Will Think */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">What PE Firms Will Think</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <p>
              A PE firm looking at your base case will see a business that generates {fmtDollar(base.projections[base.projections.length - 1]?.fcf || 0)} in free cash flow by year {inputs.holdYears}, growing at {pct(inputs.baseGrowth)} with {pct(inputs.baseMargin)} target margins.
            </p>
            <p>
              At {fmt(base.impliedMultiple)}x current EBITDA, the implied DCF value of {fmtDollar(base.enterpriseValue)} {base.impliedMultiple > 10 ? 'reflects a premium valuation — they\'ll want to see strong evidence that your growth trajectory is achievable.' : base.impliedMultiple > 6 ? 'is in a reasonable range for a mid-market company with these growth characteristics.' : 'suggests a modest valuation — consider whether your growth and margin assumptions are conservative enough.'}
            </p>
            <p>
              <span className="text-blue-400 font-semibold">Cross-check tip:</span> Compare this DCF result with your Comparable Company Analysis. If both point to a similar range, your valuation story is much more compelling.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button onClick={() => setTab(2)} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-colors">← Back to Analysis</button>
          <button onClick={exportCSV} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors">Export CSV Report</button>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-xs text-yellow-400/80">
            <strong>Educational Tool:</strong> This simplified DCF model uses constant annual growth rates and linear margin interpolation. Institutional DCF models project each year independently with segment-level detail. Use these results as directional guidance — always work with qualified M&A advisors for transaction-specific valuations.
          </p>
        </div>
      </div>
    );
  };

  // ─── Main Render ──────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-white/5 rounded-lg p-1 max-w-2xl mx-auto">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${tab === i ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            {t}
          </button>
        ))}
      </div>
      {tab === 0 && renderTab0()}
      {tab === 1 && renderTab1()}
      {tab === 2 && renderTab2()}
      {tab === 3 && renderTab3()}
    </div>
  );
}
