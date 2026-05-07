import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function AgeGate() {
  const navigate = useNavigate();
  const { user, profile, loading, refreshProfile } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  if (profile?.age_verified) return <Navigate to="/onboarding" replace />;

  const accept = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ age_verified: true }).eq("user_id", user.id);
    await refreshProfile();
    navigate("/onboarding");
  };

  return (
    <div className="min-h-[100dvh] gradient-bg flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-sm space-y-8">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto glow-primary">
          <ShieldCheck className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold font-display text-foreground">Age Verification</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This app contains mature content for users 18+. By continuing, you confirm you are of legal age.
          </p>
        </div>
        <div className="space-y-3">
          <Button onClick={accept}
            className="w-full py-5 text-base font-semibold gradient-primary text-primary-foreground rounded-xl glow-primary hover:opacity-90">
            I am 18+ — Continue
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}
            className="w-full py-5 text-base rounded-xl border-border">
            I am under 18 — Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
