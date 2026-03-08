
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp, DollarSign, Plus, Trash2, ChevronDown, ChevronUp,
  Target, Clock, BarChart3, Users, CheckCircle2, AlertTriangle,
  Zap, ArrowRight, Download
} from "lucide-react";

// ─── TYPES ─────────────────────────────────────────────────────────

type LeverCategory = 'revenue' | 'margin' | 'strategic';
type Confidence = 'high' | 'medium' | 'low';
type KPIFrequency = 'weekly' | 'monthly' | 'quarterly';
type ActionPriority = 'high' | 'medium' | 'low';

interface ValueCreationLever {
  id: string;
  category: LeverCategory;
  name: string;
  description: string;
  currentState: string;
  targetState: string;
  yearlyImpact: [number, number, number, number, number];
  investmentRequired: number;
  confidence: Confidence;
}

interface ActionItem {
  id: string;
  action: string;
  owner: string;
  priority: ActionPriority;
  completed: boolean;
}

interface KPIItem {
  id: string;
  name: string;
  current: string;
  target: string;
  owner: string;
  frequency: KPIFrequency;
}

interface ValueCreationState {
  currentRevenue: number;
  currentEBITDA: number;
  levers: ValueCreationLever[];
  phase1: ActionItem[];
  phase2: ActionItem[];
  phase3: ActionItem[];
  kpis: KPIItem[];
}

// ─── CONSTANTS ─────────────────────────────────────────────────────

const STORAGE_KEY = 'value-creation-plan-v1';

const categoryLabels: Record<LeverCategory, string> = {
  revenue: 'Revenue Growth',
  margin: 'Margin Expansion',
  strategic: 'Strategic / Multiple Expansion',
};

const categoryColors: Record<LeverCategory, string> = {
  revenue: 'bg-blue-100 text-blue-800 border-blue-200',
  margin: 'bg-green-100 text-green-800 border-green-200',
  strategic: 'bg-purple-100 text-purple-800 border-purple-200',
};

const categoryIcons: Record<LeverCategory, React.ReactNode> = {
  revenue: <TrendingUp className="h-4 w-4" />,
  margin: <DollarSign className="h-4 w-4" />,
  strategic: <Target className="h-4 w-4" />,
};

const confidenceColors: Record<Confidence, string> = {
  high: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-red-100 text-red-700',
};

const priorityColors: Record<ActionPriority, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600',
};

const defaultPhase1: ActionItem[] = [
  { id: 'p1-1', action: 'Sign management employment agreements and set compensation', owner: '', priority: 'high', completed: false },
  { id: 'p1-2', action: 'Implement quick wins — pricing adjustments, obvious cost cuts', owner: '', priority: 'high', completed: false },
  { id: 'p1-3', action: 'Conduct detailed operational assessment by function', owner: '', priority: 'high', completed: false },
  { id: 'p1-4', action: 'Execute customer communication plan', owner: '', priority: 'medium', completed: false },
  { id: 'p1-5', action: 'Set up reporting dashboards and KPI tracking', owner: '', priority: 'medium', completed: false },
];

const defaultPhase2: ActionItem[] = [
  { id: 'p2-1', action: 'Finalize strategic plan and communicate to organization', owner: '', priority: 'high', completed: false },
  { id: 'p2-2', action: 'Launch top 3-5 value creation initiatives', owner: '', priority: 'high', completed: false },
  { id: 'p2-3', action: 'Begin add-on M&A pipeline development', owner: '', priority: 'medium', completed: false },
  { id: 'p2-4', action: 'Hire for critical talent gaps', owner: '', priority: 'high', completed: false },
  { id: 'p2-5', action: 'Implement new reporting cadence (weekly flash, monthly review, quarterly board)', owner: '', priority: 'medium', completed: false },
];

const defaultPhase3: ActionItem[] = [
  { id: 'p3-1', action: 'Review first results from quick-win initiatives', owner: '', priority: 'high', completed: false },
  { id: 'p3-2', action: 'Hold first board meeting with operating metrics', owner: '', priority: 'high', completed: false },
  { id: 'p3-3', action: 'Progress report on each value creation lever', owner: '', priority: 'medium', completed: false },
  { id: 'p3-4', action: 'Adjust plan based on early learnings', owner: '', priority: 'medium', completed: false },
];

const defaultKPIs: KPIItem[] = [
  { id: 'k1', name: 'Revenue', current: '', target: '', owner: 'CEO', frequency: 'monthly' },
  { id: 'k2', name: 'EBITDA', current: '', target: '', owner: 'CFO', frequency: 'monthly' },
  { id: 'k3', name: 'EBITDA Margin', current: '', target: '', owner: 'CFO', frequency: 'monthly' },
  { id: 'k4', name: 'New Customer Wins', current: '', target: '', owner: 'CRO', frequency: 'weekly' },
  { id: 'k5', name: 'Net Revenue Retention', current: '', target: '', owner: 'CRO', frequency: 'monthly' },
  { id: 'k6', name: 'Employee Turnover', current: '', target: '', owner: 'CHRO', frequency: 'monthly' },
  { id: 'k7', name: 'Cash Conversion Cycle', current: '', target: '', owner: 'CFO', frequency: 'monthly' },
];

const defaultState: ValueCreationState = {
  currentRevenue: 0,
  currentEBITDA: 0,
  levers: [],
  phase1: defaultPhase1,
  phase2: defaultPhase2,
  phase3: defaultPhase3,
  kpis: defaultKPIs,
};

// ─── HELPERS ───────────────────────────────────────────────────────

let idCounter = 0;
const genId = () => `vc-${Date.now()}-${++idCounter}`;

const fmt = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
};

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

// ─── MAIN COMPONENT ───────────────────────────────────────────────

const ValueCreationPlanPage: React.FC = () => {
  const [state, setState] = useState<ValueCreationState>(defaultState);
  const [activeTab, setActiveTab] = useState('baseline');

  // Load saved state, then fill gaps from Company Profile
  useEffect(() => {
    let loaded = { ...defaultState };
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { loaded = { ...defaultState, ...JSON.parse(saved) }; } catch (e) { /* ignore */ }
    }
    // Fill empty financials from Company Profile (profile uses $M, this module uses raw $)
    try {
      const raw = localStorage.getItem('company-profile-v1');
      if (raw) {
        const cp = JSON.parse(raw);
        if (!loaded.currentRevenue && cp.annualRevenue) loaded.currentRevenue = cp.annualRevenue * 1_000_000;
        if (!loaded.currentEBITDA && cp.ebitda) loaded.currentEBITDA = cp.ebitda * 1_000_000;
      }
    } catch (e) { /* ignore */ }
    setState(loaded);
  }, []);

  // Save on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // ─── EBITDA Bridge Calculations ────────────────────────────────
  const bridgeData = useMemo(() => {
    const years = [1, 2, 3, 4, 5];
    const base = state.currentEBITDA;

    // Group levers by category
    const revenueLevers = state.levers.filter(l => l.category === 'revenue');
    const marginLevers = state.levers.filter(l => l.category === 'margin');
    const strategicLevers = state.levers.filter(l => l.category === 'strategic');

    const revenueTotals = years.map((_, yi) =>
      revenueLevers.reduce((sum, l) => sum + (l.yearlyImpact[yi] || 0), 0)
    );
    const marginTotals = years.map((_, yi) =>
      marginLevers.reduce((sum, l) => sum + (l.yearlyImpact[yi] || 0), 0)
    );
    const strategicTotals = years.map((_, yi) =>
      strategicLevers.reduce((sum, l) => sum + (l.yearlyImpact[yi] || 0), 0)
    );

    const proForma = years.map((_, yi) =>
      base + revenueTotals[yi] + marginTotals[yi] + strategicTotals[yi]
    );

    const margins = proForma.map(pf =>
      state.currentRevenue > 0 ? pf / state.currentRevenue : 0
    );

    const totalInvestment = state.levers.reduce((s, l) => s + (l.investmentRequired || 0), 0);

    return { base, revenueTotals, marginTotals, strategicTotals, proForma, margins, totalInvestment, revenueLevers, marginLevers, strategicLevers };
  }, [state]);

  // ─── State Updaters ────────────────────────────────────────────
  const updateField = (field: keyof ValueCreationState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const addLever = (category: LeverCategory) => {
    const lever: ValueCreationLever = {
      id: genId(),
      category,
      name: '',
      description: '',
      currentState: '',
      targetState: '',
      yearlyImpact: [0, 0, 0, 0, 0],
      investmentRequired: 0,
      confidence: 'medium',
    };
    updateField('levers', [...state.levers, lever]);
  };

  const updateLever = (id: string, updates: Partial<ValueCreationLever>) => {
    updateField('levers', state.levers.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const removeLever = (id: string) => {
    updateField('levers', state.levers.filter(l => l.id !== id));
  };

  const updateLeverImpact = (id: string, yearIndex: number, value: number) => {
    updateField('levers', state.levers.map(l => {
      if (l.id !== id) return l;
      const newImpact = [...l.yearlyImpact] as [number, number, number, number, number];
      newImpact[yearIndex] = value;
      return { ...l, yearlyImpact: newImpact };
    }));
  };

  const addAction = (phase: 'phase1' | 'phase2' | 'phase3') => {
    const item: ActionItem = { id: genId(), action: '', owner: '', priority: 'medium', completed: false };
    updateField(phase, [...state[phase], item]);
  };

  const updateAction = (phase: 'phase1' | 'phase2' | 'phase3', id: string, updates: Partial<ActionItem>) => {
    updateField(phase, state[phase].map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const removeAction = (phase: 'phase1' | 'phase2' | 'phase3', id: string) => {
    updateField(phase, state[phase].filter(a => a.id !== id));
  };

  const addKPI = () => {
    const kpi: KPIItem = { id: genId(), name: '', current: '', target: '', owner: '', frequency: 'monthly' };
    updateField('kpis', [...state.kpis, kpi]);
  };

  const updateKPI = (id: string, updates: Partial<KPIItem>) => {
    updateField('kpis', state.kpis.map(k => k.id === id ? { ...k, ...updates } : k));
  };

  const removeKPI = (id: string) => {
    updateField('kpis', state.kpis.filter(k => k.id !== id));
  };

  // ─── Export ────────────────────────────────────────────────────
  const exportToCSV = () => {
    const lines: string[] = [];
    lines.push('EBITDA Bridge');
    lines.push('Lever,Year 1,Year 2,Year 3,Year 4,Year 5');
    lines.push(`Base EBITDA,${state.currentEBITDA},${state.currentEBITDA},${state.currentEBITDA},${state.currentEBITDA},${state.currentEBITDA}`);
    state.levers.forEach(l => {
      lines.push(`"${l.name} (${categoryLabels[l.category]})",${l.yearlyImpact.join(',')}`);
    });
    lines.push(`Pro Forma EBITDA,${bridgeData.proForma.join(',')}`);
    lines.push('');
    lines.push('100-Day Plan');
    lines.push('Phase,Action,Owner,Priority,Completed');
    ['phase1', 'phase2', 'phase3'].forEach((phase, pi) => {
      const phaseName = ['Days 1-30', 'Days 31-60', 'Days 61-100'][pi];
      (state[phase as 'phase1' | 'phase2' | 'phase3']).forEach(a => {
        lines.push(`"${phaseName}","${a.action}","${a.owner}",${a.priority},${a.completed}`);
      });
    });
    lines.push('');
    lines.push('KPI Dashboard');
    lines.push('KPI,Current,Target,Owner,Frequency');
    state.kpis.forEach(k => {
      lines.push(`"${k.name}","${k.current}","${k.target}","${k.owner}",${k.frequency}`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `value-creation-plan-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold">Value Creation Plan</h1>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-1.5 py-0 h-5">
              ENHANCED
            </Badge>
          </div>
          <p className="text-muted-foreground">
            EBITDA bridge, value creation levers, 100-day post-close plan, and KPI tracking
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Current EBITDA</div>
            <div className="text-xl font-bold">{state.currentEBITDA > 0 ? fmt(state.currentEBITDA) : '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Year 5 Pro Forma</div>
            <div className="text-xl font-bold text-green-600">
              {bridgeData.proForma[4] > 0 ? fmt(bridgeData.proForma[4]) : '—'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Value Creation Levers</div>
            <div className="text-xl font-bold">{state.levers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Total Investment</div>
            <div className="text-xl font-bold text-blue-600">
              {bridgeData.totalInvestment > 0 ? fmt(bridgeData.totalInvestment) : '—'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="baseline" className="text-xs sm:text-sm">Baseline & Levers</TabsTrigger>
          <TabsTrigger value="bridge" className="text-xs sm:text-sm">EBITDA Bridge</TabsTrigger>
          <TabsTrigger value="hundred-day" className="text-xs sm:text-sm">100-Day Plan</TabsTrigger>
          <TabsTrigger value="kpis" className="text-xs sm:text-sm">KPI Dashboard</TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: BASELINE & LEVERS ─────────────────────────── */}
        <TabsContent value="baseline" className="space-y-6">
          {/* Baseline financials */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Baseline Financials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Current Annual Revenue ($)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 10000000"
                    value={state.currentRevenue || ''}
                    onChange={e => updateField('currentRevenue', Number(e.target.value))}
                    className="mt-1"
                  />
                  {state.currentRevenue > 0 && (
                    <span className="text-xs text-muted-foreground">{fmt(state.currentRevenue)}</span>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Current EBITDA ($)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 2000000"
                    value={state.currentEBITDA || ''}
                    onChange={e => updateField('currentEBITDA', Number(e.target.value))}
                    className="mt-1"
                  />
                  {state.currentEBITDA > 0 && (
                    <span className="text-xs text-muted-foreground">{fmt(state.currentEBITDA)}</span>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Current EBITDA Margin</label>
                  <div className="mt-1 h-10 flex items-center px-3 rounded-md border bg-muted text-sm">
                    {state.currentRevenue > 0 && state.currentEBITDA > 0
                      ? pct(state.currentEBITDA / state.currentRevenue)
                      : '—'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Value Creation Levers — by category */}
          {(['revenue', 'margin', 'strategic'] as LeverCategory[]).map(cat => {
            const catLevers = state.levers.filter(l => l.category === cat);
            return (
              <Card key={cat}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {categoryIcons[cat]}
                      {categoryLabels[cat]}
                      <Badge variant="outline" className="text-xs">{catLevers.length} levers</Badge>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => addLever(cat)}>
                      <Plus className="h-3 w-3 mr-1" /> Add Lever
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {catLevers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No {categoryLabels[cat].toLowerCase()} levers yet. Click "Add Lever" to start.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {catLevers.map(lever => (
                        <LeverRow
                          key={lever.id}
                          lever={lever}
                          onUpdate={(updates) => updateLever(lever.id, updates)}
                          onUpdateImpact={(yi, val) => updateLeverImpact(lever.id, yi, val)}
                          onRemove={() => removeLever(lever.id)}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* ─── TAB 2: EBITDA BRIDGE ─────────────────────────────── */}
        <TabsContent value="bridge" className="space-y-6">
          {state.currentEBITDA === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
                <p className="text-lg font-medium">Enter your baseline financials first</p>
                <p className="text-sm text-muted-foreground mt-1">Go to the "Baseline & Levers" tab to set your current EBITDA and add value creation levers.</p>
                <Button className="mt-4" onClick={() => setActiveTab('baseline')}>
                  <ArrowRight className="h-4 w-4 mr-1" /> Go to Baseline
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Bridge Table */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    EBITDA Bridge — 5-Year Walk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-medium">Lever</th>
                          {[1, 2, 3, 4, 5].map(y => (
                            <th key={y} className="text-right py-2 px-2 font-medium w-24">Year {y}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {/* Base EBITDA */}
                        <tr className="border-b bg-muted/30">
                          <td className="py-2 pr-4 font-semibold">Base EBITDA</td>
                          {[0, 1, 2, 3, 4].map(i => (
                            <td key={i} className="text-right py-2 px-2 font-semibold">{fmt(bridgeData.base)}</td>
                          ))}
                        </tr>

                        {/* Revenue levers */}
                        {bridgeData.revenueLevers.length > 0 && (
                          <>
                            <tr className="bg-blue-50/50">
                              <td colSpan={6} className="py-1.5 px-2 text-xs font-medium text-blue-700">Revenue Growth</td>
                            </tr>
                            {bridgeData.revenueLevers.map(l => (
                              <tr key={l.id} className="border-b">
                                <td className="py-1.5 pr-4 pl-4 text-xs">{l.name || '(unnamed)'}</td>
                                {l.yearlyImpact.map((v, i) => (
                                  <td key={i} className={`text-right py-1.5 px-2 text-xs ${v > 0 ? 'text-green-600' : v < 0 ? 'text-red-600' : ''}`}>
                                    {v !== 0 ? fmt(v) : '—'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                            <tr className="border-b font-medium bg-blue-50/30">
                              <td className="py-1.5 pr-4 pl-2 text-xs">Subtotal: Revenue Growth</td>
                              {bridgeData.revenueTotals.map((v, i) => (
                                <td key={i} className="text-right py-1.5 px-2 text-xs text-blue-700">{fmt(v)}</td>
                              ))}
                            </tr>
                          </>
                        )}

                        {/* Margin levers */}
                        {bridgeData.marginLevers.length > 0 && (
                          <>
                            <tr className="bg-green-50/50">
                              <td colSpan={6} className="py-1.5 px-2 text-xs font-medium text-green-700">Margin Expansion</td>
                            </tr>
                            {bridgeData.marginLevers.map(l => (
                              <tr key={l.id} className="border-b">
                                <td className="py-1.5 pr-4 pl-4 text-xs">{l.name || '(unnamed)'}</td>
                                {l.yearlyImpact.map((v, i) => (
                                  <td key={i} className={`text-right py-1.5 px-2 text-xs ${v > 0 ? 'text-green-600' : v < 0 ? 'text-red-600' : ''}`}>
                                    {v !== 0 ? fmt(v) : '—'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                            <tr className="border-b font-medium bg-green-50/30">
                              <td className="py-1.5 pr-4 pl-2 text-xs">Subtotal: Margin Expansion</td>
                              {bridgeData.marginTotals.map((v, i) => (
                                <td key={i} className="text-right py-1.5 px-2 text-xs text-green-700">{fmt(v)}</td>
                              ))}
                            </tr>
                          </>
                        )}

                        {/* Strategic levers */}
                        {bridgeData.strategicLevers.length > 0 && (
                          <>
                            <tr className="bg-purple-50/50">
                              <td colSpan={6} className="py-1.5 px-2 text-xs font-medium text-purple-700">Strategic / Multiple Expansion</td>
                            </tr>
                            {bridgeData.strategicLevers.map(l => (
                              <tr key={l.id} className="border-b">
                                <td className="py-1.5 pr-4 pl-4 text-xs">{l.name || '(unnamed)'}</td>
                                {l.yearlyImpact.map((v, i) => (
                                  <td key={i} className={`text-right py-1.5 px-2 text-xs ${v > 0 ? 'text-green-600' : v < 0 ? 'text-red-600' : ''}`}>
                                    {v !== 0 ? fmt(v) : '—'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                            <tr className="border-b font-medium bg-purple-50/30">
                              <td className="py-1.5 pr-4 pl-2 text-xs">Subtotal: Strategic</td>
                              {bridgeData.strategicTotals.map((v, i) => (
                                <td key={i} className="text-right py-1.5 px-2 text-xs text-purple-700">{fmt(v)}</td>
                              ))}
                            </tr>
                          </>
                        )}

                        {/* Pro Forma EBITDA */}
                        <tr className="bg-muted font-bold border-t-2">
                          <td className="py-2 pr-4">Pro Forma EBITDA</td>
                          {bridgeData.proForma.map((v, i) => (
                            <td key={i} className="text-right py-2 px-2 text-green-700">{fmt(v)}</td>
                          ))}
                        </tr>

                        {/* Growth from base */}
                        <tr>
                          <td className="py-1.5 pr-4 text-xs text-muted-foreground">Growth from Base</td>
                          {bridgeData.proForma.map((v, i) => (
                            <td key={i} className="text-right py-1.5 px-2 text-xs text-muted-foreground">
                              {bridgeData.base > 0 ? `+${((v / bridgeData.base - 1) * 100).toFixed(0)}%` : '—'}
                            </td>
                          ))}
                        </tr>

                        {/* Implied Margin */}
                        {state.currentRevenue > 0 && (
                          <tr>
                            <td className="py-1.5 pr-4 text-xs text-muted-foreground">Implied EBITDA Margin</td>
                            {bridgeData.margins.map((m, i) => (
                              <td key={i} className="text-right py-1.5 px-2 text-xs text-muted-foreground">
                                {pct(m)}
                              </td>
                            ))}
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {state.levers.length === 0 && (
                    <div className="text-center py-6 border-t mt-4">
                      <p className="text-sm text-muted-foreground">Add value creation levers on the "Baseline & Levers" tab to populate the bridge.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lever Summary */}
              {state.levers.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Lever Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(['revenue', 'margin', 'strategic'] as LeverCategory[]).map(cat => {
                        const catLevers = state.levers.filter(l => l.category === cat);
                        const y5Impact = catLevers.reduce((s, l) => s + (l.yearlyImpact[4] || 0), 0);
                        const investment = catLevers.reduce((s, l) => s + (l.investmentRequired || 0), 0);
                        return (
                          <div key={cat} className={`rounded-lg p-4 border ${categoryColors[cat]}`}>
                            <div className="flex items-center gap-2 mb-2">
                              {categoryIcons[cat]}
                              <span className="font-medium text-sm">{categoryLabels[cat]}</span>
                            </div>
                            <div className="text-2xl font-bold">{fmt(y5Impact)}</div>
                            <div className="text-xs mt-1">Year 5 EBITDA impact</div>
                            <div className="text-xs mt-1">{catLevers.length} levers | {fmt(investment)} investment</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* ─── TAB 3: 100-DAY PLAN ──────────────────────────────── */}
        <TabsContent value="hundred-day" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Phase 1 */}
            <PhaseCard
              title="Days 1–30"
              subtitle="Stabilize & Assess"
              color="blue"
              icon={<Zap className="h-5 w-5" />}
              items={state.phase1}
              onAdd={() => addAction('phase1')}
              onUpdate={(id, updates) => updateAction('phase1', id, updates)}
              onRemove={(id) => removeAction('phase1', id)}
            />
            {/* Phase 2 */}
            <PhaseCard
              title="Days 31–60"
              subtitle="Plan & Initiate"
              color="purple"
              icon={<Target className="h-5 w-5" />}
              items={state.phase2}
              onAdd={() => addAction('phase2')}
              onUpdate={(id, updates) => updateAction('phase2', id, updates)}
              onRemove={(id) => removeAction('phase2', id)}
            />
            {/* Phase 3 */}
            <PhaseCard
              title="Days 61–100"
              subtitle="Execute & Measure"
              color="green"
              icon={<CheckCircle2 className="h-5 w-5" />}
              items={state.phase3}
              onAdd={() => addAction('phase3')}
              onUpdate={(id, updates) => updateAction('phase3', id, updates)}
              onRemove={(id) => removeAction('phase3', id)}
            />
          </div>

          {/* 100-Day Progress */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">100-Day Plan Progress</span>
                <span className="text-sm text-muted-foreground">
                  {[...state.phase1, ...state.phase2, ...state.phase3].filter(a => a.completed).length} / {[...state.phase1, ...state.phase2, ...state.phase3].length} complete
                </span>
              </div>
              <Progress
                value={
                  [...state.phase1, ...state.phase2, ...state.phase3].length > 0
                    ? ([...state.phase1, ...state.phase2, ...state.phase3].filter(a => a.completed).length /
                       [...state.phase1, ...state.phase2, ...state.phase3].length) * 100
                    : 0
                }
                className="h-2"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 4: KPI DASHBOARD ─────────────────────────────── */}
        <TabsContent value="kpis" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Value Creation KPI Dashboard
                </div>
                <Button size="sm" variant="outline" onClick={addKPI}>
                  <Plus className="h-3 w-3 mr-1" /> Add KPI
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-2 font-medium">KPI</th>
                      <th className="text-left py-2 px-2 font-medium w-28">Current</th>
                      <th className="text-left py-2 px-2 font-medium w-28">Target</th>
                      <th className="text-left py-2 px-2 font-medium w-28">Owner</th>
                      <th className="text-left py-2 px-2 font-medium w-28">Frequency</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.kpis.map(kpi => (
                      <tr key={kpi.id} className="border-b">
                        <td className="py-1.5 pr-2">
                          <Input
                            value={kpi.name}
                            onChange={e => updateKPI(kpi.id, { name: e.target.value })}
                            placeholder="KPI name"
                            className="h-8 text-xs"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <Input
                            value={kpi.current}
                            onChange={e => updateKPI(kpi.id, { current: e.target.value })}
                            placeholder="Current"
                            className="h-8 text-xs"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <Input
                            value={kpi.target}
                            onChange={e => updateKPI(kpi.id, { target: e.target.value })}
                            placeholder="Target"
                            className="h-8 text-xs"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <Input
                            value={kpi.owner}
                            onChange={e => updateKPI(kpi.id, { owner: e.target.value })}
                            placeholder="Owner"
                            className="h-8 text-xs"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <select
                            value={kpi.frequency}
                            onChange={e => updateKPI(kpi.id, { frequency: e.target.value as KPIFrequency })}
                            className="h-8 w-full rounded-md border bg-background px-2 text-xs"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                          </select>
                        </td>
                        <td className="py-1.5">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                            onClick={() => removeKPI(kpi.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {state.kpis.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No KPIs yet. Click "Add KPI" to start tracking.</p>
              )}
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            <p>
              Track these KPIs weekly/monthly to measure value creation progress.
              <br />PE firms expect board-ready reporting from Day 1.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Educational disclaimer */}
      <div className="text-center text-xs text-muted-foreground border-t pt-4 mt-8">
        <p>
          This is an educational value creation planning tool for PE transaction readiness.
          <br />For actual post-close execution, work with your operating partners and advisors.
        </p>
      </div>
    </div>
  );
};

// ─── LEVER ROW COMPONENT ──────────────────────────────────────────

interface LeverRowProps {
  lever: ValueCreationLever;
  onUpdate: (updates: Partial<ValueCreationLever>) => void;
  onUpdateImpact: (yearIndex: number, value: number) => void;
  onRemove: () => void;
}

const LeverRow: React.FC<LeverRowProps> = ({ lever, onUpdate, onUpdateImpact, onRemove }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg">
      <div className="flex items-center gap-2 p-3">
        <div className="flex-1">
          <Input
            value={lever.name}
            onChange={e => onUpdate({ name: e.target.value })}
            placeholder="Lever name (e.g. Price increases, Procurement savings)"
            className="h-8 text-sm font-medium"
          />
        </div>
        <Badge className={`${confidenceColors[lever.confidence]} text-[10px] px-1.5`}>
          {lever.confidence}
        </Badge>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={onRemove}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t pt-3 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium">Description</label>
              <Input value={lever.description} onChange={e => onUpdate({ description: e.target.value })}
                placeholder="What does this lever do?" className="h-8 text-xs mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium">Current State</label>
                <Input value={lever.currentState} onChange={e => onUpdate({ currentState: e.target.value })}
                  placeholder="Where we are" className="h-8 text-xs mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium">Target State</label>
                <Input value={lever.targetState} onChange={e => onUpdate({ targetState: e.target.value })}
                  placeholder="Where we're going" className="h-8 text-xs mt-1" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium">Investment Required ($)</label>
              <Input type="number" value={lever.investmentRequired || ''}
                onChange={e => onUpdate({ investmentRequired: Number(e.target.value) })}
                placeholder="0" className="h-8 text-xs mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium">Confidence</label>
              <select value={lever.confidence} onChange={e => onUpdate({ confidence: e.target.value as Confidence })}
                className="mt-1 h-8 w-full rounded-md border bg-background px-2 text-xs">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Yearly EBITDA impact */}
          <div>
            <label className="text-xs font-medium">EBITDA Impact by Year ($)</label>
            <div className="grid grid-cols-5 gap-2 mt-1">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i}>
                  <label className="text-[10px] text-muted-foreground">Year {i + 1}</label>
                  <Input type="number" value={lever.yearlyImpact[i] || ''}
                    onChange={e => onUpdateImpact(i, Number(e.target.value))}
                    placeholder="0" className="h-8 text-xs" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PHASE CARD COMPONENT ─────────────────────────────────────────

interface PhaseCardProps {
  title: string;
  subtitle: string;
  color: 'blue' | 'purple' | 'green';
  icon: React.ReactNode;
  items: ActionItem[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<ActionItem>) => void;
  onRemove: (id: string) => void;
}

const colorMap = {
  blue: { border: 'border-blue-200', bg: 'bg-blue-50/50', text: 'text-blue-700', header: 'bg-blue-100' },
  purple: { border: 'border-purple-200', bg: 'bg-purple-50/50', text: 'text-purple-700', header: 'bg-purple-100' },
  green: { border: 'border-green-200', bg: 'bg-green-50/50', text: 'text-green-700', header: 'bg-green-100' },
};

const PhaseCard: React.FC<PhaseCardProps> = ({ title, subtitle, color, icon, items, onAdd, onUpdate, onRemove }) => {
  const c = colorMap[color];
  const completed = items.filter(i => i.completed).length;

  return (
    <Card className={c.border}>
      <CardHeader className={`${c.header} rounded-t-lg pb-3`}>
        <CardTitle className={`text-base flex items-center gap-2 ${c.text}`}>
          {icon}
          <div>
            <div>{title}</div>
            <div className="text-xs font-normal">{subtitle}</div>
          </div>
        </CardTitle>
        <div className="text-xs text-muted-foreground">{completed}/{items.length} complete</div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className={`flex items-start gap-2 p-2 rounded border ${item.completed ? 'bg-muted/50 opacity-70' : ''}`}>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={e => onUpdate(item.id, { completed: e.target.checked })}
                className="mt-1 rounded"
              />
              <div className="flex-1 min-w-0">
                <Input
                  value={item.action}
                  onChange={e => onUpdate(item.id, { action: e.target.value })}
                  placeholder="Action item..."
                  className={`h-7 text-xs border-0 p-0 shadow-none ${item.completed ? 'line-through' : ''}`}
                />
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={item.owner}
                    onChange={e => onUpdate(item.id, { owner: e.target.value })}
                    placeholder="Owner"
                    className="h-6 text-[10px] w-20 px-1"
                  />
                  <select
                    value={item.priority}
                    onChange={e => onUpdate(item.id, { priority: e.target.value as ActionPriority })}
                    className={`h-6 rounded px-1 text-[10px] border ${priorityColors[item.priority]}`}
                  >
                    <option value="high">High</option>
                    <option value="medium">Med</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-red-400 hover:text-red-600 shrink-0"
                onClick={() => onRemove(item.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={onAdd}>
          <Plus className="h-3 w-3 mr-1" /> Add Action
        </Button>
      </CardContent>
    </Card>
  );
};

export default ValueCreationPlanPage;
