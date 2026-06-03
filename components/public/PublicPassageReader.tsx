"use client";

import { useState } from "react";
import { PublicPassageHeader } from "./PublicPassageHeader";
import { PublicReadingTabs, type PublicTab } from "./PublicReadingTabs";
import { PublicGreekPassage } from "./PublicGreekPassage";
import { PublicLayerCard } from "./PublicLayerCard";
import { PublicVariantList } from "./PublicVariantList";
import { PublicRailPanel } from "./PublicRailPanel";
import { PublicContinueReading } from "./PublicContinueReading";
import { pickPublicLayer } from "@/lib/public/content";
import type {
  AuthenticityProfileRow,
  CommentaryNoteRow,
  ConceptThreadRow,
  PassageRow,
  TokenRow,
  TranslationLayerRow,
  TranslationVariantRow,
  WorkRow,
} from "@/lib/types/entities";

export type PublicPassageReaderProps = {
  work: WorkRow;
  passage: PassageRow;
  siblings: PassageRow[];
  tokens: TokenRow[];
  translationLayers: TranslationLayerRow[];
  translationVariants: TranslationVariantRow[];
  commentaryNotes: CommentaryNoteRow[];
  concepts: ConceptThreadRow[];
  authenticity: AuthenticityProfileRow | null;
};

export function PublicPassageReader({
  work,
  passage,
  siblings,
  tokens,
  translationLayers,
  translationVariants,
  commentaryNotes,
  concepts,
  authenticity,
}: PublicPassageReaderProps) {
  const [activeTab, setActiveTab] = useState<PublicTab>("greek");
  const [selectedToken, setSelectedToken] = useState<TokenRow | null>(null);

  const literalLayer = pickPublicLayer(translationLayers, "literal");
  const readableLayer = pickPublicLayer(translationLayers, "readable");
  const notes = commentaryNotes.filter((n) => n.note_type !== "fragment");

  const handleTokenClick = (t: TokenRow) => {
    setSelectedToken((prev) => (prev?.id === t.id ? null : t));
  };

  return (
    <div className="pb-8">
      <PublicPassageHeader work={work} passage={passage} />
      <PublicReadingTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1fr_280px]">
        <div>
          {activeTab === "greek" ? (
            <PublicGreekPassage
              passage={passage}
              tokens={tokens}
              translationVariants={translationVariants}
              selectedToken={selectedToken}
              onTokenClick={handleTokenClick}
              onCloseAnnotation={() => setSelectedToken(null)}
              mode="greek"
            />
          ) : null}

          {activeTab === "literal" ? (
            <div className="space-y-8">
              <PublicGreekPassage
                passage={passage}
                tokens={tokens}
                translationVariants={translationVariants}
                selectedToken={selectedToken}
                onTokenClick={handleTokenClick}
                onCloseAnnotation={() => setSelectedToken(null)}
                mode="literal"
              />
              <PublicLayerCard
                title="Literal English"
                layer={literalLayer}
                emptyMessage="No accepted literal layer yet."
              />
            </div>
          ) : null}

          {activeTab === "readable" ? (
            <PublicLayerCard
              title="Readable English"
              layer={readableLayer}
              useSerif
              hideTitle
              emptyMessage="No accepted readable layer yet."
            />
          ) : null}

          {activeTab === "commentary" ? (
            <div className="space-y-6">
              {notes.length === 0 ? (
                <p className="text-sm text-[var(--muted-fg)]">No commentary notes.</p>
              ) : (
                notes.map((note) => (
                  <article
                    key={note.id}
                    className="border-l border-[var(--border)] pl-4"
                  >
                    {note.title ? (
                      <h3
                        className="mb-1 text-base font-medium text-[var(--foreground)]"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {note.title}
                      </h3>
                    ) : null}
                    <p className="mb-2 text-xs text-[var(--muted-fg)]">
                      {note.note_type.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm leading-relaxed text-[var(--foreground)]">{note.body}</p>
                  </article>
                ))
              )}
            </div>
          ) : null}

          {activeTab === "variants" ? <PublicVariantList variants={translationVariants} /> : null}
        </div>

        <PublicRailPanel
          concepts={concepts}
          authenticity={authenticity}
          commentaryNotes={commentaryNotes}
        />
      </div>

      <PublicContinueReading work={work} passage={passage} siblings={siblings} />
    </div>
  );
}
