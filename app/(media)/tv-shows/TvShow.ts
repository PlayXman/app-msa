import { FALLBACK_ID_PREFIX } from "@/app/(media)/movies/Movie";
import { getDatabase, ref, set } from "firebase/database";
import { splitIntoChunks } from "@/models/utils/list";
import { Tmdb } from "@/models/services/Tmdb";
import { Trakt } from "@/models/services/Trakt";
import Media from "@/models/Media";

export default class TvShow extends Media {
  /** Is in Trakt watchlist. */
  isInWatchlist: boolean = true;

  get modelName(): string {
    return "TvShows";
  }

  get batchOperationConcurrencyLimit(): number {
    return 100;
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

  /**
   * Fetches all TV shows from user's Trakt watchlist and saves them to DB.
   * @param currentList
   */
  async syncWithTrakt(currentList: TvShow[]): Promise<void> {
    const trakt = this.trakt;
    const watchlist = await trakt.getAllInWatchlist();

    const nextTvShowRequests = watchlist.map(async (traktItem) => {
      const id =
        traktItem.show?.ids?.tmdb?.toString() ??
        `${FALLBACK_ID_PREFIX}${traktItem.show?.ids?.trakt?.toString()}` ??
        "";

      let tvShow = currentList.find((tvShow) => tvShow.id === id);
      if (!tvShow) {
        tvShow = new TvShow();
        tvShow.id = id;
        tvShow.title = traktItem.show?.title ?? "";

        try {
          await tvShow.refresh([tvShow]);
        } catch (e) {
          console.error("Failed to fetch TV show from TMDB", e);
        }
      }

      return tvShow;
    });

    const nextTvShows: TvShow[] = [];
    // Update TV shows.
    const requestChunks = splitIntoChunks(
      nextTvShowRequests,
      this.batchOperationConcurrencyLimit,
    );
    for (const chunk of requestChunks) {
      nextTvShows.push(...(await Promise.all(chunk)));
    }

    // Save updates.
    await set(ref(getDatabase(), this.getDbPath()), []);
    await Promise.all(nextTvShows.map((tvShow) => tvShow.save()));
  }

  protected get trakt(): Trakt {
    return new Trakt("shows");
  }
}
