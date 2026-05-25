import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getConcept, listMentionsByConcept } from "@/lib/flux/concepts";
import { getPassage } from "@/lib/flux/passages";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConceptTrail } from "@/components/concepts/ConceptTrail";
import type { ConceptMentionRow, PassageRow } from "@/lib/types/entities";
import Link from "next/link";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const sub = session!.user!.id;

  const concept = await safe(() => getConcept(sub, slug), null);
  if (!concept) notFound();

  const mentions: ConceptMentionRow[] = await safe(
    () => listMentionsByConcept(sub, concept.id),
    [],
  );

  const passageIds = [...new Set(mentions.map((m) => m.passage_id).filter(Boolean))] as string[];
  const passages: PassageRow[] = (
    await Promise.all(passageIds.map((pid) => safe(() => getPassage(sub, pid), null)))
  ).filter(Boolean) as PassageRow[];

  const passageMap: Record<string, PassageRow> = {};
  for (const p of passages) {
    passageMap[p.id] = p;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-2 text-xs text-[var(--muted-fg)]">
        <Link href="/concepts" className="hover:underline">Concepts</Link>
        {" › "}
        {concept.label}
      </div>

      {/* Title block */}
      <div className="mb-8">
        {concept.greek_term ? (
          <p
            className="mb-1 text-4xl font-semibold"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {concept.greek_term}
          </p>
        ) : null}
        <PageHeader title={concept.label} />
      </div>

      {/* Semantic trail */}
      {concept.description ? (
        <Card className="mb-8">
          <ConceptTrail concept={concept} />
        </Card>
      ) : null}

      {/* Mentions in corpus */}
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
        Mentions in corpus
      </h2>

      {mentions.length === 0 ? (
        <EmptyState title="No mentions in corpus" />
      ) : (
        <div className="space-y-3">
          {mentions.map((mention) => {
            const passage = mention.passage_id ? passageMap[mention.passage_id] : null;
            return (
              <div key={mention.id}>
                {passage ? (
                  <Link href={`/passages/${passage.id}`}>
                    <Card className="transition hover:shadow-md">
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs text-[var(--muted-fg)] mt-0.5 shrink-0">
                          {passage.citation_ref}
                        </span>
                        <div>
                          <p
                            className="text-base leading-snug"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            {passage.greek_text}
                          </p>
                          {mention.note ? (
                            <p className="mt-1.5 text-xs text-[var(--muted-fg)] leading-relaxed">
                              {mention.note}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ) : (
                  <Card>
                    <p className="text-sm text-[var(--muted-fg)]">
                      {mention.note ?? "Passage reference"}
                    </p>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
