import React, { useState } from 'react';

// ─── Helpers ─────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

// ─── Types ───────────────────────────────────────────────────────────────

interface TaxStrategy {
  id: string;
  name: string;
  full: string;
  timing: string;
  savings: string;
  color: string;
  desc: string;
  requirements: string[];
  watch: string;
}

interface Bucket {
  name: string;
  pct: number;
  color: string;
  desc: string;
  icon: string;
}

interface TimelinePhase {
  phase: string;
  window: string;
  color: string;
  actions: string[];
}

interface Mistake {
  mistake: string;
  cost: string;
  detail: string;
  fix: string;
}

interface QuizQuestion {
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

// ─── Data ────────────────────────────────────────────────────────────────

const TAX_STRATEGIES: TaxStrategy[] = [
  {
    id: 'qsbs',
    name: 'QSBS',
    full: 'Qualified Small Business Stock',
    timing: 'YEARS BEFORE EXIT',
    savings: 'Up to $10M tax-free',
    color: '#c8a84b',
    desc: 'C-Corp stock issued when gross assets were \u2264$50M. If held 5+ years, up to $10M of gain (or 10x basis) is federally tax-free. One of the most powerful founder tax tools in existence.',
    requirements: [
      'Must be a C-Corp at time of stock issuance',
      'Company gross assets \u2264$50M at issuance',
      'Stock held for 5+ years',
      'Cannot be S-Corp, partnership, or LLC',
      'Stock issued after September 27, 2010 for 100% exclusion',
    ],
    watch: 'Miss the 5-year hold and you lose everything. Check this status before accepting any buyout timeline.',
  },
  {
    id: 'state',
    name: 'STATE TAX MIGRATION',
    full: 'Residency-Based Tax Planning',
    timing: '18\u201324 MONTHS BEFORE EXIT',
    savings: '0\u201313.3% of gain',
    color: '#5a8a6a',
    desc: 'Moving from CA (13.3%), NY (10.9%), or NJ (10.75%) to FL, TX, WY, or NV before close can save millions. States audit aggressively \u2014 you need 2+ years of committed residency evidence.',
    requirements: [
      'Establish domicile 18\u201324 months before close',
      'Change driver\u2019s license, voter registration, banks',
      'File final-year resident return in old state',
      'Document days spent in new state (>183 recommended)',
      'Move primary home, doctors, religious affiliation',
    ],
    watch: 'CA will audit non-residents who had CA-source income. Keep a contemporaneous day log.',
  },
  {
    id: 'daf',
    name: 'DAF',
    full: 'Donor-Advised Fund',
    timing: 'PRE-CLOSE, AFTER LOI',
    savings: 'Deduction = contributed amount',
    color: '#6a5a9a',
    desc: 'Contribute appreciated stock to a DAF before the transaction closes. You get the full charitable deduction at contribution, avoid capital gains on that tranche, and distribute to charities on your own timeline.',
    requirements: [
      'Must contribute PRE-close (after LOI is OK)',
      'Contributing post-close eliminates the capital gains benefit',
      'Deduction limited to 30% of AGI for appreciated property',
      'Excess deduction carries forward 5 years',
      'Fidelity Charitable, Schwab, Vanguard all offer DAFs',
    ],
    watch: 'Timing is everything. Post-close contribution = no capital gains benefit, just a deduction.',
  },
  {
    id: 'installment',
    name: 'INSTALLMENT SALE',
    full: 'Deferred Recognition (IRC \u00a7453)',
    timing: 'DEAL STRUCTURE NEGOTIATION',
    savings: 'Spreads tax liability over years',
    color: '#8a5a3a',
    desc: 'Structure the deal so proceeds are received over multiple years. You only recognize gain when payments are received \u2014 spreading the tax hit across years and potentially lower brackets.',
    requirements: [
      'Must be structured at the deal level \u2014 can\u2019t retrofit post-close',
      'Buyer must agree to deferred payment structure',
      'Seller bears credit risk on future payments',
      'Doesn\u2019t work for publicly traded companies',
      'Interest on deferred payments is ordinary income',
    ],
    watch: 'You bear the buyer\u2019s credit risk. Demand security \u2014 escrow, LOC, or personal guarantee.',
  },
  {
    id: 'grat',
    name: 'GRAT',
    full: 'Grantor Retained Annuity Trust',
    timing: 'YEARS BEFORE EXIT',
    savings: 'Transfer appreciation estate-tax free',
    color: '#4a7a8a',
    desc: 'Transfer appreciating business interests into a GRAT before exit. If the assets grow faster than the IRS hurdle rate (7520 rate), the excess transfers to heirs estate-tax free. Powerful for pre-exit equity.',
    requirements: [
      'Grantor must survive the GRAT term',
      'Works best when 7520 rate is low',
      'Annuity payments return to grantor over term',
      'Zeroed-out GRATs: annuity = initial value + growth goes to heirs',
      'Must be established well before sale \u2014 IRS scrutinizes last-minute GRATs',
    ],
    watch: 'Grantor must outlive the trust term. Short terms (2\u20133 years) reduce mortality risk.',
  },
  {
    id: 'oz',
    name: 'OZ FUND',
    full: 'Opportunity Zone Investment',
    timing: '180 DAYS AFTER CLOSE',
    savings: 'Defer + reduce capital gains',
    color: '#6a8a4a',
    desc: 'Roll realized capital gains into a Qualified Opportunity Zone Fund within 180 days. Defers the original gain until 2026, potentially reduces it 10\u201315%, and eliminates tax on new appreciation after 10 years.',
    requirements: [
      'Must invest within 180 days of gain recognition',
      'Only the gain portion needs to be invested',
      '10-year hold eliminates tax on new appreciation',
      'Fund must hold 90%+ of assets in QOZ property',
      'Deferred original gain recognized Dec 31, 2026 or on sale',
    ],
    watch: 'OZ funds are illiquid 10-year commitments. Vet the fund manager like a PE investment.',
  },
];

const QSBS_CHECKLIST = [
  { id: 'ccorp', label: 'C-Corporation at time of stock issuance', tip: 'S-Corps, LLCs, partnerships do NOT qualify' },
  { id: 'assets', label: 'Gross assets \u2264$50M at issuance', tip: 'Measured at time stock was issued to you' },
  { id: 'hold', label: 'Stock held 5+ years', tip: 'Must hold from issuance to sale \u2014 no exceptions' },
  { id: 'after2010', label: 'Stock issued after Sept 27, 2010', tip: 'Required for 100% exclusion; partial exclusion for earlier dates' },
  { id: 'active', label: 'Company is an active trade or business', tip: 'Certain industries excluded: hospitality, financial services, farming, mining' },
];

const BUCKET_DATA: Bucket[] = [
  { name: 'LIQUIDITY', pct: 10, color: '#5a8a6a', desc: 'Cash / T-bills / money market. 12\u201324 months of expenses. Do not invest this. Its job is to exist.', icon: '\ud83d\udca7' },
  { name: 'CORE WEALTH', pct: 50, color: '#4a6fa5', desc: 'Diversified index + bonds. Low-cost, tax-efficient. Vanguard / DFA. This is your retirement engine.', icon: '\ud83c\udfdb' },
  { name: 'ALTERNATIVES', pct: 25, color: '#c8a84b', desc: 'Real estate, PE funds, hedge funds, private credit. Illiquid. Only commit what you won\u2019t need for 7\u201310 years.', icon: '\ud83d\udd00' },
  { name: 'OPPORTUNITY', pct: 10, color: '#a05050', desc: 'Angel, boards, second company. Hard cap this bucket. Founders torch their wealth here without guardrails.', icon: '\u26a1' },
  { name: 'LEGACY / PHILANTHROPY', pct: 5, color: '#7a5a9a', desc: 'DAF, foundation, charitable trusts. Purpose-driven capital. Integrate with your estate plan.', icon: '\ud83c\udf31' },
];

const TIMELINE: TimelinePhase[] = [
  {
    phase: 'PRE-EXIT',
    window: '3\u20135 Years Before',
    color: '#c8a84b',
    actions: [
      'Establish QSBS eligibility \u2014 confirm C-Corp structure and asset thresholds',
      'Begin state tax residency migration if applicable',
      'Set up trusts (GRAT, IDGT) while company valuation is still low',
      'Start estate plan update \u2014 beneficiary designations, POA, healthcare proxy',
      'Identify and assemble your advisor team (M&A attorney, tax CPA, wealth advisor)',
      'Begin 10-year tax roadmap with advisor',
    ],
  },
  {
    phase: 'DEAL YEAR',
    window: '12\u201318 Months Before Close',
    color: '#5a8a6a',
    actions: [
      'Finalize state residency documentation \u2014 day logs, domicile evidence',
      'Contribute to DAF after LOI signed, before close',
      'Negotiate deal structure: stock vs. asset sale, earnout, rollover equity terms',
      'Model installment sale scenarios with tax advisor',
      'Determine rollover equity % and vesting terms for next chapter',
      'Brief family on upcoming liquidity event and governance plan',
    ],
  },
  {
    phase: 'CLOSE + 90 DAYS',
    window: 'Immediately Post-Close',
    color: '#6a5a9a',
    actions: [
      'Invest liquidity bucket first \u2014 before doing anything else',
      'Do NOT make any large financial decisions for 90 days',
      'File estimated taxes \u2014 wire is due in the quarter of close',
      'Explore Opportunity Zone fund for 180-day window',
      'Update all beneficiary designations with new asset structure',
      'Evaluate Roth conversions while income composition has changed',
    ],
  },
  {
    phase: 'YEAR 1\u20132',
    window: 'Post-Close Foundation',
    color: '#4a7a8a',
    actions: [
      'Deploy Core Wealth bucket systematically \u2014 dollar-cost average over 12 months',
      'Set hard cap on Opportunity bucket \u2014 commit % in writing with advisor',
      'Establish family governance: annual meeting, written investment policy statement',
      'Build 10-year cashflow model \u2014 what does \u201cenough\u201d look like?',
      'Decide on next chapter: operating role, board seats, investing, nothing',
      'Review earnout milestones if applicable \u2014 understand clawback risk',
    ],
  },
  {
    phase: 'YEAR 3\u201310',
    window: 'Wealth Stewardship',
    color: '#3a7a5a',
    actions: [
      'Annual tax optimization: tax loss harvesting, Roth conversion ladder',
      'OZ fund 10-year hold period \u2014 track basis elimination date',
      'QSBS 5-year anniversary review \u2014 confirm exclusion eligibility',
      'Next-gen education: financial literacy, family office governance',
      'Charitable strategy: DAF grantmaking, foundation if appropriate',
      'Review estate plan every 3 years or after major life events',
    ],
  },
];

const MISTAKES: Mistake[] = [
  {
    mistake: 'Negotiating valuation instead of after-tax outcome',
    cost: 'Millions',
    detail: 'A $12M asset sale with no planning vs. a $10.5M stock sale with QSBS + state migration can put more cash in your pocket from the lower number.',
    fix: 'Model the after-tax outcome of every deal structure, not the headline.',
  },
  {
    mistake: 'Missing the DAF window',
    cost: '$50K\u2013$500K+',
    detail: 'Contributing stock post-close eliminates the capital gains benefit entirely. You get a deduction but you\u2019ve already recognized the gain.',
    fix: 'DAF contribution must happen after LOI, before close. Set a calendar reminder the day LOI is signed.',
  },
  {
    mistake: 'State residency \u2014 moving but not committing',
    cost: '6\u201313% of total gain',
    detail: 'Moving to Florida 6 months before close while keeping your CA house, doctors, and car registration = CA will audit you and win.',
    fix: '18\u201324 months minimum. Day logs, new bank, new doctors, new car registration, new voter registration. All of it.',
  },
  {
    mistake: '90-day decision paralysis vs. 90-day impulse spending',
    cost: 'Varies wildly',
    detail: 'Two failure modes: freezing everything in cash for 2 years (inflation and opportunity cost) or writing checks to every deal that comes in the first month.',
    fix: 'Liquidity bucket immediately. Everything else on a 12-month deployment schedule. No exceptions in month 1.',
  },
  {
    mistake: 'No cap on the Opportunity Bucket',
    cost: '30%+ of net worth',
    detail: 'Angel investing, second companies, and board roles feel like \u201cstaying active.\u201d Without a hard cap, founders quietly destroy decades of wealth chasing the next thing.',
    fix: 'Cap it at 10\u201315% of liquid net worth in writing. With your advisor. Before you take the first call.',
  },
  {
    mistake: 'Estate plan not updated before close',
    cost: 'Estate tax exposure',
    detail: 'The $13.61M lifetime exemption (2024) \u2014 potentially sunsetting in 2026. Trusts established before exit lock in low valuations. Established after, you lose that lever entirely.',
    fix: 'GRAT, IDGT, and estate plan updates must happen when company valuation is still low \u2014 years before exit.',
  },
  {
    mistake: 'Skipping the rollover equity conversation',
    cost: 'Deal value + alignment',
    detail: 'Refusing all rollover equity signals low conviction to the buyer and costs you on price. Too much rollover and you\u2019re back at risk concentration.',
    fix: '10\u201320% rollover is standard and expected. Negotiate for full upside participation in the next exit.',
  },
];

const QUIZ: QuizQuestion[] = [
  {
    q: 'Your company closes on April 15. You haven\u2019t yet contributed to a DAF. Can you still get the capital gains benefit?',
    opts: ['Yes \u2014 contribute within 30 days of close', 'No \u2014 the window closed at close', 'Yes \u2014 if you file an extension', 'Only if the gain is under $1M'],
    ans: 1,
    exp: 'The DAF contribution must happen before close. Contributing post-close means the gain is already recognized \u2014 you get a charitable deduction but zero capital gains benefit. The timing window is after LOI, before close.',
  },
  {
    q: 'You moved from California to Florida 8 months before your company closes. CA state income tax on your exit is...?',
    opts: ['Zero \u2014 you established Florida residency', 'Full CA rate \u2014 8 months is insufficient', 'Prorated based on days in each state', 'Depends entirely on deal structure'],
    ans: 1,
    exp: 'California audits aggressively. 8 months is not sufficient documented residency. CA will likely claim the gain as CA-source income. You need 18\u201324 months of committed, documented residency with a contemporaneous day log.',
  },
  {
    q: 'QSBS allows up to $10M of gain to be federally tax-free. What is the single most common way founders accidentally disqualify themselves?',
    opts: ['Holding the stock too long', 'The company was structured as an S-Corp, not a C-Corp', 'Taking VC money before exit', 'Selling to a PE buyer instead of strategic'],
    ans: 1,
    exp: 'QSBS requires a C-Corp at time of stock issuance. S-Corps, partnerships, LLCs, and sole proprietorships do not qualify. This is often discovered too late to fix because entity conversion has look-back implications.',
  },
  {
    q: 'You receive $8M at close. Your advisor recommends a 12-month deployment schedule. In month 1, a former colleague pitches you a deal. You should:',
    opts: ['Invest \u2014 you know this person and trust the deal', 'Decline \u2014 no investments in month 1, per your deployment schedule', 'Invest half to test the relationship', 'Ask the banker who ran your deal for a second opinion'],
    ans: 1,
    exp: 'Month 1 is the most dangerous month post-exit. Your judgment is impaired by the liquidity event and relationship loyalty. The deployment schedule exists precisely to protect you from this moment. No exceptions in month 1.',
  },
  {
    q: 'The lifetime gift and estate tax exemption is potentially sunsetting in 2026. What\u2019s the implication for post-exit estate planning?',
    opts: ['No impact \u2014 trusts still work the same after sunset', 'Founders should act NOW while the $13.61M exemption is in effect', 'Only affects estates over $50M', 'Wait for Congress to act before planning'],
    ans: 1,
    exp: 'The 2017 Tax Cuts and Jobs Act doubled the exemption \u2014 it sunsets December 31, 2025 unless extended. Transfers made using the current exemption are generally grandfathered. Waiting means potentially losing $7M+ in exemption capacity permanently.',
  },
];

// ─── Tabs ────────────────────────────────────────────────────────────────

const tabs = [
  { id: 'tax', label: 'Tax Strategies', icon: '1' },
  { id: 'buckets', label: 'Wealth Buckets', icon: '2' },
  { id: 'timeline', label: 'Timeline', icon: '3' },
  { id: 'mistakes', label: 'Mistakes', icon: '4' },
  { id: 'quiz', label: 'Quiz', icon: '5' },
];

// ─── Component ───────────────────────────────────────────────────────────

export function LifeAfterExit() {
  const [activeTab, setActiveTab] = useState('tax');
  const [activeTax, setActiveTax] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<number | null>(null);

  // Tax modeler state
  const [exitSize, setExitSize] = useState(5_000_000);
  const [stateRate, setStateRate] = useState(9.3);
  const [dafPct, setDafPct] = useState(0);
  const [qsbsChecks, setQsbsChecks] = useState<Record<string, boolean>>({});

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // ─── QSBS Eligibility ─────────────────────────────────────────────────
  const qsbsAllChecked = QSBS_CHECKLIST.every(item => qsbsChecks[item.id]);
  const qsbsPartial = Object.values(qsbsChecks).some(v => v) && !qsbsAllChecked;

  function toggleQsbs(id: string) {
    setQsbsChecks(prev => ({ ...prev, [id]: !prev[id] }));
  }

  // ─── Tax Calculations ─────────────────────────────────────────────────
  const basis = exitSize * 0.05;
  const gain = exitSize - basis;
  const qsbsExclusion = qsbsAllChecked ? Math.min(gain, 10_000_000) : 0;
  const afterQsbs = gain - qsbsExclusion;
  const dafAmount = afterQsbs * (dafPct / 100);
  const taxableGain = afterQsbs - dafAmount;
  const federalTax = taxableGain * 0.238; // 20% LTCG + 3.8% NIIT
  const stateTax = taxableGain * (stateRate / 100);
  const totalTax = federalTax + stateTax;
  const netProceeds = exitSize - totalTax;
  const effectiveRate = gain > 0 ? (totalTax / gain) * 100 : 0;

  // ─── Quiz Handlers ────────────────────────────────────────────────────

  function handleAnswer(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === QUIZ[quizIndex].ans) setScore(s => s + 1);
  }

  function nextQuestion() {
    if (quizIndex + 1 >= QUIZ.length) {
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

  // ─── CSV Export ────────────────────────────────────────────────────────

  function exportCSV() {
    const rows: string[] = [];
    rows.push('Life After Exit \u2014 Post-Sale Planning Report');
    rows.push('');

    rows.push('QUIZ RESULTS');
    rows.push(`Score,${score}/${QUIZ.length}`);
    rows.push(`Rating,${score === QUIZ.length ? 'Wealth Advisor Level' : score >= 3 ? 'Principal Level' : 'Founder Level'}`);
    rows.push('');
    rows.push('Question,Your Answer,Correct Answer,Result,Explanation');
    // Note: we don't track per-question answers in this educational module
    // Export the questions and correct answers for reference
    QUIZ.forEach((q, i) => {
      rows.push(`"${q.q.replace(/"/g, '""')}","${q.opts[q.ans].replace(/"/g, '""')}","${q.opts[q.ans].replace(/"/g, '""')}","See quiz","${q.exp.replace(/"/g, '""')}"`);
    });
    rows.push('');

    rows.push('TAX MODELER SNAPSHOT');
    rows.push(`Exit Proceeds,${fmt(exitSize)}`);
    rows.push(`State Tax Rate,${stateRate}%`);
    rows.push(`QSBS Eligible,${qsbsAllChecked ? 'Yes' : 'No'}`);
    rows.push(`DAF Contribution,${dafPct}% of gain`);
    rows.push(`Total Gain,${fmt(gain)}`);
    rows.push(`Total Tax,${fmt(totalTax)}`);
    rows.push(`Net Proceeds,${fmt(netProceeds)}`);
    rows.push(`Effective Tax Rate,${fmtPct(effectiveRate)}`);
    rows.push('');

    rows.push('TAX STRATEGIES');
    rows.push('Strategy,Full Name,Timing,Potential Savings');
    TAX_STRATEGIES.forEach(s => {
      rows.push(`"${s.name}","${s.full}","${s.timing}","${s.savings}"`);
    });
    rows.push('');

    rows.push('WEALTH BUCKETS');
    rows.push('Bucket,Target %,Amount (from modeler)');
    BUCKET_DATA.forEach(b => {
      rows.push(`"${b.name}",${b.pct}%,${fmt(netProceeds * b.pct / 100)}`);
    });
    rows.push('');

    rows.push('COMMON MISTAKES');
    rows.push('Mistake,Cost,Fix');
    MISTAKES.forEach(m => {
      rows.push(`"${m.mistake.replace(/"/g, '""')}","${m.cost}","${m.fix.replace(/"/g, '""')}"`);
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'life-after-exit-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ─── Render ────────────────────────────────────────────────────────────

  const q = QUIZ[quizIndex];

  return (
    <div className="max-w-5xl mx-auto">
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

      {/* ═══ TAB 1: TAX STRATEGIES ═══════════════════════════════════════ */}
      {activeTab === 'tax' && (
        <div className="space-y-6">
          {/* Exit Tax Modeler */}
          <div className="bg-card border border-amber-500/20 rounded-lg p-6">
            <h3 className="text-xs font-semibold tracking-[3px] text-amber-500 mb-6">EXIT TAX MODELER</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Exit Proceeds Slider */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>EXIT PROCEEDS</span>
                  <span className="text-amber-500 font-semibold">{fmt(exitSize)}</span>
                </div>
                <input
                  type="range"
                  min={1_000_000}
                  max={50_000_000}
                  step={500_000}
                  value={exitSize}
                  onChange={e => setExitSize(+e.target.value)}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* State Tax Rate Slider */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>STATE TAX RATE</span>
                  <span className="text-amber-500 font-semibold">{stateRate}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={13.3}
                  step={0.1}
                  value={stateRate}
                  onChange={e => setStateRate(+e.target.value)}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground/50 mt-1">
                  <span>FL/TX/WY (0%)</span>
                  <span>NY (10.9%)</span>
                  <span>CA (13.3%)</span>
                </div>
              </div>
            </div>

            {/* QSBS Eligibility Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold tracking-[2px] text-muted-foreground">QSBS ELIGIBILITY</span>
                  {qsbsAllChecked && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                      QUALIFIED
                    </span>
                  )}
                  {qsbsPartial && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      INCOMPLETE
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {QSBS_CHECKLIST.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleQsbs(item.id)}
                      className="flex items-start gap-3 w-full text-left group"
                    >
                      <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                        qsbsChecks[item.id]
                          ? 'bg-amber-500 border-amber-500'
                          : 'border-border/60 group-hover:border-amber-500/50'
                      }`}>
                        {qsbsChecks[item.id] && (
                          <span className="text-[10px] text-background font-bold">{'\u2713'}</span>
                        )}
                      </div>
                      <div>
                        <div className={`text-xs transition-colors ${
                          qsbsChecks[item.id] ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {item.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground/50">{item.tip}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {!qsbsAllChecked && Object.values(qsbsChecks).some(v => v) && (
                  <p className="text-[10px] text-amber-500/70 mt-2">
                    All boxes must be checked for the QSBS exclusion to activate in the model
                  </p>
                )}
              </div>

              {/* DAF Contribution */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>DAF CONTRIBUTION</span>
                  <span className="text-amber-500 font-semibold">{dafPct}% of gain</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={dafPct}
                  onChange={e => setDafPct(+e.target.value)}
                  className="w-full accent-amber-500"
                />
                <p className="text-[10px] text-muted-foreground/50 mt-1">
                  Charitable deduction limited to 30% of AGI for appreciated property
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="border-t border-border/40 pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-[10px] text-muted-foreground/60 tracking-wider">TOTAL GAIN</div>
                <div className="text-xl font-bold text-foreground mt-1">{fmt(gain)}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/60 tracking-wider">TOTAL TAX</div>
                <div className="text-xl font-bold text-red-400 mt-1">{fmt(totalTax)}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/60 tracking-wider">NET PROCEEDS</div>
                <div className="text-xl font-bold text-amber-500 mt-1">{fmt(netProceeds)}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/60 tracking-wider">EFFECTIVE RATE</div>
                <div className={`text-xl font-bold mt-1 ${effectiveRate > 30 ? 'text-red-400' : 'text-green-400'}`}>
                  {fmtPct(effectiveRate)}
                </div>
              </div>
            </div>

            {/* QSBS savings callout */}
            {qsbsAllChecked && gain > 10_000_000 && (
              <div className="mt-4 text-xs text-green-400 bg-green-500/5 border border-green-500/20 rounded-md px-4 py-3">
                {'\u2713'} QSBS saves {fmt(qsbsExclusion * 0.238)} in federal tax on first {fmt(qsbsExclusion)} of gain
              </div>
            )}
            {qsbsAllChecked && gain <= 10_000_000 && (
              <div className="mt-4 text-xs text-green-400 bg-green-500/5 border border-green-500/20 rounded-md px-4 py-3">
                {'\u2713'} QSBS excludes your ENTIRE gain \u2014 effective federal LTCG rate is 0%
              </div>
            )}
          </div>

          {/* Strategy Cards */}
          <div className="text-xs font-semibold tracking-[3px] text-muted-foreground mb-3">TAX STRATEGIES \u2014 CLICK TO EXPAND</div>
          <div className="space-y-3">
            {TAX_STRATEGIES.map(s => {
              const isActive = activeTax === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveTax(isActive ? null : s.id)}
                  className="w-full text-left bg-card border border-border/40 rounded-lg p-5 transition-all hover:border-border/60"
                  style={{ borderLeftWidth: 3, borderLeftColor: isActive ? s.color : s.color + '44' }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-4">
                      <span className="text-base font-bold tracking-wider" style={{ color: s.color }}>{s.name}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">{s.full}</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="text-[10px] tracking-wider px-2 py-0.5 rounded" style={{ color: s.color + 'cc', background: s.color + '15' }}>
                        {s.timing}
                      </span>
                      <span className="text-xs text-amber-500 font-medium">{s.savings}</span>
                    </div>
                  </div>

                  {isActive && (
                    <div className="mt-5 pt-5 border-t border-border/40" onClick={e => e.stopPropagation()}>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5">{s.desc}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="text-[10px] tracking-[2px] text-muted-foreground/60 mb-3">REQUIREMENTS</div>
                          {s.requirements.map((r, i) => (
                            <div key={i} className="flex gap-2 mb-2 text-xs text-muted-foreground">
                              <span style={{ color: s.color }}>{'\u2192'}</span>
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div className="text-[10px] tracking-[2px] text-red-400/60 mb-3">{'\u2691'} WATCH OUT</div>
                          <div className="text-xs text-red-300/80 leading-relaxed bg-red-500/5 border border-red-500/10 rounded-md px-4 py-3">
                            {s.watch}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TAB 2: WEALTH BUCKETS ═══════════════════════════════════════ */}
      {activeTab === 'buckets' && (
        <div className="space-y-6">
          <div className="bg-card border border-border/40 rounded-lg p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Post-exit allocation is not investing \u2014 it is capital stewardship. The framework below applies to liquid net worth after taxes. Each bucket has a different job. Do not confuse them.
            </p>
          </div>

          {/* Bucket Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BUCKET_DATA.map(b => (
              <div key={b.name} className="bg-card border border-border/40 rounded-lg p-5" style={{ borderLeftWidth: 3, borderLeftColor: b.color }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-base font-bold tracking-wider" style={{ color: b.color }}>{b.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{b.icon} Target: {b.pct}% of liquid net worth</div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: b.color + '44' }}>{b.pct}%</div>
                </div>
                <div className="h-1 bg-muted rounded-full mb-3">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(b.pct * 2, 100)}%`, background: b.color }} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Bucket Sizer */}
          <div className="bg-card border border-amber-500/20 rounded-lg p-6">
            <h3 className="text-xs font-semibold tracking-[3px] text-amber-500 mb-4">BUCKET SIZER</h3>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>NET PROCEEDS (after tax)</span>
                <span className="text-amber-500 font-semibold">{fmt(netProceeds)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground/50">{'\u2190'} Update in the Tax Strategies tab to recalculate</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {BUCKET_DATA.map(b => (
                <div key={b.name} className="text-center">
                  <div className="text-[10px] tracking-wider mb-1" style={{ color: b.color + 'aa' }}>{b.name.split(' ')[0]}</div>
                  <div className="text-base font-bold" style={{ color: b.color }}>{fmt(netProceeds * b.pct / 100)}</div>
                  <div className="text-[10px] text-muted-foreground/50">{b.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* The One Rule */}
          <div className="bg-card/50 border border-border/40 rounded-lg p-6">
            <div className="text-[10px] tracking-[3px] text-muted-foreground/60 mb-3">THE ONE RULE FOUNDERS BREAK MOST OFTEN</div>
            <p className="text-sm text-foreground leading-relaxed">
              The <span className="text-red-400 font-medium">Opportunity Bucket</span> has a{' '}
              <span className="text-amber-500 font-bold">hard cap</span>.
              Write it down. Sign it with your advisor. Then honor it when your former VP calls
              with a deal in month 2. The bucket exists so you can say yes to deals
              with full conviction \u2014 and no to everything else.
            </p>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: TIMELINE ═════════════════════════════════════════════ */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="bg-card border border-border/40 rounded-lg p-6 mb-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Post-exit success is built pre-exit. Click each phase to see the specific action items.
            </p>
          </div>

          {TIMELINE.map((phase, i) => {
            const isActive = activePhase === i;
            return (
              <button
                key={phase.phase}
                onClick={() => setActivePhase(isActive ? null : i)}
                className="w-full text-left bg-card border border-border/40 rounded-lg p-5 transition-all hover:bg-accent/30"
                style={{ borderLeftWidth: 3, borderLeftColor: isActive ? phase.color : phase.color + '44' }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ borderColor: phase.color, color: phase.color }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-base font-bold tracking-wider" style={{ color: phase.color }}>{phase.phase}</div>
                      <div className="text-xs text-muted-foreground/60 mt-0.5">{phase.window}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground/40">{phase.actions.length} action items</div>
                </div>

                {isActive && (
                  <div className="mt-5 pt-5 border-t border-border/40" onClick={e => e.stopPropagation()}>
                    {phase.actions.map((action, j) => (
                      <div key={j} className="flex gap-3 mb-3 items-start">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                          style={{ background: phase.color + '15', border: `1px solid ${phase.color}33`, color: phase.color }}
                        >
                          {j + 1}
                        </div>
                        <span className="text-sm text-muted-foreground leading-relaxed">{action}</span>
                      </div>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ═══ TAB 4: MISTAKES ═════════════════════════════════════════════ */}
      {activeTab === 'mistakes' && (
        <div className="space-y-4">
          <div className="bg-card border border-border/40 rounded-lg p-6 mb-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              These are not hypotheticals. Each of these has cost founders millions in real exits.
            </p>
          </div>

          {MISTAKES.map((m, i) => (
            <div key={i} className="bg-card border border-border/40 rounded-lg p-5" style={{ borderLeftWidth: 3, borderLeftColor: '#a05050' }}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                <div className="text-sm font-bold text-red-400 leading-tight">
                  #{i + 1} \u2014 {m.mistake.toUpperCase()}
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 tracking-wider whitespace-nowrap self-start">
                  COST: {m.cost}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{m.detail}</p>
              <div className="bg-green-500/5 border border-green-500/10 rounded-md px-4 py-3 text-xs text-green-400 leading-relaxed">
                <span className="font-semibold text-green-500">THE FIX: </span>{m.fix}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ TAB 5: QUIZ ═════════════════════════════════════════════════ */}
      {activeTab === 'quiz' && (
        <div>
          {!quizDone ? (
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>QUESTION {quizIndex + 1} OF {QUIZ.length}</span>
                <span className="text-amber-500">SCORE: {score}/{quizIndex + (selected !== null ? 1 : 0)}</span>
              </div>

              <div className="bg-card border border-border/40 rounded-lg p-6">
                <p className="text-sm text-foreground leading-relaxed mb-6">{q.q}</p>

                <div className="space-y-2">
                  {q.opts.map((opt, i) => {
                    let classes = 'w-full text-left px-4 py-3 rounded-md border text-xs transition-all ';
                    if (selected === null) {
                      classes += 'border-border/40 bg-card text-muted-foreground hover:border-amber-500/30 hover:text-foreground';
                    } else if (i === q.ans) {
                      classes += 'border-green-500/40 bg-green-500/5 text-green-400';
                    } else if (i === selected && selected !== q.ans) {
                      classes += 'border-red-500/40 bg-red-500/5 text-red-400';
                    } else {
                      classes += 'border-border/20 bg-card text-muted-foreground/40';
                    }

                    return (
                      <button
                        key={i}
                        className={classes}
                        onClick={() => handleAnswer(i)}
                        disabled={selected !== null}
                      >
                        <span className="text-muted-foreground/40 mr-3">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {selected !== null && (
                  <div className={`mt-4 px-4 py-3 rounded-md border text-xs leading-relaxed ${
                    selected === q.ans
                      ? 'bg-green-500/5 border-green-500/20 text-green-400'
                      : 'bg-red-500/5 border-red-500/20 text-red-400'
                  }`}>
                    <span className="font-semibold">
                      {selected === q.ans ? '\u2713 CORRECT \u2014 ' : '\u2717 INCORRECT \u2014 '}
                    </span>
                    {q.exp}
                  </div>
                )}
              </div>

              {selected !== null && (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2.5 rounded-md bg-amber-500 text-background text-xs font-semibold tracking-wider hover:bg-amber-400 transition-colors"
                >
                  {quizIndex + 1 < QUIZ.length ? 'NEXT \u2192' : 'RESULTS \u2192'}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl font-bold text-amber-500 mb-2">{score}/{QUIZ.length}</div>
              <p className="text-sm text-muted-foreground mb-8">
                {score === QUIZ.length
                  ? 'WEALTH ADVISOR LEVEL \u2014 You know what the IRS knows.'
                  : score >= 3
                  ? 'PRINCIPAL LEVEL \u2014 Solid. Review the tax strategies tab for the gaps.'
                  : 'FOUNDER LEVEL \u2014 You\u2019ve built great things. Now protect them. Start with the Tax tab.'}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2.5 rounded-md border border-amber-500/40 text-amber-500 text-xs font-semibold tracking-wider hover:bg-amber-500/10 transition-colors"
                >
                  RETAKE
                </button>
                <button
                  onClick={exportCSV}
                  className="px-6 py-2.5 rounded-md bg-amber-500 text-background text-xs font-semibold tracking-wider hover:bg-amber-400 transition-colors"
                >
                  EXPORT CSV
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-12 text-center text-[10px] text-muted-foreground/20 tracking-wider">
        FOR EDUCATIONAL PURPOSES ONLY {'\u00b7'} NOT TAX OR LEGAL ADVICE {'\u00b7'} CONSULT A QUALIFIED ADVISOR
      </div>
    </div>
  );
}
