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
**Status:** NOT STARTED
**Upgrades:** Week 4 Due Diligence Checklist module
**What it does:** Instead of a one-size-fits-all checklist, the DD checklist adapts based on the business owner's industry (SaaS, Healthcare, Manufacturing, Financial Services, Consumer). Adds 7 workstreams (Financial, Commercial, Legal, Operational, HR/People, IT/Tech, Environmental/ESG). Adds status workflow (Not Started > Requested > Received > In Review > Complete > Red Flag). Adds priority tiers (P0/P1/P2) and red flag severity (Deal-breaker / Significant / Manageable).
**Source plugin:** private-equity/skills/dd-checklist/SKILL.md

### Enhancement 2: PE Screening Scorecard
**Status:** NOT STARTED
**Upgrades:** Assessment results / could be new module
**What it does:** Shows business owners how a PE firm would score their company across 10 criteria: Revenue range, EBITDA range, EBITDA margin, Growth profile, Sector fit, Geography, Deal size/EV, Valuation multiple, Customer concentration, Management continuity. Gives a Pass/Further Diligence/Hard Pass verdict with bull case and bear case bullets.
**Source plugin:** private-equity/skills/deal-screening/SKILL.md

### Enhancement 3: Mock IC Memo (Final Report Upgrade)
**Status:** NOT STARTED
**Upgrades:** Week 4 Final Report module
**What it does:** Restructures the Final Report to look like a real Investment Committee memo — the document that decides whether a PE firm writes a check. Sections: Executive Summary, Company Overview, Industry & Market, Financial Analysis, Investment Thesis, Deal Terms, Returns Analysis, Risk Factors, Recommendation. Uses data the business owner has already entered throughout the 4-week program.
**Source plugin:** private-equity/skills/ic-memo/SKILL.md

### Enhancement 4: EBITDA Bridge + 100-Day Plan
**Status:** NOT STARTED
**Upgrades:** Week 3 Scenario Planning + Week 4 Strategy Doc Builder
**What it does:** Adds an EBITDA bridge table (current EBITDA > value creation levers > target EBITDA over 5 years). Adds a 100-day post-close plan template (Days 1-30 Stabilize, Days 31-60 Plan, Days 61-100 Execute). Adds KPI dashboard with Current/Target/Owner/Frequency columns. Categories: Revenue growth levers, margin expansion levers, strategic/multiple expansion levers.
**Source plugin:** private-equity/skills/value-creation-plan/SKILL.md

### Enhancement 5: Returns Sensitivity Tables
**Status:** NOT STARTED
**Upgrades:** Week 3 EBITDA Calculator + Industry Multipliers
**What it does:** Adds IRR and MOIC calculations alongside the existing EBITDA x multiple valuation. Adds 2-way sensitivity tables (entry multiple vs exit multiple, growth vs exit multiple). Adds Bull/Base/Bear scenario comparison. Shows returns attribution: how much comes from growth vs multiple expansion vs debt paydown.
**Source plugin:** private-equity/skills/returns-analysis/SKILL.md

### Enhancement 6: Management Presentation Prep
**Status:** NOT STARTED
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
**Status:** NOT STARTED
**Upgrades:** Week 4 KPIs and OKRs module
**What it does:** Adds Green/Yellow/Red status indicators to KPIs. Green = within 5% of target. Yellow = 5-15% below target. Red = more than 15% below or critical issue. Specific financial KPI list (Revenue vs budget, EBITDA margin vs budget, leverage ratio, interest coverage, FCF) and operational KPIs (customer count, revenue per customer, headcount, churn).
**Source plugin:** private-equity/skills/portfolio-monitoring/SKILL.md

### Enhancement 10: Anonymous Teaser Generator
**Status:** NOT STARTED
**Upgrades:** New premium feature — pairs with CIM Generator
**What it does:** Auto-generates a one-page blind teaser from assessment data. Includes deal code name, 4-6 investment highlight bullets, financial summary table, and anonymization rules (no company name, region instead of city, revenue ranges instead of exact figures). This is the "movie trailer" a banker sends to potential buyers before revealing the company identity.
**Source plugin:** investment-banking/skills/cim-builder/SKILL.md (teaser section)

### Enhancement 11: Buyer List Framework
**Status:** NOT STARTED
**Upgrades:** Week 1 Know Your Buyer module
**What it does:** Upgrades the buyer type quiz to show specific buyer categories: strategic buyers (direct competitors, adjacent players, vertical integrators, platform builders) and financial sponsors (platform investors, add-on buyers, growth equity). Adds tiered prioritization (Tier 1: 5-10 best fits, Tier 2: 10-15 solid, Tier 3: 10-20 long shots). Shows what each buyer type looks for, recent M&A activity signals, fund vintage and deployment pace.
**Source plugin:** investment-banking/skills/buyer-targeting/SKILL.md

### Enhancement 12: Competitive Analysis Frameworks
**Status:** NOT STARTED
**Upgrades:** Week 3 Business Scorecard area
**What it does:** Adds TAM/SAM/SOM market sizing framework, Porter's Five Forces analysis, and competitive positioning maps (2x2 matrices with industry-specific axes). Answers "How big is your market and what's your share?" — exactly what PE firms want in the Company Overview section of any deal document.
**Source plugin:** equity-research/skills/industry-analysis/SKILL.md

---

## Session Log

### Session 2 — Mar 8, 2026
- Added 3 missing enhancements to roadmap (10: Anonymous Teaser, 11: Buyer List Framework, 12: Competitive Analysis) — now 12 total
- Created CHANGELOG.md (working session tracker) and ARCHIVE.md (permanent history)
- Full code audit of existing KPI/OKR module and Anthropic portfolio-monitoring plugin
- Enhancement 9 (Traffic Light KPI Dashboard) selected as first build
- _(more entries as session progresses)_

### Session 1 — Mar 8, 2026
- Created `noor_frank_playground` branch
- Pushed branch to GitHub
- Created this PLAYGROUND.md file
- Created conversation starter document for Frank
- Dev server confirmed running on port 8080
- No code changes yet — planning session only

---
