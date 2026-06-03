import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PublicReaderShell } from "@/components/public/PublicReaderShell";
import { PublicPassageReader } from "@/components/public/PublicPassageReader";
import { getSiteOrigin } from "@/lib/config/site";
import { loadPublicPassagePage } from "@/lib/public/load-public-passage-page";
import {
  getPublicPassage,
  getPublicWorkById,
  resolvePublicPassageBySlug,
} from "@/lib/public/passages";
import { isPassageUuid, publicPassageHref } from "@/lib/public/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}): Promise<Metadata> {
  const { segments } = await params;
  if (segments.length !== 3) return {};
  const [authorSlug, workSlug, citationSlug] = segments;
  return {
    alternates: {
      canonical: `${getSiteOrigin()}/read/${authorSlug}/${workSlug}/${citationSlug}`,
    },
  };
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

/**
 * Single catch-all for /read/* — Next.js requires one dynamic segment name per path level.
 * - /read/homer/iliad/1-1  → slug passage page
 * - /read/<uuid>           → redirect to slug URL
 */
export default async function PublicReadPassagePage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;

  if (segments.length === 1 && isPassageUuid(segments[0]!)) {
    const passage = await safe(() => getPublicPassage(segments[0]!), null);
    if (!passage) notFound();
    const work = await safe(() => getPublicWorkById(passage.work_id), null);
    if (!work) notFound();
    redirect(publicPassageHref(work, passage));
  }

  if (segments.length !== 3) notFound();

  const [authorSlug, workSlug, citationSlug] = segments;
  const resolved = await safe(
    () => resolvePublicPassageBySlug(authorSlug!, workSlug!, citationSlug!),
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
