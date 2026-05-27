export type ScaifeEditionKey = "republic" | "odyssey" | "iliad";

export const SCAIFE_EDITIONS: Record<
  ScaifeEditionKey,
  { baseUrl: string; readerUrl: string }
> = {
  republic: {
    baseUrl:
      "https://scaife.perseus.org/library/passage/urn:cts:greekLit:tlg0059.tlg030.perseus-grc2",
    readerUrl:
      "https://scaife.perseus.org/reader/urn:cts:greekLit:tlg0059.tlg030.perseus-grc2:0",
  },
  odyssey: {
    baseUrl:
      "https://scaife.perseus.org/library/passage/urn:cts:greekLit:tlg0012.tlg002.perseus-grc2",
    readerUrl:
      "https://scaife.perseus.org/reader/urn:cts:greekLit:tlg0012.tlg002.perseus-grc2:1",
  },
  iliad: {
    baseUrl:
      "https://scaife.perseus.org/library/passage/urn:cts:greekLit:tlg0012.tlg001.perseus-grc2",
    readerUrl:
      "https://scaife.perseus.org/reader/urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1",
  },
};

export type ScaifeWordToken = {
  t?: string;
  w?: string;
};

export type ScaifePassageJson = {
  urn?: string;
  word_tokens?: ScaifeWordToken[];
  children?: { reference: string; lsb?: string }[];
};

export type EpicLineRef = {
  citation: string;
  sectionRef: string;
  line: number;
};

export function scaifePassageJsonUrl(
  edition: ScaifeEditionKey,
  sectionRef: string,
): string {
  return `${SCAIFE_EDITIONS[edition].baseUrl}:${sectionRef}/json/`;
}

export function extractGreekPlainText(data: ScaifePassageJson): string {
  const tokens = data.word_tokens ?? [];
  const words = tokens
    .filter((token) => token.t === "w" && token.w)
    .map((token) => token.w!);
  return words.join(" ").replace(/\s+/g, " ").trim();
}

export async function fetchScaifePassage(
  edition: ScaifeEditionKey,
  sectionRef: string,
  options?: { retries?: number; delayMs?: number },
): Promise<string> {
  const retries = options?.retries ?? 3;
  const delayMs = options?.delayMs ?? 400;
  const url = scaifePassageJsonUrl(edition, sectionRef);

  let lastError: Error | undefined;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${sectionRef}`);
      }
      const data = (await response.json()) as ScaifePassageJson;
      const text = extractGreekPlainText(data);
      if (!text) {
        throw new Error(`No Greek tokens in response for ${sectionRef}`);
      }
      return text;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${sectionRef}`);
}

export async function fetchBookChildren(
  edition: ScaifeEditionKey,
  bookSectionRef: string,
): Promise<ScaifePassageJson["children"]> {
  const url = scaifePassageJsonUrl(edition, bookSectionRef);
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} loading ${bookSectionRef}`);
  }
  const data = (await response.json()) as ScaifePassageJson;
  return data.children ?? [];
}

export async function fetchEpicBookLineRefs(
  edition: "odyssey" | "iliad",
  bookNum = 1,
): Promise<EpicLineRef[]> {
  const children = (await fetchBookChildren(edition, String(bookNum))) ?? [];
  return children
    .map((child) => {
      const line = Number.parseInt(String(child.lsb ?? child.reference.split(".")[1]), 10);
      const citation = `${bookNum}.${line}`;
      return {
        citation,
        sectionRef: citation,
        line,
      };
    })
    .filter((ref) => Number.isFinite(ref.line))
    .sort((a, b) => a.line - b.line);
}

export async function fetchRepublicBook1PageNumbers(): Promise<number[]> {
  const children = (await fetchBookChildren("republic", "1")) ?? [];
  return children
    .map((child) => child.lsb ?? child.reference.split(".")[1])
    .map((value) => Number.parseInt(String(value), 10))
    .filter((page) => Number.isFinite(page))
    .sort((a, b) => a - b);
}

export function parseEpicCitation(citation: string): { book: number; line: number } {
  const parts = citation.split(".");
  const book = Number.parseInt(parts[0] ?? "1", 10);
  const line = Number.parseInt(parts[1] ?? "0", 10);
  return { book, line };
}

export function compareEpicCitations(a: string, b: string): number {
  const left = parseEpicCitation(a);
  const right = parseEpicCitation(b);
  if (left.book !== right.book) {
    return left.book - right.book;
  }
  return left.line - right.line;
}

export function compareCitation(a: string, b: string): number {
  if (a.includes(".") || b.includes(".")) {
    return compareEpicCitations(a, b);
  }
  return Number.parseInt(a, 10) - Number.parseInt(b, 10);
}

export function citationInRange(
  citation: string,
  from?: string,
  to?: string,
): boolean {
  if (from && compareCitation(citation, from) < 0) {
    return false;
  }
  if (to && compareCitation(citation, to) > 0) {
    return false;
  }
  return true;
}
