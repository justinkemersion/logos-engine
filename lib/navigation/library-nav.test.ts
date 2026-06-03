import { describe, expect, it } from "vitest";
import { activeLibraryHref, isLibraryNavItemActive } from "./library-nav";

describe("library nav active state", () => {
  it("highlights Republic on work page", () => {
    expect(activeLibraryHref("/works/republic")).toBe("/works/republic");
    expect(isLibraryNavItemActive("/works/republic", "/works/republic")).toBe(true);
    expect(isLibraryNavItemActive("/works/iliad", "/works/republic")).toBe(false);
  });

  it("highlights Iliad from passage id map", () => {
    expect(
      activeLibraryHref("/passages/00000000-0000-0000-0002-000000000006"),
    ).toBe("/works/iliad");
    expect(
      isLibraryNavItemActive(
        "/works/iliad",
        "/passages/00000000-0000-0000-0002-000000000006",
      ),
    ).toBe(true);
    expect(
      isLibraryNavItemActive(
        "/works/republic",
        "/passages/00000000-0000-0000-0002-000000000006",
      ),
    ).toBe(false);
  });

  it("highlights Iliad from public read route", () => {
    expect(
      activeLibraryHref("/read/00000000-0000-0000-0002-000000000006"),
    ).toBe("/works/iliad");
  });

  it("only exact-matches /works hub links", () => {
    expect(isLibraryNavItemActive("/works", "/works/republic", true)).toBe(false);
    expect(isLibraryNavItemActive("/works", "/works", true)).toBe(true);
  });
});
