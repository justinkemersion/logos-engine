import Link from "next/link";
import { auth } from "@/auth";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { ensureDefaultWorkspace } from "@/lib/flux/workspaces";
import { listPublicWorks, listPublicPassagesByWork, ODYSSEY_1_1_PASSAGE_ID } from "@/lib/public/passages";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function WorkspaceDashboardPage() {
  const session = await auth();
  const sub = session!.user!.id;
  const workspace = await safe(() => ensureDefaultWorkspace(sub), null);
  const works = await safe(() => listPublicWorks(), []);

  const worksWithPassages = await Promise.all(
    works.map(async (work) => {
      const passages = await safe(() => listPublicPassagesByWork(work.id), []);
      return { work, passages };
    }),
  );

  return (
    <WorkspaceShell workspaceName={workspace?.name ?? "My Logos Workspace"}>
      <div className="px-6 py-10">
        <h1 className="text-2xl font-semibold">My Logos Workspace</h1>
        <p className="mt-3 max-w-xl text-sm text-[var(--muted-fg)] leading-relaxed">
          Your workspace is a private reading layer over the shared Greek corpus. Your
          translations and notes do not alter the public edition.
        </p>
        <Link
          href={`/workspace/passages/${ODYSSEY_1_1_PASSAGE_ID}`}
          className="mt-6 inline-block rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-fg)]"
        >
          Open Odyssey 1.1 in workspace
        </Link>

        <div className="mt-12 space-y-8">
          {worksWithPassages.map(({ work, passages }) => (
            <section key={work.id}>
              <h2 className="font-semibold">{work.title}</h2>
              <ul className="mt-2 space-y-1">
                {passages.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/workspace/passages/${p.id}`}
                      className="text-sm text-[var(--accent)] hover:underline"
                    >
                      {p.citation_ref}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </WorkspaceShell>
  );
}
