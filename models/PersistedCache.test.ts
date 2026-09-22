import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { PersistedCache } from "./PersistedCache";

class MockMediaModel {
  modelName = "MockMedia";
  title: string;

  constructor(obj?: any) {
    this.title = obj?.title ?? "";
  }
}

describe("PersistedCache", () => {
  const originalIndexedDB = (global as any).indexedDB;
  let mockDb: any;
  let mockStore: any;
  let mockOpenRequest: any;

  beforeEach(() => {
    mockStore = {
      get: jest.fn(),
      put: jest.fn(),
    };

    mockDb = {
      close: jest.fn(),
      transaction: jest.fn().mockReturnValue({
        objectStore: jest.fn().mockReturnValue(mockStore),
      }),
      objectStoreNames: {
        contains: jest.fn().mockReturnValue(false),
      },
      deleteObjectStore: jest.fn(),
      createObjectStore: jest.fn(),
    };

    mockOpenRequest = {
      result: mockDb,
      error: null,
      onsuccess: null as any,
      onerror: null as any,
      onupgradeneeded: null as any,
    };

    (global as any).indexedDB = {
      open: jest.fn().mockImplementation(() => {
        queueMicrotask(() => {
          if (mockOpenRequest.onsuccess) {
            mockOpenRequest.onsuccess({} as any);
          }
        });
        return mockOpenRequest;
      }),
    };
  });

  afterEach(() => {
    (global as any).indexedDB = originalIndexedDB;
  });

  describe("constructor", () => {
    test("should store the mediaModel reference", () => {
      const cache = new PersistedCache(MockMediaModel as any);
      expect(cache.mediaModel).toBe(MockMediaModel);
    });
  });

  describe("get", () => {
    test("should return instantiated mediaModel items from cache store", async () => {
      mockStore.get.mockImplementation(() => {
        const req: any = {
          result: {
            model: "MockMedia",
            items: [{ title: "Item 1" }, { title: "Item 2" }],
          },
        };
        queueMicrotask(() => req.onsuccess && req.onsuccess());
        return req;
      });

      const cache = new PersistedCache(MockMediaModel as any);
      const items = await cache.get();

      expect(items).toHaveLength(2);
      expect(items[0]).toBeInstanceOf(MockMediaModel);
      expect(items[0].title).toBe("Item 1");
      expect(items[1].title).toBe("Item 2");
      expect(mockStore.get).toHaveBeenCalledWith("MockMedia");
      expect(mockDb.close).toHaveBeenCalledTimes(1);
    });

    test("should return an empty array when cache result or items are missing", async () => {
      mockStore.get.mockImplementation(() => {
        const req: any = { result: null };
        queueMicrotask(() => req.onsuccess && req.onsuccess());
        return req;
      });

      const cache = new PersistedCache(MockMediaModel as any);
      const items = await cache.get();

      expect(items).toEqual([]);
      expect(mockDb.close).toHaveBeenCalledTimes(1);
    });

    test("should close database connection and reject when request errors", async () => {
      const dbError = new Error("IndexedDB read error");
      mockStore.get.mockImplementation(() => {
        const req: any = { error: dbError };
        queueMicrotask(() => req.onerror && req.onerror());
        return req;
      });

      const cache = new PersistedCache(MockMediaModel as any);
      await expect(cache.get()).rejects.toThrow("IndexedDB read error");
      expect(mockDb.close).toHaveBeenCalledTimes(1);
    });
  });

  describe("set", () => {
    test("should put payload with model name and items into media store", async () => {
      mockStore.put.mockImplementation(() => {
        const req: any = {};
        queueMicrotask(() => req.onsuccess && req.onsuccess());
        return req;
      });

      const cache = new PersistedCache(MockMediaModel as any);
      const items = [new MockMediaModel({ title: "Stored 1" })];
      await cache.set(items as any);

      expect(mockDb.transaction).toHaveBeenCalledWith("media", "readwrite");
      expect(mockStore.put).toHaveBeenCalledWith({
        model: "MockMedia",
        items,
      });
      expect(mockDb.close).toHaveBeenCalledTimes(1);
    });

    test("should close database connection and reject when put errors", async () => {
      const putError = new Error("IndexedDB put error");
      mockStore.put.mockImplementation(() => {
        const req: any = { error: putError };
        queueMicrotask(() => req.onerror && req.onerror());
        return req;
      });

      const cache = new PersistedCache(MockMediaModel as any);
      await expect(cache.set([] as any)).rejects.toThrow("IndexedDB put error");
      expect(mockDb.close).toHaveBeenCalledTimes(1);
    });
  });

  describe("connect / onupgradeneeded", () => {
    test("should create object store with keyPath model if version increases", async () => {
      (global as any).indexedDB.open = jest.fn().mockImplementation(() => {
        queueMicrotask(() => {
          if (mockOpenRequest.onupgradeneeded) {
            mockOpenRequest.onupgradeneeded({
              oldVersion: 0,
              newVersion: 1,
            } as any);
          }
          if (mockOpenRequest.onsuccess) {
            mockOpenRequest.onsuccess({} as any);
          }
        });
        return mockOpenRequest;
      });

      mockStore.get.mockImplementation(() => {
        const req: any = { result: null };
        queueMicrotask(() => req.onsuccess && req.onsuccess());
        return req;
      });

      const cache = new PersistedCache(MockMediaModel as any);
      await cache.get();

      expect(mockDb.createObjectStore).toHaveBeenCalledWith("media", {
        keyPath: "model",
      });
    });

    test("should delete existing object store before creating new one if it already exists", async () => {
      mockDb.objectStoreNames.contains.mockReturnValue(true);

      (global as any).indexedDB.open = jest.fn().mockImplementation(() => {
        queueMicrotask(() => {
          if (mockOpenRequest.onupgradeneeded) {
            mockOpenRequest.onupgradeneeded({
              oldVersion: 0,
              newVersion: 1,
            } as any);
          }
          if (mockOpenRequest.onsuccess) {
            mockOpenRequest.onsuccess({} as any);
          }
        });
        return mockOpenRequest;
      });

      mockStore.get.mockImplementation(() => {
        const req: any = { result: null };
        queueMicrotask(() => req.onsuccess && req.onsuccess());
        return req;
      });

      const cache = new PersistedCache(MockMediaModel as any);
      await cache.get();

      expect(mockDb.deleteObjectStore).toHaveBeenCalledWith("media");
      expect(mockDb.createObjectStore).toHaveBeenCalledWith("media", {
        keyPath: "model",
      });
    });

    test("should do nothing on upgrade when oldVersion is greater than or equal to newVersion", async () => {
      (global as any).indexedDB.open = jest.fn().mockImplementation(() => {
        queueMicrotask(() => {
          if (mockOpenRequest.onupgradeneeded) {
            mockOpenRequest.onupgradeneeded({
              oldVersion: 2,
              newVersion: 1,
            } as any);
          }
          if (mockOpenRequest.onsuccess) {
            mockOpenRequest.onsuccess({} as any);
          }
        });
        return mockOpenRequest;
      });

      mockStore.get.mockImplementation(() => {
        const req: any = { result: null };
        queueMicrotask(() => req.onsuccess && req.onsuccess());
        return req;
      });

      const cache = new PersistedCache(MockMediaModel as any);
      await cache.get();

      expect(mockDb.createObjectStore).not.toHaveBeenCalled();
      expect(mockDb.deleteObjectStore).not.toHaveBeenCalled();
    });

    test("should fallback to 0 when newVersion is nullish on upgrade", async () => {
      (global as any).indexedDB.open = jest.fn().mockImplementation(() => {
        queueMicrotask(() => {
          if (mockOpenRequest.onupgradeneeded) {
            mockOpenRequest.onupgradeneeded({
              oldVersion: 1,
              newVersion: undefined,
            } as any);
          }
          if (mockOpenRequest.onsuccess) {
            mockOpenRequest.onsuccess({} as any);
          }
        });
        return mockOpenRequest;
      });

      mockStore.get.mockImplementation(() => {
        const req: any = { result: null };
        queueMicrotask(() => req.onsuccess && req.onsuccess());
        return req;
      });

      const cache = new PersistedCache(MockMediaModel as any);
      await cache.get();

      expect(mockDb.createObjectStore).not.toHaveBeenCalled();
      expect(mockDb.deleteObjectStore).not.toHaveBeenCalled();
    });

    test("should reject when indexedDB open request errors", async () => {
      const openError = new Error("Failed to open database");
      (global as any).indexedDB.open = jest.fn().mockImplementation(() => {
        const req: any = { error: openError };
        queueMicrotask(() => req.onerror && req.onerror());
        return req;
      });

      const cache = new PersistedCache(MockMediaModel as any);
      await expect(cache.get()).rejects.toThrow("Failed to open database");
    });
  });
});
