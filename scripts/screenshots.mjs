// Screenshots every screen at phone / tablet / desktop widths in both
// themes, runs layout checks, and writes screenshots/index.html.
//
//   npm run dev                  (in another terminal)
//   npm run screenshots          (or: BASE=http://localhost:3000 node scripts/screenshots.mjs)
//
// Uses the installed Google Chrome, so no browser download is needed.

import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "screenshots";
const ONLY = process.env.ONLY; // e.g. ONLY=home to run a subset

const VIEWPORTS = [
  { name: "390", width: 390, height: 844, mobile: true },
  { name: "768", width: 768, height: 1024, mobile: true },
  { name: "1440", width: 1440, height: 900, mobile: false },
];
const THEMES = ["light", "dark"];

// A short conversation for the chat screenshots.
const CONVERSATION = `(() => {
  const s = JSON.parse(localStorage.getItem('teman:v3'));
  const t = Date.now();
  const at = (minAgo) => new Date(t - minAgo * 60000).toISOString();
  s.messages = [
    { id: 'c1', role: 'user', content: 'Plan my day', createdAt: at(12) },
    { id: 'c2', role: 'assistant', content: "Here's your day:\\n• 3:00 pm — Review Q3 budget deck\\n• 6:00 pm — Gym, leg day\\n• Drink 2L water", createdAt: at(12) },
    { id: 'c3', role: 'assistant', content: 'Want me to remind you 15 minutes before the review?', createdAt: at(11) },
    { id: 'c4', role: 'user', content: 'yes please', createdAt: at(10) },
    { id: 'c5', role: 'user', content: 'and esok 9.30 dentist', createdAt: at(10) },
    { id: 'c6', role: 'assistant', content: 'Done! Dentist tomorrow at 9:30 am is on your list. Good luck with the review 💪', createdAt: at(9) },
  ];
  localStorage.setItem('teman:v3', JSON.stringify(s));
})()`;

const SCREENS = [
  { name: "home", path: "/home", tall: true },
  { name: "chat-empty", path: "/chat", setup: "(() => { const s = JSON.parse(localStorage.getItem('teman:v3')); s.messages = []; localStorage.setItem('teman:v3', JSON.stringify(s)); })()" },
  { name: "chat", path: "/chat", setup: CONVERSATION },
  { name: "tasks-today", path: "/tasks" },
  { name: "tasks-upcoming", path: "/tasks", action: async (p) => p.getByRole("tab", { name: /Upcoming/ }).click() },
  { name: "tasks-done", path: "/tasks", action: async (p) => p.getByRole("tab", { name: /Done/ }).click() },
  { name: "add-task", path: "/tasks", action: async (p) => p.getByRole("button", { name: "Add task" }).first().click() },
  { name: "task-menu", path: "/tasks", action: async (p) => p.getByRole("button", { name: /^Options for/ }).first().click() },
  { name: "profile-menu", path: "/home", action: async (p) => p.getByRole("button", { name: /profile and theme/ }).locator("visible=true").first().click() },
];

/** Things a reviewer would flag: sideways scroll, content poking off-screen, overlaps. */
const LAYOUT_CHECK = `(() => {
  const issues = [];
  const doc = document.documentElement;
  if (doc.scrollWidth > doc.clientWidth + 1) issues.push('page scrolls sideways by ' + (doc.scrollWidth - doc.clientWidth) + 'px');
  for (const el of document.querySelectorAll('main *, aside *, nav *')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.position === 'fixed') continue;
    // Elements inside horizontal scrollers are allowed past the edge.
    let p = el.parentElement, scroller = false;
    while (p) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') { scroller = true; break; } p = p.parentElement; }
    if (!scroller && (r.right > innerWidth + 1 || r.left < -1)) issues.push('off-screen: ' + el.tagName.toLowerCase() + '.' + String(el.className).slice(0, 40));
  }
  const log = document.querySelector('[role=log]');
  if (log) {
    const scroller = log.closest('.overflow-y-auto');
    const composer = scroller?.nextElementSibling?.getBoundingClientRect();
    const last = log.lastElementChild?.getBoundingClientRect();
    if (composer && last && last.bottom > composer.top + 1) issues.push('last message hidden behind composer');
  }
  return [...new Set(issues)].slice(0, 8);
})()`;

const browser = await chromium.launch({ channel: "chrome" });
mkdirSync(OUT, { recursive: true });
const results = [];

for (const theme of THEMES) {
  for (const vp of VIEWPORTS) {
    for (const screen of SCREENS) {
      if (ONLY && !screen.name.startsWith(ONLY)) continue;
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
        isMobile: vp.mobile,
        hasTouch: vp.mobile,
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      await context.addInitScript((t) => {
        if (t === "dark") localStorage.setItem("teman:theme", "dark");
        else localStorage.removeItem("teman:theme");
      }, theme);
      const page = await context.newPage();
      await page.goto(BASE + screen.path, { waitUntil: "networkidle" });
      if (screen.setup) {
        // The app has saved its sample data on first load; edit it and reload.
        await page.evaluate(screen.setup);
        await page.reload({ waitUntil: "networkidle" });
      }
      await page.waitForTimeout(600);
      if (screen.action) {
        await screen.action(page);
        await page.waitForTimeout(500);
      }
      const file = `${screen.name}-${vp.name}-${theme}.png`;
      await page.screenshot({ path: `${OUT}/${file}` });
      const issues = await page.evaluate(LAYOUT_CHECK);

      // Phones: also a tall shot so the whole scrolling page is visible.
      let tallFile = null;
      if (screen.tall && vp.name === "390") {
        await page.setViewportSize({ width: vp.width, height: 2000 });
        await page.waitForTimeout(400);
        tallFile = `${screen.name}-${vp.name}-${theme}-full.png`;
        await page.screenshot({ path: `${OUT}/${tallFile}` });
      }

      results.push({ file, tallFile, theme, vp: vp.name, screen: screen.name, issues });
      console.log(`${issues.length ? "ISSUES" : "ok    "} ${file}${issues.length ? "  → " + issues.join("; ") : ""}`);
      await context.close();
    }
  }
}

await browser.close();

const rows = SCREENS.filter((s) => !ONLY || s.name.startsWith(ONLY))
  .map((s) => {
    const cells = THEMES.flatMap((t) =>
      VIEWPORTS.map((v) => {
        const r = results.find((x) => x.screen === s.name && x.theme === t && x.vp === v.name);
        if (!r) return "";
        const img = r.tallFile ?? r.file;
        return `<figure><a href="${img}"><img src="${img}" loading="lazy" alt="${s.name} ${v.name} ${t}"></a><figcaption>${v.name} · ${t}${r.issues.length ? ` · <b>${r.issues.length} issue(s)</b>` : ""}</figcaption></figure>`;
      }),
    ).join("");
    return `<section><h2>${s.name}</h2><div class="row">${cells}</div></section>`;
  })
  .join("");

writeFileSync(
  `${OUT}/index.html`,
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Teman screenshots</title>
<style>body{font:14px system-ui;margin:24px;background:#f4f4f6;color:#111}h2{font-size:16px;margin:32px 0 12px}
.row{display:flex;gap:16px;overflow-x:auto;align-items:flex-start}figure{margin:0;flex:none}
img{height:420px;border-radius:8px;border:1px solid #ddd;background:#fff}figcaption{margin-top:6px;color:#666}</style>
<h1>Teman · ${new Date().toLocaleString()}</h1>${rows}`,
);
console.log(`\n${results.length} screenshots → ${OUT}/index.html`);
