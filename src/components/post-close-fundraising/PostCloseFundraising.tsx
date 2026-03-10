import { useState } from "react";

const fmt = (n: number | string | undefined | null, d: number = 1): string => {
  if (!n && n !== 0) return "\u2014";
  const v = parseFloat(String(n));
  if (isNaN(v)) return "\u2014";
  if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(d)}B`;
  if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(d)}M`;
  if (Math.abs(v) >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(d)}`;
};
const fmtPct = (n: number | string, d: number = 1): string =>
  isNaN(parseFloat(String(n))) ? "\u2014" : `${parseFloat(String(n)).toFixed(d)}%`;

interface RaiseType {
  id: string;
  label: string;
  color: string;
  headline: string;
  when: string;
  dilution: string;
  complexity: string;
  speed: string;
  detail: string;
  ownerImpact: string;
  example: string;
  proTip: string;
}

const RAISE_TYPES: RaiseType[] = [
  {
    id: "co-invest",
    label: "PE CO-INVESTMENT",
    color: "#3B82F6",
    headline: "Your existing PE sponsor writes another check to fund the acquisition.",
    when: "Existing sponsor has dry powder, likes the target, and wants to increase their position in the platform.",
    dilution: "MODERATE",
    complexity: "LOW",
    speed: "FAST",
    detail: "The cleanest path if your sponsor is willing. No new investor DD, no new relationship to manage. The sponsor knows the business. Downside: they gain more ownership and more control. Their position grows relative to yours.",
    ownerImpact: "Your % shrinks proportionally. But the sponsor\u2019s alignment with your exit remains intact \u2014 same incentives, same timeline.",
    example: "Sponsor owns 65%, you own 20%, management owns 15%. Sponsor co-invests $4M for the acquisition. New capital comes in at same valuation. Sponsor % increases, yours and management dilute proportionally.",
    proTip: "Negotiate your right to participate pro-rata in any co-investment before you close the original deal. It\u2019s easier to get in the original docs than to fight for it when a deal appears.",
  },
  {
    id: "new-partner",
    label: "NEW PE PARTNER",
    color: "#5a8a9a",
    headline: "Bring in a new investor \u2014 either alongside or replacing your existing sponsor.",
    when: "Your existing sponsor is tapped out, doesn\u2019t like the acquisition target, or you want fresh capital and a new relationship with more relevant expertise.",
    dilution: "HIGH",
    complexity: "HIGH",
    speed: "SLOW",
    detail: "A full new investment process. The new partner will run DD on OldCo AND the acquisition target. Expect 3\u20136 months and full management presentations. Your existing sponsor may need to sell down their position to make room.",
    ownerImpact: "Significant dilution event. New partner comes in, existing sponsor may partially exit, your rollover % resets in the new structure. The upside: if the new partner\u2019s capital and network accelerate growth, your smaller % of a larger pie is the trade.",
    example: "OldCo valued at $30M. New partner invests $10M at $30M pre-money. Post-money = $40M. Every existing holder dilutes 25%. If you owned 20% you now own 15% \u2014 but of a better-capitalized business.",
    proTip: "Never bring in a new PE partner without a full waterfall model showing your proceeds under 3 exit scenarios at the new cap table. The headline ownership % is not the number that matters.",
  },
  {
    id: "debt",
    label: "DEBT-FUNDED ACQUISITION",
    color: "#5a8a6a",
    headline: "Borrow to acquire. No new equity \u2014 no dilution to existing owners.",
    when: "OldCo has low leverage, strong cash flow, and the acquisition target is accretive to EBITDA immediately. Lenders will support the combined leverage.",
    dilution: "NONE",
    complexity: "MEDIUM",
    speed: "MEDIUM",
    detail: "The no-dilution path. OldCo takes on additional debt to fund the acquisition. Your ownership % stays identical. The cost: OldCo\u2019s balance sheet is more leveraged, reducing the cushion for downside scenarios.",
    ownerImpact: "Zero ownership dilution. But higher leverage reduces equity value in a downside scenario. The math: if OldCo goes from 3x to 5x leverage and EBITDA softens 20%, you\u2019re at covenant risk \u2014 which has its own dilution mechanism (lender control).",
    example: "OldCo at $5M EBITDA, $12M debt (2.4x). Acquire target at $2M EBITDA for $10M (5x). New debt = $22M on $7M combined EBITDA = 3.1x. Manageable. You own the same %, but of a larger, more leveraged business.",
    proTip: "Run the combined leverage ratio through a downside scenario before committing. 3x leverage with 20% EBITDA haircut = 3.75x. 4.5x leverage with the same haircut = 5.6x. The difference is covenant breach.",
  },
  {
    id: "owner-fund",
    label: "OWNER PARTICIPATION",
    color: "#6a5a9a",
    headline: "You write a check alongside the raise \u2014 protecting your ownership percentage.",
    when: "A raise is happening (sponsor co-invest or new partner) and you have personal capital to deploy. Participating pro-rata maintains your % instead of watching it dilute.",
    dilution: "NONE (if full pro-rata)",
    complexity: "LOW",
    speed: "FAST",
    detail: "If outside capital is coming in, you have the right (if negotiated) to participate pro-rata. Meaning: if a $10M raise would dilute you from 20% to 15%, investing your pro-rata share ($2.5M) keeps you at 20%.",
    ownerImpact: "You write a check. Your % stays the same. The risk: you\u2019re concentrating more personal capital in an illiquid asset. The reward: full participation in the value created by the acquisition.",
    example: "You own 20% of a $25M business. $5M raise at $25M pre-money (20% dilution). Pro-rata to maintain 20% = $1M personal investment. Post-raise: you\u2019ve invested $1M more but maintained 20% of a $30M business.",
    proTip: "Negotiate pro-rata participation rights in the original deal docs. Without them, the sponsor controls whether you can invest alongside. With them, you have the right but not the obligation to participate in every future raise.",
  },
];

interface QuizQuestion {
  q: string;
  opts: string[];
  correct: number;
  explain: string;
}

const QUIZ: QuizQuestion[] = [
  {
    q: "You own 18% of OldCo valued at $28M. Your PE sponsor wants to acquire a competitor for $8M using a $6M equity raise at OldCo\u2019s current valuation, with $2M in new debt. You don\u2019t participate in the raise. What is your ownership after the raise?",
    opts: [
      "18% \u2014 debt doesn\u2019t dilute equity",
      "15.1% \u2014 diluted by the new equity raise",
      "16.4% \u2014 only partially diluted because half is debt",
      "18% \u2014 your existing shares don\u2019t change count",
    ],
    correct: 1,
    explain:
      "Post-money valuation = $28M + $6M equity = $34M. Your shares haven\u2019t changed but the total is larger. New ownership = ($28M \u00d7 18%) / $34M = $5.04M / $34M = 14.8% \u2248 15.1%. The debt component doesn\u2019t dilute you \u2014 only the equity raise does. To maintain 18%, you\u2019d need to invest $6M \u00d7 18% = $1.08M pro-rata.",
  },
  {
    q: "OldCo has $4.2M EBITDA and $14M in debt (3.3x leverage). You want to acquire a tuck-in at $1.8M EBITDA for $9M (5x). You\u2019re considering debt vs. equity to fund it. At what combined leverage multiple does debt funding become a covenant risk assuming your lender\u2019s covenant is 5.5x?",
    opts: [
      "Already in breach \u2014 combined leverage exceeds 5.5x immediately",
      "3.9x \u2014 well within covenant, debt funding is safe",
      "4.0x combined \u2014 safe today but a 15% EBITDA decline breaches the covenant",
      "5.5x \u2014 exactly at the covenant line with no cushion",
    ],
    correct: 2,
    explain:
      "Combined EBITDA = $4.2M + $1.8M = $6.0M. New debt = $14M + $9M = $23M. Leverage = $23M / $6M = 3.83x \u2014 safe today. But a 15% EBITDA decline brings combined EBITDA to $5.1M: $23M / $5.1M = 4.5x \u2014 still safe. A 28% decline brings it to $4.3M: $23M / $4.3M = 5.35x \u2014 approaching the 5.5x covenant. The cushion exists but is not unlimited. Model the downside before committing.",
  },
  {
    q: "You\u2019re negotiating the original PE deal. Your lawyer says you can include pro-rata participation rights in the term sheet for free \u2014 the sponsor doesn\u2019t care. Your CFO says it\u2019s unnecessary complexity. Who is right?",
    opts: [
      "CFO \u2014 pro-rata rights add legal complexity for a right you may never use",
      "Lawyer \u2014 pro-rata rights cost nothing now and are worth significant money later",
      "Neither \u2014 pro-rata rights are standard and don\u2019t need to be negotiated",
      "Depends on how much personal capital you have available",
    ],
    correct: 1,
    explain:
      "Pro-rata rights are a free option at close that can be worth $1M+ in a future raise. Without them, the sponsor controls whether you can invest alongside any future capital raise. With them, you have the right \u2014 but never the obligation \u2014 to maintain your % in every future raise. This is one of the most commonly missed negotiating points in lower middle market PE deals. Always include them in the original docs.",
  },
  {
    q: "OldCo is valued at $22M. You own 22%. A new PE partner wants to invest $8M at $22M pre-money to fund two acquisitions. The new partner is bringing $30M in deal flow and industry relationships your current sponsor lacks. Should you participate pro-rata to protect your 22%?",
    opts: [
      "Yes \u2014 always protect your ownership percentage",
      "Depends \u2014 model what 22% of the current business is worth vs. a smaller % of the larger business the new partner enables",
      "No \u2014 concentrating more personal capital in an illiquid asset is always wrong",
      "Yes, but only if you can negotiate the new partner\u2019s entry valuation higher",
    ],
    correct: 1,
    explain:
      "This is the core dilution math every operator must run. Your 22% of $22M = $4.84M current value. Post-raise without participation: you own 16.3% of $30M = $4.89M \u2014 essentially flat today. But if the new partner\u2019s deal flow adds $3M EBITDA at 7x over 3 years, the business is worth $51M+. Your 16.3% = $8.3M vs. your 22% = $11.2M if you participated. The question is always: how much value does the new capital create, and what\u2019s your pro-rata cost to stay in full?",
  },
  {
    q: "You just closed on OldCo. You own 17% rollover equity. 18 months later you acquire a competitor using a $5M equity raise at $35M pre-money (OldCo was $28M at close \u2014 good EBITDA growth). You participate pro-rata. What has happened to your economic position?",
    opts: [
      "You\u2019ve diluted yourself by investing more personal capital",
      "You\u2019ve maintained your % but your absolute equity value has increased because the pre-money is higher",
      "Nothing changes \u2014 pro-rata participation is neutral",
      "You\u2019ve increased your % because you invested at a higher valuation",
    ],
    correct: 1,
    explain:
      "Pro-rata at a higher pre-money is the compounding mechanism of rollover equity. At close your 17% was worth 17% \u00d7 $28M = $4.76M. 18 months later, pre-money is $35M \u2014 your 17% is now worth $5.95M before you write a check. You then invest your pro-rata ($5M \u00d7 17% = $850K) to maintain 17% of the $40M post-money business ($6.8M). Your equity value grew from $4.76M to $6.8M in 18 months \u2014 and you still own 17%. This is the second bite compounding.",
  },
];

type TabId = "howItWorks" | "dilution" | "raiseTypes" | "quiz";

const DilutionBar = ({
  label,
  before,
  after,
  color,
}: {
  label: string;
  before: number;
  after: number;
  color: string;
}) => (
  <div style={{ marginBottom: 14 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 9,
        color: "#555",
        marginBottom: 4,
      }}
    >
      <span style={{ color }}>{label}</span>
      <span
        style={{
          color:
            after < before ? "#8a4a4a" : after > before ? "#5a8a6a" : "#888",
        }}
      >
        {fmtPct(before)} &rarr; <strong>{fmtPct(after)}</strong>
        {before > 0 && ` (${(after - before).toFixed(1)}pp)`}
      </span>
    </div>
    <div style={{ display: "flex", gap: 4 }}>
      <div
        style={{
          flex: 1,
          height: 8,
          background: "#17305a",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, before)}%`,
            background: color + "55",
            borderRadius: 2,
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          height: 8,
          background: "#17305a",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, after)}%`,
            background: color,
            borderRadius: 2,
            transition: "width .4s",
          }}
        />
      </div>
    </div>
  </div>
);

export default function PostCloseFundraising() {
  const [tab, setTab] = useState<TabId>("howItWorks");
  const [activeRaise, setActiveRaise] = useState("co-invest");
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Dilution calculator
  const [oldCoVal, setOldCoVal] = useState("28000000");
  const [yourPct, setYourPct] = useState("20");
  const [sponsorPct, setSponsorPct] = useState("65");
  const [mgmtPct, setMgmtPct] = useState("15");
  const [raiseAmt, setRaiseAmt] = useState("6000000");
  const [participate, setParticipate] = useState("0");
  const [acqEBITDA, setAcqEBITDA] = useState("1500000");
  const [acqMult, setAcqMult] = useState("5.5");
  const [oldCoEBITDA, setOldCoEBITDA] = useState("4000000");
  const [exitMult, setExitMult] = useState("8.0");

  const raise = parseFloat(raiseAmt) || 0;
  const preMoney = parseFloat(oldCoVal) || 0;
  const postMoney = preMoney + raise;
  const yourShares = preMoney * ((parseFloat(yourPct) || 0) / 100);
  const yourParticipation = parseFloat(participate) || 0;
  const yourPostShares = yourShares + yourParticipation;
  const yourPostPct =
    postMoney > 0 ? (yourPostShares / postMoney) * 100 : 0;
  const sponsorPostPct =
    postMoney > 0
      ? ((preMoney * ((parseFloat(sponsorPct) || 0) / 100)) / postMoney) * 100
      : 0;
  const mgmtPostPct =
    postMoney > 0
      ? ((preMoney * ((parseFloat(mgmtPct) || 0) / 100)) / postMoney) * 100
      : 0;
  const newInvestorPct =
    postMoney > 0 ? ((raise - yourParticipation) / postMoney) * 100 : 0;

  const acqPrice = (parseFloat(acqEBITDA) || 0) * (parseFloat(acqMult) || 0);
  const combinedEBITDA =
    (parseFloat(oldCoEBITDA) || 0) + (parseFloat(acqEBITDA) || 0);
  const combinedVal = combinedEBITDA * (parseFloat(exitMult) || 0);
  const yourExitValue = (combinedVal * yourPostPct) / 100;
  const yourExitValueNoPart =
    (combinedVal * ((yourShares / postMoney) * 100)) / 100;
  const participationGain = yourExitValue - yourExitValueNoPart;

  // "Without raise" exit: OldCo EBITDA * exit multiple * your %
  const impliedCurrentMult =
    (parseFloat(oldCoVal) || 28000000) / (parseFloat(oldCoEBITDA) || 4000000);
  const noRaiseExitValue =
    (preMoney * ((parseFloat(yourPct) || 0) / 100) * (parseFloat(exitMult) || 0)) /
    impliedCurrentMult;

  const raise_type = RAISE_TYPES.find((r) => r.id === activeRaise)!;

  const handleQuiz = (i: number) => {
    if (quizRevealed) return;
    setQuizSelected(i);
    setQuizRevealed(true);
    if (i === QUIZ[quizIdx].correct) setQuizScore((s) => s + 1);
  };
  const nextQ = () => {
    if (quizIdx < QUIZ.length - 1) {
      setQuizIdx((i) => i + 1);
      setQuizSelected(null);
      setQuizRevealed(false);
    } else {
      setQuizDone(true);
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "howItWorks", label: "HOW IT WORKS" },
    { id: "dilution", label: "DILUTION" },
    { id: "raiseTypes", label: "RAISE TYPES" },
    { id: "quiz", label: "QUIZ" },
  ];

  return (
    <div
      style={{
        background: "#0f1d3d",
        minHeight: "100vh",
        color: "#e5e7eb",
        padding: "24px 20px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <style>{`

        .pcf-tb{background:transparent;border:none;padding:9px 18px;font-size:10px;letter-spacing:2px;transition:all .2s;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;}
        .pcf-tb.on{color:#3B82F6;border-bottom-color:#3B82F6;}
        .pcf-tb:not(.on){color:#2a2838;}
        .pcf-tb:hover:not(.on){color:#555;}
        .pcf-card{background:#0f1d3d;border:1px solid #1c2a4a;border-radius:5px;}
        .pcf-input{background:#17305a;border:1px solid #1c2a4a;color:#ccc;font-family:inherit;font-size:11px;padding:7px 10px;border-radius:3px;width:100%;box-sizing:border-box;outline:none;transition:border-color .15s;}
        .pcf-input:focus{border-color:#3B82F6;}
        .pcf-node{background:#0f1d3d;border:1px solid #1c2a4a;border-radius:4px;padding:10px 14px;text-align:center;}
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 6,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{ fontSize: 36,
              letterSpacing: 6,
              color: "#3B82F6",
              lineHeight: 1,
            }}
          >
            POST-CLOSE
          </div>
          <div
            style={{ fontSize: 36,
              letterSpacing: 6,
              color: "#1c2a4a",
              lineHeight: 1,
            }}
          >
            FUNDRAISING
          </div>
          <span
            className="inline-block px-2 py-0.5 text-[10px] font-semibold tracking-widest rounded"
            style={{
              background: "rgba(59,130,246,0.2)",
              color: "rgb(96,165,250)",
              border: "1px solid rgba(59,130,246,0.3)",
            }}
          >
            NEW
          </span>
          <div
            style={{
              fontSize: 9,
              color: "#2a2838",
              letterSpacing: 3,
              marginLeft: 8,
            }}
          >
            I JUST CLOSED &middot; GROWTH CAPITAL
          </div>
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#333",
            lineHeight: 1.7,
            maxWidth: 660,
          }}
        >
          You closed. You own equity in OldCo. Now you want to acquire another
          company. You need capital. Capital means new investors. New investors
          mean dilution. This module is about understanding exactly what that
          trade looks like &mdash; and when it&rsquo;s worth making.
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          borderBottom: "1px solid #17305a",
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`pcf-tb ${tab === t.id ? "on" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── HOW IT WORKS ── */}
      {tab === "howItWorks" && (
        <div>
          {/* Structure diagram */}
          <div className="pcf-card" style={{ padding: "24px", marginBottom: 16 }}>
            <div
              style={{
                fontSize: 9,
                color: "#3B82F6",
                letterSpacing: 2,
                marginBottom: 20,
              }}
            >
              THE STRUCTURE &mdash; BEFORE AND AFTER ACQUISITION RAISE
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 1fr",
                gap: 8,
                alignItems: "center",
              }}
            >
              {/* Before */}
              <div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#555",
                    letterSpacing: 2,
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  BEFORE RAISE
                </div>
                <div
                  className="pcf-node"
                  style={{ borderColor: "#3B82F644", marginBottom: 8 }}
                >
                  <div style={{ fontSize: 9, color: "#555", letterSpacing: 1 }}>
                    YOU
                  </div>
                  <div
                    style={{ fontSize: 18,
                      color: "#3B82F6",
                    }}
                  >
                    20%
                  </div>
                  <div style={{ fontSize: 9, color: "#333" }}>of OldCo</div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <div className="pcf-node">
                    <div style={{ fontSize: 8, color: "#555" }}>PE SPONSOR</div>
                    <div
                      style={{ fontSize: 16,
                        color: "#5a8a9a",
                      }}
                    >
                      65%
                    </div>
                  </div>
                  <div className="pcf-node">
                    <div style={{ fontSize: 8, color: "#555" }}>MANAGEMENT</div>
                    <div
                      style={{ fontSize: 16,
                        color: "#6a5a9a",
                      }}
                    >
                      15%
                    </div>
                  </div>
                </div>
                <div
                  className="pcf-node"
                  style={{ borderColor: "#1c2a4a" }}
                >
                  <div style={{ fontSize: 9, color: "#555", letterSpacing: 1 }}>
                    OldCo
                  </div>
                  <div
                    style={{ fontSize: 16,
                      color: "#888",
                    }}
                  >
                    $4M EBITDA
                  </div>
                  <div style={{ fontSize: 9, color: "#333" }}>
                    $28M valuation
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, color: "#3B82F6" }}>&rarr;</div>
                <div
                  style={{
                    fontSize: 8,
                    color: "#555",
                    letterSpacing: 1,
                    marginTop: 4,
                  }}
                >
                  RAISE
                  <br />
                  +ACQUIRE
                </div>
              </div>

              {/* After */}
              <div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#555",
                    letterSpacing: 2,
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  AFTER RAISE + ACQUISITION
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <div
                    className="pcf-node"
                    style={{ borderColor: "#3B82F633" }}
                  >
                    <div style={{ fontSize: 8, color: "#555" }}>YOU</div>
                    <div
                      style={{ fontSize: 16,
                        color: "#3B82F6",
                      }}
                    >
                      15%
                    </div>
                    <div style={{ fontSize: 8, color: "#8a4a4a" }}>diluted</div>
                  </div>
                  <div className="pcf-node">
                    <div style={{ fontSize: 8, color: "#555" }}>SPONSOR</div>
                    <div
                      style={{ fontSize: 16,
                        color: "#5a8a9a",
                      }}
                    >
                      49%
                    </div>
                    <div style={{ fontSize: 8, color: "#8a4a4a" }}>diluted</div>
                  </div>
                  <div
                    className="pcf-node"
                    style={{ borderColor: "#5a8a6a33" }}
                  >
                    <div style={{ fontSize: 8, color: "#555" }}>NEW INV.</div>
                    <div
                      style={{ fontSize: 16,
                        color: "#5a8a6a",
                      }}
                    >
                      18%
                    </div>
                    <div style={{ fontSize: 8, color: "#5a8a6a" }}>new</div>
                  </div>
                </div>
                <div
                  className="pcf-node"
                  style={{ borderColor: "#5a8a6a33", marginBottom: 8 }}
                >
                  <div style={{ fontSize: 9, color: "#555", letterSpacing: 1 }}>
                    OldCo (HoldCo)
                  </div>
                  <div
                    style={{ fontSize: 16,
                      color: "#5a8a6a",
                    }}
                  >
                    $5.5M EBITDA
                  </div>
                  <div style={{ fontSize: 9, color: "#333" }}>
                    $34M post-money
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    color: "#333",
                    marginBottom: 8,
                  }}
                >
                  &darr; owns
                </div>
                <div
                  className="pcf-node"
                  style={{ borderColor: "#8a6a3a33" }}
                >
                  <div
                    style={{ fontSize: 9, color: "#8a6a3a", letterSpacing: 1 }}
                  >
                    AcquiredCo
                  </div>
                  <div
                    style={{ fontSize: 16,
                      color: "#8a6a3a",
                    }}
                  >
                    $1.5M EBITDA
                  </div>
                  <div style={{ fontSize: 9, color: "#333" }}>
                    acquired for $8.25M
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Three truths */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              marginBottom: 12,
            }}
          >
            {[
              {
                title: "DILUTION IS A TRADE",
                color: "#3B82F6",
                body: "You give up % ownership of OldCo. In return you get capital that buys a business that makes OldCo more valuable. The question is never \u2018did I dilute?\u2019 \u2014 it\u2019s \u2018did the value I created exceed the % I gave up?\u2019",
              },
              {
                title: "YOUR % SHRINKS, YOUR $ MAY GROW",
                color: "#5a8a6a",
                body: "20% of a $28M business = $5.6M. 15% of a $40M business = $6M. Dilution that creates value is not the same as dilution that destroys it. The math, not the percentage, is what matters.",
              },
              {
                title: "PRO-RATA IS YOUR PROTECTION",
                color: "#6a5a9a",
                body: "If you have pro-rata participation rights (negotiate these at close), you can invest alongside any raise to maintain your %. You have the right, never the obligation. Cost: personal capital in an illiquid asset.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="pcf-card"
                style={{
                  padding: "16px 18px",
                  borderLeft: `3px solid ${c.color}33`,
                }}
              >
                <div
                  style={{ fontSize: 12,
                    color: c.color,
                    letterSpacing: 2,
                    marginBottom: 8,
                  }}
                >
                  {c.title}
                </div>
                <div style={{ fontSize: 11, color: "#666", lineHeight: 1.8 }}>
                  {c.body}
                </div>
              </div>
            ))}
          </div>

          {/* The key question */}
          <div
            className="pcf-card"
            style={{
              padding: "16px 20px",
              borderLeft: "3px solid #3B82F633",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "#3B82F6",
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              THE QUESTION EVERY OPERATOR MUST ANSWER BEFORE AGREEING TO A RAISE
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#ccc",
                lineHeight: 1.8,
                fontStyle: "italic",
                marginBottom: 12,
              }}
            >
              &ldquo;What is my current equity worth today &mdash; and what will
              it be worth after this acquisition at my new diluted
              percentage?&rdquo;
            </div>
            <div style={{ fontSize: 11, color: "#666", lineHeight: 1.8 }}>
              If the acquisition adds $1.5M EBITDA at a 7x exit multiple,
              that&rsquo;s $10.5M of new value in the business. At 15%
              post-dilution, your share of that new value is $1.575M. If you
              gave up 5 percentage points to get it, model whether 5% &times;
              current valuation is more or less than the value the acquisition
              creates. That math &mdash; not the ownership percentage &mdash; is
              the decision.
            </div>
          </div>
        </div>
      )}

      {/* ── DILUTION CALCULATOR ── */}
      {tab === "dilution" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: 16,
          }}
        >
          <div>
            <div
              className="pcf-card"
              style={{ padding: "18px 20px", marginBottom: 12 }}
            >
              <div
                style={{ fontSize: 14,
                  color: "#3B82F6",
                  letterSpacing: 3,
                  marginBottom: 14,
                }}
              >
                CURRENT STRUCTURE
              </div>
              {[
                {
                  label: "OldCo Valuation ($)",
                  val: oldCoVal,
                  set: setOldCoVal,
                  ph: "28000000",
                },
                {
                  label: "Your Ownership %",
                  val: yourPct,
                  set: setYourPct,
                  ph: "20",
                },
                {
                  label: "PE Sponsor %",
                  val: sponsorPct,
                  set: setSponsorPct,
                  ph: "65",
                },
                {
                  label: "Management %",
                  val: mgmtPct,
                  set: setMgmtPct,
                  ph: "15",
                },
              ].map(({ label, val, set, ph }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#555",
                      letterSpacing: 2,
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  <input
                    className="pcf-input"
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    placeholder={ph}
                  />
                </div>
              ))}
            </div>

            <div
              className="pcf-card"
              style={{ padding: "18px 20px", marginBottom: 12 }}
            >
              <div
                style={{ fontSize: 14,
                  color: "#5a8a9a",
                  letterSpacing: 3,
                  marginBottom: 14,
                }}
              >
                RAISE &amp; ACQUISITION
              </div>
              {[
                {
                  label: "Equity Raise ($)",
                  val: raiseAmt,
                  set: setRaiseAmt,
                  ph: "6000000",
                },
                {
                  label: "Your Participation ($)",
                  val: participate,
                  set: setParticipate,
                  ph: "0",
                },
                {
                  label: "Target EBITDA ($)",
                  val: acqEBITDA,
                  set: setAcqEBITDA,
                  ph: "1500000",
                },
                {
                  label: "Target Entry Multiple",
                  val: acqMult,
                  set: setAcqMult,
                  ph: "5.5",
                },
              ].map(({ label, val, set, ph }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#555",
                      letterSpacing: 2,
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  <input
                    className="pcf-input"
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    placeholder={ph}
                  />
                </div>
              ))}
            </div>

            <div className="pcf-card" style={{ padding: "18px 20px" }}>
              <div
                style={{ fontSize: 14,
                  color: "#5a8a6a",
                  letterSpacing: 3,
                  marginBottom: 14,
                }}
              >
                EXIT ASSUMPTIONS
              </div>
              {[
                {
                  label: "OldCo EBITDA ($)",
                  val: oldCoEBITDA,
                  set: setOldCoEBITDA,
                  ph: "4000000",
                },
                {
                  label: "Exit Multiple (combined)",
                  val: exitMult,
                  set: setExitMult,
                  ph: "8.0",
                },
              ].map(({ label, val, set, ph }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#555",
                      letterSpacing: 2,
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  <input
                    className="pcf-input"
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    placeholder={ph}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            {/* Ownership shift */}
            <div
              className="pcf-card"
              style={{ padding: "20px 22px", marginBottom: 12 }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#3B82F6",
                  letterSpacing: 2,
                  marginBottom: 6,
                }}
              >
                OWNERSHIP SHIFT
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  fontSize: 9,
                  color: "#444",
                  marginBottom: 16,
                }}
              >
                <span>BEFORE &larr;&rarr; AFTER</span>
              </div>
              <DilutionBar
                label="YOU"
                before={parseFloat(yourPct) || 0}
                after={yourPostPct}
                color="#3B82F6"
              />
              <DilutionBar
                label="PE SPONSOR"
                before={parseFloat(sponsorPct) || 0}
                after={sponsorPostPct}
                color="#5a8a9a"
              />
              <DilutionBar
                label="MANAGEMENT"
                before={parseFloat(mgmtPct) || 0}
                after={mgmtPostPct}
                color="#6a5a9a"
              />
              <DilutionBar
                label="NEW INVESTOR"
                before={0}
                after={newInvestorPct}
                color="#5a8a6a"
              />
            </div>

            {/* Value math */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                className="pcf-card"
                style={{
                  padding: "16px 18px",
                  borderLeft: "3px solid #3B82F6",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "#3B82F6",
                    letterSpacing: 2,
                    marginBottom: 12,
                  }}
                >
                  YOUR EQUITY VALUE
                </div>
                {[
                  {
                    label: "Before raise",
                    val: fmt(
                      preMoney * ((parseFloat(yourPct) || 0) / 100)
                    ),
                    color: "#888",
                  },
                  {
                    label: "Post-money (no participation)",
                    val: fmt(
                      postMoney * (yourShares / postMoney)
                    ),
                    color: "#8a4a4a",
                  },
                  {
                    label: "Post-money (with participation)",
                    val: fmt(yourPostShares),
                    color: "#5a8a6a",
                  },
                ].map(({ label, val, color }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                      fontSize: 11,
                    }}
                  >
                    <span style={{ color: "#555" }}>{label}</span>
                    <span
                      style={{
                        color,
                        fontSize: 14,
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="pcf-card"
                style={{
                  padding: "16px 18px",
                  borderLeft: "3px solid #5a8a6a",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "#5a8a6a",
                    letterSpacing: 2,
                    marginBottom: 12,
                  }}
                >
                  ACQUISITION MATH
                </div>
                {[
                  {
                    label: "Acquisition price",
                    val: fmt(acqPrice),
                    color: "#888",
                  },
                  {
                    label: "Combined EBITDA",
                    val: fmt(combinedEBITDA),
                    color: "#888",
                  },
                  {
                    label: "Combined exit value",
                    val: fmt(combinedVal),
                    color: "#3B82F6",
                  },
                ].map(({ label, val, color }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                      fontSize: 11,
                    }}
                  >
                    <span style={{ color: "#555" }}>{label}</span>
                    <span
                      style={{
                        color,
                        fontSize: 14,
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exit comparison */}
            <div
              className="pcf-card"
              style={{ padding: "18px 22px", marginBottom: 12 }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#5a8a6a",
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                YOUR EXIT PROCEEDS &mdash; PARTICIPATE VS. DON&rsquo;T
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  {
                    label: "WITHOUT RAISE\n(no acquisition)",
                    val: fmt(noRaiseExitValue),
                    sub: `${fmtPct(parseFloat(yourPct) || 0)} of OldCo only`,
                    color: "#888",
                  },
                  {
                    label: "WITH RAISE\nNO PARTICIPATION",
                    val: fmt(yourExitValueNoPart),
                    sub: `${fmtPct(
                      (yourShares / postMoney) * 100
                    )} of combined`,
                    color: "#8a4a4a",
                  },
                  {
                    label: "WITH RAISE\nFULL PRO-RATA",
                    val: fmt(yourExitValue),
                    sub: `${fmtPct(yourPostPct)} of combined`,
                    color: "#5a8a6a",
                  },
                ].map(({ label, val, sub, color }) => (
                  <div
                    key={label}
                    style={{
                      background: "#0f1d3d",
                      border: `1px solid ${color}33`,
                      borderRadius: 4,
                      padding: "14px 16px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 8,
                        color: "#555",
                        letterSpacing: 1,
                        marginBottom: 8,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{ fontSize: 22,
                        color,
                      }}
                    >
                      {val}
                    </div>
                    <div style={{ fontSize: 9, color: "#444", marginTop: 6 }}>
                      {sub}
                    </div>
                  </div>
                ))}
              </div>
              {participationGain > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    background: "#0f1d3d",
                    border: "1px solid #5a8a6a33",
                    borderRadius: 4,
                    fontSize: 10,
                    color: "#5a8a6a",
                    textAlign: "center",
                  }}
                >
                  Pro-rata participation worth{" "}
                  <strong>{fmt(participationGain)}</strong> more at exit than
                  not participating &mdash; costing{" "}
                  <strong>{fmt(yourParticipation)}</strong> today.
                </div>
              )}
            </div>

            <div
              className="pcf-card"
              style={{
                padding: "14px 18px",
                borderLeft: "3px solid #8a4a4a33",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#8a4a4a",
                  letterSpacing: 2,
                  marginBottom: 8,
                }}
              >
                WHAT THE CALCULATOR DOESN&rsquo;T SHOW
              </div>
              <div style={{ fontSize: 11, color: "#666", lineHeight: 1.8 }}>
                Personal liquidity risk. Pro-rata participation requires writing
                a real check into an illiquid asset. If OldCo underperforms or
                the acquisition fails to integrate, that capital is locked. Model
                your participation decision against your personal liquidity
                &mdash; not just the exit math.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── RAISE TYPES ── */}
      {tab === "raiseTypes" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 16,
          }}
        >
          <div>
            {RAISE_TYPES.map((r) => {
              const active = activeRaise === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setActiveRaise(r.id)}
                  style={{
                    padding: "12px 14px",
                    marginBottom: 6,
                    borderRadius: 4,
                    cursor: "pointer",
                    border: `1px solid ${active ? r.color + "55" : "#1c2a4a"}`,
                    background: active ? r.color + "0e" : "#0f1d3d",
                    borderLeft: `3px solid ${active ? r.color : r.color + "33"}`,
                    transition: "all .15s",
                  }}
                >
                  <div
                    style={{ fontSize: 11,
                      color: active ? r.color : "#444",
                      letterSpacing: 2,
                    }}
                  >
                    {r.label}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 4,
                      marginTop: 6,
                    }}
                  >
                    {[
                      {
                        l: "DILUTION",
                        v: r.dilution,
                        c:
                          r.dilution === "NONE" || r.dilution.startsWith("NONE")
                            ? "#5a8a6a"
                            : r.dilution === "MODERATE"
                            ? "#8a6a3a"
                            : "#8a4a4a",
                      },
                      {
                        l: "SPEED",
                        v: r.speed,
                        c:
                          r.speed === "FAST"
                            ? "#5a8a6a"
                            : r.speed === "MEDIUM"
                            ? "#888"
                            : "#8a4a4a",
                      },
                    ].map(({ l, v, c }) => (
                      <div key={l}>
                        <div
                          style={{
                            fontSize: 7,
                            color: "#333",
                            letterSpacing: 1,
                          }}
                        >
                          {l}
                        </div>
                        <div
                          style={{ fontSize: 9, color: c, fontWeight: 600 }}
                        >
                          {v}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <div
              className="pcf-card"
              style={{
                padding: "20px 24px",
                marginBottom: 12,
                borderLeft: `3px solid ${raise_type.color}`,
              }}
            >
              <div
                style={{ fontSize: 20,
                  color: raise_type.color,
                  letterSpacing: 3,
                  marginBottom: 8,
                }}
              >
                {raise_type.label}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#ccc",
                  lineHeight: 1.7,
                  marginBottom: 16,
                  fontStyle: "italic",
                }}
              >
                {raise_type.headline}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                {[
                  {
                    l: "DILUTION",
                    v: raise_type.dilution,
                    c:
                      raise_type.dilution === "NONE" ||
                      raise_type.dilution.startsWith("NONE")
                        ? "#5a8a6a"
                        : raise_type.dilution === "MODERATE"
                        ? "#8a6a3a"
                        : "#8a4a4a",
                  },
                  {
                    l: "COMPLEXITY",
                    v: raise_type.complexity,
                    c:
                      raise_type.complexity === "LOW"
                        ? "#5a8a6a"
                        : raise_type.complexity === "MEDIUM"
                        ? "#888"
                        : "#8a4a4a",
                  },
                  {
                    l: "SPEED",
                    v: raise_type.speed,
                    c:
                      raise_type.speed === "FAST"
                        ? "#5a8a6a"
                        : raise_type.speed === "MEDIUM"
                        ? "#888"
                        : "#8a4a4a",
                  },
                ].map(({ l, v, c }) => (
                  <div
                    key={l}
                    style={{
                      background: "#0f1d3d",
                      border: `1px solid ${c}33`,
                      borderRadius: 3,
                      padding: "8px 14px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 8,
                        color: "#555",
                        letterSpacing: 2,
                      }}
                    >
                      {l}
                    </div>
                    <div
                      style={{ fontSize: 14,
                        color: c,
                        marginTop: 2,
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #17305a", paddingTop: 14 }}>
                <div
                  style={{
                    fontSize: 9,
                    color: "#555",
                    letterSpacing: 2,
                    marginBottom: 6,
                  }}
                >
                  WHEN TO USE IT
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#777",
                    lineHeight: 1.8,
                    marginBottom: 14,
                  }}
                >
                  {raise_type.when}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#555",
                    letterSpacing: 2,
                    marginBottom: 6,
                  }}
                >
                  HOW IT WORKS
                </div>
                <div style={{ fontSize: 11, color: "#777", lineHeight: 1.8 }}>
                  {raise_type.detail}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                className="pcf-card"
                style={{
                  padding: "16px 18px",
                  borderLeft: `3px solid ${raise_type.color}33`,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: raise_type.color,
                    letterSpacing: 2,
                    marginBottom: 8,
                  }}
                >
                  IMPACT ON YOUR OWNERSHIP
                </div>
                <div style={{ fontSize: 11, color: "#777", lineHeight: 1.8 }}>
                  {raise_type.ownerImpact}
                </div>
              </div>
              <div
                className="pcf-card"
                style={{
                  padding: "16px 18px",
                  borderLeft: "3px solid #5a8a9a33",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "#5a8a9a",
                    letterSpacing: 2,
                    marginBottom: 8,
                  }}
                >
                  WORKED EXAMPLE
                </div>
                <div style={{ fontSize: 11, color: "#777", lineHeight: 1.8 }}>
                  {raise_type.example}
                </div>
              </div>
            </div>

            <div
              className="pcf-card"
              style={{
                padding: "14px 18px",
                borderLeft: `3px solid ${raise_type.color}22`,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: raise_type.color,
                  letterSpacing: 2,
                  marginBottom: 6,
                }}
              >
                PRO TIP
              </div>
              <div style={{ fontSize: 11, color: "#666", lineHeight: 1.8 }}>
                {raise_type.proTip}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── QUIZ ── */}
      {tab === "quiz" && (
        <div style={{ maxWidth: 740 }}>
          {!quizDone ? (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{ fontSize: 10, color: "#555", letterSpacing: 2 }}
                >
                  SCENARIO {quizIdx + 1} OF {QUIZ.length}
                </div>
                <div
                  style={{ fontSize: 10, color: "#3B82F6", letterSpacing: 2 }}
                >
                  {quizScore} CORRECT
                </div>
              </div>
              <div
                style={{
                  height: 2,
                  background: "#17305a",
                  borderRadius: 1,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(quizIdx / QUIZ.length) * 100}%`,
                    background: "#3B82F6",
                    transition: "width .3s",
                  }}
                />
              </div>
              <div
                className="pcf-card"
                style={{ padding: "22px 24px", marginBottom: 12 }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#ccc",
                    lineHeight: 1.9,
                    marginBottom: 20,
                  }}
                >
                  {QUIZ[quizIdx].q}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {QUIZ[quizIdx].opts.map((o, i) => {
                    const isCorrect = i === QUIZ[quizIdx].correct;
                    const isSelected = quizSelected === i;
                    const bg = !quizRevealed
                      ? "#0f1d3d"
                      : isCorrect
                      ? "#5a8a6a22"
                      : isSelected
                      ? "#8a4a4a22"
                      : "#0f1d3d";
                    const border = !quizRevealed
                      ? "#1c2a4a"
                      : isCorrect
                      ? "#5a8a6a"
                      : isSelected
                      ? "#8a4a4a"
                      : "#1c2a4a";
                    const color = !quizRevealed
                      ? "#888"
                      : isCorrect
                      ? "#7aba8a"
                      : isSelected
                      ? "#c87a7a"
                      : "#555";
                    return (
                      <button
                        key={i}
                        onClick={() => handleQuiz(i)}
                        style={{
                          background: bg,
                          border: `1px solid ${border}`,
                          borderRadius: 4,
                          padding: "12px 16px",
                          textAlign: "left",
                          fontSize: 11,
                          color,
                          lineHeight: 1.6,
                          transition: "all .15s",
                          cursor: quizRevealed ? "default" : "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        <span
                          style={{
                            color:
                              isCorrect && quizRevealed
                                ? "#5a8a6a"
                                : isSelected && quizRevealed
                                ? "#8a4a4a"
                                : "#444",
                            marginRight: 10,
                            fontSize: 9,
                          }}
                        >
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>
              {quizRevealed && (
                <div
                  className="pcf-card"
                  style={{
                    padding: "16px 20px",
                    borderLeft: "3px solid #3B82F633",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: "#3B82F6",
                      letterSpacing: 2,
                      marginBottom: 8,
                    }}
                  >
                    FUNDRAISING INSIGHT
                  </div>
                  <div
                    style={{ fontSize: 11, color: "#888", lineHeight: 1.8 }}
                  >
                    {QUIZ[quizIdx].explain}
                  </div>
                  <button
                    onClick={nextQ}
                    style={{
                      marginTop: 14,
                      background: "#3B82F6",
                      border: "none",
                      color: "#0f1d3d",
                      padding: "8px 22px",
                      fontSize: 10,
                      letterSpacing: 2,
                      borderRadius: 3,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {quizIdx < QUIZ.length - 1 ? "NEXT \u2192" : "RESULTS \u2192"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className="pcf-card"
              style={{ padding: "32px", textAlign: "center" }}
            >
              <div
                style={{ fontSize: 14,
                  color: "#555",
                  letterSpacing: 4,
                  marginBottom: 12,
                }}
              >
                FUNDRAISING ASSESSMENT
              </div>
              <div
                style={{ fontSize: 64,
                  color: "#3B82F6",
                }}
              >
                {quizScore}/{QUIZ.length}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#888",
                  marginTop: 12,
                  marginBottom: 24,
                }}
              >
                {quizScore === 5
                  ? "You understand the dilution trade. Negotiate pro-rata rights before you close."
                  : quizScore >= 3
                  ? "Solid \u2014 review the scenarios you missed before your next raise."
                  : "Spend time in the dilution calculator before agreeing to any capital raise."}
              </div>
              <button
                onClick={() => {
                  setQuizDone(false);
                  setQuizIdx(0);
                  setQuizScore(0);
                  setQuizSelected(null);
                  setQuizRevealed(false);
                }}
                style={{
                  background: "transparent",
                  border: "1px solid #1c2a4a",
                  color: "#555",
                  padding: "8px 22px",
                  fontSize: 10,
                  letterSpacing: 2,
                  borderRadius: 3,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                RETAKE
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
