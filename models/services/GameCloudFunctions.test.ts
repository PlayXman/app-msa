import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import { getFunctions, httpsCallable } from "firebase/functions";
import GameCloudFunctions from "./GameCloudFunctions";
import Game from "@/app/(media)/games/Game";

jest.mock("firebase/functions", () => ({
  getFunctions: jest.fn(),
  httpsCallable: jest.fn(),
}));

const mockGetFunctions = getFunctions as unknown as jest.Mock<
  (...args: any[]) => any
>;
const mockHttpsCallable = httpsCallable as unknown as jest.Mock<
  (...args: any[]) => any
>;

describe("GameCloudFunctions", () => {
  let service: GameCloudFunctions;
  let mockCallable: jest.Mock<(...args: any[]) => any>;
  const mockFunctionsInstance = { app: "mockApp" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCallable = jest.fn();
    mockGetFunctions.mockReturnValue(mockFunctionsInstance);
    mockHttpsCallable.mockReturnValue(mockCallable);
    service = new GameCloudFunctions();
  });

  describe("searchGames", () => {
    test("should call httpsCallable with getFunctions(), 'searchGames', and timeout: 20000", async () => {
      mockCallable.mockResolvedValue({
        data: { games: [] },
      });

      await service.searchGames("Witcher");

      expect(mockGetFunctions).toHaveBeenCalledTimes(1);
      expect(mockHttpsCallable).toHaveBeenCalledWith(
        mockFunctionsInstance,
        "searchGames",
        { timeout: 20000 },
      );
      expect(mockCallable).toHaveBeenCalledWith({ query: "Witcher" });
    });

    test("should return empty array when response contains no games", async () => {
      mockCallable.mockResolvedValue({
        data: { games: [] },
      });

      const result = await service.searchGames("NonExistent");
      expect(result).toEqual([]);
    });

    test("should return populated Game instances matching returned game data", async () => {
      mockCallable.mockResolvedValue({
        data: {
          games: [
            {
              igdbId: 1942,
              name: "The Witcher 3: Wild Hunt",
              imageUrl: "https://images.igdb.com/witcher3.jpg",
              releaseDate: "2015-05-19",
            },
            {
              igdbId: 7346,
              name: "The Witcher 2: Assassins of Kings",
              imageUrl: "https://images.igdb.com/witcher2.jpg",
              releaseDate: "2011-05-17",
            },
          ],
        },
      });

      const result = await service.searchGames("Witcher");

      expect(result).toHaveLength(2);

      expect(result[0]).toBeInstanceOf(Game);
      expect(result[0]).toMatchObject({
        vendorIds: { igdb: 1942 },
        slug: "",
        title: "The Witcher 3: Wild Hunt",
        imageUrl: "https://images.igdb.com/witcher3.jpg",
        releaseDate: "2015-05-19",
      });

      expect(result[1]).toBeInstanceOf(Game);
      expect(result[1]).toMatchObject({
        vendorIds: { igdb: 7346 },
        slug: "",
        title: "The Witcher 2: Assassins of Kings",
        imageUrl: "https://images.igdb.com/witcher2.jpg",
        releaseDate: "2011-05-17",
      });
    });

    test("should handle games with missing or nullish igdbId", async () => {
      mockCallable.mockResolvedValue({
        data: {
          games: [
            {
              igdbId: undefined,
              name: "Mystery Game",
              imageUrl: "https://example.com/mystery.jpg",
              releaseDate: "2024-01-01",
            },
          ],
        },
      });

      const result = await service.searchGames("Mystery");
      expect(result).toHaveLength(1);
      expect(result[0].vendorIds).toEqual({ igdb: undefined });
      expect(result[0].title).toBe("Mystery Game");
    });

    test("should propagate error when callable rejects", async () => {
      mockCallable.mockRejectedValue(new Error("Cloud function error"));

      await expect(service.searchGames("Witcher")).rejects.toThrow(
        "Cloud function error",
      );
    });
  });

  describe("fillGames", () => {
    test("should call httpsCallable with 'refreshGames' and only valid igdbIds", async () => {
      mockCallable.mockResolvedValue({
        data: { games: [] },
      });

      const game1 = new Game({ vendorIds: { igdb: 101 } });
      const game2 = new Game({ vendorIds: { igdb: 202 } });
      const game3 = new Game({ vendorIds: {} });
      const game4 = new Game();

      await service.fillGames([game1, game2, game3, game4]);

      expect(mockHttpsCallable).toHaveBeenCalledWith(
        mockFunctionsInstance,
        "refreshGames",
        { timeout: 20000 },
      );
      expect(mockCallable).toHaveBeenCalledWith({ igdbIds: [101, 202] });
    });

    test("should update matching games with refreshed game data", async () => {
      const game1 = new Game({
        vendorIds: { igdb: 100 },
        title: "Old Title 1",
        imageUrl: "old1.jpg",
        releaseDate: "2010-01-01",
      });
      const game2 = new Game({
        vendorIds: { igdb: 200 },
        title: "Old Title 2",
        imageUrl: "old2.jpg",
        releaseDate: "2012-01-01",
      });

      mockCallable.mockResolvedValue({
        data: {
          games: [
            {
              igdbId: 100,
              name: "New Title 1",
              imageUrl: "https://images.igdb.com/new1.jpg",
              releaseDate: "2010-06-01",
            },
            {
              igdbId: 200,
              name: "New Title 2",
              imageUrl: "https://images.igdb.com/new2.jpg",
              releaseDate: "2012-06-01",
            },
          ],
        },
      });

      await service.fillGames([game1, game2]);

      expect(game1).toMatchObject({
        title: "New Title 1",
        imageUrl: "https://images.igdb.com/new1.jpg",
        releaseDate: "2010-06-01",
        slug: "",
      });

      expect(game2).toMatchObject({
        title: "New Title 2",
        imageUrl: "https://images.igdb.com/new2.jpg",
        releaseDate: "2012-06-01",
        slug: "",
      });
    });

    test("should not modify games that are not returned in response data", async () => {
      const game1 = new Game({
        vendorIds: { igdb: 100 },
        title: "Keep Title",
        imageUrl: "keep.jpg",
        releaseDate: "2020-01-01",
      });

      mockCallable.mockResolvedValue({
        data: {
          games: [
            {
              igdbId: 999,
              name: "Different Game",
              imageUrl: "different.jpg",
              releaseDate: "2021-01-01",
            },
          ],
        },
      });

      await service.fillGames([game1]);

      expect(game1).toMatchObject({
        title: "Keep Title",
        imageUrl: "keep.jpg",
        releaseDate: "2020-01-01",
      });
    });

    test("should propagate error when callable rejects in fillGames", async () => {
      mockCallable.mockRejectedValue(new Error("Network timeout"));

      const game = new Game({ vendorIds: { igdb: 123 } });
      await expect(service.fillGames([game])).rejects.toThrow(
        "Network timeout",
      );
    });
  });
});
