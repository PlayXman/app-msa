import { Vendors } from "@/models/Vendors";
import {
  MovieDb,
  MovieResponse,
  MovieResult,
  ShowResponse,
  TvResult,
} from "moviedb-promise";
import Movie, { FALLBACK_ID_PREFIX } from "@/app/(media)/movies/Movie";
import { config } from "@/models/utils/config";
import TvShow from "@/app/(media)/tv-shows/TvShow";

const VENDORS_DB_NAME = "tmdb";
const PAGING_SIZE = 10;

/**
 * Tmdb API wrapper.
 */
export class Tmdb {
  static apiKeyCache = "";

  /**
   * Search movies by title.
   * @param title
   */
  async searchMovies(title: string): Promise<Movie[]> {
    const movieDb = new MovieDb(await this.getApiKey());

    const response = await movieDb.searchMovie({
      query: title,
    });

    const searchItems = response.results ?? [];
    const length = Math.min(searchItems.length, PAGING_SIZE);
    const result: Movie[] = [];

    for (let i = 0; i < length; i++) {
      const searchItem = searchItems[i];
      const movie = new Movie();
      movie.id = searchItem.id?.toString() ?? "";
      this.populateMovie(movie, searchItem);

      result.push(movie);
    }

    return result;
  }

  /**
   * Search TV shows by title.
   * @param title
   */
  async searchTvShows(title: string): Promise<TvShow[]> {
    const movieDb = new MovieDb(await this.getApiKey());

    const response = await movieDb.searchTv({
      query: title,
    });

    const searchItems = response.results ?? [];
    const length = Math.min(searchItems.length, PAGING_SIZE);
    const result: TvShow[] = [];

    for (let i = 0; i < length; i++) {
      const searchItem = searchItems[i];
      const tvShow = new TvShow();
      tvShow.id = searchItem.id?.toString() ?? "";
      this.populateTvShow(tvShow, searchItem);

      result.push(tvShow);
    }

    return result;
  }

  /**
   * Fill movie instance with TMDB information.
   * @param movie
   */
  async fillMovie(movie: Movie): Promise<void> {
    if (movie.id.startsWith(FALLBACK_ID_PREFIX)) {
      return;
    }

    const movieDb = new MovieDb(await this.getApiKey());

    const response = await movieDb.movieInfo({
      id: movie.id,
    });

    this.populateMovie(movie, response);
  }

  /**
   * Fill TV Show instance with TMDB information.
   * @param tvShow
   */
  async fillTvShow(tvShow: TvShow): Promise<void> {
    if (tvShow.id.startsWith(FALLBACK_ID_PREFIX)) {
      return;
    }

    const movieDb = new MovieDb(await this.getApiKey());

    const response = await movieDb.tvInfo({
      id: tvShow.id,
    });

    this.populateTvShow(tvShow, response);
  }

  protected async getApiKey(): Promise<string> {
    if (!Tmdb.apiKeyCache) {
      const vendors = new Vendors(VENDORS_DB_NAME);
      Tmdb.apiKeyCache = (await vendors.get("key")) ?? "";
    }

    return Tmdb.apiKeyCache;
  }

  protected populateMovie(
    movie: Movie,
    tmdbData: MovieResult | MovieResponse,
  ): void {
    movie.vendorIds = { tmdb: tmdbData.id?.toString() ?? "" };
    movie.slug = "";
    movie.title = tmdbData.title ?? "";
    movie.imageUrl = tmdbData.poster_path
      ? config.vendors.tmdbOrg.imageUrl.thumb + tmdbData.poster_path
      : "";
    movie.releaseDate = tmdbData.release_date ?? "";
  }

  protected populateTvShow(
    tvShow: TvShow,
    tmdbData: TvResult | ShowResponse,
  ): void {
    tvShow.vendorIds = { tmdb: tmdbData.id?.toString() ?? "" };
    tvShow.slug = "";
    tvShow.title = tmdbData.name ?? "";
    tvShow.imageUrl = tmdbData.poster_path
      ? config.vendors.tmdbOrg.imageUrl.thumb + tmdbData.poster_path
      : "";
    tvShow.releaseDate = tmdbData.first_air_date ?? "";
  }
}
