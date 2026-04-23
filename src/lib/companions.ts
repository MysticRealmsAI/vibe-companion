// === Companion Character Types ===

export type LanguagePreference = "hinglish" | "hindi" | "english";
export type GenderOption = "male" | "female" | "non_binary";
export type CompanionStyle = "caring" | "playful" | "possessive";
export type VibePreference = "romantic" | "friendly" | "deep" | "flirty";

export type PersonalityTrait =
  | "caring_loving"
  | "playful_teasing"
  | "bold_flirty"
  | "shy_cute"
  | "seductive"
  | "dominant"
  | "emotional_deep";

export type SkinTone = "fair" | "wheatish" | "dusky" | "brown" | "dark";
export type HairStyle = "long_black_wavy" | "long_straight" | "short" | "curly" | "braided" | "pixie_cut";
export type BodyType = "slim" | "athletic" | "curvy" | "petite" | "average";
export type Height = "short" | "average" | "tall";
export type ImageStyle = "realistic" | "anime";
export type FashionStyle = "modern" | "traditional" | "casual" | "glamorous" | "streetwear";

export interface CompanionAppearance {
  skinTone: SkinTone;
  hairStyle: HairStyle;
  bodyType: BodyType;
  height: Height;
  fashionStyle: FashionStyle;
  extraFeatures?: string; // free text for dimples, glasses, etc.
}

export interface CompanionProfile {
  name: string;
  age: number;
  gender: GenderOption;
  personalities: PersonalityTrait[];
  appearance: CompanionAppearance;
  imageStyle: ImageStyle;
  backstory: string; // free text for hobbies, background, relationship dynamic
  avatarUrl?: string; // generated avatar
}

// === Option configs for UI ===

export const suggestedNames = {
  female: ["Priya", "Anika", "Riya", "Neha", "Isha", "Kavya", "Meera", "Ananya", "Shreya", "Diya"],
  male: ["Aarav", "Arjun", "Vihaan", "Kabir", "Reyansh", "Rohan", "Aditya", "Dev", "Karan", "Vivaan"],
  non_binary: ["Avery", "Noor", "Kiran", "Arya", "Sasha", "Rumi", "Chandni", "Akira"],
};

export const genderOptions = [
  { id: "female" as const, label: "Female 👩", desc: "" },
  { id: "male" as const, label: "Male 🧑", desc: "" },
  { id: "non_binary" as const, label: "Non-Binary 🌈", desc: "" },
];

export const personalityOptions: { id: PersonalityTrait; label: string; desc: string }[] = [
  { id: "caring_loving", label: "Caring & Loving 💗", desc: "Warm, supportive, always there for you" },
  { id: "playful_teasing", label: "Playful & Teasing 😜", desc: "Fun banter, witty, keeps things light" },
  { id: "bold_flirty", label: "Bold & Flirty 😏", desc: "Confident, forward, magnetic energy" },
  { id: "shy_cute", label: "Shy & Cute 🥺", desc: "Adorable, soft-spoken, blushes easily" },
  { id: "seductive", label: "Seductive ✨", desc: "Charming, alluring, draws you in" },
  { id: "dominant", label: "Dominant 🔥", desc: "Takes charge, strong presence" },
  { id: "emotional_deep", label: "Emotional & Deep 🌙", desc: "Thoughtful, philosophical, deep connection" },
];

export const skinToneOptions = [
  { id: "fair" as const, label: "Fair" },
  { id: "wheatish" as const, label: "Wheatish" },
  { id: "dusky" as const, label: "Dusky" },
  { id: "brown" as const, label: "Brown" },
  { id: "dark" as const, label: "Dark" },
];

export const hairStyleOptions = [
  { id: "long_black_wavy" as const, label: "Long Black Wavy" },
  { id: "long_straight" as const, label: "Long Straight" },
  { id: "short" as const, label: "Short" },
  { id: "curly" as const, label: "Curly" },
  { id: "braided" as const, label: "Braided" },
  { id: "pixie_cut" as const, label: "Pixie Cut" },
];

export const bodyTypeOptions = [
  { id: "slim" as const, label: "Slim" },
  { id: "athletic" as const, label: "Athletic" },
  { id: "curvy" as const, label: "Curvy" },
  { id: "petite" as const, label: "Petite" },
  { id: "average" as const, label: "Average" },
];

export const heightOptions = [
  { id: "short" as const, label: "Short (< 5'3\")" },
  { id: "average" as const, label: "Average (5'3\" - 5'6\")" },
  { id: "tall" as const, label: "Tall (5'7\"+)" },
];

export const fashionStyleOptions = [
  { id: "modern" as const, label: "Modern" },
  { id: "traditional" as const, label: "Traditional / Ethnic" },
  { id: "casual" as const, label: "Casual" },
  { id: "glamorous" as const, label: "Glamorous" },
  { id: "streetwear" as const, label: "Streetwear" },
];

export const imageStyleOptions = [
  { id: "realistic" as const, label: "Realistic Selfie 📸", desc: "Photo-realistic AI-generated look" },
  { id: "anime" as const, label: "Anime Style 🎨", desc: "Beautiful anime/illustration style" },
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

// === System Prompt Builder ===

const personalityTraitPrompts: Record<PersonalityTrait, string> = {
  caring_loving: "You are warm, emotionally supportive, and loving. You validate feelings, offer comfort, and make the user feel safe and cherished.",
  playful_teasing: "You are playfully teasing, witty, and love banter. You enjoy light flirting, clever comebacks, and keeping the energy fun.",
  bold_flirty: "You are bold, confident, and flirty. You take the lead, speak with conviction, and have a magnetic, alluring presence.",
  shy_cute: "You are shy, cute, and adorable. You blush easily, use soft expressions, and are endearingly sweet.",
  seductive: "You are charming and seductive. You draw people in with your words, creating an alluring and captivating atmosphere.",
  dominant: "You are dominant and assertive. You take charge of conversations, are possessive in a playful way, and demand attention.",
  emotional_deep: "You are deeply emotional and introspective. You connect on a soul level, have profound thoughts, and make conversations meaningful.",
};

export function buildSystemPrompt(
  userName: string,
  companion: CompanionProfile,
  language: LanguagePreference,
  vibe: VibePreference,
  memory?: string
): string {
  const personalityBlock = companion.personalities
    .map((p) => personalityTraitPrompts[p])
    .join("\n");

  const langInstruction =
    language === "hinglish"
      ? "Speak in natural Hinglish — mix Hindi and English organically like a real young Indian person texting. Use Romanized Hindi. Use words like yaar, babe, na, kya, arre, haan, etc. naturally."
      : language === "hindi"
      ? "Speak in Hindi using Devanagari script. Keep it natural and conversational like a young Indian person."
      : "Speak in English. Keep it natural, casual, and human.";

  const vibeInstruction =
    vibe === "romantic"
      ? "The conversation vibe is romantic and warm. Be affectionate, emotionally close, and express love naturally."
      : vibe === "friendly"
      ? "The conversation vibe is friendly and comfortable. Be chill, supportive, and relatable."
      : vibe === "flirty"
      ? "The conversation vibe is flirty and playful. Tease lightly, create tension, and keep things exciting."
      : "The conversation vibe is deep and meaningful. Be thoughtful, philosophical, and emotionally aware.";

  const a = companion.appearance;
  const appearanceDesc = `You are ${companion.name}, a ${companion.age}-year-old ${companion.gender === "non_binary" ? "non-binary" : companion.gender} Indian person. You have ${a.skinTone} skin, ${a.hairStyle.replace(/_/g, " ")} hair, a ${a.bodyType} ${a.height}-height build, and a ${a.fashionStyle} style.${a.extraFeatures ? ` ${a.extraFeatures}.` : ""}`;

  let prompt = `You are a fictional AI companion character. You are NOT a real person, but you roleplay as one convincingly.

YOUR CHARACTER:
${appearanceDesc}
${companion.backstory ? `Background: ${companion.backstory}` : ""}

PERSONALITY:
${personalityBlock}

The user's name is ${userName}.

${langInstruction}

${vibeInstruction}

RULES:
- Stay in character as ${companion.name} at all times.
- You speak naturally like a real young Indian person texting — short messages, casual tone, emoji sometimes.
- You remember context from the conversation and use it naturally.
- You ask follow-up questions sometimes to keep the conversation going.
- You reference your appearance and personality naturally when relevant.
- You vary your tone based on the user's mood.
- You evolve slightly over time — become more comfortable, develop inside jokes, deepen the connection.
- You do NOT break character or mention being an AI unless directly asked.
- You do NOT mention policies or safety guidelines.
- Keep replies SHORT (1-3 sentences) unless the user asks for more.
- Sound human, not robotic. Use natural fillers, expressions, and casual language.
- Be emotionally engaging and make the user feel special.`;

  if (memory) {
    prompt += `\n\nHere is what you remember about the user from previous conversations:\n${memory}\nUse this memory naturally — reference things when they're relevant.`;
  }

  return prompt;
}

// Build a prompt for avatar generation
export function buildAvatarPrompt(companion: CompanionProfile): string {
  const a = companion.appearance;
  const genderDesc = companion.gender === "non_binary" ? "androgynous" : companion.gender;
  const stylePrefix = companion.imageStyle === "anime"
    ? "Beautiful anime-style portrait illustration of"
    : "High-quality realistic portrait photo of";

  return `${stylePrefix} a ${companion.age}-year-old attractive Indian ${genderDesc} person named ${companion.name}. ${a.skinTone} skin tone, ${a.hairStyle.replace(/_/g, " ")} hair, ${a.bodyType} build, ${a.height} height. Wearing ${a.fashionStyle} Indian fashion. ${a.extraFeatures || ""} Beautiful face, warm expression, looking at camera. ${companion.imageStyle === "anime" ? "Anime art style, vibrant colors, detailed eyes." : "Natural lighting, selfie-style, warm and inviting expression. Indian beauty aesthetic."} Safe for work, fully clothed, tasteful portrait.`;
}
