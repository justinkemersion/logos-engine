"use client";

import { useState } from "react";
import { cn } from "@/lib/ui/cn";
import { copyText } from "@/lib/ui/copy-text";
import type { LogosPassageDraft } from "@/lib/agents/logos-passage-draft";
import {
  formatDraftLayerForCopy,
  formatDraftTokensForCopy,
  formatDraftVariantsForCopy,
  formatDraftWarningsForCopy,
} from "@/lib/agents/format-draft-for-copy";
import type { AiRunRow } from "@/lib/types/entities";
import {
  CopyButton,
  DraftSection,
  formatDraftDate,
  warningLevelClass,
} from "./AiDraftReviewParts";

export function AiDraftReviewPanel({
  draft,
  run,
  parseError,
}: {
  draft: LogosPassageDraft | null;
  run: AiRunRow | null;
  parseError: string | null;
}) {
  if (!run) {
    return (
      <p className="text-xs text-[var(--muted-fg)]">
        No AI draft stored for this passage. Generate via CLI or enable UI generation later.
      </p>
    );
  }

  if (parseError || !draft) {
    return (
      <p className="text-xs text-amber-700">
        Latest AI draft could not be loaded: {parseError ?? "Unknown parse error"}
      </p>
    );
  }

  return <AiDraftReviewContent draft={draft} run={run} />;
}

function AiDraftReviewContent({
  draft,
  run,
}: {
  draft: LogosPassageDraft;
  run: AiRunRow;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  async function handleCopy(label: string, text: string) {
    const ok = await copyText(text);
    if (ok) {
      setCopied(label);
      window.setTimeout(() => setCopied(null), 2000);
    }
  }

  const literalLayer = formatDraftLayerForCopy(draft.translationLayers, "literal");
  const readableLayer = formatDraftLayerForCopy(draft.translationLayers, "readable");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-amber-700">
            AI Draft — not canonical
          </p>
          <p className="mt-1 text-xs text-[var(--muted-fg)]">
            Saved {formatDraftDate(run.created_at)}
            {run.model ? ` · ${run.model}` : ""}
            {run.status ? ` · ${run.status}` : ""}
          </p>
          <p className="mt-2 text-xs text-[var(--muted-fg)] leading-relaxed">
            For manual editorial use only. Copy sections below; promotion to canonical layers is
            a separate workflow.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton
            label="JSON"
            copied={copied === "json"}
            onClick={() => handleCopy("json", JSON.stringify(draft, null, 2))}
          />
          {literalLayer ? (
            <CopyButton
              label="Literal"
              copied={copied === "literal"}
              onClick={() => handleCopy("literal", literalLayer)}
            />
          ) : null}
          <CopyButton
            label="Tokens"
            copied={copied === "tokens"}
            onClick={() => handleCopy("tokens", formatDraftTokensForCopy(draft.tokens))}
          />
          {draft.variants.length > 0 ? (
            <CopyButton
              label="Variants"
              copied={copied === "variants"}
              onClick={() => handleCopy("variants", formatDraftVariantsForCopy(draft))}
            />
          ) : null}
        </div>
      </div>

      {draft.editorialWarnings && draft.editorialWarnings.length > 0 ? (
        <DraftSection title="Editorial warnings">
          <ul className="space-y-2">
            {draft.editorialWarnings.map((w, i) => (
              <li key={i} className="text-xs leading-relaxed">
                <span
                  className={cn(
                    "mr-2 rounded px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase",
                    warningLevelClass(w.level),
                  )}
                >
                  {w.level}
                </span>
                {w.message}
              </li>
            ))}
          </ul>
          <CopyButton
            label="warnings"
            copied={copied === "warnings"}
            onClick={() => handleCopy("warnings", formatDraftWarningsForCopy(draft))}
            className="mt-2"
          />
        </DraftSection>
      ) : null}

      <DraftSection title="Tokens">
        <ul className="space-y-2">
          {draft.tokens.map((t, i) => (
            <li key={`${t.surface}-${i}`} className="text-xs leading-relaxed">
              <span className="font-medium" style={{ fontFamily: "var(--font-serif)" }}>
                {t.surface}
              </span>
              {t.literalGloss ? (
                <span className="ml-2 text-[var(--muted-fg)]">{t.literalGloss}</span>
              ) : null}
              {t.lemma ? (
                <span className="ml-2 text-[var(--muted-fg)]">lemma: {t.lemma}</span>
              ) : null}
              {t.morphology ? (
                <span className="ml-2 text-[var(--muted-fg)]">{t.morphology}</span>
              ) : null}
              {t.note ? <p className="mt-0.5 text-[var(--muted-fg)]">{t.note}</p> : null}
            </li>
          ))}
        </ul>
      </DraftSection>

      <DraftSection title="Translation layers">
        <div className="space-y-3">
          {draft.translationLayers.map((layer) => (
            <div key={layer.layer}>
              <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
                {layer.layer} · {Math.round(layer.confidence * 100)}%
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--foreground)]">
                {layer.content}
              </p>
            </div>
          ))}
        </div>
      </DraftSection>

      {draft.variants.length > 0 ? (
        <DraftSection title="Variants">
          <ul className="space-y-3">
            {draft.variants.map((v, i) => (
              <li key={`${v.sourcePhrase}-${v.variant}-${i}`} className="text-xs leading-relaxed">
                <p>
                  <span className="font-medium" style={{ fontFamily: "var(--font-serif)" }}>
                    {v.sourcePhrase}
                  </span>
                  <span className="mx-1 text-[var(--muted-fg)]">→</span>
                  <span>{v.variant}</span>
                  <span className="ml-2 text-[var(--muted-fg)]">
                    ({v.variantType}, {Math.round(v.confidence * 100)}%)
                  </span>
                </p>
                <p className="mt-0.5 text-[var(--muted-fg)]">{v.tradeoffNote}</p>
              </li>
            ))}
          </ul>
        </DraftSection>
      ) : null}

      {readableLayer ? (
        <p className="text-[0.65rem] text-[var(--muted-fg)] italic">
          Readable draft (not shown in canonical tabs): {readableLayer}
        </p>
      ) : null}
    </div>
  );
}
