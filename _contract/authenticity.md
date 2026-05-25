# Authenticity contract

## Purpose

Logos Engine surfaces the transmission history and authorship confidence of every work
it presents. Authenticity is first-class data, not a footnote.

## Status labels

| Status | Meaning |
|--------|---------|
| `secure` | Authorship and text well-established; minimal dispute |
| `generally_accepted` | Broad scholarly consensus; minor disputes acknowledged |
| `disputed` | Real scholarly disagreement; competing positions exist |
| `doubtful` | Significant reasons to doubt traditional attribution |
| `spurious` | Scholarly consensus that the work is misattributed |
| `oral_tradition` | Oral-formulaic origin; single-author attribution is anachronistic |
| `composite_tradition` | Editorial accretion across time; multiple hands likely |

## Authenticity signals

Evidence types that appear in `authenticity_profiles.signals` (jsonb):

| Signal | Description |
|--------|-------------|
| `ancient_attribution` | Attribution by ancient sources (Diogenes Laertius, Diodorus, etc.) |
| `manuscript_tradition` | Quality and breadth of manuscript preservation |
| `stylometry` | Statistical analysis of vocabulary and style |
| `vocabulary` | Presence of terms anachronistic or atypical to the attributed author |
| `doctrinal_fit` | Consistency with the author's known philosophical or poetic positions |
| `tone_anomaly` | Tone that differs from the author's established register |
| `oral_formulaic_structure` | Presence of oral-formulaic patterns (rings, epithets, formulas) |
| `later_editorial_suspicion` | Ancient or modern suspicion of later editorial addition |

## Critical rule

> Tone difference is an interpretive signal, not proof of authorship difference.

This applies to:

- The Iliad vs. Odyssey (different tonal register; same oral tradition question)
- The Symposium vs. the Republic (different register; both Platonic)
- The Republic's noble lie and myth of metals (interpretive pressure, not forgery evidence)

## Comparative cases

**Homer (Iliad / Odyssey):** Both attributed to Homer by ancient tradition. The poems show
oral-formulaic structure throughout. "Homer" may be a tradition, a name, or a figure. The
tonal difference between the Iliad's martial rage and the Odyssey's wandering cunning is a
feature of the poems' different subjects, not evidence of different authorship.

**Plato (Symposium):** Stylistically unusual; Socrates is presented through Alcibiades'
testimony at a remove. The register is literary and dramatic rather than dialectical. These
features have led some to question it, but the dominant scholarly view is authentic Plato.
The tone is Plato writing in a different mode.

**Plato (Republic — noble lie / myth of metals):** The Republic's "noble lie" and myth of
metals have generated interpretive controversy about Plato's sincerity. This is an
interpretive pressure — scholars reading the text against itself — not an authenticity
problem. The text is well-attested.

**Cervantes (Don Quixote):** A contrast case. Authorship is historically documented,
publication history is clear (1605 / 1615), and the fictional author "Cide Hamete Benengeli"
is an explicit device. Attribution is not in question. Logos Engine should not treat all
fictional narrators as authenticity signals.

## Display rule

Authenticity cards always show:

1. Status label
2. Confidence label (human-readable summary)
3. Signal checklist from `signals` jsonb
4. Overall summary

Do not present any status as certainty. Even `secure` texts have transmission history.
