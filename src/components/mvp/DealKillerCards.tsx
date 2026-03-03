import { useEffect, useState } from 'react';
import { AlertTriangle, Users, FileX, Search } from 'lucide-react';
import type { CalculatedResults } from '@/pages/RealityCheck';

interface Props {
  results: CalculatedResults;
}

interface DealKiller {
  icon: React.ReactNode;
  title: string;
  youThink: string;
  reality: string;
  stat: string;
}

function getDealKillers(results: CalculatedResults): DealKiller[] {
  const killers: DealKiller[] = [];

  // Deal Killer 1: Owner dependence (always #1 if low score)
  if (results.ownerDependence <= 3) {
    killers.push({
      icon: <Users className="w-6 h-6 text-destructive" />,
      title: 'Owner Dependency',
      youThink: '"My business is successful — that proves it can run."',
      reality: 'If you\'re the business, PE buyers don\'t see a business — they see a job. Owner-dependent companies are discounted 20–40% or passed on entirely.',
      stat: '67% of failed acquisitions cite owner dependency as the primary reason.',
    });
  } else {
    killers.push({
      icon: <Users className="w-6 h-6 text-success" />,
      title: 'Management Independence',
      youThink: '"My team is strong and the business runs without me."',
      reality: 'This is a genuine strength — but buyers will still stress-test it in due diligence. Every key person must be documented, incentivized to stay, and replaceable.',
      stat: 'Businesses with strong management teams command 1–2x higher multiples.',
    });
  }

  // Deal Killer 2: EBITDA margin
  if (results.ebitdaMargin < 15) {
    killers.push({
      icon: <AlertTriangle className="w-6 h-6 text-destructive" />,
      title: 'Below-Market EBITDA Margins',
      youThink: '"My revenue growth speaks for itself."',
      reality: `At ${results.ebitdaMargin.toFixed(0)}% EBITDA margin, you're below the 15% floor most PE firms require. Revenue without margin is just expensive overhead to them.`,
      stat: 'PE buyers pay multiples on EBITDA — not revenue. Thin margins collapse your valuation.',
    });
  } else {
    killers.push({
      icon: <AlertTriangle className="w-6 h-6 text-warning" />,
      title: 'Undocumented Add-Backs',
      youThink: '"My P&L shows what the business makes."',
      reality: 'PE buyers rebuild your EBITDA from scratch. Owner compensation, personal expenses, and one-time costs get added back — but only if they\'re documented. Undocumented add-backs get left out.',
      stat: 'The average business owner leaves $200K–$800K of EBITDA add-backs undocumented.',
    });
  }

  // Deal Killer 3: Due diligence (always relevant)
  killers.push({
    icon: <Search className="w-6 h-6 text-destructive" />,
    title: 'Due Diligence Landmines',
    youThink: '"Once they make an offer, the deal is basically done."',
    reality: 'Due diligence is where deals die. Missing contracts, undocumented processes, disorganized financials, and legal exposure — any one of these can kill a signed LOI.',
    stat: '70% of deals that enter due diligence are re-priced or killed before closing.',
  });

  // If we only have 2 from above, add the data room killer
  if (killers.length < 3) {
    killers.push({
      icon: <FileX className="w-6 h-6 text-destructive" />,
      title: 'No Data Room Readiness',
      youThink: '"I\'ll get the documents together when they ask."',
      reality: 'Buyers interpret scrambling as a red flag. A disorganized data room signals a disorganized business — and gives them leverage to renegotiate downward.',
      stat: 'Companies with organized data rooms close 30% faster and at higher valuations.',
    });
  }

  return killers.slice(0, 3);
}

export default function DealKillerCards({ results }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const killers = getDealKillers(results);

  useEffect(() => {
    const timers = killers.map((_, i) =>
      setTimeout(() => setVisibleCount((c) => Math.max(c, i + 1)), i * 600 + 300)
    );
    return () => timers.forEach(clearTimeout);
  }, [killers.length]);

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      {killers.map((killer, i) => (
        <div
          key={i}
          className={`glass-card rounded-2xl p-6 border transition-all duration-700 ${
            i < visibleCount
              ? 'border-destructive/20 opacity-100 translate-y-0'
              : 'border-transparent opacity-0 translate-y-6'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-destructive/10 flex-shrink-0">
              {killer.icon}
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-destructive uppercase tracking-wider">
                  Deal Killer #{i + 1}
                </span>
                <span className="text-sm font-bold text-foreground">{killer.title}</span>
              </div>

              <div className="space-y-2">
                <div className="rounded-lg bg-background-hover p-3">
                  <p className="text-xs text-foreground-muted uppercase tracking-wider mb-1">You think</p>
                  <p className="text-sm text-foreground-secondary italic">{killer.youThink}</p>
                </div>
                <div className="rounded-lg bg-destructive/10 p-3">
                  <p className="text-xs text-destructive uppercase tracking-wider mb-1">Reality</p>
                  <p className="text-sm text-foreground">{killer.reality}</p>
                </div>
              </div>

              <p className="text-xs text-foreground-muted border-l-2 border-warning pl-3">
                {killer.stat}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
