import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { parse as parseYaml } from "yaml";
import {
  corpusDefaultsSchema,
  expandSectionManifest,
  sectionManifestSchema,
  type CorpusDefaults,
  type ResolvedManifestEntry,
  type SectionManifest,
} from "./manifest";

export const CORPUS_ROOT = join(process.cwd(), "corpus");
export const DEFAULT_DEFAULTS_PATH = join(CORPUS_ROOT, "defaults.yaml");
const DEFAULTS_FILENAME = "defaults.yaml";
const SECTION_MANIFEST_FILENAME = "manifest.yaml";

export function loadCorpusDefaults(
  defaultsPath = DEFAULT_DEFAULTS_PATH,
): CorpusDefaults {
  const raw = readFileSync(defaultsPath, "utf8");
  return corpusDefaultsSchema.parse(parseYaml(raw));
}

export function loadSectionManifest(manifestPath: string): SectionManifest {
  const raw = readFileSync(manifestPath, "utf8");
  return sectionManifestSchema.parse(parseYaml(raw));
}

function discoverSectionManifestPaths(
  dir: string,
  root = CORPUS_ROOT,
): string[] {
  const paths: string[] = [];

  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    if (!statSync(fullPath).isDirectory()) {
      continue;
    }
    paths.push(...discoverSectionManifestPaths(fullPath, root));
  }

  const manifestPath = join(dir, SECTION_MANIFEST_FILENAME);
  if (existsSync(manifestPath)) {
    paths.push(manifestPath);
  }

  return paths;
}

export function discoverSectionManifestPathsUnder(
  corpusRoot = CORPUS_ROOT,
): string[] {
  if (!existsSync(corpusRoot)) {
    return [];
  }

  return discoverSectionManifestPaths(corpusRoot, corpusRoot).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function loadAllCorpusEntries(
  corpusRoot = CORPUS_ROOT,
): ResolvedManifestEntry[] {
  const defaults = loadCorpusDefaults(join(corpusRoot, DEFAULTS_FILENAME));
  const manifestPaths = discoverSectionManifestPathsUnder(corpusRoot);
  const entries: ResolvedManifestEntry[] = [];

  for (const manifestPath of manifestPaths) {
    const section = loadSectionManifest(manifestPath);
    const manifestSource = relative(process.cwd(), manifestPath);
    entries.push(
      ...expandSectionManifest(defaults, section, manifestSource),
    );
  }

  return entries;
}

export type ManifestFilter = {
  all?: boolean;
  authorSlug?: string;
  workSlug?: string;
  citation?: string;
  sectionSlug?: string;
};

export function filterManifestEntries(
  entries: ResolvedManifestEntry[],
  filter: ManifestFilter,
): ResolvedManifestEntry[] {
  let result = entries;

  if (filter.authorSlug) {
    result = result.filter((e) => e.author_slug === filter.authorSlug);
  }

  if (filter.workSlug) {
    result = result.filter((e) => e.work_slug === filter.workSlug);
  }

  if (filter.sectionSlug) {
    result = result.filter((e) => e.section_slug === filter.sectionSlug);
  }

  if (filter.citation) {
    result = result.filter((e) => e.citation === filter.citation);
  }

  return result;
}

/** @deprecated Use loadAllCorpusEntries instead. */
export function loadCorpusManifest(): never {
  throw new Error(
    "loadCorpusManifest() is removed. Use loadAllCorpusEntries() with section manifests under corpus/{author}/{work}/{section}/.",
  );
}
