import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import {
  getDatabase,
  remove,
  ref,
  set,
  get,
  query,
  orderByChild,
  push,
} from "firebase/database";
import Media, { Status } from "./Media";

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  remove: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  query: jest.fn(),
  orderByChild: jest.fn(),
  push: jest.fn(),
}));
const mockGetDatabase = <jest.Mock<(...args: any[]) => any>>getDatabase;
const mockRef = <jest.Mock<(...args: any[]) => any>>ref;
const mockRemove = <jest.Mock<(...args: any[]) => any>>remove;
const mockSet = <jest.Mock<(...args: any[]) => any>>set;
const mockGet = <jest.Mock<(...args: any[]) => any>>get;
const mockQuery = <jest.Mock<(...args: any[]) => any>>query;
const mockOrderByChild = <jest.Mock<(...args: any[]) => any>>orderByChild;
const mockPush = <jest.Mock<(...args: any[]) => any>>push;

class TestMedia extends Media<{ tmdb?: number; custom?: string }> {
  get mainVendorId(): string | number | null {
    return this.vendorIds?.tmdb ?? null;
  }

  get modelName(): string {
    return "testMedia";
  }

  get batchOperationConcurrencyLimit(): number {
    return 3;
  }

  get infoLinks() {
    return [];
  }

  get searchInfoLink(): string {
    return "https://example.com/search";
  }

  refresh(items: Media[]): Promise<Media[]> {
    return Promise.resolve(items);
  }
}

describe("Media", () => {
  const mockDb = { name: "mockDb" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDatabase.mockReturnValue(mockDb);
    mockRef.mockImplementation((db: any, path: any) => ({
      db,
      path,
    }));
    mockOrderByChild.mockImplementation((child: any) => ({
      child,
    }));
    mockQuery.mockImplementation((...args: any[]) => ({
      queryArgs: args,
    }));
  });

  describe("constructor", () => {
    test("should initialize with default properties when no object is passed", () => {
      const media = new TestMedia();
      expect(media.id).toBe("");
      expect(media.vendorIds).toBeNull();
      expect(media.slug).toBe("");
      expect(media.title).toBe("");
      expect(media.status).toBe(Status.DEFAULT);
      expect(media.labels).toEqual([]);
      expect(media.imageUrl).toBe("");
      expect(media.releaseDate).toBe("");
    });

    test("should assign properties when an object is passed", () => {
      const media = new TestMedia({
        id: "123",
        title: "Test Movie",
        status: Status.OWNED,
        labels: ["Sci-Fi"],
      });

      expect(media.id).toBe("123");
      expect(media.title).toBe("Test Movie");
      expect(media.status).toBe(Status.OWNED);
      expect(media.labels).toEqual(["Sci-Fi"]);
    });
  });

  describe("isReleased", () => {
    test("should return true when releaseDate is in the past", () => {
      const media = new TestMedia({ releaseDate: "2000-01-01" });
      expect(media.isReleased).toBe(true);
    });

    test("should return false when releaseDate is in the future", () => {
      const media = new TestMedia({ releaseDate: "2099-01-01" });
      expect(media.isReleased).toBe(false);
    });

    test("should return false when releaseDate is invalid", () => {
      const media = new TestMedia({ releaseDate: "invalid-date" });
      expect(media.isReleased).toBe(false);
    });

    test("should return false when releaseDate is empty", () => {
      const media = new TestMedia({ releaseDate: "" });
      expect(media.isReleased).toBe(false);
    });
  });

  describe("clone", () => {
    test("should return a new cloned instance with identical properties", () => {
      const original = new TestMedia({
        id: "abc",
        title: "Original",
        vendorIds: { tmdb: 42 },
        labels: ["Action"],
      });

      const cloned = original.clone();
      expect(cloned).not.toBe(original);
      expect(cloned).toBeInstanceOf(TestMedia);
      expect(cloned.id).toBe(original.id);
      expect(cloned.title).toBe(original.title);
      expect(cloned.vendorIds).toEqual(original.vendorIds);
      expect(cloned.labels).toEqual(original.labels);
    });

    test("should not mutate original when clone is modified", () => {
      const original = new TestMedia({
        title: "Original",
        labels: ["Action"],
      });

      const cloned = original.clone();
      cloned.title = "Modified";
      cloned.labels.push("Comedy");

      expect(original.title).toBe("Original");
      expect(original.labels).toEqual(["Action"]);
    });
  });

  describe("isEqual", () => {
    test("should return true when both instances have matching mainVendorId", () => {
      const media1 = new TestMedia({ vendorIds: { tmdb: 101 } });
      const media2 = new TestMedia({ vendorIds: { tmdb: 101 } });

      expect(media1.isEqual(media2)).toBe(true);
    });

    test("should return false when instances have different mainVendorId", () => {
      const media1 = new TestMedia({ vendorIds: { tmdb: 101 } });
      const media2 = new TestMedia({ vendorIds: { tmdb: 202 } });

      expect(media1.isEqual(media2)).toBe(false);
    });

    test("should return false when first instance has null mainVendorId", () => {
      const media1 = new TestMedia();
      const media2 = new TestMedia({ vendorIds: { tmdb: 101 } });

      expect(media1.isEqual(media2)).toBe(false);
    });

    test("should return false when second instance has null mainVendorId", () => {
      const media1 = new TestMedia({ vendorIds: { tmdb: 101 } });
      const media2 = new TestMedia();

      expect(media1.isEqual(media2)).toBe(false);
    });
  });

  describe("display", () => {
    test("should return true when filter is empty", () => {
      const media = new TestMedia({ title: "Inception" });
      expect(media.display({})).toBe(true);
    });

    test("should filter by isReleased correctly", () => {
      const releasedMedia = new TestMedia({ releaseDate: "2000-01-01" });
      const unreleasedMedia = new TestMedia({ releaseDate: "2099-01-01" });

      expect(releasedMedia.display({ isReleased: true })).toBe(true);
      expect(releasedMedia.display({ isReleased: false })).toBe(false);
      expect(unreleasedMedia.display({ isReleased: true })).toBe(false);
      expect(unreleasedMedia.display({ isReleased: false })).toBe(true);
    });

    test("should filter by status correctly", () => {
      const media = new TestMedia({ status: Status.OWNED });

      expect(media.display({ status: Status.OWNED })).toBe(true);
      expect(media.display({ status: Status.DOWNLOADABLE })).toBe(false);
    });

    test("should filter by text matching label", () => {
      const media = new TestMedia({
        title: "The Dark Knight",
        labels: ["Favorite", "DC"],
      });

      expect(media.display({ text: "Favorite" })).toBe(true);
      expect(media.display({ text: "DC" })).toBe(true);
    });

    test("should filter by text matching title case-insensitively", () => {
      const media = new TestMedia({
        title: "The Dark Knight",
        labels: [],
      });

      expect(media.display({ text: "dark" })).toBe(true);
      expect(media.display({ text: "THE DARK KNIGHT" })).toBe(true);
    });

    test("should return false when text does not match title or labels", () => {
      const media = new TestMedia({
        title: "The Dark Knight",
        labels: ["Action"],
      });

      expect(media.display({ text: "Comedy" })).toBe(false);
    });

    test("should combine multiple filter criteria", () => {
      const media = new TestMedia({
        title: "Interstellar",
        status: Status.OWNED,
        releaseDate: "2014-11-07",
        labels: ["Sci-Fi"],
      });

      expect(
        media.display({
          status: Status.OWNED,
          isReleased: true,
          text: "inter",
        }),
      ).toBe(true);

      expect(
        media.display({
          status: Status.DOWNLOADABLE,
          isReleased: true,
          text: "inter",
        }),
      ).toBe(false);
    });
  });

  describe("fetchItemsFromExternalSource", () => {
    test("should return null by default", async () => {
      const media = new TestMedia();
      expect(await media.fetchItemsFromExternalSource()).toBeNull();
    });
  });

  describe("save", () => {
    test("should push new item to database and assign id when id is empty", async () => {
      mockPush.mockResolvedValue({ key: "new_key_123" });

      const media = new TestMedia({
        title: "New Item",
        vendorIds: { tmdb: 99 },
      });

      await media.save();

      expect(mockPush).toHaveBeenCalledWith(
        { db: mockDb, path: "/Media/testMedia" },
        {
          slug: "new-item",
          vendorIds: { tmdb: 99 },
          title: "New Item",
          status: Status.DEFAULT,
          labels: [],
          imageUrl: "",
          releaseDate: "",
        },
      );
      expect(media.id).toBe("new_key_123");
    });

    test("should handle push when returned key is undefined", async () => {
      mockPush.mockResolvedValue({ key: undefined });

      const media = new TestMedia({ title: "No Key" });
      await media.save();

      expect(media.id).toBe("");
    });

    test("should set existing item in database at specific path when id is present", async () => {
      mockSet.mockResolvedValue(undefined);

      const media = new TestMedia({
        id: "existing_id",
        slug: "existing-slug",
        title: "Existing Item",
        status: Status.DOWNLOADABLE,
      });

      await media.save();

      expect(mockSet).toHaveBeenCalledWith(
        { db: mockDb, path: "/Media/testMedia/existing_id" },
        {
          slug: "existing-slug",
          vendorIds: null,
          title: "Existing Item",
          status: Status.DOWNLOADABLE,
          labels: [],
          imageUrl: "",
          releaseDate: "",
        },
      );
    });
  });

  describe("delete", () => {
    test("should resolve immediately without calling remove when id is empty", async () => {
      const media = new TestMedia();
      await media.delete();

      expect(remove).not.toHaveBeenCalled();
    });

    test("should call remove with the correct database path when id is present", async () => {
      mockRemove.mockResolvedValue(undefined);

      const media = new TestMedia({ id: "item_to_delete" });
      await media.delete();

      expect(mockRemove).toHaveBeenCalledWith({
        db: mockDb,
        path: "/Media/testMedia/item_to_delete",
      });
    });
  });

  describe("fetchAll", () => {
    test("should return empty array when snapshot does not exist", async () => {
      mockGet.mockResolvedValue({
        exists: () => false,
      });

      const result = await Media.fetchAll(TestMedia);

      expect(mockRef).toHaveBeenCalledWith(mockDb, "/Media/testMedia");
      expect(mockOrderByChild).toHaveBeenCalledWith("slug");
      expect(result).toEqual([]);
    });

    test("should return instances of mediaType populated with data and keys when snapshot exists", async () => {
      const mockChildren = [
        {
          key: "id_1",
          val: () => ({ title: "Movie 1", slug: "movie-1" }),
        },
        {
          key: "id_2",
          val: () => ({ title: "Movie 2", slug: "movie-2" }),
        },
      ];

      mockGet.mockResolvedValue({
        exists: () => true,
        forEach: (callback: (child: any) => void) => {
          mockChildren.forEach(callback);
        },
      });

      const result = await Media.fetchAll(TestMedia);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(TestMedia);
      expect(result[0].id).toBe("id_1");
      expect(result[0].title).toBe("Movie 1");
      expect(result[1]).toBeInstanceOf(TestMedia);
      expect(result[1].id).toBe("id_2");
      expect(result[1].title).toBe("Movie 2");
    });
  });
});
