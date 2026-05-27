import { describe, expect, it } from "vitest";
import {
  discoverSectionManifestPathsUnder,
  loadAllCorpusEntries,
  loadCorpusDefaults,
  filterManifestEntries,
} from "./load-manifest";
import { computeSourceHash } from "./source-hash";

describe("corpus manifest loader", () => {
  it("loads global defaults", () => {
    const defaults = loadCorpusDefaults();
    expect(defaults.prompt_version).toBe("v1");
    expect(defaults.agent_profile).toBe("logos-passage-agent");
  });

  it("discovers section manifests under corpus/", () => {
    const paths = discoverSectionManifestPathsUnder();
    expect(paths.some((p) => p.endsWith("corpus/homer/odyssey/book-1/manifest.yaml"))).toBe(
      true,
    );
    expect(paths.some((p) => p.endsWith("corpus/plato/republic/book-1/manifest.yaml"))).toBe(
      true,
    );
    expect(paths).toHaveLength(3);
  });

  it("loads and merges all section entries with defaults", () => {
    const entries = loadAllCorpusEntries();
    expect(entries.length).toBe(28 + 444 + 611);

    const odyssey = entries.find((e) => e.work_slug === "odyssey")!;
    expect(odyssey.citation).toBe("1.1");
    expect(odyssey.generation_profile).toBe("standard");
    expect(odyssey.agent_profile).toBe("logos-passage-agent");
    expect(odyssey.prompt_version).toBe("v1");
    expect(odyssey.manifest_source).toBe(
      "corpus/homer/odyssey/book-1/manifest.yaml",
    );

    const republic = entries.filter((e) => e.work_slug === "republic");
    expect(republic).toHaveLength(28);
    expect(republic[0]?.citation).toBe("327");
    expect(republic.at(-1)?.citation).toBe("354");
  });

  it("filters by work and section", () => {
    const entries = loadAllCorpusEntries();
    const odysseyBook1 = filterManifestEntries(entries, {
      workSlug: "odyssey",
      sectionSlug: "book-1",
    });
    expect(odysseyBook1).toHaveLength(444);
    expect(odysseyBook1[0]?.citation).toBe("1.1");
    expect(odysseyBook1.at(-1)?.citation).toBe("1.444");

    const iliadBook1 = filterManifestEntries(entries, {
      workSlug: "iliad",
      sectionSlug: "book-1",
    });
    expect(iliadBook1).toHaveLength(611);
    expect(iliadBook1[0]?.citation).toBe("1.1");
    expect(iliadBook1.at(-1)?.citation).toBe("1.611");
  });

  it("computes stable source_hash for Odyssey 1.1", () => {
    const odyssey = loadAllCorpusEntries().find((e) => e.work_slug === "odyssey")!;
    const hash = computeSourceHash(odyssey);
    expect(hash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(computeSourceHash(odyssey)).toBe(hash);
  });
});
