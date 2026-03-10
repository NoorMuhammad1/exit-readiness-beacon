import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Home, Car, Truck, DollarSign, Building, Anchor, CheckCircle } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useNavigate } from 'react-router-dom';

export const AssetFreeEducation: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { markModuleComplete } = useProgress();
  const navigate = useNavigate();
  
  const pages = [
    {
      title: "What PE Buyers Actually Buy",
      content: <IntroPage />
    },
    {
      title: "Core vs Non-Core Assets", 
      content: <CoreAssetsPage />
    },
    {
      title: "The Building Problem",
      content: <BuildingExplanation />
    },
    {
      title: "Cash & Debt at Closing",
      content: <CashDebtExplanation />
    },
    {
      title: "Handling Debt at Closing",
      content: <DebtPayoffPage />
    },
    {
      title: "Understanding Leases",
      content: <LeasesPage />
    },
    {
      title: "Your Clean-Up Checklist",
      content: <ChecklistPage />
    }
  ];

  const handleComplete = async () => {
    await markModuleComplete('Asset Free, Debt Free Education', 1);
    navigate('/portal/week-1');
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

const IntroPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold">Private Equity Wants a Clean Business</h2>
    
    <div className="text-lg space-y-4 text-muted-foreground">
      <p>
        When PE firms say they want an <strong className="text-foreground">"asset free, debt free, cash free"</strong> transaction, 
        most business owners get confused. Let's break this down in plain English.
      </p>
      
      <div className="bg-accent/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-accent/30">
        <p className="font-semibold mb-2 text-foreground">Here's the simple truth:</p>
        <p className="text-muted-foreground">
          PE buyers want to purchase your <em>operating business</em> - the machine that makes money. 
          They don't want your personal stuff, your debt, or complications.
        </p>
      </div>
      
      <p>
        Think of it like selling a restaurant. The buyer wants the kitchen equipment, 
        the recipes, and the customer list. They don't want your personal car parked 
        out back or the loan you took to renovate your house.
      </p>
    </div>
    
    <div className="mt-8 grid grid-cols-3 gap-4">
      <div className="text-center p-4 bg-success/10 backdrop-blur-sm border border-success/30 rounded-lg">
        <DollarSign className="w-12 h-12 text-success mx-auto mb-2" />
        <p className="font-semibold">Cash Free</p>
        <p className="text-sm text-muted-foreground">Explained on page 4</p>
      </div>
      <div className="text-center p-4 bg-destructive/10 backdrop-blur-sm border border-destructive/30 rounded-lg">
        <Building className="w-12 h-12 text-destructive mx-auto mb-2" />
        <p className="font-semibold">Asset Free</p>
        <p className="text-sm text-muted-foreground">Core assets only</p>
      </div>
      <div className="text-center p-4 bg-warning/10 backdrop-blur-sm border border-warning/30 rounded-lg">
        <DollarSign className="w-12 h-12 text-warning mx-auto mb-2" />
        <p className="font-semibold">Debt Free</p>
        <p className="text-sm text-muted-foreground">Clean balance sheet</p>
      </div>
    </div>
  </div>
);

const CoreAssetsPage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const assets = [
    { id: 'truck', icon: Truck, label: 'Delivery Trucks', isCore: true, reason: 'Delivers your product to customers' },
    { id: 'bmw', icon: Car, label: "Owner's BMW", isCore: false, reason: 'Personal vehicle, not for operations' },
    { id: 'computers', icon: Home, label: 'Office Computers', isCore: true, reason: 'Employees need these to work' },
    { id: 'boat', icon: Anchor, label: 'Fishing Boat', isCore: false, reason: 'Entertainment, not revenue generating' },
    { id: 'warehouse', icon: Building, label: 'Warehouse Equipment', isCore: true, reason: 'Required for daily operations' },
    { id: 'condo', icon: Building, label: 'Beach Condo', isCore: false, reason: 'Personal property in company name' }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Quiz: Core or Not Core?</h2>
      
      <p className="text-lg text-muted-foreground">
        Click on the assets that are <strong className="text-foreground">CORE</strong> to running the business:
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {assets.map(asset => {
          const Icon = asset.icon;
          const isSelected = selectedItems.includes(asset.id);
          const showResult = isSelected;
          
          return (
            <button
              key={asset.id}
              onClick={() => setSelectedItems([...selectedItems, asset.id])}
              className={`p-4 rounded-lg border-2 transition-all ${
                showResult
                  ? asset.isCore
                    ? 'border-success bg-success/10 backdrop-blur-sm'
                    : 'border-destructive bg-destructive/10 backdrop-blur-sm'
                  : 'border-border hover:border-muted-foreground bg-card'
              }`}
            >
              <Icon className={`w-12 h-12 mx-auto mb-2 ${
                showResult
                  ? asset.isCore ? 'text-success' : 'text-destructive'
                  : 'text-muted-foreground'
              }`} />
              <p className="font-semibold">{asset.label}</p>
              {showResult && (
                <p className="text-sm mt-2 text-muted-foreground">{asset.reason}</p>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="bg-muted/50 backdrop-blur-sm p-4 rounded-lg border-l-4 border-muted/30">
        <p className="font-semibold mb-2">Remember:</p>
        <p className="text-sm text-muted-foreground">
          Core assets are things the business NEEDS to operate and generate revenue. 
          If it's personal, recreational, or the business could easily rent/lease it instead, it's NOT core.
        </p>
      </div>
    </div>
  );
};

const BuildingExplanation: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold">Why Your Building Isn't Core</h2>
    
    <div className="bg-warning/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-warning/30">
      <p className="text-lg font-semibold mb-2">
        "But I've owned this building for 20 years!"
      </p>
      <p className="text-muted-foreground">
        We get it. But here's why PE buyers don't want to buy your real estate...
      </p>
    </div>
    
    <div className="space-y-4">
      <div className="flex items-start space-x-4">
        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
        <div>
          <p className="font-semibold">They're not in the real estate business</p>
          <p className="text-muted-foreground">PE firms buy operating companies, not property management companies.</p>
        </div>
      </div>
      
      <div className="flex items-start space-x-4">
        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
        <div>
          <p className="font-semibold">It ties up capital</p>
          <p className="text-muted-foreground">They'd rather use that money to grow the business, not own a building.</p>
        </div>
      </div>
      
      <div className="flex items-start space-x-4">
        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
        <div>
          <p className="font-semibold">Flexibility matters</p>
          <p className="text-muted-foreground">What if they want to move locations or expand? Leasing gives options.</p>
        </div>
      </div>
    </div>
    
    <div className="bg-success/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-success/30">
      <p className="font-semibold mb-2">The Solution: Sell-Leaseback</p>
      <p className="text-muted-foreground">
        You keep the building personally and lease it back to the company at market rates. 
        You get rental income, they get a clean transaction. Everyone wins.
      </p>
    </div>
  </div>
);

const CashDebtExplanation: React.FC = () => {
  const [showExample, setShowExample] = useState(false);
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Cash & Debt at Closing</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 bg-success/10 backdrop-blur-sm border border-success/30">
          <DollarSign className="w-12 h-12 text-success mb-4" />
          <h3 className="text-xl font-semibold mb-2">Cash Free</h3>
          <p className="text-muted-foreground mb-4">
            Any cash in the business bank accounts at closing goes to YOU, the seller.
          </p>
          <p className="text-sm text-muted-foreground">
            If you have $300K in the bank, you get that $300K on top of the purchase price. 
            The buyer starts with their own working capital.
          </p>
        </Card>
        
        <Card className="p-6 bg-destructive/10 backdrop-blur-sm border border-destructive/30">
          <DollarSign className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-xl font-semibold mb-2">Debt Free</h3>
          <p className="text-muted-foreground mb-4">
            All company debt must be paid off at or before closing.
          </p>
          <p className="text-sm text-muted-foreground">
            SBA loans, equipment financing, lines of credit - all gone. 
            This usually comes out of the purchase price at closing.
          </p>
        </Card>
      </div>
      
      <Button 
        onClick={() => setShowExample(!showExample)}
        variant="outline"
        className="w-full"
      >
        {showExample ? 'Hide' : 'Show'} Real Example
      </Button>
      
      {showExample && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Example: $10M Purchase Price</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Purchase Price:</span>
              <span>$10,000,000</span>
            </div>
            <div className="flex justify-between text-destructive">
              <span>Less: SBA Loan Payoff:</span>
              <span>($500,000)</span>
            </div>
            <div className="flex justify-between text-destructive">
              <span>Less: Equipment Loans:</span>
              <span>($200,000)</span>
            </div>
            <div className="flex justify-between text-success">
              <span>Plus: Cash in Bank:</span>
              <span>$300,000</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-border">
              <span>You Receive:</span>
              <span>$9,600,000</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

const DebtPayoffPage: React.FC = () => {
  const [showSolution, setShowSolution] = useState(false);
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        When You Can't Pay Debt Before Closing
      </h2>
      
      <Card className="bg-destructive/10 backdrop-blur-sm p-6 rounded-lg border-l-4 border-destructive/30">
        <h3 className="text-destructive font-semibold mb-3">The $1M Problem:</h3>
        <p className="text-muted-foreground">
          You have a $1,000,000 business loan. The buyer wants an "asset free, debt free" deal. 
          You're getting $3,000,000 at closing but can't afford to pay the debt off early.
        </p>
        <p className="text-foreground font-semibold mt-3">
          What do you do?
        </p>
      </Card>
      
      <Button 
        onClick={() => setShowSolution(true)} 
        className="w-full"
        disabled={showSolution}
      >
        See the Solution
      </Button>
      
      {showSolution && (
        <div className="space-y-4 animate-fade-in">
          <Card className="bg-success/10 backdrop-blur-sm p-6 rounded-lg border-l-4 border-success/30">
            <h3 className="text-success font-semibold mb-3">✅ The Escrow Solution:</h3>
            
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Step 1:</strong> Tell your attorney EARLY (during LOI stage) about the debt situation.
              </p>
              
              <p>
                <strong className="text-foreground">Step 2:</strong> Attorneys structure a "payoff at closing" arrangement:
              </p>
              
              <div className="ml-6 space-y-2">
                <p>• $1M of the $3M purchase price goes to escrow</p>
                <p>• Escrow agent pays your lender directly at closing</p>
                <p>• You receive the remaining $2M</p>
                <p>• Debt is cleared, buyer gets clean assets</p>
              </div>
              
              <p>
                <strong className="text-foreground">Step 3:</strong> This gets properly documented in the purchase agreement.
              </p>
            </div>
          </Card>
          
          <Card className="bg-primary/10 backdrop-blur-sm p-6 rounded-lg border-l-4 border-primary/30">
            <h3 className="text-primary font-semibold mb-2">The Smart Seller's Position:</h3>
            <p className="text-muted-foreground italic">
              "I'm happy to deliver a debt-free business, but I'm not paying off debt early 
              on a deal that might not close. We'll handle all debt from closing proceeds 
              through proper escrow arrangements."
            </p>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold text-foreground mb-2">Why This Works:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Protects you if deal falls apart</li>
                <li>• Buyer still gets debt-free business</li>
                <li>• Lender gets paid in full</li>
                <li>• Everyone's protected legally</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold text-foreground mb-2">Common Debts Handled This Way:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Equipment loans</li>
                <li>• Lines of credit</li>
                <li>• SBA loans</li>
                <li>• Vehicle financing</li>
                <li>• Even some leases</li>
              </ul>
            </Card>
          </div>
          
          <Card className="bg-warning/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-warning/30">
            <p className="text-warning font-semibold">⚠️ Critical Timing:</p>
            <p className="text-muted-foreground text-sm">
              This MUST be discussed during LOI negotiations, not at the closing table. 
              Good attorneys on both sides can paper this properly, but they need time.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

const LeasesPage: React.FC = () => {
  const [showExamples, setShowExamples] = useState(false);
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        Leases: What Stays, What Goes
      </h2>
      
      <Card className="bg-primary/10 backdrop-blur-sm p-6 rounded-lg border-l-4 border-primary/30">
        <h3 className="text-primary font-semibold mb-3">The Lease Reality:</h3>
        <p className="text-muted-foreground">
          Leases are essentially loans - you're paying for something over time that you don't own. 
          PE buyers are fine with CORE business leases, but personal or non-essential leases must go.
        </p>
      </Card>
      
      <Button 
        onClick={() => setShowExamples(true)} 
        className="w-full"
        disabled={showExamples}
      >
        See Real Examples
      </Button>
      
      {showExamples && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-success/10 backdrop-blur-sm p-6 rounded-lg border-l-4 border-success/30">
              <h3 className="text-success font-semibold mb-3">✅ Acceptable Leases (Keep):</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Office copier/printer</li>
                <li>• Warehouse forklift</li>
                <li>• Company vehicles (delivery trucks)</li>
                <li>• Office space</li>
                <li>• Essential equipment</li>
                <li>• Software licenses</li>
              </ul>
              <p className="text-foreground font-semibold mt-4">
                These are core to operations
              </p>
            </Card>
            
            <Card className="bg-destructive/10 backdrop-blur-sm p-6 rounded-lg border-l-4 border-destructive/30">
              <h3 className="text-destructive font-semibold mb-3">❌ Unacceptable Leases (Remove):</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Jet ski for "client entertainment"</li>
                <li>• Luxury car for personal use</li>
                <li>• Boat at the marina</li>
                <li>• Country club membership</li>
                <li>• Vacation property</li>
                <li>• Personal aircraft</li>
              </ul>
              <p className="text-foreground font-semibold mt-4">
                Not core = must be removed
              </p>
            </Card>
          </div>
          
          <Card className="bg-warning/10 backdrop-blur-sm p-6 rounded-lg border-l-4 border-warning/30">
            <h3 className="text-warning font-semibold mb-3">⚠️ How to Handle Non-Core Leases:</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">Option 1:</strong> Transfer lease to your personal name before closing
              </p>
              <p>
                <strong className="text-foreground">Option 2:</strong> Pay off the lease entirely (buyout)
              </p>
              <p>
                <strong className="text-foreground">Option 3:</strong> Return the leased item to lessor
              </p>
              <p className="text-yellow-400 mt-3">
                Do this EARLY - lease transfers can take 30-60 days!
              </p>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-3">The Gray Area Test:</h3>
            <p className="text-muted-foreground mb-4">
              Ask yourself: "If this lease disappeared tomorrow, would the business still operate normally?"
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <span className="text-success">YES →</span> It's not core, remove it
              </p>
              <p className="text-muted-foreground">
                <span className="text-destructive">NO →</span> It's core, keep it
              </p>
            </div>
          </Card>
          
          <Card className="bg-primary/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-primary/30">
            <p className="text-primary font-semibold">Remember:</p>
            <p className="text-muted-foreground text-sm">
              PE buyers aren't being difficult - they just want to buy a clean operating business, 
              not inherit your toys or tax write-offs. Clean up leases early to avoid last-minute scrambles.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

const ChecklistPage: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  
  const checklistItems = [
    { id: 'vehicles', label: 'List all vehicles - separate work trucks from personal cars' },
    { id: 'realestate', label: 'Identify any real estate - plan for lease-back if needed' },
    { id: 'equipment', label: 'Review equipment - is it all used for operations?' },
    { id: 'boats', label: 'Remove recreational assets (boats, RVs, etc.)' },
    { id: 'art', label: 'Take personal items home (art, collections)' },
    { id: 'debt', label: 'Get current payoff amounts for all loans' },
    { id: 'cash', label: 'Understand your working capital needs' }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Your Clean-Up Checklist</h2>
      
      <p className="text-lg text-muted-foreground">
        Before you talk to PE buyers, you should consider cleaning up your business:
      </p>
      
      <div className="space-y-3">
        {checklistItems.map(item => (
          <label
            key={item.id}
            className="flex items-center p-4 rounded-lg border border-border hover:bg-accent cursor-pointer"
          >
            <input
              type="checkbox"
              checked={checkedItems.includes(item.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setCheckedItems([...checkedItems, item.id]);
                } else {
                  setCheckedItems(checkedItems.filter(id => id !== item.id));
                }
              }}
              className="w-5 h-5 mr-4"
            />
            <span className={checkedItems.includes(item.id) ? 'line-through text-muted-foreground' : ''}>
              {item.label}
            </span>
          </label>
        ))}
      </div>
      
      <div className="bg-accent/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-accent/30">
        <p className="font-semibold mb-2">Pro Tip:</p>
        <p className="text-muted-foreground">
          Start this clean-up process at least 12 months before you plan to sell. 
          Some changes (like removing assets) can affect your taxes and financial statements.
        </p>
      </div>
      
      {checkedItems.length === checklistItems.length && (
        <div className="bg-success/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-success/30 text-center">
          <p className="text-2xl font-bold text-success mb-2">🎉 You're Ready!</p>
          <p className="text-muted-foreground">Your business is starting to look attractive to PE buyers.</p>
        </div>
      )}
    </div>
  );
};

export default AssetFreeEducation;
