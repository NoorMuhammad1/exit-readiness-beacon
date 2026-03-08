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
**Status:** NOT STARTED
**Upgrades:** New premium feature — Week 4 graduation deliverable
**What it does:** Auto-generates a draft Confidential Information Memorandum from data entered throughout the program. Sections: Executive Summary, Company Overview, Industry Overview, Growth Opportunities, Customers & Sales, Operations, Financial Overview. Anonymization options included. Output as downloadable document.
**Source plugin:** investment-banking/skills/cim-builder/SKILL.md

### Enhancement 8: Revenue Quality Score (SaaS/Subscription)
**Status:** NOT STARTED
**Upgrades:** Week 3 EBITDA Calculator area — new sub-module
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

## Future To-Do (Not Enhancements — Separate Sessions)

### App-Wide UI Redesign: Premium Purple Theme
**Status:** NOT STARTED
**What it does:** Redesign the entire PE Ready app to match a premium dark + purple gradient aesthetic. Reference screenshot saved at `ui-reference.png` in project root. Key elements: purple radial gradient backgrounds, oversized bold typography, solid black cards, decorative SVG arc lines, consistent purple accent color across all pages (sidebar, nav, every module). This is a multi-session styling overhaul — no structural/logic changes.
**Reference:** `ui-reference.png` (NixtNode-style design)

---

## Session Log

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
