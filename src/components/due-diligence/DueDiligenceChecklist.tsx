
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Download, Filter, CheckCircle2, Clock, AlertTriangle,
  ChevronDown, ChevronUp, Building2, Stethoscope, Factory, Landmark,
  ShoppingBag, ArrowLeft, RotateCcw, Flag, Shield, FileText,
  Users, Monitor, Leaf, Briefcase, BarChart3
} from "lucide-react";
import {
  type Sector, type Workstream, type ItemStatus, type Priority,
  type RedFlagSeverity, type DDChecklistItem, type DDChecklistState,
  sectorLabels, sectorDescriptions, workstreamLabels, statusLabels,
  statusColors, statusBgColors, priorityColors, priorityLabels,
  severityColors, generateChecklist, getWorkstreams, getAllSectors,
} from "@/lib/checklists/sectorDDChecklist";

const STORAGE_KEY = 'dd-checklist-v2';

const sectorIcons: Record<Sector, React.ReactNode> = {
  'saas': <Monitor className="h-8 w-8" />,
  'healthcare': <Stethoscope className="h-8 w-8" />,
  'manufacturing': <Factory className="h-8 w-8" />,
  'financial-services': <Landmark className="h-8 w-8" />,
  'consumer': <ShoppingBag className="h-8 w-8" />,
};

const workstreamIcons: Record<Workstream, React.ReactNode> = {
  'financial': <BarChart3 className="h-4 w-4" />,
  'commercial': <Briefcase className="h-4 w-4" />,
  'legal': <FileText className="h-4 w-4" />,
  'operational': <Building2 className="h-4 w-4" />,
  'hr-people': <Users className="h-4 w-4" />,
  'it-tech': <Monitor className="h-4 w-4" />,
  'esg': <Leaf className="h-4 w-4" />,
};

const statusIcons: Record<ItemStatus, React.ReactNode> = {
  'not-started': <Clock className="h-4 w-4 text-gray-400" />,
  'requested': <Clock className="h-4 w-4 text-white" />,
  'received': <CheckCircle2 className="h-4 w-4 text-purple-500" />,
  'in-review': <Clock className="h-4 w-4 text-yellow-600" />,
  'complete': <CheckCircle2 className="h-4 w-4 text-green-600" />,
  'red-flag': <Flag className="h-4 w-4 text-red-600" />,
};

export const DueDiligenceChecklist: React.FC = () => {
  const [state, setState] = useState<DDChecklistState | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [activeWorkstream, setActiveWorkstream] = useState<Workstream | 'all'>('all');
  const [redFlagPanelOpen, setRedFlagPanelOpen] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading DD checklist:', e);
      }
    }
  }, []);

  // Save state on every change
  useEffect(() => {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const selectSector = (sector: Sector) => {
    setState({ sector, items: generateChecklist(sector) });
  };

  const resetChecklist = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(null);
    setShowResetConfirm(false);
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setActiveWorkstream('all');
  };

  const updateItemStatus = (id: string, status: ItemStatus) => {
    if (!state) return;
    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map(item => {
          if (item.id !== id) return item;
          const updated = { ...item, status };
          // Clear red flag data when changing away from red-flag status
          if (status !== 'red-flag' && item.redFlag) {
            const { redFlag, ...rest } = updated;
            return rest as DDChecklistItem;
          }
          // Initialize red flag data when setting to red-flag
          if (status === 'red-flag' && !item.redFlag) {
            updated.redFlag = { severity: 'manageable', finding: '', mitigant: '' };
          }
          return updated;
        }),
      };
    });
  };

  const updateItemNotes = (id: string, notes: string) => {
    if (!state) return;
    setState(prev => prev ? {
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, notes } : item),
    } : prev);
  };

  const updateRedFlag = (id: string, field: 'severity' | 'finding' | 'mitigant', value: string) => {
    if (!state) return;
    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map(item => {
          if (item.id !== id || !item.redFlag) return item;
          return { ...item, redFlag: { ...item.redFlag, [field]: value } };
        }),
      };
    });
  };

  // Derived data
  const workstreams = getWorkstreams();

  const filteredItems = useMemo(() => {
    if (!state) return [];
    return state.items.filter(item => {
      const matchesSearch = searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      const matchesWorkstream = activeWorkstream === 'all' || item.workstream === activeWorkstream;
      return matchesSearch && matchesStatus && matchesPriority && matchesWorkstream;
    });
  }, [state, searchTerm, statusFilter, priorityFilter, activeWorkstream]);

  const redFlagItems = useMemo(() => {
    if (!state) return [];
    return state.items.filter(item => item.status === 'red-flag');
  }, [state]);

  const overallProgress = useMemo(() => {
    if (!state || state.items.length === 0) return 0;
    const completed = state.items.filter(i => i.status === 'complete').length;
    return Math.round((completed / state.items.length) * 100);
  }, [state]);

  const workstreamStats = useMemo(() => {
    if (!state) return {};
    const stats: Record<Workstream, { total: number; complete: number; redFlags: number }> = {} as any;
    workstreams.forEach(ws => {
      const wsItems = state.items.filter(i => i.workstream === ws);
      stats[ws] = {
        total: wsItems.length,
        complete: wsItems.filter(i => i.status === 'complete').length,
        redFlags: wsItems.filter(i => i.status === 'red-flag').length,
      };
    });
    return stats;
  }, [state, workstreams]);

  const statusCounts = useMemo(() => {
    if (!state) return {} as Record<ItemStatus, number>;
    const counts: Record<ItemStatus, number> = {
      'not-started': 0, 'requested': 0, 'received': 0,
      'in-review': 0, 'complete': 0, 'red-flag': 0,
    };
    state.items.forEach(item => { counts[item.status]++; });
    return counts;
  }, [state]);

  const exportToCSV = () => {
    if (!state) return;
    const headers = ['Workstream', 'Item', 'Description', 'Priority', 'Status', 'Notes', 'Red Flag Severity', 'Red Flag Finding', 'Red Flag Mitigant'];
    const csvContent = [
      headers.join(','),
      ...state.items.map(item => [
        `"${workstreamLabels[item.workstream]}"`,
        `"${item.title}"`,
        `"${item.description}"`,
        item.priority,
        statusLabels[item.status],
        `"${item.notes || ''}"`,
        item.redFlag ? item.redFlag.severity : '',
        item.redFlag ? `"${item.redFlag.finding}"` : '',
        item.redFlag ? `"${item.redFlag.mitigant}"` : '',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dd-checklist-${state.sector}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // ─── INDUSTRY SELECTION SCREEN ──────────────────────────────────
  if (!state) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Due Diligence Checklist</h1>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-1.5 py-0 h-5">
              ENHANCED
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select your industry to generate a tailored due diligence checklist with sector-specific items across 7 professional workstreams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getAllSectors().map(sector => (
            <Card
              key={sector}
              className="cursor-pointer hover:border-white/30 hover:shadow-lg transition-all duration-200 group"
              onClick={() => selectSector(sector)}
            >
              <CardContent className="pt-6 text-center">
                <div className="mb-3 text-blue-600 group-hover:scale-110 transition-transform inline-block">
                  {sectorIcons[sector]}
                </div>
                <h3 className="font-semibold text-lg mb-1">{sectorLabels[sector]}</h3>
                <p className="text-sm text-muted-foreground">{sectorDescriptions[sector]}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Each sector generates a base checklist plus industry-specific diligence items.
            <br />You can change your selection later (progress will reset).
          </p>
        </div>
      </div>
    );
  }

  // ─── MAIN CHECKLIST SCREEN ──────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold">Due Diligence Checklist</h1>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-1.5 py-0 h-5">
              ENHANCED
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Sector:</span>
            <Badge variant="outline" className="font-medium">
              {sectorIcons[state.sector]}
              <span className="ml-1">{sectorLabels[state.sector]}</span>
            </Badge>
            <span className="text-sm">
              ({state.items.length} items across 7 workstreams)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
          {showResetConfirm ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-red-600 mr-1">Reset all progress?</span>
              <Button variant="destructive" size="sm" onClick={resetChecklist}>Yes, Reset</Button>
              <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(false)}>Cancel</Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(true)}>
              <RotateCcw className="h-4 w-4 mr-1" /> Change Sector
            </Button>
          )}
        </div>
      </div>

      {/* Progress Dashboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            Progress Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall progress bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Overall Completion</span>
              <span className="font-bold text-lg">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>

          {/* Status counts */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
            {(Object.keys(statusCounts) as ItemStatus[]).map(status => (
              <div key={status} className="p-2 rounded-lg bg-muted/50">
                <div className={`text-xl font-bold ${statusColors[status]}`}>
                  {statusCounts[status]}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">{statusLabels[status]}</div>
              </div>
            ))}
          </div>

          {/* Per-workstream progress bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {workstreams.map(ws => {
              const stats = workstreamStats[ws];
              if (!stats) return null;
              const pct = stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0;
              return (
                <div key={ws} className="flex items-center gap-2">
                  {workstreamIcons[ws]}
                  <span className="text-xs w-20 truncate">{workstreamLabels[ws]}</span>
                  <div className="flex-1">
                    <Progress value={pct} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-right">
                    {stats.complete}/{stats.total}
                    {stats.redFlags > 0 && (
                      <span className="text-red-500 ml-1">({stats.redFlags} <Flag className="h-3 w-3 inline" />)</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Red Flag Panel */}
      {redFlagItems.length > 0 && (
        <Card className="border-red-300 bg-red-50/50">
          <CardHeader className="pb-2 cursor-pointer" onClick={() => setRedFlagPanelOpen(!redFlagPanelOpen)}>
            <CardTitle className="flex items-center justify-between text-lg text-red-700">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Red Flags ({redFlagItems.length})
                <span className="text-xs font-normal ml-2">
                  {redFlagItems.filter(i => i.redFlag?.severity === 'deal-breaker').length > 0 && (
                    <Badge className="bg-red-600 text-white text-[10px] mr-1">
                      {redFlagItems.filter(i => i.redFlag?.severity === 'deal-breaker').length} Deal-Breaker
                    </Badge>
                  )}
                  {redFlagItems.filter(i => i.redFlag?.severity === 'significant').length > 0 && (
                    <Badge className="bg-orange-500 text-white text-[10px] mr-1">
                      {redFlagItems.filter(i => i.redFlag?.severity === 'significant').length} Significant
                    </Badge>
                  )}
                  {redFlagItems.filter(i => i.redFlag?.severity === 'manageable').length > 0 && (
                    <Badge className="bg-yellow-500 text-white text-[10px]">
                      {redFlagItems.filter(i => i.redFlag?.severity === 'manageable').length} Manageable
                    </Badge>
                  )}
                </span>
              </div>
              {redFlagPanelOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
          {redFlagPanelOpen && (
            <CardContent>
              <div className="space-y-3">
                {redFlagItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-medium text-sm">{item.title}</span>
                        <span className="text-xs text-muted-foreground ml-2">({workstreamLabels[item.workstream]})</span>
                      </div>
                      {item.redFlag && (
                        <Badge className={`${severityColors[item.redFlag.severity]} text-[10px] shrink-0`}>
                          {item.redFlag.severity}
                        </Badge>
                      )}
                    </div>
                    {item.redFlag && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="font-medium text-red-700 block mb-1">Finding:</label>
                          <span className="text-muted-foreground">{item.redFlag.finding || '(not documented)'}</span>
                        </div>
                        <div>
                          <label className="font-medium text-red-700 block mb-1">Mitigant:</label>
                          <span className="text-muted-foreground">{item.redFlag.mitigant || '(not documented)'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ItemStatus | 'all')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              {(Object.keys(statusLabels) as ItemStatus[]).map(s => (
                <option key={s} value={s}>{statusLabels[s]}</option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Priority</option>
              <option value="P0">P0 — Critical</option>
              <option value="P1">P1 — Important</option>
              <option value="P2">P2 — Nice to Have</option>
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workstream Tabs + Checklist Items */}
      <Tabs value={activeWorkstream} onValueChange={(v) => setActiveWorkstream(v as Workstream | 'all')}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="all" className="text-xs">
            All ({state.items.length})
          </TabsTrigger>
          {workstreams.map(ws => {
            const stats = workstreamStats[ws];
            return (
              <TabsTrigger key={ws} value={ws} className="text-xs flex items-center gap-1">
                {workstreamIcons[ws]}
                <span className="hidden sm:inline">{workstreamLabels[ws]}</span>
                <span className="sm:hidden">{workstreamLabels[ws].split(' ')[0]}</span>
                {stats && stats.redFlags > 0 && (
                  <span className="bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                    {stats.redFlags}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeWorkstream} className="space-y-3 mt-4">
          {activeWorkstream === 'all' ? (
            // All workstreams view — grouped by workstream
            workstreams.map(ws => {
              const wsItems = filteredItems.filter(i => i.workstream === ws);
              if (wsItems.length === 0) return null;
              return (
                <Card key={ws}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      {workstreamIcons[ws]}
                      {workstreamLabels[ws]}
                      <span className="text-xs text-muted-foreground font-normal">({wsItems.length} items)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {wsItems.map(item => (
                        <ChecklistItemRow
                          key={item.id}
                          item={item}
                          onStatusChange={updateItemStatus}
                          onNotesChange={updateItemNotes}
                          onRedFlagChange={updateRedFlag}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            // Single workstream view
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {workstreamIcons[activeWorkstream]}
                  {workstreamLabels[activeWorkstream]}
                  <span className="text-xs text-muted-foreground font-normal">({filteredItems.length} items)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No items match your filters.</p>
                  ) : (
                    filteredItems.map(item => (
                      <ChecklistItemRow
                        key={item.id}
                        item={item}
                        onStatusChange={updateItemStatus}
                        onNotesChange={updateItemNotes}
                        onRedFlagChange={updateRedFlag}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          {filteredItems.length === 0 && activeWorkstream === 'all' && (
            <p className="text-sm text-muted-foreground text-center py-8">No items match your filters.</p>
          )}
        </TabsContent>
      </Tabs>

      {/* Educational disclaimer */}
      <div className="text-center text-xs text-muted-foreground border-t pt-4 mt-8">
        <p>
          This is an educational due diligence checklist for PE transaction readiness preparation.
          <br />For actual transactions, work with your legal, financial, and M&A advisors.
        </p>
      </div>
    </div>
  );
};

// ─── CHECKLIST ITEM ROW COMPONENT ───────────────────────────────────

interface ChecklistItemRowProps {
  item: DDChecklistItem;
  onStatusChange: (id: string, status: ItemStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
  onRedFlagChange: (id: string, field: 'severity' | 'finding' | 'mitigant', value: string) => void;
}

const ChecklistItemRow: React.FC<ChecklistItemRowProps> = ({
  item, onStatusChange, onNotesChange, onRedFlagChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  const isRedFlag = item.status === 'red-flag';

  return (
    <div className={`border rounded-lg transition-colors ${isRedFlag ? 'border-red-300 bg-red-50/30' : ''}`}>
      {/* Main row */}
      <div className="flex items-start gap-3 p-3">
        <div className="mt-0.5 shrink-0">{statusIcons[item.status]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-medium text-sm ${item.status === 'complete' ? 'line-through text-muted-foreground' : ''}`}>
              {item.title}
            </span>
            <Badge className={`${priorityColors[item.priority]} text-[10px] px-1.5 py-0 h-4 border`}>
              {item.priority}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={item.status}
            onChange={(e) => onStatusChange(item.id, e.target.value as ItemStatus)}
            className={`text-xs border rounded px-2 py-1.5 ${statusBgColors[item.status]}`}
          >
            {(Object.keys(statusLabels) as ItemStatus[]).map(s => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t mx-3 mt-0">
          <div className="mt-2 space-y-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Notes</label>
              <Input
                placeholder="Add notes about this item..."
                value={item.notes || ''}
                onChange={(e) => onNotesChange(item.id, e.target.value)}
                className="text-xs mt-1 h-8"
              />
            </div>
            {isRedFlag && item.redFlag && (
              <div className="bg-red-50 rounded-lg p-2 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-red-700">Severity:</label>
                  <select
                    value={item.redFlag.severity}
                    onChange={(e) => onRedFlagChange(item.id, 'severity', e.target.value)}
                    className="text-xs border border-red-200 rounded px-2 py-1"
                  >
                    <option value="manageable">Manageable</option>
                    <option value="significant">Significant</option>
                    <option value="deal-breaker">Deal-Breaker</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-red-700">What was found:</label>
                  <Input
                    placeholder="Describe the red flag finding..."
                    value={item.redFlag.finding}
                    onChange={(e) => onRedFlagChange(item.id, 'finding', e.target.value)}
                    className="text-xs mt-1 h-8 border-red-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-red-700">Mitigant / Path to Resolution:</label>
                  <Input
                    placeholder="How can this be resolved or mitigated?"
                    value={item.redFlag.mitigant}
                    onChange={(e) => onRedFlagChange(item.id, 'mitigant', e.target.value)}
                    className="text-xs mt-1 h-8 border-red-200"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
