import { Trakt } from "@/models/services/Trakt";
import { Tmdb } from "@/models/services/Tmdb";
import Media from "@/models/Media";
import { Props as InfoLink } from "@/app/(media)/_components/MediaGrid/MediaGridItemMenuInfoLink";
import { config } from "@/models/utils/config";
import { encodeText } from "@/models/utils/urlHelpers";

export const FALLBACK_ID_PREFIX = "fallback-";

export default class Movie extends Media {
  get modelName(): string {
    return "Movies";
  }

  get batchOperationConcurrencyLimit(): number {
    return 100;
  }

  get infoLinks(): InfoLink[] {
    const encodedTitle = encodeText(this.title);

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
    return config.vendors.imdbCom.movieSearchUrl + encodeText(this.title);
  }

  async delete(): Promise<void> {
    await super.delete();
    await this.removeFromWatchlist();
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

  async removeFromWatchlist() {
    const trakt = this.trakt;
    await trakt.removeFromWatchlist([this.id]);
  }

  protected get trakt(): Trakt {
    return new Trakt("movies");
  }
}
