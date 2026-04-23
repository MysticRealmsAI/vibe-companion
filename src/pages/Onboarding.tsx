import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import {
  suggestedNames,
  genderOptions,
  personalityOptions,
  skinToneOptions,
  hairStyleOptions,
  bodyTypeOptions,
  heightOptions,
  fashionStyleOptions,
  imageStyleOptions,
  languageOptions,
  vibeOptions,
} from "@/lib/companions";
import type {
  GenderOption,
  PersonalityTrait,
  SkinTone,
  HairStyle,
  BodyType,
  Height,
  FashionStyle,
  ImageStyle,
  LanguagePreference,
  VibePreference,
  CompanionProfile,
} from "@/lib/companions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

const steps = ["userName", "companionName", "age", "gender", "personality", "appearance", "imageStyle", "extras", "language", "vibe"] as const;

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateProfile } = useUser();
  const [step, setStep] = useState(0);

  // User's own name
  const [userName, setUserName] = useState("");

  // Companion fields
  const [companionName, setCompanionName] = useState("");
  const [age, setAge] = useState(22);
  const [gender, setGender] = useState<GenderOption>("female");
  const [personalities, setPersonalities] = useState<PersonalityTrait[]>(["caring_loving"]);
  const [skinTone, setSkinTone] = useState<SkinTone>("wheatish");
  const [hairStyle, setHairStyle] = useState<HairStyle>("long_black_wavy");
  const [bodyType, setBodyType] = useState<BodyType>("slim");
  const [height, setHeight] = useState<Height>("average");
  const [fashionStyle, setFashionStyle] = useState<FashionStyle>("modern");
  const [extraFeatures, setExtraFeatures] = useState("");
  const [imageStyle, setImageStyle] = useState<ImageStyle>("realistic");
  const [backstory, setBackstory] = useState("");
  const [language, setLanguage] = useState<LanguagePreference>("hinglish");
  const [vibe, setVibe] = useState<VibePreference>("romantic");

  const canNext = () => {
    if (step === 0) return userName.trim().length > 0;
    if (step === 1) return companionName.trim().length > 0;
    if (step === 4) return personalities.length > 0;
    return true;
  };

  const togglePersonality = (id: PersonalityTrait) => {
    setPersonalities((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    const companion: CompanionProfile = {
      name: companionName.trim(),
      age,
      gender,
      personalities,
      appearance: { skinTone, hairStyle, bodyType, height, fashionStyle, extraFeatures: extraFeatures.trim() || undefined },
      imageStyle,
      backstory: backstory.trim(),
    };

    updateProfile({
      displayName: userName.trim(),
      language,
      vibe,
      companion,
      moodNotes: "",
      favoriteTopics: [],
      lastChatSummary: "",
      ageVerified: true,
      onboarded: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    navigate("/chat");
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
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

  const nameSuggestions = suggestedNames[gender] || suggestedNames.female;

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
            {/* Step 0: User's name */}
            {step === 0 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">What's your name?</h2>
                  <p className="text-muted-foreground text-sm">Your companion will use this to talk to you.</p>
                </div>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name..."
                  className="py-5 text-base bg-card border-border rounded-xl focus:ring-primary"
                  maxLength={30}
                  autoFocus
                />
              </>
            )}

            {/* Step 1: Companion name */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Name your companion
                  </h2>
                  <p className="text-muted-foreground text-sm">Give your AI companion an Indian name.</p>
                </div>
                <Input
                  value={companionName}
                  onChange={(e) => setCompanionName(e.target.value)}
                  placeholder="e.g. Priya, Aarav, Riya..."
                  className="py-5 text-base bg-card border-border rounded-xl focus:ring-primary"
                  maxLength={30}
                  autoFocus
                />
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggestions</label>
                  <div className="flex flex-wrap gap-2">
                    {nameSuggestions.map((n) => (
                      <button
                        key={n}
                        onClick={() => setCompanionName(n)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          companionName === n
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Age */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">How old is {companionName}?</h2>
                  <p className="text-muted-foreground text-sm">Choose an age between 18 and 30.</p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={18}
                    max={30}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-2xl font-bold text-foreground w-10 text-center">{age}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>18</span>
                  <span>30</span>
                </div>
              </>
            )}

            {/* Step 3: Gender */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">{companionName}'s gender</h2>
                  <p className="text-muted-foreground text-sm">How does your companion identify?</p>
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

            {/* Step 4: Personality (multi-select) */}
            {step === 4 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">{companionName}'s personality</h2>
                  <p className="text-muted-foreground text-sm">Pick one or more traits. This shapes how they talk and behave.</p>
                </div>
                <div className="space-y-3 max-h-[45vh] overflow-y-auto">
                  {personalityOptions.map((opt) => (
                    <OptionButton
                      key={opt.id}
                      selected={personalities.includes(opt.id)}
                      onClick={() => togglePersonality(opt.id)}
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
                  <h2 className="text-2xl font-bold font-display">{companionName}'s look</h2>
                  <p className="text-muted-foreground text-sm">Customize your companion's appearance.</p>
                </div>
                <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-1">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skin Tone</label>
                    <div className="flex flex-wrap gap-2">
                      {skinToneOptions.map((opt) => (
                        <SmallOptionButton key={opt.id} selected={skinTone === opt.id} onClick={() => setSkinTone(opt.id)} label={opt.label} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hair</label>
                    <div className="flex flex-wrap gap-2">
                      {hairStyleOptions.map((opt) => (
                        <SmallOptionButton key={opt.id} selected={hairStyle === opt.id} onClick={() => setHairStyle(opt.id)} label={opt.label} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Body Type</label>
                    <div className="flex flex-wrap gap-2">
                      {bodyTypeOptions.map((opt) => (
                        <SmallOptionButton key={opt.id} selected={bodyType === opt.id} onClick={() => setBodyType(opt.id)} label={opt.label} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Height</label>
                    <div className="flex flex-wrap gap-2">
                      {heightOptions.map((opt) => (
                        <SmallOptionButton key={opt.id} selected={height === opt.id} onClick={() => setHeight(opt.id)} label={opt.label} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fashion Style</label>
                    <div className="flex flex-wrap gap-2">
                      {fashionStyleOptions.map((opt) => (
                        <SmallOptionButton key={opt.id} selected={fashionStyle === opt.id} onClick={() => setFashionStyle(opt.id)} label={opt.label} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Extra Details (optional)</label>
                    <Input
                      value={extraFeatures}
                      onChange={(e) => setExtraFeatures(e.target.value)}
                      placeholder="e.g. dimples, glasses, nose ring..."
                      className="bg-card border-border rounded-xl"
                      maxLength={100}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 6: Image Style */}
            {step === 6 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">How should {companionName} look?</h2>
                  <p className="text-muted-foreground text-sm">Choose the image generation style for your companion.</p>
                </div>
                <div className="space-y-3">
                  {imageStyleOptions.map((opt) => (
                    <OptionButton
                      key={opt.id}
                      selected={imageStyle === opt.id}
                      onClick={() => setImageStyle(opt.id)}
                      label={opt.label}
                      desc={opt.desc}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Step 7: Extras */}
            {step === 7 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">Anything else about {companionName}?</h2>
                  <p className="text-muted-foreground text-sm">Add hobbies, backstory, relationship style, or anything you'd like.</p>
                </div>
                <textarea
                  value={backstory}
                  onChange={(e) => setBackstory(e.target.value)}
                  placeholder={`e.g. "${companionName} loves Bollywood music, is a college student in Mumbai, and treats you like her best friend turned lover..."`}
                  rows={4}
                  className="w-full resize-none bg-card rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">{backstory.length}/500</p>
              </>
            )}

            {/* Step 8: Language */}
            {step === 8 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">Chat language</h2>
                  <p className="text-muted-foreground text-sm">How should {companionName} talk to you?</p>
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

            {/* Step 9: Vibe */}
            {step === 9 && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display">Set the vibe</h2>
                  <p className="text-muted-foreground text-sm">What kind of conversations do you want with {companionName}?</p>
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
            disabled={!canNext()}
            className="flex-1 py-5 text-base font-semibold gradient-primary text-primary-foreground rounded-xl glow-primary hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {step === steps.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Create {companionName || "Companion"}
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
