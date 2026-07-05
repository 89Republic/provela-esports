# Divisions Grid Redesign

Date: 2026-06-24
Branch: redesign

## Goal

Replace image-based division cards with an interactive, logo-led grid inspired by
the Team Liquid "Our Teams" layout. Divisions are identified by **monogram logo
marks** (their `icon` codes) rather than cover images, and the layout becomes
denser and more interactive while staying within Provela's existing dark theme
(`void` / `cold` / `steel` / `provela` tokens, `font-gaming`, `motion/react`).

There are two distinct treatments:

1. **`/divisions` page** — dense hairline grid (Team Liquid "Our Teams" reference)
2. **Homepage divisions scene** — logo-only tile grid (Team Liquid "Ride With The
   Cavalry" reference)

## Data

Six divisions live in `lib/constants.ts` (`DIVISIONS`):

| id | name | game | icon |
|----|------|------|------|
| ea-fc-comp-squad | EA FC Comp Squad | EA SPORTS FC | FC |
| provela-sp3 | Provela Sp3 | EA FC Clubs | SP3 |
| provela-shokunin | Provela Shokunin | Call of Duty Mobile | CODM |
| provela-e | Provela-e | eFootball | E |
| fcx | FCX | Tournament Division | FCX |
| streamers | Streamers | Content Division | LIVE |

Color identity comes from `DIVISION_VISUALS` (`tint`, `accentText`), which only
covers 4 of the 6 ids. `provela-sp3` and `streamers` fall back to a default
`provela` tint.

No per-division logo image files exist. We render the `icon` string as a styled
monogram, structured so a real logo can replace it later through the same slot.

## Components

### `DivisionMonogram` (new, `components/division-monogram.tsx`)

Shared mark used by both treatments.

- Props: `division: Division`, plus optional size / className.
- Looks up tint + accent from a helper that reads `DIVISION_VISUALS` with a
  `provela` fallback for unmapped ids.
- Renders the `icon` code in `font-gaming`, bold, uppercase, tight tracking.
- Built so an `<img>`/SVG logo can be swapped in behind the same slot later.

### `DivisionsGrid` (new, `components/divisions-grid.tsx`) — page treatment

Dense hairline grid for `/divisions`.

- Single continuous grid; cells share hairline dividers (`border-cold/10`),
  outer border, no gaps, no card shadows.
- `grid-cols-2` → `sm:grid-cols-3` → `lg:grid-cols-4`.
- Each cell is a `Link` to `/divisions/[id]` (`~h-52`):
  - monogram mark (top-left), division name + game label, hover arrow.
- Hover: soft radial gradient of the division tint fills the cell, monogram
  scales, arrow translates right, name shifts to accent color, adjacent hairlines
  brighten. `useReducedMotion` respected. Keyboard-focusable via the link.

### `DivisionsScene` rewrite (`components/scenes/divisions-scene.tsx`) — homepage

Replace the carousel internals with a logo-only tile grid.

- Two-column header: large `font-gaming` title on the left; short blurb + a
  `View all divisions →` link (accent color) on the right.
- Grid of logo-only tiles: rounded tiles with a subtle raised fill
  (`bg-cold/[0.03]`) and gaps between them — NOT the dense hairline grid.
  Centered monogram only; no names or stats.
- 6 divisions → `grid-cols-2` mobile, `lg:grid-cols-3` desktop (two rows of 3).
- Hover: tile brightens/lifts, monogram scales and shifts to division accent tint.
- Each tile links to `/divisions/[id]`. Keeps the existing ambient-tint wrapper
  feel but no longer auto-advances.

## Files

- `components/division-monogram.tsx` — new shared mark + tint helper.
- `components/divisions-grid.tsx` — new dense grid for the page.
- `components/scenes/divisions-scene.tsx` — rewrite to tile grid.
- `app/divisions/page.tsx` — swap `GridSection`/`DivisionCard` for `DivisionsGrid`.

`DivisionCard` in `components/cards.tsx` becomes unused on these surfaces; leave it
in place (it may be referenced elsewhere) unless verified dead.

## Out of scope

- Real logo image assets (monograms used now; slot designed for later swap).
- Division detail page (`/divisions/[id]`) changes.
- Admin division management.

## Success criteria

- `/divisions` shows the dense hairline monogram grid; each cell links correctly.
- Homepage divisions scene shows the logo-only tile grid with two-column header
  and a working "View all divisions" link to `/divisions`.
- Reduced-motion users get a static, fully functional layout.
- Build passes (`next build` / lint) with no type errors.
