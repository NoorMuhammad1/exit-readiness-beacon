import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText, AlertTriangle, CheckCircle2, Shield, Scale,
  ChevronRight, Download, Lightbulb, DollarSign, Clock,
  Target, XCircle, ArrowRight, Lock, BookOpen, Gavel
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────

interface Clause {
  id: string;
  number: number;
  name: string;
  costRange: string;
  severity: 'high' | 'medium' | 'low';
  whatItMeans: string;
  whyItCostsYou: string;
  marketTerms: string;
  buyerWants: string;
  sellerShouldPushFor: string;
  negotiationTip: string;
}

interface CheckQuestion {
  id: string;
  clauseId: string;
  question: string;
  goodAnswer: string;
  badSign: string;
}

interface CheckAnswers {
  [questionId: string]: 'yes' | 'no' | null;
}

// ── The 15 Clauses ──────────────────────────────────────────────

const clauses: Clause[] = [
  {
    id: 'escrow', number: 1, name: 'Escrow Holdback', costRange: '$2M-$6M on a $40M deal',
    severity: 'high',
    whatItMeans: 'A portion of the purchase price is held in a third-party escrow account after closing. The buyer can make claims against it for any breach of your representations or warranties.',
    whyItCostsYou: 'That money sits untouchable for 12-18 months. If the buyer finds anything — even minor issues — they can claim against your escrow. You\'ll spend $50-100K in legal fees just to get YOUR money released.',
    marketTerms: '5-10% of purchase price, 12-15 months. Anything above 10% or beyond 18 months is aggressive.',
    buyerWants: '15% for 24 months with a broad claim threshold.',
    sellerShouldPushFor: '5-7% for 12 months with a true deductible basket. Better yet: R&W insurance to reduce or eliminate escrow.',
    negotiationTip: 'R&W insurance costs 2-3% of coverage and can reduce your escrow to 1-2%. On a $40M deal, paying $200K for insurance to free up $4M in escrow is the best trade you\'ll make.'
  },
  {
    id: 'indemnification-cap', number: 2, name: 'Indemnification Cap', costRange: '$4M-$10M exposure on a $40M deal',
    severity: 'high',
    whatItMeans: 'The maximum amount you can be liable for if you breach a representation or warranty. This is your total post-close financial exposure.',
    whyItCostsYou: 'A cap set at 100% of the purchase price means you could theoretically give back everything you were paid. Even a 20% cap on a $40M deal is $8M of exposure.',
    marketTerms: 'General cap: 10-15% of purchase price. Fundamental reps (title, authority, taxes): 100% of purchase price. Fraud: unlimited.',
    buyerWants: '25-50% cap on general reps, 100% on everything else.',
    sellerShouldPushFor: '10% cap on general reps, with fundamental reps limited to 50-75% of purchase price. Fraud carve-out is standard and expected.',
    negotiationTip: 'The distinction between "general" and "fundamental" reps is where the real negotiation happens. Push to keep the list of fundamental reps narrow: title, authority, capitalization, taxes. Everything else should be general.'
  },
  {
    id: 'basket', number: 3, name: 'Basket / Deductible', costRange: '$500K-$2M difference',
    severity: 'high',
    whatItMeans: 'The threshold of losses before the seller has to start paying. Think of it like a deductible on insurance.',
    whyItCostsYou: 'There are two types: a "tipping basket" (once claims exceed the threshold, you owe from dollar one) and a "true deductible" (you only owe the amount above the threshold). The difference on a $2M claim with a $500K basket: $2M vs $1.5M.',
    marketTerms: 'Basket: 0.5-1% of purchase price. True deductible is more seller-friendly than tipping basket.',
    buyerWants: 'Tipping basket at 0.25-0.5% of deal value.',
    sellerShouldPushFor: 'True deductible at 0.75-1% of deal value. Every dollar below the deductible is the buyer\'s problem, not yours.',
    negotiationTip: 'Never accept a tipping basket without a fight. The difference between tipping and true deductible can be worth $500K+ on a single claim. This is one of the most negotiated terms in any deal.'
  },
  {
    id: 'survival', number: 4, name: 'Survival Periods', costRange: 'Extends your risk by months or years',
    severity: 'medium',
    whatItMeans: 'How long after closing the buyer can bring claims against you for breaches of specific representations.',
    whyItCostsYou: 'Longer survival = longer exposure. If your reps survive for 24 months instead of 12, the buyer has twice as long to find something wrong and come after your escrow or indemnification.',
    marketTerms: 'General reps: 12-18 months. Tax and employee reps: until statute of limitations expires. Fundamental reps: 3-6 years.',
    buyerWants: '24 months for general reps, statute of limitations for everything else.',
    sellerShouldPushFor: '12 months for general reps (aligned with escrow release), statute of limitations only for tax reps, 3 years for fundamental reps.',
    negotiationTip: 'Align your escrow release with your rep survival periods. If general reps survive 12 months, the escrow should release at 12 months. Don\'t let the buyer keep your money after the claim window closes.'
  },
  {
    id: 'sandbagging', number: 5, name: 'Sandbagging', costRange: 'Potentially full deal value',
    severity: 'high',
    whatItMeans: 'Whether the buyer can sue you for a breach they KNEW about before closing. Anti-sandbagging means they can. Pro-sandbagging means they can\'t.',
    whyItCostsYou: 'With anti-sandbagging, the buyer can discover a problem during diligence, say nothing, close the deal, then sue you for the breach afterward. They get the benefit of knowing AND the right to claim.',
    marketTerms: 'Varies by jurisdiction. Some states default to pro-sandbagging, others don\'t. This should be explicitly addressed in the agreement.',
    buyerWants: 'Anti-sandbagging: "Buyer\'s knowledge of any breach does not limit Seller\'s indemnification obligations."',
    sellerShouldPushFor: 'Pro-sandbagging: "If Buyer had knowledge of a breach prior to Closing, Buyer waives its right to indemnification for such breach." Or at minimum: silent (let the state default apply).',
    negotiationTip: 'This is the most unfair clause in many purchase agreements. If the buyer knows about a problem and closes anyway, they should not be able to sue you for it later. Fight hard for pro-sandbagging or at least a silence clause.'
  },
  {
    id: 'working-capital', number: 6, name: 'Working Capital Adjustment', costRange: '$500K-$2M',
    severity: 'high',
    whatItMeans: 'The purchase price is adjusted up or down based on the working capital at closing compared to an agreed "peg" or target.',
    whyItCostsYou: 'The buyer sets the peg methodology to their advantage — using a short trailing period during your high-inventory season, excluding prepaid items, including deferred revenue. Every line item choice shifts $50-200K.',
    marketTerms: 'Trailing 12-month average with clearly defined inclusions/exclusions and a collar of +/- 5-10%.',
    buyerWants: 'Trailing 3-month average (during high season), broad inclusions, narrow collar.',
    sellerShouldPushFor: 'Trailing 12-month average, clearly defined line items, collar of +/- 7.5%, and dispute resolution mechanism.',
    negotiationTip: 'Negotiate the working capital methodology in the LOI, not the purchase agreement. By the time you\'re negotiating the SPA, the buyer has leverage. Lock in the methodology early.'
  },
  {
    id: 'earnout', number: 7, name: 'Earnout Terms', costRange: '$1M-$10M+ at risk',
    severity: 'high',
    whatItMeans: 'A portion of the purchase price is contingent on the business hitting future financial targets after closing.',
    whyItCostsYou: 'Post-close, the buyer controls operations. They can allocate management fees, change vendor contracts, restructure costs — all of which reduce EBITDA and threaten your earnout. Without operating covenants, you\'re at their mercy.',
    marketTerms: 'Earnout should be 10-25% of total deal value with clear metrics, operating covenants, and dispute resolution.',
    buyerWants: 'Large earnout (30%+), EBITDA-based, no operating covenants, buyer discretion on business decisions.',
    sellerShouldPushFor: 'Revenue-based metrics (harder to manipulate), operating covenants requiring business-as-usual operations, independent accounting review, and acceleration on change of control.',
    negotiationTip: 'If the earnout has no operating covenants, don\'t sign. Period. The buyer can manipulate EBITDA too easily. Revenue-based earnouts are harder to game because revenue is harder to hide.'
  },
  {
    id: 'rw-insurance', number: 8, name: 'R&W Insurance', costRange: 'Saves $2-5M in escrow exposure',
    severity: 'medium',
    whatItMeans: 'Representations & Warranties insurance is a policy that covers the buyer for breaches of seller\'s reps, shifting risk from the seller to an insurance company.',
    whyItCostsYou: 'Without R&W insurance, every rep breach comes directly out of your escrow or indemnification. With it, the insurer pays (above a small retention), and your escrow is minimal or zero.',
    marketTerms: 'Premium: 2-4% of coverage. Retention: 1-2% of deal value. Available for deals $15M+.',
    buyerWants: 'R&W insurance with seller paying the premium. Or no insurance with large escrow.',
    sellerShouldPushFor: 'R&W insurance (split the premium if needed) in exchange for escrow reduction to 1-2%. The premium of $200-400K saves $3-5M in trapped escrow.',
    negotiationTip: 'R&W insurance has become standard in mid-market deals. If the buyer resists, they\'re likely planning to use the escrow as leverage for post-close claims. Push for it.'
  },
  {
    id: 'non-compete', number: 9, name: 'Non-Compete', costRange: 'Limits your future options',
    severity: 'medium',
    whatItMeans: 'You agree not to compete with the business you just sold for a specified period in a specified geography.',
    whyItCostsYou: 'Overly broad non-competes restrict what you can do after selling. A 5-year nationwide non-compete in "any related business" could prevent you from working in your industry for half a decade.',
    marketTerms: '2-3 years, limited to the specific geography and industry of the sold business.',
    buyerWants: '5 years, nationwide, broadly defined to cover adjacent industries.',
    sellerShouldPushFor: '2 years, limited to specific geographic markets and direct competitors. Clearly define what "competing" means. Carve out passive investments, board seats, and unrelated activities.',
    negotiationTip: 'The non-compete is often overlooked until the last minute. Negotiate it early. If you plan to start another business or do consulting, get specific carve-outs in writing.'
  },
  {
    id: 'disclosure-schedules', number: 10, name: 'Disclosure Schedules', costRange: 'Can void your protections',
    severity: 'medium',
    whatItMeans: 'Detailed lists that qualify your representations. "We have no pending litigation EXCEPT what\'s listed in Schedule 3.9." The schedules define the exceptions to your reps.',
    whyItCostsYou: 'Incomplete disclosure schedules mean you\'ve made an unqualified representation. If you forget to disclose a $50K vendor dispute and it surfaces post-close, you\'ve breached your rep — even if the buyer knew about it.',
    marketTerms: 'Comprehensive, detailed disclosures. Over-disclosure is better than under-disclosure.',
    buyerWants: 'Narrow, specific disclosures. Anything not disclosed is a breach.',
    sellerShouldPushFor: 'Broad disclosures with catch-all language. Include everything, even if it seems immaterial. Cross-reference schedules so disclosure in one schedule counts for all.',
    negotiationTip: 'Spend MORE time on disclosure schedules than on the reps themselves. A well-crafted rep with poor disclosures is worse than a broad rep with thorough disclosures. Your attorney should review every schedule line by line.'
  },
  {
    id: 'closing-conditions', number: 11, name: 'Closing Conditions', costRange: 'Can kill the deal',
    severity: 'medium',
    whatItMeans: 'Conditions that must be satisfied before closing occurs. If conditions aren\'t met, the buyer can walk away.',
    whyItCostsYou: 'Vague or broad closing conditions give the buyer escape hatches. "Material adverse change" clauses with low thresholds let the buyer walk for minor business fluctuations.',
    marketTerms: 'Standard conditions: regulatory approval, third-party consents, no MAC. MAC should be defined narrowly.',
    buyerWants: 'Broad MAC definition, many specific closing conditions, financing contingency.',
    sellerShouldPushFor: 'Narrow MAC definition (excluding industry-wide changes, general economic conditions, and known risks). Minimal closing conditions. No financing contingency (buyer should have committed financing).',
    negotiationTip: 'The MAC clause is where deals die. Push for a narrow definition with extensive carve-outs. If the buyer\'s financing falls through, that should be their problem, not yours.'
  },
  {
    id: 'purchase-price-adjustment', number: 12, name: 'Purchase Price Adjustments', costRange: '$200K-$1M',
    severity: 'low',
    whatItMeans: 'Beyond working capital, other adjustments to the purchase price at closing: cash on hand, indebtedness, transaction expenses.',
    whyItCostsYou: 'The definitions of "cash," "debt," and "transaction expenses" are negotiated. Buyer includes items in debt (like accrued vacation) that you consider operating liabilities. Every reclassification reduces your check.',
    marketTerms: 'Clear definitions of net debt, cash, and transaction expenses with examples.',
    buyerWants: 'Broad definition of debt (including deferred revenue, accrued liabilities, capex commitments).',
    sellerShouldPushFor: 'Narrow debt definition limited to financial debt (term loans, lines of credit). Exclude operating liabilities that transfer with the business. Cash includes all bank balances including restricted cash.',
    negotiationTip: 'Create a sample closing statement during LOI negotiations showing exactly how the purchase price adjusts. Seeing the math in advance prevents surprises at closing.'
  },
  {
    id: 'fraud-carveout', number: 13, name: 'Fraud Carve-Out', costRange: 'Unlimited exposure if triggered',
    severity: 'low',
    whatItMeans: 'Fraud voids all your negotiated protections — caps, baskets, survival periods. If the buyer proves fraud, you owe everything.',
    whyItCostsYou: 'The definition of "fraud" matters enormously. Does it require intentional misrepresentation (actual fraud) or just negligent misstatement (constructive fraud)? Constructive fraud has a much lower bar.',
    marketTerms: 'Fraud carve-out limited to actual, intentional fraud. Not constructive fraud or negligence.',
    buyerWants: 'Broad fraud definition including constructive fraud, recklessness, and negligent misrepresentation.',
    sellerShouldPushFor: 'Fraud defined as intentional misrepresentation made with actual knowledge. Not negligence. Not "should have known." Only "did know and lied."',
    negotiationTip: 'This seems like a clause that doesn\'t matter ("I\'m not committing fraud"). But the definition matters. A broad fraud definition turns every honest mistake into potential unlimited liability.'
  },
  {
    id: 'specific-indemnities', number: 14, name: 'Specific Indemnities', costRange: 'Varies — can be millions',
    severity: 'medium',
    whatItMeans: 'Special indemnification obligations for known issues discovered during diligence. These sit outside the general cap and basket.',
    whyItCostsYou: 'The buyer finds a specific issue (pending lawsuit, tax audit, environmental concern) and carves it out of the general protections. You\'re now personally liable for this specific issue with no cap.',
    marketTerms: 'Specific indemnities should be limited to genuinely known, quantifiable risks with their own mini-cap.',
    buyerWants: 'Extensive specific indemnities for every diligence finding, outside the general cap.',
    sellerShouldPushFor: 'Minimize specific indemnities. Each should have its own cap equal to the estimated exposure. Time-limit them. If the risk doesn\'t materialize in 24 months, the indemnity expires.',
    negotiationTip: 'If the buyer demands a specific indemnity, counter with: (1) a cap on that specific indemnity, (2) a short survival period, and (3) a dollar-for-dollar reduction in the purchase price as an alternative.'
  },
  {
    id: 'dispute-resolution', number: 15, name: 'Dispute Resolution', costRange: '$100K-$500K in legal fees',
    severity: 'low',
    whatItMeans: 'How disagreements after closing are resolved — arbitration, mediation, litigation. Where disputes are heard and who pays legal fees.',
    whyItCostsYou: 'Litigation in the buyer\'s home jurisdiction with no fee-shifting means you\'re spending $200K+ to fight on their turf. Arbitration can be faster and cheaper, but you lose the right to a jury.',
    marketTerms: 'Arbitration or mediation first, then litigation. Neutral jurisdiction. Loser pays prevailing party\'s reasonable legal fees.',
    buyerWants: 'Litigation in their home jurisdiction. Each party bears their own costs (favors the deeper-pocketed buyer).',
    sellerShouldPushFor: 'Binding arbitration with a neutral arbitrator in a neutral jurisdiction. Fee-shifting (loser pays) to discourage frivolous claims. For working capital disputes specifically: independent accounting firm resolution.',
    negotiationTip: 'Fee-shifting is your best friend. If the buyer has to pay your legal fees when they lose, they\'ll think twice about making small claims against your escrow just to see what sticks.'
  },
];

// ── Check Questions ─────────────────────────────────────────────

const checkQuestions: CheckQuestion[] = [
  { id: 'cq1', clauseId: 'escrow', question: 'Is your escrow less than 10% of the purchase price?', goodAnswer: 'Market standard is 5-10%. Below 10% is reasonable.', badSign: 'Escrow above 10% traps too much of your money. Push for R&W insurance to reduce it.' },
  { id: 'cq2', clauseId: 'basket', question: 'Do you have a true deductible (not a tipping basket)?', goodAnswer: 'True deductible means you only pay amounts above the threshold.', badSign: 'A tipping basket means once claims exceed the threshold, you owe from dollar one — much worse for you.' },
  { id: 'cq3', clauseId: 'sandbagging', question: 'Does your agreement include pro-sandbagging protection?', goodAnswer: 'Pro-sandbagging prevents the buyer from suing you for issues they knew about before closing.', badSign: 'Anti-sandbagging lets the buyer close knowing about a problem, then sue you anyway.' },
  { id: 'cq4', clauseId: 'working-capital', question: 'Is the working capital peg based on a 12-month trailing average?', goodAnswer: '12-month average smooths out seasonality and is the fairest calculation.', badSign: 'A 3-month average can be manipulated to favor the buyer, especially for seasonal businesses.' },
  { id: 'cq5', clauseId: 'earnout', question: 'Does your earnout have operating covenants?', goodAnswer: 'Operating covenants require the buyer to run the business normally — preventing earnout manipulation.', badSign: 'Without operating covenants, the buyer can allocate expenses to reduce your earnout.' },
  { id: 'cq6', clauseId: 'earnout', question: 'Is the earnout based on revenue (not just EBITDA)?', goodAnswer: 'Revenue is harder to manipulate than EBITDA. Revenue-based earnouts are safer.', badSign: 'EBITDA-based earnouts can be crushed by management fee allocations and expense loading.' },
  { id: 'cq7', clauseId: 'rw-insurance', question: 'Is R&W insurance being used to reduce your escrow?', goodAnswer: 'R&W insurance is standard in mid-market deals and significantly reduces seller risk.', badSign: 'No R&W insurance means every rep breach comes directly out of your pocket.' },
  { id: 'cq8', clauseId: 'non-compete', question: 'Is your non-compete limited to 2-3 years and your specific market?', goodAnswer: '2-3 years in your specific geography and industry is market.', badSign: '5+ years nationwide is overly restrictive and limits your future options.' },
  { id: 'cq9', clauseId: 'indemnification-cap', question: 'Is the general indemnification cap at or below 15% of deal value?', goodAnswer: '10-15% is market for general rep breaches.', badSign: 'A cap above 15% exposes you to excessive post-close risk.' },
  { id: 'cq10', clauseId: 'survival', question: 'Do general rep survival periods match the escrow release date?', goodAnswer: 'Aligned periods mean your escrow is released when claims can no longer be made.', badSign: 'If reps survive longer than escrow, you have open-ended personal liability after getting your escrow back.' },
  { id: 'cq11', clauseId: 'closing-conditions', question: 'Is the MAC clause narrowly defined with carve-outs?', goodAnswer: 'Narrow MAC with industry, economic, and known-risk carve-outs protects you from pretextual walk-aways.', badSign: 'A broad MAC clause lets the buyer walk for almost any reason.' },
  { id: 'cq12', clauseId: 'fraud-carveout', question: 'Is fraud defined as actual intentional fraud (not constructive)?', goodAnswer: 'Actual fraud requires proof you knew and intentionally lied — a high bar.', badSign: 'Constructive fraud or negligence-based definitions have a much lower bar and can catch honest mistakes.' },
  { id: 'cq13', clauseId: 'dispute-resolution', question: 'Does the agreement include fee-shifting (loser pays)?', goodAnswer: 'Fee-shifting discourages frivolous claims against your escrow.', badSign: 'Without fee-shifting, the buyer can bring small claims knowing you\'ll settle to avoid legal costs.' },
  { id: 'cq14', clauseId: 'disclosure-schedules', question: 'Have you over-disclosed on all schedules?', goodAnswer: 'Over-disclosure protects you. Anything disclosed can\'t be a breach.', badSign: 'Under-disclosure creates breach exposure for every item you forgot to mention.' },
  { id: 'cq15', clauseId: 'specific-indemnities', question: 'Do any specific indemnities have their own caps and time limits?', goodAnswer: 'Capped, time-limited specific indemnities contain your risk.', badSign: 'Uncapped, open-ended specific indemnities create unlimited exposure for known issues.' },
];

// ── Main Component ──────────────────────────────────────────────

export const PurchaseAgreementGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedClause, setExpandedClause] = useState<string | null>('escrow');
  const [answers, setAnswers] = useState<CheckAnswers>({});

  useEffect(() => {
    const saved = localStorage.getItem('purchase-agreement-v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.activeTab !== undefined) setActiveTab(parsed.activeTab);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('purchase-agreement-v1', JSON.stringify({ answers, activeTab }));
  }, [answers, activeTab]);

  const tabs = [
    { name: 'The 15 Clauses', icon: <FileText className="w-4 h-4" /> },
    { name: 'Agreement Check', icon: <Shield className="w-4 h-4" /> },
    { name: 'Your Report', icon: <Scale className="w-4 h-4" /> }
  ];

  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const yesCount = Object.values(answers).filter(a => a === 'yes').length;
  const noCount = Object.values(answers).filter(a => a === 'no').length;

  const handleAnswer = (qId: string, val: 'yes' | 'no') => {
    setAnswers(prev => ({ ...prev, [qId]: prev[qId] === val ? null : val }));
  };

  const exportCSV = () => {
    const pct = checkQuestions.length > 0 ? Math.round((yesCount / checkQuestions.length) * 100) : 0;
    const lines: string[] = [
      'PE Ready Plus - Purchase Agreement Survival Guide',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      `Score: ${pct}% (${yesCount} of ${checkQuestions.length} seller-friendly)`,
      `Red Flags: ${noCount}`,
      '',
      'AGREEMENT CHECK RESULTS',
      'Question,Answer,Good Sign,Bad Sign',
    ];
    checkQuestions.forEach(q => {
      lines.push(`"${q.question}","${answers[q.id] || 'unanswered'}","${q.goodAnswer}","${q.badSign}"`);
    });
    lines.push('', 'THE 15 CLAUSES REFERENCE', 'Clause,Cost Range,Severity,Market Terms,Seller Should Push For');
    clauses.forEach(c => {
      lines.push(`"${c.name}","${c.costRange}","${c.severity}","${c.marketTerms}","${c.sellerShouldPushFor}"`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchase-agreement-guide-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Tab 1: The 15 Clauses ────────────────────────────────────

  const renderClauses = () => (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Gavel className="w-6 h-6 text-amber-400" />
            The 15 Clauses That Cost Sellers the Most Money
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The purchase agreement is a 60-100 page document that governs every dollar of your deal.
            The LOI price means nothing if these 15 clauses shift millions of dollars of risk back to you.
          </p>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <span className="text-amber-400 font-semibold">Important:</span> This is not legal advice. This is a field guide so you
              can have informed conversations with your M&A attorney. Every deal is different — your attorney should negotiate the specific terms.
            </p>
          </div>
        </CardContent>
      </Card>

      {clauses.map(clause => {
        const sevColor = clause.severity === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                         clause.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                         'bg-blue-500/20 text-blue-400 border-blue-500/30';
        return (
          <Card key={clause.id} className="bg-card border-border overflow-hidden">
            <button
              onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
              className="w-full text-left"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-muted-foreground/50">#{clause.number}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{clause.name}</CardTitle>
                        <Badge className={sevColor + ' text-xs'}>{clause.severity.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-red-400 mt-0.5">Typical cost: {clause.costRange}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedClause === clause.id ? 'rotate-90' : ''}`} />
                </div>
              </CardHeader>
            </button>
            {expandedClause === clause.id && (
              <CardContent className="pt-0 space-y-3 border-t border-border mt-2 pt-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">What it means:</p>
                  <p className="text-sm text-muted-foreground">{clause.whatItMeans}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-400 mb-1">Why it costs you money:</p>
                  <p className="text-sm text-muted-foreground">{clause.whyItCostsYou}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground mb-1">Market terms:</p>
                    <p className="text-sm text-muted-foreground">{clause.marketTerms}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-red-400 mb-1">Buyer wants:</p>
                    <p className="text-sm text-muted-foreground">{clause.buyerWants}</p>
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-400 mb-1">You should push for:</p>
                  <p className="text-sm text-muted-foreground">{clause.sellerShouldPushFor}</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-amber-400 mb-1 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" /> Negotiation Tip
                  </p>
                  <p className="text-sm text-muted-foreground">{clause.negotiationTip}</p>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );

  // ── Tab 2: Agreement Check ────────────────────────────────────

  const renderCheck = () => (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-400" />
            Check Your Purchase Agreement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Answer these 15 questions about your purchase agreement (or LOI if you're earlier in the process).
            "Yes" means the term is seller-friendly. "No" means you should push back.
          </p>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{answeredCount} of {checkQuestions.length}</span>
          </div>
          <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(answeredCount / checkQuestions.length) * 100}%` }} />
          </div>
        </CardContent>
      </Card>

      {checkQuestions.map((q, idx) => {
        const answer = answers[q.id];
        return (
          <Card key={q.id} className={`border transition-colors ${
            answer === 'yes' ? 'bg-green-500/5 border-green-500/20' :
            answer === 'no' ? 'bg-red-500/5 border-red-500/20' :
            'bg-card border-border'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    <span className="text-muted-foreground mr-2">{idx + 1}.</span>
                    {q.question}
                  </p>
                  {answer === 'yes' && (
                    <div className="mt-2 bg-green-500/10 border border-green-500/20 rounded p-3">
                      <p className="text-sm text-muted-foreground"><span className="text-green-400 font-medium">Good: </span>{q.goodAnswer}</p>
                    </div>
                  )}
                  {answer === 'no' && (
                    <div className="mt-2 bg-red-500/10 border border-red-500/20 rounded p-3">
                      <p className="text-sm text-muted-foreground"><span className="text-red-400 font-medium">Warning: </span>{q.badSign}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleAnswer(q.id, 'yes')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    answer === 'yes' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
                  }`}>Yes</button>
                  <button onClick={() => handleAnswer(q.id, 'no')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    answer === 'no' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
                  }`}>No</button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // ── Tab 3: Report ─────────────────────────────────────────────

  const renderReport = () => {
    const pct = checkQuestions.length > 0 ? Math.round((yesCount / checkQuestions.length) * 100) : 0;
    const noItems = checkQuestions.filter(q => answers[q.id] === 'no');
    const yesItems = checkQuestions.filter(q => answers[q.id] === 'yes');

    let verdict = '';
    let verdictColor = '';
    let verdictBg = '';
    if (pct >= 85) { verdict = 'Well-Protected Agreement'; verdictColor = 'text-emerald-400'; verdictBg = 'bg-emerald-500/10 border-emerald-500/20'; }
    else if (pct >= 65) { verdict = 'Mostly Seller-Friendly'; verdictColor = 'text-green-400'; verdictBg = 'bg-green-500/10 border-green-500/20'; }
    else if (pct >= 45) { verdict = 'Mixed — Push Back on Key Terms'; verdictColor = 'text-yellow-400'; verdictBg = 'bg-yellow-500/10 border-yellow-500/20'; }
    else if (pct >= 25) { verdict = 'Buyer-Favored Agreement'; verdictColor = 'text-orange-400'; verdictBg = 'bg-orange-500/10 border-orange-500/20'; }
    else { verdict = 'Heavily Buyer-Favored — Significant Risk'; verdictColor = 'text-red-400'; verdictBg = 'bg-red-500/10 border-red-500/20'; }

    return (
      <div className="space-y-6">
        <Card className={`border ${verdictBg}`}>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Purchase Agreement Assessment</p>
            <p className={`text-4xl font-bold ${verdictColor} mb-2`}>{verdict}</p>
            <p className="text-5xl font-bold text-foreground mb-1">{pct}%</p>
            <p className="text-muted-foreground">seller-friendly terms</p>
            <div className="flex justify-center gap-6 text-sm mt-4">
              <span className="text-green-400">{yesCount} seller-friendly</span>
              <span className="text-red-400">{noCount} buyer-favored</span>
              <span className="text-muted-foreground">{checkQuestions.length - answeredCount} unanswered</span>
            </div>
          </CardContent>
        </Card>

        {noItems.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Terms to Renegotiate ({noItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {noItems.map(q => {
                const clause = clauses.find(c => c.id === q.clauseId);
                return (
                  <div key={q.id} className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-medium text-foreground text-sm">{q.question}</p>
                    <p className="text-xs text-red-400 mt-1">{q.badSign}</p>
                    {clause && (
                      <p className="text-xs text-green-400 mt-1">Push for: {clause.sellerShouldPushFor}</p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {yesItems.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                Seller-Friendly Terms ({yesItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {yesItems.map(q => (
                <div key={q.id} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-muted-foreground">{q.question}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Attorney Discussion Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'Review every buyer-favored term identified above. Ask your attorney which ones are negotiable and which ones are deal-breakers for the buyer.',
              'Ask specifically about R&W insurance — it can solve the escrow, basket, and cap issues simultaneously.',
              'Get a sample closing statement now showing exactly how the purchase price adjusts. Don\'t wait until closing week.',
              'Ensure disclosure schedules are cross-referenced. Disclosure in one schedule should count for all relevant reps.',
              'If the buyer pushes an anti-sandbagging clause, your attorney should fight hard. This is one of the most unfair terms in M&A.',
              'For any earnout: insist on operating covenants in writing. "Good faith" obligations are not enforceable enough.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-amber-400 font-bold text-sm mt-0.5">{i + 1}.</span>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={exportCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export Report as CSV
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab, idx) => (
          <button key={idx} onClick={() => setActiveTab(idx)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === idx ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}>
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>
      {activeTab === 0 && renderClauses()}
      {activeTab === 1 && renderCheck()}
      {activeTab === 2 && renderReport()}
    </div>
  );
};
