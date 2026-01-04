import { HttpsError, onCall } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {
  createIgdbClient,
  createImageUrl,
  resolveReleaseDate,
} from "../services/igdb";
import { SearchGamesRequest, SearchGamesResponse } from "./types";
import { enforceAuthentication } from "../utils";

/**
 * Search games from IGDB by name.
 */
export const searchGames = onCall<
  SearchGamesRequest,
  Promise<SearchGamesResponse>
>(async (request) => {
  enforceAuthentication(request);

  const { query } = request.data || {};
  logger.info(`Searching games for query: ${query}`);

  logger.debug("Creating IGDB client");
  const igdnClient = await createIgdbClient();

  try {
    logger.debug("Sending search request to IGDB");
    // @see https://api-docs.igdb.com/?javascript#game
    type SearchResponseData = Array<{
      id: number;
      name: string;
      slug: string;
      cover?: {
        image_id: string;
      };
      release_dates?: Array<{
        date: number;
        y: number;
        date_format: number;
      }>;
    }>;

    const { data } = await igdnClient
      .fields([
        "name",
        "slug",
        "cover.image_id",
        "release_dates.date",
        "release_dates.y",
        "release_dates.date_format",
      ])
      .search(query)
      .where([
        "version_parent = null", // remove bundles
        "game_type = (0,1,2)", // 0: main game, 1: dlc, 2: expansion
      ])
      .limit(10)
      .request("/games");

    logger.debug("Returned results", { data });

    return {
      games: (data as SearchResponseData).map((game) => {
        return {
          igdbId: game.id,
          name: game.name,
          slug: game.slug,
          imageUrl: createImageUrl(game.cover?.image_id),
          releaseDate: resolveReleaseDate(game.release_dates || []),
        };
      }),
    };
  } catch (error) {
    logger.error("Failed to search games from IGDB", error);
    throw new HttpsError("internal", "Failed to search games from IGDB");
  }
});
