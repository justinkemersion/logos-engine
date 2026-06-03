"use client";

import { useState, useTransition } from "react";
import { saveWorkspaceLayerAction } from "@/app/(workspace)/workspace/passages/[id]/actions";

export function WorkspaceLayerEditor({
  passageId,
  workspaceId,
  layer,
  label,
  initialContent,
}: {
  passageId: string;
  workspaceId: string;
  layer: "literal" | "readable";
  label: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await saveWorkspaceLayerAction({
        passageId,
        workspaceId,
        layer,
        content,
      });
      if (result.ok) {
        setMessage("Saved to your workspace.");
      } else {
        setMessage(result.error);
      }
    });
  }

  return (
    <div className="space-y-2">
      <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
        {label}
      </label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={layer === "readable" ? 6 : 4}
        className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm leading-relaxed"
        placeholder={`Your personal ${layer} translation…`}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-xs font-medium text-[var(--accent-fg)] disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {message ? <p className="text-xs text-[var(--muted-fg)]">{message}</p> : null}
      </div>
    </div>
  );
}
