import { describe, test, expect } from "@jest/globals";
import { reducer, initialState, ReducerValue } from "./useContextData";
import Media, { Status } from "@/models/Media";
import { MediaContextItem } from "./context";

class TestMedia extends Media {
  get mainVendorId(): string | number | null {
    return this.id;
  }
  get modelName(): string {
    return "test";
  }
  get batchOperationConcurrencyLimit(): number {
    return 10;
  }
  get infoLinks() {
    return [];
  }
  get searchInfoLink(): string {
    return "";
  }
  refresh(items: Media[]): Promise<Media[]> {
    return Promise.resolve(items);
  }
}

describe("useContextData reducer", () => {
  describe("load action", () => {
    test("should populate items and set loading to false when state was loading", () => {
      const media1 = new TestMedia({ id: "1", title: "Movie 1" });
      const media2 = new TestMedia({ id: "2", title: "Movie 2" });

      const nextState = reducer(initialState, {
        type: "load",
        mediaItems: [media1, media2],
      });

      expect(nextState.loading).toBe(false);
      expect(nextState.selectedItems.size).toBe(0);
      expect(nextState.items).toEqual([
        { id: "1", display: true, model: media1 },
        { id: "2", display: true, model: media2 },
      ]);
    });

    test("should preserve existing items when not loading and override is not specified", () => {
      const existingMedia = new TestMedia({ id: "1", title: "Existing" });
      const currentState: ReducerValue = {
        loading: false,
        items: [{ id: "1", display: true, model: existingMedia }],
        selectedItems: new Set([existingMedia]),
      };

      const newMedia = new TestMedia({ id: "2", title: "New" });
      const nextState = reducer(currentState, {
        type: "load",
        mediaItems: [newMedia],
      });

      expect(nextState.loading).toBe(false);
      expect(nextState.selectedItems.size).toBe(0);
      expect(nextState.items).toBe(currentState.items);
    });

    test("should overwrite items when not loading but override is true", () => {
      const existingMedia = new TestMedia({ id: "1", title: "Existing" });
      const currentState: ReducerValue = {
        loading: false,
        items: [{ id: "1", display: true, model: existingMedia }],
        selectedItems: new Set([existingMedia]),
      };

      const newMedia = new TestMedia({ id: "2", title: "Overridden" });
      const nextState = reducer(currentState, {
        type: "load",
        mediaItems: [newMedia],
        override: true,
      });

      expect(nextState.loading).toBe(false);
      expect(nextState.selectedItems.size).toBe(0);
      expect(nextState.items).toEqual([
        { id: "2", display: true, model: newMedia },
      ]);
    });
  });

  describe("add action", () => {
    test("should prepend item to the beginning of the items list", () => {
      const item1: MediaContextItem = {
        id: "1",
        display: true,
        model: new TestMedia({ id: "1" }),
      };
      const item2: MediaContextItem = {
        id: "2",
        display: true,
        model: new TestMedia({ id: "2" }),
      };
      const currentState: ReducerValue = {
        loading: false,
        items: [item1],
        selectedItems: new Set(),
      };

      const nextState = reducer(currentState, { type: "add", item: item2 });

      expect(nextState.items).toEqual([item2, item1]);
      expect(nextState.loading).toBe(false);
    });
  });

  describe("remove action", () => {
    test("should remove item with matching id from items list", () => {
      const item1: MediaContextItem = {
        id: "1",
        display: true,
        model: new TestMedia({ id: "1" }),
      };
      const item2: MediaContextItem = {
        id: "2",
        display: true,
        model: new TestMedia({ id: "2" }),
      };
      const currentState: ReducerValue = {
        loading: false,
        items: [item1, item2],
        selectedItems: new Set(),
      };

      const nextState = reducer(currentState, { type: "remove", id: "1" });

      expect(nextState.items).toEqual([item2]);
    });
  });

  describe("update action", () => {
    test("should update matching item with cloned model", () => {
      const item1: MediaContextItem = {
        id: "1",
        display: true,
        model: new TestMedia({ id: "1", title: "Original" }),
      };
      const item2: MediaContextItem = {
        id: "2",
        display: true,
        model: new TestMedia({ id: "2", title: "Other" }),
      };
      const currentState: ReducerValue = {
        loading: false,
        items: [item1, item2],
        selectedItems: new Set(),
      };

      const updatedItem1: MediaContextItem = {
        id: "1",
        display: false,
        model: new TestMedia({ id: "1", title: "Updated Title" }),
      };

      const nextState = reducer(currentState, {
        type: "update",
        item: updatedItem1,
      });

      expect(nextState.items[0].id).toBe("1");
      expect(nextState.items[0].display).toBe(false);
      expect(nextState.items[0].model.title).toBe("Updated Title");
      expect(nextState.items[0].model).not.toBe(updatedItem1.model);
      expect(nextState.items[1]).toBe(item2);
    });
  });

  describe("filter action", () => {
    test("should update display property based on model.display result", () => {
      const media1 = new TestMedia({
        id: "1",
        title: "Matrix",
        status: Status.OWNED,
      });
      const media2 = new TestMedia({
        id: "2",
        title: "Alien",
        status: Status.DEFAULT,
      });

      const currentState: ReducerValue = {
        loading: false,
        items: [
          { id: "1", display: true, model: media1 },
          { id: "2", display: true, model: media2 },
        ],
        selectedItems: new Set(),
      };

      const nextState = reducer(currentState, {
        type: "filter",
        text: "Alien",
      });

      expect(nextState.items[0].display).toBe(false);
      expect(nextState.items[1].display).toBe(true);
    });

    test("should not recreate item object when display property does not change", () => {
      const media1 = new TestMedia({ id: "1", title: "Matrix" });
      const item1: MediaContextItem = { id: "1", display: true, model: media1 };
      const currentState: ReducerValue = {
        loading: false,
        items: [item1],
        selectedItems: new Set(),
      };

      const nextState = reducer(currentState, {
        type: "filter",
        text: "Matrix",
      });

      expect(nextState.items[0]).toBe(item1);
    });
  });

  describe("toggleSelect action", () => {
    test("should clear selectedItems when item is null", () => {
      const media1 = new TestMedia({ id: "1" });
      const currentState: ReducerValue = {
        loading: false,
        items: [],
        selectedItems: new Set([media1]),
      };

      const nextState = reducer(currentState, {
        type: "toggleSelect",
        item: null,
      });

      expect(nextState.selectedItems.size).toBe(0);
    });

    test("should add item when not previously in selectedItems", () => {
      const media1 = new TestMedia({ id: "1" });
      const currentState: ReducerValue = {
        loading: false,
        items: [],
        selectedItems: new Set(),
      };

      const nextState = reducer(currentState, {
        type: "toggleSelect",
        item: media1,
      });

      expect(nextState.selectedItems.has(media1)).toBe(true);
      expect(nextState.selectedItems.size).toBe(1);
    });

    test("should remove item when already in selectedItems", () => {
      const media1 = new TestMedia({ id: "1" });
      const currentState: ReducerValue = {
        loading: false,
        items: [],
        selectedItems: new Set([media1]),
      };

      const nextState = reducer(currentState, {
        type: "toggleSelect",
        item: media1,
      });

      expect(nextState.selectedItems.has(media1)).toBe(false);
      expect(nextState.selectedItems.size).toBe(0);
    });
  });

  describe("default / unknown action", () => {
    test("should throw an error when an unknown action type is provided", () => {
      expect(() => {
        reducer(initialState, { type: "unknown" } as any);
      }).toThrow("Unknown action type");
    });
  });
});
