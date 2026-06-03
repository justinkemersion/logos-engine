import { notFound } from "next/navigation";
import { PublicReaderShell } from "@/components/public/PublicReaderShell";
import { PublicPassageReader } from "@/components/public/PublicPassageReader";
import { loadPublicPassagePage } from "@/lib/public/load-public-passage-page";
import { resolvePublicPassageBySlug } from "@/lib/public/passages";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function PublicSlugPassagePage({
  params,
}: {
  params: Promise<{ authorSlug: string; workSlug: string; citationSlug: string }>;
}) {
  const { authorSlug, workSlug, citationSlug } = await params;
  const resolved = await safe(
    () => resolvePublicPassageBySlug(authorSlug, workSlug, citationSlug),
    null,
  );
  if (!resolved) notFound();

  const data = await loadPublicPassagePage(resolved.passage, resolved.work);

  const breadcrumb = (
    <span>
      {data.work.author} › {data.work.title} › {data.passage.citation_ref}
    </span>
  );

  return (
    <PublicReaderShell breadcrumb={breadcrumb}>
      <PublicPassageReader
        work={data.work}
        passage={data.passage}
        siblings={data.siblings}
        tokens={data.tokens}
        translationLayers={data.translationLayers}
        translationVariants={data.translationVariants}
        commentaryNotes={data.commentaryNotes}
        concepts={data.concepts}
        authenticity={data.authenticity}
      />
    </PublicReaderShell>
  );
}
