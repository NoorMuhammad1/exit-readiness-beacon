import { useState } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

interface SlideData {
  id: string;
  num: number;
  name: string;
  job: string;
  mustHave: string[];
  killers: string[];
  lp_reads: string;
  example: { good: string; bad: string };
  weight: number;
}

interface DeckType {
  label: string;
  subtitle: string;
  color: string;
  audience: string;
  primaryQ: string;
  slides: SlideData[];
}

const DECK_TYPES: Record<string, DeckType> = {
  fund: {
    label: "FUND → LP DECK",
    subtitle: "PE firm raising capital from Limited Partners",
    color: "#ffffff",
    audience: "Pension funds, endowments, family offices, fund of funds",
    primaryQ: "Why should I commit $25M to YOUR fund vs. 300 others?",
    slides: [
      {
        id: "cover", num: 1, name: "COVER / EXECUTIVE SUMMARY",
        job: "One glance = total picture. Fund name, strategy, target size, target return, vintage year.",
        mustHave: ["Fund name + logo", "Strategy in one sentence", "Target fund size", "Target net IRR / MOIC", "Vintage year", "GP contact"],
        killers: ["Generic strategy language", "No return targets", "Cluttered design"],
        lp_reads: "10 seconds",
        example: { good: "Meridian Capital Fund III · Lower Middle Market Buy-and-Build · $250M Target · 22–25% Net IRR", bad: "An innovative fund leveraging unique deal flow to generate superior risk-adjusted returns across multiple sectors" },
        weight: 5
      },
      {
        id: "thesis", num: 2, name: "INVESTMENT THESIS",
        job: "The single most important slide. Why does your strategy produce alpha? What market inefficiency do you exploit?",
        mustHave: ["Target sector(s) and why now", "Size of target market", "Your specific edge vs. other PE buyers", "Why fragmentation = opportunity", "Why this vintage year"],
        killers: ["'We buy good companies' — not a thesis", "Thesis that any fund could claim", "No market sizing"],
        lp_reads: "30–45 seconds",
        example: { good: "Fragmented $40B home services sector. 85% of companies <$5M EBITDA trade at 3–4x. We buy at 4x, build platforms to $15M+ EBITDA, exit at 8–9x to strategics. Pure multiple arbitrage + operational uplift.", bad: "We invest in high-quality businesses with strong management teams in growing markets with defensible competitive positions." },
        weight: 20
      },
      {
        id: "team", num: 3, name: "TEAM",
        job: "LPs bet on people first. Show deal reps, operator experience, and who actually does the work.",
        mustHave: ["Each partner: deals sourced, executed, exited", "Domain expertise, not just finance titles", "Support staff and operating partners", "Succession / key-man risk addressed", "Alignment: GP commit % of fund"],
        killers: ["Photos but no deal counts", "All finance backgrounds, no operators", "Key-man risk ignored", "GP commit < 1%"],
        lp_reads: "45–60 seconds",
        example: { good: "Managing Partner: 12 deals, 4 exits, avg 2.8x MOIC. Led operations at portfolio companies — not just board seats.", bad: "Our team has 50+ years of combined experience across finance, operations, and value creation." },
        weight: 25
      },
      {
        id: "track", num: 4, name: "TRACK RECORD",
        job: "The proof. Show every deal. Gross and net IRR. Realized vs. unrealized. No cherry-picking.",
        mustHave: ["Every investment — realized and unrealized", "Gross IRR, Net IRR, MOIC per deal", "Investment date, exit date", "Your specific role in each deal", "DPI (distributed to paid-in) clearly labeled"],
        killers: ["Only showing winners", "Gross IRR without net", "Blending realized + unrealized without disclosure", "Omitting any fund investments"],
        lp_reads: "2–3 minutes",
        example: { good: "Fund I: 8 investments, 6 realized. Net IRR 24.3%. Net MOIC 2.6x. DPI 1.8x. Top deal: 4.1x in 36 months.", bad: "Our portfolio has consistently outperformed benchmarks delivering strong risk-adjusted returns across market cycles." },
        weight: 30
      },
      {
        id: "strategy", num: 5, name: "INVESTMENT STRATEGY",
        job: "How you find, win, and improve deals. Sourcing edge is the most underrated slide in any fund deck.",
        mustHave: ["Target company profile (revenue, EBITDA, sector)", "Sourcing channels — % proprietary vs. intermediary", "Average entry multiple paid (historical)", "Value creation playbook: what you do at the company", "Hold period and exit channels"],
        killers: ["Vague sourcing ('broad network')", "No entry multiple data", "Value creation described as 'working with management'"],
        lp_reads: "45 seconds",
        example: { good: "70% of deals sourced direct/off-market. Avg entry 4.8x EBITDA. Value creation: revenue acceleration + M&A add-ons. Avg hold 4.2 years. Exit to strategics 60%, sponsor-to-sponsor 40%.", bad: "We source deals through our extensive network of intermediaries, bankers, and industry contacts and add value through strategic guidance." },
        weight: 10
      },
      {
        id: "portfolio", num: 6, name: "PORTFOLIO CONSTRUCTION",
        job: "How you deploy the fund. Size, concentration, reserves, follow-on policy.",
        mustHave: ["Target # of platform investments", "Initial check size range", "Reserve ratio for add-ons", "Target ownership %", "Diversification by sector / geography"],
        killers: ["No reserve policy", "Unclear concentration limits", "Ownership targets missing"],
        lp_reads: "20 seconds",
        example: { good: "8–10 platforms. $15–30M initial equity. 40% reserve ratio. 60–80% ownership. 2–3 add-ons per platform targeted.", bad: "We plan to make a number of investments across multiple sectors with appropriate diversification." },
        weight: 5
      },
      {
        id: "terms", num: 7, name: "FUND TERMS",
        job: "LP economics. Show you've structured this fairly. GP commit is a trust signal.",
        mustHave: ["Fund size (hard cap)", "Management fee (% and step-down)", "Carried interest %", "Preferred return (hurdle)", "GP commit $ and %", "Investment period", "Fund life"],
        killers: ["2/20 with no preferred return", "GP commit < 1%", "No fee step-down", "10-year life with no extension logic"],
        lp_reads: "30 seconds",
        example: { good: "$250M hard cap. 2%/1.5% step-down. 20% carry. 8% preferred return. $7.5M GP commit (3%). 5-yr investment period. 10-yr fund life.", bad: "Standard market terms with competitive fee structure and alignment of interests." },
        weight: 5
      }
    ]
  },
  company: {
    label: "COMPANY → PE DECK",
    subtitle: "Business seeking PE investment / acquisition",
    color: "#5a8a9a",
    audience: "PE deal teams, investment committees, growth equity firms",
    primaryQ: "Can I buy this at 5x, grow it to $20M EBITDA, and sell it at 9x?",
    slides: [
      {
        id: "cover", num: 1, name: "COVER / EXECUTIVE SUMMARY",
        job: "Company name, what you do, ask amount, key metrics. PE reader should understand the opportunity in 10 seconds.",
        mustHave: ["Company name + what it does", "Revenue + EBITDA (TTM)", "Ask: equity needed or valuation expectation", "3 bullet investment highlights", "Management contact"],
        killers: ["No financials on cover", "Buried ask", "Vague business description"],
        lp_reads: "10 seconds",
        example: { good: "Apex HVAC Services · $18M Revenue · $3.2M EBITDA · Seeking growth equity partner · 3 states, 40% recurring revenue, 5 acquisitions completed", bad: "A leading provider of comprehensive HVAC solutions delivering superior customer experiences in a dynamic and growing marketplace." },
        weight: 5
      },
      {
        id: "problem", num: 2, name: "MARKET OPPORTUNITY",
        job: "Size the prize. PE wants to know: is this a big enough market to build a platform?",
        mustHave: ["TAM / SAM sizing with source", "Market growth rate (CAGR)", "Fragmentation data — # of competitors, avg size", "Why now? Tailwinds driving consolidation", "Your current market share"],
        killers: ["Top-down TAM only (no SAM)", "No fragmentation data", "No source for market size claims"],
        lp_reads: "20 seconds",
        example: { good: "$85B US HVAC services market. 7% annual growth. 95,000 operators, avg $2M revenue. Highly fragmented — no national player >5% share. Aging housing stock driving accelerating demand.", bad: "The HVAC industry is a large and growing market with significant opportunities for companies with strong operational capabilities." },
        weight: 10
      },
      {
        id: "solution", num: 3, name: "BUSINESS MODEL",
        job: "How you make money. Revenue streams, unit economics, customer retention.",
        mustHave: ["Revenue model (recurring vs. project)", "Gross margin by revenue type", "Customer count and avg revenue per customer", "Churn / retention rate", "CAC and LTV if applicable"],
        killers: ["No gross margin disclosure", "Blended margins without breakdown", "No retention data"],
        lp_reads: "30 seconds",
        example: { good: "40% service contracts ($85 avg gross margin), 60% project work ($55 avg gross margin). 1,200 commercial accounts. 88% annual contract renewal. LTV:CAC = 6.2x.", bad: "We offer a variety of services to our customers and generate revenue through multiple channels with strong customer relationships." },
        weight: 15
      },
      {
        id: "traction", num: 4, name: "FINANCIAL PERFORMANCE",
        job: "The slide PE readers turn to first. 3 years of actuals + current year projection.",
        mustHave: ["Revenue: 3yr actuals + CY projection", "EBITDA: same", "EBITDA margin trend", "Revenue growth CAGR", "Key driver of growth (organic vs. acquired)", "Any EBITDA adjustments clearly labeled"],
        killers: ["Missing actuals — projections only", "No EBITDA margin line", "Unexplained step-up in growth", "Hidden add-backs not disclosed"],
        lp_reads: "60–90 seconds",
        example: { good: "FY22: $11.2M rev / $1.9M EBITDA (17%). FY23: $14.4M / $2.5M (17%). FY24: $18.1M / $3.2M (18%). CY25E: $23M / $4.1M (18%). CAGR 27%. Organic + 2 acquisitions.", bad: "We have demonstrated consistent growth and profitability with strong financial performance and a clear path to continued expansion." },
        weight: 25
      },
      {
        id: "team", num: 5, name: "MANAGEMENT TEAM",
        job: "Will this team survive PE ownership and scale? Show operators, not just founders.",
        mustHave: ["CEO / President: background + years in industry", "CFO or financial lead", "VP Operations or equivalent", "Rollover equity commitment (if exit)", "Management gaps to be filled with PE capital"],
        killers: ["Founder-only team with no depth", "No rollover equity signal", "Missing operational leadership"],
        lp_reads: "30 seconds",
        example: { good: "CEO: 18 yrs HVAC, 5 acquisitions completed. CFO: ex-public company, joined 2023. COO: scaled prior platform to $40M. Mgmt rolling 15% of equity.", bad: "Our experienced leadership team is passionate about our mission and brings decades of combined experience to drive our growth strategy." },
        weight: 15
      },
      {
        id: "growth", num: 6, name: "GROWTH STRATEGY",
        job: "Show the PE buyer their value creation thesis. Organic + M&A roadmap.",
        mustHave: ["Organic growth levers: pricing, geo expansion, service lines", "Acquisition pipeline: # of targets, target EBITDA, target multiples", "Capital deployment plan", "Revenue bridge: current → 5yr projection", "EBITDA bridge: how margins expand"],
        killers: ["Hockey stick with no explanation", "M&A strategy without deal pipeline", "No margin expansion thesis"],
        lp_reads: "45 seconds",
        example: { good: "Organic: 12–15% annual. M&A: 3–4 tuck-ins/yr at 3–4x EBITDA. Target: $60M revenue / $11M EBITDA by Year 5. Margin expansion via shared services and procurement savings.", bad: "We plan to grow through a combination of organic initiatives and strategic acquisitions to achieve our long-term vision." },
        weight: 15
      },
      {
        id: "ask", num: 7, name: "THE ASK / EXIT",
        job: "What you want and what the buyer gets. Clear valuation expectation. Exit options for the buyer.",
        mustHave: ["Equity sought or valuation expectation", "Use of proceeds", "Implied entry multiple (your ask ÷ EBITDA)", "Projected exit multiple and timeline", "LP return scenario at exit (MOIC / IRR)"],
        killers: ["No valuation anchor", "Proceeds use vague", "No exit scenario modeled", "Implied multiple unstated"],
        lp_reads: "45 seconds",
        example: { good: "Seeking $15–20M growth equity at 6x TTM EBITDA ($19.2M). Use: 3 acquisitions + working capital. Year 5 exit at 8–9x = $88–99M. Implied 2.8–3.1x MOIC at 5yr hold.", bad: "We are looking for a strategic capital partner to help us achieve the next phase of our growth journey." },
        weight: 15
      }
    ]
  }
};

const LP_OBJECTIONS = [
  { q: "Your track record is only 2 deals. How do I know this isn't luck?", answer: "Acknowledge the sample size honestly. Then show: (1) deal-by-deal attribution — what specifically drove returns and your role, (2) your thesis has been validated by comp deals in the market, (3) show the pipeline quality as leading indicator. Never oversell 2 deals as a pattern." },
  { q: "Your management fee covers a large team. What happens if deal flow slows?", answer: "Show your historical deployment pace vs. fee draw. Demonstrate that the team size is sized for the portfolio, not the fee. Commit to a transparent management company P&L shared with your LPAC." },
  { q: "70% of your returns came from one deal. Is this a fund or a lottery ticket?", answer: "This is the J-curve problem. Show that the remaining deals returned capital — you didn't lose money elsewhere. Then explain what you learned, how portfolio construction rules changed, and why your current approach limits concentration risk." },
  { q: "Your sourcing is mostly intermediary-driven. How is that differentiated?", answer: "Show the intermediary relationships with deal stats: which firms, how many exclusives, your win rate in competitive processes. Then layer in direct sourcing efforts — executive relationships, sector conferences, proprietary databases. Numbers only." },
  { q: "Why should I pay 2 and 20 when passives return 10%?", answer: "The right answer is access. LPs in PE are getting exposure to private companies at entry multiples unavailable in public markets, with active value creation that compounds the return. Show your net IRR vs. S&P 500 over the same period — that's the only comparison that matters." },
  { q: "What happens to the fund if your lead partner leaves?", answer: "Have an answer before they ask. Succession plan, documented deal sourcing process (not just one person's Rolodex), team-based IC approval, keyman provisions in your LPA that give LPs rights on departure." },
  { q: "Your unrealized portfolio is marked at cost. Why should I trust that valuation?", answer: "Show your valuation policy — third-party quarterly marks vs. cost-basis. If marked at cost, explain the conservatism as a feature: DPI matters more to LPs than RVPI. Show what the deals would be worth at market comps." }
];

const GRADING_CRITERIA = [
  { id: "numbers", label: "Every claim backed by a number", max: 20 },
  { id: "thesis", label: "Investment thesis is specific and differentiated", max: 20 },
  { id: "track", label: "Track record is complete and transparent", max: 20 },
  { id: "team", label: "Team shows operators, not just finance titles", max: 15 },
  { id: "terms", label: "Fund terms are LP-fair with GP alignment", max: 10 },
  { id: "narrative", label: "Deck tells a logical story slide-to-slide", max: 10 },
  { id: "design", label: "Clean, readable, 15-sec-per-slide discipline", max: 5 }
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function PEPitchDeckBuilder() {
  const [tab, setTab] = useState("anatomy");
  const [deckType, setDeckType] = useState("fund");
  const [activeSlide, setActiveSlide] = useState<SlideData | null>(null);
  const [builderSlide, setBuilderSlide] = useState(0);
  const [builderData, setBuilderData] = useState<Record<string, string | boolean>>({});
  const [activeObjIdx, setActiveObjIdx] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [gradeSubmitted, setGradeSubmitted] = useState(false);

  const deck = DECK_TYPES[deckType];
  const totalScore = Object.values(grades).reduce((a, b) => a + b, 0);
  const maxScore = GRADING_CRITERIA.reduce((a, c) => a + c.max, 0);

  const updateBuilder = (field: string, val: string) => {
    setBuilderData(prev => ({ ...prev, [`${builderSlide}_${field}`]: val }));
  };

  return (
    <div style={{ minHeight: "100vh", color: "rgba(255,255,255,0.85)", padding: "28px 20px" }}>
      <style>{`

        .pd-btn { cursor: pointer; font-family: inherit; }
        .pd-tb { background: transparent; border: none; padding: 8px 16px; font-size: 11px; letter-spacing: 2px; transition: all .2s; cursor: pointer; font-family: inherit; }
        .pd-tb.on { border-bottom: 2px solid #ffffff; color: #ffffff; }
        .pd-tb:not(.on) { color: #333; border-bottom: 2px solid transparent; }
        .pd-tb:hover:not(.on) { color: #666; }
        .pd-card { background: #0c0d16; border: 1px solid #1a1a28; border-radius: 6px; padding: 18px; }
        .pd-slide-node { cursor: pointer; transition: all .15s; }
        .pd-slide-node:hover { filter: brightness(1.2); }
        .pd-textarea { background: #17305a; border: 1px solid #1c2a4a; color: #ccc; font-family: inherit; font-size: 11px; padding: 10px; border-radius: 4px; width: 100%; resize: vertical; outline: none; line-height: 1.6; box-sizing: border-box; }
        .pd-textarea:focus { border-color: #ffffff; }
        .pd-range { accent-color: #ffffff; width: 100%; }
        .pd-type-btn { padding: 14px 20px; border-radius: 5px; border: 2px solid; font-size: 11px; letter-spacing: 1px; transition: all .2s; background: transparent; cursor: pointer; font-family: inherit; }
        .pd-killer { padding: 5px 10px; margin: 3px 0; border-left: 2px solid #9a3a3a; background: #140a0a; font-size: 10px; color: #c07070; border-radius: 0 3px 3px 0; }
        .pd-must { padding: 5px 10px; margin: 3px 0; border-left: 2px solid #3a6a5a; background: #0a1410; font-size: 10px; color: #70c090; border-radius: 0 3px 3px 0; }
        .pd-slide-pill { padding: 6px 14px; border-radius: 20px; border: 1px solid; font-size: 10px; letter-spacing: 1px; cursor: pointer; transition: all .15s; white-space: nowrap; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 4 }}>
          <div style={{ fontSize: 36, letterSpacing: 5, color: "#ffffff", lineHeight: 1 }}>PE PITCH DECK</div>
          <div style={{ fontSize: 36, letterSpacing: 5, color: "rgba(255,255,255,0.2)", lineHeight: 1 }}>BUILDER</div>
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 3 }}>MODULE #22 · FUND→LP · COMPANY→PE · ANATOMY · GRADER · OBJECTION TRAINER</div>
      </div>

      {/* Deck Type Toggle — persistent */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {Object.entries(DECK_TYPES).map(([key, d]) => (
          <button key={key} className="pd-type-btn" onClick={() => { setDeckType(key); setActiveSlide(null); setBuilderSlide(0); }}
            style={{ borderColor: deckType === key ? d.color : "rgba(255,255,255,0.1)", color: deckType === key ? d.color : "#444", background: deckType === key ? d.color + "11" : "transparent" }}>
            {d.label}
          </button>
        ))}
        <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: 12, fontSize: 10, color: "rgba(255,255,255,0.3)", borderLeft: "1px solid #1a1a24" }}>
          Audience: <span style={{ color: "rgba(255,255,255,0.45)", marginLeft: 8 }}>{deck.audience}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #14141e", marginBottom: 24, display: "flex", gap: 0 }}>
        {["anatomy", "builder", "lp objections", "grader"].map(t => (
          <button key={t} className={`pd-tb ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>{t.toUpperCase()}</button>
        ))}
      </div>

      {/* ── ANATOMY TAB ── */}
      {tab === "anatomy" && (
        <div>
          <div style={{ marginBottom: 16, padding: "12px 16px", background: "#0c0d16", border: `1px solid ${deck.color}33`, borderRadius: 6, fontSize: 11, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>PRIMARY LP QUESTION: </span>
              <span style={{ color: deck.color, fontStyle: "italic" }}>"{deck.primaryQ}"</span>
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{deck.slides.length} SLIDES</div>
          </div>

          {/* Slide pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {deck.slides.map((s) => (
              <div key={s.id} className="pd-slide-pill"
                onClick={() => setActiveSlide(activeSlide?.id === s.id ? null : s)}
                style={{ borderColor: activeSlide?.id === s.id ? deck.color : deck.color + "33", color: activeSlide?.id === s.id ? deck.color : "#555", background: activeSlide?.id === s.id ? deck.color + "11" : "transparent" }}>
                {s.num}. {s.name}
              </div>
            ))}
          </div>

          {/* Weight bar */}
          <div className="pd-card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginBottom: 12 }}>LP ATTENTION WEIGHT BY SLIDE</div>
            <div style={{ display: "flex", height: 24, borderRadius: 4, overflow: "hidden", gap: 2 }}>
              {deck.slides.map(s => (
                <div key={s.id} title={`${s.name}: ${s.weight}%`}
                  style={{ width: `${s.weight}%`, background: s.weight >= 20 ? deck.color : s.weight >= 10 ? deck.color + "88" : deck.color + "44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#0f1d3d", fontWeight: 600, cursor: "pointer", transition: "filter .15s" }}
                  onClick={() => setActiveSlide(deck.slides.find(x => x.id === s.id) || null)}>
                  {s.weight >= 10 ? `${s.weight}%` : ""}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
              {deck.slides.map(s => (
                <div key={s.id} style={{ width: `${s.weight}%`, fontSize: 8, color: "rgba(255,255,255,0.3)", overflow: "hidden", whiteSpace: "nowrap", textAlign: "center" }}>{s.num}</div>
              ))}
            </div>
          </div>

          {/* Active slide detail */}
          {activeSlide ? (
            <div className="pd-card" style={{ borderLeft: `3px solid ${deck.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 20, color: deck.color, letterSpacing: 3 }}>
                    SLIDE {activeSlide.num} — {activeSlide.name}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>LP reads for: <span style={{ color: deck.color + "99" }}>{activeSlide.lp_reads}</span></div>
                </div>
                <div style={{ fontSize: 9, padding: "3px 10px", background: deck.color + "22", color: deck.color, borderRadius: 3, letterSpacing: 1 }}>
                  {activeSlide.weight}% OF LP ATTENTION
                </div>
              </div>

              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: 20, borderBottom: "1px solid #1a1a24", paddingBottom: 16 }}>
                <span style={{ color: "rgba(255,255,255,0.45)" }}>THE JOB OF THIS SLIDE: </span>{activeSlide.job}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#3a6a5a", letterSpacing: 2, marginBottom: 8 }}>MUST HAVE</div>
                  {activeSlide.mustHave.map((m, i) => <div key={i} className="pd-must">{"\u2713"} {m}</div>)}
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#9a3a3a", letterSpacing: 2, marginBottom: 8 }}>INSTANT KILLERS</div>
                  {activeSlide.killers.map((k, i) => <div key={i} className="pd-killer">{"\u2717"} {k}</div>)}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ padding: "12px 14px", background: "#0a140a", border: "1px solid #1a3a1a", borderRadius: 4 }}>
                  <div style={{ fontSize: 9, color: "#3a6a5a", letterSpacing: 2, marginBottom: 6 }}>{"\u2713"} STRONG EXAMPLE</div>
                  <div style={{ fontSize: 11, color: "#4ade80", lineHeight: 1.7 }}>{activeSlide.example.good}</div>
                </div>
                <div style={{ padding: "12px 14px", background: "#140a0a", border: "1px solid #3a1a1a", borderRadius: 4 }}>
                  <div style={{ fontSize: 9, color: "#9a3a3a", letterSpacing: 2, marginBottom: 6 }}>{"\u2717"} WEAK EXAMPLE</div>
                  <div style={{ fontSize: 11, color: "#ba7070", lineHeight: 1.7, fontStyle: "italic" }}>{activeSlide.example.bad}</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "32px 0", fontSize: 11, color: "#2a2830" }}>
              {"\u2191"} SELECT A SLIDE TO EXPAND
            </div>
          )}
        </div>
      )}

      {/* ── BUILDER TAB ── */}
      {tab === "builder" && (
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
            Build your deck slide by slide. Guided prompts pull from real LP expectations — not generic templates.
          </div>

          {/* Slide navigator */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            {deck.slides.map((s, i) => {
              const hasContent = (builderData[`${i}_content`] as string)?.length > 20;
              return (
                <div key={s.id} onClick={() => setBuilderSlide(i)} style={{
                  padding: "5px 12px", borderRadius: 4, border: "1px solid",
                  borderColor: builderSlide === i ? deck.color : hasContent ? deck.color + "44" : "rgba(255,255,255,0.1)",
                  background: builderSlide === i ? deck.color + "11" : "transparent",
                  color: builderSlide === i ? deck.color : hasContent ? deck.color + "88" : "#444",
                  fontSize: 10, cursor: "pointer", letterSpacing: 1
                }}>
                  {s.num}{hasContent ? " \u2713" : ""}
                </div>
              );
            })}
          </div>

          {/* Current slide builder */}
          {(() => {
            const s = deck.slides[builderSlide];
            return (
              <div>
                <div className="pd-card" style={{ borderLeft: `3px solid ${deck.color}`, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontSize: 18, color: deck.color, letterSpacing: 3 }}>
                      SLIDE {s.num} — {s.name}
                    </div>
                    <div style={{ fontSize: 9, color: deck.color + "66" }}>{s.weight}% LP WEIGHT · {s.lp_reads} read time</div>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>{s.job}</div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginBottom: 6 }}>SLIDE HEADLINE</div>
                    <textarea className="pd-textarea" rows={1} placeholder={`One sentence that captures ${s.name.toLowerCase()}...`}
                      value={(builderData[`${builderSlide}_headline`] as string) || ""}
                      onChange={e => updateBuilder("headline", e.target.value)} />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginBottom: 6 }}>SLIDE CONTENT</div>
                    <textarea className="pd-textarea" rows={5} placeholder={`Must include:\n${s.mustHave.map(m => `\u2022 ${m}`).join("\n")}`}
                      value={(builderData[`${builderSlide}_content`] as string) || ""}
                      onChange={e => updateBuilder("content", e.target.value)} />
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginBottom: 6 }}>KEY METRIC / PROOF POINT</div>
                    <textarea className="pd-textarea" rows={2} placeholder="The single number that makes this slide undeniable..."
                      value={(builderData[`${builderSlide}_metric`] as string) || ""}
                      onChange={e => updateBuilder("metric", e.target.value)} />
                  </div>

                  {/* Quick checklist */}
                  <div style={{ marginTop: 16, borderTop: "1px solid #1a1a24", paddingTop: 14 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginBottom: 8 }}>SELF-CHECK</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {s.mustHave.map((m, i) => {
                        const key = `${builderSlide}_check_${i}`;
                        const checked = builderData[key];
                        return (
                          <div key={i} onClick={() => setBuilderData(prev => ({ ...prev, [key]: !prev[key] }))}
                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", border: `1px solid ${checked ? deck.color + "88" : "rgba(255,255,255,0.1)"}`, borderRadius: 20, cursor: "pointer", background: checked ? deck.color + "11" : "transparent" }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: checked ? deck.color : "#333", border: `1px solid ${checked ? deck.color : "#444"}`, flexShrink: 0 }} />
                            <span style={{ fontSize: 9, color: checked ? deck.color + "cc" : "#555" }}>{m}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Preview card */}
                {(builderData[`${builderSlide}_headline`] || builderData[`${builderSlide}_content`]) && (
                  <div style={{ padding: "20px 24px", background: "#050508", border: `1px solid ${deck.color}22`, borderRadius: 6 }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 3, marginBottom: 12 }}>SLIDE PREVIEW</div>
                    <div style={{ fontSize: 22, color: deck.color, letterSpacing: 2, marginBottom: 8 }}>
                      {(builderData[`${builderSlide}_headline`] as string) || s.name}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                      {builderData[`${builderSlide}_content`] as string}
                    </div>
                    {builderData[`${builderSlide}_metric`] && (
                      <div style={{ marginTop: 12, padding: "10px 14px", background: deck.color + "11", border: `1px solid ${deck.color}33`, borderRadius: 4, fontSize: 14, color: deck.color, letterSpacing: 2 }}>
                        {builderData[`${builderSlide}_metric`] as string}
                      </div>
                    )}
                  </div>
                )}

                {/* Nav buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
                  <button className="pd-btn" onClick={() => setBuilderSlide(i => Math.max(0, i - 1))} disabled={builderSlide === 0}
                    style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", padding: "8px 20px", fontSize: 11, letterSpacing: 2, borderRadius: 3, opacity: builderSlide === 0 ? 0.3 : 1 }}>
                    {"\u2190"} PREV
                  </button>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center" }}>
                    {builderSlide + 1} / {deck.slides.length}
                  </div>
                  <button className="pd-btn" onClick={() => setBuilderSlide(i => Math.min(deck.slides.length - 1, i + 1))} disabled={builderSlide === deck.slides.length - 1}
                    style={{ background: deck.color, border: "none", color: "#07080d", padding: "8px 20px", fontSize: 11, letterSpacing: 2, borderRadius: 3, opacity: builderSlide === deck.slides.length - 1 ? 0.3 : 1 }}>
                    NEXT {"\u2192"}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── LP OBJECTIONS TAB ── */}
      {tab === "lp objections" && (
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 20, lineHeight: 1.7 }}>
            Every LP meeting ends with these questions. Click to reveal — then test yourself before you look.
          </div>
          {LP_OBJECTIONS.map((obj, i) => (
            <div key={i} className="pd-card" style={{ marginBottom: 10, borderLeft: `3px solid ${activeObjIdx === i ? "#ffffff" : "rgba(255,255,255,0.2)"}`, cursor: "pointer" }}
              onClick={() => { setActiveObjIdx(activeObjIdx === i ? null : i); setShowAnswer(false); }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ fontSize: 18, color: "rgba(255,255,255,0.27)", flexShrink: 0 }}>LP</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, fontStyle: "italic" }}>"{obj.q}"</div>
              </div>

              {activeObjIdx === i && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1a1a24" }}>
                  {!showAnswer ? (
                    <button className="pd-btn" onClick={e => { e.stopPropagation(); setShowAnswer(true); }}
                      style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff", padding: "8px 20px", fontSize: 11, letterSpacing: 2, borderRadius: 3 }}>
                      REVEAL ANSWER {"\u2192"}
                    </button>
                  ) : (
                    <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid #1a3a1a", borderRadius: 4, fontSize: 11, color: "#4ade80", lineHeight: 1.9 }}>
                      <span style={{ color: "#22c55e", letterSpacing: 1, fontSize: 9 }}>HOW TO HANDLE IT: </span><br />
                      {obj.answer}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── GRADER TAB ── */}
      {tab === "grader" && (
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 20, lineHeight: 1.7 }}>
            Score your deck against LP criteria. Rate each dimension honestly. This is how your deck gets torn apart in an IC meeting.
          </div>

          {!gradeSubmitted ? (
            <div>
              {GRADING_CRITERIA.map(c => (
                <div key={c.id} className="pd-card" style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: "#ffffff" }}>{grades[c.id] || 0} / {c.max}</div>
                  </div>
                  <input type="range" className="pd-range" min={0} max={c.max} step={1}
                    value={grades[c.id] || 0}
                    onChange={e => setGrades(g => ({ ...g, [c.id]: +e.target.value }))} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 3 }}>
                    <span>0 — Not present</span>
                    <span>{Math.floor(c.max / 2)} — Adequate</span>
                    <span>{c.max} — Institutional quality</span>
                  </div>
                </div>
              ))}

              <button className="pd-btn" onClick={() => setGradeSubmitted(true)}
                style={{ background: "#ffffff", border: "none", color: "#07080d", padding: "11px 32px", fontSize: 11, letterSpacing: 2, borderRadius: 3, marginTop: 8 }}>
                SCORE MY DECK {"\u2192"}
              </button>
            </div>
          ) : (
            <div>
              {/* Score display */}
              <div className="pd-card" style={{ textAlign: "center", padding: "32px", marginBottom: 20, borderColor: "rgba(255,255,255,0.2)" }}>
                <div style={{ fontSize: 64, color: totalScore >= 70 ? "#ffffff" : totalScore >= 50 ? "#8a8a4a" : "#f87171", letterSpacing: 4 }}>
                  {totalScore}
                </div>
                <div style={{ fontSize: 20, color: "rgba(255,255,255,0.3)", letterSpacing: 3 }}>/ {maxScore}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 12 }}>
                  {totalScore >= 80 ? "INSTITUTIONAL QUALITY — Ready for sophisticated LPs." :
                   totalScore >= 65 ? "STRONG FOUNDATION — Address the gaps before your first LP meeting." :
                   totalScore >= 50 ? "WORK REQUIRED — Several critical sections need material strengthening." :
                   "EARLY DRAFT — Do not send this deck. Revisit anatomy fundamentals first."}
                </div>
              </div>

              {/* Breakdown */}
              {GRADING_CRITERIA.map(c => {
                const score = grades[c.id] || 0;
                const pct = (score / c.max) * 100;
                return (
                  <div key={c.id} style={{ marginBottom: 8, display: "grid", gridTemplateColumns: "1fr 80px", gap: 12, alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>{c.label}</div>
                      <div style={{ height: 6, background: "#14141e", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: pct >= 70 ? "#22c55e" : pct >= 40 ? "#8a8a3a" : "#8a3a3a", borderRadius: 3, transition: "width .5s" }} />
                      </div>
                    </div>
                    <div style={{ textAlign: "right", fontSize: 12, color: pct >= 70 ? "#4ade80" : pct >= 40 ? "#ffffff" : "#ba6060" }}>
                      {score}/{c.max}
                    </div>
                  </div>
                );
              })}

              <button className="pd-btn" onClick={() => { setGradeSubmitted(false); setGrades({}); }}
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff", padding: "9px 24px", fontSize: 11, letterSpacing: 2, borderRadius: 3, marginTop: 16 }}>
                RE-GRADE
              </button>
            </div>
          )}
        </div>
      )}

      {/* Curriculum arc */}
      <div style={{ marginTop: 32, padding: "14px 18px", background: "#0a0b12", border: "1px solid #14141e", borderRadius: 6 }}>
        <div style={{ fontSize: 9, color: "#2a2838", letterSpacing: 3, marginBottom: 10 }}>CURRICULUM ARC</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            ["Synergy Engine", "built", "#22c55e"],
            ["Process Letter Academy", "built", "#22c55e"],
            ["Life After Exit", "built", "#22c55e"],
            ["LBO Fundamentals", "built", "#22c55e"],
            ["PE Pitch Deck Builder", "this", "#ffffff"],
            ["Deal Structure Lab", "next", "#3a3848"],
          ].map(([name, status, color]) => (
            <div key={name} style={{ padding: "4px 10px", border: `1px solid ${color}44`, borderRadius: 3, fontSize: 9, color: color, letterSpacing: 1 }}>
              {name} <span style={{ opacity: 0.6 }}>{"\u00B7"} {status}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 9, color: "#1a1828", textAlign: "center", letterSpacing: 1 }}>
        MODULE #22 · PE PITCH DECK BUILDER · EDUCATIONAL USE ONLY
      </div>
    </div>
  );
}

export default PEPitchDeckBuilder;
