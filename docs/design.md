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
| `--background` | `#fafafc` | `#09090b` | page |
| `--foreground` | `#0b0b0f` | `#fafafa` | primary text |
| `--card` | `#ffffff` | `#131217` | cards, sheets, dialogs |
| `--popover` | `#ffffff` | `#18161d` | menus, tooltips |
| `--primary` | `#0b0b0f` | `#fafafa` | primary buttons, user bubble |
| `--primary-foreground` | `#ffffff` | `#09090b` | text on primary |
| `--secondary` / `--muted` | `#f4f4f6` | `#1c1a22` | chips, subtle fills, tracks |
| `--muted-foreground` | `#6b7280` | `#a1a1aa` | secondary text (AA on bg) |
| `--subtle-foreground` | `#8b8f98` | `#7c7c86` | hints, placeholders (large/aux only) |
| `--accent` | `#f1f0f5` | `#201e27` | hover fill on neutral controls |
| `--border` / `--input` | `rgb(0 0 0 / 7%)` | `rgb(255 255 255 / 8%)` | the one hairline |
| `--ring` | `#7c3aed` | `#a78bfa` | focus ring |
| `--brand` | `#7c3aed` | `#a78bfa` | active nav, checks, progress, links |
| `--brand-foreground` | `#ffffff` | `#09090b` | icon/text on brand fill |
| `--brand-soft` | violet 10% | violet 14% | active nav pill, icon wells |
| `--destructive` | `#dc2626` | `#f87171` | delete |
| `--danger-soft` / `--danger-soft-foreground` | `#fee2e2` / `#b91c1c` | red 14% / `#fca5a5` | overdue chips |
| `--glow-1/2/3` | lavender / lilac / pink-violet | deep purples | page background glow |
| `--orb-1/2/3`, `--orb-glow` | violet / magenta / lavender | same, brighter glow | Ilmora's orb |

Colour budget: neutrals for ~90% of pixels. Violet only for primary, active,
selected, progress and focus. One red, only for destructive and overdue.

## 2. Type

Three families, all self-hosted via `next/font`:

- **Fraunces** (`font-display`): a warm display serif, SOFT axis 80,
  optical sizing on, -0.02em. Used sparingly, only for: page greeting /
  titles, the Next up task title, the affirmation (italic), empty-state
  and chat-welcome headings, and the lowercase **ilmora** wordmark.
- **Geist Sans**: everything else — navigation, buttons, labels, rows,
  chips, inputs, chat bubbles, metadata.
- **Geist Mono** with `tabular-nums`: times, counts and countdowns.

| Class | Size / line | Use |
|---|---|---|
| `text-xs` | 12 / 16 | badges, chip labels, timestamps |
| `text-meta` | 13 / 20 | muted card labels (500), descriptions, notes, metadata |
| `text-sm` | 14 / 21 | body UI, list rows, buttons |
| `text-base` | 16 / 24 | chat messages, inputs (16px stops iOS zoom) |
| `text-xl` | 20 / 28 | wordmark, affirmation (mobile) |
| `text-2xl` | 24 / 32 | Next up title, affirmation (desktop) |
| `text-3xl` | 30 / 36 | page greeting / titles (mobile) |
| `text-4xl` | 40 / 48 | page greeting / titles (desktop) |

Weights: 400 body, 500 labels, controls and serif display, 600 sans headings
and the wordmark. No other weights. Headings use -0.02em tracking.

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
  (3px violet ring at 40%), disabled (50% opacity, no pointer).
- **Icons:** lucide, 1.5 stroke; 16px in controls, 20px in navigation.
- **Card header:** 13px/500 muted label left, optional ghost action right,
  16px gap to content.
- **Chips / badges:** `rounded-full`, 12px, mono font for times.
- **Lists:** rows 12px radius, 44px min height, hover fill, divider-free
  (spacing separates rows).
- **Empty states:** muted icon in a 40px well, one short line, one action.
- **Loading:** Skeletons shaped like the final content; never a spinner.
- **Motion:** 150–250ms ease-out for UI, 300ms+ only for sheets.
  Respect `prefers-reduced-motion` everywhere.

## 6. Screens

- **Home:** greeting (32/600), date + summary line, then bento grid:
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
