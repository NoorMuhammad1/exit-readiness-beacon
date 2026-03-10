import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye, AlertTriangle, CheckCircle2, XCircle, TrendingDown,
  TrendingUp, ChevronRight, Download, FileText, Target,
  Lightbulb, DollarSign, Clock, Shield, BarChart3,
  ArrowRight, ArrowDown, Minus, Search, Percent
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────

interface MonthlyData {
  revenue: number;
  cogs: number;
  grossProfit: number;
  ownerComp: number;
  rent: number;
  payroll: number;
  marketing: number;
  insurance: number;
  utilities: number;
  professionalFees: number;
  travel: number;
  otherExpenses: number;
}

interface RedFlag {
  id: string;
  category: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  finding: string;
  buyerThinking: string;
  dollarImpact: string;
  whatToDo: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const emptyMonth = (): MonthlyData => ({
  revenue: 0, cogs: 0, grossProfit: 0, ownerComp: 0, rent: 0,
  payroll: 0, marketing: 0, insurance: 0, utilities: 0,
  professionalFees: 0, travel: 0, otherExpenses: 0
});

const LINE_ITEMS: { key: keyof MonthlyData; label: string; isCalculated?: boolean; isRevenue?: boolean; isCost?: boolean }[] = [
  { key: 'revenue', label: 'Revenue', isRevenue: true },
  { key: 'cogs', label: 'Cost of Goods Sold', isCost: true },
  { key: 'grossProfit', label: 'Gross Profit', isCalculated: true },
  { key: 'ownerComp', label: 'Owner Compensation', isCost: true },
  { key: 'rent', label: 'Rent / Occupancy', isCost: true },
  { key: 'payroll', label: 'Payroll (excl. owner)', isCost: true },
  { key: 'marketing', label: 'Marketing / Advertising', isCost: true },
  { key: 'insurance', label: 'Insurance', isCost: true },
  { key: 'utilities', label: 'Utilities', isCost: true },
  { key: 'professionalFees', label: 'Professional Fees', isCost: true },
  { key: 'travel', label: 'Travel & Entertainment', isCost: true },
  { key: 'otherExpenses', label: 'Other Expenses', isCost: true },
];

// ── Main Component ──────────────────────────────────────────────

export const PEEyes: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(
    Array.from({ length: 12 }, () => emptyMonth())
  );
  const [marketOwnerComp, setMarketOwnerComp] = useState(250000);
  const [topCustomerPct, setTopCustomerPct] = useState(0);
  const [top5CustomerPct, setTop5CustomerPct] = useState(0);
  const [recurringRevenuePct, setRecurringRevenuePct] = useState(0);
  const [yearsInBusiness, setYearsInBusiness] = useState(10);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pe-eyes-v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.monthlyData) setMonthlyData(parsed.monthlyData);
        if (parsed.marketOwnerComp) setMarketOwnerComp(parsed.marketOwnerComp);
        if (parsed.topCustomerPct !== undefined) setTopCustomerPct(parsed.topCustomerPct);
        if (parsed.top5CustomerPct !== undefined) setTop5CustomerPct(parsed.top5CustomerPct);
        if (parsed.recurringRevenuePct !== undefined) setRecurringRevenuePct(parsed.recurringRevenuePct);
        if (parsed.yearsInBusiness !== undefined) setYearsInBusiness(parsed.yearsInBusiness);
        if (parsed.activeTab !== undefined) setActiveTab(parsed.activeTab);
      } catch (e) {}
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('pe-eyes-v1', JSON.stringify({
      monthlyData, marketOwnerComp, topCustomerPct, top5CustomerPct,
      recurringRevenuePct, yearsInBusiness, activeTab
    }));
  }, [monthlyData, marketOwnerComp, topCustomerPct, top5CustomerPct, recurringRevenuePct, yearsInBusiness, activeTab]);

  // Update monthly data and recalculate gross profit
  const updateMonth = (monthIdx: number, field: keyof MonthlyData, value: number) => {
    setMonthlyData(prev => {
      const updated = [...prev];
      updated[monthIdx] = { ...updated[monthIdx], [field]: value };
      updated[monthIdx].grossProfit = updated[monthIdx].revenue - updated[monthIdx].cogs;
      return updated;
    });
  };

  const tabs = [
    { name: 'What PE Sees', icon: <Eye className="w-4 h-4" /> },
    { name: 'Enter Your Numbers', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Red Flag Analysis', icon: <AlertTriangle className="w-4 h-4" /> },
    { name: 'Your Report', icon: <FileText className="w-4 h-4" /> }
  ];

  // ── Calculations ──────────────────────────────────────────────

  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const totalCOGS = monthlyData.reduce((sum, m) => sum + m.cogs, 0);
  const totalGrossProfit = totalRevenue - totalCOGS;
  const grossMargin = totalRevenue > 0 ? (totalGrossProfit / totalRevenue) * 100 : 0;

  const totalOwnerComp = monthlyData.reduce((sum, m) => sum + m.ownerComp, 0);
  const totalPayroll = monthlyData.reduce((sum, m) => sum + m.payroll, 0);
  const totalRent = monthlyData.reduce((sum, m) => sum + m.rent, 0);
  const totalMarketing = monthlyData.reduce((sum, m) => sum + m.marketing, 0);
  const totalInsurance = monthlyData.reduce((sum, m) => sum + m.insurance, 0);
  const totalUtilities = monthlyData.reduce((sum, m) => sum + m.utilities, 0);
  const totalProfFees = monthlyData.reduce((sum, m) => sum + m.professionalFees, 0);
  const totalTravel = monthlyData.reduce((sum, m) => sum + m.travel, 0);
  const totalOther = monthlyData.reduce((sum, m) => sum + m.otherExpenses, 0);

  const totalOpex = totalOwnerComp + totalPayroll + totalRent + totalMarketing +
    totalInsurance + totalUtilities + totalProfFees + totalTravel + totalOther;
  const reportedEBITDA = totalGrossProfit - totalOpex;

  const ownerCompAdjustment = totalOwnerComp - marketOwnerComp;
  const adjustedEBITDA = reportedEBITDA + Math.max(0, ownerCompAdjustment);

  const hasData = totalRevenue > 0;

  // Monthly revenue analysis
  const monthlyRevenues = monthlyData.map(m => m.revenue);
  const maxRevMonth = Math.max(...monthlyRevenues);
  const minRevMonth = Math.min(...monthlyRevenues.filter(r => r > 0));
  const avgRevMonth = totalRevenue / 12;
  const revenueVariance = avgRevMonth > 0 ? ((maxRevMonth - minRevMonth) / avgRevMonth) * 100 : 0;

  // Monthly gross margin analysis
  const monthlyGrossMargins = monthlyData.map(m =>
    m.revenue > 0 ? ((m.revenue - m.cogs) / m.revenue) * 100 : 0
  );
  const activeMargins = monthlyGrossMargins.filter(m => m > 0);
  const maxGM = activeMargins.length > 0 ? Math.max(...activeMargins) : 0;
  const minGM = activeMargins.length > 0 ? Math.min(...activeMargins) : 0;
  const gmVariance = maxGM - minGM;

  // Revenue trend (H1 vs H2)
  const h1Revenue = monthlyData.slice(0, 6).reduce((s, m) => s + m.revenue, 0);
  const h2Revenue = monthlyData.slice(6).reduce((s, m) => s + m.revenue, 0);
  const h2Growth = h1Revenue > 0 ? ((h2Revenue - h1Revenue) / h1Revenue) * 100 : 0;

  // Seasonality — what % of revenue comes from biggest quarter
  const q1 = monthlyData.slice(0, 3).reduce((s, m) => s + m.revenue, 0);
  const q2 = monthlyData.slice(3, 6).reduce((s, m) => s + m.revenue, 0);
  const q3 = monthlyData.slice(6, 9).reduce((s, m) => s + m.revenue, 0);
  const q4 = monthlyData.slice(9).reduce((s, m) => s + m.revenue, 0);
  const biggestQuarter = Math.max(q1, q2, q3, q4);
  const biggestQPct = totalRevenue > 0 ? (biggestQuarter / totalRevenue) * 100 : 25;

  // ── Red Flag Generation ───────────────────────────────────────

  const generateRedFlags = (): RedFlag[] => {
    if (!hasData) return [];
    const flags: RedFlag[] = [];

    // Owner comp vs market
    if (totalOwnerComp < marketOwnerComp * 0.6) {
      const gap = marketOwnerComp - totalOwnerComp;
      flags.push({
        id: 'owner-comp-low',
        category: 'Owner Compensation',
        title: 'Owner comp is well below market rate',
        severity: 'critical',
        finding: `You paid yourself $${(totalOwnerComp / 1000).toFixed(0)}K, but market rate for a replacement CEO is $${(marketOwnerComp / 1000).toFixed(0)}K. PE will add $${(gap / 1000).toFixed(0)}K back as a required expense.`,
        buyerThinking: `"This EBITDA is overstated by $${(gap / 1000).toFixed(0)}K. At a 7x multiple, that's $${((gap * 7) / 1000000).toFixed(1)}M off the price. The owner is subsidizing the business with below-market pay."`,
        dollarImpact: `$${((gap * 7) / 1000000).toFixed(1)}M reduction in enterprise value (at 7x multiple)`,
        whatToDo: 'Either raise your own compensation to market rate 12-18 months before selling (so it flows through the financials naturally), or prepare strong documentation for why a replacement would cost less than market rate.'
      });
    } else if (totalOwnerComp > marketOwnerComp * 1.5) {
      const excess = totalOwnerComp - marketOwnerComp;
      flags.push({
        id: 'owner-comp-high',
        category: 'Owner Compensation',
        title: 'Owner comp significantly above market — potential add-back',
        severity: 'info',
        finding: `You paid yourself $${(totalOwnerComp / 1000).toFixed(0)}K vs. market rate of $${(marketOwnerComp / 1000).toFixed(0)}K. The $${(excess / 1000).toFixed(0)}K excess is a legitimate add-back.`,
        buyerThinking: `"We'll accept some of this add-back, but we're going to scrutinize it. If the excess is bonus or perks, we'll challenge it. If it's base salary, it's more defensible."`,
        dollarImpact: `Potential $${((excess * 5) / 1000000).toFixed(1)}M-$${((excess * 7) / 1000000).toFixed(1)}M upside if add-back is accepted`,
        whatToDo: 'Document exactly what the excess compensation includes. Base salary add-backs are easier to defend than bonus, perks, or personal expenses run through the business.'
      });
    }

    // Revenue seasonality
    if (biggestQPct > 35) {
      flags.push({
        id: 'seasonality',
        category: 'Revenue Pattern',
        title: 'Significant revenue seasonality detected',
        severity: biggestQPct > 40 ? 'critical' : 'warning',
        finding: `Your biggest quarter represents ${biggestQPct.toFixed(0)}% of annual revenue. Even distribution would be 25% per quarter.`,
        buyerThinking: `"Seasonal business. I'm going to time the working capital peg to the high season — when the seller has maximum inventory and receivables — so the peg is artificially high. That shifts $${(totalRevenue * 0.02 / 1000).toFixed(0)}K-$${(totalRevenue * 0.05 / 1000).toFixed(0)}K to me at closing."`,
        dollarImpact: `$${(totalRevenue * 0.02 / 1000).toFixed(0)}K-$${(totalRevenue * 0.05 / 1000).toFixed(0)}K working capital manipulation risk`,
        whatToDo: 'Insist on a 12-month trailing average for the working capital peg, not a 3-month average. The 3-month average will be used against you if your closing date falls after your busy season.'
      });
    }

    // Revenue variance (month to month)
    if (revenueVariance > 80) {
      flags.push({
        id: 'revenue-variance',
        category: 'Revenue Pattern',
        title: 'High month-to-month revenue volatility',
        severity: 'warning',
        finding: `Monthly revenue swings from $${(minRevMonth / 1000).toFixed(0)}K to $${(maxRevMonth / 1000).toFixed(0)}K — a ${revenueVariance.toFixed(0)}% variance from the average.`,
        buyerThinking: `"Unpredictable revenue means unpredictable cash flow. I'm discounting this business for risk. I'll also use the lower months as evidence that the 'normalized' run rate is lower than the annual number suggests."`,
        dollarImpact: 'Potential 0.5-1.0x multiple discount for revenue volatility',
        whatToDo: 'Prepare an explanation for the volatility — project timing, contract cycles, seasonal patterns. If you can show the underlying trend is stable or growing despite month-to-month swings, the discount is smaller.'
      });
    }

    // Revenue trend — H2 declining vs H1
    if (h2Growth < -5 && h1Revenue > 0) {
      flags.push({
        id: 'revenue-declining',
        category: 'Revenue Trend',
        title: 'Revenue is declining in the second half of the year',
        severity: 'critical',
        finding: `H2 revenue ($${(h2Revenue / 1000).toFixed(0)}K) is ${Math.abs(h2Growth).toFixed(0)}% lower than H1 ($${(h1Revenue / 1000).toFixed(0)}K).`,
        buyerThinking: `"The business is shrinking. I'm going to use the H2 run rate as the basis for valuation, not the full-year number. If H2 annualized EBITDA is 10% lower, that's a 10% price cut — and I'll argue for more because the trend is negative."`,
        dollarImpact: `If buyer uses H2 run rate: $${((Math.abs(h2Growth) / 100 * adjustedEBITDA * 7) / 1000000).toFixed(1)}M+ reduction`,
        whatToDo: 'Don\'t go to market with a declining trend. Wait until you have 2-3 months of recovery. If the decline is seasonal, prepare the comparison to same-period prior year. Buyers will always use your worst months against you.'
      });
    }

    // Gross margin declining
    if (gmVariance > 10 && activeMargins.length >= 6) {
      const firstHalfAvg = activeMargins.slice(0, Math.floor(activeMargins.length / 2)).reduce((a, b) => a + b, 0) / Math.floor(activeMargins.length / 2);
      const secondHalfAvg = activeMargins.slice(Math.floor(activeMargins.length / 2)).reduce((a, b) => a + b, 0) / (activeMargins.length - Math.floor(activeMargins.length / 2));
      if (secondHalfAvg < firstHalfAvg - 2) {
        flags.push({
          id: 'gm-declining',
          category: 'Margins',
          title: 'Gross margin is trending downward',
          severity: 'critical',
          finding: `Gross margin averaged ${firstHalfAvg.toFixed(1)}% in the first half and ${secondHalfAvg.toFixed(1)}% in the second half — a ${(firstHalfAvg - secondHalfAvg).toFixed(1)} point decline.`,
          buyerThinking: `"Declining margins mean the business is losing pricing power, or costs are rising faster than revenue. Either way, I'm applying a lower multiple because the margin trajectory is negative."`,
          dollarImpact: 'Potential 0.5-1.5x multiple reduction for margin compression',
          whatToDo: 'Identify and document the reason. If it\'s a one-time event (supplier price increase, contract renegotiation), show the correction. If it\'s structural, address it before going to market.'
        });
      }
    }

    // Low gross margin
    if (grossMargin < 30 && totalRevenue > 0) {
      flags.push({
        id: 'low-gm',
        category: 'Margins',
        title: 'Gross margin below 30%',
        severity: 'warning',
        finding: `Your gross margin is ${grossMargin.toFixed(1)}%. Most PE-attractive businesses operate at 40%+ gross margin.`,
        buyerThinking: `"Low gross margin means there's less room for error. If revenue dips 10%, this business is barely profitable. I'm paying a lower multiple because the margin of safety is thin."`,
        dollarImpact: 'Typically 1-2x lower multiple for sub-30% gross margin businesses',
        whatToDo: 'Can you raise prices? Renegotiate supplier contracts? Shift product mix toward higher-margin offerings? Even a 3-5 point gross margin improvement translates to significant enterprise value.'
      });
    }

    // Customer concentration
    if (topCustomerPct > 15) {
      flags.push({
        id: 'customer-concentration',
        category: 'Customer Risk',
        title: `Top customer is ${topCustomerPct}% of revenue`,
        severity: topCustomerPct > 25 ? 'critical' : 'warning',
        finding: `Your largest customer represents ${topCustomerPct}% of total revenue. PE firms generally want no single customer above 10-15%.`,
        buyerThinking: `"If this customer leaves, the business loses ${topCustomerPct}% of revenue overnight. I'm calling this customer during diligence. If there's any wobble — contract expiring, competitor bidding — I'm re-trading the price by at least half of that customer's revenue contribution."`,
        dollarImpact: `If buyer re-trades: $${((topCustomerPct / 100 * totalRevenue * 0.5 * 7) / 1000000).toFixed(1)}M+ reduction`,
        whatToDo: 'Diversify before going to market. Get the top customer to sign a long-term contract. If concentration is unavoidable, prepare a detailed retention analysis and have the customer relationship documented (not just in the owner\'s head).'
      });
    }

    if (top5CustomerPct > 50) {
      flags.push({
        id: 'top5-concentration',
        category: 'Customer Risk',
        title: `Top 5 customers are ${top5CustomerPct}% of revenue`,
        severity: 'warning',
        finding: `Your top 5 customers represent ${top5CustomerPct}% of revenue. Losing even one would materially impact the business.`,
        buyerThinking: `"This business has a customer concentration problem. I need earnout protection or a holdback tied to customer retention. And I'm calling all five of these customers during diligence."`,
        dollarImpact: 'Expect buyer to push for customer-retention earnout or escrow enhancement',
        whatToDo: 'Document the tenure and contract status of each top customer. Long relationships with multi-year contracts mitigate the risk. New relationships without contracts amplify it.'
      });
    }

    // Low recurring revenue
    if (recurringRevenuePct < 30 && recurringRevenuePct > 0) {
      flags.push({
        id: 'low-recurring',
        category: 'Revenue Quality',
        title: `Only ${recurringRevenuePct}% recurring/contracted revenue`,
        severity: 'warning',
        finding: `${recurringRevenuePct}% of your revenue is recurring or contracted. PE firms pay premium multiples for 60%+ recurring revenue.`,
        buyerThinking: `"Non-recurring revenue means I'm buying a sales team, not a business. Every year starts at zero. I'm paying 1-2x less in multiple than I would for a subscription/recurring model."`,
        dollarImpact: `1-2x lower multiple = $${((adjustedEBITDA * 1.5) / 1000000).toFixed(1)}M less in enterprise value`,
        whatToDo: 'Can you convert any revenue to contracts, subscriptions, or retainer arrangements before going to market? Even shifting 20% of revenue to recurring changes the valuation conversation.'
      });
    }

    // Travel & entertainment high
    if (totalTravel > totalRevenue * 0.03 && totalRevenue > 0) {
      flags.push({
        id: 'high-travel',
        category: 'Expense Red Flags',
        title: 'Travel & entertainment expenses are elevated',
        severity: 'info',
        finding: `T&E is $${(totalTravel / 1000).toFixed(0)}K (${((totalTravel / totalRevenue) * 100).toFixed(1)}% of revenue). PE firms scrutinize T&E closely for personal expenses.`,
        buyerThinking: `"I'm going to assume 50-70% of this T&E is personal until proven otherwise. Vacations disguised as business trips, dinners with friends, spouse travel. I'm rejecting this as an add-back unless there's a clear business purpose documented for every dollar."`,
        dollarImpact: `If T&E add-back is partially rejected: $${((totalTravel * 0.5 * 7) / 1000000).toFixed(2)}M impact`,
        whatToDo: 'Clean up T&E 12 months before going to market. Remove personal expenses. Document the business purpose of every trip and meal. Keep personal and business spending completely separate.'
      });
    }

    // Professional fees spike
    if (totalProfFees > totalRevenue * 0.03 && totalRevenue > 0) {
      flags.push({
        id: 'high-prof-fees',
        category: 'Expense Red Flags',
        title: 'Professional fees are high relative to revenue',
        severity: 'info',
        finding: `Professional fees are $${(totalProfFees / 1000).toFixed(0)}K (${((totalProfFees / totalRevenue) * 100).toFixed(1)}% of revenue).`,
        buyerThinking: `"Are these one-time legal or accounting costs (potential add-back) or ongoing? If ongoing, this is a real expense. If it includes the cost of preparing for the sale, I'm not giving an add-back for deal expenses — that's the seller's cost."`,
        dollarImpact: 'Contested add-back if sale-related fees are included',
        whatToDo: 'Separate one-time professional fees (lawsuit, special project, sale preparation) from recurring fees (annual audit, ongoing legal). Only one-time fees are legitimate add-backs.'
      });
    }

    // EBITDA margin
    const ebitdaMargin = totalRevenue > 0 ? (adjustedEBITDA / totalRevenue) * 100 : 0;
    if (ebitdaMargin < 10 && totalRevenue > 0) {
      flags.push({
        id: 'low-ebitda-margin',
        category: 'Profitability',
        title: `EBITDA margin is only ${ebitdaMargin.toFixed(1)}%`,
        severity: 'critical',
        finding: `Your adjusted EBITDA margin is ${ebitdaMargin.toFixed(1)}%. Most PE acquisitions target 15%+ EBITDA margins.`,
        buyerThinking: `"Thin margins mean thin room for error. One bad quarter and this business is underwater. I'm either paying a lower multiple or structuring with heavy earnout to protect my downside."`,
        dollarImpact: '1-3x multiple discount for sub-10% EBITDA margins',
        whatToDo: 'Identify margin expansion opportunities before going to market. Cost reductions, price increases, product mix optimization. Even 2-3 points of margin improvement can justify a 1x higher multiple.'
      });
    }

    // Small business
    if (adjustedEBITDA > 0 && adjustedEBITDA < 1000000) {
      flags.push({
        id: 'small-ebitda',
        category: 'Scale',
        title: 'EBITDA under $1M limits buyer universe',
        severity: 'warning',
        finding: `Adjusted EBITDA of $${(adjustedEBITDA / 1000).toFixed(0)}K is below the threshold for most institutional PE firms (typically $2M+).`,
        buyerThinking: `"This is too small for our fund. We need $3M+ EBITDA to justify the diligence costs and management attention. This is a search fund or independent sponsor deal — and they pay lower multiples."`,
        dollarImpact: 'Limited buyer universe = 1-2x lower multiples than larger businesses',
        whatToDo: 'Consider growing to $2M+ EBITDA before selling. Alternatively, position the business as a bolt-on acquisition for a PE-backed platform company — they\'ll pay more because they already have the infrastructure.'
      });
    }

    return flags;
  };

  const redFlags = generateRedFlags();
  const criticalFlags = redFlags.filter(f => f.severity === 'critical');
  const warningFlags = redFlags.filter(f => f.severity === 'warning');
  const infoFlags = redFlags.filter(f => f.severity === 'info');

  // ── CSV Export ────────────────────────────────────────────────

  const exportCSV = () => {
    const ebitdaMargin = totalRevenue > 0 ? (adjustedEBITDA / totalRevenue) * 100 : 0;
    const lines: string[] = [
      'PE Ready Plus - See Your Financials Through PE Eyes',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      'FINANCIAL SUMMARY',
      `Annual Revenue: $${(totalRevenue / 1000).toFixed(0)}K`,
      `Gross Profit: $${(totalGrossProfit / 1000).toFixed(0)}K (${grossMargin.toFixed(1)}% margin)`,
      `Total Operating Expenses: $${(totalOpex / 1000).toFixed(0)}K`,
      `Reported EBITDA: $${(reportedEBITDA / 1000).toFixed(0)}K`,
      `Owner Comp Adjustment: $${(Math.max(0, ownerCompAdjustment) / 1000).toFixed(0)}K`,
      `Adjusted EBITDA: $${(adjustedEBITDA / 1000).toFixed(0)}K (${ebitdaMargin.toFixed(1)}% margin)`,
      '',
      `Critical Red Flags: ${criticalFlags.length}`,
      `Warning Flags: ${warningFlags.length}`,
      `Info Items: ${infoFlags.length}`,
      '',
      'RED FLAGS',
      'Severity,Category,Title,Finding,Buyer Thinking,Dollar Impact,Action',
    ];

    redFlags.forEach(f => {
      lines.push(`"${f.severity}","${f.category}","${f.title}","${f.finding}","${f.buyerThinking}","${f.dollarImpact}","${f.whatToDo}"`);
    });

    lines.push('', 'MONTHLY DATA', 'Month,Revenue,COGS,Gross Profit,Owner Comp,Rent,Payroll,Marketing,Insurance,Utilities,Prof Fees,Travel,Other');
    monthlyData.forEach((m, i) => {
      lines.push(`${MONTHS[i]},${m.revenue},${m.cogs},${m.revenue - m.cogs},${m.ownerComp},${m.rent},${m.payroll},${m.marketing},${m.insurance},${m.utilities},${m.professionalFees},${m.travel},${m.otherExpenses}`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pe-eyes-analysis-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Tab 1: What PE Sees ───────────────────────────────────────

  const renderWhatPESees = () => (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-purple-400" />
            How a PE Firm Reads Your P&L
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            When a PE firm looks at your financials, they don't see what you see. You see your business.
            They see a spreadsheet of risks, adjustments, and opportunities to reduce the price.
          </p>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
            <p className="text-lg font-semibold text-purple-400 mb-3">The Buy-Side QoE Mindset</p>
            <p className="text-muted-foreground">
              A buyer's Quality of Earnings team assumes your financials are overstated until proven otherwise.
              Every add-back is contested. Every spike in revenue is questioned. Every dip in margins is a red flag.
              Their job is to find reasons to pay less — and they're very good at it.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* The 8 Things PE Looks At */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>The 8 Things PE Scrutinizes First</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              num: 1, title: 'Monthly Revenue Trends', icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
              desc: 'Not annual — monthly. They want to see if revenue is growing, flat, or declining in recent months. A $10M business that did $1.2M in January and $700K in June looks very different than one that did $833K every month.'
            },
            {
              num: 2, title: 'Gross Margin Trajectory', icon: <TrendingDown className="w-5 h-5 text-yellow-400" />,
              desc: 'Is your gross margin stable, expanding, or compressing? Declining margins signal loss of pricing power, rising input costs, or competitive pressure. Each percentage point of margin decline costs 5-7x in enterprise value.'
            },
            {
              num: 3, title: 'Owner Compensation vs. Market', icon: <DollarSign className="w-5 h-5 text-green-400" />,
              desc: 'If you pay yourself $150K but a replacement CEO costs $350K, that $200K difference comes OFF EBITDA — it\'s not an add-back, it\'s a required expense. At 7x, that\'s $1.4M off the price.'
            },
            {
              num: 4, title: 'Revenue Concentration', icon: <Target className="w-5 h-5 text-red-400" />,
              desc: 'If your top customer is 20%+ of revenue, the buyer is calling that customer during diligence. Any hint of risk — expiring contract, competitor discussions — becomes a price reduction.'
            },
            {
              num: 5, title: 'Seasonality & Working Capital', icon: <Clock className="w-5 h-5 text-amber-400" />,
              desc: 'Seasonal businesses get the working capital peg timed against them. If 40% of your revenue comes in Q4, the buyer sets the working capital peg during your high-inventory period.'
            },
            {
              num: 6, title: 'Add-Back Quality', icon: <Search className="w-5 h-5 text-purple-400" />,
              desc: 'PE buyers reject 30-40% of seller add-backs. Travel, entertainment, "consulting fees" to family members, personal car leases — these get challenged hard. Only well-documented, clearly non-recurring items survive.'
            },
            {
              num: 7, title: 'Revenue Quality', icon: <Shield className="w-5 h-5 text-cyan-400" />,
              desc: 'Recurring/contracted revenue is worth 2-3x more than project-based or one-time revenue. PE firms pay premiums for predictability and discounts for uncertainty.'
            },
            {
              num: 8, title: 'EBITDA Margin vs. Peers', icon: <Percent className="w-5 h-5 text-orange-400" />,
              desc: 'Your EBITDA margin gets benchmarked against industry peers. Below-median margins mean either you\'re less efficient (discount) or there\'s room for improvement (sometimes a value play). PE assumes the former.'
            },
          ].map(item => (
            <div key={item.num} className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{item.icon}</div>
                <div>
                  <p className="font-semibold text-foreground">{item.num}. {item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" /> Ready to see what PE would find in YOUR numbers?
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Enter your monthly P&L in the next tab. The analysis engine will show you every red flag, adjustment,
              and vulnerability — exactly the way a buy-side QoE team would mark it up.
            </p>
            <Button onClick={() => setActiveTab(1)} className="gap-2">
              Enter Your Numbers <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ── Tab 2: Enter Numbers ──────────────────────────────────────

  const renderEnterNumbers = () => (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Enter Your Monthly P&L
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Enter your trailing 12 months of actuals. The more accurate the data, the more useful the red flag analysis.
            All amounts in dollars.
          </p>

          {/* Scrollable table */}
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left p-2 sticky left-0 bg-muted/30 min-w-[160px] border-r border-border">Line Item</th>
                  {MONTHS.map(m => (
                    <th key={m} className="p-2 text-center min-w-[100px]">{m}</th>
                  ))}
                  <th className="p-2 text-center min-w-[110px] bg-muted/50 border-l border-border font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {LINE_ITEMS.map(item => {
                  const isCalc = item.isCalculated;
                  const totals: Record<string, number> = {
                    revenue: totalRevenue,
                    cogs: totalCOGS,
                    grossProfit: totalGrossProfit,
                    ownerComp: totalOwnerComp,
                    rent: totalRent,
                    payroll: totalPayroll,
                    marketing: totalMarketing,
                    insurance: totalInsurance,
                    utilities: totalUtilities,
                    professionalFees: totalProfFees,
                    travel: totalTravel,
                    otherExpenses: totalOther,
                  };
                  const total = totals[item.key] || 0;
                  const isGP = item.key === 'grossProfit';

                  return (
                    <tr key={item.key} className={`border-t border-border ${isGP ? 'bg-blue-500/5 font-semibold' : ''}`}>
                      <td className={`p-2 sticky left-0 border-r border-border ${isGP ? 'bg-blue-500/5' : 'bg-card'} ${item.isRevenue ? 'text-green-400' : ''}`}>
                        {item.label}
                      </td>
                      {MONTHS.map((m, mi) => (
                        <td key={m} className="p-1 text-center">
                          {isCalc ? (
                            <span className={`text-sm ${monthlyData[mi].revenue - monthlyData[mi].cogs < 0 ? 'text-red-400' : 'text-blue-400'}`}>
                              {monthlyData[mi].revenue - monthlyData[mi].cogs > 0 ? `$${((monthlyData[mi].revenue - monthlyData[mi].cogs) / 1000).toFixed(0)}K` : monthlyData[mi].revenue > 0 ? `-$${(Math.abs(monthlyData[mi].revenue - monthlyData[mi].cogs) / 1000).toFixed(0)}K` : '-'}
                            </span>
                          ) : (
                            <input
                              type="number"
                              value={monthlyData[mi][item.key] || ''}
                              onChange={(e) => updateMonth(mi, item.key, Number(e.target.value) || 0)}
                              placeholder="0"
                              className="w-full bg-muted/30 border border-border rounded px-2 py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          )}
                        </td>
                      ))}
                      <td className={`p-2 text-center font-semibold border-l border-border ${isGP ? 'bg-blue-500/10' : 'bg-muted/50'}`}>
                        {total > 0 ? `$${(total / 1000).toFixed(0)}K` : total < 0 ? `-$${(Math.abs(total) / 1000).toFixed(0)}K` : '-'}
                      </td>
                    </tr>
                  );
                })}
                {/* EBITDA row */}
                <tr className="border-t-2 border-border bg-amber-500/5 font-bold">
                  <td className="p-2 sticky left-0 bg-amber-500/5 border-r border-border text-amber-400">Reported EBITDA</td>
                  {MONTHS.map((m, mi) => {
                    const monthEBITDA = (monthlyData[mi].revenue - monthlyData[mi].cogs) -
                      monthlyData[mi].ownerComp - monthlyData[mi].rent - monthlyData[mi].payroll -
                      monthlyData[mi].marketing - monthlyData[mi].insurance - monthlyData[mi].utilities -
                      monthlyData[mi].professionalFees - monthlyData[mi].travel - monthlyData[mi].otherExpenses;
                    return (
                      <td key={m} className="p-2 text-center text-sm">
                        {monthlyData[mi].revenue > 0 ? (
                          <span className={monthEBITDA >= 0 ? 'text-green-400' : 'text-red-400'}>
                            ${(monthEBITDA / 1000).toFixed(0)}K
                          </span>
                        ) : '-'}
                      </td>
                    );
                  })}
                  <td className={`p-2 text-center border-l border-border bg-amber-500/10 ${reportedEBITDA >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${(reportedEBITDA / 1000).toFixed(0)}K
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Context */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Additional Context</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            These inputs help the analysis identify additional red flags a PE buyer would find.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Market-Rate CEO Replacement Cost (annual)
              </label>
              <input
                type="number"
                value={marketOwnerComp || ''}
                onChange={(e) => setMarketOwnerComp(Number(e.target.value) || 0)}
                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="250000"
              />
              <p className="text-xs text-muted-foreground mt-1">What would you pay to hire a CEO to replace yourself?</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Top Customer % of Revenue
              </label>
              <input
                type="number"
                value={topCustomerPct || ''}
                onChange={(e) => setTopCustomerPct(Math.min(100, Number(e.target.value) || 0))}
                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="0"
                min="0" max="100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Top 5 Customers % of Revenue
              </label>
              <input
                type="number"
                value={top5CustomerPct || ''}
                onChange={(e) => setTop5CustomerPct(Math.min(100, Number(e.target.value) || 0))}
                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="0"
                min="0" max="100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Recurring/Contracted Revenue %
              </label>
              <input
                type="number"
                value={recurringRevenuePct || ''}
                onChange={(e) => setRecurringRevenuePct(Math.min(100, Number(e.target.value) || 0))}
                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="0"
                min="0" max="100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {hasData && (
        <div className="text-center">
          <Button onClick={() => setActiveTab(2)} className="px-8 py-3 text-lg gap-2">
            See What PE Finds <Eye className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );

  // ── Tab 3: Red Flag Analysis ──────────────────────────────────

  const renderRedFlags = () => {
    if (!hasData) {
      return (
        <div>
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Enter Your Numbers First</h3>
              <p className="text-muted-foreground mb-4">
                Go to the "Enter Your Numbers" tab and input your monthly P&L data.
                The red flag analysis will automatically generate based on your financials.
              </p>
              <Button onClick={() => setActiveTab(1)}>
                Enter Numbers <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    const ebitdaMargin = totalRevenue > 0 ? (adjustedEBITDA / totalRevenue) * 100 : 0;

    return (
      <div className="space-y-6">
        {/* Summary Dashboard */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-purple-400" />
              What a PE Buyer Sees in Your Numbers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-foreground">${(totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">Annual Revenue</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{grossMargin.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Gross Margin</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <p className={`text-2xl font-bold ${adjustedEBITDA >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${(adjustedEBITDA / 1000000).toFixed(2)}M
                </p>
                <p className="text-xs text-muted-foreground">Adjusted EBITDA</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <p className={`text-2xl font-bold ${ebitdaMargin >= 15 ? 'text-green-400' : ebitdaMargin >= 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {ebitdaMargin.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">EBITDA Margin</p>
              </div>
            </div>

            {/* Red flag summary */}
            <div className="flex flex-wrap gap-3">
              {criticalFlags.length > 0 && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  {criticalFlags.length} Critical
                </Badge>
              )}
              {warningFlags.length > 0 && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  {warningFlags.length} Warning
                </Badge>
              )}
              {infoFlags.length > 0 && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {infoFlags.length} Info
                </Badge>
              )}
              {redFlags.length === 0 && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  No Red Flags Detected
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* EBITDA Bridge */}
        {ownerCompAdjustment > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">EBITDA Adjustment Bridge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Reported EBITDA</span>
                  <span className="font-semibold">${(reportedEBITDA / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">+ Owner Comp Above Market</span>
                  <span className="font-semibold text-green-400">+${(ownerCompAdjustment / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-amber-500/10 rounded-lg px-3">
                  <span className="font-bold text-foreground">Adjusted EBITDA</span>
                  <span className="font-bold text-amber-400">${(adjustedEBITDA / 1000).toFixed(0)}K</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Note: A buyer's QoE team would make additional adjustments. This shows only the owner compensation adjustment.
                Add-backs for T&E, one-time expenses, and other items would be negotiated during diligence.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Red Flags */}
        {criticalFlags.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <XCircle className="w-5 h-5" />
                Critical Red Flags ({criticalFlags.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalFlags.map(flag => (
                <RedFlagCard key={flag.id} flag={flag} />
              ))}
            </CardContent>
          </Card>
        )}

        {warningFlags.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="w-5 h-5" />
                Warning Flags ({warningFlags.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {warningFlags.map(flag => (
                <RedFlagCard key={flag.id} flag={flag} />
              ))}
            </CardContent>
          </Card>
        )}

        {infoFlags.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Lightbulb className="w-5 h-5" />
                Items to Watch ({infoFlags.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {infoFlags.map(flag => (
                <RedFlagCard key={flag.id} flag={flag} />
              ))}
            </CardContent>
          </Card>
        )}

        {redFlags.length === 0 && hasData && (
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-400 mb-2">Clean Bill of Health</h3>
              <p className="text-muted-foreground">
                Based on the data entered, no major red flags were detected. Your financials look solid from a PE buyer's perspective.
                Note: this analysis covers the data you provided — a full QoE would examine additional areas.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Button onClick={() => setActiveTab(3)} className="gap-2">
            View Full Report <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  // ── Tab 4: Report ─────────────────────────────────────────────

  const renderReport = () => {
    if (!hasData) {
      return (
        <div>
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Enter Your Numbers First</h3>
              <p className="text-muted-foreground">Input your monthly P&L to generate the report.</p>
              <Button onClick={() => setActiveTab(1)} className="mt-4">
                Enter Numbers <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    const ebitdaMargin = totalRevenue > 0 ? (adjustedEBITDA / totalRevenue) * 100 : 0;

    let overallVerdict = '';
    let verdictColor = '';
    let verdictBg = '';
    if (criticalFlags.length === 0 && warningFlags.length === 0) {
      overallVerdict = 'PE-Ready Financials';
      verdictColor = 'text-emerald-400';
      verdictBg = 'bg-emerald-500/10 border-emerald-500/20';
    } else if (criticalFlags.length === 0) {
      overallVerdict = 'Minor Fixes Needed';
      verdictColor = 'text-green-400';
      verdictBg = 'bg-green-500/10 border-green-500/20';
    } else if (criticalFlags.length <= 2) {
      overallVerdict = 'Significant Work Required';
      verdictColor = 'text-yellow-400';
      verdictBg = 'bg-yellow-500/10 border-yellow-500/20';
    } else {
      overallVerdict = 'Not Ready for Market';
      verdictColor = 'text-red-400';
      verdictBg = 'bg-red-500/10 border-red-500/20';
    }

    return (
      <div className="space-y-6">
        {/* Overall Verdict */}
        <Card className={`border ${verdictBg}`}>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">PE Financial Assessment</p>
            <p className={`text-4xl font-bold ${verdictColor} mb-4`}>{overallVerdict}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-2xl font-bold text-foreground">${(totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${(adjustedEBITDA / 1000000).toFixed(2)}M</p>
                <p className="text-xs text-muted-foreground">Adj. EBITDA</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ebitdaMargin.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">EBITDA Margin</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{redFlags.length}</p>
                <p className="text-xs text-muted-foreground">Red Flags</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implied Valuation Range */}
        {adjustedEBITDA > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Implied Enterprise Value Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Based on adjusted EBITDA of ${(adjustedEBITDA / 1000000).toFixed(2)}M and typical multiples for your profile:
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Conservative (5x)</p>
                  <p className="text-xl font-bold text-red-400">${((adjustedEBITDA * 5) / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Base (7x)</p>
                  <p className="text-xl font-bold text-amber-400">${((adjustedEBITDA * 7) / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Premium (9x)</p>
                  <p className="text-xl font-bold text-green-400">${((adjustedEBITDA * 9) / 1000000).toFixed(1)}M</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Note: Actual multiples vary by industry, growth rate, and competitive process. These are illustrative ranges.
                Critical red flags typically push toward the conservative end; clean financials with growth push toward premium.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Summary of Findings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Summary of Findings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {redFlags.map(flag => (
              <div key={flag.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
                flag.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                flag.severity === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' :
                'bg-blue-500/5 border-blue-500/20'
              }`}>
                {flag.severity === 'critical' ? <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /> :
                 flag.severity === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" /> :
                 <Lightbulb className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}
                <div>
                  <p className="font-medium text-foreground text-sm">{flag.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{flag.dollarImpact}</p>
                </div>
              </div>
            ))}
            {redFlags.length === 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <p className="text-sm text-green-400 font-medium">No major red flags detected — your financials look clean.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preparation Checklist */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Before You Go to Market
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'Run a sell-side Quality of Earnings to eliminate surprises before buyers find them.',
              'Normalize owner compensation to market rate at least 12 months before selling.',
              'Address customer concentration — get long-term contracts, diversify revenue sources.',
              'Clean up personal expenses from business financials. Separate everything.',
              'Show consistent or growing monthly revenue trends. Don\'t go to market with a declining trajectory.',
              'Document every add-back with receipts, explanations, and proof of non-recurrence.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-sm mt-0.5">{i + 1}.</span>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export */}
        <div className="flex justify-center">
          <Button onClick={exportCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Full Report as CSV
          </Button>
        </div>
      </div>
    );
  };

  // ── Main Render ───────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === idx
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 0 && renderWhatPESees()}
      {activeTab === 1 && renderEnterNumbers()}
      {activeTab === 2 && renderRedFlags()}
      {activeTab === 3 && renderReport()}
    </div>
  );
};

// ── Red Flag Card Component ─────────────────────────────────────

const RedFlagCard: React.FC<{ flag: RedFlag }> = ({ flag }) => {
  const [expanded, setExpanded] = useState(false);

  const severityStyles = {
    critical: { badge: 'bg-red-500/20 text-red-400 border-red-500/30', border: 'border-red-500/20' },
    warning: { badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', border: 'border-yellow-500/20' },
    info: { badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', border: 'border-blue-500/20' },
  };

  const styles = severityStyles[flag.severity];

  return (
    <div className={`rounded-lg border ${styles.border} overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={styles.badge + ' text-xs'}>
                {flag.severity.toUpperCase()}
              </Badge>
              <span className="text-xs text-muted-foreground">{flag.category}</span>
            </div>
            <p className="font-semibold text-foreground">{flag.title}</p>
          </div>
          <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform shrink-0 mt-1 ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">What PE finds:</p>
            <p className="text-sm text-muted-foreground">{flag.finding}</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <p className="text-sm font-medium text-purple-400 mb-1">What the buyer is thinking:</p>
            <p className="text-sm text-muted-foreground italic">{flag.buyerThinking}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-sm font-medium text-red-400 mb-1">Dollar impact:</p>
            <p className="text-sm text-muted-foreground">{flag.dollarImpact}</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-sm font-medium text-green-400 mb-1">What to do about it:</p>
            <p className="text-sm text-muted-foreground">{flag.whatToDo}</p>
          </div>
        </div>
      )}
    </div>
  );
};
