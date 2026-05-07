import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Settings, ArrowLeft, Heart, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ChatBubble, { type BubbleMessage } from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";
import { toast } from "sonner";

interface Companion {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export default function Chat() {
  const navigate = useNavigate();
  const params = useParams();
  const { user, loading } = useAuth();
  const [chatId, setChatId] = useState<string | null>(params.chatId || null);
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [messages, setMessages] = useState<BubbleMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auth guard + resolve chat
  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth", { replace: true }); return; }

    (async () => {
      let cid = params.chatId;
      if (!cid) {
        // pick most recent chat
        const { data: chats } = await supabase
          .from("chats").select("id, companion_id")
          .eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1);
        if (!chats || chats.length === 0) {
          navigate("/onboarding", { replace: true });
          return;
        }
        cid = chats[0].id;
        navigate(`/chat/${cid}`, { replace: true });
      }
      setChatId(cid!);

      const { data: chat } = await supabase
        .from("chats").select("companion_id, companions(id, full_name, avatar_url)")
        .eq("id", cid!).single();
      if (chat?.companions) setCompanion(chat.companions as any);

      const { data: msgs } = await supabase
        .from("messages").select("id, role, content, image_url")
        .eq("chat_id", cid!).order("created_at", { ascending: true });
      setMessages((msgs || []) as BubbleMessage[]);
      setBootstrapping(false);
    })();
  }, [user, loading, params.chatId, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const send = async () => {
    if (!input.trim() || streaming || !chatId || !user) return;
    const text = input.trim();
    setInput("");

    const userMsg: BubbleMessage = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantMsg: BubbleMessage = { id: crypto.randomUUID(), role: "assistant", content: "" };
    setMessages((m) => [...m, userMsg, assistantMsg]);
    setStreaming(true);

    const { data: sess } = await supabase.auth.getSession();
    const token = sess.session?.access_token;
    if (!token) { toast.error("Session expired"); setStreaming(false); return; }

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
    abortRef.current = new AbortController();
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ chat_id: chatId, user_message: text }),
        signal: abortRef.current.signal,
      });
      if (!resp.ok || !resp.body) {
        const txt = await resp.text();
        throw new Error(txt || "AI request failed");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") { done = true; break; }
          try {
            const j = JSON.parse(data);
            const delta = j.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { ...copy[copy.length - 1], content: acc };
                return copy;
              });
            }
          } catch { /* partial */ }
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        toast.error(e.message || "Stream failed");
        setMessages((m) => m.slice(0, -1));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  if (loading || bootstrapping) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shrink-0">
            {companion?.avatar_url
              ? <img src={companion.avatar_url} className="w-full h-full rounded-full object-cover" alt="" />
              : <Heart className="w-4 h-4 text-primary-foreground" />}
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-sm truncate">{companion?.full_name || "Companion"}</h1>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Online
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center glow-primary">
              <Heart className="w-7 h-7 text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Say hi to {companion?.full_name} 💕</p>
          </motion.div>
        )}
        {messages.map((m) => <ChatBubble key={m.id} message={m} />)}
        {streaming && messages[messages.length - 1]?.content === "" && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-border bg-card/80 backdrop-blur-sm pb-[max(env(safe-area-inset-bottom),12px)]">
        <div className="flex items-end gap-2 max-w-lg mx-auto">
          <textarea
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={`Message ${companion?.full_name || "..."}...`}
            rows={1}
            className="flex-1 resize-none bg-secondary rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary max-h-32"
            style={{ minHeight: "44px" }}
          />
          <Button onClick={send} disabled={!input.trim() || streaming} size="icon"
            className="w-11 h-11 rounded-full gradient-primary text-primary-foreground shrink-0 disabled:opacity-40">
            {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
