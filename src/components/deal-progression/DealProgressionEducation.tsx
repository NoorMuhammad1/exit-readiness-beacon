import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, FileText, Target, Handshake, CheckCircle, AlertCircle } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useNavigate } from 'react-router-dom';
import { getNextModulePath } from '@/config/moduleConfig';

export const DealProgressionEducation: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { markModuleComplete } = useProgress();
  const navigate = useNavigate();
  
  const pages = [
    {
      title: "The Deal Journey: 5 Critical Stages",
      content: <OverviewPage />
    },
    {
      title: "NDA: Opening the Kimono",
      content: <NDAPage />
    },
    {
      title: "IOI: Where Millions Are Made or Lost", 
      content: <IOIPage />
    },
    {
      title: "LOI: The Point of No Return",
      content: <LOIPage />
    },
    {
      title: "Close & True Up: The Final Mile",
      content: <ClosePage />
    }
  ];

  const handleComplete = async () => {
    await markModuleComplete('Deal Progression', 1);
    const nextPath = getNextModulePath('Deal Progression');
    if (nextPath) {
      navigate(nextPath);
    } else {
      navigate('/portal');
    }
  };
  
  return (
    <div>
      <div className="mb-8">
        <Progress value={(currentPage + 1) / pages.length * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Step {currentPage + 1} of {pages.length}</span>
          <span>{pages[currentPage].title}</span>
        </div>
      </div>
      
      <Card className="p-8 min-h-[500px]">
        {pages[currentPage].content}
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
        
        {currentPage === pages.length - 1 ? (
          <Button onClick={handleComplete} className="bg-success text-success-foreground hover:bg-success/90">
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Module
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

const OverviewPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold">Your Deal's 5 Critical Stages</h2>
    
    <div className="space-y-4">
      <Card className="p-4 border-l-4 border-white/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">1. NDA (Non-Disclosure Agreement)</h3>
            <p className="text-sm text-muted-foreground">They can look under the hood</p>
          </div>
          <span className="text-muted-foreground">1-2 days</span>
        </div>
      </Card>
      
      <Card className="p-4 border-l-4 border-amber-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">2. IOI (Indication of Interest)</h3>
            <p className="text-sm text-muted-foreground">Non-binding price range - YOUR CHANCE TO EDUCATE</p>
          </div>
          <span className="text-muted-foreground">2-3 weeks</span>
        </div>
      </Card>
      
      <Card className="p-4 border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">3. LOI (Letter of Intent)</h3>
            <p className="text-sm text-muted-foreground">Handshake deal - EXCLUSIVITY BEGINS</p>
          </div>
          <span className="text-muted-foreground">1-2 weeks</span>
        </div>
      </Card>
      
      <Card className="p-4 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">4. Due Diligence & Close</h3>
            <p className="text-sm text-muted-foreground">Verify everything, sign, wire money</p>
          </div>
          <span className="text-muted-foreground">60-90 days</span>
        </div>
      </Card>
      
      <Card className="p-4 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">5. True Up</h3>
            <p className="text-sm text-muted-foreground">Final adjustments post-close</p>
          </div>
          <span className="text-muted-foreground">30-90 days</span>
        </div>
      </Card>
    </div>
    
    <div className="bg-warning/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-warning/30">
      <p className="text-warning font-semibold">Critical Point:</p>
      <p className="text-muted-foreground">The IOI stage is where fortunes are made. Buyers often misunderstand your business - fixing their mistakes can add millions.</p>
    </div>
  </div>
);

const NDAPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold flex items-center">
      <FileText className="w-10 h-10 mr-3 text-primary" />
      NDA: Opening the Books
    </h2>
    
    <div className="bg-primary/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-primary/30">
      <h3 className="text-primary font-semibold mb-3">What Happens:</h3>
      <ul className="space-y-2 text-muted-foreground">
        <li>• Buyer signs confidentiality agreement</li>
        <li>• You share basic financials (P&L, customer mix)</li>
        <li>• They get 2-3 weeks to analyze</li>
        <li>• Multiple buyers can be looking simultaneously</li>
      </ul>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-success/10 backdrop-blur-sm border border-success/30 p-4">
        <h4 className="text-success font-semibold mb-2">✅ Do Share:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• 3 years P&L</li>
          <li>• Customer concentration</li>
          <li>• EBITDA adjustments</li>
          <li>• Growth story</li>
        </ul>
      </Card>
      
      <Card className="bg-destructive/10 backdrop-blur-sm border border-destructive/30 p-4">
        <h4 className="text-destructive font-semibold mb-2">❌ Don't Share Yet:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Customer names</li>
          <li>• Employee details</li>
          <li>• Trade secrets</li>
          <li>• Detailed contracts</li>
        </ul>
      </Card>
    </div>
    
    <Card className="p-4">
      <p className="font-semibold">Remember:</p>
      <p className="text-muted-foreground">You're dating, not married. Keep some mystery until LOI.</p>
    </Card>
  </div>
);

const IOIPage: React.FC = () => {
  const [showExample, setShowExample] = useState<number>(0);
  
  const examples = [
    {
      industry: "Construction Contractor",
      misunderstanding: "PE assumes all projects complete in 90 days, standard 5% retainage",
      reality: "Major projects span 18 months with 10% retainage held for 2 years",
      impact: "Cash flow model was off by $3M, valuation increased $2.5M after correction"
    },
    {
      industry: "SaaS Company",
      misunderstanding: "PE counts all contracted revenue as recurring",
      reality: "40% is implementation fees (one-time), only 60% truly recurring",
      impact: "After clarification, focused on high MRR multiple, added $4M to value"
    },
    {
      industry: "Healthcare Services",
      misunderstanding: "PE assumes Medicare pays in 30 days like commercial insurance",
      reality: "Medicare takes 90-120 days, requires different working capital",
      impact: "Proper working capital adjustment saved seller $1.8M"
    }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold flex items-center">
        <Target className="w-10 h-10 mr-3 text-warning" />
        IOI: Your $2M Education Opportunity
      </h2>
      
      <div className="bg-warning/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-warning/30">
        <p className="text-warning font-semibold mb-2">Critical Truth:</p>
        <p className="text-muted-foreground">
          PE buyers are smart about business models and math, but they DON'T know your industry's quirks. Their IOI will have errors. Finding and fixing these errors can add millions to your price.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Real Examples (click to see):</h3>
        
        {examples.map((ex, idx) => (
          <Card
            key={idx}
            className={`p-4 cursor-pointer transition-all ${
              showExample === idx ? 'border-success' : ''
            }`}
            onClick={() => setShowExample(idx)}
          >
            <h4 className="font-semibold">{ex.industry}</h4>
            {showExample === idx && (
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-destructive font-semibold">What PE Got Wrong:</p>
                  <p className="text-muted-foreground text-sm">{ex.misunderstanding}</p>
                </div>
                <div>
                  <p className="text-success font-semibold">The Reality:</p>
                  <p className="text-muted-foreground text-sm">{ex.reality}</p>
                </div>
                <div>
                  <p className="text-warning font-semibold">The Result:</p>
                  <p className="text-muted-foreground text-sm">{ex.impact}</p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
      
      <div className="bg-primary/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-primary/30">
        <p className="text-primary font-semibold">Your IOI Response Strategy:</p>
        <ol className="mt-2 space-y-1 text-muted-foreground text-sm list-decimal list-inside">
          <li>Thank them for the IOI</li>
          <li>Identify every assumption about your business model</li>
          <li>Correct misunderstandings with data</li>
          <li>Educate on industry-specific factors</li>
          <li>Watch your valuation increase</li>
        </ol>
      </div>
    </div>
  );
};

const LOIPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold flex items-center">
      <Handshake className="w-10 h-10 mr-3 text-accent" />
      LOI: The Point of No Return
    </h2>
    
    <div className="bg-destructive/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-destructive/30">
      <h3 className="text-destructive font-semibold mb-3">⚠️ EXCLUSIVITY KICKS IN</h3>
      <p className="text-muted-foreground">
        Once you sign the LOI, you CANNOT:
      </p>
      <ul className="mt-2 space-y-1 text-muted-foreground">
        <li>• Shop the deal to other buyers</li>
        <li>• Share your info with competitors</li>
        <li>• Negotiate with anyone else</li>
        <li>• Back out without good reason</li>
      </ul>
      <p className="text-warning mt-3">Typical exclusivity: 60-90 days</p>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <h4 className="font-semibold mb-2">What's Binding:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Exclusivity period</li>
          <li>• Confidentiality</li>
          <li>• Break-up fees (sometimes)</li>
        </ul>
      </Card>
      
      <Card className="p-4">
        <h4 className="font-semibold mb-2">What's NOT Binding:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Purchase price (can change)</li>
          <li>• Deal structure</li>
          <li>• Closing conditions</li>
        </ul>
      </Card>
    </div>
    
    <div className="bg-warning/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-warning/30">
      <h3 className="text-warning font-semibold mb-2">Before You Sign:</h3>
      <ul className="space-y-2 text-muted-foreground">
        <li>✓ Price is where you want it (or close)</li>
        <li>✓ You trust this buyer</li>
        <li>✓ Your advisors have reviewed</li>
        <li>✓ You're ready for 60-90 days of diligence</li>
        <li>✓ Key employees are informed and retained</li>
      </ul>
    </div>
    
    <div className="bg-primary/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-primary/30">
      <p className="text-primary font-semibold">Good Faith Requirement:</p>
      <p className="text-muted-foreground">
        Both parties must act in "utmost good faith" - no games, no hidden agendas, full transparency. Violating this can lead to lawsuits.
      </p>
    </div>
  </div>
);

const ClosePage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold flex items-center">
      <CheckCircle className="w-10 h-10 mr-3 text-success" />
      Close & True Up: The Final Mile
    </h2>
    
    <div className="space-y-4">
      <div className="bg-success/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-success/30">
        <h3 className="text-success font-semibold mb-3">Closing Day:</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Sign 50+ documents (seriously)</li>
          <li>• Wire hits your account</li>
          <li>• You hand over the keys</li>
          <li>• Champagne (or tears)</li>
        </ul>
      </div>
      
      <div className="bg-accent/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-accent/30">
        <h3 className="text-accent font-semibold mb-3">True Up (30-90 days later):</h3>
        <p className="text-muted-foreground mb-3">
          The final reconciliation based on actual closing date numbers:
        </p>
        
        <Card className="p-4">
          <p className="font-semibold mb-2">Common Adjustments:</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Working capital (AR, AP, inventory)</li>
            <li>• Prepaid expenses</li>
            <li>• Accrued liabilities</li>
            <li>• Final month's performance</li>
          </ul>
        </Card>
        
        <p className="text-warning mt-3">
          Can swing 2-5% of purchase price either direction!
        </p>
      </div>
      
      <div className="bg-warning/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-warning/30">
        <p className="text-warning font-semibold">Pro Tip:</p>
        <p className="text-muted-foreground">
          Clean books and consistent accounting methods prevent true-up surprises. 
          The cleaner your books, the less arguing later.
        </p>
      </div>
    </div>
    
    <div className="bg-primary/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-primary/30">
      <h3 className="text-primary font-semibold mb-2">Timeline Reality Check:</h3>
      <div className="space-y-1 text-muted-foreground text-sm">
        <p>• NDA to IOI: 2-3 weeks</p>
        <p>• IOI to LOI: 2-3 weeks</p>
        <p>• LOI to Close: 60-90 days</p>
        <p>• Close to True-Up Complete: 30-90 days</p>
        <p className="font-semibold mt-2">Total: 4-7 months (if everything goes perfectly)</p>
      </div>
    </div>
  </div>
);

export default DealProgressionEducation;
