
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, DollarSign, Users, MapPin, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { useCompanyProfile, type CompanyProfile, emptyProfile } from '@/lib/companyProfile';

const industryOptions = [
  'Technology / SaaS', 'Healthcare', 'Manufacturing / Industrial',
  'Financial Services', 'Consumer / Retail', 'Business Services',
  'Education', 'Food & Beverage', 'Construction', 'Distribution',
  'Energy', 'Real Estate', 'Other'
];

const businessModelOptions = [
  { value: 'saas', label: 'SaaS / Subscription' },
  { value: 'recurring_services', label: 'Recurring Services' },
  { value: 'transaction', label: 'Transaction / Usage-Based' },
  { value: 'hybrid', label: 'Hybrid' },
];

const transactionTypeOptions = [
  { value: 'full-sale', label: 'Full Sale' },
  { value: 'majority', label: 'Majority Recapitalization' },
  { value: 'minority', label: 'Minority Investment' },
  { value: 'growth', label: 'Growth Equity' },
];

const timelineOptions = [
  { value: '0-6', label: '0–6 months' },
  { value: '6-12', label: '6–12 months' },
  { value: '12-24', label: '1–2 years' },
  { value: '24+', label: '2+ years' },
  { value: 'exploring', label: 'Just exploring' },
];

const CompanyProfilePage = () => {
  const { profile, save } = useCompanyProfile();
  const [form, setForm] = useState<CompanyProfile>(profile);

  // Sync form when profile changes (e.g. from another tab)
  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const update = (field: keyof CompanyProfile, value: string | number) => {
    const next = { ...form, [field]: value };
    // Auto-calculate EBITDA margin
    if ((field === 'ebitda' || field === 'annualRevenue') && next.annualRevenue > 0) {
      next.ebitdaMargin = parseFloat(((next.ebitda / next.annualRevenue) * 100).toFixed(1));
    }
    setForm(next);
    save(next);
  };

  const numChange = (field: keyof CompanyProfile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    update(field, parseFloat(e.target.value) || 0);
  };

  const textChange = (field: keyof CompanyProfile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    update(field, e.target.value);
  };

  // Count filled fields for progress
  const fields: (keyof CompanyProfile)[] = [
    'companyName', 'industry', 'annualRevenue', 'ebitda',
    'revenueGrowthRate', 'employeeCount', 'city', 'state'
  ];
  const filledCount = fields.filter(f => {
    const v = form[f];
    return typeof v === 'string' ? v.length > 0 : v > 0;
  }).length;
  const completionPct = Math.round((filledCount / fields.length) * 100);

  const NumberField = ({ label, field, prefix = '', suffix = '', help }: {
    label: string; field: keyof CompanyProfile; prefix?: string; suffix?: string; help?: string;
  }) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{prefix}</span>}
        <Input
          type="number"
          value={form[field] || ''}
          onChange={numChange(field)}
          className={`${prefix ? 'pl-7' : ''} ${suffix ? 'pr-8' : ''}`}
          placeholder="0"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{suffix}</span>}
      </div>
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">Company Profile</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Enter your company info once. Every module in the program will use it — no re-typing.
        </p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {completionPct === 100
                ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                : <AlertCircle className="h-5 w-5 text-yellow-400" />
              }
              <span className="text-sm font-medium">
                {completionPct === 100 ? 'Profile complete' : `${filledCount} of ${fields.length} key fields filled`}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{completionPct}%</span>
          </div>
          <Progress value={completionPct} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            The more you fill in, the less you'll need to type in other modules.
          </p>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-400" />
            Company Information
          </CardTitle>
          <CardDescription>Basic info about your business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Company Name</Label>
              <Input value={form.companyName} onChange={textChange('companyName')} placeholder="Your company name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Industry</Label>
              <select
                value={form.industry}
                onChange={(e) => update('industry', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select industry...</option>
                {industryOptions.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <NumberField label="Year Founded" field="yearFounded" help="e.g. 2015" />
            <NumberField label="Number of Employees" field="employeeCount" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">City</Label>
              <Input value={form.city} onChange={textChange('city')} placeholder="Headquarters city" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">State</Label>
              <Input value={form.state} onChange={textChange('state')} placeholder="e.g. FL" maxLength={2} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Business Model</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {businessModelOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update('businessModel', opt.value)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    form.businessModel === opt.value
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            Financial Overview
          </CardTitle>
          <CardDescription>Key financial metrics — used across EBITDA Calculator, Returns Sensitivity, CIM Generator, and more</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberField label="Annual Revenue ($M)" field="annualRevenue" prefix="$" help="In millions — e.g. enter 5 for $5 million" />
            <NumberField label="EBITDA ($M)" field="ebitda" prefix="$" help="In millions — e.g. enter 1.5 for $1.5 million" />
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">EBITDA Margin (auto-calculated)</Label>
              <div className="p-2.5 rounded-md border bg-muted/50 text-lg font-bold">
                {form.annualRevenue > 0 ? `${((form.ebitda / form.annualRevenue) * 100).toFixed(1)}%` : '—'}
              </div>
              <p className="text-xs text-muted-foreground">EBITDA / Revenue</p>
            </div>
            <NumberField label="Gross Margin" field="grossMarginPercent" suffix="%" help="Revenue minus cost of goods sold, as %" />
            <NumberField label="Revenue Growth Rate" field="revenueGrowthRate" suffix="%" help="Year-over-year growth" />
          </div>
        </CardContent>
      </Card>

      {/* Customer Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            Customer Metrics
          </CardTitle>
          <CardDescription>Used by Revenue Quality Score, PE Screening Scorecard, and CIM Generator</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberField label="Total Customers" field="customerCount" help="Current active customer count" />
            <NumberField label="Top 10 Customer Concentration" field="top10CustomerConcentration" suffix="%" help="What % of revenue comes from your 10 largest customers?" />
          </div>
        </CardContent>
      </Card>

      {/* Deal Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-400" />
            Deal Context
          </CardTitle>
          <CardDescription>Used by Anonymous Teaser, CIM Generator, and PE Screening</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Transaction Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {transactionTypeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update('transactionType', opt.value)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    form.transactionType === opt.value
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Exit Timeline</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {timelineOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update('exitTimeline', opt.value)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    form.exitTimeline === opt.value
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What uses this data */}
      <Card className="border-blue-500/30">
        <CardContent className="py-4">
          <h4 className="text-sm font-semibold mb-2 text-blue-400">Where your data flows</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div>Anonymous Teaser</div>
            <div>Draft CIM Generator</div>
            <div>Revenue Quality Score</div>
            <div>Returns Sensitivity</div>
            <div>Value Creation Plan</div>
            <div>PE Screening Scorecard</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            You can always override values in individual modules without changing your profile.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfilePage;
