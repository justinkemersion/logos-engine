import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
          Logos Engine
        </p>
        <h1
          className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Read the Greek world
          <br />
          from the source.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-[var(--muted-fg)] leading-relaxed">
          AI-assisted translations of Homer and Plato, grounded in the original language,
          governed by visible rules, and linked across concepts, myths, and philosophical
          traditions.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/passages/00000000-0000-0000-0002-000000000001"
            className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90"
          >
            Explore Odyssey 1.1
          </Link>
          <Link
            href="/concepts"
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--muted)]"
          >
            View Translation Rules
          </Link>
        </div>
      </section>

      {/* Feature sections */}
      <section className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-2">
            <FeatureBlock
              label="Original-first"
              body="The Greek text is always visible. No toggle required. The source is the surface."
            />
            <FeatureBlock
              label="Layered translation"
              body="Greek → literal → readable → philosophical. Each layer is labeled, separate, and subordinate to the one before it."
            />
            <FeatureBlock
              label="Rules, not vibes"
              body="Every translation choice is governed by visible rules. Logos Engine keeps the editorial contract public."
            />
            <FeatureBlock
              label="Traceable choices"
              body="Every variant says what it gains and what it loses. πολύτροπον is not simply 'cunning.' That choice costs something."
            />
            <FeatureBlock
              label="Trust-aware reading"
              body="Authenticity and transmission history are first-class data. Homer is oral tradition. The Republic is generally accepted. These are different things."
            />
            <FeatureBlock
              label="Built on Flux"
              body="Contract-driven, migration-first, no shims. The substrate is visible because visibility is the principle."
            />
          </div>
        </div>
      </section>

      {/* Footer note */}
      <footer className="border-t border-[var(--border)] px-6 py-8 text-center text-xs text-[var(--muted-fg)]">
        Logos Engine keeps the Greek visible, the literal layer intact, and every smoother
        English choice traceable back to tokens, lemmas, notes, and translation rules.
      </footer>
    </main>
  );
}

function FeatureBlock({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{label}</h3>
      <p className="text-sm text-[var(--muted-fg)] leading-relaxed">{body}</p>
    </div>
  );
}
