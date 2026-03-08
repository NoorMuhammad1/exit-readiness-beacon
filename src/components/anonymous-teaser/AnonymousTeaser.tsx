
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ChevronRight,
  ChevronLeft,
  EyeOff,
  FileText,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────

interface TeaserInputs {
  companyName: string;
  sector: string;
  city: string;
  state: string;
  revenue: string;
  ebitda: string;
  growthRate: string;
  employeeCount: string;
  yearFounded: string;
  highlight1: string;
  highlight2: string;
  highlight3: string;
  highlight4: string;
  dealType: string;
}

// ─── Code Name Generator ─────────────────────────────────────

const codeNames = [
  'Project Alpine', 'Project Beacon', 'Project Cascade', 'Project Delta',
  'Project Eagle', 'Project Falcon', 'Project Granite', 'Project Horizon',
  'Project Iron', 'Project Jupiter', 'Project Keystone', 'Project Liberty',
  'Project Maverick', 'Project Nova', 'Project Orion', 'Project Phoenix',
  'Project Quest', 'Project Ridge', 'Project Summit', 'Project Titan',
];

function generateCodeName(name: string): string {
  if (!name) return 'Project [TBD]';
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return codeNames[hash % codeNames.length];
}

// ─── Anonymization Helpers ────────────────────────────────────

function anonymizeRevenue(rev: number): string {
  if (rev <= 0) return 'N/A';
  if (rev < 5) return '$1M – $5M';
  if (rev < 10) return '$5M – $10M';
  if (rev < 25) return '$10M – $25M';
  if (rev < 50) return '$25M – $50M';
  if (rev < 100) return '$50M – $100M';
  if (rev < 250) return '$100M – $250M';
  if (rev < 500) return '$250M – $500M';
  return '$500M+';
}

function anonymizeEbitda(ebitda: number): string {
  if (ebitda <= 0) return 'N/A';
  if (ebitda < 2) return '$1M – $2M';
  if (ebitda < 5) return '$2M – $5M';
  if (ebitda < 10) return '$5M – $10M';
  if (ebitda < 25) return '$10M – $25M';
  if (ebitda < 50) return '$25M – $50M';
  return '$50M+';
}

function anonymizeEmployees(count: number): string {
  if (count <= 0) return 'N/A';
  if (count < 25) return '10 – 25';
  if (count < 50) return '25 – 50';
  if (count < 100) return '50 – 100';
  if (count < 250) return '100 – 250';
  if (count < 500) return '250 – 500';
  return '500+';
}

function anonymizeLocation(state: string): string {
  const regions: Record<string, string> = {
    'ME': 'Northeast', 'NH': 'Northeast', 'VT': 'Northeast', 'MA': 'Northeast',
    'RI': 'Northeast', 'CT': 'Northeast', 'NY': 'Northeast', 'NJ': 'Northeast', 'PA': 'Northeast',
    'OH': 'Midwest', 'MI': 'Midwest', 'IN': 'Midwest', 'IL': 'Midwest',
    'WI': 'Midwest', 'MN': 'Midwest', 'IA': 'Midwest', 'MO': 'Midwest',
    'ND': 'Midwest', 'SD': 'Midwest', 'NE': 'Midwest', 'KS': 'Midwest',
    'DE': 'Mid-Atlantic', 'MD': 'Mid-Atlantic', 'DC': 'Mid-Atlantic', 'VA': 'Mid-Atlantic', 'WV': 'Mid-Atlantic',
    'NC': 'Southeast', 'SC': 'Southeast', 'GA': 'Southeast', 'FL': 'Southeast',
    'AL': 'Southeast', 'MS': 'Southeast', 'TN': 'Southeast', 'KY': 'Southeast', 'LA': 'Southeast', 'AR': 'Southeast',
    'TX': 'South Central', 'OK': 'South Central',
    'MT': 'Mountain West', 'WY': 'Mountain West', 'CO': 'Mountain West', 'NM': 'Mountain West',
    'ID': 'Mountain West', 'UT': 'Mountain West', 'AZ': 'Mountain West', 'NV': 'Mountain West',
    'WA': 'Pacific Northwest', 'OR': 'Pacific Northwest',
    'CA': 'West Coast', 'HI': 'Pacific', 'AK': 'Pacific',
  };
  return regions[state.toUpperCase()] || state || 'United States';
}

const sectorLabels: Record<string, string> = {
  'healthcare': 'Healthcare Services',
  'technology': 'Technology / Software',
  'business-services': 'Business Services',
  'financial-services': 'Financial Services',
  'industrials': 'Industrial / Manufacturing',
  'consumer': 'Consumer Products',
  'education': 'Education Services',
  'food-beverage': 'Food & Beverage',
  'construction': 'Construction / Building',
  'distribution': 'Distribution / Logistics',
  'other': 'Specialty Services',
};

// ─── Intro Page ───────────────────────────────────────────────

const IntroPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-foreground">
      The One-Page Blind Teaser
    </h2>

    <Alert className="border-primary/30 bg-primary/5">
      <EyeOff className="h-4 w-4" />
      <AlertDescription>
        <span className="font-semibold">What this is:</span> Before a company's identity is revealed to potential buyers,
        investment bankers send a "blind teaser" — a one-page summary that describes the opportunity without
        naming the company. It's the movie trailer for your deal. If a buyer likes what they see, they sign an NDA
        to get the full CIM.
      </AlertDescription>
    </Alert>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-5 bg-card border-border">
        <Shield className="w-8 h-8 text-emerald-500 mb-3" />
        <h3 className="font-semibold text-lg mb-2">What Gets Anonymized</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>&#x2022; Company name → deal code name</li>
          <li>&#x2022; City → region (e.g., "Southeast")</li>
          <li>&#x2022; Exact revenue → range (e.g., "$10M – $25M")</li>
          <li>&#x2022; Exact EBITDA → range</li>
          <li>&#x2022; Employee count → range</li>
        </ul>
      </Card>
      <Card className="p-5 bg-card border-border">
        <FileText className="w-8 h-8 text-blue-500 mb-3" />
        <h3 className="font-semibold text-lg mb-2">What's Included</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>&#x2022; Deal code name</li>
          <li>&#x2022; Sector and region</li>
          <li>&#x2022; 4-6 investment highlight bullets</li>
          <li>&#x2022; Financial summary table (ranges)</li>
          <li>&#x2022; Transaction type and next steps</li>
        </ul>
      </Card>
    </div>

    <p className="text-muted-foreground text-sm">
      Enter your company details on the next page. We'll generate a professionally anonymized teaser — so you can see exactly what buyers would see before they know who you are.
    </p>
  </div>
);

// ─── Input Page ───────────────────────────────────────────────

const InputPage: React.FC<{
  inputs: TeaserInputs;
  setInputs: React.Dispatch<React.SetStateAction<TeaserInputs>>;
  markAnswered: () => void;
}> = ({ inputs, setInputs, markAnswered }) => {
  React.useEffect(() => {
    if (inputs.sector && inputs.revenue && inputs.highlight1) markAnswered();
  }, [inputs, markAnswered]);

  const handleChange = (field: keyof TeaserInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Your Company Details</h2>
      <p className="text-muted-foreground">
        Enter real information below. The teaser on the next page will anonymize everything automatically.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Company Name (will be hidden)</Label>
          <Input
            placeholder="Your company name"
            value={inputs.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="bg-background"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">Industry Sector</Label>
          <select
            value={inputs.sector}
            onChange={(e) => handleChange('sector', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select sector...</option>
            <option value="healthcare">Healthcare</option>
            <option value="technology">Technology / Software</option>
            <option value="business-services">Business Services</option>
            <option value="financial-services">Financial Services</option>
            <option value="industrials">Industrial / Manufacturing</option>
            <option value="consumer">Consumer Products</option>
            <option value="education">Education</option>
            <option value="food-beverage">Food & Beverage</option>
            <option value="construction">Construction / Building</option>
            <option value="distribution">Distribution / Logistics</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">City</Label>
          <Input placeholder="e.g. Tampa" value={inputs.city} onChange={(e) => handleChange('city', e.target.value)} className="bg-background" />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">State (2-letter code)</Label>
          <Input placeholder="e.g. FL" maxLength={2} value={inputs.state} onChange={(e) => handleChange('state', e.target.value.toUpperCase())} className="bg-background" />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">Annual Revenue ($M)</Label>
          <Input type="number" placeholder="e.g. 18" value={inputs.revenue} onChange={(e) => handleChange('revenue', e.target.value)} className="bg-background" />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">EBITDA ($M)</Label>
          <Input type="number" placeholder="e.g. 3.5" value={inputs.ebitda} onChange={(e) => handleChange('ebitda', e.target.value)} className="bg-background" />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">Revenue Growth Rate (%)</Label>
          <Input type="number" placeholder="e.g. 12" value={inputs.growthRate} onChange={(e) => handleChange('growthRate', e.target.value)} className="bg-background" />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">Employee Count</Label>
          <Input type="number" placeholder="e.g. 85" value={inputs.employeeCount} onChange={(e) => handleChange('employeeCount', e.target.value)} className="bg-background" />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">Year Founded</Label>
          <Input type="number" placeholder="e.g. 2005" value={inputs.yearFounded} onChange={(e) => handleChange('yearFounded', e.target.value)} className="bg-background" />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">Transaction Type</Label>
          <select
            value={inputs.dealType}
            onChange={(e) => handleChange('dealType', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select type...</option>
            <option value="full-sale">Full Sale (100%)</option>
            <option value="majority">Majority Recapitalization</option>
            <option value="minority">Minority Investment</option>
            <option value="growth">Growth Equity</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Investment Highlights (what makes this company special)</Label>
        <Input placeholder="e.g. Market leader in niche with 95% client retention" value={inputs.highlight1} onChange={(e) => handleChange('highlight1', e.target.value)} className="bg-background" />
        <Input placeholder="e.g. Recurring revenue model with long-term contracts" value={inputs.highlight2} onChange={(e) => handleChange('highlight2', e.target.value)} className="bg-background" />
        <Input placeholder="e.g. Experienced management team committed to staying" value={inputs.highlight3} onChange={(e) => handleChange('highlight3', e.target.value)} className="bg-background" />
        <Input placeholder="e.g. Significant whitespace for geographic expansion" value={inputs.highlight4} onChange={(e) => handleChange('highlight4', e.target.value)} className="bg-background" />
      </div>
    </div>
  );
};

// ─── Teaser Output Page ───────────────────────────────────────

const TeaserPage: React.FC<{ inputs: TeaserInputs }> = ({ inputs }) => {
  const codeName = generateCodeName(inputs.companyName);
  const rev = parseFloat(inputs.revenue) || 0;
  const ebitda = parseFloat(inputs.ebitda) || 0;
  const growth = parseFloat(inputs.growthRate) || 0;
  const employees = parseInt(inputs.employeeCount) || 0;
  const margin = rev > 0 ? ((ebitda / rev) * 100).toFixed(0) : 'N/A';
  const region = anonymizeLocation(inputs.state);
  const sector = sectorLabels[inputs.sector] || inputs.sector || 'Diversified';
  const founded = inputs.yearFounded ? `${new Date().getFullYear() - parseInt(inputs.yearFounded)}+ years` : 'N/A';
  const dealTypeLabel: Record<string, string> = {
    'full-sale': '100% Sale', 'majority': 'Majority Recapitalization',
    'minority': 'Minority Investment', 'growth': 'Growth Equity',
  };

  const highlights = [inputs.highlight1, inputs.highlight2, inputs.highlight3, inputs.highlight4].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Your Anonymous Teaser</h2>
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
          <EyeOff className="w-3 h-3 mr-1" /> Anonymized
        </Badge>
      </div>

      {/* Anonymization proof */}
      {inputs.companyName && (
        <Alert className="border-emerald-500/30 bg-emerald-500/5">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>"{inputs.companyName}"</strong> has been anonymized to <strong>"{codeName}"</strong>.
            {inputs.city && <> <strong>{inputs.city}, {inputs.state}</strong> → <strong>{region}</strong>.</>}
            {rev > 0 && <> Revenue <strong>${rev}M</strong> → <strong>{anonymizeRevenue(rev)}</strong>.</>}
          </AlertDescription>
        </Alert>
      )}

      {/* The actual teaser document */}
      <Card className="p-8 bg-background border-2 border-border">
        {/* Header */}
        <div className="text-center border-b border-border pb-6 mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Confidential Investment Opportunity</p>
          <h2 className="text-3xl font-bold text-foreground">{codeName}</h2>
          <p className="text-lg text-muted-foreground mt-1">
            {sector} &middot; {region}
          </p>
        </div>

        {/* Overview */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Overview</h3>
          <p className="text-sm text-foreground leading-relaxed">
            {codeName} is a {founded !== 'N/A' ? `${founded}-old ` : ''}
            {sector.toLowerCase()} company headquartered in the {region} region of the United States.
            {rev > 0 ? ` The company generates ${anonymizeRevenue(rev)} in annual revenue` : ''}
            {ebitda > 0 ? ` with EBITDA margins of approximately ${margin}%` : ''}.
            {growth > 0 ? ` Revenue has been growing at approximately ${growth > 15 ? '15%+' : growth > 10 ? '10-15%' : '5-10%'} annually.` : ''}
            {' '}The company is seeking a {dealTypeLabel[inputs.dealType] || 'strategic transaction'} and
            is being presented on a confidential basis.
          </p>
        </div>

        {/* Investment Highlights */}
        {highlights.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Investment Highlights</h3>
            <div className="space-y-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-primary font-bold shrink-0">&#x25A0;</span>
                  <span className="text-foreground">{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Summary */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Financial Summary</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 text-muted-foreground">Revenue</td>
                  <td className="p-3 text-right font-medium">{anonymizeRevenue(rev)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-muted-foreground">EBITDA</td>
                  <td className="p-3 text-right font-medium">{anonymizeEbitda(ebitda)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-muted-foreground">EBITDA Margin</td>
                  <td className="p-3 text-right font-medium">{margin !== 'N/A' ? `~${margin}%` : 'N/A'}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-muted-foreground">Revenue Growth</td>
                  <td className="p-3 text-right font-medium">{growth > 0 ? `${growth > 15 ? '15%+' : growth > 10 ? '10-15%' : growth > 5 ? '5-10%' : '<5%'}` : 'N/A'}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-muted-foreground">Employees</td>
                  <td className="p-3 text-right font-medium">{anonymizeEmployees(employees)}</td>
                </tr>
                <tr>
                  <td className="p-3 text-muted-foreground">Years in Business</td>
                  <td className="p-3 text-right font-medium">{founded}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction & Next Steps */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Transaction Overview</h3>
          <p className="text-sm text-foreground">
            The owners are seeking a {dealTypeLabel[inputs.dealType] || 'strategic transaction'}.
            Interested parties should contact the advisor to receive a Confidential Information Memorandum (CIM)
            upon execution of a Non-Disclosure Agreement (NDA).
          </p>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-border pt-4">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            This document is strictly confidential and has been prepared solely for informational purposes.
            It does not constitute an offer to sell or a solicitation of an offer to buy any securities.
            The information contained herein has been obtained from sources believed to be reliable but has not
            been independently verified. No representation or warranty, express or implied, is made as to the
            accuracy or completeness of the information. Interested parties should conduct their own due diligence.
          </p>
        </div>
      </Card>

      {/* Tips */}
      <Alert className="border-primary/30 bg-primary/5">
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <span className="font-semibold">What happens next in a real deal:</span> This teaser goes to
          50-100 potential buyers. If they're interested, they sign an NDA. Then they get the full CIM
          (30-60 page document with all the details). From there, they submit an initial indication of interest (IOI).
          The whole process takes 4-8 weeks from teaser to first-round bids.
        </AlertDescription>
      </Alert>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────

export const AnonymousTeaser: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageAnswered, setPageAnswered] = useState<Record<number, boolean>>({});

  const [inputs, setInputs] = useState<TeaserInputs>(() => {
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
          'Energy': 'energy', 'Real Estate': 'other', 'Other': 'other',
        };
        return {
          companyName: cp.companyName || '',
          sector: sectorMap[cp.industry] || '',
          city: cp.city || '',
          state: cp.state || '',
          revenue: cp.annualRevenue ? String(cp.annualRevenue) : '',
          ebitda: cp.ebitda ? String(cp.ebitda) : '',
          growthRate: cp.revenueGrowthRate ? String(cp.revenueGrowthRate) : '',
          employeeCount: cp.employeeCount ? String(cp.employeeCount) : '',
          yearFounded: cp.yearFounded ? String(cp.yearFounded) : '',
          highlight1: '', highlight2: '', highlight3: '', highlight4: '',
          dealType: cp.transactionType || '',
        };
      }
    } catch (e) { /* ignore */ }
    return {
      companyName: '', sector: '', city: '', state: '',
      revenue: '', ebitda: '', growthRate: '', employeeCount: '',
      yearFounded: '', highlight1: '', highlight2: '', highlight3: '',
      highlight4: '', dealType: '',
    };
  });

  const pages = useMemo(() => [
    { title: 'What Is a Blind Teaser?', content: <IntroPage /> },
    {
      title: 'Your Company Details',
      content: (
        <InputPage
          inputs={inputs}
          setInputs={setInputs}
          markAnswered={() => setPageAnswered(p => ({ ...p, 1: true }))}
        />
      ),
    },
    { title: 'Your Anonymous Teaser', content: <TeaserPage inputs={inputs} /> },
  ], [inputs]);

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
