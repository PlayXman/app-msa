import { Trakt } from "@/models/services/Trakt";
import { getDatabase, ref, set } from "firebase/database";
import { Tmdb } from "@/models/services/Tmdb";
import { splitIntoChunks } from "@/models/utils/list";
import Media from "@/models/Media";

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

  /**
   * Fetches all movies from user's Trakt watchlist and saves them to DB.
   * @param currentList
   */
  async syncWithTrakt(currentList: Movie[]): Promise<void> {
    const trakt = this.trakt;
    const watchlist = await trakt.getAllInWatchlist();

    const nextMovieRequests = watchlist.map(async (traktItem) => {
      const id =
        traktItem.movie?.ids?.tmdb?.toString() ??
        `${FALLBACK_ID_PREFIX}${traktItem.movie?.ids?.trakt?.toString()}` ??
        "";

      let movie = currentList.find((movie) => movie.id === id);
      if (!movie) {
        movie = new Movie();
        movie.id = id;
        movie.title = traktItem.movie?.title ?? "";

        try {
          await movie.refresh([movie]);
        } catch (e) {
          console.error("Failed to fetch movie from TMDB", e);
        }
      }

      return movie;
    });

    const nextMovies: Movie[] = [];
    // Update movies.
    const requestChunks = splitIntoChunks(
      nextMovieRequests,
      this.batchOperationConcurrencyLimit,
    );
    for (const chunk of requestChunks) {
      nextMovies.push(...(await Promise.all(chunk)));
    }

    // Save updates.
    await set(ref(getDatabase(), this.getDbPath()), []);
    await Promise.all(nextMovies.map((movie) => movie.save()));
  }

  protected get trakt(): Trakt {
    return new Trakt("movies");
  }
}
