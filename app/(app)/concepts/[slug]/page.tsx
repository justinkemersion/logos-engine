import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getConcept, listMentionsByConcept } from "@/lib/flux/concepts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const sub = session!.user!.id;

  let concept: Awaited<ReturnType<typeof getConcept>> = null;
  let mentions: Awaited<ReturnType<typeof listMentionsByConcept>> = [];
  try {
    concept = await getConcept(sub, slug);
    if (concept) {
      mentions = await listMentionsByConcept(sub, concept.id);
    }
  } catch {
    /* Flux may be unavailable during local UI dev */
  }

  if (!concept) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-2 text-xs text-[var(--muted-fg)]">
        <Link href="/concepts" className="hover:underline">Concepts</Link>
        {" › "}
        {concept.label}
      </div>
      <PageHeader title={concept.label} />

      {concept.greek_term ? (
        <p className="mb-4 text-3xl" style={{ fontFamily: "var(--font-serif)" }}>
          {concept.greek_term}
        </p>
      ) : null}

      {concept.description ? (
        <Card className="mb-8">
          <p className="text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-line">
            {concept.description}
          </p>
        </Card>
      ) : null}

      {mentions.length > 0 ? (
        <>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
            Mentions in corpus
          </h2>
          <div className="space-y-2">
            {mentions.map((mention) => (
              <div key={mention.id}>
                {mention.passage_id ? (
                  <Link href={`/passages/${mention.passage_id}`}>
                    <Card className="transition hover:shadow-md">
                      <p className="text-sm">{mention.note ?? "Passage reference"}</p>
                    </Card>
                  </Link>
                ) : (
                  <Card>
                    <p className="text-sm text-[var(--muted-fg)]">{mention.note}</p>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState title="No mentions found in corpus" />
      )}
    </div>
  );
}
