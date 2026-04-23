import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, Download, RotateCcw, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { profile, updateProfile, clearMemory, deleteAccount, messages } = useUser();
  const [name, setName] = useState(profile?.displayName || "");

  if (!profile) {
    navigate("/");
    return null;
  }

  const handleSaveName = () => {
    if (name.trim()) {
      updateProfile({ displayName: name.trim() });
      toast({ title: "Name updated! ✨" });
    }
  };

  const handleExport = () => {
    const data = { profile, messages, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vibe-companion-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Data exported! 📦" });
  };

  const handleClearMemory = () => {
    if (confirm("This will clear all chat history and memory. Are you sure?")) {
      clearMemory();
      toast({ title: "Memory cleared 🧹" });
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("This will delete ALL your data permanently. Are you sure?")) {
      deleteAccount();
      navigate("/");
      toast({ title: "Account deleted" });
    }
  };

  const OptionBtn = ({ selected, onClick, label, sub }: { selected: boolean; onClick: () => void; label: string; sub?: string }) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
        selected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-muted-foreground/30"
      }`}
    >
      <span className="font-medium text-foreground">{label}</span>
      {sub && <span className="text-muted-foreground ml-2">· {sub}</span>}
    </button>
  );

  const SmallBtn = ({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
        selected ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
      }`}
    >
      {label}
    </button>
  );

  const Section = ({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) => (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h2>
      {children}
    </motion.section>
  );

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate("/chat")} className="text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold text-foreground">Settings</h1>
      </div>

      <div className="max-w-sm mx-auto px-4 py-6 space-y-8">
        <Section title="Display Name" delay={0}>
          <div className="flex gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-card border-border rounded-xl" maxLength={30} />
            <Button onClick={handleSaveName} size="icon" className="gradient-primary text-primary-foreground rounded-xl shrink-0">
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </Section>

        <Section title="Gender" delay={0.03}>
          <div className="space-y-2">
            {genderOptions.map((opt) => (
              <OptionBtn key={opt.id} selected={profile.gender === opt.id} onClick={() => { updateProfile({ gender: opt.id }); toast({ title: `Gender updated` }); }} label={opt.label} />
            ))}
          </div>
        </Section>

        <Section title="Preference" delay={0.05}>
          <div className="space-y-2">
            {sexualPreferenceOptions.map((opt) => (
              <OptionBtn key={opt.id} selected={profile.sexualPreference === opt.id} onClick={() => { updateProfile({ sexualPreference: opt.id }); toast({ title: `Preference updated` }); }} label={opt.label} />
            ))}
          </div>
        </Section>

        <Section title="Language" delay={0.07}>
          <div className="space-y-2">
            {languageOptions.map((opt) => (
              <OptionBtn key={opt.id} selected={profile.language === opt.id} onClick={() => { updateProfile({ language: opt.id }); toast({ title: `Language set to ${opt.label}` }); }} label={opt.label} sub={opt.desc} />
            ))}
          </div>
        </Section>

        <Section title="Companion Personality" delay={0.09}>
          <div className="space-y-2">
            {companionPersonalityOptions.map((opt) => (
              <OptionBtn key={opt.id} selected={profile.companionPersonality === opt.id} onClick={() => { updateProfile({ companionPersonality: opt.id }); toast({ title: `Personality: ${opt.label}` }); }} label={opt.label} sub={opt.desc} />
            ))}
          </div>
        </Section>

        <Section title="Companion Appearance" delay={0.11}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Hair</label>
              <div className="flex flex-wrap gap-2">
                {hairOptions.map((opt) => (
                  <SmallBtn key={opt.id} selected={profile.appearance?.hair === opt.id} onClick={() => { updateProfile({ appearance: { ...profile.appearance, hair: opt.id } }); }} label={opt.label} />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Skin Tone</label>
              <div className="flex flex-wrap gap-2">
                {skinToneOptions.map((opt) => (
                  <SmallBtn key={opt.id} selected={profile.appearance?.skinTone === opt.id} onClick={() => { updateProfile({ appearance: { ...profile.appearance, skinTone: opt.id } }); }} label={opt.label} />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Style</label>
              <div className="flex flex-wrap gap-2">
                {fashionStyleOptions.map((opt) => (
                  <SmallBtn key={opt.id} selected={profile.appearance?.style === opt.id} onClick={() => { updateProfile({ appearance: { ...profile.appearance, style: opt.id } }); }} label={opt.label} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Companion Style" delay={0.13}>
          <div className="space-y-2">
            {companions.map((c) => (
              <OptionBtn key={c.id} selected={profile.companionStyle === c.id} onClick={() => { updateProfile({ companionStyle: c.id }); toast({ title: `Switched to ${c.name} ${c.emoji}` }); }} label={`${c.emoji} ${c.name}`} sub={c.tagline} />
            ))}
          </div>
        </Section>

        <Section title="Conversation Vibe" delay={0.15}>
          <div className="space-y-2">
            {vibeOptions.map((opt) => (
              <OptionBtn key={opt.id} selected={profile.vibe === opt.id} onClick={() => { updateProfile({ vibe: opt.id }); toast({ title: `Vibe set to ${opt.label}` }); }} label={opt.label} sub={opt.desc} />
            ))}
          </div>
        </Section>

        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3 pt-4 border-t border-border">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Data & Privacy</h2>
          <div className="space-y-2">
            <Button onClick={handleExport} variant="outline" className="w-full justify-start rounded-xl border-border text-foreground">
              <Download className="w-4 h-4 mr-2" /> Export My Data
            </Button>
            <Button onClick={handleClearMemory} variant="outline" className="w-full justify-start rounded-xl border-border text-foreground">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Memory
            </Button>
            <Button onClick={handleDeleteAccount} variant="outline" className="w-full justify-start rounded-xl border-destructive text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4 mr-2" /> Delete All Data
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
