"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CODE_PARAM, Trakt } from "@/models/services/Trakt";
import { useEffect } from "react";

export default function TraktAuthentication() {
  const code = useSearchParams().get(CODE_PARAM);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const trakt = new Trakt("movies");
      if (code) {
        await trakt.getRefreshToken(code);
        router.replace("/");
      } else {
        await trakt.getAuthenticationCode();
      }
    })();
  }, [code, router]);

  return null;
}
