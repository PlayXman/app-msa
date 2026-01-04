import { getFunctions, httpsCallable } from "firebase/functions";
import {
  SearchGamesRequest,
  SearchGamesResponse,
} from "@/functions/src/handlers/types";

/**
 * Search games in IGDB by name.
 * @param query Game name.
 */
export async function searchGames(query: string): Promise<SearchGamesResponse> {
  const callable = httpsCallable<SearchGamesRequest, SearchGamesResponse>(
    getFunctions(),
    "searchGames",
    {
      timeout: 5000,
    },
  );
  const response = await callable({ query });
  return response.data;
}
