/**
 * IGDB API client and utilities.
 *
 * @see https://api-docs.igdb.com/
 */

import { HttpsError } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import igdb from "igdb-api-node";

/**
 * Load and validate env variables.
 */
function config() {
  const clientID = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;
  if (!clientID || !clientSecret) {
    throw new HttpsError(
      "failed-precondition",
      "IGDB client ID and secret must be set in environment variables",
    );
  }
  return { clientID, clientSecret };
}

/**
 * Fetch access tokens from IGDB.
 */
async function authenticateIgdb(): Promise<{
  access_token: string;
  expires_in: number;
  token_type: "bearer";
}> {
  const { clientID, clientSecret } = config();
  const authenticationUrl = new URL("https://id.twitch.tv/oauth2/token");
  authenticationUrl.searchParams.set("client_id", clientID);
  authenticationUrl.searchParams.set("client_secret", clientSecret);
  authenticationUrl.searchParams.set("grant_type", "client_credentials");

  try {
    const authResponse = await fetch(authenticationUrl, {
      method: "POST",
      signal: AbortSignal.timeout(5000),
    });

    return authResponse.json();
  } catch (error) {
    logger.error("Failed to authenticate with IGDB", error);
    throw new HttpsError("unauthenticated", "Failed to authenticate with IGDB");
  }
}

/**
 * Create and return an IGDB client instance.
 */
export async function createIgdbClient() {
  const { clientID } = config();
  const { access_token } = await authenticateIgdb();

  return igdb(clientID, access_token, {
    timeout: 5000,
  });
}

/**
 * Generate an IGDB image URL for the given image ID.
 *
 * @see https://api-docs.igdb.com/?javascript#images
 *
 * @returns The image URL or empty string if no image ID is provided.
 */
export function createImageUrl(imageId: string | undefined): string {
  if (!imageId) {
    return "";
  }

  return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;
}

interface ReleaseDate {
  date: number;
  y: number;
  date_format: number;
}

/**
 * Resolve and format the release date from IGDB game data.
 *
 * @see https://api-docs.igdb.com/?javascript#release-date
 */
export function resolveReleaseDate(releaseDates: Array<ReleaseDate>): string {
  const releaseDate = releaseDates.reduce<ReleaseDate | null>(
    (previousDate, currentDate) => {
      if (!previousDate) {
        return currentDate;
      }
      return previousDate.date > currentDate.date ? currentDate : previousDate;
    },
    null,
  );

  if (!releaseDate) {
    return "";
  }

  // @see https://api-docs.igdb.com/?javascript#date-format
  switch (releaseDate.date_format) {
    case 0: // YYYYMMDD
    case 1: // YYYYMM
      return new Date(releaseDate.date * 1000).toISOString();
    case 2: // YYYY
      return releaseDate.y.toString();
    case 3: // YYYYQ1
      return `${releaseDate.y}-Q1`;
    case 4: // YYYYQ2
      return `${releaseDate.y}-Q2`;
    case 5: // YYYYQ3
      return `${releaseDate.y}-Q3`;
    case 6: // YYYYQ4
      return `${releaseDate.y}-Q4`;
    case 7: // TBD
    default:
      return "";
  }
}

/**
 * Standard expected fields returned by `/games` endpoint. They are the bare minimum for constructing the `Game` object.
 *
 * @see Game
 */
export const standardGameFields = [
  "name",
  "slug",
  "cover.image_id",
  "release_dates.date",
  "release_dates.y",
  "release_dates.date_format",
];

/**
 * Returned data type from IGDB `/games` endpoint matching `standardGameFields` field set.
 *
 * @see standardGameFields
 * @see https://api-docs.igdb.com/?javascript#game
 */
export type SearchEndpointResponseData = Array<{
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
