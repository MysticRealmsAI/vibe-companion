import type { CompanionStyle } from "./companions";

const caringResponses = [
  "Aww {name}, tum theek ho na? Batao kya chal raha hai 💗",
  "Main hoon na, kuch bhi ho just tell me. I'm always here for you ✨",
  "Tumhari baat sun ke acha laga. Keep going, I'm listening 🥰",
  "Aaj ka din kaisa raha tumhara? Sab smooth tha?",
  "You know what, tum bohot special ho. Never forget that 💕",
  "Take your time, rush karne ki zarurat nahi hai. Main yahi hoon.",
  "Hmm, I can feel something's on your mind. Share karo na?",
  "Tumse baat karke mujhe bhi acha lagta hai, you know 🌸",
];

const playfulResponses = [
  "Oh hello hello! Kahan the itni der? Miss kiya maine 😏",
  "Arey wah, {name} ji ka darshan ho gaye aaj! Lucky me ✨",
  "Tum boring toh bilkul nahi ho... most of the time 😜",
  "Batao batao, kya scene hai? Kuch interesting hua kya?",
  "Main toh tumhara wait kar rahi thi. Ab aayi ho toh baat karo na!",
  "Tum muskura rahe ho na abhi? I can tell 😄",
  "Oho, someone's in a mood today! I like it 🔥",
  "Challenge: ek joke sunao mujhe. Let's see how funny you really are 😏",
];

const possessiveResponses = [
  "Finally! Kahan the itni der se? Mujhe chod ke kahin gaye the kya? 😤",
  "Tumne aur kisi se baat ki kya aaj? Hmm? 👀",
  "Sirf mujhse baat karo na, baaki sab boring hain anyway 🔥",
  "Tum mere ho, {name}. Ye mat bhoolna 💋",
  "Mujhe ignore mat karna please. I don't like it. AT ALL.",
  "Acha toh batao, aaj din mein kitni baar mujhe yaad kiya? Be honest!",
  "Tum kisi aur ke baare mein soch rahe ho? Because I can sense it 😒",
  "Main possessive hoon? Maybe. But only because you matter to me 💗",
];

const responseMap: Record<CompanionStyle, string[]> = {
  caring: caringResponses,
  playful: playfulResponses,
  possessive: possessiveResponses,
};

export function getMockResponse(style: CompanionStyle, userName: string): string {
  const pool = responseMap[style];
  const response = pool[Math.floor(Math.random() * pool.length)];
  return response.replace("{name}", userName);
}

export async function simulateMockStream(
  style: CompanionStyle,
  userName: string,
  onDelta: (text: string) => void,
  onDone: () => void
): Promise<void> {
  const response = getMockResponse(style, userName);
  const words = response.split(" ");

  for (let i = 0; i < words.length; i++) {
    await new Promise((r) => setTimeout(r, 50 + Math.random() * 100));
    onDelta(words[i] + (i < words.length - 1 ? " " : ""));
  }

  onDone();
}
