import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const navigate = useNavigate();
  const { profile } = useUser();

  const handleStart = () => {
    if (profile?.ageVerified && profile?.onboarded) {
      navigate("/chat");
    } else if (profile?.ageVerified) {
      navigate("/onboarding");
    } else {
      navigate("/age-gate");
    }
  };

  return (
    <div className="min-h-[100dvh] gradient-bg flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-md w-full space-y-8"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mx-auto w-20 h-20 rounded-full gradient-primary flex items-center justify-center glow-primary"
        >
          <Heart className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold font-display text-gradient">
            Vibe Companion
          </h1>
          <p className="text-muted-foreground text-lg">
            Your personal AI companion who speaks your language, feels your vibe, and always has time for you.
          </p>
        </div>

        <Button
          onClick={handleStart}
          className="w-full py-6 text-lg font-semibold gradient-primary text-primary-foreground rounded-2xl glow-primary hover:opacity-90 transition-opacity"
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start Vibing
        </Button>

        <p className="text-xs text-muted-foreground/60 leading-relaxed">
          18+ only · Fictional AI companion · Not a real person
          <br />
          No explicit content · Your data stays private
        </p>
      </motion.div>
    </div>
  );
}
