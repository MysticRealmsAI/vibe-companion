import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/age-gate" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "sign_up") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/age-gate` },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm, then sign in.");
        setMode("sign_in");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/age-gate");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/age-gate",
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      setBusy(false);
    }
    // if redirected, browser navigates away
  };

  return (
    <div className="min-h-[100dvh] gradient-bg flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-full gradient-primary flex items-center justify-center glow-primary">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold font-display text-gradient">Vibe Companion</h1>
          <p className="text-sm text-muted-foreground">
            {mode === "sign_in" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <Button
          onClick={google} disabled={busy}
          className="w-full py-5 rounded-xl bg-card border border-border hover:bg-card/80 text-foreground"
        >
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <Input type="email" placeholder="Email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="py-5 bg-card border-border rounded-xl"
          />
          <Input type="password" placeholder="Password" required minLength={6}
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="py-5 bg-card border-border rounded-xl"
          />
          <Button type="submit" disabled={busy}
            className="w-full py-5 rounded-xl gradient-primary text-primary-foreground glow-primary">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "sign_in" ? "Sign in" : "Sign up"}
          </Button>
        </form>

        <button
          onClick={() => setMode(mode === "sign_in" ? "sign_up" : "sign_in")}
          className="w-full text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "sign_in" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>

        <p className="text-xs text-muted-foreground/60 text-center leading-relaxed">
          18+ only · Fictional AI companion · Not a real person
        </p>
      </motion.div>
    </div>
  );
}
