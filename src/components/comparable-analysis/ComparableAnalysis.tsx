import React, { useState, useEffect, useMemo } from 'react';
import { getCompanyProfile } from '@/lib/companyProfile';

// ─── Types ──────────────────────────────────────────────────────────────

interface UserMetrics {
  industry: string;
  revenue: number;        // $M
  revenueGrowth: number;  // %
  grossMargin: number;    // %
  ebitda: number;         // $M
  ebitdaMargin: number;   // %
  netMargin: number;      // %
  customerCount: number;
  topCustomerPct: number; // %
  recurringRevPct: number;// %
  employeeCount: number;
}

interface Benchmark {
  min: number;
  p25: number;
  median: number;
  p75: number;
  max: number;
}

interface IndustryBenchmarks {
  label: string;
  revenueGrowth: Benchmark;
  grossMargin: Benchmark;
  ebitdaMargin: Benchmark;
  netMargin: Benchmark;
  topCustomerPct: Benchmark;     // lower is better
  recurringRevPct: Benchmark;
  revenuePerEmployee: Benchmark; // $K
  evToRevenue: Benchmark;        // x
  evToEbitda: Benchmark;         // x
  premiumDrivers: string[];
  discountDrivers: string[];
}

// ─── Industry Benchmark Data ────────────────────────────────────────────
// Educational benchmarks for private company comparison — not real-time market data

const INDUSTRY_DATA: Record<string, IndustryBenchmarks> = {
  'SaaS / Software': {
    label: 'SaaS / Software',
    revenueGrowth: { min: 5, p25: 12, median: 22, p75: 35, max: 60 },
    grossMargin: { min: 55, p25: 65, median: 72, p75: 80, max: 90 },
    ebitdaMargin: { min: -5, p25: 8, median: 18, p75: 28, max: 40 },
    netMargin: { min: -15, p25: 2, median: 10, p75: 20, max: 30 },
    topCustomerPct: { min: 2, p25: 5, median: 10, p75: 18, max: 35 },
    recurringRevPct: { min: 50, p25: 70, median: 85, p75: 92, max: 98 },
    revenuePerEmployee: { min: 100, p25: 150, median: 220, p75: 300, max: 500 },
    evToRevenue: { min: 2, p25: 4, median: 7, p75: 12, max: 20 },
    evToEbitda: { min: 10, p25: 15, median: 22, p75: 30, max: 45 },
    premiumDrivers: ['High net dollar retention (>120%)', 'Rule of 40 compliance', 'Low customer concentration', 'High gross margins (>75%)', 'Strong ARR growth'],
    discountDrivers: ['Customer concentration >25%', 'Below 60% gross margin', 'Negative growth', 'High churn (>15%/year)', 'Heavy professional services mix'],
  },
  'Healthcare Services': {
    label: 'Healthcare Services',
    revenueGrowth: { min: 2, p25: 5, median: 10, p75: 18, max: 30 },
    grossMargin: { min: 25, p25: 35, median: 45, p75: 55, max: 70 },
    ebitdaMargin: { min: 3, p25: 8, median: 14, p75: 22, max: 30 },
    netMargin: { min: -2, p25: 3, median: 8, p75: 14, max: 20 },
    topCustomerPct: { min: 3, p25: 8, median: 15, p75: 25, max: 45 },
    recurringRevPct: { min: 40, p25: 55, median: 70, p75: 82, max: 95 },
    revenuePerEmployee: { min: 80, p25: 120, median: 175, p75: 250, max: 400 },
    evToRevenue: { min: 0.8, p25: 1.5, median: 2.5, p75: 4, max: 7 },
    evToEbitda: { min: 8, p25: 11, median: 14, p75: 18, max: 25 },
    premiumDrivers: ['Multi-location platform', 'Payor diversification', 'Strong reimbursement trends', 'Technology-enabled delivery', 'Recurring patient relationships'],
    discountDrivers: ['Single-provider dependency', 'Regulatory/reimbursement risk', 'High payor concentration', 'Thin margins (<10% EBITDA)', 'No proprietary technology'],
  },
  'Manufacturing / Industrial': {
    label: 'Manufacturing / Industrial',
    revenueGrowth: { min: -2, p25: 3, median: 7, p75: 12, max: 20 },
    grossMargin: { min: 18, p25: 25, median: 32, p75: 40, max: 55 },
    ebitdaMargin: { min: 5, p25: 10, median: 15, p75: 20, max: 28 },
    netMargin: { min: 1, p25: 4, median: 8, p75: 13, max: 18 },
    topCustomerPct: { min: 5, p25: 10, median: 18, p75: 28, max: 50 },
    recurringRevPct: { min: 15, p25: 30, median: 45, p75: 60, max: 80 },
    revenuePerEmployee: { min: 100, p25: 150, median: 220, p75: 300, max: 500 },
    evToRevenue: { min: 0.5, p25: 0.8, median: 1.3, p75: 2, max: 3.5 },
    evToEbitda: { min: 5, p25: 7, median: 9, p75: 12, max: 16 },
    premiumDrivers: ['Proprietary product/IP', 'Long-term contracts', 'Niche market dominance', 'Low capex intensity', 'Diversified customer base'],
    discountDrivers: ['Commodity product', 'Single customer >30%', 'Heavy capex requirements', 'Cyclical revenue', 'No proprietary advantage'],
  },
  'Professional Services': {
    label: 'Professional Services',
    revenueGrowth: { min: 2, p25: 5, median: 10, p75: 18, max: 30 },
    grossMargin: { min: 30, p25: 40, median: 50, p75: 60, max: 75 },
    ebitdaMargin: { min: 5, p25: 10, median: 16, p75: 22, max: 30 },
    netMargin: { min: 2, p25: 6, median: 10, p75: 16, max: 22 },
    topCustomerPct: { min: 5, p25: 10, median: 18, p75: 28, max: 45 },
    recurringRevPct: { min: 20, p25: 35, median: 55, p75: 70, max: 90 },
    revenuePerEmployee: { min: 80, p25: 120, median: 170, p75: 230, max: 350 },
    evToRevenue: { min: 0.5, p25: 1, median: 1.8, p75: 3, max: 5 },
    evToEbitda: { min: 6, p25: 8, median: 11, p75: 15, max: 20 },
    premiumDrivers: ['Recurring/subscription revenue', 'Scalable delivery model', 'Niche expertise', 'Strong utilization rates', 'Technology-enabled service'],
    discountDrivers: ['Key-person dependency', 'Project-based revenue', 'High employee turnover', 'Client concentration >25%', 'Low barriers to entry'],
  },
  'Consumer / Retail': {
    label: 'Consumer / Retail',
    revenueGrowth: { min: -3, p25: 3, median: 8, p75: 15, max: 30 },
    grossMargin: { min: 20, p25: 30, median: 42, p75: 55, max: 70 },
    ebitdaMargin: { min: 3, p25: 7, median: 12, p75: 18, max: 25 },
    netMargin: { min: -1, p25: 3, median: 6, p75: 11, max: 16 },
    topCustomerPct: { min: 2, p25: 5, median: 10, p75: 18, max: 35 },
    recurringRevPct: { min: 10, p25: 25, median: 40, p75: 60, max: 80 },
    revenuePerEmployee: { min: 80, p25: 120, median: 180, p75: 260, max: 400 },
    evToRevenue: { min: 0.4, p25: 0.8, median: 1.5, p75: 2.5, max: 5 },
    evToEbitda: { min: 5, p25: 7, median: 10, p75: 14, max: 20 },
    premiumDrivers: ['Strong brand recognition', 'E-commerce / DTC channel', 'High repeat purchase rate', 'Margin expansion story', 'Category leadership'],
    discountDrivers: ['Commodity positioning', 'Thin margins', 'Declining same-store sales', 'Heavy brick-and-mortar dependency', 'Seasonal concentration'],
  },
  'Construction / Trades': {
    label: 'Construction / Trades',
    revenueGrowth: { min: -5, p25: 3, median: 8, p75: 15, max: 25 },
    grossMargin: { min: 15, p25: 22, median: 30, p75: 38, max: 50 },
    ebitdaMargin: { min: 3, p25: 8, median: 13, p75: 18, max: 25 },
    netMargin: { min: 1, p25: 3, median: 7, p75: 12, max: 18 },
    topCustomerPct: { min: 5, p25: 12, median: 22, p75: 35, max: 55 },
    recurringRevPct: { min: 5, p25: 15, median: 30, p75: 50, max: 70 },
    revenuePerEmployee: { min: 100, p25: 150, median: 200, p75: 280, max: 400 },
    evToRevenue: { min: 0.3, p25: 0.5, median: 0.8, p75: 1.3, max: 2.5 },
    evToEbitda: { min: 4, p25: 5.5, median: 7, p75: 9, max: 13 },
    premiumDrivers: ['Recurring service contracts', 'Multi-trade capabilities', 'Government/institutional clients', 'Scalable workforce model', 'Technology adoption'],
    discountDrivers: ['Project-based revenue only', 'Key customer dependency', 'Owner-operator model', 'Seasonal volatility', 'No recurring revenue'],
  },
};

const INDUSTRIES = Object.keys(INDUSTRY_DATA);

const STORAGE_KEY = 'comparable-analysis-v1';

// ─── Helpers ────────────────────────────────────────────────────────────

function getPercentile(value: number, bench: Benchmark): number {
  if (value <= bench.min) return 0;
  if (value >= bench.max) return 100;
  if (value <= bench.p25) return 25 * ((value - bench.min) / (bench.p25 - bench.min));
  if (value <= bench.median) return 25 + 25 * ((value - bench.p25) / (bench.median - bench.p25));
  if (value <= bench.p75) return 50 + 25 * ((value - bench.median) / (bench.p75 - bench.median));
  return 75 + 25 * ((value - bench.p75) / (bench.max - bench.p75));
}

function getPercentileLabel(pct: number): string {
  if (pct >= 75) return 'Top Quartile';
  if (pct >= 50) return 'Above Median';
  if (pct >= 25) return 'Below Median';
  return 'Bottom Quartile';
}

function getPercentileColor(pct: number, lowerIsBetter = false): string {
  const effective = lowerIsBetter ? 100 - pct : pct;
  if (effective >= 75) return 'text-emerald-400';
  if (effective >= 50) return 'text-blue-400';
  if (effective >= 25) return 'text-yellow-400';
  return 'text-red-400';
}

function getBarColor(pct: number, lowerIsBetter = false): string {
  const effective = lowerIsBetter ? 100 - pct : pct;
  if (effective >= 75) return 'bg-emerald-500';
  if (effective >= 50) return 'bg-blue-500';
  if (effective >= 25) return 'bg-yellow-500';
  return 'bg-red-500';
}

function fmt(n: number, decimals = 1): string {
  return n.toFixed(decimals);
}

function fmtDollar(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}B`;
  return `$${n.toFixed(1)}M`;
}

// ─── Component ──────────────────────────────────────────────────────────

export function ComparableAnalysis() {
  const [tab, setTab] = useState(0);
  const tabs = ['What Are Comps?', 'Your Numbers', 'How You Stack Up', 'Your Report'];

  const defaultMetrics: UserMetrics = {
    industry: '',
    revenue: 0,
    revenueGrowth: 0,
    grossMargin: 0,
    ebitda: 0,
    ebitdaMargin: 0,
    netMargin: 0,
    customerCount: 0,
    topCustomerPct: 0,
    recurringRevPct: 0,
    employeeCount: 0,
  };

  const [metrics, setMetrics] = useState<UserMetrics>(defaultMetrics);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setMetrics(m => ({ ...m, ...JSON.parse(saved) }));
        return;
      }
    } catch { /* ignore */ }

    // Auto-fill from Company Profile if no saved data
    const profile = getCompanyProfile();
    const prefill: Partial<UserMetrics> = {};
    if (profile.industry) prefill.industry = profile.industry;
    if (profile.annualRevenue) prefill.revenue = profile.annualRevenue;
    if (profile.ebitda) prefill.ebitda = profile.ebitda;
    if (profile.ebitdaMargin) prefill.ebitdaMargin = profile.ebitdaMargin;
    if (profile.grossMarginPercent) prefill.grossMargin = profile.grossMarginPercent;
    if (profile.revenueGrowthRate) prefill.revenueGrowth = profile.revenueGrowthRate;
    if (profile.customerCount) prefill.customerCount = profile.customerCount;
    if (profile.top10CustomerConcentration) prefill.topCustomerPct = profile.top10CustomerConcentration;
    if (profile.employeeCount) prefill.employeeCount = profile.employeeCount;
    if (Object.keys(prefill).length > 0) {
      setMetrics(m => ({ ...m, ...prefill }));
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
  }, [metrics]);

  const update = (field: keyof UserMetrics, value: string | number) => {
    setMetrics(m => ({ ...m, [field]: value }));
  };

  const updateNum = (field: keyof UserMetrics, value: string) => {
    const num = parseFloat(value) || 0;
    setMetrics(m => ({ ...m, [field]: num }));
  };

  const benchmarks = metrics.industry ? INDUSTRY_DATA[metrics.industry] : null;
  const hasData = metrics.revenue > 0 || metrics.ebitda > 0;

  // Compute all percentile scores
  const scores = useMemo(() => {
    if (!benchmarks || !hasData) return null;
    const revPerEmployee = metrics.employeeCount > 0 ? (metrics.revenue * 1000) / metrics.employeeCount : 0;
    const autoEbitdaMargin = metrics.revenue > 0 ? (metrics.ebitda / metrics.revenue) * 100 : metrics.ebitdaMargin;

    return {
      revenueGrowth: { pct: getPercentile(metrics.revenueGrowth, benchmarks.revenueGrowth), value: metrics.revenueGrowth, label: 'Revenue Growth', unit: '%', bench: benchmarks.revenueGrowth },
      grossMargin: { pct: getPercentile(metrics.grossMargin, benchmarks.grossMargin), value: metrics.grossMargin, label: 'Gross Margin', unit: '%', bench: benchmarks.grossMargin },
      ebitdaMargin: { pct: getPercentile(autoEbitdaMargin, benchmarks.ebitdaMargin), value: autoEbitdaMargin, label: 'EBITDA Margin', unit: '%', bench: benchmarks.ebitdaMargin },
      netMargin: { pct: getPercentile(metrics.netMargin, benchmarks.netMargin), value: metrics.netMargin, label: 'Net Margin', unit: '%', bench: benchmarks.netMargin },
      topCustomerPct: { pct: getPercentile(metrics.topCustomerPct, benchmarks.topCustomerPct), value: metrics.topCustomerPct, label: 'Top Customer %', unit: '%', bench: benchmarks.topCustomerPct, lowerIsBetter: true },
      recurringRevPct: { pct: getPercentile(metrics.recurringRevPct, benchmarks.recurringRevPct), value: metrics.recurringRevPct, label: 'Recurring Revenue', unit: '%', bench: benchmarks.recurringRevPct },
      revenuePerEmployee: { pct: getPercentile(revPerEmployee, benchmarks.revenuePerEmployee), value: revPerEmployee, label: 'Revenue / Employee', unit: '$K', bench: benchmarks.revenuePerEmployee },
    };
  }, [metrics, benchmarks, hasData]);

  // Overall assessment
  const assessment = useMemo(() => {
    if (!scores) return null;
    const metricsList = Object.values(scores);
    const avgPct = metricsList.reduce((sum, m) => {
      // For "lower is better" metrics, invert the percentile
      const effective = (m as any).lowerIsBetter ? 100 - m.pct : m.pct;
      return sum + effective;
    }, 0) / metricsList.length;

    let tier: string, color: string, description: string;
    if (avgPct >= 75) { tier = 'Premium'; color = 'emerald'; description = 'Your metrics consistently outperform industry peers. PE firms will see a premium-quality asset worthy of top-quartile multiples.'; }
    else if (avgPct >= 60) { tier = 'Above Average'; color = 'blue'; description = 'You outperform the typical company in your industry on most metrics. With a few improvements, you could command premium pricing.'; }
    else if (avgPct >= 40) { tier = 'Average'; color = 'yellow'; description = 'Your metrics are in line with industry norms. You\'ll likely trade near median multiples. Focus on your standout metrics to tell a compelling story.'; }
    else if (avgPct >= 25) { tier = 'Below Average'; color = 'orange'; description = 'Several metrics fall below industry medians. PE firms will apply a discount unless you can demonstrate a clear improvement trajectory.'; }
    else { tier = 'Discount Territory'; color = 'red'; description = 'Most metrics fall in the bottom quartile. Significant operational improvement is needed before approaching PE buyers for optimal pricing.'; }

    // Strengths and concerns
    const strengths = metricsList
      .filter(m => ((m as any).lowerIsBetter ? 100 - m.pct : m.pct) >= 60)
      .sort((a, b) => ((b as any).lowerIsBetter ? 100 - b.pct : b.pct) - ((a as any).lowerIsBetter ? 100 - a.pct : a.pct))
      .map(m => m.label);
    const concerns = metricsList
      .filter(m => ((m as any).lowerIsBetter ? 100 - m.pct : m.pct) < 40)
      .sort((a, b) => ((a as any).lowerIsBetter ? 100 - a.pct : a.pct) - ((b as any).lowerIsBetter ? 100 - b.pct : b.pct))
      .map(m => m.label);

    return { tier, color, description, avgPct, strengths, concerns };
  }, [scores]);

  // Implied valuation
  const valuation = useMemo(() => {
    if (!benchmarks || metrics.ebitda <= 0) return null;
    const ebitdaMarginPct = metrics.revenue > 0 ? (metrics.ebitda / metrics.revenue) * 100 : 0;
    const marginPct = getPercentile(ebitdaMarginPct, benchmarks.ebitdaMargin);
    const growthPct = getPercentile(metrics.revenueGrowth, benchmarks.revenueGrowth);
    const qualityPct = (marginPct + growthPct) / 2;

    // Interpolate EV/EBITDA based on quality score
    const evBench = benchmarks.evToEbitda;
    let impliedMultiple: number;
    if (qualityPct >= 75) impliedMultiple = evBench.p75 + (qualityPct - 75) / 25 * (evBench.max - evBench.p75);
    else if (qualityPct >= 50) impliedMultiple = evBench.median + (qualityPct - 50) / 25 * (evBench.p75 - evBench.median);
    else if (qualityPct >= 25) impliedMultiple = evBench.p25 + (qualityPct - 25) / 25 * (evBench.median - evBench.p25);
    else impliedMultiple = evBench.min + qualityPct / 25 * (evBench.p25 - evBench.min);

    const low = metrics.ebitda * (impliedMultiple * 0.85);
    const mid = metrics.ebitda * impliedMultiple;
    const high = metrics.ebitda * (impliedMultiple * 1.15);

    return { multiple: impliedMultiple, low, mid, high, evBench };
  }, [benchmarks, metrics]);

  // CSV export
  const exportCSV = () => {
    if (!scores || !assessment || !benchmarks) return;
    const lines: string[] = [];
    lines.push('Comparable Company Analysis Report');
    lines.push(`Industry,${metrics.industry}`);
    lines.push(`Revenue,$${metrics.revenue}M`);
    lines.push(`EBITDA,$${metrics.ebitda}M`);
    lines.push(`Overall Assessment,${assessment.tier}`);
    lines.push(`Average Percentile,${fmt(assessment.avgPct, 0)}th`);
    lines.push('');
    lines.push('Metric,Your Value,Min,25th Pct,Median,75th Pct,Max,Your Percentile,Position');
    Object.values(scores).forEach(s => {
      const pctLabel = getPercentileLabel((s as any).lowerIsBetter ? 100 - s.pct : s.pct);
      lines.push(`${s.label},${fmt(s.value)}${s.unit},${fmt(s.bench.min)},${fmt(s.bench.p25)},${fmt(s.bench.median)},${fmt(s.bench.p75)},${fmt(s.bench.max)},${fmt(s.pct, 0)},${pctLabel}`);
    });
    if (valuation) {
      lines.push('');
      lines.push('Implied Valuation');
      lines.push(`Implied EV/EBITDA Multiple,${fmt(valuation.multiple)}x`);
      lines.push(`Low Estimate,${fmtDollar(valuation.low)}`);
      lines.push(`Mid Estimate,${fmtDollar(valuation.mid)}`);
      lines.push(`High Estimate,${fmtDollar(valuation.high)}`);
    }
    lines.push('');
    lines.push('Strengths,' + assessment.strengths.join(' | '));
    lines.push('Concerns,' + assessment.concerns.join(' | '));
    lines.push('');
    lines.push('Premium Drivers,' + benchmarks.premiumDrivers.join(' | '));
    lines.push('Discount Drivers,' + benchmarks.discountDrivers.join(' | '));

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comparable-analysis-${metrics.industry.replace(/[^a-zA-Z]/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Render helpers ────────────────────────────────────────────────

  const inputField = (label: string, field: keyof UserMetrics, suffix: string, placeholder = '0') => (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={metrics[field] || ''}
          onChange={e => updateNum(field, e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
        />
        <span className="text-gray-500 text-sm whitespace-nowrap">{suffix}</span>
      </div>
    </div>
  );

  const benchmarkBar = (score: { pct: number; value: number; label: string; unit: string; bench: Benchmark; lowerIsBetter?: boolean }) => {
    const effectivePct = score.lowerIsBetter ? 100 - score.pct : score.pct;
    const color = getBarColor(score.pct, score.lowerIsBetter);
    const textColor = getPercentileColor(score.pct, score.lowerIsBetter);
    const posLabel = getPercentileLabel(effectivePct);
    return (
      <div key={score.label} className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-sm font-semibold text-white">{score.label}</div>
            <div className={`text-lg font-bold ${textColor}`}>
              {score.unit === '$K' ? `$${fmt(score.value, 0)}K` : `${fmt(score.value)}${score.unit}`}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-semibold ${textColor}`}>{posLabel}</div>
            <div className="text-xs text-gray-500">{fmt(score.pct, 0)}th percentile</div>
          </div>
        </div>
        {/* Visual bar */}
        <div className="relative h-6 bg-white/5 rounded-full overflow-hidden mb-2">
          {/* Quartile markers */}
          <div className="absolute top-0 bottom-0 left-[25%] w-px bg-white/10" />
          <div className="absolute top-0 bottom-0 left-[50%] w-px bg-white/20" />
          <div className="absolute top-0 bottom-0 left-[75%] w-px bg-white/10" />
          {/* Position marker */}
          <div
            className={`absolute top-0 bottom-0 w-1.5 rounded-full ${color}`}
            style={{ left: `${Math.max(1, Math.min(99, score.pct))}%`, transform: 'translateX(-50%)' }}
          />
        </div>
        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{fmt(score.bench.min)}</span>
          <span>25th: {fmt(score.bench.p25)}</span>
          <span>Med: {fmt(score.bench.median)}</span>
          <span>75th: {fmt(score.bench.p75)}</span>
          <span>{fmt(score.bench.max)}</span>
        </div>
        {score.lowerIsBetter && (
          <div className="text-xs text-gray-500 mt-1 italic">Lower is better for this metric</div>
        )}
      </div>
    );
  };

  // ─── Tab Content ──────────────────────────────────────────────────

  const renderTab0 = () => (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-3">How Do You Stack Up?</h2>
        <p className="text-gray-300 leading-relaxed">
          Every PE firm runs a comparable company analysis ("comps") before making an offer. They look at companies similar to yours — same industry, similar size — and compare key metrics to determine if you're a premium asset or a discount deal.
        </p>
      </div>

      {/* What PE Firms Compare */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">What PE Firms Compare</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Growth Profile', desc: 'How fast are you growing vs. peers? Faster growth = higher multiple.' },
            { title: 'Margin Quality', desc: 'Gross margin, EBITDA margin, net margin — are you more profitable than peers?' },
            { title: 'Revenue Quality', desc: 'What % is recurring? How concentrated are your customers? More predictable = more valuable.' },
            { title: 'Efficiency', desc: 'Revenue per employee, overhead structure — are you lean or bloated compared to peers?' },
          ].map(item => (
            <div key={item.title} className="bg-white/5 rounded-lg p-4">
              <div className="text-sm font-semibold text-blue-400 mb-1">{item.title}</div>
              <div className="text-sm text-gray-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How Percentiles Work */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">How Percentiles Work</h3>
        <p className="text-gray-400 text-sm mb-4">
          We compare your metrics against industry benchmarks using percentile rankings. Think of it like grading on a curve:
        </p>
        <div className="space-y-2">
          {[
            { label: 'Top Quartile (75th+)', color: 'emerald', desc: 'You outperform 75%+ of peers — premium territory' },
            { label: 'Above Median (50th-75th)', color: 'blue', desc: 'Better than average — solid positioning' },
            { label: 'Below Median (25th-50th)', color: 'yellow', desc: 'Room for improvement — typical discount zone' },
            { label: 'Bottom Quartile (below 25th)', color: 'red', desc: 'Significant underperformance vs. peers — red flag for buyers' },
          ].map(tier => (
            <div key={tier.label} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
              <div className={`w-3 h-3 rounded-full bg-${tier.color}-500`} />
              <div>
                <span className={`text-sm font-semibold text-${tier.color}-400`}>{tier.label}</span>
                <span className="text-sm text-gray-400 ml-2">— {tier.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact on Valuation */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Why This Matters for Your Valuation</h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          A company trading at the 75th percentile on margins and growth might get a 12x EBITDA multiple, while the same company at the 25th percentile might only get 7x. On $3M of EBITDA, that's the difference between a <span className="text-emerald-400 font-semibold">$36M</span> exit and a <span className="text-yellow-400 font-semibold">$21M</span> exit — <span className="text-white font-semibold">$15M on the same business</span>.
        </p>
        <p className="text-gray-400 text-sm">
          Understanding where you fall — and improving your weakest metrics before going to market — is one of the highest-ROI things a seller can do.
        </p>
      </div>

      <div className="text-center">
        <button
          onClick={() => setTab(1)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Enter Your Numbers →
        </button>
      </div>
    </div>
  );

  const renderTab1 = () => (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Industry Selection */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Select Your Industry</h3>
        <p className="text-sm text-gray-400 mb-4">This determines which benchmark set we compare you against.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {INDUSTRIES.map(ind => (
            <button
              key={ind}
              onClick={() => update('industry', ind)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                metrics.industry === ind
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-1">Financial Metrics</h3>
        <p className="text-xs text-gray-500 mb-4">Revenue and EBITDA in millions (e.g., 5.2 = $5.2M)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputField('Annual Revenue', 'revenue', '$M', '5.0')}
          {inputField('Revenue Growth (YoY)', 'revenueGrowth', '%', '10')}
          {inputField('Gross Margin', 'grossMargin', '%', '45')}
          {inputField('EBITDA', 'ebitda', '$M', '1.0')}
          {inputField('EBITDA Margin', 'ebitdaMargin', '%', '20')}
          {inputField('Net Margin', 'netMargin', '%', '10')}
        </div>
      </div>

      {/* Operating Metrics */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-1">Operating Metrics</h3>
        <p className="text-xs text-gray-500 mb-4">These help determine revenue quality and efficiency.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputField('Customer Count', 'customerCount', 'customers', '50')}
          {inputField('Top Customer % of Revenue', 'topCustomerPct', '%', '15')}
          {inputField('Recurring Revenue %', 'recurringRevPct', '%', '50')}
          {inputField('Employee Count', 'employeeCount', 'employees', '25')}
        </div>
      </div>

      {/* Auto-calculated */}
      {metrics.revenue > 0 && metrics.employeeCount > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="text-sm text-blue-400 font-semibold mb-1">Auto-Calculated</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Revenue / Employee:</span>{' '}
              <span className="text-white font-semibold">${fmt((metrics.revenue * 1000) / metrics.employeeCount, 0)}K</span>
            </div>
            {metrics.revenue > 0 && metrics.ebitda > 0 && (
              <div>
                <span className="text-gray-400">Computed EBITDA Margin:</span>{' '}
                <span className="text-white font-semibold">{fmt((metrics.ebitda / metrics.revenue) * 100)}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={() => setTab(0)} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-colors">
          ← Back
        </button>
        <button
          onClick={() => setTab(2)}
          disabled={!metrics.industry || !hasData}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-semibold transition-colors"
        >
          See How You Stack Up →
        </button>
      </div>
    </div>
  );

  const renderTab2 = () => {
    if (!scores || !benchmarks || !assessment) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">Please select an industry and enter your financial data first.</p>
          <button onClick={() => setTab(1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
            Enter Your Numbers
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Overall Assessment Card */}
        <div className={`bg-gradient-to-br from-${assessment.color}-500/10 to-${assessment.color}-500/5 border border-${assessment.color}-500/20 rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-white">Your Position: {assessment.tier}</h3>
            <span className={`text-3xl font-bold text-${assessment.color}-400`}>{fmt(assessment.avgPct, 0)}th</span>
          </div>
          <p className="text-gray-300 text-sm">{assessment.description}</p>
        </div>

        {/* Operating Metrics */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Operating Metrics vs. {benchmarks.label} Peers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benchmarkBar(scores.revenueGrowth)}
            {benchmarkBar(scores.grossMargin)}
            {benchmarkBar(scores.ebitdaMargin)}
            {benchmarkBar(scores.netMargin)}
            {benchmarkBar(scores.recurringRevPct)}
            {benchmarkBar(scores.topCustomerPct)}
            {benchmarkBar(scores.revenuePerEmployee)}
          </div>
        </div>

        {/* Implied Valuation */}
        {valuation && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Implied Valuation Range</h3>
            <p className="text-sm text-gray-400 mb-4">
              Based on where your metrics fall relative to peers, here's the implied EV/EBITDA multiple and enterprise value range.
            </p>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Implied Multiple</div>
                <div className="text-xl font-bold text-blue-400">{fmt(valuation.multiple)}x</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Low</div>
                <div className="text-xl font-bold text-yellow-400">{fmtDollar(valuation.low)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Mid</div>
                <div className="text-xl font-bold text-emerald-400">{fmtDollar(valuation.mid)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">High</div>
                <div className="text-xl font-bold text-blue-400">{fmtDollar(valuation.high)}</div>
              </div>
            </div>
            {/* Context */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Industry Multiple Range ({benchmarks.label}):</div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Bottom: {fmt(valuation.evBench.min)}x</span>
                <span>25th: {fmt(valuation.evBench.p25)}x</span>
                <span>Median: {fmt(valuation.evBench.median)}x</span>
                <span>75th: {fmt(valuation.evBench.p75)}x</span>
                <span>Top: {fmt(valuation.evBench.max)}x</span>
              </div>
              <div className="relative h-4 bg-white/5 rounded-full mt-2 overflow-hidden">
                <div className="absolute top-0 bottom-0 left-[25%] w-px bg-white/10" />
                <div className="absolute top-0 bottom-0 left-[50%] w-px bg-white/20" />
                <div className="absolute top-0 bottom-0 left-[75%] w-px bg-white/10" />
                <div
                  className="absolute top-0 bottom-0 w-2 rounded-full bg-blue-500"
                  style={{ left: `${Math.max(2, Math.min(98, ((valuation.multiple - valuation.evBench.min) / (valuation.evBench.max - valuation.evBench.min)) * 100))}%`, transform: 'translateX(-50%)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Premium vs Discount Drivers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-emerald-400 mb-3">What Drives Premium Multiples</h4>
            <ul className="space-y-2">
              {benchmarks.premiumDrivers.map(d => (
                <li key={d} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-emerald-500 mt-0.5">+</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-red-400 mb-3">What Drives Discount Multiples</h4>
            <ul className="space-y-2">
              {benchmarks.discountDrivers.map(d => (
                <li key={d} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-red-500 mt-0.5">−</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-between">
          <button onClick={() => setTab(1)} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-colors">
            ← Edit Numbers
          </button>
          <button onClick={() => setTab(3)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
            View Full Report →
          </button>
        </div>
      </div>
    );
  };

  const renderTab3 = () => {
    if (!scores || !benchmarks || !assessment) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">Complete the analysis first to generate your report.</p>
          <button onClick={() => setTab(1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Enter Your Numbers</button>
        </div>
      );
    }

    const scoreEntries = Object.values(scores);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-1">Comparable Company Analysis Report</h2>
          <p className="text-gray-400 text-sm">{metrics.industry} | Revenue: {fmtDollar(metrics.revenue)} | EBITDA: {fmtDollar(metrics.ebitda)}</p>
        </div>

        {/* Overall */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Overall Assessment</h3>
          <div className="flex items-center gap-4 mb-3">
            <span className={`text-2xl font-bold ${
              assessment.color === 'emerald' ? 'text-emerald-400' :
              assessment.color === 'blue' ? 'text-blue-400' :
              assessment.color === 'yellow' ? 'text-yellow-400' :
              assessment.color === 'orange' ? 'text-orange-400' : 'text-red-400'
            }`}>
              {assessment.tier}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">{fmt(assessment.avgPct, 0)}th percentile overall</span>
          </div>
          <p className="text-sm text-gray-300">{assessment.description}</p>
        </div>

        {/* Metric Breakdown Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Metric-by-Metric Breakdown</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-white/10">
                <th className="text-left py-2 pr-4">Metric</th>
                <th className="text-center py-2 px-2">You</th>
                <th className="text-center py-2 px-2">Min</th>
                <th className="text-center py-2 px-2">25th</th>
                <th className="text-center py-2 px-2">Median</th>
                <th className="text-center py-2 px-2">75th</th>
                <th className="text-center py-2 px-2">Max</th>
                <th className="text-center py-2 px-2">Position</th>
              </tr>
            </thead>
            <tbody>
              {scoreEntries.map(s => {
                const effectivePct = (s as any).lowerIsBetter ? 100 - s.pct : s.pct;
                const textColor = getPercentileColor(s.pct, (s as any).lowerIsBetter);
                return (
                  <tr key={s.label} className="border-b border-white/5">
                    <td className="py-2 pr-4 text-gray-300">{s.label}</td>
                    <td className={`text-center py-2 px-2 font-semibold ${textColor}`}>
                      {s.unit === '$K' ? `$${fmt(s.value, 0)}K` : `${fmt(s.value)}${s.unit}`}
                    </td>
                    <td className="text-center py-2 px-2 text-gray-500">{fmt(s.bench.min)}</td>
                    <td className="text-center py-2 px-2 text-gray-500">{fmt(s.bench.p25)}</td>
                    <td className="text-center py-2 px-2 text-gray-400 font-medium">{fmt(s.bench.median)}</td>
                    <td className="text-center py-2 px-2 text-gray-500">{fmt(s.bench.p75)}</td>
                    <td className="text-center py-2 px-2 text-gray-500">{fmt(s.bench.max)}</td>
                    <td className={`text-center py-2 px-2 font-semibold ${textColor}`}>{getPercentileLabel(effectivePct)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Strengths & Concerns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-emerald-400 mb-3">Your Strengths</h4>
            {assessment.strengths.length > 0 ? (
              <ul className="space-y-2">
                {assessment.strengths.map(s => (
                  <li key={s} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-emerald-500">&#10003;</span> {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No metrics above 60th percentile yet.</p>
            )}
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-red-400 mb-3">Areas for Improvement</h4>
            {assessment.concerns.length > 0 ? (
              <ul className="space-y-2">
                {assessment.concerns.map(c => (
                  <li key={c} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-red-500">!</span> {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No metrics below 40th percentile — strong performance.</p>
            )}
          </div>
        </div>

        {/* Valuation Context */}
        {valuation && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Implied Valuation</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-500">Implied Multiple</div>
                <div className="text-xl font-bold text-blue-400">{fmt(valuation.multiple)}x EBITDA</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Low Estimate</div>
                <div className="text-xl font-bold text-yellow-400">{fmtDollar(valuation.low)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Mid Estimate</div>
                <div className="text-xl font-bold text-emerald-400">{fmtDollar(valuation.mid)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">High Estimate</div>
                <div className="text-xl font-bold text-blue-400">{fmtDollar(valuation.high)}</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic">
              Based on your operating metrics relative to {benchmarks.label} industry benchmarks. Actual transaction values depend on deal structure, market conditions, buyer synergies, and negotiation dynamics.
            </p>
          </div>
        )}

        {/* What PE Firms Will Think */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">What PE Firms Will Think</h3>
          <div className="space-y-3 text-sm text-gray-300">
            {assessment.strengths.length > 0 && (
              <p>
                <span className="text-emerald-400 font-semibold">Bull case:</span> Your strong performance in {assessment.strengths.slice(0, 3).join(', ')} positions you well. Buyers looking for quality in the {benchmarks.label} space will see these as attractive attributes that justify a premium multiple.
              </p>
            )}
            {assessment.concerns.length > 0 && (
              <p>
                <span className="text-red-400 font-semibold">Bear case:</span> Buyers will flag {assessment.concerns.slice(0, 3).join(', ')} as areas of concern. Expect questions about improvement plans and haircuts on these metrics during due diligence.
              </p>
            )}
            <p>
              <span className="text-blue-400 font-semibold">Bottom line:</span>{' '}
              {assessment.avgPct >= 60
                ? 'Your metrics support a competitive process with multiple interested buyers. Focus on maintaining momentum in your strong areas while addressing any gaps.'
                : assessment.avgPct >= 40
                ? 'You\'re in the range where preparation matters most. Improving your weakest 1-2 metrics before going to market could move the needle by 1-2x on your EBITDA multiple.'
                : 'Consider a 12-18 month operational improvement plan before engaging with PE buyers. The ROI on improving metrics from bottom quartile to median can be massive in terms of valuation impact.'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button onClick={() => setTab(2)} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-colors">
            ← Back to Analysis
          </button>
          <button
            onClick={exportCSV}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
          >
            Export CSV Report
          </button>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-xs text-yellow-400/80">
            <strong>Educational Tool:</strong> Benchmarks are representative industry ranges for private company comparison and do not represent specific public company data. Actual valuations depend on many factors including deal structure, market conditions, buyer pool, and negotiation. Always work with qualified M&A advisors for transaction-specific guidance.
          </p>
        </div>
      </div>
    );
  };

  // ─── Main Render ──────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1 max-w-2xl mx-auto">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              tab === i
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 0 && renderTab0()}
      {tab === 1 && renderTab1()}
      {tab === 2 && renderTab2()}
      {tab === 3 && renderTab3()}
    </div>
  );
}
