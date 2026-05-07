// Generates/updates a rolling memory summary for a chat
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { chat_id, user_id } = await req.json();
    if (!chat_id || !user_id) {
      return new Response(JSON.stringify({ error: "missing fields" }), { status: 400, headers: corsHeaders });
    }

    const { data: msgs } = await supabase
      .from("messages")
      .select("role, content")
      .eq("chat_id", chat_id)
      .order("created_at", { ascending: true })
      .limit(60);

    const { data: existing } = await supabase
      .from("memory_summaries").select("summary").eq("chat_id", chat_id).maybeSingle();

    const transcript = (msgs || [])
      .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const prompt = `${existing?.summary ? `Previous summary:\n${existing.summary}\n\n` : ""}Conversation so far:\n${transcript}\n\nWrite an updated, concise memory summary (under 250 words) capturing: user's name, personality, preferences, important facts mentioned, ongoing storylines, emotional tone, and inside references. Be specific. No preamble — just the summary.`;

    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nousresearch/hermes-3-llama-3.1-70b",
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const j = await r.json();
    const summary = j.choices?.[0]?.message?.content?.trim() || "";
    if (!summary) throw new Error("no summary returned");

    await supabase.from("memory_summaries").upsert({
      chat_id, user_id, summary, message_count: msgs?.length || 0, updated_at: new Date().toISOString(),
    }, { onConflict: "chat_id" });

    return new Response(JSON.stringify({ ok: true, summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("summarize error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
