import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Landing() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [hasCompanion, setHasCompanion] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("companions").select("id").eq("user_id", user.id).limit(1)
      .then(({ data }) => setHasCompanion((data?.length ?? 0) > 0));
  }, [user]);

  const handleStart = () => {
    if (!user) return navigate("/auth");
    if (!profile?.age_verified) return navigate("/age-gate");
    if (!hasCompanion) return navigate("/onboarding");
    return navigate("/chat");
  };

  return (
    <div className="min-h-[100dvh] gradient-bg flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }} className="max-w-md w-full space-y-8"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mx-auto w-20 h-20 rounded-full gradient-primary flex items-center justify-center glow-primary"
        >
          <Heart className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold font-display text-gradient">Vibe Companion</h1>
          <p className="text-muted-foreground text-lg">
            Create your own AI companion. Talk, vibe, and build a story that's truly yours.
          </p>
        </div>

        <Button onClick={handleStart} disabled={loading}
          className="w-full py-6 text-lg font-semibold gradient-primary text-primary-foreground rounded-2xl glow-primary hover:opacity-90"
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {user ? "Continue" : "Start Vibing"}
        </Button>

        <p className="text-xs text-muted-foreground/60 leading-relaxed">
          18+ only · Fictional AI companion · Not a real person
        </p>
      </motion.div>
    </div>
  );
}
