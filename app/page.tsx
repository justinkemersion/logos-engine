import Link from "next/link";
import { ODYSSEY_1_1_HREF } from "@/lib/public/routes";

const btnPrimary =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90";
const btnSecondary =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--muted)]";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
          Logos Engine
        </p>
        <h1
          className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Read Homer and Plato
          <br />
          from the Greek outward.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-[var(--muted-fg)] leading-relaxed">
          A classical reading room for the Greek source — with literal meaning, readable English,
          and the interpretive choices between them made visible.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/read" className={btnPrimary}>
            Start Reading
          </Link>
          <Link href={ODYSSEY_1_1_HREF} className={btnSecondary}>
            Explore Odyssey 1.1
          </Link>
          <Link href="/login?callbackUrl=/workspace" className={btnSecondary}>
            Create My Reading Layer
          </Link>
        </div>
      </section>

      <section className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="mb-10 text-center text-sm text-[var(--muted-fg)] leading-relaxed">
            Begin with the source. Move gently through layers of meaning.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <FeatureBlock
              label="Original-first"
              body="The Greek text is always visible. No toggle required. The source is the surface."
            />
            <FeatureBlock
              label="Literal and readable layers"
              body="Literal and readable English sit beside the Greek — assistance, not authority."
            />
            <FeatureBlock
              label="Translation tradeoffs"
              body="Every variant says what it gains and what it loses. Interpretive choices stay traceable."
            />
            <FeatureBlock
              label="Public reader + private workspace"
              body="Read without login. Sign in to build a private interpretive layer that never alters the public edition."
            />
            <FeatureBlock
              label="Concept trails"
              body="Semantic threads link passages across Homer, Plato, and the wider Greek world."
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] px-6 py-8 text-center text-xs text-[var(--muted-fg)] leading-relaxed">
        <p>
          Logos Engine keeps the Greek visible, the literal layer intact, and every smoother
          English choice traceable back to tokens, lemmas, notes, and translation rules.
        </p>
        <p className="mt-2">Built on Flux — contract-driven, migration-first.</p>
      </footer>
    </main>
  );
}

function FeatureBlock({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-none">
      <h3
        className="mb-2 text-base font-semibold text-[var(--foreground)]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {label}
      </h3>
      <p className="text-sm text-[var(--muted-fg)] leading-relaxed">{body}</p>
    </div>
  );
}
