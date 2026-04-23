import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { companions, languageOptions, vibeOptions } from "@/lib/companions";
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

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate("/chat")} className="text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold text-foreground">Settings</h1>
      </div>

      <div className="max-w-sm mx-auto px-4 py-6 space-y-8">
        {/* Name */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Display Name</h2>
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-card border-border rounded-xl"
              maxLength={30}
            />
            <Button onClick={handleSaveName} size="icon" className="gradient-primary text-primary-foreground rounded-xl shrink-0">
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </motion.section>

        {/* Language */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Language</h2>
          <div className="space-y-2">
            {languageOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { updateProfile({ language: opt.id }); toast({ title: `Language set to ${opt.label}` }); }}
                className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                  profile.language === opt.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                <span className="font-medium text-foreground">{opt.label}</span>
                <span className="text-muted-foreground ml-2">· {opt.desc}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Companion Style */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Companion Style</h2>
          <div className="space-y-2">
            {companions.map((c) => (
              <button
                key={c.id}
                onClick={() => { updateProfile({ companionStyle: c.id }); toast({ title: `Switched to ${c.name} ${c.emoji}` }); }}
                className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                  profile.companionStyle === c.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                <span className="font-medium text-foreground">{c.emoji} {c.name}</span>
                <span className="text-muted-foreground ml-2">· {c.tagline}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Vibe */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Conversation Vibe</h2>
          <div className="space-y-2">
            {vibeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { updateProfile({ vibe: opt.id }); toast({ title: `Vibe set to ${opt.label}` }); }}
                className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                  profile.vibe === opt.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                <span className="font-medium text-foreground">{opt.label}</span>
                <span className="text-muted-foreground ml-2">· {opt.desc}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Danger Zone */}
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
