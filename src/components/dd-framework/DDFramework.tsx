import { useState } from "react";

const WORKSTREAMS = [
  {
    id: "financial",
    label: "FINANCIAL DD",
    color: "#3B82F6",
    owner: "PE Deal Team + QoE Firm",
    timing: "Weeks 1\u20134",
    purpose: "Verify the EBITDA you\u2019re buying is real and recurring. Every number in the IC memo gets pressure-tested here.",
    items: [
      { item: "Quality of Earnings report (QoE)", critical: true, detail: "The most important document in DD. Third-party accounting firm reconstructs EBITDA from scratch \u2014 adds back non-recurring items, removes owner perks, normalizes anomalies. If QoE EBITDA differs from stated EBITDA by >5%, the deal gets repriced or dies." },
      { item: "3 years audited financial statements", critical: true, detail: "Audited preferred. Reviewed acceptable for companies under $10M EBITDA. Compiled statements are a red flag \u2014 means no CPA oversight." },
      { item: "LTM P&L and monthly revenue bridge", critical: true, detail: "Month-by-month revenue for trailing 12 months. You\u2019re looking for seasonality, concentration, any revenue pulled forward before close." },
      { item: "Working capital analysis and peg", critical: true, detail: "Determines how much cash stays in the business at close. Wrong peg = immediate clawback or shortfall. Typically set at 12-month average." },
      { item: "Customer-level revenue analysis (top 20)", critical: true, detail: "Revenue by customer for 3 years. You need to see churn, growth, and concentration. One customer at >15% of revenue is a red flag that needs a mitigation plan." },
      { item: "Accounts receivable aging schedule", critical: false, detail: "Receivables over 90 days indicate collection problems. High DSO versus industry average signals revenue recognition issues." },
      { item: "Capex history and maintenance vs. growth split", critical: false, detail: "Is capex in the model maintenance (required to sustain business) or growth (optional)? Maintenance capex reduces true free cash flow." },
      { item: "Debt schedule and all liabilities", critical: true, detail: "Every debt obligation, lease, contingent liability, and off-balance-sheet item. Surprises here become price adjustments at close." },
      { item: "Tax returns (3 years federal + state)", critical: false, detail: "Cross-checked against financials. Discrepancies between book and tax suggest income shifting, fraud, or aggressive accounting." },
      { item: "Management accounts (monthly, YTD)", critical: false, detail: "How management actually tracks the business. Tells you if there\u2019s financial discipline \u2014 or if the owner runs it from a checkbook." },
    ]
  },
  {
    id: "commercial",
    label: "COMMERCIAL DD",
    color: "#5a8a9a",
    owner: "PE Deal Team \u00b1 Strategy Consultant",
    timing: "Weeks 2\u20135",
    purpose: "Validate the market, competitive position, and growth thesis. IC approved based on projections \u2014 commercial DD tests whether those projections are achievable.",
    items: [
      { item: "Customer interviews (8\u201312 minimum)", critical: true, detail: "Call the top customers. Ask why they buy, what they\u2019d do if the company disappeared, and whether they\u2019d pay more. Answers often contradict what management told you in the CIM." },
      { item: "Competitive landscape analysis", critical: true, detail: "Name every competitor, their size, and their pricing. Understand switching costs. If a customer can move in 30 days, you have less pricing power than the seller claims." },
      { item: "Market size and growth rate verification", critical: false, detail: "Third-party data backing the TAM/CAGR in the CIM. If the seller cited a $12B market in a 2019 report, find current data." },
      { item: "Pricing analysis and history", critical: true, detail: "Has the company raised prices? Did customers stay? Pricing power is the single best indicator of competitive moat \u2014 and it\u2019s almost always understated in CIMs." },
      { item: "Win/loss analysis", critical: false, detail: "Why do they win deals? Why do they lose? Lost deals often tell you more about competitive position than won ones." },
      { item: "Sales pipeline and conversion data", critical: false, detail: "CRM data for the last 24 months. Close rates, average sales cycle, average deal size. This tells you if the revenue forecast is achievable." },
      { item: "Customer contract review (top 10)", critical: true, detail: "Are contracts evergreen, auto-renewing, or term-based? Can customers cancel on 30 days\u2019 notice? What are the change-of-control provisions?" },
      { item: "NPS / customer satisfaction data", critical: false, detail: "If the company has NPS data, it\u2019s gold. If they don\u2019t track it, ask why \u2014 and consider commissioning a survey." },
      { item: "Revenue cohort analysis", critical: true, detail: "Track revenue by customer vintage. Are 2020 customers still growing? Or is the business replacing churned revenue with new logos? Net revenue retention tells you more than gross revenue." },
    ]
  },
  {
    id: "legal",
    label: "LEGAL DD",
    color: "#6a5a9a",
    owner: "M&A Counsel",
    timing: "Weeks 2\u20136",
    purpose: "Find liabilities that don\u2019t show up in the financials. Legal DD protects you from buying someone else\u2019s problem.",
    items: [
      { item: "Corporate structure and cap table", critical: true, detail: "Who owns what, at what basis, with what rights. Verify the seller actually owns what they\u2019re selling. Cap table errors at close are deal-killers." },
      { item: "All material contracts review", critical: true, detail: "Customer contracts, vendor agreements, leases, licenses, partnerships. Focus on change-of-control provisions \u2014 does the contract terminate if ownership changes?" },
      { item: "Litigation history and pending claims", critical: true, detail: "PACER search plus seller disclosure. One undisclosed lawsuit that surfaces post-close becomes a rep breach \u2014 but you still own the company." },
      { item: "IP ownership and registrations", critical: true, detail: "Patents, trademarks, software licenses, trade secrets. Confirm the company \u2014 not a founder personally \u2014 owns the IP. This kills deals in software and branded businesses." },
      { item: "Employment agreements and non-competes", critical: true, detail: "Key employee agreements, non-solicitation clauses, and non-competes. If the CEO can leave Day 1 and compete, the business may not be worth what you paid." },
      { item: "Environmental compliance", critical: false, detail: "Relevant for industrial, manufacturing, real estate. Phase 1 environmental assessment required. Phase 2 if Phase 1 finds concerns." },
      { item: "Insurance policies review", critical: false, detail: "Coverage types, limits, exclusions, claims history. W&I insurance (reps & warranties) is increasingly standard in middle-market PE." },
      { item: "Regulatory and licensing compliance", critical: true, detail: "All licenses the company needs to operate. Confirm they\u2019re transferable or re-issuable. A non-transferable license that expires at close = broken business." },
      { item: "Data privacy and cybersecurity compliance", critical: false, detail: "GDPR, CCPA, HIPAA depending on sector. Data breaches not disclosed by seller are a rep breach \u2014 but remediation costs land on you." },
      { item: "Related party transactions", critical: true, detail: "Any transaction between the company and the owner\u2019s other entities. These inflate revenue or suppress costs and need to be unwound at close." },
    ]
  },
  {
    id: "management",
    label: "MANAGEMENT DD",
    color: "#8a6a3a",
    owner: "PE Deal Team \u00b1 Executive Search Firm",
    timing: "Weeks 1\u20134",
    purpose: "Determine if the team can execute the value creation plan. The best thesis fails with the wrong operator.",
    items: [
      { item: "CEO deep-dive (2\u20133 sessions minimum)", critical: true, detail: "Not a pitch meeting \u2014 a structured assessment. You\u2019re testing decision-making process, self-awareness about weaknesses, and willingness to accept a partner. One session is never enough." },
      { item: "Reference checks (5\u20138 per key executive)", critical: true, detail: "Call people not on the list the CEO gave you. LinkedIn second-degree connections are better than provided references. Ask about worst-case situations, not best-case." },
      { item: "Org chart and bench strength review", critical: true, detail: "Who are the 3\u20135 people below the CEO who actually run the business day-to-day? If they leave, does the business run? If not, you have key person concentration below the CEO." },
      { item: "Management incentive structure", critical: true, detail: "Current comp vs. market. Rollover equity terms. Vesting schedule. Carve-out plan. If the team isn\u2019t economically aligned with the value creation plan, the plan won\u2019t execute." },
      { item: "Prior employer background checks", critical: false, detail: "Standard for any executive with access to capital. Surfaced issues \u2014 especially financial or integrity-related \u2014 are always deal-relevant." },
      { item: "Management presentation Q&A session", critical: true, detail: "Formal session where the deal team stress-tests the financial model with management in the room. How they handle tough questions tells you as much as their answers." },
      { item: "Culture and retention risk assessment", critical: false, detail: "Interview 5\u201310 non-executive employees. High voluntary turnover in the 12 months pre-close is almost always a bad sign." },
      { item: "Succession plan for key roles", critical: false, detail: "What happens if the CFO leaves in Year 1? If there\u2019s no answer, it\u2019s an open risk that belongs in the IC memo." },
    ]
  },
  {
    id: "operational",
    label: "OPERATIONAL DD",
    color: "#5a8a6a",
    owner: "Operations Partner + Operating Advisors",
    timing: "Weeks 3\u20136",
    purpose: "Understand how the business actually runs \u2014 and where the value creation levers actually are versus what the seller says.",
    items: [
      { item: "Site visits (all major locations)", critical: true, detail: "You cannot underwrite a physical business from a data room. See the facility, meet the floor team, observe the operation. What you see in 2 hours often changes the deal thesis." },
      { item: "Operational KPI review (12\u201324 months)", critical: true, detail: "Utilization rates, cycle times, throughput, on-time delivery, quality metrics. These are the leading indicators \u2014 revenue and EBITDA are lagging." },
      { item: "Technology stack and systems review", critical: true, detail: "What systems run the business (ERP, CRM, billing)? Are they owned or licensed? What\u2019s the technical debt? A business running on spreadsheets has hidden OpEx in the value creation plan." },
      { item: "Supply chain and vendor concentration", critical: false, detail: "Top 5 vendors by spend. Any single-source suppliers? Vendor concentration is a supply chain risk that rarely shows up in financial DD." },
      { item: "Capacity analysis", critical: false, detail: "Can the business grow 30% without a new facility or major capex? If not, the growth plan has an unmodeled cost. Flag it in the IC memo or price it in." },
      { item: "Process documentation review", critical: false, detail: "Are core processes documented or locked in employee heads? Undocumented processes create key person risk at the operational level, not just executive level." },
      { item: "IT security and data infrastructure", critical: false, detail: "Increasing importance post-2020. A ransomware incident 6 months post-close that predates your ownership still lands on you operationally." },
    ]
  },
  {
    id: "hr",
    label: "HR & BENEFITS DD",
    color: "#8a4a6a",
    owner: "HR Advisor + M&A Counsel",
    timing: "Weeks 3\u20135",
    purpose: "Benefits liabilities, union exposure, classification issues, and deferred comp obligations that land on you at close.",
    items: [
      { item: "Employee census and compensation review", critical: true, detail: "All employees, titles, salaries, tenure. Identify overpays/underpays versus market. Surprises here affect Year 1 cost structure." },
      { item: "401(k) and pension plan compliance", critical: true, detail: "Underfunded pension plans are balance sheet liabilities that transfer with the business. 401(k) non-discrimination testing failures can trigger IRS penalties." },
      { item: "Worker classification review (1099 vs W-2)", critical: true, detail: "Misclassified contractors are a ticking tax and benefits liability. Particularly common in field services, gig-adjacent, and professional services businesses." },
      { item: "Benefits plan review (health, dental, disability)", critical: false, detail: "Self-insured plans carry different risk profiles than fully-insured. Understand stop-loss coverage and claims history." },
      { item: "WARN Act and layoff history", critical: false, detail: "Prior layoffs and any pending WARN Act obligations. Relevant if your value creation plan includes headcount reduction." },
      { item: "Union status and CBA review", critical: true, detail: "Unionized workforce requires CBA review. Change-of-control provisions in union contracts can trigger renegotiation or work stoppages." },
      { item: "Equity and bonus plan review", critical: false, detail: "Any phantom equity, deferred comp, or bonus obligations that accelerate at close? These reduce proceeds and sometimes surface as surprises." },
    ]
  }
];

const TIMELINE = [
  { phase: "LOI SIGNED", week: "Day 0", color: "#3B82F6", actions: ["Exclusivity period begins (typically 45\u201360 days)", "Data room access granted", "DD workstreams assigned"], buyerFocus: "Organize deal team. Assign workstream leads. Send initial document request list within 48 hours." },
  { phase: "WEEK 1\u20132", week: "Early DD", color: "#6a5a9a", actions: ["Financial model stress-test begins", "Document request list sent", "QoE firm engaged", "Management intro meetings"], buyerFocus: "Get the data room populated. First pass on financial statements. Schedule management presentation." },
  { phase: "WEEK 3\u20134", week: "Core DD", color: "#5a8a9a", actions: ["Management presentations", "Customer interviews begin", "QoE fieldwork", "Legal document review begins", "Site visits"], buyerFocus: "The most intensive period. QoE findings start coming in. Customer calls may reshape the commercial thesis." },
  { phase: "WEEK 5\u20136", week: "Synthesis", color: "#5a8a6a", actions: ["QoE report delivered", "Legal issues list compiled", "Commercial DD synthesis", "Working capital peg negotiation", "Reps & warranties insurance bound"], buyerFocus: "Findings become price adjustments or deal-breakers. Issues list goes to seller. Working capital peg is negotiated \u2014 this is where money is made or lost." },
  { phase: "WEEK 7\u20138", week: "Documentation", color: "#8a6a3a", actions: ["Purchase agreement negotiation", "Management retention agreements", "Final IC memo", "Financing documentation", "Regulatory filings if required"], buyerFocus: "Legal negotiation runs parallel to final IC approval. No deal is signed before IC votes. Retention packages for key executives finalized." },
  { phase: "CLOSE", week: "Day 45\u201390", color: "#3B82F6", actions: ["Purchase agreement executed", "Funds wired", "Ownership transferred", "100-day plan activated"], buyerFocus: "Day 1 communications to employees, customers, vendors. 100-day plan owner is named. Don\u2019t celebrate \u2014 the real work starts now." },
];

const RED_FLAGS = [
  { flag: "Revenue recognized before delivery", severity: "KILL", ws: "Financial", detail: "Revenue pulled forward to inflate LTM EBITDA before sale. Classic pattern: Q4 revenue spike, Q1 following year drop. QoE will find it \u2014 but only if you commission one." },
  { flag: "Key customer won\u2019t take your call", severity: "KILL", ws: "Commercial", detail: "If a customer representing 20%+ of revenue won\u2019t do a reference call, assume the relationship is shakier than represented. Build in a retention clause or reprice." },
  { flag: "Change-of-control triggers in material contracts", severity: "KILL", ws: "Legal", detail: "Major customer contract terminates upon ownership change. The business you\u2019re buying may not be the business you close with. Always verify CoC provisions before IC." },
  { flag: "IP owned by the founder personally", severity: "KILL", ws: "Legal", detail: "Technology, brand, or patents registered to the individual \u2014 not the company. You can\u2019t buy what the company doesn\u2019t own. IP assignment must close before or simultaneously with the deal." },
  { flag: "QoE EBITDA materially below stated EBITDA", severity: "KILL", ws: "Financial", detail: "If QoE-adjusted EBITDA is more than 10\u201315% below what you underwrote, the entry multiple has changed. Either reprice or walk. Don\u2019t rationalize a bad number." },
  { flag: "CEO has never worked for anyone else", severity: "HIGH", ws: "Management", detail: "Founder who built from scratch and has never had a boss in 20 years. Not always fatal \u2014 but the PE transition is harder. Reference checks on adaptability are critical." },
  { flag: "Revenue cohort decay", severity: "HIGH", ws: "Commercial", detail: "2019 customer cohort spending less in 2023 than 2020. The business is growing by replacing churned revenue with new logos \u2014 not growing from existing customers. Net revenue retention below 95% is a yellow flag; below 85% is red." },
  { flag: "Undisclosed litigation", severity: "HIGH", ws: "Legal", detail: "PACER search finds a lawsuit not in the data room. Not always fatal \u2014 but it signals either incompetence or intentional non-disclosure. Both require a response before close." },
  { flag: "Pension underfunding", severity: "HIGH", ws: "HR", detail: "Underfunded defined benefit pension plan is a balance sheet liability that transfers. Get an actuarial assessment. The gap between reported and actuarial value becomes a purchase price adjustment." },
  { flag: "Systems running on spreadsheets", severity: "MEDIUM", ws: "Operational", detail: "Core business processes (billing, inventory, scheduling) managed via Excel. Not a deal-killer, but there\u2019s hidden OpEx in the value creation plan: ERP implementation typically costs $200K\u2013$1M+ and takes 6\u201312 months." },
  { flag: "Worker misclassification exposure", severity: "HIGH", ws: "HR", detail: "1099 contractors doing work that should be W-2. IRS reclassification liability includes back taxes, penalties, and benefits. In some states (CA, MA) the exposure can be material." },
  { flag: "No documented processes", severity: "MEDIUM", ws: "Operational", detail: "Key operational knowledge lives in 2\u20133 people\u2019s heads. Acceptable in a small business \u2014 but if your value creation plan involves adding locations or scaling headcount, undocumented process is a real drag." },
];

const QUIZ = [
  {
    q: "You\u2019re in Week 3 of DD. The QoE firm tells you adjusted EBITDA is $3.1M vs. the $4.0M in the CIM \u2014 a 22% gap driven by $700K of owner add-backs that don\u2019t hold and $200K of revenue pulled forward. Your LOI was at 6.5x on $4.0M ($26M EV). What do you do?",
    opts: ["Proceed at $26M \u2014 QoE adjustments are standard and expected", "Retrade to $20.2M (6.5x adjusted EBITDA) or walk", "Accept partial adjustment \u2014 meet at $23M", "Terminate \u2014 any QoE gap is a deal-killer"],
    correct: 1,
    explain: "QoE-adjusted EBITDA is what you\u2019re buying. If add-backs don\u2019t hold under scrutiny, the multiple you agreed to applies to a different number. Repricing to $20.2M (6.5x \u00d7 $3.1M) is standard. Meeting in the middle without defending the number signals you don\u2019t have conviction in your own analysis."
  },
  {
    q: "Customer reference calls reveal that 3 of the top 5 customers are actively evaluating competitors. Combined they represent 31% of revenue. This information was NOT in the CIM. You\u2019re 4 weeks into a 6-week exclusivity period. You:",
    opts: ["Continue DD \u2014 customer evaluation is normal business behavior", "Flag to IC immediately and reprice for 20% revenue risk", "Terminate the exclusivity agreement immediately", "Add a revenue retention earnout to the deal structure"],
    correct: 1,
    explain: "31% of revenue in active evaluation is a material risk that belongs in the IC memo with a pricing response. Terminating immediately may be premature \u2014 you need to understand WHY they\u2019re evaluating alternatives. An earnout tied to customer retention shifts the risk back to the seller and is the right structural tool here."
  },
  {
    q: "Legal DD finds that the company\u2019s core software platform is owned by the CEO\u2019s holding company, not the operating company you\u2019re buying. The CEO says it\u2019s \u2018always been this way\u2019 and offers a perpetual license to the operating company instead. You:",
    opts: ["Accept the license \u2014 perpetual is essentially the same as ownership", "Require IP assignment to the operating company before close", "Accept the license with right of first refusal to purchase", "Walk \u2014 IP ownership issues are always deal-killers"],
    correct: 1,
    explain: "A license is not ownership. Perpetual licenses can be disputed, encumbered, or challenged in bankruptcy. You need the IP inside the entity you\u2019re buying before close \u2014 not a license from an entity you don\u2019t control. This is a standard requirement, not an aggressive ask. A seller who resists has a reason to."
  },
  {
    q: "Site visit to the main facility reveals the entire billing and scheduling operation runs on a single employee\u2019s custom Excel workbook. The employee has been there 11 years. Your value creation plan includes doubling headcount in Year 2. This is:",
    opts: ["A minor operational risk \u2014 Excel is used everywhere", "A key person + operational scalability risk requiring a budget line in the value creation plan", "A deal-breaker \u2014 no PE-backed business should run on spreadsheets", "Fine \u2014 fix it in the 100-day plan at no material cost"],
    correct: 1,
    explain: "This is a real risk with a real cost \u2014 not a reason to kill the deal. ERP implementation for a business this size runs $200K\u2013$800K and 6\u20139 months. It goes in the value creation plan as a Year 1 initiative, comes out of your EBITDA bridge, and gets priced into the deal. Discovering it on a site visit and doing nothing is how operational surprises become IC embarrassments."
  },
  {
    q: "You\u2019re in the final week of DD. Legal counsel finds a pending EEOC discrimination claim not disclosed in the seller\u2019s rep letter. Estimated exposure is $150K\u2013$400K. The seller says it\u2019s \u2018baseless.\u2019 You:",
    opts: ["Accept seller\u2019s characterization and proceed \u2014 $150K is immaterial on a $20M deal", "Require specific indemnification for the claim with escrow holdback", "Terminate \u2014 undisclosed litigation is always a deal-breaker", "Reduce purchase price by $400K and proceed"],
    correct: 1,
    explain: "Undisclosed litigation is a rep breach \u2014 but not automatically a deal-killer if you can get made whole. A specific indemnification clause covering the full range of exposure, backed by escrow holdback, is the right tool. Accepting the seller\u2019s \u2018baseless\u2019 characterization without protection is how PE firms lose money on claims they knew about."
  },
];

export default function DDFramework() {
  const [tab, setTab] = useState("workstreams");
  const [activeWS, setActiveWS] = useState("financial");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rfFilter, setRfFilter] = useState("ALL");
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const ws = WORKSTREAMS.find(w => w.id === activeWS)!;
  const toggleCheck = (wsId: string, idx: number) => {
    const key = `${wsId}-${idx}`;
    setCheckedItems(c => ({...c, [key]: !c[key]}));
  };
  const wsProgress = (wsId: string) => {
    const w = WORKSTREAMS.find(x => x.id === wsId)!;
    const done = w.items.filter((_, i) => checkedItems[`${wsId}-${i}`]).length;
    return { done, total: w.items.length, pct: Math.round(done / w.items.length * 100) };
  };
  const totalProgress = () => {
    const total = WORKSTREAMS.reduce((a, w) => a + w.items.length, 0);
    const done = WORKSTREAMS.reduce((a, w) => a + w.items.filter((_, i) => checkedItems[`${w.id}-${i}`]).length, 0);
    return { done, total, pct: Math.round(done/total*100) };
  };
  const prog = totalProgress();

  const handleQuiz = (idx: number) => {
    if (quizRevealed) return;
    setQuizSelected(idx);
    setQuizRevealed(true);
    if (idx === QUIZ[quizIdx].correct) setQuizScore(s => s+1);
  };
  const nextQ = () => {
    if (quizIdx < QUIZ.length-1) { setQuizIdx(i=>i+1); setQuizSelected(null); setQuizRevealed(false); }
    else setQuizDone(true);
  };

  return (
    <div style={{background:"#0f1d3d",minHeight:"100vh",color:"#e5e7eb",padding:"24px 20px",maxWidth:1200,margin:"0 auto"}}>
      <style>{`

        button{cursor:pointer;font-family:inherit;}
        .tb{background:transparent;border:none;padding:9px 18px;font-size:10px;letter-spacing:2px;transition:all .2s;border-bottom:2px solid transparent;}
        .tb.on{color:#3B82F6;border-bottom-color:#3B82F6;}
        .tb:not(.on){color:#2a2838;}
        .tb:hover:not(.on){color:#555;}
        .card{background:#0f1d3d;border:1px solid #1c2a4a;border-radius:5px;}
        .pill{display:inline-block;padding:2px 8px;border-radius:2px;font-size:8px;letter-spacing:2px;font-weight:600;}
        .chk{width:16px;height:16px;border:1px solid #2a2838;border-radius:2px;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
        .chk.done{background:#5a8a6a;border-color:#5a8a6a;}
      `}</style>

      {/* Header */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:6}}>
          <div style={{ fontSize:36,letterSpacing:6,color:"#3B82F6",lineHeight:1}}>DUE DILIGENCE</div>
          <div style={{ fontSize:36,letterSpacing:6,color:"#1c2a4a",lineHeight:1}}>FRAMEWORK</div>
          <div style={{fontSize:9,color:"#2a2838",letterSpacing:3,marginLeft:8}}>WAVE 3 &middot; BUY-SIDE DD</div>
        </div>
        <div style={{fontSize:11,color:"#333",lineHeight:1.7,maxWidth:640,marginBottom:14}}>
          DD is where the IC thesis gets proven or destroyed. Six workstreams, 60+ checklist items, 45&ndash;90 days to answer one question: is this business worth what we&rsquo;re paying?
        </div>
        {/* Overall progress */}
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{flex:1,maxWidth:400}}>
            <div style={{height:3,background:"#1a1a26",borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${prog.pct}%`,background:"linear-gradient(90deg,#3B82F6,#8a6a3a)",borderRadius:2,transition:"width .4s"}} />
            </div>
          </div>
          <div style={{fontSize:10,color:prog.pct>70?"#3B82F6":"#555",letterSpacing:1}}>
            {prog.done}/{prog.total} ITEMS COMPLETE
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{borderBottom:"1px solid #17305a",marginBottom:20,display:"flex",flexWrap:"wrap"}}>
        {["workstreams","timeline","red flags","quiz"].map(t=>(
          <button key={t} className={`tb ${tab===t?"on":""}`} onClick={()=>setTab(t)}>{t.toUpperCase()}</button>
        ))}
      </div>

      {/* WORKSTREAMS */}
      {tab==="workstreams" && (
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16}}>
          {/* WS nav */}
          <div>
            {WORKSTREAMS.map(w => {
              const p = wsProgress(w.id);
              const active = activeWS === w.id;
              return (
                <div key={w.id} onClick={()=>setActiveWS(w.id)} style={{padding:"10px 14px",marginBottom:6,borderRadius:4,cursor:"pointer",border:`1px solid ${active?w.color+"55":"#1c2a4a"}`,background:active?w.color+"0e":"#0f1d3d",borderLeft:`3px solid ${active?w.color:w.color+"33"}`,transition:"all .15s"}}>
                  <div style={{ fontSize:11,color:active?w.color:"#444",letterSpacing:2}}>{w.label}</div>
                  <div style={{fontSize:9,color:"#333",marginTop:4,display:"flex",justifyContent:"space-between"}}>
                    <span>{w.timing}</span>
                    <span style={{color:p.pct===100?"#5a8a6a":p.pct>0?"#888":"#333"}}>{p.done}/{p.total}</span>
                  </div>
                  <div style={{height:2,background:"#17305a",borderRadius:1,marginTop:5,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${p.pct}%`,background:w.color,borderRadius:1,transition:"width .3s"}} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* WS detail */}
          <div>
            <div className="card" style={{padding:"18px 22px",marginBottom:12,borderLeft:`3px solid ${ws.color}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{ fontSize:18,color:ws.color,letterSpacing:3}}>{ws.label}</div>
                  <div style={{fontSize:10,color:"#555",marginTop:4}}>{ws.owner} &middot; {ws.timing}</div>
                </div>
              </div>
              <div style={{fontSize:11,color:"#666",lineHeight:1.8,borderTop:"1px solid #17305a",paddingTop:12}}>{ws.purpose}</div>
            </div>

            {ws.items.map((item, i) => {
              const key = `${ws.id}-${i}`;
              const checked = !!checkedItems[key];
              const open = expanded === key;
              return (
                <div key={i} className="card" style={{marginBottom:6,borderLeft:`3px solid ${item.critical?"#3B82F622":"#1c2a4a"}`,opacity:checked?0.6:1,transition:"opacity .2s"}}>
                  <div style={{padding:"12px 16px",display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div className={`chk ${checked?"done":""}`} onClick={()=>toggleCheck(ws.id, i)}>
                      {checked && <span style={{color:"#fff",fontSize:10,lineHeight:1}}>&#10003;</span>}
                    </div>
                    <div style={{flex:1,cursor:"pointer"}} onClick={()=>setExpanded(open?null:key)}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{fontSize:11,color:checked?"#444":"#ccc",textDecoration:checked?"line-through":"none",lineHeight:1.5}}>
                          {item.item}
                          {item.critical && <span className="pill" style={{background:"#3B82F622",color:"#3B82F6",marginLeft:8}}>CRITICAL</span>}
                        </div>
                        <span style={{color:"#333",fontSize:11,marginLeft:12}}>{open?"\u25B2":"\u25BC"}</span>
                      </div>
                      {open && <div style={{fontSize:10,color:"#666",lineHeight:1.8,marginTop:8,paddingTop:8,borderTop:"1px solid #17305a"}}>{item.detail}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TIMELINE */}
      {tab==="timeline" && (
        <div>
          <div style={{fontSize:10,color:"#555",marginBottom:20,letterSpacing:1}}>TYPICAL TIMELINE: LOI SIGNED &rarr; CLOSE &middot; 45&ndash;90 DAYS EXCLUSIVITY</div>
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",left:28,top:0,bottom:0,width:1,background:"#1c2a4a"}} />
            {TIMELINE.map((t,i)=>(
              <div key={i} style={{display:"flex",gap:20,marginBottom:20,position:"relative"}}>
                <div style={{width:56,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",zIndex:1}}>
                  <div style={{width:14,height:14,borderRadius:"50%",background:t.color,flexShrink:0}} />
                  <div style={{fontSize:8,color:t.color,letterSpacing:1,marginTop:4,textAlign:"center"}}>{t.week}</div>
                </div>
                <div className="card" style={{flex:1,padding:"16px 20px",borderLeft:`3px solid ${t.color}33`}}>
                  <div style={{ fontSize:15,color:t.color,letterSpacing:3,marginBottom:12}}>{t.phase}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                    <div>
                      <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:8}}>WHAT&rsquo;S HAPPENING</div>
                      {t.actions.map((a,j)=>(
                        <div key={j} style={{display:"flex",gap:8,marginBottom:5,fontSize:10,color:"#777",lineHeight:1.5}}>
                          <span style={{color:t.color,flexShrink:0,fontSize:8}}>&rarr;</span>{a}
                        </div>
                      ))}
                    </div>
                    <div style={{background:"#0f1d3d",border:`1px solid ${t.color}22`,borderRadius:4,padding:"12px 14px"}}>
                      <div style={{fontSize:9,color:t.color,letterSpacing:2,marginBottom:8}}>BUYER FOCUS</div>
                      <div style={{fontSize:10,color:"#777",lineHeight:1.7}}>{t.buyerFocus}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{padding:"16px 20px",borderLeft:"3px solid #8a4a4a33",marginTop:8}}>
            <div style={{fontSize:9,color:"#8a4a4a",letterSpacing:2,marginBottom:8}}>THE NUMBER MOST DEALS GET WRONG</div>
            <div style={{fontSize:11,color:"#666",lineHeight:1.8}}>
              Working capital. Sellers want the peg set low (less cash required at close). Buyers want it set at normalized levels. The difference on a $20M deal is often $800K&ndash;$1.5M. Negotiate the peg before you sign the purchase agreement &mdash; not after.
            </div>
          </div>
        </div>
      )}

      {/* RED FLAGS */}
      {tab==="red flags" && (
        <div>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            {["ALL","KILL","HIGH","MEDIUM"].map(f=>(
              <button key={f} onClick={()=>setRfFilter(f)} style={{background:rfFilter===f?(f==="KILL"?"#8a4a4a":f==="HIGH"?"#8a6a3a":f==="MEDIUM"?"#555":"#3B82F6"):"transparent",border:`1px solid ${rfFilter===f?"transparent":"#1c2a4a"}`,color:rfFilter===f?"#fff":"#555",padding:"6px 14px",fontSize:9,letterSpacing:2,borderRadius:3}}>
                {f}
              </button>
            ))}
            {["Financial","Commercial","Legal","Management","Operational","HR"].map(f=>(
              <button key={f} onClick={()=>setRfFilter(f)} style={{background:rfFilter===f?"#1c2a4a":"transparent",border:"1px solid #1c2a4a",color:rfFilter===f?"#ccc":"#333",padding:"6px 14px",fontSize:9,letterSpacing:1,borderRadius:3}}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          {RED_FLAGS.filter(r=>{
            if(rfFilter==="ALL") return true;
            if(rfFilter==="KILL"||rfFilter==="HIGH"||rfFilter==="MEDIUM") return r.severity===rfFilter;
            return r.ws===rfFilter;
          }).map((r,i)=>(
            <div key={i} className="card" style={{marginBottom:8,padding:"14px 18px",borderLeft:`3px solid ${r.severity==="KILL"?"#8a4a4a":r.severity==="HIGH"?"#8a6a3a":"#555"}33`}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
                <span className="pill" style={{background:r.severity==="KILL"?"#8a4a4a33":r.severity==="HIGH"?"#8a6a3a33":"#55555533",color:r.severity==="KILL"?"#c87a7a":r.severity==="HIGH"?"#c8a87a":"#888"}}>{r.severity}</span>
                <span style={{fontSize:9,color:"#444",letterSpacing:1}}>{r.ws.toUpperCase()}</span>
              </div>
              <div style={{ fontSize:13,color:"#ccc",letterSpacing:1,marginBottom:8}}>{r.flag.toUpperCase()}</div>
              <div style={{fontSize:11,color:"#666",lineHeight:1.7}}>{r.detail}</div>
            </div>
          ))}
        </div>
      )}

      {/* QUIZ */}
      {tab==="quiz" && (
        <div style={{maxWidth:720}}>
          {!quizDone ? (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:2}}>SCENARIO {quizIdx+1} OF {QUIZ.length}</div>
                <div style={{fontSize:10,color:"#3B82F6",letterSpacing:2}}>{quizScore} CORRECT</div>
              </div>
              <div style={{height:2,background:"#17305a",borderRadius:1,marginBottom:20}}>
                <div style={{height:"100%",width:`${(quizIdx/QUIZ.length)*100}%`,background:"#3B82F6",borderRadius:1,transition:"width .3s"}} />
              </div>
              <div style={{fontSize:9,color:"#555",letterSpacing:2,marginBottom:10}}>DD SCENARIO &mdash; WHAT DO YOU DO?</div>
              <div className="card" style={{padding:"22px 24px",marginBottom:12}}>
                <div style={{fontSize:11,color:"#ccc",lineHeight:1.9,marginBottom:20}}>{QUIZ[quizIdx].q}</div>
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
                <div className="card" style={{padding:"16px 20px",borderLeft:"3px solid #3B82F633"}}>
                  <div style={{fontSize:9,color:"#3B82F6",letterSpacing:2,marginBottom:8}}>DD INSIGHT</div>
                  <div style={{fontSize:11,color:"#888",lineHeight:1.8}}>{QUIZ[quizIdx].explain}</div>
                  <button onClick={nextQ} style={{marginTop:14,background:"#3B82F6",border:"none",color:"#0f1d3d",padding:"8px 22px",fontSize:10,letterSpacing:2,borderRadius:3}}>
                    {quizIdx<QUIZ.length-1?"NEXT SCENARIO \u2192":"SEE RESULTS \u2192"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{padding:"32px",textAlign:"center"}}>
              <div style={{ fontSize:14,color:"#555",letterSpacing:4,marginBottom:12}}>DD ASSESSMENT</div>
              <div style={{ fontSize:64,color:"#3B82F6"}}>{quizScore}/{QUIZ.length}</div>
              <div style={{fontSize:13,color:"#888",marginTop:12,marginBottom:24}}>
                {quizScore===5?"Clean sweep. You\u2019re running the deal room.":quizScore>=3?"Solid instincts \u2014 you\u2019d survive a real DD process.":"A few gaps. The scenarios you missed are the ones that cost real money."}
              </div>
              <button onClick={()=>{setQuizDone(false);setQuizIdx(0);setQuizScore(0);setQuizSelected(null);setQuizRevealed(false);}} style={{background:"transparent",border:"1px solid #1c2a4a",color:"#555",padding:"8px 22px",fontSize:10,letterSpacing:2,borderRadius:3}}>
                RETAKE
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
