import { useState } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface QuizQuestion {
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

interface EscrowPurpose {
  id: string;
  label: string;
  typical: string;
  duration: string;
  note: string;
}

// ─── UTILS ────────────────────────────────────────────────────────────────────

const fmt = (n: number): string => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Math.round(n).toLocaleString()}`;
};
const fmtPct = (n: number): string => `${n.toFixed(1)}%`;
const fmtX = (n: number): string => `${n.toFixed(2)}x`;

// ─── DATA ─────────────────────────────────────────────────────────────────────

const EARNOUT_METRICS = ["Revenue", "EBITDA", "Gross Profit", "Recurring Revenue", "Customer Count"];

const ESCROW_PURPOSES: EscrowPurpose[] = [
  { id: "reps", label: "R&W / Indemnification", typical: "10-15% of purchase price", duration: "12-24 months", note: "Most common. Covers seller misrepresentations discovered post-close." },
  { id: "wc", label: "Working Capital Peg", typical: "3-8% of purchase price", duration: "60-90 days", note: "True-up mechanism. Released when final working capital is agreed." },
  { id: "earnout", label: "Earnout Reserve", typical: "10-20% of earnout max", duration: "Per earnout period", note: "Buyer withholds portion pending performance milestone confirmation." },
  { id: "tax", label: "Tax Indemnification", typical: "5-10% of purchase price", duration: "Statute of limitations", note: "Covers pre-closing tax liabilities discovered after close." },
];

const STRUCT_QUIZ: QuizQuestion[] = [
  {
    q: "You're a C-Corp selling for $10M with a $2M tax basis. The buyer demands an asset sale. Versus a stock sale, roughly how much more do you pay in tax?",
    opts: ["~$200K more", "~$800K more", "~$1.5M more", "Same \u2014 structure doesn't affect C-Corp sellers"],
    ans: 2,
    exp: "Asset sale on a C-Corp triggers double taxation: corp pays 21% on the $8M gain (~$1.68M), then shareholders pay 20% LTCG on the distribution. Combined rate is ~67% on the gain vs. 20\u201323.8% in a stock sale. On an $8M gain the delta is roughly $1.5\u20131.9M."
  },
  {
    q: "A buyer offers $12M with a $2M earnout tied to Year 2 EBITDA of $3M. Current EBITDA is $2.5M. What is the seller's primary risk?",
    opts: ["The earnout target is too easy to hit", "Buyer can influence EBITDA accounting to miss the threshold", "The earnout period is too short", "Earnouts are only valid in asset sales"],
    ans: 1,
    exp: "Post-close, the buyer controls accounting, capex decisions, and allocation of overhead. They can legitimately (or aggressively) structure expenses that reduce reported EBITDA. Sellers must negotiate: defined accounting methodology, no new cost allocations, and management access during the earnout period."
  },
  {
    q: "You roll over 15% equity at a $10M valuation. The company sells 4 years later at $40M. Before taxes, your rollover is worth:",
    opts: ["$1.5M", "$4.5M", "$6M", "$10M"],
    ans: 2,
    exp: "Your 15% stake at $10M = $1.5M. At exit, the company is worth $40M \u00d7 15% = $6M. That's a 4x on your rollover, taxed as long-term capital gains. The real question is always: what % did you negotiate and at what exit do you share equally in upside?"
  },
  {
    q: "What is a 338(h)(10) election and when does it benefit both parties?",
    opts: ["It converts capital gains to ordinary income \u2014 never beneficial", "It lets a stock sale be treated as an asset sale for tax purposes \u2014 buyer gets step-up, seller is compensated for incremental tax cost", "It eliminates earnout obligations in asset sales", "It defers all gain recognition to the next fiscal year"],
    ans: 1,
    exp: "338(h)(10) gives the buyer asset sale economics (step-up in basis, accelerated depreciation) while keeping the legal simplicity of a stock sale. Seller bears incremental tax cost but is typically compensated through a higher purchase price \u2014 net neutral to slightly positive for both sides."
  },
  {
    q: "A seller financing note is offered at 6% over 5 years for 20% of the purchase price. What is the seller's primary risk?",
    opts: ["Interest rate risk \u2014 rates may rise", "Buyer default \u2014 seller is now an unsecured creditor", "IRS disallows installment treatment", "Seller loses capital gains treatment on the financed portion"],
    ans: 1,
    exp: "When you take a seller note, you become a creditor of the buyer. If the business underperforms post-close and the buyer defaults, you have limited recourse \u2014 especially if the note is subordinated to senior debt. Always demand a UCC-1 filing, personal guarantee, and a secured interest in business assets."
  }
];

const SELLER_EARNOUT_CHECKLIST = [
  "Defined accounting methodology \u2014 GAAP, locked at close",
  "No new overhead allocations from parent post-close",
  "Management access and P&L authority during earnout period",
  "Anti-sandbagging clause \u2014 buyer can't sandbag revenue",
  "Accelerate on change of control during earnout",
  "Dispute resolution mechanism (arbitration, not litigation)",
  "Escrow for disputed amounts during resolution",
  "Cap on buyer's ability to change accounting policies"
];

const BUYER_EARNOUT_CHECKLIST = [
  "Define the metric with precision \u2014 no ambiguity at year-end",
  "Reserve right to integrate company into parent operations",
  "Include management incentive alignment for earnout period",
  "Audit rights on seller's books during earnout",
  "Define what constitutes 'gross revenue' vs 'net revenue'",
  "Cap the earnout exposure as % of total deal value",
  "Include earnout expiration \u2014 no open-ended obligations",
  "Dispute resolution carve-out from R&W insurance"
];

const SELLER_ROLLOVER_TIPS = [
  "Pro-rata participation in any future exit \u2014 no waterfall below your entry",
  "Tag-along rights \u2014 you sell when the PE firm sells",
  "Information rights \u2014 quarterly financials, IC memos",
  "Anti-dilution on future equity raises",
  "Accelerated vesting on change of control",
  "Drag-along only at prices above your entry",
  "No new management equity pool diluting your stake without consent",
  "Rollover taxed as LTCG \u2014 confirm at close with your CPA"
];

const BUYER_ROLLOVER_TIPS = [
  "Minimum 10% rollover \u2014 below that, seller has no skin in the game",
  "Vest rollover over 3\u20134 years with cliff \u2014 keeps management locked in",
  "Exclude rollover from R&W indemnification pool",
  "Tie a portion of rollover to earnout metric (double incentive)",
  "Require seller to hold equity for full hold period \u2014 no secondary sales",
  "Use rollover as drag-along mechanism \u2014 simplifies future exit",
  "Set governance rights proportional to rollover stake",
  "Document rollover as separate equity class in cap table from day one"
];

const SELLER_NOTE_PROTECTION = [
  "UCC-1 filing \u2014 secured interest in all business assets",
  "Personal guarantee from buyer principals",
  "Subordination agreement \u2014 clarify your position vs. senior debt",
  "Cross-default clause \u2014 if senior debt defaults, so does your note",
  "Monthly financial reporting during note period",
  "No additional senior debt above agreed level without consent",
  "Acceleration clause on business sale or change of control",
  "Life insurance on key buyer principals equal to note balance"
];

const BUYER_NOTE_OBLIGATIONS = [
  "Negotiate subordination to senior lender \u2014 seller note is junior",
  "Negotiate right to prepay without penalty",
  "Tie note to business cash flow \u2014 not personal guarantees if possible",
  "Seller note maturity after senior debt matures",
  "Define cure period for any default triggers",
  "Carve out earnout clawback from note balance",
  "Negotiate interest-only period for first 12 months",
  "Include note forgiveness provision on seller breach of R&W"
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export const DealStructureLab = () => {
  const [tab, setTab] = useState("structure");
  const [chair, setChair] = useState<"seller" | "buyer">("seller");

  // Structure tab
  const [dealSize, setDealSize] = useState(10_000_000);
  const [taxBasis, setTaxBasis] = useState(2_000_000);
  const [entityType, setEntityType] = useState<"s-corp" | "c-corp">("s-corp");
  const [stateRate, setStateRate] = useState(5.0);
  const [h10, setH10] = useState(false);

  // Earnout tab
  const [basePrice, setBasePrice] = useState(8_000_000);
  const [earnoutMax, setEarnoutMax] = useState(2_000_000);
  const [earnoutMetric, setEarnoutMetric] = useState("EBITDA");
  const [threshold, setThreshold] = useState(2_500_000);
  const [target, setTarget] = useState(3_000_000);
  const [stretch, setStretch] = useState(3_500_000);
  const [miss, setMiss] = useState(2_200_000);
  const [base, setBase] = useState(2_800_000);
  const [hit, setHit] = useState(3_200_000);

  // Rollover tab
  const [totalVal, setTotalVal] = useState(10_000_000);
  const [rolloverPct, setRolloverPct] = useState(15);
  const [holdYears, setHoldYears] = useState(4);
  const [exitMultiple, setExitMultiple] = useState(3.5);

  // PPA / Escrow tab
  const [ppaDeal, setPpaDeal] = useState(10_000_000);
  const [wcPeg, setWcPeg] = useState(1_200_000);
  const [wcActual, setWcActual] = useState(1_100_000);
  const [escrowPct, setEscrowPct] = useState(10);
  const [escrowMonths, setEscrowMonths] = useState(18);
  const [activeEscrow, setActiveEscrow] = useState<string | null>(null);

  // Seller finance tab
  const [sfDeal, setSfDeal] = useState(10_000_000);
  const [sfPct, setSfPct] = useState(20);
  const [sfRate, setSfRate] = useState(6.0);
  const [sfYears, setSfYears] = useState(5);

  // Quiz
  const [qi, setQi] = useState(0);
  const [qSel, setQSel] = useState<number | null>(null);
  const [qScore, setQScore] = useState(0);
  const [qDone, setQDone] = useState(false);

  // ── Accent color system ──
  const ac = chair === "seller" ? "#3B82F6" : "#5a8a9a"; // kept for slider accentColor only
  const isSeller = chair === "seller";
  const acText = isSeller ? "text-blue-400" : "text-teal-400";
  const acBorder = isSeller ? "border-blue-500/30" : "border-teal-500/30";
  const acBorderSolid = isSeller ? "border-l-blue-500" : "border-l-teal-500";
  const acBg = isSeller ? "bg-blue-500" : "bg-teal-500";
  const acBgSubtle = isSeller ? "bg-blue-500/10" : "bg-teal-500/10";

  // ── Structure Calcs ──
  const gain = dealSize - taxBasis;
  const ltcgRate = 0.20;
  const niitRate = 0.038;
  const corpTaxRate = 0.21;

  let stockTax: number, assetTax: number;

  if (entityType === "c-corp") {
    const corpGainTax = gain * corpTaxRate;
    const distrib = dealSize - corpGainTax;
    const distribGain = distrib - taxBasis;
    const shareholderTax = Math.max(0, distribGain) * (ltcgRate + niitRate);
    assetTax = corpGainTax + shareholderTax;
    stockTax = gain * (ltcgRate + niitRate) + gain * (stateRate / 100);
    if (h10) assetTax = stockTax * 1.12;
  } else {
    stockTax = gain * (ltcgRate + niitRate) + gain * (stateRate / 100);
    assetTax = gain * 0.28 + gain * (stateRate / 100);
  }

  const delta = assetTax - stockTax;
  const stockNet = dealSize - stockTax;
  const assetNet = dealSize - assetTax;

  // ── Earnout Calcs ──
  const earnoutPer = (actual: number, thresh: number, targ: number, str: number, max: number): number => {
    if (actual < thresh) return 0;
    if (actual >= str) return max;
    if (actual >= targ) return max * 0.7 + ((actual - targ) / (str - targ)) * max * 0.3;
    return ((actual - thresh) / (targ - thresh)) * max * 0.7;
  };
  const missEarn = earnoutPer(miss, threshold, target, stretch, earnoutMax);
  const baseEarn = earnoutPer(base, threshold, target, stretch, earnoutMax);
  const hitEarn = earnoutPer(hit, threshold, target, stretch, earnoutMax);

  // ── Rollover Calcs ──
  const rolloverAmt = totalVal * (rolloverPct / 100);
  const cashAtClose = totalVal - rolloverAmt;
  const exitVal = totalVal * exitMultiple;
  const rolloverExit = exitVal * (rolloverPct / 100);
  const rolloverGain = rolloverExit - rolloverAmt;
  const rolloverTax = rolloverGain * (ltcgRate + niitRate);
  const rolloverNet = rolloverExit - rolloverTax;
  const totalNet = cashAtClose + rolloverNet;

  // ── PPA Calcs ──
  const wcAdj = wcActual - wcPeg;
  const escrowAmt = ppaDeal * (escrowPct / 100);
  const cashAtClosePPA = ppaDeal - escrowAmt + Math.min(0, wcAdj);
  const escrowRelease = escrowAmt;

  // ── Seller Finance Calcs ──
  const sfNote = sfDeal * (sfPct / 100);
  const sfCash = sfDeal - sfNote;
  const monthlyRate = sfRate / 100 / 12;
  const nMonths = sfYears * 12;
  const monthlyPayment = sfNote * (monthlyRate * Math.pow(1 + monthlyRate, nMonths)) / (Math.pow(1 + monthlyRate, nMonths) - 1);
  const totalReceived = sfCash + monthlyPayment * nMonths;
  const totalInterest = monthlyPayment * nMonths - sfNote;

  // ── Quiz handler ──
  const handleQ = (i: number) => {
    if (qSel !== null) return;
    setQSel(i);
    if (i === STRUCT_QUIZ[qi].ans) setQScore(s => s + 1);
  };

  const TABS = ["structure", "earnout", "rollover", "escrow & ppa", "seller finance", "quiz"];

  return (
    <div className="min-h-screen text-white/80 px-5 py-7">
      <style>{`
        .dsl-range { width: 100%; }
        .dsl-range::-webkit-slider-thumb { cursor: pointer; }
      `}</style>

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-baseline gap-3 mb-1">
          <div className={`text-4xl tracking-wide leading-none ${acText}`}>Deal Structure Lab</div>
        </div>
        <div className="text-xs text-white/40 mt-1">Five calculators. Both sides of the table. The math that decides what you actually take home.</div>
      </div>

      {/* Chair toggle */}
      <div className="flex gap-2.5 mb-5 items-center">
        <div className="text-xs text-white/40 mr-1">YOU ARE:</div>
        <button
          onClick={() => setChair("seller")}
          className={`px-5 py-2 rounded text-xs tracking-wide transition-all border ${
            isSeller ? "border-blue-500/50 text-blue-400 bg-blue-500/10" : "border-white/10 text-white/30"
          }`}
        >
          SELLER — maximize net proceeds
        </button>
        <button
          onClick={() => setChair("buyer")}
          className={`px-5 py-2 rounded text-xs tracking-wide transition-all border ${
            !isSeller ? "border-teal-500/50 text-teal-400 bg-teal-500/10" : "border-white/10 text-white/30"
          }`}
        >
          BUYER — minimize tax leakage & risk
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 mb-6 flex flex-wrap">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`bg-transparent border-none px-3.5 py-2.5 text-xs tracking-wide transition-all border-b-2 ${
              tab === t ? `${acText} ${isSeller ? "border-b-blue-500" : "border-b-teal-500"}` : "text-white/20 border-b-transparent"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STRUCTURE TAB
         ══════════════════════════════════════════════════════════════════════ */}
      {tab === "structure" && (
        <div>
          <p className="text-sm text-white/40 mb-5 leading-relaxed">
            {chair === "seller"
              ? "Stock sale = capital gains treatment on the full gain. Asset sale = ordinary income on recaptured depreciation + capital gains on the rest. The delta is often seven figures."
              : "Asset sale gives you a step-up in basis \u2014 more depreciation post-close, lower taxes for years. Stock sale means you inherit the seller's basis and all unknown liabilities."}
          </p>

          {/* Inputs */}
          <div className={`bg-white/5 border rounded-lg p-5 mb-4 ${acBorder}`}>
            <div className={`text-xs tracking-wide mb-4 ${acText}`}>DEAL INPUTS</div>
            <div className="grid grid-cols-3 gap-5">
              {([
                ["PURCHASE PRICE", dealSize, setDealSize, 1_000_000, 50_000_000, 500_000],
                ["TAX BASIS", taxBasis, setTaxBasis, 0, dealSize * 0.8, 100_000],
                ["STATE TAX RATE", stateRate, setStateRate, 0, 13.3, 0.1],
              ] as const).map(([label, val, set, min, max, step]) => (
                <div key={label as string}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-white/40 tracking-wide">{label as string}</span>
                    <span className={`text-sm ${acText}`}>
                      {label === "STATE TAX RATE" ? `${val}%` : fmt(val as number)}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="dsl-range w-full"
                    style={{ accentColor: ac }}
                    min={min as number}
                    max={max as number}
                    step={step as number}
                    value={label === "TAX BASIS" ? Math.min(val as number, (max as number)) : val as number}
                    onChange={e => (set as (v: number) => void)(+e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-3 items-center">
              <span className="text-xs text-white/40 tracking-wide">ENTITY TYPE:</span>
              {([["s-corp", "S-Corp / LLC (Pass-Through)"], ["c-corp", "C-Corp"]] as const).map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setEntityType(v)}
                  className={`px-3.5 py-1.5 border rounded text-xs tracking-wide transition-all ${
                    entityType === v ? `${acText} ${acBorder} ${acBgSubtle}` : "border-white/10 text-white/30"
                  }`}
                >
                  {l}
                </button>
              ))}
              {entityType === "c-corp" && (
                <button
                  onClick={() => setH10(b => !b)}
                  className={`px-3.5 py-1.5 border rounded text-xs tracking-wide transition-all ${
                    h10 ? "border-teal-500/30 text-teal-400 bg-teal-500/10" : "border-white/10 text-white/30"
                  }`}
                >
                  338(h)(10) ELECTION {h10 ? "ON" : "OFF"}
                </button>
              )}
            </div>
          </div>

          {/* Results comparison */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {([
              { label: "STOCK SALE", tax: stockTax, net: stockNet, cls: "text-green-400 border-l-green-500", badgeCls: "bg-green-500/10 text-green-400", badge: isSeller ? "SELLER PREFERS" : "BUYER AVOIDS" },
              { label: "ASSET SALE", tax: assetTax, net: assetNet, cls: !isSeller ? "text-green-400 border-l-green-500" : "text-red-400 border-l-red-500", badgeCls: !isSeller ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400", badge: !isSeller ? "BUYER PREFERS" : "SELLER AVOIDS" }
            ]).map(s => (
              <div key={s.label} className={`bg-white/5 border border-white/10 border-l-[3px] rounded-lg p-5 ${s.cls.split(' ').filter(c => c.startsWith('border-l-')).join(' ')}`}>
                <div className="flex justify-between mb-3.5">
                  <div className={`text-lg tracking-wide ${s.cls.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>{s.label}</div>
                  <div className={`text-xs px-2 py-0.5 rounded tracking-wide ${s.badgeCls}`}>{s.badge}</div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <div className="text-xs text-white/40 tracking-wide">TOTAL GAIN</div>
                    <div className="text-lg mt-0.5 text-white/90 tracking-wider">{fmt(gain)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 tracking-wide">TAX BURDEN</div>
                    <div className="text-lg mt-0.5 text-red-400 tracking-wider">{fmt(s.tax)}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-white/40 tracking-wide">NET PROCEEDS</div>
                    <div className={`text-2xl mt-0.5 tracking-wider ${s.cls.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>{fmt(s.net)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 tracking-wide">EFFECTIVE RATE</div>
                    <div className="text-sm mt-0.5 text-white/60">{fmtPct((s.tax / gain) * 100)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delta */}
          <div className={`bg-white/5 border rounded-lg p-5 ${acBorder}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-white/40 tracking-wide mb-1">
                  STRUCTURE DELTA &mdash; {isSeller ? "SELLER COST OF ACCEPTING ASSET SALE" : "BUYER BENEFIT OF PUSHING ASSET SALE"}
                </div>
                <div className={`text-3xl tracking-wider ${acText}`}>{fmt(Math.abs(delta))}</div>
              </div>
              <div className="text-sm text-white/45 max-w-[55%] leading-relaxed text-right">
                {isSeller
                  ? "This is what you leave on the table by accepting an asset sale at the same price. A smart seller uses this number to demand a price premium to offset the tax cost."
                  : `This is the buyer's tax benefit from structuring as an asset sale. Use this as a lever: offer the seller ${fmt(delta * 0.4)}\u2013${fmt(delta * 0.6)} more to cover their incremental tax cost \u2014 net positive for both sides.`}
              </div>
            </div>
          </div>

          {/* 338(h)(10) explainer */}
          {entityType === "c-corp" && (
            <div className="bg-white/5 border border-white/10 border-l-[3px] border-l-teal-500 rounded-lg p-5 mt-3">
              <div className="text-sm text-teal-400 tracking-wide mb-2">338(h)(10) ELECTION</div>
              <p className="text-sm text-white/60 leading-relaxed">
                Allows a stock sale to be treated as an asset purchase for tax purposes. Buyer gets the step-up in basis and accelerated depreciation. Seller bears incremental tax cost &mdash; but buyer typically compensates through a higher headline price. Net result: <span className="text-teal-400">closes the gap between buyer and seller preferences without changing legal structure.</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          EARNOUT TAB
         ══════════════════════════════════════════════════════════════════════ */}
      {tab === "earnout" && (
        <div>
          <p className="text-sm text-white/40 mb-5 leading-relaxed">
            {chair === "seller"
              ? "Earnouts bridge valuation gaps but you give up control of the metric. Know your floor, your target, and your ceiling \u2014 then negotiate the accounting methodology harder than the numbers."
              : "Earnouts let you pay tomorrow's price only if tomorrow's performance arrives. Structure thresholds carefully \u2014 too easy and you overpay; too hard and management disengages."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Structure inputs */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <div className={`text-xs tracking-wide mb-4 ${acText}`}>DEAL STRUCTURE</div>
              {([
                ["BASE PRICE (AT CLOSE)", basePrice, setBasePrice, 1_000_000, 30_000_000, 500_000],
                ["EARNOUT MAX POTENTIAL", earnoutMax, setEarnoutMax, 500_000, 10_000_000, 250_000],
              ] as [string, number, (v: number) => void, number, number, number][]).map(([label, val, set, min, max, step]) => (
                <div key={label} className="mb-3.5">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-white/40 tracking-wide">{label}</span>
                    <span className={`text-sm ${acText}`}>{fmt(val)}</span>
                  </div>
                  <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={min} max={max} step={step} value={val} onChange={e => set(+e.target.value)} />
                </div>
              ))}
              <div className="mb-3.5">
                <span className="text-xs text-white/40 tracking-wide">EARNOUT METRIC</span>
                <select
                  value={earnoutMetric}
                  onChange={e => setEarnoutMetric(e.target.value)}
                  className="ml-3 bg-white/10 border border-white/10 text-white/80 text-sm px-2.5 py-1.5 rounded outline-none"

                >
                  {EARNOUT_METRICS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="border-t border-white/10 pt-3.5">
                <div className="text-xs text-white/30 tracking-wide mb-2.5">THRESHOLD / TARGET / STRETCH</div>
                {([
                  ["THRESHOLD (0% earned below)", threshold, setThreshold],
                  ["TARGET (70% earned at)", target, setTarget],
                  ["STRETCH (100% earned at)", stretch, setStretch],
                ] as [string, number, (v: number) => void][]).map(([label, val, set]) => (
                  <div key={label} className="mb-2.5">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-white/40">{label}</span>
                      <span className={`text-xs ${acText}`}>{fmt(val)}</span>
                    </div>
                    <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={500_000} max={10_000_000} step={100_000} value={val} onChange={e => set(+e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Scenario inputs */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <div className={`text-xs tracking-wide mb-4 ${acText}`}>PERFORMANCE SCENARIOS</div>
              {([
                { label: "MISS SCENARIO", val: miss, set: setMiss, col: "#c06060", earned: missEarn },
                { label: "BASE SCENARIO", val: base, set: setBase, col: "#3B82F6", earned: baseEarn },
                { label: "HIT SCENARIO", val: hit, set: setHit, col: "#5a8a6a", earned: hitEarn },
              ]).map(s => (
                <div key={s.label} className="mb-4 p-3 bg-white/[0.03] rounded" style={{ border: `1px solid ${s.col}22` }}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm tracking-wide" style={{ color: s.col }}>{s.label}</span>
                    <span className="text-sm" style={{ color: s.col }}>{earnoutMetric}: {fmt(s.val)}</span>
                  </div>
                  <input type="range" className="dsl-range w-full" style={{ accentColor: s.col }} min={500_000} max={10_000_000} step={100_000} value={s.val} onChange={e => s.set(+e.target.value)} />
                  <div className="grid grid-cols-2 gap-2 mt-2.5">
                    <div>
                      <div className="text-xs text-white/30">EARNOUT EARNED</div>
                      <div className="text-base mt-0.5 tracking-wider" style={{ color: s.col }}>{fmt(s.earned)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/30">TOTAL DEAL VALUE</div>
                      <div className="text-base mt-0.5 tracking-wider" style={{ color: s.col }}>{fmt(basePrice + s.earned)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnout protection rules */}
          <div className={`bg-white/5 border border-white/10 border-l-[3px] rounded-lg p-5 ${acBorderSolid}`}>
            <div className={`text-xs tracking-wide mb-3 ${acText}`}>
              {chair === "seller" ? "SELLER PROTECTION CHECKLIST \u2014 NEGOTIATE THESE OR DON'T TAKE THE EARNOUT" : "BUYER STRUCTURING RULES \u2014 PROTECT YOURSELF FROM DISPUTE"}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(chair === "seller" ? SELLER_EARNOUT_CHECKLIST : BUYER_EARNOUT_CHECKLIST).map((item, i) => (
                <div key={i} className="flex gap-2 text-xs text-white/50 items-start">
                  <span className={`shrink-0 ${acText}`}>&rarr;</span>{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ROLLOVER TAB
         ══════════════════════════════════════════════════════════════════════ */}
      {tab === "rollover" && (
        <div>
          <p className="text-sm text-white/40 mb-5 leading-relaxed">
            {chair === "seller"
              ? "Rollover equity is a bet on the buyer's ability to create value. You take less cash today in exchange for a second bite at the apple. The question: do you trust the buyer's thesis more than you trust your own reinvestment options?"
              : "Rollover equity aligns the seller with your exit thesis. They have skin in the game post-close. Standard is 10\u201320%. Less than 10% signals low conviction. More than 25% may create governance tension."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <div className={`text-xs tracking-wide mb-4 ${acText}`}>ROLLOVER INPUTS</div>
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/40 tracking-wide">COMPANY VALUE AT CLOSE</span>
                  <span className={`text-sm ${acText}`}>{fmt(totalVal)}</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={2_000_000} max={50_000_000} step={500_000} value={totalVal} onChange={e => setTotalVal(+e.target.value)} />
              </div>
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/40 tracking-wide">ROLLOVER %</span>
                  <span className={`text-sm ${acText}`}>{rolloverPct}%</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={5} max={35} step={1} value={rolloverPct} onChange={e => setRolloverPct(+e.target.value)} />
                <div className="flex justify-between text-xs text-white/20 mt-0.5">
                  <span>Minimal (5%)</span><span>Standard (15%)</span><span>Heavy (35%)</span>
                </div>
              </div>
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/40 tracking-wide">EXIT MULTIPLE (on entry)</span>
                  <span className={`text-sm ${acText}`}>{exitMultiple}x</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={1.0} max={6.0} step={0.25} value={exitMultiple} onChange={e => setExitMultiple(+e.target.value)} />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/40 tracking-wide">HOLD PERIOD (years)</span>
                  <span className={`text-sm ${acText}`}>{holdYears} yrs</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={2} max={8} step={1} value={holdYears} onChange={e => setHoldYears(+e.target.value)} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <div className={`text-xs tracking-wide mb-4 ${acText}`}>ROLLOVER OUTCOME</div>
              <div className="grid gap-3">
                {([
                  { label: "ROLLOVER AMOUNT", val: fmt(rolloverAmt), color: "#888", note: "Equity you're leaving at the table" },
                  { label: "CASH AT CLOSE", val: fmt(cashAtClose), color: "#3B82F6", note: "What you take home day one" },
                  { label: "EXIT VALUE (your %)", val: fmt(rolloverExit), color: "#5a8a6a", note: `${rolloverPct}% of ${fmt(exitVal)}` },
                  { label: "ROLLOVER NET (after tax)", val: fmt(rolloverNet), color: "#5a8a6a", note: "LTCG + NIIT on gain" },
                  { label: "TOTAL NET PROCEEDS", val: fmt(totalNet), color: ac, note: "Cash at close + rollover net" },
                ]).map(row => (
                  <div key={row.label} className="flex justify-between items-center border-b border-white/10 pb-2.5">
                    <div>
                      <div className="text-xs text-white/40">{row.label}</div>
                      <div className="text-xs text-white/20 mt-0.5">{row.note}</div>
                    </div>
                    <div className="text-lg tracking-wider" style={{ color: row.color }}>{row.val}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3.5 p-3 bg-green-500/5 border border-green-500/20 rounded">
                <div className="text-xs text-green-500 tracking-wide mb-1">ROLLOVER MOIC</div>
                <div className="text-2xl text-green-400 tracking-wider" >{fmtX(rolloverExit / rolloverAmt)}</div>
                <div className="text-xs text-white/30 mt-1">
                  IRR &asymp; {fmtPct(((rolloverExit / rolloverAmt) ** (1 / holdYears) - 1) * 100)} over {holdYears} years
                </div>
              </div>
            </div>
          </div>

          {/* Rollover negotiation tips */}
          <div className={`bg-white/5 border border-white/10 border-l-[3px] rounded-lg p-5 ${acBorderSolid}`}>
            <div className={`text-xs tracking-wide mb-3 ${acText}`}>
              {chair === "seller" ? "WHAT TO NEGOTIATE IN YOUR ROLLOVER TERMS" : "HOW TO STRUCTURE ROLLOVER TO ALIGN SELLER"}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(chair === "seller" ? SELLER_ROLLOVER_TIPS : BUYER_ROLLOVER_TIPS).map((item, i) => (
                <div key={i} className="flex gap-2 text-xs text-white/50 items-start">
                  <span className={`shrink-0 ${acText}`}>&rarr;</span>{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ESCROW & PPA TAB
         ══════════════════════════════════════════════════════════════════════ */}
      {tab === "escrow & ppa" && (
        <div>
          <p className="text-sm text-white/40 mb-5 leading-relaxed">
            {chair === "seller"
              ? "Escrow is deferred proceeds. Working capital pegs can claw back money after close. Understand exactly what you're signing before you treat the headline number as your number."
              : "PPA and escrow are your post-close protection mechanisms. Working capital pegs prevent sellers from draining cash before close. R&W escrow gives you recourse on misrepresentations."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <div className={`text-xs tracking-wide mb-4 ${acText}`}>DEAL INPUTS</div>
              {([
                ["PURCHASE PRICE", ppaDeal, setPpaDeal, 2_000_000, 50_000_000, 500_000],
                ["WC PEG (negotiated target)", wcPeg, setWcPeg, 200_000, 5_000_000, 50_000],
                ["WC ACTUAL (at close)", wcActual, setWcActual, 200_000, 5_000_000, 50_000],
              ] as [string, number, (v: number) => void, number, number, number][]).map(([label, val, set, min, max, step]) => (
                <div key={label} className="mb-3.5">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-white/40 tracking-wide">{label}</span>
                    <span className={`text-sm ${acText}`}>{fmt(val)}</span>
                  </div>
                  <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={min} max={max} step={step} value={val} onChange={e => set(+e.target.value)} />
                </div>
              ))}
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/40 tracking-wide">R&W ESCROW %</span>
                  <span className={`text-sm ${acText}`}>{escrowPct}% = {fmt(ppaDeal * escrowPct / 100)}</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={5} max={20} step={1} value={escrowPct} onChange={e => setEscrowPct(+e.target.value)} />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/40 tracking-wide">ESCROW RELEASE PERIOD</span>
                  <span className={`text-sm ${acText}`}>{escrowMonths} months</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={6} max={36} step={6} value={escrowMonths} onChange={e => setEscrowMonths(+e.target.value)} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <div className={`text-xs tracking-wide mb-4 ${acText}`}>CASH FLOW TIMELINE</div>
              {([
                { label: "CASH AT CLOSE", val: cashAtClosePPA, color: ac, when: "Day 0", note: "Purchase price minus escrow, adjusted for WC" },
                { label: "WC ADJUSTMENT", val: wcAdj, color: wcAdj >= 0 ? "#5a8a6a" : "#c06060", when: "Day 60\u201390", note: wcAdj >= 0 ? "Actual WC exceeded peg \u2014 you receive more" : "Actual WC below peg \u2014 clawback from escrow" },
                { label: "ESCROW RELEASE", val: escrowRelease, color: "#5a8a9a", when: `Month ${escrowMonths}`, note: "Assuming no R&W claims filed" },
                { label: "TOTAL PROCEEDS", val: ppaDeal + Math.max(0, wcAdj), color: "#3B82F6", when: "Final", note: "Assumes no R&W claims" },
              ]).map(s => (
                <div key={s.label} className="flex justify-between items-center border-b border-white/10 pb-2.5 mb-2.5">
                  <div>
                    <div className="text-xs text-white/40">{s.label}</div>
                    <div className="text-xs text-white/20 mt-0.5">{s.when} &middot; {s.note}</div>
                  </div>
                  <div className="text-lg tracking-wider" style={{ color: s.color }}>{fmt(s.val)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Escrow types */}
          <div className="text-xs text-white/40 tracking-wide mb-3">ESCROW TYPE REFERENCE &mdash; CLICK TO EXPAND</div>
          {ESCROW_PURPOSES.map(ep => (
            <div
              key={ep.id}
              className={`bg-white/5 border border-white/10 border-l-[3px] rounded-lg p-5 mb-2 cursor-pointer ${activeEscrow === ep.id ? acBorderSolid : acBorder}`}
              onClick={() => setActiveEscrow(activeEscrow === ep.id ? null : ep.id)}
            >
              <div className="flex justify-between items-center">
                <div className={`text-sm tracking-wide ${acText}`}>{ep.label}</div>
                <div className="flex gap-4 text-xs">
                  <span className="text-white/40">Typical: <span className="text-white/60">{ep.typical}</span></span>
                  <span className="text-white/40">Duration: <span className="text-white/60">{ep.duration}</span></span>
                </div>
              </div>
              {activeEscrow === ep.id && (
                <div className="mt-2.5 pt-2.5 border-t border-white/10 text-sm text-white/60 leading-relaxed">{ep.note}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SELLER FINANCE TAB
         ══════════════════════════════════════════════════════════════════════ */}
      {tab === "seller finance" && (
        <div>
          <p className="text-sm text-white/40 mb-5 leading-relaxed">
            {chair === "seller"
              ? "Seller financing means you become the bank. You get paid over time with interest \u2014 but if the buyer defaults, you're an unsecured creditor of the business you just sold. Demand security or don't do it."
              : "Seller notes reduce the equity you need to raise at close. They also signal seller confidence \u2014 a seller who won't finance is telling you something about their conviction in future performance."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <div className={`text-xs tracking-wide mb-4 ${acText}`}>NOTE TERMS</div>
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/40 tracking-wide">TOTAL DEAL SIZE</span>
                  <span className={`text-sm ${acText}`}>{fmt(sfDeal)}</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={1_000_000} max={30_000_000} step={500_000} value={sfDeal} onChange={e => setSfDeal(+e.target.value)} />
              </div>
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/40 tracking-wide">NOTE SIZE (% of deal)</span>
                  <span className={`text-sm ${acText}`}>{sfPct}% = {fmt(sfNote)}</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={5} max={50} step={5} value={sfPct} onChange={e => setSfPct(+e.target.value)} />
                <div className="flex justify-between text-xs text-white/20 mt-0.5">
                  <span>Small (5%)</span><span>Standard (20%)</span><span>Large (50%)</span>
                </div>
              </div>
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/40 tracking-wide">INTEREST RATE</span>
                  <span className={`text-sm ${acText}`}>{sfRate}%</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={3.0} max={12.0} step={0.5} value={sfRate} onChange={e => setSfRate(+e.target.value)} />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/40 tracking-wide">TERM (years)</span>
                  <span className={`text-sm ${acText}`}>{sfYears} years</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={2} max={10} step={1} value={sfYears} onChange={e => setSfYears(+e.target.value)} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <div className={`text-xs tracking-wide mb-4 ${acText}`}>NOTE ECONOMICS</div>
              <div className="grid gap-3">
                {([
                  { label: "CASH AT CLOSE", val: fmt(sfCash), color: ac, note: "Buyer pays this at signing" },
                  { label: "NOTE PRINCIPAL", val: fmt(sfNote), color: "#888", note: "Deferred \u2014 paid over term" },
                  { label: "MONTHLY PAYMENT", val: fmt(monthlyPayment), color: "#5a8a9a", note: "Principal + interest" },
                  { label: "TOTAL INTEREST", val: fmt(totalInterest), color: "#5a8a6a", note: "Your return for financing the buyer" },
                  { label: "TOTAL RECEIVED", val: fmt(totalReceived), color: "#3B82F6", note: "Over full term (no default)" },
                ]).map(row => (
                  <div key={row.label} className="flex justify-between items-center border-b border-white/10 pb-2.5">
                    <div>
                      <div className="text-xs text-white/40">{row.label}</div>
                      <div className="text-xs text-white/20 mt-0.5">{row.note}</div>
                    </div>
                    <div className="text-lg tracking-wider" style={{ color: row.color }}>{row.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Protection requirements */}
          <div className="bg-white/5 border border-white/10 border-l-[3px] border-l-red-500 rounded-lg p-5">
            <div className="text-xs text-red-400 tracking-wide mb-3">
              {chair === "seller" ? "\u2691 SELLER NOTE PROTECTION \u2014 REQUIRE ALL OF THESE" : "BUYER NOTE OBLIGATIONS \u2014 WHAT SELLER WILL DEMAND"}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(chair === "seller" ? SELLER_NOTE_PROTECTION : BUYER_NOTE_OBLIGATIONS).map((item, i) => (
                <div key={i} className="flex gap-2 text-xs text-white/50 items-start">
                  <span className="shrink-0 text-red-400">&rarr;</span>{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          QUIZ TAB
         ══════════════════════════════════════════════════════════════════════ */}
      {tab === "quiz" && (
        <div>
          {!qDone ? (
            <div>
              <div className="flex justify-between text-xs text-white/40 mb-5">
                <span>QUESTION {qi + 1} OF {STRUCT_QUIZ.length}</span>
                <span className={acText}>SCORE: {qScore}/{qi + (qSel !== null ? 1 : 0)}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-5 mb-4">
                <div className="text-sm text-white/90 leading-relaxed mb-6">{STRUCT_QUIZ[qi].q}</div>
                {STRUCT_QUIZ[qi].opts.map((o, i) => {
                  const isCorrect = i === STRUCT_QUIZ[qi].ans;
                  const isSelected = i === qSel;
                  let btnCls = "border-white/10 bg-white/5 text-white/70";
                  if (qSel !== null) {
                    if (isCorrect) btnCls = "border-green-500/40 bg-green-500/5 text-green-400";
                    else if (isSelected) btnCls = "border-red-500/40 bg-red-500/5 text-red-300";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleQ(i)}
                      disabled={qSel !== null}
                      className={`w-full text-left py-2.5 px-3.5 rounded mb-1.5 text-sm transition-all border ${btnCls}`}
                    >
                      <span className="text-white/40 mr-2.5">{String.fromCharCode(65 + i)}.</span>{o}
                    </button>
                  );
                })}
                {qSel !== null && (
                  <div
                    className={`mt-3.5 p-3 rounded text-sm leading-relaxed border ${
                      qSel === STRUCT_QUIZ[qi].ans ? "bg-green-500/5 border-green-500/30 text-green-400" : "bg-red-500/5 border-red-500/30 text-red-300"
                    }`}
                  >
                    <span className="font-semibold">{qSel === STRUCT_QUIZ[qi].ans ? "\u2713 CORRECT \u2014 " : "\u2717 INCORRECT \u2014 "}</span>
                    {STRUCT_QUIZ[qi].exp}
                  </div>
                )}
              </div>
              {qSel !== null && (
                <button
                  onClick={() => { if (qi + 1 >= STRUCT_QUIZ.length) setQDone(true); else { setQi(q => q + 1); setQSel(null); } }}
                  className={`border-none px-7 py-2.5 text-sm tracking-wide rounded text-white ${acBg}`}
                >
                  {qi + 1 < STRUCT_QUIZ.length ? "NEXT \u2192" : "RESULTS \u2192"}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className={`text-5xl tracking-wide ${acText}`}>{qScore}/{STRUCT_QUIZ.length}</div>
              <div className="text-xs text-white/60 mt-2 mb-8">
                {qScore === STRUCT_QUIZ.length ? "DEAL COUNSEL LEVEL \u2014 You structure deals, not just close them." :
                 qScore >= 3 ? "SENIOR ASSOCIATE \u2014 Solid mechanics. Review the structure delta calc." :
                 "ANALYST \u2014 Run the calculators in every tab before retaking. The numbers teach the concepts."}
              </div>
              <button
                onClick={() => { setQi(0); setQSel(null); setQScore(0); setQDone(false); }}
                className={`bg-transparent px-7 py-2.5 text-sm tracking-wide rounded border ${acText} ${acBorder}`}
              >
                RETAKE
              </button>
            </div>
          )}
        </div>
      )}

      {/* Curriculum arc */}
      <div className="mt-8 px-4 py-3 bg-white/[0.02] border border-white/10 rounded-lg">
        <div className="text-xs text-white/15 tracking-wide mb-2">CURRICULUM ARC</div>
        <div className="flex gap-2 flex-wrap">
          {([
            ["Synergy Engine", "built", "#5a8a6a"],
            ["Process Letter Academy", "built", "#5a8a6a"],
            ["Life After Exit", "built", "#5a8a6a"],
            ["PE Pitch Deck Builder", "built", "#5a8a6a"],
            ["LBO Fundamentals", "built", "#5a8a6a"],
            ["Deal Structure Lab", "this", "#3B82F6"],
          ] as const).map(([name, status, color]) => (
            <div
              key={name}
              className="px-2.5 py-0.5 rounded text-xs tracking-wide border"
              style={{ borderColor: color + "33", color }}
            >
              {name} <span className="opacity-50">&middot; {status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2.5 text-xs text-white/10 text-center tracking-wide">
        MODULE #5 &middot; DEAL STRUCTURE LAB &middot; FOR EDUCATIONAL PURPOSES ONLY
      </div>
    </div>
  );
};

export default DealStructureLab;
