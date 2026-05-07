import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const lengthOptions = ["short", "medium", "long"] as const;
const styleOptions = ["natural", "literary", "poetic", "blunt", "formal"] as const;
const modelOptions = [
  "nousresearch/hermes-3-llama-3.1-70b",
  "nousresearch/hermes-3-llama-3.1-405b",
  "anthropic/claude-3.5-sonnet",
  "openai/gpt-4o-mini",
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [responseLength, setResponseLength] = useState<string>("medium");
  const [creativity, setCreativity] = useState(0.8);
  const [writingStyle, setWritingStyle] = useState("natural");
  const [model, setModel] = useState(modelOptions[0]);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth", { replace: true }); return; }
    supabase.from("app_settings").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setResponseLength(data.response_length || "medium");
          setCreativity(Number(data.creativity ?? 0.8));
          setWritingStyle(data.writing_style || "natural");
          setModel(data.model_name || modelOptions[0]);
        }
      });
  }, [user, loading, navigate]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("app_settings").upsert({
      user_id: user.id, response_length: responseLength, creativity,
      writing_style: writingStyle, model_name: model,
    }, { onConflict: "user_id" });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
  };

  const clearMemory = async () => {
    if (!user) return;
    if (!confirm("Clear all chat memory? This deletes all messages and summaries.")) return;
    const { data: chats } = await supabase.from("chats").select("id").eq("user_id", user.id);
    const ids = (chats || []).map((c) => c.id);
    if (ids.length) {
      await supabase.from("messages").delete().in("chat_id", ids);
      await supabase.from("memory_summaries").delete().in("chat_id", ids);
    }
    toast.success("Memory cleared");
  };

  const Pill = ({ active, onClick, children }: any) => (
    <button onClick={onClick}
      className={`px-3 py-2 rounded-xl border text-sm transition-all ${
        active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground"
      }`}
    >{children}</button>
  );

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="sticky top-0 z-10 flex items-center gap-2 px-3 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold">Settings</h1>
      </div>

      <div className="max-w-md mx-auto p-5 space-y-6">
        <section className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Response length</label>
          <div className="flex gap-2">
            {lengthOptions.map((l) => <Pill key={l} active={responseLength === l} onClick={() => setResponseLength(l)}>{l}</Pill>)}
          </div>
        </section>

        <section className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Creativity ({creativity.toFixed(1)})</label>
          <input type="range" min={0.1} max={1.5} step={0.1} value={creativity}
            onChange={(e) => setCreativity(Number(e.target.value))} className="w-full accent-primary" />
        </section>

        <section className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Writing style</label>
          <div className="flex flex-wrap gap-2">
            {styleOptions.map((s) => <Pill key={s} active={writingStyle === s} onClick={() => setWritingStyle(s)}>{s}</Pill>)}
          </div>
        </section>

        <section className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-3 py-3 text-sm">
            {modelOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </section>

        <Button onClick={save} disabled={busy}
          className="w-full py-5 rounded-xl gradient-primary text-primary-foreground glow-primary">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save settings"}
        </Button>

        <div className="pt-4 border-t border-border space-y-2">
          <Button onClick={clearMemory} variant="outline"
            className="w-full py-5 rounded-xl border-border text-muted-foreground">
            <Trash2 className="w-4 h-4 mr-2" /> Clear all chat memory
          </Button>
          <Button onClick={async () => { await signOut(); navigate("/auth", { replace: true }); }}
            variant="outline" className="w-full py-5 rounded-xl border-border text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
