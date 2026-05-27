import { createHash } from "node:crypto";
import type { CorpusManifestEntry } from "./manifest";

/** Deterministic source identity for manifest drift detection. */
export function computeSourceHashInput(entry: Pick<
  CorpusManifestEntry,
  "author" | "work" | "citation" | "greek"
>): string {
  return [entry.author, entry.work, entry.citation, entry.greek]
    .map((part) => part.trim())
    .join("\n");
}

export function computeSourceHash(
  entry: Pick<CorpusManifestEntry, "author" | "work" | "citation" | "greek">,
): string {
  const digest = createHash("sha256")
    .update(computeSourceHashInput(entry), "utf8")
    .digest("hex");
  return `sha256:${digest}`;
}
