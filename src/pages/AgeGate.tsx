import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function AgeGate() {
  const navigate = useNavigate();
  const { profile, updateProfile, setProfile } = useUser();

  const handleAccept = () => {
    if (profile) {
      updateProfile({ ageVerified: true });
    } else {
      setProfile({
        displayName: "",
        language: "hinglish",
        vibe: "romantic",
        companion: {
          name: "",
          age: 22,
          gender: "female",
          personalities: ["caring_loving"],
          appearance: {
            skinTone: "wheatish",
            hairStyle: "long_black_wavy",
            bodyType: "slim",
            height: "average",
            fashionStyle: "modern",
          },
          imageStyle: "realistic",
          backstory: "",
        },
        moodNotes: "",
        favoriteTopics: [],
        lastChatSummary: "",
        ageVerified: true,
        onboarded: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
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
            This app contains mature content and is intended for users who are 18 years or older.
            By continuing, you confirm that you are of legal age.
          </p>
        </div>
        <div className="space-y-3">
          <Button
            onClick={handleAccept}
            className="w-full py-5 text-base font-semibold gradient-primary text-primary-foreground rounded-xl glow-primary hover:opacity-90 transition-opacity"
          >
            I am 18+ — Continue
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full py-5 text-base rounded-xl border-border"
          >
            I am under 18 — Go Back
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          This is a fictional AI companion. All characters are AI-generated.
        </p>
      </div>
    </div>
  );
}
