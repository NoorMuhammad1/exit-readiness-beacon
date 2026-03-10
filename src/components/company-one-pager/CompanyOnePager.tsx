import { useState } from "react";

const fmt = (n: string) => {
  if (!n || isNaN(Number(n))) return "\u2014";
  const num = parseFloat(n);
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (Math.abs(num) >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return `${num.toFixed(0)}`;
};

const SECTORS = [
  "Business Services", "Healthcare Services", "Technology", "Industrial / Manufacturing",
  "Consumer", "Financial Services", "Real Estate Services", "Distribution / Logistics",
  "Home Services", "Education", "Media / Marketing", "Government Services"
];

const STRUCTURES = ["C-Corp", "S-Corp", "LLC", "Partnership", "Other"];

const FIELD_GROUPS = [
  {
    label: "COMPANY IDENTITY",
    color: "#c8a84b",
    fields: [
      { key: "name", label: "Company Name", placeholder: "Apex HVAC Services" },
      { key: "tagline", label: "Tagline / Descriptor", placeholder: "Residential & Commercial HVAC Platform" },
      { key: "sector", label: "Sector", type: "select", options: SECTORS },
      { key: "founded", label: "Founded", placeholder: "2009" },
      { key: "hq", label: "HQ Location", placeholder: "Charlotte, NC" },
      { key: "states", label: "States Served", placeholder: "NC, SC, VA, GA" },
      { key: "employees", label: "Employees", placeholder: "312" },
      { key: "website", label: "Website", placeholder: "apexhvac.com" },
    ]
  },
  {
    label: "FINANCIALS",
    color: "#5a8a6a",
    fields: [
      { key: "rev_ly", label: "Revenue (LY)", placeholder: "18,100,000" },
      { key: "rev_cy", label: "Revenue (CY Est)", placeholder: "23,000,000" },
      { key: "ebitda_ly", label: "EBITDA (LY)", placeholder: "3,200,000" },
      { key: "ebitda_cy", label: "EBITDA (CY Est)", placeholder: "4,100,000" },
      { key: "rev_2y", label: "Revenue (2 Yrs Ago)", placeholder: "14,400,000" },
      { key: "ebitda_2y", label: "EBITDA (2 Yrs Ago)", placeholder: "2,500,000" },
      { key: "recurring_pct", label: "Recurring Revenue %", placeholder: "40" },
      { key: "gross_margin", label: "Gross Margin %", placeholder: "55" },
    ]
  },
  {
    label: "INVESTMENT PROFILE",
    color: "#6a5a9a",
    fields: [
      { key: "ask", label: "Equity Sought / Valuation Ask", placeholder: "15,000,000" },
      { key: "use_of_proceeds", label: "Use of Proceeds", placeholder: "3 tuck-in acquisitions + working capital" },
      { key: "structure", label: "Entity Structure", type: "select", options: STRUCTURES },
      { key: "mgmt_rollover", label: "Mgmt Rollover %", placeholder: "15" },
      { key: "entry_multiple", label: "Implied Entry Multiple (x EBITDA)", placeholder: "6.0" },
      { key: "exit_thesis", label: "Exit Thesis", placeholder: "Strategic or sponsor-to-sponsor, 8\u20139x EBITDA at Year 5" },
    ]
  },
  {
    label: "BUSINESS OVERVIEW",
    color: "#5a8a9a",
    fields: [
      { key: "overview", label: "Business Description (2\u20133 sentences)", placeholder: "Apex is a platform provider of residential and commercial HVAC services across the Carolinas, with 40% recurring contract revenue and 88% annual renewal rates. The company has completed 5 tuck-in acquisitions since 2019 and operates from 6 service centers.", type: "textarea" },
      { key: "highlight_1", label: "Investment Highlight 1", placeholder: "40% recurring revenue \u2014 88% annual contract renewal rate" },
      { key: "highlight_2", label: "Investment Highlight 2", placeholder: "5 acquisitions completed \u2014 proven integration playbook" },
      { key: "highlight_3", label: "Investment Highlight 3", placeholder: "Aging housing stock driving 7% annual market growth" },
      { key: "highlight_4", label: "Investment Highlight 4", placeholder: "No customer concentration \u2014 top 10 customers < 18% of revenue" },
    ]
  },
  {
    label: "MANAGEMENT",
    color: "#8a6a3a",
    fields: [
      { key: "ceo_name", label: "CEO / President Name", placeholder: "James R. Whitfield" },
      { key: "ceo_bg", label: "CEO Background", placeholder: "18 yrs HVAC, 5 acquisitions completed" },
      { key: "cfo_name", label: "CFO / Finance Lead", placeholder: "Sandra K. Torres" },
      { key: "cfo_bg", label: "CFO Background", placeholder: "Ex-public company, joined 2023" },
      { key: "ops_name", label: "VP Operations", placeholder: "Derek M. Okafor" },
      { key: "ops_bg", label: "Ops Background", placeholder: "Scaled prior platform to $40M revenue" },
      { key: "contact_name", label: "Deal Contact Name", placeholder: "James R. Whitfield" },
      { key: "contact_email", label: "Deal Contact Email", placeholder: "jwhitfield@apexhvac.com" },
    ]
  }
];

const RULES = [
  { rule: "One page. Non-negotiable.", detail: "PE readers form opinions in 30 seconds. If it doesn\u2019t fit on one page, you\u2019re telling them you don\u2019t know what matters." },
  { rule: "Every number on the page must be defensible.", detail: "LTM figures, not forward projections in the header. Projections go in the financial snapshot \u2014 clearly labeled as estimates." },
  { rule: "Lead with recurring revenue %.", detail: "Nothing signals business quality faster. A buyer paying 6x EBITDA is paying for the recurring base \u2014 make that number impossible to miss." },
  { rule: "Investment highlights are claims, not adjectives.", detail: "\u2018Strong management team\u2019 is a killer. \u20185 acquisitions completed, avg 4.2 months to breakeven\u2019 is a highlight." },
  { rule: "Entry multiple on the page.", detail: "Don\u2019t make the buyer do the math. State the implied multiple explicitly. Buyers who have to calculate it assume the worst." },
  { rule: "Exit thesis in one sentence.", detail: "Strategics, sponsor-to-sponsor, or both. Year and multiple. If you can\u2019t write it in one sentence, you don\u2019t have a thesis yet." },
  { rule: "No typos. No logo misalignment. No orphaned text.", detail: "One-pagers are screened before CIMs are read. A formatting error signals disorganization at the company level. It shouldn\u2019t \u2014 but it does." },
];

export default function CompanyOnePager() {
  const [tab, setTab] = useState("builder");
  const [activeGroup, setActiveGroup] = useState(0);
  const [data, setData] = useState<Record<string, string>>({
    name: "", tagline: "", sector: "Business Services", founded: "", hq: "", states: "",
    employees: "", website: "", rev_ly: "", rev_cy: "", ebitda_ly: "", ebitda_cy: "",
    rev_2y: "", ebitda_2y: "", recurring_pct: "", gross_margin: "",
    ask: "", use_of_proceeds: "", structure: "S-Corp", mgmt_rollover: "", entry_multiple: "",
    exit_thesis: "", overview: "", highlight_1: "", highlight_2: "", highlight_3: "", highlight_4: "",
    ceo_name: "", ceo_bg: "", cfo_name: "", cfo_bg: "", ops_name: "", ops_bg: "",
    contact_name: "", contact_email: ""
  });

  const set = (key: string, val: string) => setData(d => ({ ...d, [key]: val }));

  const completedFields = Object.values(data).filter(v => v && v.toString().trim().length > 0).length;
  const totalFields = Object.values(data).length;
  const completionPct = Math.round((completedFields / totalFields) * 100);

  // Calculated metrics
  const ebitdaMarginLY = data.rev_ly && data.ebitda_ly ? ((parseFloat(data.ebitda_ly) / parseFloat(data.rev_ly)) * 100).toFixed(1) : null;
  const ebitdaMarginCY = data.rev_cy && data.ebitda_cy ? ((parseFloat(data.ebitda_cy) / parseFloat(data.rev_cy)) * 100).toFixed(1) : null;
  const revGrowth = data.rev_ly && data.rev_2y ? ((parseFloat(data.rev_ly) / parseFloat(data.rev_2y) - 1) * 100).toFixed(1) : null;
  const impliedValuation = data.ask && data.ebitda_ly ? (parseFloat(data.ask) / parseFloat(data.ebitda_ly)).toFixed(1) : null;

  const highlights = [data.highlight_1, data.highlight_2, data.highlight_3, data.highlight_4].filter(Boolean);

  return (
    <div style={{
      background: "#080910",
      minHeight: "100vh",
      fontFamily: "'IBM Plex Mono','Courier New',monospace",
      color: "#ddd8cc",
      padding: "24px 20px",
      maxWidth: 1200,
      margin: "0 auto"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Anton&family=Playfair+Display:wght@400;700&display=swap');
        button { cursor: pointer; font-family: inherit; }
        .tb { background: transparent; border: none; padding: 8px 16px; font-size: 10px; letter-spacing: 2px; transition: all .2s; }
        .tb.on { color: #c8a84b; border-bottom: 2px solid #c8a84b; }
        .tb:not(.on) { color: #2a2838; border-bottom: 2px solid transparent; }
        .tb:hover:not(.on) { color: #666; }
        input, textarea, select {
          background: #10111c; border: 1px solid #1e1e2c; color: #ccc;
          font-family: inherit; font-size: 11px; padding: 7px 10px;
          border-radius: 3px; width: 100%; box-sizing: border-box; outline: none;
          transition: border-color .15s;
        }
        input:focus, textarea:focus, select:focus { border-color: #c8a84b; }
        textarea { resize: vertical; line-height: 1.6; }
        select { appearance: none; }
        .card { background: #0b0c16; border: 1px solid #181826; border-radius: 5px; }

        /* One-pager print styles */
        .onepager {
          background: #fff;
          color: #111;
          font-family: 'Playfair Display', Georgia, serif;
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 4px 32px rgba(0,0,0,0.5);
        }
        .op-header {
          background: #0f1018;
          color: #fff;
          padding: 24px 28px 20px;
          border-bottom: 3px solid #c8a84b;
        }
        .op-section { padding: 16px 28px; border-bottom: 1px solid #eee; }
        .op-label { font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin-bottom: 4px; }
        .op-value { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #111; font-weight: 500; }
        .op-highlight { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #333; line-height: 1.5; }
        .op-metric-box { background: #f8f7f4; border: 1px solid #e8e4dc; border-radius: 3px; padding: 10px 14px; }
        .completion-bar { height: 3px; background: #1a1a26; border-radius: 2px; overflow: hidden; }
        .completion-fill { height: 100%; background: linear-gradient(90deg, #c8a84b, #8a6a3a); border-radius: 2px; transition: width .4s ease; }
        @media print {
          body { background: white; }
          .no-print { display: none !important; }
          .onepager { box-shadow: none; max-width: 100%; }
        }
      `}</style>

      {/* Header */}
      <div className="no-print" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
          <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 34, letterSpacing: 5, color: "#c8a84b", lineHeight: 1 }}>COMPANY</div>
          <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 34, letterSpacing: 5, color: "#222", lineHeight: 1 }}>ONE-PAGER</div>
          <div style={{ fontSize: 9, color: "#2a2838", letterSpacing: 3, marginLeft: 8 }}>MODULE #21 \u00b7 WAVE 2 COMPLETE</div>
        </div>

        {/* Completion bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="completion-bar">
              <div className="completion-fill" style={{ width: `${completionPct}%` }} />
            </div>
          </div>
          <div style={{ fontSize: 10, color: completionPct > 70 ? "#c8a84b" : "#555", letterSpacing: 1, whiteSpace: "nowrap" }}>
            {completionPct}% COMPLETE
          </div>
          <button onClick={() => window.print()} style={{
            background: "#c8a84b", border: "none", color: "#07080f",
            padding: "6px 16px", fontSize: 9, letterSpacing: 2, borderRadius: 3
          }}>
            PRINT / EXPORT
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="no-print" style={{ borderBottom: "1px solid #12121e", marginBottom: 20, display: "flex" }}>
        {["builder", "preview", "rules"].map(t => (
          <button key={t} className={`tb ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>{t.toUpperCase()}</button>
        ))}
      </div>

      {/* BUILDER */}
      {tab === "builder" && (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
          {/* Section nav */}
          <div>
            {FIELD_GROUPS.map((g, i) => (
              <div key={g.label} onClick={() => setActiveGroup(i)} style={{
                padding: "10px 14px", marginBottom: 6, borderRadius: 4, cursor: "pointer",
                border: `1px solid ${activeGroup === i ? g.color + "66" : "#181826"}`,
                background: activeGroup === i ? g.color + "0e" : "#0b0c16",
                borderLeft: `3px solid ${activeGroup === i ? g.color : g.color + "33"}`,
                transition: "all .15s"
              }}>
                <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 12, color: activeGroup === i ? g.color : "#444", letterSpacing: 2 }}>{g.label}</div>
                <div style={{ fontSize: 9, color: "#333", marginTop: 3 }}>
                  {g.fields.filter(f => data[f.key]?.length > 0).length}/{g.fields.length} filled
                </div>
              </div>
            ))}
          </div>

          {/* Fields */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 18, color: FIELD_GROUPS[activeGroup].color, letterSpacing: 3, marginBottom: 20 }}>
              {FIELD_GROUPS[activeGroup].label}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {FIELD_GROUPS[activeGroup].fields.map(f => (
                <div key={f.key} style={{ gridColumn: f.type === "textarea" ? "1 / -1" : "auto" }}>
                  <div style={{ fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 5 }}>{f.label.toUpperCase()}</div>
                  {f.type === "textarea" ? (
                    <textarea rows={3} placeholder={f.placeholder} value={data[f.key]} onChange={e => set(f.key, e.target.value)} />
                  ) : f.type === "select" ? (
                    <select value={data[f.key]} onChange={e => set(f.key, e.target.value)}>
                      {f.options!.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" placeholder={f.placeholder} value={data[f.key]} onChange={e => set(f.key, e.target.value)} />
                  )}
                </div>
              ))}
            </div>

            {/* Auto-calculated metrics */}
            {activeGroup === 1 && (ebitdaMarginLY || revGrowth) && (
              <div style={{ marginTop: 20, padding: "12px 14px", background: "#080910", border: "1px solid #5a8a6a33", borderRadius: 4 }}>
                <div style={{ fontSize: 9, color: "#5a8a6a", letterSpacing: 2, marginBottom: 8 }}>AUTO-CALCULATED</div>
                <div style={{ display: "flex", gap: 24, fontSize: 11, color: "#7aba8a" }}>
                  {ebitdaMarginLY && <div>EBITDA Margin (LY): <strong>{ebitdaMarginLY}%</strong></div>}
                  {ebitdaMarginCY && <div>EBITDA Margin (CY): <strong>{ebitdaMarginCY}%</strong></div>}
                  {revGrowth && <div>YoY Revenue Growth: <strong>{revGrowth}%</strong></div>}
                  {impliedValuation && <div>Implied EV/EBITDA: <strong>{impliedValuation}x</strong></div>}
                </div>
              </div>
            )}

            {/* Nav */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
              <button onClick={() => setActiveGroup(g => Math.max(0, g - 1))} disabled={activeGroup === 0}
                style={{ background: "transparent", border: "1px solid #1e1e2c", color: "#555", padding: "7px 18px", fontSize: 10, letterSpacing: 2, borderRadius: 3, opacity: activeGroup === 0 ? 0.3 : 1 }}>
                \u2190 BACK
              </button>
              <button onClick={() => { setActiveGroup(g => Math.min(FIELD_GROUPS.length - 1, g + 1)); if (activeGroup === FIELD_GROUPS.length - 2) setTab("preview"); }}
                style={{ background: activeGroup === FIELD_GROUPS.length - 1 ? "#c8a84b" : "transparent", border: `1px solid ${activeGroup === FIELD_GROUPS.length - 1 ? "#c8a84b" : "#1e1e2c"}`, color: activeGroup === FIELD_GROUPS.length - 1 ? "#080910" : "#555", padding: "7px 18px", fontSize: 10, letterSpacing: 2, borderRadius: 3 }}>
                {activeGroup === FIELD_GROUPS.length - 1 ? "PREVIEW ONE-PAGER \u2192" : "NEXT \u2192"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {tab === "preview" && (
        <div>
          <div className="no-print" style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 10, color: "#555" }}>
              {completionPct < 50
                ? "\u2691 Fill in more fields for a complete one-pager \u2014 switch to Builder tab"
                : completionPct < 80
                ? "Looking good \u2014 a few more fields will sharpen the output"
                : "\u2713 Strong completion \u2014 ready to present"}
            </div>
            <button onClick={() => window.print()} style={{ background: "#c8a84b", border: "none", color: "#080910", padding: "7px 20px", fontSize: 10, letterSpacing: 2, borderRadius: 3 }}>
              PRINT / EXPORT PDF
            </button>
          </div>

          <div className="onepager">
            {/* Header */}
            <div className="op-header">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 32, letterSpacing: 4, color: "#c8a84b", lineHeight: 1 }}>
                    {data.name || "COMPANY NAME"}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#aaa", marginTop: 6, letterSpacing: 1 }}>
                    {data.tagline || "Business descriptor goes here"}
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                    {[
                      data.sector,
                      data.hq && `HQ: ${data.hq}`,
                      data.states && `Serves: ${data.states}`,
                      data.founded && `Est. ${data.founded}`,
                      data.employees && `${data.employees} employees`
                    ].filter(Boolean).map((item, i) => (
                      <div key={i} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#888", letterSpacing: 1 }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {data.ask && (
                    <div>
                      <div className="op-label" style={{ color: "#888" }}>EQUITY SOUGHT</div>
                      <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 26, color: "#c8a84b", letterSpacing: 2 }}>{fmt(data.ask)}</div>
                    </div>
                  )}
                  {(data.entry_multiple || impliedValuation) && (
                    <div style={{ marginTop: 6 }}>
                      <div className="op-label" style={{ color: "#888" }}>ENTRY MULTIPLE</div>
                      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, color: "#aaa" }}>
                        {data.entry_multiple || impliedValuation}x EBITDA
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Key metrics strip */}
            <div style={{ background: "#f9f8f5", borderBottom: "1px solid #e8e4dc", padding: "14px 28px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
                {[
                  ["LTM REVENUE", fmt(data.rev_ly)],
                  ["LTM EBITDA", fmt(data.ebitda_ly)],
                  ["EBITDA MARGIN", ebitdaMarginLY ? `${ebitdaMarginLY}%` : "\u2014"],
                  ["YOY GROWTH", revGrowth ? `${revGrowth}%` : "\u2014"],
                  ["RECURRING REV", data.recurring_pct ? `${data.recurring_pct}%` : "\u2014"],
                  ["GROSS MARGIN", data.gross_margin ? `${data.gross_margin}%` : "\u2014"],
                ].map(([label, val]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div className="op-label">{label}</div>
                    <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 18, color: "#111", letterSpacing: 1 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two column body */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {/* Left column */}
              <div style={{ borderRight: "1px solid #eee" }}>
                {/* Business overview */}
                <div className="op-section">
                  <div className="op-label" style={{ color: "#c8a84b", marginBottom: 8 }}>BUSINESS OVERVIEW</div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#444", lineHeight: 1.8 }}>
                    {data.overview || "Business description will appear here once entered in the builder."}
                  </div>
                </div>

                {/* Investment highlights */}
                {highlights.length > 0 && (
                  <div className="op-section">
                    <div className="op-label" style={{ color: "#c8a84b", marginBottom: 10 }}>INVESTMENT HIGHLIGHTS</div>
                    {highlights.map((h, i) => (
                      <div key={i} className="op-highlight">
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#c8a84b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#080910", fontFamily: "'Anton',sans-serif", flexShrink: 0, marginTop: 1 }}>
                          {i + 1}
                        </div>
                        <div>{h}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Exit thesis */}
                {data.exit_thesis && (
                  <div className="op-section">
                    <div className="op-label" style={{ color: "#c8a84b", marginBottom: 6 }}>EXIT THESIS</div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#444", lineHeight: 1.7, fontStyle: "italic" }}>
                      "{data.exit_thesis}"
                    </div>
                  </div>
                )}
              </div>

              {/* Right column */}
              <div>
                {/* Financial snapshot */}
                <div className="op-section">
                  <div className="op-label" style={{ color: "#5a8a6a", marginBottom: 10 }}>FINANCIAL SNAPSHOT</div>
                  <table style={{ width: "100%", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e8e4dc" }}>
                        {["", "2 Yrs Ago", "LY Actual", "CY Est"].map(h => (
                          <td key={h} style={{ padding: "4px 6px", color: "#999", fontSize: 8, letterSpacing: 1 }}>{h}</td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #f0ede8" }}>
                        <td style={{ padding: "5px 6px", color: "#999", fontSize: 8 }}>REVENUE</td>
                        <td style={{ padding: "5px 6px", fontWeight: 500 }}>{fmt(data.rev_2y)}</td>
                        <td style={{ padding: "5px 6px", fontWeight: 500 }}>{fmt(data.rev_ly)}</td>
                        <td style={{ padding: "5px 6px", color: "#5a8a6a", fontWeight: 600 }}>{fmt(data.rev_cy)}</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #f0ede8" }}>
                        <td style={{ padding: "5px 6px", color: "#999", fontSize: 8 }}>EBITDA</td>
                        <td style={{ padding: "5px 6px", fontWeight: 500 }}>{fmt(data.ebitda_2y)}</td>
                        <td style={{ padding: "5px 6px", fontWeight: 500 }}>{fmt(data.ebitda_ly)}</td>
                        <td style={{ padding: "5px 6px", color: "#5a8a6a", fontWeight: 600 }}>{fmt(data.ebitda_cy)}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "5px 6px", color: "#999", fontSize: 8 }}>MARGIN</td>
                        <td style={{ padding: "5px 6px" }}>
                          {data.rev_2y && data.ebitda_2y ? `${((parseFloat(data.ebitda_2y) / parseFloat(data.rev_2y)) * 100).toFixed(1)}%` : "\u2014"}
                        </td>
                        <td style={{ padding: "5px 6px" }}>{ebitdaMarginLY ? `${ebitdaMarginLY}%` : "\u2014"}</td>
                        <td style={{ padding: "5px 6px", color: "#5a8a6a" }}>{ebitdaMarginCY ? `${ebitdaMarginCY}%` : "\u2014"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Capital structure */}
                <div className="op-section">
                  <div className="op-label" style={{ color: "#5a8a6a", marginBottom: 10 }}>CAPITAL STRUCTURE & ASK</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      ["ENTITY", data.structure || "\u2014"],
                      ["EQUITY SOUGHT", fmt(data.ask)],
                      ["MGMT ROLLOVER", data.mgmt_rollover ? `${data.mgmt_rollover}%` : "\u2014"],
                      ["ENTRY MULTIPLE", data.entry_multiple ? `${data.entry_multiple}x` : impliedValuation ? `${impliedValuation}x` : "\u2014"],
                    ].map(([label, val]) => (
                      <div key={label} className="op-metric-box">
                        <div className="op-label">{label}</div>
                        <div className="op-value">{val}</div>
                      </div>
                    ))}
                  </div>
                  {data.use_of_proceeds && (
                    <div style={{ marginTop: 10, fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#666" }}>
                      <span style={{ color: "#999", letterSpacing: 1 }}>USE OF PROCEEDS: </span>{data.use_of_proceeds}
                    </div>
                  )}
                </div>

                {/* Management */}
                <div className="op-section">
                  <div className="op-label" style={{ color: "#5a8a6a", marginBottom: 10 }}>MANAGEMENT</div>
                  {[
                    [data.ceo_name, "CEO / PRESIDENT", data.ceo_bg],
                    [data.cfo_name, "CFO / FINANCE", data.cfo_bg],
                    [data.ops_name, "VP OPERATIONS", data.ops_bg],
                  ].filter(([name]) => name).map(([name, role, bg], i) => (
                    <div key={i} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: i < 2 ? "1px solid #f0ede8" : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#111", fontWeight: 600 }}>{name}</div>
                        <div className="op-label">{role}</div>
                      </div>
                      {bg && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#777", marginTop: 2 }}>{bg}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ background: "#0f1018", padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#666" }}>
                CONFIDENTIAL \u2014 FOR QUALIFIED INVESTORS ONLY \u00b7 NOT AN OFFER TO SELL SECURITIES
              </div>
              {(data.contact_name || data.contact_email || data.website) && (
                <div style={{ textAlign: "right", fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#888" }}>
                  {data.contact_name && <div>{data.contact_name}</div>}
                  {data.contact_email && <div>{data.contact_email}</div>}
                  {data.website && <div>{data.website}</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RULES */}
      {tab === "rules" && (
        <div>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 20, lineHeight: 1.7 }}>
            PE readers see hundreds of one-pagers. These are the rules that separate the ones that get a call from the ones that get filed.
          </div>
          {RULES.map((r, i) => (
            <div key={i} className="card" style={{ marginBottom: 10, padding: "16px 20px", borderLeft: "3px solid #c8a84b33" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 22, color: "#c8a84b44", flexShrink: 0, lineHeight: 1, marginTop: 2 }}>{i + 1}</div>
                <div>
                  <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 14, color: "#c8a84b", letterSpacing: 2, marginBottom: 6 }}>{r.rule.toUpperCase()}</div>
                  <div style={{ fontSize: 11, color: "#888", lineHeight: 1.7 }}>{r.detail}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Curriculum complete banner */}
          <div style={{ marginTop: 24, padding: "20px 24px", background: "#0a0c0a", border: "1px solid #5a8a6a44", borderRadius: 6, textAlign: "center" }}>
            <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 18, color: "#5a8a6a", letterSpacing: 4, marginBottom: 8 }}>WAVE 2 COMPLETE</div>
            <div style={{ fontSize: 10, color: "#555", lineHeight: 1.9 }}>
              Synergy Engine \u00b7 Process Letter Academy \u00b7 Life After Exit<br />
              PE Pitch Deck Builder \u00b7 Deal Structure Lab \u00b7 Company One-Pager
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
