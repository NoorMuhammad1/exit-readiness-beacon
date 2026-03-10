import { useState } from "react";

const PILLARS = [
  {
    id: "stabilize",
    label: "STABILIZE",
    days: "Days 1\u201330",
    color: "#3B82F6",
    headline: "Don\u2019t break what\u2019s working.",
    subhead: "The first 30 days are about listening, not changing. PE firms that move too fast in Month 1 lose key employees, spook customers, and create operational chaos that takes 12 months to unwind.",
    items: [
      { task: "All-hands employee communication \u2014 Day 1", critical: true, detail: "Before rumors start. Employees need to hear from new ownership within 24 hours of close. Message: what\u2019s changing (nothing operational), what isn\u2019t (their jobs, their benefits, their manager), and what the partnership means." },
      { task: "Customer communication \u2014 top 20 by revenue", critical: true, detail: "Personal outreach from the CEO + new ownership within 48 hours. Not a mass email. A call or personal note. Customers who feel forgotten during a transition look for alternatives." },
      { task: "Key employee retention conversations", critical: true, detail: "Identify the 5\u20138 people the business cannot run without. Have 1:1 conversations. Confirm retention agreements are signed. If they\u2019re not \u2014 sign them now." },
      { task: "Vendor and supplier notifications", critical: false, detail: "Notify key suppliers of ownership change. Confirm payment terms are unchanged. A supplier who hears about the sale from a third party pulls credit terms." },
      { task: "Banking and treasury transition", critical: true, detail: "New banking relationships, updated signatories, operating accounts. Cash management under new ownership. This is administrative \u2014 but a day-1 operational failure here shuts down payroll." },
      { task: "IT systems access audit", critical: false, detail: "Who has admin access to what? Critical systems inventory. Security audit. Identify single points of failure in technology. Week 1 is when IT disasters happen." },
      { task: "First financial close under new ownership", critical: true, detail: "Month 1 P&L reviewed against the model. Any revenue or cost surprises identified immediately \u2014 not at the 90-day board review." },
      { task: "Management team 1:1 assessments", critical: true, detail: "Structured conversations with every direct report. Not performance reviews \u2014 listening sessions. What\u2019s working, what\u2019s broken, what do they wish leadership knew?" },
    ]
  },
  {
    id: "assess",
    label: "ASSESS",
    days: "Days 31\u201360",
    color: "#5a8a9a",
    headline: "Find where the real business is.",
    subhead: "Month 2 is structured analysis. You have access now \u2014 use it. Every assumption in the IC memo gets pressure-tested against real operating data for the first time.",
    items: [
      { task: "Customer profitability analysis", critical: true, detail: "Revenue is not profit. Rank every customer by contribution margin. In most services businesses, the top 20% of customers generate 80%+ of profit. The bottom 20% often lose money." },
      { task: "Operational KPI baseline", critical: true, detail: "Establish month-1 baseline for every KPI in the value creation plan. You can\u2019t manage what you haven\u2019t measured. KPIs without baselines are aspirations, not plans." },
      { task: "Pricing analysis \u2014 realized vs. listed", critical: true, detail: "Compare what the company charges versus what it actually collects. Discounting patterns, price exceptions, customer-specific carve-outs. Most businesses leave 3\u20138% on the table here." },
      { task: "Sales pipeline and close rate audit", critical: false, detail: "Review 12 months of CRM data. What\u2019s the actual close rate vs. what management reported? Average sales cycle? Stalled deals? This tells you if the Year 1 revenue ramp is real." },
      { task: "Organizational design review", critical: false, detail: "Who reports to whom, and why? Where are the reporting bottlenecks? Where are roles undefined? Org design issues compound \u2014 fix them in Month 2, not Month 18." },
      { task: "Capex and maintenance spending audit", critical: false, detail: "What deferred maintenance is sitting in the business? Sellers routinely reduce capex in the 12\u201318 months pre-sale to improve EBITDA. The bill comes due in Year 1." },
      { task: "Finance function assessment", critical: true, detail: "Is the CFO/controller capable of the reporting requirements of a PE-backed company? Monthly close, variance analysis, board package. Many founder-led businesses have bookkeeping, not finance." },
      { task: "Technology gaps documented", critical: false, detail: "By Day 60, you should have a complete picture of technical debt, system limitations, and software upgrade needs \u2014 with rough cost estimates for each." },
    ]
  },
  {
    id: "accelerate",
    label: "ACCELERATE",
    days: "Days 61\u2013100",
    color: "#5a8a6a",
    headline: "Start the engine.",
    subhead: "Day 61 is when you start executing. Every initiative that requires capital, new hires, or operational change gets approved and activated in this window.",
    items: [
      { task: "First board meeting \u2014 100-day report", critical: true, detail: "Formal presentation to the board/IC with: financial performance vs. model, operational KPI baseline, key findings from assessment, and approved Year 1 priorities with owners and dates." },
      { task: "Year 1 budget approval", critical: true, detail: "Operating budget approved and distributed to department heads. Every team knows their numbers. Budget variances get tracked monthly starting Month 1." },
      { task: "Value creation initiative #1 activated", critical: true, detail: "The highest-conviction initiative from the IC memo gets a budget, an owner, and a launch date. No initiative that requires action in Year 1 should still be \u2018planning\u2019 at Day 100." },
      { task: "Add-on acquisition pipeline initiated", critical: false, detail: "If M&A is in the thesis, Day 61 is when outreach starts. LOI timelines mean a Day 61 start is a Q4/Q1 close at the earliest \u2014 there\u2019s no time to waste." },
      { task: "Management incentive plan finalized", critical: true, detail: "Management equity pool, vesting schedule, EBITDA hurdles. If the team isn\u2019t economically aligned to the value creation plan by Day 100, they won\u2019t execute it." },
      { task: "CFO upgrade decision made", critical: false, detail: "If the Month 2 finance assessment flagged capability gaps, Day 61\u2013100 is when the decision gets made and the search starts. A CFO search takes 60\u201390 days minimum." },
      { task: "Customer retention plan for flagged accounts", critical: true, detail: "Customers identified as at-risk during DD or Month 1\u20132 get a specific retention plan \u2014 pricing adjustment, contract extension, dedicated service resources." },
      { task: "100-day communication to all stakeholders", critical: true, detail: "Day 100 summary: what we found, what we committed to, what we\u2019ve done. Sent to employees, key customers, and the board. Sets the operating tempo for Year 1." },
    ]
  }
];

const VALUE_LEVERS = [
  { lever: "Revenue Growth", weight: 35, color: "#3B82F6", examples: ["New customer acquisition", "Price increases (3\u20138% typically untapped)", "Cross-sell to existing customers", "New geographies / verticals", "Add-on acquisitions"], icNote: "IC expected 12% EBITDA CAGR. Revenue growth is the primary driver \u2014 but it\u2019s the hardest to control. Nail the organic initiatives before betting on M&A growth." },
  { lever: "Margin Expansion", weight: 25, color: "#5a8a9a", examples: ["Procurement / vendor renegotiation", "Labor productivity improvement", "G&A leverage as revenue scales", "Customer profitability pruning", "Pricing discipline on new contracts"], icNote: "1 point of margin on $20M revenue = $200K EBITDA. Most PE firms find 2\u20134 margin points in the first 24 months through procurement and G&A \u2014 often without any revenue growth." },
  { lever: "M&A / Add-Ons", weight: 25, color: "#5a8a6a", examples: ["Tuck-in acquisitions at lower multiples", "Talent / capability acquisitions", "Geographic density plays", "Eliminating a competitor"], icNote: "The math: buy at 4x EBITDA, the platform trades at 8x. Every $500K of acquired EBITDA = $2M of platform value at exit. Add-ons are the most reliable return driver in lower middle market PE." },
  { lever: "Multiple Expansion", weight: 15, color: "#6a5a9a", examples: ["Scale to larger buyer universe", "Increase recurring revenue %", "Reduce customer concentration", "Build institutional-grade finance function", "Professionalize operations"], icNote: "Multiple expansion can\u2019t be the plan \u2014 it\u2019s the outcome of executing the other levers well. A platform at $20M EBITDA with 40% recurring revenue naturally attracts a different buyer (and multiple) than an $8M single-location business." },
];

const MISTAKES = [
  { mistake: "Moving too fast in Month 1", cost: "Key employee departures \u2014 avg. replacement cost 1.5\u20132x salary", fix: "First 30 days: listen, communicate, stabilize. No org changes. No cost cuts. No strategy pivots." },
  { mistake: "Ignoring the finance function upgrade", cost: "12\u201318 months of bad data. Decisions made on wrong numbers.", fix: "Assess finance capability in Month 2. If the CFO can\u2019t deliver monthly closes with variance analysis, start the search at Day 60." },
  { mistake: "Value creation plan has no owners", cost: "Initiatives drift. Year 2 review has the same initiatives as Year 1.", fix: "Every line item in the value creation plan has a name, a date, and a budget. No owners = no accountability." },
  { mistake: "Customer retention plan written, not executed", cost: "At-risk customers churn. Revenue miss in Year 1.", fix: "The customers you identified as at-risk during DD need a specific plan with a named relationship owner by Day 30. Not a plan to make a plan." },
  { mistake: "Add-on strategy with no relationship foundation", cost: "Year 2 closes with no acquisitions. Multiple expansion thesis unexecuted.", fix: "Outreach to add-on targets starts at Day 61. If you wait until Year 2 to start conversations, you\u2019re targeting a Year 3 close." },
  { mistake: "Management incentives misaligned to value creation plan", cost: "Management optimizes for comp, not for EBITDA growth.", fix: "Management equity hurdles must match IC exit assumptions. If IC expects 2.8x MOIC, management doesn\u2019t earn full carry until the business delivers that return." },
  { mistake: "Operator treats PE sponsor as silent capital", cost: "Sponsor disengagement. Missed board reporting. Loss of trust.", fix: "Monthly reporting to the board \u2014 not quarterly. Surprises kill PE relationships faster than underperformance." },
];

const KPIS = [
  { category: "Revenue", color: "#3B82F6", metrics: ["Monthly recurring revenue (MRR)", "Net revenue retention %", "Customer churn rate", "Average contract value (ACV)", "New logo acquisition rate", "Pipeline coverage ratio"] },
  { category: "Profitability", color: "#5a8a6a", metrics: ["EBITDA (monthly, vs. budget)", "Gross margin %", "EBITDA margin %", "Revenue per employee", "Contribution margin by customer", "Variance to model"] },
  { category: "Operational", color: "#5a8a9a", metrics: ["Capacity utilization %", "On-time delivery / fulfillment rate", "Cycle time / throughput", "Quality / defect rate", "Customer satisfaction (NPS)", "Employee turnover (voluntary)"] },
  { category: "M&A Pipeline", color: "#6a5a9a", metrics: ["Targets identified", "LOIs outstanding", "Deals in DD", "Deals closed YTD", "Avg. entry multiple on closes", "Incremental EBITDA acquired"] },
];

export default function HundredDayPlan() {
  const [tab, setTab] = useState("plan");
  const [activePillar, setActivePillar] = useState("stabilize");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [expandedLever, setExpandedLever] = useState<number | null>(null);
  const [expandedMistake, setExpandedMistake] = useState<number | null>(null);

  const toggle = (k: string) => setChecked(c => ({...c, [k]: !c[k]}));
  const pillarProgress = (id: string) => {
    const p = PILLARS.find(x => x.id === id)!;
    const done = p.items.filter((_, i) => checked[`${id}-${i}`]).length;
    return { done, total: p.items.length, pct: Math.round(done / p.items.length * 100) };
  };
  const totalProg = () => {
    const total = PILLARS.reduce((a, p) => a + p.items.length, 0);
    const done = PILLARS.reduce((a, p) => a + p.items.filter((_, i) => checked[`${p.id}-${i}`]).length, 0);
    return { done, total, pct: Math.round(done / total * 100) };
  };
  const prog = totalProg();
  const pillar = PILLARS.find(p => p.id === activePillar)!;

  return (
    <div style={{background:"#0f1d3d",minHeight:"100vh",color:"#e5e7eb",padding:"24px 20px",maxWidth:1200,margin:"0 auto"}}>
      <style>{`

        button{cursor:pointer;font-family:inherit;}
        .tb{background:transparent;border:none;padding:9px 18px;font-size:10px;letter-spacing:2px;transition:all .2s;border-bottom:2px solid transparent;}
        .tb.on{color:#3B82F6;border-bottom-color:#3B82F6;}
        .tb:not(.on){color:#2a2838;}
        .tb:hover:not(.on){color:#555;}
        .card{background:#0f1d3d;border:1px solid #1c2a4a;border-radius:5px;}
        .chk{width:16px;height:16px;border:1px solid #2a2838;border-radius:2px;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
        .chk.done{background:#5a8a6a;border-color:#5a8a6a;}
        .pill{display:inline-block;padding:2px 8px;border-radius:2px;font-size:8px;letter-spacing:2px;}
      `}</style>

      {/* Header */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:6}}>
          <div style={{ fontSize:36,letterSpacing:6,color:"#3B82F6",lineHeight:1}}>100-DAY</div>
          <div style={{ fontSize:36,letterSpacing:6,color:"#1c2a4a",lineHeight:1}}>PLAN</div>
          <div style={{fontSize:9,color:"#2a2838",letterSpacing:3,marginLeft:8}}>WAVE 3 &middot; POST-CLOSE OPERATIONS</div>
        </div>
        <div style={{fontSize:11,color:"#333",lineHeight:1.7,maxWidth:640,marginBottom:14}}>
          The deal closed. The wire cleared. Now the real work starts. The first 100 days determine whether the value creation plan executes &mdash; or whether the next 5 years are spent recovering from a bad start.
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{flex:1,maxWidth:400,height:3,background:"#1a1a26",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${prog.pct}%`,background:"linear-gradient(90deg,#3B82F6,#8a6a3a)",borderRadius:2,transition:"width .4s"}} />
          </div>
          <div style={{fontSize:10,color:prog.pct>70?"#3B82F6":"#555",letterSpacing:1}}>{prog.done}/{prog.total} TASKS COMPLETE</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{borderBottom:"1px solid #17305a",marginBottom:20,display:"flex",flexWrap:"wrap"}}>
        {["plan","value levers","mistakes","kpis"].map(t=>(
          <button key={t} className={`tb ${tab===t?"on":""}`} onClick={()=>setTab(t)}>{t.toUpperCase()}</button>
        ))}
      </div>

      {/* PLAN */}
      {tab==="plan" && (
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16}}>
          {/* Pillar nav */}
          <div>
            {PILLARS.map(p => {
              const pr = pillarProgress(p.id);
              const active = activePillar === p.id;
              return (
                <div key={p.id} onClick={()=>setActivePillar(p.id)} style={{padding:"12px 14px",marginBottom:8,borderRadius:4,cursor:"pointer",border:`1px solid ${active?p.color+"55":"#1c2a4a"}`,background:active?p.color+"0e":"#0f1d3d",borderLeft:`3px solid ${active?p.color:p.color+"33"}`,transition:"all .15s"}}>
                  <div style={{ fontSize:13,color:active?p.color:"#444",letterSpacing:2}}>{p.label}</div>
                  <div style={{fontSize:9,color:active?p.color+"aa":"#333",marginTop:3}}>{p.days}</div>
                  <div style={{fontSize:9,color:"#333",marginTop:6,display:"flex",justifyContent:"space-between"}}>
                    <span style={{color:pr.pct===100?"#5a8a6a":pr.pct>0?"#888":"#333"}}>{pr.done}/{pr.total} done</span>
                  </div>
                  <div style={{height:2,background:"#17305a",borderRadius:1,marginTop:5,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pr.pct}%`,background:p.color,borderRadius:1,transition:"width .3s"}} />
                  </div>
                </div>
              );
            })}

            {/* Day counter visual */}
            <div style={{marginTop:16,padding:"14px",background:"#0f1d3d",border:"1px solid #1c2a4a",borderRadius:4}}>
              <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:10}}>100-DAY CLOCK</div>
              {[{label:"STABILIZE",days:30,color:"#3B82F6"},{label:"ASSESS",days:30,color:"#5a8a9a"},{label:"ACCELERATE",days:40,color:"#5a8a6a"}].map(s=>(
                <div key={s.label} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:"#444",marginBottom:3}}>
                    <span style={{color:s.color}}>{s.label}</span>
                    <span>{s.days} DAYS</span>
                  </div>
                  <div style={{height:6,background:"#17305a",borderRadius:1,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${s.days}%`,background:s.color+"55",borderRadius:1}} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pillar detail */}
          <div>
            <div className="card" style={{padding:"18px 22px",marginBottom:12,borderLeft:`3px solid ${pillar.color}`}}>
              <div style={{ fontSize:20,color:pillar.color,letterSpacing:3}}>{pillar.label} &mdash; {pillar.days}</div>
              <div style={{fontSize:13,color:"#ccc",marginTop:8,marginBottom:6,fontStyle:"italic"}}>{pillar.headline}</div>
              <div style={{fontSize:11,color:"#555",lineHeight:1.8,borderTop:"1px solid #17305a",paddingTop:10,marginTop:10}}>{pillar.subhead}</div>
            </div>

            {pillar.items.map((item, i) => {
              const key = `${pillar.id}-${i}`;
              const done = !!checked[key];
              const open = expanded === key;
              return (
                <div key={i} className="card" style={{marginBottom:6,borderLeft:`3px solid ${item.critical?pillar.color+"33":"#1c2a4a"}`,opacity:done?0.55:1,transition:"opacity .2s"}}>
                  <div style={{padding:"12px 16px",display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div className={`chk ${done?"done":""}`} onClick={()=>toggle(key)}>
                      {done&&<span style={{color:"#fff",fontSize:10}}>&#10003;</span>}
                    </div>
                    <div style={{flex:1,cursor:"pointer"}} onClick={()=>setExpanded(open?null:key)}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{fontSize:11,color:done?"#444":"#ccc",textDecoration:done?"line-through":"none",lineHeight:1.5}}>
                          {item.task}
                          {item.critical&&<span className="pill" style={{background:pillar.color+"22",color:pillar.color,marginLeft:8}}>CRITICAL</span>}
                        </div>
                        <span style={{color:"#333",fontSize:11,marginLeft:12}}>{open?"\u25B2":"\u25BC"}</span>
                      </div>
                      {open&&<div style={{fontSize:10,color:"#666",lineHeight:1.8,marginTop:8,paddingTop:8,borderTop:"1px solid #17305a"}}>{item.detail}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VALUE LEVERS */}
      {tab==="value levers" && (
        <div>
          <div style={{fontSize:11,color:"#555",lineHeight:1.7,marginBottom:20,maxWidth:640}}>
            PE returns come from four levers. Most deals that miss projections mis-weighted them at underwriting &mdash; betting on levers that are harder to pull than they appear.
          </div>

          {/* Weight bar */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:8}}>WHERE RETURNS COME FROM &mdash; TYPICAL LOWER MIDDLE MARKET PE</div>
            <div style={{display:"flex",height:28,borderRadius:3,overflow:"hidden",gap:1}}>
              {VALUE_LEVERS.map(v=>(
                <div key={v.lever} style={{width:`${v.weight}%`,background:v.color+"33",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:8,color:v.color,letterSpacing:1,whiteSpace:"nowrap"}}>{v.weight}%</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:16,marginTop:6,flexWrap:"wrap"}}>
              {VALUE_LEVERS.map(v=>(
                <div key={v.lever} style={{display:"flex",gap:6,alignItems:"center"}}>
                  <div style={{width:8,height:8,borderRadius:1,background:v.color}} />
                  <span style={{fontSize:9,color:"#555"}}>{v.lever}</span>
                </div>
              ))}
            </div>
          </div>

          {VALUE_LEVERS.map((v, i) => (
            <div key={i} className="card" style={{marginBottom:8,borderLeft:`3px solid ${v.color}33`,overflow:"hidden"}}>
              <div onClick={()=>setExpandedLever(expandedLever===i?null:i)} style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",gap:16}}>
                  <div style={{ fontSize:26,color:v.color}}>{v.weight}%</div>
                  <div>
                    <div style={{ fontSize:15,color:v.color,letterSpacing:2}}>{v.lever.toUpperCase()}</div>
                    <div style={{fontSize:10,color:"#444",marginTop:2}}>{v.examples.slice(0,2).join(" \u00b7 ")}</div>
                  </div>
                </div>
                <span style={{color:"#333",fontSize:12}}>{expandedLever===i?"\u25B2":"\u25BC"}</span>
              </div>
              {expandedLever===i && (
                <div style={{padding:"0 20px 18px",borderTop:"1px solid #17305a"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:14}}>
                    <div>
                      <div style={{fontSize:9,color:v.color,letterSpacing:2,marginBottom:10}}>SPECIFIC INITIATIVES</div>
                      {v.examples.map((e,j)=>(
                        <div key={j} style={{display:"flex",gap:8,marginBottom:7,fontSize:11,color:"#777",lineHeight:1.5}}>
                          <span style={{color:v.color,flexShrink:0}}>&rarr;</span>{e}
                        </div>
                      ))}
                    </div>
                    <div style={{background:"#0f1d3d",border:`1px solid ${v.color}22`,borderRadius:4,padding:"14px 16px"}}>
                      <div style={{fontSize:9,color:v.color,letterSpacing:2,marginBottom:8}}>IC READS THIS LEVER AS</div>
                      <div style={{fontSize:11,color:"#777",lineHeight:1.8}}>{v.icNote}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="card" style={{padding:"16px 20px",marginTop:8,borderLeft:"3px solid #8a4a4a33"}}>
            <div style={{fontSize:9,color:"#8a4a4a",letterSpacing:2,marginBottom:8}}>THE MISTAKE MOST OPERATORS MAKE</div>
            <div style={{fontSize:11,color:"#666",lineHeight:1.8}}>
              Underwriting the deal on 35% revenue growth and 15% multiple expansion, then being surprised when neither happens on schedule. The most reliable lever in lower middle market PE is margin expansion through procurement, G&amp;A leverage, and pricing discipline &mdash; none of which require the market to cooperate.
            </div>
          </div>
        </div>
      )}

      {/* MISTAKES */}
      {tab==="mistakes" && (
        <div>
          <div style={{fontSize:11,color:"#555",lineHeight:1.7,marginBottom:20,maxWidth:640}}>
            Seven documented patterns that turn good deals into problem deals. Most are avoidable. All of them look obvious in hindsight.
          </div>
          {MISTAKES.map((m, i) => (
            <div key={i} className="card" style={{marginBottom:8,overflow:"hidden",borderLeft:"3px solid #8a4a4a33"}}>
              <div onClick={()=>setExpandedMistake(expandedMistake===i?null:i)} style={{padding:"14px 18px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
                    <div style={{ fontSize:13,color:"#888",letterSpacing:1}}>{String(i+1).padStart(2,"0")}</div>
                    <div style={{ fontSize:13,color:"#c87a7a",letterSpacing:1}}>{m.mistake.toUpperCase()}</div>
                  </div>
                  <div style={{fontSize:10,color:"#555",lineHeight:1.6}}>{m.cost}</div>
                </div>
                <span style={{color:"#333",fontSize:12,marginLeft:12,flexShrink:0}}>{expandedMistake===i?"\u25B2":"\u25BC"}</span>
              </div>
              {expandedMistake===i && (
                <div style={{padding:"0 18px 16px",borderTop:"1px solid #17305a"}}>
                  <div style={{marginTop:12,padding:"12px 14px",background:"#0f1d3d",border:"1px solid #5a8a6a33",borderRadius:4}}>
                    <div style={{fontSize:9,color:"#5a8a6a",letterSpacing:2,marginBottom:6}}>THE FIX</div>
                    <div style={{fontSize:11,color:"#777",lineHeight:1.7}}>{m.fix}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* KPIs */}
      {tab==="kpis" && (
        <div>
          <div style={{fontSize:11,color:"#555",lineHeight:1.7,marginBottom:20,maxWidth:640}}>
            KPIs that belong in every monthly board package for a PE-backed business. Establish baselines in Month 1&ndash;2. Anything not tracked by Day 60 won&rsquo;t be tracked until someone asks at a board meeting &mdash; which is too late.
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {KPIS.map((k, i) => (
              <div key={i} className="card" style={{padding:"18px 20px",borderLeft:`3px solid ${k.color}33`}}>
                <div style={{ fontSize:14,color:k.color,letterSpacing:3,marginBottom:14}}>{k.category.toUpperCase()}</div>
                {k.metrics.map((m, j) => (
                  <div key={j} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:k.color+"66",flexShrink:0,marginTop:4}} />
                    <div style={{fontSize:11,color:"#777",lineHeight:1.5}}>{m}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="card" style={{marginTop:12,padding:"16px 20px",borderLeft:"3px solid #3B82F633"}}>
            <div style={{fontSize:9,color:"#3B82F6",letterSpacing:2,marginBottom:10}}>BOARD REPORTING CADENCE</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,fontSize:10,color:"#666",lineHeight:1.8}}>
              <div><div style={{color:"#3B82F6",marginBottom:4,fontSize:9,letterSpacing:1}}>MONTHLY</div>P&amp;L vs. budget &middot; EBITDA &middot; Revenue by segment &middot; Cash position &middot; Variance explanation &middot; Top 3 priorities for next month</div>
              <div><div style={{color:"#5a8a9a",marginBottom:4,fontSize:9,letterSpacing:1}}>QUARTERLY</div>Full KPI dashboard &middot; Value creation plan progress &middot; M&amp;A pipeline update &middot; Talent / org changes &middot; 90-day forward look</div>
              <div><div style={{color:"#5a8a6a",marginBottom:4,fontSize:9,letterSpacing:1}}>ANNUALLY</div>Annual plan and budget &middot; Strategic review &middot; Exit readiness assessment &middot; Management incentive review &middot; Board composition review</div>
            </div>
          </div>

          <div className="card" style={{marginTop:12,padding:"16px 20px",borderLeft:"3px solid #8a4a4a33"}}>
            <div style={{fontSize:9,color:"#8a4a4a",letterSpacing:2,marginBottom:8}}>THE KPI THAT PREDICTS EVERYTHING ELSE</div>
            <div style={{fontSize:11,color:"#666",lineHeight:1.8}}>
              Net revenue retention. If existing customers are growing their spend with you, everything else gets easier &mdash; sales, margin, multiple. If NRR is below 100%, you&rsquo;re on a treadmill: replacing churned revenue before you can grow. Track it monthly. If it drops below 90%, it&rsquo;s the #1 board agenda item until it&rsquo;s fixed.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
