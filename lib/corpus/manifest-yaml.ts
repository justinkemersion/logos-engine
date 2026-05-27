/** Shared manifest YAML builders for Perseus sync scripts. */

export function yamlQuote(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

export type ManifestPassageRow = {
  citation: string;
  sequence: number;
  greek: string;
};

export function buildSectionManifestYaml(
  header: string,
  meta: {
    author: string;
    author_slug: string;
    work: string;
    work_slug: string;
    section_slug: string;
    section_title: string;
    book: number;
  },
  passages: ManifestPassageRow[],
): string {
  const rows = passages
    .map((entry) =>
      [
        `  - citation: ${yamlQuote(entry.citation)}`,
        `    sequence: ${entry.sequence}`,
        `    greek: ${yamlQuote(entry.greek)}`,
      ].join("\n"),
    )
    .join("\n");

  return `${header}
author: ${meta.author}
author_slug: ${meta.author_slug}
work: ${meta.work}
work_slug: ${meta.work_slug}
section_slug: ${meta.section_slug}
section_title: ${meta.section_title}
book: ${meta.book}

passages:
${rows}
`;
}
