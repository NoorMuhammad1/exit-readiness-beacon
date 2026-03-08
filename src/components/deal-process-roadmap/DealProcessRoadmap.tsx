import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, ChevronLeft, CheckCircle2, Clock, AlertTriangle,
  FileText, Users, Search, DollarSign, Shield, Handshake, Flag,
  Building2, ArrowRight, Lightbulb, Target, Download
} from 'lucide-react';

// ── Deal Stage Data ──────────────────────────────────────────────

interface DealStage {
  id: number;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  duration: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  whatHappens: string[];
  whatYouNeed: string[];
  commonPitfalls: string[];
  proTip: string;
  keyDocuments: string[];
  whoIsInvolved: string[];
}

const dealStages: DealStage[] = [
  {
    id: 1,
    name: 'Preparation & Positioning',
    shortName: 'Prepare',
    icon: <Target className="w-5 h-5" />,
    duration: '2-6 months',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Before you ever talk to a buyer, you get your house in order. This is where PE Ready lives — the work you\'re doing right now.',
    whatHappens: [
      'Hire an investment banker or M&A advisor',
      'Clean up your financials — get a Quality of Earnings (QoE) report',
      'Identify and fix deal killers before buyers find them',
      'Build your management team story',
      'Organize your data room',
      'Determine your valuation expectations'
    ],
    whatYouNeed: [
      '3 years of audited or reviewed financials',
      'EBITDA with add-backs clearly documented',
      'Customer concentration data',
      'Key employee retention plan',
      'Growth story and forward projections'
    ],
    commonPitfalls: [
      'Rushing to market before financials are clean',
      'Not having add-backs properly documented with evidence',
      'Key person dependency — if you leave, does the business survive?',
      'Skipping the QoE — buyers will do their own, and surprises kill deals'
    ],
    proTip: 'The best time to start preparing is 12-24 months before you want to sell. The companies that get top dollar are the ones that look "ready" before the first buyer call.',
    keyDocuments: ['Quality of Earnings report', 'Management presentation', 'Financial model', 'Customer analysis', 'Growth plan'],
    whoIsInvolved: ['You (the owner)', 'Investment banker / M&A advisor', 'CPA / accountant', 'Attorney']
  },
  {
    id: 2,
    name: 'Marketing & Outreach',
    shortName: 'Market',
    icon: <FileText className="w-5 h-5" />,
    duration: '4-8 weeks',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Your banker sends the Anonymous Teaser to potential buyers. Interested parties sign NDAs, then receive the full CIM (Confidential Information Memorandum).',
    whatHappens: [
      'Anonymous teaser sent to 50-200 potential buyers',
      'Interested buyers sign Non-Disclosure Agreements (NDAs)',
      'CIM distributed to NDA-signed buyers (typically 30-80)',
      'Buyers review the CIM and ask initial questions',
      'Your banker fields questions and manages the process',
      'Process letter sent with IOI instructions and deadline'
    ],
    whatYouNeed: [
      'Anonymous teaser (1 page)',
      'Confidential Information Memorandum (40-60 pages)',
      'Buyer target list (strategic + financial)',
      'NDA template (your attorney drafts this)',
      'Process letter with IOI requirements'
    ],
    commonPitfalls: [
      'Casting too narrow a net — you want competition',
      'CIM that oversells or has inconsistencies with financials',
      'Leaking the deal to employees, customers, or competitors',
      'Not controlling the narrative — let your banker be the gatekeeper'
    ],
    proTip: 'The teaser is a movie trailer. The CIM is the full movie. If the teaser doesn\'t create excitement, buyers won\'t sign the NDA to see more.',
    keyDocuments: ['Anonymous teaser', 'CIM', 'NDA', 'Process letter', 'Buyer list'],
    whoIsInvolved: ['Investment banker (leads)', 'You (approve materials)', 'Attorney (NDA review)']
  },
  {
    id: 3,
    name: 'Indications of Interest (IOIs)',
    shortName: 'IOIs',
    icon: <DollarSign className="w-5 h-5" />,
    duration: '2-3 weeks',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'Buyers submit their first-round bids. These are non-binding — they\'re saying "we\'d pay roughly this much, subject to diligence." You pick the best 3-6 to advance.',
    whatHappens: [
      'Buyers submit IOIs by the deadline (typically 10-20 come in)',
      'Each IOI includes a valuation range, deal structure, and financing plan',
      'Your banker creates a bid comparison matrix',
      'You and your banker shortlist the best 3-6 buyers',
      'Non-advancing buyers receive a "thank you" letter',
      'Shortlisted buyers are invited to the next round'
    ],
    whatYouNeed: [
      'Clear evaluation criteria (price isn\'t everything — certainty matters)',
      'Understanding of different deal structures (all-cash vs. rollover equity vs. earnout)',
      'Patience — don\'t fall in love with the highest number before diligence'
    ],
    commonPitfalls: [
      'Picking buyers based only on price — the highest IOI doesn\'t always close',
      'Advancing too many buyers (expensive and time-consuming) or too few (no competition)',
      'Not understanding the difference between enterprise value and what you take home',
      'Ignoring buyer credibility — can they actually close this deal?'
    ],
    proTip: 'The IOI is a starting point, not a final offer. Expect 10-20% haircuts during diligence if your financials aren\'t clean. The buyer who offers $50M and closes is better than the one who offers $60M and retrads.',
    keyDocuments: ['IOI letters from buyers', 'Bid comparison matrix', 'Shortlist memo'],
    whoIsInvolved: ['Investment banker (leads)', 'You (final decision on shortlist)', 'Attorney (review terms)']
  },
  {
    id: 4,
    name: 'Management Presentations',
    shortName: 'Meetings',
    icon: <Users className="w-5 h-5" />,
    duration: '2-4 weeks',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    description: 'You meet the shortlisted buyers face-to-face. This is where they assess you as a leader and you assess them as a partner. Chemistry matters as much as numbers.',
    whatHappens: [
      'Each shortlisted buyer gets a 2-4 hour in-person meeting',
      'You present: company overview, financials, growth plan, team',
      'Buyers ask detailed questions about operations, customers, risks',
      'Buyers assess management team quality and continuity',
      'You assess the buyer: culture, plans for employees, growth vision',
      'Optional: facility tours, customer reference calls'
    ],
    whatYouNeed: [
      'Polished management presentation (30-50 slides)',
      'Prepared answers for tough questions (PE Ready\'s Discovery Interview helps here)',
      'Your management team present and prepared',
      'Facility tour logistics if applicable',
      'List of references (customers, suppliers) you\'re willing to share'
    ],
    commonPitfalls: [
      'Being unprepared for hard questions about customer concentration or key-person risk',
      'Overselling or making promises you can\'t back up with data',
      'Not having your management team aligned on the story',
      'Treating it as a one-way pitch — this is a two-way evaluation'
    ],
    proTip: 'The #1 question PE firms ask at the end: "What haven\'t we asked about that we should?" Have a thoughtful answer ready. It shows self-awareness and honesty.',
    keyDocuments: ['Management presentation deck', 'Customer reference list', 'Facility tour agenda'],
    whoIsInvolved: ['You + management team', 'Investment banker (coaches you)', 'Buyers\' deal team']
  },
  {
    id: 5,
    name: 'Due Diligence',
    shortName: 'Diligence',
    icon: <Search className="w-5 h-5" />,
    duration: '4-8 weeks',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    description: 'The buyer verifies everything. Financial, legal, operational, HR, IT, environmental — they will look under every rock. This is the most intense phase.',
    whatHappens: [
      'Virtual data room opened to shortlisted buyers',
      'Buyers\' accountants conduct their own Quality of Earnings analysis',
      'Legal team reviews all contracts, leases, litigation, IP',
      'Operational diligence: customers, suppliers, facilities, technology',
      'HR diligence: org chart, compensation, benefits, key employees',
      'Environmental and insurance review',
      'You and your team answer hundreds of questions (Q&A log)'
    ],
    whatYouNeed: [
      'Organized data room (PE Ready\'s Data Room module helps)',
      'Quick response times — delays signal disorganization',
      'Honest answers — hiding problems always backfires',
      'Stamina — this phase is exhausting and runs alongside normal operations',
      'Your team\'s time (CFO, controller, HR lead will be heavily involved)'
    ],
    commonPitfalls: [
      'Slow document production — looks like you\'re hiding something',
      'Surprises the buyer discovers that you didn\'t disclose upfront',
      'Key employees finding out about the deal during diligence',
      'Letting business performance slip while distracted by the process',
      'Not having your QoE done first — the buyer\'s QoE will find everything yours should have'
    ],
    proTip: 'Every dollar of EBITDA the buyer\'s QoE takes away costs you 5-8x that amount in valuation. If their QoE finds $200K in adjustments your banker didn\'t catch, that\'s $1-1.6M off the price.',
    keyDocuments: ['Data room (hundreds of documents)', 'Q&A log', 'Quality of Earnings report', 'Legal review memo', 'Insurance summary'],
    whoIsInvolved: ['You + management team', 'Investment banker', 'Attorney', 'CPA', 'Buyer\'s entire diligence team (10-30 people)']
  },
  {
    id: 6,
    name: 'Final Bids & Negotiation',
    shortName: 'Final Bids',
    icon: <Handshake className="w-5 h-5" />,
    duration: '3-4 weeks',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    description: 'After diligence, buyers submit final binding offers. Then the real negotiation begins — price, terms, structure, and the purchase agreement.',
    whatHappens: [
      'Buyers submit final bids — these are binding (or near-binding) offers',
      'Final bids include a markup of the purchase agreement (SPA/APA)',
      'Your banker compares bids on price, structure, certainty, and speed',
      'You select the winning bidder (or negotiate with top 2)',
      'Exclusivity period granted to the winning bidder (30-60 days)',
      'Intensive negotiation of the purchase agreement terms',
      'Key terms: price, reps & warranties, indemnification, escrow, earnout, non-compete'
    ],
    whatYouNeed: [
      'Clear priorities: what matters most — price? certainty? speed? employee protection?',
      'Understanding of deal terms (PE Ready covers these in Deal Readiness modules)',
      'Strong attorney experienced in M&A transactions',
      'Patience — purchase agreement negotiation is tedious but critical'
    ],
    commonPitfalls: [
      'Retrading — buyer lowers the price citing diligence findings (this is why preparation matters)',
      'Getting fixated on price and ignoring terms that could cost you more later',
      'Earnout structures that look great on paper but are designed to never pay out',
      'Not understanding indemnification caps and escrow holdbacks',
      'Agreeing to a non-compete that\'s too broad or too long'
    ],
    proTip: 'The purchase agreement is where fortunes are made or lost. A $50M deal with bad reps & warranties, a 15% escrow, and an aggressive earnout might net you less than a $42M deal with clean terms. Your attorney earns their fee in this phase.',
    keyDocuments: ['Final bid letters', 'Purchase agreement (SPA or APA)', 'Exclusivity agreement', 'Financing commitment letters'],
    whoIsInvolved: ['You', 'Investment banker', 'Attorney (leads negotiation)', 'CPA (tax structuring)', 'Buyer\'s team']
  },
  {
    id: 7,
    name: 'Signing & Pre-Close',
    shortName: 'Signing',
    icon: <Shield className="w-5 h-5" />,
    duration: '2-8 weeks',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    description: 'The purchase agreement is signed. But you\'re not done yet — there\'s a gap between signing and closing where conditions must be met.',
    whatHappens: [
      'Purchase agreement signed by both parties',
      'Regulatory approvals filed (Hart-Scott-Rodino if deal > $119M)',
      'Third-party consents obtained (landlords, key customers, lenders)',
      'Transition planning begins (IT systems, bank accounts, employee communications)',
      'Buyer finalizes financing',
      'Closing conditions checklist worked through',
      'Employee retention agreements finalized'
    ],
    whatYouNeed: [
      'List of all third-party consents required',
      'Communication plan for employees, customers, suppliers',
      'Transition team (who stays, who goes, who runs what)',
      'Updated financials through close (no performance decline!)'
    ],
    commonPitfalls: [
      'Business performance drops between signing and closing — this can trigger MAC clauses',
      'Key employees leaving when they hear about the deal',
      'Customer or landlord consents taking longer than expected',
      'Not having a communication plan — rumors are worse than news'
    ],
    proTip: 'The period between signing and closing is the most dangerous. You must keep running the business at full speed while managing the transition. Any decline in performance gives the buyer leverage to renegotiate.',
    keyDocuments: ['Signed purchase agreement', 'Regulatory filings', 'Consent letters', 'Transition plan', 'Employee communication plan'],
    whoIsInvolved: ['You', 'Attorney', 'Buyer\'s team', 'HR (employee communications)', 'IT (system transitions)']
  },
  {
    id: 8,
    name: 'Closing & Beyond',
    shortName: 'Close',
    icon: <Flag className="w-5 h-5" />,
    duration: '1 day (closing) + 100 days (transition)',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    description: 'The wire hits your account. But the story isn\'t over — most deals include a transition period where you help the new owners for 6-24 months.',
    whatHappens: [
      'Closing day: final documents signed, funds wired',
      'Employee announcement — typically same day as close',
      'Customer and supplier notifications sent',
      'You begin your transition role (if applicable)',
      'First 100 days: new owner stabilizes, assesses, then executes their plan',
      'Escrow period begins (typically 12-24 months — a portion of price is held back)',
      'Earnout measurement period begins (if applicable)'
    ],
    whatYouNeed: [
      'Wire instructions confirmed with your bank',
      'Tax advisor on standby (proceeds structuring)',
      'Wealth manager engaged (what to do with the money)',
      'Transition plan: what you\'re responsible for post-close',
      'Mental preparation — selling your company is emotional'
    ],
    commonPitfalls: [
      'Not having a wealth management plan — sudden liquidity requires planning',
      'Underestimating the emotional impact of selling',
      'Checking out during the transition period — your earnout depends on performance',
      'Not understanding escrow clawback scenarios',
      'Post-close disputes over working capital adjustments'
    ],
    proTip: 'Most sellers say the hardest part isn\'t the deal — it\'s the morning after. You\'ve been building this company for 10-20 years. Have a plan for what comes next, not just financially but personally.',
    keyDocuments: ['Closing statement', 'Wire transfer confirmations', 'Transition agreement', 'Employee announcement', 'Customer letters'],
    whoIsInvolved: ['You', 'Attorney', 'CPA / tax advisor', 'Wealth manager', 'New ownership team']
  }
];

// ── Timeline Component ───────────────────────────────────────────

const TimelineBar: React.FC<{ stages: DealStage[]; activeStage: number; onSelect: (id: number) => void }> = ({ stages, activeStage, onSelect }) => (
  <div className="w-full overflow-x-auto pb-2">
    <div className="flex items-center min-w-[700px] px-2">
      {stages.map((stage, i) => (
        <React.Fragment key={stage.id}>
          <button
            onClick={() => onSelect(stage.id)}
            className={`flex flex-col items-center gap-1.5 px-2 py-2 rounded-lg transition-all cursor-pointer min-w-[80px] ${
              activeStage === stage.id
                ? `${stage.bgColor} ${stage.borderColor} border`
                : 'hover:bg-white/5'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
              activeStage === stage.id
                ? `${stage.borderColor} ${stage.bgColor} ${stage.color}`
                : 'border-gray-600 text-gray-500'
            }`}>
              {stage.icon}
            </div>
            <span className={`text-[11px] font-medium text-center leading-tight ${
              activeStage === stage.id ? stage.color : 'text-gray-500'
            }`}>
              {stage.shortName}
            </span>
          </button>
          {i < stages.length - 1 && (
            <div className={`flex-1 h-0.5 min-w-[20px] mx-1 ${
              stage.id < activeStage ? 'bg-emerald-500/50' : 'bg-gray-700'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

// ── Section Card ─────────────────────────────────────────────────

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; items: string[]; color: string }> = ({ title, icon, items, color }) => (
  <Card className="bg-black/30 border-white/10">
    <CardHeader className="pb-3">
      <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${color}`}>
        {icon} {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// ── Stage Detail View ────────────────────────────────────────────

const StageDetail: React.FC<{ stage: DealStage }> = ({ stage }) => (
  <div className="space-y-6">
    {/* Stage Header */}
    <div className={`rounded-xl p-6 ${stage.bgColor} border ${stage.borderColor}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${stage.borderColor} ${stage.color}`}>
          {stage.icon}
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${stage.color}`}>
            Stage {stage.id}: {stage.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Typical duration: {stage.duration}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-300 leading-relaxed">{stage.description}</p>
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard
        title="What Happens"
        icon={<ArrowRight className="w-4 h-4" />}
        items={stage.whatHappens}
        color={stage.color}
      />
      <SectionCard
        title="What You Need Ready"
        icon={<CheckCircle2 className="w-4 h-4" />}
        items={stage.whatYouNeed}
        color="text-emerald-400"
      />
      <SectionCard
        title="Common Pitfalls"
        icon={<AlertTriangle className="w-4 h-4" />}
        items={stage.commonPitfalls}
        color="text-amber-400"
      />
      <SectionCard
        title="Key Documents"
        icon={<FileText className="w-4 h-4" />}
        items={stage.keyDocuments}
        color="text-blue-400"
      />
    </div>

    {/* Who's Involved */}
    <Card className="bg-black/30 border-white/10">
      <CardContent className="pt-5">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-purple-400">Who's Involved</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {stage.whoIsInvolved.map((person, i) => (
            <Badge key={i} variant="outline" className="text-gray-300 border-white/20 bg-white/5">
              {person}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Pro Tip */}
    <Card className="bg-emerald-500/5 border-emerald-500/20">
      <CardContent className="pt-5">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-sm font-semibold text-emerald-400 block mb-1">Pro Tip</span>
            <p className="text-sm text-gray-300 leading-relaxed">{stage.proTip}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ── Main Component ───────────────────────────────────────────────

export const DealProcessRoadmap: React.FC = () => {
  const [activeStage, setActiveStage] = useState(1);

  const currentStage = useMemo(() => dealStages.find(s => s.id === activeStage)!, [activeStage]);

  const totalDuration = useMemo(() => {
    return '6-18 months (typical)';
  }, []);

  const handleExportCSV = () => {
    const headers = ['Stage', 'Name', 'Duration', 'What Happens', 'What You Need', 'Common Pitfalls', 'Pro Tip', 'Key Documents', 'Who Is Involved'];
    const rows = dealStages.map(s => [
      s.id,
      s.name,
      s.duration,
      s.whatHappens.join('; '),
      s.whatYouNeed.join('; '),
      s.commonPitfalls.join('; '),
      s.proTip,
      s.keyDocuments.join('; '),
      s.whoIsInvolved.join('; ')
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deal-process-roadmap.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Overview Card */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Your Deal Process — Start to Finish
          </CardTitle>
          <CardDescription className="text-gray-400">
            Every PE transaction follows the same basic roadmap. The timeline varies, but the stages don't.
            Click on any stage below to see exactly what happens, what you need to have ready, and the mistakes to avoid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Total timeline: <span className="text-white font-medium">{totalDuration}</span></span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-4 h-4" />
              <span><span className="text-white font-medium">8 stages</span> from preparation to close</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Navigation */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="pt-5 pb-3">
          <TimelineBar stages={dealStages} activeStage={activeStage} onSelect={setActiveStage} />
        </CardContent>
      </Card>

      {/* Stage Detail */}
      <StageDetail stage={currentStage} />

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setActiveStage(Math.max(1, activeStage - 1))}
          disabled={activeStage === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Stage
        </Button>

        <Button variant="outline" onClick={handleExportCSV} className="gap-2">
          <Download className="w-4 h-4" /> Export Roadmap
        </Button>

        <Button
          variant="outline"
          onClick={() => setActiveStage(Math.min(8, activeStage + 1))}
          disabled={activeStage === 8}
          className="gap-2"
        >
          Next Stage <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* PE Ready Connection */}
      <Card className="bg-emerald-500/5 border-emerald-500/20">
        <CardContent className="pt-5">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm font-semibold text-emerald-400 block mb-1">Where PE Ready Fits</span>
              <p className="text-sm text-gray-300 leading-relaxed">
                PE Ready covers <strong>Stage 1 (Preparation)</strong> in depth — financials, EBITDA, valuations, team readiness, data room, deal killers.
                It also prepares you for <strong>Stage 4 (Management Presentations)</strong> with the Discovery Interview module,
                and generates starter versions of your <strong>Stage 2</strong> documents (Anonymous Teaser, CIM, Company Profile).
                The better your preparation, the smoother every stage after it goes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
