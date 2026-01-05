import { CallableRequest, HttpsError } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

/**
 * Detect if the function is running in an emulator environment.
 */
export function isEmulatorEnvironment(): boolean {
  return process.env.FUNCTIONS_EMULATOR === "true";
}

/**
 * Confirm that the request is authenticated. If not, throw an error.
 */
export function enforceAuthentication(request: CallableRequest): void {
  if (isEmulatorEnvironment()) {
    logger.info(
      "Emulator environment detected, skipping authentication enforcement",
    );
    return;
  }

  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "No user authenticated");
  }
}
