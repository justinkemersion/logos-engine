/** Convert a passage citation_ref to a URL-safe slug segment. */
export function citationRefToSlug(citationRef: string): string {
  return citationRef.trim().toLowerCase().replace(/\./g, "-");
}

/** True when slug matches the citation_ref after normalization. */
export function citationSlugMatchesRef(slug: string, citationRef: string): boolean {
  return citationRefToSlug(citationRef) === slug.trim().toLowerCase();
}
