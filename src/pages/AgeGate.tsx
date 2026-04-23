import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser, defaultProfile } from "@/contexts/UserContext";
import { ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgeGate() {
  const navigate = useNavigate();
  const { profile, setProfile, updateProfile } = useUser();

  const handleAccept = () => {
    if (profile) {
      updateProfile({ ageVerified: true });
    } else {
      setProfile({ ...defaultProfile, ageVerified: true, createdAt: Date.now(), updatedAt: Date.now() });
    }
    navigate("/onboarding");
  };

  const handleDecline = () => {
    // Show a message or redirect away
    window.location.href = "https://www.google.com";
  };

  return (
    <div className="min-h-[100dvh] gradient-bg flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-sm w-full space-y-8"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-card flex items-center justify-center border border-border">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold font-display">Age Verification</h1>
          <p className="text-muted-foreground">
            Vibe Companion is designed for adults only. Please confirm that you are 18 years or older to continue.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleAccept}
            className="w-full py-5 text-base font-semibold gradient-primary text-primary-foreground rounded-xl glow-primary hover:opacity-90 transition-opacity"
          >
            <ShieldCheck className="w-5 h-5 mr-2" />
            I am 18 or older
          </Button>

          <Button
            onClick={handleDecline}
            variant="outline"
            className="w-full py-5 text-base rounded-xl border-border text-muted-foreground hover:bg-card"
          >
            <XCircle className="w-5 h-5 mr-2" />
            I am under 18
          </Button>
        </div>

        <p className="text-xs text-muted-foreground/50">
          By continuing, you confirm you are 18+ and agree to interact with a fictional AI companion.
        </p>
      </motion.div>
    </div>
  );
}
