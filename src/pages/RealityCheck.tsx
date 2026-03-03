import { useState } from 'react';
import { Link } from 'react-router-dom';
import StepQuestionnaire from '@/components/mvp/StepQuestionnaire';
import GapReveal from '@/components/mvp/GapReveal';
import DealKillerCards from '@/components/mvp/DealKillerCards';
import MVPEmailCapture from '@/components/mvp/MVPEmailCapture';
import AIVoiceWidget from '@/components/mvp/AIVoiceWidget';

// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface FormData {
  firstName: string;
  perceivedValue: number;
  industry: string;
  revenue: number;
  ebitdaMargin: number;   // as a percentage, e.g. 22 = 22%
  ownerDependence: number; // 1–5
}

export interface CalculatedResults {
  perceivedValue: number;
  ebitda: number;
  multiple: number;
  peValue: number;
  gap: number;
  gapPercent: number;
  firstName: string;
  industry: string;
  ownerDependence: number;
  ebitdaMargin: number;
}

// ─── Calculation ──────────────────────────────────────────────────────────────

const INDUSTRY_MULTIPLES: Record<string, number> = {
  'technology': 7.5,
  'healthcare': 6.5,
  'business-services': 5.5,
  'manufacturing': 4.0,
  'distribution': 4.0,
  'construction': 3.5,
  'professional-services': 5.0,
  'ecommerce': 4.0,
  'financial-services': 6.0,
  'other': 4.5,
};

function calculateResults(data: FormData): CalculatedResults {
  const baseMultiple = INDUSTRY_MULTIPLES[data.industry] ?? 4.5;

  // Owner dependence adjustment: 1 = very dependent (penalty), 5 = independent (premium)
  const ownerAdj =
    data.ownerDependence <= 3
      ? (data.ownerDependence - 3) * 0.35  // up to -0.7x penalty
      : (data.ownerDependence - 3) * 0.2;  // up to +0.4x premium

  const multiple = parseFloat(Math.max(2.5, baseMultiple + ownerAdj).toFixed(2));
  const ebitda = data.revenue * (data.ebitdaMargin / 100);
  const peValue = Math.max(0, ebitda * multiple);
  const gap = data.perceivedValue - peValue;
  const gapPercent = data.perceivedValue > 0 ? (gap / data.perceivedValue) * 100 : 0;

  return {
    perceivedValue: data.perceivedValue,
    ebitda,
    multiple,
    peValue,
    gap,
    gapPercent,
    firstName: data.firstName,
    industry: data.industry,
    ownerDependence: data.ownerDependence,
    ebitdaMargin: data.ebitdaMargin,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type PageStep = 'questionnaire' | 'results' | 'capture';

export default function RealityCheck() {
  const [step, setStep] = useState<PageStep>('questionnaire');
  const [results, setResults] = useState<CalculatedResults | null>(null);

  const handleQuestionnaireComplete = (data: FormData) => {
    setResults(calculateResults(data));
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary via-background to-primary-secondary opacity-40 pointer-events-none" />
      <div className="fixed top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-black tracking-tight">
          <span className="text-luxury bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
            PE
          </span>
          <span className="text-foreground"> Ready</span>
        </Link>
        <Link
          to="/auth"
          className="text-sm text-foreground-secondary hover:text-foreground transition-luxury"
        >
          Sign in
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 px-4 pb-20">
        {step === 'questionnaire' && (
          <StepQuestionnaire onComplete={handleQuestionnaireComplete} />
        )}

        {step === 'results' && results && (
          <>
            <GapReveal results={results} />
            <DealKillerCards results={results} />
            <div className="max-w-2xl mx-auto mt-10 text-center space-y-3">
              <button
                onClick={() => {
                  setStep('capture');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-10 py-4 bg-accent text-white font-bold text-lg rounded-xl button-shadow hover:opacity-90 transition-luxury"
              >
                Learn how to fix this — Join PE Ready →
              </button>
              <p className="text-xs text-foreground-muted">Free to join. Full platform launching soon.</p>
            </div>
            <AIVoiceWidget
              context={{
                module: 'Reality Check — Gap Analysis',
                user_name: results.firstName,
                revenue: results.ebitda / (results.ebitdaMargin / 100),
                ebitda: results.ebitda,
                perceived_value: results.perceivedValue,
                pe_value: results.peValue,
                gap: results.gap,
                industry: results.industry,
              }}
            />
          </>
        )}

        {step === 'capture' && results && (
          <MVPEmailCapture results={results} />
        )}
      </main>
    </div>
  );
}
