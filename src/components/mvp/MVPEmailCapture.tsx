import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/calculations/ebitda';
import type { CalculatedResults } from '@/pages/RealityCheck';

interface Props {
  results: CalculatedResults;
}

export default function MVPEmailCapture({ results }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isValid = email.includes('@') && email.includes('.') && companyName.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      await supabase.from('contact_inquiries').insert({
        contact_email: email.trim(),
        company_name: companyName.trim(),
        industry: results.industry,
        how_did_you_hear: 'reality-check-funnel',
        current_challenges: JSON.stringify({
          source: 'reality-check',
          perceivedValue: results.perceivedValue,
          peValue: results.peValue,
          gap: results.gap,
          gapPercent: results.gapPercent,
          ebitda: results.ebitda,
          multiple: results.multiple,
          ownerDependence: results.ownerDependence,
          ebitdaMargin: results.ebitdaMargin,
        }),
        status: 'new',
      });

      setSubmitted(true);
      // Store email for pre-fill on auth page
      sessionStorage.setItem('mvp_lead_email', email.trim());

      setTimeout(() => navigate('/auth'), 1800);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto pt-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-2xl font-black text-foreground">You're in.</h3>
        <p className="text-foreground-secondary">Setting up your account now…</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto pt-10 pb-16 space-y-8">
      {/* Summary callout */}
      <div className="glass-card rounded-2xl p-5 border border-warning/20 space-y-1">
        <p className="text-xs text-warning uppercase tracking-wider font-medium">Your Reality Check Summary</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground-secondary">Your estimate</span>
          <span className="text-foreground font-semibold">{formatCurrency(results.perceivedValue)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground-secondary">PE buyer offer</span>
          <span className="text-destructive font-semibold">{formatCurrency(results.peValue)}</span>
        </div>
        {results.gap > 0 && (
          <div className="flex items-center justify-between text-sm border-t border-border/50 pt-1 mt-1">
            <span className="text-foreground-secondary">Gap to close</span>
            <span className="text-warning font-bold">{formatCurrency(results.gap)}</span>
          </div>
        )}
      </div>

      {/* CTA copy */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-foreground">
          You've seen the gap.{' '}
          <span className="text-luxury bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
            Now let's close it.
          </span>
        </h2>
        <p className="text-foreground-secondary">
          Join PE Ready — fix your valuation, fix your deal, exit on your terms.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-foreground-secondary text-sm">
            Company name
          </Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Acme Corp"
            className="bg-background-hover border-border text-foreground placeholder:text-foreground-muted"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground-secondary text-sm">
            Your email address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="bg-background-hover border-border text-foreground placeholder:text-foreground-muted"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full py-4 text-base font-bold bg-accent hover:bg-accent/90 text-white button-shadow"
        >
          {isSubmitting ? 'Creating your account…' : 'Create My Free Account'}
          {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
        </Button>

        <p className="text-center text-xs text-foreground-muted">
          Already a member?{' '}
          <a href="/auth" className="text-accent hover:underline">
            Sign in
          </a>
        </p>
      </form>

      <p className="text-center text-xs text-foreground-muted">
        No credit card required. Full platform access launching soon.
      </p>
    </div>
  );
}
