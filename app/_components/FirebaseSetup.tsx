"use client";

import { initializeApp } from "firebase/app";
import { config } from "@/models/utils/config";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { connectAuthEmulator, getAuth } from "firebase/auth";

initializeApp(config.firebase);

// Setup emulators if on the localhost.
if (process.env.NEXT_PUBLIC_EMULATORS === "true") {
  console.warn("Using Firebase emulators!");
  connectAuthEmulator(getAuth(), "http://127.0.0.1:9099", {
    disableWarnings: true,
  });
  connectDatabaseEmulator(getDatabase(), "127.0.0.1", 9000);
}

export default function FirebaseSetup() {
  return null;
}
