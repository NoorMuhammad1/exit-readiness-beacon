import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar, AlertTriangle, CheckCircle2, Clock, Target,
  ChevronRight, Download, FileText, Lightbulb, DollarSign,
  Users, Shield, ArrowRight, XCircle, TrendingUp, Briefcase
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────

interface MilestoneItem {
  id: string;
  task: string;
  description: string;
  category: 'financial' | 'legal' | 'team' | 'operations' | 'advisory';
  critical: boolean;
}

interface Milestone {
  monthsOut: number;
  label: string;
  phase: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  description: string;
  items: MilestoneItem[];
}

interface CompletionState {
  [itemId: string]: boolean;
}

const categoryColors: Record<string, { badge: string; label: string }> = {
  financial: { badge: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Financial' },
  legal: { badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Legal' },
  team: { badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Team' },
  operations: { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Operations' },
  advisory: { badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', label: 'Advisory' },
};

// ── Milestone Data ──────────────────────────────────────────────

const milestones: Milestone[] = [
  {
    monthsOut: 24,
    label: '24 Months Out',
    phase: 'Foundation',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    icon: <Target className="w-6 h-6" />,
    description: 'Start building the foundation. Nobody should know you\'re planning to sell. Everything you do here looks like smart business management — because it is.',
    items: [
      { id: 'm24-1', task: 'Begin cleaning up personal expenses from the business', description: 'Remove personal car leases, family payroll, personal travel, home office deductions that won\'t transfer. Every personal expense left in the P&L is an add-back fight during diligence.', category: 'financial', critical: true },
      { id: 'm24-2', task: 'Start documenting all processes and SOPs', description: 'Write down how everything works. Customer onboarding, service delivery, billing, hiring. A business with documented processes is worth 1-2x more than one that runs on tribal knowledge.', category: 'operations', critical: false },
      { id: 'm24-3', task: 'Evaluate your management team honestly', description: 'Can this business run without you for 3 months? If not, identify the gaps. You have 24 months to hire, train, and empower the team PE buyers need to see.', category: 'team', critical: true },
      { id: 'm24-4', task: 'Start a customer diversification strategy', description: 'If any customer is more than 15% of revenue, begin actively growing other accounts. You need 24 months to shift the mix without raising red flags.', category: 'operations', critical: true },
      { id: 'm24-5', task: 'Get a preliminary business valuation', description: 'Hire a valuation firm for a preliminary estimate. This sets your baseline and identifies what levers to pull to increase value over the next 24 months.', category: 'advisory', critical: false },
    ]
  },
  {
    monthsOut: 18,
    label: '18 Months Out',
    phase: 'Infrastructure',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    icon: <Users className="w-6 h-6" />,
    description: 'Build the infrastructure that PE buyers require. Hire the people, upgrade the systems, lock in the contracts.',
    items: [
      { id: 'm18-1', task: 'Hire a strong CFO or Controller', description: 'PE buyers expect financial leadership beyond the owner. A CFO who can speak fluently about revenue drivers, margins, and working capital is worth their weight in gold during buyer meetings.', category: 'team', critical: true },
      { id: 'm18-2', task: 'Upgrade accounting systems and reporting', description: 'Move to accrual-based accounting if you haven\'t. Implement monthly close procedures. PE buyers want clean GAAP-compliant financials with monthly detail.', category: 'financial', critical: true },
      { id: 'm18-3', task: 'Review and renegotiate key contracts', description: 'Customer contracts, vendor agreements, leases. Get multi-year terms where possible. Expiring contracts during a deal process are leverage for the buyer to reduce price.', category: 'legal', critical: false },
      { id: 'm18-4', task: 'Implement a CRM and formalize the sales pipeline', description: 'A documented, measurable sales pipeline proves revenue predictability. "I know the customers" in your head is worth nothing — a CRM with 12+ months of data is worth a lot.', category: 'operations', critical: false },
      { id: 'm18-5', task: 'Address any known legal or compliance issues', description: 'Pending lawsuits, regulatory findings, employee disputes — resolve these now. Every unresolved issue becomes a diligence finding and a price negotiation.', category: 'legal', critical: true },
    ]
  },
  {
    monthsOut: 12,
    label: '12 Months Out',
    phase: 'Financial Prep',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    icon: <DollarSign className="w-6 h-6" />,
    description: 'Get your financial house in bulletproof order. This is where you invest in the sell-side QoE that prevents re-trades.',
    items: [
      { id: 'm12-1', task: 'Commission a sell-side Quality of Earnings (QoE)', description: 'This $50-100K investment is the single most valuable thing you can do. It finds every issue the buyer\'s QoE team would find — and gives you time to fix or explain them. Eliminates 80% of re-trade risk.', category: 'financial', critical: true },
      { id: 'm12-2', task: 'Normalize owner compensation to market rate', description: 'If you\'re underpaying yourself, raise your salary to market rate NOW. If you wait until the deal, the buyer will use the low comp as evidence that EBITDA is overstated.', category: 'financial', critical: true },
      { id: 'm12-3', task: 'Begin interviewing investment bankers', description: 'Meet 3-5 banks. Ask about deal experience in your industry, typical process timeline, and fee structure. The right banker adds 10-25% to your price through competitive process management.', category: 'advisory', critical: true },
      { id: 'm12-4', task: 'Prepare a detailed add-back schedule with documentation', description: 'Every add-back needs a receipt, an explanation, and proof it won\'t recur. "Trust me, that was personal" doesn\'t survive diligence. Paper trails survive diligence.', category: 'financial', critical: false },
      { id: 'm12-5', task: 'Lock in key employee retention agreements', description: 'Your top 3-5 employees need financial incentives to stay through the deal. Stay bonuses, transaction bonuses, or equity participation. If key people leave during the process, the deal dies.', category: 'team', critical: true },
    ]
  },
  {
    monthsOut: 9,
    label: '9 Months Out',
    phase: 'Go-to-Market Prep',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    icon: <Briefcase className="w-6 h-6" />,
    description: 'Final preparations before going live. Your banker is building the CIM, your data room is getting populated, and your story is getting polished.',
    items: [
      { id: 'm9-1', task: 'Engage your investment banker formally', description: 'Sign the engagement letter. The banker begins building the buyer list, drafting the teaser and CIM, and developing the marketing strategy.', category: 'advisory', critical: true },
      { id: 'm9-2', task: 'Hire an experienced M&A attorney', description: 'Not your regular business attorney. An M&A specialist who has closed 50+ deals. They\'ll review the LOI, negotiate the purchase agreement, and catch clauses worth millions.', category: 'legal', critical: true },
      { id: 'm9-3', task: 'Populate the virtual data room', description: 'Organize financials, contracts, HR records, IP documentation, insurance policies, regulatory filings. A well-organized data room accelerates diligence and signals professionalism.', category: 'operations', critical: true },
      { id: 'm9-4', task: 'Prepare the management presentation', description: 'Your banker coaches the team, but you and your managers need to practice. 3-5 rehearsals minimum. Know the tough questions and have practiced answers.', category: 'team', critical: false },
      { id: 'm9-5', task: 'Tax planning with your accountant and attorney', description: 'Asset vs. stock sale, QSBS eligibility, installment sale options, state tax planning. The difference between the best and worst tax structure can be $5-7M on a $30M deal.', category: 'financial', critical: true },
    ]
  },
  {
    monthsOut: 6,
    label: '6 Months Out',
    phase: 'Active Process',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    icon: <TrendingUp className="w-6 h-6" />,
    description: 'The process is live. Teasers are out, NDAs are being signed, and buyers are reading your CIM. Your #1 job: keep running the business at peak performance.',
    items: [
      { id: 'm6-1', task: 'Maintain or grow business performance', description: 'Revenue dips during the process are under a microscope. Every month of financials that buyers see needs to show stability or growth. This is not the time to coast.', category: 'operations', critical: true },
      { id: 'm6-2', task: 'Review IOIs with your banker and attorney', description: 'Compare bids on price, structure, certainty, and speed. Don\'t just take the highest number — evaluate conditionality, financing certainty, and the buyer\'s reputation.', category: 'advisory', critical: true },
      { id: 'm6-3', task: 'Prepare for management presentations', description: 'Shortlisted buyers will visit. Let your management team present — PE buyers want to see that the business doesn\'t depend on you.', category: 'team', critical: false },
      { id: 'm6-4', task: 'Negotiate the LOI carefully', description: 'Working capital methodology, exclusivity length, escrow terms, earnout structure. These "details" represent millions of dollars. Don\'t sign until every business point is negotiated.', category: 'legal', critical: true },
      { id: 'm6-5', task: 'Keep your runner-up warm', description: 'Even after signing the LOI with your top bidder, keep the #2 buyer informed (within what your agreement allows). They\'re your insurance against a re-trade.', category: 'advisory', critical: false },
    ]
  },
  {
    monthsOut: 3,
    label: '3 Months Out',
    phase: 'Diligence & Close',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    icon: <Shield className="w-6 h-6" />,
    description: 'Due diligence is underway. Respond quickly, be transparent, and let your team handle the day-to-day while you manage the process.',
    items: [
      { id: 'm3-1', task: 'Respond to diligence requests within 48 hours', description: 'Speed matters. Slow responses signal disorganization or that you\'re hiding something. Have your CFO/controller dedicated to diligence response.', category: 'operations', critical: true },
      { id: 'm3-2', task: 'Push back on unreasonable QoE adjustments', description: 'The buyer\'s QoE team will reject add-backs. Challenge every rejection in writing with documentation. Don\'t just accept their numbers — negotiate with data.', category: 'financial', critical: true },
      { id: 'm3-3', task: 'Negotiate the purchase agreement in detail', description: 'Escrow percentage, indemnification caps, rep survival periods, working capital collar, earnout operating covenants. Your M&A attorney earns their fee here.', category: 'legal', critical: true },
      { id: 'm3-4', task: 'Plan the employee and customer communication', description: 'Prepare announcements for the day of close. Key employees should hear from you first, customers should hear the story you want told. Control the narrative.', category: 'team', critical: false },
      { id: 'm3-5', task: 'Finalize transition planning', description: 'What\'s your role post-close? How long? What authority? Negotiate the transition services agreement before closing, not after. You have more leverage now than you ever will again.', category: 'operations', critical: false },
    ]
  },
];

// ── Main Component ──────────────────────────────────────────────

export const Countdown24: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [targetDate, setTargetDate] = useState('');
  const [completions, setCompletions] = useState<CompletionState>({});
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(24);

  useEffect(() => {
    const saved = localStorage.getItem('countdown-24-v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.targetDate) setTargetDate(parsed.targetDate);
        if (parsed.completions) setCompletions(parsed.completions);
        if (parsed.activeTab !== undefined) setActiveTab(parsed.activeTab);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('countdown-24-v1', JSON.stringify({ targetDate, completions, activeTab }));
  }, [targetDate, completions, activeTab]);

  const tabs = [
    { name: 'The Timeline', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Your Countdown', icon: <Clock className="w-4 h-4" /> },
    { name: 'Your Report', icon: <FileText className="w-4 h-4" /> }
  ];

  const toggleCompletion = (itemId: string) => {
    setCompletions(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const allItems = milestones.flatMap(m => m.items);
  const completedCount = allItems.filter(i => completions[i.id]).length;
  const totalItems = allItems.length;
  const criticalItems = allItems.filter(i => i.critical);
  const criticalCompleted = criticalItems.filter(i => completions[i.id]).length;

  // Calculate months remaining
  const getMonthsRemaining = () => {
    if (!targetDate) return null;
    const target = new Date(targetDate);
    const now = new Date();
    const months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    return Math.max(0, months);
  };

  const monthsRemaining = getMonthsRemaining();

  const getBehindItems = () => {
    if (monthsRemaining === null) return [];
    const behind: { item: MilestoneItem; milestone: Milestone }[] = [];
    milestones.forEach(ms => {
      if (ms.monthsOut > monthsRemaining) {
        ms.items.forEach(item => {
          if (!completions[item.id]) {
            behind.push({ item, milestone: ms });
          }
        });
      }
    });
    return behind;
  };

  const behindItems = getBehindItems();

  // ── CSV Export ────────────────────────────────────────────────

  const exportCSV = () => {
    const lines: string[] = [
      'PE Ready Plus - 24-Month Countdown Report',
      `Generated: ${new Date().toLocaleDateString()}`,
      targetDate ? `Target Close Date: ${new Date(targetDate).toLocaleDateString()}` : 'Target Close Date: Not Set',
      monthsRemaining !== null ? `Months Remaining: ${monthsRemaining}` : '',
      '',
      `Overall Progress: ${completedCount}/${totalItems} (${Math.round((completedCount / totalItems) * 100)}%)`,
      `Critical Items: ${criticalCompleted}/${criticalItems.length} complete`,
      `Behind Schedule: ${behindItems.length} items`,
      '',
      'FULL CHECKLIST',
      'Milestone,Phase,Task,Category,Critical,Status,Description',
    ];
    milestones.forEach(ms => {
      ms.items.forEach(item => {
        lines.push(`"${ms.label}","${ms.phase}","${item.task}","${item.category}","${item.critical ? 'Yes' : 'No'}","${completions[item.id] ? 'Complete' : 'Incomplete'}","${item.description}"`);
      });
    });
    if (behindItems.length > 0) {
      lines.push('', 'BEHIND SCHEDULE ITEMS', 'Should Have Been Done By,Task,Category,Critical');
      behindItems.forEach(({ item, milestone }) => {
        lines.push(`"${milestone.label}","${item.task}","${item.category}","${item.critical ? 'Yes' : 'No'}"`);
      });
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `24-month-countdown-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Tab 1: The Timeline ───────────────────────────────────────

  const renderTimeline = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-400" />
            The 24-Month Preparation Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The businesses that sell for top-of-market valuations don't prepare in 3 months — they prepare in 24.
            Here's the month-by-month calendar that separates premium exits from fire sales.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-400">10-25%</p>
              <p className="text-sm text-muted-foreground mt-1">Higher price from proper preparation</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">80%</p>
              <p className="text-sm text-muted-foreground mt-1">Of re-trades prevented by sell-side QoE</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-purple-400">$5-7M</p>
              <p className="text-sm text-muted-foreground mt-1">Tax savings from early planning on a $30M deal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {milestones.map((ms) => (
        <Card key={ms.monthsOut} className="bg-card border-border overflow-hidden">
          <button
            onClick={() => setExpandedMilestone(expandedMilestone === ms.monthsOut ? null : ms.monthsOut)}
            className="w-full text-left"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${ms.bgColor} border ${ms.borderColor}`}>
                    <div className={ms.color}>{ms.icon}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{ms.phase}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-0.5">{ms.label}</CardTitle>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {ms.items.filter(i => completions[i.id]).length}/{ms.items.length}
                  </span>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedMilestone === ms.monthsOut ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </CardHeader>
          </button>
          {expandedMilestone === ms.monthsOut && (
            <CardContent className="pt-0 space-y-3">
              <p className="text-sm text-muted-foreground border-t border-border pt-3">{ms.description}</p>
              {ms.items.map(item => (
                <div key={item.id} className={`rounded-lg border p-3 transition-colors ${
                  completions[item.id] ? 'bg-green-500/5 border-green-500/20' : 'bg-muted/30 border-border'
                }`}>
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleCompletion(item.id)}
                      className={`mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        completions[item.id]
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-muted-foreground/40 hover:border-primary'
                      }`}
                    >
                      {completions[item.id] && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-medium text-sm ${completions[item.id] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {item.task}
                        </p>
                        {item.critical && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] px-1.5">CRITICAL</Badge>
                        )}
                        <Badge className={categoryColors[item.category].badge + ' text-[10px] px-1.5'}>
                          {categoryColors[item.category].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );

  // ── Tab 2: Your Countdown ─────────────────────────────────────

  const renderCountdown = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-amber-400" />
            Set Your Target Close Date
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Enter when you want to close the deal. The system will calculate what you should have already done
            and flag anything you're behind on.
          </p>
          <div className="max-w-xs">
            <label className="text-sm font-medium text-foreground block mb-1">Target Close Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {monthsRemaining !== null && (
            <div className={`rounded-lg p-6 text-center border ${
              monthsRemaining >= 18 ? 'bg-green-500/10 border-green-500/20' :
              monthsRemaining >= 12 ? 'bg-blue-500/10 border-blue-500/20' :
              monthsRemaining >= 6 ? 'bg-yellow-500/10 border-yellow-500/20' :
              'bg-red-500/10 border-red-500/20'
            }`}>
              <p className="text-5xl font-bold text-foreground">{monthsRemaining}</p>
              <p className="text-muted-foreground mt-1">months until target close</p>
              {monthsRemaining < 12 && (
                <p className="text-sm text-red-400 mt-2">
                  {monthsRemaining < 6 ? 'Very tight timeline — some preparation steps may need to be compressed or skipped.' :
                   'You should already be deep into financial preparation and banker selection.'}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Behind Schedule Warning */}
      {behindItems.length > 0 && (
        <Card className="bg-red-500/5 border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              You're Behind on {behindItems.length} Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {behindItems.map(({ item, milestone }) => (
              <div key={item.id} className="flex items-start gap-3 bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                <button
                  onClick={() => toggleCompletion(item.id)}
                  className="mt-0.5 shrink-0 w-5 h-5 rounded border-2 border-red-400/40 hover:border-red-400 flex items-center justify-center"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-sm text-foreground">{item.task}</p>
                    {item.critical && <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] px-1.5">CRITICAL</Badge>}
                  </div>
                  <p className="text-xs text-red-400">Should have been done by: {milestone.label} ({milestone.phase})</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Progress by Milestone */}
      {monthsRemaining !== null && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Progress by Phase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {milestones.map(ms => {
              const msCompleted = ms.items.filter(i => completions[i.id]).length;
              const msTotal = ms.items.length;
              const pct = Math.round((msCompleted / msTotal) * 100);
              const isPast = ms.monthsOut > (monthsRemaining || 0);
              const barColor = pct === 100 ? 'bg-green-500' : isPast ? 'bg-red-500' : 'bg-blue-500';
              return (
                <div key={ms.monthsOut}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-foreground flex items-center gap-2">
                      {ms.label}
                      {isPast && pct < 100 && <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">BEHIND</Badge>}
                      {pct === 100 && <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">DONE</Badge>}
                    </span>
                    <span className="text-muted-foreground">{msCompleted}/{msTotal}</span>
                  </div>
                  <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Full Checklist */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Full Checklist ({completedCount}/{totalItems})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {milestones.map(ms => (
            <div key={ms.monthsOut}>
              <p className={`text-sm font-semibold ${ms.color} mt-3 mb-2`}>{ms.label} — {ms.phase}</p>
              {ms.items.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-1.5">
                  <button
                    onClick={() => toggleCompletion(item.id)}
                    className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      completions[item.id]
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-muted-foreground/40 hover:border-primary'
                    }`}
                  >
                    {completions[item.id] && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                  <span className={`text-sm ${completions[item.id] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {item.task}
                  </span>
                  {item.critical && <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] px-1.5">CRITICAL</Badge>}
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  // ── Tab 3: Report ─────────────────────────────────────────────

  const renderReport = () => {
    const pct = Math.round((completedCount / totalItems) * 100);
    const critPct = criticalItems.length > 0 ? Math.round((criticalCompleted / criticalItems.length) * 100) : 100;

    let verdict = '';
    let verdictColor = '';
    let verdictBg = '';
    if (pct >= 90 && critPct >= 90) {
      verdict = 'Ready to Launch Process';
      verdictColor = 'text-emerald-400';
      verdictBg = 'bg-emerald-500/10 border-emerald-500/20';
    } else if (pct >= 65) {
      verdict = 'Getting Close';
      verdictColor = 'text-green-400';
      verdictBg = 'bg-green-500/10 border-green-500/20';
    } else if (pct >= 40) {
      verdict = 'Significant Work Remaining';
      verdictColor = 'text-yellow-400';
      verdictBg = 'bg-yellow-500/10 border-yellow-500/20';
    } else {
      verdict = 'Early Stage — Keep Building';
      verdictColor = 'text-blue-400';
      verdictBg = 'bg-blue-500/10 border-blue-500/20';
    }

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Card className={`border ${verdictBg}`}>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">24-Month Countdown Status</p>
            <p className={`text-4xl font-bold ${verdictColor} mb-2`}>{verdict}</p>
            <p className="text-5xl font-bold text-foreground mb-1">{pct}%</p>
            <p className="text-muted-foreground">overall completion</p>
            {monthsRemaining !== null && (
              <p className="text-sm text-muted-foreground mt-2">{monthsRemaining} months remaining to target close</p>
            )}
            <div className="flex justify-center gap-6 text-sm mt-4">
              <span className="text-green-400">{completedCount} complete</span>
              <span className="text-muted-foreground">{totalItems - completedCount} remaining</span>
              <span className="text-red-400">{behindItems.length} behind schedule</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Critical Items Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {criticalItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-1.5">
                {completions[item.id] ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <span className={`text-sm ${completions[item.id] ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {item.task}
                </span>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-foreground font-medium">Critical items completed</span>
                <span className={critPct >= 80 ? 'text-green-400' : 'text-red-400'}>{criticalCompleted}/{criticalItems.length}</span>
              </div>
              <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                <div className={`h-full ${critPct >= 80 ? 'bg-green-500' : 'bg-red-500'} rounded-full`} style={{ width: `${critPct}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {behindItems.length > 0 && (
          <Card className="bg-red-500/5 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Behind Schedule ({behindItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {behindItems.map(({ item, milestone }) => (
                <div key={item.id} className="text-sm">
                  <span className="text-foreground font-medium">{item.task}</span>
                  <span className="text-red-400 ml-2">— due by {milestone.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center">
          <Button onClick={exportCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report as CSV
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
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
      {activeTab === 0 && renderTimeline()}
      {activeTab === 1 && renderCountdown()}
      {activeTab === 2 && renderReport()}
    </div>
  );
};
