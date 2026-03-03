import { useEffect, useState } from 'react';
import { TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/calculations/ebitda';
import type { CalculatedResults } from '@/pages/RealityCheck';

interface Props {
  results: CalculatedResults;
}

export default function GapReveal({ results }: Props) {
  const [showPE, setShowPE] = useState(false);
  const [showGap, setShowGap] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowPE(true), 800);
    const t2 = setTimeout(() => setShowGap(true), 1600);
    const t3 = setTimeout(() => setShowCTA(true), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const gapIsPositive = results.gap > 0;
  const gapPercent = Math.abs(results.gapPercent).toFixed(0);

  return (
    <div className="max-w-2xl mx-auto pt-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
          {results.firstName}, here's{' '}
          <span className="text-luxury bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
            what the numbers say.
          </span>
        </h2>
      </div>

      <div className="space-y-4">
        {/* What they think */}
        <div className="glass-card rounded-2xl p-6 border border-border/50">
          <p className="text-sm text-foreground-secondary font-medium uppercase tracking-wider mb-2">
            You believe your business is worth
          </p>
          <p className="text-5xl font-black text-foreground">
            {formatCurrency(results.perceivedValue)}
          </p>
        </div>

        {/* What PE buyers see */}
        <div
          className={`rounded-2xl p-6 border transition-all duration-700 ${
            showPE
              ? 'border-destructive/40 bg-destructive/10 opacity-100 translate-y-0'
              : 'border-transparent bg-transparent opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm text-destructive font-medium uppercase tracking-wider mb-2">
            What a PE buyer would offer today
          </p>
          <p className="text-5xl font-black text-destructive">
            {formatCurrency(results.peValue)}
          </p>
          <p className="text-sm text-foreground-muted mt-2">
            Based on {results.multiple.toFixed(1)}x EBITDA · {formatCurrency(results.ebitda)} adjusted EBITDA
          </p>
        </div>

        {/* The gap */}
        {showGap && gapIsPositive && (
          <div className="rounded-2xl p-6 border border-warning/40 bg-warning/10 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-start gap-3">
              <TrendingDown className="w-6 h-6 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-warning font-medium uppercase tracking-wider mb-1">
                  The gap — {gapPercent}% less than you expect
                </p>
                <p className="text-4xl font-black text-warning">
                  {formatCurrency(results.gap)} <span className="text-2xl">less</span>
                </p>
                <p className="text-sm text-foreground-muted mt-2">
                  This is money left on the table — or worse, a deal that never closes.
                </p>
              </div>
            </div>
          </div>
        )}

        {showGap && !gapIsPositive && (
          <div className="rounded-2xl p-6 border border-success/40 bg-success/10 animate-in slide-in-from-bottom-2 duration-500">
            <p className="text-sm text-success font-medium uppercase tracking-wider mb-1">
              Your valuation is in range
            </p>
            <p className="text-xl font-bold text-foreground">
              Your estimate is close to what PE buyers would calculate — but read on. The valuation is only half the battle.
            </p>
          </div>
        )}
      </div>

      {showCTA && (
        <div className="text-center animate-in slide-in-from-bottom-2 duration-500">
          <p className="text-lg font-semibold text-foreground">
            Here's exactly why your deal would fall apart before it even reaches LOI:
          </p>
        </div>
      )}
    </div>
  );
}
