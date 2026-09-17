import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { encodeText, openNewTab, slugify } from "./urlHelpers";

describe("encodeText", () => {
  test("should replace spaces with '+'", () => {
    expect(encodeText("hello world")).toBe("hello+world");
  });

  test("should remove colons from text", () => {
    expect(encodeText("Star Wars: Episode IV: A New Hope")).toBe(
      "Star+Wars+Episode+IV+A+New+Hope",
    );
  });

  test("should encode special characters into URI percent-encoding", () => {
    expect(encodeText("Tom & Jerry?")).toBe("Tom+%26+Jerry%3F");
  });

  test("should handle empty string", () => {
    expect(encodeText("")).toBe("");
  });

  test("should handle text without spaces or colons", () => {
    expect(encodeText("Inception")).toBe("Inception");
  });
});

describe("openNewTab", () => {
  const originalWindow = global.window;

  beforeEach(() => {
    (global as any).window = {
      open: jest.fn(),
    };
  });

  afterEach(() => {
    (global as any).window = originalWindow;
  });

  test("should open URL in a new tab with target '_blank'", () => {
    const url = "https://example.com/movie/123";
    openNewTab(url);

    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(url, "_blank");
  });
});

describe("slugify", () => {
  test("should convert string to lowercase", () => {
    expect(slugify("HELLO WORLD")).toBe("hello-world");
  });

  test("should remove leading 'the ' article", () => {
    expect(slugify("The Dark Knight")).toBe("dark-knight");
  });

  test("should remove leading 'a ' article", () => {
    expect(slugify("A Beautiful Mind")).toBe("beautiful-mind");
  });

  test("should remove leading 'an ' article", () => {
    expect(slugify("An American Werewolf in London")).toBe(
      "american-werewolf-in-london",
    );
  });

  test("should not remove article words within text or when part of another word", () => {
    expect(slugify("Theater")).toBe("theater");
    expect(slugify("Into the Wild")).toBe("into-the-wild");
    expect(slugify("Catch a Fire")).toBe("catch-a-fire");
  });

  test("should replace spaces and consecutive spaces with a single hyphen", () => {
    expect(slugify("multiple   spaces   between")).toBe(
      "multiple-spaces-between",
    );
  });

  test("should replace accented and special characters with ASCII counterparts", () => {
    expect(slugify("Příliš žluťoučký kůň")).toBe("prilis-zlutoucky-kun");
    expect(slugify("Café Über Mañana")).toBe("cafe-uber-manana");
  });

  test("should replace '&' with '-and-'", () => {
    expect(slugify("Fast & Furious")).toBe("fast-and-furious");
  });

  test("should replace separator characters (/ _ , : ; ·) with hyphens", () => {
    expect(slugify("part1/part2_part3,part4:part5;part6·part7")).toBe(
      "part1-part2-part3-part4-part5-part6-part7",
    );
  });

  test("should remove non-word characters", () => {
    expect(slugify("What If...?! (Special Edition)*")).toBe(
      "what-if-special-edition",
    );
  });

  test("should collapse multiple hyphens into a single hyphen", () => {
    expect(slugify("foo----bar")).toBe("foo-bar");
  });

  test("should trim hyphens from beginning and end of string", () => {
    expect(slugify("---hello-world---")).toBe("hello-world");
  });

  test("should handle strings with numbers", () => {
    expect(slugify("Iron Man 2")).toBe("iron-man-2");
  });

  test("should return empty string when input has no alphanumeric characters", () => {
    expect(slugify("??? !!!")).toBe("");
    expect(slugify("---")).toBe("");
  });
});
