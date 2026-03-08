
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign, Users, TrendingUp, BarChart3, Target,
  AlertTriangle, CheckCircle2, Download, ArrowUp,
  ArrowDown, Star, Activity, Percent, RefreshCw,
  Zap, Shield, Eye, PieChart, Calculator
} from "lucide-react";

const STORAGE_KEY = 'revenue-quality-v1';

// ── Types ───────────────────────────────────────────────

type BusinessModel = 'saas' | 'recurring_services' | 'transaction' | 'hybrid';

interface RevenueQualityState {
  businessModel: BusinessModel;
  totalRevenue: number;
  recurringRevenue: number;
  beginningARR: number;
  newARR: number;
  expansionARR: number;
  contractionARR: number;
  churnedARR: number;
  totalCustomers: number;
  newCustomers: number;
  salesMarketingSpend: number;
  grossMarginPercent: number;
  grossRetentionRate: number;
  netRetentionRate: number;
  logoChurnRate: number;
  revenueGrowthRate: number;
  ebitdaMargin: number;
  priorPeriodSMSpend: number;
  top1CustomerPercent: number;
  top5CustomersPercent: number;
  top10CustomersPercent: number;
  top20CustomersPercent: number;
}

const defaultState: RevenueQualityState = {
  businessModel: 'saas',
  totalRevenue: 0,
  recurringRevenue: 0,
  beginningARR: 0,
  newARR: 0,
  expansionARR: 0,
  contractionARR: 0,
  churnedARR: 0,
  totalCustomers: 0,
  newCustomers: 0,
  salesMarketingSpend: 0,
  grossMarginPercent: 0,
  grossRetentionRate: 0,
  netRetentionRate: 0,
  logoChurnRate: 0,
  revenueGrowthRate: 0,
  ebitdaMargin: 0,
  priorPeriodSMSpend: 0,
  top1CustomerPercent: 0,
  top5CustomersPercent: 0,
  top10CustomersPercent: 0,
  top20CustomersPercent: 0,
};

// ── Helpers ─────────────────────────────────────────────

const fmt = (v: number) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
};

const pct = (v: number) => `${v.toFixed(1)}%`;
const mult = (v: number) => `${v.toFixed(1)}x`;
const mo = (v: number) => `${Math.round(v)} mo`;

const safe = (n: number, d: number) => (d === 0 ? 0 : n / d);

const colorForBenchmark = (value: number, green: number, yellow: number, invert = false) => {
  if (invert) {
    if (value <= green) return 'text-emerald-400';
    if (value <= yellow) return 'text-yellow-400';
    return 'text-red-400';
  }
  if (value >= green) return 'text-emerald-400';
  if (value >= yellow) return 'text-yellow-400';
  return 'text-red-400';
};

const bgForBenchmark = (value: number, green: number, yellow: number, invert = false) => {
  if (invert) {
    if (value <= green) return 'bg-emerald-500/20 border-emerald-500/30';
    if (value <= yellow) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  }
  if (value >= green) return 'bg-emerald-500/20 border-emerald-500/30';
  if (value >= yellow) return 'bg-yellow-500/20 border-yellow-500/30';
  return 'bg-red-500/20 border-red-500/30';
};

const scoreLabel = (s: number) => {
  if (s >= 4.5) return { text: 'Exceptional', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
  if (s >= 3.5) return { text: 'Strong', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
  if (s >= 2.5) return { text: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
  if (s >= 1.5) return { text: 'Weak', color: 'text-orange-400', bg: 'bg-orange-500/20' };
  return { text: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20' };
};

const businessModelLabels: Record<BusinessModel, string> = {
  saas: 'SaaS / Subscription',
  recurring_services: 'Recurring Services',
  transaction: 'Transaction / Usage-Based',
  hybrid: 'Hybrid',
};

// ── Scoring Logic ───────────────────────────────────────

const scoreRecurring = (pct: number): number => {
  if (pct >= 95) return 5;
  if (pct >= 85) return 4;
  if (pct >= 70) return 3;
  if (pct >= 50) return 2;
  return 1;
};

const scoreNDR = (ndr: number): number => {
  if (ndr >= 130) return 5;
  if (ndr >= 120) return 4;
  if (ndr >= 110) return 3;
  if (ndr >= 100) return 2;
  return 1;
};

const scoreConcentration = (top10: number): number => {
  if (top10 <= 20) return 5;
  if (top10 <= 30) return 4;
  if (top10 <= 40) return 3;
  if (top10 <= 50) return 2;
  return 1;
};

const scoreCohortStability = (grossRet: number): number => {
  if (grossRet >= 95) return 5;
  if (grossRet >= 90) return 4;
  if (grossRet >= 85) return 3;
  if (grossRet >= 80) return 2;
  return 1;
};

const scoreGrowthDurability = (ruleOf40: number): number => {
  if (ruleOf40 >= 60) return 5;
  if (ruleOf40 >= 40) return 4;
  if (ruleOf40 >= 30) return 3;
  if (ruleOf40 >= 20) return 2;
  return 1;
};

const scoreMarginProfile = (gm: number): number => {
  if (gm >= 80) return 5;
  if (gm >= 70) return 4;
  if (gm >= 60) return 3;
  if (gm >= 50) return 2;
  return 1;
};

// ── Component ───────────────────────────────────────────

export const RevenueQuality: React.FC = () => {
  const [state, setState] = useState<RevenueQualityState>(defaultState);
  const [activeTab, setActiveTab] = useState('revenue');

  // Load from localStorage, then fill gaps from Company Profile
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let loaded = { ...defaultState };
    if (saved) {
      try { loaded = { ...defaultState, ...JSON.parse(saved) }; } catch (e) { /* ignore */ }
    }
    // Fill empty fields from Company Profile (profile uses $M, this module uses raw $)
    try {
      const raw = localStorage.getItem('company-profile-v1');
      if (raw) {
        const cp = JSON.parse(raw);
        if (!loaded.totalRevenue && cp.annualRevenue) loaded.totalRevenue = cp.annualRevenue * 1_000_000;
        if (!loaded.grossMarginPercent && cp.grossMarginPercent) loaded.grossMarginPercent = cp.grossMarginPercent;
        if (!loaded.revenueGrowthRate && cp.revenueGrowthRate) loaded.revenueGrowthRate = cp.revenueGrowthRate;
        if (!loaded.ebitdaMargin && cp.ebitdaMargin) loaded.ebitdaMargin = cp.ebitdaMargin;
        if (!loaded.totalCustomers && cp.customerCount) loaded.totalCustomers = cp.customerCount;
        if (!loaded.top10CustomersPercent && cp.top10CustomerConcentration) loaded.top10CustomersPercent = cp.top10CustomerConcentration;
        if (!loaded.businessModel && cp.businessModel) loaded.businessModel = cp.businessModel as any;
      }
    } catch (e) { /* ignore */ }
    setState(loaded);
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const update = (field: keyof RevenueQualityState, value: number | string) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const numChange = (field: keyof RevenueQualityState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    update(field, val);
  };

  // ── Calculated Metrics ──────────────────────────────

  const calc = useMemo(() => {
    const endingARR = state.beginningARR + state.newARR + state.expansionARR - state.contractionARR - state.churnedARR;
    const recurringPct = safe(state.recurringRevenue, state.totalRevenue) * 100;
    const arpu = safe(state.totalRevenue, state.totalCustomers);
    const monthlyARPU = arpu / 12;
    const cac = safe(state.salesMarketingSpend, state.newCustomers);
    const monthlyChurnRate = safe(state.logoChurnRate, 12) / 100;
    const ltv = monthlyChurnRate > 0 ? (monthlyARPU * (state.grossMarginPercent / 100)) / monthlyChurnRate : 0;
    const ltvCac = safe(ltv, cac);
    const cacPayback = (monthlyARPU * (state.grossMarginPercent / 100)) > 0
      ? cac / (monthlyARPU * (state.grossMarginPercent / 100))
      : 0;
    const ruleOf40 = state.revenueGrowthRate + state.ebitdaMargin;
    const netNewARR = endingARR - state.beginningARR;
    const magicNumber = safe(netNewARR, state.priorPeriodSMSpend);
    const expansionRate = safe(state.expansionARR, state.beginningARR) * 100;
    const dollarChurnRate = safe(state.churnedARR, state.beginningARR) * 100;

    return {
      endingARR,
      recurringPct,
      arpu,
      cac,
      ltv,
      ltvCac,
      cacPayback,
      ruleOf40,
      magicNumber,
      netNewARR,
      expansionRate,
      dollarChurnRate,
    };
  }, [state]);

  // ── Revenue Quality Scores ──────────────────────────

  const scores = useMemo(() => {
    const recurringPctScore = scoreRecurring(calc.recurringPct);
    const ndrScore = scoreNDR(state.netRetentionRate);
    const concentrationScore = scoreConcentration(state.top10CustomersPercent);
    const cohortScore = scoreCohortStability(state.grossRetentionRate);
    const growthScore = scoreGrowthDurability(calc.ruleOf40);
    const marginScore = scoreMarginProfile(state.grossMarginPercent);

    const factors = [
      { name: 'Recurring Revenue %', score: recurringPctScore, value: `${calc.recurringPct.toFixed(1)}%`, benchmark: '>85% good, >95% best', icon: RefreshCw },
      { name: 'Net Dollar Retention', score: ndrScore, value: `${state.netRetentionRate.toFixed(1)}%`, benchmark: '>110% good, >120% best', icon: TrendingUp },
      { name: 'Customer Concentration', score: concentrationScore, value: `Top 10 = ${state.top10CustomersPercent}%`, benchmark: '<30% good, <20% best', icon: PieChart },
      { name: 'Cohort Stability', score: cohortScore, value: `Gross Ret. ${state.grossRetentionRate}%`, benchmark: '>90% good, >95% best', icon: Shield },
      { name: 'Growth Durability', score: growthScore, value: `Rule of 40 = ${calc.ruleOf40.toFixed(0)}`, benchmark: '>40 good, >60 best', icon: Zap },
      { name: 'Margin Profile', score: marginScore, value: `GM ${state.grossMarginPercent}%`, benchmark: '>70% good, >80% best', icon: Activity },
    ];

    const overall = factors.reduce((sum, f) => sum + f.score, 0) / factors.length;

    return { factors, overall };
  }, [state, calc]);

  // ── Strengths & Concerns ────────────────────────────

  const insights = useMemo(() => {
    const strengths: string[] = [];
    const concerns: string[] = [];

    if (calc.recurringPct >= 85) strengths.push(`${calc.recurringPct.toFixed(0)}% recurring revenue — highly predictable cash flows`);
    else if (calc.recurringPct < 70) concerns.push(`Only ${calc.recurringPct.toFixed(0)}% recurring revenue — PE firms prefer >85%`);

    if (state.netRetentionRate >= 110) strengths.push(`${state.netRetentionRate}% NDR — existing customers are growing`);
    else if (state.netRetentionRate < 100) concerns.push(`${state.netRetentionRate}% NDR means you're losing revenue from existing customers`);

    if (state.top10CustomersPercent <= 30) strengths.push('Diversified customer base — no single-customer risk');
    else if (state.top10CustomersPercent > 50) concerns.push(`Top 10 customers = ${state.top10CustomersPercent}% of revenue — high concentration risk`);

    if (calc.ltvCac >= 3) strengths.push(`LTV:CAC of ${calc.ltvCac.toFixed(1)}x — efficient customer acquisition`);
    else if (calc.ltvCac > 0 && calc.ltvCac < 2) concerns.push(`LTV:CAC of ${calc.ltvCac.toFixed(1)}x — below the 3x minimum PE firms want`);

    if (calc.ruleOf40 >= 40) strengths.push(`Rule of 40 score of ${calc.ruleOf40.toFixed(0)} — strong growth-profitability balance`);
    else if (calc.ruleOf40 < 30) concerns.push(`Rule of 40 score of ${calc.ruleOf40.toFixed(0)} — below the 40 threshold PE targets`);

    if (state.grossMarginPercent >= 70) strengths.push(`${state.grossMarginPercent}% gross margin — software-like economics`);
    else if (state.grossMarginPercent < 60) concerns.push(`${state.grossMarginPercent}% gross margin — PE expects >70% for software`);

    if (calc.cacPayback > 0 && calc.cacPayback <= 18) strengths.push(`${Math.round(calc.cacPayback)} month CAC payback — quick return on acquisition spend`);
    else if (calc.cacPayback > 24) concerns.push(`${Math.round(calc.cacPayback)} month CAC payback — PE prefers under 18 months`);

    if (state.grossRetentionRate >= 90) strengths.push(`${state.grossRetentionRate}% gross retention — customers stick around`);
    else if (state.grossRetentionRate < 85) concerns.push(`${state.grossRetentionRate}% gross retention — losing too many customers`);

    return { strengths, concerns };
  }, [state, calc]);

  // ── CSV Export ──────────────────────────────────────

  const exportCSV = () => {
    const rows = [
      ['Revenue Quality Score Report', ''],
      ['Business Model', businessModelLabels[state.businessModel]],
      ['', ''],
      ['--- Revenue Profile ---', ''],
      ['Total Revenue', state.totalRevenue.toString()],
      ['Recurring Revenue', state.recurringRevenue.toString()],
      ['Recurring %', calc.recurringPct.toFixed(1) + '%'],
      ['Beginning ARR', state.beginningARR.toString()],
      ['+ New ARR', state.newARR.toString()],
      ['+ Expansion ARR', state.expansionARR.toString()],
      ['- Contraction ARR', state.contractionARR.toString()],
      ['- Churned ARR', state.churnedARR.toString()],
      ['= Ending ARR', calc.endingARR.toString()],
      ['', ''],
      ['--- Customer Economics ---', ''],
      ['Total Customers', state.totalCustomers.toString()],
      ['New Customers', state.newCustomers.toString()],
      ['S&M Spend', state.salesMarketingSpend.toString()],
      ['Gross Margin', state.grossMarginPercent + '%'],
      ['ARPU (Annual)', calc.arpu.toFixed(0)],
      ['CAC', calc.cac.toFixed(0)],
      ['LTV', calc.ltv.toFixed(0)],
      ['LTV:CAC', calc.ltvCac.toFixed(1) + 'x'],
      ['CAC Payback', Math.round(calc.cacPayback) + ' months'],
      ['', ''],
      ['--- Retention & Growth ---', ''],
      ['Gross Retention', state.grossRetentionRate + '%'],
      ['Net Retention (NDR)', state.netRetentionRate + '%'],
      ['Logo Churn Rate', state.logoChurnRate + '%'],
      ['Revenue Growth Rate', state.revenueGrowthRate + '%'],
      ['EBITDA Margin', state.ebitdaMargin + '%'],
      ['Rule of 40', calc.ruleOf40.toFixed(0)],
      ['Magic Number', calc.magicNumber.toFixed(2) + 'x'],
      ['', ''],
      ['--- Customer Concentration ---', ''],
      ['Top 1 Customer', state.top1CustomerPercent + '%'],
      ['Top 5 Customers', state.top5CustomersPercent + '%'],
      ['Top 10 Customers', state.top10CustomersPercent + '%'],
      ['Top 20 Customers', state.top20CustomersPercent + '%'],
      ['', ''],
      ['--- Revenue Quality Score ---', ''],
      ...scores.factors.map(f => [f.name, `${f.score}/5 (${f.value})`]),
      ['Overall Score', `${scores.overall.toFixed(1)}/5 — ${scoreLabel(scores.overall).text}`],
      ['', ''],
      ['--- Strengths ---', ''],
      ...insights.strengths.map((s, i) => [`${i + 1}`, s]),
      ['', ''],
      ['--- Concerns ---', ''],
      ...insights.concerns.map((c, i) => [`${i + 1}`, c]),
    ];

    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-quality-score-${state.businessModel}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Input Field Helper ──────────────────────────────

  const NumberField = ({ label, field, prefix = '', suffix = '', help }: {
    label: string; field: keyof RevenueQualityState; prefix?: string; suffix?: string; help?: string;
  }) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{prefix}</span>}
        <Input
          type="number"
          value={state[field] || ''}
          onChange={numChange(field)}
          className={`${prefix ? 'pl-7' : ''} ${suffix ? 'pr-8' : ''}`}
          placeholder="0"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{suffix}</span>}
      </div>
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );

  // ── Benchmark Card Helper ───────────────────────────

  const BenchmarkCard = ({ title, value, formatted, icon: Icon, bestInClass, good, concerning, invert = false, suffix = '' }: {
    title: string; value: number; formatted: string; icon: any; bestInClass: string; good: string; concerning: string; invert?: boolean; suffix?: string;
  }) => {
    const greenThreshold = parseFloat(bestInClass.replace(/[^0-9.-]/g, ''));
    const yellowThreshold = parseFloat(good.replace(/[^0-9.-]/g, ''));
    const color = colorForBenchmark(value, greenThreshold, yellowThreshold, invert);
    const bg = bgForBenchmark(value, greenThreshold, yellowThreshold, invert);

    return (
      <Card className={`border ${bg}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-sm font-medium">{title}</span>
            </div>
          </div>
          <p className={`text-2xl font-bold ${color}`}>{formatted}{suffix}</p>
          <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Best: {bestInClass}</div>
            <div className="flex items-center gap-1"><Percent className="h-3 w-3 text-yellow-400" /> Good: {good}</div>
            <div className="flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-red-400" /> Watch: {concerning}</div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ── ARR Bridge Bar ──────────────────────────────────

  const ARRBridge = () => {
    const items = [
      { label: 'Beginning ARR', value: state.beginningARR, type: 'base' as const },
      { label: '+ New', value: state.newARR, type: 'add' as const },
      { label: '+ Expansion', value: state.expansionARR, type: 'add' as const },
      { label: '- Contraction', value: state.contractionARR, type: 'subtract' as const },
      { label: '- Churn', value: state.churnedARR, type: 'subtract' as const },
      { label: 'Ending ARR', value: calc.endingARR, type: 'total' as const },
    ];

    const maxVal = Math.max(...items.map(i => Math.abs(i.value)), 1);

    return (
      <div className="space-y-3">
        {items.map((item, idx) => {
          const width = Math.max((Math.abs(item.value) / maxVal) * 100, 2);
          const barColor = item.type === 'base' ? 'bg-blue-500' :
            item.type === 'add' ? 'bg-emerald-500' :
            item.type === 'subtract' ? 'bg-red-500' : 'bg-blue-600';
          const textColor = item.type === 'add' ? 'text-emerald-400' :
            item.type === 'subtract' ? 'text-red-400' : 'text-blue-400';

          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-32 text-sm text-right shrink-0">{item.label}</div>
              <div className="flex-1 h-8 bg-muted/30 rounded relative">
                <div
                  className={`h-full rounded ${barColor} transition-all duration-500`}
                  style={{ width: `${width}%` }}
                />
              </div>
              <div className={`w-24 text-sm font-semibold text-right shrink-0 ${textColor}`}>
                {fmt(item.value)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ── Score Star Visual ───────────────────────────────

  const ScoreStars = ({ score }: { score: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`h-4 w-4 ${i <= score ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
      ))}
    </div>
  );

  // ── Has any data been entered ───────────────────────

  const hasData = state.totalRevenue > 0 || state.beginningARR > 0 || state.totalCustomers > 0;

  // ── RENDER ──────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Profile</TabsTrigger>
          <TabsTrigger value="customers">Customers & Retention</TabsTrigger>
          <TabsTrigger value="economics">Unit Economics</TabsTrigger>
          <TabsTrigger value="score">Quality Score</TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: REVENUE PROFILE ─────────────────── */}
        <TabsContent value="revenue" className="space-y-6">
          {/* Business Model */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Business Model
              </CardTitle>
              <CardDescription>What type of revenue model does your business have?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(businessModelLabels) as BusinessModel[]).map(model => (
                  <button
                    key={model}
                    onClick={() => update('businessModel', model)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      state.businessModel === model
                        ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                        : 'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    {businessModelLabels[model]}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Figures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                Revenue Figures (Annual)
              </CardTitle>
              <CardDescription>Enter your annual revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField label="Total Annual Revenue" field="totalRevenue" prefix="$" help="All revenue sources combined" />
                <NumberField label="Recurring Revenue" field="recurringRevenue" prefix="$" help="Subscription or contracted recurring portion" />
              </div>
              {state.totalRevenue > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Recurring Revenue %</span>
                    <span className={`text-lg font-bold ${calc.recurringPct >= 85 ? 'text-emerald-400' : calc.recurringPct >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {calc.recurringPct.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.min(calc.recurringPct, 100)} className="mt-2 h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* ARR Bridge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                ARR Bridge
              </CardTitle>
              <CardDescription>
                How did your Annual Recurring Revenue change over the past year? This shows the "walk" from beginning to ending ARR.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <NumberField label="Beginning ARR" field="beginningARR" prefix="$" help="ARR at start of period" />
                <NumberField label="New ARR" field="newARR" prefix="$" help="Revenue from brand new customers" />
                <NumberField label="Expansion ARR" field="expansionARR" prefix="$" help="Upsell & cross-sell from existing customers" />
                <NumberField label="Contraction ARR" field="contractionARR" prefix="$" help="Revenue lost from downgrades" />
                <NumberField label="Churned ARR" field="churnedARR" prefix="$" help="Revenue lost from cancelled customers" />
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Ending ARR (auto-calculated)</Label>
                  <div className={`p-2.5 rounded-md border bg-muted/50 text-lg font-bold ${calc.endingARR >= state.beginningARR ? 'text-emerald-400' : 'text-red-400'}`}>
                    {fmt(calc.endingARR)}
                  </div>
                  <p className="text-xs text-muted-foreground">Beginning + New + Expansion − Contraction − Churn</p>
                </div>
              </div>

              {state.beginningARR > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-4 text-muted-foreground">ARR Bridge Visualization</h4>
                  <ARRBridge />
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="text-center p-2 rounded bg-muted/30">
                      <p className="text-xs text-muted-foreground">Net New ARR</p>
                      <p className={`text-lg font-bold ${calc.netNewARR >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {calc.netNewARR >= 0 ? '+' : ''}{fmt(calc.netNewARR)}
                      </p>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/30">
                      <p className="text-xs text-muted-foreground">Expansion Rate</p>
                      <p className="text-lg font-bold text-blue-400">{calc.expansionRate.toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/30">
                      <p className="text-xs text-muted-foreground">Dollar Churn Rate</p>
                      <p className="text-lg font-bold text-orange-400">{calc.dollarChurnRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 2: CUSTOMERS & RETENTION ───────────── */}
        <TabsContent value="customers" className="space-y-6">
          {/* Customer Economics Inputs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Customer Economics
              </CardTitle>
              <CardDescription>How many customers do you have and what does it cost to acquire them?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField label="Total Customers" field="totalCustomers" help="Current active customer count" />
                <NumberField label="New Customers (this period)" field="newCustomers" help="Customers acquired in the last 12 months" />
                <NumberField label="Sales & Marketing Spend" field="salesMarketingSpend" prefix="$" help="Total S&M spend this period" />
                <NumberField label="Prior Period S&M Spend" field="priorPeriodSMSpend" prefix="$" help="S&M spend in the period before this (for Magic Number)" />
                <NumberField label="Gross Margin" field="grossMarginPercent" suffix="%" help="Revenue minus cost of goods sold, as a %" />
              </div>
            </CardContent>
          </Card>

          {/* Retention & Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-emerald-400" />
                Retention & Growth Rates
              </CardTitle>
              <CardDescription>How well do you retain and grow your customer base?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <NumberField label="Gross Retention Rate" field="grossRetentionRate" suffix="%" help="% of beginning ARR retained (excludes expansion)" />
                <NumberField label="Net Retention Rate (NDR)" field="netRetentionRate" suffix="%" help="% of beginning ARR retained including expansion" />
                <NumberField label="Logo Churn Rate (Annual)" field="logoChurnRate" suffix="%" help="% of customers lost per year" />
                <NumberField label="Revenue Growth Rate" field="revenueGrowthRate" suffix="%" help="Year-over-year revenue growth" />
                <NumberField label="EBITDA Margin" field="ebitdaMargin" suffix="%" help="EBITDA as a % of revenue" />
              </div>
              {state.netRetentionRate > 0 && state.grossRetentionRate > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-muted/30 text-sm">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Quick check:</strong> If NDR ({state.netRetentionRate}%) is much higher than gross retention ({state.grossRetentionRate}%),
                    it means expansion is masking churn. PE firms will look at both numbers.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Concentration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-orange-400" />
                Customer Concentration
              </CardTitle>
              <CardDescription>What percentage of your total revenue comes from your largest customers?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <NumberField label="Top 1 Customer" field="top1CustomerPercent" suffix="%" />
                <NumberField label="Top 5 Customers" field="top5CustomersPercent" suffix="%" />
                <NumberField label="Top 10 Customers" field="top10CustomersPercent" suffix="%" />
                <NumberField label="Top 20 Customers" field="top20CustomersPercent" suffix="%" />
              </div>
              {state.top1CustomerPercent > 20 && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-300">
                    A single customer at {state.top1CustomerPercent}% of revenue is a red flag for PE firms.
                    If that customer leaves, it could significantly impact your valuation.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 3: UNIT ECONOMICS DASHBOARD ────────── */}
        <TabsContent value="economics" className="space-y-6">
          {!hasData ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calculator className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Enter Your Data First</h3>
                <p className="text-muted-foreground">Fill in your revenue and customer data in the first two tabs to see your unit economics dashboard.</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab('revenue')}>
                  Go to Revenue Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Key SaaS Metrics */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  Key SaaS Metrics vs. Benchmarks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <BenchmarkCard
                    title="LTV:CAC Ratio"
                    value={calc.ltvCac}
                    formatted={mult(calc.ltvCac)}
                    icon={TrendingUp}
                    bestInClass=">5x"
                    good=">3x"
                    concerning="<2x"
                  />
                  <BenchmarkCard
                    title="Rule of 40"
                    value={calc.ruleOf40}
                    formatted={calc.ruleOf40.toFixed(0)}
                    icon={Zap}
                    bestInClass=">60"
                    good=">40"
                    concerning="<30"
                  />
                  <BenchmarkCard
                    title="Magic Number"
                    value={calc.magicNumber}
                    formatted={mult(calc.magicNumber)}
                    icon={Star}
                    bestInClass=">1.0x"
                    good=">0.75x"
                    concerning="<0.5x"
                  />
                  <BenchmarkCard
                    title="Net Dollar Retention"
                    value={state.netRetentionRate}
                    formatted={pct(state.netRetentionRate)}
                    icon={RefreshCw}
                    bestInClass=">120%"
                    good=">110%"
                    concerning="<100%"
                  />
                  <BenchmarkCard
                    title="Gross Retention"
                    value={state.grossRetentionRate}
                    formatted={pct(state.grossRetentionRate)}
                    icon={Shield}
                    bestInClass=">95%"
                    good=">90%"
                    concerning="<85%"
                  />
                  <BenchmarkCard
                    title="CAC Payback"
                    value={calc.cacPayback}
                    formatted={mo(calc.cacPayback)}
                    icon={Activity}
                    bestInClass="<12 mo"
                    good="<18 mo"
                    concerning=">24 mo"
                    invert={true}
                  />
                </div>
              </div>

              {/* Calculated Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-purple-400" />
                    Calculated Unit Economics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Annual ARPU', value: fmt(calc.arpu) },
                      { label: 'CAC', value: fmt(calc.cac) },
                      { label: 'LTV', value: fmt(calc.ltv) },
                      { label: 'Ending ARR', value: fmt(calc.endingARR) },
                      { label: 'Net New ARR', value: `${calc.netNewARR >= 0 ? '+' : ''}${fmt(calc.netNewARR)}` },
                      { label: 'Expansion Rate', value: pct(calc.expansionRate) },
                      { label: 'Dollar Churn', value: pct(calc.dollarChurnRate) },
                      { label: 'Recurring %', value: pct(calc.recurringPct) },
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/30 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className="text-lg font-bold">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ARR Bridge in Economics Tab */}
              {state.beginningARR > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-400" />
                      ARR Bridge
                    </CardTitle>
                    <CardDescription>Annual Recurring Revenue waterfall from beginning to ending ARR</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ARRBridge />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* ─── TAB 4: REVENUE QUALITY SCORE ───────────── */}
        <TabsContent value="score" className="space-y-6">
          {!hasData ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Enter Your Data First</h3>
                <p className="text-muted-foreground">Fill in your revenue and customer data to generate your Revenue Quality Score.</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab('revenue')}>
                  Go to Revenue Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Overall Score */}
              <Card className={`border-2 ${scoreLabel(scores.overall).bg}`}>
                <CardContent className="py-8 text-center">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Overall Revenue Quality Score
                  </h3>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className={`text-6xl font-bold ${scoreLabel(scores.overall).color}`}>
                      {scores.overall.toFixed(1)}
                    </span>
                    <span className="text-2xl text-muted-foreground">/ 5</span>
                  </div>
                  <Badge className={`${scoreLabel(scores.overall).bg} ${scoreLabel(scores.overall).color} text-sm px-3 py-1`}>
                    {scoreLabel(scores.overall).text}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-3">
                    Based on 6 factors that PE firms evaluate when assessing revenue quality
                  </p>
                </CardContent>
              </Card>

              {/* 6 Factors */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Scoring Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scores.factors.map((factor, idx) => {
                    const label = scoreLabel(factor.score);
                    return (
                      <Card key={idx} className={`border ${label.bg}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <factor.icon className={`h-5 w-5 ${label.color}`} />
                            <span className="font-semibold text-sm">{factor.name}</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <ScoreStars score={factor.score} />
                            <span className={`text-lg font-bold ${label.color}`}>{factor.score}/5</span>
                          </div>
                          <p className="text-sm">{factor.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">Benchmark: {factor.benchmark}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Concerns */}
              {(insights.strengths.length > 0 || insights.concerns.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {insights.strengths.length > 0 && (
                    <Card className="border border-emerald-500/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="h-5 w-5" />
                          Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {insights.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <ArrowUp className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  {insights.concerns.length > 0 && (
                    <Card className="border border-red-500/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-400">
                          <AlertTriangle className="h-5 w-5" />
                          Concerns
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {insights.concerns.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <ArrowDown className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* PE Perspective */}
              <Card className="border border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Eye className="h-5 w-5" />
                    What PE Firms Will Think
                  </CardTitle>
                  <CardDescription>How a private equity buyer would read your revenue quality</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {scores.overall >= 4 && (
                    <p>
                      <strong className="text-emerald-400">Premium asset.</strong> Your revenue quality metrics suggest a business
                      with predictable, growing, and well-diversified revenue. PE firms would likely apply a premium multiple
                      and move quickly. Expect strong interest from both growth equity and buyout sponsors.
                    </p>
                  )}
                  {scores.overall >= 3 && scores.overall < 4 && (
                    <p>
                      <strong className="text-yellow-400">Solid foundation with room to improve.</strong> Your metrics are
                      competitive but a few areas could hold back your valuation. PE firms will dig into the weaker factors
                      during due diligence. Addressing the concerns above before going to market could meaningfully increase your multiple.
                    </p>
                  )}
                  {scores.overall >= 2 && scores.overall < 3 && (
                    <p>
                      <strong className="text-orange-400">Work to do before exit.</strong> Several revenue quality factors
                      are below PE benchmarks. Buyers will see the potential but will discount their offer to account for risk.
                      Consider spending 12-18 months improving retention and reducing concentration before engaging with PE firms.
                    </p>
                  )}
                  {scores.overall < 2 && (
                    <p>
                      <strong className="text-red-400">Not PE-ready yet.</strong> Multiple revenue quality factors are in
                      concerning territory. Most PE firms would pass at this stage. Focus on building a stronger recurring
                      revenue base, improving retention, and diversifying your customer base before approaching buyers.
                    </p>
                  )}

                  <div className="pt-3 border-t border-border/50">
                    <p className="text-muted-foreground">
                      <strong>Remember:</strong> NDR above 100% can mask high gross churn if expansion is strong enough — PE firms
                      will look at both numbers. They'll also differentiate between contracted ARR and recognized revenue,
                      and evaluate professional services revenue separately from recurring software revenue.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Export */}
              <div className="flex justify-end">
                <Button variant="outline" onClick={exportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Full Report (CSV)
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueQuality;
