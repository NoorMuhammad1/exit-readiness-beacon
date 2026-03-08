# Shared Company Profile — Fix Plan

**Problem:** 12 enhancements were built as islands. Users re-enter the same data across multiple modules — revenue up to 6 times, company name 3 times, EBITDA 4 times. Two modules (Teaser, Returns Sensitivity) don't even save their data when you leave the page.

**Solution:** One shared Company Profile that every module reads from. Enter once, use everywhere.

---

## The Overlap Table

| Data Point | Modules That Ask For It | Times Asked |
|---|---|---|
| Company Name | Assessment, Teaser, CIM Generator | 3x |
| Industry | Assessment, Teaser, CIM Generator | 3x |
| Employee Count | Assessment, Teaser, CIM Generator | 3x |
| Year Founded | Assessment, Teaser, CIM Generator | 3x |
| Annual Revenue | Assessment, EBITDA Calc, Teaser, CIM, Value Creation, Revenue Quality | 6x |
| EBITDA | EBITDA Calc, Value Creation, CIM, Returns Sensitivity | 4x |
| Revenue Growth Rate | Teaser, CIM, Returns Sensitivity, Revenue Quality | 4x |
| EBITDA Margin | Revenue Quality, CIM Generator | 2x |
| Location (city/state) | Teaser, CIM Generator | 2x |
| Transaction Type | Assessment, Teaser, CIM Generator | 3x |
| Exit Timeline | Assessment, CIM Generator | 2x |
| Customer Concentration | Revenue Quality, CIM Generator | 2x |

---

## Data Silo Table

| Module | Storage | Connected To |
|---|---|---|
| Assessment | Supabase backend | Nothing reads it |
| EBITDA Calculator | Supabase table | Nothing reads it |
| KPIs and OKRs | Supabase table | Nothing reads it |
| Value Creation Plan | localStorage `value-creation-plan-v1` | CIM reads 2 fields |
| Revenue Quality | localStorage `revenue-quality-v1` | Isolated |
| Teaser | Component state (LOST on page leave) | Isolated |
| Returns Sensitivity | Component state (LOST on page leave) | Isolated |
| Discovery Interview | Component state | Isolated |
| CIM Generator | localStorage `cim-generator-v1` | Reads from 4 other keys |

---

## Fix Steps

### Step 1: Create shared data store (FOUNDATION)
- New file: `src/lib/companyProfile.ts`
- Single localStorage key: `company-profile-v1`
- Holds: company name, industry, year founded, employee count, location (city/state), annual revenue, EBITDA, EBITDA margin, revenue growth rate, transaction type, exit timeline, customer count, customer concentration, gross margin, business model type
- Helper functions: `getCompanyProfile()`, `updateCompanyProfile()`, `useCompanyProfile()` hook
- Any module can read from it, any module can write back to it

### Step 2: Build Company Profile page
- New sidebar item at the top (before Week 1, or as first item in Week 1)
- Single form page where users enter all their core business data
- This becomes the source of truth
- Route: `/portal/company-profile`

### Step 3: Wire the 3 worst offenders
- **Anonymous Teaser**: Auto-fill company name, industry, revenue, EBITDA, employees, year, location, growth rate from profile. Also add localStorage persistence so data isn't lost.
- **CIM Generator**: Auto-fill from profile instead of its current patchwork of reading 4 different localStorage keys
- **Revenue Quality**: Auto-fill revenue, EBITDA margin, growth rate, customer count from profile

### Step 4: Wire remaining modules
- **Returns Sensitivity**: Auto-fill EBITDA, growth rate. Add localStorage persistence.
- **Value Creation Plan**: Auto-fill revenue, EBITDA from profile
- **PE Screening Scorecard**: Auto-fill revenue, EBITDA, growth, industry from profile

### Step 5: Assessment bridge (future session)
- Assessment already collects company name, industry, revenue ranges, employee count, year founded via Supabase
- Wire it so when a logged-in user loads the portal, their assessment data pre-fills the Company Profile
- This connects the Supabase data back to the client-side modules

---

## Rules for Module Integration

- Modules auto-populate from Company Profile on first load
- If user already has local data saved (existing localStorage), that takes priority (don't overwrite their work)
- Users can still edit fields locally in each module — the profile is the default, not a lock
- When a user changes a core field in a module, offer to update the Company Profile too (future nice-to-have)

---

## Files to Create
- `src/lib/companyProfile.ts` — shared store + hook
- `src/pages/CompanyProfilePage.tsx` — the profile form page

## Files to Modify
- `src/config/moduleConfig.ts` — add Company Profile to sidebar
- `src/App.tsx` — add route
- `src/components/revenue-quality/RevenueQuality.tsx` — read from profile
- `src/components/anonymous-teaser/AnonymousTeaser.tsx` — read from profile + add localStorage
- `src/components/cim-generator/CIMGenerator.tsx` — read from profile instead of patchwork
- `src/components/returns-sensitivity/ReturnsSensitivity.tsx` — read from profile + add localStorage
- `src/pages/week-3/ValueCreationPlanPage.tsx` — read from profile
- PE Screening Scorecard component — read from profile

---

## Status
- [ ] Step 1: Shared data store created
- [ ] Step 2: Company Profile page built
- [ ] Step 3: Teaser wired
- [ ] Step 3: CIM Generator wired
- [ ] Step 3: Revenue Quality wired
- [ ] Step 4: Returns Sensitivity wired
- [ ] Step 4: Value Creation Plan wired
- [ ] Step 4: PE Screening wired
- [ ] Step 5: Assessment bridge (future session)
