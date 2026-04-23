import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CompanionStyle, LanguagePreference, VibePreference } from "@/lib/companions";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface UserProfile {
  displayName: string;
  language: LanguagePreference;
  companionStyle: CompanionStyle;
  vibe: VibePreference;
  moodNotes: string;
  favoriteTopics: string[];
  lastChatSummary: string;
  ageVerified: boolean;
  onboarded: boolean;
  createdAt: number;
  updatedAt: number;
}

interface UserContextType {
  profile: UserProfile | null;
  messages: ChatMessage[];
  setProfile: (p: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addMessage: (msg: ChatMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  clearMessages: () => void;
  clearMemory: () => void;
  deleteAccount: () => void;
}

const defaultProfile: UserProfile = {
  displayName: "",
  language: "hinglish",
  companionStyle: "caring",
  vibe: "romantic",
  moodNotes: "",
  favoriteTopics: [],
  lastChatSummary: "",
  ageVerified: false,
  onboarded: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("vibe_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("vibe_messages");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (profile) localStorage.setItem("vibe_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("vibe_messages", JSON.stringify(messages));
  }, [messages]);

  const setProfile = useCallback((p: UserProfile) => {
    setProfileState({ ...p, updatedAt: Date.now() });
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfileState((prev) => (prev ? { ...prev, ...updates, updatedAt: Date.now() } : null));
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateLastAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === "assistant") {
          copy[i] = { ...copy[i], content };
          break;
        }
      }
      return copy;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const clearMemory = useCallback(() => {
    setMessages([]);
    setProfileState((prev) =>
      prev
        ? { ...prev, moodNotes: "", favoriteTopics: [], lastChatSummary: "", updatedAt: Date.now() }
        : null
    );
  }, []);

  const deleteAccount = useCallback(() => {
    localStorage.removeItem("vibe_profile");
    localStorage.removeItem("vibe_messages");
    setProfileState(null);
    setMessages([]);
  }, []);

  return (
    <UserContext.Provider
      value={{
        profile,
        messages,
        setProfile,
        updateProfile,
        addMessage,
        updateLastAssistantMessage,
        clearMessages,
        clearMemory,
        deleteAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};

export { defaultProfile };
