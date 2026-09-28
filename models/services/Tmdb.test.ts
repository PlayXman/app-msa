import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { Tmdb } from "./Tmdb";
import { Vendors } from "@/models/Vendors";
import { MovieDb } from "moviedb-promise";
import Movie from "@/app/(media)/movies/Movie";
import TvShow from "@/app/(media)/tv-shows/TvShow";
import { config } from "@/models/utils/config";

jest.mock("@/models/Vendors");
jest.mock("moviedb-promise");

describe("Tmdb", () => {
  let service: Tmdb;
  let mockVendorsGet: jest.Mock<(...args: any[]) => any>;
  let mockSearchMovie: jest.Mock<(...args: any[]) => any>;
  let mockSearchTv: jest.Mock<(...args: any[]) => any>;
  let mockMovieInfo: jest.Mock<(...args: any[]) => any>;
  let mockTvInfo: jest.Mock<(...args: any[]) => any>;

  beforeEach(() => {
    jest.clearAllMocks();
    Tmdb.apiKeyCache = "";
    mockVendorsGet = jest
      .fn<(...args: any[]) => any>()
      .mockResolvedValue("test-tmdb-api-key");
    (Vendors as unknown as jest.Mock).mockImplementation(() => ({
      get: mockVendorsGet,
    }));

    mockSearchMovie = jest.fn();
    mockSearchTv = jest.fn();
    mockMovieInfo = jest.fn();
    mockTvInfo = jest.fn();

    (MovieDb as unknown as jest.Mock).mockImplementation(() => ({
      searchMovie: mockSearchMovie,
      searchTv: mockSearchTv,
      movieInfo: mockMovieInfo,
      tvInfo: mockTvInfo,
    }));

    service = new Tmdb();
  });

  afterEach(() => {
    Tmdb.apiKeyCache = "";
  });

  describe("getApiKey", () => {
    test("should retrieve and cache API key from Vendors('tmdb')", async () => {
      const key = await (service as any).getApiKey();

      expect(Vendors).toHaveBeenCalledWith("tmdb");
      expect(mockVendorsGet).toHaveBeenCalledWith("key");
      expect(key).toBe("test-tmdb-api-key");
      expect(Tmdb.apiKeyCache).toBe("test-tmdb-api-key");
    });

    test("should return cached API key on subsequent calls without querying Vendors", async () => {
      await (service as any).getApiKey();
      mockVendorsGet.mockClear();

      const key2 = await (service as any).getApiKey();
      expect(mockVendorsGet).not.toHaveBeenCalled();
      expect(key2).toBe("test-tmdb-api-key");
    });

    test("should fallback to empty string when Vendors.get returns null", async () => {
      mockVendorsGet.mockResolvedValue(null);

      const key = await (service as any).getApiKey();
      expect(key).toBe("");
      expect(Tmdb.apiKeyCache).toBe("");
    });
  });

  describe("searchMovies", () => {
    test("should initialize MovieDb with API key and query for movies", async () => {
      mockSearchMovie.mockResolvedValue({ results: [] });

      await service.searchMovies("Inception");

      expect(MovieDb).toHaveBeenCalledWith("test-tmdb-api-key");
      expect(mockSearchMovie).toHaveBeenCalledWith({ query: "Inception" });
    });

    test("should return empty array when response results is undefined", async () => {
      mockSearchMovie.mockResolvedValue({});

      const result = await service.searchMovies("Unknown");
      expect(result).toEqual([]);
    });

    test("should return populated Movie instances with correct fields", async () => {
      mockSearchMovie.mockResolvedValue({
        results: [
          {
            id: 27205,
            title: "Inception",
            poster_path: "/inception.jpg",
            release_date: "2010-07-15",
          },
          {
            id: 157336,
            title: "Interstellar",
            poster_path: null,
            release_date: null,
          },
          {
            id: undefined,
            title: undefined,
            poster_path: undefined,
            release_date: undefined,
          },
        ],
      });

      const result = await service.searchMovies("Nolan");

      expect(result).toHaveLength(3);

      expect(result[0]).toBeInstanceOf(Movie);
      expect(result[0]).toMatchObject({
        id: "27205",
        vendorIds: { tmdb: "27205" },
        slug: "",
        title: "Inception",
        imageUrl: config.vendors.tmdbOrg.imageUrl.thumb + "/inception.jpg",
        releaseDate: "2010-07-15",
      });

      expect(result[1]).toBeInstanceOf(Movie);
      expect(result[1]).toMatchObject({
        id: "157336",
        vendorIds: { tmdb: "157336" },
        slug: "",
        title: "Interstellar",
        imageUrl: "",
        releaseDate: "",
      });

      expect(result[2]).toBeInstanceOf(Movie);
      expect(result[2]).toMatchObject({
        id: "",
        vendorIds: { tmdb: "" },
        slug: "",
        title: "",
        imageUrl: "",
        releaseDate: "",
      });
    });

    test("should limit results to PAGING_SIZE (10)", async () => {
      const items = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: `Movie ${i + 1}`,
      }));
      mockSearchMovie.mockResolvedValue({ results: items });

      const result = await service.searchMovies("Many Movies");
      expect(result).toHaveLength(10);
      expect(result[9].id).toBe("10");
    });
  });

  describe("searchTvShows", () => {
    test("should initialize MovieDb with API key and query for TV shows", async () => {
      mockSearchTv.mockResolvedValue({ results: [] });

      await service.searchTvShows("Breaking Bad");

      expect(MovieDb).toHaveBeenCalledWith("test-tmdb-api-key");
      expect(mockSearchTv).toHaveBeenCalledWith({ query: "Breaking Bad" });
    });

    test("should return empty array when response results is undefined", async () => {
      mockSearchTv.mockResolvedValue({});

      const result = await service.searchTvShows("Unknown");
      expect(result).toEqual([]);
    });

    test("should return populated TvShow instances with correct fields", async () => {
      mockSearchTv.mockResolvedValue({
        results: [
          {
            id: 1396,
            name: "Breaking Bad",
            poster_path: "/bb.jpg",
            first_air_date: "2008-01-20",
          },
          {
            id: 60059,
            name: "Better Call Saul",
            poster_path: null,
            first_air_date: null,
          },
          {
            id: undefined,
            name: undefined,
            poster_path: undefined,
            first_air_date: undefined,
          },
        ],
      });

      const result = await service.searchTvShows("Vince Gilligan");

      expect(result).toHaveLength(3);

      expect(result[0]).toBeInstanceOf(TvShow);
      expect(result[0]).toMatchObject({
        id: "1396",
        vendorIds: { tmdb: "1396" },
        slug: "",
        title: "Breaking Bad",
        imageUrl: config.vendors.tmdbOrg.imageUrl.thumb + "/bb.jpg",
        releaseDate: "2008-01-20",
      });

      expect(result[1]).toBeInstanceOf(TvShow);
      expect(result[1]).toMatchObject({
        id: "60059",
        vendorIds: { tmdb: "60059" },
        slug: "",
        title: "Better Call Saul",
        imageUrl: "",
        releaseDate: "",
      });

      expect(result[2]).toBeInstanceOf(TvShow);
      expect(result[2]).toMatchObject({
        id: "",
        vendorIds: { tmdb: "" },
        slug: "",
        title: "",
        imageUrl: "",
        releaseDate: "",
      });
    });

    test("should limit results to PAGING_SIZE (10)", async () => {
      const items = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Show ${i + 1}`,
      }));
      mockSearchTv.mockResolvedValue({ results: items });

      const result = await service.searchTvShows("Many Shows");
      expect(result).toHaveLength(10);
      expect(result[9].id).toBe("10");
    });
  });

  describe("fillMovie", () => {
    test("should throw an error when movie is missing tmdb ID", async () => {
      const movieWithoutId = new Movie();
      await expect(service.fillMovie(movieWithoutId)).rejects.toThrow(
        "Missing TMDB ID",
      );

      const movieWithEmptyVendorIds = new Movie({ vendorIds: {} });
      await expect(service.fillMovie(movieWithEmptyVendorIds)).rejects.toThrow(
        "Missing TMDB ID",
      );
    });

    test("should fetch movie details and populate the given movie instance", async () => {
      const movie = new Movie({
        vendorIds: { tmdb: "27205" },
        title: "Old Inception",
      });

      mockMovieInfo.mockResolvedValue({
        id: 27205,
        title: "Inception (Updated)",
        poster_path: "/inception-hd.jpg",
        release_date: "2010-07-16",
      });

      await service.fillMovie(movie);

      expect(mockMovieInfo).toHaveBeenCalledWith({ id: "27205" });
      expect(movie).toMatchObject({
        vendorIds: { tmdb: "27205" },
        slug: "",
        title: "Inception (Updated)",
        imageUrl: config.vendors.tmdbOrg.imageUrl.thumb + "/inception-hd.jpg",
        releaseDate: "2010-07-16",
      });
    });
  });

  describe("fillTvShow", () => {
    test("should throw an error when tvShow is missing tmdb ID", async () => {
      const tvShowWithoutId = new TvShow();
      await expect(service.fillTvShow(tvShowWithoutId)).rejects.toThrow(
        "Missing TMDB ID",
      );

      const tvShowWithEmptyVendorIds = new TvShow({ vendorIds: {} });
      await expect(
        service.fillTvShow(tvShowWithEmptyVendorIds),
      ).rejects.toThrow("Missing TMDB ID");
    });

    test("should fetch tv show details and populate the given tvShow instance", async () => {
      const tvShow = new TvShow({
        vendorIds: { tmdb: "1396" },
        title: "Old BB",
      });

      mockTvInfo.mockResolvedValue({
        id: 1396,
        name: "Breaking Bad (Updated)",
        poster_path: "/bb-hd.jpg",
        first_air_date: "2008-01-20",
      });

      await service.fillTvShow(tvShow);

      expect(mockTvInfo).toHaveBeenCalledWith({ id: "1396" });
      expect(tvShow).toMatchObject({
        vendorIds: { tmdb: "1396" },
        slug: "",
        title: "Breaking Bad (Updated)",
        imageUrl: config.vendors.tmdbOrg.imageUrl.thumb + "/bb-hd.jpg",
        releaseDate: "2008-01-20",
      });
    });
  });
});
