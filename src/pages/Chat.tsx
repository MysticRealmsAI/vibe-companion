import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser, type ChatMessage } from "@/contexts/UserContext";
import { simulateMockStream } from "@/lib/mockAI";
import ChatBubble from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";
import { Button } from "@/components/ui/button";
import { Send, Settings, Plus, Heart } from "lucide-react";

export default function Chat() {
  const navigate = useNavigate();
  const { profile, messages, addMessage, updateLastAssistantMessage, clearMessages } = useUser();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile?.onboarded) {
      navigate("/");
      return;
    }
  }, [profile, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const companion = profile?.companion;

  const sendMessage = async () => {
    if (!input.trim() || isTyping || !profile || !companion) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      createdAt: Date.now(),
    };
    addMessage(userMsg);
    setInput("");
    setIsTyping(true);

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    };
    addMessage(assistantMsg);

    let accumulated = "";
    await simulateMockStream(
      {
        personalities: companion.personalities,
        vibe: profile.vibe,
        userName: profile.displayName,
        companionName: companion.name,
      },
      (delta) => {
        accumulated += delta;
        updateLastAssistantMessage(accumulated);
      },
      () => setIsTyping(false)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!profile || !companion) return null;

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-lg">
            💗
          </div>
          <div>
            <h1 className="font-semibold text-sm text-foreground">{companion.name}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Online
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => clearMessages()} className="text-muted-foreground hover:text-foreground">
            <Plus className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} className="text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center glow-primary">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">
                Hey {profile.displayName}! 👋
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Start a conversation with {companion.name}
              </p>
            </div>
          </motion.div>
        )}

        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isTyping && messages[messages.length - 1]?.content === "" ? null : isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-end gap-2 max-w-lg mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${companion.name}...`}
            rows={1}
            className="flex-1 resize-none bg-secondary rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary max-h-32"
            style={{ minHeight: "44px" }}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-full gradient-primary text-primary-foreground shrink-0 hover:opacity-90 disabled:opacity-40"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
