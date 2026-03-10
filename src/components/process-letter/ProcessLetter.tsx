import React, { useState } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────

interface Stage {
  id: string;
  label: string;
  day: string;
  role: string;
  description: string;
  buyerAction: string;
  redFlags: string[];
  details: string[];
}

interface AuctionType {
  name: string;
  buyers: string;
  bestFor: string;
  confidentiality: string;
  priceMax: string;
  timeline: string;
  desc: string;
}

interface RedFlagItem {
  flag: string;
  severity: 'HIGH' | 'MEDIUM';
  note: string;
}

interface RedFlagSection {
  doc: string;
  flags: RedFlagItem[];
}

interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

// ─── Data ───────────────────────────────────────────────────────────────

const STAGES: Stage[] = [
  {
    id: 'teaser',
    label: 'TEASER',
    day: 'Day 0',
    role: 'Banker sends to all prospects',
    description: 'Anonymous 1-2 page summary. No company name disclosed. Purpose is to screen interest before NDA. Think of it as a movie trailer — enough to hook a buyer, not enough to identify the company.',
    buyerAction: 'Decide: sign the NDA or pass. Low commitment, high optionality. Most buyers sign NDAs on anything that fits their mandate.',
    redFlags: [],
    details: [
      '1-2 pages max',
      'Company identity withheld',
      'Revenue/EBITDA range only (not exact)',
      'Industry and geography disclosed',
      'No management contact at this stage',
    ],
  },
  {
    id: 'cim',
    label: 'CIM',
    day: 'Day 7-14',
    role: 'Banker sends to NDA signatories',
    description: 'The Confidential Information Memorandum. Full company profile post-NDA — investment thesis, historical financials, market position, management team, growth story. This is the "book" that sells the deal.',
    buyerAction: 'Build a preliminary LBO model. Identify the key risks. Decide if you can compete on price. Most PE firms spend 20-40 hours on the CIM before deciding to bid.',
    redFlags: [
      'Audited financials missing — only management accounts',
      'Customer concentration exceeds 30% in top 3 accounts',
      'Revenue declining 2+ consecutive years',
      'No management team bios or org chart',
    ],
    details: [
      'Historical 3-5 year financials',
      'Management team overview',
      'Product/service breakdown',
      'Market analysis and competitive positioning',
      'Growth projections (usually optimistic)',
      'Capital structure and debt overview',
    ],
  },
  {
    id: 'process_letter',
    label: 'PROCESS LETTER',
    day: 'Day 14-21',
    role: 'Banker sends to all CIM recipients',
    description: 'The rulebook. This document sets every deadline, bid requirement, and procedural expectation for the entire auction. It creates a controlled, competitive environment designed to maximize the seller\'s price.',
    buyerAction: 'Read it twice — once for content, once for subtext. Tight timelines signal speed over diligence. Loose language like "indicative timeline" means the seller already has a preferred buyer.',
    redFlags: [
      'No management presentations offered at any stage',
      '"Indicative timeline" language instead of firm deadlines',
      'Committed financing required in Round 1 (unusual, aggressive)',
      'Purchase Agreement markup required in Round 1',
      'Extremely compressed timeline (< 2 weeks to IOI)',
    ],
    details: [
      'Round 1 IOI deadline (hard date)',
      'Management presentation window',
      'Data room access tiers and rules',
      'Round 2 final bid deadline',
      'Financing commitment requirements',
      'Purchase Agreement markup expectations',
      'Exclusivity terms after winning',
    ],
  },
  {
    id: 'ioi',
    label: 'ROUND 1 — IOI',
    day: 'Day 28-35',
    role: 'Buyers submit to banker',
    description: 'Indication of Interest. Non-binding valuation range with thesis, assumptions, and funding source. This is how the banker cuts the field from 20-30 interested parties down to 5-8 serious buyers.',
    buyerAction: 'Lead with a valuation range, not your ceiling. Show sector credibility and relevant deal experience. Don\'t tip your hand — you can always go higher in Round 2 if you need to.',
    redFlags: [],
    details: [
      'Valuation range (non-binding)',
      'Proposed capital structure (debt/equity)',
      'Key due diligence assumptions',
      'Buyer firm overview and fund size',
      'Relevant portfolio company experience',
      'Investment Committee approval status',
    ],
  },
  {
    id: 'mgmt',
    label: 'MGMT PRESENTATIONS',
    day: 'Day 35-49',
    role: 'Seller meets with Round 2 finalists',
    description: 'Reserved for shortlisted buyers only. Direct access to CEO and CFO. This is your last real window to assess whether management is competent, honest, and willing to stay post-close.',
    buyerAction: 'Don\'t waste this on softball questions. Ask about customer churn, EBITDA adjustments, key man risk, and capex requirements. If the CFO is absent, request a separate meeting before submitting your final bid.',
    redFlags: [
      'CFO absent from presentation without explanation',
      'Management evasive on customer churn specifics',
      'Heavy reliance on a single customer or contract',
      'EBITDA adjustments exceed 15% of reported EBITDA',
    ],
    details: [
      'CEO and CFO attendance expected',
      'Site visits sometimes included',
      'Data room Q&A window opens',
      'Third-party Quality of Earnings report released',
      'Financing advisor access to management team',
    ],
  },
  {
    id: 'final',
    label: 'ROUND 2 — FINAL BID',
    day: 'Day 56-70',
    role: 'Buyers submit to banker',
    description: 'Binding offer. Full committed financing, marked-up Purchase Agreement, specific price, equity commitment letter. This is where the deal is won or lost.',
    buyerAction: 'Price wins auctions — but a clean markup wins deals. A buyer at $10M with no redlines beats a buyer at $10.5M with 40 pages of legal comments. Certainty of close is worth real money.',
    redFlags: [],
    details: [
      'Specific purchase price (binding)',
      'Committed debt financing letters from lenders',
      'Marked-up Purchase Agreement',
      'Equity commitment letter',
      'Rollover terms (if applicable)',
      'Management retention and incentive plan',
    ],
  },
  {
    id: 'exclusivity',
    label: 'EXCLUSIVITY & CLOSE',
    day: 'Day 70-120',
    role: 'Seller grants exclusivity to winner',
    description: 'Single buyer. Confirmatory diligence, final SPA negotiation, financing syndication, regulatory approvals. The deal isn\'t done until it closes — surprises at this stage kill deals.',
    buyerAction: 'Don\'t retrade. Retrading after exclusivity is career-ending in PE. The only valid ground is material misrepresentation in the CIM. Everything else was your job to find in diligence.',
    redFlags: [
      'Seller pushes for extremely fast close (< 3 weeks)',
      'New financial disclosures surface post-exclusivity',
      'Management equity rollover terms still not finalized',
      'Environmental or litigation issues appear for the first time',
    ],
    details: [
      'Final SPA negotiation and execution',
      'Regulatory / HSR filing (if required)',
      'Debt syndication with lender group',
      'Management equity rollover documents',
      'R&W insurance binding',
      'Board and shareholder approvals',
    ],
  },
];

const AUCTION_TYPES: AuctionType[] = [
  {
    name: 'BROAD AUCTION',
    buyers: '20-100+',
    bestFor: 'Middle market < $100M EV',
    confidentiality: 'Low',
    priceMax: 'Highest',
    timeline: 'Longest',
    desc: 'Banker contacts everyone. Maximum competition, maximum price. But management distraction is real — every presentation is a day the CEO isn\'t running the business.',
  },
  {
    name: 'LIMITED AUCTION',
    buyers: '5-15',
    bestFor: '$100M-$500M EV',
    confidentiality: 'Medium',
    priceMax: 'High',
    timeline: 'Moderate',
    desc: 'Targeted outreach to qualified buyers only. Balances price maximization with confidentiality — the sweet spot for most middle-market deals.',
  },
  {
    name: 'TARGETED / BILATERAL',
    buyers: '2-5',
    bestFor: '$500M+ EV or strategic deals',
    confidentiality: 'High',
    priceMax: 'Moderate',
    timeline: 'Fastest',
    desc: 'Hand-picked buyers. Think Microsoft-LinkedIn scale deals. Speed and confidentiality matter more than squeezing every last dollar out of the process.',
  },
];

const AUCTION_SIGNALS: [string, string][] = [
  ['20+ NDAs sent simultaneously', 'Broad auction — you have many competitors'],
  ['"Indicative" timeline language', 'Targeted or bilateral — seller likely has a preference already'],
  ['Committed financing required in Round 1', 'Seller was burned before — treat as limited/targeted'],
  ['Management presentations for all Round 1 finalists', 'Broad auction with genuine competition'],
  ['Single process letter sent to you exclusively', 'Bilateral — you may have proprietary access'],
  ['Extremely tight Round 1 deadline (< 2 weeks)', 'Seller in distress or already has a stalking horse'],
];

const RED_FLAG_SECTIONS: RedFlagSection[] = [
  {
    doc: 'CIM',
    flags: [
      { flag: 'EBITDA adjustments exceed 15% of reported EBITDA', severity: 'HIGH', note: 'Aggressive normalization. Scrutinize every add-back — the seller is telling you the reported numbers aren\'t the real numbers.' },
      { flag: 'Customer concentration: top 3 customers > 40% revenue', severity: 'HIGH', note: 'Existential risk. If one walks post-close, your investment thesis evaporates overnight.' },
      { flag: 'Revenue growth in projections exceeds historical by 2x+', severity: 'MEDIUM', note: 'Hockey stick projections require hockey stick evidence. Ask: what specific contracts or channels drive this?' },
      { flag: 'No audited financials — management accounts only', severity: 'HIGH', note: 'Demand audits or price in a quality of earnings adjustment. Management-prepared numbers are often optimistic.' },
      { flag: 'Key man risk — founder owns 80%+ of relationships', severity: 'HIGH', note: 'The founder must stay, roll meaningful equity, and have a documented transition plan. Without this, you\'re buying a job, not a business.' },
    ],
  },
  {
    doc: 'PROCESS LETTER',
    flags: [
      { flag: 'Committed financing required in Round 1', severity: 'HIGH', note: 'Unusual and aggressive. Almost always means the seller or banker experienced a failed close in a prior process.' },
      { flag: '"Indicative timeline" instead of firm deadlines', severity: 'MEDIUM', note: 'Not a real auction. Someone is already preferred. The process exists to create the appearance of competition.' },
      { flag: 'Purchase Agreement markup required in Round 1', severity: 'HIGH', note: 'Seller wants speed. Heavy redlines will get you cut regardless of your price. Submit a clean markup or don\'t play.' },
      { flag: 'No management presentations offered', severity: 'HIGH', note: 'Major diligence gap. Could mean management isn\'t staying post-close, or the business can\'t withstand scrutiny under Q&A.' },
      { flag: 'Round 1 to Round 2 is less than 10 days', severity: 'MEDIUM', note: 'Build your model fast or walk away. You won\'t have time for real diligence between rounds.' },
    ],
  },
  {
    doc: 'MANAGEMENT PRESENTATION',
    flags: [
      { flag: 'CFO absent without explanation', severity: 'HIGH', note: 'Could signal CFO departure post-close, weak financial controls, or numbers that can\'t hold up to direct questioning.' },
      { flag: 'Management evasive on customer churn specifics', severity: 'HIGH', note: 'Push for cohort data. Vagueness on churn is always intentional — nobody forgets how many customers they lost.' },
      { flag: 'EBITDA bridge can\'t be reconciled to CIM', severity: 'HIGH', note: 'Full stop. Request formal reconciliation before submitting your final bid. If the numbers don\'t match, something is wrong.' },
      { flag: 'No clear management equity rollover plan', severity: 'MEDIUM', note: 'Aligned management is a value driver. If they don\'t want to roll equity, ask yourself why they wouldn\'t bet on their own company.' },
    ],
  },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    q: 'A Process Letter says "timeline is indicative and subject to change." What does this signal?',
    options: [
      'The seller is highly organized and flexible',
      'The seller has a preferred buyer — this process is partly theater',
      'The banker is inexperienced and hasn\'t set deadlines',
      'Buyers have extra time to prepare their bids',
    ],
    answer: 1,
    explain: 'Firm auctions have hard deadlines with no exceptions. Soft language means leverage already exists elsewhere — often a stalking horse bidder. The "auction" is creating competitive pressure that may not reflect reality.',
  },
  {
    q: 'In Round 2, Buyer A submits at $11.2M with 42 pages of PA redlines. Buyer B submits at $10.8M with 3 pages of minor redlines. Who typically wins?',
    options: [
      'Buyer A — price always wins in an auction',
      'Depends entirely on the seller\'s personal preference',
      'Buyer B — certainty of close often outweighs price spread',
      'Neither — the banker sends them both back to rebid',
    ],
    answer: 2,
    explain: 'Sellers weight certainty of close heavily. 42 pages of redlines signals the buyer will retrade in diligence, drag out closing, and possibly walk. A clean markup at a slightly lower price gets to the finish line — and that\'s worth real money.',
  },
  {
    q: 'The Process Letter requires committed financing in Round 1. What is the seller signaling?',
    options: [
      'They want the highest possible price and are being thorough',
      'They\'ve been burned by a buyer who couldn\'t close — they want proof of funds early',
      'This is standard practice in all well-run auctions',
      'They prefer strategic buyers over financial sponsors',
    ],
    answer: 1,
    explain: 'Requiring committed financing in Round 1 is unusual and aggressive. It almost always means the seller or their banker experienced a failed close in a prior process. They\'re prioritizing "can this buyer actually close?" over "who offers the highest number?"',
  },
  {
    q: 'The CFO is absent from the management presentation. What\'s the right move?',
    options: [
      'Proceed normally — CFO presence isn\'t required',
      'Flag it internally but submit your bid anyway',
      'Walk away immediately — the deal is poisoned',
      'Request a separate CFO meeting before submitting your final bid',
    ],
    answer: 3,
    explain: 'CFO absence is a major yellow flag. Could mean: CFO is leaving post-close, numbers can\'t withstand scrutiny, or financial controls are weak. The right move is to request a dedicated CFO session — if they refuse, that tells you everything.',
  },
  {
    q: 'You\'re in exclusivity and discover EBITDA adjustments the banker presented are aggressive — actual EBITDA is ~12% lower. What\'s the right move?',
    options: [
      'Retrade immediately — you have all the leverage now',
      'Walk away — the deal is fundamentally broken',
      'Evaluate: if it was misrepresentation in the CIM, renegotiate; if it\'s your own diligence finding, decide if the deal still works at the real number',
      'Accept it — retrading is never acceptable in PE',
    ],
    answer: 2,
    explain: 'Retrading without cause is deal-killing and reputation-damaging. But material misrepresentation in the CIM is valid grounds for renegotiation. The key is distinguishing between what was disclosed (your fault for missing it) vs. what was hidden (their fault for lying about it).',
  },
];

// ─── Tabs ───────────────────────────────────────────────────────────────

const tabs = [
  { id: 'timeline', label: 'The Deal Timeline', icon: '1' },
  { id: 'auction', label: 'Auction Types', icon: '2' },
  { id: 'redflags', label: 'Red Flag Detector', icon: '3' },
  { id: 'quiz', label: 'Quiz', icon: '4' },
];

// ─── Component ──────────────────────────────────────────────────────────

export function ProcessLetter() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // ─── Quiz Handlers ──────────────────────────────────────────────────

  function handleAnswer(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === QUIZ_QUESTIONS[quizIndex].answer) setScore(s => s + 1);
  }

  function nextQuestion() {
    if (quizIndex + 1 >= QUIZ_QUESTIONS.length) {
      setQuizDone(true);
    } else {
      setQuizIndex(q => q + 1);
      setSelected(null);
    }
  }

  function resetQuiz() {
    setQuizIndex(0);
    setSelected(null);
    setScore(0);
    setQuizDone(false);
  }

  // ─── CSV Export ─────────────────────────────────────────────────────

  function exportCSV() {
    const rows: string[] = [];
    rows.push('The Process Letter — PE Deal Auction Academy');
    rows.push('');
    rows.push('DEAL TIMELINE');
    rows.push('Stage,Timeline,Role,Description');
    STAGES.forEach(s => {
      rows.push(`"${s.label}","${s.day}","${s.role}","${s.description.replace(/"/g, '""')}"`);
    });
    rows.push('');
    rows.push('AUCTION TYPES');
    rows.push('Type,Buyer Count,Best For,Confidentiality,Price Potential,Timeline');
    AUCTION_TYPES.forEach(a => {
      rows.push(`"${a.name}","${a.buyers}","${a.bestFor}","${a.confidentiality}","${a.priceMax}","${a.timeline}"`);
    });
    rows.push('');
    rows.push('RED FLAGS BY DOCUMENT');
    RED_FLAG_SECTIONS.forEach(section => {
      rows.push(`"${section.doc}"`);
      rows.push('Flag,Severity,Note');
      section.flags.forEach(f => {
        rows.push(`"${f.flag}","${f.severity}","${f.note.replace(/"/g, '""')}"`);
      });
      rows.push('');
    });
    rows.push('QUIZ RESULTS');
    rows.push(`Score,${score}/${QUIZ_QUESTIONS.length}`);

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'process-letter-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ─── Render ─────────────────────────────────────────────────────────

  const currentStage = STAGES.find(s => s.id === activeStage);
  const q = QUIZ_QUESTIONS[quizIndex];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border/40 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              activeTab === tab.id ? 'bg-primary-foreground/20' : 'bg-muted'
            }`}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB 1: DEAL TIMELINE ──────────────────────────────────────── */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Intro */}
          <div className="bg-card border border-border/40 rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-3">How a PE Deal Auction Actually Works</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              When a company goes to market, the banker doesn't just call buyers and say "make an offer." They run a structured process designed to maximize price through controlled competition. Every buyer thinks there are seven serious competitors behind them — that pressure is by design.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Click any stage below to see what happens, what documents are involved, what a smart buyer does, and what red flags to watch for.
            </p>
          </div>

          {/* Timeline Nodes */}
          <div className="relative">
            {/* Connector Line */}
            <div className="absolute top-7 left-8 right-8 h-0.5 bg-gradient-to-r from-border/20 via-primary/30 to-border/20 z-0" />

            <div className="flex justify-between relative z-10 overflow-x-auto pb-2">
              {STAGES.map((stage, i) => {
                const isActive = activeStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(isActive ? null : stage.id)}
                    className="flex flex-col items-center min-w-[80px] group transition-all"
                  >
                    <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'border-primary bg-primary/20 text-primary scale-110'
                        : 'border-border/40 bg-card text-muted-foreground group-hover:border-primary/50 group-hover:scale-105'
                    }`}>
                      {i + 1}
                    </div>
                    <span className={`text-[10px] mt-2 text-center max-w-[72px] leading-tight ${
                      isActive ? 'text-primary font-semibold' : 'text-muted-foreground/60'
                    }`}>
                      {stage.label}
                    </span>
                    <span className="text-[9px] text-muted-foreground/40 mt-0.5">{stage.day}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expanded Stage Detail */}
          {currentStage ? (
            <div className="bg-card border border-primary/30 rounded-lg p-6 border-l-4 border-l-primary">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{currentStage.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{currentStage.role}</p>
                </div>
                <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded">
                  {currentStage.day}
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{currentStage.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Document Contains */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-3 font-semibold">
                    What's In This Document
                  </h4>
                  <div className="space-y-2">
                    {currentStage.details.map((d, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buyer Action */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-3 font-semibold">
                    Your Move as Buyer
                  </h4>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="text-sm text-green-400/90 leading-relaxed">{currentStage.buyerAction}</p>
                  </div>
                </div>
              </div>

              {/* Red Flags */}
              {currentStage.redFlags.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-red-400/60 mb-3 font-semibold">
                    Red Flags at This Stage
                  </h4>
                  <div className="space-y-2">
                    {currentStage.redFlags.map((rf, i) => (
                      <div key={i} className="border-l-2 border-red-500/50 bg-red-500/5 px-3 py-2 rounded-r text-sm text-red-400/80">
                        {rf}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground/40 text-sm">
              Select a stage above to explore
            </div>
          )}

          {/* Key Insight */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
            <h4 className="text-sm font-bold text-primary mb-2">The Banker's Real Job</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Process Letter creates simultaneous deadlines across all buyers. This prevents anyone from going slow, building relationship leverage, or getting proprietary access. Every buyer thinks there are seven serious competitors behind them. That tension — real or manufactured — is what drives price. A good buyer's team reads the Process Letter once for content and twice for subtext.
            </p>
          </div>
        </div>
      )}

      {/* ─── TAB 2: AUCTION TYPES ──────────────────────────────────────── */}
      {activeTab === 'auction' && (
        <div className="space-y-6">
          <div className="bg-card border border-border/40 rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-3">Three Types of Auctions</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Process Letter's tone and structure reveal which type of auction you're in. Each has different strategy implications — and experienced buyers read the signals immediately.
            </p>
          </div>

          {/* Auction Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AUCTION_TYPES.map((at, idx) => {
              const colors = ['text-yellow-400 border-yellow-500/30 bg-yellow-500/5', 'text-green-400 border-green-500/30 bg-green-500/5', 'text-purple-400 border-purple-500/30 bg-purple-500/5'];
              const headerColors = ['text-yellow-400', 'text-green-400', 'text-purple-400'];
              const accentBg = ['bg-yellow-500/10', 'bg-green-500/10', 'bg-purple-500/10'];
              return (
                <div key={at.name} className={`bg-card border rounded-lg p-5 ${colors[idx].split(' ').slice(1).join(' ')} border-t-2`}>
                  <h4 className={`text-base font-bold mb-3 ${headerColors[idx]}`}>{at.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{at.desc}</p>
                  <div className="space-y-2">
                    {([
                      ['Buyer Count', at.buyers],
                      ['Best For', at.bestFor],
                      ['Confidentiality', at.confidentiality],
                      ['Price Potential', at.priceMax],
                      ['Timeline', at.timeline],
                    ] as [string, string][]).map(([label, val]) => (
                      <div key={label} className="flex justify-between border-b border-border/20 pb-1.5 text-xs">
                        <span className="text-muted-foreground/50">{label}</span>
                        <span className={`font-medium ${headerColors[idx]}/80`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Signal Decoder */}
          <div className="bg-card border border-border/40 rounded-lg p-6">
            <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">
              How to Read Auction Type from the Process Letter
            </h4>
            <div className="space-y-0">
              {AUCTION_SIGNALS.map(([signal, meaning], i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border/20 py-3">
                  <div className="text-sm text-muted-foreground italic">"{signal}"</div>
                  <div className="text-sm text-white/60">
                    <span className="text-muted-foreground/40 mr-2">→</span>{meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bid Strategy Insight */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
            <h4 className="text-sm font-bold text-primary mb-2">Strategic Takeaway</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The objective in any M&A auction is to win by the smallest margin possible. A skilled investment banker will use the buyer's accumulated time and diligence investment against them to drive price up. Understanding what type of auction you're in — before you submit your first bid — determines your entire strategy.
            </p>
          </div>
        </div>
      )}

      {/* ─── TAB 3: RED FLAG DETECTOR ──────────────────────────────────── */}
      {activeTab === 'redflags' && (
        <div className="space-y-6">
          <div className="bg-card border border-border/40 rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-3">Red Flag Detector</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every document in a deal process has embedded signals. Experienced PE buyers read between the lines — what's missing is often more important than what's included. Here are the critical flags organized by document type.
            </p>
          </div>

          {RED_FLAG_SECTIONS.map((section, sIdx) => {
            const sectionColors = [
              { border: 'border-green-500/30', header: 'text-green-400', flagBorder: 'border-l-green-500/40', flagBg: 'bg-green-500/5' },
              { border: 'border-yellow-500/30', header: 'text-yellow-400', flagBorder: 'border-l-yellow-500/40', flagBg: 'bg-yellow-500/5' },
              { border: 'border-purple-500/30', header: 'text-purple-400', flagBorder: 'border-l-purple-500/40', flagBg: 'bg-purple-500/5' },
            ];
            const colors = sectionColors[sIdx];

            return (
              <div key={section.doc} className={`bg-card border ${colors.border} rounded-lg p-6 border-l-4`}>
                <h4 className={`text-base font-bold ${colors.header} mb-4 uppercase tracking-wider`}>
                  {section.doc} Red Flags
                </h4>
                <div className="space-y-3">
                  {section.flags.map((f, i) => (
                    <div key={i} className="border-b border-border/20 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-red-400/60 text-sm">&#9873;</span>
                            <span className="text-sm text-foreground/90">{f.flag}</span>
                          </div>
                          <p className="text-xs text-muted-foreground/70 italic ml-5 leading-relaxed">{f.note}</p>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded flex-shrink-0 font-semibold tracking-wider ${
                          f.severity === 'HIGH'
                            ? 'bg-red-500/10 text-red-400/80'
                            : 'bg-yellow-500/10 text-yellow-400/80'
                        }`}>
                          {f.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Bottom Insight */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-5">
            <h4 className="text-sm font-bold text-red-400/80 mb-2">The Rule of Red Flags</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              One red flag is a question. Two red flags is a pattern. Three red flags in the same document is a deal you should walk from — or price so aggressively that the risk is compensated. The most expensive deals in PE are the ones where buyers saw the flags and bid anyway.
            </p>
          </div>
        </div>
      )}

      {/* ─── TAB 4: QUIZ ───────────────────────────────────────────────── */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {!quizDone ? (
            <>
              {/* Progress */}
              <div className="flex justify-between text-xs text-muted-foreground/60">
                <span>Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                <span className="text-primary">Score: {score}/{quizIndex + (selected !== null ? 1 : 0)}</span>
              </div>

              {/* Question Card */}
              <div className="bg-card border border-border/40 rounded-lg p-6">
                <p className="text-base text-foreground leading-relaxed mb-6">{q.q}</p>

                <div className="space-y-2">
                  {q.options.map((opt, i) => {
                    let styles = 'bg-card border border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground';
                    if (selected !== null) {
                      if (i === q.answer) {
                        styles = 'bg-green-500/10 border border-green-500/40 text-green-400';
                      } else if (i === selected && selected !== q.answer) {
                        styles = 'bg-red-500/10 border border-red-500/40 text-red-400';
                      } else {
                        styles = 'bg-card border border-border/20 text-muted-foreground/40';
                      }
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={selected !== null}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${styles} ${selected !== null ? '' : 'cursor-pointer'}`}
                      >
                        <span className="text-muted-foreground/40 mr-3">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {selected !== null && (
                  <div className={`mt-4 p-4 rounded-lg text-sm leading-relaxed ${
                    selected === q.answer
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400/90'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400/90'
                  }`}>
                    <span className="font-bold">
                      {selected === q.answer ? 'Correct' : 'Incorrect'}
                      {' — '}
                    </span>
                    {q.explain}
                  </div>
                )}
              </div>

              {/* Next Button */}
              {selected !== null && (
                <button
                  onClick={nextQuestion}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
                >
                  {quizIndex + 1 < QUIZ_QUESTIONS.length ? 'Next Question' : 'See Results'}
                </button>
              )}
            </>
          ) : (
            /* Quiz Results */
            <div className="text-center space-y-6">
              <div className="bg-card border border-border/40 rounded-lg p-8">
                <div className="text-5xl font-bold text-primary mb-3">{score}/{QUIZ_QUESTIONS.length}</div>
                <p className="text-sm text-muted-foreground mb-6">
                  {score === QUIZ_QUESTIONS.length
                    ? 'Deal Principal Level — You read process letters like a banker.'
                    : score >= 3
                    ? 'Associate Level — Solid fundamentals. Study the red flags tab to sharpen your edge.'
                    : 'Analyst Level — Review the timeline and auction types, then retake the quiz.'}
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={resetQuiz}
                    className="border border-primary/40 text-primary px-5 py-2 rounded-lg text-sm hover:bg-primary/10 transition-all"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={exportCSV}
                    className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm hover:bg-primary/90 transition-all"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sources Footer */}
      <div className="mt-10 pt-4 border-t border-border/20 text-center">
        <p className="text-[10px] text-muted-foreground/30 tracking-widest uppercase">
          Sources: ASimpleModel.com &middot; WallStreetPrep.com &middot; StreetOfWalls.com &middot; SellSideHandbook.com &middot; FinancialEdge.com
        </p>
      </div>
    </div>
  );
}
