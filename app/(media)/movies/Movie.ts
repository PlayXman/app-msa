import { Trakt } from "@/models/services/Trakt";
import { Tmdb } from "@/models/services/Tmdb";
import Media from "@/models/Media";
import { Props as InfoLink } from "@/app/(media)/_components/MediaGrid/MediaGridItemMenuInfoLink";
import { config } from "@/models/utils/config";
import UrlHelpers from "@/models/utils/UrlHelpers";

export const FALLBACK_ID_PREFIX = "fallback-";

export default class Movie extends Media {
  /** Is in Trakt watchlist. */
  isInWatchlist: boolean = true;

  get modelName(): string {
    return "Movies";
  }

  get batchOperationConcurrencyLimit(): number {
    return 100;
  }

  get infoLinks(): InfoLink[] {
    const encodedTitle = UrlHelpers.encodeText(this.title);

    return [
      {
        variant: "trakt",
        url: config.vendors.traktTv.movieSearchUrl + encodedTitle,
      },
      {
        variant: "imdb",
        url: config.vendors.imdbCom.movieSearchUrl + encodedTitle,
      },
      {
        variant: "csfd",
        url: config.vendors.csfdCz.movieSearchUrl + encodedTitle,
      },
    ];
  }

  get searchInfoLink(): string {
    return (
      config.vendors.imdbCom.movieSearchUrl + UrlHelpers.encodeText(this.title)
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

  async refresh(items: Movie[]): Promise<Movie[]> {
    const tmdb = new Tmdb();
    await Promise.all(
      items.map(async (item) => {
        if (!item.id) {
          console.error(`Missing ID`, item);
          return;
        }

        try {
          await tmdb.fillMovie(item);
        } catch (e) {
          console.error(`Failed to refresh ${item.id}`, e);
        }
      }),
    );

    return items;
  }

  async markAsWatched() {
    const trakt = this.trakt;
    await trakt.markWatched([this.id]);
  }

  async addToWatchlist() {
    const trakt = this.trakt;
    await trakt.addToWatchlist([this.id]);
  }

  async removeFromWatchlist() {
    const trakt = this.trakt;
    await trakt.removeFromWatchlist([this.id]);
  }

  async fetchItemsFromExternalSource(): Promise<Movie[] | null> {
    const trakt = this.trakt;
    const watchlist = await trakt.getAllInWatchlist();

    return watchlist.map((traktItem) => {
      const item = new Movie();
      item.id =
        traktItem.movie?.ids?.tmdb?.toString() ??
        `${FALLBACK_ID_PREFIX}${traktItem.movie?.ids?.trakt?.toString()}` ??
        "";
      item.title = traktItem.movie?.title ?? "";

      return item;
    });
  }

  protected get trakt(): Trakt {
    return new Trakt("movies");
  }
}
