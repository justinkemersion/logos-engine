"use client";

import { useState, useTransition } from "react";
import {
  saveWorkspaceCommentaryAction,
  updateWorkspaceCommentaryAction,
} from "@/app/(workspace)/workspace/passages/[id]/actions";
import type { WorkspaceCommentaryNoteRow } from "@/lib/types/workspaces";

export function WorkspaceCommentaryEditor({
  passageId,
  workspaceId,
  existingNotes,
}: {
  passageId: string;
  workspaceId: string;
  existingNotes: WorkspaceCommentaryNoteRow[];
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleCreate() {
    if (!body.trim()) return;
    setMessage(null);
    startTransition(async () => {
      const result = await saveWorkspaceCommentaryAction({
        passageId,
        workspaceId,
        title: title.trim() || null,
        body: body.trim(),
      });
      if (result.ok) {
        setTitle("");
        setBody("");
        setMessage("Note saved.");
      } else {
        setMessage(result.error);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
          New personal note
        </p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="Your private commentary…"
          className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={pending || !body.trim()}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-xs font-medium text-[var(--accent-fg)] disabled:opacity-50"
        >
          {pending ? "Saving…" : "Add note"}
        </button>
        {message ? <p className="text-xs text-[var(--muted-fg)]">{message}</p> : null}
      </div>

      {existingNotes.length > 0 ? (
        <ul className="space-y-4">
          {existingNotes.map((note) => (
            <WorkspaceCommentaryNoteItem
              key={note.id}
              note={note}
              passageId={passageId}
              onUpdated={() => setMessage("Note updated.")}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function WorkspaceCommentaryNoteItem({
  note,
  passageId,
  onUpdated,
}: {
  note: WorkspaceCommentaryNoteRow;
  passageId: string;
  onUpdated: () => void;
}) {
  const [body, setBody] = useState(note.body);
  const [pending, startTransition] = useTransition();

  function handleUpdate() {
    startTransition(async () => {
      const result = await updateWorkspaceCommentaryAction({
        noteId: note.id,
        passageId,
        body: body.trim(),
      });
      if (result.ok) onUpdated();
    });
  }

  return (
    <li className="border-b border-[var(--border)] pb-4">
      {note.title ? <p className="text-xs font-semibold mb-1">{note.title}</p> : null}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm mb-2"
      />
      <button
        type="button"
        onClick={handleUpdate}
        disabled={pending}
        className="text-xs text-[var(--accent)] hover:underline disabled:opacity-50"
      >
        Update note
      </button>
    </li>
  );
}
