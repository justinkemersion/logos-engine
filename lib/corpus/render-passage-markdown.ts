import type { LogosPassageDraft } from "@/lib/agents/logos-passage-draft";
import { computeSourceHash } from "./source-hash";
import type { ResolvedManifestEntry } from "./manifest";

export type RenderPassageMarkdownOptions = {
  generatedAt: string;
  status?: string;
  generatedByModel: string;
};

function yamlScalar(value: string | number): string {
  const text = String(value);
  if (/^[a-zA-Z0-9._-]+$/.test(text)) {
    return text;
  }
  return `"${text.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function groupVariantsBySource(draft: LogosPassageDraft): Map<string, typeof draft.variants> {
  const groups = new Map<string, typeof draft.variants>();
  for (const variant of draft.variants) {
    const existing = groups.get(variant.sourcePhrase) ?? [];
    existing.push(variant);
    groups.set(variant.sourcePhrase, existing);
  }
  return groups;
}

function layerContent(
  draft: LogosPassageDraft,
  layer: "literal" | "readable",
): string | null {
  return draft.translationLayers.find((item) => item.layer === layer)?.content ?? null;
}

function formatCommentary(draft: LogosPassageDraft): string | null {
  if (draft.commentary.length === 0) {
    return null;
  }

  return draft.commentary
    .map((note) => {
      if (note.title) {
        return `${note.title}. ${note.body}`;
      }
      return note.body;
    })
    .join("\n\n");
}

function formatEditorialWarnings(draft: LogosPassageDraft): string | null {
  const warnings = draft.editorialWarnings ?? [];
  if (warnings.length === 0) {
    return null;
  }

  return warnings.map((warning) => `- ${warning.message}`).join("\n");
}

function formatVariantsSection(draft: LogosPassageDraft): string | null {
  const groups = groupVariantsBySource(draft);
  if (groups.size === 0) {
    return null;
  }

  const blocks: string[] = [];
  for (const [sourcePhrase, variants] of groups) {
    const lines = variants.map((variant) => `- ${variant.variant}`);
    blocks.push(`### ${sourcePhrase}\n\n${lines.join("\n")}`);
  }
  return blocks.join("\n\n");
}

function formatTradeoffsSection(draft: LogosPassageDraft): string | null {
  if (draft.variants.length === 0) {
    return null;
  }

  const blocks = draft.variants.map(
    (variant) => `### ${variant.variant}\n\n${variant.tradeoffNote}`,
  );
  return blocks.join("\n\n");
}

function appendSection(sections: string[], title: string, body: string | null): void {
  if (!body?.trim()) {
    return;
  }
  sections.push(`## ${title}\n\n${body.trim()}\n\n---\n`);
}

export function renderPassageMarkdown(
  entry: ResolvedManifestEntry,
  draft: LogosPassageDraft,
  options: RenderPassageMarkdownOptions,
): string {
  const sourceHash = computeSourceHash(entry);
  const status = options.status ?? "draft";
  const title = `${entry.work} ${entry.citation}`;

  const frontmatterLines = [
    "---",
    `author: ${yamlScalar(entry.author)}`,
    `work: ${yamlScalar(entry.work)}`,
  ];

  if (entry.book !== undefined) {
    frontmatterLines.push(`book: ${entry.book}`);
  }

  frontmatterLines.push(
    `citation: ${yamlScalar(entry.citation)}`,
    `generation_profile: ${yamlScalar(entry.generation_profile)}`,
    `agent_profile: ${yamlScalar(entry.agent_profile)}`,
    `prompt_version: ${yamlScalar(entry.prompt_version)}`,
    `generated_by_model: ${yamlScalar(options.generatedByModel)}`,
    `generated_at: ${yamlScalar(options.generatedAt)}`,
    `source_hash: ${yamlScalar(sourceHash)}`,
    `status: ${yamlScalar(status)}`,
    "---",
  );

  const sections: string[] = [];
  appendSection(sections, "Greek", entry.greek);
  appendSection(sections, "Literal", layerContent(draft, "literal"));
  appendSection(sections, "Readable", layerContent(draft, "readable"));
  appendSection(sections, "Variants", formatVariantsSection(draft));
  appendSection(sections, "Tradeoffs", formatTradeoffsSection(draft));
  appendSection(sections, "Commentary", formatCommentary(draft));
  appendSection(sections, "Editorial Warnings", formatEditorialWarnings(draft));

  const body = sections.join("\n").replace(/\n---\n$/, "");
  return `${frontmatterLines.join("\n")}\n\n# ${title}\n\n${body}\n`;
}

/** Extract `source_hash` and `generated_by_model` from existing garden markdown. */
export function parseGardenFrontmatter(markdown: string): {
  sourceHash?: string;
  generatedByModel?: string;
} {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return {};
  }

  const block = match[1];
  const sourceHash = block.match(/^source_hash:\s*(.+)$/m)?.[1]?.trim();
  const generatedByModel = block.match(/^generated_by_model:\s*(.+)$/m)?.[1]?.trim();

  return {
    sourceHash: sourceHash?.replace(/^"|"$/g, ""),
    generatedByModel: generatedByModel?.replace(/^"|"$/g, ""),
  };
}
