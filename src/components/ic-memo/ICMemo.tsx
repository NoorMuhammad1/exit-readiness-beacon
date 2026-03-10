import { useState } from "react";

const fmt = (n: number) => {
  if (!n || isNaN(n)) return "—";
  const v = typeof n === 'string' ? parseFloat(n) : n;
  if (Math.abs(v) >= 1_000_000_000) return `${(v/1e9).toFixed(1)}B`;
  if (Math.abs(v) >= 1_000_000) return `${(v/1e6).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${(v/1e3).toFixed(0)}K`;
  return `${v.toFixed(1)}`;
};

const calcIRR = (equity: number, proceeds: number, years: number) => {
  if (!equity || !proceeds || !years) return null;
  const moic = proceeds / equity;
  return ((Math.pow(moic, 1/years) - 1) * 100).toFixed(1);
};

const ANATOMY = [
  {
    section: "EXECUTIVE SUMMARY",
    weight: "15%",
    color: "#3B82F6",
    purpose: "The section partners read first and sometimes only. Must state the deal in 3 sentences: who, why, what we're paying.",
    mustHave: ["Company name, sector, HQ", "Entry valuation and equity check", "1-sentence investment thesis", "Recommended entry multiple", "IC recommendation (invest / pass)"],
    killers: ["Burying the recommendation", "No stated entry multiple", "Thesis that's just a description of the business"],
    icWeight: "IC members form their initial view here. If the thesis isn't clear by line 3, the deal starts behind."
  },
  {
    section: "COMPANY OVERVIEW",
    weight: "10%",
    color: "#5a8a9a",
    purpose: "Business model clarity. IC needs to understand how money moves through the company in 60 seconds.",
    mustHave: ["Revenue model (how they charge)", "Customer type and count", "Recurring vs. transactional split", "Geographic footprint", "Key operational metrics"],
    killers: ["Generic industry descriptions", "Missing recurring revenue %", "No customer concentration data"],
    icWeight: "IC is testing whether the team truly understands the business model — not just the financials."
  },
  {
    section: "INVESTMENT THESIS",
    weight: "20%",
    color: "#3B82F6",
    purpose: "The 3–5 reasons this deal creates value. Each bullet must be a claim with evidence, not an adjective.",
    mustHave: ["3–5 specific, falsifiable claims", "Each thesis supported by data", "Link to value creation mechanism", "Differentiation from comps", "What the seller gets wrong about their own business"],
    killers: ["'Strong management team'", "'Large and growing market'", "Thesis points that apply to every deal in the sector"],
    icWeight: "The most scrutinized section. Partners will push back on every bullet. If a point can't survive 60 seconds of questioning, cut it."
  },
  {
    section: "MARKET ANALYSIS",
    weight: "8%",
    color: "#6a5a9a",
    purpose: "Market size, growth rate, and competitive dynamics. Must answer: is this market worth being in?",
    mustHave: ["TAM/SAM with source", "CAGR with time horizon", "Competitive landscape (named players)", "Company's relative positioning", "Secular tailwinds"],
    killers: ["$XB TAM with no source", "Missing competitive context", "Market narrative that doesn't connect to company position"],
    icWeight: "IC isn't looking for MBA market slides. They want to know: is growth structural or cyclical, and does this company have durable positioning?"
  },
  {
    section: "FINANCIAL ANALYSIS",
    weight: "20%",
    color: "#5a8a6a",
    purpose: "Historical performance + projected financials. The numbers must tell a coherent story.",
    mustHave: ["3 years historical revenue + EBITDA", "LTM as the bridge to entry", "3–5 year projection (base case)", "Key assumptions made explicit", "QoE adjustments noted"],
    killers: ["Projections with no stated assumptions", "Missing QoE bridge", "Revenue hockey stick with no operational driver", "EBITDA margin expansion unexplained"],
    icWeight: "IC will stress-test every growth assumption. If you can't defend the ramp in Year 2, the deal dies here."
  },
  {
    section: "DEAL STRUCTURE",
    weight: "12%",
    color: "#8a4a4a",
    purpose: "Sources and uses, debt structure, equity check, management rollover. Exactly how money moves at close.",
    mustHave: ["Sources & Uses table", "Debt/equity split", "Entry multiple and basis", "Management rollover %", "Key reps & warranties"],
    killers: ["Sources don't equal uses", "Debt terms not specified", "Missing management economics", "No W&I insurance note"],
    icWeight: "Partners confirm the structure is executable. Any gap here kills momentum — IC won't approve a deal it can't fund."
  },
  {
    section: "VALUE CREATION PLAN",
    weight: "15%",
    color: "#3B82F6",
    purpose: "The 100-day plan and 5-year roadmap. Where does the return actually come from?",
    mustHave: ["Operational improvement levers", "M&A / add-on pipeline", "Revenue growth initiatives", "Cost reduction opportunities", "Multiple expansion rationale"],
    killers: ["'Work with management to improve operations'", "Add-on strategy with no named targets", "Value creation that's just market growth"],
    icWeight: "IC is asking: does the team have a real plan, or are they betting on multiple expansion? The best memos have a value bridge — EBITDA at entry vs. exit, built from specific initiatives."
  },
  {
    section: "MANAGEMENT ASSESSMENT",
    weight: "8%",
    color: "#5a8a9a",
    purpose: "CEO/leadership evaluation. Will they execute the value creation plan?",
    mustHave: ["CEO tenure and background", "Prior M&A / integration experience", "Assessment of gaps vs. plan", "Key hires needed", "Compensation/incentive structure"],
    killers: ["'Strong entrepreneurial CEO'", "No acknowledgment of gaps", "Missing incentive structure", "No succession plan for key person risk"],
    icWeight: "IC often has more conviction on team than thesis. A weak thesis with a great operator is more fundable than the reverse."
  },
  {
    section: "RISKS & MITIGANTS",
    weight: "8%",
    color: "#8a6a3a",
    purpose: "Honest enumeration of what could go wrong, paired with specific mitigants.",
    mustHave: ["5–7 specific risks", "Each risk has a mitigant", "Downside case scenario", "Customer concentration risk", "Key person risk"],
    killers: ["Risks that are softened into non-risks", "No downside case", "Missing customer/supplier concentration", "Boilerplate 'competitive market' risk"],
    icWeight: "IC respects teams that identify real risks. A memo that minimizes risk signals either naivete or dishonesty. Both kill deals."
  },
  {
    section: "RETURNS ANALYSIS",
    weight: "15%",
    color: "#5a8a6a",
    purpose: "Base/bull/bear returns with explicit assumptions. The final answer to: does this work?",
    mustHave: ["Three scenarios (bear/base/bull)", "Entry and exit multiple stated", "Explicit hold period", "IRR and MOIC per scenario", "Sensitivity table (exit multiple vs. EBITDA growth)"],
    killers: ["Only a base case", "Exit multiple higher than entry with no rationale", "Missing debt paydown in returns calc", "IRR that doesn't survive a 1-turn multiple compression"],
    icWeight: "IC needs to see the deal works in bear AND base. A deal that only works in bull case doesn't get approved."
  }
];

const RED_FLAGS = [
  { flag: "Hockey stick in Year 2", severity: "KILL", section: "Financials", detail: "Revenue flat for 3 years then doubles in Year 2 with no operational explanation. IC reads this as: 'We needed the numbers to work.'" },
  { flag: "Missing QoE bridge", severity: "KILL", section: "Financials", detail: "No Quality of Earnings adjustment schedule. IC assumes the EBITDA number is wrong until proven otherwise." },
  { flag: "Thesis built on multiple expansion", severity: "HIGH", section: "Returns", detail: "Entry at 7x, exit at 10x, 2% EBITDA growth. The entire return is from multiple expansion. IC asks: why would that happen?" },
  { flag: "Only base case returns", severity: "HIGH", section: "Returns", detail: "One scenario = one set of assumptions = no stress test. IC requires bear case that still generates acceptable returns." },
  { flag: "No named add-on targets", severity: "HIGH", section: "Value Creation", detail: "'Add-on acquisition strategy' without names, sizes, or owner relationships. It's not a strategy; it's a hope." },
  { flag: "CEO described, not assessed", severity: "MEDIUM", section: "Management", detail: "Bio with tenure and background but no honest evaluation of gaps vs. plan requirements. IC wants candor, not a resume." },
  { flag: "Risks are really non-risks", severity: "MEDIUM", section: "Risks", detail: "'Competition could increase' — this applies to every deal ever done. Real risks have specific names and dollar estimates." },
  { flag: "Sources ≠ Uses", severity: "KILL", section: "Deal Structure", detail: "Math doesn't clear. This signals either rushed diligence or a draft that wasn't reviewed before IC." },
  { flag: "Thesis points with no evidence", severity: "HIGH", section: "Investment Thesis", detail: "'Leader in a fragmented market' — what's the market share? What's the fragmentation? Back every claim with a number." },
  { flag: "No customer concentration data", severity: "MEDIUM", section: "Overview", detail: "Top 10 customers as % of revenue not stated. IC assumes the worst." },
  { flag: "Debt terms vague", severity: "HIGH", section: "Deal Structure", detail: "'Senior secured credit facility' with no rate, covenant, or lender name. IC can't model downside without debt terms." },
  { flag: "No downside scenario", severity: "KILL", section: "Returns", detail: "Bear case missing entirely. Any sponsor-level IC will ask for downside returns before base." },
];

const QUIZ = [
  {
    q: "Your IC memo shows 35% IRR in base case. A partner asks: 'What does this look like if entry EBITDA is 10% lower than we think?' You haven't modeled it. The partner's reaction is:",
    opts: ["Impressed by your 35% base case", "Curious but will accept your answer", "Concerned — and will ask this question again at the next IC"],
    correct: 2,
    explain: "IC members who ask stress-test questions and don't get answers always ask again. One unmodeled scenario signals the team hasn't pressure-tested the deal. Build the sensitivity table before IC."
  },
  {
    q: "Your investment thesis for a $18M EBITDA HVAC platform has 5 bullets. Bullet 3 is: 'Strong management team with deep industry relationships.' At IC, a partner will:",
    opts: ["Agree — management is critical in services businesses", "Ask you to quantify or remove the bullet", "Use it as evidence that management de-risks the deal"],
    correct: 1,
    explain: "'Strong management team' is the most common IC memo kill phrase. It's an adjective, not a claim. Replace it with: 'CEO completed 5 acquisitions, avg. 4.2 months to breakeven, 0 failed integrations.'"
  },
  {
    q: "You're presenting a deal at 6.5x EBITDA entry, projecting exit at 9.0x in Year 5. The delta between entry and exit creates 1.4x of your total 2.8x MOIC. The IC chair's first question will be:",
    opts: ["Why is the exit multiple 9.0x and not 10.0x?", "What market conditions support multiple expansion from 6.5x to 9.0x?", "How does EBITDA grow over the hold period?"],
    correct: 1,
    explain: "Half your return depending on multiple expansion is a red flag. IC will ask what justifies the re-rating: is the combined platform larger, more recurring, better positioned to strategic buyers? You need a specific answer."
  },
  {
    q: "In your risk section, you list 'key person risk — CEO.' Your mitigant is: 'Company has strong middle management bench.' IC's response:",
    opts: ["Acceptable — key person risk is always noted this way", "They'll ask for specifics: who, what roles, what's their retention plan", "They'll remove it from the memo — it's not a real risk"],
    correct: 1,
    explain: "Vague mitigants signal the risk hasn't been honestly assessed. For key person risk: name the two people below the CEO, note their tenure, state whether retention agreements are in place, and price the key man insurance."
  },
  {
    q: "You present bear case returns: entry at 6.5x, bear exit at 6.0x, 0% EBITDA growth, 5-year hold. The IRR is 4.2%. The IC reaction:",
    opts: ["Pass — no fund returns 4.2% and calls it success", "Approve — bear case is supposed to be bad", "Approve if base and bull are strong enough to offset"],
    correct: 0,
    explain: "Bear case of 4.2% doesn't just fail hurdle — it signals the deal has no downside protection. PE firms need bear case to still clear cost of capital (typically 8–12%). If you can't get there, reprice the deal or don't do it."
  }
];

const SCENARIOS = {
  bear:  { label: "BEAR", color: "#8a4a4a", exitMult: 0.85, ebitdaGrowth: 0.00 },
  base:  { label: "BASE", color: "#5a8a6a", exitMult: 1.00, ebitdaGrowth: 0.12 },
  bull:  { label: "BULL", color: "#3B82F6", exitMult: 1.20, ebitdaGrowth: 0.22 },
};

export default function ICMemo() {
  const [tab, setTab] = useState("anatomy");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [rfFilter, setRfFilter] = useState("ALL");
  const [builderStep, setBuilderStep] = useState(0);

  // Returns calculator state
  const [entryEBITDA, setEntryEBITDA] = useState("4000000");
  const [entryMult, setEntryMult] = useState("6.5");
  const [debtPct, setDebtPct] = useState("55");
  const [exitMult, setExitMult] = useState("8.0");
  const [holdYears, setHoldYears] = useState("5");
  const [ebitdaCAGR, setEbitdaCAGR] = useState("12");

  // Builder state
  const [memo, setMemo] = useState({
    company: "", sector: "", hq: "", tagline: "",
    thesis1: "", thesis2: "", thesis3: "",
    entryEBITDA: "", entryMult: "", equityCheck: "",
    recurring: "", topCustPct: "", employees: "",
    vc1: "", vc2: "", vc3: "",
    risk1: "", risk1mit: "", risk2: "", risk2mit: "", risk3: "", risk3mit: "",
    recommendation: "INVEST"
  });
  const setM = (k: string, v: string) => setMemo(m => ({...m, [k]: v}));

  // Returns math
  const ev = parseFloat(entryEBITDA) * parseFloat(entryMult) || 0;
  const debt = ev * (parseFloat(debtPct) / 100);
  const equityIn = ev - debt;

  const scenarioReturns = Object.entries(SCENARIOS).map(([key, s]) => {
    const exitEBITDA = parseFloat(entryEBITDA) * Math.pow(1 + parseFloat(ebitdaCAGR)/100 * (key === "bear" ? 0 : key === "base" ? 1 : 1.5), parseFloat(holdYears));
    const exitEV = exitEBITDA * parseFloat(exitMult) * s.exitMult;
    const debtRemaining = debt * 0.5;
    const equityOut = Math.max(0, exitEV - debtRemaining);
    const moic = equityIn > 0 ? (equityOut / equityIn).toFixed(2) : "—";
    const irr = equityIn > 0 ? calcIRR(equityIn, equityOut, parseFloat(holdYears)) : "—";
    return { ...s, key, exitEBITDA, exitEV, equityOut, moic, irr };
  });

  const handleQuiz = (idx: number) => {
    if (quizRevealed) return;
    setQuizSelected(idx);
    setQuizRevealed(true);
    if (idx === QUIZ[quizIdx].correct) setQuizScore(s => s + 1);
  };

  const nextQ = () => {
    if (quizIdx < QUIZ.length - 1) {
      setQuizIdx(i => i+1);
      setQuizSelected(null);
      setQuizRevealed(false);
    } else {
      setQuizDone(true);
    }
  };

  const BUILDER_STEPS = [
    { label: "DEAL ID", fields: [
      { key: "company", label: "Company Name", ph: "Apex HVAC Services" },
      { key: "sector", label: "Sector", ph: "Business Services / HVAC" },
      { key: "hq", label: "HQ", ph: "Charlotte, NC" },
      { key: "tagline", label: "One-Line Business Descriptor", ph: "Residential & commercial HVAC platform, 40% recurring revenue" },
    ]},
    { label: "INVESTMENT THESIS", fields: [
      { key: "thesis1", label: "Thesis Bullet 1 (must be falsifiable)", ph: "40% recurring revenue with 88% annual contract renewal — verified via QoE" },
      { key: "thesis2", label: "Thesis Bullet 2", ph: "5 completed acquisitions, avg. 4.2 months to breakeven — proven integration playbook" },
      { key: "thesis3", label: "Thesis Bullet 3", ph: "Aging housing stock in Carolinas driving 7% annual HVAC demand growth through 2031" },
    ]},
    { label: "DEAL STRUCTURE", fields: [
      { key: "entryEBITDA", label: "LTM EBITDA ($)", ph: "4000000" },
      { key: "entryMult", label: "Entry Multiple (x)", ph: "6.5" },
      { key: "equityCheck", label: "Equity Check ($)", ph: "11700000" },
      { key: "recurring", label: "Recurring Revenue %", ph: "40" },
      { key: "topCustPct", label: "Top 10 Customer Concentration %", ph: "18" },
    ]},
    { label: "VALUE CREATION PLAN", fields: [
      { key: "vc1", label: "Initiative 1 — Operational", ph: "Cross-sell maintenance contracts to install-only customers — $800K EBITDA uplift by Year 2" },
      { key: "vc2", label: "Initiative 2 — M&A", ph: "3 tuck-in acquisitions identified in SC/VA markets, avg. 4x EBITDA — $1.2M incremental EBITDA" },
      { key: "vc3", label: "Initiative 3 — Multiple Expansion", ph: "Exit to strategic buyer at 8–9x on $8M platform EBITDA — larger buyer universe than at entry" },
    ]},
    { label: "KEY RISKS", fields: [
      { key: "risk1", label: "Risk 1", ph: "CEO key person risk — no named successor" },
      { key: "risk1mit", label: "Mitigant 1", ph: "Retention agreement signed, $1.2M golden handcuffs through Year 3. VP Ops (Derek Okafor) scaled prior platform to $40M." },
      { key: "risk2", label: "Risk 2", ph: "Acquisition integration failure" },
      { key: "risk2mit", label: "Mitigant 2", ph: "5 prior integrations, documented playbook, 0 failed integrations. Dedicated integration PM budgeted Year 1." },
      { key: "risk3", label: "Risk 3", ph: "Labor cost inflation — HVAC tech wages +12% YTD" },
      { key: "risk3mit", label: "Mitigant 3", ph: "Pricing power demonstrated — 3 rate increases in 24 months with <5% customer attrition. 6-month backlog provides buffer." },
    ]},
  ];

  return (
    <div style={{background:"#0f1d3d",minHeight:"100vh",color:"#e5e7eb",padding:"24px 20px",maxWidth:1200,margin:"0 auto"}}>
      <style>{`

        button{cursor:pointer;font-family:inherit;}
        .tb{background:transparent;border:none;padding:9px 18px;font-size:10px;letter-spacing:2px;transition:all .2s;border-bottom:2px solid transparent;}
        .tb.on{color:#3B82F6;border-bottom-color:#3B82F6;}
        .tb:not(.on){color:#2a2838;}
        .tb:hover:not(.on){color:#555;}
        .card{background:#0f1d3d;border:1px solid #1c2a4a;border-radius:5px;}
        input,textarea,select{background:#17305a;border:1px solid #1c2a4a;color:#ccc;font-family:inherit;font-size:11px;padding:7px 10px;border-radius:3px;width:100%;box-sizing:border-box;outline:none;transition:border-color .15s;}
        input:focus,textarea:focus{border-color:#3B82F6;}
        textarea{resize:vertical;line-height:1.6;}
        .pill{display:inline-block;padding:2px 8px;border-radius:2px;font-size:8px;letter-spacing:2px;font-weight:600;}
      `}</style>

      {/* Header */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:4}}>
          <div style={{ fontSize:36,letterSpacing:6,color:"#3B82F6",lineHeight:1}}>IC MEMO</div>
          <div style={{ fontSize:36,letterSpacing:6,color:"#1c2a4a",lineHeight:1}}>BUILDER</div>
          <div style={{fontSize:9,color:"#2a2838",letterSpacing:3,marginLeft:8}}>WAVE 3 · INVESTMENT COMMITTEE</div>
        </div>
        <div style={{fontSize:11,color:"#333",lineHeight:1.7,maxWidth:620}}>
          The Investment Committee memo is the internal document that gets a deal approved or killed. Everything you've built — valuation, deal structure, diligence — lives or dies in this document.
        </div>
      </div>

      {/* Tabs */}
      <div style={{borderBottom:"1px solid #17305a",marginBottom:20,display:"flex",flexWrap:"wrap"}}>
        {["anatomy","returns","red flags","builder","quiz"].map(t => (
          <button key={t} className={`tb ${tab===t?"on":""}`} onClick={()=>setTab(t)}>{t.toUpperCase()}</button>
        ))}
      </div>

      {/* ANATOMY */}
      {tab==="anatomy" && (
        <div>
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{fontSize:10,color:"#555",letterSpacing:1}}>IC ATTENTION WEIGHT</div>
            {ANATOMY.map((s,i) => (
              <div key={i} title={s.section} style={{height:8,width:`${parseInt(s.weight)*3}px`,background:s.color,opacity:.7,borderRadius:2}} />
            ))}
          </div>

          {ANATOMY.map((s, i) => (
            <div key={i} className="card" style={{marginBottom:8,borderLeft:`3px solid ${s.color}33`,overflow:"hidden"}}>
              <div onClick={()=>setExpanded(expanded===i?null:i)} style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <div style={{ fontSize:16,color:"#111",minWidth:32}}>{String(i+1).padStart(2,"0")}</div>
                  <div>
                    <div style={{ fontSize:14,color:s.color,letterSpacing:2}}>{s.section}</div>
                    <div style={{fontSize:10,color:"#444",marginTop:2}}>{s.purpose.substring(0,80)}...</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{ fontSize:18,color:s.color}}>{s.weight}</div>
                  <div style={{color:"#333",fontSize:12}}>{expanded===i?"\u25B2":"\u25BC"}</div>
                </div>
              </div>

              {expanded===i && (
                <div style={{padding:"0 18px 16px",borderTop:"1px solid #17305a"}}>
                  <div style={{marginTop:14,fontSize:11,color:"#888",lineHeight:1.8}}>{s.purpose}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:16}}>
                    <div>
                      <div style={{fontSize:9,color:"#5a8a6a",letterSpacing:2,marginBottom:8}}>MUST HAVE</div>
                      {s.mustHave.map((m,j) => (
                        <div key={j} style={{display:"flex",gap:8,marginBottom:6,fontSize:10,color:"#777",lineHeight:1.5}}>
                          <span style={{color:"#5a8a6a",flexShrink:0}}>{"\u2713"}</span>{m}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{fontSize:9,color:"#8a4a4a",letterSpacing:2,marginBottom:8}}>INSTANT KILLERS</div>
                      {s.killers.map((k,j) => (
                        <div key={j} style={{display:"flex",gap:8,marginBottom:6,fontSize:10,color:"#777",lineHeight:1.5}}>
                          <span style={{color:"#8a4a4a",flexShrink:0}}>{"\u2717"}</span>{k}
                        </div>
                      ))}
                    </div>
                    <div style={{background:"#0f1d3d",border:`1px solid ${s.color}22`,borderRadius:4,padding:"12px 14px"}}>
                      <div style={{fontSize:9,color:s.color,letterSpacing:2,marginBottom:8}}>IC READS THIS AS</div>
                      <div style={{fontSize:10,color:"#888",lineHeight:1.7,fontStyle:"italic"}}>{s.icWeight}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* RETURNS */}
      {tab==="returns" && (
        <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:16}}>
          {/* Inputs */}
          <div className="card" style={{padding:"20px 22px"}}>
            <div style={{ fontSize:16,color:"#3B82F6",letterSpacing:3,marginBottom:18}}>DEAL INPUTS</div>
            {[
              {label:"LTM EBITDA ($)", val:entryEBITDA, set:setEntryEBITDA, ph:"4000000"},
              {label:"Entry Multiple (x EBITDA)", val:entryMult, set:setEntryMult, ph:"6.5"},
              {label:"Debt % of EV", val:debtPct, set:setDebtPct, ph:"55"},
              {label:"Exit Multiple (base case)", val:exitMult, set:setExitMult, ph:"8.0"},
              {label:"Hold Period (years)", val:holdYears, set:setHoldYears, ph:"5"},
              {label:"EBITDA CAGR — base case %", val:ebitdaCAGR, set:setEbitdaCAGR, ph:"12"},
            ].map(({label,val,set,ph}) => (
              <div key={label} style={{marginBottom:12}}>
                <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:5}}>{label}</div>
                <input type="text" value={val} onChange={e=>set(e.target.value)} placeholder={ph} />
              </div>
            ))}

            <div style={{marginTop:16,padding:"12px 14px",background:"#0f1d3d",border:"1px solid #1c2a4a",borderRadius:4}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,fontSize:10,color:"#666"}}>
                <div>Enterprise Value<div style={{color:"#3B82F6",fontSize:14}}>{fmt(ev)}</div></div>
                <div>Debt at Entry<div style={{color:"#8a4a4a",fontSize:14}}>{fmt(debt)}</div></div>
                <div>Equity Check<div style={{color:"#5a8a6a",fontSize:14}}>{fmt(equityIn)}</div></div>
                <div>Debt/EBITDA<div style={{color:"#888",fontSize:14}}>{entryEBITDA&&debtPct&&entryMult?`${(debt/parseFloat(entryEBITDA)).toFixed(1)}x`:"—"}</div></div>
              </div>
            </div>
          </div>

          {/* Scenarios */}
          <div>
            <div style={{ fontSize:16,color:"#3B82F6",letterSpacing:3,marginBottom:16}}>SCENARIO RETURNS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
              {scenarioReturns.map(s => (
                <div key={s.key} className="card" style={{padding:"18px 20px",borderLeft:`3px solid ${s.color}`}}>
                  <div style={{ fontSize:18,color:s.color,letterSpacing:4,marginBottom:12}}>{s.label}</div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:9,color:"#555",letterSpacing:2}}>EXIT MOIC</div>
                    <div style={{ fontSize:32,color:s.color}}>{s.moic}x</div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:9,color:"#555",letterSpacing:2}}>IRR</div>
                    <div style={{ fontSize:24,color:parseFloat(s.irr as string)>=20?s.color:parseFloat(s.irr as string)>=12?"#888":"#8a4a4a"}}>
                      {s.irr}%
                    </div>
                  </div>
                  <div style={{fontSize:10,color:"#555",lineHeight:1.7}}>
                    <div>Exit EV: {fmt(s.exitEV)}</div>
                    <div>Exit EBITDA: {fmt(s.exitEBITDA)}</div>
                    <div>Exit mult adj: {(parseFloat(exitMult)*s.exitMult).toFixed(1)}x</div>
                    <div>Equity out: {fmt(s.equityOut)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* IC verdict */}
            <div className="card" style={{padding:"16px 20px",borderLeft:"3px solid #6a5a9a33"}}>
              <div style={{fontSize:9,color:"#6a5a9a",letterSpacing:2,marginBottom:10}}>IC READS THIS AS</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                {scenarioReturns.map(s => {
                  const irr = parseFloat(s.irr as string);
                  const verdict = irr >= 25 ? {text:"Strong — above typical hurdle", color:"#5a8a6a"} :
                                  irr >= 15 ? {text:"Acceptable — clears cost of capital", color:"#888"} :
                                  irr >= 8  ? {text:"Marginal — needs repricing or pass", color:"#8a6a3a"} :
                                              {text:"Fail — does not clear hurdle", color:"#8a4a4a"};
                  return (
                    <div key={s.key}>
                      <div style={{ fontSize:11,color:s.color,letterSpacing:2,marginBottom:4}}>{s.label}</div>
                      <div style={{fontSize:10,color:verdict.color}}>{verdict.text}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop:12,fontSize:10,color:"#444",lineHeight:1.7,borderTop:"1px solid #17305a",paddingTop:12}}>
                IC rule: bear case must clear cost of capital (typically 8–12%). A deal that only works in base or bull doesn't get approved — it gets repriced.
              </div>
            </div>

            {/* Sensitivity table */}
            <div className="card" style={{marginTop:12,padding:"16px 20px"}}>
              <div style={{fontSize:9,color:"#3B82F6",letterSpacing:2,marginBottom:12}}>IRR SENSITIVITY — EXIT MULTIPLE vs. EBITDA CAGR (BASE CASE HOLD)</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",fontSize:10,borderCollapse:"collapse"}}>
                  <thead>
                    <tr>
                      <td style={{padding:"6px 8px",color:"#555",fontSize:9}}>EBITDA CAGR &rarr;<br/>Exit Mult &darr;</td>
                      {[5,8,12,15,20].map(c=>(
                        <td key={c} style={{padding:"6px 8px",color:"#888",textAlign:"center"}}>{c}%</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[6.0,7.0,8.0,9.0,10.0].map(em=>(
                      <tr key={em} style={{borderTop:"1px solid #17305a"}}>
                        <td style={{padding:"6px 8px",color:"#888"}}>{em}x</td>
                        {[5,8,12,15,20].map(cagr=>{
                          const exitE = parseFloat(entryEBITDA||"4000000") * Math.pow(1+cagr/100, parseFloat(holdYears||"5"));
                          const exitV = exitE * em;
                          const debtR = (parseFloat(entryEBITDA||"4000000")*parseFloat(entryMult||"6.5")*(parseFloat(debtPct||"55")/100))*0.5;
                          const eqIn = parseFloat(entryEBITDA||"4000000")*parseFloat(entryMult||"6.5")*(1-parseFloat(debtPct||"55")/100);
                          const eqOut = Math.max(0, exitV - debtR);
                          const irr = eqIn > 0 ? parseFloat(calcIRR(eqIn,eqOut,parseFloat(holdYears||"5")) || "0") : 0;
                          const bg = irr>=25?"#5a8a6a22":irr>=15?"#88882222":irr>=8?"#8a6a3a22":"#8a4a4a22";
                          const col = irr>=25?"#5a8a6a":irr>=15?"#888":irr>=8?"#8a6a3a":"#8a4a4a";
                          return <td key={cagr} style={{padding:"6px 8px",background:bg,color:col,textAlign:"center"}}>{irr.toFixed(1)}%</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RED FLAGS */}
      {tab==="red flags" && (
        <div>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {["ALL","KILL","HIGH","MEDIUM"].map(f=>(
              <button key={f} onClick={()=>setRfFilter(f)} style={{background:rfFilter===f?(f==="KILL"?"#8a4a4a":f==="HIGH"?"#8a6a3a":f==="MEDIUM"?"#555":"#3B82F6"):"transparent",border:`1px solid ${rfFilter===f?"transparent":"#1c2a4a"}`,color:rfFilter===f?"#fff":"#555",padding:"6px 14px",fontSize:9,letterSpacing:2,borderRadius:3}}>
                {f}
              </button>
            ))}
            <div style={{marginLeft:"auto",fontSize:10,color:"#333",letterSpacing:1,alignSelf:"center"}}>
              {RED_FLAGS.filter(r=>rfFilter==="ALL"||r.severity===rfFilter).length} FLAGS
            </div>
          </div>

          {RED_FLAGS.filter(r=>rfFilter==="ALL"||r.severity===rfFilter).map((r,i)=>(
            <div key={i} className="card" style={{marginBottom:8,padding:"14px 18px",borderLeft:`3px solid ${r.severity==="KILL"?"#8a4a4a":r.severity==="HIGH"?"#8a6a3a":"#555"}33`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
                    <span className="pill" style={{background:r.severity==="KILL"?"#8a4a4a33":r.severity==="HIGH"?"#8a6a3a33":"#55555533",color:r.severity==="KILL"?"#c87a7a":r.severity==="HIGH"?"#c8a87a":"#888"}}>
                      {r.severity}
                    </span>
                    <span style={{fontSize:9,color:"#444",letterSpacing:1}}>{r.section.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize:13,color:"#ccc",letterSpacing:1,marginBottom:8}}>{r.flag.toUpperCase()}</div>
                  <div style={{fontSize:11,color:"#666",lineHeight:1.7}}>{r.detail}</div>
                </div>
              </div>
            </div>
          ))}

          <div style={{marginTop:16,padding:"14px 18px",background:"#0f1d3d",border:"1px solid #3B82F622",borderRadius:5}}>
            <div style={{fontSize:9,color:"#3B82F6",letterSpacing:2,marginBottom:8}}>IC PATTERN</div>
            <div style={{fontSize:11,color:"#666",lineHeight:1.8}}>
              Kill flags (4) will stop a deal at IC even if everything else is strong. High flags (5) require a credible answer before IC will vote. Medium flags (3) get noted but don't kill — they become conditions or follow-ups. No IC memo is perfect. The goal is zero Kill flags and a credible response to every High flag.
            </div>
          </div>
        </div>
      )}

      {/* BUILDER */}
      {tab==="builder" && (
        <div>
          {/* Step progress */}
          <div style={{display:"flex",gap:0,marginBottom:20}}>
            {BUILDER_STEPS.map((s,i)=>(
              <div key={i} onClick={()=>setBuilderStep(i)} style={{flex:1,padding:"8px 12px",background:builderStep===i?"#3B82F611":"transparent",borderBottom:`2px solid ${builderStep===i?"#3B82F6":"#1c2a4a"}`,cursor:"pointer",textAlign:"center"}}>
                <div style={{fontSize:8,letterSpacing:2,color:builderStep===i?"#3B82F6":"#333"}}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{padding:"20px 24px",marginBottom:16}}>
            <div style={{ fontSize:16,color:"#3B82F6",letterSpacing:3,marginBottom:18}}>
              {BUILDER_STEPS[builderStep].label}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {BUILDER_STEPS[builderStep].fields.map(f=>(
                <div key={f.key} style={{gridColumn:f.key.includes("thesis")||f.key.includes("mit")||f.key==="tagline"||f.key.startsWith("vc")?"1 / -1":"auto"}}>
                  <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:5}}>{f.label.toUpperCase()}</div>
                  {f.key.includes("thesis")||f.key.includes("mit")||f.key.startsWith("vc")||f.key==="tagline"
                    ? <textarea rows={2} placeholder={f.ph} value={memo[f.key as keyof typeof memo]} onChange={e=>setM(f.key,e.target.value)} />
                    : <input type="text" placeholder={f.ph} value={memo[f.key as keyof typeof memo]} onChange={e=>setM(f.key,e.target.value)} />
                  }
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:16}}>
              <button onClick={()=>setBuilderStep(s=>Math.max(0,s-1))} disabled={builderStep===0} style={{background:"transparent",border:"1px solid #1c2a4a",color:"#555",padding:"7px 18px",fontSize:10,letterSpacing:2,borderRadius:3,opacity:builderStep===0?0.3:1}}>
                &larr; BACK
              </button>
              <button onClick={()=>setBuilderStep(s=>Math.min(BUILDER_STEPS.length-1,s+1))} disabled={builderStep===BUILDER_STEPS.length-1} style={{background:"transparent",border:"1px solid #1c2a4a",color:"#555",padding:"7px 18px",fontSize:10,letterSpacing:2,borderRadius:3,opacity:builderStep===BUILDER_STEPS.length-1?0.3:1}}>
                NEXT &rarr;
              </button>
            </div>
          </div>

          {/* IC Memo preview */}
          {(memo.company||memo.thesis1) && (
            <div className="card" style={{padding:"20px 24px"}}>
              <div style={{fontSize:9,color:"#3B82F6",letterSpacing:2,marginBottom:14}}>IC MEMO DRAFT — EXECUTIVE SUMMARY</div>
              <div style={{borderLeft:"3px solid #3B82F6",paddingLeft:16,marginBottom:16}}>
                <div style={{ fontSize:22,color:"#3B82F6",letterSpacing:3}}>{memo.company||"[COMPANY NAME]"}</div>
                <div style={{fontSize:11,color:"#888",marginTop:4}}>{memo.sector} {memo.hq&&`\u00B7 ${memo.hq}`}</div>
                <div style={{fontSize:11,color:"#666",marginTop:8,fontStyle:"italic"}}>{memo.tagline}</div>
              </div>

              {(memo.thesis1||memo.thesis2||memo.thesis3) && (
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:9,color:"#3B82F6",letterSpacing:2,marginBottom:10}}>INVESTMENT THESIS</div>
                  {[memo.thesis1,memo.thesis2,memo.thesis3].filter(Boolean).map((t,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:8,fontSize:11,color:"#888",lineHeight:1.6}}>
                      <span style={{color:"#3B82F6",flexShrink:0}}>&rarr;</span>{t}
                    </div>
                  ))}
                </div>
              )}

              {(memo.risk1||memo.risk2) && (
                <div>
                  <div style={{fontSize:9,color:"#8a4a4a",letterSpacing:2,marginBottom:10}}>KEY RISKS & MITIGANTS</div>
                  {[[memo.risk1,memo.risk1mit],[memo.risk2,memo.risk2mit],[memo.risk3,memo.risk3mit]].filter(([r])=>r).map(([r,m],i)=>(
                    <div key={i} style={{marginBottom:8,padding:"8px 12px",background:"#0f1d3d",borderRadius:3,border:"1px solid #1c2a4a"}}>
                      <div style={{fontSize:10,color:"#c87a7a",marginBottom:3}}>{r}</div>
                      {m&&<div style={{fontSize:10,color:"#666",lineHeight:1.6}}><span style={{color:"#5a8a6a"}}>Mitigant: </span>{m}</div>}
                    </div>
                  ))}
                </div>
              )}

              <div style={{marginTop:14,padding:"10px 14px",background:"#0f1d3d",border:"1px solid #5a8a6a33",borderRadius:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:9,color:"#5a8a6a",letterSpacing:2}}>IC RECOMMENDATION</div>
                <select value={memo.recommendation} onChange={e=>setM("recommendation",e.target.value)} style={{width:"auto",background:"transparent",border:"none",color:"#3B82F6",fontSize:14,letterSpacing:2}}>
                  <option value="INVEST">INVEST</option>
                  <option value="PASS">PASS</option>
                  <option value="FURTHER DILIGENCE">FURTHER DILIGENCE</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUIZ */}
      {tab==="quiz" && (
        <div style={{maxWidth:720}}>
          {!quizDone ? (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:2}}>QUESTION {quizIdx+1} OF {QUIZ.length}</div>
                <div style={{fontSize:10,color:"#3B82F6",letterSpacing:2}}>{quizScore} CORRECT</div>
              </div>
              <div style={{height:2,background:"#17305a",borderRadius:1,marginBottom:20}}>
                <div style={{height:"100%",width:`${((quizIdx)/QUIZ.length)*100}%`,background:"#3B82F6",borderRadius:1,transition:"width .3s"}} />
              </div>

              <div className="card" style={{padding:"22px 24px",marginBottom:12}}>
                <div style={{fontSize:11,color:"#ccc",lineHeight:1.8,marginBottom:20}}>{QUIZ[quizIdx].q}</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {QUIZ[quizIdx].opts.map((o,i)=>{
                    const isCorrect = i===QUIZ[quizIdx].correct;
                    const isSelected = quizSelected===i;
                    const bg = !quizRevealed?"#0f1d3d":isCorrect?"#5a8a6a22":isSelected?"#8a4a4a22":"#0f1d3d";
                    const border = !quizRevealed?"#1c2a4a":isCorrect?"#5a8a6a":isSelected?"#8a4a4a":"#1c2a4a";
                    const color = !quizRevealed?"#888":isCorrect?"#7aba8a":isSelected?"#c87a7a":"#555";
                    return (
                      <button key={i} onClick={()=>handleQuiz(i)} style={{background:bg,border:`1px solid ${border}`,borderRadius:4,padding:"12px 16px",textAlign:"left",fontSize:11,color,lineHeight:1.6,transition:"all .15s"}}>
                        <span style={{color:isCorrect&&quizRevealed?"#5a8a6a":isSelected&&quizRevealed?"#8a4a4a":"#444",marginRight:10,fontSize:9,letterSpacing:1}}>{String.fromCharCode(65+i)}.</span>
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>

              {quizRevealed && (
                <div className="card" style={{padding:"16px 20px",marginBottom:12,borderLeft:"3px solid #3B82F633"}}>
                  <div style={{fontSize:9,color:"#3B82F6",letterSpacing:2,marginBottom:8}}>IC INSIGHT</div>
                  <div style={{fontSize:11,color:"#888",lineHeight:1.8}}>{QUIZ[quizIdx].explain}</div>
                  <button onClick={nextQ} style={{marginTop:14,background:"#3B82F6",border:"none",color:"#0f1d3d",padding:"8px 22px",fontSize:10,letterSpacing:2,borderRadius:3}}>
                    {quizIdx<QUIZ.length-1?"NEXT QUESTION \u2192":"SEE RESULTS \u2192"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{padding:"32px",textAlign:"center"}}>
              <div style={{ fontSize:14,color:"#555",letterSpacing:4,marginBottom:12}}>IC ASSESSMENT</div>
              <div style={{ fontSize:64,color:"#3B82F6"}}>{quizScore}/{QUIZ.length}</div>
              <div style={{fontSize:13,color:"#888",marginTop:12,marginBottom:24}}>
                {quizScore===5?"IC approves. Deal moves to exclusivity.":quizScore>=3?"Solid — a few gaps, but you'd survive IC.":"More prep needed before you're in front of a real IC."}
              </div>
              <div style={{fontSize:10,color:"#444",letterSpacing:2,marginBottom:20}}>IC MODULES COMPLETED THIS SESSION</div>
              <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
                {["Anatomy","Returns","Red Flags","Builder"].map(m=>(
                  <span key={m} className="pill" style={{background:"#5a8a6a22",color:"#7aba8a",padding:"4px 12px"}}>{m}</span>
                ))}
              </div>
              <button onClick={()=>{setQuizDone(false);setQuizIdx(0);setQuizScore(0);setQuizSelected(null);setQuizRevealed(false);}} style={{marginTop:24,background:"transparent",border:"1px solid #1c2a4a",color:"#555",padding:"8px 22px",fontSize:10,letterSpacing:2,borderRadius:3}}>
                RETAKE
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
