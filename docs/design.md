# Ilmora design spec

The rules every screen follows. If a component needs something not listed
here, change this file first.

Quality bar: Linear, Notion Calendar, Apple Reminders, Raycast — calm,
dense where it matters, nothing decorative without a job.

## 1. Tokens

All colours are CSS variables in `app/globals.css`. Light is the default;
`[data-theme="dark"]` swaps values, never names. Components use Tailwind
classes mapped to these tokens (`bg-card`, `text-muted-foreground`, …) and
never raw colours.

We use shadcn/ui's token names so its components theme themselves, plus a
few of our own.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--background` | `#fafaf9` | `#0a0f1c` (night navy) | page |
| `--foreground` | `#111318` | `#eef1f6` | primary text |
| `--card` | `#ffffff` | `#121829` | cards, sheets, dialogs |
| `--popover` | `#ffffff` | `#161d30` | menus, tooltips |
| `--primary` | `#111318` | `#eef1f6` | primary buttons, user bubble |
| `--primary-foreground` | `#ffffff` | `#0a0f1c` | text on primary |
| `--secondary` / `--muted` | `#f2f3f4` | `#1a2134` | chips, subtle fills, tracks |
| `--muted-foreground` | `#5b6170` | `#9aa3b5` | text-secondary (AA, also on the glow) |
| `--subtle-foreground` | `#9aa0ac` | `#6b7385` | hints, placeholders only |
| `--accent` | `#f1f2f3` | `#1c2438` | shadcn's neutral hover fill (not the brand accent) |
| `--border` / `--input` | `rgb(17 19 24 / 7%)` | `rgb(255 255 255 / 8%)` | the one hairline |
| `--brand` | `#0e8a78` | `#5eead4` | solid accent: fills, icons, checks, focus ring |
| `--brand-hover` | `#0b7465` | `#7ff0df` | hover on brand fills |
| `--brand-soft` | `#e2f6f1` | `rgb(94 234 212 / 12%)` | time chips, active nav/tab background |
| `--brand-text` | `#0b5e52` | `#99f6e4` | **all accent-coloured text** |
| `--warning-soft` / `-foreground` | `#fef3c7` / `#92400e` | amber 12% / `#fbbf24` | overdue chips |
| `--destructive` | `#dc2626` | `#f87171` | delete, in menus and confirmations only |
| `--aurora-1/2/3`, `--aurora` | `#5eead4` → `#22b8cf` → `#f0a6ca` | same, plus a faint mint glow | orb, progress fills, top glow, streak |
| `--glow-a/b/c`, `--glow-h` | mint + pink, 200px | mint + teal + pink, 250px | the aurora at the top of the page |
| `--orb-base`, `--orb-glow` | `#7dd3c8`, none | same, faint mint glow | the pearl orb |

**Colour budget:** almost monochrome. The aurora gradient appears only on
the orb, progress fills, the top glow and the streak dots. The solid accent
covers small details: time chips, active nav/tab, links, the countdown
number, checkmarks and focus rings. Success uses the accent (no green).
Overdue is amber; red is only for destructive actions.

**Contrast:** `--brand` is 4.3:1 on white, under AA for small text, so it is
used for fills, icons and rings (which need 3:1). Accent-coloured *text*
always uses `--brand-text` (7.7:1 on white, ~7:1 on `--brand-soft`). Text
never sits on the strongest part of the aurora gradient.

## 2. Type

Three families, all self-hosted via `next/font`:

- **Fraunces** (`font-display`): weight 400 only, SOFT 50, optical sizing
  on (opsz follows size), -0.015em, never italic. Used sparingly for: the
  greeting / page titles, the Next up task title, the affirmation,
  empty-state and chat-welcome headings, dialog titles, and the lowercase
  **ilmora** wordmark.
- **Geist Sans**: everything else — navigation, buttons, labels, rows,
  chips, inputs, chat bubbles, metadata.
- **Geist Mono** with `tabular-nums`: small time chips only ("4:00 pm").
  Other numbers (countdown, ring centre) use Geist with tabular numbers.

| Class | Size / line | Use |
|---|---|---|
| `text-xs` | 12 / 16 | badges, chip labels, timestamps |
| `text-meta` | 13 / 20 | section labels (400, secondary), metadata, countdown line |
| `text-sm` | 14 / 21 | body UI, list rows, buttons |
| `text-base` | 16 / 24 | chat, inputs (16px stops iOS zoom), "3 to go" (500), affirmation on phones |
| `text-note` | 17 / 26 | affirmation on desktop |
| `text-lg` | 18 / 27 | wordmark, progress ring centre (500) |
| `text-xl` | 20 / 28 | Next up title, empty-state headings, dialog titles |
| `text-3xl` | 26 / 31 | greeting / page titles (phones) |
| `text-4xl` | 32 / 38 | greeting / page titles (desktop) |

Weights: 400 for body and all serif text. 500 only for buttons, active nav
and small emphasis. 600 only for tiny badge counts. 8–12px between a label
and its content.

## 3. Spacing, radius, elevation

- 4px grid: 4, 8, 12, 16, 20, 24, 32, 40, 48 (`1 2 3 4 5 6 8 10 12`). Nothing else.
- Radius: 8 small controls (`rounded-md`), 12 inputs + list items (`rounded-lg`),
  16 cards / sheets / dialogs (`rounded-xl`), full for pills and avatars.
- One hairline: `1px solid var(--border)`.
- Two shadows only: `shadow-sm` = card (soft), `shadow-lg` = popovers,
  menus, dialogs. Dark theme cards have no shadow (border only).
- Nesting: page > card. Rows inside a card are not cards (no border/shadow;
  hover fill only).

## 4. Layout grid

| | Mobile < 768 | Tablet 768–1279 | Desktop ≥ 1280 |
|---|---|---|---|
| Nav | bottom tab bar (Home / Chat / Tasks) | icon sidebar 64px, expandable | sidebar 248px |
| Page padding | 16px | 24px | 32px |
| Content width | full | full | max 1120px, centred |
| Home grid | 1 col, gap 16 | 2 cols, gap 16 | 3 cols, gap 20 |
| Card padding | 20 | 20 | 24 |
| Chat column | full | max 720 | max 720 |

Mobile: `100dvh`, safe-area insets on all edges, 44px minimum tap targets,
composer stays above the iOS keyboard (visualViewport sync).

## 5. Components (all from shadcn/ui, restyled via tokens)

Button, Card, Input, Textarea, Dialog, Sheet, DropdownMenu, ContextMenu,
Checkbox, Tabs, Tooltip, Avatar, Badge, Progress, Skeleton, ScrollArea,
Sonner (toasts).

Rules:
- **Buttons:** `default` = primary (near-black / white). `outline` and `ghost`
  for secondary. `destructive` text-only inside menus. Heights 32 (sm),
  36 (default), 44 on touch targets (`size="lg"` / `icon-lg`).
- **States:** every interactive element has hover (accent fill or
  opacity), active (`scale-[0.98]` or darker fill), focus-visible
  (3px teal ring at 40%), disabled (50% opacity, no pointer).
- **Icons:** lucide, 1.5 stroke; 16px in controls, 20px in navigation.
- **Card header:** 13px/400 muted label left, optional ghost action right,
  16px gap to content.
- **Chips / badges:** `rounded-full`, 12px. Time chips: mono, accent-soft + accent-text. Overdue: amber.
- **Lists:** rows 12px radius, 44px min height, hover fill, divider-free
  (spacing separates rows).
- **Empty states:** muted icon in a 40px well, one short line, one action.
- **Loading:** Skeletons shaped like the final content; never a spinner.
- **Motion:** 150–250ms ease-out for UI, 300ms+ only for sheets.
  Respect `prefers-reduced-motion` everywhere.

## 6. Screens

- **Home:** greeting (Fraunces 32/400), date + summary line, then bento grid:
  Next up (2 cols) · Progress ring + streak · Affirmation · Today list
  (2 cols, 2 rows) · This week · Ask Ilmora (full width on desktop).
- **Chat:** single 720px column for header, messages and composer.
  Messages grouped by sender (8px inside a group, 20px between groups;
  avatar + time once per group). Composer is in normal flow under the
  scroll area, so it never covers messages.
- **Tasks:** segmented tabs Today / Upcoming / Done with counts; rows with
  checkbox, title, 1-line notes, mono time chip, overflow menu. Upcoming
  and Done grouped by day with sticky headers. Add/Edit = Sheet on mobile,
  Dialog on desktop.
