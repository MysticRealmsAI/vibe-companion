import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import {
  languageOptions,
  vibeOptions,
} from "@/lib/companions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, Download, RotateCcw } from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { profile, updateProfile, clearMemory, deleteAccount } = useUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!profile) {
    navigate("/");
    return null;
  }

  const companion = profile.companion;

  const handleExport = () => {
    const data = JSON.stringify({ profile, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vibe-companion-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-6 mb-3">{children}</h3>
  );

  const OptionChip = ({
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
      className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
        selected
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="max-w-md mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/chat")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold font-display text-foreground">Settings</h1>
        </div>

        {/* Your Name */}
        <SectionTitle>Your Name</SectionTitle>
        <Input
          value={profile.displayName}
          onChange={(e) => updateProfile({ displayName: e.target.value })}
          className="bg-card border-border rounded-xl"
          maxLength={30}
        />

        {/* Companion Info */}
        <SectionTitle>{companion.name}'s Profile</SectionTitle>
        <div className="space-y-3 text-sm text-foreground bg-card rounded-xl p-4 border border-border">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span>{companion.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Age</span>
            <span>{companion.age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gender</span>
            <span className="capitalize">{companion.gender.replace("_", " ")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Style</span>
            <span className="capitalize">{companion.imageStyle}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Personality: </span>
            <span>{companion.personalities.map((p) => p.replace(/_/g, " ")).join(", ")}</span>
          </div>
        </div>

        {/* Language */}
        <SectionTitle>Language</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map((opt) => (
            <OptionChip
              key={opt.id}
              selected={profile.language === opt.id}
              onClick={() => updateProfile({ language: opt.id })}
              label={opt.label}
            />
          ))}
        </div>

        {/* Vibe */}
        <SectionTitle>Conversation Vibe</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {vibeOptions.map((opt) => (
            <OptionChip
              key={opt.id}
              selected={profile.vibe === opt.id}
              onClick={() => updateProfile({ vibe: opt.id })}
              label={opt.label}
            />
          ))}
        </div>

        {/* Actions */}
        <SectionTitle>Actions</SectionTitle>
        <div className="space-y-3">
          <Button variant="outline" onClick={clearMemory} className="w-full justify-start gap-2 rounded-xl border-border">
            <RotateCcw className="w-4 h-4" /> Reset Memory
          </Button>
          <Button variant="outline" onClick={handleExport} className="w-full justify-start gap-2 rounded-xl border-border">
            <Download className="w-4 h-4" /> Export Data
          </Button>

          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full justify-start gap-2 rounded-xl border-destructive text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => {
                  deleteAccount();
                  navigate("/");
                }}
                className="flex-1 rounded-xl"
              >
                Confirm Delete
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="rounded-xl border-border">
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
