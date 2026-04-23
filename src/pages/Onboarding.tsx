import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import {
  companions,
  languageOptions,
  vibeOptions,
  genderOptions,
  sexualPreferenceOptions,
  companionPersonalityOptions,
  hairOptions,
  skinToneOptions,
  fashionStyleOptions,
} from "@/lib/companions";
import type {
  CompanionStyle,
  LanguagePreference,
  VibePreference,
  GenderOption,
  SexualPreference,
  CompanionPersonality,
  HairStyle,
  SkinTone,
  FashionStyle,
} from "@/lib/companions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft } from "lucide-react";

const steps = ["name", "gender", "preference", "language", "personality", "appearance", "style", "vibe"] as const;

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUser();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile?.displayName || "");
  const [gender, setGender] = useState<GenderOption>(profile?.gender || "male");
  const [sexPref, setSexPref] = useState<SexualPreference>(profile?.sexualPreference || "straight");
  const [language, setLanguage] = useState<LanguagePreference>(profile?.language || "hinglish");
  const [personality, setPersonality] = useState<CompanionPersonality>(profile?.companionPersonality || "cute_soft");
  const [hair, setHair] = useState<HairStyle>(profile?.appearance?.hair || "long");
  const [skinTone, setSkinTone] = useState<SkinTone>(profile?.appearance?.skinTone || "medium");
  const [fashionStyle, setFashionStyle] = useState<FashionStyle>(profile?.appearance?.style || "modern");
  const [style, setStyle] = useState<CompanionStyle>(profile?.companionStyle || "caring");
  const [vibe, setVibe] = useState<VibePreference>(profile?.vibe || "romantic");

  const canNext = step === 0 ? name.trim().length > 0 : true;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      updateProfile({
        displayName: name.trim(),
        gender,
        sexualPreference: sexPref,
        language,
        companionPersonality: personality,
        appearance: { hair, skinTone, style: fashionStyle },
        companionStyle: style,
        vibe,
        onboarded: true,
      });
      navigate("/chat");
    }
  };

  const OptionButton = ({
    selected,
    onClick,
    label,
    desc,
  }: {
    selected: boolean;
    onClick: () => void;
    label: string;
    desc?: string;
  }) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        selected
          ? "border-primary bg-primary/10 glow-primary"
          : "border-border bg-card hover:border-muted-foreground/30"
      }`}
    >
      <div className="font-semibold text-foreground">{label}</div>
      {desc && <div className="text-sm text-muted-foreground">{desc}</div>}
    </button>
  );

  const SmallOptionButton = ({
    selected,
    onClick,
    label,
  }: {
    selected: boolean;
    onClick: () => void;
    label: string;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
        selected
          ? "border-primary bg-primary/10 text-foreground glow-primary"
          : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-[100dvh] gradient-bg flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full">
        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
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
            {/* Step 0: Name */}
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

            {/* Step 1: Gender */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">How do you identify?</h2>
                  <p className="text-muted-foreground text-sm">This helps personalize your experience.</p>
                </div>
                <div className="space-y-3">
                  {genderOptions.map((opt) => (
                    <OptionButton
                      key={opt.id}
                      selected={gender === opt.id}
                      onClick={() => setGender(opt.id)}
                      label={opt.label}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Step 2: Sexual Preference */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">Your preference?</h2>
                  <p className="text-muted-foreground text-sm">Totally optional. Helps tailor your companion's tone.</p>
                </div>
                <div className="space-y-3">
                  {sexualPreferenceOptions.map((opt) => (
                    <OptionButton
                      key={opt.id}
                      selected={sexPref === opt.id}
                      onClick={() => setSexPref(opt.id)}
                      label={opt.label}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Step 3: Language */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">Pick your language</h2>
                  <p className="text-muted-foreground text-sm">How should your companion talk to you?</p>
                </div>
                <div className="space-y-3">
                  {languageOptions.map((opt) => (
                    <OptionButton
                      key={opt.id}
                      selected={language === opt.id}
                      onClick={() => setLanguage(opt.id)}
                      label={opt.label}
                      desc={opt.desc}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Step 4: Companion Personality */}
            {step === 4 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">What kind of companion?</h2>
                  <p className="text-muted-foreground text-sm">Pick the personality that vibes with you.</p>
                </div>
                <div className="space-y-3">
                  {companionPersonalityOptions.map((opt) => (
                    <OptionButton
                      key={opt.id}
                      selected={personality === opt.id}
                      onClick={() => setPersonality(opt.id)}
                      label={opt.label}
                      desc={opt.desc}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Step 5: Appearance */}
            {step === 5 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">Companion's look</h2>
                  <p className="text-muted-foreground text-sm">Customize how your companion presents themselves.</p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hair</label>
                    <div className="flex flex-wrap gap-2">
                      {hairOptions.map((opt) => (
                        <SmallOptionButton key={opt.id} selected={hair === opt.id} onClick={() => setHair(opt.id)} label={opt.label} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skin Tone</label>
                    <div className="flex flex-wrap gap-2">
                      {skinToneOptions.map((opt) => (
                        <SmallOptionButton key={opt.id} selected={skinTone === opt.id} onClick={() => setSkinTone(opt.id)} label={opt.label} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Style</label>
                    <div className="flex flex-wrap gap-2">
                      {fashionStyleOptions.map((opt) => (
                        <SmallOptionButton key={opt.id} selected={fashionStyle === opt.id} onClick={() => setFashionStyle(opt.id)} label={opt.label} />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 6: Companion Style */}
            {step === 6 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">Choose your companion</h2>
                  <p className="text-muted-foreground text-sm">Each one has a unique personality.</p>
                </div>
                <div className="space-y-3">
                  {companions.map((c) => (
                    <OptionButton
                      key={c.id}
                      selected={style === c.id}
                      onClick={() => setStyle(c.id)}
                      label={`${c.emoji} ${c.name}`}
                      desc={c.tagline}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Step 7: Vibe */}
            {step === 7 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">Set the vibe</h2>
                  <p className="text-muted-foreground text-sm">What kind of conversations do you want?</p>
                </div>
                <div className="space-y-3">
                  {vibeOptions.map((opt) => (
                    <OptionButton
                      key={opt.id}
                      selected={vibe === opt.id}
                      onClick={() => setVibe(opt.id)}
                      label={opt.label}
                      desc={opt.desc}
                    />
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
