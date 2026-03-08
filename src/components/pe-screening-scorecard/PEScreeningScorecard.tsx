
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
  Shield,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MinusCircle,
  TrendingUp,
  DollarSign,
  Building2,
  Users,
  Sparkles,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────

interface CompanyProfile {
  revenue: string;
  ebitda: string;
  ebitdaMargin: string;
  growthRate: string;
}

interface DealFit {
  sector: string;
  geography: string;
  valuationMultiple: string;
  customerConcentration: string;
  managementContinuity: string;
}

type Verdict = 'pass' | 'caution' | 'fail';

interface CriterionResult {
  name: string;
  target: string;
  actual: string;
  verdict: Verdict;
  note: string;
}

// ─── Screening Logic ──────────────────────────────────────────

function screenCompany(profile: CompanyProfile, dealFit: DealFit): CriterionResult[] {
  const rev = parseFloat(profile.revenue) || 0;
  const ebitda = parseFloat(profile.ebitda) || 0;
  const margin = parseFloat(profile.ebitdaMargin) || 0;
  const growth = parseFloat(profile.growthRate) || 0;
  const multiple = parseFloat(dealFit.valuationMultiple) || 0;
  const concentration = parseFloat(dealFit.customerConcentration) || 0;
  const ev = multiple * ebitda;

  const results: CriterionResult[] = [];

  // 1. Revenue Range
  results.push({
    name: 'Revenue Range',
    target: '$5M – $500M',
    actual: `$${rev.toFixed(1)}M`,
    verdict: rev >= 5 && rev <= 500 ? 'pass' : rev >= 2 && rev < 5 ? 'caution' : 'fail',
    note: rev >= 5 && rev <= 500
      ? 'Squarely in the PE mid-market sweet spot.'
      : rev >= 2 && rev < 5
      ? 'On the small end. Some PE firms will look; many won\'t.'
      : rev > 500
      ? 'Above mid-market range — large-cap PE or strategic buyers likely.'
      : 'Below the typical PE threshold. Growth equity or strategic sale may be better fit.',
  });

  // 2. EBITDA Range
  results.push({
    name: 'EBITDA Range',
    target: '$1.5M – $75M',
    actual: `$${ebitda.toFixed(1)}M`,
    verdict: ebitda >= 1.5 && ebitda <= 75 ? 'pass' : ebitda >= 0.75 && ebitda < 1.5 ? 'caution' : 'fail',
    note: ebitda >= 1.5 && ebitda <= 75
      ? 'This is the EBITDA range PE firms are actively hunting.'
      : ebitda >= 0.75 && ebitda < 1.5
      ? 'Borderline. A strong growth story could compensate.'
      : ebitda > 75
      ? 'Above mid-market — attracts large-cap PE firms.'
      : 'Below PE minimum. Needs significant growth before PE is realistic.',
  });

  // 3. EBITDA Margin
  results.push({
    name: 'EBITDA Margin',
    target: '10%+ preferred',
    actual: `${margin.toFixed(1)}%`,
    verdict: margin >= 10 ? 'pass' : margin >= 5 ? 'caution' : 'fail',
    note: margin >= 15
      ? 'Strong margins signal pricing power and operational efficiency.'
      : margin >= 10
      ? 'Acceptable. PE firms will look for margin expansion opportunities.'
      : margin >= 5
      ? 'Below target. PE will want a clear path to margin improvement.'
      : 'Thin margins are a red flag. Suggests commodity business or operational issues.',
  });

  // 4. Growth Profile
  results.push({
    name: 'Growth Profile',
    target: '5%+ annual revenue growth',
    actual: `${growth.toFixed(1)}% YoY`,
    verdict: growth >= 5 ? 'pass' : growth >= 0 ? 'caution' : 'fail',
    note: growth >= 10
      ? 'Strong growth. PE firms will pay a premium for this trajectory.'
      : growth >= 5
      ? 'Solid growth. Meets the typical PE fund thesis.'
      : growth >= 0
      ? 'Flat. PE will question whether they can accelerate growth.'
      : 'Declining revenue is a hard pass for most PE firms.',
  });

  // 5. Sector Fit
  const highDemandSectors = ['healthcare', 'technology', 'business-services', 'financial-services', 'industrials'];
  const moderateSectors = ['consumer', 'education', 'food-beverage'];
  results.push({
    name: 'Sector Fit',
    target: 'PE-attractive sectors',
    actual: sectorLabel(dealFit.sector),
    verdict: highDemandSectors.includes(dealFit.sector)
      ? 'pass'
      : moderateSectors.includes(dealFit.sector)
      ? 'caution'
      : dealFit.sector
      ? 'caution'
      : 'fail',
    note: highDemandSectors.includes(dealFit.sector)
      ? 'High-demand PE sector. Multiple active buyers right now.'
      : moderateSectors.includes(dealFit.sector)
      ? 'Moderate PE interest. Need a strong niche or differentiation story.'
      : dealFit.sector
      ? 'Not a top PE sector, but niche opportunities exist.'
      : 'Select your sector to get a screening result.',
  });

  // 6. Geography
  results.push({
    name: 'Geography',
    target: 'US / Canada preferred',
    actual: geographyLabel(dealFit.geography),
    verdict: dealFit.geography === 'us-canada' ? 'pass' : dealFit.geography === 'europe' ? 'caution' : dealFit.geography ? 'caution' : 'fail',
    note: dealFit.geography === 'us-canada'
      ? 'Primary PE market. Maximum buyer pool.'
      : dealFit.geography === 'europe'
      ? 'Active PE market, but different fund universe. Cross-border adds complexity.'
      : dealFit.geography === 'asia-pacific'
      ? 'Growing PE market, but fewer mid-market players. Regional expertise matters.'
      : dealFit.geography
      ? 'Emerging market PE exists but is more specialized. Smaller buyer pool.'
      : 'Select geography to screen.',
  });

  // 7. Deal Size / Enterprise Value
  results.push({
    name: 'Deal Size (EV)',
    target: '$10M – $500M',
    actual: ebitda > 0 && multiple > 0 ? `~$${ev.toFixed(0)}M` : 'N/A',
    verdict: ev >= 10 && ev <= 500 ? 'pass' : ev >= 5 && ev < 10 ? 'caution' : ev > 0 ? 'fail' : 'fail',
    note: ev >= 10 && ev <= 500
      ? 'Right in the mid-market PE strike zone.'
      : ev >= 5 && ev < 10
      ? 'Small for PE. Lower mid-market or search funds may be interested.'
      : ev > 500
      ? 'Above mid-market. Large-cap PE or strategic acquirers.'
      : 'Enterprise value is below typical PE minimums.',
  });

  // 8. Valuation Multiple
  results.push({
    name: 'Valuation (x EBITDA)',
    target: '4x – 8x (mid-market)',
    actual: multiple > 0 ? `${multiple.toFixed(1)}x` : 'N/A',
    verdict: multiple >= 4 && multiple <= 8 ? 'pass' : multiple > 8 && multiple <= 12 ? 'caution' : multiple > 0 && multiple < 4 ? 'pass' : 'fail',
    note: multiple >= 4 && multiple <= 8
      ? 'Market-rate valuation. Should attract competitive interest.'
      : multiple > 8 && multiple <= 12
      ? 'Premium valuation. PE will need a strong growth story to justify.'
      : multiple > 12
      ? 'Very high expectations. Most PE firms will struggle to make returns work.'
      : multiple > 0 && multiple < 4
      ? 'Below market — may signal issues, but great for a buyer.'
      : 'Enter your expected valuation multiple.',
  });

  // 9. Customer Concentration
  results.push({
    name: 'Customer Concentration',
    target: 'Top customer <15% of revenue',
    actual: concentration > 0 ? `${concentration.toFixed(0)}%` : 'N/A',
    verdict: concentration > 0 && concentration <= 15 ? 'pass' : concentration > 15 && concentration <= 30 ? 'caution' : 'fail',
    note: concentration > 0 && concentration <= 15
      ? 'Diversified. No single customer can hold the deal hostage.'
      : concentration > 15 && concentration <= 30
      ? 'Moderate risk. PE will want to understand the relationship deeply.'
      : concentration > 30
      ? 'High risk. Losing one customer could crater the business. Big haircut.'
      : 'Enter what % of revenue comes from your largest customer.',
  });

  // 10. Management Continuity
  results.push({
    name: 'Management Continuity',
    target: 'Key team stays post-close',
    actual: managementLabel(dealFit.managementContinuity),
    verdict: dealFit.managementContinuity === 'staying'
      ? 'pass'
      : dealFit.managementContinuity === 'partial'
      ? 'caution'
      : dealFit.managementContinuity === 'leaving'
      ? 'fail'
      : 'fail',
    note: dealFit.managementContinuity === 'staying'
      ? 'Ideal. PE firms strongly prefer continuity through the transition.'
      : dealFit.managementContinuity === 'partial'
      ? 'Some transition risk. PE will want a clear succession plan.'
      : dealFit.managementContinuity === 'leaving'
      ? 'High risk. PE must find or fund replacement leadership.'
      : 'Select your management plan.',
  });

  return results;
}

function sectorLabel(v: string): string {
  const map: Record<string, string> = {
    'healthcare': 'Healthcare',
    'technology': 'Technology / SaaS',
    'business-services': 'Business Services',
    'financial-services': 'Financial Services',
    'industrials': 'Industrials / Manufacturing',
    'consumer': 'Consumer / Retail',
    'education': 'Education',
    'food-beverage': 'Food & Beverage',
    'energy': 'Energy',
    'real-estate': 'Real Estate',
    'other': 'Other',
  };
  return map[v] || 'Not selected';
}

function geographyLabel(v: string): string {
  const map: Record<string, string> = {
    'us-canada': 'United States / Canada',
    'europe': 'Europe',
    'asia-pacific': 'Asia-Pacific',
    'latin-america': 'Latin America',
    'other': 'Other',
  };
  return map[v] || 'Not selected';
}

function managementLabel(v: string): string {
  const map: Record<string, string> = {
    'staying': 'Full team staying',
    'partial': 'Some key people leaving',
    'leaving': 'Owner / most leaders exiting',
  };
  return map[v] || 'Not selected';
}

// ─── Intro Page ───────────────────────────────────────────────

const IntroPage: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-2">
      <h2 className="text-3xl font-bold text-foreground">
        See Your Company Through a PE Firm's Eyes
      </h2>
    </div>

    <Alert className="border-primary/30 bg-primary/5">
      <Shield className="h-4 w-4" />
      <AlertDescription>
        <span className="font-semibold">How this works:</span> When a PE firm receives a teaser or CIM about your company,
        the first thing they do is screen it against 10 investment criteria. In minutes, they decide:
        <strong> Pass</strong>, <strong> Further Diligence</strong>, or <strong> Hard Pass</strong>.
        This tool shows you exactly how that screening works — using your real numbers.
      </AlertDescription>
    </Alert>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-5 bg-card border-border text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
        <h3 className="font-semibold text-lg mb-2">Pass</h3>
        <p className="text-sm text-muted-foreground">
          Strong fit. The PE firm requests more information and schedules a management meeting.
        </p>
      </Card>
      <Card className="p-5 bg-card border-border text-center">
        <MinusCircle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
        <h3 className="font-semibold text-lg mb-2">Further Diligence</h3>
        <p className="text-sm text-muted-foreground">
          Interesting but concerns exist. Needs a deeper look before committing resources.
        </p>
      </Card>
      <Card className="p-5 bg-card border-border text-center">
        <XCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h3 className="font-semibold text-lg mb-2">Hard Pass</h3>
        <p className="text-sm text-muted-foreground">
          Doesn't meet investment criteria. The firm moves on to the next deal.
        </p>
      </Card>
    </div>

    <Card className="p-5 bg-card border-border">
      <h3 className="font-semibold text-lg mb-3">The 10 Screening Criteria</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" /> Revenue Range</div>
        <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" /> EBITDA Range</div>
        <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> EBITDA Margin</div>
        <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Growth Profile</div>
        <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Sector Fit</div>
        <div className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Geography</div>
        <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" /> Deal Size (EV)</div>
        <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" /> Valuation Multiple</div>
        <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Customer Concentration</div>
        <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Management Continuity</div>
      </div>
    </Card>

    <p className="text-muted-foreground text-sm">
      Fill in your company details on the next two pages. You'll see your screening results — with honest feedback on each criterion — at the end.
    </p>
  </div>
);

// ─── Company Profile Page ─────────────────────────────────────

const CompanyProfilePage: React.FC<{
  profile: CompanyProfile;
  setProfile: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  markAnswered: () => void;
}> = ({ profile, setProfile, markAnswered }) => {
  useEffect(() => {
    if (profile.revenue && profile.ebitda) markAnswered();
  }, [profile, markAnswered]);

  const handleChange = (field: keyof CompanyProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const autoMargin = parseFloat(profile.revenue) > 0 && parseFloat(profile.ebitda) > 0
    ? ((parseFloat(profile.ebitda) / parseFloat(profile.revenue)) * 100).toFixed(1)
    : '';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Company Financials</h2>
      <p className="text-muted-foreground">
        Enter your company's key financial numbers. These are the first four things a PE firm looks at.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="revenue" className="text-sm font-medium">
            Annual Revenue ($M)
          </Label>
          <Input
            id="revenue"
            type="number"
            placeholder="e.g. 25"
            value={profile.revenue}
            onChange={(e) => handleChange('revenue', e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">Last 12 months, in millions</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ebitda" className="text-sm font-medium">
            EBITDA ($M)
          </Label>
          <Input
            id="ebitda"
            type="number"
            placeholder="e.g. 4"
            value={profile.ebitda}
            onChange={(e) => handleChange('ebitda', e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">Adjusted EBITDA after add-backs</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="margin" className="text-sm font-medium">
            EBITDA Margin (%)
          </Label>
          <Input
            id="margin"
            type="number"
            placeholder={autoMargin ? `Auto-calculated: ${autoMargin}%` : 'e.g. 16'}
            value={profile.ebitdaMargin || autoMargin}
            onChange={(e) => handleChange('ebitdaMargin', e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">
            {autoMargin ? `Auto-calculated from your numbers: ${autoMargin}%` : 'EBITDA / Revenue × 100'}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="growth" className="text-sm font-medium">
            Revenue Growth Rate (% YoY)
          </Label>
          <Input
            id="growth"
            type="number"
            placeholder="e.g. 8"
            value={profile.growthRate}
            onChange={(e) => handleChange('growthRate', e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">Year-over-year revenue growth</p>
        </div>
      </div>

      <Alert className="border-blue-500/30 bg-blue-500/5">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <span className="font-semibold">Tip:</span> Use your adjusted EBITDA (with legitimate add-backs) rather than reported EBITDA.
          PE firms always look at the adjusted number. If you completed the Add Backs module in Week 2, use that number.
        </AlertDescription>
      </Alert>
    </div>
  );
};

// ─── Deal Fit Page ────────────────────────────────────────────

const DealFitPage: React.FC<{
  dealFit: DealFit;
  setDealFit: React.Dispatch<React.SetStateAction<DealFit>>;
  markAnswered: () => void;
}> = ({ dealFit, setDealFit, markAnswered }) => {
  useEffect(() => {
    if (dealFit.sector && dealFit.managementContinuity) markAnswered();
  }, [dealFit, markAnswered]);

  const handleChange = (field: keyof DealFit, value: string) => {
    setDealFit(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Deal Fit</h2>
      <p className="text-muted-foreground">
        Beyond financials, PE firms screen for sector, geography, valuation expectations, customer risk, and management plans.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Industry Sector</Label>
          <select
            value={dealFit.sector}
            onChange={(e) => handleChange('sector', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select sector...</option>
            <option value="healthcare">Healthcare</option>
            <option value="technology">Technology / SaaS</option>
            <option value="business-services">Business Services</option>
            <option value="financial-services">Financial Services</option>
            <option value="industrials">Industrials / Manufacturing</option>
            <option value="consumer">Consumer / Retail</option>
            <option value="education">Education</option>
            <option value="food-beverage">Food & Beverage</option>
            <option value="energy">Energy</option>
            <option value="real-estate">Real Estate</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Geography */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Primary Geography</Label>
          <select
            value={dealFit.geography}
            onChange={(e) => handleChange('geography', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select geography...</option>
            <option value="us-canada">United States / Canada</option>
            <option value="europe">Europe</option>
            <option value="asia-pacific">Asia-Pacific</option>
            <option value="latin-america">Latin America</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Valuation Multiple */}
        <div className="space-y-2">
          <Label htmlFor="multiple" className="text-sm font-medium">
            Expected Valuation (x EBITDA)
          </Label>
          <Input
            id="multiple"
            type="number"
            step="0.5"
            placeholder="e.g. 6"
            value={dealFit.valuationMultiple}
            onChange={(e) => handleChange('valuationMultiple', e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">What multiple you expect or hope to get</p>
        </div>

        {/* Customer Concentration */}
        <div className="space-y-2">
          <Label htmlFor="concentration" className="text-sm font-medium">
            Largest Customer (% of Revenue)
          </Label>
          <Input
            id="concentration"
            type="number"
            placeholder="e.g. 12"
            value={dealFit.customerConcentration}
            onChange={(e) => handleChange('customerConcentration', e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">What % of your total revenue comes from your single biggest customer</p>
        </div>
      </div>

      {/* Management Continuity */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Management Team Post-Close</Label>
        <RadioGroup
          value={dealFit.managementContinuity}
          onValueChange={(v) => handleChange('managementContinuity', v)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="staying" id="mgmt-staying" />
            <Label htmlFor="mgmt-staying" className="font-normal cursor-pointer">
              Full team staying — owner and key leaders plan to remain through transition
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="partial" id="mgmt-partial" />
            <Label htmlFor="mgmt-partial" className="font-normal cursor-pointer">
              Partial transition — some key people may leave within 1-2 years
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="leaving" id="mgmt-leaving" />
            <Label htmlFor="mgmt-leaving" className="font-normal cursor-pointer">
              Owner and most leaders planning to exit soon after close
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

// ─── Results Page ─────────────────────────────────────────────

const ResultsPage: React.FC<{
  results: CriterionResult[];
}> = ({ results }) => {
  const passCount = results.filter(r => r.verdict === 'pass').length;
  const cautionCount = results.filter(r => r.verdict === 'caution').length;
  const failCount = results.filter(r => r.verdict === 'fail').length;

  const overallVerdict = passCount >= 8 ? 'PASS' : passCount >= 5 ? 'FURTHER DILIGENCE' : 'HARD PASS';
  const verdictColor = overallVerdict === 'PASS'
    ? 'text-emerald-400'
    : overallVerdict === 'FURTHER DILIGENCE'
    ? 'text-yellow-400'
    : 'text-red-400';
  const verdictBg = overallVerdict === 'PASS'
    ? 'bg-emerald-500/10 border-emerald-500/30'
    : overallVerdict === 'FURTHER DILIGENCE'
    ? 'bg-yellow-500/10 border-yellow-500/30'
    : 'bg-red-500/10 border-red-500/30';

  // Generate bull and bear cases from the results
  const bullPoints = results
    .filter(r => r.verdict === 'pass')
    .slice(0, 3)
    .map(r => r.note);
  const bearPoints = results
    .filter(r => r.verdict === 'fail')
    .concat(results.filter(r => r.verdict === 'caution'))
    .slice(0, 3)
    .map(r => `${r.name}: ${r.note}`);

  // Key questions based on weaknesses
  const keyQuestions: string[] = [];
  const failedOrCautioned = results.filter(r => r.verdict !== 'pass');
  if (failedOrCautioned.some(r => r.name === 'Growth Profile')) {
    keyQuestions.push('What is the plan to accelerate revenue growth over the next 2-3 years?');
  }
  if (failedOrCautioned.some(r => r.name === 'Customer Concentration')) {
    keyQuestions.push('What is the customer diversification strategy? How sticky are the top accounts?');
  }
  if (failedOrCautioned.some(r => r.name === 'EBITDA Margin')) {
    keyQuestions.push('Where are the margin expansion opportunities? What does the path to 15%+ look like?');
  }
  if (failedOrCautioned.some(r => r.name === 'Management Continuity')) {
    keyQuestions.push('Is there a succession plan? How deep is the bench below the owner?');
  }
  if (failedOrCautioned.some(r => r.name === 'Valuation (x EBITDA)')) {
    keyQuestions.push('What justifies the valuation premium? Are there comparable transactions?');
  }
  if (failedOrCautioned.some(r => r.name.includes('Revenue Range') || r.name.includes('EBITDA Range'))) {
    keyQuestions.push('What is the organic growth runway? Could add-on acquisitions accelerate scale?');
  }
  if (keyQuestions.length === 0) {
    keyQuestions.push('Strong profile — standard diligence areas: financial quality of earnings, customer interviews, management references.');
  }

  return (
    <div className="space-y-6">
      {/* Verdict Banner */}
      <Card className={`p-6 border ${verdictBg}`}>
        <div className="text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">PE Screening Verdict</p>
          <h2 className={`text-4xl font-bold ${verdictColor}`}>{overallVerdict}</h2>
          <p className="text-muted-foreground mt-2">
            {passCount} of 10 criteria passed &middot; {cautionCount} caution &middot; {failCount} failed
          </p>
        </div>
      </Card>

      {/* Criteria Table */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Screening Criteria Breakdown</h3>
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{r.name}</span>
                <VerdictBadge verdict={r.verdict} />
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground mb-2">
                <span>Target: <span className="text-foreground">{r.target}</span></span>
                <span>Actual: <span className="text-foreground">{r.actual}</span></span>
              </div>
              <p className="text-sm text-muted-foreground">{r.note}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Bull & Bear Case */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 bg-card border-border">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold">Bull Case</h3>
          </div>
          {bullPoints.length > 0 ? (
            <ul className="space-y-2 text-sm text-muted-foreground">
              {bullPoints.map((p, i) => <li key={i}>&#x2022; {p}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No strong positives identified. This is a warning sign.</p>
          )}
        </Card>

        <Card className="p-5 bg-card border-border">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold">Bear Case</h3>
          </div>
          {bearPoints.length > 0 ? (
            <ul className="space-y-2 text-sm text-muted-foreground">
              {bearPoints.map((p, i) => <li key={i}>&#x2022; {p}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No major concerns. Strong screening profile.</p>
          )}
        </Card>
      </div>

      {/* Key Questions */}
      <Card className="p-5 bg-card border-border">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Questions PE Will Ask You</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Based on your screening results, these are the questions a PE firm would prioritize on a first call:
        </p>
        <ul className="space-y-2 text-sm">
          {keyQuestions.map((q, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">{i + 1}.</span>
              <span className="text-muted-foreground">{q}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* What To Do Next */}
      <Alert className="border-primary/30 bg-primary/5">
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <span className="font-semibold">What this means:</span>{' '}
          {overallVerdict === 'PASS'
            ? 'Your company screens well for PE investment. Focus on preparing your data room, management presentation, and getting your financials audit-ready.'
            : overallVerdict === 'FURTHER DILIGENCE'
            ? 'Your company has potential but needs work on the flagged areas before going to market. Address the caution and fail items first — each one directly impacts your valuation.'
            : 'Significant gaps exist between your current profile and what PE firms look for. Consider using the other PE Ready modules to build your readiness score before approaching PE firms.'
          }
        </AlertDescription>
      </Alert>
    </div>
  );
};

const VerdictBadge: React.FC<{ verdict: Verdict }> = ({ verdict }) => {
  if (verdict === 'pass') {
    return (
      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
        <CheckCircle2 className="w-3 h-3 mr-1" /> Pass
      </Badge>
    );
  }
  if (verdict === 'caution') {
    return (
      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
        <MinusCircle className="w-3 h-3 mr-1" /> Caution
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
      <XCircle className="w-3 h-3 mr-1" /> Fail
    </Badge>
  );
};

// ─── Main Component ───────────────────────────────────────────

export const PEScreeningScorecard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageAnswered, setPageAnswered] = useState<Record<number, boolean>>({});

  const [profile, setProfile] = useState<CompanyProfile>(() => {
    // Pre-fill from Company Profile
    try {
      const raw = localStorage.getItem('company-profile-v1');
      if (raw) {
        const cp = JSON.parse(raw);
        const rev = cp.annualRevenue ? String(cp.annualRevenue) : '';
        const ebitda = cp.ebitda ? String(cp.ebitda) : '';
        const margin = (cp.annualRevenue && cp.ebitda)
          ? ((cp.ebitda / cp.annualRevenue) * 100).toFixed(1)
          : '';
        return {
          revenue: rev,
          ebitda: ebitda,
          ebitdaMargin: margin,
          growthRate: cp.revenueGrowthRate ? String(cp.revenueGrowthRate) : '',
        };
      }
    } catch (e) { /* ignore */ }
    return { revenue: '', ebitda: '', ebitdaMargin: '', growthRate: '' };
  });

  const [dealFit, setDealFit] = useState<DealFit>(() => {
    // Pre-fill from Company Profile
    try {
      const raw = localStorage.getItem('company-profile-v1');
      if (raw) {
        const cp = JSON.parse(raw);
        const sectorMap: Record<string, string> = {
          'Technology / SaaS': 'technology', 'Healthcare': 'healthcare',
          'Manufacturing / Industrial': 'industrials', 'Financial Services': 'financial-services',
          'Consumer / Retail': 'consumer', 'Business Services': 'business-services',
          'Education': 'education', 'Food & Beverage': 'food-beverage',
          'Construction': 'construction', 'Distribution': 'distribution',
          'Energy': 'energy', 'Real Estate': 'real-estate', 'Other': 'other',
        };
        return {
          sector: sectorMap[cp.industry] || '',
          geography: '',
          valuationMultiple: '',
          customerConcentration: cp.top10CustomerConcentration ? String(cp.top10CustomerConcentration) : '',
          managementContinuity: '',
        };
      }
    } catch (e) { /* ignore */ }
    return { sector: '', geography: '', valuationMultiple: '', customerConcentration: '', managementContinuity: '' };
  });

  // Auto-calculate margin when revenue and ebitda change
  useEffect(() => {
    const rev = parseFloat(profile.revenue);
    const ebitda = parseFloat(profile.ebitda);
    if (rev > 0 && ebitda > 0 && !profile.ebitdaMargin) {
      setProfile(prev => ({
        ...prev,
        ebitdaMargin: ((ebitda / rev) * 100).toFixed(1),
      }));
    }
  }, [profile.revenue, profile.ebitda]);

  const results = useMemo(() => screenCompany(profile, dealFit), [profile, dealFit]);

  const pages = useMemo(() => [
    { title: 'How PE Screens Your Company', content: <IntroPage /> },
    {
      title: 'Company Financials',
      content: (
        <CompanyProfilePage
          profile={profile}
          setProfile={setProfile}
          markAnswered={() => setPageAnswered(p => ({ ...p, 1: true }))}
        />
      ),
    },
    {
      title: 'Deal Fit',
      content: (
        <DealFitPage
          dealFit={dealFit}
          setDealFit={setDealFit}
          markAnswered={() => setPageAnswered(p => ({ ...p, 2: true }))}
        />
      ),
    },
    { title: 'Screening Results', content: <ResultsPage results={results} /> },
  ], [profile, dealFit, results]);

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
