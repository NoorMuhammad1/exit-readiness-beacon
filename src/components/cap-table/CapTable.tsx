import { useState } from "react";

const fmt = (n: string | number, decimals = 1) => {
  if (!n && n !== 0) return "\u2014";
  const v = parseFloat(String(n));
  if (isNaN(v)) return "\u2014";
  if (Math.abs(v) >= 1_000_000_000) return `${(v/1e9).toFixed(decimals)}B`;
  if (Math.abs(v) >= 1_000_000) return `${(v/1e6).toFixed(decimals)}M`;
  if (Math.abs(v) >= 1_000) return `${(v/1e3).toFixed(0)}K`;
  return `${v.toFixed(decimals)}`;
};
const fmtPct = (n: string | number, d=1) => isNaN(parseFloat(String(n))) ? "\u2014" : `${parseFloat(String(n)).toFixed(d)}%`;
const fmtX = (n: string | number, d=2) => isNaN(parseFloat(String(n))) ? "\u2014" : `${parseFloat(String(n)).toFixed(d)}x`;

const CONCEPTS = [
  {
    term: "Pre-Money Valuation",
    color: "#c8a84b",
    definition: "What the company is worth BEFORE new investment comes in. If a PE firm says 'we're investing at a $20M pre-money valuation,' the company is worth $20M before they write a check.",
    formula: "Pre-Money = Post-Money \u2212 New Investment",
    example: "Company valued at $20M pre-money. PE invests $5M. Post-money = $25M. PE owns 20% ($5M / $25M).",
    common_mistake: "Confusing pre-money and post-money. A $20M pre-money deal where $5M is invested is NOT the same as a $20M deal \u2014 the ownership percentages are different.",
    relevance: "Every cap table starts here. Get it wrong and every ownership percentage downstream is wrong."
  },
  {
    term: "Authorized vs. Issued Shares",
    color: "#5a8a9a",
    definition: "Authorized shares are the maximum the company can legally issue (set in charter). Issued shares are what's actually outstanding. The gap between them is unissued shares \u2014 reserved for future equity grants.",
    formula: "Fully Diluted Shares = Issued + Options + Warrants + Convertible Notes (converted)",
    example: "Company authorizes 10M shares. Issues 7M to founders. Reserves 1.5M for option pool. 1.5M remain unissued.",
    common_mistake: "Valuing ownership based on issued shares instead of fully diluted. Options that haven't vested still dilute you when they do.",
    relevance: "PE buyers underwrite on fully diluted share count. Any options, warrants, or convertibles that haven't been modeled = surprise dilution at close."
  },
  {
    term: "Option Pool",
    color: "#6a5a9a",
    definition: "Shares reserved for employee equity compensation \u2014 typically 10\u201320% of fully diluted shares in venture-backed companies, smaller in PE-backed businesses. Created from authorized but unissued shares.",
    formula: "Option Pool % = Reserved Shares / Fully Diluted Shares",
    example: "10M fully diluted shares. 1.2M reserved for options. Option pool = 12%. If all options vest and are exercised, existing shareholders dilute proportionally.",
    common_mistake: "Option pools are usually created pre-investment, which means existing shareholders (founders, early employees) bear the dilution \u2014 not new investors.",
    relevance: "In PE, management equity incentives (MIPs) serve the same function. Getting the MIP size right is the difference between aligned and misaligned management."
  },
  {
    term: "Liquidation Preference",
    color: "#8a4a4a",
    definition: "The right to get paid before common shareholders in a liquidation or exit. PE preferred shares typically have 1x non-participating liquidation preference \u2014 meaning PE gets their investment back first, then everyone shares pro-rata.",
    formula: "Preference Stack: Senior Secured Debt \u2192 Preferred Equity (LP) \u2192 Common Equity",
    example: "PE invests $10M with 1x non-participating preference. Exit at $8M: PE gets $8M, founders get $0. Exit at $25M: PE gets $10M first, then all share pro-rata on remaining $15M.",
    common_mistake: "Participating preferred (rare in PE, common in VC) means investors get their preference AND participate in the upside. This dramatically reduces founder proceeds in low-exit scenarios.",
    relevance: "Understanding the preference stack is essential for operators evaluating a PE offer. The headline valuation can be misleading if the preference terms are unfavorable."
  },
  {
    term: "Anti-Dilution",
    color: "#8a6a3a",
    definition: "Protection for investors if the company raises money at a lower valuation (a 'down round'). Adjusts the investor's conversion price downward so they receive more shares, maintaining their economic position.",
    formula: "Broad-based weighted average (most common) vs. Full ratchet (most investor-friendly)",
    example: "Series A investor bought at $2/share. Down round at $1/share triggers anti-dilution. Weighted average formula recalculates their conversion price \u2014 say to $1.60/share. They now convert into more shares.",
    common_mistake: "Full ratchet anti-dilution is extremely punitive to founders \u2014 it reprices all prior investor shares to the new lower price. It's rare but worth knowing if it's in a term sheet.",
    relevance: "In PE, anti-dilution shows up differently \u2014 primarily in rollover equity terms and management equity plan structures."
  },
  {
    term: "Waterfall Distribution",
    color: "#5a8a6a",
    definition: "The order in which exit proceeds flow to different equity holders. Determines who gets paid, how much, and in what sequence. Every cap table has a waterfall \u2014 knowing yours determines whether a given exit is good or bad for you.",
    formula: "Debt Repayment \u2192 Preferred Liquidation Preferences \u2192 Common Pro-Rata \u2192 Management Carve-outs",
    example: "$30M exit: $15M debt repaid first. $3M preferred LP returned. Remaining $12M split: PE 60% common ($7.2M) + Management 40% common ($4.8M) per pro-rata ownership.",
    common_mistake: "Ignoring debt in the waterfall. PE deals are leveraged \u2014 debt service comes before anyone sees equity proceeds. A deal that 'exits at $30M' may only generate $12M in equity value.",
    relevance: "The waterfall is the answer to 'what do I actually get?' Every operator with rollover equity should model their proceeds under 3 exit scenarios before they sign."
  },
  {
    term: "Management Equity Plan (MIP)",
    color: "#c8a84b",
    definition: "The equity incentive structure for management in a PE-backed company. Typically 5\u201315% of fully diluted equity, subject to vesting, with hurdle rates tied to investor returns.",
    formula: "MIP Value = (Exit Equity \u2212 Hurdle) \u00d7 MIP%",
    example: "Management owns 10% via MIP. PE needs 2x MOIC before MIP pays out. Exit at 2.5x: management earns their 10% on value above the 2x hurdle. Below 2x: MIP is worth zero.",
    common_mistake: "MIPs that look generous at headline (15%) but have hurdle rates set so high they rarely pay out. Always model your MIP under base, bull, and bear exit scenarios.",
    relevance: "If you're an operator taking rollover equity + MIP, the MIP design determines whether your equity is real compensation or aspirational paper."
  },
  {
    term: "Fully Diluted Capitalization",
    color: "#5a8a9a",
    definition: "Total share count assuming all options, warrants, convertible instruments, and unvested equity have been issued and converted. The denominator for all ownership percentage calculations in a real deal.",
    formula: "FD Shares = Common + Preferred (converted) + Options (vested + unvested) + Warrants + Convertible Notes",
    example: "10M common shares + 2M preferred converted + 1.5M options outstanding = 13.5M fully diluted. An investor owning 2M shares owns 14.8% FD, not 20% of common.",
    common_mistake: "Calculating ownership on issued-and-outstanding instead of fully diluted. Always use FD for any ownership representation in a deal.",
    relevance: "Every PE firm underwrites on fully diluted shares. Any undisclosed equity obligations (phantom equity, side letters, informal grants) discovered at close become a price adjustment."
  }
];

const QUIZ = [
  {
    q: "A PE firm offers to invest $8M in your company at a '$40M pre-money valuation.' After the investment closes, what percentage does the PE firm own?",
    opts: [
      "20% \u2014 $8M / $40M",
      "16.7% \u2014 $8M / $48M",
      "20% \u2014 because they paid $40M for the company",
      "Depends on the option pool size"
    ],
    correct: 1,
    explain: "Post-money valuation = $40M pre-money + $8M investment = $48M. PE ownership = $8M / $48M = 16.7%. The pre-money valuation is what the company is worth BEFORE the check. Always divide investment by post-money to get ownership %."
  },
  {
    q: "Your PE sponsor exits the company for $22M. You have 1x non-participating liquidation preference on $10M invested. Management owns 15% of common equity. How much does management receive?",
    opts: [
      "$3.3M \u2014 15% of $22M",
      "$1.8M \u2014 15% of ($22M \u2212 $10M)",
      "$0 \u2014 preference stack pays PE first, nothing left",
      "$3.3M minus the preference hurdle"
    ],
    correct: 1,
    explain: "1x non-participating preference: PE gets $10M first. Remaining $12M flows to common equity. Management owns 15% of common = 15% \u00d7 $12M = $1.8M. Non-participating means PE does NOT also participate in the remaining $12M \u2014 they took their preference and stepped aside."
  },
  {
    q: "You have a MIP with a 10% stake and a 2.0x MOIC hurdle. PE invested $12M. The company exits for $28M total equity value (after debt repayment). What is your MIP worth?",
    opts: [
      "$2.8M \u2014 10% of $28M",
      "$0.4M \u2014 10% of proceeds above the 2x hurdle",
      "$1.6M \u2014 10% of proceeds above the 1x preference",
      "$0 \u2014 the exit is below the 2x hurdle"
    ],
    correct: 1,
    explain: "2x MOIC hurdle on $12M invested = $24M threshold. Exit equity = $28M. Value above hurdle = $28M \u2212 $24M = $4M. MIP earns 10% \u00d7 $4M = $0.4M. The MIP only participates in value above the hurdle \u2014 everything below $24M belongs to PE first. Always model this math before agreeing to a hurdle rate."
  },
  {
    q: "A company has 8M common shares, an option pool of 1.2M shares, and a PE investor who just bought 2M preferred shares (converting 1:1). What is the PE investor's fully diluted ownership?",
    opts: [
      "20% \u2014 2M / 10M (common + preferred only)",
      "17.9% \u2014 2M / 11.2M (including option pool)",
      "25% \u2014 2M / 8M (common only)",
      "Depends on whether options are vested"
    ],
    correct: 1,
    explain: "Fully diluted = 8M common + 2M preferred converted + 1.2M options = 11.2M total. PE = 2M / 11.2M = 17.9%. Always include ALL options in the denominator regardless of vesting status \u2014 they will dilute you when they exercise. Calculating on common-only or ignoring the option pool overstates your ownership."
  },
  {
    q: "You're negotiating rollover equity. PE offers: (A) 12% of common equity, no hurdle. (B) 18% of common equity with a 1.75x MOIC hurdle on $10M invested. At what exit MOIC does Option B become more valuable than Option A?",
    opts: [
      "At any exit above 1.75x \u2014 B is always better once the hurdle clears",
      "At 4.25x MOIC and above",
      "At 5.25x MOIC and above",
      "B is never better \u2014 hurdles always destroy value"
    ],
    correct: 2,
    explain: "Set equal and solve: 0.12 \u00d7 E = 0.18 \u00d7 (E \u2212 1.75 \u00d7 I). Expanding: 0.12E = 0.18E \u2212 0.315I. Rearranging: 0.315I = 0.06E. Therefore E/I = 5.25x. Below 5.25x MOIC, Option A pays more. Above 5.25x, Option B pays more. Most PE holds target 2.5\u20133.5x \u2014 meaning Option A is typically worth more in base and bear cases. Always solve for the crossover before choosing."
  }
];

type TabType = "concepts" | "dilution" | "waterfall" | "quiz";

export default function CapTable() {
  const [tab, setTab] = useState<TabType>("concepts");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const [founders, setFounders] = useState("70");
  const [employees, setEmployees] = useState("10");
  const [optionPool, setOptionPool] = useState("10");
  const [peInvest, setPeInvest] = useState("8000000");
  const [preMoney, setPreMoney] = useState("40000000");
  const [mgmtMip, setMgmtMip] = useState("12");

  const [exitEV, setExitEV] = useState("35000000");
  const [debtAmt, setDebtAmt] = useState("15000000");
  const [peInvested, setPeInvested] = useState("10000000");
  const [peCommon, setPeCommon] = useState("60");
  const [mgmtCommon, setMgmtCommon] = useState("25");
  const [mipPct, setMipPct] = useState("15");
  const [lpMultiple, setLpMultiple] = useState("1");
  const [moicHurdle, setMoicHurdle] = useState("2.0");

  const postMoney = (parseFloat(preMoney) || 0) + (parseFloat(peInvest) || 0);
  const pePct = postMoney > 0 ? ((parseFloat(peInvest) || 0) / postMoney * 100) : 0;
  const existingPct = 100 - pePct;
  const foundersDiluted = (parseFloat(founders) || 0) / 100 * existingPct;
  const employeesDiluted = (parseFloat(employees) || 0) / 100 * existingPct;
  const optionsDiluted = (parseFloat(optionPool) || 0) / 100 * existingPct;
  const mipPctNum = parseFloat(mgmtMip) || 0;

  const ev = parseFloat(exitEV) || 0;
  const debt = parseFloat(debtAmt) || 0;
  const invested = parseFloat(peInvested) || 0;
  const lp = invested * (parseFloat(lpMultiple) || 1);
  const hurdle = invested * (parseFloat(moicHurdle) || 2);
  const afterDebt = Math.max(0, ev - debt);
  const afterLP = Math.max(0, afterDebt - lp);
  const mipHurdle = Math.max(0, ev - hurdle);
  const mipValue = (parseFloat(mipPct) || 0) / 100 * mipHurdle;
  const commonPool = Math.max(0, afterLP - mipValue);
  const peCommonPct = parseFloat(peCommon) || 0;
  const mgmtCommonPct = parseFloat(mgmtCommon) || 0;
  const peCommonProceeds = commonPool * peCommonPct / 100;
  const mgmtCommonProceeds = commonPool * mgmtCommonPct / 100;
  const peTotal = lp + peCommonProceeds;
  const peMOIC = invested > 0 ? (peTotal / invested).toFixed(2) : "\u2014";
  const mgmtTotal = mgmtCommonProceeds + mipValue;

  const handleQuiz = (i: number) => {
    if (quizRevealed) return;
    setQuizSelected(i);
    setQuizRevealed(true);
    if (i === QUIZ[quizIdx].correct) setQuizScore(s => s + 1);
  };
  const nextQ = () => {
    if (quizIdx < QUIZ.length - 1) { setQuizIdx(i => i + 1); setQuizSelected(null); setQuizRevealed(false); }
    else setQuizDone(true);
  };

  return (
    <div style={{background:"#07080f",minHeight:"100vh",fontFamily:"'IBM Plex Mono','Courier New',monospace",color:"#d8d4cc",padding:"24px 20px",maxWidth:1200,margin:"0 auto"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Anton&display=swap');
        button{cursor:pointer;font-family:inherit;}
        .tb{background:transparent;border:none;padding:9px 18px;font-size:10px;letter-spacing:2px;transition:all .2s;border-bottom:2px solid transparent;}
        .tb.on{color:#c8a84b;border-bottom-color:#c8a84b;}
        .tb:not(.on){color:#2a2838;}
        .tb:hover:not(.on){color:#555;}
        .card{background:#0a0b14;border:1px solid #181826;border-radius:5px;}
        input{background:#10111c;border:1px solid #1e1e2c;color:#ccc;font-family:inherit;font-size:11px;padding:7px 10px;border-radius:3px;width:100%;box-sizing:border-box;outline:none;transition:border-color .15s;}
        input:focus{border-color:#c8a84b;}
        .bar-row{display:flex;height:24px;border-radius:3px;overflow:hidden;gap:1px;margin-bottom:8px;}
        .bar-seg{display:flex;align-items:center;justify-content:center;font-size:8px;letter-spacing:1px;transition:width .4s;}
      `}</style>

      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:6}}>
          <div style={{fontFamily:"'Anton',sans-serif",fontSize:36,letterSpacing:6,color:"#c8a84b",lineHeight:1}}>CAP TABLE</div>
          <div style={{fontFamily:"'Anton',sans-serif",fontSize:36,letterSpacing:6,color:"#1e1e2c",lineHeight:1}}>MECHANICS</div>
          <div style={{fontSize:9,color:"#2a2838",letterSpacing:3,marginLeft:8}}>WAVE 3 &middot; EQUITY STRUCTURE</div>
        </div>
        <div style={{fontSize:11,color:"#333",lineHeight:1.7,maxWidth:640}}>
          The cap table is the legal record of who owns what. Every deal, every equity grant, every exit &mdash; it all flows through here. Understanding it isn't optional for operators with skin in the game.
        </div>
      </div>

      <div style={{borderBottom:"1px solid #12121e",marginBottom:20,display:"flex",flexWrap:"wrap"}}>
        {(["concepts","dilution","waterfall","quiz"] as TabType[]).map(t=>(
          <button key={t} className={`tb ${tab===t?"on":""}`} onClick={()=>setTab(t)}>{t.toUpperCase()}</button>
        ))}
      </div>

      {tab==="concepts" && (
        <div>
          <div style={{fontSize:10,color:"#555",marginBottom:16,letterSpacing:1}}>8 TERMS EVERY OPERATOR WITH EQUITY MUST KNOW COLD</div>
          {CONCEPTS.map((c, i) => (
            <div key={i} className="card" style={{marginBottom:8,borderLeft:`3px solid ${c.color}33`,overflow:"hidden"}}>
              <div onClick={()=>setExpanded(expanded===i?null:i)} style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",gap:16}}>
                  <div style={{fontFamily:"'Anton',sans-serif",fontSize:13,color:"#222",minWidth:24}}>{String(i+1).padStart(2,"0")}</div>
                  <div>
                    <div style={{fontFamily:"'Anton',sans-serif",fontSize:14,color:c.color,letterSpacing:2}}>{c.term.toUpperCase()}</div>
                    <div style={{fontSize:10,color:"#444",marginTop:2,maxWidth:560}}>{c.definition.substring(0,90)}...</div>
                  </div>
                </div>
                <span style={{color:"#333",fontSize:12,marginLeft:12,flexShrink:0}}>{expanded===i?"\u25B2":"\u25BC"}</span>
              </div>
              {expanded===i && (
                <div style={{padding:"0 18px 18px",borderTop:"1px solid #12121e"}}>
                  <div style={{fontSize:11,color:"#888",lineHeight:1.9,marginTop:14}}>{c.definition}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:16}}>
                    <div style={{background:"#07080f",border:`1px solid ${c.color}22`,borderRadius:4,padding:"12px 14px"}}>
                      <div style={{fontSize:9,color:c.color,letterSpacing:2,marginBottom:6}}>FORMULA</div>
                      <div style={{fontSize:10,color:"#888",lineHeight:1.7,fontFamily:"monospace"}}>{c.formula}</div>
                    </div>
                    <div style={{background:"#07080f",border:"1px solid #1e1e2c",borderRadius:4,padding:"12px 14px"}}>
                      <div style={{fontSize:9,color:"#5a8a6a",letterSpacing:2,marginBottom:6}}>EXAMPLE</div>
                      <div style={{fontSize:10,color:"#888",lineHeight:1.7}}>{c.example}</div>
                    </div>
                    <div style={{background:"#07080f",border:"1px solid #8a4a4a33",borderRadius:4,padding:"12px 14px"}}>
                      <div style={{fontSize:9,color:"#8a4a4a",letterSpacing:2,marginBottom:6}}>COMMON MISTAKE</div>
                      <div style={{fontSize:10,color:"#888",lineHeight:1.7}}>{c.common_mistake}</div>
                    </div>
                  </div>
                  <div style={{marginTop:12,padding:"10px 14px",background:"#07080f",border:`1px solid ${c.color}22`,borderRadius:4}}>
                    <div style={{fontSize:9,color:c.color,letterSpacing:2,marginBottom:4}}>WHY IT MATTERS IN PE</div>
                    <div style={{fontSize:10,color:"#666",lineHeight:1.7}}>{c.relevance}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab==="dilution" && (
        <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:16}}>
          <div>
            <div className="card" style={{padding:"18px 20px"}}>
              <div style={{fontFamily:"'Anton',sans-serif",fontSize:15,color:"#c8a84b",letterSpacing:3,marginBottom:16}}>PRE-INVESTMENT</div>
              {[
                {label:"Founder Ownership %",val:founders,set:setFounders,ph:"70"},
                {label:"Employee Common %",val:employees,set:setEmployees,ph:"10"},
                {label:"Option Pool %",val:optionPool,set:setOptionPool,ph:"10"},
              ].map(({label,val,set,ph})=>(
                <div key={label} style={{marginBottom:12}}>
                  <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:5}}>{label}</div>
                  <input type="text" value={val} onChange={e=>set(e.target.value)} placeholder={ph} />
                </div>
              ))}
              <div style={{fontSize:9,color:"#444",marginTop:4,marginBottom:16}}>Remaining {Math.max(0,100-(parseFloat(founders)||0)-(parseFloat(employees)||0)-(parseFloat(optionPool)||0)).toFixed(1)}% other/unallocated</div>
              <div style={{fontFamily:"'Anton',sans-serif",fontSize:15,color:"#5a8a9a",letterSpacing:3,marginBottom:16,paddingTop:16,borderTop:"1px solid #12121e"}}>PE INVESTMENT</div>
              {[
                {label:"PE Investment ($)",val:peInvest,set:setPeInvest,ph:"8000000"},
                {label:"Pre-Money Valuation ($)",val:preMoney,set:setPreMoney,ph:"40000000"},
                {label:"Management MIP %",val:mgmtMip,set:setMgmtMip,ph:"12"},
              ].map(({label,val,set,ph})=>(
                <div key={label} style={{marginBottom:12}}>
                  <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:5}}>{label}</div>
                  <input type="text" value={val} onChange={e=>set(e.target.value)} placeholder={ph} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="card" style={{padding:"18px 20px",marginBottom:12}}>
              <div style={{fontSize:9,color:"#c8a84b",letterSpacing:2,marginBottom:14}}>DEAL SUMMARY</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                {[
                  {label:"PRE-MONEY",val:fmt(preMoney)},
                  {label:"INVESTMENT",val:fmt(peInvest)},
                  {label:"POST-MONEY",val:fmt(postMoney)},
                  {label:"PE OWNERSHIP",val:fmtPct(pePct)},
                ].map(({label,val})=>(
                  <div key={label} style={{background:"#07080f",border:"1px solid #1e1e2c",borderRadius:4,padding:"12px 14px",textAlign:"center"}}>
                    <div style={{fontSize:8,color:"#555",letterSpacing:2,marginBottom:6}}>{label}</div>
                    <div style={{fontFamily:"'Anton',sans-serif",fontSize:20,color:"#c8a84b"}}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:10}}>OWNERSHIP &mdash; BEFORE vs. AFTER INVESTMENT</div>
              <div style={{fontSize:9,color:"#444",letterSpacing:1,marginBottom:4}}>BEFORE</div>
              <div className="bar-row">
                {[
                  {pct:parseFloat(founders)||0,color:"#c8a84b",label:"Founders"},
                  {pct:parseFloat(employees)||0,color:"#5a8a9a",label:"Employees"},
                  {pct:parseFloat(optionPool)||0,color:"#6a5a9a",label:"Options"},
                  {pct:Math.max(0,100-(parseFloat(founders)||0)-(parseFloat(employees)||0)-(parseFloat(optionPool)||0)),color:"#2a2838",label:"Other"},
                ].filter(s=>s.pct>0).map(s=>(
                  <div key={s.label} className="bar-seg" style={{width:`${s.pct}%`,background:s.color+"55",color:s.color,minWidth:s.pct>5?"30px":"0"}} title={`${s.label}: ${s.pct.toFixed(1)}%`}>
                    {s.pct>8?`${s.pct.toFixed(0)}%`:""}
                  </div>
                ))}
              </div>
              <div style={{fontSize:9,color:"#444",letterSpacing:1,marginBottom:4,marginTop:8}}>AFTER (FULLY DILUTED)</div>
              <div className="bar-row">
                {[
                  {pct:foundersDiluted,color:"#c8a84b",label:"Founders"},
                  {pct:employeesDiluted,color:"#5a8a9a",label:"Employees"},
                  {pct:optionsDiluted,color:"#6a5a9a",label:"Options"},
                  {pct:pePct,color:"#5a8a6a",label:"PE Sponsor"},
                  {pct:mipPctNum,color:"#8a6a3a",label:"MIP"},
                ].filter(s=>s.pct>0).map(s=>(
                  <div key={s.label} className="bar-seg" style={{width:`${s.pct}%`,background:s.color+"55",color:s.color,minWidth:s.pct>5?"30px":"0"}} title={`${s.label}: ${s.pct.toFixed(1)}%`}>
                    {s.pct>6?`${s.pct.toFixed(0)}%`:""}
                  </div>
                ))}
              </div>

              <table style={{width:"100%",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,borderCollapse:"collapse",marginTop:16}}>
                <thead>
                  <tr style={{borderBottom:"1px solid #1e1e2c"}}>
                    {["SHAREHOLDER","PRE %","POST % (FD)","DILUTION"].map(h=>(
                      <td key={h} style={{padding:"6px 8px",color:"#555",fontSize:8,letterSpacing:1}}>{h}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {name:"Founders",pre:parseFloat(founders)||0,post:foundersDiluted,color:"#c8a84b"},
                    {name:"Employees",pre:parseFloat(employees)||0,post:employeesDiluted,color:"#5a8a9a"},
                    {name:"Option Pool",pre:parseFloat(optionPool)||0,post:optionsDiluted,color:"#6a5a9a"},
                    {name:"PE Sponsor (new)",pre:0,post:pePct,color:"#5a8a6a"},
                    {name:"Mgmt MIP (new)",pre:0,post:mipPctNum,color:"#8a6a3a"},
                  ].map((r,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid #12121e"}}>
                      <td style={{padding:"8px 8px",color:r.color}}>{r.name}</td>
                      <td style={{padding:"8px 8px",color:"#888"}}>{fmtPct(r.pre)}</td>
                      <td style={{padding:"8px 8px",color:r.color,fontWeight:600}}>{fmtPct(r.post)}</td>
                      <td style={{padding:"8px 8px",color:r.post<r.pre?"#8a4a4a":"#5a8a6a"}}>
                        {r.pre>0?`${(r.post-r.pre).toFixed(1)}pp`:"\u2014"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card" style={{padding:"14px 18px",borderLeft:"3px solid #8a4a4a33"}}>
              <div style={{fontSize:9,color:"#8a4a4a",letterSpacing:2,marginBottom:8}}>THE DILUTION THAT SURPRISES OPERATORS</div>
              <div style={{fontSize:11,color:"#666",lineHeight:1.8}}>
                Option pools are almost always created BEFORE the investment closes. That means existing shareholders (founders, employees) bear 100% of the option pool dilution &mdash; before PE even invests. This is intentional: PE investors negotiate for the option pool to be in the pre-money cap table, not post-money.
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="waterfall" && (
        <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:16}}>
          <div className="card" style={{padding:"18px 20px",alignSelf:"start"}}>
            <div style={{fontFamily:"'Anton',sans-serif",fontSize:15,color:"#5a8a6a",letterSpacing:3,marginBottom:16}}>EXIT SCENARIO</div>
            {[
              {label:"Exit Enterprise Value ($)",val:exitEV,set:setExitEV,ph:"35000000"},
              {label:"Total Debt at Exit ($)",val:debtAmt,set:setDebtAmt,ph:"15000000"},
            ].map(({label,val,set,ph})=>(
              <div key={label} style={{marginBottom:12}}>
                <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:5}}>{label}</div>
                <input type="text" value={val} onChange={e=>set(e.target.value)} placeholder={ph} />
              </div>
            ))}
            <div style={{fontFamily:"'Anton',sans-serif",fontSize:15,color:"#c8a84b",letterSpacing:3,marginBottom:16,paddingTop:16,borderTop:"1px solid #12121e"}}>CAPITAL STRUCTURE</div>
            {[
              {label:"PE Investment ($)",val:peInvested,set:setPeInvested,ph:"10000000"},
              {label:"LP Preference Multiple (x)",val:lpMultiple,set:setLpMultiple,ph:"1"},
              {label:"MOIC Hurdle for MIP",val:moicHurdle,set:setMoicHurdle,ph:"2.0"},
              {label:"PE Common Equity %",val:peCommon,set:setPeCommon,ph:"60"},
              {label:"Mgmt Common Equity %",val:mgmtCommon,set:setMgmtCommon,ph:"25"},
              {label:"Mgmt MIP %",val:mipPct,set:setMipPct,ph:"15"},
            ].map(({label,val,set,ph})=>(
              <div key={label} style={{marginBottom:12}}>
                <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:5}}>{label}</div>
                <input type="text" value={val} onChange={e=>set(e.target.value)} placeholder={ph} />
              </div>
            ))}
          </div>

          <div>
            <div className="card" style={{padding:"18px 20px",marginBottom:12}}>
              <div style={{fontSize:9,color:"#5a8a6a",letterSpacing:2,marginBottom:16}}>DISTRIBUTION WATERFALL</div>
              {[
                {label:"01  EXIT ENTERPRISE VALUE",val:ev,color:"#5a8a9a",indent:0,desc:"Total proceeds from sale \u2014 what the buyer pays.",border:false},
                {label:"02  LESS: DEBT REPAYMENT",val:-debt,color:"#8a4a4a",indent:1,desc:"Senior secured debt paid first. No exceptions.",border:false},
                {label:"= EQUITY VALUE",val:afterDebt,color:"#888",indent:1,border:true,desc:"What's available for equity holders."},
                {label:"03  LESS: LIQUIDATION PREFERENCE",val:-lp,color:"#8a4a4a",indent:1,desc:`PE gets ${fmtX(lpMultiple)}x their investment (${fmt(invested)}) back first.`,border:false},
                {label:"= REMAINING EQUITY",val:afterLP,color:"#888",indent:1,border:true,desc:"Available for common shareholders + MIP."},
                {label:"04  LESS: MIP (above hurdle)",val:-mipValue,color:"#8a6a3a",indent:1,desc:`MIP earns ${fmtPct(mipPct)} on exit value above ${fmtX(moicHurdle)} hurdle (${fmt(hurdle)}).`,border:false},
                {label:"= COMMON POOL",val:commonPool,color:"#888",indent:1,border:true,desc:"Distributed pro-rata by common ownership %."},
                {label:"PE COMMON ("+fmtPct(peCommon)+")",val:peCommonProceeds,color:"#5a8a6a",indent:2,desc:"PE's share of common equity proceeds.",border:false},
                {label:"MGMT COMMON ("+fmtPct(mgmtCommon)+")",val:mgmtCommonProceeds,color:"#c8a84b",indent:2,desc:"Management's share of common equity.",border:false},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:r.border?12:6,paddingBottom:r.border?10:0,borderBottom:r.border?"1px solid #1e1e2c":"none",paddingLeft:r.indent*20}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:10,color:r.color,letterSpacing:r.indent===0?2:0.5,fontWeight:r.indent===1&&r.border?600:400}}>{r.label}</div>
                    <div style={{fontSize:9,color:"#333",marginTop:2,lineHeight:1.5}}>{r.desc}</div>
                  </div>
                  <div style={{fontFamily:"'Anton',sans-serif",fontSize:16,color:r.val<0?"#8a4a4a":r.color,textAlign:"right",minWidth:100}}>
                    {r.val<0?`(${fmt(Math.abs(r.val))})`:fmt(r.val)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <div className="card" style={{padding:"16px 18px",borderLeft:"3px solid #5a8a6a"}}>
                <div style={{fontSize:9,color:"#5a8a6a",letterSpacing:2,marginBottom:8}}>PE SPONSOR</div>
                <div style={{fontFamily:"'Anton',sans-serif",fontSize:26,color:"#5a8a6a"}}>{fmt(peTotal)}</div>
                <div style={{fontSize:10,color:"#555",marginTop:6}}>LP: {fmt(lp)} + Common: {fmt(peCommonProceeds)}</div>
                <div style={{fontSize:10,color:"#c8a84b",marginTop:4}}>MOIC: {peMOIC}x</div>
              </div>
              <div className="card" style={{padding:"16px 18px",borderLeft:"3px solid #c8a84b"}}>
                <div style={{fontSize:9,color:"#c8a84b",letterSpacing:2,marginBottom:8}}>MANAGEMENT TOTAL</div>
                <div style={{fontFamily:"'Anton',sans-serif",fontSize:26,color:"#c8a84b"}}>{fmt(mgmtTotal)}</div>
                <div style={{fontSize:10,color:"#555",marginTop:6}}>Common: {fmt(mgmtCommonProceeds)} + MIP: {fmt(mipValue)}</div>
                <div style={{fontSize:10,color:mipValue>0?"#5a8a6a":"#8a4a4a",marginTop:4}}>MIP {mipValue>0?"paid out":"below hurdle \u2014 $0"}</div>
              </div>
              <div className="card" style={{padding:"16px 18px",borderLeft:"3px solid #555"}}>
                <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:8}}>EQUITY POOL USED</div>
                <div style={{fontFamily:"'Anton',sans-serif",fontSize:26,color:"#888"}}>{fmt(afterDebt)}</div>
                <div style={{fontSize:10,color:"#555",marginTop:6}}>of {fmt(ev)} EV</div>
                <div style={{fontSize:10,color:debt/ev>0.6?"#8a4a4a":"#888",marginTop:4}}>Debt: {fmtPct(debt/ev*100)} of EV</div>
              </div>
            </div>

            <div className="card" style={{padding:"14px 18px",marginTop:12,borderLeft:"3px solid #8a4a4a33"}}>
              <div style={{fontSize:9,color:"#8a4a4a",letterSpacing:2,marginBottom:8}}>THE EXIT MATH OPERATORS GET WRONG</div>
              <div style={{fontSize:11,color:"#666",lineHeight:1.8}}>
                Debt is the invisible tax on PE returns. In a 55% LTV deal, over half the exit EV goes to debt repayment before equity holders see a dollar. Always model your proceeds starting with the debt balance at exit &mdash; not the headline EV.
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="quiz" && (
        <div style={{maxWidth:720}}>
          {!quizDone ? (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:2}}>QUESTION {quizIdx+1} OF {QUIZ.length}</div>
                <div style={{fontSize:10,color:"#c8a84b",letterSpacing:2}}>{quizScore} CORRECT</div>
              </div>
              <div style={{height:2,background:"#12121e",borderRadius:1,marginBottom:20}}>
                <div style={{height:"100%",width:`${quizIdx/QUIZ.length*100}%`,background:"#c8a84b",transition:"width .3s"}} />
              </div>
              <div className="card" style={{padding:"22px 24px",marginBottom:12}}>
                <div style={{fontSize:11,color:"#ccc",lineHeight:1.9,marginBottom:20}}>{QUIZ[quizIdx].q}</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {QUIZ[quizIdx].opts.map((o,i)=>{
                    const isCorrect=i===QUIZ[quizIdx].correct,isSelected=quizSelected===i;
                    const bg=!quizRevealed?"#07080f":isCorrect?"#5a8a6a22":isSelected?"#8a4a4a22":"#07080f";
                    const border=!quizRevealed?"#1e1e2c":isCorrect?"#5a8a6a":isSelected?"#8a4a4a":"#1e1e2c";
                    const color=!quizRevealed?"#888":isCorrect?"#7aba8a":isSelected?"#c87a7a":"#555";
                    return (
                      <button key={i} onClick={()=>handleQuiz(i)} style={{background:bg,border:`1px solid ${border}`,borderRadius:4,padding:"12px 16px",textAlign:"left",fontSize:11,color,lineHeight:1.6,transition:"all .15s"}}>
                        <span style={{color:isCorrect&&quizRevealed?"#5a8a6a":isSelected&&quizRevealed?"#8a4a4a":"#444",marginRight:10,fontSize:9,letterSpacing:1}}>{String.fromCharCode(65+i)}.</span>{o}
                      </button>
                    );
                  })}
                </div>
              </div>
              {quizRevealed&&(
                <div className="card" style={{padding:"16px 20px",borderLeft:"3px solid #c8a84b33"}}>
                  <div style={{fontSize:9,color:"#c8a84b",letterSpacing:2,marginBottom:8}}>CAP TABLE INSIGHT</div>
                  <div style={{fontSize:11,color:"#888",lineHeight:1.8}}>{QUIZ[quizIdx].explain}</div>
                  <button onClick={nextQ} style={{marginTop:14,background:"#c8a84b",border:"none",color:"#07080f",padding:"8px 22px",fontSize:10,letterSpacing:2,borderRadius:3}}>
                    {quizIdx<QUIZ.length-1?"NEXT \u2192":"RESULTS \u2192"}
                  </button>
                </div>
              )}
            </div>
          ):(
            <div className="card" style={{padding:"32px",textAlign:"center"}}>
              <div style={{fontFamily:"'Anton',sans-serif",fontSize:14,color:"#555",letterSpacing:4,marginBottom:12}}>CAP TABLE ASSESSMENT</div>
              <div style={{fontFamily:"'Anton',sans-serif",fontSize:64,color:"#c8a84b"}}>{quizScore}/{QUIZ.length}</div>
              <div style={{fontSize:13,color:"#888",marginTop:12,marginBottom:24}}>
                {quizScore===5?"Clean. You understand your equity.":quizScore>=3?"Solid foundation \u2014 review the questions you missed before you sign anything.":"Spend time on the waterfall and dilution tabs before your next deal."}
              </div>
              <button onClick={()=>{setQuizDone(false);setQuizIdx(0);setQuizScore(0);setQuizSelected(null);setQuizRevealed(false);}} style={{background:"transparent",border:"1px solid #1e1e2c",color:"#555",padding:"8px 22px",fontSize:10,letterSpacing:2,borderRadius:3}}>RETAKE</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
