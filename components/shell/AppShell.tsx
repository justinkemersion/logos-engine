import { LibraryNav } from "./LibraryNav";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LibraryNav />
        <main className="flex-1 overflow-y-auto bg-[var(--background)]">{children}</main>
      </div>
    </div>
  );
}
