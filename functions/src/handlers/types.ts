interface Game {
  igdbId: number;
  /** Human-readable name. */
  name: string;
  slug: string;
  /** Full cover image URL. */
  imageUrl: string;
  /** Either full release ISO date, expected release date in most appropriate format (e.g., YYYY-MM-DD, YYYY, YYYY-XQ), or empty string if unknown. */
  releaseDate: string;
}

interface GamesResponse {
  games: Game[];
}

export interface SearchGamesRequest {
  /** Game name. */
  query: string;
}

export type SearchGamesResponse = GamesResponse;

export interface RefreshGamesRequest {
  igdbIds: number[];
}

export type RefreshGamesResponse = GamesResponse;
