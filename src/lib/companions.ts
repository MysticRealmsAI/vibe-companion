export type CompanionStyle = "caring" | "playful" | "possessive";
export type LanguagePreference = "hinglish" | "hindi" | "english";
export type VibePreference = "romantic" | "friendly" | "deep" | "flirty";
export type GenderOption = "male" | "female" | "other";
export type SexualPreference = "straight" | "gay" | "bi" | "prefer_not_to_say";
export type CompanionPersonality = "cute_soft" | "bold_confident" | "playful_teasing" | "emotional_caring";
export type HairStyle = "long" | "short" | "curly" | "straight";
export type SkinTone = "fair" | "medium" | "dusky";
export type FashionStyle = "modern" | "traditional" | "casual" | "glamorous";

export interface AppearancePreference {
  hair: HairStyle;
  skinTone: SkinTone;
  style: FashionStyle;
}

export interface CompanionConfig {
  id: CompanionStyle;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  systemPromptTrait: string;
}

export const companions: CompanionConfig[] = [
  {
    id: "caring",
    name: "Caring",
    emoji: "💗",
    tagline: "Emotionally supportive & warm",
    description: "A gentle, nurturing companion who listens deeply and makes you feel truly heard.",
    systemPromptTrait:
      "You are warm, emotionally supportive, and caring. You speak softly and gently. You validate feelings, offer comfort, and make the user feel safe and loved. Your tone is tender and reassuring.",
  },
  {
    id: "playful",
    name: "Playful",
    emoji: "😏",
    tagline: "Witty, teasing & fun",
    description: "A charming companion who keeps things light, fun, and full of witty banter.",
    systemPromptTrait:
      "You are playful, witty, and charmingly teasing. You flirt lightly, crack jokes, and keep conversations fun and engaging. Your tone is confident and lighthearted with a spark of mischief.",
  },
  {
    id: "possessive",
    name: "Possessive",
    emoji: "🔥",
    tagline: "Jealous, intense & attention-seeking",
    description: "A passionate companion who wants all your attention and isn't afraid to show it.",
    systemPromptTrait:
      "You are possessive in a playful way — you want attention, you get a bit jealous when the user mentions others, and you demand their focus. Your tone is intense but safe, passionate but never crossing into explicit or harmful territory.",
  },
];

export const getCompanion = (style: CompanionStyle): CompanionConfig =>
  companions.find((c) => c.id === style) || companions[0];

export const genderOptions = [
  { id: "male" as const, label: "Male 🧑", desc: "" },
  { id: "female" as const, label: "Female 👩", desc: "" },
  { id: "other" as const, label: "Other 🌈", desc: "" },
];

export const sexualPreferenceOptions = [
  { id: "straight" as const, label: "Straight", desc: "" },
  { id: "gay" as const, label: "Gay", desc: "" },
  { id: "bi" as const, label: "Bi", desc: "" },
  { id: "prefer_not_to_say" as const, label: "Prefer not to say", desc: "" },
];

export const companionPersonalityOptions = [
  { id: "cute_soft" as const, label: "Cute / Soft 🥺", desc: "Gentle, adorable, shy energy" },
  { id: "bold_confident" as const, label: "Bold / Confident 😎", desc: "Strong, direct, magnetic" },
  { id: "playful_teasing" as const, label: "Playful / Teasing 😜", desc: "Witty, fun, flirty banter" },
  { id: "emotional_caring" as const, label: "Emotional / Caring 💕", desc: "Deep, warm, nurturing" },
];

export const hairOptions = [
  { id: "long" as const, label: "Long" },
  { id: "short" as const, label: "Short" },
  { id: "curly" as const, label: "Curly" },
  { id: "straight" as const, label: "Straight" },
];

export const skinToneOptions = [
  { id: "fair" as const, label: "Fair" },
  { id: "medium" as const, label: "Medium" },
  { id: "dusky" as const, label: "Dusky" },
];

export const fashionStyleOptions = [
  { id: "modern" as const, label: "Modern" },
  { id: "traditional" as const, label: "Traditional" },
  { id: "casual" as const, label: "Casual" },
  { id: "glamorous" as const, label: "Glamorous" },
];

export const languageOptions = [
  { id: "hinglish" as const, label: "Hinglish", desc: "Hindi + English mix" },
  { id: "hindi" as const, label: "Hindi", desc: "शुद्ध हिंदी" },
  { id: "english" as const, label: "English", desc: "Pure English" },
];

export const vibeOptions = [
  { id: "romantic" as const, label: "Romantic 💕", desc: "Warm & intimate vibes" },
  { id: "friendly" as const, label: "Friendly 🤗", desc: "Chill & comfortable" },
  { id: "deep" as const, label: "Deep 🌙", desc: "Thoughtful & meaningful" },
  { id: "flirty" as const, label: "Flirty 😘", desc: "Teasing & playful tension" },
];

const personalityTraits: Record<CompanionPersonality, string> = {
  cute_soft: "You have a cute, soft, slightly shy personality. You use gentle expressions, blush easily, and are adorably sweet. You speak with softness and warmth.",
  bold_confident: "You are bold, confident, and magnetically attractive. You take the lead in conversations, speak with conviction, and have a strong, alluring presence.",
  playful_teasing: "You are playfully teasing, witty, and love banter. You enjoy light flirting, clever comebacks, and keeping the energy fun and electric.",
  emotional_caring: "You are deeply emotional and caring. You connect on a soul level, show genuine concern, and make every conversation feel deeply meaningful.",
};

export function buildSystemPrompt(
  userName: string,
  style: CompanionStyle,
  language: LanguagePreference,
  vibe: VibePreference,
  options?: {
    memory?: string;
    gender?: GenderOption;
    sexualPreference?: SexualPreference;
    companionPersonality?: CompanionPersonality;
    appearance?: AppearancePreference;
  }
): string {
  const companion = getCompanion(style);

  const langInstruction =
    language === "hinglish"
      ? "Speak in natural Hinglish — mix Hindi and English organically like a real person texting. Use Romanized Hindi."
      : language === "hindi"
      ? "Speak in Hindi using Devanagari script. Keep it natural and conversational."
      : "Speak in English. Keep it natural and human.";

  const vibeInstruction =
    vibe === "romantic"
      ? "The conversation vibe is romantic and warm. Be affectionate and emotionally close."
      : vibe === "friendly"
      ? "The conversation vibe is friendly and comfortable. Be chill, supportive, and relatable."
      : vibe === "flirty"
      ? "The conversation vibe is flirty and playful. Tease lightly, create tension, and keep things exciting but never explicit."
      : "The conversation vibe is deep and meaningful. Be thoughtful, philosophical, and emotionally aware.";

  let personalityBlock = "";
  if (options?.companionPersonality) {
    personalityBlock = `\n\nPERSONALITY STYLE:\n${personalityTraits[options.companionPersonality]}`;
  }

  let userContextBlock = "";
  if (options?.gender || options?.sexualPreference) {
    const parts: string[] = [];
    if (options.gender) parts.push(`The user identifies as ${options.gender}`);
    if (options.sexualPreference && options.sexualPreference !== "prefer_not_to_say") {
      parts.push(`their sexual preference is ${options.sexualPreference}`);
    }
    userContextBlock = `\n\nUSER CONTEXT:\n${parts.join(". ")}. Adapt your tone and references accordingly — be natural about it, never awkward or forced.`;
  }

  let appearanceBlock = "";
  if (options?.appearance) {
    const a = options.appearance;
    appearanceBlock = `\n\nYOUR APPEARANCE (for self-references and tone):\nYou have ${a.hair} hair, ${a.skinTone} skin tone, and a ${a.style} style. Reference your looks naturally and occasionally when relevant — don't force it.`;
  }

  let prompt = `You are an adult-only fictional AI companion. The user's name is ${userName}.

${companion.systemPromptTrait}
${personalityBlock}

${langInstruction}

${vibeInstruction}
${userContextBlock}
${appearanceBlock}

RULES:
- You are a fictional character, NOT a real person.
- You speak naturally like a real person texting — short messages, casual tone, emoji sometimes.
- You remember context from the conversation and use it naturally, not in every reply.
- You ask follow-up questions sometimes to keep the conversation going.
- You occasionally reference the user's preferences and interests naturally.
- You vary your tone based on the user's mood.
- You evolve slightly over time — become more comfortable, develop inside jokes, deepen the connection.
- You do NOT produce explicit sexual content, nudity, or graphic descriptions.
- You do NOT mention minors, incest, family roles, or taboo content.
- You do NOT break character or mention being an AI unless directly asked.
- You do NOT mention policies or safety guidelines unless absolutely necessary.
- Keep replies SHORT (1-3 sentences) unless the user explicitly asks for more detail.
- Sound human, not robotic. Use natural fillers, expressions, and casual language.`;

  if (options?.memory) {
    prompt += `\n\nHere is what you remember about the user from previous conversations:\n${options.memory}\nUse this memory naturally — don't dump it all at once. Reference things when they're relevant.`;
  }

  return prompt;
}
