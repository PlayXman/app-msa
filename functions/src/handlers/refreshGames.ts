import { HttpsError, onCall } from "firebase-functions/https";
import { RefreshGamesRequest, RefreshGamesResponse } from "./types";
import { enforceAuthentication } from "../utils";
import * as logger from "firebase-functions/logger";
import {
  createIgdbClient,
  createImageUrl,
  resolveReleaseDate,
  SearchEndpointResponseData,
  standardGameFields,
} from "../services/igdb";

/**
 * Refresh games data from IGDB.
 */
export const refreshGames = onCall<
  RefreshGamesRequest,
  Promise<RefreshGamesResponse>
>(async (request) => {
  enforceAuthentication(request);

  const { igdbIds } = request.data || {};
  if (!igdbIds?.length) {
    throw new HttpsError("invalid-argument", "No IGDB IDs provided");
  }
  const igdbIdsString = igdbIds.join(",");
  logger.info(`Searching games by ID: ${igdbIdsString}`);

  logger.debug("Creating IGDB client");
  const igdnClient = await createIgdbClient();

  try {
    logger.debug("Sending 'search' request to IGDB");
    // @see https://api-docs.igdb.com/?javascript#game
    const { data } = await igdnClient
      .fields(standardGameFields)
      .where([`id = (${igdbIdsString})`])
      .limit(500) // https://api-docs.igdb.com/?javascript#pagination
      .request("/games");

    logger.debug("Returned results", { data });

    return {
      games: (data as SearchEndpointResponseData).map((game) => {
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
    logger.error("Failed to fetch games from IGDB", error);
    throw new HttpsError("internal", "Failed to fetch games from IGDB");
  }
});
