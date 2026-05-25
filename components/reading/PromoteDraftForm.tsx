"use client";

import { useState, useTransition } from "react";
import { promotePassageDraftAction } from "@/app/(app)/passages/[id]/actions";
import type { PromotePassageDraftSelection } from "@/lib/agents/promote-passage-draft";
import type { LogosPassageDraft } from "@/lib/agents/logos-passage-draft";
import type { AiRunRow } from "@/lib/types/entities";

export function PromoteDraftForm({
  passageId,
  run,
  draft,
}: {
  passageId: string;
  run: AiRunRow;
  draft: LogosPassageDraft;
}) {
  const [selection, setSelection] = useState<PromotePassageDraftSelection>({
    literalLayer: false,
    readableLayer: false,
    philosophicalLayer: false,
    variants: false,
    commentary: false,
    concepts: false,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasLiteral = draft.translationLayers.some((l) => l.layer === "literal");
  const hasReadable = draft.translationLayers.some((l) => l.layer === "readable");
  const hasPhilosophical = draft.translationLayers.some((l) => l.layer === "philosophical");

  function toggle(key: keyof PromotePassageDraftSelection) {
    setSelection((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handlePromote() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await promotePassageDraftAction(passageId, run.id, selection);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const { layers, variants, commentary, conceptMentions, skippedConcepts } = result.data!;
      const parts = [
        layers ? `${layers} layer(s)` : null,
        variants ? `${variants} variant(s)` : null,
        commentary ? `${commentary} note(s)` : null,
        conceptMentions ? `${conceptMentions} concept mention(s)` : null,
      ].filter(Boolean);
      if (parts.length === 0) {
        setError("Nothing selected to promote.");
        return;
      }
      let text = `Promoted ${parts.join(", ")} as draft canonical content.`;
      if (skippedConcepts.length > 0) {
        text += ` Skipped concepts without threads: ${skippedConcepts.join(", ")}.`;
      }
      setMessage(text);
    });
  }

  return (
    <div className="mt-4 border-t border-[var(--border)] pt-4">
      <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
        Selective promotion
      </p>
      <p className="mb-3 text-xs text-[var(--muted-fg)] leading-relaxed">
        Promote selected items into canonical tables as <strong>draft</strong> rows. Nothing is
        auto-accepted for publication.
        {run.status === "revised" || run.status === "accepted" ? (
          <> Re-promotion is idempotent — existing promoted rows are updated, not duplicated.</>
        ) : null}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
        {hasLiteral ? (
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={Boolean(selection.literalLayer)}
              onChange={() => toggle("literalLayer")}
            />
            Literal layer
          </label>
        ) : null}
        {hasReadable ? (
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={Boolean(selection.readableLayer)}
              onChange={() => toggle("readableLayer")}
            />
            Readable layer
          </label>
        ) : null}
        {hasPhilosophical ? (
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={Boolean(selection.philosophicalLayer)}
              onChange={() => toggle("philosophicalLayer")}
            />
            Philosophical layer
          </label>
        ) : null}
        {draft.variants.length > 0 ? (
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={Boolean(selection.variants)}
              onChange={() => toggle("variants")}
            />
            Variants ({draft.variants.length})
          </label>
        ) : null}
        {draft.commentary.length > 0 ? (
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={Boolean(selection.commentary)}
              onChange={() => toggle("commentary")}
            />
            Commentary ({draft.commentary.length})
          </label>
        ) : null}
        {draft.concepts.length > 0 ? (
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={Boolean(selection.concepts)}
              onChange={() => toggle("concepts")}
            />
            Concept mentions ({draft.concepts.length})
          </label>
        ) : null}
      </div>
      <button
        type="button"
        disabled={isPending}
        onClick={handlePromote}
        className="mt-3 rounded-md border border-[var(--border)] px-3 py-1 text-xs hover:bg-[var(--muted)] disabled:opacity-50"
      >
        {isPending ? "Promoting…" : "Promote selected"}
      </button>
      {message ? <p className="mt-2 text-xs text-green-800">{message}</p> : null}
      {error ? <p className="mt-2 text-xs text-amber-700">{error}</p> : null}
    </div>
  );
}
