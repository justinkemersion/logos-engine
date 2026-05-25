"use client";

import { useState } from "react";
import { cn } from "@/lib/ui/cn";
import { TokenRow as TokenRowComponent } from "./TokenRow";
import { TokenInspector } from "./TokenInspector";
import { AuthenticityCard } from "./AuthenticityCard";
import { CrossReferencesPanel } from "./CrossReferencesPanel";
import { Card } from "@/components/ui/Card";
import type {
  PassageRow,
  WorkRow,
  TokenRow,
  TranslationLayerRow,
  TranslationVariantRow,
  CommentaryNoteRow,
  ConceptMentionRow,
  ConceptThreadRow,
  AuthenticityProfileRow,
  CrossReferenceRow,
} from "@/lib/types/entities";

type TranslationTab = "greek" | "literal" | "readable" | "commentary";
type BottomTab = "grammar" | "notes" | "variants";

export function ReadingDesk({
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
}: {
  work: WorkRow;
  passage: PassageRow;
  tokens: TokenRow[];
  translationLayers: TranslationLayerRow[];
  translationVariants: TranslationVariantRow[];
  commentaryNotes: CommentaryNoteRow[];
  conceptMentions: ConceptMentionRow[];
  conceptMap: Record<string, ConceptThreadRow>;
  authenticity: AuthenticityProfileRow | null;
  crossRefs: CrossReferenceRow[];
  passageMap: Record<string, PassageRow>;
}) {
  const [activeTab, setActiveTab] = useState<TranslationTab>("literal");
  const [bottomTab, setBottomTab] = useState<BottomTab>("notes");
  const [selectedToken, setSelectedToken] = useState<TokenRow | null>(null);

  const layerMap = Object.fromEntries(
    translationLayers.map((l) => [l.layer, l]),
  );

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

  function handleTokenClick(token: TokenRow) {
    setSelectedToken((prev) => (prev?.id === token.id ? null : token));
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Central workspace */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Breadcrumb + title */}
        <div className="border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
          <p className="mb-1 text-xs text-[var(--muted-fg)]">
            {work.author} › {work.title} › {passage.citation_ref}
          </p>
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {work.title} {passage.citation_ref}
          </h1>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-[var(--border)] bg-[var(--surface)] px-6">
          {(["greek", "literal", "readable", "commentary"] as TranslationTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "mr-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px",
                activeTab === tab
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-[var(--muted-fg)] hover:text-[var(--foreground)]",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Passage content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {activeTab === "greek" || activeTab === "literal" ? (
            <div className="space-y-4">
              {/* Greek source always shown */}
              <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
                {passage.citation_ref}
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-3 items-start">
                {tokens.length > 0
                  ? tokens.map((token) => (
                      <div key={token.id}>
                        <TokenRowComponent
                          token={token}
                          isSelected={selectedToken?.id === token.id}
                          onClick={handleTokenClick}
                        />
                        {selectedToken?.id === token.id ? (
                          <TokenInspector
                            token={token}
                            variants={translationVariants}
                            onClose={() => setSelectedToken(null)}
                          />
                        ) : null}
                      </div>
                    ))
                  : (
                    <p
                      className="text-xl leading-relaxed"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {passage.greek_text}
                    </p>
                  )}
              </div>
              {activeTab === "literal" && layerMap["literal"] ? (
                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
                    Literal
                  </p>
                  <p className="text-base leading-relaxed text-[var(--foreground)]">
                    {layerMap["literal"].content}
                  </p>
                </div>
              ) : null}
            </div>
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
                    <div key={note.id} className="border-b border-[var(--border)] pb-4 last:border-0">
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

        {/* Bottom panel */}
        <div className="border-t border-[var(--border)] bg-[var(--surface)]" style={{ minHeight: 160 }}>
          <div className="flex border-b border-[var(--border)] px-6">
            {(["grammar", "notes", "variants"] as BottomTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setBottomTab(tab)}
                className={cn(
                  "mr-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px",
                  bottomTab === tab
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--muted-fg)] hover:text-[var(--foreground)]",
                )}
              >
                {tab}
              </button>
            ))}
            {/* AI draft placeholder */}
            <div className="ml-auto flex items-center">
              <button
                type="button"
                disabled
                className="rounded-md border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-fg)] opacity-50 cursor-not-allowed"
                title="AI draft generation — coming soon"
              >
                Generate Draft Layer
              </button>
            </div>
          </div>
          <div className="overflow-y-auto p-4 text-sm" style={{ maxHeight: 160 }}>
            {bottomTab === "grammar" ? (
              grammarNotes.length > 0 ? (
                <ul className="space-y-2">
                  {grammarNotes.map((n) => (
                    <li key={n.id} className="text-xs leading-relaxed">
                      <span className="font-medium">{n.note_type}: </span>
                      {n.body}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[var(--muted-fg)]">No grammar notes.</p>
              )
            ) : null}
            {bottomTab === "notes" ? (
              passage.source_note ? (
                <p className="text-xs text-[var(--muted-fg)] leading-relaxed">
                  {passage.source_note}
                </p>
              ) : (
                <p className="text-xs text-[var(--muted-fg)]">No passage notes.</p>
              )
            ) : null}
            {bottomTab === "variants" ? (
              translationVariants.length > 0 ? (
                <ul className="space-y-2">
                  {translationVariants.map((v) => (
                    <li key={v.id} className="text-xs leading-relaxed">
                      <span className="font-medium">{v.phrase} → {v.variant}</span>
                      {v.tradeoff_note ? (
                        <span className="ml-2 text-[var(--muted-fg)]">— {v.tradeoff_note.slice(0, 120)}…</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[var(--muted-fg)]">No variants for this passage.</p>
              )
            ) : null}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <aside className="hidden xl:flex w-[280px] flex-shrink-0 flex-col overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)]">
        {readableLayer ? (
          <RightSection title="Readable English">
            <p className="text-xs text-[var(--foreground)] leading-relaxed">
              {readableLayer.content}
            </p>
          </RightSection>
        ) : null}

        {philosophicalLayer ? (
          <RightSection title="Philosophical Notes">
            <p className="text-xs text-[var(--foreground)] leading-relaxed">
              {philosophicalLayer.content}
            </p>
          </RightSection>
        ) : philosophicalNotes.length > 0 ? (
          <RightSection title="Philosophical Notes">
            {philosophicalNotes.map((n) => (
              <p key={n.id} className="text-xs text-[var(--foreground)] leading-relaxed mb-2 last:mb-0">
                {n.body}
              </p>
            ))}
          </RightSection>
        ) : null}

        <RightSection title={`Cross References (${crossRefs.length})`}>
          <CrossReferencesPanel
            crossRefs={crossRefs}
            currentPassageId={passage.id}
            passageMap={passageMap}
          />
        </RightSection>

        {authenticity ? (
          <RightSection title="Authenticity & Transmission">
            <AuthenticityCard profile={authenticity} />
          </RightSection>
        ) : null}

        {uniqueConcepts.length > 0 ? (
          <RightSection title="Related Concepts">
            <div className="flex flex-wrap gap-1.5">
              {uniqueConcepts.map((c) => (
                <a
                  key={c.id}
                  href={`/concepts/${c.slug}`}
                  className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-2 py-0.5 text-xs hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] hover:border-[var(--accent)] transition-colors"
                >
                  {c.greek_term ?? c.label}
                </a>
              ))}
            </div>
          </RightSection>
        ) : null}
      </aside>
    </div>
  );
}

function RightSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[var(--border)] px-4 py-4 last:border-0">
      <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
        {title}
      </p>
      {children}
    </div>
  );
}
