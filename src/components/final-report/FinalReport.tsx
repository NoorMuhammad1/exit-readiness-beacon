
'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Download,
  Printer,
  Share2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Skull,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  Target,
  Clock,
  Building2,
  Sparkles,
  AlertCircle,
  Briefcase,
  BarChart3,
  Zap,
  ChevronRight,
  Info,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────

interface MemoData {
  companyName: string;
  ownerName: string;
  currentRevenue: number;
  reportedEBITDA: number;
  adjustedEBITDA: number;
  industryMultiple: number;
  enterpriseValue: number;
  targetEV: number;
  ebitdaMargin: number;
  addBacks: number;
  overallReadiness: number;
  financialReadiness: number;
  operationalReadiness: number;
  managementReadiness: number;
  dealKillers: { fatal: number; critical: number; major: number; resolved: number };
  ddReadiness: number;
  survivingExecutives: number;
  atRiskExecutives: number;
  keyHires: string[];
  recommendation: 'PROCEED' | 'CONDITIONAL' | 'PASS';
  estimatedTimeToReady: number;
}

// ─── Helpers ──────────────────────────────────────────────────

const fmt = (n: number): string => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

const pct = (n: number): string => `${n.toFixed(1)}%`;

const recColor = (r: string) =>
  r === 'PROCEED' ? 'text-emerald-400' : r === 'CONDITIONAL' ? 'text-yellow-400' : 'text-red-400';

const recBg = (r: string) =>
  r === 'PROCEED'
    ? 'bg-emerald-950/30 border-emerald-500/30'
    : r === 'CONDITIONAL'
    ? 'bg-yellow-950/30 border-yellow-500/30'
    : 'bg-red-950/30 border-red-500/30';

const scoreColor = (s: number) =>
  s >= 70 ? 'text-emerald-400' : s >= 50 ? 'text-yellow-400' : 'text-red-400';

// ─── Section Wrapper ──────────────────────────────────────────

const Section: React.FC<{
  num: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ num, title, icon, children }) => (
  <div id={`section-${num}`} className="scroll-mt-4">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
        {num}
      </div>
      {icon}
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
    <Card className="p-6 bg-zinc-900/80 border-zinc-800">{children}</Card>
  </div>
);

// ─── Module Link Placeholder ──────────────────────────────────

const ModuleLink: React.FC<{ text: string; href: string; label: string }> = ({ text, href, label }) => (
  <div className="bg-zinc-800/50 rounded-lg p-4 border border-dashed border-zinc-700">
    <div className="flex items-start gap-3">
      <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{text}</p>
        <Button
          variant="link"
          className="text-primary p-0 h-auto mt-1"
          onClick={() => (window.location.href = href)}
        >
          {label} <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────

export const FinalReport: React.FC = () => {
  const [data, setData] = useState<MemoData | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    const ebitdaData = JSON.parse(localStorage.getItem('ebitda-calculator') || '{}');
    const dealKillers = JSON.parse(localStorage.getItem('deal-killers') || '{}');
    const managementScore = JSON.parse(localStorage.getItem('management-scorecard') || '{}');
    const businessScore = JSON.parse(localStorage.getItem('business-scorecard') || '{}');
    const ddChecklist = JSON.parse(localStorage.getItem('dd-checklist') || '[]');

    const revenue = parseFloat(localStorage.getItem('current-revenue') || '0') || 10_000_000;
    const multiple = parseFloat(localStorage.getItem('industry-multiple') || '5');
    const reported = ebitdaData.reported || 2_000_000;
    const adjusted = ebitdaData.adjusted || 2_500_000;
    const ev = reported * multiple;
    const targetEV = adjusted * (multiple + 0.5);
    const margin = revenue > 0 ? (reported / revenue) * 100 : 0;

    const ddItems = ddChecklist.length || 30;
    const ddReady = ddChecklist.filter((i: any) => i.status === 'ready').length || 0;
    const ddReadiness = (ddReady / ddItems) * 100;

    const fatal = dealKillers.fatal || 0;
    const critical = dealKillers.critical || 0;
    let readiness = 100;
    readiness -= fatal * 20;
    readiness -= critical * 10;
    if (ddReadiness < 50) readiness -= 20;
    readiness = Math.max(0, readiness);

    const recommendation: MemoData['recommendation'] =
      readiness >= 80 ? 'PROCEED' : readiness >= 60 ? 'CONDITIONAL' : 'PASS';

    setData({
      companyName: localStorage.getItem('company-name') || 'Your Company',
      ownerName: localStorage.getItem('owner-name') || 'Business Owner',
      currentRevenue: revenue,
      reportedEBITDA: reported,
      adjustedEBITDA: adjusted,
      industryMultiple: multiple,
      enterpriseValue: ev,
      targetEV,
      ebitdaMargin: margin,
      addBacks: adjusted - reported,
      overallReadiness: readiness,
      financialReadiness: ebitdaData.adjusted ? 75 : 25,
      operationalReadiness: businessScore.operational || 60,
      managementReadiness: managementScore.overall || 50,
      dealKillers: { fatal, critical, major: dealKillers.major || 0, resolved: dealKillers.resolved || 0 },
      ddReadiness,
      survivingExecutives: managementScore.survivors || 3,
      atRiskExecutives: managementScore.atRisk || 2,
      keyHires: ['CFO', 'VP Sales', 'VP Operations'].slice(0, managementScore.atRisk || 2),
      recommendation,
      estimatedTimeToReady: fatal > 0 ? 12 : critical > 2 ? 6 : 3,
    });
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Assembling IC Memo...</p>
        </div>
      </div>
    );
  }

  // ─── Investment thesis pillars (derived from data) ──────────

  const pillars: { title: string; detail: string }[] = [];
  if (data.ebitdaMargin >= 15)
    pillars.push({
      title: 'Healthy Margin Profile',
      detail: `${pct(data.ebitdaMargin)} EBITDA margin provides cushion for value creation and debt service.`,
    });
  if (data.addBacks > 0)
    pillars.push({
      title: 'EBITDA Normalization Upside',
      detail: `${fmt(data.addBacks)} in identified add-backs moves adjusted EBITDA to ${fmt(data.adjustedEBITDA)}.`,
    });
  if (data.managementReadiness >= 60)
    pillars.push({
      title: 'Management Continuity',
      detail: `${data.survivingExecutives} executives assessed as PE-ready. Leadership bench supports post-close execution.`,
    });
  if (data.dealKillers.fatal === 0)
    pillars.push({
      title: 'Clean Risk Profile',
      detail: 'No fatal deal killers identified. Risk factors are manageable with standard PE operating playbook.',
    });
  if (data.currentRevenue >= 5_000_000)
    pillars.push({
      title: 'Scale for Institutional Capital',
      detail: `${fmt(data.currentRevenue)} revenue base is within range for lower middle-market PE interest.`,
    });
  if (pillars.length === 0)
    pillars.push({
      title: 'Potential for Operational Improvement',
      detail: 'Assessment identified meaningful areas for value creation through operational enhancement.',
    });

  // ─── Risk factors (derived from data) ───────────────────────

  const risks: { severity: string; risk: string; detail: string; mitigant: string; color: string; bg: string }[] = [];
  if (data.dealKillers.fatal > 0)
    risks.push({
      severity: 'FATAL',
      risk: 'Fatal deal killers identified',
      detail: `${data.dealKillers.fatal} issue(s) that will terminate any PE process. Must be resolved before going to market.`,
      mitigant: 'Engage M&A counsel immediately. Some fatal issues (e.g., unresolved litigation) may take 6-12 months.',
      color: 'text-red-400',
      bg: 'bg-red-950/20 border-red-900/50',
    });
  if (data.dealKillers.critical > 0)
    risks.push({
      severity: 'HIGH',
      risk: 'Critical issues requiring attention',
      detail: `${data.dealKillers.critical} critical issue(s) that will significantly impact valuation or deal certainty.`,
      mitigant: 'Address within 90 days. These reduce buyer confidence and justify lower multiples.',
      color: 'text-orange-400',
      bg: 'bg-orange-950/20 border-orange-900/50',
    });
  if (data.ddReadiness < 50)
    risks.push({
      severity: 'HIGH',
      risk: 'Due diligence preparation incomplete',
      detail: `Only ${pct(data.ddReadiness)} of DD documents are ready. Buyers will perceive operational risk.`,
      mitigant: 'Prioritize financial, legal, and HR document packages. Engage QoE firm early.',
      color: 'text-orange-400',
      bg: 'bg-orange-950/20 border-orange-900/50',
    });
  if (data.managementReadiness < 50)
    risks.push({
      severity: 'MEDIUM',
      risk: 'Management team gaps',
      detail: `${data.atRiskExecutives} executive(s) at risk of not surviving PE transition. Key hires may be needed.`,
      mitigant: 'Begin confidential recruitment for critical roles. Consider retention packages for key talent.',
      color: 'text-yellow-400',
      bg: 'bg-yellow-950/20 border-yellow-900/50',
    });
  if (data.ebitdaMargin < 15)
    risks.push({
      severity: 'MEDIUM',
      risk: 'Below-market EBITDA margins',
      detail: `${pct(data.ebitdaMargin)} margin is below the 15-20% threshold PE firms prefer.`,
      mitigant: 'Identify margin expansion levers: pricing, vendor renegotiation, operational efficiency.',
      color: 'text-yellow-400',
      bg: 'bg-yellow-950/20 border-yellow-900/50',
    });
  if (risks.length === 0)
    risks.push({
      severity: 'LOW',
      risk: 'Standard integration execution risk',
      detail: 'All PE transactions carry inherent execution risk during the first 100 days post-close.',
      mitigant: 'Detailed 100-day plan and strong management continuity mitigate this risk.',
      color: 'text-white',
      bg: 'bg-white/5 border-blue-900/50',
    });

  // ─── Returns estimate ───────────────────────────────────────

  const holdYears = 5;
  const growthRate = 0.05;
  const exitMultiple = data.industryMultiple + 0.5;
  const entryEquity = data.enterpriseValue * 0.5;
  const exitEBITDA = data.adjustedEBITDA * Math.pow(1 + growthRate, holdYears);
  const exitEV = exitEBITDA * exitMultiple;
  const exitEquity = exitEV - data.enterpriseValue * 0.5 * 0.7;
  const moic = entryEquity > 0 ? exitEquity / entryEquity : 0;
  const irr = entryEquity > 0 ? (Math.pow(moic, 1 / holdYears) - 1) * 100 : 0;

  // ─── Next steps ─────────────────────────────────────────────

  const nextSteps: string[] = [];
  if (data.dealKillers.fatal > 0) nextSteps.push('Resolve all fatal deal killers before approaching market');
  if (data.ddReadiness < 50) nextSteps.push('Achieve 80%+ DD readiness — prioritize financial and legal packages');
  if (data.atRiskExecutives > 0) nextSteps.push('Address management gaps — begin confidential recruitment');
  nextSteps.push('Engage Quality of Earnings (QoE) firm for independent financial validation');
  nextSteps.push('Retain M&A counsel and investment banker');
  if (data.recommendation === 'PROCEED') nextSteps.push('Prepare for market — target go-live in 90 days');

  // ─── Table of contents ──────────────────────────────────────

  const toc = [
    { num: 'I', title: 'Executive Summary' },
    { num: 'II', title: 'Company Overview' },
    { num: 'III', title: 'Industry & Market' },
    { num: 'IV', title: 'Financial Analysis' },
    { num: 'V', title: 'Investment Thesis' },
    { num: 'VI', title: 'Deal Terms & Structure' },
    { num: 'VII', title: 'Returns Analysis' },
    { num: 'VIII', title: 'Risk Factors' },
    { num: 'IX', title: 'Recommendation' },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* ─── Header ──────────────────────────────────────────── */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Badge className="bg-red-900/30 text-red-400 border-red-500/30 text-xs tracking-widest">
            CONFIDENTIAL
          </Badge>
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
            <Sparkles className="w-3 h-3 mr-1" /> ENHANCED
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Investment Committee Memorandum
        </h1>
        <div className="text-muted-foreground space-y-1">
          <p className="text-lg">{data.companyName}</p>
          <p className="text-sm">
            Prepared for: {data.ownerName} —{' '}
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Alert className="bg-white/5 border-white/15 max-w-lg mx-auto">
          <Info className="h-4 w-4 text-white" />
          <AlertDescription className="text-blue-300 text-sm">
            <strong>Educational Document.</strong> This mock IC memo shows how PE firms evaluate your
            company using data from your PE Ready assessment.
          </AlertDescription>
        </Alert>
      </div>

      {/* ─── Table of Contents ───────────────────────────────── */}
      <Card className="p-4 bg-zinc-900/50 border-zinc-800">
        <div className="grid grid-cols-3 gap-2">
          {toc.map((s) => (
            <button
              key={s.num}
              onClick={() =>
                document.getElementById(`section-${s.num}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              className="text-left text-sm text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-zinc-800"
            >
              <span className="font-mono text-primary/60 mr-2">{s.num}.</span>
              {s.title}
            </button>
          ))}
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* I. EXECUTIVE SUMMARY                                   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Section num="I" title="Executive Summary" icon={<FileText className="w-5 h-5 text-primary" />}>
        {/* Recommendation banner */}
        <div className={`p-4 rounded-lg border mb-6 ${recBg(data.recommendation)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">IC Recommendation</p>
              <p className={`text-2xl font-bold ${recColor(data.recommendation)}`}>
                {data.recommendation === 'PROCEED'
                  ? 'Proceed to LOI'
                  : data.recommendation === 'CONDITIONAL'
                  ? 'Conditional Proceed'
                  : `Pass — Revisit in ${data.estimatedTimeToReady} Months`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Readiness Score</p>
              <p className={`text-4xl font-bold ${recColor(data.recommendation)}`}>{data.overallReadiness}%</p>
            </div>
          </div>
        </div>

        {/* Overview paragraph */}
        <p className="text-zinc-300 leading-relaxed mb-6">
          {data.companyName} is a lower middle-market company generating {fmt(data.currentRevenue)} in annual
          revenue with {fmt(data.reportedEBITDA)} reported EBITDA ({pct(data.ebitdaMargin)} margin). After
          normalization adjustments of {fmt(data.addBacks)}, adjusted EBITDA stands at{' '}
          {fmt(data.adjustedEBITDA)}. At the current industry multiple of {data.industryMultiple.toFixed(1)}x,
          implied enterprise value is {fmt(data.enterpriseValue)}.
        </p>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Revenue', value: fmt(data.currentRevenue), icon: <TrendingUp className="w-4 h-4 text-white" /> },
            { label: 'Adj. EBITDA', value: fmt(data.adjustedEBITDA), icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
            { label: 'Enterprise Value', value: fmt(data.enterpriseValue), icon: <Building2 className="w-4 h-4 text-purple-400" /> },
            { label: 'Critical Issues', value: `${data.dealKillers.fatal + data.dealKillers.critical}`, icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
          ].map((m, i) => (
            <div key={i} className="bg-zinc-800/50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">{m.icon}</div>
              <p className="text-lg font-bold text-white">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* II. COMPANY OVERVIEW                                   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Section num="II" title="Company Overview" icon={<Building2 className="w-5 h-5 text-primary" />}>
        <div className="space-y-6">
          {/* Snapshot grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Company</p>
                <p className="text-white font-semibold">{data.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Annual Revenue</p>
                <p className="text-white font-semibold">{fmt(data.currentRevenue)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">EBITDA Margin</p>
                <p className="text-white font-semibold">{pct(data.ebitdaMargin)}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Owner / CEO</p>
                <p className="text-white font-semibold">{data.ownerName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Implied Valuation</p>
                <p className="text-white font-semibold">{fmt(data.enterpriseValue)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Industry Multiple</p>
                <p className="text-white font-semibold">{data.industryMultiple.toFixed(1)}x EBITDA</p>
              </div>
            </div>
          </div>

          {/* Management team */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Management Team Assessment
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-emerald-400">{data.survivingExecutives}</p>
                <p className="text-xs text-muted-foreground">PE-Ready</p>
              </div>
              <div className="bg-yellow-950/20 border border-yellow-900/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-400">{data.atRiskExecutives}</p>
                <p className="text-xs text-muted-foreground">At Risk</p>
              </div>
              <div className="bg-white/5 border border-blue-900/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{data.keyHires.length}</p>
                <p className="text-xs text-muted-foreground">Hires Needed</p>
              </div>
            </div>
            {data.keyHires.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Key hires recommended: {data.keyHires.join(', ')}
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* III. INDUSTRY & MARKET                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Section num="III" title="Industry & Market" icon={<BarChart3 className="w-5 h-5 text-primary" />}>
        <div className="space-y-4">
          <p className="text-zinc-300 leading-relaxed">
            A thorough industry analysis covers market size (TAM/SAM/SOM), competitive dynamics, secular
            tailwinds, and regulatory environment. PE firms use this section to assess whether the company
            operates in an attractive market with durable growth characteristics.
          </p>
          <ModuleLink
            text="The Competitive Analysis module (Week 3) generates TAM/SAM/SOM market sizing, Porter's Five Forces analysis, and competitive positioning maps — all of which would appear here in a real IC memo."
            href="/portal/week-3/competitive-analysis"
            label="Go to Competitive Analysis"
          />
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* IV. FINANCIAL ANALYSIS                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Section num="IV" title="Financial Analysis" icon={<DollarSign className="w-5 h-5 text-primary" />}>
        <div className="space-y-6">
          {/* EBITDA Bridge table */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">EBITDA Bridge</h3>
            <div className="bg-zinc-800/50 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-zinc-700">
                    <td className="px-4 py-3 text-zinc-300">Revenue</td>
                    <td className="px-4 py-3 text-right text-white font-semibold">{fmt(data.currentRevenue)}</td>
                  </tr>
                  <tr className="border-b border-zinc-700">
                    <td className="px-4 py-3 text-zinc-300">Reported EBITDA</td>
                    <td className="px-4 py-3 text-right text-white font-semibold">{fmt(data.reportedEBITDA)}</td>
                  </tr>
                  <tr className="border-b border-zinc-700">
                    <td className="px-4 py-3 text-emerald-400">(+) Add-Backs &amp; Adjustments</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-semibold">
                      +{fmt(data.addBacks)}
                    </td>
                  </tr>
                  <tr className="bg-zinc-700/30 border-b border-zinc-700">
                    <td className="px-4 py-3 text-white font-bold">Adjusted EBITDA</td>
                    <td className="px-4 py-3 text-right text-white font-bold">{fmt(data.adjustedEBITDA)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-400">EBITDA Margin</td>
                    <td className="px-4 py-3 text-right text-zinc-300">{pct(data.ebitdaMargin)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Readiness bars */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Readiness by Category</h3>
            <div className="space-y-3">
              {[
                { name: 'Financial', score: data.financialReadiness },
                { name: 'Operational', score: data.operationalReadiness },
                { name: 'Management', score: data.managementReadiness },
              ].map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-zinc-300">{cat.name}</span>
                    <span className={`text-sm font-bold ${scoreColor(cat.score)}`}>{cat.score}%</span>
                  </div>
                  <Progress value={cat.score} className="h-2 bg-zinc-800" />
                </div>
              ))}
            </div>
          </div>

          {/* DD readiness */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-zinc-300">Due Diligence Document Readiness</span>
              <span className={`text-sm font-bold ${scoreColor(data.ddReadiness)}`}>{pct(data.ddReadiness)}</span>
            </div>
            <Progress value={data.ddReadiness} className="h-2 bg-zinc-800" />
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* V. INVESTMENT THESIS                                   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Section num="V" title="Investment Thesis" icon={<Target className="w-5 h-5 text-primary" />}>
        <div className="space-y-4">
          <p className="text-zinc-300 leading-relaxed mb-2">
            Based on the assessment data, the following investment pillars have been identified:
          </p>
          <div className="space-y-3">
            {pillars.map((p, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-bold">{i + 1}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{p.title}</p>
                  <p className="text-sm text-zinc-400">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <ModuleLink
            text="The PE Screening Scorecard (Week 3) provides a detailed 10-criterion institutional screening against real PE investment criteria — Pass, Caution, or Fail per criterion."
            href="/portal/week-3/pe-screening"
            label="Go to PE Screening Scorecard"
          />
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* VI. DEAL TERMS & STRUCTURE                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Section num="VI" title="Deal Terms & Structure" icon={<Briefcase className="w-5 h-5 text-primary" />}>
        <div className="space-y-6">
          {/* Valuation table */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Implied Valuation</h3>
            <div className="bg-zinc-800/50 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-zinc-700">
                    <td className="px-4 py-3 text-zinc-300">Adjusted EBITDA</td>
                    <td className="px-4 py-3 text-right text-white font-semibold">{fmt(data.adjustedEBITDA)}</td>
                  </tr>
                  <tr className="border-b border-zinc-700">
                    <td className="px-4 py-3 text-zinc-300">Industry Multiple</td>
                    <td className="px-4 py-3 text-right text-white font-semibold">
                      {data.industryMultiple.toFixed(1)}x
                    </td>
                  </tr>
                  <tr className="bg-zinc-700/30 border-b border-zinc-700">
                    <td className="px-4 py-3 text-white font-bold">Enterprise Value (Reported)</td>
                    <td className="px-4 py-3 text-right text-white font-bold">{fmt(data.enterpriseValue)}</td>
                  </tr>
                  <tr className="bg-emerald-950/20">
                    <td className="px-4 py-3 text-emerald-400 font-bold">Enterprise Value (Adjusted)</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-bold">{fmt(data.targetEV)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sources & Uses */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Illustrative Sources &amp; Uses</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 rounded-lg overflow-hidden">
                <div className="bg-zinc-700/50 px-4 py-2">
                  <p className="text-xs font-semibold text-white tracking-wider">SOURCES</p>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-zinc-700">
                      <td className="px-4 py-2 text-zinc-300">Senior Debt</td>
                      <td className="px-4 py-2 text-right text-white">{fmt(data.enterpriseValue * 0.5)}</td>
                    </tr>
                    <tr className="border-b border-zinc-700">
                      <td className="px-4 py-2 text-zinc-300">Equity</td>
                      <td className="px-4 py-2 text-right text-white">{fmt(data.enterpriseValue * 0.4)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-zinc-300">Seller Rollover</td>
                      <td className="px-4 py-2 text-right text-white">{fmt(data.enterpriseValue * 0.1)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-zinc-800/50 rounded-lg overflow-hidden">
                <div className="bg-zinc-700/50 px-4 py-2">
                  <p className="text-xs font-semibold text-white tracking-wider">USES</p>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-zinc-700">
                      <td className="px-4 py-2 text-zinc-300">Purchase Price</td>
                      <td className="px-4 py-2 text-right text-white">{fmt(data.enterpriseValue * 0.93)}</td>
                    </tr>
                    <tr className="border-b border-zinc-700">
                      <td className="px-4 py-2 text-zinc-300">Transaction Fees</td>
                      <td className="px-4 py-2 text-right text-white">{fmt(data.enterpriseValue * 0.05)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-zinc-300">Working Capital</td>
                      <td className="px-4 py-2 text-right text-white">{fmt(data.enterpriseValue * 0.02)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Illustrative only. Actual capital structure depends on debt market conditions, company quality,
              and negotiated terms.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* VII. RETURNS ANALYSIS                                  */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Section num="VII" title="Returns Analysis" icon={<TrendingUp className="w-5 h-5 text-primary" />}>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Base Case Returns (5-Year Hold)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Entry Multiple', value: `${data.industryMultiple.toFixed(1)}x`, highlight: false },
                { label: 'Exit Multiple', value: `${exitMultiple.toFixed(1)}x`, highlight: false },
                { label: 'IRR', value: `${irr.toFixed(1)}%`, highlight: irr >= 20 },
                { label: 'MOIC', value: `${moic.toFixed(2)}x`, highlight: moic >= 2.5 },
              ].map((m, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-3 text-center ${
                    m.highlight ? 'bg-emerald-950/20 border border-emerald-900/50' : 'bg-zinc-800/50'
                  }`}
                >
                  <p className={`text-xl font-bold ${m.highlight ? 'text-emerald-400' : 'text-white'}`}>
                    {m.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Assumptions table */}
            <div className="bg-zinc-800/50 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-700/50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-400">Assumption</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-zinc-400">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Entry EBITDA', fmt(data.adjustedEBITDA)],
                    ['Annual Growth Rate', '5.0%'],
                    ['Exit EBITDA (Year 5)', fmt(exitEBITDA)],
                    ['Leverage (Debt / EV)', '50%'],
                    ['Debt Paydown (over hold)', '30%'],
                    ['Hold Period', '5 years'],
                  ].map(([label, value], i) => (
                    <tr key={i} className="border-b border-zinc-700 last:border-0">
                      <td className="px-4 py-2 text-zinc-300">{label}</td>
                      <td className="px-4 py-2 text-right text-white">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ModuleLink
            text="The Returns Sensitivity module (Week 3) provides Bull/Base/Bear scenario comparison, 2-way sensitivity tables, and detailed returns attribution — showing exactly how much value comes from growth vs. multiple expansion vs. debt paydown."
            href="/portal/week-3/returns-sensitivity"
            label="Go to Returns Sensitivity"
          />
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* VIII. RISK FACTORS                                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Section num="VIII" title="Risk Factors" icon={<Shield className="w-5 h-5 text-primary" />}>
        <div className="space-y-4">
          {/* Deal killer summary counters */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Fatal', count: data.dealKillers.fatal, color: 'text-red-400', bg: 'bg-red-950/20 border-red-900/50', Icon: Skull },
              { label: 'Critical', count: data.dealKillers.critical, color: 'text-orange-400', bg: 'bg-orange-950/20 border-orange-900/50', Icon: AlertTriangle },
              { label: 'Major', count: data.dealKillers.major, color: 'text-yellow-400', bg: 'bg-yellow-950/20 border-yellow-900/50', Icon: AlertCircle },
              { label: 'Resolved', count: data.dealKillers.resolved, color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-900/50', Icon: CheckCircle2 },
            ].map((dk, i) => (
              <div key={i} className={`rounded-lg p-3 text-center border ${dk.bg}`}>
                <dk.Icon className={`w-5 h-5 mx-auto mb-1 ${dk.color}`} />
                <p className={`text-xl font-bold ${dk.color}`}>{dk.count}</p>
                <p className="text-xs text-muted-foreground">{dk.label}</p>
              </div>
            ))}
          </div>

          {/* Risk details with mitigants */}
          <div className="space-y-3">
            {risks.map((risk, i) => (
              <div key={i} className={`rounded-lg p-4 border ${risk.bg}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    className={`text-xs ${
                      risk.severity === 'FATAL'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : risk.severity === 'HIGH'
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                        : risk.severity === 'MEDIUM'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        : 'bg-white/10 text-white border-white/15'
                    }`}
                  >
                    {risk.severity}
                  </Badge>
                  <span className="text-white font-semibold">{risk.risk}</span>
                </div>
                <p className="text-sm text-zinc-400 mb-2">{risk.detail}</p>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-zinc-300">
                    <strong className="text-primary">Mitigant:</strong> {risk.mitigant}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* IX. RECOMMENDATION                                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Section num="IX" title="Recommendation" icon={<CheckCircle2 className="w-5 h-5 text-primary" />}>
        <div className="space-y-6">
          {/* Verdict */}
          <div className={`p-6 rounded-lg border text-center ${recBg(data.recommendation)}`}>
            <p className="text-sm text-muted-foreground mb-2">Investment Committee Verdict</p>
            <p className={`text-3xl font-bold mb-2 ${recColor(data.recommendation)}`}>
              {data.recommendation === 'PROCEED'
                ? 'PROCEED TO LOI'
                : data.recommendation === 'CONDITIONAL'
                ? 'CONDITIONAL PROCEED'
                : 'PASS'}
            </p>
            <p className="text-zinc-400">
              {data.recommendation === 'PROCEED'
                ? 'Company meets institutional investment criteria. Recommend advancing to Letter of Intent.'
                : data.recommendation === 'CONDITIONAL'
                ? `Company shows promise but requires ${data.estimatedTimeToReady} months of preparation. Revisit after addressing key issues.`
                : `Company is not PE-ready. Estimated ${data.estimatedTimeToReady} months of remediation before re-evaluation.`}
            </p>
          </div>

          {/* Next steps */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Required Next Steps
            </h3>
            <div className="space-y-2">
              {nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-primary font-bold">{i + 1}</span>
                  </div>
                  <p className="text-zinc-300 text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Professional support */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Professional Support Required</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { role: 'M&A Attorney', urgency: 'Immediate', cost: '$25-50K' },
                { role: 'Investment Banker', urgency: '30 days', cost: '3-5% of deal' },
                { role: 'QoE Firm', urgency: 'Immediate', cost: '$50-100K' },
                { role: 'Tax Advisor', urgency: '30 days', cost: '$10-25K' },
              ].map((pro, i) => (
                <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-white">{pro.role}</p>
                  <div className="flex justify-between mt-1">
                    <Badge
                      className={`text-xs ${
                        pro.urgency === 'Immediate'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {pro.urgency}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{pro.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Export Buttons ──────────────────────────────────── */}
      <Card className="p-6 bg-zinc-900/80 border-zinc-800">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Export This Memo</h3>
            <p className="text-sm text-muted-foreground">Share with your advisors and deal team</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
            <Button
              variant="outline"
              className="border-zinc-700 hover:bg-zinc-800"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
            >
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setGeneratingPDF(true);
                setTimeout(() => {
                  setGeneratingPDF(false);
                  alert('PDF Downloaded! (In production, this would generate a real PDF)');
                }, 2000);
              }}
              disabled={generatingPDF}
            >
              {generatingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* ─── Educational Footer ──────────────────────────────── */}
      <Alert className="bg-primary/5 border-primary/30">
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <span className="font-semibold">What this means:</span> You've just seen your company through the
          eyes of a PE investment committee. In a real deal, this memo would be 15-30 pages with full
          financial models attached. The sections that showed placeholder content tell you where your
          preparation has gaps — go complete those modules to build a stronger story for buyers.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FinalReport;
