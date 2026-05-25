import { auth } from "@/auth";
import { listConcepts } from "@/lib/flux/concepts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

export default async function ConceptsPage() {
  const session = await auth();
  const sub = session!.user!.id;

  let concepts: Awaited<ReturnType<typeof listConcepts>> = [];
  try {
    concepts = await listConcepts(sub);
  } catch {
    /* Flux may be unavailable during local UI dev */
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <PageHeader
        title="Concepts"
        description="Semantic threads that run across works, authors, and traditions."
      />
      {concepts.length === 0 ? (
        <EmptyState
          title="No concepts found"
          hint="Push migrations and seed data, then run pnpm flux:schema:sync."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {concepts.map((concept) => (
            <Link key={concept.id} href={`/concepts/${concept.slug}`}>
              <Card className="transition hover:shadow-md">
                {concept.greek_term ? (
                  <p
                    className="text-lg mb-1"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {concept.greek_term}
                  </p>
                ) : null}
                <p className="text-sm font-medium">{concept.label}</p>
                {concept.description ? (
                  <p className="mt-2 text-xs text-[var(--muted-fg)] leading-relaxed line-clamp-3">
                    {concept.description}
                  </p>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
