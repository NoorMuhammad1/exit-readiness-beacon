import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Download, ChevronRight, Save, Target, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Initiative {
  id: string;
  initiative: string;
  owner: string;
  timeline: string;
  metrics: string;
  resources: string;
}

interface YearGoal {
  id: string;
  goal: string;
  category: 'Revenue' | 'Operations' | 'Market' | 'Team' | 'Product';
}

interface StrategyDocument {
  // Foundation
  visionStatement: string;
  missionStatement: string;
  coreValues: string[];
  
  // SWOT
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  
  // Timeline
  initiatives90Day: Initiative[];
  goals12Month: YearGoal[];
  goals24Month: YearGoal[];
  vision5Year: string;
  
  // Financials
  revenueProjections: number[];
  ebitdaProjections: number[];
}

const defaultStrategy: StrategyDocument = {
  visionStatement: '',
  missionStatement: '',
  coreValues: ['', '', ''],
  strengths: ['', '', ''],
  weaknesses: ['', '', ''],
  opportunities: ['', '', ''],
  threats: ['', '', ''],
  initiatives90Day: [],
  goals12Month: [],
  goals24Month: [],
  vision5Year: '',
  revenueProjections: [0, 0, 0, 0, 0],
  ebitdaProjections: [0, 0, 0, 0, 0]
};

export default function StrategyDocBuilderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [strategy, setStrategy] = useState<StrategyDocument>(defaultStrategy);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'foundation' | 'swot' | 'roadmap' | 'financials'>('foundation');

  useEffect(() => {
    loadStrategy();
  }, [user]);

  const loadStrategy = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("strategy_documents")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setStrategy({
          visionStatement: data.vision_statement || '',
          missionStatement: data.mission_statement || '',
          coreValues: (Array.isArray(data.core_values) ? data.core_values : []) as string[],
          strengths: (Array.isArray(data.strengths) ? data.strengths : []) as string[],
          weaknesses: (Array.isArray(data.weaknesses) ? data.weaknesses : []) as string[],
          opportunities: (Array.isArray(data.opportunities) ? data.opportunities : []) as string[],
          threats: (Array.isArray(data.threats) ? data.threats : []) as string[],
          initiatives90Day: (Array.isArray(data.initiatives_90_day) ? data.initiatives_90_day : []) as unknown as Initiative[],
          goals12Month: (Array.isArray(data.goals_12_month) ? data.goals_12_month : []) as unknown as YearGoal[],
          goals24Month: (Array.isArray(data.goals_24_month) ? data.goals_24_month : []) as unknown as YearGoal[],
          vision5Year: data.vision_5_year || '',
          revenueProjections: [
            data.revenue_year1 || 0,
            data.revenue_year2 || 0,
            data.revenue_year3 || 0,
            data.revenue_year4 || 0,
            data.revenue_year5 || 0
          ],
          ebitdaProjections: [
            data.ebitda_year1 || 0,
            data.ebitda_year2 || 0,
            data.ebitda_year3 || 0,
            data.ebitda_year4 || 0,
            data.ebitda_year5 || 0
          ]
        });
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveStrategy = async () => {
    if (!user || saving) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("strategy_documents")
        .upsert({
          user_id: user.id,
          vision_statement: strategy.visionStatement,
          mission_statement: strategy.missionStatement,
          core_values: strategy.coreValues.filter(v => v),
          strengths: strategy.strengths.filter(s => s),
          weaknesses: strategy.weaknesses.filter(w => w),
          opportunities: strategy.opportunities.filter(o => o),
          threats: strategy.threats.filter(t => t),
          initiatives_90_day: strategy.initiatives90Day,
          goals_12_month: strategy.goals12Month,
          goals_24_month: strategy.goals24Month,
          vision_5_year: strategy.vision5Year,
          revenue_year1: strategy.revenueProjections[0],
          revenue_year2: strategy.revenueProjections[1],
          revenue_year3: strategy.revenueProjections[2],
          revenue_year4: strategy.revenueProjections[3],
          revenue_year5: strategy.revenueProjections[4],
          ebitda_year1: strategy.ebitdaProjections[0],
          ebitda_year2: strategy.ebitdaProjections[1],
          ebitda_year3: strategy.ebitdaProjections[2],
          ebitda_year4: strategy.ebitdaProjections[3],
          ebitda_year5: strategy.ebitdaProjections[4],
          last_saved: new Date().toISOString()
        } as any);
        
      if (error) throw error;
      toast.success("Strategy document saved!");
    } catch (err) {
      toast.error("Failed to save strategy");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const exportStrategy = () => {
    const doc = `# Strategic Plan
Generated: ${new Date().toLocaleDateString()}

## Executive Summary

### Vision Statement
${strategy.visionStatement || '[Not provided]'}

### Mission Statement
${strategy.missionStatement || '[Not provided]'}

### Core Values
${strategy.coreValues.filter(v => v).map(v => `- ${v}`).join('\n') || '[Not provided]'}

## SWOT Analysis

### Strengths
${strategy.strengths.filter(s => s).map(s => `- ${s}`).join('\n') || '[Not provided]'}

### Weaknesses
${strategy.weaknesses.filter(w => w).map(w => `- ${w}`).join('\n') || '[Not provided]'}

### Opportunities
${strategy.opportunities.filter(o => o).map(o => `- ${o}`).join('\n') || '[Not provided]'}

### Threats
${strategy.threats.filter(t => t).map(t => `- ${t}`).join('\n') || '[Not provided]'}

## Strategic Roadmap

### 90-Day Initiatives
${strategy.initiatives90Day.map((init, i) => `
#### Initiative ${i + 1}: ${init.initiative}
- Owner: ${init.owner}
- Timeline: ${init.timeline}
- Success Metrics: ${init.metrics}
- Resources Needed: ${init.resources}
`).join('\n') || '[Not provided]'}

### 12-Month Goals
${strategy.goals12Month.map(g => `- [${g.category}] ${g.goal}`).join('\n') || '[Not provided]'}

### 24-Month Goals
${strategy.goals24Month.map(g => `- [${g.category}] ${g.goal}`).join('\n') || '[Not provided]'}

### 5-Year Vision
${strategy.vision5Year || '[Not provided]'}

## Financial Projections

### Revenue Projections
- Year 1: $${strategy.revenueProjections[0].toLocaleString()}
- Year 2: $${strategy.revenueProjections[1].toLocaleString()}
- Year 3: $${strategy.revenueProjections[2].toLocaleString()}
- Year 4: $${strategy.revenueProjections[3].toLocaleString()}
- Year 5: $${strategy.revenueProjections[4].toLocaleString()}

### EBITDA Projections
- Year 1: $${strategy.ebitdaProjections[0].toLocaleString()}
- Year 2: $${strategy.ebitdaProjections[1].toLocaleString()}
- Year 3: $${strategy.ebitdaProjections[2].toLocaleString()}
- Year 4: $${strategy.ebitdaProjections[3].toLocaleString()}
- Year 5: $${strategy.ebitdaProjections[4].toLocaleString()}
`;

    const blob = new Blob([doc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Strategic-Plan-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-white/70">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Strategy Document Builder</h1>
          <p className="text-white/70">Create a comprehensive strategic plan for your business exit</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('foundation')}
            className={`px-6 py-3 rounded-lg transition whitespace-nowrap ${
              activeTab === 'foundation' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Foundation
          </button>
          <button
            onClick={() => setActiveTab('swot')}
            className={`px-6 py-3 rounded-lg transition whitespace-nowrap ${
              activeTab === 'swot' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            SWOT Analysis
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-6 py-3 rounded-lg transition whitespace-nowrap ${
              activeTab === 'roadmap' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Strategic Roadmap
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-6 py-3 rounded-lg transition whitespace-nowrap ${
              activeTab === 'financials' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Financial Projections
          </button>
        </div>

        {/* Foundation Tab */}
        {activeTab === 'foundation' && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">Vision Statement</h2>
              <p className="text-sm text-white/60 mb-3">Where do you see your company in 5-10 years?</p>
              <textarea
                value={strategy.visionStatement}
                onChange={(e) => setStrategy({ ...strategy, visionStatement: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white resize-none"
                rows={3}
                placeholder="e.g., To be the leading provider of sustainable HVAC solutions in the Southeast, recognized for innovation and exceptional service..."
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">Mission Statement</h2>
              <p className="text-sm text-white/60 mb-3">What is your company's purpose and how do you serve customers?</p>
              <textarea
                value={strategy.missionStatement}
                onChange={(e) => setStrategy({ ...strategy, missionStatement: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white resize-none"
                rows={3}
                placeholder="e.g., We deliver energy-efficient climate control solutions that improve comfort and reduce environmental impact..."
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">Core Values</h2>
              <p className="text-sm text-white/60 mb-3">What principles guide your company's decisions and culture?</p>
              <div className="space-y-3">
                {strategy.coreValues.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    value={value}
                    onChange={(e) => {
                      const newValues = [...strategy.coreValues];
                      newValues[index] = e.target.value;
                      setStrategy({ ...strategy, coreValues: newValues });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                    placeholder={`Core value ${index + 1}`}
                  />
                ))}
                {strategy.coreValues.length < 5 && (
                  <button
                    onClick={() => setStrategy({ ...strategy, coreValues: [...strategy.coreValues, ''] })}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Add another value
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SWOT Tab */}
        {activeTab === 'swot' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Strengths</h2>
              </div>
              <p className="text-sm text-white/60 mb-3">Internal advantages and assets</p>
              <div className="space-y-2">
                {strategy.strengths.map((strength, index) => (
                  <input
                    key={index}
                    type="text"
                    value={strength}
                    onChange={(e) => {
                      const newStrengths = [...strategy.strengths];
                      newStrengths[index] = e.target.value;
                      setStrategy({ ...strategy, strengths: newStrengths });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="e.g., Strong customer relationships"
                  />
                ))}
                {strategy.strengths.length < 5 && (
                  <button
                    onClick={() => setStrategy({ ...strategy, strengths: [...strategy.strengths, ''] })}
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    + Add strength
                  </button>
                )}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h2 className="text-xl font-semibold text-white">Weaknesses</h2>
              </div>
              <p className="text-sm text-white/60 mb-3">Internal limitations to address</p>
              <div className="space-y-2">
                {strategy.weaknesses.map((weakness, index) => (
                  <input
                    key={index}
                    type="text"
                    value={weakness}
                    onChange={(e) => {
                      const newWeaknesses = [...strategy.weaknesses];
                      newWeaknesses[index] = e.target.value;
                      setStrategy({ ...strategy, weaknesses: newWeaknesses });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="e.g., Limited geographic presence"
                  />
                ))}
                {strategy.weaknesses.length < 5 && (
                  <button
                    onClick={() => setStrategy({ ...strategy, weaknesses: [...strategy.weaknesses, ''] })}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    + Add weakness
                  </button>
                )}
              </div>
            </div>

            {/* Opportunities */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Opportunities</h2>
              </div>
              <p className="text-sm text-white/60 mb-3">External factors to capitalize on</p>
              <div className="space-y-2">
                {strategy.opportunities.map((opportunity, index) => (
                  <input
                    key={index}
                    type="text"
                    value={opportunity}
                    onChange={(e) => {
                      const newOpportunities = [...strategy.opportunities];
                      newOpportunities[index] = e.target.value;
                      setStrategy({ ...strategy, opportunities: newOpportunities });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="e.g., Growing demand for green technology"
                  />
                ))}
                {strategy.opportunities.length < 5 && (
                  <button
                    onClick={() => setStrategy({ ...strategy, opportunities: [...strategy.opportunities, ''] })}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Add opportunity
                  </button>
                )}
              </div>
            </div>

            {/* Threats */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">Threats</h2>
              </div>
              <p className="text-sm text-white/60 mb-3">External risks to mitigate</p>
              <div className="space-y-2">
                {strategy.threats.map((threat, index) => (
                  <input
                    key={index}
                    type="text"
                    value={threat}
                    onChange={(e) => {
                      const newThreats = [...strategy.threats];
                      newThreats[index] = e.target.value;
                      setStrategy({ ...strategy, threats: newThreats });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="e.g., New environmental regulations"
                  />
                ))}
                {strategy.threats.length < 5 && (
                  <button
                    onClick={() => setStrategy({ ...strategy, threats: [...strategy.threats, ''] })}
                    className="text-yellow-400 hover:text-yellow-300 text-sm"
                  >
                    + Add threat
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Roadmap Tab */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            {/* 90-Day Initiatives */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">90-Day Initiatives</h2>
              <div className="space-y-4">
                {strategy.initiatives90Day.map((initiative) => (
                  <div key={initiative.id} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/70 mb-1">Initiative Name</label>
                        <input
                          type="text"
                          value={initiative.initiative}
                          onChange={(e) => {
                            const updated = strategy.initiatives90Day.map(i =>
                              i.id === initiative.id ? { ...i, initiative: e.target.value } : i
                            );
                            setStrategy({ ...strategy, initiatives90Day: updated });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-1">Owner</label>
                        <input
                          type="text"
                          value={initiative.owner}
                          onChange={(e) => {
                            const updated = strategy.initiatives90Day.map(i =>
                              i.id === initiative.id ? { ...i, owner: e.target.value } : i
                            );
                            setStrategy({ ...strategy, initiatives90Day: updated });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-1">Timeline</label>
                        <input
                          type="text"
                          value={initiative.timeline}
                          onChange={(e) => {
                            const updated = strategy.initiatives90Day.map(i =>
                              i.id === initiative.id ? { ...i, timeline: e.target.value } : i
                            );
                            setStrategy({ ...strategy, initiatives90Day: updated });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-1">Success Metrics</label>
                        <input
                          type="text"
                          value={initiative.metrics}
                          onChange={(e) => {
                            const updated = strategy.initiatives90Day.map(i =>
                              i.id === initiative.id ? { ...i, metrics: e.target.value } : i
                            );
                            setStrategy({ ...strategy, initiatives90Day: updated });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setStrategy({
                          ...strategy,
                          initiatives90Day: strategy.initiatives90Day.filter(i => i.id !== initiative.id)
                        });
                      }}
                      className="mt-3 text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove Initiative
                    </button>
                  </div>
                ))}
                {strategy.initiatives90Day.length < 5 && (
                  <button
                    onClick={() => {
                      setStrategy({
                        ...strategy,
                        initiatives90Day: [...strategy.initiatives90Day, {
                          id: crypto.randomUUID(),
                          initiative: '',
                          owner: '',
                          timeline: '',
                          metrics: '',
                          resources: ''
                        }]
                      });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 text-white/70 hover:bg-white/10 transition"
                  >
                    <Plus className="w-5 h-5 inline mr-2" /> Add 90-Day Initiative
                  </button>
                )}
              </div>
            </div>

            {/* 12-Month Goals */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">12-Month Goals</h2>
              <div className="space-y-3">
                {strategy.goals12Month.map((goal) => (
                  <div key={goal.id} className="flex gap-3">
                    <select
                      value={goal.category}
                      onChange={(e) => {
                        const updated = strategy.goals12Month.map(g =>
                          g.id === goal.id ? { ...g, category: e.target.value as YearGoal['category'] } : g
                        );
                        setStrategy({ ...strategy, goals12Month: updated });
                      }}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="Revenue">Revenue</option>
                      <option value="Operations">Operations</option>
                      <option value="Market">Market</option>
                      <option value="Team">Team</option>
                      <option value="Product">Product</option>
                    </select>
                    <input
                      type="text"
                      value={goal.goal}
                      onChange={(e) => {
                        const updated = strategy.goals12Month.map(g =>
                          g.id === goal.id ? { ...g, goal: e.target.value } : g
                        );
                        setStrategy({ ...strategy, goals12Month: updated });
                      }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="e.g., Expand into 2 new markets"
                    />
                    <button
                      onClick={() => {
                        setStrategy({
                          ...strategy,
                          goals12Month: strategy.goals12Month.filter(g => g.id !== goal.id)
                        });
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setStrategy({
                      ...strategy,
                      goals12Month: [...strategy.goals12Month, {
                        id: crypto.randomUUID(),
                        goal: '',
                        category: 'Revenue'
                      }]
                    });
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + Add 12-month goal
                </button>
              </div>
            </div>

            {/* 24-Month Goals */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">24-Month Goals</h2>
              <div className="space-y-3">
                {strategy.goals24Month.map((goal) => (
                  <div key={goal.id} className="flex gap-3">
                    <select
                      value={goal.category}
                      onChange={(e) => {
                        const updated = strategy.goals24Month.map(g =>
                          g.id === goal.id ? { ...g, category: e.target.value as YearGoal['category'] } : g
                        );
                        setStrategy({ ...strategy, goals24Month: updated });
                      }}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="Revenue">Revenue</option>
                      <option value="Operations">Operations</option>
                      <option value="Market">Market</option>
                      <option value="Team">Team</option>
                      <option value="Product">Product</option>
                    </select>
                    <input
                      type="text"
                      value={goal.goal}
                      onChange={(e) => {
                        const updated = strategy.goals24Month.map(g =>
                          g.id === goal.id ? { ...g, goal: e.target.value } : g
                        );
                        setStrategy({ ...strategy, goals24Month: updated });
                      }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="e.g., Achieve market leadership in region"
                    />
                    <button
                      onClick={() => {
                        setStrategy({
                          ...strategy,
                          goals24Month: strategy.goals24Month.filter(g => g.id !== goal.id)
                        });
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setStrategy({
                      ...strategy,
                      goals24Month: [...strategy.goals24Month, {
                        id: crypto.randomUUID(),
                        goal: '',
                        category: 'Revenue'
                      }]
                    });
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + Add 24-month goal
                </button>
              </div>
            </div>

            {/* 5-Year Vision */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">5-Year Vision</h2>
              <p className="text-sm text-white/60 mb-3">Where will your company be in 5 years?</p>
              <textarea
                value={strategy.vision5Year}
                onChange={(e) => setStrategy({ ...strategy, vision5Year: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white resize-none"
                rows={4}
                placeholder="e.g., Regional market leader with $50M revenue, 200+ employees, and expansion into adjacent markets..."
              />
            </div>
          </div>
        )}

        {/* Financials Tab */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">Revenue Projections</h2>
              <p className="text-sm text-white/60 mb-4">Project your revenue for the next 5 years</p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((year, index) => (
                  <div key={year}>
                    <label className="block text-sm text-white/70 mb-1">Year {year}</label>
                    <input
                      type="number"
                      value={strategy.revenueProjections[index]}
                      onChange={(e) => {
                        const newProjections = [...strategy.revenueProjections];
                        newProjections[index] = Number(e.target.value);
                        setStrategy({ ...strategy, revenueProjections: newProjections });
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">EBITDA Projections</h2>
              <p className="text-sm text-white/60 mb-4">Project your EBITDA for the next 5 years</p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((year, index) => (
                  <div key={year}>
                    <label className="block text-sm text-white/70 mb-1">Year {year}</label>
                    <input
                      type="number"
                      value={strategy.ebitdaProjections[index]}
                      onChange={(e) => {
                        const newProjections = [...strategy.ebitdaProjections];
                        newProjections[index] = Number(e.target.value);
                        setStrategy({ ...strategy, ebitdaProjections: newProjections });
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((year, index) => {
                  const margin = strategy.revenueProjections[index] > 0 
                    ? ((strategy.ebitdaProjections[index] / strategy.revenueProjections[index]) * 100).toFixed(1)
                    : '0';
                  return (
                    <div key={year} className="text-center">
                      <p className="text-xs text-white/50">Margin</p>
                      <p className="text-sm text-blue-400">{margin}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={saveStrategy}
            disabled={saving}
            className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving..." : "Save Strategy Document"}
          </button>
          
          <button
            onClick={exportStrategy}
            className="bg-white/10 text-white py-3 px-6 rounded-lg hover:bg-white/20 transition flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export Document
          </button>
          
          <button
            onClick={() => navigate("/portal/week-2/kpis-okrs")}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
          >
            Next: KPIs & OKRs <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}