import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { CourseNavigationFooter } from '@/components/CourseNavigationFooter';

export const ProfessionalAdvisorsEducation: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    {
      title: "Larry the Lawyer Can't Do This Deal",
      content: <IntroPage />
    },
    {
      title: "Investment Banker - Your Quarterback",
      content: <BankerPage />
    },
    {
      title: "M&A Attorney - Not Your Guy",
      content: <AttorneyPage />
    },
    {
      title: "QoE Accountant - Find the Money",
      content: <AccountantPage />
    },
    {
      title: "Managing the Costs",
      content: <CostPage />
    }
  ];
  
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
        
        <Button
          onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
          disabled={currentPage === pages.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Show navigation footer only when completed all pages */}
      {currentPage === pages.length - 1 && (
        <CourseNavigationFooter currentModulePath="/portal/week-1/professional-advisors" />
      )}
    </div>
  );
};

const IntroPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold">Your Cousin Larry the Lawyer Can't Do This Deal</h2>
    
    <div className="bg-destructive/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-destructive/30">
      <p className="text-destructive font-semibold mb-2">Reality Check:</p>
      <p className="text-muted-foreground">
        PE buyers have teams doing 20+ deals a year. You'll do one. 
        Using your cousin Larry or other regular advisors is like bringing a knife to a gunfight.
      </p>
    </div>
    
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Your PE Deal Team:</h3>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl mb-2">🎯</div>
          <p className="font-semibold">Investment Banker</p>
          <p className="text-sm text-muted-foreground">Runs the process</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl mb-2">⚖️</div>
          <p className="font-semibold">M&A Attorney</p>
          <p className="text-sm text-muted-foreground">Protects you</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="font-semibold">QoE Accountant</p>
          <p className="text-sm text-muted-foreground">Proves value</p>
        </Card>
      </div>
    </div>
  </div>
);

const BankerPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold">Investment Banker: Your Quarterback</h2>
    
    <div className="bg-success/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-success/30">
      <p className="text-success font-semibold mb-2">What They Do:</p>
      <ul className="space-y-2 text-muted-foreground">
        <li>• Create competitive auction (adds 15-30% to price)</li>
        <li>• Know 50+ PE funds personally</li>
        <li>• Manage entire process start to finish</li>
      </ul>
    </div>
    
    <Card className="p-6">
      <h3 className="font-semibold mb-3">How They Get Paid:</h3>
      <div className="space-y-2 text-muted-foreground">
        <p>• Retainer: $25-100K monthly</p>
        <p>• Success fee: 2-6% at closing</p>
        <p>• Modified Lehman Formula common</p>
        <p className="text-warning mt-3">⚠️ Watch for tail periods!</p>
      </div>
    </Card>
    
    <div className="bg-destructive/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-destructive/30">
      <p className="text-destructive font-semibold">Red Flag:</p>
      <p className="text-muted-foreground">Can't name 10 PE deals in last 2 years = No real relationships</p>
    </div>
  </div>
);

const AttorneyPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold">M&A Attorney: Specialist Required</h2>
    
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-destructive/10 backdrop-blur-sm border border-destructive/30 p-4">
        <h3 className="text-destructive font-semibold mb-2">❌ Your Business Attorney</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Takes 300 hours for 100-hour job</li>
          <li>• Misses PE protections</li>
          <li>• Costs you $2M in bad terms</li>
        </ul>
      </Card>
      
      <Card className="bg-success/10 backdrop-blur-sm border border-success/30 p-4">
        <h3 className="text-success font-semibold mb-2">✅ M&A Specialist</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Done 50+ PE deals</li>
          <li>• Knows every PE trick</li>
          <li>• Same cost, better terms</li>
        </ul>
      </Card>
    </div>
    
    <div className="bg-warning/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-warning/30">
      <h3 className="text-warning font-semibold mb-2">Control Legal Bills:</h3>
      <ul className="space-y-2 text-muted-foreground text-sm">
        <li>• 15-minute cap on unscheduled calls</li>
        <li>• Always send agenda first</li>
        <li>• Batch your questions</li>
        <li>• Decide internally before calling</li>
      </ul>
    </div>
  </div>
);

const AccountantPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold">QoE: Find Hidden EBITDA</h2>
    
    <div className="bg-accent/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-accent/30">
      <div className="text-center mb-4">
        <p className="text-muted-foreground">Your CPA says:</p>
        <p className="text-3xl font-mono">$3M EBITDA</p>
      </div>
      <div className="text-center">
        <p className="text-accent">QoE finds:</p>
        <p className="text-3xl font-mono">$4.2M EBITDA</p>
      </div>
      <p className="text-success text-center mt-4">= $6M more at 5x multiple</p>
    </div>
    
    <Card className="p-6">
      <h3 className="font-semibold mb-3">What QoE Finds:</h3>
      <ul className="space-y-2 text-muted-foreground text-sm">
        <li>• Owner excess compensation</li>
        <li>• One-time expenses</li>
        <li>• Personal expenses in P&L</li>
        <li>• Related party transactions</li>
      </ul>
      <p className="text-warning mt-4">Cost: $30-100K | Return: Often 50x+</p>
    </Card>
  </div>
);

const CostPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold">Yes, It's Expensive. It's Worth It.</h2>
    
    <div className="bg-accent/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-accent/30">
      <h3 className="text-accent font-semibold mb-3">Typical All-In Costs:</h3>
      <div className="space-y-2 text-muted-foreground">
        <div className="flex justify-between">
          <span>$10M Deal:</span>
          <span className="font-mono">$500-700K</span>
        </div>
        <div className="flex justify-between">
          <span>$50M Deal:</span>
          <span className="font-mono">$1.5-2.5M</span>
        </div>
      </div>
    </div>
    
    <div className="bg-success/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-success/30">
      <p className="text-success font-semibold mb-2">The Math:</p>
      <p className="text-muted-foreground">
        Good advisors typically add 15-30% to your price.
        On a $20M deal, that's $3-6M extra.
        Cost: $800K. Net gain: $2.2-5.2M.
      </p>
      <p className="font-semibold mt-3">ROI: 3-7x</p>
    </div>
    
    <div className="bg-warning/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-warning/30">
      <p className="text-warning font-semibold">Remember:</p>
      <p className="text-muted-foreground">
        Only the banker's success fee waits for closing. 
        Lawyers and QoE get paid regardless. Budget accordingly.
      </p>
    </div>
  </div>
);

export default ProfessionalAdvisorsEducation;
