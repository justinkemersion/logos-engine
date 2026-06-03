import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { WorkspaceReader } from "@/components/workspace/WorkspaceReader";
import {
  ensureDefaultWorkspace,
  listWorkspaceLayers,
  listWorkspaceCommentary,
} from "@/lib/flux/workspaces";
import {
  getPublicPassage,
  getPublicWorkById,
  listPublicTranslationLayers,
} from "@/lib/public/passages";
import type { WorkRow, TranslationLayerRow } from "@/lib/types/entities";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function WorkspacePassagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const sub = session!.user!.id;

  const passage = await safe(() => getPublicPassage(id), null);
  if (!passage) notFound();

  const [workspace, work, publicLayers, workspaceLayers, workspaceCommentary]: [
    Awaited<ReturnType<typeof ensureDefaultWorkspace>> | null,
    WorkRow | null,
    TranslationLayerRow[],
    Awaited<ReturnType<typeof listWorkspaceLayers>>,
    Awaited<ReturnType<typeof listWorkspaceCommentary>>,
  ] = await Promise.all([
    safe(() => ensureDefaultWorkspace(sub), null),
    safe(() => getPublicWorkById(passage.work_id), null),
    safe(() => listPublicTranslationLayers(passage.id), []),
    safe(async () => {
      const ws = await ensureDefaultWorkspace(sub);
      return listWorkspaceLayers(sub, ws.id, passage.id);
    }, []),
    safe(async () => {
      const ws = await ensureDefaultWorkspace(sub);
      return listWorkspaceCommentary(sub, ws.id, passage.id);
    }, []),
  ]);

  if (!workspace) notFound();

  const fallbackWork: WorkRow = {
    id: passage.work_id,
    slug: "",
    title: "Unknown",
    original_title: null,
    author: "Unknown",
    tradition: null,
    language: "Ancient Greek",
    description: null,
    created_at: "",
    updated_at: "",
  };

  return (
    <WorkspaceShell workspaceName={workspace.name}>
      <WorkspaceReader
        work={work ?? fallbackWork}
        passage={passage}
        workspaceId={workspace.id}
        publicLayers={publicLayers}
        workspaceLayers={workspaceLayers}
        workspaceCommentary={workspaceCommentary}
      />
    </WorkspaceShell>
  );
}
