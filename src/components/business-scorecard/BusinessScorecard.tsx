
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronLeft, AlertTriangle, DollarSign, TrendingDown, XCircle } from 'lucide-react';

interface ScorecardCategory {
  name: string;
  weight: number;
  score: number;
  maxImpactM: number;
  details: string[];
}

export const BusinessScorecard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [categories, setCategories] = useState<ScorecardCategory[]>([
    { name: 'Financial Performance', weight: 30, score: 0, maxImpactM: 3, details: [] },
    { name: 'Revenue Quality', weight: 25, score: 0, maxImpactM: 2.5, details: [] },
    { name: 'Customer Concentration', weight: 20, score: 0, maxImpactM: 2, details: [] },
    { name: 'Operational Excellence', weight: 15, score: 0, maxImpactM: 1.5, details: [] },
    { name: 'Market Position', weight: 10, score: 0, maxImpactM: 1, details: [] }
  ]);

  const [pageAnswered, setPageAnswered] = useState<Record<number, boolean>>({});

  const pages = useMemo(() => [
    { title: "PE's Brutal Scoring System", content: <IntroPage /> },
    { title: "Financial Performance Check", content: <FinancialPage setCategories={setCategories} markAnswered={() => setPageAnswered(p => ({ ...p, 1: true }))} /> },
    { title: "Revenue Quality Assessment", content: <RevenuePage setCategories={setCategories} markAnswered={() => setPageAnswered(p => ({ ...p, 2: true }))} /> },
    { title: "Customer Concentration Risk", content: <CustomerPage setCategories={setCategories} markAnswered={() => setPageAnswered(p => ({ ...p, 3: true }))} /> },
    { title: "Operational Excellence", content: <OperationalPage setCategories={setCategories} markAnswered={() => setPageAnswered(p => ({ ...p, 4: true }))} /> },
    { title: "Market Position", content: <MarketPage setCategories={setCategories} markAnswered={() => setPageAnswered(p => ({ ...p, 5: true }))} /> },
    { title: "Your PE Readiness Report", content: <ReportPage categories={categories} /> }
  ], [categories]);

  return (
    <div>
      <div className="mb-8">
        <Progress value={(currentPage + 1) / pages.length * 100} className="h-2" />
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

const IntroPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-foreground">
      How PE Firms Actually Score Your Business
    </h2>
    
    <Alert className="border-destructive/30">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <span className="font-semibold">The Hard Truth:</span> PE firms run your business through a scoring matrix. 
        Every weakness directly reduces your valuation. A "70% ready" business gets a 30% valuation haircut.
      </AlertDescription>
    </Alert>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 bg-card border-border">
        <DollarSign className="w-8 h-8 text-primary mb-3" />
        <h3 className="text-xl font-semibold mb-3">What PE Rewards</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Predictable, growing revenue</li>
          <li>• Diverse customer base</li>
          <li>• Scalable operations</li>
          <li>• Strong margins & cash flow</li>
          <li>• Market leadership position</li>
        </ul>
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <TrendingDown className="w-8 h-8 text-destructive mb-3" />
        <h3 className="text-xl font-semibold mb-3">What Kills Value</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Customer concentration &gt;30%</li>
          <li>• Declining or lumpy revenue</li>
          <li>• Owner dependency</li>
          <li>• Weak systems & processes</li>
          <li>• Commodity market position</li>
        </ul>
      </Card>
    </div>
    
    <Card className="p-6 bg-card border-border">
      <h3 className="text-xl font-semibold mb-3">The Scoring Impact</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium">90-100% Score</span>
          <span className="text-primary font-bold">Premium valuation (6-8x EBITDA)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">70-89% Score</span>
          <span className="text-yellow-600 dark:text-yellow-400 font-bold">Market valuation (4-6x EBITDA)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">50-69% Score</span>
          <span className="text-orange-600 dark:text-orange-400 font-bold">Discounted value (3-4x EBITDA)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">&lt;50% Score</span>
          <span className="text-destructive font-bold">No deal or fire sale (2-3x EBITDA)</span>
        </div>
      </div>
    </Card>
  </div>
);

const FinancialPage: React.FC<{ 
  setCategories: React.Dispatch<React.SetStateAction<ScorecardCategory[]>>; 
  markAnswered: () => void; 
}> = ({ setCategories, markAnswered }) => {
  const [answers, setAnswers] = useState({ growth: '', margins: '', consistency: '', cashflow: '' });

  useEffect(() => {
    if (Object.values(answers).some(a => a)) markAnswered();

    let score = 0;
    const details: string[] = [];
    
    if (answers.growth === 'yes') score += 25;
    else if (answers.growth === 'no') details.push('Revenue growth below 15% annually');
    
    if (answers.margins === 'yes') score += 25;
    else if (answers.margins === 'no') details.push('EBITDA margins below industry average');
    
    if (answers.consistency === 'yes') score += 25;
    else if (answers.consistency === 'no') details.push('Inconsistent monthly/quarterly performance');
    
    if (answers.cashflow === 'yes') score += 25;
    else if (answers.cashflow === 'no') details.push('Poor cash conversion cycle');

    setCategories(prev => {
      const updated = [...prev];
      updated[0] = { ...updated[0], score, details };
      return updated;
    });
  }, [answers, setCategories, markAnswered]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Financial Performance Reality Check</h2>
      <p className="text-muted-foreground">PE firms want predictable, growing, high-margin businesses. Every "no" costs you money.</p>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Revenue Growth</h3>
        <p className="text-sm text-muted-foreground mb-4">Have you grown revenue 15%+ annually for the last 3 years?</p>
        <RadioGroup value={answers.growth} onValueChange={(value) => setAnswers(prev => ({...prev, growth: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="fin-growth-yes" />
              <Label htmlFor="fin-growth-yes">Yes - Consistent 15%+ growth</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="fin-growth-no" />
              <Label htmlFor="fin-growth-no">No - Below 15% or inconsistent</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.growth === 'no' && (
          <Alert className="mt-4 border-destructive/30">
            <AlertDescription><strong>Impact:</strong> Reduces multiple by 0.5-1x. PE wants growth stories.</AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">EBITDA Margins</h3>
        <p className="text-sm text-muted-foreground mb-4">Are your EBITDA margins above 20% (or top quartile for your industry)?</p>
        <RadioGroup value={answers.margins} onValueChange={(value) => setAnswers(prev => ({...prev, margins: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="fin-margins-yes" />
              <Label htmlFor="fin-margins-yes">Yes - Strong margins for industry</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="fin-margins-no" />
              <Label htmlFor="fin-margins-no">No - Below industry average</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.margins === 'no' && (
          <Alert className="mt-4 border-destructive/30">
            <AlertDescription><strong>Impact:</strong> Every 5% below average = -$500K in valuation.</AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Performance Consistency</h3>
        <p className="text-sm text-muted-foreground mb-4">Is your monthly revenue predictable within 10% variance?</p>
        <RadioGroup value={answers.consistency} onValueChange={(value) => setAnswers(prev => ({...prev, consistency: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="fin-consistency-yes" />
              <Label htmlFor="fin-consistency-yes">Yes - Smooth, predictable revenue</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="fin-consistency-no" />
              <Label htmlFor="fin-consistency-no">No - Lumpy or seasonal swings</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.consistency === 'no' && (
          <Alert className="mt-4 border-destructive/30">
            <AlertDescription><strong>Impact:</strong> Lumpy revenue = lower multiple by 0.5-1.5x.</AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Cash Flow Conversion</h3>
        <p className="text-sm text-muted-foreground mb-4">Do you convert 80%+ of EBITDA to free cash flow?</p>
        <RadioGroup value={answers.cashflow} onValueChange={(value) => setAnswers(prev => ({...prev, cashflow: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="fin-cashflow-yes" />
              <Label htmlFor="fin-cashflow-yes">Yes - Strong cash generation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="fin-cashflow-no" />
              <Label htmlFor="fin-cashflow-no">No - Poor cash conversion</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.cashflow === 'no' && (
          <Alert className="mt-4 border-destructive/30">
            <AlertDescription><strong>Impact:</strong> PE values cash, not accounting profits.</AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
};

const RevenuePage: React.FC<{ 
  setCategories: React.Dispatch<React.SetStateAction<ScorecardCategory[]>>; 
  markAnswered: () => void; 
}> = ({ setCategories, markAnswered }) => {
  const [answers, setAnswers] = useState({ recurring: '', contracts: '', churn: '' });

  useEffect(() => {
    if (Object.values(answers).some(a => a)) markAnswered();

    let score = 0;
    const details: string[] = [];
    
    if (answers.recurring === 'yes') score += 40;
    else if (answers.recurring === 'no') details.push('Less than 60% recurring revenue');
    
    if (answers.contracts === 'yes') score += 30;
    else if (answers.contracts === 'no') details.push('Weak or missing customer contracts');
    
    if (answers.churn === 'yes') score += 30;
    else if (answers.churn === 'no') details.push('Customer churn above 10% annually');

    setCategories(prev => {
      const updated = [...prev];
      updated[1] = { ...updated[1], score, details };
      return updated;
    });
  }, [answers, setCategories, markAnswered]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Revenue Quality Deep Dive</h2>
      <p className="text-muted-foreground">PE firms pay premium multiples for recurring, contracted, sticky revenue.</p>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Recurring Revenue</h3>
        <p className="text-sm text-muted-foreground mb-4">Is 60%+ of your revenue recurring or subscription-based?</p>
        <RadioGroup value={answers.recurring} onValueChange={(value) => setAnswers(prev => ({...prev, recurring: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="rev-recurring-yes" />
              <Label htmlFor="rev-recurring-yes">Yes - Majority is recurring/subscription</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="rev-recurring-no" />
              <Label htmlFor="rev-recurring-no">No - Mostly project or transactional</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.recurring === 'no' && (
          <Alert className="mt-4 border-destructive/30">
            <AlertDescription><strong>Impact:</strong> Project revenue gets 3-4x. Recurring gets 5-7x.</AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Customer Contracts</h3>
        <p className="text-sm text-muted-foreground mb-4">Do you have multi-year contracts with 50%+ of revenue?</p>
        <RadioGroup value={answers.contracts} onValueChange={(value) => setAnswers(prev => ({...prev, contracts: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="rev-contracts-yes" />
              <Label htmlFor="rev-contracts-yes">Yes - Strong multi-year contracts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="rev-contracts-no" />
              <Label htmlFor="rev-contracts-no">No - Month-to-month or handshake deals</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.contracts === 'no' && (
          <Alert className="mt-4 border-destructive/30">
            <AlertDescription><strong>Impact:</strong> No contracts = revenue at risk = massive discount.</AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Customer Retention</h3>
        <p className="text-sm text-muted-foreground mb-4">Is your annual customer churn below 10%?</p>
        <RadioGroup value={answers.churn} onValueChange={(value) => setAnswers(prev => ({...prev, churn: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="rev-churn-yes" />
              <Label htmlFor="rev-churn-yes">Yes - Less than 10% annual churn</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="rev-churn-no" />
              <Label htmlFor="rev-churn-no">No - Losing 10%+ customers yearly</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.churn === 'no' && (
          <Alert className="mt-4 border-destructive/30">
            <AlertDescription><strong>Impact:</strong> High churn = broken business model. PE will run.</AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
};

const CustomerPage: React.FC<{ 
  setCategories: React.Dispatch<React.SetStateAction<ScorecardCategory[]>>; 
  markAnswered: () => void; 
}> = ({ setCategories, markAnswered }) => {
  const [answers, setAnswers] = useState({ concentration: '', top10: '', industry: '' });

  useEffect(() => {
    if (Object.values(answers).some(a => a)) markAnswered();

    let score = 0;
    const details: string[] = [];
    
    if (answers.concentration === 'yes') score += 50;
    else if (answers.concentration === 'no') details.push('Customer concentration exceeds 30%');
    
    if (answers.top10 === 'yes') score += 30;
    else if (answers.top10 === 'no') details.push('Top 10 customers exceed 50% of revenue');
    
    if (answers.industry === 'yes') score += 20;
    else if (answers.industry === 'no') details.push('Over-concentrated in single industry');

    setCategories(prev => {
      const updated = [...prev];
      updated[2] = { ...updated[2], score, details };
      return updated;
    });
  }, [answers, setCategories, markAnswered]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Customer Concentration Kill Zone</h2>
      
      <Alert className="border-destructive/30">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <span className="font-semibold">Deal Killer Alert:</span> Customer concentration is the #1 deal killer.
        </AlertDescription>
      </Alert>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Largest Customer Risk</h3>
        <p className="text-sm text-muted-foreground mb-4">Is your largest customer less than 15% of revenue?</p>
        <RadioGroup value={answers.concentration} onValueChange={(value) => setAnswers(prev => ({...prev, concentration: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="cust-concentration-yes" />
              <Label htmlFor="cust-concentration-yes">Yes - No customer exceeds 15%</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="cust-concentration-no" />
              <Label htmlFor="cust-concentration-no">No - Have customer(s) over 15%</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.concentration === 'no' && (
          <Alert className="mt-4 border-destructive/30">
            <AlertDescription><strong>Impact:</strong> Customer at 30% = -$1M. At 50% = deal dead.</AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Top 10 Customer Spread</h3>
        <p className="text-sm text-muted-foreground mb-4">Do your top 10 customers represent less than 40% of revenue?</p>
        <RadioGroup value={answers.top10} onValueChange={(value) => setAnswers(prev => ({...prev, top10: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="cust-top10-yes" />
              <Label htmlFor="cust-top10-yes">Yes - Well diversified beyond top 10</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="cust-top10-no" />
              <Label htmlFor="cust-top10-no">No - Top 10 exceed 40% of revenue</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Industry Diversification</h3>
        <p className="text-sm text-muted-foreground mb-4">Are you diversified across 3+ industries/verticals?</p>
        <RadioGroup value={answers.industry} onValueChange={(value) => setAnswers(prev => ({...prev, industry: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="cust-industry-yes" />
              <Label htmlFor="cust-industry-yes">Yes - Multiple industry exposure</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="cust-industry-no" />
              <Label htmlFor="cust-industry-no">No - Concentrated in 1-2 industries</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
    </div>
  );
};

const OperationalPage: React.FC<{ 
  setCategories: React.Dispatch<React.SetStateAction<ScorecardCategory[]>>; 
  markAnswered: () => void; 
}> = ({ setCategories, markAnswered }) => {
  const [answers, setAnswers] = useState({ systems: '', dependency: '', scalability: '' });

  useEffect(() => {
    if (Object.values(answers).some(a => a)) markAnswered();

    let score = 0;
    const details: string[] = [];
    
    if (answers.systems === 'yes') score += 35;
    else if (answers.systems === 'no') details.push('Weak systems and processes');
    
    if (answers.dependency === 'yes') score += 35;
    else if (answers.dependency === 'no') details.push('High owner dependency');
    
    if (answers.scalability === 'yes') score += 30;
    else if (answers.scalability === 'no') details.push('Limited scalability without major investment');

    setCategories(prev => {
      const updated = [...prev];
      updated[3] = { ...updated[3], score, details };
      return updated;
    });
  }, [answers, setCategories, markAnswered]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Operational Excellence Check</h2>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Systems & Processes</h3>
        <p className="text-sm text-muted-foreground mb-4">Do you have documented processes and modern systems (ERP, CRM)?</p>
        <RadioGroup value={answers.systems} onValueChange={(value) => setAnswers(prev => ({...prev, systems: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="ops-systems-yes" />
              <Label htmlFor="ops-systems-yes">Yes - Modern tech stack, documented processes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="ops-systems-no" />
              <Label htmlFor="ops-systems-no">No - Spreadsheets and tribal knowledge</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.systems === 'no' && (
          <Alert className="mt-4 border-destructive/30">
            <AlertDescription><strong>Impact:</strong> PE will budget $500K-2M for systems.</AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Owner Dependency</h3>
        <p className="text-sm text-muted-foreground mb-4">Can the business run for 30 days without you?</p>
        <RadioGroup value={answers.dependency} onValueChange={(value) => setAnswers(prev => ({...prev, dependency: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="ops-dependency-yes" />
              <Label htmlFor="ops-dependency-yes">Yes - Strong management, runs without me</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="ops-dependency-no" />
              <Label htmlFor="ops-dependency-no">No - I'm involved in everything</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.dependency === 'no' && (
          <Alert className="mt-4 border-destructive/30">
            <AlertDescription><strong>Impact:</strong> Owner dependency = 3-year earnout prison.</AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Scalability</h3>
        <p className="text-sm text-muted-foreground mb-4">Can you double revenue with current infrastructure?</p>
        <RadioGroup value={answers.scalability} onValueChange={(value) => setAnswers(prev => ({...prev, scalability: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="ops-scalability-yes" />
              <Label htmlFor="ops-scalability-yes">Yes - Built to scale efficiently</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="ops-scalability-no" />
              <Label htmlFor="ops-scalability-no">No - Would need major investment</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
    </div>
  );
};

const MarketPage: React.FC<{ 
  setCategories: React.Dispatch<React.SetStateAction<ScorecardCategory[]>>; 
  markAnswered: () => void; 
}> = ({ setCategories, markAnswered }) => {
  const [answers, setAnswers] = useState({ position: '', moat: '', market: '' });

  useEffect(() => {
    if (Object.values(answers).some(a => a)) markAnswered();

    let score = 0;
    const details: string[] = [];
    
    if (answers.position === 'yes') score += 40;
    else if (answers.position === 'no') details.push('Not a market leader');
    
    if (answers.moat === 'yes') score += 30;
    else if (answers.moat === 'no') details.push('No competitive moat');
    
    if (answers.market === 'yes') score += 30;
    else if (answers.market === 'no') details.push('Declining or saturated market');

    setCategories(prev => {
      const updated = [...prev];
      updated[4] = { ...updated[4], score, details };
      return updated;
    });
  }, [answers, setCategories, markAnswered]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Market Position Reality</h2>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Market Leadership</h3>
        <p className="text-sm text-muted-foreground mb-4">Are you top 3 in your market/niche?</p>
        <RadioGroup value={answers.position} onValueChange={(value) => setAnswers(prev => ({...prev, position: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="mkt-position-yes" />
              <Label htmlFor="mkt-position-yes">Yes - Clear market leader</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="mkt-position-no" />
              <Label htmlFor="mkt-position-no">No - Middle of the pack or unknown</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Competitive Moat</h3>
        <p className="text-sm text-muted-foreground mb-4">Do you have defensible competitive advantages?</p>
        <RadioGroup value={answers.moat} onValueChange={(value) => setAnswers(prev => ({...prev, moat: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="mkt-moat-yes" />
              <Label htmlFor="mkt-moat-yes">Yes - Clear competitive advantages</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="mkt-moat-no" />
              <Label htmlFor="mkt-moat-no">No - Easily replicated business</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Market Growth</h3>
        <p className="text-sm text-muted-foreground mb-4">Is your market growing 10%+ annually?</p>
        <RadioGroup value={answers.market} onValueChange={(value) => setAnswers(prev => ({...prev, market: value}))}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="mkt-market-yes" />
              <Label htmlFor="mkt-market-yes">Yes - Growing market with tailwinds</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="mkt-market-no" />
              <Label htmlFor="mkt-market-no">No - Flat or declining market</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
    </div>
  );
};

const ReportPage: React.FC<{ categories: ScorecardCategory[] }> = ({ categories }) => {
  const totalScore = categories.reduce((acc, cat) => acc + (cat.score * cat.weight / 100), 0);
  const hasAnswered = categories.some(c => c.score > 0);
  
  const readiness = totalScore >= 90 ? { text: 'Premium Ready', color: 'text-primary' } :
                    totalScore >= 70 ? { text: 'Market Ready', color: 'text-yellow-600 dark:text-yellow-400' } :
                    totalScore >= 50 ? { text: 'Needs Work', color: 'text-orange-600 dark:text-orange-400' } :
                    { text: 'Not Ready', color: 'text-destructive' };

  const totalImpact = categories.reduce((acc, cat) => acc + (cat.maxImpactM * (100 - cat.score) / 100), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Your PE Readiness Score</h2>
      
      {!hasAnswered ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Complete the assessment questions to see your PE readiness score.</AlertDescription>
        </Alert>
      ) : (
        <>
          <Card className="p-6 bg-card border-border">
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">{totalScore.toFixed(0)}%</p>
              <p className={`text-2xl font-semibold ${readiness.color}`}>{readiness.text}</p>
              <p className="text-lg mt-2 text-muted-foreground">
                Expected Multiple: {totalScore >= 90 ? '6-8x' : totalScore >= 70 ? '4-6x' : totalScore >= 50 ? '3-4x' : '2-3x'} EBITDA
              </p>
            </div>
          </Card>
          
          <Alert className="border-destructive/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <h3 className="text-xl font-semibold mb-2">Valuation Impact</h3>
              <p className="text-3xl font-bold text-destructive">-${totalImpact.toFixed(1)}M</p>
              <p className="text-sm text-muted-foreground">Lost value from current weaknesses</p>
            </AlertDescription>
          </Alert>
        </>
      )}
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Category Breakdown</h3>
        {categories.map((cat, i) => (
          <Card key={i} className="p-4 bg-card border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{cat.name}</span>
              <span className={`font-bold ${
                cat.score >= 80 ? 'text-primary' : 
                cat.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                'text-destructive'
              }`}>{cat.score}%</span>
            </div>
            <Progress value={cat.score} className="h-2 mb-2" />
            {cat.details.length > 0 && (
              <div className="mt-2">
                {cat.details.map((detail, j) => (
                  <p key={j} className="text-sm text-destructive flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />{detail}
                  </p>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
      
      {hasAnswered && (
        <Card className="p-6 bg-card border-border">
          <h3 className="text-xl font-semibold mb-4">Priority Actions to Increase Value</h3>
          {categories
            .filter(cat => cat.score < 80 && cat.score > 0)
            .sort((a, b) => (a.score * a.weight) - (b.score * b.weight))
            .slice(0, 5)
            .map((cat, i) => (
              <div key={i} className="flex items-start space-x-2 mb-3">
                <span className="font-bold text-primary">{i + 1}.</span>
                <div>
                  <p className="font-semibold">{cat.name} Improvements</p>
                  <p className="text-sm text-muted-foreground">
                    Current: {cat.score}% → Target: 80% | Impact: +${((cat.maxImpactM * (80 - cat.score)) / 100).toFixed(1)}M
                  </p>
                </div>
              </div>
            ))}
        </Card>
      )}
      
      <Alert>
        <DollarSign className="h-4 w-4" />
        <AlertDescription>
          <strong>Bottom Line:</strong> Every 10% improvement in your score adds $500K-1M to your exit value on a $2M EBITDA business.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default BusinessScorecard;
