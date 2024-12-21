import Media from "@/models/Media";
import GoogleBooks from "@/models/services/GoogleBooks";
import { Props as InfoLink } from "@/app/(media)/_components/MediaGrid/MediaGridItemMenuInfoLink";
import { config } from "@/models/utils/config";
import { encodeText } from "@/models/utils/urlHelpers";

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

  get infoLinks(): InfoLink[] {
    return [
      {
        variant: "googleBooks",
        url: config.vendors.googleBooks.infoUrl + this.id,
      },
      {
        variant: "amazon",
        url: config.vendors.amazonCom.searchUrl + encodeText(this.title),
      },
    ];
  }

  get searchInfoLink(): string {
    return config.vendors.googleBooks.infoUrl + this.id;
  }
}
