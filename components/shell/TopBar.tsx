import { auth, signOut } from "@/auth";

export async function TopBar() {
  const session = await auth();
  const email = session?.user?.email;

  return (
    <header className="flex h-12 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4">
      <nav className="flex items-center gap-4 text-xs font-medium text-[var(--muted-fg)]">
        {["Text", "Concepts", "Lexicon", "Cross-Refs", "Notes", "Versions"].map((label) => (
          <span key={label} className="cursor-default hover:text-[var(--foreground)] transition">
            {label.toUpperCase()}
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        {email ? (
          <span className="text-xs text-[var(--muted-fg)]">{email}</span>
        ) : null}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="text-xs text-[var(--muted-fg)] hover:text-[var(--foreground)] transition"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
