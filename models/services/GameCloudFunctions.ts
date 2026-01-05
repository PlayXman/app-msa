import { getFunctions, httpsCallable } from "firebase/functions";
import {
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
