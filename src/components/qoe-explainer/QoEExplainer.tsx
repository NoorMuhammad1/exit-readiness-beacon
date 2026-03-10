import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, CheckCircle2, XCircle, ChevronRight, ChevronLeft,
  Download, FileSearch, DollarSign, Clock, Shield, BookOpen,
  AlertCircle, ArrowRight, Lightbulb, Users, FileText
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────

interface RedFlagQuestion {
  id: string;
  category: string;
  question: string;
  explanation: string;
  yesImpact: 'high' | 'medium' | 'low';
  yesFinding: string;
  yesPrep: string;
}

interface CheckerAnswers {
  [questionId: string]: boolean | null;
}

// ── Red Flag Questions ──────────────────────────────────────────

const redFlagQuestions: RedFlagQuestion[] = [
  {
    id: 'owner-comp',
    category: 'Owner & Related Party',
    question: 'Is the owner (or any family member) paid above or below market rate?',
    explanation: 'QoE accountants will normalize owner compensation to market rate. If you pay yourself $500K but a replacement CEO costs $250K, your EBITDA gets adjusted down by $250K. If you underpay yourself, EBITDA gets adjusted up.',
    yesImpact: 'high',
    yesFinding: 'Owner compensation adjustment — QoE will normalize to market rate. This is the #1 most common adjustment.',
    yesPrep: 'Get a compensation study or salary benchmark for your role. Know the number before the QoE firm asks.'
  },
  {
    id: 'personal-expenses',
    category: 'Owner & Related Party',
    question: 'Do you run personal expenses through the business? (car, travel, meals, memberships, etc.)',
    explanation: 'These are legitimate add-backs, but only if you can prove them. The QoE firm will want receipts, credit card statements, and documentation.',
    yesImpact: 'medium',
    yesFinding: 'Personal expense add-backs — will be scrutinized and may only be partially accepted without documentation.',
    yesPrep: 'Create a detailed list of personal expenses with dollar amounts and supporting documents. Start separating personal from business spending now.'
  },
  {
    id: 'family-payroll',
    category: 'Owner & Related Party',
    question: 'Are family members on the payroll?',
    explanation: 'QoE firms check whether family employees are paid market rate for real jobs. A spouse earning $150K as "office manager" when the role pays $50K will get adjusted.',
    yesImpact: 'high',
    yesFinding: 'Family payroll normalization — QoE will compare family compensation to market rates for equivalent roles.',
    yesPrep: 'Document each family member\'s actual job duties and hours. Get market comps for their roles. If any are overpaid, plan to adjust before or explain during QoE.'
  },
  {
    id: 'related-party',
    category: 'Owner & Related Party',
    question: 'Does the business have transactions with companies you or family members own? (rent, services, supplies)',
    explanation: 'Related-party transactions are a huge QoE focus. If you rent your building to the company at $2K/month when market is $5K, that\'s an adjustment. If you overpay a related vendor, that\'s also an adjustment.',
    yesImpact: 'high',
    yesFinding: 'Related-party transaction adjustments — QoE will mark these to market rate. Could increase or decrease EBITDA.',
    yesPrep: 'Get independent appraisals or market quotes for all related-party deals. If rent is below market, know the delta — it reduces your adjusted EBITDA.'
  },
  {
    id: 'one-time-items',
    category: 'Revenue & Expenses',
    question: 'Have you had significant one-time expenses in the last 3 years? (lawsuits, natural disasters, relocations, large write-offs)',
    explanation: 'One-time items get added back to normalize EBITDA. But the QoE firm will challenge whether something is truly "one-time" — if you have lawsuits every year, that\'s not one-time.',
    yesImpact: 'medium',
    yesFinding: 'One-time expense add-backs — will need documentation proving they are genuinely non-recurring.',
    yesPrep: 'Build a schedule of non-recurring items with dates, amounts, and a brief explanation of why each won\'t recur. Have supporting docs ready.'
  },
  {
    id: 'revenue-recognition',
    category: 'Revenue & Expenses',
    question: 'Does your business have long-term contracts, deferred revenue, or unusual revenue timing?',
    explanation: 'QoE firms look closely at when revenue is recognized. If you bill $1M upfront for a 3-year contract, they may spread that out. If you have large receivables, they\'ll question collectability.',
    yesImpact: 'medium',
    yesFinding: 'Revenue recognition timing — QoE may restate revenue to match when services are actually delivered.',
    yesPrep: 'Prepare a revenue schedule showing contract terms, billing timing, and delivery timing. Be ready to explain your recognition policy.'
  },
  {
    id: 'customer-concentration',
    category: 'Revenue & Expenses',
    question: 'Does any single customer represent more than 15% of your revenue?',
    explanation: 'Customer concentration is a major QoE focus because it\'s a risk factor. If your top customer is 30% of revenue and they leave, the business takes a massive hit. PE firms discount for this.',
    yesImpact: 'high',
    yesFinding: 'Customer concentration risk — QoE will flag this and PE firm will likely discount the valuation or require customer contracts.',
    yesPrep: 'Prepare a top 10 customer list with revenue percentages, relationship length, and contract status. Have a story for how you\'re diversifying.'
  },
  {
    id: 'cash-vs-accrual',
    category: 'Accounting Methods',
    question: 'Does your business use cash-basis accounting (vs. accrual)?',
    explanation: 'PE firms and QoE reports require accrual-basis financials. If you\'re on cash basis, the QoE firm will convert everything — and the numbers can look very different. Prepaid expenses, accrued liabilities, and receivables all shift.',
    yesImpact: 'high',
    yesFinding: 'Cash-to-accrual conversion required — this is one of the biggest sources of surprise adjustments. EBITDA can move significantly.',
    yesPrep: 'Have your CPA start preparing accrual-basis statements NOW. Don\'t wait for the QoE — the conversion takes time and the results may surprise you.'
  },
  {
    id: 'inventory',
    category: 'Accounting Methods',
    question: 'Does your business carry significant inventory?',
    explanation: 'QoE firms will verify inventory exists, is properly valued, and isn\'t obsolete. Slow-moving or obsolete inventory gets written down, which hits EBITDA.',
    yesImpact: 'medium',
    yesFinding: 'Inventory valuation review — QoE will check for obsolete, slow-moving, or overvalued inventory.',
    yesPrep: 'Do a physical inventory count. Identify and write off obsolete items before the QoE. Know your inventory turns and have aging data ready.'
  },
  {
    id: 'revenue-fluctuations',
    category: 'Financial Trends',
    question: 'Has your revenue changed by more than 15% year-over-year in either direction recently?',
    explanation: 'Large swings raise questions. If revenue spiked, the QoE will ask if it\'s sustainable. If it dropped, they\'ll investigate why. PE firms value consistency.',
    yesImpact: 'medium',
    yesFinding: 'Revenue volatility — QoE will normalize or question sustainability of high-growth years and investigate declines.',
    yesPrep: 'Prepare a clear narrative for each year\'s performance. Was growth from a new contract (is it repeatable?) or a one-time windfall? Was a decline from a lost customer or a market issue?'
  },
  {
    id: 'margin-trends',
    category: 'Financial Trends',
    question: 'Have your profit margins been declining over the last 2-3 years?',
    explanation: 'Declining margins are a red flag for PE firms. The QoE will dig into why — is it pricing pressure, cost increases, loss of a high-margin product line? This directly affects how they project future EBITDA.',
    yesImpact: 'high',
    yesFinding: 'Margin deterioration — QoE will investigate the cause and PE firm will likely use lower margins in projections.',
    yesPrep: 'Know exactly why margins changed. Was it a temporary factor (input costs, one-time investment) or structural? Have a plan to show how margins stabilize or recover.'
  },
  {
    id: 'pending-legal',
    category: 'Risks & Liabilities',
    question: 'Are there any pending lawsuits, regulatory issues, or known liabilities not fully reflected in your financials?',
    explanation: 'Undisclosed or under-reserved liabilities are deal killers. The QoE will ask, the lawyers will ask, and if it comes out late in the process, trust is broken.',
    yesImpact: 'high',
    yesFinding: 'Contingent liabilities — QoE will require reserves or purchase price adjustments. Late disclosure can kill deals.',
    yesPrep: 'Get a full list from your attorney. Reserve appropriately on your balance sheet. Disclose early — surprises are worse than bad news.'
  },
  {
    id: 'capex-maintenance',
    category: 'Risks & Liabilities',
    question: 'Have you been deferring maintenance or capital expenditures to boost short-term profits?',
    explanation: 'QoE firms check whether your capex is enough to maintain the business. If you\'ve been skipping equipment replacement or facility maintenance, they\'ll add a "maintenance capex" charge that reduces free cash flow.',
    yesImpact: 'medium',
    yesFinding: 'Deferred capex — QoE may add a normalized maintenance capex charge, reducing free cash flow available to service debt.',
    yesPrep: 'Create a capex schedule showing what\'s been spent vs. what\'s needed. If you\'ve been deferring, plan to address the backlog or have a clear capex budget ready.'
  },
  {
    id: 'ar-aging',
    category: 'Risks & Liabilities',
    question: 'Do you have receivables older than 90 days or customers who are slow to pay?',
    explanation: 'Aged receivables raise collectability questions. The QoE firm may require a reserve against old AR, which reduces working capital and could trigger a purchase price adjustment at closing.',
    yesImpact: 'medium',
    yesFinding: 'Accounts receivable aging issues — QoE may require bad debt reserves, affecting working capital calculations.',
    yesPrep: 'Clean up your AR. Collect what you can, write off what you can\'t. Have an AR aging report ready showing collection patterns and any disputed amounts.'
  },
  {
    id: 'covid-adjustments',
    category: 'Financial Trends',
    question: 'Did COVID, supply chain issues, or other recent disruptions significantly impact your financials?',
    explanation: 'QoE firms will scrutinize any "normalization" adjustments for unusual periods. Buyers are skeptical of pandemic-era add-backs. They want to know what your business looks like in a normal environment.',
    yesImpact: 'medium',
    yesFinding: 'Disruption-period normalizations — QoE will challenge whether adjusted numbers reflect true run-rate performance.',
    yesPrep: 'Separate the impact clearly: what was temporary (PPP loans, supply disruptions) vs. permanent (lost customers, changed business model). Provide monthly data to show recovery trends.'
  }
];

// ── Educational Content ─────────────────────────────────────────

const qoeTimeline = [
  { phase: 'Engagement', duration: '1-2 weeks', description: 'PE firm hires a QoE accounting firm (usually a Big 4 or national firm). They request a massive document list from you.' },
  { phase: 'Data Collection', duration: '2-4 weeks', description: 'You and your team provide financials, tax returns, contracts, bank statements, GL detail, payroll records, and more. Expect 100+ document requests.' },
  { phase: 'Analysis', duration: '3-6 weeks', description: 'The QoE team digs through everything. They\'ll have questions — lots of them. Expect weekly calls and follow-up requests.' },
  { phase: 'Draft Report', duration: '1-2 weeks', description: 'You see the draft QoE report. This is where adjusted EBITDA lands — and it\'s often lower than what you expected. You can push back on specific adjustments.' },
  { phase: 'Final Report', duration: '1 week', description: 'Final QoE issued. This number becomes the basis for the purchase price. It also sets the working capital peg for closing adjustments.' }
];

const commonAdjustments = [
  {
    category: 'Almost Always Accepted',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    items: [
      { name: 'Owner excess compensation', description: 'The difference between what you pay yourself and what a replacement would cost' },
      { name: 'One-time legal/accounting fees', description: 'Lawsuit settlements, special audits, or transaction-related costs' },
      { name: 'Personal expenses through the business', description: 'Car, travel, meals, memberships — if properly documented' },
      { name: 'Non-recurring consulting or advisory fees', description: 'One-time projects that won\'t continue under new ownership' }
    ]
  },
  {
    category: 'Often Contested',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    items: [
      { name: 'Below-market rent from related party', description: 'If you own the building and rent it to the company cheaply, QoE marks it to market — EBITDA goes down' },
      { name: 'Family member salary adjustments', description: 'QoE normalizes to what the role would pay an outside hire' },
      { name: '"Normalized" revenue run-rate', description: 'Sellers want credit for contracts not yet started; buyers push back' },
      { name: 'Cost savings from recent initiatives', description: 'You cut costs last quarter; buyers question if it\'s sustainable' }
    ]
  },
  {
    category: 'Usually Rejected',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    items: [
      { name: 'Revenue normalization without evidence', description: '"We would have hit $X if not for Y" — without proof, QoE won\'t accept it' },
      { name: 'Synergy-based adjustments', description: 'Savings the buyer could achieve don\'t count as seller add-backs' },
      { name: 'Aggressive pro-forma projections', description: 'Forward-looking adjustments based on plans, not results' },
      { name: 'Recurring items claimed as one-time', description: 'If it happens every year, it\'s not one-time' }
    ]
  }
];

// ── Main Component ──────────────────────────────────────────────

const STORAGE_KEY = 'qoe-explainer-v1';

type Tab = 'overview' | 'adjustments' | 'checker' | 'report';

export function QoEExplainer() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [answers, setAnswers] = useState<CheckerAnswers>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).answers || {}; } catch { return {}; }
    }
    return {};
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [checkerStarted, setCheckerStarted] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).checkerStarted || false; } catch { return false; }
    }
    return false;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, checkerStarted }));
  }, [answers, checkerStarted]);

  const answeredCount = Object.values(answers).filter(a => a !== null && a !== undefined).length;
  const checkerComplete = answeredCount === redFlagQuestions.length;

  const flaggedItems = redFlagQuestions.filter(q => answers[q.id] === true);
  const highFlags = flaggedItems.filter(q => q.yesImpact === 'high');
  const mediumFlags = flaggedItems.filter(q => q.yesImpact === 'medium');
  const lowFlags = flaggedItems.filter(q => q.yesImpact === 'low');

  const handleAnswer = (questionId: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const resetChecker = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setCheckerStarted(false);
  };

  // ── CSV Export ──────────────────────────────────────────────

  const exportCSV = () => {
    const lines = [
      'QoE Red Flag Report — PE Ready Plus',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      `Total Flags: ${flaggedItems.length} of ${redFlagQuestions.length}`,
      `High Impact: ${highFlags.length}`,
      `Medium Impact: ${mediumFlags.length}`,
      '',
      'Category,Question,Impact,Finding,Preparation Steps',
      ...flaggedItems.map(q =>
        `"${q.category}","${q.question}","${q.yesImpact.toUpperCase()}","${q.yesFinding}","${q.yesPrep}"`
      ),
      '',
      'Clear Items',
      ...redFlagQuestions.filter(q => answers[q.id] === false).map(q =>
        `"${q.category}","${q.question}",CLEAR,"No adjustment expected",""`)
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qoe-red-flag-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Tab Navigation ────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'What is a QoE?', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'adjustments', label: 'Common Adjustments', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'checker', label: 'Red Flag Checker', icon: <FileSearch className="w-4 h-4" /> },
    { id: 'report', label: 'Your Report', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
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
            {tab.id === 'report' && checkerComplete && (
              <span className="ml-1 w-2 h-2 rounded-full bg-green-400" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab 1: Overview ─────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Hero Card */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">What Is a Quality of Earnings Report?</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                A Quality of Earnings (QoE) report is the financial X-ray PE firms order before they write a check.
                It's an independent accounting review that answers one question: <strong className="text-white">"Is this company's EBITDA real?"</strong>
              </p>
              <p className="text-white/70 leading-relaxed mb-4">
                Every PE deal has one. The buyer hires an accounting firm (usually a Big 4 or national firm) to tear through
                your financials and recalculate your EBITDA from scratch. They verify revenue, normalize expenses, identify
                one-time items, and flag risks. The number they land on — <strong className="text-white">adjusted EBITDA</strong> —
                becomes the real basis for your purchase price.
              </p>
              <div className="bg-white/5 rounded-lg p-4 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                  <p className="text-yellow-200/80 text-sm">
                    <strong className="text-yellow-300">Why this matters to you:</strong> The QoE-adjusted EBITDA is almost always different
                    from what you think your EBITDA is. If it comes in lower, your purchase price drops — sometimes by millions.
                    Sellers who prepare for the QoE in advance protect their valuation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost & Who Pays */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <DollarSign className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">What It Costs</h3>
                <p className="text-white/60 text-sm">$50,000 - $150,000+ depending on company size and complexity. The buyer pays for it, but you feel it in the purchase price.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <Clock className="w-8 h-8 text-white mb-3" />
                <h3 className="text-white font-semibold mb-2">How Long It Takes</h3>
                <p className="text-white/60 text-sm">6-12 weeks from start to final report. Expect weekly calls, hundreds of document requests, and follow-up questions.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <Users className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">Who Does It</h3>
                <p className="text-white/60 text-sm">An independent accounting firm hired by the buyer. Deloitte, EY, BDO, Grant Thornton, or regional firms specializing in transaction advisory.</p>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                The QoE Process — What to Expect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {qoeTimeline.map((step, i) => (
                <div key={i} className="flex gap-4 relative">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    {i < qoeTimeline.length - 1 && (
                      <div className="w-px h-full bg-white/10 min-h-[40px]" />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-white font-semibold">{step.phase}</h4>
                      <Badge className="bg-white/10 text-white/60 border-white/20 text-xs">{step.duration}</Badge>
                    </div>
                    <p className="text-white/60 text-sm">{step.description}</p>
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
                  <h3 className="text-white font-semibold mb-2">The #1 Thing Sellers Get Wrong</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Most sellers think their EBITDA is a fixed number. It's not. Your EBITDA is whatever the QoE report says it is.
                    If you tell a buyer your EBITDA is $5M and the QoE comes back at $3.8M, you just lost $6-12M in purchase price
                    (at a 5-6x multiple). The sellers who come out ahead are the ones who run their own internal QoE analysis
                    before going to market — so there are no surprises.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => setActiveTab('adjustments')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              See Common Adjustments <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 2: Common Adjustments ──────────────────────── */}
      {activeTab === 'adjustments' && (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">How QoE Adjustments Work</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                The QoE firm starts with your reported EBITDA and makes adjustments — some in your favor (add-backs),
                some against you (normalization charges). The result is <strong className="text-white">adjusted EBITDA</strong>,
                which becomes the number the deal is priced on. Understanding which adjustments buyers accept, contest,
                and reject is crucial.
              </p>
            </CardContent>
          </Card>

          {commonAdjustments.map((group, i) => (
            <Card key={i} className={`bg-white/5 ${group.borderColor} border`}>
              <CardHeader className="pb-3">
                <CardTitle className={`${group.color} text-lg flex items-center gap-2`}>
                  {group.category === 'Almost Always Accepted' && <CheckCircle2 className="w-5 h-5" />}
                  {group.category === 'Often Contested' && <AlertCircle className="w-5 h-5" />}
                  {group.category === 'Usually Rejected' && <XCircle className="w-5 h-5" />}
                  {group.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {group.items.map((item, j) => (
                  <div key={j} className={`${group.bgColor} rounded-lg p-4`}>
                    <h4 className="text-white font-medium text-sm">{item.name}</h4>
                    <p className="text-white/60 text-xs mt-1">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Bridge Example */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Example: How Adjusted EBITDA Changes the Deal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between text-white/80 py-2 border-b border-white/10">
                  <span>Reported EBITDA</span><span className="text-white font-bold">$5,000,000</span>
                </div>
                <div className="flex justify-between text-green-400/80 py-2 border-b border-white/10">
                  <span>+ Owner excess comp ($400K salary → $200K market)</span><span>+$200,000</span>
                </div>
                <div className="flex justify-between text-green-400/80 py-2 border-b border-white/10">
                  <span>+ Personal expenses (car, travel, memberships)</span><span>+$85,000</span>
                </div>
                <div className="flex justify-between text-green-400/80 py-2 border-b border-white/10">
                  <span>+ One-time lawsuit settlement</span><span>+$150,000</span>
                </div>
                <div className="flex justify-between text-red-400/80 py-2 border-b border-white/10">
                  <span>− Related-party rent (below market by $3K/mo)</span><span>−$36,000</span>
                </div>
                <div className="flex justify-between text-red-400/80 py-2 border-b border-white/10">
                  <span>− Family member overpaid ($120K role, $180K salary)</span><span>−$60,000</span>
                </div>
                <div className="flex justify-between text-red-400/80 py-2 border-b border-white/10">
                  <span>− Cash-to-accrual timing adjustments</span><span>−$175,000</span>
                </div>
                <div className="flex justify-between text-white py-3 border-t-2 border-purple-500/40 mt-2">
                  <span className="font-bold">QoE-Adjusted EBITDA</span><span className="font-bold text-purple-300">$5,164,000</span>
                </div>
                <div className="mt-3 p-3 bg-purple-500/10 rounded-lg">
                  <p className="text-white/70 text-xs">
                    At a 6x multiple, this $164K net adjustment is worth <strong className="text-white">nearly $1M</strong> in purchase price.
                    Now imagine the adjustments go the other way — that's why preparation matters.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              onClick={() => setActiveTab('overview')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              onClick={() => setActiveTab('checker')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Take the Red Flag Checker <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 3: Red Flag Checker ────────────────────────── */}
      {activeTab === 'checker' && (
        <div className="space-y-6">
          {!checkerStarted ? (
            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <CardContent className="p-8 text-center">
                <FileSearch className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-3">QoE Red Flag Checker</h2>
                <p className="text-white/70 max-w-xl mx-auto mb-2">
                  Answer {redFlagQuestions.length} questions about your business and get a personalized report
                  showing what a QoE firm is likely to flag — before they flag it.
                </p>
                <p className="text-white/50 text-sm max-w-xl mx-auto mb-6">
                  This is not a QoE. It's a heads-up so you can prepare. Takes about 5 minutes.
                </p>
                <Button
                  onClick={() => { setCheckerStarted(true); setCurrentQuestion(0); }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                >
                  Start the Checker <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-sm">{answeredCount} / {redFlagQuestions.length}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${(answeredCount / redFlagQuestions.length) * 100}%` }}
                  />
                </div>
                {checkerComplete && (
                  <Button
                    onClick={() => setActiveTab('report')}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    View Report <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {redFlagQuestions.map((q, i) => (
                  <Card
                    key={q.id}
                    className={`border transition-colors ${
                      answers[q.id] === true
                        ? 'bg-red-500/5 border-red-500/30'
                        : answers[q.id] === false
                        ? 'bg-green-500/5 border-green-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-white/10 text-white/50 border-white/20 text-xs">{q.category}</Badge>
                            <Badge className={`text-xs ${
                              q.yesImpact === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : q.yesImpact === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                              : 'bg-white/10 text-white border-white/15'
                            }`}>
                              {q.yesImpact} impact
                            </Badge>
                          </div>
                          <h4 className="text-white font-medium mt-2">{q.question}</h4>
                          <p className="text-white/50 text-sm mt-1">{q.explanation}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleAnswer(q.id, true)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              answers[q.id] === true
                                ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleAnswer(q.id, false)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              answers[q.id] === false
                                ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      {/* Show finding if flagged */}
                      {answers[q.id] === true && (
                        <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-red-300 text-sm font-medium">{q.yesFinding}</p>
                              <p className="text-white/60 text-xs mt-1"><strong className="text-white/80">How to prepare:</strong> {q.yesPrep}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {checkerComplete && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setActiveTab('report')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                  >
                    View Your QoE Preparation Report <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Tab 4: Report ──────────────────────────────────── */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {!checkerComplete ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <FileSearch className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Complete the Red Flag Checker First</h3>
                <p className="text-white/50 mb-4">Answer all {redFlagQuestions.length} questions to generate your personalized QoE preparation report.</p>
                <Button
                  onClick={() => setActiveTab('checker')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Go to Red Flag Checker <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Your QoE Preparation Report</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white">{flaggedItems.length}</div>
                      <div className="text-white/50 text-sm">Total Flags</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-red-400">{highFlags.length}</div>
                      <div className="text-white/50 text-sm">High Impact</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-yellow-400">{mediumFlags.length}</div>
                      <div className="text-white/50 text-sm">Medium Impact</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-green-400">{redFlagQuestions.length - flaggedItems.length}</div>
                      <div className="text-white/50 text-sm">Clear</div>
                    </div>
                  </div>

                  {/* Overall Assessment */}
                  <div className={`mt-6 p-4 rounded-lg border ${
                    highFlags.length >= 3 ? 'bg-red-500/10 border-red-500/30' :
                    highFlags.length >= 1 ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-green-500/10 border-green-500/30'
                  }`}>
                    <h3 className={`font-bold mb-2 ${
                      highFlags.length >= 3 ? 'text-red-300' :
                      highFlags.length >= 1 ? 'text-yellow-300' :
                      'text-green-300'
                    }`}>
                      {highFlags.length >= 3 ? 'Significant Preparation Needed' :
                       highFlags.length >= 1 ? 'Some Preparation Needed' :
                       'You\'re in Good Shape'}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {highFlags.length >= 3
                        ? `You flagged ${highFlags.length} high-impact items. A QoE firm will focus heavily on these areas. Start addressing them now — ideally 6-12 months before going to market. Consider getting your own pre-sale QoE from your CPA.`
                        : highFlags.length >= 1
                        ? `You have ${highFlags.length} high-impact item${highFlags.length > 1 ? 's' : ''} to address. These are manageable with preparation. Work through the preparation steps below and have documentation ready.`
                        : 'Your business looks well-positioned for QoE review. Keep your financials clean and your documentation organized. Focus on the medium-impact items if any are flagged.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Flagged Items Detail */}
              {flaggedItems.length > 0 && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      Items to Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* High impact first, then medium, then low */}
                    {[...highFlags, ...mediumFlags, ...lowFlags].map((q, i) => (
                      <div
                        key={q.id}
                        className={`p-4 rounded-lg border ${
                          q.yesImpact === 'high' ? 'bg-red-500/5 border-red-500/20' :
                          q.yesImpact === 'medium' ? 'bg-yellow-500/5 border-yellow-500/20' :
                          'bg-white/20/5 border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs ${
                            q.yesImpact === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : q.yesImpact === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-white/10 text-white border-white/15'
                          }`}>
                            {q.yesImpact.toUpperCase()}
                          </Badge>
                          <span className="text-white/40 text-xs">{q.category}</span>
                        </div>
                        <h4 className="text-white font-medium text-sm">{q.yesFinding}</h4>
                        <div className="mt-2 flex items-start gap-2">
                          <Shield className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                          <p className="text-white/60 text-xs"><strong className="text-purple-300">Prepare:</strong> {q.yesPrep}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Clear Items */}
              {redFlagQuestions.filter(q => answers[q.id] === false).length > 0 && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white/60 text-base flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      Clear Areas ({redFlagQuestions.filter(q => answers[q.id] === false).length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {redFlagQuestions.filter(q => answers[q.id] === false).map(q => (
                        <div key={q.id} className="flex items-center gap-2 text-sm text-white/50 py-1">
                          <CheckCircle2 className="w-3 h-3 text-green-400/60 shrink-0" />
                          {q.question.replace(/\?$/, '')}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Disclaimer + Actions */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <p className="text-white/40 text-xs mb-4">
                    <strong className="text-white/60">Important:</strong> This is an educational self-assessment, not a Quality of Earnings report.
                    A real QoE is conducted by an independent accounting firm and involves detailed analysis of your general ledger,
                    contracts, bank statements, and other source documents. Use this report to prepare and have informed conversations
                    with your CPA and M&A advisor.
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={exportCSV} className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Download className="w-4 h-4 mr-2" /> Export Report (CSV)
                    </Button>
                    <Button onClick={resetChecker} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Retake Checker
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}
