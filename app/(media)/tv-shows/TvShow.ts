import { FALLBACK_ID_PREFIX } from "@/app/(media)/movies/Movie";
import { Tmdb } from "@/models/services/Tmdb";
import { Trakt } from "@/models/services/Trakt";
import Media from "@/models/Media";
import { Props as InfoLink } from "@/app/(media)/_components/MediaGrid/MediaGridItemMenuInfoLink";
import { config } from "@/models/utils/config";
import UrlHelpers from "@/models/utils/UrlHelpers";

export default class TvShow extends Media {
  /** Is in Trakt watchlist. */
  isInWatchlist: boolean = true;

  get modelName(): string {
    return "TvShows";
  }

  get batchOperationConcurrencyLimit(): number {
    return 100;
  }

  get infoLinks(): InfoLink[] {
    const encodedTitle = UrlHelpers.encodeText(this.title);

    return [
      {
        variant: "trakt",
        url: config.vendors.traktTv.tvShowSearchUrl + encodedTitle,
      },
      {
        variant: "imdb",
        url: config.vendors.imdbCom.tvShowSearchUrl + encodedTitle,
      },
      {
        variant: "csfd",
        url: config.vendors.csfdCz.tvShowSearchUrl + encodedTitle,
      },
    ];
  }

  get searchInfoLink(): string {
    return (
      config.vendors.imdbCom.tvShowSearchUrl + UrlHelpers.encodeText(this.title)
    );
  }

  async delete(): Promise<void> {
    await super.delete();
    await this.removeFromWatchlist();
  }

  async save(): Promise<void> {
    if (!this.isInWatchlist) {
      // Add to Trakt watchlist.
      if (!this.id) {
        throw new Error(`Missing ID for ${this.title}`);
      }
      await this.addToWatchlist();
      this.isInWatchlist = true;
    }

    return super.save();
  }

  async refresh(items: TvShow[]): Promise<TvShow[]> {
    const tmdb = new Tmdb();
    await Promise.all(
      items.map(async (item) => {
        if (!item.id) {
          console.error(`Missing ID`, item);
          return;
        }

        try {
          await tmdb.fillTvShow(item);
        } catch (e) {
          console.error(`Failed to refresh ${item.id}`, e);
        }
      }),
    );

    return items;
  }

  async addToWatchlist() {
    const trakt = this.trakt;
    await trakt.addToWatchlist([this.id]);
  }

  async removeFromWatchlist() {
    const trakt = this.trakt;
    await trakt.removeFromWatchlist([this.id]);
  }

  async fetchItemsFromExternalSource(): Promise<TvShow[] | null> {
    const trakt = this.trakt;
    const watchlist = await trakt.getAllInWatchlist();

    return watchlist.map((traktItem) => {
      const item = new TvShow();
      item.id =
        traktItem.show?.ids?.tmdb?.toString() ??
        `${FALLBACK_ID_PREFIX}${traktItem.show?.ids?.trakt?.toString()}` ??
        "";
      item.title = traktItem.show?.title ?? "";

      return item;
    });
  }

  protected get trakt(): Trakt {
    return new Trakt("shows");
  }
}
