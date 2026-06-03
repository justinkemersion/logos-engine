import Link from "next/link";

export function WorkspaceShell({
  children,
  workspaceName,
}: {
  children: React.ReactNode;
  workspaceName: string;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/workspace" className="text-xs font-semibold uppercase tracking-widest">
              {workspaceName}
            </Link>
            <p className="mt-0.5 text-xs text-[var(--muted-fg)]">Private reading layer</p>
          </div>
          <nav className="flex gap-3 text-sm">
            <Link href="/read" className="text-[var(--muted-fg)] hover:text-[var(--foreground)]">
              Public reader
            </Link>
            <Link href="/works" className="text-[var(--muted-fg)] hover:text-[var(--foreground)]">
              Editorial library
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl">{children}</main>
    </div>
  );
}
