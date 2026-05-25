# Design contract

## Tone

Scholarly, quiet, editorial. Trustworthy rather than trendy. A reading desk, not a dashboard.

## Avoid

- Excessive gradients, glows, or animation
- Startup hype aesthetics
- Generic AI sparkle UI
- "Powered by AI" badges at primary prominence
- Gamification or progress indicators
- One-off spacing/typography per page

## Design tokens (CSS variables in `app/globals.css`)

| Variable | Value | Use |
|----------|-------|-----|
| `--background` | `#f5f4f0` | Stone/off-white page surface |
| `--foreground` | `#1c1c1e` | Primary text |
| `--surface` | `#ffffff` | Card backgrounds |
| `--muted` | `#e8e6e1` | Muted backgrounds |
| `--muted-fg` | `#6b6b6b` | Muted text (glosses, secondary labels) |
| `--border` | `#d6d3cc` | Soft stone borders |
| `--accent` | `#2e5fa3` | Muted scholarly blue |
| `--accent-fg` | `#ffffff` | Text on accent |
| `--rail-bg` | `#0e1a2d` | Dark navy left rail |
| `--rail-fg` | `#c9d3e0` | Rail text |
| `--rail-active` | `#1a3a6b` | Active rail link |

## Typography

- Greek text: `ui-serif, Georgia, "Times New Roman", serif` — large (1.125–1.25rem)
- Literal glosses: `--muted-fg`, 0.7rem, sans-serif
- Page titles and passage titles: serif
- UI chrome (nav, labels, tabs): `ui-sans-serif, system-ui, sans-serif`

## Components

All interactive UI uses primitives from `components/ui/`. Shell uses `components/shell/`.

## Status labels

- `secure`, `generally_accepted`: green/teal accent
- `disputed`, `doubtful`: amber
- `spurious`: muted
- `oral_tradition`, `composite_tradition`: blue-grey

## Authenticity confidence

Use shield or checkmark icon for `secure` / `generally_accepted`. Use neutral icon for
oral tradition. No alarm icons — transmission complexity is interesting, not alarming.
