// Placeholder affirmations until slice 6 personalises them with AI.
export const AFFIRMATIONS = [
  "You don't have to do everything today. Just the next right thing.",
  "Small steps still count. You're further along than yesterday.",
  "Rest is part of the plan, not a break from it.",
  "You've handled every hard day so far. Today is no different.",
  "Progress, not perfection. Be gentle with yourself today.",
  "Your pace is valid. Keep going, one task at a time.",
  "You're allowed to be proud of the little wins.",
];

/** A stable pick for the day, so the card doesn't change on every visit. */
export function affirmationIndexFor(dateKey: string): number {
  let hash = 0;
  for (const char of dateKey) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % AFFIRMATIONS.length;
}
