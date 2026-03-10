import React, { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────

interface YearData {
  year: string;
  // Income Statement
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  ownerComp: number;
  depreciation: number;
  amortization: number;
  interestExpense: number;
  otherIncome: number;
  // Balance Sheet
  cash: number;
  accountsReceivable: number;
  inventory: number;
  otherCurrentAssets: number;
  fixedAssets: number;
  otherAssets: number;
  accountsPayable: number;
  accruedLiabilities: number;
  currentDebt: number;
  longTermDebt: number;
  // Operating Metrics
  customerCount: number;
  employeeCount: number;
  recurringRevenuePct: number;
  topCustomerPct: number;
  capex: number;
}

interface Adjustment {
  id: string;
  name: string;
  description: string;
  amounts: Record<string, number>;
}

interface RedFlag {
  id: string;
  category: string;
  finding: string;
  severity: 'high' | 'medium' | 'low';
  buyerThinking: string;
  action: string;
}

const STORAGE_KEY = 'financial-data-room-v1';

const DEFAULT_ADJUSTMENTS: Adjustment[] = [
  { id: 'excess-comp', name: 'Excess Owner Compensation', description: 'Amount above market rate for your role', amounts: {} },
  { id: 'one-time-legal', name: 'One-Time Legal / Professional', description: 'Lawsuits, settlements, or unusual professional fees', amounts: {} },
  { id: 'personal-expenses', name: 'Personal Expenses Through Business', description: 'Personal vehicles, travel, meals, family expenses', amounts: {} },
  { id: 'related-party', name: 'Related Party Adjustments', description: 'Above-market rent to self, family payroll, etc.', amounts: {} },
  { id: 'non-recurring', name: 'Non-Recurring Items', description: 'COVID impacts, natural disasters, one-time costs', amounts: {} },
  { id: 'other', name: 'Other Add-Backs', description: 'Any other items that don\'t reflect ongoing operations', amounts: {} },
];

function makeEmptyYear(year: string): YearData {
  return {
    year, revenue: 0, cogs: 0, operatingExpenses: 0, ownerComp: 0,
    depreciation: 0, amortization: 0, interestExpense: 0, otherIncome: 0,
    cash: 0, accountsReceivable: 0, inventory: 0, otherCurrentAssets: 0,
    fixedAssets: 0, otherAssets: 0, accountsPayable: 0, accruedLiabilities: 0,
    currentDebt: 0, longTermDebt: 0, customerCount: 0, employeeCount: 0,
    recurringRevenuePct: 0, topCustomerPct: 0, capex: 0,
  };
}

function generateYears(count: number): YearData[] {
  const currentYear = new Date().getFullYear();
  const years: YearData[] = [];
  for (let i = count; i >= 1; i--) {
    years.push(makeEmptyYear(String(currentYear - i)));
  }
  return years;
}

// ─── Calculation helpers ──────────────────────────────────────────────────

function grossProfit(y: YearData) { return y.revenue - y.cogs; }
function grossMargin(y: YearData) { return y.revenue ? ((grossProfit(y) / y.revenue) * 100) : 0; }
function ebitda(y: YearData) { return y.revenue - y.cogs - y.operatingExpenses - y.ownerComp + y.depreciation + y.amortization + y.otherIncome; }
function ebitdaMargin(y: YearData) { return y.revenue ? ((ebitda(y) / y.revenue) * 100) : 0; }
function netIncome(y: YearData) { return ebitda(y) - y.depreciation - y.amortization - y.interestExpense; }
function totalCurrentAssets(y: YearData) { return y.cash + y.accountsReceivable + y.inventory + y.otherCurrentAssets; }
function totalAssets(y: YearData) { return totalCurrentAssets(y) + y.fixedAssets + y.otherAssets; }
function totalCurrentLiabilities(y: YearData) { return y.accountsPayable + y.accruedLiabilities + y.currentDebt; }
function totalLiabilities(y: YearData) { return totalCurrentLiabilities(y) + y.longTermDebt; }
function totalEquity(y: YearData) { return totalAssets(y) - totalLiabilities(y); }
function workingCapital(y: YearData) { return (y.accountsReceivable + y.inventory + y.otherCurrentAssets) - (y.accountsPayable + y.accruedLiabilities); }

function adjustedEbitda(y: YearData, adjustments: Adjustment[]) {
  const base = ebitda(y);
  const addBacks = adjustments.reduce((sum, adj) => sum + (adj.amounts[y.year] || 0), 0);
  return base + addBacks;
}

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function pct(n: number): string { return `${n.toFixed(1)}%`; }

// ─── Red Flag Engine ──────────────────────────────────────────────────────

function analyzeRedFlags(years: YearData[], adjustments: Adjustment[]): RedFlag[] {
  const flags: RedFlag[] = [];
  if (years.length < 2 || !years.some(y => y.revenue > 0)) return flags;

  const validYears = years.filter(y => y.revenue > 0);
  if (validYears.length < 2) return flags;

  // Revenue growth trend
  const growthRates: number[] = [];
  for (let i = 1; i < validYears.length; i++) {
    const prev = validYears[i - 1].revenue;
    if (prev > 0) growthRates.push(((validYears[i].revenue - prev) / prev) * 100);
  }
  if (growthRates.length >= 2) {
    const lastGrowth = growthRates[growthRates.length - 1];
    const prevGrowth = growthRates[growthRates.length - 2];
    if (lastGrowth < prevGrowth && lastGrowth < 5) {
      flags.push({ id: 'declining-growth', category: 'Revenue', finding: `Revenue growth declined from ${pct(prevGrowth)} to ${pct(lastGrowth)}`, severity: lastGrowth < 0 ? 'high' : 'medium', buyerThinking: 'Is this business losing momentum? Will growth continue to decelerate post-close?', action: 'Prepare a clear explanation for the slowdown and evidence of a recovery path.' });
    }
  }

  // Gross margin trend
  const margins = validYears.map(y => grossMargin(y));
  if (margins.length >= 2) {
    const last = margins[margins.length - 1];
    const first = margins[0];
    if (last < first - 3) {
      flags.push({ id: 'declining-margin', category: 'Profitability', finding: `Gross margin declined from ${pct(first)} to ${pct(last)} over the period`, severity: last < first - 10 ? 'high' : 'medium', buyerThinking: 'Are costs increasing? Is pricing power weakening? This directly impacts EBITDA.', action: 'Document the reasons (input cost changes, mix shifts, pricing decisions) and your plan to stabilize.' });
    }
  }

  // EBITDA margin check
  const lastYear = validYears[validYears.length - 1];
  const lastEbitdaMargin = ebitdaMargin(lastYear);
  if (lastEbitdaMargin < 10) {
    flags.push({ id: 'low-ebitda-margin', category: 'Profitability', finding: `EBITDA margin is ${pct(lastEbitdaMargin)} — below the 10-15% threshold most PE firms target`, severity: lastEbitdaMargin < 5 ? 'high' : 'medium', buyerThinking: 'Low margins mean less cash flow to service acquisition debt. The deal math gets harder.', action: 'Show your adjusted EBITDA with add-backs. Identify margin expansion opportunities.' });
  }

  // Owner compensation
  if (lastYear.ownerComp > 0 && lastYear.revenue > 0) {
    const compPct = (lastYear.ownerComp / lastYear.revenue) * 100;
    if (compPct > 15) {
      flags.push({ id: 'high-owner-comp', category: 'Owner Dependency', finding: `Owner compensation is ${pct(compPct)} of revenue (${fmt(lastYear.ownerComp)})`, severity: compPct > 25 ? 'high' : 'medium', buyerThinking: 'How much of this is a legitimate add-back vs. actually needed to run the business?', action: 'Research market-rate salary for a replacement CEO/GM. The excess above market is a valid add-back.' });
    }
  }

  // Customer concentration
  if (lastYear.topCustomerPct > 20) {
    flags.push({ id: 'customer-concentration', category: 'Revenue Quality', finding: `Top customer represents ${pct(lastYear.topCustomerPct)} of revenue`, severity: lastYear.topCustomerPct > 30 ? 'high' : 'medium', buyerThinking: 'What happens if that customer leaves? This is a single point of failure.', action: 'Document the relationship length, contract terms, and your diversification plan.' });
  }

  // Low recurring revenue
  if (lastYear.recurringRevenuePct > 0 && lastYear.recurringRevenuePct < 50) {
    flags.push({ id: 'low-recurring', category: 'Revenue Quality', finding: `Only ${pct(lastYear.recurringRevenuePct)} of revenue is recurring or contractual`, severity: lastYear.recurringRevenuePct < 30 ? 'high' : 'medium', buyerThinking: 'Non-recurring revenue has to be re-won every year. That is riskier and worth a lower multiple.', action: 'Identify opportunities to convert one-time revenue to subscriptions, retainers, or long-term contracts.' });
  }

  // Working capital trend
  const wcValues = validYears.map(y => workingCapital(y));
  if (wcValues.length >= 2) {
    const wcLast = wcValues[wcValues.length - 1];
    const wcFirst = wcValues[0];
    if (wcLast < wcFirst * 0.8 && wcFirst > 0) {
      flags.push({ id: 'wc-declining', category: 'Balance Sheet', finding: `Working capital declined from ${fmt(wcFirst)} to ${fmt(wcLast)}`, severity: 'medium', buyerThinking: 'Declining working capital could mean the peg will be unfavorable. Cash may be needed at close.', action: 'Review AR collection times, inventory levels, and AP terms. Stabilize before going to market.' });
    }
  }

  // Debt levels
  const totalDebt = lastYear.currentDebt + lastYear.longTermDebt;
  const lastEbitda = ebitda(lastYear);
  if (totalDebt > 0 && lastEbitda > 0) {
    const leverage = totalDebt / lastEbitda;
    if (leverage > 3) {
      flags.push({ id: 'high-leverage', category: 'Balance Sheet', finding: `Total debt of ${fmt(totalDebt)} represents ${leverage.toFixed(1)}x EBITDA`, severity: leverage > 5 ? 'high' : 'medium', buyerThinking: 'High existing debt complicates the transaction. Debt will need to be paid off from proceeds.', action: 'Understand your payoff amounts. This reduces your net proceeds — factor it into your walk-away number.' });
    }
  }

  // CapEx vs D&A
  const totalDA = lastYear.depreciation + lastYear.amortization;
  if (lastYear.capex > 0 && totalDA > 0 && lastYear.capex < totalDA * 0.5) {
    flags.push({ id: 'low-capex', category: 'Operations', finding: `CapEx (${fmt(lastYear.capex)}) is less than half of D&A (${fmt(totalDA)}) — possible under-investment`, severity: 'medium', buyerThinking: 'Is the business deferring maintenance to inflate EBITDA? We may need to spend to catch up post-close.', action: 'If CapEx is genuinely low, explain why (e.g., asset-light model, recent large investment cycle complete).' });
  }

  // Revenue volatility
  if (growthRates.length >= 2) {
    const maxGrowth = Math.max(...growthRates);
    const minGrowth = Math.min(...growthRates);
    if (maxGrowth - minGrowth > 30) {
      flags.push({ id: 'revenue-volatility', category: 'Revenue', finding: `Revenue growth swung from ${pct(minGrowth)} to ${pct(maxGrowth)} — high volatility`, severity: 'medium', buyerThinking: 'Unpredictable revenue makes forecasting difficult. We will discount our projections.', action: 'Explain the drivers behind each swing. Separate one-time events from underlying trends.' });
    }
  }

  // Adjusted EBITDA significant difference
  if (lastEbitda > 0) {
    const adjEbitda = adjustedEbitda(lastYear, adjustments);
    const adjustmentPct = ((adjEbitda - lastEbitda) / lastEbitda) * 100;
    if (adjustmentPct > 40) {
      flags.push({ id: 'large-adjustments', category: 'EBITDA Quality', finding: `Adjustments increase EBITDA by ${pct(adjustmentPct)} (${fmt(lastEbitda)} → ${fmt(adjEbitda)})`, severity: adjustmentPct > 60 ? 'high' : 'medium', buyerThinking: 'Large add-backs will get heavy scrutiny in the QoE. Not all of these may survive.', action: 'Have documentation ready for every add-back. The QoE accountants will test each one.' });
    }
  }

  return flags;
}

// ─── Component ────────────────────────────────────────────────────────────

const FinancialDataRoom: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [yearCount, setYearCount] = useState(3);
  const [years, setYears] = useState<YearData[]>(generateYears(3));
  const [adjustments, setAdjustments] = useState<Adjustment[]>(DEFAULT_ADJUSTMENTS.map(a => ({ ...a, amounts: {} })));
  const [expandedSection, setExpandedSection] = useState<string>('income');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.yearCount) setYearCount(data.yearCount);
        if (data.years) setYears(data.years);
        if (data.adjustments) setAdjustments(data.adjustments);
      } catch { /* ignore */ }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const data = { yearCount, years, adjustments };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [yearCount, years, adjustments]);

  const handleYearCountChange = (count: number) => {
    setYearCount(count);
    const newYears = generateYears(count);
    // Preserve existing data where years match
    const merged = newYears.map(ny => {
      const existing = years.find(y => y.year === ny.year);
      return existing || ny;
    });
    setYears(merged);
  };

  const updateYear = (yearIndex: number, field: keyof YearData, value: number) => {
    setYears(prev => prev.map((y, i) => i === yearIndex ? { ...y, [field]: value } : y));
  };

  const updateAdjustment = (adjIndex: number, year: string, value: number) => {
    setAdjustments(prev => prev.map((a, i) => i === adjIndex ? { ...a, amounts: { ...a.amounts, [year]: value } } : a));
  };

  const redFlags = analyzeRedFlags(years, adjustments);
  const hasData = years.some(y => y.revenue > 0);

  const tabs = ['Why PE Needs This', 'Your Financials', 'PE Analysis', 'Your Financial Package'];

  // ─── CSV Export ───────────────────────────────────────────────────────

  const exportCSV = () => {
    const lines: string[] = [];
    lines.push('Financial Data Room Prep — PE Ready Plus');
    lines.push(`Generated: ${new Date().toLocaleDateString()}`);
    lines.push('');

    // Income Statement
    lines.push('INCOME STATEMENT');
    lines.push(['', ...years.map(y => y.year)].join(','));
    lines.push(['Revenue', ...years.map(y => y.revenue)].join(','));
    lines.push(['COGS', ...years.map(y => y.cogs)].join(','));
    lines.push(['Gross Profit', ...years.map(y => grossProfit(y))].join(','));
    lines.push(['Gross Margin %', ...years.map(y => grossMargin(y).toFixed(1) + '%')].join(','));
    lines.push(['Operating Expenses', ...years.map(y => y.operatingExpenses)].join(','));
    lines.push(['Owner Compensation', ...years.map(y => y.ownerComp)].join(','));
    lines.push(['D&A', ...years.map(y => y.depreciation + y.amortization)].join(','));
    lines.push(['EBITDA', ...years.map(y => ebitda(y))].join(','));
    lines.push(['EBITDA Margin %', ...years.map(y => ebitdaMargin(y).toFixed(1) + '%')].join(','));
    lines.push(['Interest Expense', ...years.map(y => y.interestExpense)].join(','));
    lines.push(['Net Income', ...years.map(y => netIncome(y))].join(','));
    lines.push('');

    // Balance Sheet
    lines.push('BALANCE SHEET');
    lines.push(['', ...years.map(y => y.year)].join(','));
    lines.push(['Cash', ...years.map(y => y.cash)].join(','));
    lines.push(['Accounts Receivable', ...years.map(y => y.accountsReceivable)].join(','));
    lines.push(['Inventory', ...years.map(y => y.inventory)].join(','));
    lines.push(['Total Current Assets', ...years.map(y => totalCurrentAssets(y))].join(','));
    lines.push(['Fixed Assets', ...years.map(y => y.fixedAssets)].join(','));
    lines.push(['Total Assets', ...years.map(y => totalAssets(y))].join(','));
    lines.push(['Accounts Payable', ...years.map(y => y.accountsPayable)].join(','));
    lines.push(['Accrued Liabilities', ...years.map(y => y.accruedLiabilities)].join(','));
    lines.push(['Current Debt', ...years.map(y => y.currentDebt)].join(','));
    lines.push(['Long-Term Debt', ...years.map(y => y.longTermDebt)].join(','));
    lines.push(['Total Liabilities', ...years.map(y => totalLiabilities(y))].join(','));
    lines.push(['Equity', ...years.map(y => totalEquity(y))].join(','));
    lines.push(['Working Capital', ...years.map(y => workingCapital(y))].join(','));
    lines.push('');

    // Adjustments
    lines.push('EBITDA ADJUSTMENTS');
    lines.push(['', ...years.map(y => y.year)].join(','));
    lines.push(['Reported EBITDA', ...years.map(y => ebitda(y))].join(','));
    adjustments.forEach(adj => {
      lines.push([adj.name, ...years.map(y => adj.amounts[y.year] || 0)].join(','));
    });
    lines.push(['Adjusted EBITDA', ...years.map(y => adjustedEbitda(y, adjustments))].join(','));
    lines.push('');

    // Red Flags
    lines.push('RED FLAGS');
    lines.push('Category,Finding,Severity,Action');
    redFlags.forEach(f => {
      lines.push(`"${f.category}","${f.finding}",${f.severity},"${f.action}"`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-data-room-prep-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Number Input Helper ──────────────────────────────────────────────

  const NumberInput = ({ value, onChange, placeholder }: { value: number; onChange: (v: number) => void; placeholder?: string }) => (
    <input
      type="number"
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      placeholder={placeholder || '0'}
      className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm text-white text-right focus:outline-none focus:border-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  );

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === i ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── TAB 0: Why PE Needs This ───────────────────────────────────── */}
      {activeTab === 0 && (
        <div className="space-y-6">
          {/* The Problem */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-5">
            <h3 className="text-amber-400 font-semibold text-lg mb-3">The #1 Reason Deals Stall: Messy Financials</h3>
            <p className="text-gray-300 mb-3">
              PE firms see hundreds of deals a year. When your financial data arrives in QuickBooks format — disorganized,
              inconsistent, full of personal expenses — it signals risk. They either discount your price or walk away.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
                <p className="text-red-400 font-medium text-sm mb-1">What PE Sees (Bad)</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>- QuickBooks P&L dump with 200 line items</li>
                  <li>- Owner comp mixed with operating expenses</li>
                  <li>- No year-over-year comparison</li>
                  <li>- Personal expenses buried in categories</li>
                  <li>- No adjusted EBITDA</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-green-400 font-medium text-sm mb-1">What PE Wants (Good)</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>- Clean 3-5 year financials in PE format</li>
                  <li>- Clear EBITDA bridge with documented add-backs</li>
                  <li>- Key metrics calculated and trended</li>
                  <li>- Items requiring explanation called out</li>
                  <li>- Ready for QoE review</li>
                </ul>
              </div>
            </div>
          </div>

          {/* The 8 Sections */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-5">
            <h3 className="text-white font-semibold text-lg mb-3">The PE Financial Package: 8 Sections</h3>
            <p className="text-gray-400 text-sm mb-4">
              Every PE firm expects financial data organized in this standard format. This tool builds it for you.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { num: 'I', title: 'Executive Summary', desc: 'Company snapshot, key metrics, deal highlights' },
                { num: 'II', title: 'Historical P&L', desc: '3-5 years, clean line items, margins calculated' },
                { num: 'III', title: 'Balance Sheet', desc: 'Assets, liabilities, equity, working capital' },
                { num: 'IV', title: 'Cash Flow Analysis', desc: 'Operating, investing, financing cash flows' },
                { num: 'V', title: 'Operating Metrics', desc: 'Customers, employees, efficiency, retention' },
                { num: 'VI', title: 'EBITDA Adjustment Schedule', desc: 'Reported → Adjusted with documented add-backs' },
                { num: 'VII', title: 'Key Financial Highlights', desc: 'Strengths, trends, and growth drivers' },
                { num: 'VIII', title: 'Items Requiring Explanation', desc: 'Anomalies, one-time events, risk areas' },
              ].map(section => (
                <div key={section.num} className="bg-white/5 rounded p-3 border border-white/5">
                  <div className="flex items-start gap-2">
                    <span className="text-white font-mono text-sm font-bold">{section.num}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{section.title}</p>
                      <p className="text-gray-500 text-xs">{section.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What This Tool Does */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-5">
            <h3 className="text-white font-semibold mb-3">What This Tool Does</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">1</p>
                <p className="text-sm text-gray-300 font-medium">Enter Your Numbers</p>
                <p className="text-xs text-gray-500 mt-1">Income Statement, Balance Sheet, operating metrics — from your QuickBooks or CPA reports</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">2</p>
                <p className="text-sm text-gray-300 font-medium">Get Instant Analysis</p>
                <p className="text-xs text-gray-500 mt-1">Automated red flags, adjusted EBITDA calculation, trend analysis — see what PE will see</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-sm text-gray-300 font-medium">Download PE Package</p>
                <p className="text-xs text-gray-500 mt-1">Clean, formatted financial summary ready for your data room or advisor</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">
              <strong className="text-yellow-400">Important:</strong> This tool helps you organize and present your financials —
              it does not replace your CPA or financial advisor. The numbers you enter should come from your actual
              financial statements. The red flags and analysis help you prepare for what PE firms will scrutinize.
            </p>
          </div>

          <button
            onClick={() => setActiveTab(1)}
            className="w-full bg-white/20 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Start Entering Your Financials →
          </button>
        </div>
      )}

      {/* ─── TAB 1: Your Financials ─────────────────────────────────────── */}
      {activeTab === 1 && (
        <div className="space-y-6">
          {/* Year Selector */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">How many years of data?</h3>
                <p className="text-gray-500 text-sm">PE firms prefer 3-5 years. More history = more credibility.</p>
              </div>
              <div className="flex gap-2">
                {[3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => handleYearCountChange(n)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      yearCount === n ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {n} Years
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Collapsible Sections */}
          {/* INCOME STATEMENT */}
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'income' ? '' : 'income')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-green-400 text-lg">📊</span>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Income Statement</h3>
                  <p className="text-gray-500 text-sm">Revenue, costs, expenses, EBITDA</p>
                </div>
              </div>
              <span className="text-gray-400 text-xl">{expandedSection === 'income' ? '−' : '+'}</span>
            </button>
            {expandedSection === 'income' && (
              <div className="px-4 pb-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-gray-400 py-2 pr-4 w-48">Line Item</th>
                        {years.map(y => (
                          <th key={y.year} className="text-right text-gray-400 py-2 px-2 w-32">{y.year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        { label: 'Revenue', field: 'revenue' as keyof YearData },
                        { label: 'Cost of Goods Sold', field: 'cogs' as keyof YearData },
                      ] as const).map(row => (
                        <tr key={row.field} className="border-b border-white/5">
                          <td className="text-gray-300 py-2 pr-4">{row.label}</td>
                          {years.map((y, i) => (
                            <td key={y.year} className="py-2 px-2">
                              <NumberInput value={y[row.field] as number} onChange={(v) => updateYear(i, row.field, v)} />
                            </td>
                          ))}
                        </tr>
                      ))}
                      {/* Gross Profit (calculated) */}
                      <tr className="border-b border-white/10 bg-white/5">
                        <td className="text-green-400 py-2 pr-4 font-medium">Gross Profit</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-green-400 py-2 px-2 font-medium">{fmt(grossProfit(y))}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 bg-white/5">
                        <td className="text-gray-500 py-1 pr-4 text-xs">Gross Margin</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-gray-500 py-1 px-2 text-xs">{pct(grossMargin(y))}</td>
                        ))}
                      </tr>
                      {([
                        { label: 'Operating Expenses', field: 'operatingExpenses' as keyof YearData },
                        { label: 'Owner / Officer Compensation', field: 'ownerComp' as keyof YearData },
                        { label: 'Depreciation', field: 'depreciation' as keyof YearData },
                        { label: 'Amortization', field: 'amortization' as keyof YearData },
                        { label: 'Other Income / (Expense)', field: 'otherIncome' as keyof YearData },
                      ] as const).map(row => (
                        <tr key={row.field} className="border-b border-white/5">
                          <td className="text-gray-300 py-2 pr-4">{row.label}</td>
                          {years.map((y, i) => (
                            <td key={y.year} className="py-2 px-2">
                              <NumberInput value={y[row.field] as number} onChange={(v) => updateYear(i, row.field, v)} />
                            </td>
                          ))}
                        </tr>
                      ))}
                      {/* EBITDA (calculated) */}
                      <tr className="border-b border-white/10 bg-white/5">
                        <td className="text-white py-2 pr-4 font-bold">EBITDA</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-white py-2 px-2 font-bold">{fmt(ebitda(y))}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 bg-white/20/5">
                        <td className="text-gray-500 py-1 pr-4 text-xs">EBITDA Margin</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-gray-500 py-1 px-2 text-xs">{pct(ebitdaMargin(y))}</td>
                        ))}
                      </tr>
                      {([
                        { label: 'Interest Expense', field: 'interestExpense' as keyof YearData },
                      ] as const).map(row => (
                        <tr key={row.field} className="border-b border-white/5">
                          <td className="text-gray-300 py-2 pr-4">{row.label}</td>
                          {years.map((y, i) => (
                            <td key={y.year} className="py-2 px-2">
                              <NumberInput value={y[row.field] as number} onChange={(v) => updateYear(i, row.field, v)} />
                            </td>
                          ))}
                        </tr>
                      ))}
                      {/* Net Income (calculated) */}
                      <tr className="bg-white/5">
                        <td className="text-white py-2 pr-4 font-medium">Net Income</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-white py-2 px-2 font-medium">{fmt(netIncome(y))}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* BALANCE SHEET */}
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'balance' ? '' : 'balance')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-white text-lg">📋</span>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Balance Sheet</h3>
                  <p className="text-gray-500 text-sm">Assets, liabilities, equity, working capital</p>
                </div>
              </div>
              <span className="text-gray-400 text-xl">{expandedSection === 'balance' ? '−' : '+'}</span>
            </button>
            {expandedSection === 'balance' && (
              <div className="px-4 pb-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-gray-400 py-2 pr-4 w-48">Line Item</th>
                        {years.map(y => (
                          <th key={y.year} className="text-right text-gray-400 py-2 px-2 w-32">{y.year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td colSpan={years.length + 1} className="text-gray-500 text-xs font-semibold uppercase tracking-wider pt-3 pb-1">Current Assets</td></tr>
                      {([
                        { label: 'Cash & Equivalents', field: 'cash' as keyof YearData },
                        { label: 'Accounts Receivable', field: 'accountsReceivable' as keyof YearData },
                        { label: 'Inventory', field: 'inventory' as keyof YearData },
                        { label: 'Other Current Assets', field: 'otherCurrentAssets' as keyof YearData },
                      ] as const).map(row => (
                        <tr key={row.field} className="border-b border-white/5">
                          <td className="text-gray-300 py-2 pr-4">{row.label}</td>
                          {years.map((y, i) => (
                            <td key={y.year} className="py-2 px-2">
                              <NumberInput value={y[row.field] as number} onChange={(v) => updateYear(i, row.field, v)} />
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="border-b border-white/10 bg-white/5">
                        <td className="text-green-400 py-2 pr-4 font-medium">Total Current Assets</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-green-400 py-2 px-2 font-medium">{fmt(totalCurrentAssets(y))}</td>
                        ))}
                      </tr>
                      {([
                        { label: 'Fixed Assets (net PP&E)', field: 'fixedAssets' as keyof YearData },
                        { label: 'Other Long-Term Assets', field: 'otherAssets' as keyof YearData },
                      ] as const).map(row => (
                        <tr key={row.field} className="border-b border-white/5">
                          <td className="text-gray-300 py-2 pr-4">{row.label}</td>
                          {years.map((y, i) => (
                            <td key={y.year} className="py-2 px-2">
                              <NumberInput value={y[row.field] as number} onChange={(v) => updateYear(i, row.field, v)} />
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="border-b border-white/10 bg-white/5">
                        <td className="text-white py-2 pr-4 font-bold">Total Assets</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-white py-2 px-2 font-bold">{fmt(totalAssets(y))}</td>
                        ))}
                      </tr>

                      <tr><td colSpan={years.length + 1} className="text-gray-500 text-xs font-semibold uppercase tracking-wider pt-4 pb-1">Liabilities</td></tr>
                      {([
                        { label: 'Accounts Payable', field: 'accountsPayable' as keyof YearData },
                        { label: 'Accrued Liabilities', field: 'accruedLiabilities' as keyof YearData },
                        { label: 'Current Portion of Debt', field: 'currentDebt' as keyof YearData },
                      ] as const).map(row => (
                        <tr key={row.field} className="border-b border-white/5">
                          <td className="text-gray-300 py-2 pr-4">{row.label}</td>
                          {years.map((y, i) => (
                            <td key={y.year} className="py-2 px-2">
                              <NumberInput value={y[row.field] as number} onChange={(v) => updateYear(i, row.field, v)} />
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="border-b border-white/10 bg-white/5">
                        <td className="text-yellow-400 py-2 pr-4 font-medium">Total Current Liabilities</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-yellow-400 py-2 px-2 font-medium">{fmt(totalCurrentLiabilities(y))}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="text-gray-300 py-2 pr-4">Long-Term Debt</td>
                        {years.map((y, i) => (
                          <td key={y.year} className="py-2 px-2">
                            <NumberInput value={y.longTermDebt} onChange={(v) => updateYear(i, 'longTermDebt', v)} />
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/10 bg-red-500/10">
                        <td className="text-red-400 py-2 pr-4 font-bold">Total Liabilities</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-red-400 py-2 px-2 font-bold">{fmt(totalLiabilities(y))}</td>
                        ))}
                      </tr>
                      <tr className="bg-white/5">
                        <td className="text-white py-2 pr-4 font-bold">Equity</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-white py-2 px-2 font-bold">{fmt(totalEquity(y))}</td>
                        ))}
                      </tr>
                      <tr className="bg-purple-500/10">
                        <td className="text-purple-400 py-2 pr-4 font-medium">Working Capital (ex-cash)</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-purple-400 py-2 px-2 font-medium">{fmt(workingCapital(y))}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* OPERATING METRICS */}
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'metrics' ? '' : 'metrics')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-purple-400 text-lg">📈</span>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Operating Metrics</h3>
                  <p className="text-gray-500 text-sm">Customers, employees, efficiency, concentration</p>
                </div>
              </div>
              <span className="text-gray-400 text-xl">{expandedSection === 'metrics' ? '−' : '+'}</span>
            </button>
            {expandedSection === 'metrics' && (
              <div className="px-4 pb-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-gray-400 py-2 pr-4 w-48">Metric</th>
                        {years.map(y => (
                          <th key={y.year} className="text-right text-gray-400 py-2 px-2 w-32">{y.year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        { label: 'Number of Customers', field: 'customerCount' as keyof YearData },
                        { label: 'Number of Employees', field: 'employeeCount' as keyof YearData },
                        { label: 'Recurring Revenue %', field: 'recurringRevenuePct' as keyof YearData },
                        { label: 'Top Customer % of Revenue', field: 'topCustomerPct' as keyof YearData },
                        { label: 'Capital Expenditures', field: 'capex' as keyof YearData },
                      ] as const).map(row => (
                        <tr key={row.field} className="border-b border-white/5">
                          <td className="text-gray-300 py-2 pr-4">{row.label}</td>
                          {years.map((y, i) => (
                            <td key={y.year} className="py-2 px-2">
                              <NumberInput value={y[row.field] as number} onChange={(v) => updateYear(i, row.field, v)} />
                            </td>
                          ))}
                        </tr>
                      ))}
                      {/* Calculated metrics */}
                      <tr className="border-t border-white/10 bg-white/5">
                        <td className="text-gray-400 py-2 pr-4 text-xs font-medium">Revenue per Customer</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-gray-400 py-2 px-2 text-xs">
                            {y.customerCount > 0 ? fmt(y.revenue / y.customerCount) : '—'}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-white/5">
                        <td className="text-gray-400 py-2 pr-4 text-xs font-medium">Revenue per Employee</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-gray-400 py-2 px-2 text-xs">
                            {y.employeeCount > 0 ? fmt(y.revenue / y.employeeCount) : '—'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* EBITDA ADJUSTMENTS */}
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'adjustments' ? '' : 'adjustments')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 text-lg">🔧</span>
                <div className="text-left">
                  <h3 className="text-white font-semibold">EBITDA Adjustments (Add-Backs)</h3>
                  <p className="text-gray-500 text-sm">Items that don't reflect ongoing operations</p>
                </div>
              </div>
              <span className="text-gray-400 text-xl">{expandedSection === 'adjustments' ? '−' : '+'}</span>
            </button>
            {expandedSection === 'adjustments' && (
              <div className="px-4 pb-4">
                <p className="text-gray-400 text-sm mb-4">
                  Enter the dollar amount for each add-back per year. These get added to your reported EBITDA
                  to show what a buyer's version of your earnings would look like.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-gray-400 py-2 pr-4 w-48">Adjustment</th>
                        {years.map(y => (
                          <th key={y.year} className="text-right text-gray-400 py-2 px-2 w-32">{y.year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Reported EBITDA row */}
                      <tr className="border-b border-white/10 bg-white/5">
                        <td className="text-gray-300 py-2 pr-4 font-medium">Reported EBITDA</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-gray-300 py-2 px-2 font-medium">{fmt(ebitda(y))}</td>
                        ))}
                      </tr>
                      {adjustments.map((adj, ai) => (
                        <tr key={adj.id} className="border-b border-white/5">
                          <td className="py-2 pr-4">
                            <p className="text-gray-300 text-sm">{adj.name}</p>
                            <p className="text-gray-600 text-xs">{adj.description}</p>
                          </td>
                          {years.map(y => (
                            <td key={y.year} className="py-2 px-2">
                              <NumberInput
                                value={adj.amounts[y.year] || 0}
                                onChange={(v) => updateAdjustment(ai, y.year, v)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                      {/* Adjusted EBITDA row */}
                      <tr className="bg-green-500/10">
                        <td className="text-green-400 py-2 pr-4 font-bold">Adjusted EBITDA</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-green-400 py-2 px-2 font-bold">{fmt(adjustedEbitda(y, adjustments))}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab(0)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className="flex-1 bg-white/20 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Run PE Analysis →
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB 2: PE Analysis ─────────────────────────────────────────── */}
      {activeTab === 2 && (
        <div className="space-y-6">
          {!hasData ? (
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
              <p className="text-gray-400 text-lg mb-2">No financial data entered yet</p>
              <p className="text-gray-500 text-sm mb-4">Go to the "Your Financials" tab and enter at least one year of data to see the analysis.</p>
              <button onClick={() => setActiveTab(1)} className="bg-white/20 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                Enter Financials →
              </button>
            </div>
          ) : (
            <>
              {/* Key Metrics Dashboard */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <h3 className="text-white font-semibold text-lg mb-4">Key Metrics at a Glance</h3>
                <div className="grid grid-cols-4 gap-4">
                  {(() => {
                    const last = years[years.length - 1];
                    const prev = years.length >= 2 ? years[years.length - 2] : null;
                    const revenueGrowth = prev && prev.revenue > 0 ? ((last.revenue - prev.revenue) / prev.revenue) * 100 : null;
                    const metrics = [
                      { label: 'Revenue', value: fmt(last.revenue), sub: revenueGrowth !== null ? `${revenueGrowth > 0 ? '+' : ''}${pct(revenueGrowth)} YoY` : '—', color: 'text-white' },
                      { label: 'EBITDA', value: fmt(ebitda(last)), sub: `${pct(ebitdaMargin(last))} margin`, color: 'text-white' },
                      { label: 'Adjusted EBITDA', value: fmt(adjustedEbitda(last, adjustments)), sub: `${pct(last.revenue ? (adjustedEbitda(last, adjustments) / last.revenue) * 100 : 0)} margin`, color: 'text-green-400' },
                      { label: 'Working Capital', value: fmt(workingCapital(last)), sub: 'Ex-cash', color: 'text-purple-400' },
                    ];
                    return metrics.map(m => (
                      <div key={m.label} className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-gray-500 text-xs uppercase tracking-wider">{m.label}</p>
                        <p className={`text-xl font-bold ${m.color} mt-1`}>{m.value}</p>
                        <p className="text-gray-500 text-xs mt-1">{m.sub}</p>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* EBITDA Bridge */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <h3 className="text-white font-semibold text-lg mb-3">EBITDA Bridge — Most Recent Year ({years[years.length - 1].year})</h3>
                <p className="text-gray-400 text-sm mb-4">This is exactly how PE firms will restate your earnings.</p>
                <div className="space-y-2">
                  {(() => {
                    const last = years[years.length - 1];
                    const reportedE = ebitda(last);
                    const items = [
                      { label: 'Reported EBITDA', value: reportedE, isBase: true },
                      ...adjustments.filter(a => (a.amounts[last.year] || 0) > 0).map(a => ({
                        label: `+ ${a.name}`, value: a.amounts[last.year] || 0, isBase: false,
                      })),
                      { label: 'Adjusted EBITDA', value: adjustedEbitda(last, adjustments), isTotal: true },
                    ];
                    return items.map((item, i) => (
                      <div key={i} className={`flex items-center justify-between py-2 px-3 rounded ${
                        (item as any).isBase ? 'bg-white/5' : (item as any).isTotal ? 'bg-green-500/10 border border-green-500/20' : ''
                      }`}>
                        <span className={`text-sm ${(item as any).isTotal ? 'text-green-400 font-bold' : (item as any).isBase ? 'text-white font-medium' : 'text-gray-300'}`}>
                          {item.label}
                        </span>
                        <span className={`text-sm font-mono ${(item as any).isTotal ? 'text-green-400 font-bold' : 'text-white'}`}>
                          {fmt(item.value)}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Red Flags */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-lg">Red Flag Analysis</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    redFlags.filter(f => f.severity === 'high').length > 0 ? 'bg-red-500/20 text-red-400' :
                    redFlags.length > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {redFlags.length === 0 ? 'No Issues Found' : `${redFlags.length} Item${redFlags.length > 1 ? 's' : ''} Flagged`}
                  </span>
                </div>
                {redFlags.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    Based on the data entered, no significant red flags were detected. This is a positive signal —
                    but remember that the QoE accountants will dig much deeper.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {redFlags.map(flag => (
                      <div key={flag.id} className={`rounded-lg p-4 border ${
                        flag.severity === 'high' ? 'bg-red-500/10 border-red-500/20' :
                        flag.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' :
                        'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className={`text-xs font-medium uppercase tracking-wider ${
                              flag.severity === 'high' ? 'text-red-400' : flag.severity === 'medium' ? 'text-yellow-400' : 'text-white'
                            }`}>{flag.category}</span>
                            <p className="text-white text-sm font-medium mt-1">{flag.finding}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            flag.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                            flag.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-white/10 text-white'
                          }`}>{flag.severity}</span>
                        </div>
                        <div className="mt-2 space-y-2">
                          <div>
                            <p className="text-gray-500 text-xs font-medium">What the buyer is thinking:</p>
                            <p className="text-gray-400 text-sm italic">{flag.buyerThinking}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs font-medium">Your action step:</p>
                            <p className="text-gray-300 text-sm">{flag.action}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trend Summary */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <h3 className="text-white font-semibold text-lg mb-3">Year-Over-Year Trends</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-gray-400 py-2 pr-4">Metric</th>
                        {years.map(y => (
                          <th key={y.year} className="text-right text-gray-400 py-2 px-3">{y.year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Revenue', values: years.map(y => fmt(y.revenue)) },
                        { label: 'Revenue Growth', values: years.map((y, i) => i === 0 ? '—' : (years[i - 1].revenue > 0 ? `${((y.revenue - years[i - 1].revenue) / years[i - 1].revenue * 100).toFixed(1)}%` : '—')) },
                        { label: 'Gross Margin', values: years.map(y => pct(grossMargin(y))) },
                        { label: 'EBITDA', values: years.map(y => fmt(ebitda(y))) },
                        { label: 'EBITDA Margin', values: years.map(y => pct(ebitdaMargin(y))) },
                        { label: 'Adj. EBITDA', values: years.map(y => fmt(adjustedEbitda(y, adjustments))) },
                        { label: 'Working Capital', values: years.map(y => fmt(workingCapital(y))) },
                        { label: 'Total Debt', values: years.map(y => fmt(y.currentDebt + y.longTermDebt)) },
                      ].map(row => (
                        <tr key={row.label} className="border-b border-white/5">
                          <td className="text-gray-300 py-2 pr-4">{row.label}</td>
                          {row.values.map((v, i) => (
                            <td key={i} className="text-right text-white py-2 px-3">{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <button onClick={() => setActiveTab(1)} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors">
                  ← Edit Financials
                </button>
                <button onClick={() => setActiveTab(3)} className="flex-1 bg-white/20 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
                  View Your Financial Package →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── TAB 3: Your Financial Package ──────────────────────────────── */}
      {activeTab === 3 && (
        <div className="space-y-6">
          {!hasData ? (
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
              <p className="text-gray-400 text-lg mb-2">No financial data entered yet</p>
              <p className="text-gray-500 text-sm mb-4">Enter your financials first to generate the PE financial package.</p>
              <button onClick={() => setActiveTab(1)} className="bg-white/20 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                Enter Financials →
              </button>
            </div>
          ) : (
            <>
              {/* Package Header */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-lg">Your PE Financial Package</h3>
                  <button
                    onClick={exportCSV}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Download CSV
                  </button>
                </div>
                <p className="text-gray-400 text-sm">
                  Below is your financial data organized in the 8-section PE standard format.
                  Download this and share with your financial advisor to refine before the deal process.
                </p>
              </div>

              {/* Section I: Executive Summary */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <h3 className="text-white font-mono text-sm font-bold mb-1">SECTION I</h3>
                <h4 className="text-white font-semibold text-lg mb-4">Executive Summary</h4>
                {(() => {
                  const last = years[years.length - 1];
                  const prev = years.length >= 2 ? years[years.length - 2] : null;
                  const revenueGrowth = prev && prev.revenue > 0 ? ((last.revenue - prev.revenue) / prev.revenue) * 100 : null;
                  const adjE = adjustedEbitda(last, adjustments);
                  const adjMargin = last.revenue ? (adjE / last.revenue) * 100 : 0;
                  return (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between"><span className="text-gray-400 text-sm">Latest Revenue</span><span className="text-white text-sm font-medium">{fmt(last.revenue)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400 text-sm">Revenue Growth (YoY)</span><span className="text-white text-sm font-medium">{revenueGrowth !== null ? pct(revenueGrowth) : 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400 text-sm">Adjusted EBITDA</span><span className="text-green-400 text-sm font-medium">{fmt(adjE)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400 text-sm">Adjusted EBITDA Margin</span><span className="text-green-400 text-sm font-medium">{pct(adjMargin)}</span></div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between"><span className="text-gray-400 text-sm">Employees</span><span className="text-white text-sm font-medium">{last.employeeCount || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400 text-sm">Customers</span><span className="text-white text-sm font-medium">{last.customerCount || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400 text-sm">Recurring Revenue</span><span className="text-white text-sm font-medium">{last.recurringRevenuePct ? pct(last.recurringRevenuePct) : 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400 text-sm">Total Debt</span><span className="text-white text-sm font-medium">{fmt(last.currentDebt + last.longTermDebt)}</span></div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Section II: Historical P&L */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <h3 className="text-white font-mono text-sm font-bold mb-1">SECTION II</h3>
                <h4 className="text-white font-semibold text-lg mb-4">Historical Profit & Loss</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-gray-400 py-2 pr-4"></th>
                        {years.map(y => <th key={y.year} className="text-right text-gray-400 py-2 px-3">{y.year}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Revenue</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{fmt(y.revenue)}</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">COGS</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">({fmt(y.cogs)})</td>)}</tr>
                      <tr className="border-b border-white/10 bg-white/5"><td className="text-green-400 py-1.5 pr-4 font-medium">Gross Profit</td>{years.map(y => <td key={y.year} className="text-right text-green-400 py-1.5 px-3 font-medium">{fmt(grossProfit(y))}</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-500 py-1 pr-4 text-xs">Gross Margin</td>{years.map(y => <td key={y.year} className="text-right text-gray-500 py-1 px-3 text-xs">{pct(grossMargin(y))}</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Operating Expenses</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">({fmt(y.operatingExpenses)})</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Owner Compensation</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">({fmt(y.ownerComp)})</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">D&A</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{fmt(y.depreciation + y.amortization)}</td>)}</tr>
                      <tr className="border-b border-white/10 bg-white/5"><td className="text-white py-1.5 pr-4 font-bold">EBITDA</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3 font-bold">{fmt(ebitda(y))}</td>)}</tr>
                      <tr><td className="text-gray-500 py-1 pr-4 text-xs">EBITDA Margin</td>{years.map(y => <td key={y.year} className="text-right text-gray-500 py-1 px-3 text-xs">{pct(ebitdaMargin(y))}</td>)}</tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section III: Balance Sheet */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <h3 className="text-white font-mono text-sm font-bold mb-1">SECTION III</h3>
                <h4 className="text-white font-semibold text-lg mb-4">Balance Sheet Summary</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-gray-400 py-2 pr-4"></th>
                        {years.map(y => <th key={y.year} className="text-right text-gray-400 py-2 px-3">{y.year}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Cash</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{fmt(y.cash)}</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Accounts Receivable</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{fmt(y.accountsReceivable)}</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Inventory</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{fmt(y.inventory)}</td>)}</tr>
                      <tr className="border-b border-white/10 bg-white/5"><td className="text-white py-1.5 pr-4 font-medium">Total Assets</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3 font-medium">{fmt(totalAssets(y))}</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Total Debt</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{fmt(y.currentDebt + y.longTermDebt)}</td>)}</tr>
                      <tr className="border-b border-white/10 bg-white/5"><td className="text-white py-1.5 pr-4 font-medium">Total Liabilities</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3 font-medium">{fmt(totalLiabilities(y))}</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-white py-1.5 pr-4 font-medium">Equity</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3 font-medium">{fmt(totalEquity(y))}</td>)}</tr>
                      <tr className="bg-purple-500/10"><td className="text-purple-400 py-1.5 pr-4 font-medium">Working Capital</td>{years.map(y => <td key={y.year} className="text-right text-purple-400 py-1.5 px-3 font-medium">{fmt(workingCapital(y))}</td>)}</tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section IV: Cash Flow Analysis */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <h3 className="text-white font-mono text-sm font-bold mb-1">SECTION IV</h3>
                <h4 className="text-white font-semibold text-lg mb-4">Cash Flow Analysis</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-gray-400 py-2 pr-4"></th>
                        {years.map(y => <th key={y.year} className="text-right text-gray-400 py-2 px-3">{y.year}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">EBITDA</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{fmt(ebitda(y))}</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Less: CapEx</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">({fmt(y.capex)})</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Less: Interest</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">({fmt(y.interestExpense)})</td>)}</tr>
                      <tr className="bg-green-500/10">
                        <td className="text-green-400 py-1.5 pr-4 font-bold">Unlevered Free Cash Flow</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-green-400 py-1.5 px-3 font-bold">{fmt(ebitda(y) - y.capex)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="text-gray-500 py-1 pr-4 text-xs">Cash Conversion (UFCF/EBITDA)</td>
                        {years.map(y => (
                          <td key={y.year} className="text-right text-gray-500 py-1 px-3 text-xs">
                            {ebitda(y) > 0 ? pct(((ebitda(y) - y.capex) / ebitda(y)) * 100) : '—'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section V: Operating Metrics */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <h3 className="text-white font-mono text-sm font-bold mb-1">SECTION V</h3>
                <h4 className="text-white font-semibold text-lg mb-4">Operating Metrics</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-gray-400 py-2 pr-4"></th>
                        {years.map(y => <th key={y.year} className="text-right text-gray-400 py-2 px-3">{y.year}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Customers</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{y.customerCount || '—'}</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Revenue / Customer</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{y.customerCount > 0 ? fmt(y.revenue / y.customerCount) : '—'}</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Employees</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{y.employeeCount || '—'}</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Revenue / Employee</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{y.employeeCount > 0 ? fmt(y.revenue / y.employeeCount) : '—'}</td>)}</tr>
                      <tr className="border-b border-white/5"><td className="text-gray-300 py-1.5 pr-4">Recurring Revenue %</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{y.recurringRevenuePct ? pct(y.recurringRevenuePct) : '—'}</td>)}</tr>
                      <tr><td className="text-gray-300 py-1.5 pr-4">Top Customer Concentration</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{y.topCustomerPct ? pct(y.topCustomerPct) : '—'}</td>)}</tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section VI: EBITDA Adjustment Schedule */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <h3 className="text-white font-mono text-sm font-bold mb-1">SECTION VI</h3>
                <h4 className="text-white font-semibold text-lg mb-4">EBITDA Adjustment Schedule</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-gray-400 py-2 pr-4"></th>
                        {years.map(y => <th key={y.year} className="text-right text-gray-400 py-2 px-3">{y.year}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10 bg-white/5"><td className="text-white py-1.5 pr-4 font-medium">Reported EBITDA</td>{years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3 font-medium">{fmt(ebitda(y))}</td>)}</tr>
                      {adjustments.filter(a => years.some(y => (a.amounts[y.year] || 0) > 0)).map(adj => (
                        <tr key={adj.id} className="border-b border-white/5">
                          <td className="text-gray-300 py-1.5 pr-4">+ {adj.name}</td>
                          {years.map(y => <td key={y.year} className="text-right text-white py-1.5 px-3">{fmt(adj.amounts[y.year] || 0)}</td>)}
                        </tr>
                      ))}
                      <tr className="bg-green-500/10"><td className="text-green-400 py-1.5 pr-4 font-bold">Adjusted EBITDA</td>{years.map(y => <td key={y.year} className="text-right text-green-400 py-1.5 px-3 font-bold">{fmt(adjustedEbitda(y, adjustments))}</td>)}</tr>
                      <tr><td className="text-gray-500 py-1 pr-4 text-xs">Adjusted Margin</td>{years.map(y => <td key={y.year} className="text-right text-gray-500 py-1 px-3 text-xs">{y.revenue ? pct((adjustedEbitda(y, adjustments) / y.revenue) * 100) : '—'}</td>)}</tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section VII: Key Financial Highlights */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <h3 className="text-white font-mono text-sm font-bold mb-1">SECTION VII</h3>
                <h4 className="text-white font-semibold text-lg mb-4">Key Financial Highlights</h4>
                {(() => {
                  const highlights: string[] = [];
                  const last = years[years.length - 1];
                  const first = years[0];

                  // Revenue CAGR
                  if (first.revenue > 0 && last.revenue > 0 && years.length > 1) {
                    const cagr = (Math.pow(last.revenue / first.revenue, 1 / (years.length - 1)) - 1) * 100;
                    if (cagr > 5) highlights.push(`Revenue grew at a ${pct(cagr)} CAGR over ${years.length} years (${fmt(first.revenue)} → ${fmt(last.revenue)})`);
                  }

                  const adjE = adjustedEbitda(last, adjustments);
                  const adjM = last.revenue ? (adjE / last.revenue) * 100 : 0;
                  if (adjM > 15) highlights.push(`Strong adjusted EBITDA margin of ${pct(adjM)}`);
                  if (last.recurringRevenuePct > 70) highlights.push(`${pct(last.recurringRevenuePct)} recurring revenue provides predictable cash flow`);
                  if (last.topCustomerPct > 0 && last.topCustomerPct < 15) highlights.push(`Low customer concentration — top customer is only ${pct(last.topCustomerPct)} of revenue`);

                  const lastDA = last.depreciation + last.amortization;
                  if (last.capex > 0 && lastDA > 0 && last.capex < lastDA * 1.2) {
                    highlights.push(`Maintenance-level CapEx indicates an asset-efficient business model`);
                  }

                  if (last.customerCount > 0 && first.customerCount > 0 && last.customerCount > first.customerCount) {
                    highlights.push(`Customer base grew from ${first.customerCount} to ${last.customerCount} over the period`);
                  }

                  return highlights.length > 0 ? (
                    <ul className="space-y-2">
                      {highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">+</span>
                          <span className="text-gray-300 text-sm">{h}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm">Enter more financial data to generate highlights.</p>
                  );
                })()}
              </div>

              {/* Section VIII: Items Requiring Explanation */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <h3 className="text-white font-mono text-sm font-bold mb-1">SECTION VIII</h3>
                <h4 className="text-white font-semibold text-lg mb-4">Items Requiring Explanation</h4>
                {redFlags.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm mb-3">
                      These items will likely come up during due diligence. Prepare explanations and supporting documentation.
                    </p>
                    {redFlags.map((flag, i) => (
                      <div key={flag.id} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                        <span className={`mt-0.5 px-2 py-0.5 rounded text-xs font-medium ${
                          flag.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                          flag.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-white/10 text-white'
                        }`}>{i + 1}</span>
                        <div>
                          <p className="text-white text-sm font-medium">{flag.finding}</p>
                          <p className="text-gray-500 text-xs mt-1">{flag.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-400 text-sm">
                    No significant items requiring explanation were identified based on the data entered.
                    This is a positive signal for the due diligence process.
                  </p>
                )}
              </div>

              {/* Download */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Ready to Share</h3>
                    <p className="text-gray-400 text-sm">Download this financial package and share with your CPA or M&A advisor for refinement.</p>
                  </div>
                  <button
                    onClick={exportCSV}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Download CSV
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-500 text-sm">
                  <strong className="text-yellow-400">Disclaimer:</strong> This financial package is a starting point for organizing your data.
                  It does not replace a formal Quality of Earnings report, CPA-prepared financial statements, or professional financial advice.
                  Always work with qualified advisors before entering a transaction.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialDataRoom;
