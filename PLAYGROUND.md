# PE Ready Plus — Playground Plan

**Read this entire file before doing anything.**

---

## What Is This

This is the `noor_frank_playground` branch of `exit-readiness-beacon` (PE Ready).
We are experimenting with enhancements inspired by Anthropic's financial-services-plugins repo.
The `main` branch is NEVER touched. All work happens here on `noor_frank_playground`.

---

## Rules — Follow These Exactly

1. **VERIFY BRANCH FIRST.** Run `git branch --show-current` before ANY code change. If it does not say `noor_frank_playground`, STOP and switch to it. No exceptions.
2. **BINGO required before code changes.** Frank must say BINGO before you write or edit any code file. Design talk and planning is free.
3. **Frank is not a programmer.** Plain English always. No jargon.
4. **One enhancement per session.** Don't stack unrelated work.
5. **Read before you write.** Understand existing code before changing it. These projects represent over a year of Frank's work.
6. **Commit and push to this branch only.** Never push to main.
7. **Restart the dev server yourself** after changes. Don't tell Frank to do it. The command is `npm run dev` from the project root. Port is 8080.
8. **Simple and functional over overengineered.**
9. **Before ending any session:** Commit, push, and update the Session Log at the bottom of this file.

---

## Project Details

- **Repo:** ftdcad/exit-readiness-beacon
- **Branch:** noor_frank_playground
- **Local path:** C:\Users\FrankDalton\myProjects\exit-readiness-beacon
- **Tech stack:** React + TypeScript + Vite + Tailwind + shadcn/ui + Supabase
- **Dev server:** `npm run dev` on port 8080
- **GitHub:** https://github.com/ftdcad/exit-readiness-beacon/tree/noor_frank_playground

---

## What PE Ready Is

A 4-week educational SaaS platform that prepares business owners for private equity transactions. It has:

- **Week 1 (Foundation):** Glossary, Deal Progression, Professional Advisors, Know Your Buyer, Asset Free/Debt Free, Time Kills Deals, EBITDA Explained
- **Week 2 (Deal Readiness):** Data Room, Asset Workshop, HoldCo Structure, Add Backs, Debt/Interest, Seller Earnouts, Post-Closing Reality
- **Week 3 (Performance):** EBITDA Calculator, Industry Multipliers, Scenario Planning, Management Scorecard, Top Performers, Business Scorecard, Deal Killers Diagnostic
- **Week 4 (Final Readiness):** Due Diligence Checklist, LOI Review, Final Report, Discovery Interview, Strategy Doc Builder, KPIs and OKRs

Users: Business owners, portfolio managers, admin staff.
Database: Supabase (PostgreSQL). Auth: Supabase Auth with roles (admin, client).

---

## Enhancement Reference Source

The ideas come from `C:\Users\FrankDalton\myProjects\financial-services-plugins` — Anthropic's open-source plugin collection for financial services professionals. We are NOT importing code from it. We are borrowing **frameworks, structures, and logic** and building them into PE Ready's existing React UI.

---

## Enhancement Roadmap

Each enhancement is independent. We tackle them one at a time, in whatever order Frank chooses.

### Enhancement 1: Sector-Tailored DD Checklists
**Status:** COMPLETE (Session 5, commit d28cfea)
**Upgrades:** Week 4 Due Diligence Checklist module
**What it does:** Instead of a one-size-fits-all checklist, the DD checklist adapts based on the business owner's industry (SaaS, Healthcare, Manufacturing, Financial Services, Consumer). Adds 7 workstreams (Financial, Commercial, Legal, Operational, HR/People, IT/Tech, Environmental/ESG). Adds status workflow (Not Started > Requested > Received > In Review > Complete > Red Flag). Adds priority tiers (P0/P1/P2) and red flag severity (Deal-breaker / Significant / Manageable).
**Source plugin:** private-equity/skills/dd-checklist/SKILL.md

### Enhancement 2: PE Screening Scorecard
**Status:** COMPLETE (Session 3, commit d20c2de)
**Upgrades:** Week 3 Performance Readiness — new module
**What it does:** Shows business owners how a PE firm would score their company across 10 criteria: Revenue range, EBITDA range, EBITDA margin, Growth profile, Sector fit, Geography, Deal size/EV, Valuation multiple, Customer concentration, Management continuity. Gives a Pass/Further Diligence/Hard Pass verdict with bull case and bear case bullets.
**Source plugin:** private-equity/skills/deal-screening/SKILL.md

### Enhancement 3: Mock IC Memo (Final Report Upgrade)
**Status:** COMPLETE (Session 4, commit cb48270)
**Upgrades:** Week 4 Final Report module
**What it does:** Restructures the Final Report to look like a real Investment Committee memo — the document that decides whether a PE firm writes a check. Sections: Executive Summary, Company Overview, Industry & Market, Financial Analysis, Investment Thesis, Deal Terms, Returns Analysis, Risk Factors, Recommendation. Uses data the business owner has already entered throughout the 4-week program.
**Source plugin:** private-equity/skills/ic-memo/SKILL.md

### Enhancement 4: EBITDA Bridge + 100-Day Plan
**Status:** COMPLETE (Session 5, commit a547ad7)
**Upgrades:** Week 3 Scenario Planning + Week 4 Strategy Doc Builder
**What it does:** Adds an EBITDA bridge table (current EBITDA > value creation levers > target EBITDA over 5 years). Adds a 100-day post-close plan template (Days 1-30 Stabilize, Days 31-60 Plan, Days 61-100 Execute). Adds KPI dashboard with Current/Target/Owner/Frequency columns. Categories: Revenue growth levers, margin expansion levers, strategic/multiple expansion levers.
**Source plugin:** private-equity/skills/value-creation-plan/SKILL.md

### Enhancement 5: Returns Sensitivity Tables
**Status:** COMPLETE (Session 3, commit 0580de9)
**Upgrades:** Week 3 Performance Readiness — new module
**What it does:** Adds IRR and MOIC calculations alongside the existing EBITDA x multiple valuation. Adds 2-way sensitivity tables (entry multiple vs exit multiple, growth vs exit multiple). Adds Bull/Base/Bear scenario comparison. Shows returns attribution: how much comes from growth vs multiple expansion vs debt paydown.
**Source plugin:** private-equity/skills/returns-analysis/SKILL.md

### Enhancement 6: Management Presentation Prep
**Status:** COMPLETE (Session 2, commit 4680693)
**Upgrades:** Week 4 Discovery Interview module
**What it does:** Adds the exact questions PE firms ask in management presentations. Categories: Business Overview, Revenue & Growth, Competitive Positioning, Operations & Team, Financial Deep-Dive, Forward Look. Also adds Customer Reference Call questions and Expert Network Call questions. Ends with "What haven't we asked that we should?" The business owner can practice answering before the real meeting.
**Source plugin:** private-equity/skills/dd-meeting-prep/SKILL.md

### Enhancement 7: Draft CIM Generator
**Status:** COMPLETE (Session 6, commit b7ee4ee)
**Upgrades:** New premium feature — Week 4 graduation deliverable
**What it does:** Auto-generates a draft Confidential Information Memorandum from data entered throughout the program. Sections: Executive Summary, Company Overview, Industry Overview, Growth Opportunities, Customers & Sales, Operations, Financial Overview. Anonymization options included. Output as downloadable document.
**Source plugin:** investment-banking/skills/cim-builder/SKILL.md

### Enhancement 8: Revenue Quality Score (SaaS/Subscription)
**Status:** COMPLETE (Session 7, commit 01eb86a)
**Upgrades:** Week 3 Performance Readiness — new module
**What it does:** For subscription/SaaS businesses, adds a Revenue Quality Score (1-5 across 6 factors: Recurring %, Net retention, Customer concentration, Cohort stability, Growth durability, Margin profile). Includes benchmarks: LTV:CAC ratios, Rule of 40, Magic Number, NDR benchmarks, CAC payback periods. ARR bridge visualization.
**Source plugin:** private-equity/skills/unit-economics/SKILL.md

### Enhancement 9: Traffic Light KPI Dashboard
**Status:** COMPLETE (Session 2, commit 04224ce)
**Upgrades:** Week 4 KPIs and OKRs module
**What it does:** Adds Green/Yellow/Red status indicators to KPIs. Green = within 5% of target. Yellow = 5-15% below target. Red = more than 15% below or critical issue. Specific financial KPI list (Revenue vs budget, EBITDA margin vs budget, leverage ratio, interest coverage, FCF) and operational KPIs (customer count, revenue per customer, headcount, churn).
**Source plugin:** private-equity/skills/portfolio-monitoring/SKILL.md

### Enhancement 10: Anonymous Teaser Generator
**Status:** COMPLETE (Session 3, commit 53904eb)
**Upgrades:** Week 4 Final Readiness — new premium module
**What it does:** Auto-generates a one-page blind teaser from assessment data. Includes deal code name, 4-6 investment highlight bullets, financial summary table, and anonymization rules (no company name, region instead of city, revenue ranges instead of exact figures). This is the "movie trailer" a banker sends to potential buyers before revealing the company identity.
**Source plugin:** investment-banking/skills/cim-builder/SKILL.md (teaser section)

### Enhancement 11: Buyer List Framework
**Status:** COMPLETE (Session 2, commit 2ff807a)
**Upgrades:** Week 1 Know Your Buyer module
**What it does:** Upgrades the buyer type quiz to show specific buyer categories: strategic buyers (direct competitors, adjacent players, vertical integrators, platform builders) and financial sponsors (platform investors, add-on buyers, growth equity). Adds tiered prioritization (Tier 1: 5-10 best fits, Tier 2: 10-15 solid, Tier 3: 10-20 long shots). Shows what each buyer type looks for, recent M&A activity signals, fund vintage and deployment pace.
**Source plugin:** investment-banking/skills/buyer-targeting/SKILL.md

### Enhancement 12: Competitive Analysis Frameworks
**Status:** COMPLETE (Session 3, commit 1f8a540)
**Upgrades:** Week 3 Performance Readiness — new module
**What it does:** Adds TAM/SAM/SOM market sizing framework, Porter's Five Forces analysis, and competitive positioning maps (2x2 matrices with industry-specific axes). Answers "How big is your market and what's your share?" — exactly what PE firms want in the Company Overview section of any deal document.
**Source plugin:** equity-research/skills/sector-overview/SKILL.md

---

## Enhancement Wave 2 — Approved by Frank, Not Yet Built

These were identified from a deep dive into the Anthropic financial-services-plugins repo (Session 9). All use frameworks/logic from the plugins — no code imported.

### Enhancement 13: Deal Process Roadmap
**Status:** NOT STARTED
**Upgrades:** New module — could live in Week 1 or Week 4
**What it does:** Visual timeline of the entire PE deal process from start to close. Stages: Pre-Mandate → Engaged → Marketing/CIM → IOI (Indication of Interest) → Due Diligence → Final Bids → Signing → Close. Each stage shows: what happens, how long it typically takes, what the business owner needs to have ready, and common pitfalls. Interactive — user can see "you are here" based on their progress through PE Ready. Think of it as a GPS for the deal process.
**Source plugin:** investment-banking/skills/deal-tracker/SKILL.md + investment-banking/skills/process-letter/SKILL.md

### Enhancement 14: Comparable Company Analysis (Comps)
**Status:** COMPLETE (Session 18, commit ad13430)
**Upgrades:** Week 3 Performance Readiness — new module
**What it does:** Shows business owners how they stack up against comparable companies in their industry. User enters their metrics (revenue, EBITDA, margins, growth). System shows where they fall in the distribution — are they above median, below 25th percentile, etc.? Includes: operating metrics comparison (revenue growth, EBITDA margin, gross margin), valuation multiples context (EV/EBITDA, EV/Revenue ranges for their industry), and a "premium vs. discount" assessment explaining what drives higher valuations. Statistical benchmarks: Max, 75th percentile, Median, 25th percentile, Min.
**Source plugin:** financial-analysis/skills/comps-analysis/SKILL.md

### Enhancement 15: LBO Explainer (How PE Firms Buy Your Company)
**Status:** COMPLETE (Session 13, commit f6db3e7)
**Upgrades:** Week 1 Foundation or Week 2 Deal Readiness — new educational module
**What it does:** Interactive walkthrough of a leveraged buyout using the business owner's actual numbers. Shows: Sources & Uses (how much equity the PE firm puts up, how much they borrow), debt structure (senior debt, mezzanine, equity split), how the company's cash flow pays down debt over 5 years, and the PE firm's return (IRR/MOIC) at exit. Sensitivity tables showing how entry price, growth rate, and exit multiple affect the PE firm's returns. Key insight: "This is why PE firms care so much about your EBITDA and cash flow — it's literally paying off their loan."
**Source plugin:** financial-analysis/skills/lbo-model/SKILL.md

### Enhancement 16: DCF Valuation (What's Your Business Really Worth?)
**Status:** COMPLETE (Session 18, commit 32169e8)
**Upgrades:** Week 3 Performance Readiness — complements Returns Sensitivity module
**What it does:** A second valuation approach alongside EBITDA × multiple. User enters revenue, growth rate, margins, and capex. System builds a simplified DCF: projects 5 years of free cash flow, applies a discount rate (WACC), calculates terminal value, and arrives at an enterprise value. Includes Bear/Base/Bull scenarios and sensitivity tables (WACC vs. growth rate, margin vs. growth rate). Educational: explains why faster growth and lower risk = higher valuation. Two methods arriving at similar numbers = much more credible in front of a PE firm.
**Source plugin:** financial-analysis/skills/dcf-model/SKILL.md

### Enhancement 17: Financial Data Room Prep
**Status:** COMPLETE (Session 17, commit 5c9fb35)
**Upgrades:** Week 4 Data Room module — complements existing document checklist
**What it does:** Helps business owners organize their financial data into the standardized format PE firms expect. Guided input for: 3-5 years of Income Statement, Balance Sheet, Cash Flow Statement, plus operating metrics. System normalizes the data — flags non-recurring items, calculates adjusted EBITDA, identifies items that need explanation. Output: a clean financial summary in the 8-section format PE firms use (Executive Summary, Historical P&L, Balance Sheet, Cash Flow, Operating Metrics, Segment Performance, Market Context, Investment Highlights). Think of it as "translate your QuickBooks into PE-speak."
**Source plugin:** investment-banking/skills/datapack-builder/SKILL.md

### Enhancement 18: Life After Exit (Post-Sale Financial Planning)
**Status:** NOT STARTED
**Upgrades:** New module — Week 4 or standalone post-program section
**What it does:** What happens after you sell? Covers: tax implications of the sale (capital gains, installment sales, earnout taxation), wealth preservation strategies, retirement projections based on sale proceeds, estate planning basics, and the psychological transition from operator to investor. Scenario modeling: "If you sell for $X after tax, here's what your retirement looks like at different spending levels." Addresses the question nobody talks about: "I just got a check for $15M. Now what?"
**Source plugin:** wealth-management/skills/financial-plan/SKILL.md

### Enhancement 19: Merger Math (Why Strategic Buyers Pay More)
**Status:** COMPLETE (Session 19, commit 8ebced5)
**Upgrades:** Week 2 Deal Readiness — educational module
**What it does:** Teaches three value creation engines: cost synergies, revenue synergies, and multiple arbitrage (PE roll-up math). 4 tabs: educational intro with EBITDA tier table and negotiation formula, interactive deal modeler with 7 synergy categories + roll-up model (platform + add-on with multiple expansion), full analysis with sensitivity tables and value creation waterfall, report with 5 negotiation leverage points and CSV export. Auto-fills from Company Profile. localStorage: `merger-math-v1`. Route: `/portal/week-2/merger-math`.
**Source plugin:** investment-banking/skills/merger-model/SKILL.md

### Enhancement 20: The Process Letter (What Buyers Receive)
**Status:** NOT STARTED
**Upgrades:** Week 2 Deal Readiness — educational module
**What it does:** Shows business owners exactly what a sell-side process looks like from the buyer's perspective. Walks through: the initial process letter (what your banker sends to buyers), IOI instructions (what buyers must include in their first-round bid), final bid requirements (binding offer terms, financing certainty, timeline), and management meeting logistics. Educational — the business owner sees the actual documents and understands what's happening behind the scenes. Removes the mystery from the M&A process.
**Source plugin:** investment-banking/skills/process-letter/SKILL.md

### Enhancement 21: Company One-Pager (Strip Profile)
**Status:** NOT STARTED
**Upgrades:** Week 4 Final Readiness — premium deliverable alongside Teaser and CIM
**What it does:** Auto-generates a professional one-page company profile in the format investment bankers use for pitch books. Four-quadrant layout: Company Overview (HQ, founding, key stats), Business & Positioning (revenue drivers, competitive moat), Key Financials (revenue, EBITDA, margins table), and Recent Developments/Ownership. Information-dense, designed to be understood in 30 seconds. Uses data from Company Profile and other modules. A third deliverable alongside the Anonymous Teaser and Draft CIM.
**Source plugin:** investment-banking/skills/strip-profile/SKILL.md

### Enhancement 22: PE Pitch Deck Builder
**Status:** NOT STARTED
**Upgrades:** Week 4 Final Readiness — premium deliverable
**What it does:** Auto-generates a management presentation / pitch deck from data entered throughout the program. Slides: Company Overview, Business Model & Revenue Drivers, Market Opportunity (TAM/SAM/SOM from Competitive Analysis), Financial Summary (revenue, EBITDA, margins, growth), Growth Strategy & Value Creation Levers, Management Team, Investment Highlights, and Transaction Overview. Uses professional slide layouts with charts, tables, and clean formatting. The business owner completes PE Ready and walks out with a full deal package: Anonymous Teaser + CIM + Company One-Pager + Pitch Deck. That's what a $50K investment banker produces — your users get a starter version for free.
**Source plugin:** investment-banking/skills/pitch-deck-population/SKILL.md

---

## Future To-Do (Not Enhancements — Separate Sessions)

### Navigation Restructure: Course Tiering (Pillar vs Supplemental + Industry Tags)
**Status:** PHASE 1 COMPLETE (Session 10) — Week labels stripped, flat module list live
**Remaining work:**
1. **Pillar vs. Supplemental distinction** — Core courses (essential to every exit) get bold/accent styling. Supplemental courses get muted styling. All courses remain accessible — visual hierarchy only.
2. **Industry relevance tags** — Courses that don't apply to every business type (e.g., a doctor's office) get a subtle "Industry Specific" indicator. Could auto-flag based on industry selected in Company Profile.
**Before building remaining layers, Frank needs to provide:**
- Pillar course list (which courses are core to every exit regardless of industry)
- Industry-to-course relevance map (which courses get flagged for which industries)
**Estimated sessions:** 1-2 for remaining layers

### App-Wide UI Redesign: Premium Purple Theme
**Status:** NOT STARTED
**What it does:** Redesign the entire PE Ready app to match a premium dark + purple gradient aesthetic. Reference screenshot saved at `ui-reference.png` in project root. Key elements: purple radial gradient backgrounds, oversized bold typography, solid black cards, decorative SVG arc lines, consistent purple accent color across all pages (sidebar, nav, every module). This is a multi-session styling overhaul — no structural/logic changes.
**Reference:** `ui-reference.png` (NixtNode-style design)

---

## Session Log

### Session 19 — Mar 9, 2026
- **Built Merger Math** — Enhancement #19, "Why Strategic Buyers Pay More"
  - 4 tabs: Why Buyers Pay More / Model Your Deal / The Numbers / Your Report
  - Tab 1: Educational intro — 1+1=3 concept with $8M+$16M=$42M+ example, Financial vs Strategic buyer comparison, Three Engines of Value Creation (cost synergies, revenue synergies, multiple arbitrage), EBITDA tier table (5 tiers from 3.5x to 11x with market reasoning), PE roll-up playbook, negotiation leverage formula (standalone + synergies x multiple x share %)
  - Tab 2: Your Company (revenue, EBITDA, growth — auto-fill from Company Profile), standalone multiple slider, 7 synergy categories (5 cost: headcount overlap, facility consolidation, procurement savings, tech & systems, G&A/back office; 2 revenue: cross-selling, market expansion), each with $ amount, confidence level, time to realize. Buyer assumptions: realization rate, synergy multiple, years to full. Roll-Up Model (ADVANCED): acquirer EBITDA slider with auto-tier detection, synergy lift % slider, real-time combined platform preview
  - Tab 3: 4 summary cards (standalone, synergy value, strategic value, premium %), standalone vs strategic bar chart visualization, synergy breakdown table with confidence badges, confidence-level summary (high/medium/low). Multiple Arbitrage section: 3-column Your Company vs Acquirer vs Combined Platform with tier/multiple/value, value creation waterfall (naive sum → multiple expansion → synergy lift → combined), bar visualization, key insight. 2 sensitivity tables (synergy level x multiple, realization % x premium) with base-case highlighting
  - Tab 4: Overall assessment (Strong Value Creation / Meaningful Upside / Modest Potential / Limited Premium), deal summary table covering both synergy and roll-up analysis, 5 negotiation leverage points (lead with high-confidence synergies, don't show all cards, competitive process, roll-up premium, sharing formula), "What PE Firms Will Think" commentary, CSV export
  - Auto-fills from Company Profile (revenue, EBITDA, growth rate)
  - localStorage: `merger-math-v1`
  - Route: `/portal/week-2/merger-math`, NEW badge
  - New files: `src/components/merger-math/MergerMath.tsx`, `src/pages/week-2/MergerMathPage.tsx`
  - Frank's research on multiple arbitrage and PE roll-up math directly influenced the module — added EBITDA tier system, platform+add-on framing, and value creation waterfall
- Commit: `8ebced5` — pushed to noor_frank_playground
- **Phase 3 Wave 2: 5 of 9 complete** (#15 LBO, #17 Financial Data Room, #14 Comps, #16 DCF, #19 Merger Math)
- **Next:** The Process Letter (#20), Life After Exit (#18), Company One-Pager (#21), PE Pitch Deck Builder (#22)

### Session 18 — Mar 9, 2026
- **Built Comparable Company Analysis** — Enhancement #14, "How Do You Stack Up?"
  - 4 tabs: What Are Comps? / Your Numbers / How You Stack Up / Your Report
  - Tab 1: Educational intro — what PE firms compare (growth, margins, revenue quality, efficiency), how percentiles work (top quartile → bottom quartile with color coding), impact on valuation ($15M difference example)
  - Tab 2: Industry selector (6 industries: SaaS/Software, Healthcare Services, Manufacturing/Industrial, Professional Services, Consumer/Retail, Construction/Trades), financial metrics entry (revenue, growth, gross margin, EBITDA, EBITDA margin, net margin), operating metrics (customer count, top customer %, recurring revenue %, employee count), auto-calculated revenue/employee
  - Tab 3: Percentile bar charts for 7 metrics (Revenue Growth, Gross Margin, EBITDA Margin, Net Margin, Top Customer %, Recurring Revenue, Revenue/Employee) with visual position markers against Min/25th/Median/75th/Max, color-coded quartile positioning, implied valuation range with EV/EBITDA multiple interpolation, industry-specific premium and discount drivers
  - Tab 4: Full report — overall assessment (Premium/Above Average/Average/Below Average/Discount Territory), metric-by-metric table, strengths and concerns, implied valuation, "What PE Firms Will Think" bull/bear/bottom-line narrative, CSV export
  - Auto-fills from Company Profile (industry, revenue, EBITDA, margins, growth, customers, employees)
  - localStorage: `comparable-analysis-v1`
  - Route: `/portal/week-3/comparable-analysis`, NEW badge
  - New files: `src/components/comparable-analysis/ComparableAnalysis.tsx`, `src/pages/week-3/ComparableAnalysisPage.tsx`
- Commit: `ad13430` — pushed to noor_frank_playground
- **Phase 3 Wave 2: 3 of 9 complete** (LBO #15 done Session 13, Financial Data Room #17 done Session 17, now Comps #14)
- **Built DCF Valuation** — Enhancement #16, "What's Your Business Really Worth?"
  - 4 tabs: What is a DCF? / Your Assumptions / Your Valuation / Your Report
  - Tab 1: Educational intro — 4 building blocks (projections, FCF, discount rate, terminal value), why DCF + comps together, discount rate risk tiers (8-20%+)
  - Tab 2: Current financials (revenue, EBITDA, auto-calc margin), Bear/Base/Bull growth + margin scenario table, cash flow assumptions (CapEx, D&A, NWC, tax rate), discount rate + terminal growth + hold period, validation warning if terminal growth >= WACC
  - Tab 3: 3 scenario summary cards with EV + implied multiple, base case 5-year projection table (revenue, EBITDA, margin, FCF, PV of FCF), valuation bridge (PV FCFs + PV terminal value = EV), TV% health check, 2 sensitivity tables (WACC × terminal growth, growth × margin) with base case highlighted
  - Tab 4: Full report — EV range bar (bear/base/bull), key assumptions table, "What Drives Your Value" narrative (growth, margins, risk), "What PE Firms Will Think" commentary, CSV export
  - Auto-fills from Company Profile (revenue, EBITDA, growth rate)
  - localStorage: `dcf-valuation-v1`
  - Route: `/portal/week-3/dcf-valuation`, NEW badge
  - New files: `src/components/dcf-valuation/DCFValuation.tsx`, `src/pages/week-3/DCFValuationPage.tsx`
- Commit: `32169e8` — pushed to noor_frank_playground
- **Phase 3 Wave 2: 4 of 9 complete** (#15 LBO, #17 Financial Data Room, #14 Comps, #16 DCF)
- **Next:** The Process Letter (#20), Life After Exit (#18), Company One-Pager (#21), PE Pitch Deck Builder (#22), Merger Math (#19)

### Session 15 — Mar 9, 2026
- **Built Emotional Side of Selling** — "Are You Actually Ready?" (Phase 2 Module F — LAST Phase 2 module)
  - 4 tabs: The Emotional Journey / What You'll Face / Readiness Assessment / Your Report
  - Tab 1: Why emotional prep matters, 3 stats (60-70% remorse, 50% non-financial deal failures, 75% wish they'd prepared), 6-stage emotional timeline (Preparation → Marketing → LOI → DD → Final Negotiations → Closing), tips per stage
  - Tab 2: 6 emotional challenges with expandable cards (Seller's Remorse, Identity Crisis, Family Dynamics, Decision Fatigue, Monday Morning Problem, Pause vs Push Through), triggers + coping advice, side-by-side pause/push-through signal lists
  - Tab 3: 15-question self-assessment on 1-5 scale across 5 categories (Post-Exit Vision, Family & Relationships, Identity & Letting Go, Emotional Stamina, Preparation & Support), "why it matters" per question, progress bar, question navigator grid
  - Tab 4: Overall score (Ready/Almost Ready/Needs Work/Not Ready Yet), category breakdown with progress bars, individual question dot scores, action items per category, 5-point "conversations to have before you start" guide, CSV export
  - localStorage: `emotional-readiness-v1`
  - Route: `/portal/week-1/emotional-readiness`, NEW badge
  - New files: `src/components/emotional-readiness/EmotionalReadiness.tsx`, `src/pages/week-1/EmotionalReadinessPage.tsx`
- Commit: `cd33cce` — pushed to noor_frank_playground
- **PHASE 2 COMPLETE — all 6 of 6 modules built**
- **Built When to Walk Away** — buyer counter-game module from THE-BUYER-PERSPECTIVE.md
  - 4 tabs: Why Walking Away is Power / The Red Lines / Evaluate Your Deal / Your Playbook
  - Tab 1: Competitive process, BATNA, pre-set red lines, 5 common seller mistakes with dollar costs ($500K-$5M each), the paradox of walking away
  - Tab 2: 5 deal stages (IOI, LOI, Due Diligence, Definitive Docs, Pre-Close) with 20+ specific red-line signals, each with threshold, severity (Walk/Pause/Negotiate), explanation, specific action step
  - Tab 3: 19-question Deal Health Evaluator (yes/no), color-coded by severity, question navigator grid
  - Tab 4: Overall assessment (Walk Away/Serious Concern/Pause & Reassess/Negotiate Hard/Manageable/Green Light), flagged items grouped by severity, clear items, 6-point attorney discussion guide, CSV export
  - localStorage: `when-to-walk-v1`
  - Route: `/portal/week-1/when-to-walk`, NEW badge
  - New files: `src/components/when-to-walk/WhenToWalk.tsx`, `src/pages/week-1/WhenToWalkPage.tsx`
- Commit: `c64700b` — pushed to noor_frank_playground
- **Next:** Remaining Buyer Perspective modules (Auction, PE Eyes, 24-Month Countdown, Purchase Agreement Guide), Phase 3 Wave 2 enhancements, settings polish, purple theme

### Session 17 — Mar 9, 2026
- **Built Financial Data Room Prep** — Enhancement #17, "Translate Your QuickBooks into PE-Speak"
  - 4 tabs: Why PE Needs This / Your Financials / PE Analysis / Your Financial Package
  - Tab 1: Side-by-side QuickBooks vs PE-format comparison, the 8 sections of a PE financial package, 3-step process overview, educational disclaimer
  - Tab 2: Year selector (3/4/5 years), 4 collapsible data entry sections:
    - Income Statement: Revenue, COGS, OpEx, Owner Comp, D&A, Interest, Other Income — auto-calculates Gross Profit, Gross Margin, EBITDA, EBITDA Margin, Net Income
    - Balance Sheet: Cash, AR, Inventory, Other Current, Fixed Assets, Other LT, AP, Accrued, Current Debt, LT Debt — auto-calculates Total Current Assets, Total Assets, Total Current Liabilities, Total Liabilities, Equity, Working Capital (ex-cash)
    - Operating Metrics: Customer count, Employee count, Recurring Revenue %, Top Customer %, CapEx — auto-calculates Revenue/Customer, Revenue/Employee
    - EBITDA Adjustments: 6 pre-built add-back categories (Excess Owner Comp, One-Time Legal, Personal Expenses, Related Party, Non-Recurring, Other) — shows Reported EBITDA → Adjusted EBITDA per year
  - Tab 3: Key metrics dashboard (4 cards), EBITDA Bridge (reported → each add-back → adjusted), Red Flag Engine (10+ automated checks: declining growth, margin compression, high owner comp, customer concentration, low recurring revenue, WC deterioration, high leverage, under-investment, revenue volatility, oversized adjustments), each flag with finding + buyer thinking + action step, YoY trend table
  - Tab 4: Full PE Financial Package in 8 sections:
    - I. Executive Summary (key metrics grid)
    - II. Historical P&L (clean formatted table)
    - III. Balance Sheet Summary
    - IV. Cash Flow Analysis (UFCF + cash conversion)
    - V. Operating Metrics
    - VI. EBITDA Adjustment Schedule
    - VII. Key Financial Highlights (auto-generated from data)
    - VIII. Items Requiring Explanation (from red flags)
  - CSV export of complete financial package
  - localStorage: `financial-data-room-v1`
  - Route: `/portal/week-4/financial-data-room`, NEW badge
  - New files: `src/components/financial-data-room/FinancialDataRoom.tsx`, `src/pages/week-4/FinancialDataRoomPage.tsx`
- Commit: `5c9fb35` — pushed to noor_frank_playground
- **Relationship to existing Data Room:** Financial Data Room Prep produces the cleaned-up financial content that goes INTO the Data Room's Financials folder. Data Room = the filing cabinet. Financial Data Room Prep = making sure financials are clean before they go in.
- **Next:** Comparable Company Analysis (#14), DCF Valuation (#16), remaining Phase 3 Wave 2 enhancements

### Session 16 — Mar 9, 2026
- **Built all 4 remaining Buyer Perspective counter-game modules in one session**
- **BUYER PERSPECTIVE SERIES COMPLETE — all 5 of 5 modules built**
- **The Auction** — "Why 3+ Bidders Changes Everything"
  - 4 tabs: Why Process Wins / The 8 Stages / Process Readiness Check / Your Report
  - Tab 1: The #1 rule (never negotiate with one buyer), bidder count impact table (1→8+ bidders), 5 costly mistakes with expandable cards + dollar costs, banker fee ROI math ($800K fee → $7.5M net benefit)
  - Tab 2: 8 stages of competitive sale (Preparation → Buyer Outreach → IOIs → Management Presentations → Final Bids → Due Diligence → Definitive Agreement → Closing), each expandable with seller role, banker role, key docs, common mistake, pro tip
  - Tab 3: 17-question process readiness check (5 categories: Process Setup, Financial Readiness, Team & Operations, Legal & Data Room, Seller Mindset), "why it matters" on flagged answers
  - Tab 4: Overall readiness score, category breakdown, gaps, 5-step action plan, CSV export
  - localStorage: `the-auction-v1`, Route: `/portal/week-1/the-auction`, NEW badge
- **See Through PE Eyes** — "Input Your P&L, See Every Red Flag"
  - 4 tabs: What PE Sees / Enter Your Numbers / Red Flag Analysis / Your Report
  - Tab 1: How PE reads a P&L, the 8 things PE scrutinizes first
  - Tab 2: Monthly P&L input table (12 months × 12 line items), additional context inputs (market owner comp, customer concentration, recurring revenue %)
  - Tab 3: Automated red flag engine (12+ checks: owner comp vs market, seasonality, revenue variance, H2 decline, gross margin trend, customer concentration, low recurring revenue, T&E, EBITDA margin, scale), each flag shows finding + buyer thinking + dollar impact + action
  - Tab 4: Overall verdict, implied valuation range (5x/7x/9x), summary of findings, preparation checklist, CSV export
  - localStorage: `pe-eyes-v1`, Route: `/portal/week-1/pe-eyes`, NEW badge
- **The 24-Month Countdown** — "Enter Your Target Close Date"
  - 3 tabs: The Timeline / Your Countdown / Your Report
  - Tab 1: 6 milestone phases (24mo → 18mo → 12mo → 9mo → 6mo → 3mo), 30 total tasks across 5 categories (financial, legal, team, operations, advisory), critical flags, checkbox completion tracking
  - Tab 2: Target close date input, months remaining calculator, behind-schedule detector with item-level warnings, progress by phase with BEHIND badges
  - Tab 3: Overall completion score, critical items status, behind schedule items, CSV export
  - localStorage: `countdown-24-v1`, Route: `/portal/week-1/countdown-24`, NEW badge
- **Purchase Agreement Survival Guide** — "The 15 Clauses That Cost Sellers the Most"
  - 3 tabs: The 15 Clauses / Agreement Check / Your Report
  - Tab 1: 15 expandable clause cards (Escrow, Indemnification Cap, Basket/Deductible, Survival Periods, Sandbagging, Working Capital, Earnout, R&W Insurance, Non-Compete, Disclosure Schedules, Closing Conditions, Purchase Price Adjustments, Fraud Carve-Out, Specific Indemnities, Dispute Resolution), each with what it means, why it costs you, market terms, buyer wants, seller should push for, negotiation tip
  - Tab 2: 15-question agreement checker (yes/no), good answer + bad sign feedback
  - Tab 3: Overall assessment (Well-Protected → Heavily Buyer-Favored), terms to renegotiate, seller-friendly terms, 6-point attorney discussion guide, CSV export
  - localStorage: `purchase-agreement-v1`, Route: `/portal/week-1/purchase-agreement`, NEW badge
- Commit: `f7c3310` — pushed to noor_frank_playground
- **Next:** Phase 3 Wave 2 enhancements (Financial Data Room Prep, Comparable Company Analysis, DCF Valuation, etc.), Phase 4 thin module upgrades, settings polish, purple theme

### Session 14 — Mar 8, 2026
- **Built Reps & Warranties** — "What Are You Promising?"
  - 4 tabs: What Are R&Ws? / Common Reps / Exposure Checker / Your Report
  - Tab 1: Reps vs warranties explained, escrow holdback (5-15%), fundamental vs general survival periods, 4 protection mechanisms (knowledge qualifiers, basket/deductible, liability cap, R&W insurance), sandbagging
  - Tab 2: 6 rep categories (Financial, Legal, Contracts, Employees, IP, Property) with 16 individual reps, risk levels, expandable cards, what PE looks for
  - Tab 3: 15-question interactive Exposure Checker — yes/no/unsure, contextual explanations + action steps on flagged answers, progress bar
  - Tab 4: Overall risk assessment (Clean/Low/Moderate/High), flagged items sorted by severity, clear items, 7-point attorney discussion guide, CSV export
  - localStorage: `reps-warranties-v1`
  - Route: `/portal/week-4/reps-warranties`, NEW badge
  - New files: `src/components/reps-warranties/RepsWarranties.tsx`, `src/pages/week-4/RepsWarrantiesPage.tsx`
- Commit: `beb6e8e` — pushed to noor_frank_playground
- **Built Rollover Equity & MEPs** — "Your Second Bite"
  - 4 tabs: The Second Bite / How It Works / Calculator / Your Analysis
  - Tab 1: Why PE wants rollover (alignment, confidence, cash savings, transition), first vs second bite visualization, tax deferral benefit
  - Tab 2: MEP equity pools (10-15%), vesting (time/performance/hybrid), good leaver vs bad leaver, waterfall distribution (debt → preferred → capital → profit), drag-along/tag-along rights, 5 negotiation points
  - Tab 3: Second Bite Calculator — 10 sliders (deal value, EBITDA, rollover %, debt %, growth rate, exit multiple, hold period, interest rate, MEP pool), first bite cash, second bite payout, rollover MOIC, total vs no-rollover comparison
  - Tab 4: Deal summary dashboard, rollover vs 100% cash table, color-coded assessment (green 2.5x+ to red <1x), return driver breakdown, CSV export
  - localStorage: `rollover-equity-v1`
  - Route: `/portal/week-2/rollover-equity`, NEW badge
  - New files: `src/components/rollover-equity/RolloverEquity.tsx`, `src/pages/week-2/RolloverEquityPage.tsx`
- Commit: `75e8d54` — pushed to noor_frank_playground
- **Next:** Emotional Side of Selling (last Phase 2 module), then Buyer Perspective 6

### Session 13 — Mar 8, 2026
- **Module reordering** — rearranged entire curriculum to follow natural deal flow
  - Deal Process Roadmap → #1 (was #8), EBITDA Explained → #2 (was #7)
  - Data Room → end of deal readiness (was #1 in Week 2)
  - Valuation tools grouped: EBITDA Calc → Multipliers → Returns Sensitivity → Scenario Planning
  - Sidebar is flat list (no week headers since Session 10), sorted by weekNumber + order
- Commit: `a70d46c` — pushed to noor_frank_playground
- **Built QoE Explainer** — "Surviving the Quality of Earnings"
  - 4 tabs: What is a QoE? / Common Adjustments / Red Flag Checker / Your Report
  - 15-question interactive Red Flag Checker with severity ratings (high/medium/low)
  - Common adjustments in 3 tiers: accepted (green), contested (yellow), rejected (red)
  - Worked EBITDA bridge example showing $164K net adjustment = ~$1M in purchase price
  - Personalized report with assessment, flagged items, clear items, CSV export
  - localStorage: `qoe-explainer-v1`
  - Route: `/portal/week-2/qoe-explainer`, NEW badge
  - New files: `src/components/qoe-explainer/QoEExplainer.tsx`, `src/pages/week-2/QoEExplainerPage.tsx`
- Commits: `ff25676`, `1c0c50a` — pushed to noor_frank_playground
- **Built Working Capital** — "The Surprise at Closing"
  - 4 tabs: What Is Working Capital? / How the Peg Works / WC Estimator / Your Analysis
  - 5-step peg process, $500K real-world example, seasonal business trap
  - PE negotiation tactics with seller defenses
  - Monthly WC estimator: 10 line items × 12 months, closing month selector, collar slider
  - Bar chart visualization of monthly WC vs peg, assessment, CSV export
  - localStorage: `working-capital-v1`
  - Route: `/portal/week-2/working-capital`, NEW badge
  - New files: `src/components/working-capital/WorkingCapital.tsx`, `src/pages/week-2/WorkingCapitalPage.tsx`
- **Built LBO Explainer** — "How PE Firms Buy Companies"
  - 4 tabs: How PE Makes Money / Your Deal Model / Returns Breakdown / What-If Tables
  - 3 levers explained: EBITDA growth, multiple expansion, debt paydown
  - Interactive deal model: 7 sliders (EBITDA, entry multiple, debt %, interest, growth, hold, exit multiple)
  - Sources & uses visual, year-by-year debt paydown table
  - Returns: MOIC/IRR, exit waterfall, attribution bars with commentary
  - 2 sensitivity tables: entry×exit multiple, growth×exit multiple (color-coded green/yellow/red)
  - localStorage: `lbo-explainer-v1`
  - Route: `/portal/week-1/lbo-explainer`, NEW badge
  - New files: `src/components/lbo-explainer/LBOExplainer.tsx`, `src/pages/week-1/LBOExplainerPage.tsx`
- Commit: `f6db3e7` — pushed to noor_frank_playground
- **Built Tax Structuring** — "Asset Deal vs. Stock Deal"
  - 4 tabs: Asset vs Stock / Side-by-Side / Tax Calculator / Strategies
  - Stock vs asset sale: buyer/seller preferences, C-Corp double tax trap
  - 10-row feature comparison table, 338(h)(10) compromise, installment sales
  - Calculator: deal value, entity type, rates, asset allocation → after-tax comparison
  - C-Corp double tax warning with full breakdown when entity = C-Corp
  - 8 tax strategies: allocation negotiation, 338(h)(10), installment, rollover, QSBS, CRT, OZ, state
  - localStorage: `tax-structuring-v1`
  - Route: `/portal/week-2/tax-structuring`, NEW badge
  - New files: `src/components/tax-structuring/TaxStructuring.tsx`, `src/pages/week-2/TaxStructuringPage.tsx`
- Commit: `fbde250` — pushed to noor_frank_playground
- **Next:** Reps & Warranties, Rollover/MEPs, Emotional Side (3 remaining Phase 2 modules)

### Session 10 — Mar 8, 2026
- **Built Settings Page** — Anthropic-style settings with 4-tab layout
  - **Account tab:** Display name, email (localStorage), password change (placeholder), Danger Zone with Delete Account (disabled)
  - **Organization tab:** Company name, industry, city, state, year founded, employee count, business model — all wired to shared Company Profile store, auto-syncs with all connected modules
  - **Team tab:** "Add Member" form (name, email, role dropdown), team list with avatar initial, role badges (Owner/Member/Advisor), status badges (Active/Pending), remove button. Roles Explained card. All persisted in localStorage (`pe-ready-team-v1`)
  - **Billing tab:** Three plan cards (Solo $29/mo, Team $99/mo, Business $249/mo) with feature comparison, Current badge, upgrade buttons (disabled), payment method placeholder
  - Settings link added to sidebar with gear icon, below Company Profile
  - New file: `src/pages/SettingsPage.tsx`
  - Route: `/portal/settings`
  - localStorage keys: `pe-ready-team-v1` (team), `pe-ready-account-v1` (account)
- Commit: `fb6f55b` — pushed to noor_frank_playground
- **Navigation Restructure — stripped week groupings from sidebar**
  - Removed Week 1/2/3/4 headers, progress badges, "Active" badges, and section titles
  - All modules now in one flat scrollable list under "Modules" label
  - Company Profile and Settings remain at top
  - Welcome text updated: "4-Week Exit Readiness Program" → "Exit Readiness Program"
  - No routes, module content, or functionality changed — sidebar only
  - Cleaned up unused imports (week icons, getWeekProgress)
- Commit: `9a44b49` — pushed to noor_frank_playground
- **Settings page UI redesign — NixtNode-inspired premium dark + purple aesthetic**
  - Purple-to-black gradient background (visible purple glow at top, fading to black)
  - Solid black cards with subtle white/8% borders — clear contrast against gradient
  - Decorative SVG arc line across top (like NixtNode reference)
  - Purple solid-fill active tab with glow shadow
  - Native HTML inputs/selects replacing shadcn to avoid dark theme conflicts
  - Centered header layout, text-5xl bold title, uppercase tracking labels
  - Current plan card has purple border glow (`shadow-[0_0_60px]`)
  - ~94% there per Frank — remaining polish for future session
  - Commit: `61ea12f` — pushed to noor_frank_playground

### Session 9 — Mar 8, 2026
- **Deep dive into Anthropic financial-services-plugins repo** — read all 52 skills across 7 categories
- Identified 10 new enhancements (Wave 2) that map to PE Ready from unused plugins
- Added Enhancements 13-22 to PLAYGROUND.md roadmap:
  - 13: Deal Process Roadmap (deal-tracker + process-letter plugins)
  - 14: Comparable Company Analysis (comps-analysis plugin)
  - 15: LBO Explainer (lbo-model plugin)
  - 16: DCF Valuation (dcf-model plugin)
  - 17: Financial Data Room Prep (datapack-builder plugin)
  - 18: Life After Exit (financial-plan plugin)
  - 19: Merger Math (merger-model plugin)
  - 20: The Process Letter (process-letter plugin)
  - 21: Company One-Pager (strip-profile plugin)
  - 22: PE Pitch Deck Builder (pitch-deck-population plugin)
- Added Navigation Restructure plan to Future To-Do (weeks → phases, pillar vs supplemental, industry tags)
- **Built Enhancement 13: Deal Process Roadmap** — 8-stage interactive M&A timeline
  - Stages: Preparation → Marketing → IOIs → Management Presentations → Due Diligence → Final Bids → Signing → Closing
  - Each stage: what happens, what you need ready, common pitfalls, key documents, who's involved, pro tip
  - CSV export, PE Ready connection card at bottom
  - New files: `src/components/deal-process-roadmap/DealProcessRoadmap.tsx`, `src/pages/week-1/DealProcessRoadmapPage.tsx`
  - Route: `/portal/week-1/deal-process`, ENHANCED badge in sidebar
- Commit: `e305c16` — pushed to noor_frank_playground
- **Team Invite Feature — full plan written** (`TEAM-INVITE-PLAN.md` in project root)
  - Owner-controlled model: owner adds members by name/email, pays per seat, shares login link
  - New member clicks link → sets password → joins team workspace
  - Three roles: Owner (full control + billing), Member (edit), Advisor (view-only, free)
  - Requires foundation work: auth migration (MongoDB → Supabase), data migration (localStorage → Supabase)
  - Pricing tiers: Solo ($0-29/mo), Team ($79-99/mo), Business ($199-299/mo)
  - Estimated 5-7 sessions to build
  - **Open questions for Frank:** auth switch approval, build order (team feature vs Wave 2 enhancements), loop Noor in, pricing timing
- **Settings Menu needed** — Anthropic-style settings page with Account, Organization, Team, and Billing tabs. Org tab has company details (name, industry, address, etc. — the "who we are" info). Team tab has "Add Team Member" (name, email, role) + team list. This is the next thing to build — UI shell first, backend wiring in later sessions.
- **IMPORTANT: PE Ready is its own product — completely separate from CCS. Noor is head of dev. Never cross-reference CCS projects.**

### Session 8 — Mar 8, 2026
- **Shared Company Profile — data de-duplication fix**
  - Problem: Users were re-entering the same data across modules (revenue 6x, company name 3x, EBITDA 4x)
  - Created shared data store: `src/lib/companyProfile.ts` with `useCompanyProfile()` hook + `company-profile-v1` localStorage key
  - Created Company Profile page: `src/pages/CompanyProfilePage.tsx` with Company Info, Financial Overview, Customer Metrics, Deal Context sections
  - Added Company Profile link to sidebar (above Week 1)
  - Wired 6 modules to auto-fill from profile:
    - Anonymous Teaser: company name, industry, city, state, revenue, EBITDA, growth, employees, year, deal type
    - CIM Generator: all of the above + timeline, EBITDA margin (replaces old patchwork import)
    - PE Screening Scorecard: revenue, EBITDA, margin, growth, industry, customer concentration
    - Returns Sensitivity: EBITDA, growth rate
    - Revenue Quality Score: revenue, gross margin, growth, EBITDA margin, customers, concentration, business model
    - Value Creation Plan: revenue, EBITDA
  - Profile uses $M for revenue/EBITDA (PE standard). Raw-dollar modules auto-convert.
  - Existing user data takes priority — profile only fills empty fields, never overwrites.
  - Full plan documented in `SHARED-PROFILE-PLAN.md`
  - Route: `/portal/company-profile`
- Commit: `78b65ba` — pushed to noor_frank_playground
- **Remaining from plan:** Assessment bridge (connecting Supabase assessment data to profile) — future session

### Session 7 — Mar 8, 2026
- **Built Enhancement 8: Revenue Quality Score** (final enhancement — 12 of 12 complete!)
  - 4-tab module: Revenue Profile, Customer & Retention, Unit Economics Dashboard, Revenue Quality Score
  - Tab 1: Business model selector (SaaS, Recurring Services, Transaction, Hybrid), revenue figures with recurring % progress bar, ARR bridge inputs with waterfall visualization (Beginning → +New → +Expansion → −Contraction → −Churn → Ending)
  - Tab 2: Customer economics inputs (total/new customers, S&M spend, gross margin), retention & growth rates (gross retention, NDR, logo churn, revenue growth, EBITDA margin), customer concentration (top 1/5/10/20 as % of revenue) with red flag warning for high concentration
  - Tab 3: Unit Economics Dashboard — 6 benchmark cards with green/yellow/red traffic lights: LTV:CAC (>5x best / >3x good / <2x watch), Rule of 40 (>60 / >40 / <30), Magic Number (>1.0x / >0.75x / <0.5x), NDR (>120% / >110% / <100%), Gross Retention (>95% / >90% / <85%), CAC Payback (<12mo / <18mo / >24mo). Plus calculated unit economics grid and ARR bridge visualization.
  - Tab 4: Revenue Quality Score — 6-factor scorecard (1-5 stars each): Recurring Revenue %, Net Dollar Retention, Customer Concentration, Cohort Stability, Growth Durability (Rule of 40), Margin Profile. Overall score with Exceptional/Strong/Moderate/Weak/Critical rating. Auto-generated strengths and concerns. "What PE Firms Will Think" assessment paragraph tailored to score range.
  - CSV export with full report data
  - localStorage persistence (`revenue-quality-v1`)
  - ENHANCED badge on sidebar + page header
  - Route: `/portal/week-3/revenue-quality`
  - New files: `src/components/revenue-quality/RevenueQuality.tsx`, `src/pages/week-3/RevenueQualityPage.tsx`
- Commit: `01eb86a` — pushed to noor_frank_playground
- **ALL 12 ENHANCEMENTS COMPLETE.** Next up: App-wide UI redesign to premium purple theme.

### Session 6 — Mar 8, 2026
- **Built Enhancement 7: Draft CIM Generator** (graduation deliverable)
  - 6-step wizard: Introduction → Company & Deal Setup → Business Description → Market & Growth → Customers, Team & Financials → Generated CIM Document
  - 7-section professional CIM layout: I. Executive Summary, II. Company Overview, III. Industry Overview, IV. Growth Opportunities, V. Customers & Sales, VI. Operations, VII. Financial Overview
  - Anonymization mode: company name → code name, location → region, financials → ranges, employee count → ranges
  - Auto-imports data from other PE Ready modules (company name, key personnel, EBITDA, value creation levers)
  - Auto-generated investment highlights from financial data when none manually entered
  - Financial snapshot tables in Executive Summary and Financial Overview sections
  - Market size / growth trends callout boxes in Industry Overview
  - Customer concentration and retention metrics callout boxes
  - Downloadable text export (full CIM draft with all 7 sections)
  - localStorage persistence (`cim-generator-v1`) — users can leave and return to edit
  - Confidentiality disclaimer in document footer
  - ENHANCED badge on sidebar + page header
  - New files: `src/components/cim-generator/CIMGenerator.tsx`, `src/pages/week-4/CIMGeneratorPage.tsx`
  - Route: `/portal/week-4/cim-generator`
- Commit: `b7ee4ee` — pushed to noor_frank_playground
- **Next:** 1 enhancement remaining (#8: Revenue Quality Score). Then the app-wide purple theme redesign.

### Session 5 — Mar 8, 2026
- **Built Enhancement 1: Sector-Tailored DD Checklists** (largest enhancement)
  - Replaced generic 34-item / 5-category checklist with industry-tailored system
  - Industry selection screen: SaaS, Healthcare, Manufacturing/Industrial, Financial Services, Consumer/Retail
  - 7 professional workstreams: Financial, Commercial, Legal, Operational, HR/People, IT/Technology, Environmental/ESG
  - 140+ checklist items: base items for all sectors + sector-specific items auto-added per industry
  - 6-state status workflow: Not Started → Requested → Received → In Review → Complete → Red Flag
  - P0/P1/P2 priority tiers with color-coded badges (Critical, Important, Nice to Have)
  - Red flag panel: collapsible summary of all red-flagged items with severity (Deal-Breaker/Significant/Manageable), finding, and mitigant
  - Progress dashboard: overall completion bar + per-workstream progress bars + status counts (6 statuses)
  - Search, filter by status/priority, workstream tabs (All + 7 workstreams)
  - Expandable item rows with notes field and red flag documentation
  - CSV export with all fields including red flag data, sector-stamped filename
  - ENHANCED badge on sidebar + page header
  - New data file: `src/lib/checklists/sectorDDChecklist.ts`
  - Rebuilt component: `src/components/due-diligence/DueDiligenceChecklist.tsx`
  - localStorage key: `dd-checklist-v2` (new data structure, won't conflict with old)
- Commit: `d28cfea` — pushed to noor_frank_playground
- **Built Enhancement 4: EBITDA Bridge + 100-Day Plan + Value Creation KPIs**
  - New standalone module: Value Creation Plan (Week 3, route: `/portal/week-3/value-creation`)
  - Tab 1: Baseline Financials + Value Creation Levers in 3 categories (Revenue Growth, Margin Expansion, Strategic/Multiple Expansion)
  - Each lever: name, description, current/target state, 5-year EBITDA impact by year, investment required, confidence (high/medium/low)
  - Tab 2: EBITDA Bridge — auto-calculated 5-year walk from base EBITDA to pro forma, color-coded subtotals by category, growth %, implied margin
  - Tab 3: 100-Day Post-Close Plan — 3 phase cards (Days 1-30 Stabilize, 31-60 Plan, 61-100 Execute) with checkboxes, owners, priorities, progress bar
  - Tab 4: KPI Dashboard — 7 default KPIs (Revenue, EBITDA, Margin, Customer Wins, Retention, Turnover, Cash Conversion) with Current/Target/Owner/Frequency
  - CSV export, ENHANCED badge on sidebar + page header
  - localStorage key: `value-creation-plan-v1`
- Commit: `a547ad7` — pushed to noor_frank_playground
- **Set up Obsidian** (v1.12.4) vault at `C:\Users\FrankDalton\myProjects` for browsing all project .md files
- **Next:** 2 enhancements remaining (#7, #8). Frank picks next.

### Session 4 — Mar 8, 2026
- **Built Enhancement 3: Mock IC Memo (Final Report Upgrade)**
  - Replaced tabbed dashboard with single scrollable IC Memo document
  - 9 Roman-numeral sections matching real PE IC memo format
  - I. Executive Summary — recommendation banner, overview paragraph, key metrics
  - II. Company Overview — snapshot grid, management team assessment (PE-Ready/At Risk/Hires)
  - III. Industry & Market — template with link to Competitive Analysis module
  - IV. Financial Analysis — EBITDA bridge table, readiness bars, DD readiness
  - V. Investment Thesis — dynamically derived pillars from financial data
  - VI. Deal Terms & Structure — valuation table, illustrative Sources & Uses
  - VII. Returns Analysis — base case IRR/MOIC, assumptions table, link to Returns Sensitivity
  - VIII. Risk Factors — deal killer counters + severity-ranked risks with mitigants
  - IX. Recommendation — verdict (Proceed/Conditional/Pass), next steps, professional support
  - Table of contents with smooth-scroll navigation
  - CONFIDENTIAL + ENHANCED badges in header
  - Educational disclaimer explaining this is a mock document
  - Print/Share/Download PDF buttons preserved
  - ENHANCED badge on sidebar
- Commit: `cb48270` — pushed to noor_frank_playground
- Added UI redesign to-do (premium purple theme, reference: `ui-reference.png`)
- Commit: `7e351c3` — pushed to noor_frank_playground
- **Fixed loading spinner bug on 3 pages:** DataRoomPage, QuickWinsPage, StrategyDocBuilderPage
  - Same `if (!user) { setLoading(false); return; }` fix from Session 2
  - All 5 affected pages now fixed (KPIs + KnowYourBuyer were done in Session 2)
- Commit: `162c723` — pushed to noor_frank_playground
- **Next:** 4 enhancements remaining (#1, #4, #7, #8). Frank picks next.
- **Future:** App-wide UI redesign to premium purple theme (see Future To-Do section)

### Session 3 — Mar 8, 2026
- **Built Enhancement 2: PE Screening Scorecard**
  - 4-step flow: Intro > Company Financials > Deal Fit > Screening Results
  - 10 PE investment criteria with Pass/Caution/Fail per criterion
  - Overall verdict: Pass / Further Diligence / Hard Pass
  - Bull case and bear case bullets generated from actual results
  - "Questions PE Will Ask You" tailored to weak spots
  - Auto-calculates EBITDA margin and enterprise value
  - ENHANCED badge on sidebar + page header
- Commit: `d20c2de` — pushed to noor_frank_playground
- **Built Enhancement 12: Competitive Analysis Frameworks**
  - TAM/SAM/SOM market sizing with visual funnel bar chart
  - Porter's Five Forces with low/medium/high per force + industry attractiveness score
  - Competitive positioning map (SVG 2D chart: quality vs price)
  - Combined report page with overall verdict + PE-ready market narrative template
  - ENHANCED badge on sidebar + page header
- Commit: `1f8a540` — pushed to noor_frank_playground
- **Built Enhancement 5: Returns Sensitivity Tables**
  - IRR/MOIC calculations with Bull/Base/Bear scenario cards
  - Returns attribution waterfall (growth vs multiple expansion vs debt paydown)
  - 2-way sensitivity table: entry multiple vs exit multiple (color-coded)
  - 2-way sensitivity table: growth rate vs exit multiple (color-coded)
  - Live deal summary with equity check calculation
  - Auto-fill bull/bear scenarios from base case
  - ENHANCED badge on sidebar + page header
- Commit: `0580de9` — pushed to noor_frank_playground
- **Built Enhancement 10: Anonymous Teaser Generator**
  - 3-step flow: Intro > Company Details > Generated Teaser
  - Auto-anonymization: name to code name, city to region, exact financials to ranges
  - Professional teaser layout with investment highlights and financial summary table
  - Confidentiality disclaimer
  - ENHANCED badge on sidebar + page header
- Commit: `53904eb` — pushed to noor_frank_playground
- **Next:** 5 enhancements remaining. Frank picks next.

### Session 2 — Mar 8, 2026
- Added 3 missing enhancements to roadmap (10: Anonymous Teaser, 11: Buyer List Framework, 12: Competitive Analysis) — now 12 total
- Created CHANGELOG.md (working session tracker) and ARCHIVE.md (permanent history)
- Full code audit of existing KPI/OKR module and Anthropic portfolio-monitoring plugin
- **Built Enhancement 9: Traffic Light KPI Dashboard**
  - Auto-calculated green/yellow/red based on progress vs target
  - Traffic light summary bar at top of dashboard
  - Gauge and metric colors now auto-calculated
  - Action Focus shows red flags first, then yellow
  - 5 new PE Financial Health KPI templates added
  - ENHANCED badge on sidebar + page header
- Commit: `04224ce` — pushed to noor_frank_playground
- Fixed KPI page loading bug (pre-existing: loading spinner when not logged in) — commit `24979af`
- **Built Enhancement 6: Mock Management Presentation Prep**
  - Added 6 categories of real PE interview questions to Discovery Interview results
  - Collapsible sections with coaching notes per category
  - "The Closing Question" highlight at the bottom
  - ENHANCED badge on sidebar + page header
- Commit: `4680693` — pushed to noor_frank_playground
- **Built Enhancement 11: Buyer Targeting Framework**
  - Strategic vs Financial buyer categories with sub-types
  - Tiered prioritization (Tier 1/2/3) with descriptions
  - What to look for in potential buyers
  - ENHANCED badge on sidebar + page header
- Commit: `2ff807a` — pushed to noor_frank_playground
- Fixed Know Your Buyer loading bug (same pre-existing issue) — commit `4d310ef`
- **Known issue:** "Lower is better" metrics don't calculate correctly (pre-existing)
- **Known issue:** Multiple pages likely have the same loading bug (return early without setLoading(false) when !user). Check other pages as we enhance them.
- **Next:** 9 enhancements remaining. Frank picks next.

### Session 1 — Mar 8, 2026
- Created `noor_frank_playground` branch
- Pushed branch to GitHub
- Created this PLAYGROUND.md file
- Created conversation starter document for Frank
- Dev server confirmed running on port 8080
- No code changes yet — planning session only

---
