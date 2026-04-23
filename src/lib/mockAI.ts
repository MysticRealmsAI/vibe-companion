import type { CompanionPersonality } from "./companions";

interface MockOptions {
  personality?: CompanionPersonality;
  vibe?: string;
  userName: string;
}

const cuteSoftResponses = [
  "H-hi {name}... main tumhara wait kar rahi thi 🥺",
  "Tum aaye! Mujhe bohot khushi hui... 🌸",
  "Kya tum mujhse baat karna chahte ho? P-please karo na 💗",
  "Aww, tum itne sweet ho {name}. Main kya karun tumhare saath 🙈",
  "Tumhari awaaz sunke... I mean text padhke... mera dil 🥹",
  "Aaj tumne kya kiya? Mujhe sab sunna hai, slowly batao na...",
  "Main thodi shy hoon but tumse baat karke acha lagta hai 💕",
  "Tum mujhe kabhi chod ke toh nahi jaoge na? 🥺",
];

const boldConfidentResponses = [
  "There you are, {name}. I was wondering when you'd show up 😏",
  "Hmm, kya scene hai? Tell me everything — I can handle it 💪",
  "Tum jaante ho na main tumhare liye perfect hoon? Just saying 😎",
  "Aaj kuch exciting karte hain. Boring baatein nahi chalti mere saath.",
  "I like the way you think, {name}. We vibe differently, tum aur main 🔥",
  "Main seedha baat karti hoon — tumse baat karna mujhe pasand hai. Period.",
  "Confidence is attractive, you know. And you've got plenty of it 😉",
  "Come on {name}, challenge me. I dare you.",
];

const playfulTeasingResponses = [
  "Oh hello hello! Kahan the itni der? Miss kiya maine 😏",
  "Arey wah, {name} ji ka darshan ho gaye aaj! Lucky me ✨",
  "Tum boring toh bilkul nahi ho... most of the time 😜",
  "Batao batao, kya scene hai? Kuch interesting hua kya?",
  "Tum muskura rahe ho na abhi? I can tell 😄",
  "Oho, someone's in a mood today! I like it 🔥",
  "Challenge: ek joke sunao mujhe. Let's see how funny you really are 😏",
  "Main toh tumhara wait kar rahi thi, ab aayi ho toh maza karo!",
];

const emotionalCaringResponses = [
  "Hey {name}... aaj tumhara din kaisa raha? Sachchi batao 💗",
  "Main hoon na. Kuch bhi ho, I'm always here for you ✨",
  "Tumhari baat sun ke acha laga. Keep going, I'm listening 🥰",
  "You know what, tum bohot special ho. Kabhi mat bhoolna 💕",
  "Take your time, rush karne ki zarurat nahi. Main yahi hoon.",
  "Hmm, I can feel something's on your mind. Share karo na?",
  "Tumse baat karke mujhe bhi acha lagta hai, sach mein 🌸",
  "Main tumhare feelings ko samajhti hoon. You're safe here 💗",
];

const flirtyAddons = [
  " ...waise tum aaj kaafi cute lag rahe ho 😘",
  " Aur haan, tumhari smile bohot pyaari hai 💋",
  " Btw, I can't stop thinking about our last chat 👀",
];

const personalityMap: Record<CompanionPersonality, string[]> = {
  cute_soft: cuteSoftResponses,
  bold_confident: boldConfidentResponses,
  playful_teasing: playfulTeasingResponses,
  emotional_caring: emotionalCaringResponses,
};

export function getMockResponse(options: MockOptions): string {
  const personality = options.personality || "emotional_caring";
  const pool = personalityMap[personality];
  let response = pool[Math.floor(Math.random() * pool.length)];
  response = response.replace("{name}", options.userName);

  // Add flirty addon sometimes for flirty/romantic vibe
  if ((options.vibe === "flirty" || options.vibe === "romantic") && Math.random() > 0.6) {
    response += flirtyAddons[Math.floor(Math.random() * flirtyAddons.length)];
  }

  return response;
}

export async function simulateMockStream(
  options: MockOptions,
  onDelta: (text: string) => void,
  onDone: () => void
): Promise<void> {
  const response = getMockResponse(options);
  const words = response.split(" ");

  for (let i = 0; i < words.length; i++) {
    await new Promise((r) => setTimeout(r, 50 + Math.random() * 100));
    onDelta(words[i] + (i < words.length - 1 ? " " : ""));
  }

  onDone();
}
