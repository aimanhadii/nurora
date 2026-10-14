# Ilmora

Your AI daily companion. Chat in English or Malay, and Ilmora keeps track of
your tasks, sends a morning brief and an evening check-in, and reminds you
when things are due. There's also a plain task list that works without AI.

Built with Next.js (App Router), TypeScript, Tailwind CSS and shadcn/ui.
Installable to the iPhone Home Screen as a PWA.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To try it on a phone on
the same Wi-Fi, open the `Network:` address that `npm run dev` prints.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint |
| `npm run screenshots` | Screenshot every screen at phone / tablet / desktop widths in both themes (needs `npm run dev` running and Google Chrome installed). Output: `screenshots/index.html` |

## Project layout

```
app/          routes (home, chat, tasks) and global styles
components/   UI: layout, home, chat, tasks, shared, ui (shadcn)
lib/          data store, time helpers, task logic, theme
docs/         design spec (tokens, type scale, layout rules)
scripts/      dev tools (screenshots)
```

See [docs/design.md](docs/design.md) for the design system.
