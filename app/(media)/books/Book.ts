import Media from "@/models/Media";
import GoogleBooks from "@/models/services/GoogleBooks";

export default class Book extends Media {
  get modelName(): string {
    return "Books";
  }

  get batchOperationConcurrencyLimit(): number {
    return 50;
  }

  async refresh(items: Book[]): Promise<Book[]> {
    const googleBooks = new GoogleBooks();
    await Promise.all(
      items.map(async (item) => {
        if (!item.id) {
          console.error(`Missing ID`, item);
          return;
        }

        try {
          await googleBooks.fillBook(item);
        } catch (e) {
          console.error(`Failed to refresh ${item.id}`, e);
        }
      }),
    );

    return items;
  }
}
