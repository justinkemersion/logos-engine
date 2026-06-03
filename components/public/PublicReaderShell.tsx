import Link from "next/link";

export function PublicReaderShell({
  children,
  breadcrumb,
}: {
  children: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-[var(--foreground)] transition hover:text-[var(--accent)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Logos Engine
            </Link>
            {breadcrumb ? (
              <div className="mt-1 text-xs tracking-wide text-[var(--muted-fg)]">{breadcrumb}</div>
            ) : null}
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/read"
              className="text-[var(--muted-fg)] transition hover:text-[var(--foreground)]"
            >
              Library
            </Link>
            <Link
              href="/login?callbackUrl=/workspace"
              className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--muted)]"
            >
              My Reading Layer
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1">{children}</main>
    </div>
  );
}
