import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const personalityOptions = [
  { id: "caring_loving", label: "Caring & Loving 💗" },
  { id: "playful_teasing", label: "Playful & Teasing 😜" },
  { id: "bold_flirty", label: "Bold & Flirty 😏" },
  { id: "shy_cute", label: "Shy & Cute 🥺" },
  { id: "seductive", label: "Seductive ✨" },
  { id: "dominant", label: "Dominant 🔥" },
  { id: "emotional_deep", label: "Emotional & Deep 🌙" },
];

const genderOptions = ["female", "male", "non-binary"];
const speciesOptions = ["human", "elf", "vampire", "demon", "android", "fae", "other"];
const relationshipOptions = ["stranger", "friend", "best friend", "lover", "rival", "mentor", "roommate"];

const steps = [
  "your_name", "companion_name", "basics", "personality", "appearance",
  "backstory", "scenario", "first_message",
] as const;

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);

  const [yourName, setYourName] = useState(profile?.display_name || "");
  const [name, setName] = useState("");
  const [age, setAge] = useState(24);
  const [gender, setGender] = useState("female");
  const [species, setSpecies] = useState("human");
  const [relationship, setRelationship] = useState("friend");
  const [setting, setSetting] = useState("modern day, India");
  const [personalityTags, setPersonalityTags] = useState<string[]>(["caring_loving"]);
  const [speechStyle, setSpeechStyle] = useState("natural Hinglish, casual, warm");
  const [appearance, setAppearance] = useState("long dark wavy hair, warm brown eyes, wheatish skin, slim athletic build");
  const [clothing, setClothing] = useState("casual modern Indian fashion — jeans and a kurta");
  const [backstory, setBackstory] = useState("");
  const [scenario, setScenario] = useState("");
  const [firstMessage, setFirstMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
    if (!loading && user && !profile?.age_verified) navigate("/age-gate", { replace: true });
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (profile?.display_name && !yourName) setYourName(profile.display_name);
  }, [profile]);

  const togglePersonality = (id: string) => {
    setPersonalityTags((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const canNext = () => {
    if (step === 0) return yourName.trim().length > 0;
    if (step === 1) return name.trim().length > 0;
    if (step === 3) return personalityTags.length > 0;
    return true;
  };

  const finish = async () => {
    if (!user) return;
    setBusy(true);
    try {
      // update display name
      if (yourName.trim() !== profile?.display_name) {
        await supabase.from("profiles").update({ display_name: yourName.trim() }).eq("user_id", user.id);
        await refreshProfile();
      }

      const { data: comp, error: ce } = await supabase.from("companions").insert({
        user_id: user.id,
        full_name: name.trim(),
        age,
        gender_identity: gender,
        species,
        relationship_type: relationship,
        setting,
        personality: personalityTags.join(", "),
        speech_style: speechStyle,
        appearance_json: { description: appearance },
        clothing_json: { description: clothing },
        backstory: backstory.trim() || null,
        starter_scenario: scenario.trim() || null,
        first_message: firstMessage.trim() || null,
      }).select().single();
      if (ce) throw ce;

      const { data: chat, error: che } = await supabase.from("chats").insert({
        user_id: user.id, companion_id: comp.id, title: `Chat with ${comp.full_name}`,
      }).select().single();
      if (che) throw che;

      // seed first message if provided
      if (firstMessage.trim()) {
        await supabase.from("messages").insert({
          chat_id: chat.id, user_id: user.id, role: "assistant", content: firstMessage.trim(),
        });
      }

      navigate(`/chat/${chat.id}`, { replace: true });
    } catch (e: any) {
      toast.error(e.message || "Failed to create companion");
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else finish();
  };

  const Pill = ({ active, onClick, children }: any) => (
    <button onClick={onClick}
      className={`px-3.5 py-2 rounded-xl border text-sm transition-all ${
        active ? "border-primary bg-primary/10 text-foreground glow-primary"
               : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
      }`}
    >{children}</button>
  );

  return (
    <div className="min-h-[100dvh] gradient-bg flex flex-col items-center justify-center px-5 py-6">
      <div className="w-full max-w-sm">
        <div className="flex gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "gradient-primary" : "bg-border"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }} className="space-y-5"
          >
            {step === 0 && (
              <>
                <h2 className="text-2xl font-bold font-display">What's your name?</h2>
                <p className="text-sm text-muted-foreground">Your companion will use this when talking to you.</p>
                <Input value={yourName} onChange={(e) => setYourName(e.target.value)}
                  placeholder="Enter your name..." maxLength={30} autoFocus
                  className="py-5 bg-card border-border rounded-xl" />
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" /> Name your companion
                </h2>
                <Input value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya, Aarav, Zara..." maxLength={40} autoFocus
                  className="py-5 bg-card border-border rounded-xl" />
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold font-display">About {name}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Age</label>
                    <div className="flex items-center gap-3 mt-2">
                      <input type="range" min={18} max={60} value={age}
                        onChange={(e) => setAge(Number(e.target.value))} className="flex-1 accent-primary" />
                      <span className="text-xl font-bold w-10 text-center">{age}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gender</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {genderOptions.map((g) => <Pill key={g} active={gender === g} onClick={() => setGender(g)}>{g}</Pill>)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Species</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {speciesOptions.map((s) => <Pill key={s} active={species === s} onClick={() => setSpecies(s)}>{s}</Pill>)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Relationship</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {relationshipOptions.map((r) => <Pill key={r} active={relationship === r} onClick={() => setRelationship(r)}>{r}</Pill>)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Setting</label>
                    <Input value={setting} onChange={(e) => setSetting(e.target.value)}
                      className="bg-card border-border rounded-xl mt-2" placeholder="modern day, fantasy kingdom..." />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold font-display">Personality</h2>
                <p className="text-sm text-muted-foreground">Pick one or more.</p>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {personalityOptions.map((p) => (
                    <button key={p.id} onClick={() => togglePersonality(p.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        personalityTags.includes(p.id)
                          ? "border-primary bg-primary/10 glow-primary"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="font-semibold">{p.label}</div>
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Speech style</label>
                  <Input value={speechStyle} onChange={(e) => setSpeechStyle(e.target.value)}
                    className="bg-card border-border rounded-xl mt-2"
                    placeholder="natural Hinglish, casual..." />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="text-2xl font-bold font-display">Appearance & Style</h2>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Appearance</label>
                  <textarea value={appearance} onChange={(e) => setAppearance(e.target.value)}
                    rows={4} maxLength={500}
                    className="w-full mt-2 resize-none bg-card rounded-xl px-4 py-3 text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clothing</label>
                  <textarea value={clothing} onChange={(e) => setClothing(e.target.value)}
                    rows={3} maxLength={300}
                    className="w-full mt-2 resize-none bg-card rounded-xl px-4 py-3 text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <h2 className="text-2xl font-bold font-display">Backstory <span className="text-sm text-muted-foreground font-normal">(optional)</span></h2>
                <textarea value={backstory} onChange={(e) => setBackstory(e.target.value)}
                  placeholder={`${name}'s history, hobbies, where they come from, secrets...`}
                  rows={6} maxLength={800}
                  className="w-full resize-none bg-card rounded-xl px-4 py-3 text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary" />
              </>
            )}

            {step === 6 && (
              <>
                <h2 className="text-2xl font-bold font-display">Opening Scenario <span className="text-sm text-muted-foreground font-normal">(optional)</span></h2>
                <p className="text-sm text-muted-foreground">Set the scene for your first conversation.</p>
                <textarea value={scenario} onChange={(e) => setScenario(e.target.value)}
                  placeholder={`e.g. "${name} just moved in next door and you ran into them at the elevator..."`}
                  rows={5} maxLength={500}
                  className="w-full resize-none bg-card rounded-xl px-4 py-3 text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary" />
              </>
            )}

            {step === 7 && (
              <>
                <h2 className="text-2xl font-bold font-display">First Message <span className="text-sm text-muted-foreground font-normal">(optional)</span></h2>
                <p className="text-sm text-muted-foreground">What does {name} say to you first?</p>
                <textarea value={firstMessage} onChange={(e) => setFirstMessage(e.target.value)}
                  placeholder={`e.g. "Hey ${yourName}! Finally tum aaye, main wait kar rahi thi 💕"`}
                  rows={4} maxLength={500}
                  className="w-full resize-none bg-card rounded-xl px-4 py-3 text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary" />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}
              className="py-5 rounded-xl border-border" disabled={busy}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <Button onClick={next} disabled={!canNext() || busy}
            className="flex-1 py-5 font-semibold gradient-primary text-primary-foreground rounded-xl glow-primary disabled:opacity-40">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> :
             step === steps.length - 1 ? <><Sparkles className="w-4 h-4 mr-2" />Create {name || "companion"}</>
             : <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>}
          </Button>
        </div>
      </div>
    </div>
  );
}
