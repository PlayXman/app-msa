import { Vendors } from "@/models/Vendors";

const WEBSITE_URL = "https://trakt.tv";
const API_URL = "https://api.trakt.tv";
const DB_NAME = "traktTv";
export const CODE_PARAM = "code";

/**
 * Trakt API wrapper.
 */
export class Trakt {
  static clientIdCache: string | null = null;
  static clientSecretCache: string | null = null;
  static userAccessTokenCache: string | null = null;
  static userRefreshTokenCache: string | null = null;

  type: "movies" | "shows";

  constructor(type: Trakt["type"]) {
    this.type = type;
  }

  /**
   * Fetches all movies or tv shows from user's Trakt watchlist
   */
  async getAllInWatchlist(): Promise<WatchlistItem[]> {
    const response = await fetch(`${API_URL}/sync/watchlist/${this.type}`, {
      method: "GET",
      cache: "no-cache",
      headers: await this.createHeaders(),
    });

    if (!response.ok) {
      throw new Error("TRAKT: Failed to get watchlist");
    }

    return response.json();
  }

  /**
   * Add movie(s) or tv show(s) to user's Trakt watchlist.
   * @param tmdbIds
   */
  async addToWatchlist(tmdbIds: string[] | number[]): Promise<void> {
    const response = await fetch(`${API_URL}/sync/watchlist`, {
      method: "POST",
      cache: "no-cache",
      headers: await this.createHeaders(),
      body: JSON.stringify({
        [this.type]: tmdbIds.map((id) => ({
          ids: {
            tmdb: id,
          },
        })),
      }),
    });

    if (!response.ok) {
      throw new Error("TRAKT: Failed to save to watchlist");
    }
  }

  /**
   * Remove movie(s) or TV show(s) from user's Trakt watchlist.
   * @param tmdbIds
   */
  async removeFromWatchlist(tmdbIds: string[] | number[]): Promise<void> {
    const response = await fetch(`${API_URL}/sync/watchlist/remove`, {
      method: "POST",
      cache: "no-cache",
      headers: await this.createHeaders(),
      body: JSON.stringify({
        [this.type]: tmdbIds.map((id) => ({
          ids: {
            tmdb: id,
          },
        })),
      }),
    });

    if (!response.ok) {
      throw new Error("TRAKT: Failed to remove from watchlist");
    }
  }

  /**
   * Mark movie(s) or TV show(s) as watched.
   * @param tmdbIds
   */
  async markWatched(tmdbIds: string[] | number[]): Promise<void> {
    const watchedAt = new Date().toUTCString();

    const response = await fetch(`${API_URL}/sync/history`, {
      method: "POST",
      cache: "no-cache",
      headers: await this.createHeaders(),
      body: JSON.stringify({
        [this.type]: tmdbIds.map((id) => ({
          ids: {
            tmdb: id,
          },
          watched_at: watchedAt,
        })),
      }),
    });

    if (response && !response.ok) {
      throw new Error("Not marked as watched");
    }
  }

  /**
   * Create Trakt API headers.
   * @protected
   */
  protected async createHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await this.getAccessToken()}`,
      "trakt-api-version": "2",
      "trakt-api-key": await this.getClientId(),
    };
  }

  // OAUTH

  /**
   * Start the user authentication with Trakt. Opens the Trakt's authentication page in new window.
   */
  async getAuthenticationCode() {
    const url = new URL(`${WEBSITE_URL}/oauth/authorize`);
    url.searchParams.set("response_type", CODE_PARAM);
    url.searchParams.set("client_id", await this.getClientId());
    url.searchParams.set("redirect_uri", this.redirectUri);
    window.open(url, "_blank");
  }

  /**
   * Retrieve refresh token from "code". After this the user should be able to authenticate with Trakt.
   * @param code Trakt authentication code.
   */
  async getRefreshToken(code: string): Promise<void> {
    const response = await fetch(`${API_URL}/oauth/token`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: await this.getClientId(),
        client_secret: Trakt.clientSecretCache,
        redirect_uri: this.redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error('TRAKT: Failed to get refresh token from "code"');
    }

    const data: OAuthTokenResponse = await response.json();
    Trakt.userRefreshTokenCache = data.refresh_token;
    Trakt.userAccessTokenCache = data.access_token;

    await this.persistCurrenRefreshToken();
  }

  protected async persistCurrenRefreshToken(): Promise<void> {
    const vendorDb = new Vendors(DB_NAME);
    await vendorDb.set(Trakt.userRefreshTokenCache, "key/refreshToken");
  }

  /**
   * Obtain keys from DB. Nothing is returned if successful.
   * @protected
   */
  protected async fetchPersistedKeys(): Promise<void> {
    const vendorDb = new Vendors(DB_NAME);
    const keys = await vendorDb.get<PersistedKeys>("key");

    if (keys == null || keys.clientId == null || keys.clientSecret == null) {
      throw new Error("TRAKT: Missing client ID or client secret");
    }

    Trakt.clientIdCache = keys.clientId;
    Trakt.clientSecretCache = keys.clientSecret;
    Trakt.userRefreshTokenCache = keys.refreshToken ?? null;
  }

  protected async getClientId(): Promise<string> {
    if (!Trakt.clientIdCache) {
      await this.fetchPersistedKeys();
    }
    return Trakt.clientIdCache!;
  }

  protected async getAccessToken() {
    if (!Trakt.userAccessTokenCache) {
      if (!Trakt.userRefreshTokenCache) {
        await this.fetchPersistedKeys();
      }

      if (!Trakt.userRefreshTokenCache) {
        // The user is not authenticated. Redirect to "/authenticate/trakt".
        window.location.href = this.redirectUri;
      }

      // Get auth token.
      const response = await fetch(`${API_URL}/oauth/token`, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: Trakt.userRefreshTokenCache,
          client_id: Trakt.clientIdCache,
          client_secret: Trakt.clientSecretCache,
          redirect_uri: this.redirectUri,
          grant_type: "refresh_token",
        }),
      });

      if (!response.ok) {
        // console.error(response.)
        throw new Error("TRAKT: Failed to get access token");
      }

      const data: AccessTokenResponse = await response.json();
      Trakt.userAccessTokenCache = data.access_token;
      Trakt.userRefreshTokenCache = data.refresh_token;

      await this.persistCurrenRefreshToken();
    }

    return Trakt.userAccessTokenCache;
  }

  /**
   * Redirect URI for Trakt authentication.
   * @protected
   */
  protected get redirectUri(): string {
    return `${window.location.origin}/authenticate/trakt`;
  }
}

/**
 * @see https://trakt.docs.apiary.io/#reference/users/watchlist/get-watchlist
 */
interface WatchlistItem {
  /** Item position on the list. */
  rank: number;
  /** Trakt ID */
  id: number;
  /** ISO Date. */
  listed_at: string;
  notes: string;
  type: "movie" | "show";
  movie?: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      slug: string;
      imdb: string;
      tmdb: number;
    };
  };
  show?: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      slug: string;
      imdb: string;
      tvdb: number;
      tmdb: number;
    };
  };
}

interface OAuthTokenResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

interface AccessTokenResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  refresh_token: string;
  scope: "public";
  created_at: number;
}

interface PersistedKeys {
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
}
