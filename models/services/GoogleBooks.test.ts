import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import GoogleBooks from "./GoogleBooks";
import { Vendors } from "@/models/Vendors";
import Book from "@/app/(media)/books/Book";

jest.mock("@/models/Vendors");

describe("GoogleBooks", () => {
  let service: GoogleBooks;
  const originalFetch = global.fetch;
  let mockFetch: jest.Mock<(...args: any[]) => any>;
  let mockVendorsGet: jest.Mock<(...args: any[]) => any>;

  beforeEach(() => {
    jest.clearAllMocks();
    GoogleBooks.apiKeyCache = "";
    mockVendorsGet = jest
      .fn<(...args: any[]) => any>()
      .mockResolvedValue("test-google-api-key");
    (Vendors as unknown as jest.Mock).mockImplementation(() => ({
      get: mockVendorsGet,
    }));
    mockFetch = jest.fn();
    global.fetch = mockFetch as any;
    service = new GoogleBooks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    GoogleBooks.apiKeyCache = "";
  });

  describe("getApiKey", () => {
    test("should retrieve and cache API key from Vendors('googleBooks')", async () => {
      const key = await (service as any).getApiKey();

      expect(Vendors).toHaveBeenCalledWith("googleBooks");
      expect(mockVendorsGet).toHaveBeenCalledWith("key");
      expect(key).toBe("test-google-api-key");
      expect(GoogleBooks.apiKeyCache).toBe("test-google-api-key");
    });

    test("should return cached API key on subsequent calls without querying Vendors again", async () => {
      await (service as any).getApiKey();
      mockVendorsGet.mockClear();

      const key2 = await (service as any).getApiKey();
      expect(mockVendorsGet).not.toHaveBeenCalled();
      expect(key2).toBe("test-google-api-key");
    });

    test("should fallback to empty string when Vendors.get returns null", async () => {
      mockVendorsGet.mockResolvedValue(null);

      const key = await (service as any).getApiKey();
      expect(key).toBe("");
      expect(GoogleBooks.apiKeyCache).toBe("");
    });
  });

  describe("searchBooks", () => {
    test("should call fetch with proper query params and fields", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ items: [] }),
      });

      await service.searchBooks("Dune");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const urlArg = mockFetch.mock.calls[0][0] as URL;
      expect(urlArg.origin + urlArg.pathname).toBe(
        "https://www.googleapis.com/books/v1/volumes",
      );
      expect(urlArg.searchParams.get("key")).toBe("test-google-api-key");
      expect(urlArg.searchParams.get("q")).toBe("Dune");
      expect(urlArg.searchParams.get("maxResults")).toBe("10");
      expect(urlArg.searchParams.get("orderBy")).toBe("relevance");
      expect(urlArg.searchParams.get("fields")).toBe(
        "items(id,volumeInfo/title,volumeInfo/authors,volumeInfo/imageLinks,volumeInfo/publishedDate)",
      );
    });

    test("should return array of populated Book instances on success", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              id: "book-1",
              volumeInfo: {
                title: "Dune",
                authors: ["Frank Herbert"],
                imageLinks: {
                  thumbnail: "http://books.google.com/dune.jpg",
                },
                publishedDate: "1965-08-01",
              },
            },
            {
              id: "book-2",
              volumeInfo: {
                title: "Good Omens",
                authors: ["Neil Gaiman", "Terry Pratchett"],
                imageLinks: {
                  thumbnail: "https://books.google.com/good_omens.jpg",
                },
                publishedDate: "1990-05-01",
              },
            },
          ],
        }),
      });

      const result = await service.searchBooks("Sci-Fi");

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Book);
      expect(result[0]).toMatchObject({
        vendorIds: { googleBooks: "book-1" },
        slug: "",
        title: "Dune · Frank Herbert",
        imageUrl: "https://books.google.com/dune.jpg",
        releaseDate: "1965-08-01",
      });

      expect(result[1]).toBeInstanceOf(Book);
      expect(result[1]).toMatchObject({
        vendorIds: { googleBooks: "book-2" },
        slug: "",
        title: "Good Omens · Neil Gaiman, Terry Pratchett",
        imageUrl: "https://books.google.com/good_omens.jpg",
        releaseDate: "1990-05-01",
      });
    });

    test("should handle books with missing authors, imageLinks, and publishedDate", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              id: "book-no-extra-info",
              volumeInfo: {
                title: "Anonymous Book",
              },
            },
          ],
        }),
      });

      const result = await service.searchBooks("Anonymous");

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        title: "Anonymous Book",
        imageUrl: "",
        releaseDate: "",
      });
    });

    test("should throw an error when fetch response is not ok", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(service.searchBooks("Dune")).rejects.toThrow(
        "Failed to contact Google Apis",
      );
    });
  });

  describe("fillBook", () => {
    test("should throw an error if book has no googleBooks vendor ID", async () => {
      const bookWithoutId = new Book();
      await expect(service.fillBook(bookWithoutId)).rejects.toThrow(
        "Missing Google Books ID",
      );

      const bookWithEmptyVendorIds = new Book({ vendorIds: {} });
      await expect(service.fillBook(bookWithEmptyVendorIds)).rejects.toThrow(
        "Missing Google Books ID",
      );
    });

    test("should fetch book details and populate the given book instance", async () => {
      const book = new Book({
        vendorIds: { googleBooks: "vol-123" },
        title: "Old Title",
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: "vol-123",
          volumeInfo: {
            title: "Neuromancer",
            authors: ["William Gibson"],
            imageLinks: {
              thumbnail: "http://example.com/neuromancer.jpg",
            },
            publishedDate: "1984-07-01",
          },
        }),
      });

      await service.fillBook(book);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const urlArg = mockFetch.mock.calls[0][0] as URL;
      expect(urlArg.origin + urlArg.pathname).toBe(
        "https://www.googleapis.com/books/v1/volumes/vol-123",
      );
      expect(urlArg.searchParams.get("key")).toBe("test-google-api-key");
      expect(urlArg.searchParams.get("fields")).toBe(
        "id,volumeInfo/title,volumeInfo/authors,volumeInfo/imageLinks,volumeInfo/publishedDate",
      );

      expect(book).toMatchObject({
        vendorIds: { googleBooks: "vol-123" },
        slug: "",
        title: "Neuromancer · William Gibson",
        imageUrl: "https://example.com/neuromancer.jpg",
        releaseDate: "1984-07-01",
      });
    });

    test("should throw an error when fetch fails", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      const book = new Book({ vendorIds: { googleBooks: "invalid-id" } });
      await expect(service.fillBook(book)).rejects.toThrow(
        "Failed to contact Google Apis",
      );
    });
  });
});
