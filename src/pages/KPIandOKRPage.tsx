
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus,
  Trash2,
  Download,
  ChevronRight,
  BarChart3,
  Target,
  TrendingUp,
  AlertCircle,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  ArrowRight,
  Info,
  Edit3,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface KPIMetric {
  id: string;
  metricName: string;
  metricType: 'KPI' | 'OKR';
  category: 'Financial' | 'Operational' | 'Customer' | 'Growth' | 'Quality';
  currentValue: number;
  targetValue: number;
  unitOfMeasure: string;
  measurementFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  startDate: string;
  targetDate: string;
  strategicInitiativeLink: string;
  valuationImpact: 'High' | 'Medium' | 'Low';
  ebitdaImpact: number;
  owner: string;
  department: string;
  status: 'Not Started' | 'On Track' | 'At Risk' | 'Behind' | 'Achieved';
}

interface KeyResult {
  id: string;
  keyResult: string;
  currentProgress: number;
  targetProgress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

// Simplified Gauge Component
const SimpleGauge = ({ value, label, status }: any) => {
  const getColor = () => {
    if (status === 'green') return 'text-green-400';
    if (status === 'amber' || status === 'yellow') return 'text-yellow-400';
    if (status === 'gray') return 'text-gray-400';
    return 'text-red-400';
  };
  
  return (
    <div className="text-center">
      <div className="relative w-28 h-28 mx-auto">
        <svg className="transform -rotate-90 w-28 h-28">
          <circle
            cx="56"
            cy="56"
            r="48"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            className="text-white/10"
          />
          <circle
            cx="56"
            cy="56"
            r="48"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${value * 3.01} 301.59`}
            className={getColor()}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{value}%</span>
        </div>
      </div>
      <p className="text-sm text-white/70 mt-2">{label}</p>
    </div>
  );
};

const peValueDriverTemplates = [
  {
    metricName: "Customer Concentration",
    category: "Customer" as const,
    currentValue: 0,
    targetValue: 25,
    unitOfMeasure: "% of revenue",
    valuationImpact: "High" as const,
    ebitdaImpact: 500000
  },
  {
    metricName: "Gross Margin Improvement",
    category: "Financial" as const,
    currentValue: 0,
    targetValue: 42,
    unitOfMeasure: "%",
    valuationImpact: "High" as const,
    ebitdaImpact: 750000
  },
  {
    metricName: "Monthly Recurring Revenue",
    category: "Growth" as const,
    currentValue: 0,
    targetValue: 400000,
    unitOfMeasure: "$",
    valuationImpact: "High" as const,
    ebitdaImpact: 1800000
  },
  {
    metricName: "Employee Turnover Rate",
    category: "Operational" as const,
    currentValue: 0,
    targetValue: 10,
    unitOfMeasure: "% annual",
    valuationImpact: "Medium" as const,
    ebitdaImpact: 200000
  },
  {
    metricName: "Customer NPS Score",
    category: "Quality" as const,
    currentValue: 0,
    targetValue: 50,
    unitOfMeasure: "score",
    valuationImpact: "Medium" as const,
    ebitdaImpact: 300000
  }
];

// Financial health KPIs from PE portfolio monitoring frameworks
const peFinancialTemplates = [
  {
    metricName: "EBITDA Margin",
    category: "Financial" as const,
    currentValue: 0,
    targetValue: 20,
    unitOfMeasure: "%",
    valuationImpact: "High" as const,
    ebitdaImpact: 0
  },
  {
    metricName: "Interest Coverage Ratio",
    category: "Financial" as const,
    currentValue: 0,
    targetValue: 3,
    unitOfMeasure: "x",
    valuationImpact: "High" as const,
    ebitdaImpact: 0
  },
  {
    metricName: "Free Cash Flow",
    category: "Financial" as const,
    currentValue: 0,
    targetValue: 500000,
    unitOfMeasure: "$",
    valuationImpact: "High" as const,
    ebitdaImpact: 0
  },
  {
    metricName: "Revenue per Customer",
    category: "Customer" as const,
    currentValue: 0,
    targetValue: 50000,
    unitOfMeasure: "$",
    valuationImpact: "Medium" as const,
    ebitdaImpact: 0
  },
  {
    metricName: "Revenue per Employee",
    category: "Operational" as const,
    currentValue: 0,
    targetValue: 200000,
    unitOfMeasure: "$",
    valuationImpact: "Medium" as const,
    ebitdaImpact: 0
  }
];

export default function KPIandOKRPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<KPIMetric[]>([]);
  const [keyResults, setKeyResults] = useState<Record<string, KeyResult[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'KPI' | 'OKR'>('KPI');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadMetrics();
    loadStrategyInitiatives();
  }, [user]);

  // Determine if setup should be shown by default
  useEffect(() => {
    if (!isEditing && metrics.length === 0) {
      setShowSetup(true);
    }
  }, [isEditing]);

  const loadMetrics = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: metricsData, error: metricsError } = await supabase
        .from("kpi_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at");
        
      if (metricsError) throw metricsError;
      
      if (metricsData) {
        const formattedMetrics = metricsData.map(m => ({
          id: m.id,
          metricName: m.metric_name,
          metricType: m.metric_type as 'KPI' | 'OKR',
          category: m.category as KPIMetric['category'],
          currentValue: m.current_value || 0,
          targetValue: m.target_value || 0,
          unitOfMeasure: m.unit_of_measure || '',
          measurementFrequency: m.measurement_frequency as KPIMetric['measurementFrequency'],
          startDate: m.start_date || new Date().toISOString().split('T')[0],
          targetDate: m.target_date || '',
          strategicInitiativeLink: m.strategic_initiative_link || '',
          valuationImpact: m.valuation_impact as KPIMetric['valuationImpact'],
          ebitdaImpact: m.ebitda_impact || 0,
          owner: m.owner || '',
          department: m.department || '',
          status: m.status as KPIMetric['status']
        }));
        
        setMetrics(formattedMetrics);
        
        // Load OKR key results
        const okrIds = formattedMetrics.filter(m => m.metricType === 'OKR').map(m => m.id);
        if (okrIds.length > 0) {
          const { data: keyResultsData } = await supabase
            .from("okr_key_results")
            .select("*")
            .in("objective_id", okrIds);
            
          if (keyResultsData) {
            const groupedKeyResults = keyResultsData.reduce((acc, kr) => {
              if (!acc[kr.objective_id]) acc[kr.objective_id] = [];
              acc[kr.objective_id].push({
                id: kr.id,
                keyResult: kr.key_result,
                currentProgress: kr.current_progress || 0,
                targetProgress: kr.target_progress || 100,
                status: kr.status as KeyResult['status']
              });
              return acc;
            }, {} as Record<string, KeyResult[]>);
            
            setKeyResults(groupedKeyResults);
          }
        }
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStrategyInitiatives = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from("strategy_documents")
        .select("initiatives_90_day")
        .eq("user_id", user.id)
        .single();
        
      if (data?.initiatives_90_day && Array.isArray(data.initiatives_90_day) && metrics.length === 0) {
        // Pre-populate KPIs from strategy initiatives
        const initiativeKPIs = data.initiatives_90_day
          .filter((init: any) => init.metrics)
          .map((init: any) => ({
            id: crypto.randomUUID(),
            metricName: init.metrics,
            metricType: 'KPI' as const,
            category: 'Operational' as const,
            currentValue: 0,
            targetValue: 100,
            unitOfMeasure: '%',
            measurementFrequency: 'Monthly' as const,
            startDate: new Date().toISOString().split('T')[0],
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            strategicInitiativeLink: init.initiative,
            valuationImpact: 'Medium' as const,
            ebitdaImpact: 0,
            owner: init.owner || '',
            department: '',
            status: 'Not Started' as const
          }));
          
        if (initiativeKPIs.length > 0) {
          setMetrics(initiativeKPIs);
        }
      }
    } catch (err) {
      console.error("Error loading strategy initiatives:", err);
    }
  };

  const saveMetrics = async () => {
    if (!user || saving) return;
    
    setSaving(true);
    try {
      // Save KPIs/OKRs
      for (const metric of metrics) {
        const { error } = await supabase
          .from("kpi_metrics")
          .upsert({
            id: metric.id,
            user_id: user.id,
            metric_name: metric.metricName,
            metric_type: metric.metricType,
            category: metric.category,
            current_value: metric.currentValue,
            target_value: metric.targetValue,
            unit_of_measure: metric.unitOfMeasure,
            measurement_frequency: metric.measurementFrequency,
            start_date: metric.startDate,
            target_date: metric.targetDate,
            strategic_initiative_link: metric.strategicInitiativeLink,
            valuation_impact: metric.valuationImpact,
            ebitda_impact: metric.ebitdaImpact,
            owner: metric.owner,
            department: metric.department,
            status: metric.status,
            last_updated: new Date().toISOString()
          });
          
        if (error) throw error;
        
        // Save key results for OKRs
        if (metric.metricType === 'OKR' && keyResults[metric.id]) {
          // Delete existing key results
          await supabase
            .from("okr_key_results")
            .delete()
            .eq("objective_id", metric.id);
            
          // Insert new key results
          for (const kr of keyResults[metric.id]) {
            await supabase
              .from("okr_key_results")
              .insert({
                id: kr.id,
                objective_id: metric.id,
                key_result: kr.keyResult,
                current_progress: kr.currentProgress,
                target_progress: kr.targetProgress,
                status: kr.status
              });
          }
        }
      }
      
      toast.success("KPIs and OKRs saved!");
      // Refresh data
      loadMetrics();
    } catch (err) {
      toast.error("Failed to save metrics");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const addMetric = (type: 'KPI' | 'OKR', template?: typeof peValueDriverTemplates[0]) => {
    if (metrics.length >= 10) {
      toast.error("Maximum 10 metrics allowed");
      return;
    }

    const newMetric: KPIMetric = {
      id: crypto.randomUUID(),
      metricName: template?.metricName || '',
      metricType: type,
      category: template?.category || 'Financial',
      currentValue: template?.currentValue || 0,
      targetValue: template?.targetValue || 0,
      unitOfMeasure: template?.unitOfMeasure || '',
      measurementFrequency: 'Monthly',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      strategicInitiativeLink: '',
      valuationImpact: template?.valuationImpact || 'Medium',
      ebitdaImpact: template?.ebitdaImpact || 0,
      owner: '',
      department: '',
      status: 'Not Started'
    };

    setMetrics([...metrics, newMetric]);
    setActiveTab(type);
    setShowTemplates(false);
    setShowSetup(true);
    setIsEditing(true);
    
    if (type === 'OKR') {
      setKeyResults({
        ...keyResults,
        [newMetric.id]: [
          { id: crypto.randomUUID(), keyResult: '', currentProgress: 0, targetProgress: 100, status: 'Not Started' }
        ]
      });
    }
  };

  const updateMetric = (id: string, updates: Partial<KPIMetric>) => {
    setMetrics(metrics.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMetric = (id: string) => {
    setMetrics(metrics.filter(m => m.id !== id));
    if (keyResults[id]) {
      const newKeyResults = { ...keyResults };
      delete newKeyResults[id];
      setKeyResults(newKeyResults);
    }
  };

  const addKeyResult = (objectiveId: string) => {
    const currentKRs = keyResults[objectiveId] || [];
    if (currentKRs.length >= 5) {
      toast.error("Maximum 5 key results per objective");
      return;
    }
    
    setKeyResults({
      ...keyResults,
      [objectiveId]: [...currentKRs, {
        id: crypto.randomUUID(),
        keyResult: '',
        currentProgress: 0,
        targetProgress: 100,
        status: 'Not Started'
      }]
    });
  };

  const updateKeyResult = (objectiveId: string, krId: string, updates: Partial<KeyResult>) => {
    setKeyResults({
      ...keyResults,
      [objectiveId]: keyResults[objectiveId].map(kr => 
        kr.id === krId ? { ...kr, ...updates } : kr
      )
    });
  };

  const removeKeyResult = (objectiveId: string, krId: string) => {
    setKeyResults({
      ...keyResults,
      [objectiveId]: keyResults[objectiveId].filter(kr => kr.id !== krId)
    });
  };

  const calculateProgress = (metric: KPIMetric) => {
    if (metric.targetValue === 0) return 0;
    const progress = (metric.currentValue / metric.targetValue) * 100;
    return Math.min(Math.round(progress), 100);
  };

  // Traffic light auto-calculation based on progress toward target
  // Green = within 5% of target (95%+), Yellow = 85-94%, Red = below 85%
  const getTrafficLight = (metric: KPIMetric): 'green' | 'yellow' | 'red' | 'gray' => {
    if (metric.currentValue === 0 && metric.status === 'Not Started') return 'gray';
    if (metric.targetValue === 0) return 'gray';
    const progress = calculateProgress(metric);
    if (progress >= 95) return 'green';
    if (progress >= 85) return 'yellow';
    return 'red';
  };

  const getTrafficLightLabel = (color: 'green' | 'yellow' | 'red' | 'gray'): string => {
    switch (color) {
      case 'green': return 'On Track';
      case 'yellow': return 'Caution';
      case 'red': return 'Needs Attention';
      case 'gray': return 'Not Started';
    }
  };

  const getTrafficLightColors = (color: 'green' | 'yellow' | 'red' | 'gray') => {
    switch (color) {
      case 'green': return { dot: 'bg-green-500', text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' };
      case 'yellow': return { dot: 'bg-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
      case 'red': return { dot: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
      case 'gray': return { dot: 'bg-gray-500', text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30' };
    }
  };

  // Count metrics by traffic light color
  const trafficCounts = metrics.reduce((acc, m) => {
    const light = getTrafficLight(m);
    acc[light] = (acc[light] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getTotalEBITDAImpact = () => {
    return metrics.reduce((sum, metric) => sum + (metric.ebitdaImpact || 0), 0);
  };

  const getStatusColor = (status: KPIMetric['status']) => {
    switch (status) {
      case 'Achieved': return 'text-green-400';
      case 'On Track': return 'text-blue-400';
      case 'At Risk': return 'text-yellow-400';
      case 'Behind': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const exportMetrics = () => {
    const doc = `# KPIs and OKRs
Generated: ${new Date().toLocaleDateString()}
Total EBITDA Impact: $${getTotalEBITDAImpact().toLocaleString()}

## Key Performance Indicators (KPIs)
${metrics.filter(m => m.metricType === 'KPI').map(kpi => `
### ${kpi.metricName}
- **Category:** ${kpi.category}
- **Current:** ${kpi.currentValue} ${kpi.unitOfMeasure}
- **Target:** ${kpi.targetValue} ${kpi.unitOfMeasure}
- **Progress:** ${calculateProgress(kpi)}%
- **Status:** ${kpi.status}
- **Owner:** ${kpi.owner || 'Unassigned'}
- **Frequency:** ${kpi.measurementFrequency}
- **EBITDA Impact:** $${kpi.ebitdaImpact.toLocaleString()}
- **Valuation Impact:** ${kpi.valuationImpact}
- **Strategic Initiative:** ${kpi.strategicInitiativeLink || 'None'}
`).join('\n')}

## Objectives and Key Results (OKRs)
${metrics.filter(m => m.metricType === 'OKR').map(okr => `
### Objective: ${okr.metricName}
- **Owner:** ${okr.owner || 'Unassigned'}
- **Status:** ${okr.status}
- **Valuation Impact:** ${okr.valuationImpact}

**Key Results:**
${(keyResults[okr.id] || []).map((kr, i) => `
${i + 1}. ${kr.keyResult}
   - Progress: ${kr.currentProgress}%
   - Status: ${kr.status}
`).join('\n')}
`).join('\n')}`;

    const blob = new Blob([doc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KPIs-OKRs-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-white/70">Loading your value drivers...</div></div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">KPIs & Performance Dashboard</h1>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-2 py-0.5">
              <Sparkles className="w-3 h-3 mr-1" />
              ENHANCED
            </Badge>
          </div>
          <p className="text-white/70">Define, track, and optimize your value drivers — now with automatic traffic light scoring</p>
        </div>

        {/* Setup Section (Collapsible) */}
        <Card className="mb-8 bg-white/5 border-white/10">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setShowSetup(!showSetup)}
          >
            <div className="flex items-center gap-3">
              <Edit3 className="w-5 h-5 text-blue-400" />
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {metrics.length === 0 ? "Let's define your first value drivers" : "Edit Metrics"}
                </h2>
                <p className="text-white/70 text-sm">
                  {metrics.length === 0 
                    ? "Start by creating KPIs and OKRs that drive your business value"
                    : `${metrics.length} metrics defined • Click to modify`
                  }
                </p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-white/70 transition-transform ${showSetup ? 'rotate-180' : ''}`} />
          </div>
          
          {showSetup && (
            <div className="px-6 pb-6 border-t border-white/10">
              {/* Total EBITDA Impact */}
              {getTotalEBITDAImpact() > 0 && (
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-300">
                    <BarChart3 className="w-4 h-4 inline mr-1" />
                    Total EBITDA Impact: <span className="font-bold">${getTotalEBITDAImpact().toLocaleString()}</span>
                  </p>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="flex items-center gap-4 mt-6 mb-6">
                <div className="grid grid-cols-2 gap-2 w-64">
                  <Button
                    onClick={() => setActiveTab('KPI')}
                    variant={activeTab === 'KPI' ? 'default' : 'outline'}
                    className={`h-12 ${
                      activeTab === 'KPI' 
                        ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
                        : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    KPIs ({metrics.filter(m => m.metricType === 'KPI').length})
                  </Button>
                  <Button
                    onClick={() => setActiveTab('OKR')}
                    variant={activeTab === 'OKR' ? 'default' : 'outline'}
                    className={`h-12 ${
                      activeTab === 'OKR' 
                        ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
                        : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    OKRs ({metrics.filter(m => m.metricType === 'OKR').length})
                  </Button>
                </div>
                <Button
                  onClick={() => setShowTemplates(!showTemplates)}
                  variant="outline"
                  className="ml-auto bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                >
                  PE Value Drivers
                </Button>
              </div>

              {/* Templates */}
              {showTemplates && (
                <div className="mb-6 space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h3 className="text-white font-semibold mb-3">Core PE Value Drivers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {peValueDriverTemplates.map((template, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            addMetric('KPI', template);
                            setShowTemplates(false);
                          }}
                          className="text-left p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                        >
                          <p className="text-white text-sm font-medium">{template.metricName}</p>
                          <p className="text-white/60 text-xs">Target: {template.targetValue} {template.unitOfMeasure}</p>
                          {template.ebitdaImpact > 0 && (
                            <p className="text-green-400 text-xs mt-1">+${template.ebitdaImpact.toLocaleString()} EBITDA</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h3 className="text-white font-semibold mb-1">Financial Health KPIs</h3>
                    <p className="text-white/50 text-xs mb-3">From PE portfolio monitoring frameworks — the metrics PE firms track after acquisition</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {peFinancialTemplates.map((template, index) => (
                        <button
                          key={`fin-${index}`}
                          onClick={() => {
                            addMetric('KPI', template);
                            setShowTemplates(false);
                          }}
                          className="text-left p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                        >
                          <p className="text-white text-sm font-medium">{template.metricName}</p>
                          <p className="text-white/60 text-xs">Target: {template.targetValue.toLocaleString()} {template.unitOfMeasure}</p>
                          <p className="text-blue-400 text-xs mt-1">{template.category} • {template.valuationImpact} Impact</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Add buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
                <Button 
                  onClick={() => addMetric('KPI')}
                  className="bg-blue-500 hover:bg-blue-600 text-white h-12"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add KPI
                </Button>
                <Button 
                  onClick={() => addMetric('OKR')}
                  className="bg-blue-500 hover:bg-blue-600 text-white h-12"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add OKR
                </Button>
              </div>

              {/* Metrics editing section */}
              {metrics.length > 0 && (
                <div className="space-y-3 mb-6">
                  {metrics.filter(m => m.metricType === activeTab).map((metric) => (
                    <div key={metric.id} className="bg-white/[0.03] rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <input
                          type="text"
                          value={metric.metricName}
                          onChange={(e) => updateMetric(metric.id, { metricName: e.target.value })}
                          className="text-lg font-semibold bg-transparent border-b border-white/20 text-white mb-2 flex-1"
                          placeholder="Metric Name"
                        />
                        <button
                          onClick={() => removeMetric(metric.id)}
                          className="text-red-400 hover:text-red-300 ml-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-white/60">Current Value</label>
                          <input
                            type="number"
                            value={metric.currentValue}
                            onChange={(e) => updateMetric(metric.id, { currentValue: Number(e.target.value) })}
                            className="w-full bg-white/[0.03] border border-white/20 text-white p-2 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/60">Target Value</label>
                          <input
                            type="number"
                            value={metric.targetValue}
                            onChange={(e) => updateMetric(metric.id, { targetValue: Number(e.target.value) })}
                            className="w-full bg-white/[0.03] border border-white/20 text-white p-2 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/60">Unit</label>
                          <input
                            type="text"
                            value={metric.unitOfMeasure}
                            onChange={(e) => updateMetric(metric.id, { unitOfMeasure: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/20 text-white p-2 rounded text-sm"
                            placeholder="%,$,etc"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <label className="text-xs text-white/60">Owner</label>
                          <input
                            type="text"
                            value={metric.owner || ''}
                            onChange={(e) => updateMetric(metric.id, { owner: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/20 text-white p-2 rounded text-sm"
                            placeholder="Responsible person"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/60">Department</label>
                          <input
                            type="text"
                            value={metric.department || ''}
                            onChange={(e) => updateMetric(metric.id, { department: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/20 text-white p-2 rounded text-sm"
                            placeholder="e.g., Sales, Marketing"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Save buttons */}
              <div className="flex gap-4 justify-end">
                <Button
                  onClick={() => {
                    saveMetrics();
                    setIsEditing(false);
                  }}
                  disabled={saving}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {saving ? 'Saving...' : 'Save Metrics'}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Dashboard Section - Only show if there are real metrics */}
        {metrics.length > 0 ? (
          <div className="space-y-8">
            {/* Traffic Light Summary Bar */}
            <Card className="bg-white/5 border-white/10 p-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6">
                  {(trafficCounts['green'] || 0) > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      <span className="text-green-400 font-bold text-lg">{trafficCounts['green']}</span>
                      <span className="text-white/50 text-sm">On Track</span>
                    </div>
                  )}
                  {(trafficCounts['yellow'] || 0) > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                      <span className="text-yellow-400 font-bold text-lg">{trafficCounts['yellow']}</span>
                      <span className="text-white/50 text-sm">Caution</span>
                    </div>
                  )}
                  {(trafficCounts['red'] || 0) > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                      <span className="text-red-400 font-bold text-lg">{trafficCounts['red']}</span>
                      <span className="text-white/50 text-sm">Needs Attention</span>
                    </div>
                  )}
                  {(trafficCounts['gray'] || 0) > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-gray-500" />
                      <span className="text-gray-400 font-bold text-lg">{trafficCounts['gray']}</span>
                      <span className="text-white/50 text-sm">Not Started</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-xs">Overall Progress</p>
                  <p className="text-white font-bold text-lg">
                    {Math.round(metrics.reduce((acc, m) => acc + calculateProgress(m), 0) / metrics.length)}%
                  </p>
                </div>
              </div>
            </Card>

            {/* Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total KPIs</p>
                    <p className="text-3xl font-bold text-primary">
                      {metrics.filter(m => m.metricType === 'KPI').length}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active OKRs</p>
                    <p className="text-3xl font-bold text-primary">
                      {metrics.filter(m => m.metricType === 'OKR').length}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-primary" />
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">EBITDA Impact</p>
                    <p className="text-3xl font-bold text-primary">
                      ${getTotalEBITDAImpact() > 0 ? (getTotalEBITDAImpact() / 1000000).toFixed(1) + 'M' : '0'}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
              </Card>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Performance Gauges
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {metrics.slice(0, 4).map((metric) => (
                    <div key={metric.id} className="text-center">
                      <SimpleGauge
                        value={calculateProgress(metric)}
                        label={metric.metricName || 'Untitled Metric'}
                        status={getTrafficLight(metric)}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Metrics Overview
                </h3>
                <div className="space-y-4">
                  {metrics.slice(0, 5).map((metric) => {
                    const light = getTrafficLight(metric);
                    const colors = getTrafficLightColors(light);
                    return (
                      <div key={metric.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${colors.dot}`} />
                          <div>
                            <p className="font-medium">{metric.metricName || 'Untitled Metric'}</p>
                            <p className="text-sm text-muted-foreground">
                              {metric.currentValue.toLocaleString()} / {metric.targetValue.toLocaleString()} {metric.unitOfMeasure}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${colors.text}`}>
                            {calculateProgress(metric)}%
                          </p>
                          <p className={`text-xs ${colors.text}`}>{getTrafficLightLabel(light)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Action Focus Section — Red flags first, then Yellow */}
            <Card className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Action Focus
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...metrics]
                  .filter(m => {
                    const light = getTrafficLight(m);
                    return light === 'red' || light === 'yellow';
                  })
                  .sort((a, b) => {
                    // Red items first, then yellow
                    const order = { red: 0, yellow: 1, green: 2, gray: 3 };
                    return order[getTrafficLight(a)] - order[getTrafficLight(b)];
                  })
                  .slice(0, 6)
                  .map((metric) => {
                    const light = getTrafficLight(metric);
                    const colors = getTrafficLightColors(light);
                    return (
                      <div key={metric.id} className={`p-4 ${colors.bg} border ${colors.border} rounded-lg`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                          <span className={`text-sm font-medium ${colors.text}`}>{getTrafficLightLabel(light)}</span>
                        </div>
                        <p className="font-semibold">{metric.metricName || 'Untitled Metric'}</p>
                        <p className="text-sm text-muted-foreground">
                          {calculateProgress(metric)}% of target ({metric.currentValue.toLocaleString()} / {metric.targetValue.toLocaleString()} {metric.unitOfMeasure})
                        </p>
                        <div className="mt-2">
                          <div className={`w-full ${light === 'red' ? 'bg-red-900/20' : 'bg-yellow-900/20'} rounded-full h-2`}>
                            <div
                              className={`${colors.dot} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${calculateProgress(metric)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {metrics.filter(m => {
                  const light = getTrafficLight(m);
                  return light === 'red' || light === 'yellow';
                }).length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>All metrics are on track! No items need attention.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ) : (
          // Empty state when no metrics exist
          <Card className="glass-card p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No KPIs or OKRs Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your performance by adding your first KPI or OKR above.
            </p>
            <Button 
              onClick={() => setShowSetup(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
