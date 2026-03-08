
import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  FileText,
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  Sparkles,
  EyeOff,
  Eye,
  Download,
  CheckCircle2,
  BookOpen,
  Info,
  AlertTriangle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────

interface CIMData {
  // Company & Deal Setup
  companyName: string;
  sector: string;
  yearFounded: string;
  headquarters: string;
  state: string;
  employeeCount: string;
  dealType: string;
  timeline: string;
  anonymize: boolean;

  // Business Description
  companyDescription: string;
  productsServices: string;
  businessModel: string;
  differentiators: string;

  // Market & Growth
  industryOverview: string;
  marketSize: string;
  industryTrends: string;
  competitiveLandscape: string;
  organicGrowth: string;
  acquisitionGrowth: string;

  // Customers, Team & Financials
  customerOverview: string;
  topCustomers: string;
  retentionMetrics: string;
  salesProcess: string;
  keyPersonnel: string;
  revenue: string;
  revenueGrowth: string;
  ebitda: string;
  ebitdaMargin: string;
  capex: string;

  // Investment Highlights
  highlight1: string;
  highlight2: string;
  highlight3: string;
  highlight4: string;
  highlight5: string;
}

const STORAGE_KEY = 'cim-generator-v1';

// ─── Constants ────────────────────────────────────────────────

const codeNames = [
  'Project Alpine', 'Project Beacon', 'Project Cascade', 'Project Delta',
  'Project Eagle', 'Project Falcon', 'Project Granite', 'Project Horizon',
  'Project Iron', 'Project Jupiter', 'Project Keystone', 'Project Liberty',
  'Project Maverick', 'Project Nova', 'Project Orion', 'Project Phoenix',
  'Project Quest', 'Project Ridge', 'Project Summit', 'Project Titan',
];

const sectorLabels: Record<string, string> = {
  'healthcare': 'Healthcare Services',
  'saas': 'Software / SaaS',
  'technology': 'Technology Services',
  'business-services': 'Business Services',
  'financial-services': 'Financial Services',
  'industrials': 'Industrial / Manufacturing',
  'consumer': 'Consumer Products / Retail',
  'education': 'Education Services',
  'food-beverage': 'Food & Beverage',
  'construction': 'Construction / Building Services',
  'distribution': 'Distribution / Logistics',
  'other': 'Specialty Services',
};

const dealTypeLabels: Record<string, string> = {
  'full-sale': '100% Sale',
  'majority': 'Majority Recapitalization',
  'minority': 'Minority Investment',
  'growth': 'Growth Equity',
  'management-buyout': 'Management Buyout',
};

// ─── Anonymization Helpers ────────────────────────────────────

function generateCodeName(name: string): string {
  if (!name) return 'Project [TBD]';
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return codeNames[hash % codeNames.length];
}

function anonymizeRevenue(rev: number): string {
  if (rev <= 0) return 'N/A';
  if (rev < 5) return '$1M - $5M';
  if (rev < 10) return '$5M - $10M';
  if (rev < 25) return '$10M - $25M';
  if (rev < 50) return '$25M - $50M';
  if (rev < 100) return '$50M - $100M';
  if (rev < 250) return '$100M - $250M';
  if (rev < 500) return '$250M - $500M';
  return '$500M+';
}

function anonymizeEbitda(ebitda: number): string {
  if (ebitda <= 0) return 'N/A';
  if (ebitda < 2) return '$1M - $2M';
  if (ebitda < 5) return '$2M - $5M';
  if (ebitda < 10) return '$5M - $10M';
  if (ebitda < 25) return '$10M - $25M';
  if (ebitda < 50) return '$25M - $50M';
  return '$50M+';
}

function anonymizeEmployees(count: number): string {
  if (count <= 0) return 'N/A';
  if (count < 25) return '10 - 25';
  if (count < 50) return '25 - 50';
  if (count < 100) return '50 - 100';
  if (count < 250) return '100 - 250';
  if (count < 500) return '250 - 500';
  return '500+';
}

function anonymizeLocation(stateCode: string): string {
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
  return regions[stateCode.toUpperCase()] || stateCode || 'United States';
}

// ─── Data Import Helper ───────────────────────────────────────

function tryImportExistingData(): Partial<CIMData> {
  const imported: Partial<CIMData> = {};
  try {
    const companyName = localStorage.getItem('company-name');
    if (companyName) imported.companyName = companyName;

    const ownerName = localStorage.getItem('owner-name');
    if (ownerName) imported.keyPersonnel = ownerName + ' (Owner/CEO)';

    const vcpRaw = localStorage.getItem('value-creation-plan-v1');
    if (vcpRaw) {
      const vcp = JSON.parse(vcpRaw);
      if (vcp.baseEbitda) imported.ebitda = String(vcp.baseEbitda);
      if (vcp.levers && Array.isArray(vcp.levers) && vcp.levers.length > 0) {
        const leverNames = vcp.levers.map((l: { name: string }) => l.name).filter(Boolean);
        if (leverNames.length > 0) {
          imported.organicGrowth = leverNames.join('; ');
        }
      }
    }

    const mgmtRaw = localStorage.getItem('management-scorecard');
    if (mgmtRaw) {
      const mgmt = JSON.parse(mgmtRaw);
      if (mgmt.teamMembers && Array.isArray(mgmt.teamMembers)) {
        const names = mgmt.teamMembers
          .map((m: { name: string; role: string }) => `${m.name} (${m.role})`)
          .filter((s: string) => s !== ' ()');
        if (names.length > 0) imported.keyPersonnel = names.join(', ');
      }
    }
  } catch {
    // Silently fail — localStorage data is optional
  }
  return imported;
}

const defaultData: CIMData = {
  companyName: '', sector: '', yearFounded: '', headquarters: '', state: '',
  employeeCount: '', dealType: '', timeline: '', anonymize: false,
  companyDescription: '', productsServices: '', businessModel: '', differentiators: '',
  industryOverview: '', marketSize: '', industryTrends: '', competitiveLandscape: '',
  organicGrowth: '', acquisitionGrowth: '',
  customerOverview: '', topCustomers: '', retentionMetrics: '', salesProcess: '',
  keyPersonnel: '', revenue: '', revenueGrowth: '', ebitda: '', ebitdaMargin: '',
  capex: '',
  highlight1: '', highlight2: '', highlight3: '', highlight4: '', highlight5: '',
};

// ─── Step 1: Introduction ─────────────────────────────────────

const IntroPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-foreground">
      The Confidential Information Memorandum
    </h2>

    <Alert className="border-primary/30 bg-primary/5">
      <BookOpen className="h-4 w-4" />
      <AlertDescription>
        <span className="font-semibold">What this is:</span> A CIM is the most important document in a sell-side M&A process.
        It's the 40-60 page "sales brochure" that investment bankers send to qualified buyers after they sign an NDA.
        If the blind teaser is the movie trailer, the CIM is the full screenplay.
      </AlertDescription>
    </Alert>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-5 bg-card border-border">
        <FileText className="w-8 h-8 text-blue-500 mb-3" />
        <h3 className="font-semibold text-lg mb-2">What's Inside a CIM</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>I. Executive Summary</li>
          <li>II. Company Overview</li>
          <li>III. Industry Overview</li>
          <li>IV. Growth Opportunities</li>
          <li>V. Customers & Sales</li>
          <li>VI. Operations</li>
          <li>VII. Financial Overview</li>
        </ul>
      </Card>
      <Card className="p-5 bg-card border-border">
        <Sparkles className="w-8 h-8 text-emerald-500 mb-3" />
        <h3 className="font-semibold text-lg mb-2">What You'll Get</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>&#x2022; A structured draft CIM framework</li>
          <li>&#x2022; Auto-generated investment highlights</li>
          <li>&#x2022; Financial summary tables</li>
          <li>&#x2022; Anonymization option (hide your identity)</li>
          <li>&#x2022; A head start for your investment banker</li>
        </ul>
      </Card>
    </div>

    <Card className="p-5 bg-card border-border">
      <div className="flex gap-3">
        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">Important: This is a draft framework, not a finished CIM.</p>
          <p>
            A real CIM is crafted by investment bankers with deep financial modeling and legal review.
            This tool generates a structured starting point — the skeleton your banker can flesh out.
            Think of it as doing 30% of the work before the first meeting with your advisor.
          </p>
        </div>
      </div>
    </Card>

    <p className="text-muted-foreground text-sm">
      Over the next 4 steps, we'll walk through each section of the CIM. Fill in what you know — you can always come back and edit.
      If you've completed other PE Ready modules, some data may be pre-filled automatically.
    </p>
  </div>
);

// ─── Step 2: Company & Deal Setup ─────────────────────────────

const CompanySetupPage: React.FC<{
  data: CIMData;
  setData: React.Dispatch<React.SetStateAction<CIMData>>;
  markAnswered: () => void;
  importedFields: string[];
}> = ({ data, setData, markAnswered, importedFields }) => {
  useEffect(() => {
    if (data.companyName && data.sector) markAnswered();
  }, [data.companyName, data.sector, markAnswered]);

  const handleChange = (field: keyof CIMData, value: string | boolean) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Building2 className="w-6 h-6 text-primary" />
        Company & Deal Setup
      </h2>
      <p className="text-muted-foreground">
        Basic company information and transaction details. This forms the foundation of your CIM.
      </p>

      {importedFields.length > 0 && (
        <Alert className="border-emerald-500/30 bg-emerald-500/5">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Auto-imported data from other PE Ready modules: <strong>{importedFields.join(', ')}</strong>.
            Feel free to edit any pre-filled fields.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Company Name *</Label>
          <Input
            placeholder="Your company name"
            value={data.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="bg-background"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">Industry Sector *</Label>
          <select
            value={data.sector}
            onChange={(e) => handleChange('sector', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select sector...</option>
            <option value="healthcare">Healthcare</option>
            <option value="saas">Software / SaaS</option>
            <option value="technology">Technology Services</option>
            <option value="business-services">Business Services</option>
            <option value="financial-services">Financial Services</option>
            <option value="industrials">Industrial / Manufacturing</option>
            <option value="consumer">Consumer Products / Retail</option>
            <option value="education">Education</option>
            <option value="food-beverage">Food & Beverage</option>
            <option value="construction">Construction / Building</option>
            <option value="distribution">Distribution / Logistics</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">Headquarters City</Label>
          <Input placeholder="e.g. Tampa" value={data.headquarters} onChange={(e) => handleChange('headquarters', e.target.value)} className="bg-background" />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">State (2-letter code)</Label>
          <Input placeholder="e.g. FL" maxLength={2} value={data.state} onChange={(e) => handleChange('state', e.target.value.toUpperCase())} className="bg-background" />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">Year Founded</Label>
          <Input type="number" placeholder="e.g. 2005" value={data.yearFounded} onChange={(e) => handleChange('yearFounded', e.target.value)} className="bg-background" />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">Employee Count</Label>
          <Input type="number" placeholder="e.g. 85" value={data.employeeCount} onChange={(e) => handleChange('employeeCount', e.target.value)} className="bg-background" />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">Transaction Type</Label>
          <select
            value={data.dealType}
            onChange={(e) => handleChange('dealType', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select type...</option>
            <option value="full-sale">Full Sale (100%)</option>
            <option value="majority">Majority Recapitalization</option>
            <option value="minority">Minority Investment</option>
            <option value="growth">Growth Equity</option>
            <option value="management-buyout">Management Buyout</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">Indicative Timeline</Label>
          <select
            value={data.timeline}
            onChange={(e) => handleChange('timeline', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select timeline...</option>
            <option value="3-months">3 months</option>
            <option value="6-months">6 months</option>
            <option value="9-months">9 months</option>
            <option value="12-months">12 months</option>
            <option value="flexible">Flexible / No rush</option>
          </select>
        </div>
      </div>

      {/* Anonymization Toggle */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data.anonymize ? (
              <EyeOff className="w-5 h-5 text-amber-500" />
            ) : (
              <Eye className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium text-sm">Anonymization Mode</p>
              <p className="text-xs text-muted-foreground">
                {data.anonymize
                  ? 'ON — Company name, location, and financials will be anonymized in the output'
                  : 'OFF — Real company details will appear in the output'}
              </p>
            </div>
          </div>
          <Button
            variant={data.anonymize ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChange('anonymize', !data.anonymize)}
          >
            {data.anonymize ? 'Anonymized' : 'Turn On'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

// ─── Step 3: Business Description ─────────────────────────────

const BusinessDescriptionPage: React.FC<{
  data: CIMData;
  setData: React.Dispatch<React.SetStateAction<CIMData>>;
  markAnswered: () => void;
}> = ({ data, setData, markAnswered }) => {
  useEffect(() => {
    if (data.companyDescription && data.productsServices) markAnswered();
  }, [data.companyDescription, data.productsServices, markAnswered]);

  const handleChange = (field: keyof CIMData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <FileText className="w-6 h-6 text-primary" />
        Business Description
      </h2>
      <p className="text-muted-foreground">
        Tell the story of your company. What do you do, how do you do it, and why do you win?
        This feeds into Sections II (Company Overview) and the Executive Summary.
      </p>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Company Description *</Label>
          <p className="text-xs text-muted-foreground">2-3 sentences about what the company does and its value proposition.</p>
          <Textarea
            placeholder="e.g. Founded in 2005, ABC Corp is a leading provider of managed IT services to mid-market healthcare organizations across the Southeast. The company provides 24/7 network monitoring, cybersecurity, and cloud migration services under multi-year contracts."
            value={data.companyDescription}
            onChange={(e) => handleChange('companyDescription', e.target.value)}
            className="bg-background min-h-[100px]"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-medium">Products & Services *</Label>
          <p className="text-xs text-muted-foreground">List your main offerings and what percentage of revenue each represents.</p>
          <Textarea
            placeholder="e.g. Managed IT Services (60% of revenue) — 24/7 monitoring, helpdesk, patch management&#10;Cybersecurity (25%) — threat detection, compliance, penetration testing&#10;Cloud Services (15%) — migration, hosting, disaster recovery"
            value={data.productsServices}
            onChange={(e) => handleChange('productsServices', e.target.value)}
            className="bg-background min-h-[100px]"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-medium">Business Model</Label>
          <p className="text-xs text-muted-foreground">How do you make money? Recurring vs. one-time? Contract length? Pricing model?</p>
          <Textarea
            placeholder="e.g. 80% recurring revenue under 3-year contracts with annual escalators. Average contract value of $150K/year. Low churn (<5% annually) with 95%+ gross retention."
            value={data.businessModel}
            onChange={(e) => handleChange('businessModel', e.target.value)}
            className="bg-background min-h-[80px]"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-medium">Key Differentiators</Label>
          <p className="text-xs text-muted-foreground">What makes you hard to replicate? Why do customers choose you over competitors?</p>
          <Textarea
            placeholder="e.g. Only HITRUST-certified MSP in the region; 18-year track record with zero data breaches; proprietary monitoring platform; deep healthcare compliance expertise that competitors lack."
            value={data.differentiators}
            onChange={(e) => handleChange('differentiators', e.target.value)}
            className="bg-background min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};

// ─── Step 4: Market & Growth ──────────────────────────────────

const MarketGrowthPage: React.FC<{
  data: CIMData;
  setData: React.Dispatch<React.SetStateAction<CIMData>>;
  markAnswered: () => void;
}> = ({ data, setData, markAnswered }) => {
  useEffect(() => {
    if (data.industryOverview || data.organicGrowth) markAnswered();
  }, [data.industryOverview, data.organicGrowth, markAnswered]);

  const handleChange = (field: keyof CIMData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-primary" />
        Market & Growth Opportunities
      </h2>
      <p className="text-muted-foreground">
        PE firms want to know your market is big, growing, and that you have clear paths to capture more of it.
        This feeds into Sections III (Industry Overview) and IV (Growth Opportunities).
      </p>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Industry Overview</Label>
          <p className="text-xs text-muted-foreground">Describe your industry and where it's headed. What are the big trends?</p>
          <Textarea
            placeholder="e.g. The managed IT services market is a $300B+ global industry growing at 8-10% annually, driven by increasing cybersecurity threats, cloud migration, and the shift to remote/hybrid work. Healthcare IT is a particularly attractive sub-segment due to HIPAA compliance requirements."
            value={data.industryOverview}
            onChange={(e) => handleChange('industryOverview', e.target.value)}
            className="bg-background min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Market Size (TAM)</Label>
            <p className="text-xs text-muted-foreground">Total addressable market — how big is the overall market?</p>
            <Input
              placeholder="e.g. $300B globally, $50B in US healthcare IT"
              value={data.marketSize}
              onChange={(e) => handleChange('marketSize', e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm font-medium">Industry Growth Trends</Label>
            <p className="text-xs text-muted-foreground">Key tailwinds driving industry growth.</p>
            <Input
              placeholder="e.g. 8-10% annual growth, accelerating post-pandemic"
              value={data.industryTrends}
              onChange={(e) => handleChange('industryTrends', e.target.value)}
              className="bg-background"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-medium">Competitive Landscape</Label>
          <p className="text-xs text-muted-foreground">Who are your main competitors? How fragmented is the market?</p>
          <Textarea
            placeholder="e.g. Highly fragmented market with 10,000+ MSPs nationwide. No single player has >5% market share. Large players (Accenture, Cognizant) focus on enterprise; mid-market is served by regional specialists like us. Our niche (healthcare-focused MSP) has fewer than 20 serious competitors in the Southeast."
            value={data.competitiveLandscape}
            onChange={(e) => handleChange('competitiveLandscape', e.target.value)}
            className="bg-background min-h-[80px]"
          />
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="font-semibold text-lg mb-3">Growth Opportunities</h3>
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-medium">Organic Growth Levers</Label>
          <p className="text-xs text-muted-foreground">How can the company grow without acquisitions? New products, markets, pricing?</p>
          <Textarea
            placeholder="e.g. 1) Expand cybersecurity services to existing clients (cross-sell)&#10;2) Enter adjacent verticals (dental, veterinary)&#10;3) Launch cloud-native monitoring platform (higher margins)&#10;4) Geographic expansion into Mid-Atlantic market"
            value={data.organicGrowth}
            onChange={(e) => handleChange('organicGrowth', e.target.value)}
            className="bg-background min-h-[80px]"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-medium">M&A / Add-On Opportunities</Label>
          <p className="text-xs text-muted-foreground">Are there smaller companies you could acquire to accelerate growth?</p>
          <Textarea
            placeholder="e.g. Fragmented market with hundreds of sub-$5M MSPs. Typical acquisition targets: regional MSPs with 50-200 clients, $2-5M revenue. Potential to acquire 2-3 per year at 4-6x EBITDA and integrate onto our platform."
            value={data.acquisitionGrowth}
            onChange={(e) => handleChange('acquisitionGrowth', e.target.value)}
            className="bg-background min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};

// ─── Step 5: Customers, Team & Financials ─────────────────────

const TeamFinancialsPage: React.FC<{
  data: CIMData;
  setData: React.Dispatch<React.SetStateAction<CIMData>>;
  markAnswered: () => void;
}> = ({ data, setData, markAnswered }) => {
  useEffect(() => {
    if (data.revenue && data.ebitda) markAnswered();
  }, [data.revenue, data.ebitda, markAnswered]);

  const handleChange = (field: keyof CIMData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Users className="w-6 h-6 text-primary" />
        Customers, Team & Financials
      </h2>
      <p className="text-muted-foreground">
        The numbers and the people behind them. This feeds into Sections V, VI, and VII of your CIM.
      </p>

      {/* Customers */}
      <div className="border-b border-border pb-4">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" /> Customers & Sales
        </h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Customer Overview</Label>
            <p className="text-xs text-muted-foreground">How many customers? What segments? Geographic spread?</p>
            <Textarea
              placeholder="e.g. 120+ active clients, predominantly mid-market healthcare organizations (hospitals, physician groups, dental chains) across 6 Southeast states. Average client tenure of 7+ years."
              value={data.customerOverview}
              onChange={(e) => handleChange('customerOverview', e.target.value)}
              className="bg-background min-h-[80px]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Top Customer Concentration</Label>
              <p className="text-xs text-muted-foreground">How much revenue comes from your top 5 or 10 customers?</p>
              <Input
                placeholder="e.g. Top 10 = 35% of revenue, no single client >8%"
                value={data.topCustomers}
                onChange={(e) => handleChange('topCustomers', e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">Retention / Churn Metrics</Label>
              <p className="text-xs text-muted-foreground">Gross retention, net retention, churn rate?</p>
              <Input
                placeholder="e.g. 95% gross retention, 105% net retention (upsell)"
                value={data.retentionMetrics}
                onChange={(e) => handleChange('retentionMetrics', e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-sm font-medium">Sales Process</Label>
            <Textarea
              placeholder="e.g. Referral-driven model with 60% of new business from existing client referrals. 3-person sales team. Average sales cycle of 90 days. Win rate of 40% on qualified opportunities."
              value={data.salesProcess}
              onChange={(e) => handleChange('salesProcess', e.target.value)}
              className="bg-background min-h-[60px]"
            />
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="border-b border-border pb-4">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4" /> Team & Operations
        </h3>
        <div className="space-y-1">
          <Label className="text-sm font-medium">Key Personnel</Label>
          <p className="text-xs text-muted-foreground">List key management team members and their roles.</p>
          <Textarea
            placeholder="e.g. John Smith (CEO, 18 years) — founded the company, drives strategy&#10;Jane Doe (COO, 12 years) — oversees operations and service delivery&#10;Mike Johnson (CFO, 5 years) — manages finance, came from Deloitte&#10;Sarah Lee (VP Sales, 8 years) — built the sales team from scratch"
            value={data.keyPersonnel}
            onChange={(e) => handleChange('keyPersonnel', e.target.value)}
            className="bg-background min-h-[100px]"
          />
        </div>
      </div>

      {/* Financials */}
      <div>
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Financial Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Annual Revenue ($M) *</Label>
            <Input type="number" placeholder="e.g. 18" value={data.revenue} onChange={(e) => handleChange('revenue', e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-1">
            <Label className="text-sm font-medium">Revenue Growth Rate (%)</Label>
            <Input type="number" placeholder="e.g. 12" value={data.revenueGrowth} onChange={(e) => handleChange('revenueGrowth', e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-1">
            <Label className="text-sm font-medium">EBITDA ($M) *</Label>
            <Input type="number" placeholder="e.g. 3.5" value={data.ebitda} onChange={(e) => handleChange('ebitda', e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-1">
            <Label className="text-sm font-medium">EBITDA Margin (%)</Label>
            <Input type="number" placeholder="e.g. 19" value={data.ebitdaMargin} onChange={(e) => handleChange('ebitdaMargin', e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-1">
            <Label className="text-sm font-medium">Annual CapEx ($M)</Label>
            <Input type="number" placeholder="e.g. 0.5" value={data.capex} onChange={(e) => handleChange('capex', e.target.value)} className="bg-background" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <Label className="text-sm font-medium">Investment Highlights (5-7 key selling points)</Label>
          <p className="text-xs text-muted-foreground">What are the top reasons a buyer should be excited about this company?</p>
          <Input placeholder="e.g. Market leader in healthcare IT services in the Southeast" value={data.highlight1} onChange={(e) => handleChange('highlight1', e.target.value)} className="bg-background" />
          <Input placeholder="e.g. 80% recurring revenue with 95% gross retention" value={data.highlight2} onChange={(e) => handleChange('highlight2', e.target.value)} className="bg-background" />
          <Input placeholder="e.g. 15% revenue CAGR over the last 3 years" value={data.highlight3} onChange={(e) => handleChange('highlight3', e.target.value)} className="bg-background" />
          <Input placeholder="e.g. Experienced management team committed to staying post-close" value={data.highlight4} onChange={(e) => handleChange('highlight4', e.target.value)} className="bg-background" />
          <Input placeholder="e.g. Clear organic and M&A growth runway" value={data.highlight5} onChange={(e) => handleChange('highlight5', e.target.value)} className="bg-background" />
        </div>
      </div>
    </div>
  );
};

// ─── Step 6: Generated CIM Document ───────────────────────────

const GeneratedCIMPage: React.FC<{ data: CIMData }> = ({ data }) => {
  const rev = parseFloat(data.revenue) || 0;
  const ebitda = parseFloat(data.ebitda) || 0;
  const growth = parseFloat(data.revenueGrowth) || 0;
  const employees = parseInt(data.employeeCount) || 0;
  const margin = data.ebitdaMargin ? data.ebitdaMargin : (rev > 0 ? ((ebitda / rev) * 100).toFixed(0) : 'N/A');
  const capex = parseFloat(data.capex) || 0;
  const founded = data.yearFounded ? `${new Date().getFullYear() - parseInt(data.yearFounded)}` : null;

  const anon = data.anonymize;
  const displayName = anon ? generateCodeName(data.companyName) : (data.companyName || '[Company Name]');
  const displayLocation = anon
    ? anonymizeLocation(data.state)
    : (data.headquarters && data.state ? `${data.headquarters}, ${data.state}` : data.state || 'United States');
  const displayRevenue = anon ? anonymizeRevenue(rev) : (rev > 0 ? `$${rev}M` : 'N/A');
  const displayEbitda = anon ? anonymizeEbitda(ebitda) : (ebitda > 0 ? `$${ebitda}M` : 'N/A');
  const displayEmployees = anon ? anonymizeEmployees(employees) : (employees > 0 ? `${employees}` : 'N/A');
  const sector = sectorLabels[data.sector] || data.sector || 'Diversified';
  const dealType = dealTypeLabels[data.dealType] || 'strategic transaction';

  const highlights = [data.highlight1, data.highlight2, data.highlight3, data.highlight4, data.highlight5].filter(Boolean);

  // Auto-generate highlights if none provided
  const autoHighlights: string[] = [];
  if (highlights.length === 0) {
    if (growth > 10) autoHighlights.push(`Strong revenue growth at ${anon ? '10%+' : growth + '%'} annually`);
    if (parseFloat(String(margin)) > 18) autoHighlights.push(`Attractive EBITDA margins of ~${anon ? '15-20%+' : margin + '%'}`);
    if (founded && parseInt(founded) > 10) autoHighlights.push(`Established ${founded}-year operating track record`);
    if (data.retentionMetrics) autoHighlights.push(`Strong customer retention: ${data.retentionMetrics}`);
    if (data.differentiators) autoHighlights.push(data.differentiators.split('.')[0]);
  }
  const displayHighlights = highlights.length > 0 ? highlights : autoHighlights;

  const timelineLabel: Record<string, string> = {
    '3-months': '3 months', '6-months': '6 months', '9-months': '9 months',
    '12-months': '12 months', 'flexible': 'Flexible',
  };

  const handleExportText = () => {
    const lines: string[] = [];
    lines.push('═'.repeat(60));
    lines.push('CONFIDENTIAL INFORMATION MEMORANDUM');
    lines.push('═'.repeat(60));
    lines.push('');
    lines.push(`${displayName}`);
    lines.push(`${sector} | ${displayLocation}`);
    lines.push('');
    lines.push('─'.repeat(60));
    lines.push('');
    lines.push('I. EXECUTIVE SUMMARY');
    lines.push('');
    lines.push(`${displayName} is a ${founded ? founded + '-year-old ' : ''}${sector.toLowerCase()} company headquartered in ${displayLocation}.`);
    if (rev > 0) lines.push(`The company generates ${displayRevenue} in annual revenue with EBITDA of ${displayEbitda} (${margin}% margin).`);
    if (growth > 0) lines.push(`Revenue has been growing at ${anon ? (growth > 15 ? '15%+' : '10%+') : growth + '%'} annually.`);
    lines.push(`The owners are seeking a ${dealType}.`);
    lines.push('');
    if (displayHighlights.length > 0) {
      lines.push('Investment Highlights:');
      displayHighlights.forEach(h => lines.push(`  * ${h}`));
      lines.push('');
    }
    lines.push('─'.repeat(60));
    lines.push('');
    lines.push('II. COMPANY OVERVIEW');
    lines.push('');
    if (data.companyDescription) lines.push(data.companyDescription);
    lines.push('');
    if (data.productsServices) { lines.push('Products & Services:'); lines.push(data.productsServices); lines.push(''); }
    if (data.businessModel) { lines.push('Business Model:'); lines.push(data.businessModel); lines.push(''); }
    if (data.differentiators) { lines.push('Key Differentiators:'); lines.push(data.differentiators); lines.push(''); }
    lines.push('─'.repeat(60));
    lines.push('');
    lines.push('III. INDUSTRY OVERVIEW');
    lines.push('');
    if (data.industryOverview) lines.push(data.industryOverview);
    if (data.marketSize) lines.push(`Market Size: ${data.marketSize}`);
    if (data.industryTrends) lines.push(`Growth Trends: ${data.industryTrends}`);
    if (data.competitiveLandscape) { lines.push(''); lines.push('Competitive Landscape:'); lines.push(data.competitiveLandscape); }
    lines.push('');
    lines.push('─'.repeat(60));
    lines.push('');
    lines.push('IV. GROWTH OPPORTUNITIES');
    lines.push('');
    if (data.organicGrowth) { lines.push('Organic Growth:'); lines.push(data.organicGrowth); lines.push(''); }
    if (data.acquisitionGrowth) { lines.push('M&A Opportunities:'); lines.push(data.acquisitionGrowth); }
    lines.push('');
    lines.push('─'.repeat(60));
    lines.push('');
    lines.push('V. CUSTOMERS & SALES');
    lines.push('');
    if (data.customerOverview) lines.push(data.customerOverview);
    if (data.topCustomers) lines.push(`Customer Concentration: ${data.topCustomers}`);
    if (data.retentionMetrics) lines.push(`Retention: ${data.retentionMetrics}`);
    if (data.salesProcess) { lines.push(''); lines.push('Sales Process:'); lines.push(data.salesProcess); }
    lines.push('');
    lines.push('─'.repeat(60));
    lines.push('');
    lines.push('VI. OPERATIONS');
    lines.push('');
    lines.push(`Headquarters: ${displayLocation}`);
    lines.push(`Employees: ${displayEmployees}`);
    if (data.keyPersonnel) { lines.push(''); lines.push('Key Personnel:'); lines.push(data.keyPersonnel); }
    lines.push('');
    lines.push('─'.repeat(60));
    lines.push('');
    lines.push('VII. FINANCIAL OVERVIEW');
    lines.push('');
    lines.push(`Revenue: ${displayRevenue}`);
    lines.push(`EBITDA: ${displayEbitda}`);
    lines.push(`EBITDA Margin: ${margin !== 'N/A' ? margin + '%' : 'N/A'}`);
    if (growth > 0) lines.push(`Revenue Growth: ${anon ? (growth > 15 ? '15%+' : growth > 10 ? '10-15%' : '5-10%') : growth + '%'}`);
    if (capex > 0) lines.push(`Annual CapEx: ${anon ? '<$1M' : '$' + capex + 'M'}`);
    lines.push('');
    lines.push('─'.repeat(60));
    lines.push('');
    lines.push('CONFIDENTIALITY NOTICE');
    lines.push('This document is strictly confidential and has been prepared solely for informational purposes.');
    lines.push('It does not constitute an offer to sell or a solicitation of an offer to buy any securities.');
    lines.push('');
    lines.push('─'.repeat(60));
    lines.push(`Generated by PE Ready Plus | ${new Date().toLocaleDateString()}`);

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CIM_Draft_${anon ? generateCodeName(data.companyName).replace(/\s/g, '_') : (data.companyName || 'Company').replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-foreground">Your Draft CIM</h2>
        <div className="flex gap-2">
          {anon && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              <EyeOff className="w-3 h-3 mr-1" /> Anonymized
            </Badge>
          )}
          <Button size="sm" onClick={handleExportText}>
            <Download className="w-4 h-4 mr-2" /> Download Draft
          </Button>
        </div>
      </div>

      {anon && data.companyName && (
        <Alert className="border-emerald-500/30 bg-emerald-500/5">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>"{data.companyName}"</strong> has been anonymized to <strong>"{displayName}"</strong>.
            Location, financials, and employee count are shown as ranges.
          </AlertDescription>
        </Alert>
      )}

      {anon && (
        <Alert className="border-amber-500/30 bg-amber-500/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Reminder:</strong> Anonymization only hides structured fields (name, location, financials).
            Review the narrative sections (Company Description, Customers, etc.) to remove any identifying details before sharing.
          </AlertDescription>
        </Alert>
      )}

      {/* The CIM Document */}
      <Card className="p-8 bg-background border-2 border-border">

        {/* Confidentiality Header */}
        <div className="text-center border-b-2 border-border pb-6 mb-8">
          <p className="text-xs text-red-500 font-bold uppercase tracking-[0.3em] mb-4">Confidential</p>
          <h1 className="text-3xl font-bold text-foreground mb-1">{displayName}</h1>
          <p className="text-lg text-muted-foreground">{sector}</p>
          <p className="text-sm text-muted-foreground mt-1">{displayLocation}</p>
          <div className="mt-4 flex justify-center gap-6 text-sm text-muted-foreground">
            <span>Transaction: {dealType}</span>
            {data.timeline && <span>Timeline: {timelineLabel[data.timeline] || data.timeline}</span>}
          </div>
        </div>

        {/* I. Executive Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">
            I. Executive Summary
          </h2>
          <p className="text-sm text-foreground leading-relaxed mb-3">
            {displayName} is a {founded ? `${founded}-year-old ` : ''}{sector.toLowerCase()} company
            headquartered in {displayLocation}.
            {rev > 0 ? ` The company generates ${displayRevenue} in annual revenue with EBITDA of ${displayEbitda}` : ''}
            {margin !== 'N/A' ? `, representing a ${margin}% EBITDA margin` : ''}.
            {growth > 0 ? ` Revenue has been growing at ${anon ? (growth > 15 ? '15%+' : growth > 10 ? '10-15%' : '5-10%') : growth + '%'} annually.` : ''}
            {employees > 0 ? ` The company employs ${displayEmployees} professionals.` : ''}
          </p>
          <p className="text-sm text-foreground leading-relaxed mb-3">
            The owners are pursuing a {dealType}
            {data.timeline ? ` within an indicative ${timelineLabel[data.timeline] || data.timeline} timeframe` : ''}.
            {data.companyDescription ? ` ${data.companyDescription}` : ''}
          </p>

          {displayHighlights.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Investment Highlights</h3>
              <div className="space-y-2">
                {displayHighlights.map((h, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-primary font-bold shrink-0">&#x25A0;</span>
                    <span className="text-foreground">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Snapshot Table */}
          {rev > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Financial Snapshot</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-3 text-muted-foreground">Revenue</td>
                      <td className="p-3 text-right font-medium">{displayRevenue}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 text-muted-foreground">EBITDA</td>
                      <td className="p-3 text-right font-medium">{displayEbitda}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 text-muted-foreground">EBITDA Margin</td>
                      <td className="p-3 text-right font-medium">{margin !== 'N/A' ? `${margin}%` : 'N/A'}</td>
                    </tr>
                    {growth > 0 && (
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">Revenue Growth</td>
                        <td className="p-3 text-right font-medium">{anon ? (growth > 15 ? '15%+' : growth > 10 ? '10-15%' : '5-10%') : `${growth}%`}</td>
                      </tr>
                    )}
                    {employees > 0 && (
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">Employees</td>
                        <td className="p-3 text-right font-medium">{displayEmployees}</td>
                      </tr>
                    )}
                    {capex > 0 && (
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">Annual CapEx</td>
                        <td className="p-3 text-right font-medium">{anon ? '<$1M' : `$${capex}M`}</td>
                      </tr>
                    )}
                    {founded && (
                      <tr>
                        <td className="p-3 text-muted-foreground">Years in Business</td>
                        <td className="p-3 text-right font-medium">{founded}+</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* II. Company Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">
            II. Company Overview
          </h2>
          {data.companyDescription ? (
            <p className="text-sm text-foreground leading-relaxed mb-3">{data.companyDescription}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic mb-3">[Company description to be completed]</p>
          )}
          {data.productsServices && (
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-foreground mb-1">Products & Services</h3>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{data.productsServices}</p>
            </div>
          )}
          {data.businessModel && (
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-foreground mb-1">Business Model</h3>
              <p className="text-sm text-foreground leading-relaxed">{data.businessModel}</p>
            </div>
          )}
          {data.differentiators && (
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-foreground mb-1">Key Differentiators</h3>
              <p className="text-sm text-foreground leading-relaxed">{data.differentiators}</p>
            </div>
          )}
        </div>

        {/* III. Industry Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">
            III. Industry Overview
          </h2>
          {data.industryOverview ? (
            <p className="text-sm text-foreground leading-relaxed mb-3">{data.industryOverview}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic mb-3">[Industry overview to be completed]</p>
          )}
          {(data.marketSize || data.industryTrends) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              {data.marketSize && (
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Market Size</p>
                  <p className="text-sm font-medium">{data.marketSize}</p>
                </div>
              )}
              {data.industryTrends && (
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Growth Trends</p>
                  <p className="text-sm font-medium">{data.industryTrends}</p>
                </div>
              )}
            </div>
          )}
          {data.competitiveLandscape && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Competitive Landscape</h3>
              <p className="text-sm text-foreground leading-relaxed">{data.competitiveLandscape}</p>
            </div>
          )}
        </div>

        {/* IV. Growth Opportunities */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">
            IV. Growth Opportunities
          </h2>
          {data.organicGrowth ? (
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-foreground mb-1">Organic Growth Levers</h3>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{data.organicGrowth}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic mb-3">[Organic growth opportunities to be completed]</p>
          )}
          {data.acquisitionGrowth && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">M&A / Add-On Opportunities</h3>
              <p className="text-sm text-foreground leading-relaxed">{data.acquisitionGrowth}</p>
            </div>
          )}
        </div>

        {/* V. Customers & Sales */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">
            V. Customers & Sales
          </h2>
          {data.customerOverview ? (
            <p className="text-sm text-foreground leading-relaxed mb-3">{data.customerOverview}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic mb-3">[Customer overview to be completed]</p>
          )}
          {(data.topCustomers || data.retentionMetrics) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              {data.topCustomers && (
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Customer Concentration</p>
                  <p className="text-sm font-medium">{data.topCustomers}</p>
                </div>
              )}
              {data.retentionMetrics && (
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Retention Metrics</p>
                  <p className="text-sm font-medium">{data.retentionMetrics}</p>
                </div>
              )}
            </div>
          )}
          {data.salesProcess && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Sales Process & Go-to-Market</h3>
              <p className="text-sm text-foreground leading-relaxed">{data.salesProcess}</p>
            </div>
          )}
        </div>

        {/* VI. Operations */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">
            VI. Operations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Headquarters</p>
              <p className="text-sm font-medium">{displayLocation}</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Employees</p>
              <p className="text-sm font-medium">{displayEmployees}</p>
            </div>
          </div>
          {data.keyPersonnel && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Key Personnel</h3>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{data.keyPersonnel}</p>
            </div>
          )}
        </div>

        {/* VII. Financial Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">
            VII. Financial Overview
          </h2>
          {rev > 0 ? (
            <>
              <div className="border border-border rounded-lg overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="p-3 text-left font-semibold text-foreground">Metric</th>
                      <th className="p-3 text-right font-semibold text-foreground">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-3 text-muted-foreground">Annual Revenue</td>
                      <td className="p-3 text-right font-medium">{displayRevenue}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 text-muted-foreground">EBITDA</td>
                      <td className="p-3 text-right font-medium">{displayEbitda}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 text-muted-foreground">EBITDA Margin</td>
                      <td className="p-3 text-right font-medium">{margin !== 'N/A' ? `${margin}%` : 'N/A'}</td>
                    </tr>
                    {growth > 0 && (
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">Revenue Growth Rate</td>
                        <td className="p-3 text-right font-medium">{anon ? (growth > 15 ? '15%+' : growth > 10 ? '10-15%' : '5-10%') : `${growth}%`}</td>
                      </tr>
                    )}
                    {capex > 0 && (
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">Annual Capital Expenditure</td>
                        <td className="p-3 text-right font-medium">{anon ? '<$1M' : `$${capex}M`}</td>
                      </tr>
                    )}
                    {rev > 0 && ebitda > 0 && (
                      <tr>
                        <td className="p-3 text-muted-foreground">Free Cash Flow Conversion</td>
                        <td className="p-3 text-right font-medium">{capex > 0 ? `~${Math.round(((ebitda - capex) / ebitda) * 100)}%` : 'High'}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {displayName} has demonstrated {growth > 10 ? 'strong' : growth > 5 ? 'steady' : 'consistent'} financial
                performance with {displayRevenue} in revenue and {displayEbitda} in EBITDA
                {margin !== 'N/A' ? `, representing a ${margin}% margin` : ''}.
                {growth > 0 ? ` The company has achieved ${anon ? (growth > 15 ? '15%+' : '10%+') : growth + '%'} revenue growth, demonstrating the scalability of its business model.` : ''}
                {capex > 0 ? ` Capital expenditure requirements are modest at ${anon ? '<$1M' : '$' + capex + 'M'} annually, supporting strong free cash flow conversion.` : ''}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic">[Financial data to be completed]</p>
          )}
        </div>

        {/* Disclaimer Footer */}
        <div className="border-t-2 border-border pt-6 mt-8">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            This Confidential Information Memorandum ("CIM") has been prepared solely for informational purposes and does not constitute
            an offer to sell or a solicitation of an offer to buy any securities. The information contained herein has been provided by
            management and has not been independently verified. No representation or warranty, express or implied, is made as to the
            accuracy, completeness, or fairness of the information. Prospective investors should conduct their own independent investigation
            and assessment of the company. This document is confidential and may not be reproduced, distributed, or disclosed without
            prior written consent.
          </p>
          <p className="text-[10px] text-muted-foreground mt-2">
            Draft generated by PE Ready Plus &middot; {new Date().toLocaleDateString()}
          </p>
        </div>
      </Card>

      {/* Post-CIM Tips */}
      <Alert className="border-primary/30 bg-primary/5">
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <span className="font-semibold">What to do with this draft:</span> This is your starting framework. Share it with your
          investment banker or M&A advisor — they'll refine the narrative, add detailed financial modeling, include proper charts
          and exhibits, and prepare it for distribution to qualified buyers. Having this head start can save weeks of back-and-forth.
        </AlertDescription>
      </Alert>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────

export const CIMGenerator: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageAnswered, setPageAnswered] = useState<Record<number, boolean>>({});
  const [importedFields, setImportedFields] = useState<string[]>([]);

  const [data, setData] = useState<CIMData>(() => {
    // Try to load saved data
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }

    // Try to import from other modules
    const imported = tryImportExistingData();
    const fields: string[] = [];
    if (imported.companyName) fields.push('Company Name');
    if (imported.keyPersonnel) fields.push('Key Personnel');
    if (imported.ebitda) fields.push('EBITDA');
    if (imported.organicGrowth) fields.push('Growth Levers');

    return { ...defaultData, ...imported, _importedFields: fields } as CIMData & { _importedFields: string[] };
  });

  // Track imported fields on first load
  useEffect(() => {
    const imported = tryImportExistingData();
    const fields: string[] = [];
    if (imported.companyName) fields.push('Company Name');
    if (imported.keyPersonnel) fields.push('Key Personnel');
    if (imported.ebitda) fields.push('EBITDA');
    if (imported.organicGrowth) fields.push('Growth Levers');
    setImportedFields(fields);
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const markPageAnswered = useCallback((page: number) => {
    setPageAnswered(p => ({ ...p, [page]: true }));
  }, []);

  const pages = useMemo(() => [
    { title: 'What Is a CIM?', content: <IntroPage /> },
    {
      title: 'Company & Deal Setup',
      content: (
        <CompanySetupPage
          data={data}
          setData={setData}
          markAnswered={() => markPageAnswered(1)}
          importedFields={importedFields}
        />
      ),
    },
    {
      title: 'Business Description',
      content: (
        <BusinessDescriptionPage
          data={data}
          setData={setData}
          markAnswered={() => markPageAnswered(2)}
        />
      ),
    },
    {
      title: 'Market & Growth',
      content: (
        <MarketGrowthPage
          data={data}
          setData={setData}
          markAnswered={() => markPageAnswered(3)}
        />
      ),
    },
    {
      title: 'Customers, Team & Financials',
      content: (
        <TeamFinancialsPage
          data={data}
          setData={setData}
          markAnswered={() => markPageAnswered(4)}
        />
      ),
    },
    { title: 'Your Draft CIM', content: <GeneratedCIMPage data={data} /> },
  ], [data, importedFields, markPageAnswered]);

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
