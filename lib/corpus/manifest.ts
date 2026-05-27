import { z } from "zod";

/** Global defaults — corpus/defaults.yaml */
export const corpusDefaultsSchema = z.object({
  prompt_version: z.string().min(1),
  generation_profile: z.string().min(1),
  agent_profile: z.string().min(1),
});

export type CorpusDefaults = z.infer<typeof corpusDefaultsSchema>;

/** Passage row within a section manifest. */
const citationSchema = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .pipe(z.string().min(1));

export const sectionPassageSchema = z.object({
  citation: citationSchema,
  sequence: z.number().int().positive(),
  greek: z.string().min(1),
  generation_profile: z.string().optional(),
  agent_profile: z.string().optional(),
});

/** Section manifest — corpus/{author}/{work}/{section}/manifest.yaml */
export const sectionManifestSchema = z.object({
  author: z.string().min(1),
  author_slug: z.string().min(1),
  work: z.string().min(1),
  work_slug: z.string().min(1),
  section_slug: z.string().min(1),
  section_title: z.string().optional(),
  book: z.number().int().positive().optional(),
  passages: z.array(sectionPassageSchema).min(1),
});

export type SectionPassage = z.infer<typeof sectionPassageSchema>;
export type SectionManifest = z.infer<typeof sectionManifestSchema>;

/** Expanded passage ready for agent/render pipelines. */
export type CorpusManifestEntry = SectionPassage & {
  author: string;
  author_slug: string;
  work: string;
  work_slug: string;
  section_slug: string;
  section_title?: string;
  book?: number;
};

/** Resolved defaults merged onto a manifest entry. */
export type ResolvedManifestEntry = CorpusManifestEntry & {
  generation_profile: string;
  agent_profile: string;
  prompt_version: string;
  /** Relative path from repo root, e.g. corpus/homer/odyssey/book-1/manifest.yaml */
  manifest_source: string;
};

export function expandSectionManifest(
  defaults: CorpusDefaults,
  section: SectionManifest,
  manifestSource: string,
): ResolvedManifestEntry[] {
  return section.passages.map((passage) => ({
    author: section.author,
    author_slug: section.author_slug,
    work: section.work,
    work_slug: section.work_slug,
    section_slug: section.section_slug,
    section_title: section.section_title,
    book: section.book,
    citation: passage.citation,
    sequence: passage.sequence,
    greek: passage.greek,
    prompt_version: defaults.prompt_version,
    generation_profile:
      passage.generation_profile ?? defaults.generation_profile,
    agent_profile: passage.agent_profile ?? defaults.agent_profile,
    manifest_source: manifestSource,
  }));
}

export function manifestEntryToPassageInput(
  entry: ResolvedManifestEntry,
): { workTitle: string; citation: string; greekText: string; author: string } {
  return {
    workTitle: entry.work,
    citation: entry.citation,
    greekText: entry.greek,
    author: entry.author,
  };
}

/** @deprecated Legacy single-file manifest shape — kept for tests only. */
export const corpusManifestEntrySchema = z.object({
  author: z.string().min(1),
  author_slug: z.string().min(1),
  work: z.string().min(1),
  work_slug: z.string().min(1),
  section_slug: z.string().min(1),
  section_title: z.string().optional(),
  citation: z.string().min(1),
  sequence: z.number().int().positive(),
  greek: z.string().min(1),
  book: z.number().int().positive().optional(),
  generation_profile: z.string().optional(),
  agent_profile: z.string().optional(),
});

/** @deprecated Legacy single-file manifest — use section manifests instead. */
export const corpusManifestSchema = z.object({
  prompt_version: z.string().min(1),
  generation_profile: z.string().min(1),
  agent_profile: z.string().min(1),
  passages: z.array(corpusManifestEntrySchema).min(1),
});

export type CorpusManifest = z.infer<typeof corpusManifestSchema>;

/** @deprecated Use expandSectionManifest instead. */
export function resolveManifestEntry(
  manifest: CorpusManifest,
  entry: z.infer<typeof corpusManifestEntrySchema>,
): ResolvedManifestEntry {
  return {
    ...entry,
    prompt_version: manifest.prompt_version,
    generation_profile: entry.generation_profile ?? manifest.generation_profile,
    agent_profile: entry.agent_profile ?? manifest.agent_profile,
    manifest_source: "corpus/manifest.yaml",
  };
}
