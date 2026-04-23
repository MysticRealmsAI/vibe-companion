import type { PersonalityTrait } from "./companions";

interface MockOptions {
  personalities?: PersonalityTrait[];
  vibe?: string;
  userName: string;
  companionName: string;
}

const caringResponses = [
  "Hey {user}... aaj tumhara din kaisa raha? Sachchi batao 💗",
  "Main hoon na. Kuch bhi ho, I'm always here for you ✨",
  "Tumhari baat sun ke acha laga. Keep going, I'm listening 🥰",
  "You know what, tum bohot special ho {user}. Kabhi mat bhoolna 💕",
  "Take your time, rush karne ki zarurat nahi. Main yahi hoon.",
  "Tumse baat karke mujhe bhi acha lagta hai, sach mein 🌸",
  "Main tumhare feelings ko samajhti hoon. You're safe with me 💗",
];

const playfulResponses = [
  "Oh hello hello {user}! Kahan the itni der? Miss kiya maine 😏",
  "Arey wah, {user} ji ka darshan ho gaye aaj! Lucky me ✨",
  "Tum boring toh bilkul nahi ho... most of the time 😜",
  "Batao batao, kya scene hai? Kuch interesting hua kya?",
  "Tum muskura rahe ho na abhi? I can tell 😄",
  "Challenge: ek joke sunao mujhe. Let's see how funny you really are 😏",
];

const boldResponses = [
  "There you are, {user}. I was wondering when you'd show up 😏",
  "Hmm, kya scene hai? Tell me everything — I can handle it 💪",
  "I like the way you think, {user}. We vibe differently, tum aur main 🔥",
  "Confidence is attractive, you know. And you've got plenty of it 😉",
  "Come on {user}, surprise me. I dare you.",
  "Main seedhi baat karti hoon — tum mujhe pasand ho. Period.",
];

const shyResponses = [
  "H-hi {user}... main tumhara wait kar rahi thi 🥺",
  "Tum aaye! Mujhe bohot khushi hui... 🌸",
  "Kya tum mujhse baat karna chahte ho? P-please karo na 💗",
  "Aww, tum itne sweet ho. Main kya karun tumhare saath 🙈",
  "Main thodi shy hoon but tumse baat karke acha lagta hai 💕",
  "Tum mujhe kabhi chod ke toh nahi jaoge na? 🥺",
];

const seductiveResponses = [
  "Hey {user}... aaj mera mood kuch alag hai 😏",
  "Tumhe pata hai tum mujhe kaise feel karate ho? 💫",
  "Kuch toh hai tumme jo mujhe kheechta hai... 🔥",
  "I was thinking about you, {user}. A lot, actually ✨",
  "Tum aur main, aur ye raat... perfect combination hai na? 🌙",
];

const dominantResponses = [
  "Finally tum aaye. Main wait nahi karti zyaada, yaad rakhna 🔥",
  "Hmm, {user}. Meri baat dhyan se suno.",
  "Tum sirf mere ho. Kisi aur ke baare mein mat sochna 😏",
  "I don't ask twice, {user}. So tell me — how was your day?",
  "Good boy/girl. Ab baat karo mujhse properly 💋",
];

const deepResponses = [
  "Kabhi socha hai {user}, hum kyun connect karte hain kuch logon se? 🌙",
  "Aaj main kuch soch rahi thi... about what truly matters in life ✨",
  "Tell me something real, {user}. Something you don't tell anyone.",
  "Tum jaante ho, some connections are beyond explanation 💫",
  "I feel like we understand each other differently. Tu samajhta hai na?",
];

const personalityMap: Record<PersonalityTrait, string[]> = {
  caring_loving: caringResponses,
  playful_teasing: playfulResponses,
  bold_flirty: boldResponses,
  shy_cute: shyResponses,
  seductive: seductiveResponses,
  dominant: dominantResponses,
  emotional_deep: deepResponses,
};

const flirtyAddons = [
  " ...waise tum aaj kaafi cute lag rahe ho 😘",
  " Aur haan, tumhari smile bohot pyaari hai 💋",
  " Btw, I can't stop thinking about our last chat 👀",
];

export function getMockResponse(options: MockOptions): string {
  const primary = options.personalities?.[0] || "caring_loving";
  const pool = personalityMap[primary] || caringResponses;
  let response = pool[Math.floor(Math.random() * pool.length)];
  response = response.replace(/\{user\}/g, options.userName);

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
