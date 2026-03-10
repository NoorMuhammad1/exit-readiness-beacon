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
  const ac = chair === "seller" ? "#3B82F6" : "#5a8a9a";

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
    <div
      className="min-h-screen font-mono text-[#ddd8cc] px-5 py-7 max-w-4xl mx-auto"
      style={{ background: "#0f1d3d" }}
    >
      <style>{`

        .dsl-range { width: 100%; }
        .dsl-range::-webkit-slider-thumb { cursor: pointer; }
      `}</style>

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-baseline gap-3 mb-1">
          <div className="text-4xl tracking-[5px] leading-none" style={{ color: ac }}>DEAL STRUCTURE</div>
          <div className="text-4xl tracking-[5px] leading-none text-[#222]" >LAB</div>
        </div>
        <div className="text-[10px] text-[#2a2838] tracking-[3px]">MODULE #5 &middot; STOCK VS ASSET &middot; EARNOUT &middot; ROLLOVER &middot; PPA &middot; SELLER FINANCE</div>
      </div>

      {/* Chair toggle */}
      <div className="flex gap-2.5 mb-5 items-center">
        <div className="text-[10px] text-[#444] tracking-[2px] mr-1">YOU ARE:</div>
        {([
          ["seller", "#3B82F6", "SELLER \u2014 maximize net proceeds"],
          ["buyer", "#5a8a9a", "BUYER \u2014 minimize tax leakage & risk"]
        ] as const).map(([c, col, label]) => (
          <button
            key={c}
            onClick={() => setChair(c)}
            className="px-5 py-2 rounded text-[10px] tracking-[2px] transition-all border"
            style={{
              borderColor: chair === c ? col : "#1c2a4a",
              color: chair === c ? col : "#444",
              background: chair === c ? col + "11" : "transparent"
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#17305a] mb-6 flex flex-wrap">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="bg-transparent border-none px-3.5 py-2 text-[10px] tracking-[2px] transition-all border-b-2"
            style={{
              color: tab === t ? ac : "#2e2e3a",
              borderBottomColor: tab === t ? ac : "transparent"
            }}
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
          <p className="text-[11px] text-[#555] mb-5 leading-[1.7]">
            {chair === "seller"
              ? "Stock sale = capital gains treatment on the full gain. Asset sale = ordinary income on recaptured depreciation + capital gains on the rest. The delta is often seven figures."
              : "Asset sale gives you a step-up in basis \u2014 more depreciation post-close, lower taxes for years. Stock sale means you inherit the seller's basis and all unknown liabilities."}
          </p>

          {/* Inputs */}
          <div className="bg-[#0b0c16] border rounded-md p-[18px] mb-4" style={{ borderColor: ac + "33" }}>
            <div className="text-[10px] tracking-[3px] mb-[18px]" style={{ color: ac }}>DEAL INPUTS</div>
            <div className="grid grid-cols-3 gap-5">
              {([
                ["PURCHASE PRICE", dealSize, setDealSize, 1_000_000, 50_000_000, 500_000],
                ["TAX BASIS", taxBasis, setTaxBasis, 0, dealSize * 0.8, 100_000],
                ["STATE TAX RATE", stateRate, setStateRate, 0, 13.3, 0.1],
              ] as const).map(([label, val, set, min, max, step]) => (
                <div key={label as string}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] text-[#555] tracking-[1px]">{label as string}</span>
                    <span className="text-[11px]" style={{ color: ac }}>
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
              <span className="text-[10px] text-[#555] tracking-[1px]">ENTITY TYPE:</span>
              {([["s-corp", "S-Corp / LLC (Pass-Through)"], ["c-corp", "C-Corp"]] as const).map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setEntityType(v)}
                  className="px-3.5 py-1.5 border rounded text-[10px] tracking-[1px] transition-all"
                  style={{
                    borderColor: entityType === v ? ac : "#1c2a4a",
                    color: entityType === v ? ac : "#444",
                    background: entityType === v ? ac + "11" : "transparent"
                  }}
                >
                  {l}
                </button>
              ))}
              {entityType === "c-corp" && (
                <button
                  onClick={() => setH10(b => !b)}
                  className="px-3.5 py-1.5 border rounded text-[10px] tracking-[1px] transition-all"
                  style={{
                    borderColor: h10 ? "#6a8a9a" : "#1c2a4a",
                    color: h10 ? "#6a8a9a" : "#444",
                    background: h10 ? "#0a121a" : "transparent"
                  }}
                >
                  338(h)(10) ELECTION {h10 ? "ON" : "OFF"}
                </button>
              )}
            </div>
          </div>

          {/* Results comparison */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {([
              { label: "STOCK SALE", tax: stockTax, net: stockNet, color: "#5a8a6a", badge: chair === "seller" ? "SELLER PREFERS" : "BUYER AVOIDS" },
              { label: "ASSET SALE", tax: assetTax, net: assetNet, color: chair === "buyer" ? "#5a8a6a" : "#c06060", badge: chair === "buyer" ? "BUYER PREFERS" : "SELLER AVOIDS" }
            ]).map(s => (
              <div key={s.label} className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px]" style={{ borderLeftWidth: 3, borderLeftColor: s.color }}>
                <div className="flex justify-between mb-3.5">
                  <div className="text-lg tracking-[3px]" style={{ color: s.color }}>{s.label}</div>
                  <div
                    className="text-[9px] px-2 py-0.5 rounded tracking-[1px]"
                    style={{ background: s.color + "22", color: s.color }}
                  >
                    {s.badge}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <div className="text-[10px] text-[#555] tracking-[1px]">TOTAL GAIN</div>
                    <div className="text-lg mt-0.5 text-[#ddd] tracking-wider" >{fmt(gain)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#555] tracking-[1px]">TAX BURDEN</div>
                    <div className="text-lg mt-0.5 text-[#c06060] tracking-wider" >{fmt(s.tax)}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[10px] text-[#555] tracking-[1px]">NET PROCEEDS</div>
                    <div className="text-[28px] mt-0.5 tracking-wider" style={{ color: s.color }}>{fmt(s.net)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#555] tracking-[1px]">EFFECTIVE RATE</div>
                    <div className="text-sm mt-0.5 text-[#888]">{fmtPct((s.tax / gain) * 100)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delta */}
          <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px]" style={{ borderColor: ac + "44", background: "#09091422" }}>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] text-[#555] tracking-[1px] mb-1">
                  STRUCTURE DELTA &mdash; {chair === "seller" ? "SELLER COST OF ACCEPTING ASSET SALE" : "BUYER BENEFIT OF PUSHING ASSET SALE"}
                </div>
                <div className="text-[32px] tracking-wider" style={{ color: ac }}>{fmt(Math.abs(delta))}</div>
              </div>
              <div className="text-[11px] text-[#666] max-w-[55%] leading-[1.7] text-right">
                {chair === "seller"
                  ? "This is what you leave on the table by accepting an asset sale at the same price. A smart seller uses this number to demand a price premium to offset the tax cost."
                  : `This is the buyer's tax benefit from structuring as an asset sale. Use this as a lever: offer the seller ${fmt(delta * 0.4)}\u2013${fmt(delta * 0.6)} more to cover their incremental tax cost \u2014 net positive for both sides.`}
              </div>
            </div>
          </div>

          {/* 338(h)(10) explainer */}
          {entityType === "c-corp" && (
            <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px] mt-3" style={{ borderLeftWidth: 3, borderLeftColor: "#6a8a9a" }}>
              <div className="text-sm text-[#6a8a9a] tracking-[3px] mb-2" >338(h)(10) ELECTION</div>
              <p className="text-[11px] text-[#888] leading-[1.8]">
                Allows a stock sale to be treated as an asset purchase for tax purposes. Buyer gets the step-up in basis and accelerated depreciation. Seller bears incremental tax cost &mdash; but buyer typically compensates through a higher headline price. Net result: <span className="text-[#6a8a9a]">closes the gap between buyer and seller preferences without changing legal structure.</span>
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
          <p className="text-[11px] text-[#555] mb-5 leading-[1.7]">
            {chair === "seller"
              ? "Earnouts bridge valuation gaps but you give up control of the metric. Know your floor, your target, and your ceiling \u2014 then negotiate the accounting methodology harder than the numbers."
              : "Earnouts let you pay tomorrow's price only if tomorrow's performance arrives. Structure thresholds carefully \u2014 too easy and you overpay; too hard and management disengages."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Structure inputs */}
            <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px]">
              <div className="text-[10px] tracking-[3px] mb-4" style={{ color: ac }}>DEAL STRUCTURE</div>
              {([
                ["BASE PRICE (AT CLOSE)", basePrice, setBasePrice, 1_000_000, 30_000_000, 500_000],
                ["EARNOUT MAX POTENTIAL", earnoutMax, setEarnoutMax, 500_000, 10_000_000, 250_000],
              ] as [string, number, (v: number) => void, number, number, number][]).map(([label, val, set, min, max, step]) => (
                <div key={label} className="mb-3.5">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] text-[#555] tracking-[1px]">{label}</span>
                    <span className="text-[11px]" style={{ color: ac }}>{fmt(val)}</span>
                  </div>
                  <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={min} max={max} step={step} value={val} onChange={e => set(+e.target.value)} />
                </div>
              ))}
              <div className="mb-3.5">
                <span className="text-[10px] text-[#555] tracking-[1px]">EARNOUT METRIC</span>
                <select
                  value={earnoutMetric}
                  onChange={e => setEarnoutMetric(e.target.value)}
                  className="ml-3 bg-[#17305a] border border-[#1c2a4a] text-[#ccc] text-[11px] px-2.5 py-1.5 rounded outline-none"
                  style={{ fontFamily: "inherit" }}
                >
                  {EARNOUT_METRICS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="border-t border-[#1c2a4a] pt-3.5">
                <div className="text-[10px] text-[#444] tracking-[2px] mb-2.5">THRESHOLD / TARGET / STRETCH</div>
                {([
                  ["THRESHOLD (0% earned below)", threshold, setThreshold],
                  ["TARGET (70% earned at)", target, setTarget],
                  ["STRETCH (100% earned at)", stretch, setStretch],
                ] as [string, number, (v: number) => void][]).map(([label, val, set]) => (
                  <div key={label} className="mb-2.5">
                    <div className="flex justify-between mb-1">
                      <span className="text-[9px] text-[#555]">{label}</span>
                      <span className="text-[10px]" style={{ color: ac }}>{fmt(val)}</span>
                    </div>
                    <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={500_000} max={10_000_000} step={100_000} value={val} onChange={e => set(+e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Scenario inputs */}
            <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px]">
              <div className="text-[10px] tracking-[3px] mb-4" style={{ color: ac }}>PERFORMANCE SCENARIOS</div>
              {([
                { label: "MISS SCENARIO", val: miss, set: setMiss, col: "#c06060", earned: missEarn },
                { label: "BASE SCENARIO", val: base, set: setBase, col: "#3B82F6", earned: baseEarn },
                { label: "HIT SCENARIO", val: hit, set: setHit, col: "#5a8a6a", earned: hitEarn },
              ]).map(s => (
                <div key={s.label} className="mb-4 p-3 bg-[#0f1d3d] rounded" style={{ border: `1px solid ${s.col}22` }}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[13px] tracking-[2px]" style={{ color: s.col }}>{s.label}</span>
                    <span className="text-[11px]" style={{ color: s.col }}>{earnoutMetric}: {fmt(s.val)}</span>
                  </div>
                  <input type="range" className="dsl-range w-full" style={{ accentColor: s.col }} min={500_000} max={10_000_000} step={100_000} value={s.val} onChange={e => s.set(+e.target.value)} />
                  <div className="grid grid-cols-2 gap-2 mt-2.5">
                    <div>
                      <div className="text-[9px] text-[#444]">EARNOUT EARNED</div>
                      <div className="text-base mt-0.5 tracking-wider" style={{ color: s.col }}>{fmt(s.earned)}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-[#444]">TOTAL DEAL VALUE</div>
                      <div className="text-base mt-0.5 tracking-wider" style={{ color: s.col }}>{fmt(basePrice + s.earned)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnout protection rules */}
          <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px]" style={{ borderLeftWidth: 3, borderLeftColor: ac }}>
            <div className="text-[10px] tracking-[3px] mb-3" style={{ color: ac }}>
              {chair === "seller" ? "SELLER PROTECTION CHECKLIST \u2014 NEGOTIATE THESE OR DON'T TAKE THE EARNOUT" : "BUYER STRUCTURING RULES \u2014 PROTECT YOURSELF FROM DISPUTE"}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(chair === "seller" ? SELLER_EARNOUT_CHECKLIST : BUYER_EARNOUT_CHECKLIST).map((item, i) => (
                <div key={i} className="flex gap-2 text-[10px] text-[#777] items-start">
                  <span className="shrink-0" style={{ color: ac }}>&rarr;</span>{item}
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
          <p className="text-[11px] text-[#555] mb-5 leading-[1.7]">
            {chair === "seller"
              ? "Rollover equity is a bet on the buyer's ability to create value. You take less cash today in exchange for a second bite at the apple. The question: do you trust the buyer's thesis more than you trust your own reinvestment options?"
              : "Rollover equity aligns the seller with your exit thesis. They have skin in the game post-close. Standard is 10\u201320%. Less than 10% signals low conviction. More than 25% may create governance tension."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px]">
              <div className="text-[10px] tracking-[3px] mb-4" style={{ color: ac }}>ROLLOVER INPUTS</div>
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-[#555] tracking-[1px]">COMPANY VALUE AT CLOSE</span>
                  <span className="text-[11px]" style={{ color: ac }}>{fmt(totalVal)}</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={2_000_000} max={50_000_000} step={500_000} value={totalVal} onChange={e => setTotalVal(+e.target.value)} />
              </div>
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-[#555] tracking-[1px]">ROLLOVER %</span>
                  <span className="text-[11px]" style={{ color: ac }}>{rolloverPct}%</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={5} max={35} step={1} value={rolloverPct} onChange={e => setRolloverPct(+e.target.value)} />
                <div className="flex justify-between text-[9px] text-[#333] mt-0.5">
                  <span>Minimal (5%)</span><span>Standard (15%)</span><span>Heavy (35%)</span>
                </div>
              </div>
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-[#555] tracking-[1px]">EXIT MULTIPLE (on entry)</span>
                  <span className="text-[11px]" style={{ color: ac }}>{exitMultiple}x</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={1.0} max={6.0} step={0.25} value={exitMultiple} onChange={e => setExitMultiple(+e.target.value)} />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-[#555] tracking-[1px]">HOLD PERIOD (years)</span>
                  <span className="text-[11px]" style={{ color: ac }}>{holdYears} yrs</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={2} max={8} step={1} value={holdYears} onChange={e => setHoldYears(+e.target.value)} />
              </div>
            </div>

            <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px]">
              <div className="text-[10px] tracking-[3px] mb-4" style={{ color: ac }}>ROLLOVER OUTCOME</div>
              <div className="grid gap-3">
                {([
                  { label: "ROLLOVER AMOUNT", val: fmt(rolloverAmt), color: "#888", note: "Equity you're leaving at the table" },
                  { label: "CASH AT CLOSE", val: fmt(cashAtClose), color: "#3B82F6", note: "What you take home day one" },
                  { label: "EXIT VALUE (your %)", val: fmt(rolloverExit), color: "#5a8a6a", note: `${rolloverPct}% of ${fmt(exitVal)}` },
                  { label: "ROLLOVER NET (after tax)", val: fmt(rolloverNet), color: "#5a8a6a", note: "LTCG + NIIT on gain" },
                  { label: "TOTAL NET PROCEEDS", val: fmt(totalNet), color: ac, note: "Cash at close + rollover net" },
                ]).map(row => (
                  <div key={row.label} className="flex justify-between items-center border-b border-[#17305a] pb-2.5">
                    <div>
                      <div className="text-[10px] text-[#555]">{row.label}</div>
                      <div className="text-[9px] text-[#333] mt-0.5">{row.note}</div>
                    </div>
                    <div className="text-lg tracking-wider" style={{ color: row.color }}>{row.val}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3.5 p-3 bg-[#0a0e0a] border border-[#1a3a1a] rounded">
                <div className="text-[10px] text-[#5a8a6a] tracking-[2px] mb-1">ROLLOVER MOIC</div>
                <div className="text-[26px] text-[#7aba7a] tracking-wider" >{fmtX(rolloverExit / rolloverAmt)}</div>
                <div className="text-[10px] text-[#444] mt-1">
                  IRR &asymp; {fmtPct(((rolloverExit / rolloverAmt) ** (1 / holdYears) - 1) * 100)} over {holdYears} years
                </div>
              </div>
            </div>
          </div>

          {/* Rollover negotiation tips */}
          <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px]" style={{ borderLeftWidth: 3, borderLeftColor: ac }}>
            <div className="text-[10px] tracking-[3px] mb-3" style={{ color: ac }}>
              {chair === "seller" ? "WHAT TO NEGOTIATE IN YOUR ROLLOVER TERMS" : "HOW TO STRUCTURE ROLLOVER TO ALIGN SELLER"}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(chair === "seller" ? SELLER_ROLLOVER_TIPS : BUYER_ROLLOVER_TIPS).map((item, i) => (
                <div key={i} className="flex gap-2 text-[10px] text-[#777] items-start">
                  <span className="shrink-0" style={{ color: ac }}>&rarr;</span>{item}
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
          <p className="text-[11px] text-[#555] mb-5 leading-[1.7]">
            {chair === "seller"
              ? "Escrow is deferred proceeds. Working capital pegs can claw back money after close. Understand exactly what you're signing before you treat the headline number as your number."
              : "PPA and escrow are your post-close protection mechanisms. Working capital pegs prevent sellers from draining cash before close. R&W escrow gives you recourse on misrepresentations."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px]">
              <div className="text-[10px] tracking-[3px] mb-4" style={{ color: ac }}>DEAL INPUTS</div>
              {([
                ["PURCHASE PRICE", ppaDeal, setPpaDeal, 2_000_000, 50_000_000, 500_000],
                ["WC PEG (negotiated target)", wcPeg, setWcPeg, 200_000, 5_000_000, 50_000],
                ["WC ACTUAL (at close)", wcActual, setWcActual, 200_000, 5_000_000, 50_000],
              ] as [string, number, (v: number) => void, number, number, number][]).map(([label, val, set, min, max, step]) => (
                <div key={label} className="mb-3.5">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] text-[#555] tracking-[1px]">{label}</span>
                    <span className="text-[11px]" style={{ color: ac }}>{fmt(val)}</span>
                  </div>
                  <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={min} max={max} step={step} value={val} onChange={e => set(+e.target.value)} />
                </div>
              ))}
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-[#555] tracking-[1px]">R&W ESCROW %</span>
                  <span className="text-[11px]" style={{ color: ac }}>{escrowPct}% = {fmt(ppaDeal * escrowPct / 100)}</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={5} max={20} step={1} value={escrowPct} onChange={e => setEscrowPct(+e.target.value)} />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-[#555] tracking-[1px]">ESCROW RELEASE PERIOD</span>
                  <span className="text-[11px]" style={{ color: ac }}>{escrowMonths} months</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={6} max={36} step={6} value={escrowMonths} onChange={e => setEscrowMonths(+e.target.value)} />
              </div>
            </div>

            <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px]">
              <div className="text-[10px] tracking-[3px] mb-4" style={{ color: ac }}>CASH FLOW TIMELINE</div>
              {([
                { label: "CASH AT CLOSE", val: cashAtClosePPA, color: ac, when: "Day 0", note: "Purchase price minus escrow, adjusted for WC" },
                { label: "WC ADJUSTMENT", val: wcAdj, color: wcAdj >= 0 ? "#5a8a6a" : "#c06060", when: "Day 60\u201390", note: wcAdj >= 0 ? "Actual WC exceeded peg \u2014 you receive more" : "Actual WC below peg \u2014 clawback from escrow" },
                { label: "ESCROW RELEASE", val: escrowRelease, color: "#5a8a9a", when: `Month ${escrowMonths}`, note: "Assuming no R&W claims filed" },
                { label: "TOTAL PROCEEDS", val: ppaDeal + Math.max(0, wcAdj), color: "#3B82F6", when: "Final", note: "Assumes no R&W claims" },
              ]).map(s => (
                <div key={s.label} className="flex justify-between items-center border-b border-[#17305a] pb-2.5 mb-2.5">
                  <div>
                    <div className="text-[10px] text-[#555]">{s.label}</div>
                    <div className="text-[9px] text-[#333] mt-0.5">{s.when} &middot; {s.note}</div>
                  </div>
                  <div className="text-lg tracking-wider" style={{ color: s.color }}>{fmt(s.val)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Escrow types */}
          <div className="text-[10px] text-[#555] tracking-[3px] mb-3">ESCROW TYPE REFERENCE &mdash; CLICK TO EXPAND</div>
          {ESCROW_PURPOSES.map(ep => (
            <div
              key={ep.id}
              className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px] mb-2 cursor-pointer"
              style={{ borderLeftWidth: 3, borderLeftColor: activeEscrow === ep.id ? ac : ac + "33" }}
              onClick={() => setActiveEscrow(activeEscrow === ep.id ? null : ep.id)}
            >
              <div className="flex justify-between items-center">
                <div className="text-sm tracking-[2px]" style={{ color: ac }}>{ep.label}</div>
                <div className="flex gap-4 text-[10px]">
                  <span className="text-[#555]">Typical: <span className="text-[#888]">{ep.typical}</span></span>
                  <span className="text-[#555]">Duration: <span className="text-[#888]">{ep.duration}</span></span>
                </div>
              </div>
              {activeEscrow === ep.id && (
                <div className="mt-2.5 pt-2.5 border-t border-[#17305a] text-[11px] text-[#888] leading-[1.7]">{ep.note}</div>
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
          <p className="text-[11px] text-[#555] mb-5 leading-[1.7]">
            {chair === "seller"
              ? "Seller financing means you become the bank. You get paid over time with interest \u2014 but if the buyer defaults, you're an unsecured creditor of the business you just sold. Demand security or don't do it."
              : "Seller notes reduce the equity you need to raise at close. They also signal seller confidence \u2014 a seller who won't finance is telling you something about their conviction in future performance."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px]">
              <div className="text-[10px] tracking-[3px] mb-4" style={{ color: ac }}>NOTE TERMS</div>
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-[#555] tracking-[1px]">TOTAL DEAL SIZE</span>
                  <span className="text-[11px]" style={{ color: ac }}>{fmt(sfDeal)}</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={1_000_000} max={30_000_000} step={500_000} value={sfDeal} onChange={e => setSfDeal(+e.target.value)} />
              </div>
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-[#555] tracking-[1px]">NOTE SIZE (% of deal)</span>
                  <span className="text-[11px]" style={{ color: ac }}>{sfPct}% = {fmt(sfNote)}</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={5} max={50} step={5} value={sfPct} onChange={e => setSfPct(+e.target.value)} />
                <div className="flex justify-between text-[9px] text-[#333] mt-0.5">
                  <span>Small (5%)</span><span>Standard (20%)</span><span>Large (50%)</span>
                </div>
              </div>
              <div className="mb-3.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-[#555] tracking-[1px]">INTEREST RATE</span>
                  <span className="text-[11px]" style={{ color: ac }}>{sfRate}%</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={3.0} max={12.0} step={0.5} value={sfRate} onChange={e => setSfRate(+e.target.value)} />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-[#555] tracking-[1px]">TERM (years)</span>
                  <span className="text-[11px]" style={{ color: ac }}>{sfYears} years</span>
                </div>
                <input type="range" className="dsl-range w-full" style={{ accentColor: ac }} min={2} max={10} step={1} value={sfYears} onChange={e => setSfYears(+e.target.value)} />
              </div>
            </div>

            <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px]">
              <div className="text-[10px] tracking-[3px] mb-4" style={{ color: ac }}>NOTE ECONOMICS</div>
              <div className="grid gap-3">
                {([
                  { label: "CASH AT CLOSE", val: fmt(sfCash), color: ac, note: "Buyer pays this at signing" },
                  { label: "NOTE PRINCIPAL", val: fmt(sfNote), color: "#888", note: "Deferred \u2014 paid over term" },
                  { label: "MONTHLY PAYMENT", val: fmt(monthlyPayment), color: "#5a8a9a", note: "Principal + interest" },
                  { label: "TOTAL INTEREST", val: fmt(totalInterest), color: "#5a8a6a", note: "Your return for financing the buyer" },
                  { label: "TOTAL RECEIVED", val: fmt(totalReceived), color: "#3B82F6", note: "Over full term (no default)" },
                ]).map(row => (
                  <div key={row.label} className="flex justify-between items-center border-b border-[#17305a] pb-2.5">
                    <div>
                      <div className="text-[10px] text-[#555]">{row.label}</div>
                      <div className="text-[9px] text-[#333] mt-0.5">{row.note}</div>
                    </div>
                    <div className="text-lg tracking-wider" style={{ color: row.color }}>{row.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Protection requirements */}
          <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px]" style={{ borderLeftWidth: 3, borderLeftColor: "#c06060" }}>
            <div className="text-[10px] text-[#c06060] tracking-[3px] mb-3">
              {chair === "seller" ? "\u2691 SELLER NOTE PROTECTION \u2014 REQUIRE ALL OF THESE" : "BUYER NOTE OBLIGATIONS \u2014 WHAT SELLER WILL DEMAND"}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(chair === "seller" ? SELLER_NOTE_PROTECTION : BUYER_NOTE_OBLIGATIONS).map((item, i) => (
                <div key={i} className="flex gap-2 text-[10px] text-[#777] items-start">
                  <span className="shrink-0 text-[#c06060]">&rarr;</span>{item}
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
              <div className="flex justify-between text-[10px] text-[#555] mb-5">
                <span>QUESTION {qi + 1} OF {STRUCT_QUIZ.length}</span>
                <span style={{ color: ac }}>SCORE: {qScore}/{qi + (qSel !== null ? 1 : 0)}</span>
              </div>
              <div className="bg-[#0b0c16] border border-[#1c2a4a] rounded-md p-[18px] mb-4">
                <div className="text-[13px] text-[#ddd] leading-[1.8] mb-6">{STRUCT_QUIZ[qi].q}</div>
                {STRUCT_QUIZ[qi].opts.map((o, i) => {
                  const isCorrect = i === STRUCT_QUIZ[qi].ans;
                  const isSelected = i === qSel;
                  let borderColor = "#1c2a4a";
                  let bgColor = "#0b0c16";
                  let textColor = "#999";
                  if (qSel !== null) {
                    if (isCorrect) { borderColor = "#5a8a6a"; bgColor = "#0a180a"; textColor = "#7aba8a"; }
                    else if (isSelected) { borderColor = "#8a3a3a"; bgColor = "#180a0a"; textColor = "#ba7a7a"; }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleQ(i)}
                      disabled={qSel !== null}
                      className="w-full text-left py-2.5 px-3.5 rounded mb-1.5 text-[11px] transition-all border"
                      style={{ borderColor, background: bgColor, color: textColor }}
                    >
                      <span className="text-[#555] mr-2.5">{String.fromCharCode(65 + i)}.</span>{o}
                    </button>
                  );
                })}
                {qSel !== null && (
                  <div
                    className="mt-3.5 p-3 rounded text-[11px] leading-[1.7] border"
                    style={{
                      background: qSel === STRUCT_QUIZ[qi].ans ? "#0a160a" : "#160a0a",
                      borderColor: qSel === STRUCT_QUIZ[qi].ans ? "#3a6a3a" : "#6a3a3a",
                      color: qSel === STRUCT_QUIZ[qi].ans ? "#7aba7a" : "#ba7a7a"
                    }}
                  >
                    <span className="font-semibold">{qSel === STRUCT_QUIZ[qi].ans ? "\u2713 CORRECT \u2014 " : "\u2717 INCORRECT \u2014 "}</span>
                    {STRUCT_QUIZ[qi].exp}
                  </div>
                )}
              </div>
              {qSel !== null && (
                <button
                  onClick={() => { if (qi + 1 >= STRUCT_QUIZ.length) setQDone(true); else { setQi(q => q + 1); setQSel(null); } }}
                  className="border-none px-7 py-2.5 text-[11px] tracking-[2px] rounded text-[#0f1d3d]"
                  style={{ background: ac }}
                >
                  {qi + 1 < STRUCT_QUIZ.length ? "NEXT \u2192" : "RESULTS \u2192"}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-[56px] tracking-[5px]" style={{ color: ac }}>{qScore}/{STRUCT_QUIZ.length}</div>
              <div className="text-xs text-[#888] mt-2 mb-8">
                {qScore === STRUCT_QUIZ.length ? "DEAL COUNSEL LEVEL \u2014 You structure deals, not just close them." :
                 qScore >= 3 ? "SENIOR ASSOCIATE \u2014 Solid mechanics. Review the structure delta calc." :
                 "ANALYST \u2014 Run the calculators in every tab before retaking. The numbers teach the concepts."}
              </div>
              <button
                onClick={() => { setQi(0); setQSel(null); setQScore(0); setQDone(false); }}
                className="bg-transparent px-7 py-2.5 text-[11px] tracking-[2px] rounded border"
                style={{ borderColor: ac, color: ac }}
              >
                RETAKE
              </button>
            </div>
          )}
        </div>
      )}

      {/* Curriculum arc */}
      <div className="mt-8 px-4 py-3 bg-[#080910] border border-[#17305a] rounded-md">
        <div className="text-[9px] text-[#1e1e2a] tracking-[3px] mb-2">CURRICULUM ARC</div>
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
              className="px-2.5 py-0.5 rounded text-[9px] tracking-[1px] border"
              style={{ borderColor: color + "33", color }}
            >
              {name} <span className="opacity-50">&middot; {status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2.5 text-[9px] text-[#14141e] text-center tracking-[1px]">
        MODULE #5 &middot; DEAL STRUCTURE LAB &middot; FOR EDUCATIONAL PURPOSES ONLY
      </div>
    </div>
  );
};

export default DealStructureLab;
