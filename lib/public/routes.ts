import type { PassageRow, WorkRow } from "@/lib/types/entities";
import { citationRefToSlug } from "./citation-slug";

export function authorToSlug(author: string): string {
  return author.trim().toLowerCase().replace(/\s+/g, "-");
}

export function publicPassageHref(
  work: Pick<WorkRow, "author" | "slug">,
  passage: Pick<PassageRow, "citation_ref">,
): string {
  return `/read/${authorToSlug(work.author)}/${work.slug}/${citationRefToSlug(passage.citation_ref)}`;
}

/** Canonical public URL for Odyssey 1.1 (seed passage). */
export const ODYSSEY_1_1_HREF = "/read/homer/odyssey/1-1";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isPassageUuid(segment: string): boolean {
  return UUID_RE.test(segment);
}
