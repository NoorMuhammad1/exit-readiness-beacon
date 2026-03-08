
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  ChevronRight,
  ChevronLeft,
  Target,
  TrendingUp,
  Shield,
  AlertTriangle,
  Users,
  BarChart3,
  Layers,
  Crosshair,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────

interface MarketSizing {
  tam: string;
  sam: string;
  som: string;
  tamSource: string;
  growthRate: string;
}

type ForceLevel = '' | 'low' | 'medium' | 'high';

interface PorterForces {
  rivalry: ForceLevel;
  newEntrants: ForceLevel;
  substitutes: ForceLevel;
  buyerPower: ForceLevel;
  supplierPower: ForceLevel;
}

interface Competitor {
  name: string;
  qualityScore: number; // 1-10
  priceScore: number;   // 1-10
}

// ─── Intro Page ───────────────────────────────────────────────

const IntroPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-foreground">
      How PE Firms Evaluate Your Market
    </h2>

    <Alert className="border-primary/30 bg-primary/5">
      <Target className="h-4 w-4" />
      <AlertDescription>
        <span className="font-semibold">The PE perspective:</span> Before a PE firm invests in your company,
        they need to understand the market you operate in. A great company in a shrinking market is a bad investment.
        A good company in a growing market with weak competition is exactly what they're looking for.
      </AlertDescription>
    </Alert>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-5 bg-card border-border">
        <Layers className="w-8 h-8 text-blue-500 mb-3" />
        <h3 className="font-semibold text-lg mb-2">TAM / SAM / SOM</h3>
        <p className="text-sm text-muted-foreground">
          How big is your total market, how much can you realistically serve, and how much do you actually capture today?
        </p>
      </Card>
      <Card className="p-5 bg-card border-border">
        <Shield className="w-8 h-8 text-amber-500 mb-3" />
        <h3 className="font-semibold text-lg mb-2">Porter's Five Forces</h3>
        <p className="text-sm text-muted-foreground">
          What are the competitive dynamics that determine profitability in your industry?
        </p>
      </Card>
      <Card className="p-5 bg-card border-border">
        <Crosshair className="w-8 h-8 text-emerald-500 mb-3" />
        <h3 className="font-semibold text-lg mb-2">Competitive Positioning</h3>
        <p className="text-sm text-muted-foreground">
          Where does your company sit relative to competitors? What's your strategic differentiation?
        </p>
      </Card>
    </div>

    <Card className="p-5 bg-card border-border">
      <h3 className="font-semibold text-lg mb-3">Why This Matters for Your Valuation</h3>
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>&#x2022; <strong>Market leader</strong> in a growing niche = premium multiple (7-10x EBITDA)</p>
        <p>&#x2022; <strong>Strong player</strong> in a stable market = market multiple (5-7x EBITDA)</p>
        <p>&#x2022; <strong>Small player</strong> in a crowded market = discount (3-5x EBITDA)</p>
        <p>&#x2022; <strong>Any player</strong> in a shrinking market = hard to sell at any price</p>
      </div>
    </Card>

    <p className="text-muted-foreground text-sm">
      Complete the three frameworks on the following pages. Your combined analysis will show you — and any PE buyer — exactly where you stand in your market.
    </p>
  </div>
);

// ─── TAM/SAM/SOM Page ────────────────────────────────────────

const MarketSizingPage: React.FC<{
  sizing: MarketSizing;
  setSizing: React.Dispatch<React.SetStateAction<MarketSizing>>;
  markAnswered: () => void;
}> = ({ sizing, setSizing, markAnswered }) => {
  useEffect(() => {
    if (sizing.tam && sizing.sam && sizing.som) markAnswered();
  }, [sizing, markAnswered]);

  const handleChange = (field: keyof MarketSizing, value: string) => {
    setSizing(prev => ({ ...prev, [field]: value }));
  };

  const tam = parseFloat(sizing.tam) || 0;
  const sam = parseFloat(sizing.sam) || 0;
  const som = parseFloat(sizing.som) || 0;
  const marketShare = sam > 0 ? ((som / sam) * 100).toFixed(1) : '0';
  const tamPenetration = tam > 0 ? ((som / tam) * 100).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Market Sizing: TAM / SAM / SOM</h2>
      <p className="text-muted-foreground">
        PE firms use this framework to understand how big your opportunity really is. It's the difference between "we're a $5M company" and "we're a $5M company capturing 2% of a $250M serviceable market with 15% annual growth."
      </p>

      <div className="space-y-4">
        <Card className="p-5 bg-card border-border">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
              <span className="text-blue-400 font-bold text-sm">TAM</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Total Addressable Market</h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you had zero competition and unlimited resources, how big is the total market for what you sell? (in $B or $M)
              </p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="e.g. 500"
                    value={sizing.tam}
                    onChange={(e) => handleChange('tam', e.target.value)}
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-1">In millions ($M)</p>
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="e.g. IBISWorld, Gartner"
                    value={sizing.tamSource}
                    onChange={(e) => handleChange('tamSource', e.target.value)}
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Source (PE firms always ask)</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-card border-border">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <span className="text-amber-400 font-bold text-sm">SAM</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Serviceable Addressable Market</h3>
              <p className="text-sm text-muted-foreground mb-3">
                How much of the TAM can you realistically serve given your geography, product, and business model?
              </p>
              <Input
                type="number"
                placeholder="e.g. 120"
                value={sizing.sam}
                onChange={(e) => handleChange('sam', e.target.value)}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1">In millions ($M)</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-card border-border">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-emerald-400 font-bold text-sm">SOM</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Serviceable Obtainable Market</h3>
              <p className="text-sm text-muted-foreground mb-3">
                What you actually capture today — your current revenue is your SOM.
              </p>
              <Input
                type="number"
                placeholder="e.g. 5"
                value={sizing.som}
                onChange={(e) => handleChange('som', e.target.value)}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1">In millions ($M) — typically your annual revenue</p>
            </div>
          </div>
        </Card>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Market Growth Rate (% annual)</Label>
          <Input
            type="number"
            placeholder="e.g. 12"
            value={sizing.growthRate}
            onChange={(e) => handleChange('growthRate', e.target.value)}
            className="bg-background max-w-xs"
          />
        </div>
      </div>

      {/* Visual funnel */}
      {tam > 0 && sam > 0 && som > 0 && (
        <Card className="p-5 bg-card border-border">
          <h3 className="font-semibold mb-4">Your Market Funnel</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>TAM: ${tam.toLocaleString()}M</span>
                <span className="text-muted-foreground">100%</span>
              </div>
              <div className="h-6 bg-blue-500/20 rounded-full w-full" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>SAM: ${sam.toLocaleString()}M</span>
                <span className="text-muted-foreground">{tam > 0 ? ((sam / tam) * 100).toFixed(0) : 0}% of TAM</span>
              </div>
              <div className="h-6 bg-amber-500/30 rounded-full" style={{ width: `${Math.min(100, (sam / tam) * 100)}%` }} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>SOM: ${som.toLocaleString()}M</span>
                <span className="text-muted-foreground">{marketShare}% of SAM</span>
              </div>
              <div className="h-6 bg-emerald-500/40 rounded-full" style={{ width: `${Math.max(3, Math.min(100, (som / tam) * 100))}%` }} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            You currently capture <strong>{marketShare}%</strong> of your serviceable market ({tamPenetration}% of total market).
            {parseFloat(marketShare) < 5
              ? ' Significant room for growth — PE firms see this as a land-grab opportunity.'
              : parseFloat(marketShare) < 20
              ? ' Solid position with clear growth runway. This is the sweet spot for PE.'
              : ' Strong market share. PE will focus on defending position and margin expansion.'}
          </p>
        </Card>
      )}
    </div>
  );
};

// ─── Porter's Five Forces Page ────────────────────────────────

const forceDescriptions: Record<string, { name: string; question: string; lowNote: string; highNote: string; icon: React.ReactNode }> = {
  rivalry: {
    name: 'Competitive Rivalry',
    question: 'How intense is the competition in your industry?',
    lowNote: 'Few competitors, differentiated offerings. You have pricing power.',
    highNote: 'Many competitors, price wars, commoditized. Margins under constant pressure.',
    icon: <Users className="w-5 h-5" />,
  },
  newEntrants: {
    name: 'Threat of New Entrants',
    question: 'How easy is it for new companies to enter your market?',
    lowNote: 'High barriers (capital, regulation, expertise). Your moat is strong.',
    highNote: 'Low barriers. New competitors can appear quickly. Constant threat.',
    icon: <Plus className="w-5 h-5" />,
  },
  substitutes: {
    name: 'Threat of Substitutes',
    question: 'Can customers solve their problem with a completely different product or approach?',
    lowNote: 'Few alternatives to what you offer. Customers need you specifically.',
    highNote: 'Many alternative solutions. Customers can easily switch to something different.',
    icon: <Layers className="w-5 h-5" />,
  },
  buyerPower: {
    name: 'Buyer (Customer) Power',
    question: 'How much leverage do your customers have in negotiations?',
    lowNote: 'Many small buyers, high switching costs. You set the terms.',
    highNote: 'Few large buyers who can demand discounts. They set the terms.',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  supplierPower: {
    name: 'Supplier Power',
    question: 'How much leverage do your suppliers have over you?',
    lowNote: 'Many suppliers, commoditized inputs. You choose who to work with.',
    highNote: 'Few key suppliers who can raise prices. You depend on them.',
    icon: <TrendingUp className="w-5 h-5" />,
  },
};

const PorterForcesPage: React.FC<{
  forces: PorterForces;
  setForces: React.Dispatch<React.SetStateAction<PorterForces>>;
  markAnswered: () => void;
}> = ({ forces, setForces, markAnswered }) => {
  useEffect(() => {
    const allAnswered = Object.values(forces).every(v => v !== '');
    if (allAnswered) markAnswered();
  }, [forces, markAnswered]);

  const handleChange = (force: keyof PorterForces, value: ForceLevel) => {
    setForces(prev => ({ ...prev, [force]: value }));
  };

  const forceKeys: (keyof PorterForces)[] = ['rivalry', 'newEntrants', 'substitutes', 'buyerPower', 'supplierPower'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Porter's Five Forces</h2>
      <p className="text-muted-foreground">
        This classic framework tells PE firms whether your industry is structurally attractive.
        Industries where all five forces are low = high profitability. Industries where they're all high = tough to make money.
      </p>

      <div className="space-y-4">
        {forceKeys.map((key) => {
          const desc = forceDescriptions[key];
          const value = forces[key];
          return (
            <Card key={key} className="p-5 bg-card border-border">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary">{desc.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold">{desc.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{desc.question}</p>
                  <RadioGroup
                    value={value}
                    onValueChange={(v) => handleChange(key, v as ForceLevel)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id={`${key}-low`} />
                      <Label htmlFor={`${key}-low`} className="font-normal cursor-pointer text-emerald-400">Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id={`${key}-med`} />
                      <Label htmlFor={`${key}-med`} className="font-normal cursor-pointer text-yellow-400">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id={`${key}-high`} />
                      <Label htmlFor={`${key}-high`} className="font-normal cursor-pointer text-red-400">High</Label>
                    </div>
                  </RadioGroup>
                  {value && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {value === 'low' ? desc.lowNote : value === 'high' ? desc.highNote : `Moderate — some competitive pressure but manageable.`}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ─── Competitive Positioning Page ─────────────────────────────

const CompetitivePositioningPage: React.FC<{
  competitors: Competitor[];
  setCompetitors: React.Dispatch<React.SetStateAction<Competitor[]>>;
  yourCompany: Competitor;
  setYourCompany: React.Dispatch<React.SetStateAction<Competitor>>;
  markAnswered: () => void;
}> = ({ competitors, setCompetitors, yourCompany, setYourCompany, markAnswered }) => {
  useEffect(() => {
    if (yourCompany.name && yourCompany.qualityScore > 0 && yourCompany.priceScore > 0 && competitors.length >= 1 && competitors[0].name) {
      markAnswered();
    }
  }, [yourCompany, competitors, markAnswered]);

  const addCompetitor = () => {
    if (competitors.length < 5) {
      setCompetitors(prev => [...prev, { name: '', qualityScore: 5, priceScore: 5 }]);
    }
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(prev => prev.filter((_, i) => i !== index));
  };

  const updateCompetitor = (index: number, field: keyof Competitor, value: string | number) => {
    setCompetitors(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Competitive Positioning Map</h2>
      <p className="text-muted-foreground">
        Position yourself and your competitors on two dimensions: <strong>Product/Service Quality</strong> (1 = basic, 10 = best-in-class)
        and <strong>Price Point</strong> (1 = lowest cost, 10 = premium pricing). PE firms use this to see your strategic position at a glance.
      </p>

      {/* Your Company */}
      <Card className="p-5 bg-primary/5 border-primary/30">
        <h3 className="font-semibold mb-3">Your Company</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="text-sm">Company Name</Label>
            <Input
              placeholder="Your company"
              value={yourCompany.name}
              onChange={(e) => setYourCompany(prev => ({ ...prev, name: e.target.value }))}
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Quality / Differentiation (1-10)</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={yourCompany.qualityScore || ''}
              onChange={(e) => setYourCompany(prev => ({ ...prev, qualityScore: Math.min(10, Math.max(1, parseInt(e.target.value) || 0)) }))}
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Price Point (1-10)</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={yourCompany.priceScore || ''}
              onChange={(e) => setYourCompany(prev => ({ ...prev, priceScore: Math.min(10, Math.max(1, parseInt(e.target.value) || 0)) }))}
              className="bg-background"
            />
          </div>
        </div>
      </Card>

      {/* Competitors */}
      {competitors.map((comp, index) => (
        <Card key={index} className="p-5 bg-card border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Competitor {index + 1}</h3>
            {competitors.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => removeCompetitor(index)}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-sm">Name</Label>
              <Input
                placeholder="Competitor name"
                value={comp.name}
                onChange={(e) => updateCompetitor(index, 'name', e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Quality / Differentiation (1-10)</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={comp.qualityScore || ''}
                onChange={(e) => updateCompetitor(index, 'qualityScore', Math.min(10, Math.max(1, parseInt(e.target.value) || 0)))}
                className="bg-background"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Price Point (1-10)</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={comp.priceScore || ''}
                onChange={(e) => updateCompetitor(index, 'priceScore', Math.min(10, Math.max(1, parseInt(e.target.value) || 0)))}
                className="bg-background"
              />
            </div>
          </div>
        </Card>
      ))}

      {competitors.length < 5 && (
        <Button variant="outline" onClick={addCompetitor} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Competitor (up to 5)
        </Button>
      )}

      {/* Live Positioning Map */}
      {yourCompany.qualityScore > 0 && yourCompany.priceScore > 0 && (
        <Card className="p-5 bg-card border-border">
          <h3 className="font-semibold mb-3">Live Positioning Map</h3>
          <PositioningMap yourCompany={yourCompany} competitors={competitors.filter(c => c.name && c.qualityScore > 0 && c.priceScore > 0)} />
        </Card>
      )}
    </div>
  );
};

// ─── Positioning Map (visual) ─────────────────────────────────

const PositioningMap: React.FC<{
  yourCompany: Competitor;
  competitors: Competitor[];
}> = ({ yourCompany, competitors }) => {
  const gridSize = 280;
  const padding = 30;

  const toX = (price: number) => padding + ((price - 1) / 9) * (gridSize - 2 * padding);
  const toY = (quality: number) => gridSize - padding - ((quality - 1) / 9) * (gridSize - 2 * padding);

  return (
    <div className="flex justify-center">
      <div className="relative">
        <svg width={gridSize} height={gridSize} className="border border-border rounded-lg bg-background/50">
          {/* Grid lines */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <React.Fragment key={i}>
              <line x1={toX(i)} y1={padding} x2={toX(i)} y2={gridSize - padding} stroke="currentColor" strokeOpacity={0.1} />
              <line x1={padding} y1={toY(i)} x2={gridSize - padding} y2={toY(i)} stroke="currentColor" strokeOpacity={0.1} />
            </React.Fragment>
          ))}

          {/* Quadrant labels */}
          <text x={padding + 15} y={padding + 15} fontSize="9" fill="currentColor" opacity={0.3}>High Quality / Low Price</text>
          <text x={gridSize - padding - 100} y={padding + 15} fontSize="9" fill="currentColor" opacity={0.3}>Premium</text>
          <text x={padding + 15} y={gridSize - padding - 5} fontSize="9" fill="currentColor" opacity={0.3}>Budget</text>
          <text x={gridSize - padding - 100} y={gridSize - padding - 5} fontSize="9" fill="currentColor" opacity={0.3}>Overpriced</text>

          {/* Axis labels */}
          <text x={gridSize / 2} y={gridSize - 5} textAnchor="middle" fontSize="10" fill="currentColor" opacity={0.5}>Price Point →</text>
          <text x={10} y={gridSize / 2} textAnchor="middle" fontSize="10" fill="currentColor" opacity={0.5} transform={`rotate(-90, 10, ${gridSize / 2})`}>Quality →</text>

          {/* Competitor dots */}
          {competitors.map((comp, i) => (
            <React.Fragment key={i}>
              <circle cx={toX(comp.priceScore)} cy={toY(comp.qualityScore)} r={8} fill="#6b7280" fillOpacity={0.6} stroke="#6b7280" strokeWidth={1.5} />
              <text x={toX(comp.priceScore)} y={toY(comp.qualityScore) - 12} textAnchor="middle" fontSize="9" fill="#9ca3af">
                {comp.name.length > 12 ? comp.name.slice(0, 12) + '…' : comp.name}
              </text>
            </React.Fragment>
          ))}

          {/* Your company (highlighted) */}
          <circle cx={toX(yourCompany.priceScore)} cy={toY(yourCompany.qualityScore)} r={10} fill="#10b981" fillOpacity={0.7} stroke="#10b981" strokeWidth={2} />
          <text x={toX(yourCompany.priceScore)} y={toY(yourCompany.qualityScore) - 14} textAnchor="middle" fontSize="10" fill="#34d399" fontWeight="bold">
            {yourCompany.name.length > 12 ? yourCompany.name.slice(0, 12) + '…' : yourCompany.name}
          </text>
        </svg>
      </div>
    </div>
  );
};

// ─── Report Page ──────────────────────────────────────────────

const ReportPage: React.FC<{
  sizing: MarketSizing;
  forces: PorterForces;
  yourCompany: Competitor;
  competitors: Competitor[];
}> = ({ sizing, forces, yourCompany, competitors }) => {
  const tam = parseFloat(sizing.tam) || 0;
  const sam = parseFloat(sizing.sam) || 0;
  const som = parseFloat(sizing.som) || 0;
  const growthRate = parseFloat(sizing.growthRate) || 0;
  const marketShare = sam > 0 ? ((som / sam) * 100).toFixed(1) : '0';

  // Score the forces
  const forceScore = (level: ForceLevel): number => level === 'low' ? 1 : level === 'medium' ? 2 : 3;
  const totalForceScore = Object.values(forces).reduce((sum, v) => sum + forceScore(v as ForceLevel), 0);
  const industryAttractiveness = totalForceScore <= 7 ? 'Attractive' : totalForceScore <= 11 ? 'Moderate' : 'Challenging';
  const attractivenessColor = industryAttractiveness === 'Attractive' ? 'text-emerald-400' : industryAttractiveness === 'Moderate' ? 'text-yellow-400' : 'text-red-400';

  // Positioning analysis
  const validComps = competitors.filter(c => c.name && c.qualityScore > 0 && c.priceScore > 0);
  const avgCompQuality = validComps.length > 0 ? validComps.reduce((s, c) => s + c.qualityScore, 0) / validComps.length : 5;
  const avgCompPrice = validComps.length > 0 ? validComps.reduce((s, c) => s + c.priceScore, 0) / validComps.length : 5;

  const qualityAdvantage = yourCompany.qualityScore > avgCompQuality;
  const priceAdvantage = yourCompany.priceScore <= avgCompPrice;

  let positioningVerdict = '';
  if (qualityAdvantage && priceAdvantage) {
    positioningVerdict = 'Best value — higher quality at a competitive price. This is the strongest competitive position.';
  } else if (qualityAdvantage && !priceAdvantage) {
    positioningVerdict = 'Premium positioning — higher quality at a higher price. Defensible if customers see the value.';
  } else if (!qualityAdvantage && priceAdvantage) {
    positioningVerdict = 'Cost leader — competitive pricing but not the quality leader. Growth depends on scale and efficiency.';
  } else {
    positioningVerdict = 'Vulnerable — competitors offer better quality at better prices. Urgent need to differentiate.';
  }

  // Overall market score
  let marketScore = 0;
  if (growthRate >= 10) marketScore += 3; else if (growthRate >= 5) marketScore += 2; else if (growthRate > 0) marketScore += 1;
  if (parseFloat(marketShare) < 20) marketScore += 2; else marketScore += 1; // room to grow
  if (industryAttractiveness === 'Attractive') marketScore += 3; else if (industryAttractiveness === 'Moderate') marketScore += 2; else marketScore += 1;
  if (qualityAdvantage) marketScore += 2; else marketScore += 1;

  const overallVerdict = marketScore >= 8 ? 'Strong Market Position' : marketScore >= 5 ? 'Solid With Room to Improve' : 'Needs Work';
  const overallColor = marketScore >= 8 ? 'text-emerald-400' : marketScore >= 5 ? 'text-yellow-400' : 'text-red-400';
  const overallBg = marketScore >= 8 ? 'bg-emerald-500/10 border-emerald-500/30' : marketScore >= 5 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30';

  return (
    <div className="space-y-6">
      {/* Overall Verdict */}
      <Card className={`p-6 border ${overallBg}`}>
        <div className="text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Competitive Analysis Verdict</p>
          <h2 className={`text-3xl font-bold ${overallColor}`}>{overallVerdict}</h2>
        </div>
      </Card>

      {/* Market Sizing Summary */}
      <Card className="p-5 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-lg">Market Sizing</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <p className="text-2xl font-bold text-blue-400">${tam.toLocaleString()}M</p>
            <p className="text-xs text-muted-foreground">TAM</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-400">${sam.toLocaleString()}M</p>
            <p className="text-xs text-muted-foreground">SAM</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">${som.toLocaleString()}M</p>
            <p className="text-xs text-muted-foreground">SOM ({marketShare}% share)</p>
          </div>
        </div>
        {growthRate > 0 && (
          <p className="text-sm text-muted-foreground">
            Market growing at <strong>{growthRate}% annually</strong>.
            {growthRate >= 10
              ? ' High-growth market — PE firms will pay premium multiples here.'
              : growthRate >= 5
              ? ' Solid growth — supports a healthy investment thesis.'
              : ' Slow growth — PE will want a clear share-gain or margin-expansion story.'}
          </p>
        )}
        {sizing.tamSource && (
          <p className="text-xs text-muted-foreground mt-2">Source: {sizing.tamSource}</p>
        )}
      </Card>

      {/* Five Forces Summary */}
      <Card className="p-5 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-lg">Industry Attractiveness</h3>
          </div>
          <Badge className={
            industryAttractiveness === 'Attractive' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : industryAttractiveness === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }>
            {industryAttractiveness}
          </Badge>
        </div>
        <div className="space-y-2">
          {(Object.keys(forces) as (keyof PorterForces)[]).map((key) => {
            const level = forces[key];
            const desc = forceDescriptions[key];
            const color = level === 'low' ? 'text-emerald-400' : level === 'medium' ? 'text-yellow-400' : 'text-red-400';
            const bgColor = level === 'low' ? 'bg-emerald-500/20' : level === 'medium' ? 'bg-yellow-500/20' : 'bg-red-500/20';
            return (
              <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">{desc.name}</span>
                <Badge className={`${bgColor} ${color} border-0`}>{level ? level.charAt(0).toUpperCase() + level.slice(1) : 'N/A'}</Badge>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          {industryAttractiveness === 'Attractive'
            ? 'Your industry structure supports strong margins and defensible positions. PE firms like investing here.'
            : industryAttractiveness === 'Moderate'
            ? 'Mixed competitive dynamics. A differentiated position or niche focus can still command premium valuations.'
            : 'Tough industry dynamics. PE will scrutinize your competitive moat carefully and expect a lower multiple.'}
        </p>
      </Card>

      {/* Competitive Position */}
      <Card className="p-5 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Crosshair className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-lg">Competitive Position</h3>
        </div>
        {validComps.length > 0 && (
          <div className="mb-4">
            <PositioningMap yourCompany={yourCompany} competitors={validComps} />
          </div>
        )}
        <p className="text-sm text-muted-foreground">{positioningVerdict}</p>
        {validComps.length > 0 && (
          <div className="mt-3 space-y-1 text-sm">
            <p className="text-muted-foreground">
              Your quality score: <strong className="text-foreground">{yourCompany.qualityScore}/10</strong> vs. competitor avg: <strong className="text-foreground">{avgCompQuality.toFixed(1)}/10</strong>
            </p>
            <p className="text-muted-foreground">
              Your price point: <strong className="text-foreground">{yourCompany.priceScore}/10</strong> vs. competitor avg: <strong className="text-foreground">{avgCompPrice.toFixed(1)}/10</strong>
            </p>
          </div>
        )}
      </Card>

      {/* What PE Wants To Hear */}
      <Card className="p-5 bg-card border-border">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">How To Present This to PE</h3>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>When a PE firm asks about your market, they want a tight narrative. Here's how to frame it based on your numbers:</p>
          <div className="bg-background/50 p-4 rounded-lg border border-border italic">
            "We operate in a ${tam > 0 ? `$${tam.toLocaleString()}M` : '[TAM]'} total market
            {growthRate > 0 ? ` growing ${growthRate}% annually` : ''}.
            Our serviceable market is ${sam > 0 ? `$${sam.toLocaleString()}M` : '[SAM]'},
            and we currently capture {marketShare}% market share at ${som > 0 ? `$${som.toLocaleString()}M` : '[SOM]'} in revenue.
            {parseFloat(marketShare) < 10
              ? ' We see significant runway to grow share through [your growth strategy].'
              : ' We have a strong position and see continued growth through [expansion strategy].'}
            The competitive landscape is {industryAttractiveness.toLowerCase()}
            {qualityAdvantage ? ', and we differentiate on quality and service' : ''}.
            "
          </div>
          <p className="text-xs text-muted-foreground">
            This is exactly the "Company Overview" section of a CIM or management presentation. Practice saying it out loud.
          </p>
        </div>
      </Card>

      {/* Next Steps */}
      <Alert className="border-primary/30 bg-primary/5">
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <span className="font-semibold">What to do next:</span>{' '}
          {marketScore >= 8
            ? 'Your market story is strong. Make sure your financial data room supports these claims with third-party market research, customer data, and competitive win/loss analysis.'
            : marketScore >= 5
            ? 'Solid foundation but gaps exist. Before approaching PE, strengthen your weakest area — whether that\'s market sizing data, competitive differentiation, or industry dynamics.'
            : 'Focus on building a stronger competitive moat before going to market. Use the other PE Ready modules to strengthen your overall position.'}
        </AlertDescription>
      </Alert>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────

export const CompetitiveAnalysis: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageAnswered, setPageAnswered] = useState<Record<number, boolean>>({});

  const [sizing, setSizing] = useState<MarketSizing>({
    tam: '',
    sam: '',
    som: '',
    tamSource: '',
    growthRate: '',
  });

  const [forces, setForces] = useState<PorterForces>({
    rivalry: '',
    newEntrants: '',
    substitutes: '',
    buyerPower: '',
    supplierPower: '',
  });

  const [competitors, setCompetitors] = useState<Competitor[]>([
    { name: '', qualityScore: 5, priceScore: 5 },
  ]);

  const [yourCompany, setYourCompany] = useState<Competitor>({
    name: '',
    qualityScore: 0,
    priceScore: 0,
  });

  const pages = useMemo(() => [
    { title: 'Why Market Analysis Matters', content: <IntroPage /> },
    {
      title: 'TAM / SAM / SOM',
      content: (
        <MarketSizingPage
          sizing={sizing}
          setSizing={setSizing}
          markAnswered={() => setPageAnswered(p => ({ ...p, 1: true }))}
        />
      ),
    },
    {
      title: "Porter's Five Forces",
      content: (
        <PorterForcesPage
          forces={forces}
          setForces={setForces}
          markAnswered={() => setPageAnswered(p => ({ ...p, 2: true }))}
        />
      ),
    },
    {
      title: 'Competitive Positioning',
      content: (
        <CompetitivePositioningPage
          competitors={competitors}
          setCompetitors={setCompetitors}
          yourCompany={yourCompany}
          setYourCompany={setYourCompany}
          markAnswered={() => setPageAnswered(p => ({ ...p, 3: true }))}
        />
      ),
    },
    {
      title: 'Your Competitive Analysis',
      content: (
        <ReportPage
          sizing={sizing}
          forces={forces}
          yourCompany={yourCompany}
          competitors={competitors.filter(c => c.name && c.qualityScore > 0 && c.priceScore > 0)}
        />
      ),
    },
  ], [sizing, forces, competitors, yourCompany]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Progress value={((currentPage + 1) / pages.length) * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Step {currentPage + 1} of {pages.length}</span>
          <span>{pages[currentPage].title}</span>
        </div>
      </div>

      <Card className="p-8 min-h-[600px] bg-card border-border">
        {pages[currentPage].content}
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </Button>

        <Button
          onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
          disabled={
            currentPage === pages.length - 1 ||
            (currentPage > 0 && currentPage < pages.length - 1 && !pageAnswered[currentPage])
          }
        >
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
