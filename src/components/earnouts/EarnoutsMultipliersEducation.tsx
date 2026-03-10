import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronLeft, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Calculator, Target, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import { getNextModulePath } from '@/config/moduleConfig';

export const EarnoutsMultipliersEducation: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const { markModuleComplete } = useProgress();
  
  const pages = [
    {
      title: "Why Small EBITDA Gains = Massive Payouts",
      content: <IntroPage />
    },
    {
      title: "Understanding the Multiplier Effect", 
      content: <MultiplierPage />
    },
    {
      title: "Earning Back Your Equity",
      content: <EquityClawbackPage />
    },
    {
      title: "Structure Your Earnout Right",
      content: <StructurePage />
    },
    {
      title: "Calculate Your Potential",
      content: <CalculatorPage />
    },
    {
      title: "Protect Your Earnout",
      content: <ProtectionPage />
    }
  ];

  const isLastPage = currentPage === pages.length - 1;

  const handleComplete = async () => {
    await markModuleComplete('Seller Earnouts & Performance Multipliers', 2);
    const nextPath = getNextModulePath('Seller Earnouts & Performance Multipliers');
    if (nextPath) {
      navigate(nextPath);
    } else {
      navigate('/portal');
    }
  };
  
  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={(currentPage + 1) / pages.length * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Step {currentPage + 1} of {pages.length}</span>
          <span>{pages[currentPage].title}</span>
        </div>
      </div>
      
      {/* Content */}
      <Card className="p-8 min-h-[600px]">
        {pages[currentPage].content}
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {isLastPage ? (
          <Button onClick={handleComplete} className="bg-success text-success-foreground hover:bg-success/90">
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Module
          </Button>
        ) : (
          <Button onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

// Page 1: Introduction
const IntroPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-foreground">
      Turn $2M EBITDA Growth Into $14M Cash
    </h2>
    
    <div className="text-lg space-y-4">
      <p>
        Here's what most sellers don't understand: <strong>PE earnouts aren't linear.</strong> 
        Growing EBITDA from $6M to $8M doesn't just add 33% more value – it can trigger 
        multiplier effects that generate "insane chunks of money."
      </p>
      
      <Card className="bg-green-500/10 border-green-500/30 p-6">
        <p className="text-green-600 font-semibold mb-2">Real Example:</p>
        <p>
          A manufacturing company grew EBITDA from $6M to $8M. The earnout paid 27% of 
          excess above $6M, but hitting $8M triggered a 1.5x multiplier. Result: 
          $2M × 27% × 1.5 = $810K earnout PLUS 2.5% equity clawback worth $2M at exit.
        </p>
      </Card>
      
      <div className="grid grid-cols-2 gap-6 mt-8">
        <Card className="p-6 bg-muted">
          <h3 className="text-xl font-semibold mb-3">Base Earnout Structure</h3>
          <ul className="space-y-2 text-sm">
            <li>• 25-27% of EBITDA above threshold</li>
            <li>• Typical thresholds: $6-10M</li>
            <li>• Measurement: 1-3 years</li>
            <li>• Annual or cumulative targets</li>
          </ul>
        </Card>
        
        <Card className="p-6 bg-muted">
          <h3 className="text-xl font-semibold mb-3">Acceleration Triggers</h3>
          <ul className="space-y-2 text-sm">
            <li>• Hit 120% of target: 1.5x multiplier</li>
            <li>• Hit 150% of target: 2x multiplier</li>
            <li>• Equity earn-back: 2-5% ownership</li>
            <li>• Retroactive adjustments</li>
          </ul>
        </Card>
      </div>
    </div>
  </div>
);

// Page 2: Multiplier Mechanics
const MultiplierPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  
  const tiers = [
    { 
      level: "Base Performance", 
      ebitda: "$6-7M", 
      rate: "25%", 
      example: "$250K on $1M excess" 
    },
    { 
      level: "Target Achievement", 
      ebitda: "$7-8M", 
      rate: "35%", 
      example: "$350K on $1M excess" 
    },
    { 
      level: "Stretch Goals", 
      ebitda: "$8M+", 
      rate: "50%", 
      example: "$500K on $1M excess",
      bonus: "+ 2.5% equity back"
    },
    { 
      level: "Exceptional", 
      ebitda: "$10M+", 
      rate: "75%", 
      example: "$750K on $1M excess",
      bonus: "+ 5% equity back"
    }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground flex items-center">
        <TrendingUp className="w-10 h-10 mr-3 text-primary" />
        How Multipliers Stack Your Payout
      </h2>
      
      <div className="space-y-4">
        <p className="text-lg">
          Click each tier to see how your payout multiplies:
        </p>
        
        <div className="space-y-3">
          {tiers.map((tier, idx) => (
            <Card
              key={idx}
              className={`p-4 cursor-pointer transition-all ${
                selectedTier === idx 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'hover:bg-muted'
              }`}
              onClick={() => setSelectedTier(idx)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{tier.level}</p>
                  <p className="text-sm text-muted-foreground">EBITDA: {tier.ebitda}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{tier.rate}</p>
                  <p className="text-sm text-muted-foreground">{tier.example}</p>
                  {tier.bonus && (
                    <p className="text-sm font-semibold text-green-600 mt-1">{tier.bonus}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {selectedTier !== null && (
          <Card className="bg-primary/5 border-primary/20 p-6">
            <h4 className="font-semibold mb-3">Impact on $20M Sale:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Sale Price:</span>
                <span className="font-mono">$20,000,000</span>
              </div>
              <div className="flex justify-between">
                <span>EBITDA Achievement:</span>
                <span className="font-mono">{tiers[selectedTier].ebitda}</span>
              </div>
              <div className="flex justify-between">
                <span>Earnout Rate:</span>
                <span className="font-mono">{tiers[selectedTier].rate}</span>
              </div>
              {selectedTier >= 2 && (
                <div className="flex justify-between text-green-600">
                  <span>Equity Clawback:</span>
                  <span className="font-mono">{selectedTier === 2 ? '2.5%' : '5%'}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Additional Value:</span>
                  <span className="text-primary">
                    ${selectedTier === 0 ? '500K' : selectedTier === 1 ? '1.2M' : selectedTier === 2 ? '3.5M' : '7M'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// Page 3: Equity Clawback
const EquityClawbackPage: React.FC = () => {
  const [showExample, setShowExample] = useState(false);
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground flex items-center">
        <Award className="w-10 h-10 mr-3 text-yellow-500" />
        Win Back 5-10% of Your Company
      </h2>
      
      <div className="space-y-4">
        <Card className="bg-yellow-500/10 border-yellow-500/30 p-6">
          <p className="text-yellow-600 font-semibold mb-2">The Equity Kicker:</p>
          <p>
            You sold 70% but kept 30%. Hit your targets and earn back up to 10% more 
            ownership. That 10% could be worth more than your entire earnout when PE exits.
          </p>
        </Card>
        
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">110%</p>
            <p className="text-sm text-muted-foreground">of target</p>
            <p className="font-semibold mt-2">+2% equity</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">125%</p>
            <p className="text-sm text-muted-foreground">of target</p>
            <p className="font-semibold mt-2">+5% equity</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">150%</p>
            <p className="text-sm text-muted-foreground">of target</p>
            <p className="font-semibold mt-2">+10% equity</p>
          </Card>
        </div>
        
        <Button
          onClick={() => setShowExample(true)}
          className="w-full"
          disabled={showExample}
        >
          Show Real Number Example
        </Button>
        
        {showExample && (
          <Card className="bg-green-500/10 border-green-500/30 p-6">
            <h4 className="font-semibold mb-3">Aerospace Manufacturing Deal:</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Initial Sale:</span>
                <span className="font-mono">75% for $45M</span>
              </div>
              <div className="flex justify-between">
                <span>Retained:</span>
                <span className="font-mono">25% ownership</span>
              </div>
              <div className="flex justify-between">
                <span>EBITDA Target:</span>
                <span className="font-mono">$8M → $12M</span>
              </div>
              <div className="flex justify-between">
                <span>Achievement:</span>
                <span className="font-mono">$13M (108%)</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-green-600">
                  <span>Equity Earned Back:</span>
                  <span className="font-mono">+5%</span>
                </div>
                <div className="flex justify-between">
                  <span>New Ownership:</span>
                  <span className="font-mono">30%</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-2">
                  <span>Value at PE Exit (3 years):</span>
                  <span className="text-primary">$24M</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              That 5% equity clawback was worth $12M at exit – more than the entire cash earnout.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

// Page 4: Structure
const StructurePage: React.FC = () => {
  const [selectedStructure, setSelectedStructure] = useState<'good' | 'bad' | null>(null);
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        Structure Determines Success (Not Performance)
      </h2>
      
      <div className="space-y-4">
        <p className="text-lg">
          60% of earnouts fail to pay out fully. The difference? Structure, not performance.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <Card
            className={`p-6 cursor-pointer transition-all ${
              selectedStructure === 'bad' 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'hover:bg-muted'
            }`}
            onClick={() => setSelectedStructure('bad')}
          >
            <h3 className="text-xl font-semibold mb-2">
              ❌ Bad Structure
            </h3>
            <p className="text-sm text-muted-foreground">
              All-or-nothing, no protections
            </p>
          </Card>
          
          <Card
            className={`p-6 cursor-pointer transition-all ${
              selectedStructure === 'good' 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'hover:bg-muted'
            }`}
            onClick={() => setSelectedStructure('good')}
          >
            <h3 className="text-xl font-semibold mb-2">
              ✅ Good Structure
            </h3>
            <p className="text-sm text-muted-foreground">
              Tiered payouts, full protections
            </p>
          </Card>
        </div>
        
        {selectedStructure === 'bad' && (
          <Card className="bg-red-500/10 border-red-500/30 p-6">
            <h4 className="text-red-600 font-semibold mb-3">Why This Fails:</h4>
            <ul className="space-y-2">
              <li>• Single cliff at 100% of target - miss by $1, get $0</li>
              <li>• No operational covenants</li>
              <li>• Buyer can change accounting methods</li>
              <li>• No acceleration on sale</li>
              <li>• 3-year measurement period</li>
            </ul>
            <p className="mt-4 text-sm font-semibold">
              Result: 75% chance of zero payout
            </p>
          </Card>
        )}
        
        {selectedStructure === 'good' && (
          <Card className="bg-green-500/10 border-green-500/30 p-6">
            <h4 className="text-green-600 font-semibold mb-3">Why This Works:</h4>
            <ul className="space-y-2">
              <li>• Graduated tiers starting at 80% of target</li>
              <li>• Locked-in operating agreements</li>
              <li>• GAAP consistency requirements</li>
              <li>• 75% acceleration on buyer sale</li>
              <li>• 12-18 month measurement</li>
              <li>• Monthly reporting rights</li>
            </ul>
            <p className="mt-4 text-sm font-semibold">
              Result: 85% achieve meaningful payout
            </p>
          </Card>
        )}
        
        <Card className="bg-yellow-500/10 border-yellow-500/30 p-4">
          <p className="text-yellow-600 font-semibold">Key Insight:</p>
          <p className="text-sm">
            The Sanofi-Genzyme deal had perfect milestones and failed completely. 
            Structure quality matters more than target difficulty.
          </p>
        </Card>
      </div>
    </div>
  );
};

// Page 5: Calculator
const CalculatorPage: React.FC = () => {
  const [basePrice, setBasePrice] = useState('20000000');
  const [currentEbitda, setCurrentEbitda] = useState('6000000');
  const [targetEbitda, setTargetEbitda] = useState('8000000');
  const [yourOwnership, setYourOwnership] = useState('30');
  const [results, setResults] = useState<any>(null);
  
  const calculate = () => {
    const base = parseFloat(basePrice);
    const current = parseFloat(currentEbitda);
    const target = parseFloat(targetEbitda);
    const ownership = parseFloat(yourOwnership);
    
    const excess = target - current;
    const tier1 = Math.min(excess, 1000000) * 0.25;
    const tier2 = Math.max(0, Math.min(excess - 1000000, 1000000)) * 0.35;
    const tier3 = Math.max(0, excess - 2000000) * 0.50;
    
    const cashEarnout = tier1 + tier2 + tier3;
    const equityBack = excess >= 2000000 ? 5 : excess >= 1000000 ? 2.5 : 0;
    const newOwnership = ownership + equityBack;
    
    const futureValue = base * 2.5; // Assume 2.5x exit multiple
    const equityValue = (futureValue * newOwnership) / 100;
    
    setResults({
      cashEarnout,
      equityBack,
      newOwnership,
      equityValue,
      totalValue: cashEarnout + equityValue
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground flex items-center">
        <Calculator className="w-10 h-10 mr-3 text-white" />
        Calculate Your Earnout Potential
      </h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Base Purchase Price</Label>
            <Input 
              type="number" 
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="font-mono"
            />
          </div>
          
          <div>
            <Label>Current EBITDA</Label>
            <Input 
              type="number" 
              value={currentEbitda}
              onChange={(e) => setCurrentEbitda(e.target.value)}
              className="font-mono"
            />
          </div>
          
          <div>
            <Label>Target EBITDA</Label>
            <Input 
              type="number" 
              value={targetEbitda}
              onChange={(e) => setTargetEbitda(e.target.value)}
              className="font-mono"
            />
          </div>
          
          <div>
            <Label>Your Current Ownership %</Label>
            <Input 
              type="number" 
              value={yourOwnership}
              onChange={(e) => setYourOwnership(e.target.value)}
              className="font-mono"
            />
          </div>
          
          <Button onClick={calculate} className="w-full">
            Calculate Earnout
          </Button>
        </div>
        
        <div>
          {results && (
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Your Potential Payout:</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Cash Earnout:</span>
                  <span className="font-bold text-green-600">
                    ${results.cashEarnout.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Equity Earned Back:</span>
                  <span className="font-bold text-blue-600">
                    {results.equityBack}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>New Ownership:</span>
                  <span className="font-bold">
                    {results.newOwnership}%
                  </span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span>Equity Value at Exit:</span>
                    <span className="font-bold">
                      ${results.equityValue.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Additional Value:</span>
                    <span className="text-primary">
                      ${results.totalValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Based on tiered earnout structure with equity clawback provisions
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Page 6: Protection
const ProtectionPage: React.FC = () => {
  const protections = [
    {
      title: "Anti-Manipulation Clause",
      description: "Buyer cannot change accounting methods or operational decisions primarily to avoid earnout",
      critical: true
    },
    {
      title: "Acceleration on Sale",
      description: "Get 75-100% of max earnout if buyer sells before measurement period ends",
      critical: true
    },
    {
      title: "Monthly Reporting",
      description: "Detailed P&L with earnout calculations, not just annual reviews",
      critical: false
    },
    {
      title: "Audit Rights",
      description: "Annual right to audit with buyer paying if discrepancy > 5%",
      critical: false
    },
    {
      title: "Operating Covenants",
      description: "Maintain marketing spend, R&D budget, and sales team at historical levels",
      critical: true
    },
    {
      title: "Arbitration by Big 4",
      description: "Disputes resolved by accounting firm, not litigation",
      critical: false
    }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground flex items-center">
        <AlertTriangle className="w-10 h-10 mr-3 text-red-500" />
        Protect Your Earnout or Lose It
      </h2>
      
      <Card className="bg-red-500/10 border-red-500/30 p-6">
        <p className="text-red-600 font-semibold mb-2">Warning:</p>
        <p>
          Without proper protections, buyers can legally manipulate results to avoid 
          paying earnouts. Courts rarely help without specific contract language.
        </p>
      </Card>
      
      <div className="space-y-3">
        {protections.map((protection, idx) => (
          <Card key={idx} className="p-4">
            <div className="flex items-start gap-3">
              {protection.critical ? (
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{protection.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {protection.description}
                </p>
                {protection.critical && (
                  <p className="text-xs text-red-600 mt-2 font-semibold">
                    CRITICAL - Do not proceed without this
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="bg-green-500/10 border-green-500/30 p-6">
        <p className="text-green-600 font-semibold mb-2">Success Story:</p>
        <p className="text-sm">
          Tutor Perini enforced their earnout protections in court and received $36M 
          of their $40M maximum earnout despite buyer resistance. The key? Specific 
          operational covenants and clear calculation methods.
        </p>
      </Card>
    </div>
  );
};

export default EarnoutsMultipliersEducation;
