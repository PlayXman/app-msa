/**
 * IGDB (Internet Game Database) data access object.
 *
 * @see https://api-docs.igdb.com/
 */

import { onCall } from "firebase-functions/https";

export const refreshGames = onCall<never, void>((request) => {});
