import Book from "@/app/(media)/books/Book";

const API_URL = "https://www.googleapis.com/books/v1/volumes";

/**
 * Google Books API wrapper.
 */
export default class GoogleBooks {
  /**
   * Search books by title.
   * @param title
   */
  async searchBooks(title: string): Promise<Book[]> {
    const url = new URL(API_URL);
    url.searchParams.set("q", title);
    url.searchParams.set("maxResults", "10");
    url.searchParams.set("orderBy", "relevance");
    url.searchParams.set("fields", `items(${this.createRequestParamFields()})`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to contact Google Apis");
    }

    const result: { items: GoogleBook[] } = await response.json();

    return result.items.map((item) => {
      const book = new Book();
      this.populateBook(book, item);
      return book;
    });
  }

  /**
   * Fill book instance with Google Books information.
   * @param book
   */
  async fillBook(book: Book): Promise<void> {
    const googleBook = await this.getBook(book.id);
    this.populateBook(book, googleBook);
  }

  /**
   * Fetch book metadata.
   * @param id Id from Google Books Api.
   */
  protected async getBook(id: string): Promise<GoogleBook> {
    const url = new URL(`${API_URL}/${id}`);
    url.searchParams.set("fields", this.createRequestParamFields());

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to contact Google Apis");
    }

    return await response.json();
  }

  protected createRequestParamFields() {
    return [
      "id",
      "volumeInfo/title",
      "volumeInfo/authors",
      "volumeInfo/imageLinks",
      "volumeInfo/publishedDate",
    ].join(",");
  }

  protected populateBook(book: Book, googleBook: GoogleBook) {
    book.id = googleBook.id;

    book.title = this.createTitle(googleBook);
    book.releaseDate = googleBook.volumeInfo.publishedDate ?? "";
    book.imageUrl =
      googleBook.volumeInfo.imageLinks?.thumbnail?.replace(
        /^http:/,
        "https:",
      ) ?? "";
  }

  private createTitle(googleBook: GoogleBook): string {
    let title = googleBook.volumeInfo.title;
    if (googleBook.volumeInfo.authors) {
      title += ` · ${googleBook.volumeInfo.authors.join(", ")}`;
    }
    return title;
  }
}

/**
 * @see https://developers.google.com/books/docs/v1/reference/volumes
 */
interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    imageLinks: {
      thumbnail: string;
    };
    publishedDate: string;
    infoLink: string;
  };
}
