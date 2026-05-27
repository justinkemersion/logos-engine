import { describe, expect, it } from "vitest";
import { citationInRange, extractGreekPlainText } from "./scaife";

describe("scaife", () => {
  it("filters epic citations by range", () => {
    expect(citationInRange("1.5", "1.1", "1.10")).toBe(true);
    expect(citationInRange("1.1", "1.2", "1.10")).toBe(false);
    expect(citationInRange("327", "327", "331")).toBe(true);
    expect(citationInRange("326", "327", "331")).toBe(false);
  });

  it("extracts plain Greek from word tokens", () => {
    const text = extractGreekPlainText({
      word_tokens: [
        { t: "w", w: "Κατέβην" },
        { t: "w", w: "χθὲς" },
        { t: "w", w: "εἰς" },
      ],
    });
    expect(text).toBe("Κατέβην χθὲς εἰς");
  });
});
