import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { companions, languageOptions, vibeOptions } from "@/lib/companions";
import type { CompanionStyle, LanguagePreference, VibePreference } from "@/lib/companions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft } from "lucide-react";

const steps = ["name", "language", "style", "vibe"] as const;

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUser();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile?.displayName || "");
  const [language, setLanguage] = useState<LanguagePreference>(profile?.language || "hinglish");
  const [style, setStyle] = useState<CompanionStyle>(profile?.companionStyle || "caring");
  const [vibe, setVibe] = useState<VibePreference>(profile?.vibe || "romantic");

  const canNext =
    step === 0 ? name.trim().length > 0 :
    true;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      updateProfile({
        displayName: name.trim(),
        language,
        companionStyle: style,
        vibe,
        onboarded: true,
      });
      navigate("/chat");
    }
  };

  return (
    <div className="min-h-[100dvh] gradient-bg flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "gradient-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {step === 0 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">What should I call you?</h2>
                  <p className="text-muted-foreground text-sm">Your companion will use this name to talk to you.</p>
                </div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="py-5 text-base bg-card border-border rounded-xl focus:ring-primary"
                  maxLength={30}
                  autoFocus
                />
              </>
            )}

            {step === 1 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">Pick your language</h2>
                  <p className="text-muted-foreground text-sm">How should your companion talk to you?</p>
                </div>
                <div className="space-y-3">
                  {languageOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setLanguage(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        language === opt.id
                          ? "border-primary bg-primary/10 glow-primary"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="font-semibold text-foreground">{opt.label}</div>
                      <div className="text-sm text-muted-foreground">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">Choose your companion</h2>
                  <p className="text-muted-foreground text-sm">Each one has a unique personality.</p>
                </div>
                <div className="space-y-3">
                  {companions.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setStyle(c.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        style === c.id
                          ? "border-primary bg-primary/10 glow-primary"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="font-semibold text-foreground">
                        {c.emoji} {c.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{c.tagline}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">Set the vibe</h2>
                  <p className="text-muted-foreground text-sm">What kind of conversations do you want?</p>
                </div>
                <div className="space-y-3">
                  {vibeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setVibe(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        vibe === opt.id
                          ? "border-primary bg-primary/10 glow-primary"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="font-semibold text-foreground">{opt.label}</div>
                      <div className="text-sm text-muted-foreground">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="py-5 rounded-xl border-border"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canNext}
            className="flex-1 py-5 text-base font-semibold gradient-primary text-primary-foreground rounded-xl glow-primary hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {step === steps.length - 1 ? "Start Chatting" : "Continue"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
