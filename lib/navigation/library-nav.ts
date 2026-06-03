import { isPassageUuid } from "@/lib/public/routes";

/** Maps MVP passage ids to work routes for sidebar highlighting. */
export const PASSAGE_WORK_HREF: Record<string, string> = {
  "00000000-0000-0000-0002-000000000001": "/works/odyssey",
  "00000000-0000-0000-0002-000000000002": "/works/iliad",
  "00000000-0000-0000-0002-000000000003": "/works/republic",
  "00000000-0000-0000-0002-000000000004": "/works/iliad",
  "00000000-0000-0000-0002-000000000005": "/works/iliad",
  "00000000-0000-0000-0002-000000000006": "/works/iliad",
  "00000000-0000-0000-0002-000000000007": "/works/odyssey",
  "00000000-0000-0000-0002-000000000008": "/works/odyssey",
  "00000000-0000-0000-0002-000000000009": "/works/iliad",
};

export type LibraryNavItem = {
  label: string;
  href: string;
  children?: LibraryNavItem[];
  /** When true, only exact pathname match counts as active (avoids `/works` matching `/works/iliad`). */
  exact?: boolean;
};

export const LIBRARY_NAV: LibraryNavItem[] = [
  {
    label: "Plato",
    href: "/works/republic",
    children: [
      { label: "Republic", href: "/works/republic" },
      { label: "Symposium", href: "/works/symposium" },
      { label: "Phaedo", href: "/works/phaedo" },
      { label: "Apology", href: "/works/apology" },
    ],
  },
  {
    label: "Homer",
    href: "/works/odyssey",
    children: [
      { label: "Odyssey", href: "/works/odyssey" },
      { label: "Iliad", href: "/works/iliad" },
    ],
  },
  { label: "Sophocles", href: "/works", exact: true },
  { label: "Aristotle", href: "/works", exact: true },
];

/** Work route to highlight in the library rail for the current URL. */
export function activeLibraryHref(pathname: string): string | null {
  const workMatch = pathname.match(/^\/works\/([^/]+)/);
  if (workMatch) {
    return `/works/${workMatch[1]}`;
  }

  for (const prefix of ["/passages/", "/workspace/passages/"]) {
    const passageMatch = pathname.match(new RegExp(`^${prefix.replace(/\//g, "\\/")}([^/]+)`));
    if (passageMatch) {
      return PASSAGE_WORK_HREF[passageMatch[1]] ?? null;
    }
  }

  const readSlugMatch = pathname.match(/^\/read\/[^/]+\/([^/]+)/);
  if (readSlugMatch) {
    return `/works/${readSlugMatch[1]}`;
  }

  if (isPassageUuid(pathname.replace(/^\/read\//, "").split("/")[0] ?? "")) {
    const uuidMatch = pathname.match(/^\/read\/([^/]+)/);
    if (uuidMatch) {
      return PASSAGE_WORK_HREF[uuidMatch[1]] ?? null;
    }
  }

  if (pathname.startsWith("/read")) {
    return "/works/odyssey";
  }

  if (pathname.startsWith("/workspace")) {
    return "/works/odyssey";
  }

  if (pathname === "/works") {
    return "/works";
  }

  return null;
}

export function isLibraryNavItemActive(
  href: string,
  pathname: string,
  exact?: boolean,
): boolean {
  if (exact) {
    return pathname === href;
  }

  const active = activeLibraryHref(pathname);
  if (active) {
    return active === href;
  }

  return pathname === href;
}
