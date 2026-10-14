const MAX_TITLE_LENGTH = 40;

/**
 * A quick title from the first user message: ~40 characters, cut at a word
 * boundary, sentence case. "esok 3pm meeting dengan boss" → "Esok 3pm meeting dengan boss".
 *
 * TODO(slice 3): once the AI agent is connected, ask it for a short title
 * after the first reply and save it with renameConversation(). Keep this
 * as the instant placeholder until that title arrives.
 */
export function titleFromFirstMessage(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "New chat";

  let title = clean;
  if (clean.length > MAX_TITLE_LENGTH) {
    const cut = clean.slice(0, MAX_TITLE_LENGTH + 1);
    const lastSpace = cut.lastIndexOf(" ");
    title = (lastSpace > 20 ? cut.slice(0, lastSpace) : clean.slice(0, MAX_TITLE_LENGTH)).replace(
      /[\s,.;:!?-]+$/,
      "",
    );
    title += "…";
  }
  return title.charAt(0).toUpperCase() + title.slice(1);
}
