import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert, Target, AlertTriangle, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft, Download, BookOpen, FileText,
  Lightbulb, DollarSign, Clock, Scale, Hand,
  ArrowRight, Zap, Flag, TrendingDown, Users
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────

interface DealStage {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  redLines: RedLine[];
}

interface RedLine {
  id: string;
  signal: string;
  threshold: string;
  whyItMatters: string;
  whatToDo: string;
  severity: 'walk' | 'pause' | 'negotiate';
}

interface EvaluatorQuestion {
  id: string;
  stage: string;
  question: string;
  explanation: string;
  severity: 'walk' | 'pause' | 'negotiate';
}

interface EvaluatorAnswers {
  [questionId: string]: 'yes' | 'no' | null;
}

// ── Deal Stage Red Lines ────────────────────────────────────────

const dealStages: DealStage[] = [
  {
    id: 'ioi',
    name: 'IOI Stage',
    icon: <FileText className="w-6 h-6" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    description: 'Indications of Interest are coming in. This is where buyers set anchors — and where most sellers make their first mistake by falling in love with the highest number.',
    redLines: [
      {
        id: 'ioi-wide-range',
        signal: 'The IOI has a range wider than 20%',
        threshold: 'Example: "$40M-$50M enterprise value"',
        whyItMatters: 'A wide range means the buyer is anchoring you to the top number while planning to close at the bottom. That $50M is a fantasy — they put it there so you reject tighter, more honest bids from other buyers.',
        whatToDo: 'Ask the buyer to narrow the range. If they won\'t commit to within 10%, their IOI is a negotiation tactic, not a real offer.',
        severity: 'negotiate'
      },
      {
        id: 'ioi-heavy-conditions',
        signal: 'The IOI is loaded with "subject to" conditions',
        threshold: 'More than 3 material conditions beyond standard diligence',
        whyItMatters: 'Every "subject to" is an escape hatch. "Subject to financing," "subject to board approval," "subject to management assessment" — each one is a way to renegotiate later.',
        whatToDo: 'Rank IOIs by certainty of close, not just price. A $38M firm offer beats a $45M conditional offer every time.',
        severity: 'negotiate'
      },
      {
        id: 'ioi-single-bidder',
        signal: 'You only have one IOI',
        threshold: 'Fewer than 3 credible bidders in the process',
        whyItMatters: 'A single buyer has all the leverage. They know you have no alternative. Every negotiation from here forward will favor them because you can\'t walk to another offer.',
        whatToDo: 'Pause and widen your process. Hire an investment banker if you haven\'t. The 1-3% fee pays for itself 10x in competitive tension.',
        severity: 'pause'
      }
    ]
  },
  {
    id: 'loi',
    name: 'LOI Stage',
    icon: <Scale className="w-6 h-6" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    description: 'The Letter of Intent sets the framework for the entire deal. What you agree to here is extremely hard to change later. This is where experienced sellers earn or lose millions.',
    redLines: [
      {
        id: 'loi-exclusivity-long',
        signal: 'Exclusivity period longer than 60 days',
        threshold: '45 days is standard. 60 is aggressive. 90+ is a trap.',
        whyItMatters: 'Exclusivity means you can\'t talk to other buyers. The longer the exclusivity, the more leverage you lose. Buyers use long exclusivity to lock you in, then renegotiate when you have no alternatives.',
        whatToDo: 'Counter with 45 days. If they insist on 60+, demand a breakup fee (1-3% of deal value) payable if the buyer walks without cause.',
        severity: 'negotiate'
      },
      {
        id: 'loi-no-breakup',
        signal: 'No breakup fee in a long exclusivity period',
        threshold: 'Any exclusivity over 45 days without a breakup fee',
        whyItMatters: 'Without a breakup fee, the buyer can tie you up for 60-90 days, run diligence, learn everything about your business, then walk away for free. You lost months and your competitive process is dead.',
        whatToDo: 'Insist on a breakup fee of 1-3% of deal value. If the buyer refuses, they\'re not serious — they want optionality at your expense.',
        severity: 'pause'
      },
      {
        id: 'loi-vague-wc',
        signal: 'Working capital language is vague or absent',
        threshold: '"Subject to customary working capital adjustment" with no methodology specified',
        whyItMatters: 'This one line can cost you $500K-$2M at closing. If the LOI doesn\'t specify the calculation period (3-month vs. 12-month average), inclusions/exclusions, and collar width, the buyer will define these terms in their favor later.',
        whatToDo: 'Negotiate the working capital methodology in the LOI, not the purchase agreement. Specify trailing 12-month average, define inclusions/exclusions, and set a collar (+/- 5-10%).',
        severity: 'negotiate'
      },
      {
        id: 'loi-retrade-price',
        signal: 'Buyer tries to lower price before signing the LOI',
        threshold: 'Any price reduction before you\'ve even entered diligence',
        whyItMatters: 'If they\'re re-trading before they\'ve even looked at your books, they will absolutely re-trade during diligence. This buyer is showing you exactly who they are.',
        whatToDo: 'Walk. A buyer who re-trades before diligence will re-trade after diligence, after legal review, and right before closing. You\'re negotiating with yourself.',
        severity: 'walk'
      }
    ]
  },
  {
    id: 'diligence',
    name: 'Due Diligence',
    icon: <Target className="w-6 h-6" />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    description: 'The most emotionally draining phase. The buyer\'s team is building a case for a lower price while you\'re running the business and answering 500 questions. Know the difference between normal diligence and deal manipulation.',
    redLines: [
      {
        id: 'dd-retrade-10',
        signal: 'Buyer re-trades price by more than 10% from the LOI',
        threshold: 'LOI said $42M, now they want $37M or less',
        whyItMatters: 'A 10%+ re-trade means one of two things: they bid too high to win exclusivity (and always planned to cut), or they found something genuinely material. If it\'s the first, they\'ll do it again at closing.',
        whatToDo: 'Demand a specific, documented justification for every dollar of reduction. If the reduction is not tied to a specific, verifiable diligence finding — walk. Reopen your process.',
        severity: 'walk'
      },
      {
        id: 'dd-addback-reject',
        signal: 'QoE rejects more than 3 legitimate add-backs',
        threshold: 'Documented, reasonable add-backs being rejected without justification',
        whyItMatters: 'The buy-side QoE team works for the buyer. Their job is to reduce your EBITDA. But rejecting legitimate add-backs without justification is a negotiating tactic disguised as accounting.',
        whatToDo: 'Challenge every rejected add-back in writing. Provide documentation. If the QoE firm won\'t engage, escalate to the buyer\'s deal team directly. This is negotiation, not accounting.',
        severity: 'negotiate'
      },
      {
        id: 'dd-scope-creep',
        signal: 'Diligence requests keep expanding beyond the original scope',
        threshold: 'Third or fourth round of "additional requests" with no end in sight',
        whyItMatters: 'Some buyers use expanding diligence to wear you down. The more exhausted you are, the more likely you are to accept concessions just to get the deal done.',
        whatToDo: 'Set a diligence timeline with your attorney. After the agreed period, any new requests require a written justification of materiality. Protect your time and your team\'s time.',
        severity: 'negotiate'
      },
      {
        id: 'dd-calling-customers',
        signal: 'Buyer contacts your customers without permission',
        threshold: 'Any customer contact outside the agreed diligence plan',
        whyItMatters: 'Customer calls should be controlled, scripted, and agreed upon. A buyer calling your top customer to "check on the relationship" may be fishing for leverage — or damaging your business if the deal falls apart.',
        whatToDo: 'Demand all customer interactions go through you or your banker. If the buyer violated the confidentiality agreement, consult your attorney immediately.',
        severity: 'pause'
      },
      {
        id: 'dd-we-found-something',
        signal: 'Buyer uses a minor finding as leverage for a major price cut',
        threshold: 'A $50K issue being used to justify a $500K+ reduction',
        whyItMatters: 'This is the "we found something" play. Every deal has imperfections. Skilled buyers magnify small issues into big price cuts because they know you\'re emotionally invested and don\'t want to restart the process.',
        whatToDo: 'Respond with data. Quantify the actual financial impact of the finding. If the price cut is 5x+ the actual issue, call it out directly: "This finding is worth $50K. You\'re proposing a $500K adjustment. Help us understand."',
        severity: 'negotiate'
      }
    ]
  },
  {
    id: 'definitive',
    name: 'Definitive Docs',
    icon: <ShieldAlert className="w-6 h-6" />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    description: 'The purchase agreement is where the real warfare happens. 80-120 pages of legal language that determine who bears what risk. The clauses that cost sellers the most money are often the ones they never read.',
    redLines: [
      {
        id: 'def-escrow-high',
        signal: 'Escrow holdback above 15% of purchase price',
        threshold: 'Market is 5-10%. Above 15% is aggressive.',
        whyItMatters: 'Escrow is YOUR money sitting in an account you can\'t touch. The buyer can make claims against it for any rep breach. At 15% on a $40M deal, that\'s $6M of your money at risk for 12-24 months.',
        whatToDo: 'Counter with R&W insurance. It costs 2-4% of the coverage limit but eliminates or drastically reduces escrow. If the buyer refuses to consider R&W insurance, they want the leverage of holding your money.',
        severity: 'negotiate'
      },
      {
        id: 'def-tipping-basket',
        signal: 'Tipping basket instead of true deductible',
        threshold: 'Indemnification from dollar one once the threshold is crossed',
        whyItMatters: 'With a tipping basket, if claims hit $500K, you owe the FULL $500K. With a true deductible, you only owe the amount ABOVE $500K. On a $2M claim with a $500K threshold: tipping basket = you owe $2M. True deductible = you owe $1.5M.',
        whatToDo: 'Always negotiate for a true deductible. This is standard and any experienced M&A attorney will push for it.',
        severity: 'negotiate'
      },
      {
        id: 'def-anti-sandbagging',
        signal: 'Anti-sandbagging clause with no carve-out',
        threshold: 'Buyer can sue you for things they knew about before closing',
        whyItMatters: 'Anti-sandbagging means even if the buyer discovered a problem during diligence and closed anyway, they can still come after your escrow for it. They get to close with open eyes and sue you with a blind-justice argument.',
        whatToDo: 'Push for pro-sandbagging language: if the buyer knew about it and closed anyway, they accepted it. At minimum, negotiate a modified clause with a knowledge qualifier.',
        severity: 'negotiate'
      },
      {
        id: 'def-earnout-no-covenant',
        signal: 'Earnout with no operating covenants',
        threshold: 'Buyer has full control over operations that determine your earnout',
        whyItMatters: 'Without operating covenants, the buyer can allocate management fees, shift costs, change accounting methods, or restructure the business in ways that make your EBITDA target impossible to hit. Legally.',
        whatToDo: 'Walk if they refuse operating covenants on an earnout. An earnout without protections is not an earnout — it\'s a discount disguised as an opportunity. Insist on covenant language your attorney drafts.',
        severity: 'walk'
      },
      {
        id: 'def-broad-reps',
        signal: 'Flat representations without knowledge qualifiers',
        threshold: 'Reps that say "Seller represents..." instead of "To Seller\'s knowledge..."',
        whyItMatters: 'A flat rep makes you absolutely liable even for things you didn\'t know about. If there\'s a hidden environmental issue you never knew existed, you\'re on the hook. A knowledge qualifier limits liability to what you actually knew.',
        whatToDo: 'Your attorney should insist on knowledge qualifiers for every rep that isn\'t fully within your control. Flat reps should only apply to things you absolutely, provably know (like "we own these assets").',
        severity: 'negotiate'
      }
    ]
  },
  {
    id: 'preclose',
    name: 'Pre-Close',
    icon: <Flag className="w-6 h-6" />,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    description: 'The final stretch. You\'re exhausted. You\'ve been at this for months. You just want it to be over. This is exactly when buyers make their final push for concessions — because they know you\'ll say yes to almost anything.',
    redLines: [
      {
        id: 'pre-last-minute-retrade',
        signal: 'Last-minute price reduction at closing',
        threshold: 'Any price change in the final week that wasn\'t tied to a specific diligence finding',
        whyItMatters: 'The "closing table re-trade" is the most cynical play in M&A. The buyer waits until you\'ve signed everything, your team knows, your plans are made — then drops the price $500K because they know you won\'t restart.',
        whatToDo: 'If the reduction has no documented basis, refuse it. Say: "We\'ll close at the agreed price or we won\'t close." You are never more powerless than when you believe you can\'t walk away.',
        severity: 'walk'
      },
      {
        id: 'pre-wc-manipulation',
        signal: 'Working capital calculation uses different methodology than agreed',
        threshold: 'Changed calculation period, inclusions/exclusions, or valuation methods',
        whyItMatters: 'Buyers sometimes change the working capital methodology in the final calculation, hoping you\'re too exhausted to notice. A switch from 12-month to 3-month average during a seasonal peak can cost $500K-$1M.',
        whatToDo: 'Compare every line of the closing working capital statement against the methodology agreed in the purchase agreement. Have your accountant review it independently. Dispute any deviation in writing.',
        severity: 'negotiate'
      },
      {
        id: 'pre-new-conditions',
        signal: 'New closing conditions that weren\'t in the purchase agreement',
        threshold: 'Any new requirement added in the final days',
        whyItMatters: 'Adding conditions at the last minute is a pressure tactic. "We just need this one more thing" is how buyers extract concessions from exhausted sellers who are mentally already past closing.',
        whatToDo: 'If it\'s not in the signed purchase agreement, it\'s not required. Your attorney should reject any new conditions unless they\'re genuinely immaterial.',
        severity: 'negotiate'
      },
      {
        id: 'pre-financing-uncertainty',
        signal: 'Buyer\'s financing is not confirmed or has changed',
        threshold: 'Lender issues, commitment letter changes, or fund-level problems',
        whyItMatters: 'If the buyer\'s financing falls apart before close, you\'re left with a dead deal after months of work. The longer you wait, the harder it is to restart your process.',
        whatToDo: 'Demand a financing update 2 weeks before scheduled closing. If there\'s any uncertainty, notify your other bidders that the timeline has shifted. Keep your alternatives warm.',
        severity: 'pause'
      }
    ]
  }
];

// ── Evaluator Questions ─────────────────────────────────────────

const evaluatorQuestions: EvaluatorQuestion[] = [
  // IOI Stage
  { id: 'eval-single-buyer', stage: 'IOI', question: 'Are you currently negotiating with only one buyer?', explanation: 'A single buyer has all the leverage. Every concession from here forward will favor them.', severity: 'pause' },
  { id: 'eval-wide-range', stage: 'IOI', question: 'Does the IOI have a valuation range wider than 20%?', explanation: 'The buyer is anchoring you to the top number while planning to close at the bottom.', severity: 'negotiate' },
  { id: 'eval-no-banker', stage: 'IOI', question: 'Are you running this process without an investment banker?', explanation: 'Bankers create competitive tension, manage the process, and prevent you from negotiating against yourself.', severity: 'pause' },

  // LOI Stage
  { id: 'eval-exclusivity-60', stage: 'LOI', question: 'Is the exclusivity period longer than 60 days?', explanation: 'Long exclusivity locks you in and kills competitive tension. 45 days is standard.', severity: 'negotiate' },
  { id: 'eval-no-breakup', stage: 'LOI', question: 'Is there no breakup fee despite exclusivity over 45 days?', explanation: 'Without a breakup fee, the buyer can walk for free after tying you up for months.', severity: 'pause' },
  { id: 'eval-vague-wc', stage: 'LOI', question: 'Is the working capital methodology vague or undefined in the LOI?', explanation: 'Vague working capital language is a blank check for the buyer to define terms in their favor later.', severity: 'negotiate' },
  { id: 'eval-price-drop-pre-dd', stage: 'LOI', question: 'Has the buyer tried to lower the price before diligence even started?', explanation: 'Pre-diligence re-trades show you exactly who this buyer is. It will only get worse.', severity: 'walk' },

  // DD Stage
  { id: 'eval-retrade-10', stage: 'Due Diligence', question: 'Has the buyer reduced the price by more than 10% from the LOI?', explanation: 'Either they bid high to win exclusivity (planned to cut all along) or the finding is genuinely material.', severity: 'walk' },
  { id: 'eval-addbacks-rejected', stage: 'Due Diligence', question: 'Has the QoE rejected 3 or more of your legitimate, documented add-backs?', explanation: 'Systematic rejection of reasonable add-backs is a negotiation tactic, not accounting.', severity: 'negotiate' },
  { id: 'eval-small-issue-big-cut', stage: 'Due Diligence', question: 'Is the buyer using a minor finding to justify a major price reduction?', explanation: 'The "we found something" play — magnifying small issues into big price cuts.', severity: 'negotiate' },
  { id: 'eval-customer-contact', stage: 'Due Diligence', question: 'Has the buyer contacted your customers without your permission?', explanation: 'Unauthorized customer contact violates trust and may violate your confidentiality agreement.', severity: 'pause' },

  // Definitive Docs
  { id: 'eval-escrow-15', stage: 'Definitive Docs', question: 'Is the escrow holdback above 15% of the purchase price?', explanation: 'Market is 5-10%. Above 15% means the buyer wants to hold a disproportionate amount of your money at risk.', severity: 'negotiate' },
  { id: 'eval-earnout-no-covenant', stage: 'Definitive Docs', question: 'Does your earnout have NO operating covenants protecting the EBITDA target?', explanation: 'Without covenants, the buyer can legally manipulate operations to make you miss your earnout.', severity: 'walk' },
  { id: 'eval-anti-sandbagging', stage: 'Definitive Docs', question: 'Does the agreement include anti-sandbagging with no carve-out?', explanation: 'The buyer can sue you post-close for things they knew about before closing.', severity: 'negotiate' },
  { id: 'eval-flat-reps', stage: 'Definitive Docs', question: 'Are your representations flat (no "to seller\'s knowledge" qualifiers)?', explanation: 'Flat reps make you liable for things you didn\'t even know about.', severity: 'negotiate' },

  // Pre-Close
  { id: 'eval-closing-retrade', stage: 'Pre-Close', question: 'Is the buyer trying to reduce the price in the final week with no documented basis?', explanation: 'The closing-table re-trade is the most cynical play in M&A.', severity: 'walk' },
  { id: 'eval-wc-method-change', stage: 'Pre-Close', question: 'Has the working capital calculation methodology changed from what was agreed?', explanation: 'Changing the methodology at the last minute can cost $500K-$1M.', severity: 'negotiate' },
  { id: 'eval-financing-uncertain', stage: 'Pre-Close', question: 'Is there any uncertainty about the buyer\'s financing commitment?', explanation: 'If financing falls apart, you\'re left with a dead deal after months of work.', severity: 'pause' },
];

// ── Main Component ──────────────────────────────────────────────

const STORAGE_KEY = 'when-to-walk-v1';

type Tab = 'power' | 'redlines' | 'evaluator' | 'playbook';

export function WhenToWalk() {
  const [activeTab, setActiveTab] = useState<Tab>('power');
  const [answers, setAnswers] = useState<EvaluatorAnswers>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).answers || {}; } catch { return {}; }
    }
    return {};
  });
  const [evaluatorStarted, setEvaluatorStarted] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).evaluatorStarted || false; } catch { return false; }
    }
    return false;
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, evaluatorStarted }));
  }, [answers, evaluatorStarted]);

  const answeredCount = Object.values(answers).filter(a => a !== null && a !== undefined).length;
  const evaluatorComplete = answeredCount === evaluatorQuestions.length;

  // ── Scoring ──────────────────────────────────────────────────

  const getRedFlags = () => evaluatorQuestions.filter(q => answers[q.id] === 'yes');
  const getWalkFlags = () => getRedFlags().filter(q => q.severity === 'walk');
  const getPauseFlags = () => getRedFlags().filter(q => q.severity === 'pause');
  const getNegotiateFlags = () => getRedFlags().filter(q => q.severity === 'negotiate');

  const getOverallAssessment = () => {
    const walkCount = getWalkFlags().length;
    const pauseCount = getPauseFlags().length;
    const totalFlags = getRedFlags().length;

    if (walkCount >= 2) return { level: 'Walk Away', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', advice: 'Multiple walk-away signals are present. This deal has fundamental problems that are unlikely to improve. Walking away now protects your leverage and your sanity. You can always restart with a better buyer or a better process.' };
    if (walkCount === 1) return { level: 'Serious Concern', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', advice: 'You have at least one walk-away signal. This doesn\'t automatically mean you should kill the deal, but it means you should have a very serious conversation with your attorney and advisor. If the buyer won\'t address this specific issue, walk.' };
    if (pauseCount >= 2) return { level: 'Pause & Reassess', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', advice: 'Multiple yellow flags are present. The deal isn\'t dead, but the process needs adjustment. Address each pause signal with your advisory team before proceeding. Don\'t let momentum override your judgment.' };
    if (totalFlags >= 4) return { level: 'Negotiate Hard', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', advice: 'You have several negotiation points to address. None are individually deal-breaking, but the pattern suggests the buyer is testing your boundaries. Push back firmly on each point. A buyer who respects pushback is a buyer you can work with.' };
    if (totalFlags >= 1) return { level: 'Manageable Issues', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', advice: 'You have a few items to address, but nothing that should derail the deal. These are normal negotiation points. Bring them to your attorney and advisor to resolve through standard deal mechanics.' };
    return { level: 'Green Light', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', advice: 'Based on your responses, the deal looks clean. No major red flags or walk-away signals. Continue with confidence, but stay alert — new issues can surface at any stage. Keep your alternatives warm until the wire hits.' };
  };

  const handleAnswer = (questionId: string, value: 'yes' | 'no') => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const resetEvaluator = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setEvaluatorStarted(false);
  };

  // ── CSV Export ──────────────────────────────────────────────

  const exportCSV = () => {
    const assessment = getOverallAssessment();
    const walkFlags = getWalkFlags();
    const pauseFlags = getPauseFlags();
    const negotiateFlags = getNegotiateFlags();

    const lines = [
      'When to Walk Away — Deal Evaluation Report — PE Ready Plus',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      `Overall Assessment: ${assessment.level}`,
      `Total Flags: ${getRedFlags().length} of ${evaluatorQuestions.length}`,
      `Walk-Away Signals: ${walkFlags.length}`,
      `Pause Signals: ${pauseFlags.length}`,
      `Negotiate Signals: ${negotiateFlags.length}`,
      '',
      assessment.advice,
      '',
      'Flagged Items',
      'Stage,Severity,Question,What It Means',
      ...getRedFlags().map(q =>
        `"${q.stage}","${q.severity.toUpperCase()}","${q.question}","${q.explanation}"`
      ),
      '',
      'Clear Items',
      ...evaluatorQuestions.filter(q => answers[q.id] === 'no').map(q =>
        `"${q.stage}","CLEAR","${q.question}","No issue identified"`
      ),
      '',
      'Action Items',
      ...walkFlags.map(q => `"WALK","${q.stage}","${q.question}"`),
      ...pauseFlags.map(q => `"PAUSE","${q.stage}","${q.question}"`),
      ...negotiateFlags.map(q => `"NEGOTIATE","${q.stage}","${q.question}"`)
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `when-to-walk-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Tab Navigation ────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'power', label: 'Why Walking Away is Power', icon: <Hand className="w-4 h-4" /> },
    { id: 'redlines', label: 'The Red Lines', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'evaluator', label: 'Evaluate Your Deal', icon: <Target className="w-4 h-4" /> },
    { id: 'playbook', label: 'Your Playbook', icon: <FileText className="w-4 h-4" /> }
  ];

  const severityConfig = {
    walk: { label: 'Walk Away', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <XCircle className="w-4 h-4" /> },
    pause: { label: 'Pause & Reassess', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: <AlertTriangle className="w-4 h-4" /> },
    negotiate: { label: 'Negotiate Hard', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: <Scale className="w-4 h-4" /> }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Tab Bar */}
      <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-white/10 text-white border-b-2 border-purple-400'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'playbook' && evaluatorComplete && (
              <span className="ml-1 w-2 h-2 rounded-full bg-green-400" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab 1: Why Walking Away is Power ──────────────────── */}
      {activeTab === 'power' && (
        <div className="space-y-6">
          {/* Hero Card */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">The Most Powerful Word in Any Negotiation is "No"</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Here's the secret that every PE buyer knows and most sellers don't:
                <strong className="text-white"> the seller who will walk away gets the best deal.</strong>
              </p>
              <p className="text-white/70 leading-relaxed mb-4">
                Not because they're tough. Not because they're difficult. Because a buyer who knows you
                have alternatives — and the willingness to use them — cannot push you past fair terms.
                The moment a buyer senses you NEED this deal, you've already lost millions.
              </p>
              <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-red-200/80 text-sm">
                    <strong className="text-red-300">From the buyer's perspective:</strong> "The most dangerous seller
                    is the one who doesn't need my money. They negotiate from strength, they have a real BATNA,
                    and they know exactly what terms are worth killing the deal over. I pay 10-20% more for companies
                    sold by owners who will walk."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* The Three Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <Users className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">Run a Competitive Process</h3>
                <p className="text-white/60 text-sm">3-5 bidders minimum. The ability to say "we have other interested parties" isn't a bluff — it's a strategy. An investment banker's 1-3% fee pays for itself 10x in competitive tension.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <DollarSign className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">Know Your BATNA</h3>
                <p className="text-white/60 text-sm">BATNA = Best Alternative To a Negotiated Agreement. What happens if this deal dies? If the answer is "keep running a profitable business" — you have an incredible BATNA. If the answer is "bankruptcy" — you need a different strategy.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <ShieldAlert className="w-8 h-8 text-red-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">Set Red Lines in Advance</h3>
                <p className="text-white/60 text-sm">Before the process starts, decide what terms you won't accept. Write them down. Share them with your attorney. When you're exhausted at month 5, those pre-set red lines protect you from making emotional concessions.</p>
              </CardContent>
            </Card>
          </div>

          {/* What Sellers Get Wrong */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                Why Sellers Give Away Millions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { mistake: 'They negotiate with one buyer', cost: '$2-5M', detail: 'No competitive tension = buyer sets all the terms. They tell themselves "we have a relationship" — the buyer sees it as "we have a hostage."' },
                { mistake: 'They don\'t set red lines before the process', cost: '$1-3M', detail: 'Exhausted sellers at month 5 say yes to things month-1 sellers would reject outright. Decision fatigue is the buyer\'s best friend.' },
                { mistake: 'They tell everyone they\'re selling', cost: '$1-2M', detail: 'Once employees, customers, and competitors know — you can\'t go back. The buyer knows this. Your leverage evaporates.' },
                { mistake: 'They confuse progress with value', cost: '$500K-2M', detail: '"We\'ve been at this for 4 months, we can\'t start over now." Sunk cost thinking is how buyers extract final concessions.' },
                { mistake: 'They negotiate their own deal', cost: '$2-4M', detail: 'Hiring an M&A attorney costs $100-200K. Not hiring one costs $2-4M in aggressive terms you didn\'t know were negotiable.' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/5 rounded-lg p-4 border border-white/10">
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/20 shrink-0 text-xs">{item.cost}</Badge>
                  <div>
                    <p className="text-white font-medium text-sm">{item.mistake}</p>
                    <p className="text-white/60 text-xs mt-1">{item.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Key Insight */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">The Paradox of Walking Away</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Sellers who are genuinely prepared to walk away rarely have to. The willingness to say "no" is almost
                    always enough to get the buyer back to fair terms. It's the sellers who are desperate — who have no
                    alternatives, no red lines, and no advisor telling them to hold firm — who get taken to the cleaners.
                    Your job isn't to be difficult. It's to be prepared. The next two tabs show you exactly what to watch
                    for and when to hold firm.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => setActiveTab('redlines')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              See the Red Lines <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 2: The Red Lines ──────────────────────────────── */}
      {activeTab === 'redlines' && (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">Stage-by-Stage Red Lines</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                At each stage of the deal, specific signals tell you whether the buyer is negotiating in good faith or
                exploiting your position. These aren't opinions — they're patterns from thousands of deals. Know them
                before you need them.
              </p>
              <div className="flex gap-3 mt-4 flex-wrap">
                <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                  <XCircle className="w-3 h-3 mr-1" /> Walk Away
                </Badge>
                <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Pause & Reassess
                </Badge>
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">
                  <Scale className="w-3 h-3 mr-1" /> Negotiate Hard
                </Badge>
              </div>
            </CardContent>
          </Card>

          {dealStages.map(stage => (
            <Card key={stage.id} className={`${stage.bgColor} ${stage.borderColor} border`}>
              <CardHeader
                className="cursor-pointer"
                onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-3 text-lg">
                    <span className={stage.color}>{stage.icon}</span>
                    {stage.name}
                    <Badge className="bg-white/10 text-white/60 border-white/20 text-xs">
                      {stage.redLines.length} signals
                    </Badge>
                  </CardTitle>
                  <ChevronRight className={`w-5 h-5 text-white/40 transition-transform ${expandedStage === stage.id ? 'rotate-90' : ''}`} />
                </div>
                <p className="text-white/60 text-sm mt-1">{stage.description}</p>
              </CardHeader>

              {expandedStage === stage.id && (
                <CardContent className="space-y-4 pt-0">
                  {stage.redLines.map(redLine => {
                    const sev = severityConfig[redLine.severity];
                    return (
                      <div key={redLine.id} className="bg-black/20 rounded-lg p-4 border border-white/10 space-y-3">
                        <div className="flex items-start gap-3">
                          <span className={sev.color}>{sev.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className="text-white font-semibold text-sm">{redLine.signal}</h4>
                              <Badge className={`${sev.bg} ${sev.color} ${sev.border} border text-xs`}>{sev.label}</Badge>
                            </div>
                            <p className="text-white/50 text-xs mb-2">{redLine.threshold}</p>
                            <p className="text-white/70 text-sm mb-3">{redLine.whyItMatters}</p>
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <div className="flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                                <p className="text-white/70 text-sm"><strong className="text-green-400">What to do:</strong> {redLine.whatToDo}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              )}
            </Card>
          ))}

          <div className="flex justify-between">
            <Button
              onClick={() => setActiveTab('power')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Why Walking Away is Power
            </Button>
            <Button
              onClick={() => setActiveTab('evaluator')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Evaluate Your Deal <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 3: Evaluate Your Deal ─────────────────────────── */}
      {activeTab === 'evaluator' && (
        <div className="space-y-6">
          {!evaluatorStarted ? (
            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <CardContent className="p-8 text-center">
                <Target className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">Deal Health Evaluator</h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6">
                  19 yes-or-no questions that surface the specific red flags in YOUR deal. Based on the tactics PE buyers
                  use most often — and the patterns that separate good deals from bad ones.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                  {[
                    { label: '19 Questions', sub: 'across 5 deal stages' },
                    { label: 'Yes / No', sub: 'honest answers only' },
                    { label: 'Color-Coded', sub: 'walk / pause / negotiate' }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-white font-semibold text-sm">{item.label}</div>
                      <div className="text-white/50 text-xs">{item.sub}</div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setEvaluatorStarted(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                >
                  Start Evaluation
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Question {Math.min(currentQuestion + 1, evaluatorQuestions.length)} of {evaluatorQuestions.length}</span>
                  <span className="text-white/50">{answeredCount} answered</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(answeredCount / evaluatorQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Question */}
              {currentQuestion < evaluatorQuestions.length && (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-white/10 text-white/60 border-white/20 text-xs">
                        {evaluatorQuestions[currentQuestion].stage}
                      </Badge>
                      <Badge className={`${severityConfig[evaluatorQuestions[currentQuestion].severity].bg} ${severityConfig[evaluatorQuestions[currentQuestion].severity].color} ${severityConfig[evaluatorQuestions[currentQuestion].severity].border} border text-xs`}>
                        {severityConfig[evaluatorQuestions[currentQuestion].severity].label} if Yes
                      </Badge>
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-6 leading-relaxed">
                      {evaluatorQuestions[currentQuestion].question}
                    </h3>

                    {/* Yes / No Buttons */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => handleAnswer(evaluatorQuestions[currentQuestion].id, 'yes')}
                        className={`flex-1 px-6 py-4 rounded-lg text-sm font-medium transition-all border ${
                          answers[evaluatorQuestions[currentQuestion].id] === 'yes'
                            ? 'bg-red-500/20 border-red-400 text-red-400'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="text-lg font-bold mb-1">Yes</div>
                        <div className="text-xs opacity-80">This is happening</div>
                      </button>
                      <button
                        onClick={() => handleAnswer(evaluatorQuestions[currentQuestion].id, 'no')}
                        className={`flex-1 px-6 py-4 rounded-lg text-sm font-medium transition-all border ${
                          answers[evaluatorQuestions[currentQuestion].id] === 'no'
                            ? 'bg-green-500/20 border-green-400 text-green-400'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="text-lg font-bold mb-1">No</div>
                        <div className="text-xs opacity-80">Not an issue</div>
                      </button>
                    </div>

                    {/* Explanation */}
                    <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-white/50 text-xs font-semibold mb-1">Why this matters:</p>
                          <p className="text-white/60 text-sm">{evaluatorQuestions[currentQuestion].explanation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-6">
                      <Button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                        disabled={currentQuestion === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                      </Button>
                      <Button
                        onClick={() => {
                          if (currentQuestion < evaluatorQuestions.length - 1) {
                            setCurrentQuestion(currentQuestion + 1);
                          } else {
                            setActiveTab('playbook');
                          }
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {currentQuestion === evaluatorQuestions.length - 1 ? 'See Your Playbook' : 'Next'} <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Question Overview Grid */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-sm">All Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {evaluatorQuestions.map((q, i) => (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestion(i)}
                        className={`w-9 h-9 rounded-lg text-xs font-medium transition-all border ${
                          i === currentQuestion
                            ? 'bg-purple-500/30 border-purple-400 text-white'
                            : answers[q.id] === 'yes'
                              ? 'bg-red-500/20 border-red-500/30 text-red-400'
                              : answers[q.id] === 'no'
                                ? 'bg-green-500/20 border-green-500/30 text-green-400'
                                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reset */}
              <div className="flex justify-center">
                <Button
                  onClick={resetEvaluator}
                  variant="outline"
                  className="border-white/20 text-white/50 hover:bg-white/10 text-xs"
                >
                  Reset Evaluation
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Tab 4: Your Playbook ──────────────────────────────── */}
      {activeTab === 'playbook' && (
        <div className="space-y-6">
          {!evaluatorComplete ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Complete the Evaluation First</h2>
                <p className="text-white/60 mb-6">
                  Answer all 19 questions to generate your personalized Deal Playbook.
                </p>
                <p className="text-white/40 text-sm mb-6">{answeredCount} of {evaluatorQuestions.length} questions answered</p>
                <Button
                  onClick={() => setActiveTab('evaluator')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {evaluatorStarted ? 'Continue Evaluation' : 'Start Evaluation'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Overall Assessment */}
              {(() => {
                const assessment = getOverallAssessment();
                return (
                  <Card className={`${assessment.bg} ${assessment.border} border`}>
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="text-center">
                          <div className={`text-4xl font-bold ${assessment.color} mb-2`}>{assessment.level}</div>
                          <div className="flex gap-2 justify-center flex-wrap">
                            {getWalkFlags().length > 0 && (
                              <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                                {getWalkFlags().length} Walk Signal{getWalkFlags().length > 1 ? 's' : ''}
                              </Badge>
                            )}
                            {getPauseFlags().length > 0 && (
                              <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-xs">
                                {getPauseFlags().length} Pause Signal{getPauseFlags().length > 1 ? 's' : ''}
                              </Badge>
                            )}
                            {getNegotiateFlags().length > 0 && (
                              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">
                                {getNegotiateFlags().length} Negotiate Point{getNegotiateFlags().length > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-white mb-3">Your Deal Assessment</h2>
                          <p className="text-white/70 text-sm leading-relaxed">{assessment.advice}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Summary Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{evaluatorQuestions.length}</div>
                    <p className="text-white/50 text-xs">Questions Evaluated</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-500/5 border-red-500/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-400 mb-1">{getWalkFlags().length}</div>
                    <p className="text-white/50 text-xs">Walk-Away Signals</p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/5 border-orange-500/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-400 mb-1">{getPauseFlags().length}</div>
                    <p className="text-white/50 text-xs">Pause Signals</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">{evaluatorQuestions.length - getRedFlags().length}</div>
                    <p className="text-white/50 text-xs">Clear Items</p>
                  </CardContent>
                </Card>
              </div>

              {/* Flagged Items by Severity */}
              {getWalkFlags().length > 0 && (
                <Card className="bg-red-500/5 border-red-500/20">
                  <CardHeader>
                    <CardTitle className="text-red-400 flex items-center gap-2 text-base">
                      <XCircle className="w-5 h-5" />
                      Walk-Away Signals — Address These Immediately
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {getWalkFlags().map(q => (
                      <div key={q.id} className="bg-black/20 rounded-lg p-4 border border-red-500/10">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-white/10 text-white/60 border-white/20 text-xs">{q.stage}</Badge>
                        </div>
                        <p className="text-white font-medium text-sm">{q.question}</p>
                        <p className="text-white/60 text-xs mt-1">{q.explanation}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {getPauseFlags().length > 0 && (
                <Card className="bg-orange-500/5 border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="text-orange-400 flex items-center gap-2 text-base">
                      <AlertTriangle className="w-5 h-5" />
                      Pause Signals — Discuss with Your Advisory Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {getPauseFlags().map(q => (
                      <div key={q.id} className="bg-black/20 rounded-lg p-4 border border-orange-500/10">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-white/10 text-white/60 border-white/20 text-xs">{q.stage}</Badge>
                        </div>
                        <p className="text-white font-medium text-sm">{q.question}</p>
                        <p className="text-white/60 text-xs mt-1">{q.explanation}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {getNegotiateFlags().length > 0 && (
                <Card className="bg-yellow-500/5 border-yellow-500/20">
                  <CardHeader>
                    <CardTitle className="text-yellow-400 flex items-center gap-2 text-base">
                      <Scale className="w-5 h-5" />
                      Negotiation Points — Push Back on These
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {getNegotiateFlags().map(q => (
                      <div key={q.id} className="bg-black/20 rounded-lg p-4 border border-yellow-500/10">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-white/10 text-white/60 border-white/20 text-xs">{q.stage}</Badge>
                        </div>
                        <p className="text-white font-medium text-sm">{q.question}</p>
                        <p className="text-white/60 text-xs mt-1">{q.explanation}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Clear Items */}
              {evaluatorQuestions.filter(q => answers[q.id] === 'no').length > 0 && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center gap-2 text-base">
                      <CheckCircle2 className="w-5 h-5" />
                      Clear Items ({evaluatorQuestions.filter(q => answers[q.id] === 'no').length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {evaluatorQuestions.filter(q => answers[q.id] === 'no').map(q => (
                        <div key={q.id} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          <span className="text-white/60">{q.question}</span>
                          <Badge className="bg-white/5 text-white/40 border-white/10 text-xs ml-auto shrink-0">{q.stage}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Attorney Discussion Guide */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    Take This to Your Attorney
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'Review each flagged item and confirm whether it is standard or aggressive for deals in your industry and size range',
                    'For walk-away signals: discuss whether the issue is fixable through negotiation or whether it reveals a fundamental problem with this buyer',
                    'For pause signals: develop a specific response strategy for each one before your next interaction with the buyer',
                    'For negotiation points: identify which ones matter most (ranked by dollar impact) and prioritize accordingly',
                    'Confirm you have a competitive process or viable alternative — if not, discuss strategies to create one',
                    'Set explicit red lines for the remaining deal stages so you have pre-committed boundaries when fatigue hits'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-white/70 text-sm">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Export */}
              <div className="flex justify-center gap-3">
                <Button
                  onClick={exportCSV}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report (CSV)
                </Button>
                <Button
                  onClick={resetEvaluator}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Re-Evaluate
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
