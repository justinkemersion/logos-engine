"use client";

import { useState } from "react";
import { LayerCompare, type LayerViewMode } from "./LayerCompare";
import { WorkspaceLayerEditor } from "./WorkspaceLayerEditor";
import { WorkspaceCommentaryEditor } from "./WorkspaceCommentaryEditor";
import { PublicLayerCard } from "@/components/public/PublicLayerCard";
import { pickPublicLayer } from "@/lib/public/content";
import type { PassageRow, TranslationLayerRow, WorkRow } from "@/lib/types/entities";
import type {
  WorkspaceCommentaryNoteRow,
  WorkspaceTranslationLayerRow,
} from "@/lib/types/workspaces";

export function WorkspaceReader({
  work,
  passage,
  workspaceId,
  publicLayers,
  workspaceLayers,
  workspaceCommentary,
}: {
  work: WorkRow;
  passage: PassageRow;
  workspaceId: string;
  publicLayers: TranslationLayerRow[];
  workspaceLayers: WorkspaceTranslationLayerRow[];
  workspaceCommentary: WorkspaceCommentaryNoteRow[];
}) {
  const [viewMode, setViewMode] = useState<LayerViewMode>("compare");
  const [activeSection, setActiveSection] = useState<"layers" | "commentary">("layers");

  const publicLiteral = pickPublicLayer(publicLayers, "literal");
  const publicReadable = pickPublicLayer(publicLayers, "readable");
  const myLiteral = workspaceLayers.find((l) => l.layer === "literal");
  const myReadable = workspaceLayers.find((l) => l.layer === "readable");

  return (
    <div className="px-6 py-8 pb-16">
      <p className="text-xs text-[var(--muted-fg)] mb-1">
        {work.author} › {work.title} › {passage.citation_ref}
      </p>
      <h1
        className="text-2xl font-semibold mb-2"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {work.title} {passage.citation_ref}
      </h1>
      <p className="text-sm text-[var(--muted-fg)] mb-8 max-w-xl leading-relaxed">
        Your workspace is a private reading layer over the shared Greek corpus. Your
        translations and notes do not alter the public edition.
      </p>

      <p
        className="text-xl mb-6 leading-relaxed"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {passage.greek_text}
      </p>

      <div className="flex gap-4 mb-6 border-b border-[var(--border)]">
        {(["layers", "commentary"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setActiveSection(s)}
            className={`pb-2 text-xs font-semibold uppercase tracking-widest border-b-2 -mb-px ${
              activeSection === s
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--muted-fg)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {activeSection === "layers" ? (
        <div className="space-y-8">
          <LayerCompare mode={viewMode} onModeChange={setViewMode} />

          {viewMode === "public" || viewMode === "compare" ? (
            <div className={viewMode === "compare" ? "grid gap-6 md:grid-cols-2" : ""}>
              <div>
                <p className="mb-3 text-xs font-semibold text-[var(--muted-fg)]">Public baseline</p>
                <PublicLayerCard title="Literal" layer={publicLiteral} />
                <div className="mt-4">
                  <PublicLayerCard title="Readable" layer={publicReadable} useSerif />
                </div>
              </div>
            </div>
          ) : null}

          {viewMode === "mine" || viewMode === "compare" ? (
            <div className={viewMode === "compare" ? "grid gap-6 md:grid-cols-2" : ""}>
              <div>
                <p className="mb-3 text-xs font-semibold text-[var(--muted-fg)]">My layer</p>
                <WorkspaceLayerEditor
                  passageId={passage.id}
                  workspaceId={workspaceId}
                  layer="literal"
                  label="Personal literal"
                  initialContent={myLiteral?.content ?? ""}
                />
                <div className="mt-6">
                  <WorkspaceLayerEditor
                    passageId={passage.id}
                    workspaceId={workspaceId}
                    layer="readable"
                    label="Personal readable"
                    initialContent={myReadable?.content ?? ""}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {viewMode === "compare" && publicLiteral && myLiteral ? (
            <p className="text-xs text-[var(--muted-fg)] border-t border-[var(--border)] pt-4">
              Compare mode shows public accepted content alongside your draft workspace layers.
            </p>
          ) : null}
        </div>
      ) : (
        <WorkspaceCommentaryEditor
          passageId={passage.id}
          workspaceId={workspaceId}
          existingNotes={workspaceCommentary}
        />
      )}
    </div>
  );
}
