# PE Ready: Mini MVP Roadmap

> **Living Document** — Update this file after completing each step. When resuming work, read this first to know exactly where we are.

---

## Current Status
**Branch:** `mini-mvp` (separate from `main`)
**Deployment:** Vercel (separate project, same Supabase DB as main app)
**Overall Phase:** 🔄 Phase 1 In Progress

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Branch + Vercel setup | ✅ Complete |
| 1 | Reality Check funnel (`/reality-check`) | 🔄 In Progress |
| 2 | Lite Portal (3 modules unlocked, rest locked) | ⬜ Not Started |
| 3 | ElevenLabs AI Voice Guide | ⬜ Not Started |

**Last completed step:** 0.5 — Vercel deployment confirmed live
**Next step:** 1.1 — Add `/reality-check` route to `src/App.tsx`

---

## What This Mini MVP Is

A fear-based lead capture tool that:
1. Asks the user what they *think* their business is worth
2. Calculates what PE buyers would *actually* offer using real EBITDA + multiples logic
3. Reveals the gap dramatically, names 3 deal killers
4. Converts them to sign up for PE Ready
5. Gives them access to 3 hook modules with an ElevenLabs AI voice guide built in
6. When the full product launches, their account and data already exist — all modules unlock

**Same PE Ready brand. Same Supabase database. Different Vercel deployment.**

---

## Phase 0: Branch + Vercel Setup
**Goal:** Running infrastructure before writing any feature code.

### Steps
- [x] 0.1 — Create `mini-mvp` branch off `main`
- [x] 0.2 — Push branch to GitHub
- [ ] 0.3 — **MANUAL:** Create new Vercel project → import same GitHub repo → set branch to `mini-mvp`
- [x] 0.4 — No Vercel env vars needed. Supabase URL + anon key are hardcoded in `src/integrations/supabase/client.ts` (they are public/publishable keys, this is intentional). OpenAI key is a Supabase secret inside the edge function, not a Vercel env var.
- [ ] 0.5 — Confirm Vercel deploy succeeds and URL loads the app
- [x] 0.6 — Save `MINI_MVP_ROADMAP.md` into the repo root on this branch

**Done when:** Vercel URL for mini-mvp branch is live and loads the app.

---

## Phase 1: Reality Check Funnel (`/reality-check`)
**Goal:** A fully public, no-auth-required multi-step form that takes the user from perceived value → gap reveal → CTA.

### What it looks like
```
Step 1: "What do you think your business is worth?" ($ input)
Step 2: Revenue (last 12 months) + EBITDA margin % + Industry (dropdown) + Owner dependence (1-5 scale)
Step 3: [Gap Reveal] "You think $X. PE buyers see $Y. Here's why:"
Step 4: [3 Deal Killer cards] — animated, punchy
Step 5: [CTA] Email capture / Sign up button
```

### Files to Create
```
src/pages/RealityCheck.tsx              ← main page, routes to /reality-check
src/components/mvp/
  StepQuestionnaire.tsx                 ← steps 1 & 2 (inputs)
  GapReveal.tsx                         ← step 3 (the dramatic result)
  DealKillerCards.tsx                   ← step 4 (3 cards)
  MVPEmailCapture.tsx                   ← step 5 (CTA + email)
```

### Existing Code to Reuse (do NOT rewrite)
| File | What to use |
|------|------------|
| `src/lib/calculations/ebitda.ts` | `calculateValuation()`, formatters |
| `src/lib/calculations/multiples.ts` | Industry multiples lookup |
| `src/components/ui/` | All shadcn components (Button, Input, Select, Card, etc.) |
| `contact_inquiries` Supabase table | Email capture (public insert already enabled) |

### Steps
- [ ] 1.1 — Add `/reality-check` route to `src/App.tsx`
- [ ] 1.2 — Build `StepQuestionnaire.tsx` (perceived value + 4 qualifier inputs)
- [ ] 1.3 — Wire up gap calculation (reuse EBITDA + multiples logic)
- [ ] 1.4 — Build `GapReveal.tsx` (dramatic result display)
- [ ] 1.5 — Build `DealKillerCards.tsx` (3 deal killer reveals)
- [ ] 1.6 — Build `MVPEmailCapture.tsx` (email → `contact_inquiries` + sign up CTA)
- [ ] 1.7 — Connect the steps in `RealityCheck.tsx` (multi-step state machine)
- [ ] 1.8 — Test full flow end-to-end, verify Supabase insert works

**Done when:** Full funnel works, email saves to Supabase, CTA routes to sign up.

---

## Phase 2: Lite Portal (3 Modules Unlocked)
**Goal:** After sign up, users see the portal with 3 modules accessible and the rest visually locked.

### The 3 Hook Modules
| # | Module | Why |
|---|--------|-----|
| 1 | EBITDA Calculator | Gives their real number — tangible output |
| 2 | Business Scorecard | Gamified score — high engagement |
| 3 | Deal Killers Diagnostic | Fear + specificity — names their exact problems |

### What Changes
The portal needs to know which modules are "MVP-enabled." This logic stays in the `mini-mvp` branch only — no changes to `main`.

### Files to Create/Modify
```
src/components/mvp/LockedModuleBadge.tsx    ← "Full Launch Coming" overlay for locked modules
```

Modify (mini-mvp branch only):
```
src/config/moduleConfig.ts                 ← Add mvpEnabled: boolean to each module entry
src/pages/portal/[module pages]            ← Filter/render locked state based on mvpEnabled
```

### Steps
- [ ] 2.1 — Add `mvpEnabled: boolean` to module config entries (true for 3 modules, false for rest)
- [ ] 2.2 — Build `LockedModuleBadge.tsx` (grayed card + "Full Launch Coming" text)
- [ ] 2.3 — Update portal module grid to show locked state for non-MVP modules
- [ ] 2.4 — Verify the 3 MVP modules load and work correctly
- [ ] 2.5 — Verify locked modules cannot be navigated to directly (redirect or block)

**Done when:** Portal shows 3 open modules + all others locked with the badge.

---

## Phase 3: ElevenLabs AI Voice Guide
**Goal:** Each of the 3 MVP modules has an AI voice guide that narrates the content and answers questions. One voice for everything (narration + Q&A).

### Architecture (MVP Simplified — No Custom Backend)
Use ElevenLabs Conversational AI's direct LLM connection (GPT-4o via ElevenLabs dashboard). No Supabase edge function changes needed for the MVP.

ElevenLabs agent configured with:
- **Voice:** One consistent voice for everything
- **System prompt:** PE Ready expert advisor persona
- **LLM:** GPT-4o (connected directly in ElevenLabs dashboard)
- **Dynamic variables at session start:** User's financial data (revenue, EBITDA, industry, gap amount)
- **Per-module context:** Module content as knowledge base in ElevenLabs

### What the AI does
1. **On module open:** Introduces itself, offers to walk through the module
2. **Narration:** Walks through module content conversationally, step by step
3. **Q&A:** User can ask questions — AI knows their financial data and stays in module context
4. **Memory:** ElevenLabs handles within-session memory natively

### Pre-Implementation Setup (manual, outside codebase)
- [ ] 3.0a — **MANUAL:** Create ElevenLabs account + Conversational AI agent
- [ ] 3.0b — **MANUAL:** Configure agent: GPT-4o LLM, PE Ready system prompt, voice selected
- [ ] 3.0c — **MANUAL:** Add module knowledge base content for each of the 3 modules in ElevenLabs dashboard
- [ ] 3.0d — **MANUAL:** Note the `agent_id` from ElevenLabs (needed in code)

### Code Steps
- [ ] 3.1 — Install `@11labs/react`
- [ ] 3.2 — Add `VITE_ELEVENLABS_AGENT_ID` to `.env` and Vercel environment variables
- [ ] 3.3 — Build `src/components/mvp/AIVoiceWidget.tsx`
- [ ] 3.4 — Embed on EBITDA Calculator module page
- [ ] 3.5 — Embed on Business Scorecard module page
- [ ] 3.6 — Embed on Deal Killers Diagnostic module page
- [ ] 3.7 — Embed on `/reality-check` results page (AI explains their gap)
- [ ] 3.8 — Test: voice starts, AI knows user context, stays in module

**Done when:** Voice AI works on all 3 modules + results page with correct context.

---

## Transition to Full Launch
When the full PE Ready platform is ready:
1. Email all mini-mvp users: "The full platform is live — you're already in"
2. All accounts and saved data already exist in Supabase — zero migration
3. Optionally cherry-pick MVP features (reality check, voice) into `main`

---

## Environment Variables
**Vercel (mini-mvp deployment):** No env vars needed — Supabase keys are hardcoded in source. The only variable to add later is:
```
VITE_ELEVENLABS_AGENT_ID=<from ElevenLabs dashboard — Phase 3>
```

**Supabase secrets (already set, no action needed):**
- `OPENAI_API_KEY` — stored inside Supabase edge function secrets

## Critical Files
| File | Purpose |
|------|---------|
| `src/pages/RealityCheck.tsx` | New — public funnel |
| `src/lib/calculations/ebitda.ts` | Existing — reuse calculation logic |
| `src/lib/calculations/multiples.ts` | Existing — reuse industry multiples |
| `src/config/moduleConfig.ts` | Modify — add `mvpEnabled` flag |
| `src/components/mvp/` | New folder — all MVP-specific components |
| `src/App.tsx` | Modify — add `/reality-check` route |
| `MINI_MVP_ROADMAP.md` | This file — keep updated |
