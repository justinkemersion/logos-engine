import { auth } from "@/auth";
import { listFragments } from "@/lib/flux/commentary";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";

export default async function FragmentsPage() {
  const session = await auth();
  const sub = session!.user!.id;

  let fragments: Awaited<ReturnType<typeof listFragments>> = [];
  try {
    fragments = await listFragments(sub);
  } catch {
    /* Flux may be unavailable during local UI dev */
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <PageHeader
        title="Fragments"
        description="Short, potent passages from the ancient world — offered as standalone thoughts."
      />
      {fragments.length === 0 ? (
        <EmptyState
          title="No fragments found"
          hint="Push migrations and seed data, then run pnpm flux:schema:sync."
        />
      ) : (
        <div className="space-y-6">
          {fragments.map((fragment) => (
            <Card key={fragment.id} className="prose-none">
              <pre
                className="text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-wrap font-sans"
              >
                {fragment.body}
              </pre>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
