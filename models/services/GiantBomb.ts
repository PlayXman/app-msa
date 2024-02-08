import Game from "@/app/(media)/games/Game";
import { Vendors } from "@/models/Vendors";
import UrlHelpers from "@/models/utils/UrlHelpers";
import JsonpRequest from "@/models/JsonpRequest";

const API_URL = "https://www.giantbomb.com/api";
const VENDORS_DB_NAME = "giantBomb";
const REQUEST_FIELD_LIST =
  "name,id,image,original_release_date,expected_release_day,expected_release_month,expected_release_quarter,expected_release_year";

export default class GiantBomb {
  static apiKeyCache = "";

  /**
   * Search games by title.
   *
   * @see https://www.giantbomb.com/api/documentation/#toc-0-41
   *
   * @param title
   */
  async searchGames(title: string): Promise<Game[]> {
    const url = new URL(`${API_URL}/search`);
    url.searchParams.set("api_key", await this.getApiKey());
    url.searchParams.set("format", "jsonp");
    url.searchParams.set("query", UrlHelpers.encodeText(title));
    url.searchParams.set("field_list", REQUEST_FIELD_LIST);
    url.searchParams.set("resources", "game");

    const jsonp = new JsonpRequest<GiantBombResponse>(url);
    const response = await jsonp.fetch();

    if (response.status_code !== 1) {
      throw new Error("Failed to search games", {
        cause: response.error,
      });
    }

    return response.results.map((item) => {
      const game = new Game();
      this.populateGame(game, item);
      return game;
    });
  }

  /**
   * Populate game with info from GiantBomb API.
   * @param games
   */
  async fillGames(games: Game[]): Promise<void> {
    const url = new URL(`${API_URL}/games`);
    url.searchParams.set("api_key", await this.getApiKey());
    url.searchParams.set("format", "jsonp");
    url.searchParams.set("field_list", REQUEST_FIELD_LIST);
    url.searchParams.set("filter", `id:${games.map((g) => g.id).join("|")}`);

    const jsonp = new JsonpRequest<GiantBombResponse>(url);
    const response = await jsonp.fetch();

    if (response.status_code !== 1) {
      throw new Error("Failed to fetch info about game", {
        cause: response.error,
      });
    }

    for (const result of response.results) {
      const game = games.find((g) => g.id === result.id?.toString());

      if (game) {
        this.populateGame(game, result);
      }
    }
  }

  protected async getApiKey(): Promise<string> {
    if (!GiantBomb.apiKeyCache) {
      const vendors = new Vendors(VENDORS_DB_NAME);
      GiantBomb.apiKeyCache = (await vendors.get("key")) ?? "";
    }

    return GiantBomb.apiKeyCache;
  }

  protected populateGame(game: Game, item: GameResult) {
    game.id = item.id?.toString() ?? "";
    game.title = item.name ?? "";
    game.imageUrl = item.image?.small_url ?? "";
    game.releaseDate = this.formatDate(
      item.original_release_date,
      item.expected_release_year,
      item.expected_release_quarter,
      item.expected_release_month,
      item.expected_release_day,
    );
  }

  /**
   * Convert dates from GiantBomb API response to ISO date string.
   * @param originalReleaseDate
   * @param expectedReleaseYear
   * @param expectedReleaseQuarter
   * @param expectedReleaseMonth
   * @param expectedReleaseDay
   * @protected
   */
  protected formatDate(
    originalReleaseDate: string | undefined,
    expectedReleaseYear: string | undefined,
    expectedReleaseQuarter: string | undefined,
    expectedReleaseMonth: string | undefined,
    expectedReleaseDay: string | undefined,
  ): string {
    if (originalReleaseDate) {
      return originalReleaseDate;
    }

    const dateChunks: string[] = [];

    if (expectedReleaseYear) {
      dateChunks.push(expectedReleaseYear);
    }
    if (expectedReleaseMonth) {
      dateChunks.push(expectedReleaseMonth);

      if (expectedReleaseDay) {
        dateChunks.push(expectedReleaseDay);
      }
    } else if (expectedReleaseQuarter) {
      switch (expectedReleaseQuarter) {
        case "1":
          dateChunks.push("01");
          break;
        case "2":
          dateChunks.push("04");
          break;
        case "3":
          dateChunks.push("07");
          break;
        case "4":
          dateChunks.push("10");
          break;
        default:
      }
    }

    return dateChunks.join("-");
  }
}

interface GiantBombResponse {
  /**
   *    1:OK
   *  100:Invalid API Key
   *  101:Object Not Found
   *  102:Error in URL Format
   *  103:'jsonp' format requires a 'json_callback' argument
   *  104:Filter Error
   *  105:Subscriber only video is for subscribers only
   */
  status_code: 1 | 100 | 101 | 102 | 103 | 104 | 105;
  /** A text string representing the status_code.E.g. `"OK"` for status_code 1. */
  error: string;
  /** The number of total results matching the filter conditions specified. */
  number_of_total_results: number;
  /** The number of results on this page. */
  number_of_page_results: number;
  /** The value of the limit filter specified, or 100 if not specified. */
  limit: number;
  /** The value of the offset filter specified, or 0 if not specified. */
  offset: number;
  /** Zero or more items that match the filters specified. */
  results: GameResult[];
}

/**
 * @see https://www.giantbomb.com/api/documentation/#toc-0-16
 */
interface GameResult {
  /** List of aliases the game is known by. A \n (newline) separates each alias. */
  aliases?: string;
  /** URL pointing to the game detail resource. */
  api_detail_url?: string;
  /** Characters related to the game. */
  characters?: object[];
  /** Concepts related to the game. */
  concepts?: object[];
  /** Date the game was added to Giant Bomb. */
  date_added?: string;
  /** Date the game was last updated on Giant Bomb. */
  date_last_updated?: string;
  /** Brief summary of the game. */
  deck?: string;
  /** Description of the game. */
  description?: string;
  /** Companies who developed the game. */
  developers?: object[];
  /** Expected day of release. The month is represented numerically. Combine with 'expected_release_day', 'expected_release_month', 'expected_release_year' and 'expected_release_quarter' for Giant Bomb's best guess release date of the game. These fields will be empty if the 'original_release_date' field is set. */
  expected_release_day?: string;
  /** Expected month of release. The month is represented numerically. Combine with 'expected_release_day', 'expected_release_quarter' and 'expected_release_year' for Giant Bomb's best guess release date of the game. These fields will be empty if the 'original_release_date' field is set. */
  expected_release_month?: string;
  /** Expected quarter of release. The quarter is represented numerically, where 1 = Q1, 2 = Q2, 3 = Q3, and 4 = Q4. Combine with 'expected_release_day', 'expected_release_month' and 'expected_release_year' for Giant Bomb's best guess release date of the game. These fields will be empty if the 'original_release_date' field is set. */
  expected_release_quarter?: string;
  /** Expected year of release. Combine with 'expected_release_day', 'expected_release_month' and 'expected_release_quarter' for Giant Bomb's best guess release date of the game. These fields will be empty if the 'original_release_date' field is set. */
  expected_release_year?: string;
  /** Characters that first appeared in the game. */
  first_appearance_characters?: string[];
  /** Concepts that first appeared in the game. */
  first_appearance_concepts?: string[];
  /** Locations that first appeared in the game. */
  first_appearance_locations?: string[];
  /** Objects that first appeared in the game. */
  first_appearance_objects?: string[];
  /** People that were first credited in the game. */
  first_appearance_people?: string[];
  /** Franchises related to the game. */
  franchises?: object[];
  /** Genres that encompass the game. */
  genres?: object[];
  /** For use in single item api call for game. */
  guid?: string;
  /** Unique ID of the game. */
  id?: number;
  /** Main image of the game. */
  image?: {
    icon_url?: string;
    medium_url?: string;
    original_url?: string;
    screen_url?: string;
    screen_large_url?: string;
    small_url?: string;
    super_url?: string;
    thumb_url?: string;
    tiny_url?: string;
    /** Name of image tag for filerting images. */
    image_tag?: string;
  };
  /** List of images associated to the game. */
  images?: string[];
  /** List of image tags to filter the images endpoint. */
  image_tags?: object[];
  /** Characters killed in the game. */
  killed_characters?: object[];
  /** Locations related to the game. */
  locations?: object[];
  /** Name of the game. */
  name?: string;
  /** Number of user reviews of the game on Giant Bomb. */
  number_of_user_reviews?: number;
  /** Objects related to the game. */
  objects?: object[];
  /** Rating of the first release of the game. */
  original_game_rating?: object[];
  /** Date the game was first released. */
  original_release_date?: string;
  /** People who have worked with the game. */
  people?: object[];
  /** Platforms the game appeared in. */
  platforms?: object[];
  /** Companies who published the game. */
  publishers?: object[];
  /** Releases of the game. */
  releases?: object[];
  /** Game DLCs */
  dlcs?: object[];
  /** Staff reviews of the game. */
  reviews?: object[];
  /** Other games similar to the game. */
  similar_games?: object[];
  /** URL pointing to the game on Giant Bomb. */
  site_detail_url?: string;
  /** Themes that encompass the game. */
  themes?: object[];
  /** Videos associated to the game. */
  videos?: object[];
}
