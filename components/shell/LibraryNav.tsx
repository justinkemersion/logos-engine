"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/ui/cn";
import { isLibraryNavItemActive, LIBRARY_NAV } from "@/lib/navigation/library-nav";

export function LibraryNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex h-full w-[220px] flex-shrink-0 flex-col overflow-y-auto"
      style={{ background: "var(--rail-bg)", color: "var(--rail-fg)" }}
    >
      <div className="px-4 pt-5 pb-4">
        <Link href="/" className="block">
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: "var(--rail-fg)", fontFamily: "var(--font-serif)" }}
          >
            LOGOS ENGINE
          </span>
          <p className="mt-0.5 text-[10px] leading-snug" style={{ color: "var(--rail-fg)", opacity: 0.6 }}>
            Read the Greek World
            <br />
            from the Source.
          </p>
        </Link>
      </div>

      <div className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-widest opacity-50">
        Library
      </div>

      <ul className="flex-1 px-2 pb-4 text-sm">
        {LIBRARY_NAV.map((author) => (
          <li key={author.label} className="mb-1">
            <span className="block px-2 py-1 text-xs font-semibold opacity-70">
              {author.label}
            </span>
            {author.children ? (
              <ul>
                {author.children.map((work) => (
                  <li key={work.label}>
                    <NavLink
                      href={work.href}
                      pathname={pathname}
                      exact={work.exact}
                    >
                      {work.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <NavLink href={author.href} pathname={pathname} exact={author.exact}>
                {author.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>

      <div className="border-t px-2 py-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        {[
          { label: "Concepts", href: "/concepts" },
          { label: "Fragments", href: "/fragments" },
        ].map((item) => (
          <NavLink key={item.label} href={item.href} pathname={pathname} exact>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function NavLink({
  href,
  pathname,
  exact,
  children,
}: {
  href: string;
  pathname: string;
  exact?: boolean;
  children: React.ReactNode;
}) {
  const isActive = isLibraryNavItemActive(href, pathname, exact);
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-md px-3 py-1.5 text-xs transition",
        isActive ? "font-medium" : "opacity-70 hover:opacity-100",
      )}
      style={
        isActive
          ? { background: "var(--rail-active)", color: "var(--rail-fg)" }
          : { color: "var(--rail-fg)" }
      }
    >
      {children}
    </Link>
  );
}
