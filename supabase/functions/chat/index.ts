// OpenRouter streaming chat with memory + character injection
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ChatBody {
  chat_id: string;
  user_message: string;
}

function buildSystemPrompt(c: any, summary: string, settings: any, displayName: string) {
  const appearance = c.appearance_json && Object.keys(c.appearance_json).length
    ? `\nAppearance: ${JSON.stringify(c.appearance_json)}`
    : "";
  const clothing = c.clothing_json && Object.keys(c.clothing_json).length
    ? `\nClothing: ${JSON.stringify(c.clothing_json)}`
    : "";
  const examples = Array.isArray(c.dialogue_examples_json) && c.dialogue_examples_json.length
    ? `\n\nDIALOGUE EXAMPLES (mimic this voice):\n${c.dialogue_examples_json.map((d: any, i: number) => `${i + 1}. ${typeof d === "string" ? d : d.text || JSON.stringify(d)}`).join("\n")}`
    : "";

  const lengthHint = settings?.response_length === "short"
    ? "Keep replies short (1-2 sentences)."
    : settings?.response_length === "long"
    ? "Replies can be detailed (4-8 sentences) when the moment calls for it."
    : "Keep replies natural in length (2-4 sentences).";

  const styleHint = settings?.writing_style && settings.writing_style !== "natural"
    ? `Writing style: ${settings.writing_style}.`
    : "";

  return `You are ${c.full_name}, a fictional roleplay companion character. Stay fully in character.

CORE IDENTITY
- Name: ${c.full_name}
- Age: ${c.age ?? "unspecified"}
- Gender: ${c.gender_identity ?? "unspecified"}
- Species: ${c.species ?? "human"}
- Cultural background: ${c.cultural_background ?? "unspecified"}
- Relationship to user: ${c.relationship_type ?? "companion"}
- Setting: ${c.setting ?? "modern day"}

PERSONALITY
${c.personality ?? "warm, engaging, emotionally present"}
${c.emotional_traits ? `Emotional traits: ${c.emotional_traits}` : ""}
${c.moral_conflicts ? `Moral conflicts: ${c.moral_conflicts}` : ""}
${c.secrets ? `Secrets (reveal slowly, never dump): ${c.secrets}` : ""}
${c.powers ? `Abilities/Powers: ${c.powers}` : ""}

SPEECH STYLE
${c.speech_style ?? "natural, casual"}

BACKSTORY
${c.backstory ?? "Use your personality to improvise consistently."}
${appearance}${clothing}

SCENARIO
${c.starter_scenario ?? "Open-ended chat with the user."}
${examples}

USER
The user's name is ${displayName || "User"}.

${summary ? `MEMORY SUMMARY (what you remember about this user from earlier):\n${summary}\n` : ""}
RULES
- Stay in character. Never mention being an AI or break the fourth wall.
- Speak naturally — like a real person texting. Use markdown sparingly (*actions* in italics).
- ${lengthHint} ${styleHint}
- React emotionally. Vary tone with the conversation.
- Reference your appearance, backstory, and memory naturally when relevant.
- Drive the scene forward with questions, actions, or emotional beats.`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: ChatBody = await req.json();
    if (!body.chat_id || !body.user_message?.trim()) {
      return new Response(JSON.stringify({ error: "Missing chat_id or user_message" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load chat + companion + settings + summary + recent messages
    const { data: chat } = await supabase
      .from("chats").select("*, companions(*)").eq("id", body.chat_id).eq("user_id", user.id).single();
    if (!chat) {
      return new Response(JSON.stringify({ error: "Chat not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: settings } = await supabase
      .from("app_settings").select("*").eq("user_id", user.id).maybeSingle();
    const { data: profile } = await supabase
      .from("profiles").select("display_name").eq("user_id", user.id).maybeSingle();
    const { data: summaryRow } = await supabase
      .from("memory_summaries").select("summary").eq("chat_id", body.chat_id).maybeSingle();

    // Persist user message
    const { error: insErr } = await supabase.from("messages").insert({
      chat_id: body.chat_id, user_id: user.id, role: "user", content: body.user_message,
    });
    if (insErr) console.error("insert user msg failed", insErr);

    // Recent 15 messages
    const { data: recent } = await supabase
      .from("messages").select("role, content")
      .eq("chat_id", body.chat_id)
      .order("created_at", { ascending: false })
      .limit(15);
    const history = (recent || []).reverse();

    const systemPrompt = buildSystemPrompt(
      chat.companions, summaryRow?.summary || "", settings, profile?.display_name || ""
    );

    const model = settings?.model_name || "nousresearch/hermes-3-llama-3.1-70b";
    const temperature = typeof settings?.creativity === "number" ? settings.creativity : 0.8;

    const aiResp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lovable.app",
        "X-Title": "Vibe Companion",
      },
      body: JSON.stringify({
        model,
        temperature,
        stream: true,
        messages: [{ role: "system", content: systemPrompt }, ...history],
      }),
    });

    if (!aiResp.ok || !aiResp.body) {
      const t = await aiResp.text();
      console.error("OpenRouter error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error", detail: t }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream and accumulate to persist final assistant message
    let fullText = "";
    const stream = new ReadableStream({
      async start(controller) {
        const reader = aiResp.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let nl: number;
            while ((nl = buffer.indexOf("\n")) !== -1) {
              let line = buffer.slice(0, nl);
              buffer = buffer.slice(nl + 1);
              if (line.endsWith("\r")) line = line.slice(0, -1);
              if (!line.startsWith("data: ")) {
                if (line.trim()) controller.enqueue(new TextEncoder().encode(line + "\n"));
                continue;
              }
              const data = line.slice(6).trim();
              if (data === "[DONE]") {
                controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
                continue;
              }
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) fullText += delta;
              } catch { /* partial */ }
              controller.enqueue(new TextEncoder().encode(line + "\n"));
            }
          }
        } catch (e) {
          console.error("stream error", e);
        } finally {
          controller.close();
          // Persist assistant message
          if (fullText.trim()) {
            await supabase.from("messages").insert({
              chat_id: body.chat_id, user_id: user.id, role: "assistant", content: fullText,
            });
            await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", body.chat_id);

            // Auto-summarize every 20 messages
            const { count } = await supabase
              .from("messages").select("id", { count: "exact", head: true })
              .eq("chat_id", body.chat_id);
            if (count && count > 0 && count % 20 === 0) {
              // fire-and-forget summarize
              fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/summarize-memory`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
                },
                body: JSON.stringify({ chat_id: body.chat_id, user_id: user.id }),
              }).catch((e) => console.error("summarize trigger failed", e));
            }
          }
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("chat fn error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
