import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Gavel, Users, TrendingUp, Shield, AlertTriangle, CheckCircle2,
  ChevronRight, ChevronLeft, Download, BookOpen, FileText,
  Lightbulb, DollarSign, Clock, Target, Zap,
  ArrowRight, ArrowUp, XCircle, BarChart3, Lock
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────

interface ProcessStage {
  id: string;
  name: string;
  timeline: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  whatHappens: string;
  sellerRole: string;
  bankerRole: string;
  keyDocuments: string[];
  commonMistake: string;
  proTip: string;
}

interface BidderScenario {
  bidders: number;
  label: string;
  leverage: string;
  typicalOutcome: string;
  priceImpact: string;
  color: string;
}

interface BankerMistake {
  id: string;
  mistake: string;
  consequence: string;
  whatToDoInstead: string;
  costRange: string;
}

interface ReadinessQuestion {
  id: string;
  category: string;
  question: string;
  whyItMatters: string;
}

interface ReadinessAnswers {
  [questionId: string]: 'yes' | 'no' | null;
}

// ── Process Stages ──────────────────────────────────────────────

const processStages: ProcessStage[] = [
  {
    id: 'preparation',
    name: 'Preparation',
    timeline: '6-12 months before launch',
    icon: <Target className="w-6 h-6" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    whatHappens: 'You get your house in order before anyone knows you\'re selling. Financial clean-up, sell-side QoE, management team assessment, value creation story development. This is the work that separates $40M exits from $55M exits.',
    sellerRole: 'Clean up financials, document add-backs, prepare management team, run sell-side Quality of Earnings, fix any known issues.',
    bankerRole: 'Evaluates your business, identifies value drivers and risks, develops the positioning strategy, creates the marketing timeline.',
    keyDocuments: ['Sell-side QoE report', 'Management presentation draft', 'Financial model', 'Data room (initial population)'],
    commonMistake: 'Skipping the sell-side QoE. If you don\'t know what a buyer\'s accountants will find, you\'re walking into an ambush. Every surprise they find costs you 5-7x in purchase price.',
    proTip: 'Start 12-18 months early. The businesses that sell for top dollar are the ones that look like they weren\'t trying to sell — because the cleanup happened long before the process launched.'
  },
  {
    id: 'marketing',
    name: 'Buyer Outreach',
    timeline: 'Weeks 1-4 of active process',
    icon: <Users className="w-6 h-6" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    whatHappens: 'Your banker contacts 50-150 potential buyers with a one-page anonymous teaser. Interested parties sign an NDA and receive the Confidential Information Memorandum (CIM). The goal: get 15-25 parties to the table.',
    sellerRole: 'Approve the buyer list, review the CIM for accuracy, sign off on the teaser. Stay focused on running your business — your performance during the process is being watched.',
    bankerRole: 'Manages all buyer communication, distributes teasers and CIMs, tracks engagement, answers buyer questions, creates competitive tension by managing information flow.',
    keyDocuments: ['Anonymous teaser (1-page)', 'Confidential Information Memorandum (CIM)', 'Process letter with timeline', 'NDA (template)'],
    commonMistake: 'Contacting buyers directly or letting word leak. Once the market knows you\'re selling, every customer, employee, and competitor adjusts their behavior. Information control is everything.',
    proTip: 'The more parties who see the teaser, the better. Broad outreach creates the competitive tension that drives price. Don\'t let your banker narrow the list too early.'
  },
  {
    id: 'ioi',
    name: 'First Round Bids (IOIs)',
    timeline: 'Weeks 4-6',
    icon: <FileText className="w-6 h-6" />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    whatHappens: 'Buyers submit Indications of Interest — non-binding letters with a valuation range, transaction structure, and timeline. You typically get 5-10 IOIs from 15-25 interested parties. Your banker helps you shortlist to 3-5 for the next round.',
    sellerRole: 'Review IOIs with your banker and M&A attorney. Don\'t just look at the highest number — evaluate certainty of close, structural terms, and the buyer\'s track record.',
    bankerRole: 'Collects and organizes IOIs, creates a comparison matrix, recommends which buyers to advance, communicates decisions to all parties.',
    keyDocuments: ['IOI comparison matrix', 'Buyer evaluation criteria', 'Short-list rationale'],
    commonMistake: 'Picking the highest IOI without considering conditionality. A $50M IOI "subject to financing and board approval" is worth less than a $43M IOI from a buyer with committed capital and a clean track record.',
    proTip: 'Keep 4-5 parties in the process, not 2-3. The extra competition is worth more than the extra management time. Every additional credible bidder adds 3-5% to the final price.'
  },
  {
    id: 'management-meetings',
    name: 'Management Presentations',
    timeline: 'Weeks 6-8',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    whatHappens: 'Shortlisted buyers visit your office for a deep-dive presentation. They meet the management team, tour the facility, and ask tough questions. This is where buyers form their real opinion of the business.',
    sellerRole: 'Present the business, answer questions honestly, showcase the management team. This is your interview — buyers are evaluating YOU as much as the numbers.',
    bankerRole: 'Coaches the management team on presentation, prepares anticipated Q&A, manages scheduling, debriefs after each meeting.',
    keyDocuments: ['Management presentation (pitch deck)', 'Facility tour agenda', 'Q&A preparation document', 'Customer reference list'],
    commonMistake: 'Over-relying on the owner to present everything. PE buyers want to see a management team that can run the business without the owner. Let your managers shine.',
    proTip: 'Practice the presentation 3-5 times. Rehearse the tough questions: customer concentration, owner dependence, competitive threats, margin trends. The management meeting is where deals are won or lost.'
  },
  {
    id: 'final-bids',
    name: 'Final Bids & LOI',
    timeline: 'Weeks 8-10',
    icon: <Gavel className="w-6 h-6" />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    whatHappens: 'Remaining buyers submit binding or near-binding final bids. These include a specific price (not a range), deal structure, financing details, and timeline. You select a winner and sign a Letter of Intent, which typically includes an exclusivity period.',
    sellerRole: 'Compare final bids on price, structure, certainty, speed, and cultural fit. Select the winner with your banker and attorney. Negotiate the LOI terms before signing.',
    bankerRole: 'Creates final bid comparison, negotiates LOI terms, manages competitive tension through the final round, advises on buyer selection.',
    keyDocuments: ['Final bid letters', 'LOI (Letter of Intent)', 'Bid comparison matrix', 'Working capital methodology'],
    commonMistake: 'Accepting an LOI without negotiating working capital methodology, escrow terms, and exclusivity length. These "details" represent millions of dollars.',
    proTip: 'Keep your runner-up warm even after signing the LOI. If your selected buyer tries to re-trade during diligence, having a credible Plan B is the only thing that protects you.'
  },
  {
    id: 'due-diligence',
    name: 'Due Diligence',
    timeline: 'Weeks 10-16',
    icon: <Shield className="w-6 h-6" />,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    whatHappens: 'The buyer\'s team — accountants, lawyers, consultants — digs into every aspect of your business. Financial, legal, commercial, operational, HR, IT, environmental. They\'re not just checking boxes; they\'re building a case for adjustments.',
    sellerRole: 'Respond to information requests quickly and accurately. Organize your data room. Be available for calls. Don\'t hide anything — it always comes out worse later.',
    bankerRole: 'Manages the diligence process and timeline, pushes back on unreasonable requests, escalates issues, keeps the deal on track.',
    keyDocuments: ['Data room (fully populated)', 'Diligence request lists', 'QoE working papers', 'Legal diligence materials'],
    commonMistake: 'Treating diligence as collaborative. It\'s adversarial. The buyer\'s QoE team is looking for reasons to adjust the price downward. Every document you provide is ammunition.',
    proTip: 'If you ran a sell-side QoE, you already know what the buyer will find. No surprises means no re-trades. The $50-100K you spent on your own QoE saves $500K-$2M in price adjustments.'
  },
  {
    id: 'definitive-docs',
    name: 'Definitive Agreement',
    timeline: 'Weeks 14-18',
    icon: <Lock className="w-6 h-6" />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    whatHappens: 'Lawyers draft the purchase agreement — the binding contract that governs the sale. This is where escrow, reps & warranties, indemnification, working capital mechanics, and earnout terms are negotiated in excruciating detail.',
    sellerRole: 'Work closely with your M&A attorney (not your regular business attorney). Review every clause. Understand what you\'re signing. Push back on terms that shift risk to you.',
    bankerRole: 'Keeps negotiations moving, mediates business-point disputes, ensures legal negotiations don\'t derail the deal.',
    keyDocuments: ['Purchase agreement (SPA/APA)', 'Disclosure schedules', 'Employment/consulting agreements', 'Non-compete agreements'],
    commonMistake: 'Using your regular business attorney instead of an M&A specialist. A generalist attorney will miss clauses that an experienced M&A attorney catches — and those clauses are worth millions.',
    proTip: 'The purchase agreement is where the real deal happens. The LOI price means nothing if the legal terms shift $3M of risk back to you through escrow, indemnification, and working capital adjustments.'
  },
  {
    id: 'closing',
    name: 'Closing',
    timeline: 'Week 18-20',
    icon: <CheckCircle2 className="w-6 h-6" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    whatHappens: 'Final conditions are satisfied, funds are wired, documents are signed. You receive the purchase price minus escrow holdback and any working capital adjustment. The transition period begins.',
    sellerRole: 'Satisfy closing conditions, execute final documents, begin transition. Expect a working capital true-up 60-90 days after close.',
    bankerRole: 'Coordinates the closing checklist, ensures all parties are aligned, manages the funds flow process.',
    keyDocuments: ['Closing checklist', 'Funds flow memo', 'Working capital estimate', 'Transition services agreement'],
    commonMistake: 'Celebrating before the working capital true-up. The buyer\'s accountants will deliver a closing working capital statement 60-90 days post-close. If it comes in below the peg, you owe them the difference.',
    proTip: 'Negotiate the working capital calculation methodology BEFORE closing, not after. Agree on which line items are included, excluded, and how inventory is valued.'
  }
];

// ── Bidder Scenarios ────────────────────────────────────────────

const bidderScenarios: BidderScenario[] = [
  {
    bidders: 1,
    label: 'Single Buyer',
    leverage: 'Buyer has ALL the leverage',
    typicalOutcome: 'Below-market price, aggressive terms, long exclusivity, frequent re-trades. The buyer knows you have no alternative.',
    priceImpact: '-15% to -25% vs. market',
    color: 'text-red-400'
  },
  {
    bidders: 2,
    label: 'Two Bidders',
    leverage: 'Buyer has most of the leverage',
    typicalOutcome: 'Slightly better price, but the buyer knows their only competition is one other party. If one drops out, you\'re back to a single buyer.',
    priceImpact: '-5% to -15% vs. market',
    color: 'text-orange-400'
  },
  {
    bidders: 3,
    label: 'Three Bidders',
    leverage: 'Balanced — the tipping point',
    typicalOutcome: 'Real competitive tension begins. Buyers know they can lose. Each bidder has to put their best foot forward because losing is a real possibility.',
    priceImpact: 'Market price',
    color: 'text-yellow-400'
  },
  {
    bidders: 5,
    label: 'Five+ Bidders',
    leverage: 'Seller has meaningful leverage',
    typicalOutcome: 'Premium pricing, cleaner terms, shorter exclusivity. Buyers compete on structure as well as price. You can negotiate from strength.',
    priceImpact: '+5% to +15% above market',
    color: 'text-green-400'
  },
  {
    bidders: 8,
    label: 'Eight+ Bidders',
    leverage: 'Seller has maximum leverage',
    typicalOutcome: 'Auction dynamics in full effect. FOMO drives aggressive bidding. Buyers waive conditions, shorten timelines, and stretch on price. This is where top-of-market deals happen.',
    priceImpact: '+10% to +25% above market',
    color: 'text-emerald-400'
  }
];

// ── Common Mistakes (Not Using a Banker) ────────────────────────

const bankerMistakes: BankerMistake[] = [
  {
    id: 'direct-approach',
    mistake: '"I know a guy at a PE fund — I\'ll just call him directly"',
    consequence: 'You\'ve just given one buyer all the leverage. They know there\'s no competitive process. Every negotiation from here favors them because you can\'t credibly threaten to walk to another offer.',
    whatToDoInstead: 'Even if you have a relationship with a buyer, run a competitive process through a banker. Let your contact participate — but alongside 4-5 other serious bidders.',
    costRange: '$2M-$5M in lost value'
  },
  {
    id: 'skip-banker',
    mistake: '"Bankers take 1-3% — I\'ll save that fee by selling myself"',
    consequence: 'The banker\'s fee is typically 1.5-2.5% of deal value. The competitive process they run typically increases the price by 10-25%. On a $40M deal, you "save" $800K in fees and lose $4-8M in price.',
    whatToDoInstead: 'Think of the banker fee as an investment, not a cost. The math is simple: pay $800K, get back $4M+ in higher price, better terms, and fewer re-trades.',
    costRange: '$4M-$10M in lost value'
  },
  {
    id: 'leak-info',
    mistake: '"I told my biggest customer we might be selling"',
    consequence: 'Customer starts hedging, looking at competitors. Word reaches employees — your top people start interviewing elsewhere. Competitors smell blood. Your EBITDA drops during the process, and so does your price.',
    whatToDoInstead: 'Information control is your banker\'s job. Nobody — not customers, employees, vendors, or competitors — should know until you choose to tell them, at the right time, in the right way.',
    costRange: '$1M-$3M in lost value'
  },
  {
    id: 'no-deadline',
    mistake: '"Take your time — there\'s no rush"',
    consequence: 'Without a deadline, buyers stall. They run parallel processes. They wait for your financials to soften. Time kills deals — and every month the process drags adds risk and costs you leverage.',
    whatToDoInstead: 'A structured process has clear deadlines: IOIs due by X date, final bids by Y date, closing by Z date. Urgency is a feature, not a bug. It forces buyers to act decisively.',
    costRange: '$500K-$2M in deal fatigue costs'
  },
  {
    id: 'accept-first',
    mistake: '"The first offer was really good — let\'s just take it"',
    consequence: 'You have no idea if it\'s good because you have nothing to compare it to. The first offer in a well-run process is almost NEVER the best offer. Competitive pressure from other bidders drives the price up 10-25%.',
    whatToDoInstead: 'Run the full process. Even if the first offer feels generous, letting other bidders compete will either confirm the price is fair or push it higher. You can always go back to buyer #1.',
    costRange: '$3M-$8M in unrealized value'
  }
];

// ── Readiness Assessment Questions ──────────────────────────────

const readinessQuestions: ReadinessQuestion[] = [
  // Process Readiness
  { id: 'q1', category: 'Process Setup', question: 'Do you have an investment banker or M&A advisor engaged?', whyItMatters: 'Without a banker, you\'re bringing a knife to a gunfight. They create the competitive process that drives premium pricing.' },
  { id: 'q2', category: 'Process Setup', question: 'Have you identified at least 20 potential buyers (strategic and financial)?', whyItMatters: 'A broad buyer universe increases the chances of finding the right buyer at the right price. Narrow lists produce narrow outcomes.' },
  { id: 'q3', category: 'Process Setup', question: 'Is your CIM (or draft) complete and ready for distribution?', whyItMatters: 'The CIM is your sales pitch. A weak CIM means weak interest. A strong CIM gets more parties to the table.' },
  { id: 'q4', category: 'Process Setup', question: 'Do you have an anonymous teaser prepared?', whyItMatters: 'The teaser is the first thing buyers see. It needs to create interest without revealing your identity.' },

  // Financial Readiness
  { id: 'q5', category: 'Financial Readiness', question: 'Have you completed a sell-side Quality of Earnings (QoE) report?', whyItMatters: 'A sell-side QoE eliminates surprises during buyer diligence. Every surprise the buyer finds is a re-trade opportunity that costs you 5-7x.' },
  { id: 'q6', category: 'Financial Readiness', question: 'Are your financial statements for the last 3 years audited or reviewed?', whyItMatters: 'Unaudited financials create uncertainty. Uncertainty equals discount. Audited statements give buyers confidence and reduce diligence friction.' },
  { id: 'q7', category: 'Financial Readiness', question: 'Can you clearly explain every add-back to EBITDA with documentation?', whyItMatters: 'Undocumented add-backs get rejected. Every rejected add-back reduces EBITDA, and every dollar of EBITDA is worth 5-10x in purchase price.' },
  { id: 'q8', category: 'Financial Readiness', question: 'Do you know your normalized working capital number?', whyItMatters: 'If you don\'t know your working capital peg, the buyer will set it — and they\'ll set it in their favor. This single number can swing $500K-$2M at closing.' },

  // Team & Operations
  { id: 'q9', category: 'Team & Operations', question: 'Can your business run for 6 months without you being involved day-to-day?', whyItMatters: 'Owner-dependent businesses get discounted 15-25%. PE buyers need the business to survive the transition. If it can\'t run without you, the risk premium crushes your valuation.' },
  { id: 'q10', category: 'Team & Operations', question: 'Is your management team prepared and coached for buyer meetings?', whyItMatters: 'A strong management presentation can add 1-2x to your multiple. A weak one raises questions about post-close execution and kills buyer enthusiasm.' },
  { id: 'q11', category: 'Team & Operations', question: 'Are key employees locked in with retention agreements or incentives?', whyItMatters: 'If key people leave during the process, the deal dies or the price drops. Retention agreements are insurance against the most predictable risk in any deal.' },

  // Legal & Data Room
  { id: 'q12', category: 'Legal & Data Room', question: 'Do you have an experienced M&A attorney (not your regular business attorney)?', whyItMatters: 'M&A attorneys catch clauses that generalists miss. The wrong escrow structure, indemnification terms, or rep language can cost you millions post-close.' },
  { id: 'q13', category: 'Legal & Data Room', question: 'Is your data room organized and populated with key documents?', whyItMatters: 'A well-organized data room signals professionalism and reduces diligence timelines. A messy data room signals risk and gives buyers ammunition to delay and renegotiate.' },
  { id: 'q14', category: 'Legal & Data Room', question: 'Have you reviewed all material contracts for change-of-control clauses?', whyItMatters: 'If a key customer or vendor contract has a change-of-control clause, the buyer will use it as leverage. Know about these before the buyer does.' },

  // Mindset
  { id: 'q15', category: 'Seller Mindset', question: 'Have you defined your walk-away price — the minimum you\'ll accept?', whyItMatters: 'Without a clear walk-away number, you\'ll rationalize accepting a bad deal. Set your floor before emotions take over during negotiations.' },
  { id: 'q16', category: 'Seller Mindset', question: 'Are you emotionally prepared for a 6-12 month process with setbacks?', whyItMatters: 'Deal fatigue is real. Sellers who aren\'t emotionally prepared make bad decisions in month 5 — accepting re-trades, skipping negotiations, just wanting it to be over.' },
  { id: 'q17', category: 'Seller Mindset', question: 'Are you committed to running the business at full performance during the sale process?', whyItMatters: 'Business performance during the process is under a microscope. Any dip in revenue or margins during diligence gives the buyer ammunition to reduce the price.' },
];

// ── Main Component ──────────────────────────────────────────────

export const TheAuction: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedStage, setExpandedStage] = useState<string | null>('preparation');
  const [answers, setAnswers] = useState<ReadinessAnswers>({});
  const [showReport, setShowReport] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('the-auction-v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.activeTab !== undefined) setActiveTab(parsed.activeTab);
      } catch (e) {}
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('the-auction-v1', JSON.stringify({ answers, activeTab }));
  }, [answers, activeTab]);

  const tabs = [
    { name: 'Why Process Wins', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'The 8 Stages', icon: <Target className="w-4 h-4" /> },
    { name: 'Process Readiness Check', icon: <Shield className="w-4 h-4" /> },
    { name: 'Your Report', icon: <FileText className="w-4 h-4" /> }
  ];

  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const totalQuestions = readinessQuestions.length;

  const handleAnswer = (questionId: string, value: 'yes' | 'no') => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: prev[questionId] === value ? null : value
    }));
  };

  // ── Scoring Logic ─────────────────────────────────────────────

  const getScore = () => {
    let ready = 0;
    let notReady = 0;
    let unanswered = 0;

    readinessQuestions.forEach(q => {
      const answer = answers[q.id];
      if (answer === 'yes') ready++;
      else if (answer === 'no') notReady++;
      else unanswered++;
    });

    const pct = totalQuestions > 0 ? Math.round((ready / totalQuestions) * 100) : 0;

    let verdict = '';
    let verdictColor = '';
    let verdictBg = '';

    if (pct >= 85) {
      verdict = 'Ready to Launch';
      verdictColor = 'text-emerald-400';
      verdictBg = 'bg-emerald-500/10 border-emerald-500/20';
    } else if (pct >= 65) {
      verdict = 'Almost Ready';
      verdictColor = 'text-green-400';
      verdictBg = 'bg-green-500/10 border-green-500/20';
    } else if (pct >= 45) {
      verdict = 'Needs Work';
      verdictColor = 'text-yellow-400';
      verdictBg = 'bg-yellow-500/10 border-yellow-500/20';
    } else if (pct >= 25) {
      verdict = 'Significant Gaps';
      verdictColor = 'text-orange-400';
      verdictBg = 'bg-orange-500/10 border-orange-500/20';
    } else {
      verdict = 'Not Ready';
      verdictColor = 'text-red-400';
      verdictBg = 'bg-red-500/10 border-red-500/20';
    }

    return { ready, notReady, unanswered, pct, verdict, verdictColor, verdictBg };
  };

  const getCategoryScore = (category: string) => {
    const catQuestions = readinessQuestions.filter(q => q.category === category);
    const yesCount = catQuestions.filter(q => answers[q.id] === 'yes').length;
    return { yes: yesCount, total: catQuestions.length, pct: Math.round((yesCount / catQuestions.length) * 100) };
  };

  const categories = [...new Set(readinessQuestions.map(q => q.category))];

  // ── CSV Export ────────────────────────────────────────────────

  const exportCSV = () => {
    const score = getScore();
    const lines: string[] = [
      'PE Ready Plus - The Auction: Process Readiness Report',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      'OVERALL ASSESSMENT',
      `Verdict: ${score.verdict}`,
      `Score: ${score.pct}% (${score.ready} of ${totalQuestions} ready)`,
      `Items Not Ready: ${score.notReady}`,
      `Items Unanswered: ${score.unanswered}`,
      '',
      'CATEGORY BREAKDOWN',
    ];

    categories.forEach(cat => {
      const catScore = getCategoryScore(cat);
      lines.push(`${cat}: ${catScore.pct}% (${catScore.yes}/${catScore.total})`);
    });

    lines.push('', 'DETAILED RESPONSES', 'Category,Question,Answer,Why It Matters');
    readinessQuestions.forEach(q => {
      const answer = answers[q.id] || 'unanswered';
      lines.push(`"${q.category}","${q.question}","${answer}","${q.whyItMatters}"`);
    });

    lines.push('', 'GAPS TO ADDRESS');
    readinessQuestions.filter(q => answers[q.id] === 'no').forEach(q => {
      lines.push(`"${q.category}","${q.question}","${q.whyItMatters}"`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auction-readiness-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Tab 1: Why Process Wins ───────────────────────────────────

  const renderWhyProcessWins = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* The Core Truth */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Gavel className="w-6 h-6 text-amber-400" />
            The #1 Rule of Selling a Business
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-6 text-center">
            <p className="text-2xl font-bold text-amber-400 mb-2">
              Never Negotiate With One Buyer
            </p>
            <p className="text-muted-foreground">
              A single buyer has all the leverage. A competitive process — where 3-5+ qualified bidders compete —
              is the ONLY way to get top-of-market pricing and protect yourself from re-trades.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-400">10-25%</p>
              <p className="text-sm text-muted-foreground mt-1">Higher price from competitive process vs. single buyer</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">60-70%</p>
              <p className="text-sm text-muted-foreground mt-1">Of deals without a banker get re-traded during diligence</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-purple-400">3-5x</p>
              <p className="text-sm text-muted-foreground mt-1">ROI on investment banker fees from higher sale price</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bidder Count = Leverage */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            More Bidders = More Money
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            The number of credible bidders in your process is the single biggest driver of your final price.
            Here's what each scenario looks like:
          </p>
          <div className="space-y-4">
            {bidderScenarios.map((scenario) => (
              <div key={scenario.bidders} className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(scenario.bidders, 8) }).map((_, i) => (
                        <Users key={i} className={`w-4 h-4 ${scenario.color}`} />
                      ))}
                    </div>
                    <span className="font-semibold text-foreground">{scenario.label}</span>
                  </div>
                  <Badge className={`${scenario.color} bg-transparent border-current`}>
                    {scenario.priceImpact}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  <span className="font-medium text-foreground">Leverage:</span> {scenario.leverage}
                </p>
                <p className="text-sm text-muted-foreground">{scenario.typicalOutcome}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* The 5 Mistakes */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            5 Mistakes That Cost Sellers Millions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {bankerMistakes.map((mistake, idx) => (
            <div key={mistake.id} className="bg-muted/30 rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setExpandedStage(expandedStage === mistake.id ? null : mistake.id)}
                className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 font-bold text-lg mt-0.5">#{idx + 1}</span>
                    <div>
                      <p className="font-semibold text-foreground">{mistake.mistake}</p>
                      <p className="text-sm text-red-400 mt-1">Typical cost: {mistake.costRange}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedStage === mistake.id ? 'rotate-90' : ''}`} />
                </div>
              </button>
              {expandedStage === mistake.id && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                  <div>
                    <p className="text-sm font-medium text-red-400 mb-1">What happens:</p>
                    <p className="text-sm text-muted-foreground">{mistake.consequence}</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-400 mb-1">What to do instead:</p>
                    <p className="text-sm text-muted-foreground">{mistake.whatToDoInstead}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* The Math on Bankers */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-green-400" />
            The Banker Fee Math
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            On a $40M deal, here's what the numbers look like:
          </p>
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Banker fee (2% of $40M)</span>
              <span className="font-semibold text-red-400">-$800,000</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Higher price from competitive process (+15%)</span>
              <span className="font-semibold text-green-400">+$6,000,000</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Avoided re-trade during diligence</span>
              <span className="font-semibold text-green-400">+$1,500,000</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Better terms (escrow, WC, earnout)</span>
              <span className="font-semibold text-green-400">+$800,000</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-green-500/10 rounded-lg px-3 mt-2">
              <span className="font-bold text-foreground">Net benefit of hiring a banker</span>
              <span className="font-bold text-green-400 text-lg">+$7,500,000</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 italic">
            This is why experienced sellers say the banker fee is the best money they ever spent.
            You're not paying for a rolodex — you're paying for a competitive process that makes buyers fight over your business.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // ── Tab 2: The 8 Stages ───────────────────────────────────────

  const renderStages = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-400" />
            The 8 Stages of a Competitive Sale Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            A well-run M&A process follows a predictable timeline. Understanding each stage — what happens, who does what, and where sellers
            get tripped up — is the difference between a premium exit and a fire sale.
          </p>
          <p className="text-sm text-muted-foreground">
            Click each stage to expand the full breakdown.
          </p>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-3">
        {processStages.map((stage, idx) => (
          <div key={stage.id} className="relative">
            {/* Connector line */}
            {idx < processStages.length - 1 && (
              <div className="absolute left-6 top-full w-0.5 h-3 bg-border z-0" />
            )}

            <Card className={`bg-card border-border overflow-hidden transition-all ${expandedStage === stage.id ? 'ring-1 ring-primary/30' : ''}`}>
              <button
                onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                className="w-full text-left"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${stage.bgColor} border ${stage.borderColor}`}>
                        <div className={stage.color}>{stage.icon}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-medium">STAGE {idx + 1}</span>
                          <Badge variant="outline" className="text-xs">{stage.timeline}</Badge>
                        </div>
                        <CardTitle className="text-lg mt-0.5">{stage.name}</CardTitle>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedStage === stage.id ? 'rotate-90' : ''}`} />
                  </div>
                </CardHeader>
              </button>

              {expandedStage === stage.id && (
                <CardContent className="pt-0 space-y-4">
                  <div className="border-t border-border pt-4">
                    <p className="text-muted-foreground">{stage.whatHappens}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Your Role
                      </p>
                      <p className="text-sm text-muted-foreground">{stage.sellerRole}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Banker's Role
                      </p>
                      <p className="text-sm text-muted-foreground">{stage.bankerRole}</p>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground mb-2">Key Documents</p>
                    <div className="flex flex-wrap gap-2">
                      {stage.keyDocuments.map((doc, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{doc}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-400 mb-1 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Common Mistake
                    </p>
                    <p className="text-sm text-muted-foreground">{stage.commonMistake}</p>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-400 mb-1 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" /> Pro Tip
                    </p>
                    <p className="text-sm text-muted-foreground">{stage.proTip}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        ))}
      </div>

      {/* Total Timeline Summary */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <p className="font-semibold text-foreground">Total Timeline: 6-12 months preparation + 4-5 months active process</p>
          </div>
          <p className="text-sm text-muted-foreground">
            The best deals take 10-18 months from "I think I want to sell" to "money in the bank."
            Rushing the preparation phase to save time costs far more in price than it saves in speed.
            PE firms can tell when a business was prepared quickly vs. thoughtfully — and they price accordingly.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // ── Tab 3: Process Readiness Check ────────────────────────────

  const renderReadinessCheck = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-400" />
            Are You Ready to Run a Competitive Process?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Answer these 17 questions honestly. Each "No" is a gap that could cost you money, time, or leverage during the sale process.
          </p>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">{answeredCount} of {totalQuestions} answered</span>
            </div>
            <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Navigator */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {readinessQuestions.map((q, idx) => {
              const answer = answers[q.id];
              let dotColor = 'bg-muted/50 border-border';
              if (answer === 'yes') dotColor = 'bg-green-500/20 border-green-500/40 text-green-400';
              if (answer === 'no') dotColor = 'bg-red-500/20 border-red-500/40 text-red-400';
              return (
                <div
                  key={q.id}
                  className={`w-7 h-7 rounded border ${dotColor} flex items-center justify-center text-xs font-medium`}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Questions by Category */}
      {categories.map(category => (
        <Card key={category} className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {readinessQuestions.filter(q => q.category === category).map((q, idx) => {
              const answer = answers[q.id];
              const globalIdx = readinessQuestions.findIndex(rq => rq.id === q.id);
              return (
                <div key={q.id} className={`rounded-lg border p-4 transition-colors ${
                  answer === 'yes' ? 'bg-green-500/5 border-green-500/20' :
                  answer === 'no' ? 'bg-red-500/5 border-red-500/20' :
                  'bg-muted/30 border-border'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        <span className="text-muted-foreground mr-2">{globalIdx + 1}.</span>
                        {q.question}
                      </p>
                      {answer === 'no' && (
                        <div className="mt-2 bg-red-500/10 border border-red-500/20 rounded p-3">
                          <p className="text-sm text-muted-foreground">
                            <span className="text-red-400 font-medium">Why this matters: </span>
                            {q.whyItMatters}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleAnswer(q.id, 'yes')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          answer === 'yes'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleAnswer(q.id, 'no')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          answer === 'no'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {/* Generate Report Button */}
      {answeredCount >= totalQuestions && (
        <div className="text-center">
          <Button
            onClick={() => { setShowReport(true); setActiveTab(3); }}
            className="px-8 py-3 text-lg"
          >
            View Your Report <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );

  // ── Tab 4: Report ─────────────────────────────────────────────

  const renderReport = () => {
    const score = getScore();
    const gaps = readinessQuestions.filter(q => answers[q.id] === 'no');
    const readyItems = readinessQuestions.filter(q => answers[q.id] === 'yes');

    if (answeredCount < totalQuestions) {
      return (
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Complete the Assessment First</h3>
              <p className="text-muted-foreground mb-4">
                Answer all {totalQuestions} questions in the Process Readiness Check to generate your personalized report.
              </p>
              <p className="text-sm text-muted-foreground">
                {answeredCount} of {totalQuestions} answered — {totalQuestions - answeredCount} remaining
              </p>
              <Button onClick={() => setActiveTab(2)} className="mt-4">
                <ChevronLeft className="w-4 h-4 mr-2" /> Go to Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Overall Score */}
        <Card className={`border ${score.verdictBg}`}>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Process Readiness Assessment</p>
            <p className={`text-4xl font-bold ${score.verdictColor} mb-2`}>{score.verdict}</p>
            <p className="text-5xl font-bold text-foreground mb-4">{score.pct}%</p>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-green-400">{score.ready} Ready</span>
              <span className="text-red-400">{score.notReady} Not Ready</span>
              {score.unanswered > 0 && <span className="text-muted-foreground">{score.unanswered} Unanswered</span>}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map(cat => {
              const catScore = getCategoryScore(cat);
              const barColor = catScore.pct >= 75 ? 'bg-green-500' : catScore.pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{cat}</span>
                    <span className="text-muted-foreground">{catScore.yes}/{catScore.total} ({catScore.pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${catScore.pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Gaps */}
        {gaps.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                Gaps to Address Before Launching ({gaps.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {gaps.map(q => (
                <div key={q.id} className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-medium text-foreground mb-1">{q.question}</p>
                  <p className="text-sm text-muted-foreground">{q.whyItMatters}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Ready Items */}
        {readyItems.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                You're Ready On ({readyItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {readyItems.map(q => (
                  <div key={q.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-muted-foreground">{q.question}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Plan */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Your Competitive Process Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="font-medium text-foreground mb-2">1. Hire the Right Investment Banker</p>
              <p className="text-sm text-muted-foreground">
                Interview 3-5 investment banks. Ask about their track record in your industry, typical deal sizes,
                and how many buyers they'll contact. The right banker has sold businesses like yours before —
                not just businesses in general.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="font-medium text-foreground mb-2">2. Run a Sell-Side QoE First</p>
              <p className="text-sm text-muted-foreground">
                Before the process starts, hire an accounting firm to do a Quality of Earnings on your business.
                This costs $50-100K but eliminates the biggest source of re-trades: financial surprises during buyer diligence.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="font-medium text-foreground mb-2">3. Prepare Your Management Team</p>
              <p className="text-sm text-muted-foreground">
                Coach your key managers on what to expect during buyer meetings. They need to present confidently
                without you in the room. A strong management team adds 1-2x to your valuation multiple.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="font-medium text-foreground mb-2">4. Demand a Broad Process</p>
              <p className="text-sm text-muted-foreground">
                Tell your banker you want 50+ teasers sent, 15+ NDAs signed, and 5+ IOIs submitted.
                Don't let them narrow the field too early. The goal is maximum competitive tension.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="font-medium text-foreground mb-2">5. Keep Running Your Business</p>
              <p className="text-sm text-muted-foreground">
                Your financial performance during the process is under a microscope. Any revenue dip or margin
                compression gives buyers ammunition. Stay focused on operations — let your banker manage the process.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Export */}
        <div className="flex justify-center">
          <Button onClick={exportCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report as CSV
          </Button>
        </div>
      </div>
    );
  };

  // ── Main Render ───────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 max-w-4xl mx-auto">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === idx
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 0 && renderWhyProcessWins()}
      {activeTab === 1 && renderStages()}
      {activeTab === 2 && renderReadinessCheck()}
      {activeTab === 3 && renderReport()}
    </div>
  );
};
