# UI contract

## Philosophy

Scholarly, quiet, editorial. The interface is a reading desk, not a product dashboard.

- Source-first: Greek text is large, prominent, and never hidden behind a toggle
- Literal-first: the literal layer is the default tab, not the readable
- Hover/click assistance: token details appear on interaction, not by default
- No chatbot-first interface: the AI layer is a labeled draft tool, not a conversational UI
- No hype: no AI sparkle, no "revolutionary" copy, no gamification

## Layout

Three columns following the UI reference image (`a_widescreen_ui_web_app_mockup_screenshot_dark_an.png`):

```
┌─────────────┬──────────────────────────────┬──────────────┐
│  Library    │  Reading Desk                │  Right Panel │
│  (nav rail) │  (central workspace)         │  (context)   │
│  220px      │  flex-1                      │  280px       │
└─────────────┴──────────────────────────────┴──────────────┘
```

### Left rail (LibraryNav)

- Dark navy background (`--rail-bg`)
- App name + tagline at top
- Hierarchical library tree: Author → Work → Section
- Bottom links: Timelines, Concept Map, Fragments
- Active link highlighted with `--rail-active`

### Central workspace (ReadingDesk)

- Breadcrumb at top
- Passage title + citation reference
- Tab bar: GREEK | LITERAL | READABLE | COMMENTARY
- Token display: Greek word large, literal gloss small below
- Selected token → inline inspector below the token row
- Bottom panel tabs: GRAMMAR | NOTES | VARIANTS

### Right panel

Cards (vertically stacked):

1. Readable English
2. Philosophical Notes
3. Cross References
4. Authenticity & Transmission
5. Related Concepts

Right panel is hidden below `xl` breakpoint.

## Primary screen layout detail

```
Left:
  LOGOS ENGINE
  Read the Greek World from the Source.

  LIBRARY
  ▼ Plato
    ▼ Republic
        Book I (active)
        Book II
        ...
    Symposium
    Phaedo
    Apology
  ▼ Homer
    Iliad
    Odyssey
  Sophocles  (placeholder)
  Aristotle  (placeholder)

  ─────────
  Timelines
  Concept Map
  Fragments

Center:
  Plato > Republic > Book I
  Republic I.338c5–339a2            [View in Greek ▶]

  [GREEK] [LITERAL ●] [READABLE] [COMMENTARY]

  338c5  ὅτι  μέν  οὖν  δημόσιον  ἐστίν ...
         that  then  public  is ...

  [selected token inspector: inline]

  ─────────────────────────────────
  [GRAMMAR] [NOTES] [VARIANTS]
  ...

Right:
  READABLE ENGLISH
  [paragraph text]

  PHILOSOPHICAL NOTES
  [note body]

  CROSS REFERENCES (n)
  [link list]

  AUTHENTICITY & TRANSMISSION
  [status badge + signal list]

  RELATED CONCEPTS
  [tag chips]
```

## Token display

Each token renders as a small vertical unit:

```
  πολύτροπον
  many-turned
```

Greek at ~1.125rem, serif. Gloss at ~0.7rem, muted. Clickable — click reveals inline
inspector below the row.

## Color and typography

- Background: `--background` (stone/off-white)
- Left rail: `--rail-bg` (deep navy)
- Cards: `--surface` (white)
- Borders: `--border` (soft stone)
- Accent: `--accent` (muted scholarly blue)
- Greek text: system serif stack (`ui-serif, Georgia, serif`)
- UI chrome: system sans (`ui-sans-serif, system-ui, sans-serif`)

## Avoid

- Neon, glows, gradients
- Gamification or progress meters
- Generic AI sparkle UI
- "Revolutionary AI" or "Powered by AI" badges
- Chatbot panels at primary prominence
- Readable English as the default view
