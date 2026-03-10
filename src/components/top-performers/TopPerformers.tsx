
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ChevronLeft, AlertTriangle, Users, Shield, DollarSign, TrendingUp, Trash2, Edit } from 'lucide-react';

interface Performer {
  id: string;
  name: string;
  title: string;
  revenue: number;
  tenure: number;
  clientRelationships: string;
  replaceTime: string;
  flightRisk: 'low' | 'medium' | 'high';
  retentionPlan: string;
  compensation: number;
  lastRaise: string;
  competitorTarget: boolean;
  criticalKnowledge: string;
}

// Utility functions
const parseNumber = (value: string): number => {
  const n = Number(value.replace(/[,$\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const formatCurrency = (n: number, decimals: number = 0): string => {
  return n.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0
  });
};

const formatMillions = (n: number): string => {
  return `$${(n / 1000000).toFixed(1)}M`;
};

// Component definitions
function IntroPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        Your Top Performers ARE the Business
      </h2>
      
      <Card className="bg-destructive/10 border-destructive/30 p-6">
        <p className="text-destructive font-semibold mb-2">Critical Truth:</p>
        <p className="text-foreground">
          PE doesn't buy YOU - they buy your top performers. If your #3 producer leaves 6 months 
          post-close, you just lost millions in earnout. If you forget to disclose #11 who's actually 
          now #9, you've broken reps and warranties.
        </p>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <Users className="w-8 h-8 text-primary mb-3" />
          <h3 className="text-xl font-semibold mb-3">Why PE Cares</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Top 10 often = 60-80% of revenue</li>
            <li>• They own the client relationships</li>
            <li>• First 2 years success depends on them</li>
            <li>• One departure can tank the earnout</li>
            <li>• They're the actual value being bought</li>
          </ul>
        </Card>
        
        <Card className="p-6 bg-card border-border">
          <AlertTriangle className="w-8 h-8 text-destructive mb-3" />
          <h3 className="text-xl font-semibold mb-3">Disclosure Traps</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Missing someone breaks warranties</li>
            <li>• Rankings change monthly - track it</li>
            <li>• #11-15 could be tomorrow's top 10</li>
            <li>• "Material" = anyone over 2% of revenue</li>
            <li>• Withholding = fraud accusation risk</li>
          </ul>
        </Card>
      </div>
      
      <Alert className="border-yellow-500/30 bg-yellow-500/10">
        <Shield className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-foreground">
          <strong>Protection Strategy:</strong> List your top 20 performers minimum. If #11-13 are within 
          5% of #10's production, list them ALL. Better to over-disclose than face a warranty breach claim.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function DisclosurePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        What You MUST Disclose (Or Face Legal Action)
      </h2>
      
      <Alert className="border-destructive/30">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Legal Reality:</strong> "Material omission" in M&A = fraud. If you forget someone who 
          matters and they leave, PE can claw back millions claiming you hid information.
        </AlertDescription>
      </Alert>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-semibold mb-4">Required Disclosures per Performer</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-l-primary pl-4">
            <h4 className="font-semibold">Production Metrics</h4>
            <p className="text-sm text-muted-foreground">
              Last 3 years revenue, client count, average deal size, growth trajectory
            </p>
          </div>
          
          <div className="border-l-4 border-l-primary pl-4">
            <h4 className="font-semibold">Compensation History</h4>
            <p className="text-sm text-muted-foreground">
              Base, commission, bonuses, last raise date, any promised increases
            </p>
          </div>
          
          <div className="border-l-4 border-l-primary pl-4">
            <h4 className="font-semibold">Client Relationships</h4>
            <p className="text-sm text-muted-foreground">
              Which major accounts they control, personal relationships that could walk
            </p>
          </div>
          
          <div className="border-l-4 border-l-primary pl-4">
            <h4 className="font-semibold">Flight Risk Factors</h4>
            <p className="text-sm text-muted-foreground">
              Competitor approaches, retirement timeline, family situations, dissatisfaction
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 bg-yellow-500/10 border-yellow-500/30">
        <h3 className="text-xl font-semibold mb-3">The "Close Enough" Rule</h3>
        <p className="text-foreground mb-3">
          If performers #11, #12, and #13 are within 10% of #10's production, LIST THEM ALL.
        </p>
        <div className="bg-card p-4 rounded-lg">
          <p className="text-sm font-mono">
            Example: #10 produces $2M, #11 produces $1.85M<br/>
            Difference: Only $150K (7.5%)<br/>
            Risk: #11 could be #9 next month<br/>
            Solution: Disclose top 15 minimum
          </p>
        </div>
      </Card>
    </div>
  );
}

function AddPerformersPage({ 
  performers, 
  setPerformers, 
  currentPerformer, 
  setCurrentPerformer 
}: {
  performers: any[];
  setPerformers: (performers: any[]) => void;
  currentPerformer: Partial<Performer>;
  setCurrentPerformer: (performer: Partial<Performer>) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const addPerformer = () => {
    if (!currentPerformer.name || !currentPerformer.revenue) return;
    
    const newPerformer: Performer = {
      id: crypto.randomUUID(),
      name: currentPerformer.name,
      title: currentPerformer.title || '',
      revenue: currentPerformer.revenue,
      tenure: currentPerformer.tenure || 0,
      clientRelationships: currentPerformer.clientRelationships || '',
      replaceTime: currentPerformer.replaceTime || '6-12 months',
      flightRisk: currentPerformer.flightRisk || 'medium',
      retentionPlan: currentPerformer.retentionPlan || '',
      compensation: currentPerformer.compensation || 0,
      lastRaise: currentPerformer.lastRaise || '',
      competitorTarget: currentPerformer.competitorTarget || false,
      criticalKnowledge: currentPerformer.criticalKnowledge || ''
    };
    
    if (editingId) {
      setPerformers(performers.map(p => p.id === editingId ? { ...newPerformer, id: editingId } : p));
      setEditingId(null);
    } else {
      setPerformers([...performers, newPerformer]);
    }
    
    setCurrentPerformer({});
  };
  
  const deletePerformer = (id: string) => {
    setPerformers(performers.filter(p => p.id !== id));
  };
  
  const editPerformer = (performer: Performer) => {
    setCurrentPerformer(performer);
    setEditingId(performer.id);
  };
  
  // Check proximity to top 10
  const top10Revenue = performers[9]?.revenue || 0;
  const proximityThreshold = top10Revenue * 0.9;
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        Add Your Revenue Producers
      </h2>
      
      <Alert className="border-yellow-500/30 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Critical:</strong> Add AT LEAST your top 20 producers. Include anyone generating 
          over 2% of revenue. When in doubt, add them. Under-disclosure = legal liability.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name*</Label>
          <Input
            id="name"
            value={currentPerformer.name || ''}
            onChange={(e) => setCurrentPerformer({...currentPerformer, name: e.target.value})}
            placeholder="John Smith"
          />
        </div>
        <div>
          <Label htmlFor="title">Title/Role</Label>
          <Input
            id="title"
            value={currentPerformer.title || ''}
            onChange={(e) => setCurrentPerformer({...currentPerformer, title: e.target.value})}
            placeholder="Senior Sales Rep"
          />
        </div>
        <div>
          <Label htmlFor="revenue">Annual Revenue Generated*</Label>
          <Input
            id="revenue"
            value={currentPerformer.revenue || ''}
            onChange={(e) => setCurrentPerformer({...currentPerformer, revenue: parseNumber(e.target.value)})}
            placeholder="2000000"
          />
        </div>
        <div>
          <Label htmlFor="compensation">Total Compensation</Label>
          <Input
            id="compensation"
            value={currentPerformer.compensation || ''}
            onChange={(e) => setCurrentPerformer({...currentPerformer, compensation: parseNumber(e.target.value)})}
            placeholder="250000"
          />
        </div>
      </div>
      
      <Button onClick={addPerformer} className="w-full">
        {editingId ? 'Update' : 'Add'} Performer
      </Button>
      
      {performers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">
            Your Top Performers ({performers.length} listed)
          </h3>
          {performers.slice(0, 20).map((p, i) => (
            <Card key={p.id} className="p-4 bg-card border-border">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-primary">#{i + 1}</span>
                  <span className="ml-3 font-semibold">{p.name}</span>
                  <span className="ml-2 text-sm text-muted-foreground">{p.title}</span>
                  {i >= 10 && i <= 14 && p.revenue >= proximityThreshold && (
                    <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded">
                      Within 10% of #10
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-bold">{formatMillions(p.revenue)}</p>
                    <p className="text-xs text-muted-foreground">annual revenue</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editPerformer(p)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePerformer(p.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RiskAssessmentPage({ 
  performers, 
  setPerformers 
}: {
  performers: any[];
  setPerformers: (performers: any[]) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (performers.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">No Performers to Assess</h2>
        <p>Please go back and add your top performers first.</p>
      </div>
    );
  }
  
  const currentPerformer = performers[currentIndex];
  
  const updateRisk = (field: keyof Performer, value: any) => {
    const updated = performers.map((p, i) => 
      i === currentIndex ? { ...p, [field]: value } : p
    );
    setPerformers(updated);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">
          Risk Assessment: {currentPerformer.name}
        </h2>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {performers.length}
        </span>
      </div>
      
      <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Rank</p>
            <p className="text-2xl font-bold">#{currentIndex + 1}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Revenue</p>
            <p className="text-2xl font-bold">{formatMillions(currentPerformer.revenue)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tenure</p>
            <p className="text-2xl font-bold">{currentPerformer.tenure} years</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Flight Risk Assessment</h3>
        <div className="space-y-4">
          <div>
            <Label>Overall Flight Risk</Label>
            <div className="flex gap-3 mt-2">
              {(['low', 'medium', 'high'] as const).map(risk => (
                <Button
                  key={risk}
                  variant={currentPerformer.flightRisk === risk ? 'default' : 'outline'}
                  onClick={() => updateRisk('flightRisk', risk)}
                  className="flex-1"
                >
                  {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label>Time to Replace</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['1-3 months', '3-6 months', '6-12 months', '12+ months'].map(time => (
                <Button
                  key={time}
                  variant={currentPerformer.replaceTime === time ? 'default' : 'outline'}
                  onClick={() => updateRisk('replaceTime', time)}
                  size="sm"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label>Being Recruited by Competitors?</Label>
            <div className="flex gap-3 mt-2">
              <Button
                variant={currentPerformer.competitorTarget ? 'default' : 'outline'}
                onClick={() => updateRisk('competitorTarget', true)}
                className="flex-1"
              >
                Yes - Known Approaches
              </Button>
              <Button
                variant={!currentPerformer.competitorTarget ? 'default' : 'outline'}
                onClick={() => updateRisk('competitorTarget', false)}
                className="flex-1"
              >
                No / Unknown
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          Previous Performer
        </Button>
        
        <Button
          onClick={() => setCurrentIndex(Math.min(performers.length - 1, currentIndex + 1))}
          disabled={currentIndex >= performers.length - 1}
        >
          Next Performer
        </Button>
      </div>
    </div>
  );
}

function RetentionPage({ 
  performers, 
  setPerformers 
}: {
  performers: any[];
  setPerformers: (performers: any[]) => void;
}) {
  const highRisk = performers.filter(p => p.flightRisk === 'high').slice(0, 10);
  const mediumRisk = performers.filter(p => p.flightRisk === 'medium').slice(0, 10);
  
  const totalRetentionCost = performers.slice(0, 10).reduce((sum, p) => {
    const multiplier = p.flightRisk === 'high' ? 0.2 : 
                      p.flightRisk === 'medium' ? 0.15 : 0.1;
    return sum + (p.compensation * multiplier);
  }, 0);
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        Retention Strategy Calculator
      </h2>
      
      <Alert className="border-yellow-500/30 bg-yellow-500/10">
        <DollarSign className="h-4 w-4" />
        <AlertDescription>
          <strong>Math Reality:</strong> Retention bonuses cost 10-20% of annual comp. 
          Replacing someone costs 150-200% of annual comp. Plus earnout impact. Do the math.
        </AlertDescription>
      </Alert>
      
      {highRisk.length > 0 && (
        <Card className="p-6 border-l-4 border-l-destructive bg-card">
          <h3 className="text-xl font-semibold mb-4 text-destructive">
            🚨 High Risk - Immediate Action Required
          </h3>
          {highRisk.map((p, i) => {
            const retentionBonus = p.compensation * 0.2;
            const replacementCost = p.compensation * 1.5;
            const earnoutRisk = p.revenue * 0.2;
            
            return (
              <div key={p.id} className="mb-4 p-4 bg-destructive/5 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">#{i + 1} {p.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatMillions(p.revenue)} revenue | {p.replaceTime} to replace
                    </p>
                  </div>
                  <span className="text-destructive font-bold">HIGH RISK</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Retention Cost</p>
                    <p className="font-bold text-primary">{formatCurrency(retentionBonus)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Replacement Cost</p>
                    <p className="font-bold text-destructive">{formatCurrency(replacementCost)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Earnout at Risk</p>
                    <p className="font-bold text-destructive">{formatMillions(earnoutRisk)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      )}
      
      <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <h3 className="text-xl font-semibold mb-4">Total Retention Investment</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Retention Bonuses Needed</p>
            <p className="text-3xl font-bold text-primary">{formatMillions(totalRetentionCost)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Protected Earnout Value</p>
            <p className="text-3xl font-bold text-primary">
              {formatMillions(performers.slice(0, 10).reduce((sum, p) => sum + (p.revenue * 0.2), 0))}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ReportPage({ performers }: { performers: any[] }) {
  const top10 = performers.slice(0, 10);
  const totalRevenue = performers.reduce((sum, p) => sum + p.revenue, 0);
  const top10Revenue = top10.reduce((sum, p) => sum + p.revenue, 0);
  const concentration = totalRevenue > 0 ? (top10Revenue / totalRevenue) * 100 : 0;
  
  const highRiskCount = top10.filter(p => p.flightRisk === 'high').length;
  
  const exportCSV = () => {
    const headers = ['Rank', 'Name', 'Title', 'Revenue', 'Risk', 'Compensation'];
    const rows = performers.map((p, i) => [
      i + 1,
      p.name,
      p.title,
      p.revenue,
      p.flightRisk,
      p.compensation
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'top-performers.csv';
    a.click();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">
          Top Performer Protection Report
        </h2>
        <Button onClick={exportCSV} variant="outline">
          Export CSV
        </Button>
      </div>
      
      <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Top 10 Revenue</p>
            <p className="text-3xl font-bold">{concentration.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">of total</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">High Risk</p>
            <p className="text-3xl font-bold text-destructive">{highRiskCount}</p>
            <p className="text-xs text-muted-foreground">performers</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Listed</p>
            <p className="text-3xl font-bold text-primary">{performers.length}</p>
            <p className="text-xs text-muted-foreground">performers</p>
          </div>
        </div>
      </Card>
      
      <Alert className="border-primary">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Legal Protection:</strong> You've disclosed {performers.length} performers. 
          This comprehensive disclosure protects you from warranty breach claims if rankings shift.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Static page definitions
const PAGES = [
  { title: "Why PE Obsesses Over Your Top Performers", Component: IntroPage },
  { title: "Critical Disclosure Requirements", Component: DisclosurePage },
  { title: "Add ALL Top Performers (Top 20+)", Component: AddPerformersPage },
  { title: "Risk Assessment per Performer", Component: RiskAssessmentPage },
  { title: "Retention Strategy Builder", Component: RetentionPage },
  { title: "Your Performer Protection Report", Component: ReportPage }
] as const;

export const TopPerformers: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPerformer, setCurrentPerformer] = useState<Partial<Performer>>({});
  
  // Load from localStorage on mount
  const [performers, setPerformers] = useState<Performer[]>(() => {
    const saved = localStorage.getItem('top-performers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save to localStorage on change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('top-performers', JSON.stringify(performers));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [performers]);

  // Calculate ranks based on revenue
  const rankedPerformers = useMemo(() => {
    return [...performers]
      .sort((a, b) => b.revenue - a.revenue)
      .map((p, i) => ({ ...p, rank: i + 1 }));
  }, [performers]);

  // Check if can advance to next page
  const canAdvance = currentPage < 2 || rankedPerformers.length >= 10;
  
  const { Component } = PAGES[currentPage];
  
  return (
    <div>
      <div className="mb-8">
        <Progress value={(currentPage + 1) / PAGES.length * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Step {currentPage + 1} of {PAGES.length}</span>
          <span>{PAGES[currentPage].title}</span>
        </div>
      </div>
      
      <Card className="p-8 min-h-[600px] bg-card border-border">
        <Component 
          performers={rankedPerformers}
          setPerformers={setPerformers}
          currentPerformer={currentPerformer}
          setCurrentPerformer={setCurrentPerformer}
        />
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={() => setCurrentPage(Math.min(PAGES.length - 1, currentPage + 1))}
          disabled={currentPage === PAGES.length - 1 || !canAdvance}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      
      {currentPage === 2 && rankedPerformers.length < 10 && (
        <Alert className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Add at least 10 performers before proceeding to risk assessment.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TopPerformers;
