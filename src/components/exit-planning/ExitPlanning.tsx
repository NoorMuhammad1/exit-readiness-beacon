import { useState } from "react";

const fmt = (n: number | string | null | undefined, d=1) => {
  if (!n && n !== 0) return "\u2014";
  const v = parseFloat(String(n));
  if (isNaN(v)) return "\u2014";
  if (Math.abs(v) >= 1e9) return `${(v/1e9).toFixed(d)}B`;
  if (Math.abs(v) >= 1e6) return `${(v/1e6).toFixed(d)}M`;
  if (Math.abs(v) >= 1e3) return `${(v/1e3).toFixed(0)}K`;
  return `${v.toFixed(d)}`;
};
const fmtX = (n: number | string, d=2) => isNaN(parseFloat(String(n))) ? "\u2014" : `${parseFloat(String(n)).toFixed(d)}x`;
const fmtPct = (n: number | string, d=1) => isNaN(parseFloat(String(n))) ? "\u2014" : `${parseFloat(String(n)).toFixed(d)}%`;

// ── EXIT ROUTES ────────────────────────────────────────────────────────
const EXIT_ROUTES = [
  {
    id: "strategic",
    label: "STRATEGIC SALE",
    color: "#3B82F6",
    freq: "45%",
    headline: "Sell to a competitor, customer, or adjacent player who pays a premium for what you have.",
    when: "When the business has strategic assets a buyer can\u2019t easily replicate \u2014 market position, customer relationships, IP, geographic density, or talent.",
    multiple: "Typically 1\u20133 turns higher than sponsor-to-sponsor. Strategic buyers pay for synergies they can realize; PE buyers can\u2019t.",
    pros: ["Highest multiples \u2014 strategic premium on top of financial value", "Clean exit \u2014 strategic buyers typically want 100%", "Faster close once a buyer is identified", "Validation of the business-building thesis"],
    cons: ["Process takes 6\u201312 months", "Competitor exposure during diligence is a real risk", "Integration risk for the team post-close", "Management may not have a role in combined entity"],
    readiness: ["Revenue concentration below 20% for any single customer", "EBITDA margin at or above industry median", "Customer contracts with transferable terms", "Clean IP ownership (no founder personal IP)", "No change-of-control provisions that terminate contracts"],
    icNote: "PE sponsors prefer strategic exits when they can get them \u2014 the multiple premium often represents 0.5\u20131.5x additional MOIC. The entire value creation plan should be designed with a named strategic buyer in mind."
  },
  {
    id: "s2s",
    label: "SPONSOR-TO-SPONSOR",
    color: "#5a8a9a",
    freq: "35%",
    headline: "Sell to another PE firm. The most common exit in lower middle market PE.",
    when: "When the business isn\u2019t ready for strategic exit (too small, too concentrated, unfinished platform) but has demonstrated growth and has a clear 3\u20135 year continuation thesis for the next sponsor.",
    multiple: "Financial multiples \u2014 typically 6\u20139x EBITDA in lower middle market. Determined by the next PE firm\u2019s entry underwriting, not strategic synergies.",
    pros: ["Predictable process \u2014 both sides understand PE deal mechanics", "Management team often rolls over again, maintaining continuity", "Platform thesis continues \u2014 next sponsor adds capital and add-ons", "Timeline is controllable \u2014 process runs on PE calendar"],
    cons: ["Lower multiples than strategic \u2014 no synergy premium", "Management dilution resets in new MIP structure", "Buyers run their own DD \u2014 same scrutiny as original deal", "QoE required again at same depth"],
    readiness: ["Clean 3-year EBITDA history with QoE-defensible add-backs", "Documented value creation \u2014 what was built, not just what exists", "Credible next-chapter growth thesis for the next sponsor", "Management committed to rollover in new structure"],
    icNote: "S2S exits are underwritten as new deals by the buyer. Your exit multiple is their entry multiple \u2014 meaning their 5-year return model determines what they\u2019ll pay. Build the exit deck for the IC presentation you\u2019d make if you were the buyer."
  },
  {
    id: "recap",
    label: "RECAPITALIZATION",
    color: "#6a5a9a",
    freq: "12%",
    headline: "Refinance the debt structure to return capital to equity holders while retaining ownership.",
    when: "When EBITDA has grown materially since original close, the business has paid down debt, and lenders will support higher leverage \u2014 allowing a dividend to equity holders before a full exit.",
    multiple: "Not a full exit \u2014 generates a partial return (often 0.5\u20131.5x of original equity) while maintaining upside in the business for a future full exit.",
    pros: ["Returns capital without giving up ownership", "Extends hold for a better exit window", "Validates the business\u2019s credit quality", "Management equity continues to compound"],
    cons: ["Re-leverages the balance sheet \u2014 less cushion for downside", "Not available in weak credit markets", "Complicated if management has changed since original close", "Reduces future exit flexibility if leverage is too high"],
    readiness: ["EBITDA at least 50% above entry EBITDA", "Current leverage below 3.5x EBITDA", "Lender relationship in good standing", "No material covenant issues in trailing 12 months"],
    icNote: "Recaps are a tool, not an exit. They\u2019re most useful when the business is 2\u20133 years in, EBITDA has grown, and the market for a full exit is soft. The risk: re-leveraging at Year 3 and then hitting a recession in Year 4 with no runway."
  },
  {
    id: "ipo",
    label: "IPO / PUBLIC MARKETS",
    color: "#5a8a6a",
    freq: "5%",
    headline: "List the company on a public exchange. Rare in lower middle market. Relevant for platforms above $50M EBITDA.",
    when: "When the business is large enough, predictable enough, and institutional enough to withstand public market scrutiny. Rule of thumb: $50M+ EBITDA, recurring revenue model, institutional-grade finance function.",
    multiple: "Public market multiples \u2014 can be highest available but are volatile. Subject to market conditions at time of pricing.",
    pros: ["Potential for highest valuations in strong markets", "Liquidity for all shareholders over time", "Currency for acquisitions (stock-based M&A)", "Brand and recruitment benefits of being public"],
    cons: ["Enormous compliance cost ($5\u201310M+ annually)", "90-day earnings cycle replaces long-term thinking", "Requires institutional CFO, audit committee, SOX compliance", "Lock-up periods limit sponsor exit timeline", "Rare below $50M EBITDA \u2014 not realistic for most PE-backed businesses"],
    readiness: ["$50M+ EBITDA with 3+ years of audited financials", "Recurring or highly predictable revenue model", "Institutional CFO and finance function", "No material related-party transactions", "Board with independent directors in place"],
    icNote: "For lower middle market PE, IPO is a theoretical option, not a real one. It belongs in the exit analysis as a data point \u2014 the comparable public company multiples drive your valuation whether or not you\u2019re actually going public."
  },
  {
    id: "mgmt",
    label: "MANAGEMENT BUYOUT",
    color: "#8a6a3a",
    freq: "3%",
    headline: "Sell to the management team, often backed by subordinated debt or seller financing.",
    when: "When no strategic or financial buyer emerges, management has conviction in the business, and the PE sponsor prefers a clean exit over a distressed sale or write-down.",
    multiple: "Below-market multiples \u2014 typically 4\u20135x EBITDA. Management doesn\u2019t have PE-level capital, so purchase price is constrained by what they can finance.",
    pros: ["Clean exit when other options aren\u2019t available", "Management continuity \u2014 no transition risk", "Faster close than a full auction process", "Goodwill preserved with employees and customers"],
    cons: ["Below-market proceeds \u2014 significant multiple discount vs. strategic", "Management may not be able to finance the full purchase", "PE sponsor may need to provide seller financing", "Often signals the business wasn\u2019t marketable to outside buyers"],
    readiness: ["Management team has financial resources or financing lined up", "Business is stable \u2014 not growing rapidly (which would attract outside buyers)", "Seller financing terms acceptable to PE sponsor", "No better-priced alternative available"],
    icNote: "MBOs are exits of last resort in PE. If management is the best buyer, the question worth asking is: why wouldn\u2019t a financial or strategic buyer pay more? The answer usually involves concentration, margin, or market size issues that should have been in the IC risk section."
  }
];

// ── READINESS CHECKLIST ────────────────────────────────────────────────
const READINESS_ITEMS = [
  { category: "FINANCIALS", color: "#3B82F6", items: [
    { item: "3 years of clean, audited (or reviewed) financials", critical: true },
    { item: "LTM P&L with no one-time items unexplained", critical: true },
    { item: "QoE-defensible EBITDA add-back schedule prepared", critical: true },
    { item: "Working capital normalized \u2014 12-month average documented", critical: true },
    { item: "Revenue cohort analysis prepared (retention by vintage)", critical: false },
    { item: "Customer profitability analysis by account", critical: false },
  ]},
  { category: "COMMERCIAL", color: "#5a8a9a", items: [
    { item: "No single customer above 15% of revenue", critical: true },
    { item: "Recurring revenue % documented and defended", critical: true },
    { item: "Top 20 customer contracts reviewed for CoC provisions", critical: true },
    { item: "Customer reference list prepared (willing, positive)", critical: false },
    { item: "Competitive positioning documented with market share data", critical: false },
    { item: "Pricing history showing ability to raise prices", critical: false },
  ]},
  { category: "LEGAL & STRUCTURE", color: "#6a5a9a", items: [
    { item: "IP ownership confirmed inside the operating entity", critical: true },
    { item: "No material undisclosed litigation or contingent liabilities", critical: true },
    { item: "Related party transactions unwound or documented", critical: true },
    { item: "All licenses transferable or re-issuable at close", critical: true },
    { item: "Cap table clean \u2014 no informal grants, side letters, or disputes", critical: false },
    { item: "W&I insurance feasibility assessed", critical: false },
  ]},
  { category: "MANAGEMENT & OPS", color: "#5a8a6a", items: [
    { item: "Management team stable \u2014 no open C-suite roles", critical: true },
    { item: "Key employee retention agreements in place", critical: true },
    { item: "Org chart documented \u2014 no single point of failure below CEO", critical: false },
    { item: "Core processes documented (not locked in employee heads)", critical: false },
    { item: "ERP / systems modern enough to withstand buyer tech DD", critical: false },
    { item: "Finance function capable of monthly close + board reporting", critical: true },
  ]},
  { category: "NARRATIVE", color: "#8a6a3a", items: [
    { item: "Investment thesis written from buyer\u2019s chair (not seller\u2019s)", critical: true },
    { item: "Value creation documented \u2014 what was built, not just current state", critical: true },
    { item: "Exit thesis in one sentence (buyer type, multiple, year)", critical: true },
    { item: "CIM or teaser draft reviewed by PE sponsor", critical: false },
    { item: "Management presentation rehearsed with hard questions", critical: false },
    { item: "Identified 3\u20135 named strategic buyers with rationale", critical: false },
  ]}
];

// ── TIMING SIGNALS ─────────────────────────────────────────────────────
const TIMING = [
  { signal: "EBITDA growth is decelerating", direction: "SELL", detail: "PE buyers underwrite on trajectory, not just current EBITDA. A business that grew 25% for 3 years and is now at 8% is a harder story at the same multiple. Sell while growth is still the headline." },
  { signal: "You\u2019ve completed 2\u20133 add-ons successfully", direction: "SELL", detail: "Platform thesis is proven. Integration playbook documented. The next buyer pays for the platform you built, not the platform you\u2019re still building." },
  { signal: "A named strategic acquirer is actively growing by acquisition", direction: "SELL", detail: "Strategic buyers pay the most when they\u2019re in active acquisition mode. Timing the market for a specific buyer is rare \u2014 but when it aligns, it\u2019s the highest-value exit window." },
  { signal: "Credit markets are wide open \u2014 debt is cheap", direction: "SELL", detail: "PE buyers use leverage. Cheap debt = higher purchase price. Tight credit markets compress multiples directly. The 2021 multiple environment vs. 2023 is the clearest example in recent memory." },
  { signal: "Recurring revenue % has hit a new high", direction: "SELL", detail: "Recurring revenue is the most valued revenue type. If you just crossed a threshold (30% \u2192 45%) that moves you into a different buyer universe, sell at the peak of that story \u2014 not after it\u2019s normalized into the base." },
  { signal: "Key customer contracts up for renewal in 12 months", direction: "SELL", detail: "Sell before the renewals, not after. A contract renewing in 3 months looks like risk. A contract just renewed for 3 years looks like stability. Timing the close around contract renewals is a legitimate tactic." },
  { signal: "EBITDA margin is below industry median", direction: "HOLD", detail: "Buyers discount for below-median margins. Every 100bps of margin improvement below the median moves your exit multiple down. Fix the margin first \u2014 it\u2019s worth more than a year of faster growth." },
  { signal: "Customer concentration above 25%", direction: "HOLD", detail: "Above 25% in a single customer, strategic buyers get nervous and PE buyers apply a discount. One year of demonstrated diversification is worth the hold." },
  { signal: "Management team is incomplete or unstable", direction: "HOLD", detail: "A C-suite gap at exit is a buyer\u2019s negotiating lever. Fill the role, let them season for 6\u201312 months, then run the process." },
  { signal: "You\u2019re in year 2 of a 5-year hold", direction: "HOLD", detail: "Value creation plan has 3 more years to compound. Unless a strategic buyer appears offering a dramatic premium, executing the plan through Year 4\u20135 produces better risk-adjusted returns." },
];

// ── EXIT PROCESS ───────────────────────────────────────────────────────
const PROCESS_STEPS = [
  { phase: "PREPARATION", weeks: "Months \u20136 to \u20133", color: "#3B82F6", seller: ["Finalize exit readiness checklist", "Engage investment banker", "Prepare CIM and management presentation", "Clean up data room", "Identify and prioritize buyer list"], buyerLens: "Buyers are not involved yet \u2014 but the quality of the CIM determines who engages seriously and at what valuation." },
  { phase: "LAUNCH", weeks: "Month 0", color: "#5a8a9a", seller: ["Banker sends teaser to target buyer list", "NDAs executed with interested parties", "CIM distributed to qualified buyers", "Management presentation scheduling begins"], buyerLens: "Buyers evaluate the teaser in 48 hours. Most pass based on sector, size, or initial price signal. The ones who request the CIM are your real pool." },
  { phase: "FIRST ROUND", weeks: "Weeks 3\u20136", color: "#6a5a9a", seller: ["Management presentations to 6\u201312 buyers", "Preliminary Q&A on CIM", "First-round bids submitted (non-binding)", "Banker advises on bid quality and terms"], buyerLens: "Buyers submit preliminary IOIs \u2014 Indication of Interest letters with valuation range and proposed structure. These are non-binding and designed to get to second round." },
  { phase: "SECOND ROUND", weeks: "Weeks 7\u201312", color: "#5a8a6a", seller: ["Shortlist to 3\u20135 buyers", "Full data room access granted", "Management deep-dives with finalist buyers", "Draft purchase agreement distributed"], buyerLens: "Real DD begins. QoE firms engaged. Customer calls. Site visits. Buyers price the deal based on what they find \u2014 final bids are binding and include markup on the purchase agreement." },
  { phase: "EXCLUSIVITY", weeks: "Weeks 13\u201318", color: "#8a6a3a", seller: ["Winner selected, exclusivity granted (45\u201360 days)", "Final DD and confirmatory diligence", "Purchase agreement negotiation", "Financing documentation"], buyerLens: "Buyer has leverage \u2014 seller has limited ability to re-trade. Issues found in final DD become price chips or walk threats. W&I insurance bound. Management retention agreements finalized." },
  { phase: "CLOSE", weeks: "Week 18\u201322", color: "#3B82F6", seller: ["Purchase agreement executed", "Funds wired", "Management transition plan activated", "Seller communications to employees and customers"], buyerLens: "Wire day. Proceeds distributed per the waterfall. Management rollover equity transferred. New ownership day 1." },
];

// ── QUIZ ───────────────────────────────────────────────────────────────
const QUIZ = [
  {
    q: "Your PE-backed HVAC platform has $6.2M EBITDA, 38% recurring revenue, and completed 3 add-ons over 4 years. You\u2019re in Year 4 of a planned 5-year hold. A strategic buyer \u2014 a national HVAC consolidator \u2014 approaches with an informal indication of 9.0x EBITDA. Your PE sponsor\u2019s entry was 6.5x on $4.0M EBITDA. What do you do?",
    opts: ["Decline \u2014 you\u2019re one year from planned exit and the plan says Year 5", "Engage \u2014 strategic premium at Year 4 may beat a planned Year 5 exit", "Counter at 10x \u2014 strategic buyers always have more room", "Ask for more time \u2014 you haven\u2019t decided on exit route yet"],
    correct: 1,
    explain: "The plan serves the return \u2014 the return doesn\u2019t serve the plan. A 9x exit on $6.2M EBITDA = $55.8M EV. Entry was 6.5x \u00d7 $4.0M = $26M. Assuming 55% leverage and 5-year hold, that\u2019s a strong return at Year 4. Strategic buyers approach when they\u2019re in acquisition mode \u2014 the window may not exist at Year 5. Engage, run a light process to validate price, and let the math decide."
  },
  {
    q: "During the second round of your sell-side process, the leading PE buyer\u2019s QoE firm identifies $400K of EBITDA add-backs that your internal QoE said were clean \u2014 an owner auto expense and two personal salaries on payroll. The buyer\u2019s revised EBITDA is $5.8M vs. your stated $6.2M. At 8x, this is a $3.2M purchase price gap. The buyer says: \u2018We need to reprice.\u2019 You:",
    opts: ["Accept the reprice \u2014 QoE is objective and the buyer is right", "Reject and threaten to re-open the process to other bidders", "Negotiate: defend the add-backs with documentation, accept reprice on what you can\u2019t defend", "Walk \u2014 you have two other bidders at similar valuations"],
    correct: 2,
    explain: "QoE disputes are negotiating points, not verdicts. Document every add-back with third-party evidence: expense reports, payroll records, board minutes authorizing the compensation. What you can defend, fight for. What you can\u2019t, give up. The $3.2M gap at 8x almost certainly includes defensible items. Walking or fully caving are both bad outcomes when negotiation is available."
  },
  {
    q: "You\u2019re evaluating a dividend recapitalization vs. a full strategic sale. Current EBITDA: $5.5M. Entry EBITDA: $3.8M at 6.5x ($24.7M entry EV). Current debt: $12M. Senior lender indicates they\u2019ll support 4.5x leverage on $5.5M EBITDA. You\u2019re in Year 3. The strategic buyer universe is thin and multiples are compressed due to credit markets. What\u2019s the case for recap first, full exit later?",
    opts: ["No case \u2014 recaps re-leverage the business and reduce future exit flexibility", "Return $12.75M to equity now, stay positioned for a better exit in Year 5-6 when credit markets improve", "Recap only if management equity is fully vested \u2014 otherwise it creates alignment issues", "Recaps only work for businesses above $20M EBITDA"],
    correct: 1,
    explain: "At 4.5x leverage on $5.5M EBITDA = $24.75M new debt. Current debt = $12M. Recap proceeds = $12.75M returned to equity. This is a partial return at Year 3 without giving up ownership. If strategic multiples are compressed and credit markets tighten further, waiting for Year 5-6 when both recover is a real strategy. Risk: you\u2019ve re-leveraged from ~2.2x to 4.5x \u2014 leaving less cushion if EBITDA softens in Years 4-5."
  },
  {
    q: "Your investment banker recommends a broad auction (50+ buyers) for your $7M EBITDA manufacturing business. Your PE sponsor prefers a targeted process (8\u201310 buyers). The banker\u2019s argument: more buyers = more competition = higher price. The sponsor\u2019s argument: fewer buyers = faster, less management distraction, less competitive intelligence leaked to rivals. Who is right?",
    opts: ["Banker \u2014 more buyers always produces higher prices through competition", "Sponsor \u2014 targeted processes are always better for the seller", "Depends on the business: concentrated/proprietary businesses favor targeted; fungible businesses favor broad", "Irrelevant \u2014 price is determined by the business quality, not process design"],
    correct: 2,
    explain: "Both arguments have merit in the right context. A $7M EBITDA manufacturing business with specialized IP, a narrow buyer universe, and customers who are also competitors is a terrible candidate for a 50-buyer auction \u2014 you\u2019re handing your roadmap to rivals. A business in a fragmented sector with no strategic sensitivity and many potential buyers benefits from competition. Process design is a real strategic decision \u2014 not a default."
  },
  {
    q: "A strategic buyer offers $52M for your business ($6.5M EBITDA = 8.0x). A PE buyer is at $45.5M (7.0x). The strategic offer requires a 6-month earnout of $4M tied to EBITDA hitting $7.2M next year. The PE offer is clean \u2014 all cash at close. Net of earnout risk, which is the better offer?",
    opts: ["Strategic at $52M \u2014 the $4M earnout is achievable if the business is growing", "PE at $45.5M \u2014 earnouts almost never pay out fully and create post-close conflict", "Depends on the probability of hitting the EBITDA target", "Strategic, but negotiate to eliminate the earnout and accept a lower base price"],
    correct: 3,
    explain: "Earnouts are the most disputed element in M&A. The correct answer is to eliminate it. Offer to accept $48M clean (splitting the difference) instead of $52M with a $4M earnout \u2014 you get more certainty, less post-close conflict, and avoid the accounting games strategic buyers play with EBITDA definitions post-close. If the strategic buyer insists on the earnout, model it at 60% probability of full payment \u2014 making the expected value $50.4M vs. PE\u2019s clean $45.5M. That math still favors strategic, but the certainty discount is real."
  }
];

export default function ExitPlanning() {
  const [tab, setTab] = useState("routes");
  const [activeRoute, setActiveRoute] = useState("strategic");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [timingFilter, setTimingFilter] = useState("ALL");
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Returns calc
  const [entryEBITDA, setEntryEBITDA] = useState("4000000");
  const [entryMult, setEntryMult] = useState("6.5");
  const [exitEBITDA, setExitEBITDA] = useState("6500000");
  const [exitMult, setExitMult] = useState("8.0");
  const [debtPct, setDebtPct] = useState("55");
  const [holdYears, setHoldYears] = useState("5");

  const toggle = (k: string) => setChecked(c => ({...c, [k]: !c[k]}));
  const route = EXIT_ROUTES.find(r => r.id === activeRoute)!;

  const totalItems = READINESS_ITEMS.reduce((a, c) => a + c.items.length, 0);
  const doneItems = READINESS_ITEMS.reduce((a, c) => a + c.items.filter((_, i) => checked[`${c.category}-${i}`]).length, 0);
  const readinessPct = Math.round(doneItems / totalItems * 100);

  // Returns math
  const entryEV = (parseFloat(entryEBITDA)||0) * (parseFloat(entryMult)||0);
  const debt = entryEV * (parseFloat(debtPct)||0) / 100;
  const equityIn = entryEV - debt;
  const exitEV = (parseFloat(exitEBITDA)||0) * (parseFloat(exitMult)||0);
  const debtAtExit = debt * 0.45;
  const equityOut = Math.max(0, exitEV - debtAtExit);
  const moic = equityIn > 0 ? equityOut / equityIn : 0;
  const irr = equityIn > 0 && parseFloat(holdYears) > 0
    ? ((Math.pow(moic, 1/parseFloat(holdYears)) - 1) * 100).toFixed(1) : "\u2014";

  const handleQuiz = (i: number) => {
    if (quizRevealed) return;
    setQuizSelected(i);
    setQuizRevealed(true);
    if (i === QUIZ[quizIdx].correct) setQuizScore(s => s + 1);
  };
  const nextQ = () => {
    if (quizIdx < QUIZ.length - 1) { setQuizIdx(i => i+1); setQuizSelected(null); setQuizRevealed(false); }
    else setQuizDone(true);
  };

  return (
    <div style={{background:"#0f1d3d",minHeight:"100vh",color:"#e5e7eb",padding:"24px 20px",maxWidth:1200,margin:"0 auto"}}>
      <style>{`

        .ep-btn{cursor:pointer;font-family:inherit;}
        .ep-tb{background:transparent;border:none;padding:9px 18px;font-size:10px;letter-spacing:2px;transition:all .2s;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;}
        .ep-tb.on{color:#3B82F6;border-bottom-color:#3B82F6;}
        .ep-tb:not(.on){color:#2a2838;}
        .ep-tb:hover:not(.on){color:#555;}
        .ep-card{background:#0f1d3d;border:1px solid #1c2a4a;border-radius:5px;}
        .ep-input{background:#17305a;border:1px solid #1c2a4a;color:#ccc;font-family:inherit;font-size:11px;padding:7px 10px;border-radius:3px;width:100%;box-sizing:border-box;outline:none;transition:border-color .15s;}
        .ep-input:focus{border-color:#3B82F6;}
        .ep-chk{width:16px;height:16px;border:1px solid #2a2838;border-radius:2px;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
        .ep-chk.done{background:#5a8a6a;border-color:#5a8a6a;}
        .ep-pill{display:inline-block;padding:2px 8px;border-radius:2px;font-size:8px;letter-spacing:2px;font-weight:600;}
      `}</style>

      {/* Header */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:6,flexWrap:"wrap"}}>
          <div style={{ fontSize:36,letterSpacing:6,color:"#3B82F6",lineHeight:1}}>EXIT</div>
          <div style={{ fontSize:36,letterSpacing:6,color:"#1c2a4a",lineHeight:1}}>PLANNING</div>
          <div style={{fontSize:9,color:"#2a2838",letterSpacing:3,marginLeft:8}}>WAVE 3 &middot; THE FULL LIFECYCLE CLOSE</div>
        </div>
        <div style={{fontSize:11,color:"#333",lineHeight:1.7,maxWidth:640}}>
          Everything you've built &mdash; IC memo, DD, deal structure, 100-day plan, cap table &mdash; was always pointing here. The exit is where PE value creation is realized or not. Five routes. One process. The question is always the same: who pays the most, and when?
        </div>
      </div>

      {/* Tabs */}
      <div style={{borderBottom:"1px solid #17305a",marginBottom:20,display:"flex",flexWrap:"wrap"}}>
        {["routes","readiness","timing","process","quiz"].map(t=>(
          <button key={t} className={`ep-tb ${tab===t?"on":""}`} onClick={()=>setTab(t)}>{t.toUpperCase()}</button>
        ))}
      </div>

      {/* ── ROUTES ── */}
      {tab==="routes" && (
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16}}>
          {/* Route nav */}
          <div>
            {EXIT_ROUTES.map(r => {
              const active = activeRoute === r.id;
              return (
                <div key={r.id} onClick={()=>setActiveRoute(r.id)} style={{padding:"12px 14px",marginBottom:6,borderRadius:4,cursor:"pointer",border:`1px solid ${active?r.color+"55":"#1c2a4a"}`,background:active?r.color+"0e":"#0f1d3d",borderLeft:`3px solid ${active?r.color:r.color+"33"}`,transition:"all .15s"}}>
                  <div style={{ fontSize:11,color:active?r.color:"#444",letterSpacing:2}}>{r.label}</div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                    <div style={{fontSize:9,color:"#333"}}>~{r.freq} of exits</div>
                  </div>
                </div>
              );
            })}

            {/* Returns calc */}
            <div style={{marginTop:16,padding:"14px",background:"#0f1d3d",border:"1px solid #1c2a4a",borderRadius:4}}>
              <div style={{fontSize:9,color:"#3B82F6",letterSpacing:2,marginBottom:12}}>QUICK RETURNS CALC</div>
              {[
                {label:"Entry EBITDA",val:entryEBITDA,set:setEntryEBITDA,ph:"4000000"},
                {label:"Entry Multiple",val:entryMult,set:setEntryMult,ph:"6.5"},
                {label:"Exit EBITDA",val:exitEBITDA,set:setExitEBITDA,ph:"6500000"},
                {label:"Exit Multiple",val:exitMult,set:setExitMult,ph:"8.0"},
                {label:"Debt % at Entry",val:debtPct,set:setDebtPct,ph:"55"},
                {label:"Hold (years)",val:holdYears,set:setHoldYears,ph:"5"},
              ].map(({label,val,set,ph})=>(
                <div key={label} style={{marginBottom:8}}>
                  <div style={{fontSize:8,color:"#555",letterSpacing:1,marginBottom:3}}>{label}</div>
                  <input className="ep-input" value={val} onChange={e=>set(e.target.value)} placeholder={ph} style={{fontSize:10,padding:"5px 8px"}} />
                </div>
              ))}
              <div style={{marginTop:12,borderTop:"1px solid #17305a",paddingTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  {l:"EV AT EXIT",v:fmt(exitEV),c:"#3B82F6"},
                  {l:"EQUITY IN",v:fmt(equityIn),c:"#888"},
                  {l:"MOIC",v:fmtX(moic),c:moic>=2.5?"#5a8a6a":moic>=1.5?"#888":"#8a4a4a"},
                  {l:"IRR",v:`${irr}%`,c:parseFloat(String(irr))>=20?"#5a8a6a":parseFloat(String(irr))>=12?"#888":"#8a4a4a"},
                ].map(({l,v,c})=>(
                  <div key={l} style={{textAlign:"center"}}>
                    <div style={{fontSize:8,color:"#444",letterSpacing:1}}>{l}</div>
                    <div style={{ fontSize:16,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Route detail */}
          <div>
            <div className="ep-card" style={{padding:"20px 24px",marginBottom:12,borderLeft:`3px solid ${route.color}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{ fontSize:22,color:route.color,letterSpacing:3}}>{route.label}</div>
                  <div style={{fontSize:11,color:"#888",marginTop:6,lineHeight:1.7,maxWidth:500}}>{route.headline}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:9,color:"#555",letterSpacing:2}}>FREQUENCY</div>
                  <div style={{ fontSize:28,color:route.color}}>{route.freq}</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,borderTop:"1px solid #17305a",paddingTop:14}}>
                <div>
                  <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:6}}>WHEN IT MAKES SENSE</div>
                  <div style={{fontSize:11,color:"#777",lineHeight:1.7}}>{route.when}</div>
                </div>
                <div>
                  <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:6}}>MULTIPLE DYNAMICS</div>
                  <div style={{fontSize:11,color:"#777",lineHeight:1.7}}>{route.multiple}</div>
                </div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
              <div className="ep-card" style={{padding:"16px 18px",borderLeft:"3px solid #5a8a6a33"}}>
                <div style={{fontSize:9,color:"#5a8a6a",letterSpacing:2,marginBottom:10}}>ADVANTAGES</div>
                {route.pros.map((p,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:7,fontSize:10,color:"#777",lineHeight:1.5}}>
                    <span style={{color:"#5a8a6a",flexShrink:0}}>+</span>{p}
                  </div>
                ))}
              </div>
              <div className="ep-card" style={{padding:"16px 18px",borderLeft:"3px solid #8a4a4a33"}}>
                <div style={{fontSize:9,color:"#8a4a4a",letterSpacing:2,marginBottom:10}}>DISADVANTAGES</div>
                {route.cons.map((c,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:7,fontSize:10,color:"#777",lineHeight:1.5}}>
                    <span style={{color:"#8a4a4a",flexShrink:0}}>&minus;</span>{c}
                  </div>
                ))}
              </div>
              <div className="ep-card" style={{padding:"16px 18px",borderLeft:`3px solid ${route.color}33`}}>
                <div style={{fontSize:9,color:route.color,letterSpacing:2,marginBottom:10}}>READINESS REQUIREMENTS</div>
                {route.readiness.map((r,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:7,fontSize:10,color:"#777",lineHeight:1.5}}>
                    <span style={{color:route.color,flexShrink:0,fontSize:8}}>&rarr;</span>{r}
                  </div>
                ))}
              </div>
            </div>

            <div className="ep-card" style={{padding:"14px 18px",borderLeft:`3px solid ${route.color}22`}}>
              <div style={{fontSize:9,color:route.color,letterSpacing:2,marginBottom:8}}>PE SPONSOR READS THIS EXIT AS</div>
              <div style={{fontSize:11,color:"#666",lineHeight:1.8}}>{route.icNote}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── READINESS ── */}
      {tab==="readiness" && (
        <div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20,flexWrap:"wrap"}}>
            <div style={{flex:1,maxWidth:500}}>
              <div style={{height:6,background:"#1a1a26",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${readinessPct}%`,background:`linear-gradient(90deg,${readinessPct>70?"#5a8a6a":readinessPct>40?"#8a6a3a":"#8a4a4a"},#3B82F6)`,borderRadius:3,transition:"width .4s"}} />
              </div>
            </div>
            <div style={{fontSize:12,color:readinessPct>70?"#5a8a6a":readinessPct>40?"#3B82F6":"#8a4a4a",letterSpacing:1}}>
              {readinessPct}% EXIT READY
            </div>
            <div style={{fontSize:10,color:"#333"}}>{doneItems}/{totalItems} items</div>
          </div>

          {READINESS_ITEMS.map(cat => {
            const catDone = cat.items.filter((_, i) => checked[`${cat.category}-${i}`]).length;
            return (
              <div key={cat.category} className="ep-card" style={{marginBottom:12,borderLeft:`3px solid ${cat.color}33`}}>
                <div style={{padding:"14px 18px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{ fontSize:14,color:cat.color,letterSpacing:3}}>{cat.category}</div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:10,color:catDone===cat.items.length?"#5a8a6a":"#444"}}>{catDone}/{cat.items.length}</div>
                    <div style={{width:80,height:3,background:"#17305a",borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${catDone/cat.items.length*100}%`,background:cat.color,borderRadius:2,transition:"width .3s"}} />
                    </div>
                  </div>
                </div>
                <div style={{padding:"0 18px 14px"}}>
                  {cat.items.map((item, i) => {
                    const key = `${cat.category}-${i}`;
                    const done = !!checked[key];
                    return (
                      <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:8,opacity:done?0.5:1,transition:"opacity .2s"}}>
                        <div className={`ep-chk ${done?"done":""}`} onClick={()=>toggle(key)}>
                          {done&&<span style={{color:"#fff",fontSize:10}}>{"\u2713"}</span>}
                        </div>
                        <div style={{fontSize:11,color:done?"#444":"#ccc",textDecoration:done?"line-through":"none",lineHeight:1.5}}>
                          {item.item}
                          {item.critical&&<span className="ep-pill" style={{background:cat.color+"22",color:cat.color,marginLeft:8}}>CRITICAL</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="ep-card" style={{padding:"14px 18px",borderLeft:"3px solid #8a4a4a33"}}>
            <div style={{fontSize:9,color:"#8a4a4a",letterSpacing:2,marginBottom:8}}>THE ITEM THAT KILLS THE MOST EXITS</div>
            <div style={{fontSize:11,color:"#666",lineHeight:1.8}}>Customer concentration. A single customer at 30% of revenue can eliminate the strategic buyer universe entirely and compress PE multiples by 1&ndash;2 turns. Start diversifying 24 months before your target exit window &mdash; not 6 months before. One year of demonstrated diversification changes the story; a plan to diversify after close does not.
            </div>
          </div>
        </div>
      )}

      {/* ── TIMING ── */}
      {tab==="timing" && (
        <div>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {["ALL","SELL","HOLD"].map(f=>(
              <button key={f} onClick={()=>setTimingFilter(f)} style={{background:f===timingFilter?(f==="SELL"?"#5a8a6a":f==="HOLD"?"#8a4a4a":"#3B82F6"):"transparent",border:`1px solid ${f===timingFilter?"transparent":"#1c2a4a"}`,color:f===timingFilter?"#0f1d3d":"#555",padding:"6px 16px",fontSize:9,letterSpacing:2,borderRadius:3,cursor:"pointer",fontFamily:"inherit"}}>
                {f}
              </button>
            ))}
          </div>

          {TIMING.filter(t=>timingFilter==="ALL"||t.direction===timingFilter).map((t,i)=>(
            <div key={i} className="ep-card" style={{marginBottom:8,padding:"14px 18px",borderLeft:`3px solid ${t.direction==="SELL"?"#5a8a6a":"#8a4a4a"}33`}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <span className="ep-pill" style={{background:t.direction==="SELL"?"#5a8a6a22":"#8a4a4a22",color:t.direction==="SELL"?"#7aba8a":"#c87a7a",marginTop:2,flexShrink:0}}>{t.direction}</span>
                <div>
                  <div style={{ fontSize:13,color:t.direction==="SELL"?"#5a8a6a":"#8a4a4a",letterSpacing:1,marginBottom:6}}>{t.signal.toUpperCase()}</div>
                  <div style={{fontSize:11,color:"#666",lineHeight:1.7}}>{t.detail}</div>
                </div>
              </div>
            </div>
          ))}

          <div className="ep-card" style={{marginTop:8,padding:"16px 18px",borderLeft:"3px solid #3B82F633"}}>
            <div style={{fontSize:9,color:"#3B82F6",letterSpacing:2,marginBottom:8}}>THE TIMING MISTAKE PE FIRMS MAKE MOST</div>
            <div style={{fontSize:11,color:"#666",lineHeight:1.8}}>
              Waiting for perfect conditions that never arrive simultaneously. Strong EBITDA growth + cheap credit + strong strategic M&A activity + clean management team &mdash; all four at once is rare. The real discipline is identifying when 3 of the 4 are aligned and accepting that the fourth won't improve enough to wait. Most value is lost to over-holding, not under-holding.
            </div>
          </div>
        </div>
      )}

      {/* ── PROCESS ── */}
      {tab==="process" && (
        <div>
          <div style={{fontSize:10,color:"#555",letterSpacing:1,marginBottom:20}}>SELL-SIDE PROCESS &mdash; BANKER-RUN AUCTION &middot; TOTAL: 18&ndash;22 WEEKS</div>
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",left:28,top:0,bottom:0,width:1,background:"#1c2a4a"}} />
            {PROCESS_STEPS.map((s,i)=>(
              <div key={i} style={{display:"flex",gap:20,marginBottom:16,position:"relative"}}>
                <div style={{width:56,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",zIndex:1}}>
                  <div style={{width:14,height:14,borderRadius:"50%",background:s.color,flexShrink:0}} />
                  <div style={{fontSize:8,color:s.color,letterSpacing:1,marginTop:4,textAlign:"center",whiteSpace:"nowrap"}}>{s.weeks}</div>
                </div>
                <div className="ep-card" style={{flex:1,overflow:"hidden",borderLeft:`3px solid ${s.color}33`}}>
                  <div onClick={()=>setExpandedStep(expandedStep===i?null:i)} style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                    <div style={{ fontSize:15,color:s.color,letterSpacing:3}}>{s.phase}</div>
                    <span style={{color:"#333",fontSize:12}}>{expandedStep===i?"\u25B2":"\u25BC"}</span>
                  </div>
                  {expandedStep===i && (
                    <div style={{padding:"0 18px 16px",borderTop:"1px solid #17305a"}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:14}}>
                        <div>
                          <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:8}}>SELLER ACTIONS</div>
                          {s.seller.map((a,j)=>(
                            <div key={j} style={{display:"flex",gap:8,marginBottom:6,fontSize:10,color:"#777",lineHeight:1.5}}>
                              <span style={{color:s.color,flexShrink:0}}>&rarr;</span>{a}
                            </div>
                          ))}
                        </div>
                        <div style={{background:"#0f1d3d",border:`1px solid ${s.color}22`,borderRadius:4,padding:"12px 14px"}}>
                          <div style={{fontSize:9,color:s.color,letterSpacing:2,marginBottom:8}}>BUYER PERSPECTIVE</div>
                          <div style={{fontSize:10,color:"#777",lineHeight:1.7}}>{s.buyerLens}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="ep-card" style={{padding:"16px 18px",marginTop:4,borderLeft:"3px solid #8a4a4a33"}}>
            <div style={{fontSize:9,color:"#8a4a4a",letterSpacing:2,marginBottom:8}}>THE PHASE WHERE MOST DEALS REPRICE</div>
            <div style={{fontSize:11,color:"#666",lineHeight:1.8}}>
              Exclusivity. Once the buyer has exclusivity, the power dynamic shifts. Issues found in final DD become price chips &mdash; and the seller has limited leverage to re-open the process without significant time and cost. The counter is simple: do your own QoE before launching the process. Find the issues before the buyer does. Every surprise the buyer discovers in exclusivity costs more to resolve than it would have cost to fix pre-launch.
            </div>
          </div>
        </div>
      )}

      {/* ── QUIZ ── */}
      {tab==="quiz" && (
        <div style={{maxWidth:740}}>
          {!quizDone ? (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:2}}>SCENARIO {quizIdx+1} OF {QUIZ.length}</div>
                <div style={{fontSize:10,color:"#3B82F6",letterSpacing:2}}>{quizScore} CORRECT</div>
              </div>
              <div style={{height:2,background:"#17305a",borderRadius:1,marginBottom:20}}>
                <div style={{height:"100%",width:`${quizIdx/QUIZ.length*100}%`,background:"#3B82F6",transition:"width .3s"}} />
              </div>
              <div className="ep-card" style={{padding:"22px 24px",marginBottom:12}}>
                <div style={{fontSize:11,color:"#ccc",lineHeight:1.9,marginBottom:20}}>{QUIZ[quizIdx].q}</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {QUIZ[quizIdx].opts.map((o,i)=>{
                    const isCorrect=i===QUIZ[quizIdx].correct;
                    const isSelected=quizSelected===i;
                    const bg=!quizRevealed?"#0f1d3d":isCorrect?"#5a8a6a22":isSelected?"#8a4a4a22":"#0f1d3d";
                    const border=!quizRevealed?"#1c2a4a":isCorrect?"#5a8a6a":isSelected?"#8a4a4a":"#1c2a4a";
                    const color=!quizRevealed?"#888":isCorrect?"#7aba8a":isSelected?"#c87a7a":"#555";
                    return (
                      <button key={i} onClick={()=>handleQuiz(i)} style={{background:bg,border:`1px solid ${border}`,borderRadius:4,padding:"12px 16px",textAlign:"left",fontSize:11,color,lineHeight:1.6,transition:"all .15s",cursor:"pointer",fontFamily:"inherit"}}>
                        <span style={{color:isCorrect&&quizRevealed?"#5a8a6a":isSelected&&quizRevealed?"#8a4a4a":"#444",marginRight:10,fontSize:9,letterSpacing:1}}>{String.fromCharCode(65+i)}.</span>{o}
                      </button>
                    );
                  })}
                </div>
              </div>
              {quizRevealed&&(
                <div className="ep-card" style={{padding:"16px 20px",borderLeft:"3px solid #3B82F633"}}>
                  <div style={{fontSize:9,color:"#3B82F6",letterSpacing:2,marginBottom:8}}>EXIT INSIGHT</div>
                  <div style={{fontSize:11,color:"#888",lineHeight:1.8}}>{QUIZ[quizIdx].explain}</div>
                  <button onClick={nextQ} style={{marginTop:14,background:"#3B82F6",border:"none",color:"#0f1d3d",padding:"8px 22px",fontSize:10,letterSpacing:2,borderRadius:3,cursor:"pointer",fontFamily:"inherit"}}>
                    {quizIdx<QUIZ.length-1?"NEXT \u2192":"RESULTS \u2192"}
                  </button>
                </div>
              )}
            </div>
          ):(
            <div className="ep-card" style={{padding:"32px",textAlign:"center"}}>
              <div style={{ fontSize:14,color:"#555",letterSpacing:4,marginBottom:12}}>EXIT ASSESSMENT</div>
              <div style={{ fontSize:64,color:"#3B82F6"}}>{quizScore}/{QUIZ.length}</div>
              <div style={{fontSize:13,color:"#888",marginTop:12,marginBottom:20}}>
                {quizScore===5?"Exit ready. You understand the full lifecycle.":quizScore>=3?"Solid \u2014 review the scenarios you missed before your next deal.":"Spend time on Routes and Timing before your next exit conversation."}
              </div>
              <div style={{marginBottom:24,padding:"16px",background:"#0f1d3d",border:"1px solid #5a8a6a33",borderRadius:4}}>
                <div style={{fontSize:9,color:"#5a8a6a",letterSpacing:2,marginBottom:10}}>WAVE 3 COMPLETE</div>
                <div style={{fontSize:10,color:"#555",lineHeight:2}}>
                  IC Memo &middot; DD Framework &middot; 100-Day Plan &middot; Cap Table Mechanics &middot; Exit Planning
                </div>
                <div style={{fontSize:10,color:"#333",marginTop:8}}>Full PE lifecycle: source &rarr; diligence &rarr; close &rarr; build &rarr; exit</div>
              </div>
              <button onClick={()=>{setQuizDone(false);setQuizIdx(0);setQuizScore(0);setQuizSelected(null);setQuizRevealed(false);}} style={{background:"transparent",border:"1px solid #1c2a4a",color:"#555",padding:"8px 22px",fontSize:10,letterSpacing:2,borderRadius:3,cursor:"pointer",fontFamily:"inherit"}}>RETAKE</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
