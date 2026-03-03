import { useState } from 'react';
import { ArrowRight, DollarSign, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { FormData } from '@/pages/RealityCheck';

interface Props {
  onComplete: (data: FormData) => void;
}

const INDUSTRIES = [
  { value: 'technology', label: 'Technology & Software' },
  { value: 'healthcare', label: 'Healthcare & Medical' },
  { value: 'business-services', label: 'Business Services' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'distribution', label: 'Distribution & Logistics' },
  { value: 'construction', label: 'Construction & Trades' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'ecommerce', label: 'E-commerce & Retail' },
  { value: 'financial-services', label: 'Financial Services' },
  { value: 'other', label: 'Other / Multiple Industries' },
];

const OWNER_DEPENDENCE_LABELS: Record<number, string> = {
  1: 'I am the business — it stops without me',
  2: 'Very dependent on me day-to-day',
  3: 'Mixed — some things run without me',
  4: 'Mostly independent with a solid team',
  5: 'Fully systemized — runs without me',
};

export default function StepQuestionnaire({ onComplete }: Props) {
  const [internalStep, setInternalStep] = useState<1 | 2>(1);

  const [firstName, setFirstName] = useState('');
  const [perceivedValueStr, setPerceivedValueStr] = useState('');
  const [industry, setIndustry] = useState('');

  const [revenueStr, setRevenueStr] = useState('');
  const [ebitdaMarginStr, setEbitdaMarginStr] = useState('');
  const [ownerDependence, setOwnerDependence] = useState(3);

  const step1Valid = firstName.trim().length > 0 && perceivedValueStr.length > 0 && industry.length > 0;
  const step2Valid = revenueStr.length > 0 && ebitdaMarginStr.length > 0;

  const parseCurrency = (val: string) => parseFloat(val.replace(/[^0-9.]/g, '')) || 0;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step1Valid) setInternalStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!step2Valid) return;
    onComplete({
      firstName: firstName.trim(),
      perceivedValue: parseCurrency(perceivedValueStr),
      industry,
      revenue: parseCurrency(revenueStr),
      ebitdaMargin: parseFloat(ebitdaMarginStr) || 0,
      ownerDependence,
    });
  };

  return (
    <div className="max-w-xl mx-auto pt-8 pb-12">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-luxury ${
                s === internalStep
                  ? 'bg-accent text-white'
                  : s < internalStep
                  ? 'bg-success text-white'
                  : 'bg-border text-foreground-muted'
              }`}
            >
              {s}
            </div>
            {s < 2 && <div className={`w-12 h-0.5 ${s < internalStep ? 'bg-success' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {internalStep === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/10 text-xs font-medium text-accent">
              Reality Check
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              What do you think your{' '}
              <span className="text-luxury bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                business is worth
              </span>{' '}
              to a PE buyer?
            </h1>
            <p className="text-foreground-secondary text-base">
              Most founders are off by 40–70%. Let's find out where you stand.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground-secondary text-sm">
                Your first name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Sarah"
                className="bg-background-hover border-border text-foreground placeholder:text-foreground-muted"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-foreground-secondary text-sm">
                Your industry
              </Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="bg-background-hover border-border text-foreground">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent className="bg-background-card border-border">
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind.value} value={ind.value} className="text-foreground hover:bg-background-hover">
                      {ind.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="perceivedValue" className="text-foreground-secondary text-sm">
                What do you believe your business is worth today?
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <Input
                  id="perceivedValue"
                  value={perceivedValueStr}
                  onChange={(e) => setPerceivedValueStr(e.target.value)}
                  placeholder="e.g. 3,000,000"
                  className="pl-9 bg-background-hover border-border text-foreground placeholder:text-foreground-muted text-lg font-semibold"
                />
              </div>
              <p className="text-xs text-foreground-muted">Enter your honest gut-feel estimate</p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!step1Valid}
            className="w-full py-4 text-base font-bold bg-accent hover:bg-accent/90 text-white button-shadow"
          >
            Find out what PE buyers actually see
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </form>
      )}

      {internalStep === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Now let's look at what{' '}
              <span className="text-luxury bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                PE buyers actually see.
              </span>
            </h2>
            <p className="text-foreground-secondary text-base">
              Three numbers. That's all they need to build their offer.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="revenue" className="text-foreground-secondary text-sm">
                Annual Revenue — last 12 months
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <Input
                  id="revenue"
                  value={revenueStr}
                  onChange={(e) => setRevenueStr(e.target.value)}
                  placeholder="e.g. 4,500,000"
                  className="pl-9 bg-background-hover border-border text-foreground placeholder:text-foreground-muted text-lg font-semibold"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ebitdaMargin" className="text-foreground-secondary text-sm">
                Estimated EBITDA Margin %
              </Label>
              <div className="relative">
                <Input
                  id="ebitdaMargin"
                  type="number"
                  min="0"
                  max="80"
                  value={ebitdaMarginStr}
                  onChange={(e) => setEbitdaMarginStr(e.target.value)}
                  placeholder="e.g. 22"
                  className="bg-background-hover border-border text-foreground placeholder:text-foreground-muted text-lg font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted font-semibold">%</span>
              </div>
              <p className="text-xs text-foreground-muted">
                Profit before interest, taxes, depreciation & amortization ÷ revenue × 100
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-foreground-secondary text-sm">
                  How owner-dependent is your business?
                </Label>
                <span className="text-accent font-bold text-sm">{ownerDependence}/5</span>
              </div>
              <Slider
                value={[ownerDependence]}
                onValueChange={(v) => setOwnerDependence(v[0])}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-warning font-medium">
                {OWNER_DEPENDENCE_LABELS[ownerDependence]}
              </p>
              <div className="flex justify-between text-xs text-foreground-muted">
                <span>Entirely on me</span>
                <span>Runs without me</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={!step2Valid}
              className="w-full py-4 text-base font-bold bg-destructive hover:bg-destructive/90 text-white"
            >
              Show me the truth
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <button
              type="button"
              onClick={() => setInternalStep(1)}
              className="w-full flex items-center justify-center gap-1 text-sm text-foreground-muted hover:text-foreground transition-luxury"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
