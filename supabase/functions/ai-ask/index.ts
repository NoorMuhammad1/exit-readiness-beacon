
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const MODEL = "gpt-4o-mini";

// Use project constants directly (anon key is publishable)
const SUPABASE_URL = "https://nclzcublbysfvicmqzjr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jbHpjdWJsYnlzZnZpY21xempyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTA1MTIsImV4cCI6MjA2OTcyNjUxMn0.ltb_GOdC5koO6VNTtxtIC_UroKzFRl4KUzOg0vKPUws";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      return json({ error: "Missing OPENAI_API_KEY" }, 500);
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      return json({ error: "Unauthorized" }, 401);
    }

    const body = await req.json().catch(() => ({}));
    const question: string | undefined = body.question;
    const modulePath: string | undefined = body.module;

    if (!question || typeof question !== "string") {
      return json({ error: "Missing question" }, 400);
    }

    const orgId = user.id;

    // Read ai_settings; if none, allow with sane defaults (MVP)
    const { data: settings } = await supabase
      .from("ai_settings")
      .select("*")
      .eq("org_id", orgId)
      .maybeSingle();

    const enabled = settings?.enabled ?? true;
    const dailyUserLimit = settings?.daily_user_limit ?? 10;
    const monthlyOrgCap = settings?.monthly_org_cap ?? 1000;

    if (!enabled) {
      return json({ error: "AI assistant is disabled for this account." }, 403);
    }

    // Rate limiting windows
    const now = new Date();
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const { count: dayCount } = await supabase
      .from("ai_queries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfDay.toISOString());

    if ((dayCount ?? 0) >= dailyUserLimit) {
      return json({ error: "Daily AI limit reached." }, 429);
    }

    const { count: monthCount } = await supabase
      .from("ai_queries")
      .select("id", { count: "exact", head: true })
      .eq("org_id", orgId)
      .gte("created_at", startOfMonth.toISOString());

    if ((monthCount ?? 0) >= monthlyOrgCap) {
      return json({ error: "Monthly AI limit reached for your org." }, 429);
    }

    // Fetch up to 3 curated snippets
    const { data: moduleSnips } = await supabase
      .from("kb_snippets")
      .select("*")
      .eq("is_active", true)
      .eq("module", modulePath ?? "")
      .limit(3);

    let snippets = moduleSnips ?? [];
    if (snippets.length === 0) {
      const { data: fallback } = await supabase
        .from("kb_snippets")
        .select("*")
        .eq("is_active", true)
        .ilike("question", `%${question.slice(0, 40)}%`)
        .limit(3);
      snippets = fallback ?? [];
    }

    const sysPrompt = [
      "You are a concise helper for a 4-week PE Ready Deal Room.",
      "Rules:",
      "- Keep answers to 3–6 sentences.",
      "- Never give legal/tax/financial advice; redirect to modules and advisors.",
      "- If the user asks for specifics about their business, answer at a high level and link the right module.",
      "- End with: 'This is general information only. Please refer to the program modules and consult your professional advisors.'",
    ].join("\n");

    const snippetText = snippets
      .map((s) => `Q: ${s.question}\nA: ${s.answer}\nLink: ${s.link ?? s.module}`)
      .join("\n---\n");

    const messages = [
      { role: "system", content: sysPrompt },
      {
        role: "user",
        content: [
          snippetText ? `Context:\n${snippetText}\n` : "",
          `Module: ${modulePath ?? "unknown"}`,
          `Question: ${question}`,
        ].join("\n"),
      },
    ];

    const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.2,
        max_tokens: 300,
      }),
    });

    if (!oaRes.ok) {
      const txt = await oaRes.text();
      console.error("OpenAI error", oaRes.status, txt);
      return json({ error: "AI provider error." }, 502);
    }

    const oaJson = await oaRes.json();
    let answer: string =
      oaJson?.choices?.[0]?.message?.content?.trim() ??
      "Sorry, I couldn't generate an answer.";

    const disclaimer =
      "This is general information only. Please refer to the program modules and consult your professional advisors.";
    if (!answer.endsWith(disclaimer)) {
      answer = `${answer}\n\n${disclaimer}`;
    }

    const bestLink = snippets[0]?.link ?? snippets[0]?.module ?? null;
    const usedIds = snippets.map((s) => s.id);

    // Log query (RLS enforces user_id/org_id)
    await supabase.from("ai_queries").insert({
      org_id: orgId,
      user_id: user.id,
      module: modulePath,
      question,
      used_snippet_ids: usedIds,
      answer,
    });

    return json({ answer, link: bestLink, used_snippet_ids: usedIds }, 200);
  } catch (e) {
    console.error("ai-ask unexpected error:", e);
    return json({ error: "Unexpected error." }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}
