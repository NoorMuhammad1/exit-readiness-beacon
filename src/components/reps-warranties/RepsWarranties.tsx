import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, ChevronLeft, Download, BookOpen, Shield,
  AlertTriangle, CheckCircle2, XCircle, Scale, FileText,
  Lightbulb, Clock, DollarSign, Users, Building2, Gavel,
  CircleAlert, HelpCircle, ClipboardCheck
} from 'lucide-react';

// ── Storage ─────────────────────────────────────────────────────

const STORAGE_KEY = 'reps-warranties-v1';

type Tab = 'overview' | 'common-reps' | 'checker' | 'report';

interface CheckerAnswer {
  questionId: string;
  answer: 'yes' | 'no' | 'unsure' | null;
}

interface SavedState {
  answers: CheckerAnswer[];
}

// ── Reps Data ──────────────────────────────────────────────────

interface RepCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  type: 'fundamental' | 'general';
  survivalPeriod: string;
  reps: {
    name: string;
    description: string;
    risk: 'high' | 'medium' | 'low';
    whatPELooksFor: string;
  }[];
}

const repCategories: RepCategory[] = [
  {
    id: 'financial',
    name: 'Financial Accuracy',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'green',
    type: 'fundamental',
    survivalPeriod: 'Survives indefinitely or until statute of limitations',
    reps: [
      {
        name: 'Financial Statements Are Accurate',
        description: 'You\'re promising your books are correct — revenue, expenses, assets, liabilities. If adjusted EBITDA turns out to be $500K less than represented, that\'s a breach.',
        risk: 'high',
        whatPELooksFor: 'Discrepancies between tax returns and financials, unusual journal entries, revenue recognition timing'
      },
      {
        name: 'No Undisclosed Liabilities',
        description: 'There are no debts, obligations, or pending expenses you haven\'t told the buyer about. Surprise liabilities post-close are the #1 cause of indemnity claims.',
        risk: 'high',
        whatPELooksFor: 'Off-balance-sheet commitments, personal guarantees, deferred revenue obligations, pending vendor disputes'
      },
      {
        name: 'Tax Returns Are Accurate',
        description: 'All tax returns are correct and complete. No outstanding audits, disputes, or unpaid tax obligations.',
        risk: 'high',
        whatPELooksFor: 'Aggressive tax positions, state tax nexus issues, payroll tax compliance, sales tax collection'
      },
    ]
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    icon: <Gavel className="w-5 h-5" />,
    color: 'blue',
    type: 'fundamental',
    survivalPeriod: 'Survives indefinitely or until statute of limitations',
    reps: [
      {
        name: 'No Pending or Threatened Litigation',
        description: 'No lawsuits, claims, or government investigations pending or threatened. Includes demand letters you\'ve received but haven\'t acted on.',
        risk: 'high',
        whatPELooksFor: 'Employment claims, customer disputes, IP challenges, environmental claims, regulatory investigations'
      },
      {
        name: 'Compliance with Laws',
        description: 'The business operates in compliance with all applicable laws, regulations, permits, and licenses.',
        risk: 'medium',
        whatPELooksFor: 'Industry-specific regulations, environmental permits, data privacy compliance (CCPA, HIPAA), workplace safety'
      },
      {
        name: 'Valid Organization & Authority',
        description: 'The company is properly incorporated/organized, in good standing, and the person signing has authority to sell.',
        risk: 'low',
        whatPELooksFor: 'Corporate governance records, meeting minutes, bylaws, operating agreements'
      },
    ]
  },
  {
    id: 'contracts',
    name: 'Contracts & Agreements',
    icon: <FileText className="w-5 h-5" />,
    color: 'purple',
    type: 'general',
    survivalPeriod: '12-24 months post-close',
    reps: [
      {
        name: 'Material Contracts Are Valid',
        description: 'All important contracts (customer, vendor, lease, employment) are in effect, not in default, and won\'t be terminated by the sale.',
        risk: 'high',
        whatPELooksFor: 'Change-of-control clauses that let customers walk, key vendor concentration, below-market leases expiring soon'
      },
      {
        name: 'No Restrictive Covenants Violated',
        description: 'You haven\'t violated any non-compete, non-solicitation, or exclusivity agreements that could affect the business.',
        risk: 'medium',
        whatPELooksFor: 'Prior employment agreements, franchise restrictions, exclusive distribution deals, territorial limitations'
      },
    ]
  },
  {
    id: 'employees',
    name: 'Employees & Benefits',
    icon: <Users className="w-5 h-5" />,
    color: 'yellow',
    type: 'general',
    survivalPeriod: '12-24 months post-close',
    reps: [
      {
        name: 'Employee Classification Is Correct',
        description: 'All workers are properly classified as employees or independent contractors. Misclassification creates massive back-tax liability.',
        risk: 'high',
        whatPELooksFor: '1099 contractors doing employee-like work, state-specific classification tests, gig workers'
      },
      {
        name: 'Benefits Plans Are Compliant',
        description: 'All employee benefit plans (401k, health, equity) comply with ERISA and tax rules. No unfunded pension obligations.',
        risk: 'medium',
        whatPELooksFor: 'Plan administration errors, COBRA compliance, ACA reporting, discrimination testing failures'
      },
      {
        name: 'Key Employee Retention',
        description: 'Key employees intend to stay post-close. No agreements or circumstances that would cause critical departures.',
        risk: 'medium',
        whatPELooksFor: 'Owner-dependent operations, key person flight risk, non-compete gaps in employment agreements'
      },
    ]
  },
  {
    id: 'ip',
    name: 'Intellectual Property',
    icon: <Shield className="w-5 h-5" />,
    color: 'cyan',
    type: 'general',
    survivalPeriod: '12-24 months post-close',
    reps: [
      {
        name: 'Company Owns Its IP',
        description: 'All intellectual property (software, trademarks, patents, trade secrets) is owned by the company, not by individual founders or contractors.',
        risk: 'high',
        whatPELooksFor: 'Work-for-hire agreements with developers, trademark registrations, patent assignments, open-source contamination'
      },
      {
        name: 'No IP Infringement',
        description: 'The business doesn\'t infringe on anyone else\'s intellectual property, and no one is infringing on yours.',
        risk: 'medium',
        whatPELooksFor: 'Cease-and-desist history, competitor patent landscape, licensing compliance, software audit readiness'
      },
    ]
  },
  {
    id: 'property',
    name: 'Property & Assets',
    icon: <Building2 className="w-5 h-5" />,
    color: 'orange',
    type: 'general',
    survivalPeriod: '12-24 months post-close',
    reps: [
      {
        name: 'Assets Are in Good Condition',
        description: 'Physical assets (equipment, vehicles, inventory) are in working condition and suitable for current operations.',
        risk: 'low',
        whatPELooksFor: 'Deferred maintenance, asset age vs. useful life, replacement capex needed, inventory obsolescence'
      },
      {
        name: 'Environmental Compliance',
        description: 'The business hasn\'t caused environmental contamination and complies with all environmental regulations.',
        risk: 'medium',
        whatPELooksFor: 'Phase I/II environmental assessments, hazardous materials handling, underground storage tanks, prior site contamination'
      },
    ]
  },
];

// ── Checker Questions ──────────────────────────────────────────

interface CheckerQuestion {
  id: string;
  question: string;
  category: string;
  riskIfYes: 'high' | 'medium' | 'low';
  riskIfUnsure: 'high' | 'medium';
  explanation: string;
  action: string;
}

const checkerQuestions: CheckerQuestion[] = [
  {
    id: 'q1',
    question: 'Have your financial statements ever been adjusted or restated?',
    category: 'Financial',
    riskIfYes: 'high',
    riskIfUnsure: 'high',
    explanation: 'Restatements signal potential inaccuracy. The buyer will scrutinize every adjustment and may use it to renegotiate price.',
    action: 'Have your CPA prepare a reconciliation explaining every restatement with supporting documentation.'
  },
  {
    id: 'q2',
    question: 'Do you have any pending lawsuits, claims, or government investigations?',
    category: 'Legal',
    riskIfYes: 'high',
    riskIfUnsure: 'high',
    explanation: 'Active litigation creates contingent liability. The buyer will want to understand exposure and may require a specific indemnity or escrow carve-out.',
    action: 'Get a litigation status report from your attorney. Quantify maximum exposure for each pending matter.'
  },
  {
    id: 'q3',
    question: 'Are any of your workers classified as independent contractors (1099)?',
    category: 'Employees',
    riskIfYes: 'medium',
    riskIfUnsure: 'medium',
    explanation: 'Misclassified contractors are a ticking time bomb. If the IRS or state reclassifies them, the company owes back payroll taxes, benefits, and penalties.',
    action: 'Have an employment attorney review every 1099 relationship against the IRS 20-factor test and your state\'s ABC test.'
  },
  {
    id: 'q4',
    question: 'Do any key customer or vendor contracts have "change of control" clauses?',
    category: 'Contracts',
    riskIfYes: 'high',
    riskIfUnsure: 'high',
    explanation: 'Change-of-control clauses let the other party terminate the contract when ownership changes. If your top customer can walk, that\'s a deal issue.',
    action: 'Review every material contract for change-of-control, assignment, and consent provisions. Start conversations with key parties early.'
  },
  {
    id: 'q5',
    question: 'Does any single customer account for more than 20% of your revenue?',
    category: 'Financial',
    riskIfYes: 'medium',
    riskIfUnsure: 'medium',
    explanation: 'Customer concentration is a fundamental risk. If that customer leaves post-close, the buyer\'s investment thesis collapses. Expect a specific rep about customer relationships.',
    action: 'Document the relationship history, contract terms, and renewal probability. Consider diversification before going to market.'
  },
  {
    id: 'q6',
    question: 'Was any software, code, or IP created by contractors without work-for-hire agreements?',
    category: 'IP',
    riskIfYes: 'high',
    riskIfUnsure: 'high',
    explanation: 'Without a work-for-hire or assignment agreement, the contractor may own the IP — not your company. This can derail a deal entirely.',
    action: 'Get retroactive IP assignment agreements signed by every contractor who contributed to company IP. Your attorney should draft these.'
  },
  {
    id: 'q7',
    question: 'Do you run any personal expenses through the business?',
    category: 'Financial',
    riskIfYes: 'medium',
    riskIfUnsure: 'medium',
    explanation: 'Personal expenses mixed with business expenses make your financials unreliable. The QoE firm will strip these out, but they also signal governance issues.',
    action: 'Stop immediately. Document every personal expense for the past 3 years so adjustments are transparent.'
  },
  {
    id: 'q8',
    question: 'Are there any environmental concerns at your business locations?',
    category: 'Property',
    riskIfYes: 'high',
    riskIfUnsure: 'high',
    explanation: 'Environmental contamination liability can follow a property forever. The buyer will require environmental reps and may demand a Phase I or Phase II assessment.',
    action: 'Commission a Phase I Environmental Site Assessment before going to market. It\'s cheaper to know than to be surprised.'
  },
  {
    id: 'q9',
    question: 'Are there any outstanding or disputed tax positions?',
    category: 'Financial',
    riskIfYes: 'high',
    riskIfUnsure: 'high',
    explanation: 'Unresolved tax issues are a direct liability the buyer inherits (in a stock deal) or that reduce your net proceeds. State nexus issues are especially common.',
    action: 'Have your CPA review all open tax years and document any aggressive positions. Resolve disputes before going to market if possible.'
  },
  {
    id: 'q10',
    question: 'Would the business struggle to operate if you (the owner) stepped away for 3 months?',
    category: 'Employees',
    riskIfYes: 'medium',
    riskIfUnsure: 'medium',
    explanation: 'Owner-dependent businesses are riskier. PE firms will require transition support reps and may tie earnout payments to your continued involvement.',
    action: 'Start delegating now. Document key processes. Build a management layer that can run without you.'
  },
  {
    id: 'q11',
    question: 'Have you ever received a cease-and-desist letter related to IP, trademarks, or patents?',
    category: 'IP',
    riskIfYes: 'high',
    riskIfUnsure: 'medium',
    explanation: 'Even resolved C&D letters must be disclosed. Ongoing infringement risk can trigger indemnity claims or require costly licensing.',
    action: 'Compile all IP correspondence. Have your IP attorney assess current risk and clearance status.'
  },
  {
    id: 'q12',
    question: 'Are any of your key employees missing non-compete or non-solicitation agreements?',
    category: 'Employees',
    riskIfYes: 'medium',
    riskIfUnsure: 'medium',
    explanation: 'Without restrictive covenants, key employees can leave and take customers, trade secrets, or start a competing business. PE firms consider this a major risk.',
    action: 'Have employment agreements reviewed and updated. New agreements may need consideration (bonuses, promotions) to be enforceable.'
  },
  {
    id: 'q13',
    question: 'Do you have any related-party transactions (deals with family members, companies you own)?',
    category: 'Financial',
    riskIfYes: 'medium',
    riskIfUnsure: 'medium',
    explanation: 'Related-party transactions are scrutinized heavily in QoE. The buyer needs to know if arm\'s-length pricing was used and whether these relationships continue post-close.',
    action: 'List every related-party transaction. Document that terms are at market rates. Plan for how these will be handled post-close.'
  },
  {
    id: 'q14',
    question: 'Is your data privacy and cybersecurity program documented and current?',
    category: 'Legal',
    riskIfYes: 'low',
    riskIfUnsure: 'medium',
    explanation: 'Data breaches post-close trigger indemnity claims under data privacy reps. CCPA, HIPAA, GDPR — the buyer wants to know you\'re compliant.',
    action: 'Document your privacy policy, data handling procedures, and security measures. Consider a third-party security assessment.'
  },
  {
    id: 'q15',
    question: 'Are there any handshake deals, verbal agreements, or undocumented arrangements with customers or vendors?',
    category: 'Contracts',
    riskIfYes: 'medium',
    riskIfUnsure: 'medium',
    explanation: 'Undocumented agreements can\'t be repped. If the buyer discovers them post-close, you\'ve got an accuracy problem. Verbal deals also create uncertainty about what transfers.',
    action: 'Formalize every material business relationship in writing before the deal process starts.'
  },
];

// ── Main Component ──────────────────────────────────────────────

export function RepsWarranties() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [answers, setAnswers] = useState<CheckerAnswer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: SavedState = JSON.parse(saved);
        return parsed.answers || checkerQuestions.map(q => ({ questionId: q.id, answer: null }));
      } catch {
        return checkerQuestions.map(q => ({ questionId: q.id, answer: null }));
      }
    }
    return checkerQuestions.map(q => ({ questionId: q.id, answer: null }));
  });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    const state: SavedState = { answers };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [answers]);

  const setAnswer = (questionId: string, answer: 'yes' | 'no' | 'unsure') => {
    setAnswers(prev => prev.map(a => a.questionId === questionId ? { ...a, answer } : a));
  };

  // ── Report Calculations ──────────────────────────────────

  const answeredQuestions = answers.filter(a => a.answer !== null);
  const totalAnswered = answeredQuestions.length;

  const flaggedItems = answeredQuestions.filter(a => {
    const q = checkerQuestions.find(qq => qq.id === a.questionId)!;
    return (a.answer === 'yes') || (a.answer === 'unsure');
  }).map(a => {
    const q = checkerQuestions.find(qq => qq.id === a.questionId)!;
    const risk = a.answer === 'yes' ? q.riskIfYes : q.riskIfUnsure;
    return { ...q, answer: a.answer!, risk };
  });

  const clearItems = answeredQuestions.filter(a => a.answer === 'no').map(a => {
    const q = checkerQuestions.find(qq => qq.id === a.questionId)!;
    return q;
  });

  const highRiskCount = flaggedItems.filter(f => f.risk === 'high').length;
  const mediumRiskCount = flaggedItems.filter(f => f.risk === 'medium').length;
  const lowRiskCount = flaggedItems.filter(f => f.risk === 'low').length;

  const getOverallRisk = () => {
    if (highRiskCount >= 3) return { level: 'High Exposure', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
    if (highRiskCount >= 1 || mediumRiskCount >= 3) return { level: 'Moderate Exposure', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' };
    if (mediumRiskCount >= 1) return { level: 'Low Exposure', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };
    return { level: 'Clean', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' };
  };

  // ── CSV Export ─────────────────────────────────────────────

  const exportCSV = () => {
    const lines = [
      'Reps & Warranties Exposure Report — PE Ready Plus',
      `Generated: ${new Date().toLocaleDateString()}`,
      `Questions Answered: ${totalAnswered} of ${checkerQuestions.length}`,
      `Overall Assessment: ${getOverallRisk().level}`,
      '',
      'FLAGGED ITEMS',
      'Question,Category,Answer,Risk Level,Explanation,Action Step',
      ...flaggedItems.map(f =>
        `"${f.question}",${f.category},${f.answer},${f.risk},"${f.explanation}","${f.action}"`
      ),
      '',
      'CLEAR ITEMS',
      'Question,Category',
      ...clearItems.map(c => `"${c.question}",${c.category}`),
      '',
      'DISCUSSION GUIDE FOR YOUR M&A ATTORNEY',
      '"Review all flagged items above with your deal attorney"',
      '"Ask about knowledge qualifiers vs flat reps for each area"',
      '"Discuss R&W insurance to reduce escrow holdback"',
      '"Negotiate survival periods — shorter is better for sellers"',
      '"Understand the basket/cap/escrow structure in the LOI"',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reps-warranties-exposure-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Tabs ──────────────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'What Are R&Ws?', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'common-reps', label: 'Common Reps', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'checker', label: 'Exposure Checker', icon: <Shield className="w-4 h-4" /> },
    { id: 'report', label: 'Your Report', icon: <FileText className="w-4 h-4" /> },
  ];

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
          </button>
        ))}
      </div>

      {/* ── Tab 1: Overview ─────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Your Legally Binding Promises About the Business</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                When you sell your company, you don't just hand over the keys and walk away. You sign a
                <strong className="text-white"> Purchase Agreement</strong> that includes dozens of
                <strong className="text-white"> representations and warranties</strong> — legal promises
                about the condition and history of your business.
              </p>
              <p className="text-white/70 leading-relaxed">
                If any of those promises turn out to be wrong — even unintentionally — you could owe the buyer
                money after closing. Understanding what you're promising, and how to protect yourself, is one of
                the most important parts of the deal.
              </p>
            </CardContent>
          </Card>

          {/* Reps vs Warranties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-400 text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Representations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-sm leading-relaxed">
                  Statements of <strong className="text-white">fact</strong> about the current state of your business.
                  "Our financial statements are accurate." "We have no pending lawsuits."
                  "We own all our intellectual property." These are backward-looking — describing what IS true today.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-green-500/5 border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-400 text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Warranties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-sm leading-relaxed">
                  <strong className="text-white">Promises</strong> that certain things will remain true going forward.
                  "We will operate the business in the ordinary course between signing and closing."
                  "No material changes will occur." These are forward-looking and create ongoing obligations.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Why They Matter */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Why This Matters: The Money After the Money</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">
                    Here's the part nobody talks about until it's too late. When you close the deal and get your
                    check, <strong className="text-white">5-15% of the purchase price</strong> is typically held back
                    in an <strong className="text-white">escrow account</strong> for 12-24 months. That money protects
                    the buyer in case one of your representations turns out to be wrong.
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    If the buyer discovers a breach — an undisclosed liability, a tax issue, a customer who walks
                    because of a contract you didn't mention — they can claim against the escrow. On a $20M deal,
                    that's <strong className="text-white">$1M-$3M</strong> sitting in an account you can't touch until
                    the survival period expires.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fundamental vs General */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Two Types of Reps — Different Survival Periods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20">
                  <h4 className="text-red-300 font-semibold text-sm mb-2">Fundamental Reps</h4>
                  <p className="text-white/60 text-xs leading-relaxed mb-2">
                    The "big ones" — financial accuracy, ownership/authority, tax compliance, legal standing.
                    These survive <strong className="text-white">indefinitely</strong> or until the statute of limitations expires.
                    The buyer can come after you for years.
                  </p>
                  <div className="text-red-400/60 text-xs font-mono">Survival: Indefinite / Statute of Limitations</div>
                </div>
                <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
                  <h4 className="text-blue-300 font-semibold text-sm mb-2">General Reps</h4>
                  <p className="text-white/60 text-xs leading-relaxed mb-2">
                    Everything else — contracts, employees, IP, assets, environmental. These expire after
                    <strong className="text-white"> 12-24 months</strong> post-close. Once the survival period
                    ends, the buyer can no longer make claims.
                  </p>
                  <div className="text-blue-400/60 text-xs font-mono">Survival: 12-24 months post-close</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Protection Mechanisms */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-400" />
                How Sellers Protect Themselves
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: 'Knowledge Qualifiers',
                    description: '"To the best of seller\'s knowledge" is very different from a flat rep. A knowledge qualifier means you\'re only promising what you actually know — not guaranteeing things you couldn\'t reasonably discover.',
                    tip: 'Push for knowledge qualifiers on every rep where you can. "The seller represents that, to its knowledge, there are no pending claims" is much safer than "there are no pending claims."'
                  },
                  {
                    title: 'Basket / Deductible',
                    description: 'The buyer can\'t claim for every $500 issue. The "basket" sets a minimum threshold — typically 0.5-1% of deal value. The buyer must accumulate losses above this threshold before making a claim.',
                    tip: 'On a $20M deal, a 1% basket means the buyer needs $200K+ in losses before they can claim. Negotiate for a "true deductible" basket, not a "tipping" basket.'
                  },
                  {
                    title: 'Cap on Liability',
                    description: 'Your maximum exposure from rep breaches is capped — typically 10-20% of the purchase price for general reps. Fundamental reps may be capped at the full purchase price.',
                    tip: 'The cap is one of the most negotiated terms. Lower is better for sellers. Push for separate caps on general vs. fundamental reps.'
                  },
                  {
                    title: 'R&W Insurance (RWI)',
                    description: 'A policy that covers rep breaches. Costs 2-4% of the coverage limit. The buyer (or seller) buys the policy, and indemnity claims go to the insurer instead of the seller\'s escrow.',
                    tip: 'RWI is increasingly common in PE deals. It can reduce your escrow holdback to 0.5-1% of deal value instead of the typical 10-15%. Ask about it early.'
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-black/20 rounded-lg p-4">
                    <h4 className="text-white font-medium text-sm mb-1">{item.title}</h4>
                    <p className="text-white/60 text-xs leading-relaxed mb-2">{item.description}</p>
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-3 h-3 text-yellow-400 mt-0.5 shrink-0" />
                      <p className="text-yellow-300/70 text-xs">{item.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sandbagging */}
          <Card className="bg-yellow-500/5 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CircleAlert className="w-6 h-6 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-yellow-300 font-semibold mb-2">Sandbagging — The Concept That Surprises Every Seller</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">
                    Can the buyer sue you for a rep breach they <em>knew about</em> before closing? In many states,
                    <strong className="text-white"> yes</strong>. This is called "sandbagging." The buyer discovers
                    a problem during due diligence, says nothing, closes the deal, and then files an indemnity claim.
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Some purchase agreements include a <strong className="text-white">"pro-sandbagging" clause</strong>
                    (buyer can claim regardless of prior knowledge) or an <strong className="text-white">"anti-sandbagging" clause</strong>
                    (buyer can't claim for things they knew about). This is a key negotiation point — make sure your
                    attorney addresses it.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => setActiveTab('common-reps')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              See Common Reps <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 2: Common Reps ──────────────────────────────── */}
      {activeTab === 'common-reps' && (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">What You'll Be Promising</h2>
              <p className="text-white/60 text-sm">
                These are the standard rep categories in a PE purchase agreement. Click any category to see
                the specific representations, risk levels, and what the buyer's team will be looking for.
              </p>
            </CardContent>
          </Card>

          {/* Summary Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Card className="bg-red-500/5 border-red-500/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-red-400">
                  {repCategories.filter(c => c.type === 'fundamental').length}
                </div>
                <div className="text-white/40 text-xs">Fundamental (survive indefinitely)</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {repCategories.filter(c => c.type === 'general').length}
                </div>
                <div className="text-white/40 text-xs">General (12-24 month survival)</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-white">
                  {repCategories.reduce((sum, c) => sum + c.reps.length, 0)}
                </div>
                <div className="text-white/40 text-xs">Total representations</div>
              </CardContent>
            </Card>
          </div>

          {/* Category Cards */}
          {repCategories.map(category => {
            const isExpanded = expandedCategory === category.id;
            const colorMap: Record<string, string> = {
              green: 'border-green-500/20 bg-green-500/5',
              blue: 'border-blue-500/20 bg-blue-500/5',
              purple: 'border-purple-500/20 bg-purple-500/5',
              yellow: 'border-yellow-500/20 bg-yellow-500/5',
              cyan: 'border-cyan-500/20 bg-cyan-500/5',
              orange: 'border-orange-500/20 bg-orange-500/5',
            };
            const textColorMap: Record<string, string> = {
              green: 'text-green-400',
              blue: 'text-blue-400',
              purple: 'text-purple-400',
              yellow: 'text-yellow-400',
              cyan: 'text-cyan-400',
              orange: 'text-orange-400',
            };

            return (
              <Card key={category.id} className={colorMap[category.color] || 'bg-white/5 border-white/10'}>
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    className="w-full p-5 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={textColorMap[category.color]}>{category.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-semibold text-sm">{category.name}</h3>
                          <Badge className={`text-xs ${
                            category.type === 'fundamental'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}>
                            {category.type === 'fundamental' ? 'Fundamental' : 'General'}
                          </Badge>
                        </div>
                        <div className="text-white/40 text-xs mt-0.5">{category.survivalPeriod}</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-white/30 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-3 border-t border-white/5 pt-4">
                      {category.reps.map((rep, i) => (
                        <div key={i} className="bg-black/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-white font-medium text-sm">{rep.name}</h4>
                            <Badge className={`text-xs ${
                              rep.risk === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                              rep.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                              'bg-green-500/20 text-green-400 border-green-500/30'
                            }`}>
                              {rep.risk} risk
                            </Badge>
                          </div>
                          <p className="text-white/60 text-xs leading-relaxed mb-2">{rep.description}</p>
                          <div className="flex items-start gap-2">
                            <HelpCircle className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
                            <p className="text-purple-300/70 text-xs"><strong>What PE looks for:</strong> {rep.whatPELooksFor}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

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
              Check Your Exposure <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 3: Exposure Checker ─────────────────────────── */}
      {activeTab === 'checker' && (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">What Are You Promising? — Exposure Checker</h2>
              <p className="text-white/60 text-sm">
                Answer each question honestly. "Yes" or "Unsure" flags areas where you may have rep exposure.
                "No" means you're likely clean in that area. Your results feed into a personalized report.
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1 text-white/40">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span> Answered: {totalAnswered}
                </span>
                <span className="flex items-center gap-1 text-white/40">
                  <span className="w-2 h-2 rounded-full bg-white/20"></span> Remaining: {checkerQuestions.length - totalAnswered}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Progress Bar */}
          <div className="w-full bg-white/5 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(totalAnswered / checkerQuestions.length) * 100}%` }}
            />
          </div>

          {/* Questions */}
          {checkerQuestions.map((q, i) => {
            const currentAnswer = answers.find(a => a.questionId === q.id)?.answer;
            return (
              <Card key={q.id} className={`border transition-colors ${
                currentAnswer === 'yes' ? 'bg-red-500/5 border-red-500/20' :
                currentAnswer === 'unsure' ? 'bg-yellow-500/5 border-yellow-500/20' :
                currentAnswer === 'no' ? 'bg-green-500/5 border-green-500/20' :
                'bg-white/5 border-white/10'
              }`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-white/30 font-mono text-sm mt-0.5">{i + 1}.</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium mb-1">{q.question}</p>
                      <div className="text-white/40 text-xs mb-3">Category: {q.category}</div>

                      <div className="flex gap-2">
                        {(['yes', 'no', 'unsure'] as const).map(option => (
                          <button
                            key={option}
                            onClick={() => setAnswer(q.id, option)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              currentAnswer === option
                                ? option === 'yes' ? 'bg-red-500/30 text-red-300 border border-red-500/50' :
                                  option === 'no' ? 'bg-green-500/30 text-green-300 border border-green-500/50' :
                                  'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {option === 'yes' ? 'Yes' : option === 'no' ? 'No' : 'Not Sure'}
                          </button>
                        ))}
                      </div>

                      {/* Show explanation when flagged */}
                      {(currentAnswer === 'yes' || currentAnswer === 'unsure') && (
                        <div className={`mt-3 p-3 rounded-lg ${
                          currentAnswer === 'yes' ? 'bg-red-500/10 border border-red-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'
                        }`}>
                          <p className="text-white/60 text-xs leading-relaxed mb-2">{q.explanation}</p>
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
                            <p className="text-purple-300/70 text-xs"><strong>Action:</strong> {q.action}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-between">
            <Button
              onClick={() => setActiveTab('common-reps')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              onClick={() => setActiveTab('report')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              See Your Report <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 4: Report ──────────────────────────────────── */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {totalAnswered === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No Answers Yet</h3>
                <p className="text-white/50 text-sm mb-4">
                  Complete the Exposure Checker to see your personalized report.
                </p>
                <Button
                  onClick={() => setActiveTab('checker')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Start the Checker
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Overall Assessment */}
              <Card className={`border ${getOverallRisk().bg}`}>
                <CardContent className="p-6 text-center">
                  <div className="text-white/50 text-sm mb-1">Overall Rep & Warranty Exposure</div>
                  <div className={`text-3xl font-bold ${getOverallRisk().color}`}>
                    {getOverallRisk().level}
                  </div>
                  <div className="text-white/40 text-xs mt-2">
                    Based on {totalAnswered} of {checkerQuestions.length} questions answered
                  </div>
                </CardContent>
              </Card>

              {/* Risk Summary */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-red-500/5 border-red-500/20">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-red-400">{highRiskCount}</div>
                    <div className="text-white/40 text-xs">High Risk</div>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-500/5 border-yellow-500/20">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{mediumRiskCount}</div>
                    <div className="text-white/40 text-xs">Medium Risk</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">{clearItems.length}</div>
                    <div className="text-white/40 text-xs">Clear</div>
                  </CardContent>
                </Card>
              </div>

              {/* Flagged Items */}
              {flaggedItems.length > 0 && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      Flagged Items — Discuss with Your Attorney
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {flaggedItems
                      .sort((a, b) => {
                        const order = { high: 0, medium: 1, low: 2 };
                        return order[a.risk] - order[b.risk];
                      })
                      .map((item, i) => (
                      <div key={i} className={`rounded-lg p-4 border ${
                        item.risk === 'high' ? 'bg-red-500/5 border-red-500/20' :
                        item.risk === 'medium' ? 'bg-yellow-500/5 border-yellow-500/20' :
                        'bg-blue-500/5 border-blue-500/20'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white text-sm font-medium">{item.question}</span>
                          <Badge className={`text-xs ${
                            item.risk === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            item.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}>
                            {item.risk}
                          </Badge>
                          <Badge className="bg-white/5 text-white/40 border-white/10 text-xs">
                            {item.answer === 'yes' ? 'Yes' : 'Not Sure'}
                          </Badge>
                        </div>
                        <p className="text-white/50 text-xs mb-2">{item.explanation}</p>
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
                          <p className="text-purple-300/70 text-xs">{item.action}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Clear Items */}
              {clearItems.length > 0 && (
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-green-400 text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Clear Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {clearItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 py-1">
                          <CheckCircle2 className="w-4 h-4 text-green-400/60 shrink-0" />
                          <span className="text-white/60 text-sm">{item.question}</span>
                          <Badge className="bg-white/5 text-white/30 border-white/10 text-xs ml-auto">{item.category}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Attorney Discussion Guide */}
              <Card className="bg-purple-500/5 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-300 text-lg flex items-center gap-2">
                    <Gavel className="w-5 h-5" />
                    Discussion Guide for Your M&A Attorney
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'Review all flagged items above — these are your likely negotiation points in the purchase agreement.',
                      'Ask about knowledge qualifiers vs. flat reps for each area of exposure. "To the best of seller\'s knowledge" protects you significantly.',
                      'Discuss R&W Insurance (RWI) — it can reduce your escrow holdback from 10-15% to under 1% of deal value.',
                      'Negotiate survival periods — shorter is better for sellers. Push for 12 months on general reps.',
                      'Understand the basket/cap/escrow structure proposed in the LOI. A true deductible basket is better than a tipping basket.',
                      'Address sandbagging — push for an anti-sandbagging clause so the buyer can\'t claim for things they knew about before closing.',
                      'Get a disclosure schedule started early — everything you disclose properly is excluded from your reps.',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 py-1">
                        <span className="text-purple-400/60 font-mono text-xs mt-0.5">{i + 1}.</span>
                        <p className="text-white/60 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer + Export */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <p className="text-white/40 text-xs mb-4">
                    <strong className="text-white/60">Important:</strong> This is educational content, not legal advice.
                    Representations and warranties are complex legal provisions that vary by deal, jurisdiction, and
                    industry. Work with an experienced M&A attorney who specializes in private equity transactions.
                    The flagged items above are starting points for discussion, not legal conclusions.
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={exportCSV} className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Download className="w-4 h-4 mr-2" /> Export Report (CSV)
                    </Button>
                    <Button
                      onClick={() => {
                        setAnswers(checkerQuestions.map(q => ({ questionId: q.id, answer: null })));
                      }}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Reset Answers
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
