"use client";

import { useState } from "react";
import { ReadingDeskHeader } from "./ReadingDeskHeader";
import { ReadingDeskTabs } from "./ReadingDeskTabs";
import { InterlinearTokenGrid } from "./InterlinearTokenGrid";
import { ReadingDeskBottomPanel } from "./ReadingDeskBottomPanel";
import { ReadingDeskRightRail } from "./ReadingDeskRightRail";
import type { ReadingDeskProps, TranslationTab, BottomTab } from "./reading-desk-types";
import type { ConceptThreadRow } from "@/lib/types/entities";

export function ReadingDesk(props: ReadingDeskProps) {
  const {
    work,
    passage,
    tokens,
    translationLayers,
    translationVariants,
    commentaryNotes,
    conceptMentions,
    conceptMap,
    authenticity,
    crossRefs,
    passageMap,
    latestPassageDraftRun,
  } = props;

  const [activeTab, setActiveTab] = useState<TranslationTab>("literal");
  const [bottomTab, setBottomTab] = useState<BottomTab>("notes");
  const [selectedToken, setSelectedToken] = useState<(typeof tokens)[number] | null>(null);

  const layerMap = Object.fromEntries(translationLayers.map((l) => [l.layer, l]));

  const grammarNotes = commentaryNotes.filter(
    (n) => n.note_type === "grammatical" || n.note_type === "lexical",
  );
  const philosophicalNotes = commentaryNotes.filter(
    (n) => n.note_type === "philosophical",
  );
  const readableLayer = layerMap["readable"];
  const philosophicalLayer = layerMap["philosophical"];

  const mentionedConcepts = conceptMentions
    .map((m) => conceptMap[m.concept_id])
    .filter(Boolean) as ConceptThreadRow[];

  const uniqueConcepts = Array.from(
    new Map(mentionedConcepts.map((c) => [c.id, c])).values(),
  );

  function handleTokenClick(token: (typeof tokens)[number]) {
    setSelectedToken((prev) => (prev?.id === token.id ? null : token));
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <ReadingDeskHeader work={work} passage={passage} />
        <ReadingDeskTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {activeTab === "greek" || activeTab === "literal" ? (
            <InterlinearTokenGrid
              passage={passage}
              tokens={tokens}
              translationVariants={translationVariants}
              selectedToken={selectedToken}
              onTokenClick={handleTokenClick}
              onCloseInspector={() => setSelectedToken(null)}
              literalLayer={layerMap["literal"]}
              showLiteralLayer={activeTab === "literal"}
            />
          ) : null}

          {activeTab === "readable" ? (
            <div>
              <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
                Readable English
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {readableLayer?.content ?? "No readable layer available."}
              </p>
              {readableLayer?.status === "draft" ? (
                <p className="mt-2 text-xs text-amber-600">AI Draft — not yet reviewed</p>
              ) : null}
            </div>
          ) : null}

          {activeTab === "commentary" ? (
            <div className="space-y-4">
              {commentaryNotes.filter((n) => n.note_type !== "fragment").length === 0 ? (
                <p className="text-sm text-[var(--muted-fg)]">No commentary notes.</p>
              ) : (
                commentaryNotes
                  .filter((n) => n.note_type !== "fragment")
                  .map((note) => (
                    <div
                      key={note.id}
                      className="border-b border-[var(--border)] pb-4 last:border-0"
                    >
                      {note.title ? (
                        <p className="mb-1 text-xs font-semibold text-[var(--foreground)]">
                          {note.title}
                        </p>
                      ) : null}
                      <p className="text-[0.65rem] uppercase tracking-wide text-[var(--muted-fg)] mb-2">
                        {note.note_type.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm text-[var(--foreground)] leading-relaxed">
                        {note.body}
                      </p>
                    </div>
                  ))
              )}
            </div>
          ) : null}
        </div>

        <ReadingDeskBottomPanel
          bottomTab={bottomTab}
          onBottomTabChange={setBottomTab}
          grammarNotes={grammarNotes}
          passage={passage}
          translationVariants={translationVariants}
          latestPassageDraftRun={latestPassageDraftRun}
        />
      </div>

      <ReadingDeskRightRail
        readableLayer={readableLayer}
        philosophicalLayer={philosophicalLayer}
        philosophicalNotes={philosophicalNotes}
        crossRefs={crossRefs}
        passage={passage}
        passageMap={passageMap}
        authenticity={authenticity}
        uniqueConcepts={uniqueConcepts}
      />
    </div>
  );
}
