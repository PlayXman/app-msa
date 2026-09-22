import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import { get, getDatabase, ref, set } from "firebase/database";
import { Vendors } from "./Vendors";

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
}));
const mockGetDatabase = <jest.Mock<() => any>>getDatabase;
const mockRef = <jest.Mock<any>>ref;
const mockGet = <jest.Mock<(...args: unknown[]) => any>>get;
const mockSet = <jest.Mock<(...args: unknown[]) => any>>set;

describe("Vendors", () => {
  const mockDb = { name: "mockDb" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDatabase.mockReturnValue(mockDb);
    mockRef.mockImplementation((db: any, path: any) => ({
      db,
      path,
    }));
  });

  describe("constructor", () => {
    test("should store the vendor name", () => {
      const vendor = new Vendors("tmdb");
      expect(vendor.name).toBe("tmdb");
    });
  });

  describe("get", () => {
    test("should return data when snapshot exists", () => {
      const snapshotMock = {
        exists: () => true,
        val: () => ({ apiKey: "12345" }),
      };
      mockGet.mockResolvedValue(snapshotMock);

      const vendor = new Vendors("tmdb");
      return expect(vendor.get("apiKey")).resolves.toEqual({
        apiKey: "12345",
      });
    });

    test("should return null when snapshot does not exist", () => {
      const snapshotMock = {
        exists: () => false,
        val: () => null,
      };
      mockGet.mockResolvedValue(snapshotMock);

      const vendor = new Vendors("steam");
      return expect(vendor.get("nonExistentKey")).resolves.toBeNull();
    });

    test("should query database at 'Vendors/{name}/{path}' using getDatabase() instance", async () => {
      const snapshotMock = {
        exists: () => true,
        val: () => "val",
      };
      mockGet.mockResolvedValue(snapshotMock);

      const vendor = new Vendors("csfd");
      await vendor.get("credentials/secret");

      expect(mockGetDatabase).toHaveBeenCalled();
      expect(mockRef).toHaveBeenCalledWith(
        mockDb,
        "Vendors/csfd/credentials/secret",
      );
      expect(mockGet).toHaveBeenCalledWith({
        db: mockDb,
        path: "Vendors/csfd/credentials/secret",
      });
    });
  });

  describe("set", () => {
    test("should save data at base vendor path when path argument is omitted", async () => {
      mockSet.mockResolvedValue(undefined);

      const vendor = new Vendors("trakt");
      const payload = { token: "abc" };
      await vendor.set(payload);

      expect(mockGetDatabase).toHaveBeenCalled();
      expect(mockRef).toHaveBeenCalledWith(mockDb, "Vendors/trakt");
      expect(mockSet).toHaveBeenCalledWith(
        { db: mockDb, path: "Vendors/trakt" },
        payload,
      );
    });

    test("should save data at subpath when path argument is provided", async () => {
      mockSet.mockResolvedValue(undefined);

      const vendor = new Vendors("trakt");
      const payload = "xyz";
      await vendor.set(payload, "refreshToken");

      expect(mockGetDatabase).toHaveBeenCalled();
      expect(mockRef).toHaveBeenCalledWith(
        mockDb,
        "Vendors/trakt/refreshToken",
      );
      expect(mockSet).toHaveBeenCalledWith(
        { db: mockDb, path: "Vendors/trakt/refreshToken" },
        payload,
      );
    });
  });
});
