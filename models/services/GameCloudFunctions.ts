import { getFunctions, httpsCallable } from "firebase/functions";
import {
  RefreshGamesRequest,
  RefreshGamesResponse,
  SearchGamesRequest,
  SearchGamesResponse,
} from "@/functions/src/handlers/types";
import Game from "@/app/(media)/games/Game";

export default class GameCloudFunctions {
  /**
   * Search games by title.
   *
   * @see @/functions/src/handlers/searchGames.ts
   *
   * @param title
   */
  async searchGames(title: string): Promise<Game[]> {
    const callable = httpsCallable<SearchGamesRequest, SearchGamesResponse>(
      getFunctions(),
      "searchGames",
      {
        timeout: 5000,
      },
    );
    const response = await callable({ query: title });

    return response.data.games.map((item) => {
      const game = new Game();
      this.populateGame(game, item);
      return game;
    });
  }

  /**
   * Fill game details from IGDB API.
   */
  async fillGames(games: Game[]): Promise<void> {
    const igdbIds = games.reduce<number[]>((result, game) => {
      if (game.vendorIds?.igdb != null) {
        result.push(game.vendorIds.igdb);
      }
      return result;
    }, []);
    const callable = httpsCallable<RefreshGamesRequest, RefreshGamesResponse>(
      getFunctions(),
      "refreshGames",
      {
        timeout: 5000,
      },
    );
    const response = await callable({ igdbIds });

    for (const nextData of response.data.games) {
      const game = games.find((g) => g.mainVendorId === nextData.igdbId);

      if (game != null) {
        this.populateGame(game, nextData);
      }
    }
  }

  protected populateGame(
    game: Game,
    item: SearchGamesResponse["games"][number],
  ): void {
    game.vendorIds = { igdb: item.igdbId ?? undefined };
    game.slug = item.slug;
    game.title = item.name;
    game.imageUrl = item.imageUrl;
    game.releaseDate = item.releaseDate;
  }
}
