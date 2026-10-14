import { createCn } from "cn/config";

/**
 * Joins class names and resolves Tailwind conflicts ("p-2 p-4" → "p-4").
 * `text-meta` is our custom 13px size (see docs/design.md); registering it
 * stops it being mistaken for a text *colour* and dropped.
 */
export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: ["meta"] }] } },
});
