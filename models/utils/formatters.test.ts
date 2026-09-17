import { describe, test, expect } from "@jest/globals";
import type Media from "@/models/Media";
import { formatDate, slugToAlphabet, colorToHexAlpha } from "./formatters";

describe("formatDate", () => {
  test("should return TBA when date is not defined", () => {
    expect(formatDate(undefined)).toBe("TBA");
    expect(formatDate(null as any)).toBe("TBA");
    expect(formatDate("")).toBe("TBA");
  });

  test("should format Date instance using cs-CZ locale", () => {
    const d = new Date(2023, 0, 15);
    expect(formatDate(d)).toBe("15. 1. 2023");
  });

  test("should format valid ISO date string using cs-CZ locale", () => {
    const isoString = "2023-01-15T12:00:00.000Z";
    expect(formatDate(isoString)).toBe("15. 1. 2023");
  });

  test("should format quarter string YYYY-Q# into Q# YYYY", () => {
    expect(formatDate("2023-Q1")).toBe("Q1 2023");
    expect(formatDate("2024-Q2")).toBe("Q2 2024");
    expect(formatDate("2025-Q3")).toBe("Q3 2025");
    expect(formatDate("2026-Q4")).toBe("Q4 2026");
  });

  test("should return string representation when string is an invalid date not matching quarter pattern", () => {
    expect(formatDate("upcoming-release")).toBe("upcoming-release");
  });

  test("should return string representation for invalid Date object", () => {
    const invalidDate = new Date("invalid date string");
    expect(formatDate(invalidDate)).toBe("Invalid Date");
  });

  test("should return TBA when date.toString() is nullish", () => {
    const customDateObj = {
      valueOf: () => NaN,
      toString: () => undefined as any,
    };
    expect(formatDate(customDateObj as any)).toBe("TBA");
  });
});

describe("slugToAlphabet", () => {
  test("should return the first letter for slug starting with lowercase letter", () => {
    const model = { slug: "avatar" } as Media;
    expect(slugToAlphabet(model)).toBe("a");
  });

  test("should return the first letter for slug starting with uppercase letter", () => {
    const model = { slug: "Batman" } as Media;
    expect(slugToAlphabet(model)).toBe("B");
  });

  test("should return '#' when slug starts with a number", () => {
    let model = { slug: "1917" } as Media;
    expect(slugToAlphabet(model)).toBe("#");
    model = { slug: "007-no-time-to-die" } as Media;
    expect(slugToAlphabet(model)).toBe("#");
  });

  test("should return non-numeric character when slug starts with special character", () => {
    const model = { slug: "!special" } as Media;
    expect(slugToAlphabet(model)).toBe("!");
  });

  test("should return empty string when slug is empty", () => {
    const model = { slug: "" } as Media;
    expect(slugToAlphabet(model)).toBe("");
  });
});

describe("colorToHexAlpha", () => {
  test.each`
    hex          | alpha   | expectedHex
    ${"#000000"} | ${0}    | ${"#00000000"}
    ${"#ffffff"} | ${1}    | ${"#ffffffff"}
    ${"#123456"} | ${0.2}  | ${"#12345633"}
    ${"#ff0000"} | ${0.5}  | ${"#ff000080"}
    ${"#abcdef"} | ${0.75} | ${"#abcdefbf"}
  `(
    "should return $expectedHex for $hex and alpha $alpha",
    ({ hex, alpha, expectedHex }) => {
      expect(colorToHexAlpha(hex as string, alpha as number)).toBe(expectedHex);
    },
  );

  test("should work with color strings without hash symbol", () => {
    expect(colorToHexAlpha("123456", 1)).toBe("123456ff");
  });
});
