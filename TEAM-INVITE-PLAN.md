# PE Ready Plus — Team Invite Feature Plan

**Status:** PLANNING (design talk — not building yet)
**Approach:** Anthropic-style Org vs Personal model
**Goal:** Let business owners invite partners, CFO, management team, and advisors to collaborate

---

## The Idea (Plain English)

Right now PE Ready is a solo experience. One person signs up, fills everything out alone. But selling a business is a team sport. The owner, their partners, their CFO, their attorney — they all need to be involved.

We're borrowing the same model Anthropic uses for Claude:
- You have a **personal account** (your login, your stuff)
- You can create a **Company** (like an Org)
- You **invite people** by name and email
- Everyone in the Company sees the shared data
- You can also work on your own personal stuff

That's it. No complicated permissions. No enterprise role matrices. Simple.

---

## How It Works for Users

### Step 1: Owner Signs Up (Already Works)
Business owner signs up for PE Ready like they do today. Nothing changes here.

### Step 2: Company Gets Created Automatically
When the owner fills out their Company Profile (company name, industry, etc.), that becomes the "Company" — the shared workspace. Everyone they invite will see this same Company Profile and shared modules.

### Step 3: Team Tab — Owner Adds Members
New "Team" page in the sidebar (or tab on Company Profile):
- **"Add Team Member"** button
- Owner enters: **Name**, **Email**, **Role** (Member or Advisor)
- Owner **pays for the seat** right there (billing happens at add time, not later)
- System creates the account and generates a **login link**
- Owner gets the link — shares it with the person however they want (text, email, in person)
- **Current team** list shows all members with name, role, status (active/pending), and remove option

### Step 4: New Member Experience
Person receives the login link from the owner.
- Click link → lands on a simple "Set Your Password" page
- Their name and email are already filled in (owner entered it)
- They set a password → they're in
- Auto-joined to the Company workspace with all shared data visible

### Step 5: Silo or Team
- **Shared data** (everyone on the team sees it): Company Profile, EBITDA data, DD checklist, assessment answers, financial data, CIM draft, teaser, all module work
- **Personal data** (only you see it): Your own login, your preferences
- **No team?** No problem — works exactly like it does today. Solo user, solo experience. The team feature is there when you need it.
- **Owner controls everything:** Nobody joins without the owner explicitly adding them and paying for their seat. Owner can remove anyone at any time.

For the MVP, everything is shared within the Company. No per-module permissions. If you're on the team, you see it all. Simple.

---

## Three Roles (Keep It Simple)

| Role | Who | What They Can Do |
|------|-----|-----------------|
| **Owner** | Business owner who created the account | Everything + billing + delete company + remove members |
| **Member** | Partners, CFO, management team | View and edit all shared modules |
| **Advisor** | Attorney, CPA, banker | View all shared modules (read-only) — free, doesn't count against seat limit |

That's it. Three roles. Owner runs the show, Members work alongside them, Advisors can see but not touch.

---

## What Needs to Change Under the Hood

### Current State (What We Have Now)

| Thing | Where It Lives | Problem |
|-------|---------------|---------|
| User accounts | MongoDB backend (JWT tokens) | Supabase has auth ready but unused |
| Company Profile | localStorage (browser) | Can't share — locked to one browser |
| All module data | localStorage (browser) | Can't share — locked to one browser |
| Assessment answers | Supabase (public table) | Not linked to user accounts |
| Admin dashboard | MongoDB roles | Separate from client portal |

**The core problem:** Everything important lives in localStorage. That means:
- Data disappears if you clear your browser
- Can't access from another device
- Can't share with team members
- No backup

### What We Need to Build

**Phase 1: Foundation (Must Do First)**
Move the data from browser storage to the real database so it can be shared.

1. **Switch auth to Supabase** — Stop using MongoDB for logins. Supabase Auth is already configured and ready. This makes everything else possible.
2. **Create Company/Org tables** — When someone fills out Company Profile, it creates a Company in the database. That Company is the shared workspace.
3. **Move Company Profile to Supabase** — Instead of `localStorage`, save to a `companies` table. Everyone on the team reads from the same table.
4. **Move module data to Supabase** — Each module's data goes from `localStorage` to a Supabase table linked to the Company.

**Phase 2: Team Invites**
Once data lives in Supabase, sharing is just a database query.

5. **Team page UI** — Owner adds members (name, email, role) and pays per seat
6. **Account provisioning** — System creates the account, generates a login link for the owner to share
7. **Login link flow** — New member clicks link → sets password → they're in
8. **Team management** — Owner sees all members, can remove anyone, billing adjusts automatically

**Phase 3: Polish**
9. **Activity feed** — "CFO updated EBITDA margins 2 hours ago"
10. **Advisor read-only mode** — Advisors see everything but can't edit
11. **Switch between Personal and Company** view (if we want personal workspace too)

---

## Database Tables We Need

### New Tables

**companies**
- `id` (UUID)
- `name` (from Company Profile)
- `owner_id` (user who created it)
- `industry`, `city`, `state` (basic company info)
- `subscription_tier` ('free', 'team', 'business')
- `created_at`

**company_members**
- `id` (UUID)
- `company_id` (links to companies)
- `user_id` (links to auth.users)
- `role` ('owner', 'member', 'advisor')
- `invited_by` (user who sent the invite)
- `joined_at`

**team_seats**
- `id` (UUID)
- `company_id`
- `user_id` (links to auth.users — filled when the person activates their account)
- `name` (entered by owner at add time)
- `email` (entered by owner at add time)
- `role` ('member' or 'advisor')
- `added_by` (owner who added them)
- `login_token` (unique URL-safe string — the login link the owner shares)
- `status` ('pending', 'active', 'removed')
- `activated_at` (when they set their password and logged in)
- `created_at`

### Modified Tables

**company_profiles** (replaces localStorage `company-profile-v1`)
- Same fields as current Company Profile
- Add `company_id` (links to companies table)
- Shared — all team members see and edit the same profile

**module_data** (replaces all localStorage module keys)
- `id`, `company_id`, `module_key` (e.g., 'dd-checklist-v2'), `data` (JSONB), `updated_by`, `updated_at`
- One row per module per company
- All team members read/write the same row

---

## Migration Path (Don't Break Anything)

We can't just flip a switch — existing users have data in localStorage. Here's how we handle it:

1. **Auth migration:** When an existing MongoDB user logs in after we switch to Supabase Auth, we create their Supabase account automatically and link it. One-time migration, transparent to the user.

2. **Data migration:** First time a user opens PE Ready after the update, we check if they have localStorage data. If yes, we push it to Supabase and link it to their new Company. Then localStorage becomes a cache/backup, not the source of truth.

3. **Fallback:** If Supabase is down, the app can fall back to localStorage so users aren't blocked. Data syncs when connection returns.

---

## Pricing Model (How We Make Money)

Following the SaaS patterns from research:

| Tier | Price | What You Get |
|------|-------|-------------|
| **Solo** | Free or $29/mo | 1 user, all modules, no team features |
| **Team** | $79-$99/mo | Owner + 4 team members, unlimited free advisors, all modules |
| **Business** | $199-$299/mo | Unlimited members, unlimited advisors, priority support, AI features |

**Key pricing decisions:**
- Advisors (attorney, CPA, banker) are always **free** — they don't count against seat limits. This is the Notion model and it works. You want advisors IN the platform, not locked out.
- Team tier is where most customers land — a business owner with a CFO and 2-3 managers.
- AI features (like AI-powered CIM generation, smart assessment analysis) gate the Business tier.

---

## What Goes Where (Shared vs Personal)

### Shared (Everyone on the Team Sees It)

- Company Profile (name, financials, industry, etc.)
- All module data (DD Checklist, CIM, Teaser, Returns, etc.)
- Assessment answers
- Data Room documents
- Deal Process Roadmap progress
- KPIs and OKRs

### Personal (Only You See It)

- Your login credentials
- Your notification preferences
- Personal notes (future feature)
- Activity log (what YOU did)

For the MVP, everything is shared. Personal workspace is a future nice-to-have.

---

## Build Order (Sessions)

This is a multi-session project. Here's the rough order:

| Session | What | Depends On |
|---------|------|-----------|
| A | Switch auth from MongoDB to Supabase Auth | Nothing — do this first |
| B | Create companies + company_members tables, migrate Company Profile to Supabase | Session A |
| C | Move all module data from localStorage to Supabase (module_data table) | Session B |
| D | Build team_seats table + Team page UI (owner adds members, pays per seat, gets login link) | Session B |
| E | Login link flow (new member clicks link → sets password → joins team) + team management | Session D |
| F | Advisor read-only mode + activity feed | Session E |
| G | Pricing/subscription gating (which tier gets what) | Session B |

Sessions A-C are the foundation. Sessions D-E are the team feature. Sessions F-G are polish.

**Estimated total: 5-7 sessions** depending on complexity.

---

## Open Questions for Frank

1. **Auth switch:** We need to move from MongoDB to Supabase Auth. This is the biggest technical change. Are you comfortable with this? (It's the right move — Supabase Auth is already set up and ready.)

2. **When to start building:** This is a big project. Do you want to finish the Wave 2 enhancements (14-22) first, or start the team feature now?

3. **Pricing tiers:** Do you want to implement pricing gating now, or build the team feature first and add pricing later?

4. **Noor (head of dev):** Should we loop Noor in on the auth migration plan before we start building?

---

## Summary

Owner-controlled team model. Owner adds members by name and email, pays per seat, gets a login link to share. New member clicks the link, sets their password, they're in. Three roles: Owner, Member, Advisor. No open invites floating around — the owner controls who's on the team and pays for every seat. Start by moving data from localStorage to Supabase (the foundation), then build team management on top.

This is the feature that turns PE Ready from a solo educational tool into a team SaaS platform. It's how you charge per seat, how you retain users, and how you make the product sticky — because once a whole team is using it, nobody switches.
