import { describe, test, expect } from "@jest/globals";
import type Media from "@/models/Media";
import Labels from "./Labels";

describe("Labels", () => {
  test("should initialize with an empty labels map", () => {
    const labels = new Labels();
    expect(labels.labels.size).toBe(0);
    expect(labels.toArray()).toEqual([]);
  });

  describe("toArray", () => {
    test("should return an empty array when labels map is empty", () => {
      const labels = new Labels();
      expect(labels.toArray()).toEqual([]);
    });

    test("should return an array of label keys", () => {
      const labels = new Labels();
      labels.labels.set("Action", 2);
      labels.labels.set("Comedy", 1);

      expect(labels.toArray()).toEqual(["Action", "Comedy"]);
    });
  });

  describe("createNewLabel", () => {
    test("should capitalize single word label", () => {
      expect(Labels.createNewLabel("action")).toBe("Action");
    });

    test("should capitalize and join words separated by spaces", () => {
      expect(Labels.createNewLabel("sci fi")).toBe("SciFi");
    });

    test("should capitalize and join words separated by hyphens", () => {
      expect(Labels.createNewLabel("post-apocalyptic")).toBe("PostApocalyptic");
    });

    test("should capitalize and join words separated by underscores", () => {
      expect(Labels.createNewLabel("dark_comedy")).toBe("DarkComedy");
    });

    test("should handle strings with multiple mixed separators", () => {
      expect(Labels.createNewLabel("first_order-star wars")).toBe(
        "FirstOrderStarWars",
      );
    });
  });

  describe("clone", () => {
    test("should return a new Labels instance with identical entries", () => {
      const original = new Labels();
      original.labels.set("Drama", 3);
      original.labels.set("Thriller", 1);

      const cloned = original.clone();
      expect(cloned).not.toBe(original);
      expect(cloned.labels).not.toBe(original.labels);
      expect(cloned.toArray()).toEqual(original.toArray());
      expect(cloned.labels.get("Drama")).toBe(3);
    });

    test("should not mutate original Labels when clone is updated", () => {
      const original = new Labels();
      original.labels.set("Drama", 2);

      const cloned = original.clone();
      cloned.update([["Drama", 1]]);

      expect(cloned.labels.get("Drama")).toBe(3);
      expect(original.labels.get("Drama")).toBe(2);
    });
  });

  describe("update", () => {
    test("should add new labels with positive count", () => {
      const labels = new Labels();
      labels.update([["SciFi", 2]]);

      expect(labels.labels.get("SciFi")).toBe(2);
    });

    test("should increment existing label count", () => {
      const labels = new Labels();
      labels.labels.set("Horror", 2);

      labels.update([["Horror", 3]]);
      expect(labels.labels.get("Horror")).toBe(5);
    });

    test("should decrement existing label count", () => {
      const labels = new Labels();
      labels.labels.set("Comedy", 5);

      labels.update([["Comedy", -2]]);
      expect(labels.labels.get("Comedy")).toBe(3);
    });

    test("should delete label when count reaches 0", () => {
      const labels = new Labels();
      labels.labels.set("Documentary", 2);

      labels.update([["Documentary", -2]]);
      expect(labels.labels.has("Documentary")).toBe(false);
      expect(labels.toArray()).toEqual([]);
    });

    test("should delete label when count drops below 0", () => {
      const labels = new Labels();
      labels.labels.set("Western", 1);

      labels.update([["Western", -3]]);
      expect(labels.labels.has("Western")).toBe(false);
    });

    test("should process multiple updates in order", () => {
      const labels = new Labels();
      labels.labels.set("Action", 2);

      labels.update([
        ["Action", -1],
        ["Adventure", 3],
        ["Drama", 1],
      ]);

      expect(labels.labels.get("Action")).toBe(1);
      expect(labels.labels.get("Adventure")).toBe(3);
      expect(labels.labels.get("Drama")).toBe(1);
    });
  });

  describe("set", () => {
    test("should populate label occurrence counts from media array", () => {
      const labels = new Labels();
      const mediaList = [
        { labels: ["Action", "SciFi"] } as Media,
        { labels: ["Action", "Adventure"] } as Media,
        { labels: ["SciFi"] } as Media,
      ];

      labels.set(mediaList);

      expect(labels.labels.get("Action")).toBe(2);
      expect(labels.labels.get("SciFi")).toBe(2);
      expect(labels.labels.get("Adventure")).toBe(1);
      expect(labels.labels.size).toBe(3);
    });

    test("should handle media items with empty labels arrays", () => {
      const labels = new Labels();
      const mediaList = [
        { labels: [] as string[] } as Media,
        { labels: ["Romance"] } as Media,
      ];

      labels.set(mediaList);

      expect(labels.labels.get("Romance")).toBe(1);
      expect(labels.labels.size).toBe(1);
    });

    test("should reset labels when media list is empty", () => {
      const labels = new Labels();
      labels.labels.set("OldLabel", 5);

      labels.set([]);

      expect(labels.labels.size).toBe(0);
      expect(labels.toArray()).toEqual([]);
    });

    test("should overwrite any previously existing labels", () => {
      const labels = new Labels();
      labels.labels.set("PreExisting", 10);

      const mediaList = [{ labels: ["New"] } as Media];
      labels.set(mediaList);

      expect(labels.labels.has("PreExisting")).toBe(false);
      expect(labels.labels.get("New")).toBe(1);
    });
  });
});
